import axios from "axios";
import {MAX_SIZE, returnResponseData} from "@/api/bcd/helpers";
import {getCancellable} from "@/utils/cancellation";
import {RequestFailedError} from "@/api/bcd/errors";

export class BetterCallApi_Tokens {
    constructor(baseURL) {
        this.api = axios.create({
            baseURL: baseURL,
            timeout: 30000,
            responseType: 'json'
        });
    }

    getAccountTransfers(
        network,
        address,
        token_id = -1,
        contracts = [],
        size = MAX_SIZE,
        last_id = ''
    ) {
        let params = {};
        if (token_id > -1) {
            params['token_id'] = token_id;
        }
        if (size > 0) {
            params['size'] = size;
        }
        if (last_id > '') {
            params['last_id'] = last_id;
        }
        if (contracts && contracts.length > 0) {
            params['contracts'] = contracts.join(',');
        }
        return getCancellable(this.api, `/tokens/${network}/transfers/${address}`, { params })
            .then(returnResponseData);
    }

    getTokensByVersion(
        network,
        version,
        offset = 0,
        size = 0
    ) {
        let params = {}
        if (size > 0) {
            params['size'] = size;
        }
        if (offset > 0) {
            params['offset'] = offset;
        }
        return getCancellable(this.api, `/tokens/${network}/version/${version}`, { params })
            .then(returnResponseData);
    }

    getTokenVolumeSeries(
        network,
        period,
        contract,
        token_id,
        slug = ''
    ) {
        let params = [];
        params.push(`contract=${contract}`)
        params.push(`period=${period}`)
        params.push(`token_id=${token_id}`)

        if (slug !== '') {
            params.push(`slug=${slug}`)
        }

        return getCancellable(this.api, `/tokens/${network}/series?${params.join('&')}`)
            .then(returnResponseData);
    }
}
