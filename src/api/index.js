const axios = require('axios').default;

const api = axios.create({
    baseURL: `${process.env.VUE_APP_API_URL}/v1/`,
    timeout: 30000,
    responseType: 'json'
});

import { getCancellable, postCancellable, cancelRequests } from '@/api/cancellation.js';

export class RequestFailedError extends Error { }

export function getStats() {
    return getCancellable(api, `/stats`, {})
        .then((res) => {
            if (!res) { return res; }
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function getNetworkStats(network) {
    return getCancellable(api, `/stats/${network}`, {})
        .then((res) => {
            if (!res) { return res; }
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function getNetworkStatsSeries(network, index, period) {
    return getCancellable(api, `/stats/${network}/series?index=${index}&period=${period}`, {})
        .then((res) => {
            if (!res) { return res; }
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function search(text, indices = [], offset = 0, networks = [], languages = [], time = {}, group = 0) {
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
    return api.get(`/search`, {
        params: params
    })
        .then((res) => {
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function getContract(network, address) {
    return getCancellable(api, `/contract/${network}/${address}`, {})
        .then((res) => {
            if (!res) { return res; }
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}


export function getSameContracts(network, address, offset = 0) {
    let params = {}
    if (offset > 0) params.offset = offset;
    return getCancellable(api, `/contract/${network}/${address}/same`, {
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

export function getSimilarContracts(network, address) {
    return getCancellable(api, `/contract/${network}/${address}/similar`, {})
        .then((res) => {
            if (!res) { return res; }
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function getContractOperations(network, address, last_id = "", from = 0, to = 0, statuses = [], entrypoints = []) {
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

    return getCancellable(api, `/contract/${network}/${address}/operations`, {
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

export function getContractCode(network, address, protocol = "", level = 0) {
    let params = {}
    if (protocol !== "") {
        params.protocol = protocol;
    }
    if (level > 0) {
        params.level = level;
    }
    return getCancellable(api, `/contract/${network}/${address}/code`, {
        params: params
    })
        .then((res) => {
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function getContractMigrations(network, address) {
    return getCancellable(api, `/contract/${network}/${address}/migrations`, {})
        .then((res) => {
            if (!res) { return res; }
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function getContractEntrypoints(network, address) {
    return getCancellable(api, `/contract/${network}/${address}/entrypoints`, {})
        .then((res) => {
            if (!res) { return res; }
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function getContractEntrypointSchema(network, address, path) {
    return getCancellable(api, `/contract/${network}/${address}/entrypoints/schema?path=${path}`, {})
        .then((res) => {
            if (!res) { return res; }
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function getContractEntrypointData(network, address, path, data, format = '') {
    return postCancellable(api, `/contract/${network}/${address}/entrypoints/data`, {
        path: path,
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

export function getContractStorage(network, address) {
    return getCancellable(api, `/contract/${network}/${address}/storage`, {})
        .then((res) => {
            if (!res) { return res; }
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function getContractStorageRaw(network, address) {
    return api.get(`/contract/${network}/${address}/raw_storage`)
        .then((res) => {
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function getContractStorageRich(network, address) {
    return api.get(`/contract/${network}/${address}/rich_storage`)
        .then((res) => {
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function getContractMempool(network, address) {
    return getCancellable(api, `/contract/${network}/${address}/mempool`, {})
        .then((res) => {
            if (!res) { return res; }
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function getContractRating(network, address) {
    return getCancellable(api, `/contract/${network}/${address}/rating`, {})
        .then((res) => {
            if (!res) { return res; }
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function getContractBigMap(network, address, ptr, q = '', offset = 0) {
    return getCancellable(api, `/contract/${network}/${address}/bigmap/${ptr}?q=${q}&offset=${offset}`, {})
        .then((res) => {
            if (!res) { return res; }
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function getContractBigMapByKeyHash(network, address, ptr, keyhash, offset = 0) {
    return getCancellable(api, `/contract/${network}/${address}/bigmap/${ptr}/${keyhash}?offset=${offset}`, {})
        .then((res) => {
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function getRandomContract() {
    cancelRequests();
    return getCancellable(api, `/pick_random`, {})
        .then((res) => {
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function getDiff(query) {
    return api.post(`/diff`, query)
        .then((res) => {
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function getProjects() {
    return getCancellable(api, `/projects`, {})
        .then((res) => {
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function getOPG(hash) {
    return getCancellable(api, `/opg/${hash}`, {})
        .then((res) => {
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function getContractBySlug(slug) {
    return getCancellable(api, `/slug/${slug}`, {})
        .then((res) => {
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}