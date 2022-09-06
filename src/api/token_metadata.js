import {createAxios} from "@/api/general.js";

export class RequestFailedError extends Error { }

function get(api, query) {
  return api.post('/v1/graphql', query)
      .then(res => {
          if (res.status !== 200 || res.data.errors) {
              throw new RequestFailedError(JSON.stringify(res));
          }
          return res.data.data;
      })
}

function buildQuery(query, address, network, limit, offset) {
  return {
    query: query,
    variables: {
      address: address,
      network: network,
      limit: limit,
      offset: offset
    },
    operationName: "GetTokenMetadata"
  }
}

export class TokenMetadataApi {
    constructor(baseURL) {
      this.api = createAxios(baseURL);
    }

    created() {
      return this.api !== null;
    }

    get(network, address, limit=10, offset=0) {
        let query = buildQuery(`query GetTokenMetadata($address: String, $network: String, $limit: Int, $offset: Int) {
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
          }`, address, network, limit, offset)

        return get(this.api, query)
            .then(res => {
                return res.token_metadata;
            })
    }
}

export class DipDupTokenMetadataApi {
    constructor(baseURL) {
      this.api = createAxios(baseURL);
    }

    get(network, address, limit=10, offset=0) {
        let query = buildQuery(`query GetTokenMetadata($address: String, $network: String, $limit: Int, $offset: Int) {
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
        }`, address, network, limit, offset)

        return get(this.api, query)
            .then(res => {
                return res.dipdup_token_metadata;
        })
    }
}