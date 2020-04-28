export class TzKTApi {
    constructor(endpoints) {
        this.endpoints = endpoints;
    }

    supports(network) {
        return (typeof(this.endpoints) === "object") && (network in this.endpoints);
    }

    resolve(network, address_or_hash) {
        if (this.supports(network)) {
            return `${this.endpoints[network]}${address_or_hash}`;
        }
    }
}