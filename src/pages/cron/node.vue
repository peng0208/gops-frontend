<template>
  <div>
    <div class="node-page-right">
      <bread-bar :bread-items="breadItems"></bread-bar>
      <div class="node-page-content">
        <div style="height: 38px">
          <strong style="font-size: 13px">选择环境: </strong>
          <Select v-model="selectTag"
                  style="width: 160px;margin-right: 10px;margin-left: 5px"
                  @on-change="changeTag">
            <Option :value="item.value" :key="item.label"
                    v-for="item in cronTags">
              {{item.label}}
            </Option>
          </Select>
        </div>
        <div>
          <Table :data="nodeTableData" :columns="nodeTableCol">
          </Table>
        </div>
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
        breadItems: ['主机节点'],
        nodeTableData: this.getNodeData(),
        cronTags: this.getcronTags(),
        SubmitLoading: false,
        selectRow: '',
        selectTag: '',
        nodeTableCol: [
          {
            type: 'index',
            width: 50
          },
          {
            title: '节点名',
            key: 'nodename',
          },
          {
            title: '节点负载',
            key: 'loadstat',
          }
        ],
      }
    },
    methods: {
      getcronTags() {
        const url = '/api/crontags'
        Http.get(url)
          .then((res) => {
            this.dataCount = res.data.total
            let data = []
            const items = res.data.items
            for (let i = 0; i < items.length; i++) {
              const item = items[i]
              data.push({
                label: item.remark,
                value: item.tagname
              })
            }
            this.cronTags = data
            if (data[0]) {
              this.selectTag = data[0].value
            }
          })
      },
      changeTag(v) {
        this.selectTag = v
        this.getNodeData()
      },
      getNodeData() {
        const url = '/api/cronnodes/' + this.selectTag
        Http.get(url)
          .then((res) => {
            let data = []
            const items = res.data
            for (let i = 0; i < items.length; i++) {
              const item = items[i]
              data.push({
                nodename: item.nodename,
                loadstat: item.loadstat,
              })
            }
            this.nodeTableData = data
          })
      },
    }
  }

</script>

<style>
  .node-page-right {
    position: fixed;
    left: 185px;
    top: 60px;
    right: 0;
    bottom: 0;
    overflow: scroll;
  }

  .node-page-content {
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
