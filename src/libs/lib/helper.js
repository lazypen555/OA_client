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

    }

}


export default Helper;