import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router/index';
import store from './store';
import Util from './libs/util';
import App from './app';
import 'iview/dist/styles/iview.css';

//引入第三方库
Object.defineProperty(Vue.prototype, '$http', {value: Util.ajax});
Object.defineProperty(Vue.prototype, '$_', {value: Util._});
Object.defineProperty(Vue.prototype, '$helper', {value: Util.helper});

Vue.use(VueRouter);
Vue.use(iView);


// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);

    // let _store =router.app.$options.store;
    // let tokenObj = _store.state.token;
    // //todo 判断过期
    // if(!Util._.isEmpty(tokenObj)){
    //     //删除本地缓存和状态
    //     //_store.commit('registerToken',{});
    //     //window.localStorage.removeItem('token');
    //     // next({
    //     //     path: '/login',
    //     //     query: { redirect: to.fullPath }
    //     // });
    // }
    // let token = window.localStorage.getItem('token');
    // if (to.matched.some(record => record.meta.requiresAuth) && (!token || token === null)) {
    //     next({
    //         path: '/login',
    //         query: { redirect: to.fullPath }
    //     })
    // } else {
    //     next()
    // }
    next();
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
    //显示breadcrumb
});



new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App)
});