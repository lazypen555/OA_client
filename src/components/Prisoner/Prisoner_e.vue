<template>
    <div>
        <Form ref="prisonerForm" :rules="ruleValidate" :model="formItem" :label-width="90">
            <Card>
                <p slot="title">个人信息</p>
                <Row>
                    <Col span="4">
                    <FormItem label="编号">
                        <Input v-model="formItem.cNo" placeholder="" disabled size="small"></Input>
                    </FormItem>
                    </Col>
                    <Col span="4" offset="1">
                    <FormItem label="姓名">
                        <Input v-model="formItem.cName" placeholder="" readonly size="small"></Input>
                    </FormItem>
                    </Col>
                    <Col span="4" offset="1">
                    <FormItem label="现文化程度">
                        <Input v-model="formItem.cKnowledge" readonly size="small"></Input>
                    </FormItem>
                    </Col>
                    <Col span="4" offset="1">
                    <FormItem label="婚姻状况">
                        <Input v-model="formItem.cMarry" placeholder="" readonly size="small"></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="4">
                    <FormItem label="民族">
                        <Input v-model="formItem.cFolk" readonly size="small"></Input>
                    </FormItem>
                    </Col>
                    <Col span="4" offset="1">
                    <FormItem label="性别">
                        <Input v-model="formItem.cSex" placeholder="" readonly size="small"></Input>
                    </FormItem>
                    </Col>
                    <Col span="4" offset="1">
                    <FormItem label="出生年月">
                        <Input v-model="formItem.dBirthDay" readonly size="small"></Input>
                    </FormItem>
                    </Col>
                    <Col span="4" offset="1">
                    <FormItem label="籍贯/国籍">
                        <Input v-model="formItem.cNative" readonly size="small"></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="4">
                    <FormItem label="真名">
                        <Input v-model="formItem.cRealName" readonly size="small"></Input>
                    </FormItem>
                    </Col>
                    <Col span="4" offset="1">
                    <FormItem label="别名化名">
                        <Input v-model="formItem.cName2" readonly size="small"></Input>
                    </FormItem>
                    </Col>
                    <Col span="4" offset="1">
                    <FormItem label="原职业">
                        <Input v-model="formItem.cUser_Id" readonly size="small"></Input>
                    </FormItem>
                    </Col>
                    <Col span="4" offset="1">
                    <FormItem label="身份证号">
                        <Input v-model="formItem.cCardID" readonly size="small"></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="9">
                    <FormItem label="现住">
                        <Input v-model="formItem.cAddr" readonly size="small"></Input>
                    </FormItem>
                    </Col>
                    <Col span="9" offset="1">
                    <FormItem label="户籍">
                        <Input v-model="formItem.cCensus" readonly size="small"></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="4">
                    <FormItem label="类别">
                        <Input v-model="formItem.cType3" readonly size="small"></Input>
                    </FormItem>
                    </Col>
                    <Col span="4" offset="1">
                    <FormItem label="类型">
                        <Input v-model="formItem.cType3" readonly size="small"></Input>
                    </FormItem>
                    </Col>
                    <Col span="4" offset="1">
                    <FormItem label="分管等级">
                        <Input v-model="formItem.cType4" readonly size="small"></Input>
                    </FormItem>
                    </Col>
                    <Col span="4" offset="1">
                    <FormItem label="管理类型">
                        <Input v-model="formItem.cType4" readonly size="small"></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="4" offset="1">
                    <FormItem label="前科">
                        <Input v-model="formItem.dDateIn" readonly size="small"></Input>
                    </FormItem>
                    </Col>
                    <Col span="4">
                    <FormItem label="点名卡号">
                        <Input v-model="formItem.cMyNo" readonly size="small"></Input>
                    </FormItem>
                    </Col>
                    <Col span="4" offset="1">
                    <FormItem label="UHF卡号">
                        <Input v-model="formItem.cUHFCard" readonly size="small"></Input>
                    </FormItem>
                    </Col>
                    <Col span="4" offset="1">
                    <FormItem label="ic卡号">
                        <Input v-model="formItem.icCard" readonly size="small"></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="4">
                    <FormItem label="是否监护">
                        <Input v-model="formItem.cCurInUnit" readonly size="small"></Input>
                    </FormItem>
                    </Col>
                    <Col span="4" offset="1">
                    <FormItem label="当前部门">
                        <Input v-model="formItem.cCurInUnit" readonly size="small"></Input>
                    </FormItem>
                    </Col>
                </Row>
            </Card>
            <br/>
            <Card>
                <p slot="title">离监设置</p>
                <Row>
                    <Col span="4">
                    <FormItem label="所属部门" prop="cUnit">
                        <Select v-model="formItem.cUnit" filterable size="small">
                            <Option v-for="item in unitList" :value="item.value" :key="item.value">{{ item.label }}
                            </Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col span="1">
                    <FormItem label="是否离监所">
                        <Checkbox v-model="formItem.bIsOut" size="small"></Checkbox>
                    </FormItem>
                    </Col>
                    <Col span="5" offset="1">
                    <FormItem label="类型" prop="cType9">
                        <Select v-model="formItem.cType9" size="small">
                            <Option value="提前解除">提前解除</Option>
                            <Option value="按期解除">按期解除</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col span="6" offset="1">
                    <FormItem label="离监所日期" prop="dOutDate">
                        <DatePicker type="date" v-model="formItem.dOutDate" placement="top" size="small"></DatePicker>
                    </FormItem>
                    </Col>
                </Row>
            </Card>
            <br/>
            <FormItem>
                <Button type="primary" :disabled="btnDis" @click="handleSubmit">提交</Button>
                <Button type="ghost" :disabled="btnDis" style="margin-left: 8px" @click="handleReset">取消</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
    export default {
        name: "prisoner_e",
        data() {
            const validateUnit = function (rule, value, callback) {
                if (value == '') {
                    callback(new Error('请您选择单位'));
                }
                callback();
            };
            return {
                curId: -1,
                btnDis: true,
                formItem: {
                    cNo: '',
                    cName: '',
                    cUnit: '',
                    cMarry: '',
                    cSex: '',
                    dBirthDay: '',
                    cRealName: '',
                    cName2: "",
                    cFolk: '',
                    cNative: '',
                    cKnowledge: '',
                    cCardID: '',
                    cType1: '',
                    cType2: '',
                    cType3: '',
                    cType4: '',
                    cType5: '',
                    dDateStr: '',
                    dDateEnd: '',
                    dDateIn: '',
                    cAddr: '',
                    cCensus: '',
                    bIsOut: '',
                    cType9: '',
                    dOutDate: '',
                    cCurInUnit: '',
                    bNotWork: '',
                    cMyNo: '',
                    cUHFCard: '',
                    icCard: '',
                    cDuType: '',
                    cDoType: '',
                    cDuYears: ''
                },
                title: '详情',
                unitList: [],
                ruleValidate: {
                    cUnit: [
                        {required: true, message: '请您选择单位', trigger: 'change'},
                    ],
                    cType9: [
                        {required: true, message: '请您选择类型', trigger: 'change'},
                    ],
                    dOutDate: [
                        {required: true, type: 'date', message: '请您输入时间', trigger: 'change'},
                    ],
                }
            }
        },
        methods: {
            handleSubmit() {
                this.btnDis = true;
                this.$refs["prisonerForm"].validate(async (valid) => {
                    if (valid) {
                        const msg = this.$Message.loading({
                            content: 'Loading...',
                            duration: 0
                        });
                        if (this.curId === -1) {

                        } else {
                            this.updatePrisoner();
                        }
                        msg();
                    }
                    this.btnDis = false;
                })
            },
            handleReset() {
                this.$router.push('/index/prisoners');
            },
            async updatePrisoner() {
                let {bIsOut, cType9, dOutDate, cUnit} = this.formItem;
                let result;
                result = await this.$http.put(`/v1/prisoner/${this.curId}`, {bIsOut, cType9, dOutDate, cUnit});
                if (result && result.isSuc) {
                    this.$Message.success(result ? result.data.msg : '网络异常');
                    this.$router.push('/index/prisoners');
                } else {
                    this.$Message.error(result ? result.data.msg : '网络异常');
                }
            },
            async getPrisoners(id) {
                const msg = this.$Message.loading({
                    content: 'Loading...',
                    duration: 0
                });
                let result = await this.$http.get(`/v1/prisoner/${id}`);
                if (result && result.isSuc) {
                    let info = result.data.info;
                    let {cSheng1, cShi1, cXian1, cXiang1, cAddr1, cSheng2, cShi2, cXian2, cXiang2, cAddr2} = info;
                    let cAddr = `${cSheng1 + cShi1 + cXian1 + cXiang1 + cAddr1}`;
                    let cCensus = `${cSheng2 + cShi2 + cXian2 + cXiang2 + cAddr2}`;
                    this.$_.each(this.formItem, (v, k) => {
                        if (k === 'bIsOut') {
                            this.formItem[k] = !!info[k];
                        } else {
                            this.formItem[k] = (info[k] || '').toString();
                        }

                    });
                    this.formItem.cAddr = cAddr;
                    this.formItem.cCensus = cCensus;
                    this.btnDis = false;
                    msg();
                }
            },
            async getDept() {
                let result;
                result = await this.$http.get(`/v1/dept`);
                if (result && result.isSuc) {
                    let {parentList = [], childList = []} = result.data;
                    let deptList = [];
                    if (parentList.length) {
                        deptList = this.$_.map(parentList, (v, i) => {
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
                    this.deptList = deptList;
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
            if (this.curId !== -1) {
                this.getPrisoners(this.curId);
            }
            this.btnDis = false
        },
    }
</script>

<style slot-scope>

</style>