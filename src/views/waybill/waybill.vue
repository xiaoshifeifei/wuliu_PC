<!--
 * @Description:
 * @Date: 2020-03-30 16:15:28
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-05-07 15:40:52
 -->
<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form @keyup.enter.native="searchQuery" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-row :gutter="24">
          <a-col :span="label">
            <a-form-item label="订单号：">
              <a-input placeholder="请输入订单号" v-model="queryParam.orderNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="运单号：">
              <a-input v-model="queryParam.waybillNo" placeholder="请输入订单号"></a-input>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="label">
            <a-form-item label="状态：">
              <j-dict-select-tag
                v-model="queryParam['waybillStatus']"
                placeholder="请选择状态"
                dictCode="waybillStatus"
              />
            </a-form-item>
          </a-col> -->

          <!-- 收起展开列表 -->
          <template v-if="toggleSearchStatus">
            <a-col :span="label">
              <a-form-item label="出发地：">
                <a-input v-model="queryParam.consignorAddr" placeholder="请输入出发地"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="label">
              <a-form-item label="目的地：">
                <a-input v-model="queryParam.consigneeAddr" placeholder="请输入目的地"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="label">
              <a-form-item label="发货单位：">
                <a-input v-model="queryParam.consignor" placeholder="请输入发货单位"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="label">
              <a-form-item label="收货单位：">
                <a-input v-model="queryParam.consignee" placeholder="请输入收货单位"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="label">
              <a-form-item label="客户名称：">
                <a-input v-model="queryParam.customerName" placeholder="请输入客户名称"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="label">
              <a-form-item label="司机名称：">
                <a-input v-model="queryParam.consignee" placeholder="请输入司机名称"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="label">
              <a-form-item label="车牌号：">
                <a-input v-model="queryParam.vehicleNo" placeholder="请输入车牌号"></a-input>
              </a-form-item>
            </a-col>
          </template>

          <a-col :span="label">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" icon="download" @click="handleExportXls('运单列表')" style="margin-left: 8px"
                >导出</a-button
              >
              <a-button type="default" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 操作按钮区域 -->
    <div class="table-operator" style="border-top: 5px">
      <div>
        <j-dict-select-tag
          class="block"
          type="tabs"
          :triggerChange="true"
          @change="changeTabs"
          v-model="queryParam['waybillStatus']"
          placeholder="请选择状态"
          dictCode="waybillStatus"
        />
      </div>
      <div>
        <!-- table区域-begin -->
        <div class="ant-alert ant-alert-info" >
          <i class="anticon anticon-info-circle ant-alert-icon"></i>已选择&nbsp;
          <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
          >项&nbsp;&nbsp;
          <a style="margin-left: 24px" @click="onClearSelected">清空</a>
        </div>
        <a-button @click="handleSignFors()" type="primary" v-has="'waybill:receipt'" :disabled="checkButton || checkButton2">运单签收</a-button>
      </div>
    </div>

    <!-- table区域 -->
    <div>
      <a-table
        ref="table"
        bordered
        size="middle"
        rowKey="orderId"
        tableLayout="auto"
        :columns="columns"
        :scroll="{ x: true }"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, columnWidth: 20 }"
        @change="handleTableChange"
        :customRow="rowClick"
      >
        <!-- //运输模式 -->
        <span slot="transportMode" slot-scope="text">
          <span v-if="text == 0">整车</span>
          <span v-if="text == 1">零担</span>
        </span>
        <!-- //  回单状态 -->
        <span slot="gswlWaybill.receiptStatus" slot-scope="text">
          <div v-if="text == 0">未回单</div>
          <div v-if="text == 1">已回单</div>
        </span>
        <!-- // 操作-->
        <span slot="action" slot-scope="text, record">
          <!-- <a @click="handleSignFor(record)" v-has="'waybill:receipt'">运单签收</a>
          <a-divider type="vertical" v-has="'waybill:receipt'"></a-divider> -->
          <a @click="handleDetail(record)">详情</a>
          <a-divider type="vertical" v-has="'task:eval'" v-if="record.gswlWaybill.waybillStatus === '3'"></a-divider>
          <a @click="handleScore(record)" v-has="'task:eval'" v-if="record.gswlWaybill.waybillStatus === '3'">任务评价</a>
        </span>
      </a-table>
      <!-- --- 弹窗 --- -->
      <signFor-modal ref="signFormodal" @ok="modalFormOk"></signFor-modal>
      <evaluation-modal ref="scoremodal" @ok="modalFormOk"></evaluation-modal>
      <upload-modal ref="uploadmodal" @ok="modalFormOk"></upload-modal>
    </div>
  </a-card>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import signForModal from './modules/signForModal'
