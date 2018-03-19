<template>
    <div>
        <Card style="width:100%">
            <Row :gutter="16">
                <Col span="5">
                <span>编号/名称</span>
                <Input v-model="name" style="width: 100px"></Input>
                </Col>
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
                <Button type="primary" @click="exportData" :disabled="searchDis">
                    <Icon type="ios-download-outline"></Icon>
                    导出数据
                </Button>
                </Col>
            </Row>
        </Card>
        <br/>
        <Table height="400" ref="selection" stripe border :loading="tableLoading" :columns="columns" :data="tableData"
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
                cDept: ['-1'],
                status: '-1',
                searchDis: true,
                columns: [
                    {
                        type: 'selection',
                        align: 'center',
                        key: 'cNo',
                        width: 60
                    },
                    {
                        title: '部门编号',
                        key: 'cNo'
                    },
                    {
                        title: '部门名称',
                        key: 'cName'
                    },
                    {
                        title: '上级部门编号',
                        key: 'parentNo'
                    },
                    {
                        title: '上级部门名称',
                        key: 'parentName'
                    },
                    {
                        title: '是否生产单位',
                        key: 'isProduct'
                    },
                    {
                        title: '是否场外所',
                        key: 'isOut'
                    },
                    {
                        title: '状态',
                        key: 'status',
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
                                            this.showEdit(params.row.cNo);
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
                                            this.delUser(params.row.cNo);
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
        computed:{
            tableData:function () {
                return this.$_.map(this.data,(v,i)=>{
                    let {parentId,isProduct,isOut}=v;

                    let {cNo='',cName='' }= this.$_.find(this.data,{cNo:parentId}) || {};
                    debugger
                    if(cNo){
                        v.parentNo=cNo;
                        v.parentName=cName;
                    }
                    v.isProduct = isProduct ? '是':'否';
                    v.isOut = isOut ? '是':'否';
                    return v;
                });
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
                this.$router.push({path: `/index/depts/${id ? id : -1 }`});
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
                this.getDept();
            },
            exportData() {
                this.$refs.selection.exportCsv({
                    filename: '用户数据',
                    columns: this.columns.filter((col, index) => index > 0 && index < 6),
                    data: this.data
                });

            },
            async getDept(index = 1, page = 20, order) {
                this.disabledBtn(true);
                let {name, cDept, nState} = this;
                let where = this.$helper.getSendWhere({name, cDept, nState});
                let result = await this.$http.get(`/v1/dept`, {where, index, page, order});
                if (result && result.isSuc) {

                    this.data = result.data.deptList;
                    this.total = result.data.total;
                    debugger

                }
                this.disabledBtn(false);
            },
            async delUser(id) {
                this.$Modal.confirm({
                    content: '您是否要删除该行?',
                    onOk: async () => {
                        let result = await  this.$http.delete(`/v1/dept/${id}`);
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
        mounted: async function () {
            //await this.getDept();
            await this.getDept(this.index, this.page);
        }
    }
</script>

<style scoped>

</style>