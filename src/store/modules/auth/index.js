import getters from './getters.js';
import actions from './actions.js';
import mutations from './mutations.js';

export default {
    namespaced: true,
    state() {
        return {
            userId: null,
            token: null,
            tokenExpiration: null,
        }
    },
    mutations,
    actions,
    getters
}