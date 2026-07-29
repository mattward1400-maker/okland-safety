const https = require("https");
const { getStore } = require("@netlify/blobs");

function httpsGet(hostname, path) {
  return new Promise((resolve, reject) => {
    const options = { hostname, path, method: "GET" };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(new Error("Parse failed: " + data.substring(0, 100))); }
      });
    });
    req.on("error", reject);
    req.end();
  });
}

function httpsRequest(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(body);
    const options = {
      hostname, path, method: "POST",
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
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(new Error("Parse failed: " + data.substring(0, 100))); }
      });
    });
    req.on("error", reject);
    req.write(postData);
    req.end();
  });
}

function isWeatherQuestion(text) {
  const keywords = ["wind", "weather", "mph", "storm", "rain", "lightning", "temperature", "heat", "cold", "freeze", "snow", "conditions", "outside", "outdoor", "crane today", "work today", "safe to work", "roof today", "scaffold today"];
  return keywords.some(k => text.toLowerCase().includes(k));
}

// Appended to every system prompt, regardless of what app.jsx sends or what RAG
// pulls back from the manuals. This is the one place every request passes through,
// so this rule guarantees consistent link formatting no matter the permit or source.
const LINK_FORMATTING_RULE = "\n\nCRITICAL LINK FORMATTING RULE: Whenever your response references a permit, form, document, manual, or webpage that has a URL — whether that URL comes from your system instructions, from the RELEVANT MANUAL CONTENT retrieved below, or anywhere else — you must ALWAYS format it as a markdown link using the pattern [Descriptive Name](URL). NEVER output a bare or raw URL as plain text under any circumstance. This applies to every single link in your response, with no exceptions, including links found inside retrieved manual excerpts that may themselves be written as plain text.";

async function logQuestion(question, lang, hasImage) {
  try {
    const store = getStore({
      name: "analytics",
      siteID: "4e55c5f7-9574-42d6-9f5d-cd52a1e6f6a5",
      token: process.env.NETLIFY_AUTH_TOKEN
    });
    const today = new Date().toISOString().split("T")[0];
    const key = "log-" + Date.now() + "-" + Math.random().toString(36).substring(2, 8);
    await store.setJSON(key, {
      question: question.substring(0, 300),
      lang: lang || "en",
      hasImage: !!hasImage,
      date: today,
      timestamp: Date.now()
    });
  } catch(e) {
    console.log("Logging failed:", e.message);
  }
}

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);
    const lastMessage = body.messages[body.messages.length - 1];
    const userMessage = typeof lastMessage.content === "string"
      ? lastMessage.content
      : (lastMessage.content.find(c => c.type === "text")?.text || "");
    const lat = body.lat;
    const lon = body.lon;
    const hasImage = typeof lastMessage.content !== "string";
    const lang = body.system && body.system.includes("INSTRUCCIÓN IMPORTANTE") ? "es" : "en";

    logQuestion(userMessage, lang, hasImage);

    let weatherContext = "";
    if (lat && lon && isWeatherQuestion(userMessage)) {
      try {
        const weather = await httpsGet(
          "api.openweathermap.org",
          "/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + process.env.OPENWEATHER_API_KEY + "&units=imperial"
        );
        const windSpeed = Math.round(weather.wind?.speed || 0);
        const windGust = weather.wind?.gust ? Math.round(weather.wind.gust) : null;
        const temp = Math.round(weather.main?.temp || 0);
        const description = weather.weather?.[0]?.description || "unknown";
        const city = weather.name || "your location";
        const humidity = weather.main?.humidity || 0;
        weatherContext = "\n\nCURRENT WEATHER AT JOBSITE (" + city + "):\n- Conditions: " + description + "\n- Temperature: " + temp + "F\n- Wind Speed: " + windSpeed + " MPH" + (windGust ? " (gusts to " + windGust + " MPH)" : "") + "\n- Humidity: " + humidity + "%\n\nUse this live weather data to give a specific, actionable answer based on Okland wind and weather protocols.";
      } catch(e) {
        console.log("Weather failed:", e.message);
      }
    }

    let ragContext = "";
    if (!hasImage) {
      try {
        const embedResponse = await httpsRequest(
          "api.pinecone.io",
          "/embed",
          { "Api-Key": process.env.PINECONE_API_KEY, "X-Pinecone-Api-Version": "2025-10" },
          {
            model: "llama-text-embed-v2",
            inputs: [{ text: userMessage || "safety" }],
            parameters: { input_type: "query", truncate: "END" }
          }
        );
        const queryVector = embedResponse.data[0].values;
        const searchResponse = await httpsRequest(
          process.env.PINECONE_INDEX_HOST,
          "/query",
          { "Api-Key": process.env.PINECONE_API_KEY, "X-Pinecone-Api-Version": "2025-10" },
          { vector: queryVector, topK: 3, includeMetadata: true }
        );
        if (searchResponse.matches) {
          searchResponse.matches.forEach(function(match) {
            ragContext += "\n\n[" + match.metadata.source + " - Page " + match.metadata.page + "]\n" + match.metadata.text;
          });
        }
      } catch(e) {
        console.log("RAG failed:", e.message);
      }
    }

    // Static block (permit/manual system prompt + link rule) is byte-identical across
    // requests for a given language, so it's marked as a cache breakpoint. Anthropic
    // caches everything up to and including this block; on repeat hits within the
    // cache window it's billed at 10% of normal input price instead of full price.
    //
    // ttl: "1h" extends that window from the 5-minute default to 1 hour. Since real
    // usage here is spread out (roughly one question per 30 min per worker), the
    // default 5-minute window was expiring between almost every question, meaning
    // nearly every request paid the full cache-write price instead of the 90%-off
    // cache-read price. The 1-hour write costs a bit more (2x base rate vs 1.25x),
    // but any question — from anyone, on any device — within that hour reuses the
    // same cache and pays the discounted rate. No beta header is required for this.
    //
    // Weather + RAG results change every request, so they stay in a separate,
    // uncached block after the breakpoint.
    const dynamicContext = weatherContext + (ragContext ? "\n\nRELEVANT MANUAL CONTENT:\n" + ragContext : "");

    const postData = JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: 1024,
      thinking: { type: "disabled" },
      system: [
        {
          type: "text",
          text: body.system + LINK_FORMATTING_RULE,
          cache_control: { type: "ephemeral", ttl: "1h" }
        },
        {
          type: "text",
          text: dynamicContext || "(no additional live context for this request)"
        }
      ],
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

    if (claudeData.usage) {
      const u = claudeData.usage;
      console.log(
        "CACHE STATS -- read:", u.cache_read_input_tokens || 0,
        "| write:", u.cache_creation_input_tokens || 0,
        "| fresh:", u.input_tokens || 0,
        "| output:", u.output_tokens || 0
      );
    }

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
