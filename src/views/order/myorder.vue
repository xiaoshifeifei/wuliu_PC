<!--
 * @Description:
 * @Date: 2020-03-03 13:21:40
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-05-08 11:44:24
 -->
<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <a-row :gutter="24">
      <div class="table-page-search-wrapper">
        <a-form @keyup.enter.native="searchQuery" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="label">
            <a-form-item label="订单号：">
              <a-input placeholder="请输入订单号" v-model="queryParam.orderNo"></a-input>
            </a-form-item>
          </a-col>

          <!-- <a-col :span="label">
            <a-form-item label="状态">
              <j-dict-select-tag
                v-model="queryParam['gswlOrderTransfer.orderStatus']"
                placeholder="请选择状态"
                dictCode="orderStatus"
              />
            </a-form-item>
          </a-col> -->
          <a-col :span="label">
            <a-form-item label="订单来源：">
              <j-dict-select-tag v-model="queryParam.dataSource" placeholder="请选择订单来源" dictCode="dataSource" />
            </a-form-item>
          </a-col>
          <!-- 收起展开列表 -->
          <template v-if="toggleSearchStatus">
            <a-col :span="label">
              <a-form-item label="托运时间：">
                <j-date
                  v-model="queryParam.consignmentDateTime"
                  placeholder="请选择时间"
                  :show-time="true"
                  date-format="YYYY-MM-DD HH:mm:ss"
                ></j-date>
              </a-form-item>
            </a-col>

            <a-col :span="label">
              <a-form-item label="配送时间：">
                <j-date
                  v-model="queryParam.shippingDateTime"
                  placeholder="请选择时间"
                  :show-time="true"
                  date-format="YYYY-MM-DD HH:mm:ss"
                ></j-date>
              </a-form-item>
            </a-col>

            <a-col :span="label">
              <a-form-item label="客户名称：">
                <a-input v-model="queryParam['gswlOrderTransfer.customerName']" placeholder="请输入客户名称"></a-input>
              </a-form-item>
            </a-col>

            <a-col :span="label">
              <a-form-item label="收货单位：">
                <a-input v-model="queryParam['consignee']" placeholder="请输入收货客户名称"></a-input>
              </a-form-item>
            </a-col>

            <a-col :span="label">
              <a-form-item label="发货单位：">
                <a-input v-model="queryParam['consignor']" placeholder="请输入发货客户名称"></a-input>
              </a-form-item>
            </a-col>
          </template>

          <a-col :span="label">
            <span style="overflow: hidden;float:left" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="default" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>

              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>

          </a-col>
        </a-form>
      </div>
    </a-row>

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="border-top: 5px">
      <div class="block">
        <j-dict-select-tag
          type="tabs"
          :triggerChange="true"
          @change="changeTabs"
          v-model="queryParam['gswlOrderTransfer.orderStatus']"
          placeholder="请选择状态"
          dictCode="orderStatus"
        />
      </div>
      <!-- table区域-begin -->
      <div>
        <div class="ant-alert ant-alert-info">
          <i class="anticon anticon-info-circle ant-alert-icon"></i>已选择&nbsp;
          <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
          >项&nbsp;&nbsp;
          <a style="margin-left: 24px" @click="onClearSelected">清空</a>
        </div>

        <a-button @click="handleCarriers" type="primary" :disabled="checkButton">{{userType === 'PT'? '指派承运商':'指派平台'}}</a-button>
        <a-button @click="handledrivers" v-has="'order:owner:designated'" type="primary" :disabled="checkButton"
          >指派司机</a-button
        >
        <a-button @click="batchDel" type="warning">作废</a-button>
        <a-button @click="sendSource" type="success" v-has="'order:release:source'" :disabled="checkButton"
          >发布货源</a-button
        >
        <!-- //订单导入模板下载 -->
        <a-tooltip placement="bottom" :mouseLeaveDelay="2">
          <template slot="title">
            <span>导入步骤</span>
            <a-steps direction="vertical">
              <a-step title="步骤一" description="下载托运单模板" />
              <a-step title="步骤二" description="填写托运单数据" />
              <a-step title="步骤三" description="上传托运单数据文件" />
              <a-step title="步骤四" description="确认导入" />
            </a-steps>
          </template>
          <a-button @click="commonDown">订单导入模板下载</a-button>
        </a-tooltip>
        <a-upload
          name="file"
          :showUploadList="false"
          :multiple="false"
          :headers="tokenHeader"
          :action="url.importExcelUrl"
          @change="handleImportExcel"
        >
          <a-button type="primary" icon="import">导入</a-button>
        </a-upload>
        <a-button type="primary" icon="download" @click="handleExportXls('自有订单')"
          >导出</a-button
        >
      </div>
    </div>

    <!-- table区域 -->
    <div>
      <a-table
        ref="table"
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
        @change="handleTableChange"
        :customRow="rowClick"
      >
        <!-- //运输模式 -->
        <span slot="transportMode" slot-scope="text">
          <span v-if="text == 0">整车</span>
          <span v-if="text == 1">零担</span>
        </span>
        <!-- //TODO 操作-->
        <span slot="action" slot-scope="text, record">
          <!-- <a @click="handleCarrier(record)">指派承运商</a>
          <a-divider type="vertical"></a-divider>
          <a v-has="'order:owner:designated'" @click="handledriver(record)">指派司机</a>
          <a-divider type="vertical" v-has="'order:owner:designated'"></a-divider> -->
          <a @click="toOpreaList(record)" v-if="record.gswlOrderTransfer.orderStatus==='0'">修改</a>
          <a-divider type="vertical" v-if="record.gswlOrderTransfer.orderStatus==='0'"></a-divider>
          <a @click="handleDetail(record)">详情</a>
          <!-- <a-dropdown>
            <a class="ant-dropdown-link">
              更多
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;" @click="handleDetail(record)">详情</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="toOpreaList(record)">修改</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="是否作废该订单?" @confirm="() => handleDelete(record.id)">
                  <a>作废</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown> -->
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <carrier-modal ref="carriermodal" @ok="modalFormOk"></carrier-modal>
    <driver-modal ref="drivermodal" @ok="modalFormOk"></driver-modal>
    <sourcer-modal ref="sourcemodal" @ok="modalFormOk"></sourcer-modal>
  </a-card>
