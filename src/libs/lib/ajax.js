import axios from 'axios';
import qs from 'qs';
import env from "../../config/env";
import _ from 'lodash';

import config from '../../config/config'

const ajaxUrl = config.server;

let getAuthorization = function () {
    let token = window.localStorage.getItem('token');
    let token_type = window.localStorage.getItem('token_type');
    if(token && token_type){
        return `${token_type} ${token}`;
    }else {
        let {client_id, client_secret} = config.oAuth;
        return `Basic ${window.btoa(client_id + ':' + client_secret)}`;
    }
}

axios.defaults.timeout = 30000; //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; //配置请求头
axios.defaults.baseURL = ajaxUrl; //配置接口地址
axios.defaults.headers.common['Authorization'] = getAuthorization();
//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
//在发送请求之前做某件事
    if(config.method === 'post'){
        config.data = qs.stringify(config.data);
    }
    return config;
},(error) =>{
    return Promise.reject(error);
});


class Ajax {
    constructor() {
        this.TOKEN = '';
    }

    handlRes(response) {
        let result = {isSuc: false, data: {}};
        let {status, data, statusText} = response;
        if (status === 200 && statusText === "OK") {
            //oauth2 兼容
            result.isSuc = data.isSuc || !!data.access_token;
            result.data = data;
        } else {
            console.error(`server err.status is ${status}
            statusText is ${statusText}`);
        }
        return result;
    }

    async get(url, query, config) {
        let response;
        let queryArr = [];
        _.each(query, (v, k) => {
            v = v && _.isObject(v) ? JSON.stringify(v) : typeof v === 'undefined' ? '' : v;
            queryArr.push(`${k}=${encodeURI(v)}`);
        });
        url = `${url}?${queryArr.join('&')}`;
        try {
            response = await axios.get(url, config);
        } catch (e) {
            console.error(e);
            return;
        }
        return this.handlRes(response);
    }

    async post(url, query, config) {
        let response;
        try {
            response = await axios.post(url, query, config);
        } catch (e) {
            console.error(e);
            return;
        }
        return this.handlRes(response);
    }

    async put(url, query, config) {
        let response;
        try {
            response = await axios.put(url, query, config);
        } catch (e) {
            console.error(e);
            return;
        }
        return this.handlRes(response);
    }

    async delete(url, query, config) {
        let response;
        try {
            response = await axios.delete(url, query, config);
        } catch (e) {
            console.error(e);
            return;
        }
        return this.handlRes(response);
    }

    setToken(auth_token) {
        let {access_token,token_type}=auth_token;
        //注册本地缓存
        window.localStorage.setItem('token',access_token);
        window.localStorage.setItem('token_type',token_type);
        axios.defaults.headers.common['Authorization'] =`${token_type} ${access_token}`;

    }
}


export default Ajax;