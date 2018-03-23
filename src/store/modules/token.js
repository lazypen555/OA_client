import Util from '../../libs/util';

const {_, ajax: _http, helper: _helper} = Util;

const state = {
    token: {},
}

// getters
const getters = {
    getUser: (state,getters) => {
        let token =getters.getToken;
        return (token && token.user) || {};
    },
    getToken:()=>{
        return !_.isEmpty(state.token) ? state.token : _helper.getLocalStorage('token');
    }
}

// actions
const actions = {
    async registerToken({commit}, token) {
        let result;
        let {username} = token;
        result = await _http.get(`/v1/user/${username}`);
        if (result && result.isSuc) {
            delete token.username;
            let {cUser_Id, cUser_Name} = result.data.user;
            token.user = {cUser_Id, cUser_Name};
            commit('registerToken', token);
        } else {
            console.log(result ? result.data.msg : '网络异常');
        }
    },
    async removeToken({commit, getters}) {
        let result;

        let token = getters.getToken;
        result = await _http.post(`/v1/api/logout`, token);
        console.log(result);

        if (result && result.isSuc) {
            commit('removeToken');
        } else {
            console.log(result ? result.data.msg : '网络异常');
        }
    }
}

// mutations
const mutations = {
    registerToken(state, token) {
        state.token = token;
        //修正ajax验证头
        _http.setToken(token);
        //记录本地缓存
        _helper.setLocalStorage('token', token);
    },
    removeToken(state) {
        state.token = {};
        //修正ajax验证头
        _http.delToken();
        //删除本地缓存
        _helper.delLocalStorage('token');
    }
}


export default {
    state,
    getters,
    actions,
    mutations
}