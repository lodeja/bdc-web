const chromeFlags = "--no-sandbox --disable-dev-shm-usage --headless=new";

/** @type {import('@lhci/cli').LhciConfig} */
module.exports = {
  ci: {
    collect: {
      url: ["http://127.0.0.1:4173/"],
      startServerCommand: "node scripts/static-server.mjs",
      startServerReadyPattern: "gzip static",
      numberOfRuns: 1,
      settings: {
        preset: "desktop",
        chromeFlags,
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.9 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 2500 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: ".lighthouseci/desktop",
    },
  },
};
