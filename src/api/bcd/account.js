import axios from "axios";
import { getCancellable } from "@/utils/cancellation";
import { RequestFailedError } from "@/api/bcd/errors";
import { MAX_SIZE } from "@/api/bcd/helpers";

export class BetterCallApi_Account {
    constructor(baseURL) {
        this.api = axios.create({
            baseURL: baseURL,
            timeout: 30000,
            responseType: 'json'
        });
    }

    getAccountInfo(network, address) {
        return getCancellable(this.api, `/account/${network}/${address}`)
            .then((res) => {
                if (!res) {
                    return null;
                }
                if (res.status !== 200) {
                    throw new RequestFailedError(res);
                }
                return res.data;
            })
    }

    getAccountTokenBalances(network, address, offset=0, size = MAX_SIZE) {
        return getCancellable(this.api, `/account/${network}/${address}/token_balances`, {
            params: { offset, size }
        })
            .then((res) => {
                if (!res) {
                    return null;
                }
                if (res.status !== 200) {
                    throw new RequestFailedError(res);
                }
                return res.data;
            })
    }

    getAccountMetadata(network, address) {
        return getCancellable(this.api, `/account/${network}/${address}/metadata`)
            .then((res) => {
                if (!res || res.status === 204) {
                    return null;
                }
                if (res.status !== 200) {
                    throw new RequestFailedError(res);
                }
                return res.data;
            })
    }
}
