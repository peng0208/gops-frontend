<template>
    <div style="height: 100%;">
        <nav-bar></nav-bar>
        <Menu width="185px" class="sidemenu" @on-select="onSelect" :active-name="activeKey">
            <Menu-item name="/user">
                <Icon type="ios-people"></Icon>
                用户管理
            </Menu-item>
        </Menu>
    </div>
</template>

<script>
    import NavBar from '../../components/navbar'

    export default {
        data() {
            return {
                activeKey: this.$route.path
            }
        },
        components: {
            NavBar,
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