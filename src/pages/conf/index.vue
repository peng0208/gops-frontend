<template>
    <div style="height: 100%;">
        <nav-bar></nav-bar>
        <Menu width="185px" class="sidemenu" :active-name="activeKey" @on-select="onSelect">
            <Menu-item name="/conf/tag">
                <Icon type="ios-list"></Icon>
                项目列表
            </Menu-item>
            <Menu-item name="/conf/config">
                <Icon type="gear-a"></Icon>
                配置文件
            </Menu-item>
            <Menu-item name="/conf/key" v-if="false">
                <Icon type="gear-a"></Icon>
                配置键
            </Menu-item>
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
