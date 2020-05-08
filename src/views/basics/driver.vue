<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline"
              @keyup.enter.native="searchQuery">
        <a-row :gutter="25">
          <a-col :md="6"
                 :sm="8">
            <a-form-item label="姓名">
              <a-input placeholder="请输入姓名"
                       v-model="queryParam.driverName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6"
                 :sm="8">
            <a-form-item label="电话">
              <a-input placeholder="请输入电话号码"
                       v-model="queryParam.telephone"></a-input>
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
      <div class="block">
        <a-radio-group v-model="queryParam['driverType']"
                       @change="changeTabs">

          <a-radio-button :value='undefined'>全部</a-radio-button>
          <a-radio-button :value="'0'">自有司机</a-radio-button>
          <a-radio-button :value="'1'">外协司机</a-radio-button>
        </a-radio-group>
        <a-button @click="handleAdd"
                  type="primary"
                  icon="plus"
                  style="margin-left:20px">新增</a-button>
      </div>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table ref="table"
               bordered
               rowKey="id"
               size="middle"
               tableLayout="auto"
               :scroll="{ x: 1500 }"
               :columns="columns"
               :customRow="rowClick"
               :loading="loading"
               :dataSource="dataSource"
               :pagination="ipagination"
               @change="handleTableChange">
        <!-- //TODO 序号-->
        <span slot="num"
              slot-scope="text, record, index">{{
          (ipagination.current - 1) * ipagination.pageSize + index + 1
        }}</span>

        <span slot="action"
              slot-scope="text, record">
          <a @click="handleEditNew(record)">修改</a>
          <a-divider type="vertical" />
          <a @click="handleDelete(record.id)">删除</a>
          <a-divider type="vertical"></a-divider>
          <a @click="handleBusiness(record)">业务往来</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <driver-modal ref="modalForm"
                  @ok="modalFormOk"></driver-modal>
    <driver-add ref="driverForm"
                @ok="modalFormOk"></driver-add>
  </a-card>
</template>

<script>
import DriverModal from './modules/DriverModal'
import DriverAdd from './modules/DriverAdd'
import { filterObj } from '@/utils/util'
// import Vue from 'vue'
import { deleteAction, getAction } from '@/api/manage'
// import { ACCESS_TOKEN } from '@/store/mutation-types'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import api from '@/api/index'
// import tabledriverData from '@api/tabledriverData'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
export default {
  name: '',
  mixins: [JeecgListMixin],
  components: {
    DriverModal,
    DriverAdd
  },
  data() {
    return {
      driverType_dictionary: [],
      carParams: '',
      show: 'erverOne',
      rowClick: record => ({
        on: {
          dblclick: () => {
            // this.handleDetail(record)
          }
        }
      }),
      columns: [
        {
          title: '序号',
          align: 'center',
          width: 60,
          dataIndex: 'num',
          scopedSlots: {
            customRender: 'num'
          },
          fixed: 'left'
        },
        {
          title: '身份证号',
          align: 'center',
          ellipsis: true,

          dataIndex: 'drivingLicense',
          fixed: 'left'
        },
        {
          title: '姓名',
          ellipsis: true,
          align: 'center',

          dataIndex: 'driverName'
        },
        {
          title: '性别',
          align: 'center',
          ellipsis: true,

          dataIndex: 'sex_dictText'
        },
        {
          title: '联系电话',
          align: 'center',
          ellipsis: true,

          dataIndex: 'telephone'
        },
        {
          title: '驾驶证号',
          align: 'center',
          ellipsis: true,
          width: 250,
          dataIndex: 'vehicleNo'
        },
        {
          title: '驾驶证类型',
          align: 'center',
          ellipsis: true,
          width: 100,
          dataIndex: 'vehicleClass',
          customRender: text => {
            // 字典值替换通用方法
            return filterDictText(this.driverType_dictionary, text)
          }
        },
        {
          title: '从业资格证号',
          align: 'center',
          ellipsis: true,
          width: 200,
          dataIndex: 'qualificationCertificate'
        },
        {
          title: '收款人身份证',
          align: 'center',
          ellipsis: true,
          width: 250,
          dataIndex: 'payeeIdCard'
        },
        {
          title: '创建时间',
          align: 'center',
          ellipsis: true,
          width: 150,
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          align: 'center',
          ellipsis: true,
          width: 180,
          dataIndex: 'action',
          scopedSlots: {
            customRender: 'action'
          },
          fixed: 'right'
        }
      ],
      url: api.driverUrl
    }
  },
  computed: {
    currentId() {
      return this.id
    }
  },
  methods: {
    changeTabs(value) {
      const val = value.target.value
      if (value === undefined) {
        this.queryParam['driverType'] = ''
      } else {
        this.queryParam['driverType'] = val
      }
      this.searchQuery()
      this.onClearSelected()
    },
    //  分页查询
    // loadData(arg) {
    //   if (!this.url.list) {
    //     this.$message.error('请设置url.list属性!')
    //     return
    //   }

    //   // 加载数据 若传入参数1则加载第一页的内容
    //   if (arg === 1) {
    //     this.ipagination.current = 1
    //   }
    //   var params = this.getQueryParams() // 查询条件
    //   this.loading = true
    //   getAction(this.url.list, params).then(res => {
    //     if (res.result.records.length) {
    //       localStorage.setItem('getCarrierId', res.result.records[0].carrierId)
    //     }
    //     if (res.success) {
    //       res.result.records.map(element => {
    //         if (element.driverType === '0') {
    //           element.driverType = '自有'
    //         } else if (element.driverType === '1') {
    //           element.driverType = '外协'
    //         }

    //         if (element.sex === 'M') {
    //           element.sex = '男'
    //         } else {
    //           element.sex = '女'
    //         }

    //         this.dataSource = res.result.records
    //         this.ipagination.total = res.result.total
    //       })
    //     }
    //     if (res.code === 510) {
    //       this.$message.warning(res.message)
    //     }
    //     this.loading = false
    //   })
    // },
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
    // 业务往来
    handleBusiness(record) {
      this.$refs.driverForm.show(record)
      this.$refs.driverForm.title = '业务往来'
      this.$refs.driverForm.disableSubmit = false
    },
    //  新增
    handleAdd: function() {
      this.$refs.modalForm.add()
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.disableSubmit = false
    },
    //  编辑
    handleEditNew: function(record) {
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = '编辑'
      this.$refs.modalForm.disableSubmit = false
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

    // 自由司机外协司机
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
    },
    //  -------------字典表处理--------------------
    initDictConfig() {
      //  驾驶证类型
      initDictOptions('vehicleClass').then(res => {
        if (res.success) {
          this.driverType_dictionary = res.result
        }
      })
    }
  }
}
</script>
<style scoped>
.ant-card-body .table-operator {
  /* margin-bottom: 18px; */
}

.ant-table-tbody .ant-table-row td {
  padding-top: 15px;
  padding-bottom: 15px;
}

.anty-row-operator button {
  margin: 0 5px;
}

.ant-btn-danger {
  background-color: #ffffff;
}

.ant-modal-cust-warp {
  height: 100%;
}

.ant-modal-cust-warp .ant-modal-body {
  height: calc(100% - 110px) !important;
  overflow-y: auto;
}

.ant-modal-cust-warp .ant-modal-content {
  height: 90% !important;
  overflow-y: hidden;
}
.tabs {
  display: inline-block;
  margin-right: 15px;
}
</style>
