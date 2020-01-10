import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        error: null
    },
    mutations: {
        setError(state, value) {
            state.error = value
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
        }
    }
});
