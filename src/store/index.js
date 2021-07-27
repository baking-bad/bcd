import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    warning: null,
    error: null,
    success: null,
  },
  mutations: {
    setError(state, value) {
      state.error = value
    },
    setSuccess(state, value) {
      state.success = value;
    },
    setWarning(state, value) {
      state.warning = value;
    },
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
    showClipboardWarning({ commit }) {
      commit('setWarning', 'Copied! Text might be truncated due to its size');
    },
    showClipboardOK({ commit }) {
      commit('setSuccess', 'Copied to the clipboard')
    },
    showClipboardFail({ dispatch}) {
      dispatch('showError', 'Failed to save to the clipboard')
    },
    showSuccess({ commit }, value) {
      commit('setSuccess', value)
    },
    hideSuccess({ commit }) {
      commit('setSuccess', null)
    },
    hideWarning({ commit }) {
      commit('setWarning', null)
    },
  }
});
