
// initial state
// shape: [{ id, quantity }]
const state = {
    breadcrumbs: [{url: '/index', value: '首页'}]
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
    createBreadcrumb(state, breadcrumbs) {
        state.breadcrumbs = breadcrumbs;
    },
}


export default {
    state,
    getters,
    actions,
    mutations
}