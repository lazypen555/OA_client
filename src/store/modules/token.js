
// initial state
// shape: [{ id, quantity }]
const state = {
    token: {}
}

// getters
const getters = {
}

// actions
const actions = {
    init ({ commit, state }, products) {

    }
}

// mutations
const mutations = {
    registerToken(state, token) {
        state.token = token;
    },
}


export default {
    state,
    getters,
    actions,
    mutations
}