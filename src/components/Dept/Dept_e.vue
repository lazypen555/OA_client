<template>
    <div>
        <Form ref="DeptForm" :model="form" :rules="ruleValidate" :label-width="100">
            <Row>
                <Col span="5">
                <FormItem label="是否单位">
                    <Select v-model="form.isUnit" :disabled="lockUint">
                        <Option value="0">是</Option>
                        <Option value="1">否</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="5" v-show="showDept" offset="1">
                <FormItem label="上级部门" prop="parentId">
                    <Cascader :data="buildDept" v-model="form.parentId" placeholder="请选择部门"
                              change-on-select @on-change="changeDept"></Cascader>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="5">
                <FormItem label="编号" prop="cNo">
                    <span v-show="showDept">{{form.parentNo}}</span>
                    <InputNumber :max="99" :min="1" v-show="showDept" v-model="form.cNo" placeholder="输入编号...,且前缀默认添加" :readonly="lockUint">
                    </InputNumber>
                    <InputNumber :max="99" :min="1" v-show="!showDept" v-model="form.cNo" placeholder="输入编号..." :readonly="lockUint">
                    </InputNumber>
                </FormItem>
                </Col>
                <Col span="5" offset="1">
                <FormItem label="名称" prop="cName">
                    <Input v-model="form.cName" placeholder="输入名称..."></Input>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="5">
                <FormItem label="是否生产单位">
                    <Select v-model="form.isProduct">
                        <Option value="0">是</Option>
                        <Option value="1">否</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="5" offset="1">
                <FormItem label="是否场所外">
                    <Select v-model="form.isOut">
                        <Option value="0">是</Option>
                        <Option value="1">否</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="5" offset="1">
                <FormItem label="状态">
                    <Select v-model="form.status">
                        <Option value="0">启用</Option>
                        <Option value="1">停用</Option>
                    </Select>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="17">
                <FormItem label="备注">
                    <Input v-model="form.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                           placeholder=""></Input>
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
        name: "dept_e",
        data() {
            let oThis = this;
            const validateParent = function (rule, value, callback) {
                if (value == '' && oThis.form.isUnit === '1') {
                    callback(new Error('请您选择单位'));
                }
                callback();
            };
            return {
                curId: '-1',
                btnDis: true,
                form: {
                    cNo: 2,
                    cName: '',
                    status: '0',
                    isProduct: '0',
                    isOut: '0',
                    isUnit: '0',
                    parentId: [],
                    parentNo: '',
                    remark: ''
                },
                title: '编辑',
                deptList: [],
                ruleValidate: {
                    cName: [{required: true, message: '请您输入姓名', trigger: 'blur'}],
                    parentId: [{validator: validateParent, trigger: 'change'}],
                }
            }
        },
        created: function () {
            this.curId = this.$route.params.id || '-1';
        },
        computed: {
            lockUint: function () {
                return this.curId !== '-1';
            },
            showDept: function () {
                return this.form.isUnit === '1';
            },
            buildDept: function () {
                return this.$helper.buildDept(this.deptList);
            }
        },
        methods: {
            changeDept(value, selectedData) {
                this.form.parentNo = this.$_.last(selectedData).value;
                debugger;
            },
            handleSubmit() {
                this.btnDis = true;
                this.$refs["DeptForm"].validate(async (valid) => {
                    if (valid) {
                        const msg = this.$Message.loading({
                            content: 'Loading...',
                            duration: 0
                        });
                        if (this.curId === '-1') {
                            this.saveDept();
                        } else {
                            this.updateDept();
                        }
                        msg();
                    }
                    this.btnDis = false;
                })
            },
            handleReset() {
                this.$router.push('/index/depts');
            },
            async getInfo(id) {
                const msg = this.$Message.loading({
                    content: 'Loading...',
                    duration: 0
                });
                let result = await this.$http.get(`/v1/dept/${id}/edit`);
                if (result && result.isSuc) {
                    let info = result.data.info;

                    this.$_.each(this.form, (v, k) => {
                        if (k === "parentId") {
                            let parentId = info[k];
                            let tempDept = [];
                            if (parentId && parentId.length > 3) {
                                tempDept.push(parentId.substring(0, 1));
                                tempDept.push(parentId.substring(0, 3));
                                tempDept.push(parentId);
                            } else {
                                tempDept.push(parentId);
                            }
                            this.form[k] = tempDept;
                        } else if (info[k]) {
                            this.form[k] = info[k].toString();
                        }
                    });
                    this.btnDis = false;
                    msg();
                }
            },
            async saveDept() {
                let form = this.$_.assign({}, this.form);
                form.parentId = this.$_.last(form.parentId);
                form.cNo = (form.parentNo || '') + form.cNo;
                let result;
                result = await this.$http.post(`/v1/dept`, form);
                if (result && result.isSuc) {
                    this.$Message.success(result ? result.data.msg : '网络异常');
                    this.$router.push('/index/depts');
                } else {
                    this.$Message.error(result ? result.data.msg : '网络异常');
                }

            },
            async updateDept() {
                let form = this.$_.assign({}, this.form);
                form.parentId = this.$_.last(form.parentId);
                let result;
                result = await this.$http.put(`/v1/dept/${this.curId}`, form);
                if (result && result.isSuc) {
                    this.$Message.success(result ? result.data.msg : '网络异常');
                    this.$router.push('/index/depts');
                } else {
                    this.$Message.error(result ? result.data.msg : '网络异常');
                }
            },
            async getDept() {
                let result;
                result = await this.$http.get(`/v1/dept`, {isPage: false});
                if (result && result.isSuc) {
                    this.deptList = result.data.deptList;
                    //获取最后的单位
                    if(this.curId === '-1'){
                        let parents = this.$_.filter(this.deptList,{parentId:'0'});
                        debugger
                        this.form.cNo = this.$_.maxBy(parents,'cNo').cNo;
                    }
                } else {
                    this.$Message.error(result ? result.data.msg : '网络异常');
                }
            },
        },
        mounted: async function () {
            await this.getDept();
            if (this.curId !== '-1') {
                this.getInfo(this.curId);
            }
            this.btnDis = false
        },
    }
</script>

<style scoped>

</style>