import Vue from 'vue'
import Vuex from 'vuex'
import token from './modules/token'
import menu from './modules/menu'
import breadcrumb from './modules/breadcrumb'
//import createLogger from '../../../src/plugins/logger'

Vue.use(Vuex);
//const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        token,
        menu,
        breadcrumb
    },
})