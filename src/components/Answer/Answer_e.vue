<template>
    <div>
        <Affix :offset-top="100">
            <span class="demo-affix">{{prisonerName}}</span>
        </Affix>

        <h2>是否新增联系人
            <Checkbox v-model="isAddLinker" :disabled="kinsfolk.length===0" size="large"></Checkbox>
        </h2>
        <div v-show="kinsfolk.length!==0">
            <h3>选择联系人</h3>
            <Select filterable @on-change="changeKinsfolk" size="large" style="width:200px" placeholder="您可以选择过往联系人">
                <Option v-for="(item,index) in kinsfolk" :value="index" :key="index">{{ item.col_name }}</Option>
            </Select>
        </div>
        <br/>
        <Form ref="questionForm" :model="form" :rules="ruleValidate" :label-width="90">
            <Card>
                <p slot="title">联系人信息</p>
                <Row>
                    <Col span="5">
                    <FormItem label="联系电话" prop="col_Tel">
                        <Input v-model="form.col_Tel"></Input>
                    </FormItem>
                    </Col>
                    <Col span="5" offset="2">
                    <FormItem label="联系人姓名" prop="col_name">
                        <Input v-model="form.col_name"></Input>
                    </FormItem>
                    </Col>
                    <Col span="5" offset="2">
                    <FormItem label="联系人性别" prop="cSex">
                        <Input v-model="form.cSex"></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="5">
                    <FormItem label="联系人关系" prop="col_relation">
                        <Input v-model="form.col_relation"></Input>
                    </FormItem>
                    </Col>
                    <Col span="5" offset="2">
                    <FormItem label="联系人身份证" prop="col_idcard">
                        <Input v-model="form.col_idcard"></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                    <FormItem label="联系人住址">
                        <Input v-model="form.col_address"></Input>
                    </FormItem>
                    </Col>
                </Row>
            </Card>
            <br/>
            <Card>
                <p slot="title">答题信息</p>
                <FormItem label="回访日期" prop="cbDate">
                    <DatePicker type="date" v-model="form.cbDate" placement="top"></DatePicker>
                </FormItem>
                <div v-for="(question,index) in form.questions" :key="index">
                    <Collapse value="1">
                        <Panel name="1">
                            {{question.title}}
                            <div slot="content">
                                <FormItem>
                                    <RadioGroup v-model="question.checked" v-for="(answer,index) in question.answers"
                                                :key="index" :label-width="0">

                                        <Radio v-if="answer.value" :label="answer.key" style="margin-left: 100px">
                                            <span>{{answer.value}}</span></Radio>

                                    </RadioGroup>

                                </FormItem>
                            </div>
                        </Panel>
                    </Collapse>
                    <br/>
                </div>

                <FormItem label="备注">
                    <Input v-model="form.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                           placeholder=""></Input>
                </FormItem>
            </Card>
            <br/>
            <FormItem>
                <Button type="primary" @click="handleSubmit" :disabled="btnDis">保存</Button>
                <Button type="ghost" :disabled="btnDis" style="margin-left: 8px" @click="handleReset">取消</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
    export default {
        name: "answer_e",
        data() {
            return {
                curId: -1,
                prisonerName: '',
                isAddLinker: true,
                btnDis: true,
                form: {
                    colId: -1,
                    col_Tel: '',
                    col_name: '',
                    cbDate: Date.now(),
                    cSex: '',
                    col_relation: '',
                    col_idcard: '',
                    col_address: '',
                    cUser_Name: 7,
                    cUnit: '',
                    remark: '',
                    questions: [{
                        title: '',
                        remark: '',
                        checked: false,
                        answers: [{key: 'A', value: '是'}, {key: 'B', value: '否'}],
                    }],
                },
                ruleValidate: {
                    col_Tel: [
                        {required: true, message: '请您输入联系电话', trigger: 'blur'}
                    ],
                    col_name: [
                        {required: true, message: '请您输入联系人姓名', trigger: 'blur'}
                    ],
                    cSex: [
                        {required: true, message: '请您输入联系人性别', trigger: 'blur'}
                    ],
                    col_relation: [
                        {required: true, message: '请您输入联系人关系', trigger: 'blur'}
                    ],
                    cbDate: [
                        {required: true, type: 'date', message: '请您输入回访日期', trigger: 'change'},
                    ],
                },
                kinsfolk: [],
                title: '编辑',
            }
        },
        mounted: async function () {
            let {name = ''} = this.$route.query;
            this.curId = this.$route.params.id || '-1';
            this.prisonerName = this.curId + '-' + name;
            Promise.all([this.getQuestion(), this.getKinsfolk(name)]);
        },
        methods: {
            checkAnswers(){
                let isOk =false;
                this.$_.every(this.form.questions,(v,i)=>{
                    if(v.checked){
                        isOk=true;
                    }
                    return !isOk;
                });
                return isOk;
            },

            handleSubmit() {
                this.btnDis = true;
                this.$refs["questionForm"].validate(async (valid) => {
                    if (valid) {
                        //判断是否有答题
                        if(!this.checkAnswers()){
                            this.$Message.warning('请您至少填写一道题目');
                        }else{
                            if (this.isAddLinker) {
                                this.$Modal.confirm({
                                    content: '您确定要新建联系人？',
                                    onOk: () => {
                                        const msg = this.$Message.loading({
                                            content: 'Loading...',
                                            duration: 0
                                        });
                                        this.saveAnswer();
                                        msg();
                                    }
                                });
                            } else {
                                const msg = this.$Message.loading({
                                    content: 'Loading...',
                                    duration: 0
                                });
                                this.saveAnswer();
                                msg();
                            }
                        }
                    }
                    this.btnDis = false;
                })
            },
            handleReset() {
                this.$router.push('/index/answers');
            },
            changeKinsfolk(index) {
                let kinsfolk = this.kinsfolk[index];
                this.$_.each(this.form, (v, k) => {
                    if (kinsfolk[k]) {
                        this.form[k] = kinsfolk[k];
                    }
                });
                this.isAddLinker = false
            },
            async saveAnswer() {
                let form = this.$_.assign({}, this.form);
                form.col_culprit = this.curId;
                form.prisonerName = this.prisonerName && this.prisonerName.split('-') ? this.prisonerName.split('-')[1] : '';
                form.isAddLinker = this.isAddLinker;
                let result;
                result = await this.$http.post(`/v1/answer`, form);
                if (result && result.isSuc) {
                    this.$Message.success(result ? result.data.msg : '网络异常');
                    this.$router.push('/index/answers');
                } else {
                    this.$Message.error(result ? result.data.msg : '网络异常');
                }
            },
            async getQuestion() {
                const msg = this.$Message.loading({
                    content: 'Loading...',
                    duration: 0
                });
                let result = await this.$http.get(`/v1/question`);
                if (result && result.isSuc) {
                    let info = result.data.info;
                    this.$_.each(this.form, (v, k) => {
                        this.form[k] = info[k];
                    });
                    this.btnDis = false;
                    msg();
                }
            },
            async getKinsfolk() {
                let result = await this.$http.get('/v1/kinsfolk', {col_culprit: this.curId});
                if (result && result.isSuc) {
                    this.kinsfolk = result.data.kinsfolkList || [];
                }
            },
        },
    }
</script>

<style scoped>
    .demo-affix {
        display: inline-block;
        color: #fff;
        padding: 10px 30px;
        text-align: center;
        background: rgba(0, 153, 229, .9);
    }
</style>
