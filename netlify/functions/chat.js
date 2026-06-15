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
        console.log("Status:", res.statusCode);
        console.log("Preview:", data.substring(0, 300));
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

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);
    const userMessage = body.messages[body.messages.length - 1].content;

    // Step 1: Embed the query
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

    console.log("Embed keys:", Object.keys(embedResponse));
    const queryVector = embedResponse.data[0].values;

    // Step 2: Query Pinecone index
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

    // Step 3: Build context
    let context = "";
    if (searchResponse.matches) {
      searchResponse.matches.forEach((match) => {
        context += `\n\n[${match.metadata.source} - Page ${match.metadata.page}]\n${match.metadata.text}`;
      });
    }

    // Step 4: Call Claude
    const systemWithContext = body.system + (context ? `\n\nRELEVANT MANUAL CONTENT:\n${context}` : "");

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
