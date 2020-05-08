<!--
 * @Description:
 * @Date: 2020-03-30 20:20:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-05-07 15:38:49
 -->
<template>
<div   style="padding:0 80px">

  <a-row :gutter="24">
    <a-card >
      <div class="top-bar">
            <a-button @click="clear()">返回</a-button>
          </div>
      <a-tabs type="line"
              v-model="activeKey">
        <a-tab-pane tab="基础信息"
                    key="1">
          <base-info :baseInfo="baseInfo"
                     v-if="Object.keys(baseInfo).length!= 0"></base-info>
        </a-tab-pane>
        <a-tab-pane tab="司机信息"
                    key="2">
          <driver-info :driverInfo="driverInfo"
                       v-if="Object.keys(driverInfo).length!= 0"></driver-info>
        </a-tab-pane>
        <a-tab-pane tab="物流跟踪"
                    key="3">
          <logistics-info :logisticsInfo="logisticsInfo"
                          v-if="logisticsInfo.length!= 0"></logistics-info>
        </a-tab-pane>
        <a-tab-pane tab="回单信息"
                    key="4">
          <receipt-info :receiptInfo="receiptInfo"
                        v-if="Object.keys(receiptInfo).length!= 0"></receipt-info>
        </a-tab-pane>
        <a-tab-pane tab="地图轨迹"
                    key="5">
          <track-info :trackInfo="trackInfo"
                      v-if="trackInfo.length!= 0"></track-info>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-row>
</div>

</template>
<script>
import baseInfo from './waybillDetails/baseInfo'
import driverInfo from './waybillDetails/driverInfo'
import logisticsInfo from './waybillDetails/logisticsInfo'
import trackInfo from './waybillDetails/trackInfo'
import receiptInfo from './waybillDetails/receiptInfo'
import { getAction } from '@/api/manage'
export default {
  name: '',
  components: { baseInfo, driverInfo, logisticsInfo, trackInfo, receiptInfo },

  data() {
    return {
      activeKey: '1',
      confirmLoading: false,
      confirmDirty: false,
      loading: false,
      disableSubmit: false,
      //  基础信息
      baseInfo: {},
      //  司机信息
      driverInfo: {},
      //  logisticsInfo 物流跟踪信息
      logisticsInfo: [],
      //  轨迹信息
      trackInfo: [],
      receiptInfo: {}
    }
  },
  mounted() {
    this.edit()
  },
  methods: {
    clear() {
      this.$router.back(-1)
    },
    edit() {
      // 基础信息
      const data = JSON.parse(sessionStorage.getItem('waybillDetails'))

      this.baseInfo = data
      //  回单信息
      this.receiptInfo.receiptImg = this.baseInfo.gswlWaybill.receiptImg
        ? this.baseInfo.gswlWaybill.receiptImg.split(',')
        : []
      this.receiptInfo.receiptNo = this.baseInfo.receiptNo ? this.baseInfo.receiptNo : '0'
      this.receiptInfo.receiptStatus = this.baseInfo.gswlWaybill.receiptStatus

      //  司机信息
      const showFlag = data.gswlOrderTransfer.showFlag ? data.gswlOrderTransfer.showFlag : ''
      getAction('/order/gswlWaybill/queryDriverByDriId', {
        showFlag: showFlag,
        driverId: data.gswlWaybill.driverId,
        carrierId: data.gswlOrderTransfer.carrierId
      }).then(res => {
        this.driverInfo = res.result ? res.result : {}
        this.driverInfo.vehicleNo = data.gswlWaybill.vehicleNo
        this.driverInfo.showFlag = data.gswlOrderTransfer.showFlag
        this.driverInfo.freight = parseFloat(data.gswlWaybill.freight).toFixed(2)
        this.driverInfo.MarginRatio =
          ((data.gswlOrderTransfer.carrierFreight - data.gswlWaybill.freight) /
            data.gswlOrderTransfer.carrierFreight.toFixed(2)) *
            100 +
          '%'
      })
      //  物流跟踪信息
      getAction('/order/gswlWaybill/queryTrackByWaybillId', { waybillId: data.gswlWaybill.id, orderId: data.orderId }).then(res => {
        this.logisticsInfo = res.result ? res.result : []
      })
      //  地图轨迹信息
      getAction('/order/gswlWaybill/trackInfo', { waybillId: data.gswlWaybill.id }).then(res => {
        this.trackInfo = res.result ? res.result : []
      })
    },

    close() {
      this.activeKey = '1'
      this.baseInfo = {}
      this.driverInfo = {}
      this.logisticsInfo = []
      this.trackInfo = []
      this.receiptInfo = {}
    }
  }
}
</script>
<style scoped lang="less">
@import url('../waybill.less');
.top-bar {
  text-align: right;
  background: #fff;
  padding: 10px 30px 5px 0px;
}
</style>
