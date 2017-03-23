const path = require('path');

const port = process.env.PORT || 3000;
const screenshotPath = path.resolve(__dirname, '..', 'test', 'acceptance', 'report', 'screenshots');
const reportPath = path.resolve(__dirname, '..', 'test', 'acceptance', 'report');

module.exports = {
  root: path.normalize(`${__dirname}/..`),
  env: process.env.NODE_ENV || 'development',
  ci: process.env.CI,
  port,
  showDevelopmentRoutes: process.env.SHOW_DEVELOPMENT_ROUTES || false,
  googleAnalyticsId: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
  webtrendsId: process.env.WEBTRENDS_TRACKING_ID,
  hotjarId: process.env.HOTJAR_TRACKING_ID,
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
    timeout: process.env.FEEDBACK_TIMEOUT || 5000,
    disabled: process.env.DISABLE_FEEDBACK || false,
    baseUrl: process.env.FEEDBACK_API_BASEURL,
    apiKey: process.env.FEEDBACK_API_KEY,
  },
  appInsightsKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY || 'muted',
  findersBaseUrl: process.env.CONNECTINGTOSERVICES_BASEURL || '/',
  contentStore: {
    type: process.env.CONTENTSTORE_TYPE || 'file',
    timeout: process.env.CONTENTSTORE_TIMEOUT || 5000,
    apiBaseUrl: process.env.CONTENTSTORE_API_BASEURL,
    authToken: process.env.CONTENTSTORE_AUTH_TOKEN,
    imageBaseUrl: process.env.CONTENTSTORE_IMAGE_BASEURL,
    imageSignatureKey: process.env.CONTENTSTORE_IMAGE_SIGNATURE_KEY,
    imageProxyPath: process.env.CONTENTSTORE_IMAGE_PROXY_PATH || '/content-images',
  },
};
