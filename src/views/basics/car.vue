<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline"
              @keyup.enter.native="searchQuery">
        <a-row :gutter="25">
          <a-col :md="6"
                 :sm="8">
            <a-form-item label="车牌号">
              <a-input placeholder="请输入企业名称"
                       v-model="queryParam.vehicleNumber"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6"
                 :sm="8">
            <span style="float: left;overflow: hidden;"
                  class="table-page-search-submitButtons">
              <a-button type="primary"
                        @click="searchQuery"
                        icon="search">查询</a-button>
              <a-button type="primary"
                        @click="handleSuperQuery"
                        icon="search"
                        style="margin-left: 8px">更多查询</a-button>
              <a-button type="primary"
                        @click="searchReset"
                        icon="reload"
                        style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
        >项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div> -->
      <div class="block">
        <a-radio-group class="radio-group" v-model="queryParam['VType']"
                       @change="changeTabs">
          <a-radio-button :value='undefined'>全部</a-radio-button>
          <a-radio-button :value="'0'">自有车辆</a-radio-button>
          <a-radio-button :value="'1'">外协车辆</a-radio-button>
        </a-radio-group>
        <a-button @click="handleAdd"
                  type="primary"
                  icon="plus"
                  >新增</a-button>
        <!-- <a-button @click="batchDel" type="danger" ghost>删除</a-button> -->
        <a-upload name="file"
                  :showUploadList="false"
                  :multiple="false"
                  :headers="tokenHeader"
                  :action="importExcelUrl"
                  @change="handleImportExcel">
          <!-- <a-button type="primary" icon="import" >批量导入</a-button> -->
        </a-upload>
      </div>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table ref="table"
               bordered
               rowKey="id"
               size="middle"
               tableLayout="auto"
               :customRow="rowClick"
               :scroll="{ x: 1500 }"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="ipagination"
               :loading="loading"
               @change="handleTableChange">
        <span slot="driverName"
              slot-scope="text, record">
          {{ text }}
          <a @click="editName(record)"
             v-if="text != null">修改</a>
          <a @click="editName(record)"
             v-else>选择</a>
        </span>

        <span slot="action"
              slot-scope="text, record">
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical"></a-divider>
          <a @click="handleDelete(record.id)">删除</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
    <!-- 表单区域 -->
    <car-modal ref="modalForm"
               @ok="modalFormOk"></car-modal>
    <car-edit-driver-name ref="editForm"
                          @ok="editFormOK"></car-edit-driver-name>
  </a-card>
</template>

<script>
import { filterObj } from '@/utils/util'
import { deleteAction, getAction } from '@/api/manage'
// import Vue from 'vue'
// import { ACCESS_TOKEN } from '@/store/mutation-types'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

import CarModal from './modules/carModal'
// import CarEditDriverName from './modules/carEditDriverName'
import CarEditDriverName from '../order/modules/editDriver'
// order\modules\editDriver.vue
import api from '@/api/index'
import { carTableData } from './const.js'
// import tabledriverData from '@api/tabledriverData'
// import JDate from '@/components/jeecg/JDate.vue'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'

