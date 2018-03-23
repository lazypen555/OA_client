<template>
    <div class="layout">
        <Layout>
            <Header>
                <Menu mode="horizontal" theme="dark" @on-select="changeHeadMenu" :accordion=true>
                    <div class="layout-logo"><h3>discipline</h3></div>
                    <div class="layout-nav">
                        <Submenu name="1">
                            <template slot="title">
                                <Icon type="ios-navigate"></Icon>
                                {{Account}}
                            </template>
                            <MenuItem name="1-1">修改密码</MenuItem>
                            <MenuItem name="1-2">退出</MenuItem>
                        </Submenu>
                        <MenuItem name="2">
                            <Icon type="ios-paper"></Icon>
                            通知
                        </MenuItem>
                    </div>
                </Menu>
            </Header>
            <Layout>
                <Sider hide-trigger :style="{background: '#fff'}">
                    <Menu ref="indexMenu" theme="light" width="auto" @on-select="changeMenu" :active-name="activeName" :open-names="openName">

                        <Submenu v-for="(menu,index) in menus" :name="menu.index" :key="index">
                            <template slot="title">
                                <Icon :type="menu.icon || ''"></Icon>
                                {{menu.title}}
                            </template>

                            <MenuItem :name="item.index" v-for="(item,i_index) in menu.children" :key="i_index">
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
                        <BreadcrumbItem v-for="(bread,index) in breadcrumbs " :to="bread.url" :key="index">
                            {{bread.value}}
                        </BreadcrumbItem>
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
        name: "Index",
        data() {
            return {
                activeName:'1-1',
                openName:[1],
                menus: [],
                breadcrumbs: [],
            };
        },
        computed: {
            Account: function () {
                let user = this.$store.getters.getUser;
                return `${user.cUser_Name}[${user.cUser_Id}]`;
            }
        },
        async mounted() {
            let store = this.$store;
            await Promise.all([store.dispatch('initMenus'), store.dispatch('initAuths')]);
            this.createMenu();

        },
        methods: {
            createMenu() {
                this.menus = this.$helper.buildMenu(this.$store.getters.getMenus);
                let curIndx = this.$store.getters.getIndex;

                if(curIndx) {
                    this.openName = [parseInt(curIndx.toString().substring(0,1))];
                    this.activeName=curIndx;
                    this.$nextTick(function () {
                        this.$refs['indexMenu'].updateOpened();
                        this.$refs['indexMenu'].updateActiveName();
                    })
                }
            },
            buildBreadcrumb(){

            },
            changeMenu(name) {
                this.$store.commit('SET_MENU_INDEX',name);
            },
            async logout() {
                this.$Modal.confirm({
                    content: '您是否要退出系统?',
                    onOk: async () => {
                        await this.$store.dispatch('removeToken');
                        this.$router.push('/login');
                    }
                })

            },
            changePwd() {

            },
            changeHeadMenu(name) {
                switch (name) {
                    case '1-1':
                        this.changePwd();
                        break;
                    case '1-2':
                        this.logout();
                        break;
                }
            },
        }
    };
</script>
<style scoped>
    .ivu-layout-header {
        background: #2b85e4;
    }

    .ivu-menu-dark {
        background: #2b85e4;
    }

    .layout {
        border: 1px solid #d7dde4;
        background: #2b85e4;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }

    .layout-nav {
        width: 420px;
        margin: 0 auto;
        margin-right: 0px;
    }

    .layout-logo {
        width: 100px;
        float: left;
    }
</style>