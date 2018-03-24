<template>
    <div>
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
                        <Menu ref="indexMenu" theme="light" width="auto" @on-select="changeMenu"
                              :active-name="activeName"
                              :open-names="openName">
                            <MenuItem name="1">
                                <Icon type="android-compass"></Icon>
                                <router-link to="/index/content">首页</router-link>
                            </MenuItem>
                            <Submenu v-for="(menu,index) in menus" :name="menu.index" :key="index">
                                <template slot="title">
                                    <Icon :type="menu.icon || ''"></Icon>
                                    {{menu.title}}
                                </template>
                                <template v-for="(item,i_index) in menu.children">
                                    <template v-if="item.url">
                                        <router-link :to="item.url" v-for="" :key="i_index">
                                            <MenuItem :name="item.index">
                                                {{item.title}}
                                            </MenuItem>
                                        </router-link>
                                    </template>
                                    <template v-else>
                                        <MenuItem :name="item.index">
                                            {{item.title}}
                                        </MenuItem>
                                    </template>

                                </template>

                            </Submenu>
                        </Menu>
                    </Sider>
                    <Layout :style="{padding: '0 6px 6px'}">
                        <Breadcrumb :style="{margin: '12px 0'}">
                            <BreadcrumbItem v-for="(bread,index) in breadcrumbs " :key="index">
                                {{bread.title}}
                            </BreadcrumbItem>
                        </Breadcrumb>
                        <content :style="{ minHeight: '280px', background: '#fff'}">
                            <router-view></router-view>
                        </content>
                    </Layout>
                </Layout>
            </Layout>
        </div>
        <div>
            <pwd-change-modal></pwd-change-modal>
        </div>
    </div>
</template>
<script>
    import PwdChangeModal from './Modals/PwdChangeModal';

    export default {
        name: "Index",
        data() {
            return {
                activeName: '1-1',
                openName: [1],
                menus: [],
                pwdStatus: false,
                breadcrumbs: [{url: '', value: '首页'}, 'test2', 'test3'],
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
            let curName = this.$store.getters.getIndex;
            this.createMenu(curName);
            this.buildBreadcrumb(curName);

        },
        methods: {
            createMenu(name) {
                this.menus = this.$helper.buildMenu(this.$store.getters.getMenus);

                if (name) {
                    this.openName = [parseInt(name.toString().substring(0, 1))];
                    this.activeName = name;
                    this.$nextTick(function () {
                        this.$refs['indexMenu'].updateOpened();
                        this.$refs['indexMenu'].updateActiveName();
                    })
                }
            },
            buildBreadcrumb(name) {
                let breadcrumbs;
                if (name) {
                    if (name === '1') {
                        this.breadcrumbs = [{title: '首页'}];
                        return;
                    }
                    let indexs = name.split('-');
                    let curMenu;
                    let parentMenu;
                    let parentIndex;
                    let curIndex;
                    if (indexs && indexs.length > 1) {
                        parentIndex = parseInt(indexs[0]) - 2;
                        curIndex = parseInt(indexs[1]) - 2;
                        parentMenu = this.menus[parentIndex];
                        curMenu = parentMenu.children[curIndex];
                        breadcrumbs = [parentMenu, curMenu];
                    } else {
                        curIndex = parseInt(indexs[0]) - 2;
                        curMenu = this.menus[curIndex];
                        breadcrumbs = [curMenu];
                    }
                }

                this.breadcrumbs = breadcrumbs || [];
            },
            changeMenu(name) {
                this.buildBreadcrumb(name);
                //注册当前索引
                this.$store.commit('SET_MENU_INDEX', name);
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
            showChangePwd() {
                this.$store.commit('setModalStatus',true);
            },
            changeHeadMenu(name) {
                switch (name) {
                    case '1-1':
                        this.showChangePwd();
                        break;
                    case '1-2':
                        this.logout();
                        break;
                }
            }
        },
        components: {
            'pwd-change-modal': PwdChangeModal
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