<template>
    <div style="height: 100%;">
        <nav-bar></nav-bar>
        <Menu width="185px" class="sidemenu" :active-name="activeKey" @on-select="onSelect">
            <Menu-item name="/ops/script">
                <Icon type="cube"></Icon>
                脚本管理
            </Menu-item>
            <Menu-item name="/ops/tool">
                <Icon type="settings"></Icon>
                运维作业
            </Menu-item>
            <Menu-item name="/ops/history">
                <Icon type="clock"></Icon>
                作业历史
            </Menu-item>
            <!--<Menu-item name="/ops/doc">-->
                <!--<Icon type="folder"></Icon>-->
                <!--文档管理-->
            <!--</Menu-item>-->
            <!--<Submenu name="doc">-->
                <!--<template slot="title">-->
                    <!--<Icon type="ios-paper"></Icon>-->
                    <!--运维文档-->
                <!--</template>-->
                <!--<Menu-item name="/ops/doctag">文档类目</Menu-item>-->
                <!--<Menu-item name="/ops/doc">文档列表</Menu-item>-->
            <!--</Submenu>-->
        </Menu>
    </div>
</template>

<script>
    import NavBar from '../../components/navbar'
    export default {
        data () {
            return {
                activeKey: this.$route.path
            }
        },
        components: {
            NavBar
        },
        methods: {
            onSelect (n) {
                this.$router.push(n)
            }
        }
    }
</script>

<style>
    .sidemenu {
        position: absolute;
        top: 60px;
        bottom: 0;
        padding-top: 14px;
        overflow: scroll;
    }
</style>