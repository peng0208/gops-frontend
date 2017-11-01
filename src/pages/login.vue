<template>
    <div class="login-page">
        <h1 class="login-title">运维作业平台-登录</h1>
        <div>
            <Form ref="formLogin" :model="formLogin" :rules="formRules">
                <Form-item prop="username">
                    <Input v-model="formLogin.username" placeholder="用户名">
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </Form-item>
                <Form-item prop="password">
                    <Input type="password" v-model="formLogin.password" placeholder="密码">
                        <Icon type="ios-locked-outline" slot="prepend"></Icon>
                    </Input>
                </Form-item>
                    <Form-item>
                        <Button long type="success" @click="onLogin('formLogin')">登录</Button>
                    </Form-item>
            </Form>
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
                },
                formRules: {
                    username: [
                        {required: true, message: '请输入用户名'}
                    ],
                    password: [
                        {required: true, message: '请输入密码'}
                    ]
                }
            }
        },
        methods: {
            onLogin (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const data = {
                            "username": this.formLogin.username,
                            "password": this.formLogin.password
                        }
                        Http.post('/api/login', data)
                            .then((res) => {
                                if (res && res.code == 1) {
                                    this.$router.replace('/')
                                } else {
                                    this.$Message.error(res.message)
                                }
                            })

                    } else {
                        return false
                    }
                })
            },
            onRegister (name) {
                this.$router.push('/register')
//                this.$refs[name].resetFields();
            }
        }
    }
</script>

<style>
    .login-page {
        position: relative;
        width: 20%;
        height: 30%;
        top: 30%;
        margin-left: auto;
        margin-right: auto;
    }

    .login-title {
        text-align: center;
        margin-bottom: 25px;
    }

</style>
