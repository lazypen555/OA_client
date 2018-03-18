<template>
    <div>
        <Form ref="questionForm" :model="form" :label-width="150">
            <Card>
                <p slot="title">回访时间设置</p>
                <Row>
                    <Col span="6">
                    <FormItem label="首次回访" prop="fristCbDate">
                        <InputNumber :min="7" v-model="form.fristCbDate" :number="true"></InputNumber>
                        日
                    </FormItem>
                    </Col>
                    <Col span="6" offset="2">
                    <FormItem label="离所后回访间隔日期" prop="leaveCbDate">
                        <InputNumber :min="1" v-model="form.leaveCbDate" :number="true"></InputNumber>
                        月
                    </FormItem>
                    </Col>
                    <Col span="6" offset="2">
                    <FormItem label="提醒回访结束日期" prop="endCb">
                        <InputNumber :min="6" v-model="form.endCb" :number="true"></InputNumber>
                        月
                    </FormItem>
                    </Col>
                </Row>
            </Card>
            <br/>
            <Card>
                <p slot="title">问题设置</p>
                <div v-for="(question,index) in form.questions" :key="index">
                    <Collapse value="1" v-show="question.status===0">
                        <Panel name="1">
                            {{(index+1) +'. '+ question.title}}
                            <Button v-if="index!==0" type="error" size="small"
                                    style="float: right;margin-right: 9px;margin-top: 7px" @click="handleRemove(index)">
                                删除
                            </Button>
                            <div slot="content">
                                <FormItem label="问题描述" :prop="'questions.'+index+'.title'"
                                          :rules="{required: true, message: '请您输入问题描述', trigger: 'blur'}">
                                    <Input v-model="question.title" placeholder="请您问题描述..."></Input>
                                </FormItem>
                                <FormItem label="备注">
                                    <Input v-model="question.remark" placeholder="请您输入备注..."></Input>
                                </FormItem>
                                <FormItem label="问题类目" :prop="'questions.'+index+'.typeName'"
                                          :rules="{required: true, message: '请您选择问题类目', trigger: 'change'}">
                                    <Select style="width:200px" v-model="question.typeName">
                                        <Option value="是否复吸">是否复吸</Option>
                                        <Option value="遵纪守法">遵纪守法</Option>
                                        <Option value="工作学习">工作学习</Option>
                                        <Option value="思想教育">思想教育</Option>
                                    </Select>
                                </FormItem>
                                <div v-for="(answer,a_Index) in question.answers" :key="a_Index">
                                    <template v-if="a_Index === 0 || a_Index ===1 ">
                                        <FormItem :label="answer.key"
                                                  :prop="'questions.'+index+'.answers.'+a_Index+'.value'" :key="a_Index"
                                                  :rules="{required: true, message: '请您输入回答项', trigger: 'blur'}">
                                            <Input v-model="answer.value"></Input>
                                        </FormItem>
                                    </template>
                                    <template v-else>
                                        <FormItem :label="answer.key">
                                            <Input v-model="answer.value"></Input>
                                        </FormItem>
                                    </template>
                                </div>
                            </div>
                        </Panel>
                    </Collapse>
                    <br/>
                </div>
            </Card>
            <br/>
            <Card>
                <Button type="dashed" long @click="handleAdd" icon="plus-round">添加</Button>
            </Card>
            <br/>
            <FormItem>
                <Button type="primary" size="large" @click="handleSubmit" :disabled="btnDis">保存</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
    export default {
        name: "question",
        data() {
            return {
                curId: -1,
                btnDis: true,
                form: {
                    fristCbDate: 7,
                    leaveCbDate: 1,
                    endCb: 6,
                    remark: '',
                    questions: [{
                        questionId: '',
                        title: '',
                        status: 0,
                        remark: '',
                        typeName: '',
                        answers: [{key: 'A', value: ''}, {key: 'B', value: ''}, {key: 'C', value: ''}, {
                            key: 'D',
                            value: ''
                        }],
                    }],
                },
                ruleValidate: {
                    title: [
                        {required: true, message: '请您输入标题', trigger: 'blur'}
                    ],
                    author: [
                        {required: true, message: '请您输入作者', trigger: 'blur'},
                    ],
                },
                title: '编辑',
            }
        },
        mounted: async function () {
            this.getQuestion();
        },
        methods: {
            handleSubmit() {
                this.btnDis = true;
                this.$refs["questionForm"].validate(async (valid) => {
                    if (valid) {
                        const msg = this.$Message.loading({
                            content: 'Loading...',
                            duration: 0
                        });
                        if (this.curId === -1) {
                            this.saveQuestion();
                        }
                        msg();
                    }

                    this.btnDis = false;
                });
            },
            handleAdd() {
                this.index++;
                this.form.questions.push({
                    status: 0,
                    title: '',
                    remark: '',
                    typeName: '',
                    answers: [{key: 'A', value: ''}, {key: 'B', value: ''}, {key: 'C', value: ''}, {
                        key: 'D',
                        value: ''
                    }],
                });
            },
            handleRemove(index) {
                let questions = this.form.questions[index];
                if (questions && questions.questionId) {
                    questions.status = 1;
                } else {
                    this.form.questions.splice(index, 1);
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
                    if(info){
                        this.$_.each(this.form, (v, k) => {
                            if(info[k]){
                                this.form[k] = info[k];
                            }
                        });
                    }
                    this.btnDis = false;
                    msg();
                }
            },
            async saveQuestion() {
                let form = this.$_.assign({}, this.form);

                let result;
                result = await this.$http.post(`/v1/question`, form);
                if (result && result.isSuc) {
                    this.$Message.success(result ? result.data.msg : '网络异常');
                } else {
                    this.$Message.error(result ? result.data.msg : '网络异常');
                }
            },
        },
    }
</script>

<style scoped>

</style>
