const axios = require('axios').default;

import { getJwt } from '@/utils/auth.js'
import { getCancellable, postCancellable, cancelRequests } from '@/utils/cancellation.js';

export class RequestFailedError extends Error {
  constructor(response) {
    super(response);
    this.code = response.status;
  }
}

export class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class BetterCallApi {
  constructor(baseURL) {
    this.api = axios.create({
      baseURL: baseURL,
      timeout: 30000,
      responseType: 'json'
    });
  }

  search(text, indices = [], offset = 0, networks = [], languages = [], time = {}, group = 0) {
    let params = {
      q: text
    }
    if (offset > 0) {
      params.o = offset
    }
    if (indices.length > 0) {
      params.i = indices.join(',')
    }
    if (networks.length > 0) {
      params.n = networks.join(',')
    }
    if (languages.length > 0) {
      params.l = languages.join(',')
    }
    if (group >= 0) {  // maybe remove group parameter?
      params.g = 1
    }
    params = Object.assign(params, time)
    return this.api.get(`/search`, {
      params: params
    })
      .then((res) => {
        if (res.status != 200) {
          throw new RequestFailedError(res);
        }
        return res.data
      })
  }

  getContract(network, address) {
    let params = {};
    const token = getJwt();
    if (token) {
      params.headers = { 'Authorization': token }
    }

    return getCancellable(this.api, `/contract/${network}/${address}`, params)
      .then((res) => {
        if (!res) { return res; }
        if (res.status != 200) {
          throw new RequestFailedError(res);
        }
        return res.data
      })
  }


  getSameContracts(network, address, offset = 0) {
    let params = {}
    if (offset > 0) params.offset = offset;
    return getCancellable(this.api, `/contract/${network}/${address}/same`, {
        params: params
      })
      .then((res) => {
        if (!res) { return res; }
        if (res.status != 200) {
          throw new RequestFailedError(res);
        }
        return res.data
      })
  }

  getSimilarContracts(network, address, offset = 0) {
    let params = {}
    if (offset > 0) params.offset = offset;
    return getCancellable(this.api, `/contract/${network}/${address}/similar`, {
        params: params
      })
      .then((res) => {
        if (!res) { return res; }
        if (res.status != 200) {
          throw new RequestFailedError(res);
        }
        return res.data
      })
  }

  getContractOperations(network, address, last_id = "", from = 0, to = 0, statuses = [], entrypoints = []) {
    let params = {}
    if (last_id != "") {
      params.last_id = last_id
    }
    if (from !== 0) {
      params.from = from
    }
    if (to !== 0) {
      params.to = to
    }
    if (statuses.length > 0 && statuses.length < 4) {
      params.status = statuses.join(',')
    }
    if (entrypoints.length > 0) {
      params.entrypoints = entrypoints.join(',')
    }

    return getCancellable(this.api, `/contract/${network}/${address}/operations`, {
      params: params,
    })
      .then((res) => {
        if (!res) { return res; }
        if (res.status != 200) {
          throw new RequestFailedError(res);
        }
        return res.data
      })
  }

  getContractCode(network, address, protocol = "", level = 0) {
    let params = {}
    if (protocol !== "") {
      params.protocol = protocol;
    }
    if (level > 0) {
      params.level = level;
    }
    return getCancellable(this.api, `/contract/${network}/${address}/code`, {
      params: params
    })
      .then((res) => {
        if (res.status != 200) {
          throw new RequestFailedError(res);
        }
        return res.data
      })
  }

  getContractMigrations(network, address) {
    return getCancellable(this.api, `/contract/${network}/${address}/migrations`, {})
      .then((res) => {
        if (!res) { return res; }
        if (res.status != 200) {
          throw new RequestFailedError(res);
        }
        return res.data
      })
  }

  getContractEntrypoints(network, address) {
    return getCancellable(this.api, `/contract/${network}/${address}/entrypoints`, {})
      .then((res) => {
        if (!res) { return res; }
        if (res.status != 200) {
          throw new RequestFailedError(res);
        }
        return res.data
      })
  }

  getContractEntrypointData(network, address, bin_path, data, format = '') {
    return postCancellable(this.api, `/contract/${network}/${address}/entrypoints/data`, {
      bin_path: bin_path,
      data: data,
      format: format
    })
      .then((res) => {
        if (!res) { return res; }
        if (res.status != 200) {
          throw new RequestFailedError(res);
        }
        return res.data;    
      })
  }

