<template>
    <div>
        <Form ref="questionForm" :model="form" :rules="ruleValidate" :label-width="150">
            <Card>
                <p slot="title">回访时间设置</p>
                <Row>
                    <Col span="6">
                    <FormItem label="首次回访" prop="fristCbDate">
                        <InputNumber :min="7" v-model="form.fristCbDate"></InputNumber>
                        日
                    </FormItem>
                    </Col>
                    <Col span="6" offset="2">
                    <FormItem label="离所后回访间隔日期" prop="leaveCbDate">
                        <InputNumber :min="1" v-model="form.leaveCbDate"></InputNumber>
                        月
                    </FormItem>
                    </Col>
                    <Col span="6" offset="2">
                    <FormItem label="提醒回访结束日期" prop="endCb">
                        <InputNumber :min="6" v-model="form.endCb"></InputNumber>
                        月
                    </FormItem>
                    </Col>
                </Row>
            </Card>
            <br/>
            <br/>
            <Card>
                <p slot="title">问题设置</p>
                <div v-for="(question,index) in form.questions">
                    <Collapse>
                        <Panel name="1">
                            {{question.title}}
                            <div slot="content">
                                <FormItem label="问题描述" prop="title">
                                    <Input v-model="question.title" placeholder="请您问题描述..."></Input>
                                </FormItem>
                                <FormItem label="备注" prop="remark">
                                    <Input v-model="question.remark" placeholder="请您输入备注..."></Input>
                                </FormItem>
                                <FormItem label="问题类目" prop="category">
                                    <Select style="width:200px" v-model="question.category">
                                        <Option value="是否复吸">是否复吸</Option>
                                        <Option value="遵纪守法">遵纪守法</Option>
                                        <Option value="工作学习">工作学习</Option>
                                        <Option value="思想教育">思想教育</Option>
                                    </Select>
                                </FormItem>
                                <div v-for="(answer,index) in question.answers">
                                    <FormItem :label="answer.key">
                                        <Input  v-model="answer.value" ></Input>
                                    </FormItem>
                                </div>
                            </div>
                        </Panel>
                    </Collapse>
                    <br/>
                </div>
            </Card>
            <br/>
            <FormItem>
                <Button type="primary">保存</Button>
                <Button type="ghost" style="margin-left: 8px">取消</Button>
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
                        title: '是否保持操守',
                        remark: '',
                        category: '',
                        answers:[{key:'A',value:'是'},{key:'B',value:'否'}],
                    }, {
                        title: '是否已到社区报到',
                        remark: '',
                        category: '',
                        answers:[{key:'A',value:'是'},{key:'B',value:'否'}],
                    }, {
                        title: '是否参加社区康复',
                        remark: '',
                        category: '',
                        answers:[{key:'A',value:'是'},{key:'B',value:'否'}],
                    }, {
                        title: '婚姻情况',
                        remark: '',
                        category: '',
                        answers:[{key:'A',value:'已婚'},{key:'B',value:'未婚'}],
                    }, {
                        title: '与家庭成员关系是否融洽',
                        remark: '',
                        category: '',
                        answers:[{key:'A',value:'是'},{key:'B',value:'否'}],
                    }, {
                        title: '健康情况',
                        remark: '',
                        category: '',
                        answers:[{key:'A',value:'良好'},{key:'B',value:'患某疾病'}],
                    },{
                        title: '是否了解对解戒人员的优惠辅助政策',
                        remark: '',
                        category: '',
                        answers:[{key:'A',value:'是'},{key:'B',value:'否'}],
                    },],
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
        }
    }
</script>

<style scoped>

</style>
