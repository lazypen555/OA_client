<template>
    <div>
        <Form ref="UnitForm" :model="form" :rules="ruleValidate" :label-width="100">
            <Row>
                <Col span="8">
                <FormItem label="是否单位">
                    <Select v-model="form.isUnit" :disabled="lockUpdate">
                        <Option value="0">是</Option>
                        <Option value="1">否</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="8" v-show="showUnit" offset="1">
                <FormItem label="上级部门" prop="parentId">
                    <Cascader :data="buildUnit" v-model="form.parentId" placeholder="请选择部门"
                              change-on-select @on-change="changeUnit" :disabled="lockUpdate"></Cascader>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="8">
                <FormItem label="编号" prop="cNo">
                    <span v-show="showNo" class="span_no">{{form.parentNo}}</span>
                    <span v-show="showNo">-</span>
                    <InputNumber :max="99" :min="1" v-show="showUnit" v-model="bindNumberNo"
                                 placeholder="输入编号...,且前缀默认添加"
                                 :readonly="lockUpdate">
                    </InputNumber>
                    <InputNumber :max="99" :min="1" v-show="!showUnit" v-model="bindNumberNo" placeholder="输入编号..."
                                 :readonly="lockUpdate">
                    </InputNumber>
                </FormItem>
                </Col>
                <Col span="8" offset="1">
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
        name: "unit_e",
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
                    cNo: 1,
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
                unitList: [],
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
            lockUpdate: function () {
                return this.curId !== '-1';
            },
            showUnit: function () {
                return this.form.isUnit === '1';
            },
            showNo: function () {
                debugger
                return this.form.isUnit === '1' && this.form.parentNo
            },
            buildUnit: function () {
                return this.$helper.buildUnit(this.unitList);
            },
            bindNumberNo: {
                set: function (value) {
                    this.form.cNo = parseInt(value);
                },
                get: function () {
                    return parseInt(this.form.cNo);
                }
            },
        },
        methods: {
            changeUnit(value, selectedData) {
                this.form.parentNo = this.$_.last(selectedData).value;
            },
            handleSubmit() {
                this.btnDis = true;
                this.$refs["UnitForm"].validate(async (valid) => {
                    if (valid) {
                        const msg = this.$Message.loading({
                            content: 'Loading...',
                            duration: 0
                        });
                        if (this.curId === '-1') {
                            this.saveUnit();
                        } else {
                            this.updateUnit();
                        }
                        msg();
                    }
                    this.btnDis = false;
                })
            },
            handleReset() {
                this.$router.push('/index/units');
            },
            async getInfo(id) {
                const msg = this.$Message.loading({
                    content: 'Loading...',
                    duration: 0
                });
                let result = await this.$http.get(`/v1/unit/${id}/edit`);
                if (result && result.isSuc) {
                    let info = result.data.info;

                    this.$_.each(this.form, (v, k) => {
                        if (k === "parentId") {
                            let parentId = info[k];
                            this.form.parentNo = parentId;
                            let tempUnit = [];
                            if (parentId && parentId.length > 2) {
                                tempUnit.push(parentId.substring(0, 2));
                                tempUnit.push(parentId);
                            } else {
                                tempUnit.push(parentId);
                            }
                            this.form[k] = tempUnit;
                        } else if (k === "cNo") {
                            this.form[k] = info[k] && info[k].toString().substring(0, 2);
                        } else if (info[k]) {
                            this.form[k] = info[k].toString();
                        }
                    });
                    this.btnDis = false;
                    msg();
                }
            },
            async saveUnit() {
                let form = this.$_.assign({}, this.form);
                form.parentId = this.$_.last(form.parentId);
                if (form.isUnit == '1') {
                    form.cNo = (form.parentNo || '') + form.cNo
                }
                let result;
                result = await this.$http.post(`/v1/unit`, form);
                if (result && result.isSuc) {
                    this.$Message.success(result ? result.data.msg : '网络异常');
                    this.$router.push('/index/units');
                } else {
                    this.$Message.error(result ? result.data.msg : '网络异常');
                }

            },
            async updateUnit() {
                let form = this.$_.assign({}, this.form);
                form.parentId = this.$_.last(form.parentId);
                let result;
                result = await this.$http.put(`/v1/unit/${this.curId}`, form);
                if (result && result.isSuc) {
                    this.$Message.success(result ? result.data.msg : '网络异常');
                    this.$router.push('/index/units');
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
            await this.getUnit();
            if (this.curId !== '-1') {
                this.getInfo(this.curId);
            }
            this.btnDis = false
        },
    }
</script>

<style scoped>
    .span_no {
        border: #cacfda 1px solid;
        background: #cacfda;
        padding: 7px;
        border-radius: 3px;
        border: #6d7380 1px solid;
    }
</style>