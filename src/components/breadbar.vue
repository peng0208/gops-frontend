<template>
    <Breadcrumb class="bread-nav">
        <Icon type="home"></Icon>
        <Breadcrumb-item :key="index" v-for="(item,index) in breadItems">
            {{item}}
        </Breadcrumb-item>
    </Breadcrumb>
</template>

<script>
    export default {
        props: ['breadItems']
    }
</script>

<style>
    .bread-nav {
        position: relative;
        height: 33px;
        right: 0;
        padding-top: 5px;
        padding-left: 15px;
        background: white;
        border-bottom: inset 2px;
    }
</style>