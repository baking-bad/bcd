const axios = require('axios').default;

export class RequestFailedError extends Error { }

export class StatsAPI {
    constructor(baseURL) {
        this.api = axios.create({
            baseURL: baseURL,
            timeout: 10000,
            responseType: 'json'
        });
    }

    summary(table, method, args = {}) {
        return this.api.get(`v1/summary/${table}/${method}`, {
            params: args
        })
            .then((res) => {
                if (res.status !== 200) {
                    throw new RequestFailedError(res);
                }
                return res.data;
            })
    }

    histogram(table, method, timeframe, args = {}) {
        return this.api.get(`v1/histogram/${table}/${method}/${timeframe}`, {
            params: args
        })
            .then((res) => {
                if (res.status !== 200) {
                    throw new RequestFailedError(res);
                }
                return res.data;
            })
    }

    paidStorageDiffSize(timeframe, address = undefined, from = 0) {
        let params = {}
        if (address) {
            params['contract'] = address;
        }
        if (from) {
            params['from'] = from;
        }

        return this.api.get(`v1/paid_storage_diff_size/${timeframe}`, {
            params: params
        })
            .then((res) => {
                if (res.status !== 200) {
                    throw new RequestFailedError(res);
                }
                return res.data;
            })
    }


    consumedGas(timeframe, address = undefined, from = 0) {
        let params = {}
        if (address) {
            params['contract'] = address;
        }
        if (from) {
            params['from'] = from;
        }

        return this.api.get(`v1/consumed_gas/${timeframe}`, {
            params: params
        })
            .then((res) => {
                if (res.status !== 200) {
                    throw new RequestFailedError(res);
                }
                return res.data;
            })
    }

    burned(timeframe, address = undefined, from = 0) {
        let params = {}
        if (address) {
            params['contract'] = address;
        }
        if (from) {
            params['from'] = from;
        }

        return this.api.get(`v1/burned/${timeframe}`, {
            params: params
        })
            .then((res) => {
                if (res.status !== 200) {
                    throw new RequestFailedError(res);
                }
                return res.data;
            })
    }
}