<template>
    <div>
        <Card style="width:100%">
            <Row :gutter="16">
                <Col span="5">
                <span>工号/姓名</span>
                <Input v-model="name" style="width: 100px"></Input>
                </Col>
                <Col span="7">
                <span style="float:left;vertical-align: middle;">部门</span>
                <Cascader :data="tree" v-model="cUnit" style="width: 200px;float:left" placeholder="请选择部门"
                          change-on-select></Cascader>
                </Col>
                <Col span="3">
                <span>状态</span>
                <Select v-model="nState" style="width: 70px">
                    <Option value="-1">全部</Option>
                    <Option value="0">启用</Option>
                    <Option value="1">停用</Option>
                </Select>
                </Col>
                <Col span="6">
                <Button type="primary" @click="search" :disabled="searchDis">查询</Button>
                <Button type="primary" @click="showEdit(-1)" :disabled="searchDis">添加</Button>
                <Button type="primary" @click="exportData" :disabled="searchDis">
                    <Icon type="ios-download-outline"></Icon>
                    导出数据
                </Button>
                </Col>
            </Row>
        </Card>
        <br/>
        <Table height="400" ref="selection" stripe border :loading="tableLoading" :columns="columns" :data="data"
               @on-sort-change="order"></Table>

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
        name: "users",
        data() {
            return {
                name: '',
                cUnit: ['-1'],
                nState: '-1',
                searchDis: true,
                columns: [
                    {
                        type: 'selection',
                        align: 'center',
                        key: 'cUser_Id',
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
                        key: 'cUnit',
                        sortable: true
                    },
                    {
                        title: '部门名称',
                        key: 'cUnitName'
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
                                    color: color,
                                    readonly: true
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
                                            this.showEdit(params.row.cUser_Id);
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
                                            this.delUser(params.row.cUser_Id);
                                        }
                                    }
                                }, '删除')
                            ])
                        }
                    }
                ],
                tree: [],
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
            disabledBtn(isLock) {
                isLock = !!isLock;
                this.searchDis = isLock;
                this.tableLoading = isLock;
            },
            search() {
                this.getInfo();
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
                let {name, cUnit, nState} = this;
                let where = this.$helper.getSendWhere({name, cUnit, nState});
                let result = await this.$http.get(`/v1/user`, {where, index, page, order});
                if (result && result.isSuc) {
                    this.data = result.data.list;
                    this.total = result.data.total;
                }
                this.disabledBtn(false);
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

            },
            async getUnit() {
                let result;
                result = await this.$http.get(`/v1/unit`);
                if (result && result.isSuc) {
                    let {parentList = [], childList = []} = result.data;
                    let tree = [];
                    if (parentList.length) {
                        tree = this.$_.map(parentList, (v, i) => {
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
                    tree.unshift({value: '-1', label: '全部'});
                    this.tree = tree;
                } else {
                    this.$Message.error(result ? result.data.msg : '网络异常');
                }
            },
        },
        mounted: async function () {
            await this.getUnit();
            await this.getInfo(this.index, this.page);
        }
    }
</script>

<style scoped>

</style>