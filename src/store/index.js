import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    error: null,
    success: null,
    isAuthorized: false,
    profile: null,
  },
  mutations: {
    setError(state, value) {
      state.error = value
    },
    setIsAuthorized(state, value) {
      state.isAuthorized = value
    },
    setProfile(state, value) {
      state.profile = value
    },
    setSuccess(state, value) {
      state.success = value;
    }
  },
  actions: {
    showError({ commit }, text) {
      commit('setError', {
        text: text
      })
    },
    hideError({ commit }) {
      commit('setError', null)
    },
    showClipboardOK({ commit }) {
      commit('setSuccess', 'Copied to the clipboard')
    },
    showSuccess({ commit }, value) {
      commit('setSuccess', value)
    },
    hideSuccess({ commit }) {
      commit('setSuccess', null)
    },
    setIsAuthorized({ commit }, value) {
      commit('setIsAuthorized', value)
    },
    setProfile({ commit }, value) {
      commit('setProfile', value)
    },
    logout({ commit }) {
      commit('setProfile', null);
      commit('setIsAuthorized', false);
    }
  }
});
