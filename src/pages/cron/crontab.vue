<template>
  <div>
    <div class="crontab-page-right">
      <bread-bar :bread-items="breadItems"></bread-bar>
      <div class="crontab-page-content">
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
          <Button @click="addCrontab" v-if="selectTag">
            新建定时任务
          </Button>
        </div>
        <div>
          <Table :data="crontabTableData" :columns="crontabTableCol">
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
            <span>删除定时任务</span>
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
        <Modal v-model="addModal" width="600">
          <p slot="header" style="text-align:center">
            <Icon type="information-circled"></Icon>
            <span>新建定时任务</span>
          </p>
          <div style="text-align:left">
            <Form ref="formAddCrontab" :model="formAddCrontab"
                  :rules="formAddCrontabRules" :label-width="71">
              <Form-item prop="comment" label="任务名">
                <Input v-model="formAddCrontab.cronname"></Input>
              </Form-item>
              <Form-item prop="command" label="任务参数">
                <Input v-model="formAddCrontab.args"></Input>
              </Form-item>
              <Form-item prop="schedule" label="任务周期">
                <Input v-model="formAddCrontab.schedule"
                       placeholder="Crontab表达式"></Input>
              </Form-item>
              <Form-item label="任务状态">
                <Select v-model="formAddCrontab.enable">
                  <Option value="1">启用</Option>
                  <Option value="0">禁用</Option>
                </Select>
              </Form-item>
            </Form>
          </div>
          <div slot="footer">
            <Button type="primary" long :loading="SubmitLoading"
                    @click="addSubmit('formAddCrontab')">确认
            </Button>
          </div>
        </Modal>
        <Modal v-model="editModal" width="600">
          <p slot="header" style="text-align:center">
            <Icon type="information-circled"></Icon>
            <span>编辑定时任务</span>
          </p>
          <div style="text-align:left">
            <Form ref="formEditCrontab" :model="formEditCrontab"
                  :rules="formEditCrontabRules"
                  :label-width="71">
              <Form-item prop="comment" label="任务名">
                <Input disabled v-model="formEditCrontab.cronname"></Input>
              </Form-item>
              <Form-item prop="command" label="任务参数">
                <Input v-model="formEditCrontab.args"></Input>
              </Form-item>
              <Form-item prop="schedule" label="任务周期">
                <Input v-model="formEditCrontab.schedule"
                       placeholder="Crontab表达式"></Input>
              </Form-item>
            </Form>
          </div>
          <div slot="footer">
            <Button type="primary" long :loading="SubmitLoading"
                    @click="editSubmit('formEditCrontab')">确认
            </Button>
          </div>
        </Modal>
        <Modal v-model="editStatusModal" width="360">
          <p slot="header" style="text-align:center">
            <Icon type="information-circled"></Icon>
            <span>编辑状态</span>
          </p>
          <div style="text-align:left">
            <Form :model="formEditCrontabStatus" :label-width="70">
              <Form-item label="任务状态">
                <Select v-model="formEditCrontabStatus.enable"
                        style="width:200px;margin-left:30px">
                  <Option value="1">启用</Option>
                  <Option value="0">禁用</Option>
                </Select>
              </Form-item>
            </Form>
          </div>
          <div slot="footer">
            <Button type="primary" long :loading="SubmitLoading"
                    @click="editStatusSubmit">确认
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
    data() {
      return {
        breadItems: ['任务列表'],
        crontabTableData: this.getCrontabData(1),
        cronTags: this.getcronTags(),
        dataCount: 0,
        SubmitLoading: false,
        addModal: false,
        editModal: false,
        editStatusModal: false,
        deleteModal: false,
        selectRow: '',
        selectTag: '',
        formAddCrontab: {
          cronname: '',
          args: '',
          schedule: '',
          enable: '',
        },
        formAddCrontabRules: {
          cronname: [
            {required: true, message: '请输入任务名'},
          ],
          args: [
            {required: true, message: '请输入任务参数'},
          ],
          schedule: [
            {required: true, message: '请输入任务周期'},
          ]
        },
        formEditCrontab: {
          cronname: '',
          args: '',
          schedule: '',
          enable: '1',
        },
        formEditCrontabRules: {
          cronname: [
            {required: true, message: '请输入任务名'},
          ],
          args: [
            {required: true, message: '请输入任务参数'},
          ],
          schedule: [
            {required: true, message: '请输入任务周期'},
          ]
        },
        formDeleteCrontab: {
          cronname: ''
        },
        formEditCrontabStatus: {
          cronname: '',
          args: '',
          schedule: '',
          enable: '1',
        },
        crontabTableCol: [
          {
            key: 'crontabid',
            type: 'index',
            width: 50
          },
          {
            title: '任务名',
            key: 'cronname',
            width: 200
          },
          {
            title: '任务命令',
            key: 'args',
          },
          {
            title: '任务周期',
            key: 'schedule',
            width: 150

          },
          {
            title: '任务状态',
            key: 'enable',
            width: 135,
            render: (h, param) => {
              const color = param.row.enable == '1' ? 'green' : 'red'
              const text = param.row.enable == '1' ? '已启用' : '已禁用'
              return h('Tag', {
                props: {
                  type: 'dot',
                  color: color
                },
                nativeOn: {
                  click: () => {
                    this.editCrontabStatus(param.row)
                  }
                }
              }, text);
            }
          },
          {
            title: '操作',
            key: 'actions',
            width: 135,
            render: (h, param) => {
              return h('div', [
                h('Button', {
                  props: {
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editCrontab(param.row)
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.deleteCrontab(param.row)
                    }
                  }
                }, '删除')
              ]);
            }
          },
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
        this.getCrontabData(1)
      },
      getCrontabData(p) {
        var env = this.selectTag
        if (env) {
          const url = '/api/crons/' + env + '?page=' + p + '&page_size=' + 20
          Http.get(url)
            .then((res) => {
              this.dataCount = res.data.total
              let data = []
              const items = res.data.items
              if (items) {
                for (let i = 0; i < items.length; i++) {
                  const item = items[i]
                  data.push({
                    crontabid: item.id,
                    cronname: item.name,
                    args: item.args,
                    schedule: item.schedule,
                    enable: item.enable
                  })
                }
              }
              this.crontabTableData = data
            })
        }
      },
      changePage(p) {
        this.getCrontabData(p)
      },
      addCrontab() {
        this.addModal = true
      },
      addSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.SubmitLoading = true
            var env = this.selectTag
            const url = '/api/crons/' + env
            const data = this.formAddCrontab
            Http.post(url, data)
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
      },
      editCrontab(row) {
        this.editModal = true
        this.selectRow = row.crontabid
        this.formEditCrontab = row
      },
      editSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.SubmitLoading = true
            var env = this.selectTag
            const url = '/api/cron/' + env + '/' + this.selectRow
            Http.put(url, this.formEditCrontab)
              .then((res) => {
                if (res.code == 1) {
                  this.editModal = false
                  this.changePage(1)
                }
                else {
                  this.$Message.error(res.message)
                }
                this.SubmitLoading = false
              })
          }
        })
      },
      editCrontabStatus(row) {
        this.editStatusModal = true
        this.selectRow = row.crontabid
        this.formEditCrontabStatus = row
      },
      editStatusSubmit(name) {
        this.SubmitLoading = true
        var env = this.selectTag
        const url = '/api/cron/status/' + env + '/' + this.selectRow
        Http.patch(url, this.formEditCrontabStatus)
          .then((res) => {
            if (res.code == 1) {
              this.editStatusModal = false
              this.changePage(1)
            }
            else {
              this.$Message.error(res.message)
            }
            this.SubmitLoading = false
          })
      },
      deleteCrontab(row) {
        this.deleteModal = true
        this.selectRow = row.crontabid
        this.formDeleteCrontab = row.cronname
      }
      ,
      deleteSubmit() {
        this.SubmitLoading = true
        var env = this.selectTag
        const url = '/api/cron/' + env + '/' + this.selectRow
        Http.delete(url, this.formDeleteCrontab).then((res) => {
          if (res.code == 1) {
            this.deleteModal = false
            this.changePage(1)
          }
          else {
            this.$Message.error(res.message)
          }
        })
        this.SubmitLoading = false
      }
    }
  }
</script>

<style>
  .crontab-page-right {
    position: fixed;
    left: 185px;
    top: 60px;
    right: 0;
    bottom: 0;
    overflow: scroll;
  }

  .crontab-page-content {
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
