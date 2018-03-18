<template>
    <div>
        <Card style="width:100%">
            <Row :gutter="16">
                <Col span="5">
                <span>编号/姓名</span>
                <Input v-model="name" style="width: 100px"></Input>
                </Col>
                <Col span="5">
                <span>回访状态</span>
                <Select v-model="cbCnt" style="width: 70px">
                    <Option value="-1">全部</Option>
                    <Option value="0">已回访</Option>
                    <Option value="1">未回访</Option>
                </Select>
                </Col>
                <Col span="6">
                <Button type="primary" @click="search" :disabled="searchDis">查询</Button>
                <!--<Button type="primary" @click="showEdit(-1)" :disabled="searchDis">添加</Button>-->
                <Button type="primary" @click="exportData" :disabled="searchDis">
                    <Icon type="ios-download-outline"></Icon>
                    导出数据
                </Button>
                </Col>
            </Row>
        </Card>
        <br>
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
                cbCnt: '-1',
                searchDis: true,
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
                        title: '离监类型',
                        key: 'cCurInUnit'
                    },
                    {
                        title: '离监日期',
                        key: 'dOutDate'
                    },
                    {
                        title: '是否回放',
                        key: 'cbCnt',
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.cbCnt >= 1 ? ' green' : 'red';
                            let text = row.cbCnt >= 1 ? '已回访' : '未回访';
                            text = `${text}${row.cbCnt ? '(' + row.cbCnt + ')' : '' }`;
                            return h('Tag', {
                                props: {
                                    type: 'dot',
                                    color: color
                                }
                            }, text);
                        }
                    },
                    {
                        title: '回放',
                        key: 'action',
                        width: 150,
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
                                            let {cNo, cName} = params.row;
                                            this.showEdit(cNo, cName);
                                        }
                                    }
                                }, '回访')
                            ])
                        }
                    }
                ],
                data: [],
                index: 1,
                page: 20,
                total: 0,
                tableLoading: false
            }
        },
        methods: {
            indexChange(index) {
                this.index = index;
                this.getPrisoner(this.index, this.page);
            },
            sizeChange(size) {
                this.index = 1;
                this.page = size;
                this.getPrisoner(this.index, this.page);
            },
            showEdit(id, name) {
                this.$router.push({path: `/index/answers/${id ? id : -1 }`, query: {name}});
            },
            order(column) {
                //this.getInfo(this.index, this.page, [[column.key, column.order.toUpperCase()]]);
            },
            search() {
                this.getPrisoner();
            },
            disabledBtn(isLock) {
                isLock = !!isLock;
                this.searchDis = isLock;
                this.tableLoading = isLock;
            },
            exportData() {
                this.$refs.selection.exportCsv({
                    filename: '回访数据',
                    columns: this.columns.filter((col, index) => index > 0 && index < 6),
                    data: this.data
                });

            },
            async getPrisoner(index = 1, page = 20, order) {
                this.disabledBtn(true);
                let {name, cbCnt} = this;
                let where = this.$helper.getSendWhere({name, cbCnt});
                if (where.cbCnt) {
                    where.cbCnt = where.cbCnt == 0 ? {'$gte': 1} : 0;
                }
                where.bIsOut = true;//强制显示已回访的
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
            this.getPrisoner(this.index, this.page);
        }
    }
</script>

<style scoped>

</style>