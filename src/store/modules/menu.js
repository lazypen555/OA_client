import Util from '../../libs/util';

const {_, ajax: http} = Util;

// initial state
// shape: [{ id, quantity }]
const state = {
    menusList: [],
    authsList: [],
}

// getters
const getters = {
    getMenus: (state) => {
        let menus = [];
        _.each(state.authsList, (v, i) => {
            let menu = _.find(state.menusList,{menuId:v.menuId});
            menus.push(menu);
        });
        return menus;
    }
}

// actions
const actions = {
    async initMenus({commit}) {
        let menuList = [];
        //获取menu
        let result;
        result = await http.get(`/v1/menu`);
        if (result && result.isSuc) {
            menuList = result.data.menuList;
            commit('INIT_MENUS', menuList)
        } else {
            console.log(result ? result.data.msg : '网络异常');
        }
    },
    async initAuths({commit,rootState}) {
        let result;
        let userId = rootState.userId || '014';
        result = await http.get(`/v1/auth`,{userId});
        if (result && result.isSuc) {
            let {authsList} = result.data;
            commit('INIT_AUTHS', authsList)
        } else {
            console.log(result ? result.data.msg : '网络异常');
        }
    }
}

// mutations
const mutations = {
    INIT_MENUS(state, menus) {
        state.menusList = menus;
    },
    INIT_AUTHS(state, auths) {
        state.authsList = auths;
    }
}


export default {
    state,
    getters,
    actions,
    mutations
}