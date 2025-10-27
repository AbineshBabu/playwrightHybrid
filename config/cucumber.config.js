const { Before, BeforeAll, AfterAll, After, AfterStep, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium, request } = require('playwright');
const fs = require('fs');
const path = require('path');
const stripAnsi = require('strip-ansi').default;
const { testContext } = require('../tests/helper/testContext');
const { logger } = require('../utility/logger');

const videoDir = path.join(__dirname, '..', 'reports', 'videos');

// ⏱ default step timeout
setDefaultTimeout(60 * 1000);

// 🔧 env
const env = require(path.resolve(__dirname, 'env.config.js'));
const envName = (process.env.NODE_ENV || 'test').trim();
const config = env[envName];
if (!config) throw new Error(`No config found for environment "${envName}"`);

console.log('Resolved env :', envName);

/* ------------------------ BEFORE ALL ------------------------ */
BeforeAll(async function () {
  logger.info('preparing test suit');
});

/* -------------------- BEFORE EACH SCENARIO ------------------- */
Before(async function (scenario) {
  testContext.clear();
  logger.info(`Starting scenario: ${scenario.pickle.name}`);

  const tagNames = scenario.pickle.tags.map(t => t.name);

  // ---- API MODE ----
  if (tagNames.includes('@api')) {
    this.mode = 'api';
    logger.info('Running in API mode — browser will not start.');
    return;
  }

  // ---- UI MODE ----
  this.mode = 'ui';
  logger.info('Running in UI mode — launching browser now.');

  if (!global.browser) {
    global.browser = await chromium.launch({
      headless: false,
      slowMo: 500,
      args: ['--window-size=2560,1440'],
    });
  }

  fs.mkdirSync(videoDir, { recursive: true });

  global.context = await global.browser.newContext({
    viewport: null,
    baseURL: config.baseUrl,
    recordVideo: { dir: videoDir, size: { width: 1280, height: 720 } },
  });

  global.page = await global.context.newPage();
});

/* ------------------ AFTER EACH STEP (API lazy init) ------------------ */
AfterStep(async function () {
  try {
    if (this.mode !== 'api') return;

    const serviceName = testContext.get('serviceName');
    if (!serviceName) return;

    const currentService = testContext.get('currentService');
    if (global.apiContext && currentService === serviceName) return;

    const envNameLocal = (process.env.NODE_ENV || 'test').trim();
    const envConfig = env[envNameLocal];
    const baseURL = envConfig.services && envConfig.services[serviceName];
    if (!baseURL)
      throw new Error(`Unknown service "${serviceName}" for environment "${envNameLocal}"`);

    if (global.apiContext) {
      await global.apiContext.dispose();
      global.apiContext = null;
    }

    global.apiContext = await request.newContext({
      baseURL: baseURL,
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });

    testContext.set('currentService', serviceName);
    logger.info(`AfterStep initialized API context for service "${serviceName}" (${baseURL})`);
  } catch (err) {
    logger.error(`Error in AfterStep while initializing apiContext: ${err.message}`);
    throw err;
  }
});

/* ---------------------- AFTER EACH SCENARIO ---------------------- */
After(async function (scenario) {
  // ===== API MODE: attach error message only; no screenshots/videos =====
  if (this.mode === 'api') {

    const failed = scenario.result?.status === 'FAILED';
    if (failed && scenario.result?.message) {
      try {
        logger.info("summa " + scenario.result.message)
        // attach ONLY clean error text
        const clean = stripAnsi(scenario.result.message);
        await this.attach(clean, 'text/plain');
      } catch (err) {
        logger.warn(`Failed to attach the cleaned message: ${err.message}`)
      };
    }

    // dispose API context per scenario for isolation
    if (global.apiContext) {
      try { await global.apiContext.dispose(); } catch (_) { }
      global.apiContext = null;
      logger.info('API context closed.');
    }
    return;
  }

  // ===== UI MODE: screenshot + keep video ONLY on failure =====
  const failed = scenario.result?.status === 'FAILED';

  // grab video handle before closing
  const video = global.page?.video ? await global.page.video() : null;
  let rawVideoPath = null;
  if (video) {
    try { rawVideoPath = await video.path(); }
    catch (err) { logger.warn(`Could not read video path: ${err.message}`) }
  }

  // on failure: attach screenshot + error before closing
  if (failed && global.page) {
    try {
      const png = await global.page.screenshot({ fullPage: true });
      await this.attach(png, 'image/png');
    } catch (err) {
      logger.warn(`Failed to take screenshot: ${err.message}`);
    }
    if (scenario.result.message) {
      try {
        const clean = stripAnsi(scenario.result.message);
        const htmlError = `<pre style="color:red;white-space:pre-wrap">${clean}</pre>`;
        await this.attach(htmlError, 'text/html');
      } catch (err) {
        logger.warn(`Failed to attach the cleaned message: ${err.message}`);
      }
    }
  }

  // close page/context so video is finalized
  try { if (global.page) await global.page.close(); } catch (_) { }
  try { if (global.context) await global.context.close(); } catch (_) { }

  // keep/rename video on failure; delete on pass
  if (failed) {
    if (rawVideoPath && fs.existsSync(rawVideoPath)) {
      const scenarioName = scenario.pickle.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const newVideoPath = path.join(path.dirname(rawVideoPath), `${scenarioName}.webm`);
      try {
        fs.renameSync(rawVideoPath, newVideoPath);
        const relative = path.relative(path.join(__dirname, '..'), newVideoPath);
        await this.attach(`Video recorded: ${relative}`, 'text/plain');
      } catch {
        const relative = path.relative(path.join(__dirname, '..'), rawVideoPath);
        await this.attach(`Video recorded: ${relative}`, 'text/plain');
      }
    }
  } else if (rawVideoPath && fs.existsSync(rawVideoPath)) {
    try { fs.unlinkSync(rawVideoPath); } catch (_) { }
    try {
      const dir = path.dirname(rawVideoPath);
      if (dir && fs.existsSync(dir) && fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
    } catch (_) { }
  }
});

/* --------------------------- AFTER ALL --------------------------- */
AfterAll(async function () {
  try {
    if (global.browser) {
      await global.browser.close();
      logger.info('Browser closed.');
    }
    if (global.apiContext) {
      await global.apiContext.dispose();
      global.apiContext = null;
      logger.info('API context closed.');
    }
  } catch (error) {
    logger.error(`Error during AfterAll cleanup: ${error.message}`);
    throw error;
  }
});
