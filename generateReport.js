// generateReport.js
const fs = require('fs');
const path = require('path');
const reporter = require('cucumber-html-reporter');

const jsonPath = path.resolve(__dirname, 'reports', 'cucumber_report.json');
const outDir   = path.resolve(__dirname, 'reports', 'cucumber-html');
const outFile  = path.join(outDir, 'index.html');

// Ensure dirs exist
if (!fs.existsSync(path.dirname(jsonPath))) {
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
}
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Validate JSON presence/shape
try {
  if (!fs.existsSync(jsonPath)) {
    console.warn('⚠️  reports/cucumber_report.json not found, skipping HTML report generation.');
    process.exit(0);
  }
  const raw = fs.readFileSync(jsonPath, 'utf8');
  JSON.parse(raw); // validate JSON
  console.log('🧪 Found and validated cucumber_report.json');
} catch (err) {
  console.warn('⚠️  Invalid or unreadable cucumber_report.json, skipping HTML generation:', err.message);
  process.exit(0);
}

// Generate HTML
reporter.generate({
  theme: 'bootstrap',
  jsonFile: jsonPath,     // ⬅️ single file (not jsonDir)
  output: outFile,
  reportSuiteAsScenarios: true,
  storeScreenshots: true,
  screenshotsDirectory: path.resolve('reports', 'screenshots'),
  launchReport: false,
  metadata: {
    'Test Environment': process.env.NODE_ENV || 'TEST',
    Browser: 'Chromium',
    Platform: process.platform,
    Executed: process.env.CI ? 'CI' : 'Local'
  }
});

console.log(`✅ Cucumber HTML generated at ${outFile}`);

// Optionally open only when running locally (not in CI)
(async () => {
  if (process.env.CI) return;
  try {
    const open = (await import('open')).default;
    if (fs.existsSync(outFile)) await open(outFile);
  } catch {
    /* no-op */
  }
})();
