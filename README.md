# Better Call Dev 2
[![Build Status](https://travis-ci.org/baking-bad/bcd.svg?branch=master)](https://travis-ci.org/baking-bad/bcd)
[![Docker Build Status](https://img.shields.io/docker/cloud/build/bakingbad/bcdhub-gui)](https://hub.docker.com/r/bakingbad/bcdhub-gui)
[![Made With: Vue.js](https://img.shields.io/badge/vue-2.6.10-green.svg?)](https://vuejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A successor of the Tezos contract explorer, now basing on its own indexer. Also known as BCD2, BCDHub.

## Installation
Requires Node.js 11.4+

```bash
git clone https://github.com/baking-bad/bcd.git
cd bcd
npm i
```

### Development mode
Requires https://github.com/baking-bad/bcdhub.git running on `localhost:14000`
```
npm run serve
```

### Staging mode
Connects to the public API instance `api.better-call.dev`
```
make
```

### Publications
* Evolution of the Better Call Dev explorer  
https://medium.com/coinmonks/bcd2-tezos-smart-contracts-hub-85f6102fc2f9
* An overview of the renewed Tezos contract explorer  
https://medium.com/coinmonks/better-call-dev-2-whats-new-587e94111a6e

#### Demo
* TezTalks Live #1  
https://www.youtube.com/watch?v=if_Vr46x3lk

## Sponsored by
[Tezos Foundation](https://tezos.foundation/)
