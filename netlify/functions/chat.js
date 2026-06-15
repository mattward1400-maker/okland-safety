const https = require("https");

function httpsPost(hostname, path, headers, body) {
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
      res.on("end", () => resolve(JSON.parse(data)));
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

    // Step 1: Search Pinecone for relevant chunks
    const embedResponse = await httpsPost(
      "api.pinecone.io",
      "/embed",
      { "Api-Key": process.env.PINECONE_API_KEY },
      {
        model: "llama-text-embed-v2",
        inputs: [{ text: userMessage }],
        parameters: { input_type: "query" }
      }
    );

    const queryVector = embedResponse.data[0].values;

    // Step 2: Query the index
    const indexHost = process.env.PINECONE_INDEX_HOST;
    const searchResponse = await httpsPost(
      indexHost,
      "/query",
      { "Api-Key": process.env.PINECONE_API_KEY },
      {
        vector: queryVector,
        topK: 5,
        includeMetadata: true
      }
    );

    // Step 3: Build context from results
    let context = "";
    if (searchResponse.matches) {
      searchResponse.matches.forEach((match) => {
        const source = match.metadata.source;
        const page = match.metadata.page;
        const text = match.metadata.text;
        context += `\n\n[${source} - Page ${page}]\n${text}`;
      });
    }

    // Step 4: Call Claude with context
    const systemWithContext = body.system + (context ? `\n\nRELEVANT MANUAL CONTENT FOR THIS QUESTION:\n${context}` : "");

    const postData = JSON.stringify({
      model: "claude-opus-4-5",
      max_tokens: 1500,
      system: systemWithContext,
      messages: body.messages
    });

    const data = await new Promise((resolve, reject) => {
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
      body: JSON.stringify(data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
