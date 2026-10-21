import http from "node:http";

const TARGET_PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${TARGET_PORT}`;

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, { headers: { "Connection": "close" } }, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Expected HTTP 200, got ${res.statusCode}`));
      }
      let data = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => resolve(data));
    });
    req.on("error", reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error("Request timed out after 10s"));
    });
  });
}

async function runSmokeTests() {
  console.log(`[smoke-test] Probing ${BASE_URL}...`);
  const html = await fetchHtml(BASE_URL);
  console.log(`[smoke-test] Received HTML (${(html.length / 1024).toFixed(1)} KB)`);

  const requiredTokens = [
    { name: "Protected Figma Hero Headline", pattern: "AI that runs the work behind your business" },
    { name: "Editorial Statement", pattern: "Building the systems behind modern businesses" },
    { name: "AI Ecosystem Carousel", pattern: "AI, built around your business" },
    { name: "Argus Intelligence Layer", pattern: "Connected intelligence across your existing tools" },
    { name: "Interactive Playground", pattern: "Play with the geometry of PropheC" },
    { name: "Light Google Labs Footer", pattern: "Build smarter. Operate better. Scale further" },
    { name: "Light Logo Variant", pattern: "prophec-logo-dark.png" },
    { name: "Dark Logo Variant", pattern: "prophec-logo.png" },
  ];

  for (const token of requiredTokens) {
    if (!html.includes(token.pattern)) {
      throw new Error(`Missing expected content: "${token.name}" (pattern: "${token.pattern}")`);
    }
    console.log(`  ✓ ${token.name}`);
  }

  const prohibitedTokens = [
    { name: "Transformational Impact Block", pattern: "TRANSFORMATIONAL IMPACT" },
    { name: "The Automation Gap Block", pattern: "THE AUTOMATION GAP" },
    { name: "Automation Gap Headline", pattern: "Where traditional business systems break down" },
  ];

  for (const token of prohibitedTokens) {
    if (html.includes(token.pattern)) {
      throw new Error(`Prohibited content block still present: "${token.name}" (pattern: "${token.pattern}")`);
    }
    console.log(`  ✓ Verified absence of: ${token.name}`);
  }

  console.log("[smoke-test] All smoke assertions PASSED successfully.");
}

runSmokeTests().catch((err) => {
  console.error("[smoke-test] FAILED:", err.message);
  process.exitCode = 1;
});
