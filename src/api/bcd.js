const axios = require('axios').default;

import { getJwt } from '@/utils/auth.js'
import { getCancellable, postCancellable, cancelRequests } from '@/utils/cancellation.js';

export class RequestFailedError extends Error { }

export class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = "UnauthorizedError";
    }
}

export class BetterCallApi {
    constructor(baseURL) {
        this.api = axios.create({
            baseURL: baseURL,
            timeout: 30000,
            responseType: 'json'
        });
    }

    search(text, indices = [], offset = 0, networks = [], languages = [], time = {}, group = 0) {
        let params = {
            q: text
        }
        if (offset > 0) {
            params.o = offset
        }
        if (indices.length > 0) {
            params.i = indices.join(',')
        }
        if (networks.length > 0) {
            params.n = networks.join(',')
        }
        if (languages.length > 0) {
            params.l = languages.join(',')
        }
        if (group >= 0) {  // maybe remove group parameter?
            params.g = 1
        }
        params = Object.assign(params, time)
        return this.api.get(`/search`, {
            params: params
        })
            .then((res) => {
                if (res.status != 200) {
                    throw new RequestFailedError(res);
                }
                return res.data
            })
    }

    getContract(network, address) {
        return getCancellable(this.api, `/contract/${network}/${address}`, {})
            .then((res) => {
                if (!res) { return res; }
                if (res.status != 200) {
                    throw new RequestFailedError(res);
                }
                return res.data
            })
    }


    getSameContracts(network, address, offset = 0) {
        let params = {}
        if (offset > 0) params.offset = offset;
        return getCancellable(this.api, `/contract/${network}/${address}/same`, {
            params: params
        })
            .then((res) => {
                if (!res) { return res; }
                if (res.status != 200) {
                    throw new RequestFailedError(res);
                }
                return res.data
            })
    }

    getSimilarContracts(network, address) {
        return getCancellable(this.api, `/contract/${network}/${address}/similar`, {})
            .then((res) => {
                if (!res) { return res; }
                if (res.status != 200) {
                    throw new RequestFailedError(res);
                }
                return res.data
            })
    }

    getContractOperations(network, address, last_id = "", from = 0, to = 0, statuses = [], entrypoints = []) {
        let params = {}
        if (last_id != "") {
            params.last_id = last_id
        }
        if (from !== 0) {
            params.from = from
        }
        if (to !== 0) {
            params.to = to
        }
        if (statuses.length > 0 && statuses.length < 4) {
            params.status = statuses.join(',')
        }
        if (entrypoints.length > 0) {
            params.entrypoints = entrypoints.join(',')
        }

        return getCancellable(this.api, `/contract/${network}/${address}/operations`, {
            params: params,
        })
            .then((res) => {
                if (!res) { return res; }
                if (res.status != 200) {
                    throw new RequestFailedError(res);
                }
                return res.data
            })
    }

    getContractCode(network, address, protocol = "", level = 0) {
        let params = {}
        if (protocol !== "") {
            params.protocol = protocol;
        }
        if (level > 0) {
            params.level = level;
        }
        return getCancellable(this.api, `/contract/${network}/${address}/code`, {
            params: params
        })
            .then((res) => {
                if (res.status != 200) {
                    throw new RequestFailedError(res);
                }
                return res.data
            })
    }

    getContractMigrations(network, address) {
        return getCancellable(this.api, `/contract/${network}/${address}/migrations`, {})
            .then((res) => {
                if (!res) { return res; }
                if (res.status != 200) {
                    throw new RequestFailedError(res);
                }
                return res.data
            })
    }

    getContractEntrypoints(network, address) {
        return getCancellable(this.api, `/contract/${network}/${address}/entrypoints`, {})
            .then((res) => {
                if (!res) { return res; }
                if (res.status != 200) {
                    throw new RequestFailedError(res);
                }
                return res.data
            })
    }

    getContractEntrypointData(network, address, bin_path, data, format = '') {
        return postCancellable(this.api, `/contract/${network}/${address}/entrypoints/data`, {
            bin_path: bin_path,
            data: data,
            format: format
        })
            .then((res) => {
                if (!res) { return res; }
                if (res.status != 200) {
                    throw new RequestFailedError(res);
                }
                return res.data
            })
    }

    getContractStorage(network, address) {
        return getCancellable(this.api, `/contract/${network}/${address}/storage`, {})
            .then((res) => {
                if (!res) { return res; }
                if (res.status != 200) {
                    throw new RequestFailedError(res);
                }
                return res.data
            })
    }

    getContractStorageRaw(network, address) {
        return this.api.get(`/contract/${network}/${address}/raw_storage`)
            .then((res) => {
                if (res.status != 200) {
                    throw new RequestFailedError(res);
                }
                return res.data
            })
    }

    getContractStorageRich(network, address) {
        return this.api.get(`/contract/${network}/${address}/rich_storage`)
            .then((res) => {
                if (res.status != 200) {
                    throw new RequestFailedError(res);
                }
                return res.data
            })
    }

    getContractMempool(network, address) {
        return getCancellable(this.api, `/contract/${network}/${address}/mempool`, {})
            .then((res) => {
                if (!res) { return res; }
                if (res.status != 200) {
                    throw new RequestFailedError(res);
                }
                return res.data
            })
    }

    getContractRating(network, address) {
        return getCancellable(this.api, `/contract/${network}/${address}/rating`, {})
            .then((res) => {
                if (!res) { return res; }
                if (res.status != 200) {
                    throw new RequestFailedError(res);
                }
                return res.data
            })
    }

