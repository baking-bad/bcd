const axios = require('axios').default;

import { getJwt } from "@/utils/auth.js";

const api = axios.create({
    baseURL: 'http://localhost:14000/v1/profile',
    timeout: 30000,
    responseType: 'json'
});

export class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = "UnauthorizedError";
    }
}

export function getProfile() {
    return api.get(``,
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

export function getProfileSubscriptions() {
    return api.get(`/subscriptions`,
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
            return res.data
        })
        .catch((err) => {
            if (err.response !== undefined && err.response.status == 401) {
                throw new UnauthorizedError(err);
            }
            throw err;
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
            return res.data
        })
        .catch((err) => {
            if (err.response !== undefined && err.response.status == 401) {
                throw new UnauthorizedError(err);
            }
            throw err;
        })
}

export function getRecommendedSubscriptions() {
    return api.get(`/subscriptions/recommended`,
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
