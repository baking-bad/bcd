import axios from "axios";
import { getCancellable } from "@/utils/cancellation";
import { returnResponseData } from "@/api/bcd/helpers";

export class BetterCallApi_Stats {
    constructor(baseURL) {
        this.api = axios.create({
            baseURL: baseURL,
            timeout: 30000,
            responseType: 'json'
        });
    }

    getNetworkStatsSeries(
        network,
        index,
        period,
        addresses = []
    ) {
        let params = [];
        if (addresses && addresses.length) {
            params.push(`address=${addresses.join(',')}`)
        }
        if (period) {
            params.push(`period=${period}`)
        }
        if (index) {
            params.push(`name=${index}`)
        }
        return getCancellable(this.api, `/stats/${network}/series?${params.join('&')}`)
            .then(returnResponseData);
    }

    getContractsStats(network, addresses, period) {
        return getCancellable(
            this.api,
            `/stats/${network}/contracts?period=${period}&contracts=${addresses.join(',')}`,
            ).then(returnResponseData);
    }

    getStats() {
        return getCancellable(this.api, `/stats`)
            .then(returnResponseData);
    }

    getNetworkStats(network) {
        return getCancellable(this.api, `/stats/${network}`)
            .then(returnResponseData);
    }
}
