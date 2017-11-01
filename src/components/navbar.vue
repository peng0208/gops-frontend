<template xmlns="http://www.w3.org/1999/html">
    <div style="-moz-user-select:none;-webkit-user-select:none;">
        <Menu mode="horizontal" theme="dark" :active-name="activeKey" @on-select="onSelect">
            <div class="menu-logo">运维作业平台</div>
            <div class="menu-body">
                <Menu-item name="/">
                    <Icon type="home"></Icon>首页
                </Menu-item>
                <Menu-item name="/conf">
                    <Icon type="gear-a"></Icon>配置中心
                </Menu-item>
                <Menu-item name="/cron">
                    <Icon type="clock"></Icon>定时任务
                </Menu-item>
            </div>
            <Dropdown class="menu-right">
                <Icon type="ios-person"></Icon>
                {{currentUser}}
                <Icon type="arrow-down-b"></Icon>
                <Dropdown-menu slot="list">
                    <Dropdown-item @click.native="onLogout">
                        <Icon type="log-out"></Icon> 退出</Dropdown-item>
                </Dropdown-menu>
            </Dropdown>
        </Menu>
        <router-view></router-view>
    </div>
</template>

<script>
    import cookies from '../utils/cookies'
    import Http from '../utils/http'
    export default {
        data () {
            return {
                activeKey: '/' + this.$route.path.split('/')[1],
                currentUser: cookies.get('_cu')
            }
        },
        methods: {
            onSelect (n) {
                this.$router.push(n)
            },
            onLogout () {
                Http.post('/api/logout')
                    .then((res) => {
                    if (res && res.code == 1) {
                        location.replace('/#/login')
                    }
                    })

            }
        }
    }
</script>

<style>

    .menu-logo {
        text-align: center;
        font-size: 20px;
        color: #e2e2e2;
        width: 200px;
        float: left;
    }

    .menu-right {
        text-align: center;
        font-size: 15px;
        color: #e2e2e2;
        width: 100px;
        height: 30px;
        float: right;
        right: 0px
    }
</style>