    getContractBigMap(network, address, ptr, q = '', offset = 0) {
        return getCancellable(this.api, `/contract/${network}/${address}/bigmap/${ptr}?q=${q}&offset=${offset}`, {})
            .then((res) => {
                if (!res) { return res; }
                if (res.status != 200) {
                    throw new RequestFailedError(res);
                }
                return res.data
            })
    }

    getContractBigMapByKeyHash(network, address, ptr, keyhash, offset = 0) {
        return getCancellable(this.api, `/contract/${network}/${address}/bigmap/${ptr}/${keyhash}?offset=${offset}`, {})
            .then((res) => {
                if (res.status != 200) {
                    throw new RequestFailedError(res);
                }
                return res.data
            })
    }

    getRandomContract() {
        cancelRequests();
        return getCancellable(this.api, `/pick_random`, {})
            .then((res) => {
                if (res.status != 200) {
                    throw new RequestFailedError(res);
                }
                return res.data
            })
    }

    getDiff(query) {
        return this.api.post(`/diff`, query)
            .then((res) => {
                if (res.status != 200) {
                    throw new RequestFailedError(res);
                }
                return res.data
            })
    }

    getProjects() {
        return getCancellable(this.api, `/projects`, {})
            .then((res) => {
                if (res.status != 200) {
                    throw new RequestFailedError(res);
                }
                return res.data
            })
    }

    getOPG(hash) {
        return getCancellable(this.api, `/opg/${hash}`, {})
            .then((res) => {
                if (res.status != 200) {
                    throw new RequestFailedError(res);
                }
                return res.data
            })
    }

    vote(sn, sa, dn, da, vote) {
        return this.api.post(`/profile/vote`, {
            src: sa,
            src_network: sn,
            dest: da,
            dest_network: dn,
            vote: vote,
        },
            {
                headers: {
                    'Authorization': getJwt()
                }
            })
            .then((res) => {
                return res.data
            })
            .catch((err) => {
                if (err.response !== undefined && err.response.status == 401) {
                    throw new UnauthorizedError(err);
                }
                throw err;
            })
    }
    
    getNextVoteTask() {
        return this.api.get(`/profile/vote/task`,
            {
                headers: {
                    'Authorization': getJwt()
                }
            })
            .then((res) => {
                return res.data
            })
            .catch((err) => {
                if (err.response !== undefined && err.response.status == 401) {
                    throw new UnauthorizedError(err);
                }
                throw err;
            })
    }

    getProfile() {
        return this.api.get(`/profile`,
            {
                headers: {
                    'Authorization': getJwt()
                }
            })
            .then((res) => {
                return res.data
            })
            .catch((err) => {
                if (err.response !== undefined && err.response.status == 401) {
                    throw new UnauthorizedError(err);
                }
                throw err;
            })
    }

    getProfileSubscriptions() {
        return this.api.get(`/profile/subscriptions`,
            {
                headers: {
                    'Authorization': getJwt()
                }
            })
            .then((res) => {
                return res.data
            })
            .catch((err) => {
                if (err.response !== undefined && err.response.status == 401) {
                    throw new UnauthorizedError(err);
                }
                throw err;
            })
    }

    addProfileSubscription(id, typ) {
        return this.api.post(`/profile/subscriptions`, {
            id: id,
            type: typ
        },
            {
                headers: {
                    'Authorization': getJwt()
                }
            })
            .then((res) => {
                return res.data
            })
            .catch((err) => {
                if (err.response !== undefined && err.response.status == 401) {
                    throw new UnauthorizedError(err);
                }
                throw err;
            })
    }

    removeProfileSubscription(id, typ) {
        return this.api.delete(`/profile/subscriptions`,
            {
                headers: {
                    'Authorization': getJwt()
                },
                data: {
                    id: id,
                    type: typ
                }
            })
            .then((res) => {
                return res.data
            })
            .catch((err) => {
                if (err.response !== undefined && err.response.status == 401) {
                    throw new UnauthorizedError(err);
                }
                throw err;
            })
    }

    getRecommendedSubscriptions() {
        return this.api.get(`/profile/subscriptions/recommended`,
            {
                headers: {
                    'Authorization': getJwt()
                }
            })
            .then((res) => {
                return res.data
            })
            .catch((err) => {
                if (err.response !== undefined && err.response.status == 401) {
                    throw new UnauthorizedError(err);
                }
                throw err;
            })
    }

    getProfileTimeline(offset = 0) {
        return this.api.get(`/profile/subscriptions/timeline`,
            {
                headers: {
                    'Authorization': getJwt()
                },
                params: {
                    offset: offset
                }
            })
            .then((res) => {
                return res.data
            })
            .catch((err) => {
                if (err.response !== undefined && err.response.status == 401) {
                    throw new UnauthorizedError(err);
                }
                throw err;
            })
    }

    getStats() {
        return getCancellable(this.api, `/stats`, {})
            .then((res) => {
                if (!res) { return res; }
                if (res.status != 200) {
                    throw new RequestFailedError(res);
                }
                return res.data
            })
    }
    
    getNetworkStats(network) {
        return getCancellable(this.api, `/stats/${network}`, {})
            .then((res) => {
                if (!res) { return res; }
                if (res.status != 200) {
                    throw new RequestFailedError(res);
                }
                return res.data
            })
    }
    
    getNetworkStatsSeries(network, index, period) {
        return getCancellable(this.api, `/stats/${network}/series?index=${index}&period=${period}`, {})
            .then((res) => {
                if (!res) { return res; }
                if (res.status != 200) {
                    throw new RequestFailedError(res);
                }
                return res.data
            })
    }

    getErrorLocation(operationId) {
        return getCancellable(this.api, `/operation/${operationId}/error_location`, {})
            .then((res) => {
                if (!res) { return res; }
                if (res.status != 200) {
                    throw new RequestFailedError(res);
                }
                return res.data
            })
    }
}