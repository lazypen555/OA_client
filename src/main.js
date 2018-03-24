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
Object.defineProperty(Vue.prototype, '$moment', {value: Util.moment});

Vue.use(VueRouter);
Vue.use(iView);


// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach(async (to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);

    if (!to.matched.some(record => record.meta.requiresAuth)) {
        next();
        return;
    }

    let _store = router.app.$options.store;

    let token = _store.getters.getToken;
    let now = Date.now();

    //todo 判断过期和token
    if (!token || (token.expires && now > token.expires)) {
        //删除本地缓存和状态
        await _store.dispatch('removeToken');
        next({
            path: '/login',
            query: {redirect: to.fullPath}
        });
        return;
    }else{
        next();
    }
});

router.afterEach((to, form) => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
    //显示breadcrumb
    //显示标签页
    if (to.meta.title) {
        document.title = to.meta.title;
    }
});


new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App)
});