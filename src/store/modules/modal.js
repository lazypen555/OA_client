import Util from '../../libs/util';

const {_, ajax: _http, helper: _helper} = Util;

const state = {
    pwdModal: false
}

// getters
const getters = {
}

// actions
const actions = {

}

// mutations
const mutations = {
    setModalStatus(state, showStatus) {
        state.pwdModal = !!showStatus;
    },
}


export default {
    state,
    getters,
    actions,
    mutations
}