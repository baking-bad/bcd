import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        error: null,
        isAuthorized: false,
        profile: null
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
        setIsAuthorized({ commit }, value) {
            commit('setIsAuthorized', value)
        },
        setProfile({ commit }, value) {
            commit('setProfile', value)
        },
        logout({ commit }) {
            commit('setProfile', null);
            commit('setIsAuthorized', false);
        },
    }
});
