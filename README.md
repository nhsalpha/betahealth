# Betahealth

[![GitHub release](https://img.shields.io/github/release/nhsuk/betahealth.svg?style=flat-square)](https://github.com/nhsuk/betahealth)
[![Build Status](https://img.shields.io/travis/nhsuk/betahealth.svg?branch=develop&style=flat-square)](https://travis-ci.org/nhsuk/betahealth)
[![Gemnasium](https://img.shields.io/gemnasium/nhsuk/betahealth.svg?style=flat-square&label=gemnasium)](https://gemnasium.com/github.com/nhsuk/betahealth)
[![Test Coverage](https://img.shields.io/codeclimate/coverage/github/nhsuk/betahealth.svg?style=flat-square)](https://codeclimate.com/github/nhsuk/betahealth/coverage)
[![Code Climate](https://img.shields.io/codeclimate/github//nhsuk/betahealth.svg?style=flat-square)](https://codeclimate.com/github/nhsuk/betahealth)
[![Issue Count](https://img.shields.io/codeclimate/issues/github/nhsuk/betahealth.svg?style=flat-square)](https://codeclimate.com/github/nhsuk/betahealth)

This application is a Node based application that runs on [beta.nhs.uk](http://beta.nhs.uk).


## Dependencies

* [Node.js v6](https://nodejs.org/en/)
* [NPM v3](https://github.com/npm/npm)

## Installation

1. Clone repository:

  ```
  git clone https://github.com/nhsuk/betahealth
  ```

2. Install node dependencies:

  ```
  npm install
  ```

## Development

### Run development mode

You can run the server in develop mode. Develop mode auto restarts
the node server if you make any changes to it and if you connect to the server
using [http://localhost:3001](http://localhost:3001) this will use
[browser-sync](https://www.browsersync.io/) to automatically show
any changes instantly in the browser.

To run develop mode:

```
npm run develop
```

In addition you can build the code yourself using gulp:

```
gulp build
```

or lint the code for styleguide warnings and errors

```
npm run lint
```

If you want to update build related code and scripts then each task is a [gulp](http://gulpjs.com/) script located at '*gulp/tasks*'.

### Content Store

The project can run without a Content Store at the moment.

If you set `CONTENTSTORE_TYPE` to `file`, it will use the content contained in the [content](./tree/develop/content) folder.

If you do want to use a Content Store, manage the content via an admin area and access it via REST API, you'll have to
have a copy of the [NHS.UK Content Store](https://github.com/nhsuk/nhsuk-content-store) running on port `8000` and set
`CONTENTSTORE_TYPE` to `rest`.

#### .env file

`npm run develop` command pre-loads local ENV variables from `.env` file (ignored by Git) before running development server.
If you need to include local environment variables in development add them to `.env` file in the root of the app directory in the following format:

```
VARIABLE_NAME=value
```

There's an `.env.example` with pre-populated development data including urls to the Content Store.

To use that, copy the file:

```
cp .env.example .env
```

Grab the auth token from the Content Store Django admin [http://localhost:8000/django-admin/oauth2_provider/accesstoken/](http://localhost:8000/django-admin/oauth2_provider/accesstoken/) and add it to the `CONTENTSTORE_AUTH_TOKEN` var in your .env file.

### Fonts

The FS Me web font can only be used in a license permitted manor which means
they cannot be included in this repository as it is publicly accessible.

If you want to run the fonts in a development environment you will need to
include them in a directory that is ignored by git: `./assets/fonts/fsme/`.
The files in this directory should then be:

```
FSMeWeb-Bold.eot
FSMeWeb-Bold.woff
FSMeWeb-Heavy.eot
FSMeWeb-Heavy.woff
FSMeWeb-Light.eot
FSMeWeb-Light.woff
FSMeWeb-Regular.eot
FSMeWeb-Regular.woff
```

### Environment variables

Environment variables are used to set application level settings for each
environment.

| Variable                           | Description                                                                                                                            | Default                  |
|:-----------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------|:-------------------------|
| `NODE_ENV`                         | node environment                                                                                                                       | development              |
| `PORT`                             | server port                                                                                                                            | 3000                     |
| `GOOGLE_ANALYTICS_TRACKING_ID`     | Google Analytics property id                                                                                                           |                          |
| `SHOW_DEVELOPMENT_ROUTES`          | Will show development only routes in a production environment if `true` | false |
| `WEBTRENDS_TRACKING_ID`            | [Webtrends](https://www.webtrends.com/) tracking id                                                                                    |                          |
| `HOTJAR_TRACKING_ID`               | [Hotjar](https://www.hotjar.com/) tracking id                                                                                          |                          |
| `STATIC_CDN`                       | Base url where all other assets are served                                                                                             |                          |
| `LOG_LEVEL`                        | Level of logging to user                                                                                                               | warn                     |
| `WDIO_BASEURL`                     | base URL for webdriver to use for acceptance tests                                                                                     | http://localhost:${PORT} |
| `WDIO_SCREENSHOTPATH`              | path where webdriver screenshots are saved                                                                                             |                          |
| `WDIO_REPORTPATH`                  | path where webdriverio test runner reports are saved                                                                                   |                          |
| `BROWSERSTACK_USERNAME`            | Browserstack username                                                                                                                  |                          |
| `BROWSERSTACK_ACCESS_KEY`          | Browserstack access key                                                                                                                |                          |
| `TRAVIS_BUILD_NUMBER`              | The number of the current Travis build                                                                                                 |                          |
| `TRAVIS_JOB_NUMBER`                | The number of the current Travis job                                                                                                   |                          |
| `DISABLE_FEEDBACK`                 | Whether to disable feedback. On by default. Set this to `true` to disable                                                              |                          |
| `FEEDBACK_API_BASEURL`             | Base feedback endpoint                                                                                                                 |                          |
| `FEEDBACK_API_KEY`                 | Key for feedback API if needed                                                                                                         |                          |
| `FEEDBACK_TIMEOUT`                 | Timeout before the request to the API fails                                                                                            | 5000                     |
| `APPINSIGHTS_INSTRUMENTATIONKEY`   | Application insights instrumentation key                                                                                               |                          |
| `CONNECTINGTOSERVICES_BASEURL`     | Base URL for connecting to services application                                                                                        | /                        |
| `CONTENTSTORE_TYPE`                | Operational mode for content store. Accepted options: `rest`, `file` or `fallback` (which tries `rest` first and falls back to `file`) | file                     |
| `CONTENTSTORE_API_BASEURL`         | Base URL for the content store API, eg `http://hostname.com/api`. No trailing slash                                                    |                          |
| `CONTENTSTORE_AUTH_TOKEN`          | OAuth2 bearer token for authenticating with the API                                                                                    |                          |
| `CONTENTSTORE_TIMEOUT`             | Timeout before the request to the API fails                                                                                            | 5000                     |
| `CONTENTSTORE_IMAGE_BASEURL`       | Base url for the image endpoint, eg `http://hostname.com/images`. No trailing slash                                                    |                          |
| `CONTENTSTORE_IMAGE_SIGNATURE_KEY` | Key used to generate the signature for image paths from the content store                                                              |                          |
| `CONTENTSTORE_IMAGE_PROXY_PATH`    | The local path to use for the image proxy                                                                                              | /content-images          |
| `PREVIEW_SIGNATURE_KEY`            | Key used to generate the signature for preview  pages in content store                                                                 |                          |

### Testing

#### Unit tests

Unit tests are located in `./test/unit/`. They are run using the [mocha](https://mochajs.org/) framework.

To run unit tests:

```
npm run test:unit
```

#### Acceptance tests

Acceptance tests are located in `./test/acceptance/`. They are run using [webdriverio](http://webdriver.io/). Basic configuration for webdriverio is in `./test/acceptance/wdio.conf.js`. Other configurations exist for different environments.

To run the default configuration (run against Chrome, Firefox and Phantomjs):

```
npm run test:acceptance
```

To run headlessly (in Phantomjs) only:

```
npm run test:acceptance-headless
```

Tests can also be run in the cloud on [BrowserStack](https://www.browserstack.com/). If using the default [webdriver base url](./config/config.js) of `http://localhost:3000` then you will need to setup [local testing](https://www.browserstack.com/local-testing) for BrowserStack. If you want to test against a remote url, set the `WDIO_BASEURL` to the desired url.

To run tests on BrowserStack:

```
npm run test:acceptance-cloud
```

#### Test coverage

Unit test coverage can be run using [Istanbul](https://github.com/gotwarlost/istanbul).

To run test coverage:

```
npm run coverage
```

### Continuous integration

Acceptance tests, unit tests and code linting are all run on [Travis](https://travis-ci.org/).

Unit tests are run locally on Travis.

Acceptance tests are run on browserstack against a Heroku [review app](https://devcenter.heroku.com/articles/github-integration-review-apps) url. When each PR is created on Github a review app is created on Heroku. A [test script](./bin/run-acceptance-tests.sh) is then run on Travis which waits for the right commit to be deployed and runs the tests against this url.

**Note:** This setup is not ideal and currently doesn't allow for acceptance tests to be run on pushes to a specific branch, for example `develop` or `master`.

## Thanks

We'd like to thank [BrowserStack](https://www.browserstack.com/) for providing a sponsored plan for this project.