</template>
<script>
import CarrierModal from './modules/carrierModal'
import driverModal from './modules/driverModal'
import sourcerModal from './modules/releaseSource'

import api from '@/api/index'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JDate from '@/components/jeecg/JDate.vue'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import { downFile } from '@/api/manage'
import store from '@/store/'
import moment from 'moment'

import { letterChange } from '@/utils/util.js'
export default {
  name: '',
  mixins: [JeecgListMixin],
  components: { CarrierModal, JDate, driverModal, sourcerModal },
  data() {
    return {
      show: 'all',
      queryParam: {
        'gswlOrderTransfer.orderType': 0
      },
      url: api.myorderUrl,
      checkButton: false,
      dataSource_dictionary: [],
      orderStatus_dictionary: [],
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
          sorter: (a, b) => (moment(a['consignmentDateTime'])).valueOf() - (moment(b['consignmentDateTime'])).valueOf()
        },
        {
          title: '配送时间',
          align: 'center',
          dataIndex: 'shippingDateTime',
          ellipsis: true,
          sorter: (a, b) => (moment(a['shippingDateTime'])).valueOf() - (moment(b['shippingDateTime'])).valueOf()

        },
        {
          title: '订单来源',
          align: 'center',
          dataIndex: 'dataSource_dictText',
          ellipsis: true
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'gswlOrderTransfer.orderStatus',
          scopedSlots: {
            customRender: 'gswlOrderTransfer.orderStatus'
          },
          customRender: text => {
            // 字典值替换通用方法
            return filterDictText(this.orderStatus_dictionary, text)
          }
        },
        {
          title: '承运商',
          align: 'center',
          dataIndex: 'gswlOrderTransfer.carrierName',
          ellipsis: true
        },
        {
          title: '承运商运费',
          align: 'center',
          dataIndex: 'gswlOrderTransfer.carrierFreight',
          scopedSlots: {
            customRender: 'gswlOrderTransfer.carrierFreight'
          },
          sorter: (a, b) => a['gswlOrderTransfer'].carrierFreight - b['gswlOrderTransfer'].carrierFreight
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
          dataIndex: 'totalNumber',
          ellipsis: true
        },
        {
          title: '总重量（吨）',
          align: 'center',
          dataIndex: 'totalWeight',
          ellipsis: true
        },
        {
          title: '总体积（m³）',
          align: 'center',
          dataIndex: 'totalCube',
          ellipsis: true
        },
        {
          title: '结算方式',
          align: 'center',
          dataIndex: 'gswlOrderTransfer.settlementWays',
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
          title: '实际运费',
          align: 'center',
          dataIndex: 'gswlOrderTransfer.freight',
          width: 120,
          scopedSlots: {
            customRender: 'gswlOrderTransfer.freight'
          },
          sorter: (a, b) => a['gswlOrderTransfer'].freight - b['gswlOrderTransfer'].freight
        },
        {
          title: '结算天数',
          align: 'center',
          dataIndex: 'gswlOrderTransfer.settlementDays'
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
      ],
      rowClick: record => ({
        on: {
          // dblclick: () => {
          //   this.handleDetail(record)
          // }
        }
      })
    }
  },
  methods: {
    //  按钮置灰
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
      //  判断用户状态 只有已拒绝3和代派单0状态可以派单
      const data = JSON.parse(JSON.stringify(this.selectionRows))
      var res = data.every(function(item) {
        return item.gswlOrderTransfer.orderStatus === '3' || item.gswlOrderTransfer.orderStatus === '0'
      })
      if (!res) {
        this.checkButton = true
        return
      } else {
        this.checkButton = false
        return
      }
    },
    //  指派承运商
    // handleCarrier(data) {
    //   console.log('data', data)
    //   //  判断用户状态 只有已拒绝3和代派单0状态可以派单
    //   if (data.gswlOrderTransfer.orderStatus == '3' || data.gswlOrderTransfer.orderStatus == '0') {
    //     this.selectionRows = []
    //     this.selectionRows.push(data)
    //     this.$refs.carriermodal.show(data)
    //   } else {
    //     this.$message.warning('只有已拒绝和待派单状态可以指派承运商!')
    //     return
    //   }
    // },
    //  指派承运商多选订单
    handleCarriers() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      } else {
        //  判断用户状态 只有已拒绝3和代派单0状态可以派单
        const data = JSON.parse(JSON.stringify(this.selectionRows))
        var res = data.every(function(item) {
          return item.gswlOrderTransfer.orderStatus === '3' || item.gswlOrderTransfer.orderStatus === '0'
        })
        if (!res) {
          this.$message.warning('只有待派单状态和已拒绝状态可以指派平台!')
          return
        }
        this.$refs.carriermodal.show(this.selectionRows)
      }
    },
    //  指派司机
    // handledriver(data) {
    //   //  判断用户状态 只有待派单0状态和已拒绝3可以指派司机

    //   if (data.gswlOrderTransfer.orderStatus !== '0' && data.gswlOrderTransfer.orderStatus !== '3') {
    //     this.$message.warning('只有待派单状态和已拒绝状态可以指派司机!')
    //     return
    //   }
    //   this.selectionRows = []
    //   this.selectionRows.push(data)
    //   this.$refs.drivermodal.show(data)
    // },
    //  指派司机多选订单
    handledrivers() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      } else {
        //  判断用户状态 只有待派单0状态和已拒绝3可以指派司机
        var data = JSON.parse(JSON.stringify(this.selectionRows))
        var res = data.every(function(item) {
          return item.gswlOrderTransfer.orderStatus === '0' || data.gswlOrderTransfer.orderStatus === '3'
        })
        if (!res) {
          this.$message.warning('只有待派单状态和已拒绝状态可以指派司机!')
          return
        }
        this.$refs.drivermodal.show(this.selectionRows)
      }
    },
    //  发布货源
    sendSource() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      } else {
        //  判断用户状态 只有已拒绝3和代派单0状态可以发布货源
        const data = JSON.parse(JSON.stringify(this.selectionRows))
        var res = data.every(function(item) {
          return item.gswlOrderTransfer.orderStatus === '3' || item.gswlOrderTransfer.orderStatus === '0'
        })
        if (!res) {
          this.$message.warning('只有已拒绝和待派单状态可以发布货源!')
          return
        }
        this.$refs.sourcemodal.show('myorder')
      }
    },
    //  重置
    searchReset() {
      this.queryParam = {}
      this.queryParam = {
        'gswlOrderTransfer.orderType': 0
      }
      this.loadData(1)
    },

    //  点击详情
    handleDetail(record) {
      sessionStorage.setItem('OrderDetails', JSON.stringify(record))
      this.$router.push({ name: 'order-modules-orderDetail' })
    },
    //  点击修改按钮
    toOpreaList: function(record) {
      sessionStorage.setItem('OrderDetails', JSON.stringify(record))
      this.$router.push({ name: 'order-modules-editOrder' })
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
            '订单导入模板' + '.xls'
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
          link.setAttribute('download', '订单导入模板' + '.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) // 下载完成移除元素
          window.URL.revokeObjectURL(url) // 释放掉blob对象
        }
      })
    },
    changeTabs(value) {
      this.queryParam['gswlOrderTransfer.orderStatus'] = value
      this.searchQuery()
      this.onClearSelected()
    },
    //  -------------字典表处理--------------------
    initDictConfig() {
      // //初始化字典 - 订单来源
      // initDictOptions('dataSource_dictionary').then(res => {
      //   if (res.success) {
      //     this.dataSource_dictionary = res.result
      //   }
      // })
      //  订单状态
      initDictOptions('orderStatus').then(res => {
        if (res.success) {
          this.orderStatus_dictionary = res.result
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
@import url('./orderCommon.less');

.tabs {
  display: inline-block;
  margin-right: 15px;
}
/deep/ .ant-steps-item-description,
/deep/ .ant-steps-item-title {
  color: white !important;
}
</style>
