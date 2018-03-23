
import _ from 'lodash';

class Helper {
    constructor() {

    }

    setLocalStorage(key, obj) {
        let val;
        if (obj && _.isObject(obj)) {
            try {
                val = JSON.stringify(obj);
            } catch (e) {
                console.log(e)
            }
        } else {
            val = obj;
        }
        window.localStorage.setItem(key, val);
    }

    getLocalStorage(key) {
        let val = window.localStorage.getItem(key);
        if (val) {
            try {
                val = JSON.parse(val);
            } catch (e) {

            }
        }
        return val;

    }

    delLocalStorage(key) {
        window.localStorage.removeItem(key);
    }

    getSendWhere(where) {
        let realWhere = {};
        _.each(where, (v, k) => {
            if (v && v !== '-1') {
                if (_.isArray(v)) {
                    let lastVal = _.last(v);
                    if (lastVal !== '-1') {
                        realWhere[k] = lastVal;
                    }
                } else {
                    realWhere[k] = v;
                }
            }
        });
        return realWhere;
    }
    buildMenu(menuList, relations = []) {
        //递归调用创建menu
        let createMenu = (menuId, vNode) => {
            let childrens = _.filter(menuList, {parentId: menuId});
            childrens = _.orderBy(childrens, ['menuNo']);

            if (childrens && childrens.length) {
                _.each(childrens, (v, i) => {
                    let child_vNode = {title: v.menuName, value: v.menuId, children: [], expand: true, url: v.menuUrl,index:`${vNode.index}-${i+1}` };
                    vNode.children.push(child_vNode);
                    createMenu(v.menuId, child_vNode);
                });
            } else {
                vNode.checked = !!_.find(relations, {menuId: vNode.value});
            }
            return vNode;
        };
        let menu = [];
        if (menuList && menuList.length) {
            let oneList = _.filter(menuList, {parentId: 0});
            oneList = _.orderBy(oneList, ['menuNo']);

            _.each(oneList, (v, i) => {
                let vNode = {title: v.menuName, value: v.menuId, children: [], expand: true, icon: v.icon,index:(i+1)};
                menu.push(createMenu(v.menuId, vNode))
            });
        }
        return menu;
    }

    buildUnit(unitLis) {
        let createMenu = (cNo, vNode) => {
            let childrens = _.filter(unitLis, {parentId: cNo});
            childrens = _.orderBy(childrens, ['cNo']);

            if (childrens && childrens.length) {
                _.each(childrens, (v, i) => {
                    let child_vNode = {label: v.cName, value: v.cNo, children: []};
                    vNode.children.push(child_vNode);
                    createMenu(v.cNo, child_vNode);
                });
            } else {
                delete vNode.children;
            }
            return vNode;
        };
        let unit = [];
        if (unitLis && unitLis.length) {
            let oneList = _.filter(unitLis, {parentId: '0'});
            oneList = _.orderBy(oneList, ['cNo']);

            _.each(oneList, (v, i) => {
                let vNode = {value: v.cNo, label: v.cName, children: []};
                unit.push(createMenu(v.cNo, vNode))
            });
        }
        return unit;

    }
}


export default Helper;