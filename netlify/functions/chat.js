const https = require("https");

exports.handler = async function(event) {
  console.log("Function called with method:", event.httpMethod);
  
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);
    console.log("API Key exists:", !!process.env.API_KEY);
    console.log("API Key length:", process.env.API_KEY ? process.env.API_KEY.length : 0);
    
    const postData = JSON.stringify({
      model: "claude-opus-4-5",
      max_tokens: 1500,
      system: body.system,
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
        console.log("Response status:", res.statusCode);
        res.on("data", (chunk) => responseData += chunk);
        res.on("end", () => {
          console.log("Response data:", responseData.substring(0, 200));
          resolve(JSON.parse(responseData));
        });
      });

      req.on("error", (e) => {
        console.log("Request error:", e.message);
        reject(e);
      });
      req.write(postData);
      req.end();
    });

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.log("Caught error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
