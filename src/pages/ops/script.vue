<template>
    <div>
        <div class="doc-page-right">
            <bread-bar :bread-items="breadItems"></bread-bar>
            <div class="doc-page-content">
                <h1>111</h1>
            </div>
        </div>
    </div>
</template>

<script>
    import BreadBar from '../../components/breadbar'

    export default {
        components: {
            BreadBar
        },
        data() {
            return {
                breadItems: ['脚本管理']
            }
        }

    }
</script>

<style>
   .doc-page-right {
        position: fixed;
        left: 185px;
        top: 60px;
        right: 0;
        bottom: 0;
        overflow: scroll;
    }

   .doc-page-content {
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
