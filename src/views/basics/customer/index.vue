<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="12">
            <a-form-item label="单位名称：">
              <a-input placeholder="请输入客户名称" v-model="queryParam.customerName"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="12">
            <a-form-item label="联系人：">
              <a-input placeholder="请输入联系人" v-model="queryParam.linkName"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="12">
            <a-form-item label="联系电话：">
              <a-input placeholder="请输入联系电话" v-model="queryParam.linkPhone"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="default" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 操作按钮区域 -->
    <div class="table-operator" style="border-top: 5px;margin-top:8px">
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i>已选择&nbsp;
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项&nbsp;&nbsp;
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div> -->
      <div >
         <a-radio-group
         class="block"
          v-model="queryParam['delFlag']" @change="changeTabs">
          <a-radio-button :value='undefined'>全部</a-radio-button>
          <a-radio-button :value="'0'">启用</a-radio-button>
          <a-radio-button :value="'1'">禁用</a-radio-button>
        </a-radio-group>
                <a-button @click="handleAdd(show)" type="primary">新增客户</a-button>
      </div>

    </div>

    <!-- table区域 -->
    <div>
      <!-- table区域-begin -->

      <a-table
        ref="table"
        bordered
        size="middle"
        rowKey="id"
        tableLayout="auto"
        :columns="columns"
        :scroll="{ x: true }"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
        :customRow="rowClick"
      >
        <span slot="type" slot-scope="text">
          <div v-if="text == 0">单位</div>
          <div v-if="text == 1">个体</div>
        </span>
        <span slot="action" slot-scope="text, record">
          <a-switch
            checkedChildren="启用"
            unCheckedChildren="禁用"
            :defaultChecked="record.delFlag == 0 ? true : false"
            @click="handleDeleteStatus(record)"
            :loading="switchLoading"
          />
          <a-divider type="vertical"></a-divider>
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical"></a-divider>
          <a @click="handleDetail(record)">详情</a>
        </span>
      </a-table>
    </div>

    <!-- table区域-end -->
    <customer-modal ref="modalForm" @ok="modalFormOk"></customer-modal>
  </a-card>
</template>
<script>
import {
  JeecgListMixin
} from '@/mixins/JeecgListMixin'
import customerModal from './customerModal'
import {
  getAction,
  editStatus
} from '@/api/manage'

import api from '@/api/index'
import {
  filterObj
} from '@/utils/util'
import { customerTableDataUser, customerTableData } from '../const.js'
export default {
  name: '',
  mixins: [JeecgListMixin],
  components: {
    customerModal
  },
  data() {
    return {
      ipagination: {},
      show: 'all',
      columns: customerTableData,
      columnsUser: customerTableDataUser,
      url: api.customerUrl,
      rowClick: record => ({
        on: {
          dblclick: () => {
          }
        }
      })
    }
  },
  watch: {},
  created() {
    const userType = JSON.parse(localStorage.getItem('pro__Login_Userinfo')).value.userType
    if (userType === 'HZ') {
      this.columns = this.columnsUser
    }
  },
  methods: {
    changeTabs(value) {
      const val = value.target.value
      if (value === undefined) {
        this.queryParam['delFlag'] = ''
      } else {
        this.queryParam['delFlag'] = val
      }
      this.searchQuery()
      this.onClearSelected()
    },
    handleDeleteStatus: function(record) {
      if (!this.url.deleteStatus) {
        this.$message.error('请设置url.deleteStatus属性!')
        return
      }
      this.switchLoading = true
      if (record.delFlag === 0) {
        record.delFlag = 1
      } else {
        record.delFlag = 0
      }
      editStatus(this.url.deleteStatus, {
        id: record.id,
        delFlag: record.delFlag
      })
        .then(res => {
          if (res.success) {
            this.$message.success(res.message)
            this.loadData()
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.switchLoading = false
        })
    },
    searchReset() {
      this.queryParam = {
        userId: JSON.parse(localStorage.getItem('pro__Login_Userinfo')).value.dataId
      }
      this.loadData(1)
    },
    modalFormOk() {
      // 新增/修改 成功时，重载列表
      this.loadData()
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
          this.dataSource = res.result.records
          this.ipagination.total = res.result.total
        }
        if (res.code === 510) {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
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
      param.userId = JSON.parse(localStorage.getItem('pro__Login_Userinfo')).value.dataId

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

    showChange(value) {
      this.onClearSelected()
      this.show = value.target.value
      this.queryParam = {}
      if (this.show === 'all') {
        // eslint-disable-next-line no-console
        console.log(null)
      } else if (this.show === 'enable') {
        this.queryParam.delFlag = 0
      } else if (this.show === 'disable') {
        this.queryParam.delFlag = 1
      }
      this.searchQuery()
    },
    // // 新增
    handleAdd(show) {
      var record = {}
      record.show = show
      record.type = 1
      this.$refs.modalForm.add(record)
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.disableSubmit = false
    },

    //  修改
    handleEdit(record) {
      record.show = this.show
      record.type = 2
      const Aparams = 'HQXQ'
      this.$refs.modalForm.edit(record, Aparams)
      this.$refs.modalForm.title = '编辑'
      this.$refs.modalForm.disableSubmit = false
      sessionStorage.setItem('customerDetails', record.id)
    },
    //  详情
    handleDetail(record) {
      record.show = this.show
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = '详情'
      this.$refs.modalForm.disableSubmit = true
    }
  }
}
</script>
<style scoped lang="less">
    // @import url('./article.less');
</style>
