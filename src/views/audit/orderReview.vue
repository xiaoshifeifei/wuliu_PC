<!--
 * @Author: your name
 * @Date: 2020-04-26 19:09:26
 * @LastEditTime: 2020-05-08 11:43:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \gswl-web\src\views\orderReview\reviewList.vue
 -->
<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <a-row :gutter="24">
      <div class="table-page-search-wrapper">
        <a-form @keyup.enter.native="searchQuery"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol">
          <a-col :span="label">
            <a-form-item label="订单号：">
              <a-input placeholder="请输入订单号"
                       v-model="queryParam.orderNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="导入结果：">
              <j-dict-select-tag v-model="queryParam.importFlag"
                                 placeholder="请选择导入结果"
                                 dictCode="import_flag" />
            </a-form-item>
          </a-col>
          <!-- 收起展开列表 -->
          <template v-if="toggleSearchStatus">
            <a-col :span="label">
              <a-form-item label="托运时间：">
                <j-date v-model="queryParam.consignmentDateTime"
                        placeholder="请选择时间"
                        :show-time="true"
                        date-format="YYYY-MM-DD HH:mm:ss"></j-date>
              </a-form-item>
            </a-col>

            <a-col :span="label">
              <a-form-item label="配送时间：">
                <j-date v-model="queryParam.shippingDateTime"
                        placeholder="请选择时间"
                        :show-time="true"
                        date-format="YYYY-MM-DD HH:mm:ss"></j-date>
              </a-form-item>
            </a-col>

            <a-col :span="label">
              <a-form-item label="客户名称：">
                <a-input v-model="queryParam['customerName']"
                         placeholder="请输入客户名称"></a-input>
              </a-form-item>
            </a-col>

            <a-col :span="label">
              <a-form-item label="收货单位：">
                <a-input v-model="queryParam['consignee']"
                         placeholder="请输入收货客户名称"></a-input>
              </a-form-item>
            </a-col>

            <a-col :span="label">
              <a-form-item label="发货单位：">
                <a-input v-model="queryParam['consignor']"
                         placeholder="请输入发货客户名称"></a-input>
              </a-form-item>
            </a-col>
          </template>

          <a-col :span="label">
            <span style="float: left;overflow: hidden;"
                  class="table-page-search-submitButtons">
              <a-button type="primary"
                        @click="searchQuery"
                        icon="search">查询</a-button>
              <a-button type="default"
                        @click="searchReset"
                        icon="reload"
                        style="margin-left: 8px">重置</a-button>

              <a @click="handleToggleSearch"
                 style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-form>
      </div>
    </a-row>

    <!-- 操作按钮区域 -->
    <div class="table-operator"
         style="border-top: 5px">
      <div class="block">
        <j-dict-select-tag type="tabs"
                           :triggerChange="true"
                           @change="changeTabs"
                           v-model="queryParam['importStatus']"
                           dictCode="import_status	" />
      </div>
      <!-- table区域-begin -->
      <div>
        <div class="ant-alert ant-alert-info">
          <i class="anticon anticon-info-circle ant-alert-icon"></i>已选择&nbsp;
          <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项&nbsp;&nbsp;
          <a style="margin-left: 24px"
             @click="onClearSelected">清空</a>
        </div>
        <a-button @click="handleReview"
                  type="primary"
                  :disabled="checkButton || checkButton2">提交审核</a-button>
        <a-button type="primary"
                  @click="handleAdd">新增</a-button>
        <a-button @click="handlebatchNoImport"
                  type="primary">批次号导入</a-button>
        <a-button @click="handleOrderReplenishment"
                  type="primary">订单批量补录</a-button>
        <a-button @click="commonDown">订单批量补录模板下载</a-button>
        <a-button @click="batchDel"
                  :disabled="checkButton">删除</a-button>
      </div>
    </div>

    <!-- table区域 -->
    <div>
      <a-table ref="table"
               bordered
               size="middle"
               rowKey="id"
               :columns="columns"
               :scroll="{ x: true }"
               :dataSource="dataSource"
               :pagination="ipagination"
               table-layout="auto"
               :loading="loading"
               :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
               @change="handleTableChange">
        <!-- //运输模式 -->
        <span slot="transportMode"
              slot-scope="text">
          <span v-if="text == 0">整车</span>
          <span v-if="text == 1">零担</span>
        </span>
        <!-- //TODO 操作-->
        <span slot="action"
              slot-scope="text, record">
          <a @click="toOpreaList(record)"
             v-if="record.importStatus === '0' || record.importStatus === '3'">修改</a>
          <a-divider type="vertical"
                     v-if="record.importStatus === '0' || record.importStatus === '3'"></a-divider>
          <a @click="handleDetail(record)">详情</a>
        </span>
      </a-table>
    </div>
    <import-modal ref="importmodal"
                  @ok="modalFormOk"></import-modal>
    <replenishment-modal ref="replenishmentmodal"
                         @ok="modalFormOk"></replenishment-modal>
  </a-card>
