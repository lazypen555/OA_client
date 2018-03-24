import Util from '../../libs/util';

const {_, ajax: _http, helper: _helper} = Util;

// initial state
// shape: [{ id, quantity }]
const state = {
    menusList: [],
    authsList: [],
    menuIndex: '',
}

// getters
const getters = {
    getMenus: (state) => {
        let menusList = state.menusList;
        let authsList = state.authsList;
        let menus = [];

        function createParentMenu(menu) {
            let parent = _.find(menusList, {menuId: menu.parentId});
            if (parent && parent.parentId !== 0 && !_.find(menus, {menuId: parent.menuId})) {
                createParentMenu(parent);
            }
            menus.push(parent);
        }

        let cildrenList = _.filter(menusList, (v) => {
            return v.parentId !== 0 && _.find(authsList, {menuId: v.menuId});
        });

        _.each(cildrenList, (v, i) => {
            menus.push(v);
            if (!_.find(menus, {menuId: v.parentId})) {
                createParentMenu(v);
            }
        });

        //todo 是否添加首页
        // if(_.find(authsList, {menuId: 16})){
        //     menus.push(_.find(menusList, {menuId:16}));
        // }
        //防止溢出
        cildrenList = undefined;
        return menus;
    },
    getIndex: (state) => {
        return state.menuIndex ? state.menuIndex : _helper.getLocalStorage('menuIndex');
    }
}

// actions
const actions = {
    async initMenus({commit}) {
        let menuList = [];
        //获取menu
        let result;
        result = await _http.get(`/v1/menu`);
        if (result && result.isSuc) {
            menuList = result.data.menuList;
            commit('INIT_MENUS', menuList)
        } else {
            console.log(result ? result.data.msg : '网络异常');
        }
    },
    async initAuths({commit, getters}) {
        let result;
        let user = getters.getUser;
        if (user) {
            result = await _http.get(`/v1/auth`, {userId: user.cUser_Id});
            if (result && result.isSuc) {
                let {authsList} = result.data;
                commit('INIT_AUTHS', authsList)
            } else {
                console.log(result ? result.data.msg : '网络异常');
            }
        } else {
            console.log(`initAuths fail. user is not found`);
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
    },
    SET_MENU_INDEX(state, index) {
        state.menuIndex = index;
        _helper.setLocalStorage('menuIndex', index);
    }
}


export default {
    state,
    getters,
    actions,
    mutations
}