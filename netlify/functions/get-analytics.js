const { getStore } = require("@netlify/blobs");

exports.handler = async function(event) {
  try {
    const store = getStore({
      name: "analytics",
      siteID: "4e55c5f7-9574-42d6-9f5d-cd52a1e6f6a5",
      token: process.env.NETLIFY_AUTH_TOKEN
    });
    const { blobs } = await store.list();

    const entries = [];
    for (const blob of blobs) {
      try {
        const data = await store.get(blob.key, { type: "json" });
        if (data) entries.push(data);
      } catch(e) {}
    }

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
