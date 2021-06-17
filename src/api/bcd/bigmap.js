import {getCancellable} from "@/utils/cancellation";
import axios from "axios";
import { returnResponseData } from "@/api/bcd/helpers";

export class BetterCallApi_BigMap {
    constructor(baseURL) {
        this.api = axios.create({
            baseURL: baseURL,
            timeout: 30000,
            responseType: 'json'
        });
    }

    getContractBigMap(network, ptr) {
        return getCancellable(this.api, `/bigmap/${network}/${ptr}`)
            .then(returnResponseData);
    }

    getContractBigMapDiffsCount(network, ptr) {
        return getCancellable(this.api, `/bigmap/${network}/${ptr}/count`)
            .then(returnResponseData);
    }

    getContractBigMapKeys(network, ptr, q = '', offset = 0) {
        return getCancellable(this.api, `/bigmap/${network}/${ptr}/keys?q=${q}&offset=${offset}`)
            .then(returnResponseData);
    }

    getContractBigMapActions(network, ptr) {
        return getCancellable(this.api, `/bigmap/${network}/${ptr}/history`)
            .then(returnResponseData);
    }

    getContractBigMapHistory(network, ptr, keyhash, offset = 0) {
        return getCancellable(this.api, `/bigmap/${network}/${ptr}/keys/${keyhash}?offset=${offset}`)
            .then(returnResponseData);
    }
}
