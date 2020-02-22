const axios = require('axios').default;

const api = axios.create({
    baseURL: 'http://localhost:14000/v1/',
    timeout: 30000,
    responseType: 'json'
});

export class RequestFailedError extends Error { }

export function search(text, fields=[], offset=0, networks=[], time={}, group=0) {
    let params = {
        q: text
    }
    if (offset > 0) {
        params.o = offset
    }
    if (fields.length > 0) {
        params.f = fields.join(',')
    }
    if (networks.length > 0 && networks.length < 4) {
        params.n = networks.join(',')
    }
    if (group > 0) {
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


export function getContractProject(network, address) {
    return api.get(`/contract/${network}/${address}/project`)
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

export function getContractCode(network, address, level=0) {
    return api.get(`/contract/${network}/${address}/code?level=${level}`)
        .then((res) => {
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}


export function getContractMigration(network, address) {
    return api.get(`/contract/${network}/${address}/migration`)
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

export function getContractMempool(network, address) {
    return api.get(`/contract/${network}/${address}/mempool`)
        .then((res) => {
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function getDiff(sn, sa, dn, da) {
    return api.get(`/diff?sn=${sn}&sa=${sa}&dn=${dn}&da=${da}`)
        .then((res) => {
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function vote(sn, sa, dn, da, vote) {
    return api.post(`/vote`,{
        src: sa,
        src_network: sn,
        dest: da,
        dest_network: dn,
        vote: vote,
    })
        .then((res) => {
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function getProjects() {
    return api.get(`/projects`)
        .then((res) => {
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}
