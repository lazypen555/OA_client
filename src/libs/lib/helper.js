import _ from 'lodash';

class Helper {
    constructor() {

    }

    getSendWhere(where) {
        let realWhere = {};
        _.each(where, (v, k) => {
            if (v && v !== '-1') {
                if(_.isArray(v)){
                    let lastVal = _.last(v);
                    if(lastVal!=='-1') {
                        realWhere[k] = lastVal;
                    }
                }else {
                    realWhere[k] = v;
                }
            }
        });
        return realWhere;
    }

    buildMenu(menuList,relations=[]){
        //递归调用创建menu
        let createMenu = (menuId, vNode) => {
            let childrens = _.filter(menuList, {parentId: menuId});
            childrens= _.orderBy(childrens,['menuNo']);

            if (childrens && childrens.length) {
                _.each(childrens, (v, i) => {
                    let child_vNode = {title: v.menuName,value: v.menuId, children: [], expand: true,url:v.menuUrl};
                    vNode.children.push(child_vNode);
                    createMenu(v.menuId, child_vNode);
                });
            }else{
                vNode.checked= !!_.find(relations,{menuId:vNode.value});
            }
            return vNode;
        };
        let menu=[];
        if (menuList && menuList.length) {
            let oneList = _.filter(menuList, {parentId: 0});
            oneList= _.orderBy(oneList,['menuNo']);

            _.each(oneList, (v, i) => {
                let vNode = {title: v.menuName, value: v.menuId, children: [], expand: true,icon:v.icon};
                menu.push(createMenu(v.menuId, vNode))
            });
        }
        return menu;
    }

    buildDept(deptLiST){
        let createMenu = (cNo, vNode) => {
            let childrens = _.filter(deptLiST, {parentId: cNo});
            childrens= _.orderBy(childrens,['cNo']);

            if (childrens && childrens.length) {
                _.each(childrens, (v, i) => {
                    let child_vNode = {label: v.cName,value: v.cNo, children: []};
                    vNode.children.push(child_vNode);
                    createMenu(v.cNo, child_vNode);
                });
            }else{
                delete vNode.children;
            }
            return vNode;
        };
        let dept=[];
        if (deptLiST && deptLiST.length) {
            let oneList = _.filter(deptLiST, {parentId: '0'});
            oneList= _.orderBy(oneList,['cNo']);

            _.each(oneList, (v, i) => {
                let vNode = {value: v.cNo, label: v.cName, children: []};
                dept.push(createMenu(v.cNo, vNode))
            });
        }
        return dept;

    }

}


export default Helper;