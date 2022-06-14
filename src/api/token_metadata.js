const axios = require('axios').default;

export class RequestFailedError extends Error { }

export class TokenMetadataApi {
    constructor(baseURL) {
      this.api = axios.create({
        baseURL: baseURL,
        timeout: 10000,
        responseType: 'json'
      });
    }

    get(network, address, limit=10, offset=0) {
        let query = {
            "query":`query GetTokenMetadata($address: String, $network: String, $limit: Int, $offset: Int) {
              token_metadata(
                  where: {
                    contract: {_eq: $address}, 
                    network: {_eq: $network}}
                  limit: $limit
                  offset: $offset
                  order_by: {update_id: desc}
                ) {
                  network
                  contract
                  error
                  link
                  metadata
                  token_id
                }
              }`,
              "variables":{
                "address": address,
                "network": network,
                "limit": limit,
                "offset": offset
              },
              "operationName":"GetTokenMetadata"
        }

        return this.api.post('/v1/graphql', query)
            .then(res => {
                if (res.status !== 200 || res.data.errors) {
                    throw new RequestFailedError(JSON.stringify(res));
                }
                return res.data.data.token_metadata;
            })
    }
}

export class DipDupTokenMetadataApi {
    constructor(baseURL) {
      this.api = axios.create({
        baseURL: baseURL,
        timeout: 10000,
        responseType: 'json'
      });
    }

    get(network, address, limit=10, offset=0) {
        let query = {
            "query":`query GetTokenMetadata($address: String, $network: String, $limit: Int, $offset: Int) {
              dipdup_token_metadata(
                  where: {
                    contract: {_eq: $address}, 
                    network: {_eq: $network}}
                  limit: $limit
                  offset: $offset
                  order_by: {update_id: desc}
                ) {
                  network
                  contract
                  metadata
                  token_id
                }
              }`,
              "variables":{
                "address": address,
                "network": network,
                "limit": limit,
                "offset": offset
              },
              "operationName":"GetTokenMetadata"
        }

        return this.api.post('/v1/graphql', query)
            .then(res => {
                if (res.status !== 200 || res.data.errors) {
                    throw new RequestFailedError(JSON.stringify(res));
                }
                return res.data.data.dipdup_token_metadata;
            })
    }
}