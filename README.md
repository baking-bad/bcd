# Better Call Dev
[![Build Status](https://travis-ci.org/baking-bad/bcd.svg?branch=master)](https://travis-ci.org/baking-bad/bcd)
[![Docker Build Status](https://img.shields.io/docker/cloud/build/bakingbad/bcdhub-gui)](https://hub.docker.com/r/bakingbad/bcdhub-gui)
[![Made With: Vue.js](https://img.shields.io/badge/vue-2.6.10-green.svg?)](https://vuejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


BCD is:
* An ultimate developer & analytics tool
* Google for Tezos contracts 
* The frontend for https://github.com/baking-bad/bcdhub
* The successor of https://github.com/baking-bad/better-call-dev

## Versioning
BCD uses the same `X.Y.Z` scheme as BCDHub (see https://github.com/baking-bad/bcdhub#versioning)

## Configuration

### Build-time `.env.*` files

* `NODE_ENV` _production_ for production env, _development_ otherwise
* `BASE_URL` set to _https://better-call.dev/_ for production
* `VUE_APP_CONFIG_PATH` path to the runtime config file (stored in [public](https://github.com/baking-bad/bcd/tree/master/public))

### Runtime `config.json`
Reloaded each time you press F5 in the browser.

#### Required fields
* `API_URI` base URL for BCDHub API, e.g. _https://api.better-call.dev/v1/_
* `WS_URI` WebSocket endpoint, e.g. _wss://api.better-call.dev/v1/ws_
* `GA_ENABLED` enable Google Analytics
* `MEMPOOL_ENABLED` query mempool operations
* `HOME_PAGE` redirect to this page unless it's `home`

#### Sandbox environment
* `SANDBOX_MODE` activate single user mode
* `JUPYTER_PATH` base URL for Jupyter notebook server


## Docker image
BCD docker images are being built on [dockerhub](https://hub.docker.com/r/bakingbad/bcdhub-gui). Two types of tags are provided:

* `latest` should be considered experimental
* `X.Y` stable releases

### Local build
```bash
make image  # latest
```

## Release
Publishing a release is essentially tagging a commit.  
**IMPORTANT:** bump version in `package.json` for each stable candidate or hotfix.

#### Latest
Will not be published as a release on GitHub. Docker image will be built though.
```bash
make latest
```

#### Stable
Takes current version from the `package.json`. Publishes release file on GitHub and builds a docker image tagged `X.Y`
```bash
make release
```

## Deployment

#### Production `better-call.dev`
* Requires local _nginx_ setup, uses `/var/www/bcd` folder
* Uses `.env.production` and `config.production.json` configs
* Command: `make deploy`

#### Staging `ee.better-call.dev`

## Development

### Install
Requires Node.js 11.4+

```bash
git clone https://github.com/baking-bad/bcd.git
cd bcd
npm i
```

### Run

#### Local API `localhost:14000`
* Requires https://github.com/baking-bad/bcdhub.git running in _development_ mode
* Uses `.env.development` (frontend) and `config.development.yml` (backend) configs
* Command: `make dev`

#### Staging API `ee.better-call.dev`
* Connects to the public API instance
* Uses `.env.ee` (frontend) and `config.you.yml` (backend) configs
* Command: `make ee`


## Publications
* Evolution of the Better Call Dev explorer  
https://baking-bad.org/blog/2020/03/10/explorer-bcd2-tezos-smart-contracts-hub/
* An overview of the renewed Tezos contract explorer  
https://baking-bad.org/blog/2020/04/10/tezos-smart-contract-explorer-better-call-dev-what-is-new/
* Better Call Dev strikes again!  
https://baking-bad.org/blog/2020/06/10/better-call-dev-strikes-again/

## Contact us
* Telegram: https://t.me/baking_bad_chat
* Twitter: https://twitter.com/TezosBakingBad
* Slack: https://tezos-dev.slack.com/archives/CV5NX7F2L

## About
Project is supported by [Tezos Foundation](https://tezos.foundation/)
