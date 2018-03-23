<template>
    <div class="loginPage">
        <div class="form">
            <Row>
                <Col :span="24" class-name="loginTitle">
                <h1>管教平台</h1>
                </Col>
            </Row>

            <Form :model="ruleForm" ref="ruleForm" :rules="rules">
                <Row>
                    <Col :span="22" offset="2" class-name="loginTitle" style="font-size: large" >
                    <FormItem prop="username" label="账号" >
                        <Input v-model="ruleForm.username" size="large" type="text" @on-enter="submitForm('ruleForm')"  style="width:300px">
                        <Icon type="ios-person-outline" slot="append"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem style="color: #fff;" prop="password" label="密码">
                        <Input v-model="ruleForm.password" size="large" type="password"
                               @on-enter="submitForm('ruleForm')" style="width:300px">
                        <Icon type="ios-locked-outline" slot="append"></Icon>
                        </Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col :span="24" class-name="loginTitle">
                    <FormItem label="">
                        <Button type="primary" @click="submitForm('ruleForm')" :disabled="btnDis">登 录</Button>
                        <Button type="info" @click="clearForm('ruleForm')" :disabled="btnDis">重 置</Button>
                    </FormItem>
                    </Col>
                </Row>
            </Form>

        </div>
    </div>
</template>

<script>
    import config from '../../config/config'

    export default {
        name: "Login",
        data() {

            const validateUs = function (rule, value, callback) {
                if (value == '') {
                    callback(new Error('请您输入单位'));
                }
                callback();
            };
            const validatePd = function (rule, value, callback) {
                if (value == '') {
                    callback(new Error('请您输入密码'));
                }
                callback();
            };

            return {
                ruleForm: {
                    username: "",
                    password: ""
                },
                btnDis: false,
                rules: {
                    username: [
                        {validator: validateUs, trigger: 'blur'},
                    ],
                    password: [
                        {validator: validatePd, trigger: 'blur'},
                    ]
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.btnDis = true;
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.login();
                    }
                    this.btnDis = false;
                });
            },
            clearForm(formName) {
                this.$refs[formName].resetFields();
            },
            async login() {
                let result;
                let {grant_type} = config.oAuth;
                let params = this.$_.assign({}, this.ruleForm);
                params.grant_type = grant_type || 'password';
                result = await this.$http.post('/v1/api/login', params);
                if (result && result.isSuc) {
                    let token = result.data;
                    token.username=params.username;
                    //注册state
                    await this.$store.dispatch('registerToken', token);
                    this.$router.push('/index');
                } else {
                    //oauth2 限制
                    this.$Message.error('用户名或密码错误');
                }
            }
        }
    };
</script>

<style scoped>
    .loginPage {
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0px;
        bottom: 0px;
        background: url("../../img/bg_login.jpg") no-repeat center center fixed;
        z-index: 0;
        overflow: hidden;
        word-break: break-all;
    }

    .form {
        background-size: auto;
        position: absolute;
        width: 450px;
        height: 350px;
        top: 50%;
        left: 50%;
        margin-left: -255px;
        margin-top: -100px;
        background-color: rgba(255, 255, 255, 0.4);
        font-size: 20px;
        font-weight: bold;
        border-radius: 15px;
    }

    .loginTitle {
        text-align: center;
        color: #063967;
        top: 50px;
    }

    .el-button {
        margin-top: 20px;
    }

    .el-form-item__label {
        color: #fff;
    }
</style>