// --- inline cleaner start ---
const fs = require('fs');
const path = require('path');

const reportPath = path.resolve(__dirname, 'reports', 'cucumber_report.json');

try {
  // Ensure reports folder exists so later steps don't fail
  const reportsDir = path.dirname(reportPath);
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

  if (fs.existsSync(reportPath)) {
    const raw = fs.readFileSync(reportPath, 'utf8');
    if (raw.trim().length === 0) {
      console.warn('⚠️ cucumber_report.json is empty — deleting...');
      fs.unlinkSync(reportPath);
      // optional: recreate valid empty JSON for reporter compatibility
      // fs.writeFileSync(reportPath, '[]');
    } else {
      JSON.parse(raw); // validate
      console.log('🧹 cucumber_report.json validated.');
    }
  } else {
    console.warn('⚠️ cucumber_report.json not found, skipping cleanup.');
  }
} catch (err) {
  console.error('❌ Error cleaning cucumber_report.json:', err.message);
}
// --- inline cleaner end ---

const reporter = require('cucumber-html-reporter');

const reportHtmlPath = path.resolve(__dirname, 'reports', 'cucumber_report.html');

const options = {
  theme: 'bootstrap',
  jsonFile: 'reports/cucumber_report.json',
  output: reportHtmlPath,
  screenshotsDirectory: 'reports/screenshots',
  storeScreenshots: true,
  reportSuiteAsScenarios: true,
  metadata: {
    "Test Environment": process.env.NODE_ENV || "TEST",
    "Browser": "Chromium",
    "Platform": process.platform,
    "Executed": "Local"
  }
};

reporter.generate(options);

// Open the report in default browser
(async () => {
  try {
    const open = (await import('open')).default;
    if (fs.existsSync(reportHtmlPath)) {
      await open(reportHtmlPath);
    }
  } catch (err) {
    console.error('❌ Failed to open report:', err.message);
  }
})();
