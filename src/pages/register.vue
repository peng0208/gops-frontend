<template>
    <div style="height: 100%;">
        <div class="loginContent">
            <h1 class="loginTitle">运维作业平台-注册</h1>
            <div class="loginBody">
                <Form ref="formRegister" :model="formLogin" :rules="formRules" :label-width="50">
                    <Form-item label="账号" prop="username">
                        <Input v-model="formLogin.username" placeholder="请输入账号"></Input>
                    </Form-item>
                    <Form-item label="密码" prop="password">
                        <Input type="password" v-model="formLogin.password" placeholder="请输入密码"></Input>
                    </Form-item>
                    <Form-item label="确认密码" prop="password">
                        <Input type="password" v-model="formLogin.password2" placeholder="请再次输入密码"></Input>
                    </Form-item>
                    <div class="loginBtn">
                        <Form-item>
                            <Button type="primary" @click="onRegister('formRegister')">注册</Button>
                            <Button type="ghost" @click="onReset('formRegister')" style="margin-left: 8px">重置</Button>
                        </Form-item>
                    </div>
                </Form>
            </div>
        </div>
    </div>
</template>

<script>
    import Http from '../utils/http'

    export default {
        data () {
            return {
                formLogin: {
                    username: '',
                    password: '',
                    password2: '',
                },
                formRules: {
                    username: [
                        {required: true, message: '请输入账号'}
                    ],
                    password: [
                        {required: true, message: '请输入密码'}
                    ]
                }
            }
        },
        methods: {
            onRegister (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const data = {
                            "username": this.formLogin.username,
                            "password": this.formLogin.password
                        }
                        Http.post('/api/login', data)
                            .then((res) => {
                                if (res && res.code == 1) {
                                    this.$router.replace('/index')
                                } else {
                                    this.$Message.error(res.message)
                                }
                            })

                    } else {
                        return false
                    }
                })
            },
            onReset (name) {
                this.$refs[name].resetFields();
            }
        }
    }
</script>

<style>
    .loginContent {
        height: 100%;
        width: 300px;
        margin-top: 180px;
        margin-left: auto;
        margin-right: auto;
    }

    .loginTitle {
        text-align: center;
        margin-bottom: 40px;
    }

    .loginBody {
        padding-right: 10px;
    }

    .loginBtn {
        padding-left: 50px;
    }
</style>
