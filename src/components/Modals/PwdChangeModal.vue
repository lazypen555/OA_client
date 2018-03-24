<template>
    <div>
        <Modal
                v-model="showModal"
                title="修改密码"
                :loading="loading"
                :mask-closable="false"
                @on-ok="handleSubmit"
                @on-cancel="handleReset">
            <Form ref="pwdForm" :model="form" :rules="ruleValidate" :label-width="100">
                <Row>
                    <Col span="20">
                    <FormItem label="原密码" prop="oldPwd">
                        <Input v-model="form.oldPwd" placeholder="输入原密码..." type="password"></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="20">
                    <FormItem label="新密码" prop="newPwd">
                        <Input v-model="form.newPwd" placeholder="输入新密码..." type="password"></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="20">
                    <FormItem label="重复新密码" prop="rePwd">
                        <Input v-model="form.rePwd" placeholder="重复新密码..." type="password"></Input>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: "pwd-change-modal",
        // props: {
        //     showStatus: {
        //         type: Boolean,
        //         default: false
        //     }
        // },
        computed: {
            showModal: function () {
                return this.$store.state.modal.pwdModal;
            }
        },
        data() {
            let oThis = this;
            const validatePass = function (rule, value, callback) {
                if (value.length < 3) {
                    callback(new Error('请您输入密码长度大于3'));
                } else if (value.length >= 10) {
                    callback(new Error('请您输入密码长度小于10'));
                } else {
                    if (oThis.form.rePwd !== '') {
                        // 对第二个密码框单独验证
                        oThis.$refs.pwdForm.validateField('rePwd');
                    }
                    callback();
                }
            };
            const validatePassCheck = function (rule, value, callback) {
                if (value == '') {
                    callback(new Error('请您输入重复密码'));
                } else if (value != oThis.form.newPwd) {
                    callback(new Error('您第二次输入的密码不匹配'));
                }
                callback();
            };
            return {
                loading: true,
                form: {
                    oldPwd: '',
                    newPwd: '',
                    rePwd: '',
                },
                ruleValidate: {
                    oldPwd: [
                        {required: true, message: '请您输入原密码', trigger: 'blur'},
                    ],
                    newPwd: [
                        {required: true, message: '请您输入新密码', trigger: 'blur'},
                        {validator: validatePass, trigger: 'blur'},

                    ],
                    rePwd: [
                        {required: true, message: '请您重复新密码', trigger: 'blur'},
                        {validator: validatePassCheck, trigger: 'blur'},
                    ],
                }
            };
        },
        methods: {
            handleLoading() {
                this.loading = false;
                this.$nextTick(function () {
                    this.loading = true;
                });
            },
            handleSubmit() {
                this.$refs["pwdForm"].validate(async (valid) => {
                    if (valid) {

                        const msg = this.$Message.loading({
                            content: 'Loading...',
                            duration: 0
                        });

                        await this.changePwd();
                        debugger
                        msg();

                    } else {
                        this.handleLoading();
                    }
                })
            },
            handleReset() {
                this.$refs.pwdForm.resetFields();
                this.$store.commit('setModalStatus', false);
            },
            async changePwd() {
                let form = this.$_.assign({}, this.form);
                let {cUser_Id} = this.$store.getters.getUser;
                form.cUser_Id = cUser_Id;
                let result;
                result = await this.$http.post(`/v1/api/changePwd`, form);
                if (result && result.isSuc) {
                    this.$Message.success(result ? result.data.msg : '网络异常');
                    this.handleReset();
                } else {

                    this.$Message.error(result ? result.data.msg : '网络异常');
                    this.handleLoading();
                }
            },
        }
    }
</script>

<style scoped>

</style>