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
    showWarning({ commit }, value) {
      commit('setWarning', value);
    },
    showClipboardWarning({ commit }, text) {
      if (!text) {
        text = 'Copied! Text might be truncated due to its size!'
      }
      commit('setWarning', text);
    },
    showClipboardOK({ commit }, text) {
      if (!text) {
        text = 'Copied to the clipboard!'
      }
      commit('setSuccess', text)
    },
    showClipboardFail({ dispatch}, text) {
      if (!text) {
        text = 'Failed to save to the clipboard!'
      }
      dispatch('showError', text)
    },
    showSuccess({ commit }, value) {
      commit('setSuccess', value)
    },
    hideSuccess({ commit }) {
      commit('setSuccess', null)
    },
    hideWarning({ commit }) {
      commit('setWarning', null)
    }
  }
});
