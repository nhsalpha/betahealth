const path = require('path');

const port = process.env.PORT || 3000;
const screenshotPath = path.resolve(__dirname, '..', 'test', 'acceptance', 'report', 'screenshots');
const reportPath = path.resolve(__dirname, '..', 'test', 'acceptance', 'report');

module.exports = {
  root: path.normalize(`${__dirname}/..`),
  env: process.env.NODE_ENV || 'development',
  ci: process.env.CI,
  port,
  googleAnalyticsId: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
  webtrendsId: process.env.WEBTRENDS_TRACKING_ID,
  hotjarId: process.env.HOTJAR_TRACKING_ID,
  fontCdn: process.env.FONT_CDN || '/',
  staticCdn: process.env.STATIC_CDN,
  trustProtoHeader: typeof process.env.DYNO !== 'undefined',
  trustAzureHeader: typeof process.env.WEBSITE_SITE_NAME !== 'undefined',
  logLevel: process.env.LOG_LEVEL || 'warn',
  webdriver: {
    baseUrl: process.env.WDIO_BASEURL || `http://localhost:${port}`,
    screenshotPath: process.env.WDIO_SCREENSHOTPATH || screenshotPath,
    reportOutput: process.env.WDIO_REPORTPATH || reportPath,
  },
  browserstack: {
    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,
  },
  travis: {
    buildNum: process.env.TRAVIS_BUILD_NUMBER,
    jobNum: process.env.TRAVIS_JOB_NUMBER,
  },
  feedbackApi: {
    disabled: process.env.DISABLE_FEEDBACK || false,
    baseUrl: process.env.FEEDBACK_API_BASEURL,
    apiKey: process.env.FEEDBACK_API_KEY,
  },
  contentApi: {
    baseUrl: process.env.CONTENT_API_BASEURL,
  },
};