  getContractEntrypointTrace(network, address, bin_path, data, source = null, amount = null) {
    var body = {
      bin_path: bin_path,
      data: data
    }
    if (source) {
      body.source = source;
    }
    if (amount) {
      body.amount = parseInt(amount);
    }
    let method = source ? "run_operation" : "trace";

    return postCancellable(this.api, `/contract/${network}/${address}/entrypoints/${method}`, body)
      .then((res) => {
        if (!res) { return res; }
        if (res.status != 200) {
          throw new RequestFailedError(res);
        }
        return res.data
      })
  }

  getContractStorage(network, address) {
    return getCancellable(this.api, `/contract/${network}/${address}/storage`, {})
      .then((res) => {
        if (!res) { return res; }
        if (res.status != 200) {
          throw new RequestFailedError(res);
        }
        return res.data
      })
  }

  getContractStorageRaw(network, address) {
    return this.api.get(`/contract/${network}/${address}/storage/raw`)
      .then((res) => {
        if (res.status != 200) {
          throw new RequestFailedError(res);
        }
        return res.data
      })
  }

  getContractStorageRich(network, address) {
    return this.api.get(`/contract/${network}/${address}/storage/rich`)
      .then((res) => {
        if (res.status != 200) {
          throw new RequestFailedError(res);
        }
        return res.data
      })
  }

  getContractStorageSchema(network, address, fill_type='empty') {
    return this.api.get(`/contract/${network}/${address}/storage/schema?fill_type=${fill_type}`)
      .then((res) => {
        if (res.status != 200) {
          throw new RequestFailedError(res);
        }
        return res.data
      })
  }

  prepareToFork(network, address, storage) {
    return postCancellable(this.api, `/contract/${network}/${address}/fork`, {
      storage: storage
    })
      .then((res) => {
        if (res.status != 200) {
          throw new RequestFailedError(res);
        }
        return res.data
      })
  }

  getContractMempool(network, address) {
    return getCancellable(this.api, `/contract/${network}/${address}/mempool`, {})
      .then((res) => {
        if (!res) { return res; }
        if (res.status != 200) {
          throw new RequestFailedError(res);
        }
        return res.data
      })
  }

  getContractBigMap(network, ptr) {
    return getCancellable(this.api, `/bigmap/${network}/${ptr}`, {})
      .then((res) => {
        if (!res) { return res; }
        if (res.status != 200) {
          throw new RequestFailedError(res);
        }
        return res.data
      })
  }

  getContractBigMapKeys(network, ptr, q = '', offset = 0) {
    return getCancellable(this.api, `/bigmap/${network}/${ptr}/keys?q=${q}&offset=${offset}`, {})
      .then((res) => {
        if (!res) { return res; }
        if (res.status != 200) {
          throw new RequestFailedError(res);
        }
        return res.data
      })
  }

  getContractBigMapActions(network, ptr) {
    return getCancellable(this.api, `/bigmap/${network}/${ptr}/history`, {})
      .then((res) => {
        if (!res) { return res; }
        if (res.status != 200) {
          throw new RequestFailedError(res);
        }
        return res.data
      })
  }

  getContractBigMapHistory(network, ptr, keyhash, offset = 0) {
    return getCancellable(this.api, `/bigmap/${network}/${ptr}/keys/${keyhash}?offset=${offset}`, {})
      .then((res) => {
        if (res.status != 200) {
          throw new RequestFailedError(res);
        }
        return res.data
      })
  }

  getRandomContract() {
    cancelRequests();
    return getCancellable(this.api, `/pick_random`, {})
      .then((res) => {
        if (res.status != 200) {
          throw new RequestFailedError(res);
        }
        return res.data
      })
  }

  getDiff(query) {
    return this.api.post(`/diff`, query)
      .then((res) => {
        if (res.status != 200) {
          throw new RequestFailedError(res);
        }
        return res.data
      })
  }

  getProjects() {
    return getCancellable(this.api, `/projects`, {})
      .then((res) => {
        if (res.status != 200) {
          throw new RequestFailedError(res);
        }
        return res.data
      })
  }

  getOPG(hash) {
    return getCancellable(this.api, `/opg/${hash}`, {})
      .then((res) => {
        if (res.status != 200) {
          throw new RequestFailedError(res);
        }
        return res.data
      })
  }

