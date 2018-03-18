<template>
    <div>
        <Form ref="roleForm" :model="formItem" :rules="ruleValidate" :label-width="80">
            <Row :gutter="16">
                <Col span="6">
                <Card>
                    <p slot="title">角色信息</p>
                    <FormItem label="角色名称" prop="roleName">
                        <Input v-model="formItem.roleName" placeholder="输入角色名称..." size="small"></Input>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model="formItem.remark" placeholder="输入备注..." size="small"></Input>
                    </FormItem>
                    <FormItem>
                        <Card>
                            <p slot="title">
                                授权用户
                            </p>
                            <p slot="extra">
                                添加
                            </p>
                            <Table height="400" ref="selection" stripe border :loading="tableLoading" :columns="columns" :data="data"
                                   @on-sort-change="order"></Table>
                        </Card>
                    </FormItem>
                </Card>
                </Col>
                <Col span="10">
                <Card>
                    <p slot="title">角色权限</p>
                    <Tree ref="menuTree" :data="menuList" show-checkbox multiple></Tree>
                </Card>
                </Col>
            </Row>
            <FormItem>
                <Button type="primary" :disabled="btnDis" @click="handleSubmit">提交</Button>
                <Button type="ghost" :disabled="btnDis" style="margin-left: 8px" @click="handleReset">取消</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
    export default {
        name: "role_e",
        data() {
            return {
                curId: -1,
                btnDis: true,
                formItem: {
                    roleId: '',
                    roleName: '',
                    remark: '',
                    users: [],
                    relations: [],
                },
                columns: [
                    {
                        title: '角色名称',
                        key: 'cUser_Name',
                        width: 200,
                    },
                    {
                        title: '状态',
                        key: 'nState',
                        width: 150,
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.status === 0 ? ' green' : 'red';
                            const text = row.status === 0 ? '启用' : '停用';

                            return h('Tag', {
                                props: {
                                    type: 'dot',
                                    color: color,
                                    readonly: true
                                }
                            }, text);
                        }
                    },
                    {
                        title: '备注',
                        key: 'remark'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.delUser(params.row.cUser_Id);
                                        }
                                    }
                                }, '删除')
                            ])
                        }
                    }
                ],
                title: '编辑',
                menuList: [],
                authList: [],
                ruleValidate: {
                    roleName: [
                        {required: true, message: '请您输入角色名称', trigger: 'blur'},
                    ]
                }
            }
        },
        methods: {
            handleSubmit() {
                this.btnDis = true;
                this.$refs["roleForm"].validate(async (valid) => {
                    let menuList = this.$refs['menuTree'].getCheckedNodes();
                    if (valid && !menuList.length) {
                        this.$Message.warning('请您勾选菜单权限');
                        valid = false
                    }

                    if (valid) {
                        const msg = this.$Message.loading({
                            content: 'Loading...',
                            duration: 0
                        });
                        if (this.curId === -1) {
                            this.saveRole(menuList);
                        } else {
                            this.updateRole(menuList);
                        }
                        msg();
                    }
                    this.btnDis = false;
                })
            },
            handleReset() {
                this.$router.push('/index/roles');
            },
            createAuth() {
                let {users = []} = this.formItem;
                debugger;
                let authUserList = this.$_.map(users, (v, i) => {
                    let {cUser_Name, nState} = v;
                    let nStateColor = nState === 0 ? ' green' : 'red';
                    nState = nState === 0 ? '启用' : '停用';
                    return {nStateColor, cUser_Name, nState};
                });
                this.authList = authUserList;

            },
            getMenuChecked(menuList) {
                return this.$_.map(menuList, (node) => {
                    return node.value
                }).join();
            },
            async getRole(id) {
                const msg = this.$Message.loading({
                    content: 'Loading...',
                    duration: 0
                });
                let result = await this.$http.get(`/v1/role/${id}/edit`);
                if (result && result.isSuc) {
                    this.$_.each(this.formItem, (v, k) => {
                        this.formItem[k] = result.data.role[k];
                    });
                    //构建授权
                    this.createAuth();
                    this.btnDis = false;
                    msg();
                }
            },
            async saveRole(menuList) {
                let form = this.$_.assign({}, this.formItem);
                form.checkedMenu = this.getMenuChecked(menuList);
                let result;
                result = await this.$http.post(`/v1/role`, form);
                if (result && result.isSuc) {
                    this.$Message.success(result ? result.data.msg : '网络异常');
                    this.$router.push('/index/roles');
                } else {
                    this.$Message.error(result ? result.data.msg : '网络异常');
                }

            },
            async updateRole(menuList) {
                let form = this.$_.assign({}, this.formItem);
                form.checkedMenu = this.getMenuChecked(menuList);
                let result;
                result = await this.$http.put(`/v1/role/${this.curId}`, form);
                if (result && result.isSuc) {
                    this.$Message.success(result ? result.data.msg : '网络异常');
                    this.$router.push('/index/roles');
                } else {
                    this.$Message.error(result ? result.data.msg : '网络异常');
                }
            },
            async getMenu() {
                let menuList = [];
                let result;
                result = await this.$http.get(`/v1/menu`);
                if (result && result.isSuc) {
                    menuList = result.data.menuList;
                    if (menuList && menuList.length) {
                        this.menuList = this.$helper.buildMenu(menuList, this.formItem.relations);
                    }
                } else {
                    this.$Message.error(result ? result.data.msg : '网络异常');
                }
            },
        },
        mounted: async function () {
            this.curId = parseInt(this.$route.params.id || -1);
            let id = this.curId;
            if (this.curId !== -1) {
                //获取选中菜单和授权
                await this.getRole(id);
            }
            //首先获取菜单
            await this.getMenu();
            this.btnDis = false
        },
    }
</script>

<style scoped>

</style>