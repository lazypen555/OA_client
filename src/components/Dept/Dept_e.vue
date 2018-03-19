<template>
    <div>
        <Form ref="UserForm" :model="form" :rules="ruleValidate" :label-width="80">
            <Row>
                <Col span="8">
                <form label="是否单位">
                    <Select v-model="form.isUnit" >
                        <Option value="0">是</Option>
                        <Option value="1">否</Option>
                    </Select>
                </form>
                </Col>>
            </Row>
            <Row>
                <Col span="6">
                <form label="上级部门" prop="parentId">
                    <Select v-model="form.parentId" >
                        <Option v-for="">启用</Option>
                        <Option value="1">停用</Option>
                    </Select>
                </form>
                </Col>
                <Col span="6" offset="2">
                <form label="编号" prop="cNo">
                    <Input v-model="form.cPassword" placeholder="输入编号..."  size="small"></Input>
                </form>
                </Col>
                <Col span="6" offset="2">
                <form label="名称" prop="cName">
                    <Input v-model="form.cName" placeholder="输入名称..."  size="small"></Input>
                </form>
                </Col>
            </Row>
            <Row>
                <Col span="6">
                <form label="是否生产单位">
                    <Select v-model="form.isProduct" >
                        <Option value="0">是</Option>
                        <Option value="1">否</Option>
                    </Select>
                </form>
                </Col>
                <Col span="6" offset="2">
                <form label="是否场所外" >
                    <Select v-model="form.isOut" >
                        <Option value="0">是</Option>
                        <Option value="1">否</Option>
                    </Select>
                </form>
                </Col>
                <Col span="6" offset="2">
                <form label="状态">
                    <Select v-model="form.status" >
                        <Option value="0">启用</Option>
                        <Option value="1">停用</Option>
                    </Select>
                </form>
                </Col>
            </Row>
            <Row>
                <Col span="8">
                <form label="remark">
                    <Input v-model="form.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                           placeholder=""></Input>
                </form>
                </Col>
            </Row>
            <form>
                <Button type="primary" :disabled="btnDis" @click="handleSubmit">提交</Button>
                <Button type="ghost" :disabled="btnDis" style="margin-left: 8px" @click="handleReset">取消</Button>
            </form>
        </Form>
    </div>
</template>
<script>
    export default {
        name: "user_e",
        data() {
            return {
                curId: '-1',
                btnDis: true,
                cNoDis: false,
                form: {
                    cNo: '',
                    cName: '',
                    status: '0',
                    isProduct: '0',
                    isOut: '0',
                    isUnit: '0',
                    parentId: '',
                    remark:''
                },
                title: '编辑',
                deptList: [],
                ruleValidate: {
                    cNo: [
                        {required: true, message: '请您输入数字工号', trigger: 'blur'},
                    ],
                    cName: [{required: true, message: '请您输入姓名', trigger: 'blur'}],
                }
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

                    this.$_.each(this.form, (v, k) => {
                        if (k === "RePassword") {
                            this.form[k] = info.cPassword;
                        } else if (k === "cDept") {
                            let cDept = info[k];
                            let tempDept=[];
                            if(cDept.length>3) {
                                tempDept.push(cDept.substring(0, 3));
                                tempDept.push(cDept);
                            }else{
                                tempDept.push(cDept);
                            }
                            this.form[k]= tempDept;
                        } else if (info[k]) {
                            this.form[k] = info[k].toString();
                        }
                    });
                    this.btnDis = false;
                    msg();
                }
            },
            async saveUser() {
                let form = this.$_.assign({}, this.form);
                form.cDept = this.$_.last(form.cDept)
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
                let form = this.$_.assign({}, this.form);
                form.cDept = this.$_.last(form.cDept);
                let result;
                result = await this.$http.put(`/v1/user/${this.curId}`, form);
                if (result && result.isSuc) {
                    this.$Message.success(result ? result.data.msg : '网络异常');
                    this.$router.push('/index/users');
                } else {
                    this.$Message.error(result ? result.data.msg : '网络异常');
                }
            },
            async getDept() {
                let result;
                result = await this.$http.get(`/v1/dept`);
                if (result && result.isSuc) {
                    let {parentList = [], childList = []} = result.data;
                    let tree = [];
                    if (parentList.length) {
                        tree = this.$_.map(parentList, (v, i) => {
                            let {cName, cNo} = v;
                            let children = this.$_.filter(childList, (cV, ci) => {
                                return cV.cNo.includes(cNo, 0);
                            });
                            children = this.$_.map(children, (cV, ci) => {
                                return {value: cV.cNo, label: cV.cName}
                            });
                            return {value: cNo, label: cName, children}
                        });
                    }
                    this.tree = tree;
                } else {
                    this.$Message.error(result ? result.data.msg : '网络异常');
                }
            },
            async getUnit() {
                let result;
                result = await this.$http.get(`/v1/unit`);
                if (result && result.isSuc) {
                    let {list = []} = result.data;
                    list = this.$_.map(list, (v, i) => {
                        return {value: v.cNo, label: v.cName};
                    });
                    this.unitList = list;
                } else {
                    this.$Message.error(result ? result.data.msg : '网络异常');
                }
            },
        },
        mounted: async function () {
            this.curId = this.$route.params.id || '-1';
            await Promise.all([this.getDept(), this.getUnit()]);
            if (this.curId !== '-1') {
                this.cNoDis=true;
                this.getUser(this.curId);
            }

            this.btnDis = false
        },
    }
</script>

<style scoped>

</style>