export default {
  name: '',
  mixins: [JeecgListMixin],
  components: { CarModal, CarEditDriverName },
  data() {
    return {
      carParams: '',
      show: 'erverOne',
      carbgc_dictionary: [],
      carType_dictionary: [],
      carStatus_dictionary: [],
      queryParam: {
        vehicleNumber: ''
      },
      rowClick: record => ({
        on: {
          dblclick: () => {
            // this.handleDetail(record)
          }
        }
      }),
      columns: [],
      url: api.carUrl,

      importExcelUrl: 'message/sysMessage/importExcel'
    }
  },
  computed: {},
  mounted() {
    this.columns = carTableData(this)
  },

  methods: {
    //  -------------字典表处理--------------------
    initDictConfig() {
      // //初始化字典 - 订单来源
      // initDictOptions('dataSource_dictionary').then(res => {
      //   if (res.success) {
      //     this.dataSource_dictionary = res.result
      //   }
      // })

      //  车辆颜色
      initDictOptions('vehicleColor').then(res => {
        if (res.success) {
          this.carbgc_dictionary = res.result
        }
      })

      initDictOptions('vehicleType').then(res => {
        if (res.success) {
          this.carType_dictionary = res.result
        }
      })
      // 车辆状态

      initDictOptions('vehicleStatus').then(res => {
        if (res.success) {
          this.carStatus_dictionary = res.result
        }
      })
    },
    changeTabs(value) {
      const val = value.target.value
      if (value === undefined) {
        this.queryParam['VType'] = ''
      } else {
        this.queryParam['vtype'] = val
      }
      this.searchQuery()
      this.onClearSelected()
    },
    //  分页查询
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      // 加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams() // 查询条件
      this.loading = true
      getAction(this.url.list, params).then(res => {
        if (res.success) {
          res.result.records.map(element => {
            if (element.vtype === '0') {
              element.vtype = '自有'
            } else if (element.vtype === '1') {
              element.vtype = '外协'
            }
            // 司机
            if (element.driverName == null) {
              element.driverNameParams = 0
            } else {
              element.driverNameParams = 1
            }
          })
          this.dataSource = res.result.records
          this.ipagination.total = res.result.total
        }
        if (res.code === 510) {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
    },
    searchReset() {
      this.queryParam = {}
      this.loadData(1)
    },
    handleSuperQuery(arg) {
      // 高级查询方法
      if (!arg) {
        this.superQueryParams = ''
        this.superQueryFlag = false
      } else {
        this.superQueryFlag = true
        this.superQueryParams = JSON.stringify(arg)
      }
      this.loadData()
    },
    //  新增
    handleAdd: function() {
      this.$refs.modalForm.add()
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.disableSubmit = false
    },
    //  编辑
    handleEdit: function(record) {
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = '编辑'
      this.$refs.modalForm.disableSubmit = false
    },
    // 修改司机姓名
    editName(record) {
      record.vehicleId = record.id
      this.$refs.editForm.show(record)
      this.$refs.editForm.title = '选择司机'
      this.$refs.editForm.disableSubmit = false
    },
    editFormOK() {
      this.loadData()
    },

    getQueryParams() {
      // 获取查询条件
      const sqp = {}
      if (this.superQueryParams) {
        sqp['superQueryParams'] = encodeURI(this.superQueryParams)
      }
      var param = Object.assign(sqp, this.queryParam, this.isorter, this.filters)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      // eslint-disable-next-line no-console
      console.log('查询条件', param)

      return filterObj(param)
    },
    getQueryField() {
      // TODO 字段权限控制
      var str = 'id,'
      this.columns.forEach(function(value) {
        str += ',' + value.dataIndex
      })
      return str
    },
    //  单删
    handleDelete: function(id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      var that = this
      this.$confirm({
        title: '确认删除',
        content: '是否删除选中数据?',
        onOk: function() {
          that.loading = true
          deleteAction(that.url.delete, {
            id: id
          })
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.loadData()
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.loading = false
            })
        }
      })
    },
    onClearSelected() {
      this.selectedRowKeys = []
      this.selectionRows = []
    },
    searchQuery() {
      this.loadData(1)
    },
    //  多删
    batchDel: function() {
      if (!this.url.deleteBatch) {
        this.$message.error('请设置url.deleteBatch属性!')
        return
      }
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      } else {
        var ids = ''
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectedRowKeys[a] + ','
        }
        var that = this
        this.$confirm({
          title: '确认删除',
          content: '是否删除选中数据?',
          onOk: function() {
            that.loading = true
            deleteAction(that.url.deleteBatch, {
              ids: ids
            })
              .then(res => {
                if (res.success) {
                  that.$message.success(res.message)
                  that.loadData()
                  that.onClearSelected()
                } else {
                  that.$message.warning(res.message)
                }
              })
              .finally(() => {
                that.loading = false
              })
          }
        })
      }
    },
    /* 导入 */
    handleImportExcel(info) {
      if (info.file.status !== 'uploading') {
        // eslint-disable-next-line no-console
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        if (info.file.response.success) {
          // this.$message.success(`${info.file.name} 文件上传成功`);
          if (info.file.response.code === 201) {
            const {
              message,
              result: { msg, fileUrl, fileName }
            } = info.file.response
            const href = window._CONFIG['domianURL'] + fileUrl
            this.$warning({
              title: message,
              content: `<div>
                <span>${msg} </span><br/>
                <span> 具体详情请 <a href = ${href}
                target = "_blank"
                download = ${fileName} > 点击下载 </a> </span >
                </div>`
            })
          } else {
            this.$message.success(info.file.response.message || `${info.file.name} 文件上传成功`)
          }
          this.loadData()
        } else {
          this.$message.error(`${info.file.name} ${info.file.response.message}.`)
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`文件上传失败: ${info.file.msg} `)
      }
    },

    showChange(value) {
      // 清空
      this.onClearSelected()
      this.show = value.target.value
      this.queryParam = {}
      if (this.show === 'all') {
        this.carParams = '2'
      } else if (this.show === 'enable') {
        this.carParams = '1'
      } else if (this.show === 'erverOne') {
        this.carParams = ''
      }
      // 查询
      this.searchQuery()
    }
  }
}
</script>
<style scoped lang="less">

</style>
