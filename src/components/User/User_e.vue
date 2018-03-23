<template>
    <div>
        <Form ref="UserForm" :model="formItem" :rules="ruleValidate" :label-width="80">
            <Row>
                <Col span="8">
                <FormItem label="工号" prop="cUser_Id">
                    <Input v-model="formItem.cUser_Id" placeholder="输入工号..." :disabled="cNoDis"></Input>
                </FormItem>
                </Col>
                <Col span="8" offset="2">
                <FormItem label="姓名" prop="cUser_Name">
                    <Input v-model="formItem.cUser_Name" placeholder="输入姓名..."></Input>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="8">
                <FormItem label="密码" prop="cPassword">
                    <Input v-model="formItem.cPassword" placeholder="输入密码..." type="password"></Input>
                </FormItem>
                </Col>
                <Col span="8" offset="2">
                <FormItem label="确认密码" prop="RePassword">
                    <Input v-model="formItem.RePassword" placeholder="确认密码..." type="password"></Input>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="8">
                <FormItem label="手机号">
                    <Input v-model="formItem.cPhone" placeholder="输入手机号..."></Input>
                </FormItem>
                </Col>
                <Col span="8" offset="2">
                <FormItem label="单位/部门" prop="cUnit">
                    <Cascader :data="buildUnit" v-model="formItem.cUnit" placeholder="请选择单位/部门"
                              change-on-select></Cascader>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="8" >
                <FormItem label="状态">
                    <Select v-model="formItem.nState">
                        <Option value="0">启用</Option>
                        <Option value="1">停用</Option>
                    </Select>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="18">
                <FormItem label="签名">
                    <Upload
                            multiple
                            type="drag"
                            action="//jsonplaceholder.typicode.com/posts/">
                        <div style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>点击或拖入文件</p>
                        </div>
                    </Upload>
                </FormItem>
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
        name: "user_e",
        data() {
            let oThis = this;
            const validatePass = function (rule, value, callback) {
                if (value.length < 3) {
                    callback(new Error('请您输入密码长度大于3'));
                } else if (value.length >= 10) {
                    callback(new Error('请您输入密码长度小于10'));
                } else {
                    if (oThis.formItem.RePassword !== '') {
                        // 对第二个密码框单独验证
                        oThis.$refs.UserForm.validateField('RePassword');
                    }
                    callback();
                }
            };
            const validatePassCheck = function (rule, value, callback) {
                if (value == '') {
                    callback(new Error('请您输入重复密码'));
                } else if (value != oThis.formItem.cPassword) {
                    callback(new Error('您第二次输入的密码不匹配'));
                }
                callback();
            }
            const validateUnit = function (rule, value, callback) {
                if (value == '') {
                    callback(new Error('请您选择单位'));
                }
                callback();
            };
            return {
                curId: '-1',
                btnDis: true,
                cNoDis: false,
                formItem: {
                    cUser_Id: '',
                    cUser_Name: '',
                    cPassword: '',
                    RePassword: '',
                    cPhone: '',
                    cUnit: [],
                    nState: "0"
                },
                title: '编辑',
                unitList: [],
                ruleValidate: {
                    cUser_Id: [
                        {required: true, message: '请您输入数字工号', trigger: 'blur'},
                    ],
                    cUser_Name: [
                        {required: true, message: '请您输入姓名', trigger: 'blur'},
                    ],
                    cPassword: [
                        {required: true, message: '请您输入密码', trigger: 'blur'},
                        {validator: validatePass, trigger: 'blur'},

                    ],
                    RePassword: [
                        {required: true, message: '请您重复密码', trigger: 'blur'},
                        {validator: validatePassCheck, trigger: 'blur'},
                    ],
                    cUnit: [
                        {required: true, type: 'array', message: '请您选择单位/部门', trigger: 'change'},
                    ],
                }
            }
        },
        computed: {
            buildUnit: function () {
                return this.$helper.buildUnit(this.unitList);
            }
        },
        methods: {
            handleSubmit() {
                this.btnDis = true;
                this.$refs["UserForm"].validate(async (valid) => {
                    if (valid) {
                        const msg = this.$Message.loading({
                            content: 'Loading...',
                            duration: 0
                        });
                        if (this.curId === '-1') {
                            this.saveUser();
                        } else {
                            this.updateUser();
                        }
                        msg();
                    }
                    this.btnDis = false;
                })
            },
            handleReset() {
                this.$router.push('/index/users');
            },
            async getUser(id) {
                const msg = this.$Message.loading({
                    content: 'Loading...',
                    duration: 0
                });
                let result = await this.$http.get(`/v1/user/${id}/edit`);
                if (result && result.isSuc) {
                    let info = result.data.info;

                    this.$_.each(this.formItem, (v, k) => {
                        if (k === "RePassword") {
                            this.formItem[k] = info.cPassword;
                        } else if (k === "cUnit") {
                            let cUnit = info[k];
                            let tempUnit = [];
                            if (cUnit && cUnit.length > 2) {
                                tempUnit.push(cUnit.substring(0, 2));
                                tempUnit.push(cUnit);
                            } else {
                                tempUnit.push(cUnit);
                            }
                            this.formItem[k] = tempUnit;
                        } else if (info[k]) {
                            this.formItem[k] = info[k].toString();
                        }
                    });
                    this.btnDis = false;
                    msg();
                }
            },
            async saveUser() {
                let form = this.$_.assign({}, this.formItem);
                form.cUnit = this.$_.last(form.cUnit);
                let result;
                result = await this.$http.post(`/v1/user`, form);
                if (result && result.isSuc) {
                    this.$Message.success(result ? result.data.msg : '网络异常');
                    this.$router.push('/index/users');
                } else {
                    this.$Message.error(result ? result.data.msg : '网络异常');
                }

            },
            async updateUser() {
                let form = this.$_.assign({}, this.formItem);
                form.cUnit = this.$_.last(form.cUnit);
                let result;
                result = await this.$http.put(`/v1/user/${this.curId}`, form);
                if (result && result.isSuc) {
                    this.$Message.success(result ? result.data.msg : '网络异常');
                    this.$router.push('/index/users');
                } else {
                    this.$Message.error(result ? result.data.msg : '网络异常');
                }
            },
            async getUnit() {
                let result;
                result = await this.$http.get(`/v1/unit`, {isPage: false});
                if (result && result.isSuc) {
                    this.unitList = result.data.unitList;
                } else {
                    this.$Message.error(result ? result.data.msg : '网络异常');
                }
            },
        },
        mounted: async function () {
            this.curId = this.$route.params.id || '-1';
            await  this.getUnit();
            if (this.curId !== '-1') {
                this.cNoDis = true;
                this.getUser(this.curId);
            }

            this.btnDis = false
        },
    }
</script>

<style scoped>

</style>