import evaluationModal from './modules/evaluationModal'
import moment from 'moment'
import uploadModal from './modules/uploadModal'
export default {
  name: '',
  mixins: [JeecgListMixin],
  components: { signForModal, uploadModal, evaluationModal },
  data() {
    return {
      url: {
        list: '/order/gswlWaybill/list',
        exportXlsUrl: '/order/gswlWaybill/exportXls'
      },
      dataSource_dictionary: [],
      waybillStatus_dictionary: [],
      receiptType_dictionary: [],
      settlementWays_dictionary: [],

      columns: [
        {
          title: '运单号',
          align: 'center',
          dataIndex: 'gswlWaybill.waybillNo',
          ellipsis: true,
          fixed: 'left',
          customRender: (text, record) => {
            return <a onClick={() => { this.handleDetail(record) }}>{{ text }}</a>
          },
          sorter: (a, b) => {
            const total = (a['gswlWaybill'].waybillNo.split('')).reduce(function(prev, cur, index, arr) {
              return cur.charCodeAt(0) + prev
            }, 0)
            const total2 = (b['gswlWaybill'].waybillNo.split('')).reduce(function(prev, cur, index, arr) {
              return cur.charCodeAt(0) + prev
            }, 0)
            return total - total2
          }
        },
        {
          title: '订单号',
          align: 'center',
          dataIndex: 'orderNo',
          ellipsis: true,
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
          ellipsis: true
        },
        {
          title: '托运时间',
          align: 'center',
          ellipsis: true,
          dataIndex: 'consignmentDateTime',
          sorter: (a, b) => (moment(a['consignmentDateTime'])).valueOf() - (moment(b['consignmentDateTime'])).valueOf()

        },
        {
          title: '配送时间',
          align: 'center',
          ellipsis: true,
          dataIndex: 'shippingDateTime',
          scopedSlots: {
            customRender: 'shippingDateTime'
          },
          sorter: (a, b) => (moment(a['shippingDateTime'])).valueOf() - (moment(b['shippingDateTime'])).valueOf()

        },
        {
          title: '订单来源',
          align: 'center',
          ellipsis: true,
          dataIndex: 'gswlOrderTransfer.customerName'
        },
        {
          title: '状态',
          align: 'center',
          ellipsis: true,
          dataIndex: 'gswlWaybill.waybillStatus',
          scopedSlots: {
            customRender: 'gswlWaybill.waybillStatus'
          },
          customRender: text => {
            // 字典值替换通用方法
            return filterDictText(this.waybillStatus_dictionary, text)
          }
        },
        {
          title: '承运商',
          align: 'center',
          ellipsis: true,
          dataIndex: 'gswlOrderTransfer.carrierName'
        },
        {
          title: '承运商运费',
          align: 'center',
          ellipsis: true,
          dataIndex: 'gswlOrderTransfer.carrierFreight',
          scopedSlots: {
            customRender: 'gswlOrderTransfer.carrierFreight'
          },
          sorter: (a, b) => a['gswlOrderTransfer.carrierFreight'] - b['gswlOrderTransfer.carrierFreight']
        },
        {
          title: '发货单位',
          align: 'center',
          ellipsis: true,
          dataIndex: 'consignor'
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
          ellipsis: true,
          dataIndex: 'consignorLinkPhone'
        },
        {
          title: '出发地',
          align: 'center',
          ellipsis: true,
          dataIndex: 'consignorAddr'
        },
        {
          title: '发货地址',
          align: 'center',
          ellipsis: true,
          dataIndex: 'consignorDeailAddr'
        },
        {
          title: '收货单位',
          align: 'center',
          ellipsis: true,
          dataIndex: 'consignee'
        },
        {
          title: '收货人',
          align: 'center',
          ellipsis: true,
          dataIndex: 'consigneeLinkName'
        },
        {
          title: '收货电话',
          align: 'center',
          ellipsis: true,
          dataIndex: 'consigneeLinkPhone'
        },
        {
          title: '目的地',
          align: 'center',
          ellipsis: true,
          dataIndex: 'consigneeAddr'
        },
        {
          title: '收货地址',
          align: 'center',
          ellipsis: true,
          dataIndex: 'consigneeDeailAddr'
        },

        {
          title: '司机',
          align: 'center',
          ellipsis: true,
          dataIndex: 'gswlWaybill.driverName'
        },
        {
          title: '车辆',
          align: 'center',
          ellipsis: true,
          dataIndex: 'gswlWaybill.vehicleNo'
        },
        {
          title: '司机运费',
          align: 'center',
          ellipsis: true,
          dataIndex: 'gswlWaybill.freight'
        },
        {
          title: '发车时间',
          align: 'center',
          ellipsis: true,
          dataIndex: 'gswlWaybill.departureTime'
        },
        {
          title: '送达时间',
          align: 'center',
          ellipsis: true,
          dataIndex: 'gswlWaybill.receiveTime'
        },

        {
          title: '运输模式',
          align: 'center',
          ellipsis: true,
          dataIndex: 'transportMode',
          scopedSlots: {
            customRender: 'transportMode'
          }
        },
        {
          title: '物品名称',
          align: 'center',
          ellipsis: true,
          dataIndex: 'goodsNames'
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
          ellipsis: true,
          dataIndex: 'gswlOrderTransfer.settlementWays',
          customRender: text => {
            // 字典值替换通用方法
            return filterDictText(this.settlementWays_dictionary, text)
          }
        },
        {
          title: '回单类型',
          align: 'center',
          ellipsis: true,
          dataIndex: 'receiptType',
          customRender: text => {
            // 字典值替换通用方法
            return filterDictText(this.receiptType_dictionary, text)
          }
        },
        {
          title: '回单数量',
          align: 'center',
          ellipsis: true,
          dataIndex: 'receiptNo'
        },
        {
          title: '回单状态',
          align: 'center',
          ellipsis: true,
          dataIndex: 'gswlWaybill.receiptStatus',
          scopedSlots: {
            customRender: 'gswlWaybill.receiptStatus'
          }
        },
        {
          title: '运费',
          align: 'center',
          dataIndex: 'gswlOrderTransfer.freight',
          sorter: (a, b) => a['gswlOrderTransfer'].freight - b['gswlOrderTransfer'].freight
        },
        {
          title: '结算天数',
          align: 'center',
          ellipsis: true,
          dataIndex: 'gswlOrderTransfer.settlementDays'
        },
        {
          title: '操作人',
          align: 'center',
          ellipsis: true,
          dataIndex: 'gswlWaybill.createBy'
        },
        {
          title: '操作',
          align: 'center',
          fixed: 'right',
          ellipsis: true,
          dataIndex: 'action',
          scopedSlots: {
            customRender: 'action'
          }
        }
      ],
      label: '6',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 }
      },
      checkButton: false,
      checkButton2: false,
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
    //  按钮置灰
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
      const data = JSON.parse(JSON.stringify(this.selectionRows))
      const userId = JSON.parse(localStorage.getItem('pro__Login_Userinfo')).value.dataId
      var che = false
      let userChe = false
      data.forEach(element => {
        if (element.gswlWaybill.waybillStatus === '3') {
          che = true
          return
        }
        if (element.gswlWaybill.carrierId !== userId) {
          userChe = true
          return
        }
      })
      if (che) {
        this.checkButton2 = true
      } else {
        this.checkButton2 = false
      }
      if (userChe) {
        this.checkButton = true
        return
      } else {
        this.checkButton = false
        return
      }
    },
    // 单选运单签收
    handleSignFor(data) {
      //  判断运单状态 除了已完成都可以签收
      if (data.gswlWaybill.waybillStatus === '3') {
        this.$message.warning('已完成订单不能签收!')
        return
      }
      //  判断登陆id是否等于承运商id
      const userId = JSON.parse(localStorage.getItem('pro__Login_Userinfo')).value.dataId
      if (data.gswlWaybill.carrierId !== userId) {
        this.$message.warning('非该运单指派的承运商不能进行签收操作!')
        return
      }
      this.selectionRows = []
      this.selectionRows.push(data)
      this.$refs.signFormodal.show()
    },
    //  多选运单签收
    handleSignFors() {
      var che = false
      let userChe = false

      const userId = JSON.parse(localStorage.getItem('pro__Login_Userinfo')).value.dataId
      this.selectionRows.forEach(element => {
        if (element.gswlWaybill.waybillStatus === '3') {
          che = true
          return
        }
        if (element.gswlWaybill.carrierId !== userId) {
          userChe = true
          return
        }
      })
      if (che) {
        this.$message.warning('已完成订单不能签收!')
        return
      }
      if (userChe) {
        this.$message.warning('非该运单指派的承运商不能进行签收操作!')
        return
      }

      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      } else {
        this.$refs.signFormodal.show()
      }
    },
    //  评价
    handleScore(record) {
      //  判断运单状态 已完成才可以评价3

      if (record.gswlWaybill.waybillStatus !== '3') {
        this.$message.warning('已完成状态才能任务评价!')
        return
      }
      this.$refs.scoremodal.show(record)
    },
    changeTabs(value) {
      if (value !== '3') {
        this.checkButton = false
      } else {
        this.checkButton = true
      }
      this.queryParam['waybillStatus'] = value
      this.searchQuery()
      this.onClearSelected()
    },
    //  点击详情
    handleDetail(record) {
      sessionStorage.setItem('waybillDetails', JSON.stringify(record))
      this.$router.push({ name: 'waybill-modules-waybillDetails' })
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
      initDictOptions('waybillStatus').then(res => {
        if (res.success) {
          this.waybillStatus_dictionary = res.result
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
@import url('./waybill.less');
</style>
