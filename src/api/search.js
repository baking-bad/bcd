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

    operations(text, filters, size = 0, offset = 0) {
        return this.api.post(
            `/v1/search`,  {
                query: text,
                size: size ? size : 10,
                offset: offset,
                filters: {
                    operations: filters,
                }
            }

        ).then(this.parseResponse)
    }

    alias(network, address) {
        return this.api.post(
            `/v1/search`,  {
                query: address,
                size: 1,
                filters: {
                    search: {
                        index: ["accounts"],
                        network: [network]
                    },
                }
            }

        ).then(response => {
            let data = this.parseResponse(response);
            if (data.items && data.items.length > 0) {
                let body = data.items[0].body;
                return getAccountAlias(body);
            }
            return null;
        })
    }

    parseResponse(response) {
        if (response.status != 200) {
            throw new RequestFailedError(response);
        }
        return response.data;
    }
}

export function getAccountAlias(body) {
    if (body.TzKT) {
        return body.TzKT.Name;
    }
    if (body.TZIP) {
        return body.TZIP.Name;
    }
    if (body.Profiles) {
        return body.Profiles.Name;
    }
    if (body.Domains) {
        return body.Domains.Name;
    }
    return null;
}