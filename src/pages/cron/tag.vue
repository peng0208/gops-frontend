<template>
    <div>
        <div class="crontag-page-right">
            <bread-bar :bread-items="breadItems"></bread-bar>
            <div class="crontag-page-content">
                <div style="height: 38px">
                    <Button @click="addTag">
                        新建项目
                    </Button>
                </div>
                <div>
                    <Table :data="tagTableData" :columns="tagTableCol">
                    </Table>
                    <div>
                        <div style="margin-top:5px;float: right;">
                            <Page simple size="small" :total="dataCount" :current="1"
                                  :page-size="20" @on-change="changePage"></Page>
                        </div>
                    </div>
                </div>
                <Modal v-model="deleteModal" width="360">
                    <p slot="header" style="text-align:center">
                        <Icon type="information-circled"></Icon>
                        <span>删除项目</span>
                    </p>
                    <div style="text-align:center">
                        <p>确认删除?</p>
                    </div>
                    <div slot="footer">
                        <Button type="primary" long :loading="SubmitLoading"
                                @click="deleteSubmit">删除

                        </Button>
                    </div>
                </Modal>
                <Modal v-model="addModal" width="360">
                    <p slot="header" style="text-align:center">
                        <Icon type="information-circled"></Icon>
                        <span>新建项目</span>
                    </p>
                    <Form ref="formAddTag" :model="formAddTag"
                          :rules="formAddTagRules"
                          :label-width="71">
                        <Form-item prop="tagname" label="项目名称">
                            <Input v-model="formAddTag.tagname">
                            </Input>
                        </Form-item>
                        <Form-item prop="remark" label="项目说明">
                            <Input type="textarea" v-model="formAddTag.remark">
                            </Input>
                        </Form-item>
                    </Form>
                    <div slot="footer">
                        <Button type="primary" long :loading="SubmitLoading"
                                @click="addSubmit('formAddTag')">确认
                        </Button>
                    </div>
                </Modal>
            </div>
        </div>
    </div>
</template>

<script>
    import BreadBar from '../../components/breadbar'
    import Http from '../../utils/http'

    export default {
        components: {
            BreadBar
        },
        data() {
            return {
                breadItems: ['项目列表'],
                tagTableData: this.getTagData(1),
                dataCount: 0,
                SubmitLoading: false,
                addModal: false,
                deleteModal: false,
                selectRow: '',
                tagTableCol: [
                    {
                        key: 'tagid',
                        type: 'index',
                        width: 50
                    },
                    {
                        title: '项目名称',
                        key: 'tagname',
                        width: 200
                    },
                    {
                        title: '项目说明',
                        key: 'remark',
                    },
                    {
                        title: '操作',
                        key: 'actions',
                        width: 135,
                        render: (h, param) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteTag(param.row.tagid)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    },
                ],
                formAddTag: {
                    tagname: '',
                    remark: ''
                },
                formAddTagRules: {
                    tagname: [
                        {required: true, message: '请输入项目名'},
                        {
                            type: 'string',
                            pattern: '^[_0-9a-zA-Z]+$',
                            message: '请输入英文、数字、下划线组合'
                        }
                    ]
                },

            }
        },
        methods: {
            getTagData(p) {
                const url = '/api/crontags' + '?page=' + p + '&page_size=' + 20
                Http.get(url)
                    .then((res) => {
                        this.dataCount = res.data.total
                        let data = []
                        const items = res.data.items
                        for (let i = 0; i < items.length; i++) {
                            const item = items[i]
                            data.push({
                                tagid: item.id,
                                tagname: item.tagname,
                                remark: item.remark,
                            })
                        }
                        this.tagTableData = data
                    })
            },
            changePage(p) {
                this.getTagData(p)
            },
            addTag() {
                this.addModal = true
            },
            addSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.SubmitLoading = true
                        const url = '/api/crontags'
                        const data = this.formAddTag
                        Http.post(url, data)
                            .then((res) => {
                                if (res.code == 1) {
                                    this.addModal = false
                                    this.changePage(1)
                                    this.$refs[name].resetFields()
                                }
                                else {
                                    this.$Message.error(res.message)
                                }
                                this.SubmitLoading = false

                            })
                    }
                })
            },
            deleteTag(tagid) {
                this.selectRow = tagid
                this.deleteModal = true
            },
            deleteSubmit() {
                const url = '/api/crontag/' + this.selectRow
                this.SubmitLoading = true
                Http.delete(url).then((res) => {
                    if (res.code == 1) {
                        this.deleteModal = false
                        this.changePage(1)
                    }
                    else {
                        this.$Message.error(res.message)
                    }
                })
                this.SubmitLoading = false
            }

        }

    }
</script>

<style>
    .crontag-page-right {
        position: fixed;
        left: 185px;
        top: 60px;
        right: 0;
        bottom: 0;
        overflow: scroll;
    }

    .crontag-page-content {
        position: relative;
        min-height: 100%;
        top: 8px;
        margin-left: 8px;
        margin-right: 8px;
        margin-bottom: 8px;
        padding-top: 8px;
        padding-left: 8px;
        padding-right: 8px;
        padding-bottom: 36px;
        border-radius: 5px;
        background: white;
    }
</style>
