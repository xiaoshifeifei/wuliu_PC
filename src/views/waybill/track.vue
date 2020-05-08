<!--
 * @Description: 异常轨迹
 * @Date: 2020-03-30 16:15:28
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-04-30 13:32:27
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
            <a-form-item label="客户名称：">
              <a-input v-model="queryParam.customerName" placeholder="请输入客户名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="车牌号：">
              <a-input v-model="queryParam.vehicleNo" placeholder="请输入车牌号"></a-input>
            </a-form-item>
          </a-col>
          <!-- 收起展开列表 -->
          <template v-if="toggleSearchStatus">
            <a-col :span="label">
              <a-form-item label="运单号：">
                <a-input v-model="queryParam.waybillNo" placeholder="请输入订单号"></a-input>
              </a-form-item>
            </a-col>
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
              <a-form-item label="司机名称：">
                <a-input v-model="queryParam.consignee" placeholder="请输入司机名称"></a-input>
              </a-form-item>
            </a-col>
          </template>

          <a-col :span="label">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
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
        @change="handleTableChange"
        :customRow="rowClick"
      >
        <!-- //  轨迹确认 -->
        <span slot="gswlWaybill.trackValidFlag" slot-scope="text, record">
          <div v-if="text == 0">待确认</div>
          <div v-if="text == 1">正常</div>
          <div v-if="text == 2">异常</div>
        </span>
        <!-- // 操作-->
        <span slot="action" slot-scope="text, record">
          <a @click="handleTrack(record)">轨迹确认</a>
          <a-divider type="vertical"></a-divider>
          <a @click="handleDetail(record)">详情</a>
        </span>
      </a-table>
      <!-- --- 弹窗 --- -->

    </div>
  </a-card>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import moment from 'moment'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'

export default {
  name: '',
  mixins: [JeecgListMixin],
  components: { },
  data() {
    return {
      url: {
        list: '/order/gswlWaybill/list'
      },
      dataSource_dictionary: [],
      waybillStatus_dictionary: [],
      receiptType_dictionary: [],
      columns: [
        {
          title: '订单号',
          align: 'center',
          dataIndex: 'orderNo',
          ellipsis: true,
          fixed: 'left',
          customRender: (text, record) => {
            return <a onClick={() => { this.handleDetail(record) }}>{{ text }}</a>
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
          sorter: (a, b) => (moment(a['shippingDateTime'])).valueOf() - (moment(b['shippingDateTime'])).valueOf()
        },
        {
          title: '司机',
          align: 'center',
          dataIndex: 'gswlWaybill.driverName',
          ellipsis: true
        },
        {
          title: '配载车辆',
          align: 'center',
          dataIndex: 'gswlWaybill.vehicleNo',
          ellipsis: true
        },
        // TODO
        {
          title: '轨迹确认',
          align: 'center',
          dataIndex: 'gswlWaybill.trackValidFlag',
          ellipsis: true,
          scopedSlots: {
            customRender: 'gswlWaybill.trackValidFlag'
          }
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
          title: '出发地',
          align: 'center',
          ellipsis: true,
          dataIndex: 'consignorAddr'
        },

        {
          title: '目的地',
          align: 'center',
          ellipsis: true,
          dataIndex: 'consigneeAddr'
        },

        {
          title: '运费',
          align: 'center',
          ellipsis: true,
          dataIndex: 'gswlOrderTransfer.freight',
          sorter: (a, b) => a['gswlOrderTransfer'].freight - b['gswlOrderTransfer'].freight
        },

        {
          title: '客户名称',
          align: 'center',
          ellipsis: true,
          dataIndex: 'gswlOrderTransfer.customerName'
        },
        {
          title: '承运商',
          align: 'center',
          ellipsis: true,
          dataIndex: 'gswlOrderTransfer.carrierName'
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
      label: '6',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 }
      },
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
    // 轨迹确认
    handleTrack(data) {
      window.localStorage.setItem('trackInfo', JSON.stringify(data))
      this.$router.push({
        name: 'waybill-modules-trackMap'
      })
    },
    // //  点击详情
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
          console.log('receiptType_dictionary', res.result)
          this.receiptType_dictionary = res.result
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
@import url('./waybill.less');
</style>
