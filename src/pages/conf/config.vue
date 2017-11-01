<template>
  <div>
    <div class="conf-page-right">
      <bread-bar :bread-items="breadItems"></bread-bar>
      <div class="conf-page-content">
        <div style="height: 38px">
          <strong style="font-size: 13px">选择项目: </strong>
          <Select v-model="selectTag"
                  style="width: 160px;margin-right: 10px;margin-left: 5px"
                  @on-change="changeTag">
            <Option :value="item.value" :key="item.label"
                    v-for="item in confTags">
              {{item.label}}


            </Option>
          </Select>
          <Button @click="addConf" v-if="selectTag">
            新建配置


          </Button>
        </div>
        <div>
          <Table :data="confTableData" :columns="confTableCol">
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
            <span>删除配置</span>
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
        <Modal v-model="addModal" width="800">
          <p slot="header" style="text-align:center">
            <Icon type="information-circled"></Icon>
            <span>新建配置</span>
          </p>
          <Form ref="formAddConf" :model="formAddConf"
                :rules="formAddConfRules"
                :label-width="71">
            <Form-item prop="confname" label="配置名称">
              <Input v-model="formAddConf.confname">
              </Input>
            </Form-item>
            <Form-item prop="path" label="文件路径">
              <Input v-model="formAddConf.path">
              </Input>
            </Form-item>
            <Form-item prop="content" label="配置内容">
              <Input type="textarea" :rows="10" v-model="formAddConf.content">
              </Input>
            </Form-item>
          </Form>
          <div slot="footer">
            <Button type="primary" long :loading="SubmitLoading"
                    @click="addSubmit('formAddConf')">确认


            </Button>
          </div>
        </Modal>
        <Modal v-model="editModal" width="800">
          <p slot="header" style="text-align:center">
            <Icon type="information-circled"></Icon>
            <span>编辑配置</span>
          </p>
          <Form ref="formEditConf" :model="formEditConf"
                :rules="formEditConfRules"
                :label-width="71">
            <Form-item prop="confname" label="配置名称">
              <Input disabled v-model="formEditConf.confname">
              </Input>
            </Form-item>
            <Form-item prop="path" label="文件路径">
              <Input v-model="formEditConf.path">
              </Input>
            </Form-item>
            <Form-item prop="content" label="配置内容">
              <Input type="textarea" :rows="10" v-model="formEditConf.content">
              </Input>
            </Form-item>
          </Form>
          <div slot="footer">
            <Button type="primary" long :loading="SubmitLoading"
                    @click="editSubmit('formEditConf')">确认


            </Button>
          </div>
        </Modal>
        <Modal v-model="viewModal" width="800">
          <p slot="header" style="text-align:center">
            <Icon type="information-circled"></Icon>
            <span>查看配置</span>
          </p>
          <Form ref="formViewConf" :model="formViewConf"
                :label-width="71">
            <Form-item prop="confname" label="配置名称">
              <Input readonly v-model="formViewConf.confname">
              </Input>
            </Form-item>
            <Form-item prop="path" label="文件路径">
              <Input readonly v-model="formViewConf.path">
              </Input>
            </Form-item>
            <Form-item prop="content" label="配置内容">
              <Input readonly type="textarea" :rows="10"
                     v-model="formViewConf.content">
              </Input>
            </Form-item>
          </Form>
          <div slot="footer">
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
        breadItems: ['配置文件'],
        confTags: this.getConfTags(),
        confTableData: this.getConfData(1),
        dataCount: 0,
        confTableCol: [
          {
            key: 'confid',
            type: 'index',
            width: 50
          },
          {
            title: '配置名称',
            key: 'confname',
            width: 200
          },
          {
            title: '配置路径',
            key: 'path',
          },
          {
            title: '操作',
            key: 'actions',
            width: 180,
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
                      this.viewConf(param.index)
                    }
                  }
                }, '查看'),
                h('Button', {
                  props: {
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editConf(param.index)
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.deleteConf(param.row.confid)
                    }
                  }
                }, '删除')
              ]);
            }
          },
        ],
        selectTag: '',
        addModal: false,
        viewModal: false,
        editModal: false,
        deleteModal: false,
        SubmitLoading: false,
        formAddConf: {
          confname: '',
          path: '',
          content: ''
        },
        formAddConfRules: {
          confname: [
            {required: true, message: '请输入配置名称'},
            {
              type: 'string',
              pattern: '^[_0-9a-zA-Z]+$',
              message: '请输入英文、数字、下划线组合'
            }
          ],
          path: [
            {required: true, message: '请输入文件路径'}
          ],
          content: [
            {required: true, message: '请输入配置内容'}
          ],

        },
        formEditConf: {
          confid: '',
          confname: '',
          path: '',
          content: ''
        },
        formEditConfRules: {
          path: [
            {required: true, message: '请输入文件路径'}
          ],
          content: [
            {required: true, message: '请输入配置内容'}
          ],
        },
        formViewConf: {
          confid: '',
          confname: '',
          path: '',
          content: ''
        },
      }
    },
    methods: {
      getConfTags() {
        const url = '/api/conftags'
        Http.get(url)
          .then((res) => {
            this.dataCount = res.data.total
            let data = []
            const items = res.data.items
            for (let i = 0; i < items.length; i++) {
              const item = items[i]
              data.push({
                label: item.remark,
                value: item.tagname,
              })
            }
            this.confTags = data
            if (data[0]) {
              this.selectTag = data[0].value
            }
          })
      },
      changeTag(v) {
        this.selectConf = v
        this.getConfData(1)
      },
      getConfData(p) {
        var tag = this.selectTag
        if (tag) {
          const url = '/api/conffiles/' + tag + '?page=' + p + '&page_size=' + 20
          Http.get(url)
            .then((res) => {
              this.dataCount = res.data.total
              let data = []
              const items = res.data.items
              if (items) {
                for (let i = 0; i < items.length; i++) {
                  const item = items[i]
                  data.push({
                    confid: item.confid,
                    confname: item.confname,
                    path: item.path,
                    content: item.content
                  })
                }
              }
              this.confTableData = data
            })
        }
      },
      changePage(p) {
        this.getConfData(p)
      },
      addConf() {
        this.addModal = true
      },
      addSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.SubmitLoading = true
            var tag = this.selectTag
            const url = '/api/conffiles/' + tag
            const data = this.formAddConf
            Http.post(url, data)
              .then((res) => {
                if (res.code == 1) {
                  this.addModal = false
                  this.changePage(1)
                  this.$refs[name].resetFields()
                  this.formAddConf.confname = ''
                }
                else {
                  this.$Message.error(res.message)
                }
                this.SubmitLoading = false

              })
          }
        })
      },
      viewConf(i) {
        this.viewModal = true
        this.formViewConf = this.confTableData[i]
      },
      editConf(i) {
        this.editModal = true
        this.formEditConf = this.confTableData[i]
      },
      editSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.SubmitLoading = true
            const url = '/api/conffile/' + this.selectTag + '/' +
              this.formEditConf.confname
            const data = this.formEditConf
            Http.put(url, data)
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
      deleteConf(i) {
        this.selectRow = i
        this.deleteModal = true
      },
      deleteSubmit() {
        const url = '/api/conffile/' + this.selectTag + '/' + this.selectRow
        this.SubmitLoading = true
        Http.delete(url).then((res) => {
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
  .conf-page-right {
    position: fixed;
    left: 185px;
    top: 60px;
    right: 0;
    bottom: 0;
    overflow: scroll;
  }

  .conf-page-content {
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
