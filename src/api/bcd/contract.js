import { getCancellable, postCancellable } from "@/utils/cancellation";
import { MAX_SIZE, returnRequestResponse, returnResponseData } from "@/api/bcd/helpers";

const axios = require('axios').default;

export class BetterCallApi_Contract {
    constructor(baseURL) {
        this.api = axios.create({
            baseURL: baseURL,
            timeout: 30000,
            responseType: 'json'
        });
    }

    getContract(network, address) {
        return getCancellable(this.api, `/contract/${network}/${address}`).then((returnResponseData));
    }


    getSameContracts(network, address, offset = 0) {
        let params = {}
        if (offset > 0) params.offset = offset;
        return getCancellable(this.api, `/contract/${network}/${address}/same`, { params })
            .then(returnResponseData);
    }

    getSimilarContracts(network, address, offset = 0) {
        let params = {}
        if (offset > 0) params.offset = offset;
        return getCancellable(this.api, `/contract/${network}/${address}/similar`, { params })
            .then(returnResponseData);
    }

    getContractOperations(
        network,
        address,
        last_id = "",
        from = 0,
        to = 0,
        statuses = [],
        entrypoints = [],
        with_storage_diff = true
    ) {
        let params = {}
        if (last_id !== "") {
            params.last_id = last_id;
        }
        if (from !== 0) {
            params.from = from;
        }
        if (to !== 0) {
            params.to = to;
        }
        if (statuses.length > 0 && statuses.length < 4) {
            params.status = statuses.join(',');
        }
        if (entrypoints.length > 0) {
            params.entrypoints = entrypoints.join(',');
        }

        params.with_storage_diff = with_storage_diff

        return getCancellable(this.api, `/contract/${network}/${address}/operations`, { params })
            .then(returnResponseData);
    }

    getContractCode(
        network,
        address,
        protocol = "",
        level = 0
    ) {
        let params = {}
        if (protocol !== "") {
            params.protocol = protocol;
        }
        if (level > 0) {
            params.level = level;
        }
        return getCancellable(this.api, `/contract/${network}/${address}/code`, { params })
            .then(returnResponseData);
    }

    getContractMigrations(network, address) {
        return getCancellable(this.api, `/contract/${network}/${address}/migrations`)
            .then(returnResponseData);
    }

    getContractTokens(network, address, offset=0, size= MAX_SIZE) {
        return getCancellable(this.api, `/contract/${network}/${address}/tokens`, {
            params: { offset, size }
        }).then(returnResponseData);
    }

    getContractTokensCount(network, address) {
        return getCancellable(this.api, `/contract/${network}/${address}/tokens/count`)
            .then(returnResponseData);
    }

    getContractTransfers(
        network,
        address,
        token_id = -1,
        size = MAX_SIZE,
        offset = 0
    ) {
        let params = {};
        if (token_id > -1) {
            params['token_id'] = token_id;
        }
        if (size > 0) {
            params['size'] = size;
        }
        if (offset > 0) {
            params['offset'] = offset;
        }
        return getCancellable(this.api, `/contract/${network}/${address}/transfers`, { params })
            .then(returnResponseData);
    }

    getContractEntrypoints(network, address) {
        return getCancellable(this.api, `/contract/${network}/${address}/entrypoints`)
            .then(returnResponseData);
    }

    getContractEntrypointData(network, address, name, data, format = '') {
        return postCancellable(this.api, `/contract/${network}/${address}/entrypoints/data`, {
            name,
            data,
            format
        }).then(returnRequestResponse)
    }

    getContractEntrypointTrace(
        network,
        address,
        name,
        data,
        source = null,
        amount = null
    ) {
        let body = { name, data }
        if (source) {
            body.source = source;
        }
        if (amount) {
            body.amount = parseInt(amount);
        }
        let method = source ? "run_operation" : "trace";

        return postCancellable(this.api, `/contract/${network}/${address}/entrypoints/${method}`, body)
            .then(returnResponseData);
    }

    getContractEntrypointSchema(
        network,
        address,
        entrypoint,
        fill_type = 'empty'
    ) {
        return this.api
            .get(`/contract/${network}/${address}/entrypoints/schema?fill_type=${fill_type}&entrypoint=${entrypoint}`)
            .then(returnResponseData);
    }

    getContractStorage(network, address, level = null) {
        let params = '?';
        if (level) {
            params += `level=${level}`;
        }
        return getCancellable(this.api, `/contract/${network}/${address}/storage${params}`)
            .then(returnResponseData);
    }

    getContractStorageRaw(network, address, level = null) {
        let params = '?';
        if (level) {
            params += `level=${level}`;
        }
        return this.api.get(`/contract/${network}/${address}/storage/raw${params}`)
            .then(returnResponseData);
    }

    getContractStorageRich(network, address, level = null) {
        let params = '?';
        if (level) {
            params += `level=${level}`
        }
        return this.api.get(`/contract/${network}/${address}/storage/rich${params}`)
            .then(returnResponseData);
    }

    getContractStorageSchema(network, address, fill_type = 'empty') {
        return this.api
            .get(`/contract/${network}/${address}/storage/schema?fill_type=${fill_type}`)
            .then(returnResponseData);
    }

    getContractMempool(network, address) {
        return getCancellable(this.api, `/contract/${network}/${address}/mempool`)
            .then(returnResponseData);
    }

    getMetadataViewsSchema(network, address) {
        return this.api
            .get(`/contract/${network}/${address}/views/schema`)
            .then(returnResponseData);
    }

    executeMetadataView(network, address, data) {
        return this.api
            .post(`/contract/${network}/${address}/views/execute`, data)
            .then(returnResponseData);
    }

    getTokenHoldersList(network, address, token_id) {
        return this.api
            .get(`/contract/${network}/${address}/tokens/holders?token_id=${token_id}`)
            .then(returnResponseData);
    }
}
