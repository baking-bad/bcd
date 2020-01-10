const axios = require('axios').default;

const api = axios.create({
    baseURL: 'http://127.0.0.1:14000/v1/',
    timeout: 10000,
    responseType: 'json'
});

export class RequestFailedError extends Error { }

export function search(text) {
    return api.get(`/search`, {
        params: {
            text: text
        }
    })
    .then((res) => {
        if (res.status != 200) {
            throw new RequestFailedError(res); 
        }
        return res.data
    })
}


export function getProject(address) {
    return api.get(`/project/mainnet/${address}`)
    .then((res) => {
        if (res.status != 200) {
            throw new RequestFailedError(res); 
        }
        return res.data
    })
}