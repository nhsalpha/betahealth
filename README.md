# Betahealth

[![Build Status](https://img.shields.io/travis/nhsuk/betahealth.svg?branch=develop&style=flat-square)](https://travis-ci.org/nhsuk/betahealth)
[![dependencies](https://img.shields.io/david/nhsuk/betahealth.svg?style=flat-square&label=dependencies)](https://david-dm.org/nhsuk/betahealth)
[![devDependencies](https://img.shields.io/david/dev/nhsuk/betahealth.svg?style=flat-square&label=devDependencies)](https://david-dm.org/nhsuk/betahealth?type=dev)

This application is a Node based application that runs on [beta.nhs.uk](http://beta.nhs.uk).


## Dependencies

* [Node.js v6](https://nodejs.org/en/)
* [NPM v4](https://github.com/npm/npm) (`npm install npm@4 -g`)

## Installation

1. Clone repository:

  ```
  git clone https://github.com/nhsuk/betahealth
  ```

2. Install node dependencies:

  ```
  npm install
  ```

3. Run the application

  ```
  npm start
  ```

### Environment variables

Environment variables are used to set application level settings for each
environment.

| Variable                       | Description                                                               | Default                  |
|:-------------------------------|:--------------------------------------------------------------------------|:-------------------------|
| `NODE_ENV`                     | node environment                                                          | development              |
| `PORT`                         | server port                                                               | 3000                     |
| `GOOGLE_ANALYTICS_TRACKING_ID` | Google Analytics property id                                              |                          |
| `WEBTRENDS_TRACKING_ID`        | [Webtrends](https://www.webtrends.com/) tracking id                       |                          |
| `HOTJAR_TRACKING_ID`           | [Hotjar](https://www.hotjar.com/) tracking id                             |                          |
| `FONT_CDN`                     | Base url where the font is served                                         | /                        |
| `STATIC_CDN`                   | Base url where all other assets are served                                |                          |
| `LOG_LEVEL`                    | Level of logging to user                                                  | warn                     |
| `WDIO_BASEURL`                 | base URL for webdriver to use for acceptance tests                        | http://localhost:${PORT} |
| `WDIO_SCREENSHOTPATH`          | path where webdriver screenshots are saved                                |                          |
| `WDIO_REPORTPATH`              | path where webdriverio test runner reports are saved                      |                          |
| `BROWSERSTACK_USERNAME`        | Browserstack username                                                     |                          |
| `BROWSERSTACK_ACCESS_KEY`      | Browserstack access key                                                   |                          |
| `TRAVIS_BUILD_NUMBER`          | The number of the current Travis build                                    |                          |
| `TRAVIS_JOB_NUMBER`            | The number of the current Travis job                                      |                          |
| `DISABLE_FEEDBACK`             | Whether to disable feedback. On by default. Set this to `true` to disable |                          |
| `FEEDBACK_API_BASEURL`         | Base feedback endpoint                                                    |                          |
| `FEEDBACK_API_KEY`             | Key for feedback API if needed                                            |                          |

## Development

### Development dependencies

* [Ruby](https://www.ruby-lang.org/en/)
* [Bundler](http://bundler.io/)

[scss-lint](https://github.com/brigade/scss-lint) is used for code linting
but adds the ruby dependency. Linting is run as part of the commit process
so scss-lint will need to be installed.

To install ruby dependencies:
```
bundle install
```

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
