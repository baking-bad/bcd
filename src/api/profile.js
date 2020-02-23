const axios = require('axios').default;

import { getJwt } from "@/utils/auth.js";

const api = axios.create({
    baseURL: 'http://localhost:14000/v1/profile',
    timeout: 30000,
    responseType: 'json'
});

export class RequestFailedError extends Error { }

export function getProfile() {
    return api.get(``,
        {
            headers: {
                'Authorization': getJwt()
            }
        })
        .then((res) => {
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function getProfileSubscriptions() {
    return api.get(`/subscriptions`,
        {
            headers: {
                'Authorization': getJwt()
            }
        })
        .then((res) => {
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function addProfileSubscription(id, typ) {
    return api.post(`/subscriptions`, {
            id: id,
            type: typ
        },
        {
            headers: {
                'Authorization': getJwt()
            }
        })
        .then((res) => {
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}

export function removeProfileSubscription(id, typ) {
    return api.delete(`/subscriptions`,
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
            if (res.status != 200) {
                throw new RequestFailedError(res);
            }
            return res.data
        })
}
