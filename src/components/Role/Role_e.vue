<template>
    <div>
        <Form ref="roleForm" :model="form" :rules="ruleValidate" :label-width="80">
            <Row :gutter="16">
                <Col span="10">
                <Card>
                    <p slot="title">角色信息</p>
                    <FormItem label="角色名称" prop="roleName">
                        <Input v-model="form.roleName" placeholder="输入角色名称..." size="small"></Input>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model="form.remark" placeholder="输入备注..." size="small"></Input>
                    </FormItem>
                </Card>
                <Card>
                    <p slot="title">
                        授权用户
                    </p>
                    <CheckboxGroup v-model="form.auths">
                        <Checkbox v-for="auth in authList" :label="auth.cUser_Id" :key="auth.cUser_Id">
                            <span>{{auth.cUser_Name+'['+auth.cUser_Id+']'}}</span>
                        </Checkbox>
                    </CheckboxGroup>
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
                form: {
                    roleId: '',
                    roleName: '',
                    remark: '',
                    users: [],
                    auths: [],
                    relations: [],
                },
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
        computed: {},
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
            buildAuth() {
                let {users = []} = this.form;
                users =this.$_.orderBy(users,['cUser_Id']);
                this.$_.each(users, (v, i) => {
                    let {cUser_Id, cUser_Name} = v;
                    this.authList.unshift({cUser_Id, cUser_Name})
                });
            },
            getMenuChecked(menuList) {
                return this.$_.map(menuList, (node) => {
                    return node.value
                }).join();
            },
            async getAuth() {
                let authList = [];
                let result;
                result = await this.$http.get(`/v1/auth/empty`);
                if (result && result.isSuc) {
                    authList = result.data.authsList;
                    if (authList && authList.length) {
                        authList =this.$_.orderBy(authList,['cUser_Id']);
                        this.authList = this.$_.map(authList, (v, i) => {
                            let {cUser_Id, cUser_Name} = v;
                            return {cUser_Id, cUser_Name};
                        });
                    }
                    this.buildAuth();
                } else {
                    this.$Message.error(result ? result.data.msg : '网络异常');
                }
            },
            async getRole(id) {
                const msg = this.$Message.loading({
                    content: 'Loading...',
                    duration: 0
                });
                let result = await this.$http.get(`/v1/role/${id}/edit`);
                if (result && result.isSuc) {
                    this.$_.each(this.form, (v, k) => {
                        this.form[k] = result.data.role[k];
                    });
                    this.form.auths = this.$_.map(this.form.users, (v, i) => {
                        return v.cUser_Id;
                    });
                    this.btnDis = false;
                    msg();
                }
            },
            async saveRole(menuList) {
                let form = this.$_.assign({}, this.form);
                form.checkedMenu = this.getMenuChecked(menuList);
                form.users = form.users.join();
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
                let form = this.$_.assign({}, this.form);
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
                        this.menuList = this.$helper.buildMenu(menuList, this.form.relations);
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
            //首先获取菜单和授权
            await Promise.all([this.getMenu(), this.getAuth()]);
            this.btnDis = false
        }
    }
</script>

<style scoped>

</style>