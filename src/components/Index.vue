<template>
    <div class="layout">
        <Layout>
            <Header>
                <Menu mode="horizontal" theme="dark" active-name="1">
                    <div class="layout-logo"></div>
                    <div class="layout-nav">
                        <MenuItem name="1">
                            <Icon type="ios-navigate"></Icon>
                             账户
                        </MenuItem>
                        <MenuItem name="2">
                            <Icon type="ios-keypad"></Icon>
                             功能
                        </MenuItem>
                        <MenuItem name="3">
                            <Icon type="ios-analytics"></Icon>
                             收藏
                        </MenuItem>
                        <MenuItem name="4">
                            <Icon type="ios-paper"></Icon>
                             通知
                        </MenuItem>
                    </div>
                </Menu>
            </Header>
            <Layout>
                <Sider hide-trigger :style="{background: '#fff'}">
                    <Menu ref="indexMenu" active-name="1-2" theme="light" width="auto" :open-names="['1']">
                        <Submenu v-for="(menu,index) in menus" :name="index" :key="index">
                            <template slot="title">
                                <Icon :type="menu.icon || ''"></Icon>
                                {{menu.title}}
                            </template>
                            <MenuItem :name="index+'-'+i_index" v-for="(item,i_index) in menu.children" :key="i_index">
                                <template v-if="item.url">
                                    <router-link :to="item.url">{{item.title}}</router-link>
                                </template>
                                <template v-else>
                                    {{item.title}}
                                </template>
                            </MenuItem>
                        </Submenu>
                    </Menu>
                </Sider>
                <Layout :style="{padding: '0 6px 6px'}">
                    <Breadcrumb :style="{margin: '12px 0'}">
                        <BreadcrumbItem v-for="(bread,index) in breadcrumbs " :to="bread.url" :key="index" >{{bread.value}}</BreadcrumbItem>
                    </Breadcrumb>
                    <content :style="{ minHeight: '280px', background: '#fff'}">
                        <router-view></router-view>
                    </content>
                </Layout>
            </Layout>
        </Layout>
    </div>
</template>
<script>
    export default {
        name:"Index",
        data() {
            return {
                menus:[],
                breadcrumbs:[],
            };
        },
        async mounted() {
            let store= this.$store;
            await Promise.all([store.dispatch('initMenus'), store.dispatch('initAuths')]);
            this.createMenu();
        },
        methods:{
            createMenu(){
                this.menus =this.$helper.buildMenu(this.$store.getters.getMenus);
                console.log(this.menus);
            }
        },
        components:{

        }
    };
</script>
<style scoped>
    .ivu-layout-header {
        background: #2b85e4;
    }
    .ivu-menu-dark{
        background: #2b85e4;
    }
    .layout{
        border: 1px solid #d7dde4;
        background: #2b85e4;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-logo{
        width: 100px;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: 20px;
    }
    .layout-nav{
        width: 420px;
        margin: 0 auto;
        margin-right: 20px;
    }
</style>