const axios = require('axios').default;

const api = axios.create({
    baseURL: 'http://127.0.0.1:14000/v1/',
    timeout: 10000,
    responseType: 'json'
});

export class RequestFailedError extends Error { }

export function search(text, fields=[], offset=0, networks=[], time={}) {
    let params = {
        q: text
    }
    if (offset > 0) {
        params.o = offset
    }
    if (fields.length > 0) {
        params.f = fields.join(',')
    }
    if (networks.length > 0) {
        params.n = networks.join(',')
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


export function getProject(address) {
    return api.get(`/project/${address}`)
        .then((res) => {
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function getContract(network, address) {
    return api.get(`/contract/${network}/${address}`)
        .then((res) => {
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function getContractOperations(network, address, offset = 0) {
    return api.get(`/contract/${network}/${address}/operations?offset=${offset}`)
        .then((res) => {
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function getContractCode(network, address) {
    return api.get(`/contract/${network}/${address}/code`)
        .then((res) => {
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function getRandomContract() {
    return api.get(`/pick_random`)
        .then((res) => {
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function getContractEntrypoints(network, address) {
    return api.get(`/contract/${network}/${address}/entrypoints`)
        .then((res) => {
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function getContractStorage(network, address) {
    return api.get(`/contract/${network}/${address}/storage`)
        .then((res) => {
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}