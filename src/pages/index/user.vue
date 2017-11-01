<template>
    <div>
        <div class="user-page-right">
            <bread-bar :bread-items="breadItems"></bread-bar>
            <div class="user-page-content">
                <div style="height: 38px">
                    <Button @click="addUser">
                        新建用户
                    </Button>
                </div>
                <div>
                    <Table :data="userTableData" :columns="userTableCol">
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
                <span>删除用户</span>
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
                <span>新建用户</span>
            </p>
            <div style="text-align:left">
                <Form ref="formAddUser" :model="formAddUser" :rules="formAddUserRules"
                      :label-width="71">
                    <Form-item prop="username" label="用户名">
                        <Input v-model="formAddUser.username"></Input>
                    </Form-item>
                    <Form-item label="昵称">
                        <Input v-model="formAddUser.nickname"></Input>
                    </Form-item>
                    <Form-item prop="password" label="密码">
                        <Input type="password" v-model="formAddUser.password"></Input>
                    </Form-item>
                    <Form-item prop="password2" label="确认密码">
                        <Input type="password" v-model="formAddUser.password2"></Input>
                    </Form-item>
                </Form>
            </div>
            <div slot="footer">
                <Button type="primary" long :loading="SubmitLoading"
                        @click="addSubmit('formAddUser')">确认
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
        data () {
            const checkPassword2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.formAddUser.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            }

            return {
                breadItems: ['用户管理'],
                userTableCol: [
                    {
                        key: 'userid',
                        type: 'index',
                        width: 50
                    },
                    {
                        title: '用户名',
                        key: 'username'
                    },
                    {
                        title: '用户昵称',
                        key: 'nickname'
                    },
                    {
                        title: '操作',
                        key: 'actions',
                        render: (h, param) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteUser(param.row.userid)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    },
                ],
                dataCount: 0,
                userTableData: this.getUserData(1),
                deleteModal: false,
                addModal: false,
                selectRow: '',
                SubmitLoading: false,
                formAddUser: {
                    username: '',
                    nickname: '',
                    password: '',
                    password2: '',
                    email: ''
                },
                formAddUserRules: {
                    username: [
                        {required: true, message: '请输入用户名'}
                    ],
                    password: [
                        {required: true, min: 8, max: 12, message: '请输入密码(至少8位)'}
                    ],
                    password2: [
                        {required: true, validator: checkPassword2}
                    ],
                    email: [
                        {type: 'email',message: '请输入正确的邮箱'}
                    ]
                }

            }
        },
        methods: {
            getUserData (p) {
                const url = '/api/users?page=' + p + '&page_size=' + 20
                Http.get(url)
                    .then((res) => {
                        this.dataCount = res.data.total
                        let data = []
                        const items = res.data.items
                        if (items) {
                          for (let i = 0; i < items.length; i++) {
                            const item = items[i]
                            data.push({
                              userid: item.id,
                              username: item.username,
                              nickname: item.nickname,
                              status: item.status,
                            })
                          }
                        }
                        this.userTableData = data
                    })
            },
            changePage (p) {
                this.getUserData(p)
            },
            deleteUser (id) {
                this.deleteModal = true
                this.selectRow = id
            },
            deleteSubmit () {
                const url = '/api/user/' + this.selectRow
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
            },
            addUser () {
                this.addModal = true
            },
            addSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const data = {
                            username: this.formAddUser.username,
                            nickname: this.formAddUser.nickname,
                            password: this.formAddUser.password,
                            email: this.formAddUser.email
                        }
                        this.SubmitLoading = true
                        Http.post('/api/users', data)
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
            }
        }
    }

</script>

<style>
    .user-page-right {
        position: fixed;
        left: 185px;
        top: 60px;
        right: 0;
        bottom: 0;
        overflow: scroll;
    }

    .user-page-content {
        position: relative;
        min-height: 100%;
        top: 8px;
        margin-left: 8px;
        margin-right: 8px;
        margin-bottom: 8px;
        padding-top: 8px;
        padding-left: 8px;
        padding-right: 8px;
        padding-bottom: 80px;
        border-radius: 5px;
        background: white;
    }

</style>
