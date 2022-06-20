const axios = require('axios').default;

export class RequestFailedError extends Error { }

export class SearchService {
    constructor(baseURL) {
        this.api = axios.create({
            baseURL: baseURL,
            timeout: 30000,
            responseType: 'json'
        });
    }

    suggest(text, size = 0, offset = 0) {
        return this.api.post(
            `/v1/search`,
            {
                query: text,
                size: size ? size : 10,
                offset: offset
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