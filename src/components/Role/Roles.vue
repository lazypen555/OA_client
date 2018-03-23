<template>
    <div>
        <Card style="width:100%">
            <Row :gutter="16">
                <Col span="3">
                <span>状态</span>
                <Select v-model="status" style="width: 70px">
                    <Option value="-1">全部</Option>
                    <Option value="0">启用</Option>
                    <Option value="1">停用</Option>
                </Select>
                </Col>
                <Col span="6">
                <Button type="primary" @click="search" :disabled="searchDis">查询</Button>
                <Button type="primary" @click="showEdit(-1)" :disabled="searchDis">添加</Button>
                </Col>
            </Row>
        </Card>

        <br/>
        <Table height="400" ref="selection" stripe border :loading="tableLoading" :columns="columns" :data="data"></Table>

        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :total="total" show-sizer placement="top" show-total @on-change="indexChange" @on-page-size-change="sizeChange"
                      :page-size="20"></Page>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "Roles",
        data() {
            return {
                searchDis: true,
                status: '-1',
                columns: [
                    {
                        type: 'selection',
                        align: 'center',
                        key: 'roleId',
                        width: 60
                    },
                    {
                        title: '角色名称',
                        key: 'roleName',
                        width:200,
                    },
                    {
                        title: '状态',
                        key: 'status',
                        width:150,
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.status === 0 ? ' green' : 'red';
                            const text = row.status === 0 ? '启用' : '停用';

                            return h('Tag', {
                                props: {
                                    type: 'dot',
                                    color: color,
                                    readonly: true
                                }
                            }, text);
                        }
                    },
                    {
                        title: '备注',
                        key: 'remark'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            let roleId = params.row.roleId;
                            if (roleId !== 1) {
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
                                                this.showEdit(roleId);
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
                                                this.delRole(roleId);
                                            }
                                        }
                                    }, '删除')
                                ])
                            }
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
                this.$router.push({path: `/index/roles/${id ? id : -1 }`});
            },
            order(column) {
            },
            search() {
                this.getInfo();
            },
            disabledBtn(isLock) {
                isLock = !!isLock;
                this.searchDis = isLock;
                this.tableLoading = isLock;
            },
            exportData() {
                this.$refs.selection.exportCsv({
                    filename: '用户数据',
                    columns: this.columns.filter((col, index) => index > 0 && index < 6),
                    data: this.data
                });

            },
            async getInfo(index = 1, page = 20, order) {
                this.disabledBtn(true);
                let {status} = this;
                let where = this.$helper.getSendWhere({status});
                let result = await this.$http.get(`/v1/role`, {where, index, page, order});
                if (result && result.isSuc) {
                    this.data = result.data.rolelist;
                    this.total = result.data.total;
                }
                this.disabledBtn(false);
            },
            async delRole(id) {
                this.$Modal.confirm({
                    content: '您是否要删除该行?',
                    onOk: async () => {
                        let result = await  this.$http.delete(`/v1/role/${id}`);
                        if (result && result.isSuc) {
                            this.$Message.success('删除成功');
                            this.getInfo(this.index, this.page);
                        } else {
                            this.$Message.error(result ? result.data.msg : '删除失败');
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