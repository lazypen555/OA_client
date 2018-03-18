<template>
    <div>
        <Card style="width:100%">
            <Row :gutter="16">
                <Col span="5">
                <span>编号/姓名</span>
                <Input v-model="name" style="width: 100px"></Input>
                </Col>
                <Col span="5">
                <span>调入日期</span>
                <DatePicker type="date" style="width: 120px" v-model="dDateIn"></DatePicker>
                </Col>
                <Col span="5">
                <span>是否离开</span>
                <Select v-model="bIsOut" style="width: 70px">
                    <Option value="-1">全部</Option>
                    <Option value="true">已离开</Option>
                    <Option value="false">未离开</Option>
                </Select>
                </Col>
                <Col span="4">
                <Button type="primary" @click="search" :disabled="searchDis">查询</Button>
                <!--<Button type="primary" @click="showEdit(-1)">添加</Button>-->
                <Button type="primary" @click="exportData" :disabled="searchDis">
                    <Icon type="ios-download-outline"></Icon>
                    导出数据
                </Button>
                </Col>
            </Row>
        </Card>
        <br/>
        <div>
            <Table height="400" ref="selection" stripe border :loading="tableLoading" :columns="columns" :data="data"
                   @on-sort-change="order"></Table>
        </div>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :total="total" placement="top" show-sizer show-total @on-change="indexChange"
                      @on-page-size-change="sizeChange"
                      :page-size="20"></Page>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "Prisoners",
        data() {
            return {
                name: '',
                dDateIn: '',
                bIsOut: '-1',
                columns: [
                    {
                        type: 'selection',
                        align: 'center',
                        key: 'cNo',
                        width: 60
                    },
                    {
                        title: '编号',
                        key: 'cNo'
                    },
                    {
                        title: '姓名',
                        key: 'cName'
                    },
                    {
                        title: '当前部门',
                        key: 'cUnit'
                    },
                    {
                        title: '民族',
                        key: 'cFolk',
                    },
                    {
                        title: '当前单位',
                        key: 'cCurInUnit'
                    },
                    {
                        title: '文化程度',
                        key: 'cKnowledge'
                    },
                    {
                        title: '分管等级',
                        key: 'cType4'
                    },
                    {
                        title: '调入日期',
                        key: 'dDateIn'
                    },
                    {
                        title: '起止日期',
                        key: 'dDataStrEnd'
                    },
                    {
                        title: '点名卡号',
                        key: 'cMyNo'
                    },
                    {
                        title: '是否离开',
                        key: 'bIsOut',
                        width: 120,
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.bIsOut ? ' green' : 'red';
                            const text = !!row.bIsOut ? '已离' : '未离';

                            return h('Tag', {
                                props: {
                                    type: 'dot',
                                    color: color
                                }
                            }, text);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 70,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            debugger;
                                            this.showEdit(params.row.cNo);
                                        }
                                    }
                                }, '离开')
                            ])
                        }
                    }
                ],
                data: [],
                index: 1,
                page: 20,
                total: 0,
                tableLoading: false,
                searchDis: false,
            }
        },
        methods: {
            indexChange(index) {
                this.index = index;
                this.getInfo(this.index, this.page);
            },
            sizeChange(size) {
                this.index = 1;
                this.page = size;
                this.getInfo(this.index, this.page);
            },
            showEdit(id) {
                this.$router.push({path: `/index/prisoners/${id ? id : '-1' }`});
            },
            order(column) {
                //this.getInfo(this.index, this.page, [[column.key, column.order.toUpperCase()]]);
            },
            search() {
                this.getInfo()
            },
            disabledBtn(isLock) {
                isLock = !!isLock;
                this.searchDis = isLock;
                this.tableLoading = isLock;
            },
            exportData() {
                this.$refs.selection.exportCsv({
                    filename: '戒员数据',
                    columns: this.columns.filter((col, index) => index > 0 && index < 6),
                    data: this.data
                });

            },
            async getInfo(index = 1, page = 20, order) {
                this.disabledBtn(true);
                let {name, dDateIn, bIsOut} = this;
                let where = this.$helper.getSendWhere({name, dDateIn, bIsOut});
                let result = await this.$http.get(`/v1/prisoner`, {where, index, page, order});
                if (result && result.isSuc) {

                    this.data = result.data.list;
                    this.total = result.data.total;
                }
                this.disabledBtn(false);
            },
            async delUser(id) {
            }
        },
        mounted: function () {
            this.getInfo(this.index, this.page);
        }
    }
</script>

<style scoped>

</style>