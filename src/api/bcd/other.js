import {cancelRequests, getCancellable, postCancellable} from "@/utils/cancellation";
import {MAX_SIZE, returnResponseData} from "@/api/bcd/helpers";
import {RequestFailedError} from "@/api/bcd/errors";
const axios = require('axios').default;

export class BetterCallApi_Other {
    constructor(baseURL) {
        this.api = axios.create({
            baseURL: baseURL,
            timeout: 30000,
            responseType: 'json'
        });
    }

    getConfig() {
        return getCancellable(this.api, `/config`, {}).then(returnResponseData);
    }

    search(text, indices = [], offset = 0, networks = [], time = {}, group = 0) {
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
        if (group >= 0) {  // maybe remove group parameter?
            params.g = 1
        }
        params = Object.assign(params, time)
        return this.api.get(`/search`, { params }).then(returnResponseData);
    }

    getHead() {
        return getCancellable(this.api, `/head`)
            .then(returnResponseData)
    }

    prepareToFork(data) {
        return postCancellable(this.api, `/fork`, data).then(returnResponseData);
    }

    getRandomContract(network) {
        cancelRequests();
        const request_url = network ? `/pick_random?network=${network}` : `/pick_random`;
        return getCancellable(this.api, request_url).then(returnResponseData);
    }

    getDiff(query) {
        return this.api.post(`/diff`, query).then(returnResponseData);
    }

    getProjects() {
        return getCancellable(this.api, `/projects`).then(returnResponseData);
    }

    getOPG(hash) {
        return getCancellable(this.api, `/opg/${hash}?with_mempool=true`).then(returnResponseData);
    }

    getErrorLocation(operationId) {
        return getCancellable(this.api, `/operation/${operationId}/error_location`).then(returnResponseData);
    }

    getContractBySlug(slug) {
        return getCancellable(this.api, `/slug/${slug}`).then(returnResponseData);
    }

    getDApps() {
        return getCancellable(this.api, `/dapps`).then(returnResponseData);
    }

    getDApp(slug) {
        return getCancellable(this.api, `/dapps/${slug}`).then(returnResponseData);
    }

    listDomains(network, offset = 0, size = MAX_SIZE) {
        let params = {}
        if (size > 0) {
            params['size'] = size;
        }
        if (offset > 0) {
            params['offset'] = offset;
        }
        return getCancellable(this.api, `/domains/${network}`, { params }).then(returnResponseData);
    }

    resolveDomain(network, address) {
        return getCancellable(this.api, `/domains/${network}/resolve?address=${address}`)
            .then((res) => {
                if (res.status === 204) {
                    return {}
                }
                if (res.status !== 200) {
                    throw new RequestFailedError(res);
                }
                return res.data
            });
    }
}
