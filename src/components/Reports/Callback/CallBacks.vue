<template>
    <div>
        <div>
            <Button type="primary" @click="search">查询</Button>
            <Button type="primary" @click="showEdit(-1)">添加</Button>
            <Button type="primary" @click="exportData">
                <Icon type="ios-download-outline"></Icon>
                导出数据
            </Button>
        </div>
        <Table height="400" ref="selection" stripe border :loading="tableLoading" :columns="columns" :data="data"
               @on-sort-change="order"></Table>

        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :total="total" placement="top" show-sizer show-total @on-change="indexChange" @on-page-size-change="sizeChange"
                      :page-size="20"></Page>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "callbacks",
        data() {
            return {
                columns: [
                    {
                        type: 'selection',
                        align: 'center',
                        key: 'userId',
                        width: 60
                    },
                    {
                        title: '工号',
                        key: 'cUser_Id'
                    },
                    {
                        title: '姓名',
                        key: 'cUser_Name'
                    },
                    {
                        title: '手机号',
                        key: 'cPhone'
                    },
                    {
                        title: '部门编号',
                        key: 'cDept',
                        sortable: true
                    },
                    {
                        title: '部门名称',
                        key: 'cDeptName'
                    },
                    {
                        title: '状态',
                        key: 'nState',
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.nState === 0 ? ' green' : 'red';
                            const text = row.nState === 0 ? '启用' : '停用';

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
                                            this.showEdit(params.row.userId);
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.delUser(params.row.userId);
                                        }
                                    }
                                }, '删除')
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
                this.getInfo(this.index, this.page);
            },
            sizeChange(size) {
                this.index = 1;
                this.page = size;
                this.getInfo(this.index, this.page);
            },
            showEdit(id) {
                this.$router.push({path: `/index/users/${id ? id : -1 }`});
            },
            order(column) {
                this.getInfo(this.index, this.page, [[column.key, column.order.toUpperCase()]]);
            },
            search() {

            },
            exportData() {
                this.$refs.selection.exportCsv({
                    filename: '用户数据',
                    columns: this.columns.filter((col, index) => index > 0 && index < 6),
                    data: this.data
                });

            },
            async getInfo(index, page, order) {
                this.tableLoading = true;
                let result = await this.$http.get(`/v1/user`, {index, page, order});
                if (result && result.isSuc) {

                    this.data = result.data.list;
                    this.total = result.data.total;
                }
                this.tableLoading = false;
            },
            async delUser(id) {
                this.$Modal.confirm({
                    content: '您是否要删除该行?',
                    onOk: async () => {
                        let result = await  this.$http.delete(`/v1/user/${id}`);
                        debugger;
                        if (result && result.isSuc) {
                            this.$Message.success('删除成功');
                            this.getInfo(this.index, this.page);
                        } else {
                            this.$Message.success('删除失败');
                        }
                    }
                })

            }
        },
        mounted: function () {
            this.getInfo(this.index, this.page);
        }
    }
</script>

<style scoped>

</style>