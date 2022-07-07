const axios = require('axios').default;

export class RequestFailedError extends Error { }

export class StatsAPI {
    constructor(endpoints) {
        this.api = {};
        Object.keys(endpoints).forEach(function (network) {
            this.api[network] = axios.create({
                baseURL: endpoints[network],
                timeout: 10000,
                responseType: 'json'
            });
        }, this);
    }

    getApi(network) {
      if (network in this.api) {
        return this.api[network];
      } else {
        throw new RequestFailedError(`Don't have an RPC endpoint for the "${network}"`);
      }
    }

    parseResponse(response) {
        if (response.status !== 200) {
            throw new RequestFailedError(response);
        }
        return response.data;
    }

    summary(network, table, method, args = {}) {
        return this.getApi(network).get(`/v1/summary/${table}/${method}`, {
            params: args
        }).then(this.parseResponse)
    }

    histogram(network, table, method, timeframe, args = {}) {
        return this.getApi(network).get(`/v1/histogram/${table}/${method}/${timeframe}`, {
            params: args
        }).then(this.parseResponse)
    }

    paidStorageDiffSize(network, timeframe, address = undefined, from = 0) {
        let params = {}
        if (address) {
            params['contract'] = address;
        }
        if (from) {
            params['from'] = from;
        }

        return this.getApi(network).get(`/v1/paid_storage_diff_size/${timeframe}`, {
            params: params
        }).then(this.parseResponse)
    }


    consumedGas(network, timeframe, address = undefined, from = 0) {
        let params = {}
        if (address) {
            params['contract'] = address;
        }
        if (from) {
            params['from'] = from;
        }

        return this.getApi(network).get(`/v1/consumed_gas/${timeframe}`, {
            params: params
        }).then(this.parseResponse)
    }

    burned(network, timeframe, address = undefined, from = 0) {
        let params = {}
        if (address) {
            params['contract'] = address;
        }
        if (from) {
            params['from'] = from;
        }

        return this.getApi(network).get(`/v1/burned/${timeframe}`, {
            params: params
        }).then(this.parseResponse)
    }
}