  vote(sn, sa, dn, da, vote) {
    return this.api.post(`/profile/vote`, {
      src: sa,
      src_network: sn,
      dest: da,
      dest_network: dn,
      vote: vote,
    },
      {
        headers: {
          'Authorization': getJwt()
        }
      })
      .then((res) => {
        return res.data
      })
      .catch((err) => {
        if (err.response !== undefined && err.response.status == 401) {
          throw new UnauthorizedError(err);
        }
        throw err;
      })
  }

  getNextVoteTask() {
    return this.api.get(`/profile/vote/task`,
      {
        headers: {
          'Authorization': getJwt()
        }
      })
      .then((res) => {
        return res.data
      })
      .catch((err) => {
        if (err.response !== undefined && err.response.status == 401) {
          throw new UnauthorizedError(err);
        }
        throw err;
      })
  }

  getProfile() {
    return this.api.get(`/profile`,
      {
        headers: {
          'Authorization': getJwt()
        }
      })
      .then((res) => {
        return res.data
      })
      .catch((err) => {
        if (err.response !== undefined && err.response.status == 401) {
          throw new UnauthorizedError(err);
        }
        throw err;
      })
  }

  profileMarkAllRead(timestamp) {
    return this.api.post(`/profile/mark_all_read`, { timestamp },
      {
        headers: {
          'Authorization': getJwt()
        }
      })
      .then((res) => {
        return res.data
      })
      .catch((err) => {
        if (err.response !== undefined && err.response.status == 401) {
          throw new UnauthorizedError(err);
        }
        throw err;
      })
  }

  getProfileSubscriptions() {
    return this.api.get(`/profile/subscriptions`, {
        headers: {
          'Authorization': getJwt()
        }
      })
      .then((res) => {
        return res.data
      })
      .catch((err) => {
        if (err.response !== undefined && err.response.status == 401) {
          throw new UnauthorizedError(err);
        }
        throw err;
      })
  }

  addProfileSubscription(subscription) {
    return this.api.post(`/profile/subscriptions`, subscription,
      {
        headers: {
          'Authorization': getJwt()
        }
      })
      .then((res) => {
        return res.data
      })
      .catch((err) => {
        if (err.response !== undefined && err.response.status == 401) {
          throw new UnauthorizedError(err);
        }
        throw err;
      })
  }

  removeProfileSubscription(network, address) {
    return this.api.delete(`/profile/subscriptions`, {
        headers: {
          'Authorization': getJwt()
        },
        data: {
          network, address
        }
      })
      .then((res) => {
        return res.data
      })
      .catch((err) => {
        if (err.response !== undefined && err.response.status == 401) {
          throw new UnauthorizedError(err);
        }
        throw err;
      })
  }

  getProfileEvents(offset = 0) {
    return this.api.get(`/profile/subscriptions/events`,
      {
        headers: {
          'Authorization': getJwt()
        },
        params: {
          offset: offset,
          size: 15
        }
      })
      .then((res) => {
        return res.data
      })
      .catch((err) => {
        if (err.response !== undefined && err.response.status == 401) {
          throw new UnauthorizedError(err);
        }
        throw err;
      })
  }

  getStats() {
    return getCancellable(this.api, `/stats`, {})
      .then((res) => {
        if (!res) { return res; }
        if (res.status != 200) {
          throw new RequestFailedError(res);
        }
        return res.data
      })
  }

  getNetworkStats(network) {
    return getCancellable(this.api, `/stats/${network}`, {})
      .then((res) => {
        if (!res) { return res; }
        if (res.status != 200) {
          throw new RequestFailedError(res);
        }
        return res.data
      })
  }

  getNetworkStatsSeries(network, index, period) {
    return getCancellable(this.api, `/stats/${network}/series?name=${index}&period=${period}`, {})
      .then((res) => {
        if (!res) { return res; }
        if (res.status != 200) {
          throw new RequestFailedError(res);
        }
        return res.data
      })
  }

  getErrorLocation(operationId) {
    return getCancellable(this.api, `/operation/${operationId}/error_location`, {})
      .then((res) => {
        if (!res) { return res; }
        if (res.status != 200) {
          throw new RequestFailedError(res);
        }
        return res.data
      })
  }

  getContractBySlug(slug) {
    return getCancellable(this.api, `/slug/${slug}`, {})
      .then((res) => {
        if (res.status != 200) {
          throw new RequestFailedError(res);
        }
        return res.data
      })
  }
}