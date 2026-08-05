const { getStore } = require("@netlify/blobs");

exports.handler = async function(event) {
  // Access gate: checked first, before touching Blobs at all. Uses a separate
  // code from the chatbot's ACCESS_CODE (set as ANALYTICS_ACCESS_CODE in
  // Netlify's environment variables) so you can share the analytics code with
  // a smaller group than the chatbot's own access code.
  const providedCode = event.headers["x-access-code"] || "";
  if (!providedCode || providedCode !== process.env.ANALYTICS_ACCESS_CODE) {
    return {
      statusCode: 401,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid or missing access code" })
    };
  }

  try {
    const store = getStore({
      name: "analytics",
      siteID: "4e55c5f7-9574-42d6-9f5d-cd52a1e6f6a5",
      token: process.env.NETLIFY_AUTH_TOKEN
    });
    const { blobs } = await store.list();
    // Fetch every logged question in parallel instead of one at a time.
    // With a sequential loop, load time grows linearly with how many
    // questions have ever been logged (129+ round trips = very slow, and
    // it only gets worse over time). Promise.all fires all the reads at
    // once so total time is roughly the slowest single read, not the sum
    // of all of them.
    const results = await Promise.all(
      blobs.map(async (blob) => {
        try {
          return await store.get(blob.key, { type: "json" });
        } catch (e) {
          return null;
        }
      })
    );
    const entries = results.filter(Boolean);
    entries.sort((a, b) => b.timestamp - a.timestamp);
    const totalQuestions = entries.length;
    const langCounts = { en: 0, es: 0 };
    const imageCount = entries.filter(e => e.hasImage).length;
    const dateCounts = {};
    entries.forEach(e => {
      langCounts[e.lang] = (langCounts[e.lang] || 0) + 1;
      dateCounts[e.date] = (dateCounts[e.date] || 0) + 1;
    });
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      body: JSON.stringify({
        totalQuestions,
        langCounts,
        imageCount,
        dateCounts,
        recentQuestions: entries.slice(0, 100)
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
