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


function buildFindQuery(query, address, network, token_id) {
  return {
    query: query,
    variables: {
      address: address,
      network: network,
      token_id: token_id
    },
    operationName: "FindTokenMetadata"
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
              order_by: {token_id: desc}
            ) {
              network
              contract
              error
              link
              metadata
              token_id
              status
              retry_count
            }
          }`, address, network, limit, offset)

        return get(this.api, query)
            .then(res => {
                return res.token_metadata;
            })
    }

    token(network, address, token_id) {
      let query = buildFindQuery(`query FindTokenMetadata($address: String, $network: String, $token_id: [numeric]) {
        token_metadata(
            where: {
              token_id: {_in: $token_id}, 
              contract: {_eq: $address}, 
              network: {_eq: $network}
            }
          ) {
            network
            contract
            error
            link
            metadata
            token_id
            status
            retry_count
          }
        }`, address, network, token_id)

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
              order_by: {token_id: desc}
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


    token(network, address, token_id) {
      let query = buildFindQuery(`query FindTokenMetadata($address: String, $network: String, $token_id: [String]) {
        dipdup_token_metadata(
            where: {
              token_id: {_in: $token_id}, 
              contract: {_eq: $address}, 
              network: {_eq: $network}
            }
          ) {
            network
            contract
            metadata
            token_id
          }
        }`, address, network, token_id)

      return get(this.api, query)
          .then(res => {
              return res.dipdup_token_metadata;
          })
    }
}