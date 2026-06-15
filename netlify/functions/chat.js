const https = require("https");

function httpsRequest(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(body);
    const options = {
      hostname,
      path,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
        ...headers
      }
    };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch(e) {
          reject(new Error("JSON parse failed: " + data.substring(0, 200)));
        }
      });
    });
    req.on("error", reject);
    req.write(postData);
    req.end();
  });
}

function httpsGet(hostname, path) {
  return new Promise((resolve, reject) => {
    const options = { hostname, path, method: "GET" };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch(e) {
          reject(new Error("JSON parse failed: " + data.substring(0, 200)));
        }
      });
    });
    req.on("error", reject);
    req.end();
  });
}

function isWeatherQuestion(text) {
  const keywords = ["wind", "weather", "mph", "storm", "rain", "lightning", "temperature", "heat", "cold", "freeze", "snow", "conditions", "outside", "outdoor", "crane today", "work today", "safe to work", "roof today", "scaffold today"];
  const t = text.toLowerCase();
  return keywords.some(k => t.includes(k));
}

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);
    const userMessage = body.messages[body.messages.length - 1].content;
    const lat = body.lat;
    const lon = body.lon;

    // Step 1: Get weather if location provided and question is weather-related
    let weatherContext = "";
    if (lat && lon && isWeatherQuestion(userMessage)) {
      try {
        const weather = await httpsGet(
          "api.openweathermap.org",
          `/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=imperial`
        );
        const windSpeed = Math.round(weather.wind?.speed || 0);
        const windGust = weather.wind?.gust ? Math.round(weather.wind.gust) : null;
        const temp = Math.round(weather.main?.temp || 0);
        const description = weather.weather?.[0]?.description || "unknown";
        const city = weather.name || "your location";
        const humidity = weather.main?.humidity || 0;

        weatherContext = `\n\nCURRENT WEATHER AT JOBSITE (${city}):
- Conditions: ${description}
- Temperature: ${temp}°F
- Wind Speed: ${windSpeed} MPH${windGust ? ` (gusts to ${windGust} MPH)` : ""}
- Humidity: ${humidity}%

Use this live weather data to give a specific, actionable answer based on Okland's wind and weather protocols.`;
      } catch(e) {
        console.log("Weather fetch failed:", e.message);
      }
    }

    // Step 2: Embed the query for RAG
    const embedResponse = await httpsRequest(
      "api.pinecone.io",
      "/embed",
      {
        "Api-Key": process.env.PINECONE_API_KEY,
        "X-Pinecone-Api-Version": "2025-10"
      },
      {
        model: "llama-text-embed-v2",
        inputs: [{ text: userMessage }],
        parameters: { input_type: "query", truncate: "END" }
      }
    );

    const queryVector = embedResponse.data[0].values;

    // Step 3: Query Pinecone
    const indexHost = process.env.PINECONE_INDEX_HOST;
    const searchResponse = await httpsRequest(
      indexHost,
      "/query",
      {
        "Api-Key": process.env.PINECONE_API_KEY,
        "X-Pinecone-Api-Version": "2025-10"
      },
      {
        vector: queryVector,
        topK: 5,
        includeMetadata: true
      }
    );

    // Step 4: Build context
    let ragContext = "";
    if (searchResponse.matches) {
      searchResponse.matches.forEach((match) => {
        ragContext += `\n\n[${match.metadata.source} - Page ${match.metadata.page}]\n${match.metadata.text}`;
      });
    }

    // Step 5: Call Claude with all context
    const systemWithContext = body.system + weatherContext + (ragContext ? `\n\nRELEVANT MANUAL CONTENT:\n${ragContext}` : "");

    const postData = JSON.stringify({
      model: "claude-opus-4-5",
      max_tokens: 1500,
      system: systemWithContext,
      messages: body.messages
    });

    const claudeData = await new Promise((resolve, reject) => {
      const options = {
        hostname: "api.anthropic.com",
        path: "/v1/messages",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_KEY,
          "anthropic-version": "2023-06-01",
          "Content-Length": Buffer.byteLength(postData)
        }
      };
      const req = https.request(options, (res) => {
        let responseData = "";
        res.on("data", (chunk) => responseData += chunk);
        res.on("end", () => resolve(JSON.parse(responseData)));
      });
      req.on("error", reject);
      req.write(postData);
      req.end();
    });

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(claudeData)
    };

  } catch (error) {
    console.log("Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