</template>
<script>
import importModal from './modules/importModal'
import replenishmentModal from './modules/replenishmentModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JDate from '@/components/jeecg/JDate.vue'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import api from './const'
import store from '@/store/'
import { putHeaderAction, downFile } from '@/api/manage'

export default {
  name: '',
  mixins: [JeecgListMixin],
  components: { JDate, importModal, replenishmentModal },
  data() {
    return {
      url: api.url,
      checkButton: false,
      checkButton2: false,
      importFlag_dictionary: [],
      receiptType_dictionary: [],
      settlementWays_dictionary: [],
      userType: store.getters.userType,
      label: '6',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 }
      },
      columns: [
        {
          title: '订单号',
          align: 'center',
          dataIndex: 'orderNo',
          fixed: 'left',
          ellipsis: true,
          customRender: (text, record) => {
            return (
              <a
                onClick={() => {
                  this.handleDetail(record)
                }}
              >
                {{ text }}
              </a>
            )
          },
          sorter: (a, b) => {
            const total = (a['orderNo'].split('')).reduce(function(prev, cur, index, arr) {
              return cur.charCodeAt(0) + prev
            }, 0)
            const total2 = (b['orderNo'].split('')).reduce(function(prev, cur, index, arr) {
              return cur.charCodeAt(0) + prev
            }, 0)
            return total - total2
          }
        },
        {
          title: '错误描述',
          align: 'center',
          dataIndex: 'errorDesc',
          ellipsis: true,
          customRender: (text, record) => {
            return (
              <a-tooltip placement='top'>
                <template slot='title'>
                  <span>{{ text }}</span>
                </template>
                <div style='width:120px;overflow: hidden;white-space: nowrap;text-overflow:ellipsis;'>{{ text }}</div>
              </a-tooltip>
            )
          }
        },
        {
          title: '导入结果',
          align: 'center',
          dataIndex: 'importFlag_dictText',
          ellipsis: true
        },
        {
          title: '批次号',
          align: 'center',
          dataIndex: 'batchNo',
          ellipsis: true,
          sorter: (a, b) => {
            const total = (a['batchNo'].split('')).reduce(function(prev, cur, index, arr) {
              return cur.charCodeAt(0) + prev
            }, 0)
            const total2 = (b['batchNo'].split('')).reduce(function(prev, cur, index, arr) {
              return cur.charCodeAt(0) + prev
            }, 0)
            return total - total2
          }
        },

        {
          title: '退回原因',
          align: 'center',
          dataIndex: 'returnReason',
          ellipsis: true
        },
        {
          title: '委托单号',
          align: 'center',
          dataIndex: 'shippingNoteNumber',
          width: 100,
          ellipsis: true
        },
        {
          title: '托运时间',
          align: 'center',
          dataIndex: 'consignmentDateTime',
          ellipsis: true,
          width: 20,
          tableLayout: 'fixed',
          sorter: (a, b) => a['consignmentDateTime'] - b['consignmentDateTime']
        },
        {
          title: '配送时间',
          align: 'center',
          dataIndex: 'shippingDateTime',
          ellipsis: true,
          sorter: (a, b) => a['shippingDateTime'] - b['shippingDateTime']
        },
        {
          title: '审核状态',
          align: 'center',
          dataIndex: 'importStatus_dictText'
        },
        {
          title: '承运商',
          align: 'center',
          dataIndex: 'carrierName',
          ellipsis: true
        },
        {
          title: '承运商运费',
          align: 'center',
          dataIndex: 'carrierFreight',
          scopedSlots: {
            customRender: 'carrierFreight'
          },
          sorter: (a, b) => a['carrierFreight'] - b['carrierFreight']
        },
        {
          title: '发货单位',
          align: 'center',
          dataIndex: 'consignor',
          ellipsis: true
        },
        {
          title: '发货人',
          dataIndex: 'consignorLinkName',
          align: 'center',
          ellipsis: true
        },
        {
          title: '发货电话',
          align: 'center',
          dataIndex: 'consignorLinkPhone',
          ellipsis: true
        },
        {
          title: '出发地',
          align: 'center',
          dataIndex: 'consignorAddr',
          ellipsis: true
        },
        {
          title: '发货地址',
          align: 'center',
          dataIndex: 'consignorDeailAddr',
          ellipsis: true
        },
        {
          title: '收货单位',
          align: 'center',
          dataIndex: 'consignee',
          ellipsis: true
        },
        {
          title: '收货人',
          align: 'center',
          dataIndex: 'consigneeLinkName',
          ellipsis: true
        },
        {
          title: '收货电话',
          align: 'center',
          dataIndex: 'consigneeLinkPhone',
          ellipsis: true
        },
        {
          title: '目的地',
          align: 'center',
          dataIndex: 'consigneeAddr',
          width: 120,
          ellipsis: true
        },
        {
          title: '收货地址',
          align: 'center',
          dataIndex: 'consigneeDeailAddr',
          ellipsis: true
        },
        {
          title: '运输模式',
          align: 'center',
          dataIndex: 'transportMode',
          scopedSlots: {
            customRender: 'transportMode'
          }
        },
        {
          title: '物品名称',
          align: 'center',
          dataIndex: 'goodsNames',
          ellipsis: true
        },
        {
          title: '总数量',
          align: 'center',
          dataIndex: 'numbers',
          ellipsis: true
        },
        {
          title: '总重量（吨）',
          align: 'center',
          dataIndex: 'weights',
          ellipsis: true
        },
        {
          title: '总体积（m³）',
          align: 'center',
          dataIndex: 'cubes',
          ellipsis: true
        },
        {
          title: '结算方式',
          align: 'center',
          dataIndex: 'settlementWays',
          width: 80,
          customRender: text => {
            // 字典值替换通用方法
            return filterDictText(this.settlementWays_dictionary, text)
          }
        },
        {
          title: '回单类型',
          align: 'center',
          dataIndex: 'receiptType',
          width: 80,
          customRender: text => {
            // 字典值替换通用方法
            return filterDictText(this.receiptType_dictionary, text)
          }
        },
        {
          title: '回单数量',
          align: 'center',
          dataIndex: 'receiptNo',
          width: 80
        },
        {
          title: '运费',
          align: 'center',
          dataIndex: 'freight',
          width: 120,
          scopedSlots: {
            customRender: 'freight'
          },
          sorter: (a, b) => a['freight'] - b['freight']
        },
        {
          title: '结算天数',
          align: 'center',
          dataIndex: 'settlementDays'
        },
        {
          title: '操作人',
          align: 'center',
          dataIndex: 'createBy',
          ellipsis: true
        },

        {
          title: '操作',
          align: 'center',
          fixed: 'right',
          dataIndex: 'action',
          ellipsis: true,
          scopedSlots: {
            customRender: 'action'
          }
        }
      ]
    }
  },
  methods: {
    //  按钮置灰
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
      //  判断用户状态 只有待提交审核不通过才可以提交审核,有错误描述不可以提交审核
      const data = JSON.parse(JSON.stringify(this.selectionRows))
      var res = data.every(function(item) {
        return item.errorDesc === ''
      })
      if (!res) {
        this.checkButton2 = true
      } else {
        this.checkButton2 = false
      }
      var res = data.every(function(item) {
        return item.importStatus === '0' || item.importStatus === '3'
      })
      if (!res) {
        this.checkButton = true
        return
      } else {
        this.checkButton = false
        return
      }
    },

    //  提交审核多选订单
    handleReview() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      } else {
        //  判断用户状态 只有已拒绝3和代派单0状态可以提交审核
        const data = JSON.parse(JSON.stringify(this.selectionRows))
        var res = data.every(function(item) {
          return item.importStatus === '0' || item.importStatus === '3'
        })
        if (!res) {
          this.$message.warning('只有已拒绝3和代派单0状态可以提交审核!')
          return
        }

        var ids = ''
        var impStats = ''
        for (var a = 0; a < this.selectionRows.length; a++) {
          ids += this.selectionRows[a].id + ','
          impStats += this.selectionRows[a].importStatus + ','
        }
        var that = this
        this.$confirm({
          title: '确认',
          content: '是否提交选中数据?',
          onOk: function() {
            that.loading = true
            putHeaderAction(that.url.submitExamine, {
              ids: ids,
              impStats: impStats
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
    //  根据批次号导入订单
    handlebatchNoImport() {
      this.$refs.importmodal.show()
    },
    //  订单批量补录
    handleOrderReplenishment() {
      this.$refs.replenishmentmodal.show()
    },
    handleAdd() {
      this.$router.push({ name: 'order-createOrder-makeUpOrder' })
    },
    //  点击修改按钮
    toOpreaList: function(record) {
      sessionStorage.setItem('OrderReviewDetails', JSON.stringify(record))
      this.$router.push({ name: 'audit-rewriteOrder' })
    },
    //  点击详情
    handleDetail(record) {
      sessionStorage.setItem('OrderReviewDetails', JSON.stringify(record))
      this.$router.push({ name: 'audit-detailsOrder' })
    },
    changeTabs(value) {
      this.queryParam['importStatus'] = value
      if (value === '0' || value === undefined || value === '3') {
        this.checkButton = false
      } else {
        this.checkButton = true
      }
      this.searchQuery()
      this.onClearSelected()
    },
    //  订单导入模板下载
    commonDown() {
      downFile(this.url.commonDown, {}).then(data => {
        if (!data) {
          this.$message.warning('文件下载失败')
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(
            new Blob([data], {
              type: 'application/vnd.ms-excel'
            }),
            '订单批量补录模板' + '.xls'
          )
        } else {
          const url = window.URL.createObjectURL(
            new Blob([data], {
              type: 'application/vnd.ms-excel'
            })
          )
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '订单批量补录模板' + '.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) // 下载完成移除元素
          window.URL.revokeObjectURL(url) // 释放掉blob对象
        }
      })
    },
    //  -------------字典表处理--------------------
    initDictConfig() {
      //  导入结果
      initDictOptions('import_flag').then(res => {
        if (res.success) {
          this.importFlag_dictionary = res.result
        }
      })
      // //  回单类型
      initDictOptions('receiptType_dictionary').then(res => {
        if (res.success) {
          this.receiptType_dictionary = res.result
        }
      })
      // //  结算方式
      initDictOptions('settlementWays').then(res => {
        if (res.success) {
          this.settlementWays_dictionary = res.result
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.tabs {
  display: inline-block;
  margin-right: 15px;
}
/deep/ .ant-steps-item-description,
/deep/ .ant-steps-item-title {
  color: white !important;
}
// 时间选择器宽度问题
/deep/ .ant-calendar-picker {
  width: 100% !important;
  min-width: 100% !important;
}
</style>
