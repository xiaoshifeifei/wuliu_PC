<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline"
              @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6"
                 :sm="12">
            <a-form-item label="企业名称：">
              <a-input placeholder="请输入企业名称"
                       v-model="queryParam.carrierName"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6"
                 :sm="8">
            <a-form-item label="营业执照号：">
              <a-input placeholder="请输入营业执照号"
                       v-model="queryParam.companyBusinessLicense"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6"
                 :sm="8">
            <a-form-item label="企业类型：">
              <a-select v-model="queryParam.carrierType"
                        placeholder="请选择类型">
                <a-select-option value="0">小规模纳税人</a-select-option>
                <a-select-option value="1">一般纳税人</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6"
                 :sm="8">
            <span style="float: left;overflow: hidden;"
                  class="table-page-search-submitButtons">
              <a-button type="primary"
                        @click="searchQuery"
                        icon="search">查询</a-button>
              <a-button type="default"
                        @click="searchReset"
                        icon="reload"
                        style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 操作按钮区域 -->
    <div class="table-operator"
         style="border-top: 5px">
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i>已选择&nbsp;
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项&nbsp;&nbsp;
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div> -->
      <div class="tabs">
        <a-radio-group v-model="queryParam['delFlag']"
                       @change="changeTabs">
          <a-radio-button :value='undefined'>全部</a-radio-button>
          <a-radio-button :value="'0'">启用</a-radio-button>
          <a-radio-button :value="'1'">禁用</a-radio-button>
        </a-radio-group>
      </div>
      <a-button @click="handleAdd"
                type="primary">新增</a-button>
      <!-- <a-button @click="batchDel">删除</a-button> -->
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
               :scroll="{ x: true }"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="ipagination"
               :loading="loading"
               @change="handleTableChange"
               :customRow="rowClick">
        <!-- //TODO 序号-->
        <span slot="num"
              slot-scope="text, record, index">{{
          (ipagination.current - 1) * ipagination.pageSize + index + 1
        }}</span>
        <!-- //TODO 企业类型-->
        <span slot="unitType"
              slot-scope="text">
          <div v-if="text == 0">小规模纳税人</div>
          <div v-if="text == 1">一般纳税人</div>
        </span>

        <span slot="action"
              slot-scope="text, record">
          <a-switch checkedChildren="启用"
                    unCheckedChildren="禁用"
                    :defaultChecked="record.delFlag == 0 ? true : false"
                    @click="handleDeleteStatus(record)"
                    :loading="switchLoading" />
          <a-divider type="vertical"></a-divider>
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical"></a-divider>
          <a @click="handleDetailPage(record)">详情</a>
          <a-divider type="vertical"></a-divider>
          <a @click="handleBusiness(record)">业务往来</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
    <carrier-modal ref="modalForm"
                   @ok="modalFormOk"></carrier-modal>
    <carrier-add ref="driverForm"
                 @ok="modalFormOk"></carrier-add>
  </a-card>
</template>
<script>
import { filterObj } from '@/utils/util'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@/api/manage'

import CarrierModal from './modules/carrierModal'
import carrierAdd from './carrierAdd'
import api from '@/api/index'
import { carrierTableData } from './const.js'
export default {
  name: '',
  mixins: [JeecgListMixin],
  components: {
    CarrierModal,
    carrierAdd
  },
  data() {
    return {
      userType: '',
      url: api.basicsCarrierUrl,
      columns: carrierTableData,
      show: 'all',
      rowClick: record => ({
        on: {
          dblclick: () => {
            // this.handleDetail(record)
          }
        }
      })
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
      const getParams = sessionStorage.getItem('getres')
      // eslint-disable-next-line no-console
      console.log('getParams', getParams)
      const userType = JSON.parse(localStorage.getItem('pro__Login_Userinfo')).value.dataId
      params.userId = userType

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

    // 业务往来
    handleBusiness(record) {
      this.$refs.driverForm.show(record)
      this.$refs.driverForm.title = '业务往来'
      this.$refs.driverForm.disableSubmit = false
    },
    showChange(value) {
      // 清空
      this.onClearSelected()
      this.show = value.target.value
      this.queryParam = {}
      if (this.show === 'all') {
        // eslint-disable-next-line no-console
        console.log(null)
      } else if (this.show === 'enable') {
        this.queryParam.delFlag = '0'
      } else if (this.show === 'disable') {
        this.queryParam.delFlag = '1'
      }
      // 查询
      this.searchQuery()
    },
    searchQuery() {
      this.loadData(1)
    },
    handleDetailPage(record) {
      const Aparams = 'HQXQ'
      this.$refs.modalForm.edit(record, Aparams)
      this.$refs.modalForm.title = '详情'
      this.$refs.modalForm.disableSubmit = true
    }
  }
}
</script>
<style scoped lang="less">
@import url('./article.less');
.tabs {
  // display: inline-block;
  margin: 7px 15px 0 5px;
}
</style>
