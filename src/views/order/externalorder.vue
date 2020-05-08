<!--
 * @Description:
 * @Date: 2020-03-11 17:43:43
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-05-08 10:48:47
 -->
<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form @keyup.enter.native="searchQuery"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
        <a-row :gutter="24">
          <a-col :span="label">
            <a-form-item label="订单号：">
              <a-input placeholder="请输入订单号"
                       v-model="queryParam.orderNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="订单来源：">
              <j-dict-select-tag v-model="queryParam.dataSource"
                                 placeholder="请选择订单来源"
                                 dictCode="dataSource" />
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
          <!-- 收起展开列表 -->
          <template v-if="toggleSearchStatus">
            <a-col :span="label">
              <a-form-item label="托运时间：">
                <j-date v-model="queryParam.consignmentDateTime"
                        placeholder="请选择时间"
                        :show-time="true"
                        style="width: 100%;"
                        date-format="YYYY-MM-DD HH:mm:ss"></j-date>
              </a-form-item>
            </a-col>

            <a-col :span="label">
              <a-form-item label="配送时间：">
                <j-date v-model="queryParam.shippingDateTime"
                        placeholder="请选择时间"
                        :show-time="true"
                        style="width: 100%;"
                        date-format="YYYY-MM-DD HH:mm:ss"></j-date>
              </a-form-item>
            </a-col>

            <a-col :span="label">
              <a-form-item label="客户名称：">
                <a-input v-model="queryParam['gswlOrderTransfer.customerName']"
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
        </a-row>
      </a-form>
    </div>
    <!-- 操作按钮区域 -->
    <div class="table-operator"
         style="border-top: 5px">
      <div>
        <j-dict-select-tag type="tabs"
                           class="block"
                           :triggerChange="true"
                           @change="changeTabs"
                           v-model="queryParam['gswlOrderTransfer.orderStatus']"
                           placeholder="请选择状态"
                           dictCode="orderStatus" />
      </div>
      <!-- table区域-begin -->
      <div>
        <div class="ant-alert ant-alert-info">
          <i class="anticon anticon-info-circle ant-alert-icon"></i>已选择&nbsp;
          <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项&nbsp;&nbsp;
          <a style="margin-left: 24px"
             @click="onClearSelected">清空</a>
        </div>
        <a-button @click="hadnleIsAcceptOrders(true)"
                  v-has="'order:accept'"
                  type="primary"
                  :disabled="checkButtonExtern">接收</a-button>
        <a-button @click="hadnleIsAcceptOrders(false)"
                  v-has="'order:refuse'"
                  :disabled="checkButtonExtern">拒绝</a-button>

        <a-button @click="handleCarriers"
                  v-has="'order:external:assign'"
                  type="primary"
                  :disabled="checkButton">{{
          userType === 'PT' ? '指派承运商' : '指派平台'
        }}</a-button>
        <a-button @click="handledrivers"
                  type="primary"
                  v-has="'order:external:designated'"
                  :disabled="checkButtonDriver">指派司机</a-button>
        <a-button @click="sendSource"
                  v-has="'order:release:source'"
                  type="success"
                  :disabled="checkButton">发布货源</a-button>
        <a-button type="primary"
                  icon="download"
                  @click="handleExportXls('外部订单')">导出</a-button>
      </div>
    </div>
    <!-- table区域 -->
    <div>
      <a-table ref="table"
               bordered
               size="middle"
               rowKey="id"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="ipagination"
               :loading="loading"
               :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
               @change="handleTableChange"
               :customRow="rowClick"
               :scroll="{ x: true }"
               table-layout="auto">
        <!-- //运输模式 -->
        <span slot="transportMode"
              slot-scope="text">
          <span v-if="text == 0">整车</span>
          <span v-if="text == 1">零担</span>
        </span>
        <!-- //TODO 操作-->
        <span slot="action"
              slot-scope="text, record">
          <!-- <a @click="hadnleIsAcceptOrder(record.id, true)" v-has="'order:accept'">接收</a>
          <a-divider type="vertical" v-has="'order:accept'"></a-divider>
          <a @click="hadnleIsAcceptOrder(record.id, false)" v-has="'order:refuse'">拒绝</a>
          <a-divider type="vertical" v-has="'order:refuse'"></a-divider> -->
          <!-- <a @click="handleCarrier(record)" v-has="'order:external:assign'">指派承运商</a>
          <a-divider type="vertical" v-has="'order:external:assign'"></a-divider>
          <a @click="handledriver(record)" v-has="'order:external:designated'">指派司机</a>
          <a-divider type="vertical" v-has="'order:external:designated'"></a-divider> -->
          <!-- <a
            @click="toOpreaList(record)"
            v-if="record.gswlOrderTransfer.orderStatus === '0'"
            v-has="'order:external:edit'"
            >修改</a
          > -->
          <a-divider type="vertical"
                     v-has="'order:external:edit'"
                     v-if="record.gswlOrderTransfer.orderStatus === '0'"></a-divider>
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
                <a @click="toOpreaList(record)" v-has="'order:external:edit'">修改</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown> -->
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <carrier-modal ref="carriermodal"
                   @ok="modalFormOk"></carrier-modal>
    <driver-modal ref="drivermodal"
                  @ok="modalFormOk"></driver-modal>
    <sourcer-modal ref="sourcemodal"
                   @ok="modalFormOk"></sourcer-modal>
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
import moment from 'moment'
import store from '@/store/'
export default {
  name: '',
  mixins: [JeecgListMixin],
  components: { CarrierModal, JDate, driverModal, sourcerModal },
  data() {
    return {
      show: 'all',
      queryParam: {
        'gswlOrderTransfer.orderType': 1
      },
      label: 6,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 }
      },
      url: api.externalorderUrl,
      dataSource_dictionary: [],
      orderStatus_dictionary: [],
      receiptType_dictionary: [],
      settlementWays_dictionary: [],
      checkButton: false,
      checkButtonDriver: false,
      checkButtonExtern: false,
      userType: store.getters.userType,
      columns: [
        {
          title: '订单号',
          align: 'center',
          dataIndex: 'orderNo',
          width: 100,
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
            const total = a['orderNo'].split('').reduce(function(prev, cur, index, arr) {
              return cur.charCodeAt(0) + prev
            }, 0)
            const total2 = b['orderNo'].split('').reduce(function(prev, cur, index, arr) {
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
          sorter: (a, b) => moment(a['consignmentDateTime']).valueOf() - moment(b['consignmentDateTime']).valueOf()
        },
        {
          title: '配送时间',
          align: 'center',
          dataIndex: 'shippingDateTime',
          scopedSlots: {
            customRender: 'shippingDateTime'
          },
          ellipsis: true,
          sorter: (a, b) => moment(a['shippingDateTime']).valueOf() - moment(b['shippingDateTime']).valueOf()
        },
        {
          title: '订单来源',
          align: 'center',
          width: 80,
          dataIndex: 'gswlOrderTransfer.customerName',
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
          },
          ellipsis: true
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
          },
          ellipsis: true
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
          customRender: text => {
            // 字典值替换通用方法
            return filterDictText(this.settlementWays_dictionary, text)
          },
          ellipsis: true
        },
        {
          title: '回单类型',
          align: 'center',
          dataIndex: 'receiptType',
          customRender: text => {
            // 字典值替换通用方法
            return filterDictText(this.receiptType_dictionary, text)
          },
          ellipsis: true
        },
        {
          title: '回单数量',
          align: 'center',
          dataIndex: 'receiptNo',
          ellipsis: true
        },
        {
          title: '实际运费',
          align: 'center',
          dataIndex: 'gswlOrderTransfer.freight',
          scopedSlots: {
            customRender: 'gswlOrderTransfer.freight'
          },
          sorter: (a, b) => a['gswlOrderTransfer'].freight - b['gswlOrderTransfer'].freight,
          ellipsis: true
        },
        {
          title: '结算天数',
          align: 'center',
          dataIndex: 'gswlOrderTransfer.settlementDays',
          ellipsis: true
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
          scopedSlots: {
            customRender: 'action'
          }
        }
      ],
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

      //  接收拒绝状态 只有待审核状态可以
      var res = data.every(function(item) {
        return item.gswlOrderTransfer.orderStatus === '1'
      })
      if (!res) {
        this.checkButtonExtern = true
      } else {
        this.checkButtonExtern = false
      }

      const userInfo = JSON.parse(localStorage.getItem('pro__Login_Userinfo'))
      //  指派承运商状态
      //  判断用户状态 只有已拒绝3和代派单0状态可以派单
      // eslint-disable-next-line no-redeclare
      var res = data.every(function(item) {
        return item.gswlOrderTransfer.orderStatus === '3' || item.gswlOrderTransfer.orderStatus === '0'
      })
      if (!res) {
        this.checkButton = true
      } else {
        this.checkButton = false
      }

      if (userInfo.value.userType === 'PT') {
        //  判断用户状态 只有待派单0状态和已拒绝3可以指派司机

        // eslint-disable-next-line no-redeclare
        var res = data.every(function(item) {
          return item.gswlOrderTransfer.orderStatus === '0' || item.gswlOrderTransfer.orderStatus === '3'
        })
        if (!res) {
          this.checkButtonDriver = true
          return
        } else {
          this.checkButtonDriver = false
          return
        }
      } else if (userInfo.value.userType === 'CYS') {
        //  判断用户状态 只有已接收状态2可以指派司机
        // eslint-disable-next-line no-redeclare
        var res = data.every(function(item) {
          return item.gswlOrderTransfer.orderStatus === '2'
        })
        if (!res) {
          this.checkButtonDriver = true
          return
        } else {
          this.checkButtonDriver = false
          return
        }
      }
    },
    // //  指派承运商
    // handleCarrier(data) {
    //   console.log('data', data)
    //   let check = false
    //   let userInfo = JSON.parse(localStorage.getItem('pro__Login_Userinfo'))
    //   //  只有平台端才可以指派承运商
    //   if (userInfo.value.userType !== 'PT') {
    //     console.log('角色类型', userInfo.value.userType)

    //     this.$message.warning('只有平台端可以指派承运商!')
    //     return
    //   }
    //   //  判断用户状态 只有已拒绝3和代派单0状态可以派单
    //   if (data.gswlOrderTransfer.orderStatus == '3' || data.gswlOrderTransfer.orderStatus == '0') {
    //     this.selectionRows = []
    //     this.selectionRows.push(data)
    //     this.$refs.carriermodal.show(data, '/order/gswlOrder/assignCarrierByExternal')
    //   } else {
    //     this.$message.warning('只有已拒绝和待派单状态可以指派承运商!')
    //     return
    //   }
    // },
    //  指派承运商多选订单
    handleCarriers() {
      const check = false
      const userInfo = JSON.parse(localStorage.getItem('pro__Login_Userinfo'))
      //  只有平台端才可以指派承运商
      if (userInfo.value.userType !== 'PT') {
        this.$message.warning('只有平台端可以指派承运商!')
        return
      }
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
          this.$message.warning('只有已拒绝和待派单状态可以指派承运商!')
          return
        }
        this.$refs.carriermodal.show(this.selectionRows, '/order/gswlOrder/assignCarrierByExternal')
      }
    },
    // //  指派司机
    // handledriver(data) {
    //   let userInfo = JSON.parse(localStorage.getItem('pro__Login_Userinfo'))
    //   if (userInfo.value.userType == 'PT') {
    //     //  判断用户状态 只有待派单0状态和已拒绝3可以指派司机

    //     if (data.gswlOrderTransfer.orderStatus !== '0' && data.gswlOrderTransfer.orderStatus !== '3') {
    //       this.$message.warning('只有待派单状态和已拒绝状态可以指派司机!')
    //       return
    //     }
    //     this.selectionRows = []
    //     this.selectionRows.push(data)
    //     this.$refs.drivermodal.show(data)
    //   } else if (userInfo.value.userType == 'CYS') {
    //     //  判断用户状态 只有已接收2可以指派司机

    //     if (data.gswlOrderTransfer.orderStatus !== '2') {
    //       this.$message.warning('只有已接收状态可以指派司机!')
    //       return
    //     }
    //     this.selectionRows = []
    //     this.selectionRows.push(data)
    //     this.$refs.drivermodal.show(data)
    //   }
    // },
    //  发布货源
    sendSource() {
      const check = false
      const userInfo = JSON.parse(localStorage.getItem('pro__Login_Userinfo'))
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      } else {
        //  判断用户状态 只有已拒绝3和代派单0状态可以发布货源
        const data = JSON.parse(JSON.stringify(this.selectionRows))
        var res = data.every(function(item) {
          console.log('用户状态 ', item.gswlOrderTransfer.orderStatus)

          return item.gswlOrderTransfer.orderStatus == '3' || item.gswlOrderTransfer.orderStatus == '0'
        })
        if (!res) {
          this.$message.warning('只有已拒绝和待派单状态可以发布货源!')
          return
        }
        this.$refs.sourcemodal.show('externalorder')
      }
    },
    //  指派司机多选订单
    handledrivers() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      } else {
        const userInfo = JSON.parse(localStorage.getItem('pro__Login_Userinfo'))
        if (userInfo.value.userType === 'PT') {
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
        } else if (userInfo.value.userType === 'CYS') {
          //  判断用户状态 只有已接收状态2可以指派司机
          var data = JSON.parse(JSON.stringify(this.selectionRows))
          var res = data.every(function(item) {
            return item.gswlOrderTransfer.orderStatus === '2'
          })
          if (!res) {
            this.$message.warning('只有已接收状态可以指派司机!')
            return
          }
          this.$refs.drivermodal.show(this.selectionRows)
        }
      }
    },
    //  重置
    searchReset() {
      this.queryParam = {}
      this.queryParam = {
        'gswlOrderTransfer.orderType': 1
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
</style>
