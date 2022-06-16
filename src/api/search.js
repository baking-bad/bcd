const axios = require('axios').default;

export class RequestFailedError extends Error { }

export class SearchService {
    constructor(baseURL) {
        this.api = axios.create({
            baseURL: baseURL,
            timeout: 10000,
            responseType: 'json'
        });
    }

    suggest(text, size = 0, offset = 0) {
        let request = {
            query: text,
            size: size ? size : 10,
            offset: offset
        };
        return this.api.post(
            `/v1/search`, request

        ).then(this.parseResponse)
    }

    search(text, filters, size = 0, offset = 0) {
        let request = {
            query: text,
            size: size ? size : 10,
            offset: offset
        };
        if (filters) {
            request.filters = {
                search: filters
            };
        }
        return this.api.post(
            `/v1/search`, request

        ).then(this.parseResponse)
    }

    bigMapKeys(text, filters, size = 0, offset = 0) {
        return this.api.post(
            `/v1/search`,  {
                query: text,
                size: size ? size : 10,
                offset: offset,
                filters: {
                    big_maps: filters,
                }
            }

        ).then(this.parseResponse)
    }

    parseResponse(response) {
        if (response.status != 200) {
            throw new RequestFailedError(response);
        }
        return response.data;
    }


}