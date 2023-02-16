import {createAxios} from "@/api/general.js";

export class RequestFailedError extends Error { }

export class SearchService {
    constructor(baseURL) {
        this.api = createAxios(baseURL);
    }

    created() {
      return this.api !== null;
    }

    suggest(text, size = 10, filters = {}) {
        let request = {
            query: text,
            size: size,
            filters: filters
        };
        return this.api.post(
            `/v1/suggest`, request
        ).then(this.parseResponse)
    }

    search(text, filters, size = 10, offset = 0, disable_highlight = false) {
        let request = {
            query: text,
            size: size,
            offset: offset,
            disable_highlight: disable_highlight
        };
        if (filters) {
            request.filters = filters;
        }
        return this.api.post(
            `/v1/search`, request
        ).then(this.parseResponse)
    }

    bigMapKeys(text, filters, size = 10, offset = 0) {
        return this.api.post(
            `/v1/search`,  {
                query: text,
                size: size,
                offset: offset,
                filters: {
                    big_maps: filters,
                }
            }

        ).then(this.parseResponse)
    }

    operations(text, filters, size = 10, offset = 0) {
        return this.api.post(
            `/v1/search`,  {
                query: text,
                size: size,
                offset: offset,
                filters: {
                    operations: filters,
                }
            }

        ).then(this.parseResponse)
    }

    tokens(text, network, contract, size = 10, offset = 0) {
        return this.api.post(
            `/v1/search`,  {
                query: text,
                size: size,
                offset: offset,
                filters: {
                    tokens: {
                        network: [network],
                        contract: [contract]
                    }
                }
            }

        ).then(this.parseResponse)
    }

    alias(network, address) {
        return this.api.get(`/v1/account/${network}/${address}`,)
            .then(response => getAccountAlias(response.data))
    }

    mimeTypes() {
        return this.api.get(`/v1/mime_types`).then(this.parseResponse);
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