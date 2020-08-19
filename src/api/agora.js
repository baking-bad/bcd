const axios = require('axios').default;

import { getCancellable } from '@/utils/cancellation.js';

export class RequestFailedError extends Error {
    constructor(response) {
        super(response);
        this.code = response.status;
    }
}

export class AgoraApi {
    constructor() {
        this.api = axios.create({
            timeout: 30000,
            responseType: 'json'
        });
    }

    get(link) {
        return getCancellable(this.api, 'https://cors-anywhere.herokuapp.com/' + link, {})
            .then((res) => {
                if (!res) { return res; }
                if (res.status != 200) {
                    throw new RequestFailedError(res);
                }
                return res.data
            })
    }

    getPosts(postId) {
        return this.get(`https://forum.tezosagora.org/t/${postId}/posts.json `)
    }

    getPostsWithRating(postId) {
        return this.get(`https://try.thepavilion.io/t/this-is-a-new-post-with-ratings/${postId}.json`)
    }

    getReplies(postId) {
        return this.get(`https://forum.tezosagora.org/posts/${postId}/replies.json`)
    }
}

