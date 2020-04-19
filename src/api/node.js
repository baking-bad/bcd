const axios = require('axios').default;

const api = axios.create({
    baseURL: process.env.VUE_APP_NODE_RPC,
    timeout: 30000,
    responseType: 'json'
});

export class RequestFailedError extends Error { }

export function getOperation(network, level, hash) {
    return api.get(`/${network}/chains/main/blocks/${level}/operations/3`)
    .then((res) => {
        if (res.status != 200) {
            throw new RequestFailedError(res);
        }
        let data = res.data

        for (let i = 0; i < data.length; i++) {
            if (data[i].hash == hash) return data[i];
        }
        throw new RequestFailedError(res);
    })
}

export function getBigMapValue(network, level, ptr, key_hash) {
    return api.get(`/${network}/chains/main/blocks/${level}/context/big_maps/${ptr}/${key_hash}`)
    .then((res) => {
        if (res.status != 200) {
            throw new RequestFailedError(res);
        }
        return res.data;
    })
}