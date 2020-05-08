<!--
 * @Description: 评价
 * @Date: 2020-03-30 17:31:23
 * @LastEditors: 自己洗小红花
 * @LastEditTime: 2020-04-09 13:16:53
 -->
<template>
  <a-modal
    title="任务评价"
    :width="1200"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    okText="提交评价"
    @cancel="close"
    cancelText="关闭"
    style="top:20px;"
  >
    <!-- table区域 -->
    <div>
      <a-table
        ref="table"
        bordered
        size="middle"
        rowKey="gswlWaybill.waybillNo"
        :columns="columns"
        :dataSource="orderTableList"
        :loading="loading"
        :pagination="false"
      >
        <!-- //TODO 序号-->
        <span slot="id" slot-scope="text, record,index">{{index+1}}</span>
      </a-table>
    </div>
    <!-- ---  评价信息  --- -->
    <div>
      <detail-list class="info" v-if="Object.keys(this.orderTableList).length">
        <detail-list-item term="承运人">{{this.orderTableList[0].gswlWaybill.driverName}}</detail-list-item>
        <detail-list-item term="手机号">{{this.orderTableList[0].gswlWaybill.driverPhone}}</detail-list-item>
        <detail-list-item term="车牌号">{{this.orderTableList[0].gswlWaybill.vehicleNo}}</detail-list-item>
        <detail-list-item term="当前排行榜">{{score.evalRank}}</detail-list-item>
        <detail-list-item term="综合评价">
          <a-rate v-model="score.evaAll" disabled />
        </detail-list-item>
      </detail-list>
      <div>
        <div>
          运输效率：
          <a-rate v-model="score.evaEfficiency" />
        </div>
        <div>
          运输安全：
          <a-rate v-model="score.evaSafe" />
        </div>
        <div>
          服务质量：
          <a-rate v-model="score.evaServiceQuality" />
        </div>
        <div>
          客户满意度：
          <a-rate v-model="score.evaCustomerSatisfaction" />
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script>
import { postAction, getAction } from '@/api/manage'
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item

export default {
  name: '',
  components: { DetailList, DetailListItem },
  mounted() {},
  data() {
    return {
      visible: false,
      confirmLoading: false,
      confirmDirty: false,
      loading: false,
      form: this.$form.createForm(this),
      model: {},
      orderTableList: [],
      score: {
        evaCustomerSatisfaction: 0,
        evaEfficiency: 0,
        evaAll: 0,
        evaSafe: 0,
        evaServiceQuality: 0,
        evalRank: ''
      },
      value: 4,
      layout: 'vertical',
      columns: [
        {
          title: '序号',
          align: 'center',
          width: 30,
          dataIndex: 'id',
          scopedSlots: {
            customRender: 'id'
          }
        },
        {
          title: '运单号',
          align: 'center',
          dataIndex: 'gswlWaybill.waybillNo',
          width: 100
        },
        {
          title: '收货人',
          align: 'center',
          dataIndex: 'consigneeLinkName',
          width: 120
        },
        {
          title: '收货电话',
          align: 'center',
          dataIndex: 'consigneeLinkPhone',
          width: 120
        },
        {
          title: '目的地',
          align: 'center',
          dataIndex: 'consigneeAddr',
          width: 120
        },
        {
          title: '收货地址',
          align: 'center',
          dataIndex: 'consigneeDeailAddr',
          width: 120
        },
        {
          title: '物品名称',
          align: 'center',
          dataIndex: 'goodsNames',
          width: 120
        },
        {
          title: '总数量',
          align: 'center',
          dataIndex: 'gswlOrderGoodsList[0].totalNumberOfPackages',
          width: 120
        },
        {
          title: '总重量（吨）',
          align: 'center',
          dataIndex: 'gswlOrderGoodsList[0].goodsItemGrossWeight',
          width: 120
        },
        {
          title: '总体积（m³）',
          align: 'center',
          dataIndex: 'gswlOrderGoodsList[0].cube',
          width: 120
        },
        //  TODO
        {
          title: '运费收入',
          align: 'center',
          dataIndex: 'gswlOrderTransfer.freight',
          width: 120,
          sorter: (a, b) => a['gswlOrderTransfer.freight'] - b['gswlOrderTransfer.freight']
        },
        {
          title: '运费支出',
          align: 'center',
          dataIndex: 'gswlWaybill.freight',
          width: 120
        },
        {
          title: '承运人',
          align: 'center',
          dataIndex: 'gswlWaybill.driverName',
          width: 120
        }
      ]
    }
  },
  watch: {
    score: {
      handler(val, oldVal) {
        this.score.evaAll =
          (this.score.evaCustomerSatisfaction +
            this.score.evaEfficiency +
            this.score.evaSafe +
            this.score.evaServiceQuality) /
          4
      },
      deep: true
    }
  },
  methods: {
    show(data) {
      this.orderTableList = [data]
      console.log('表格数据', this.orderTableList)
      this.visible = true
      //  评价信息
      getAction('/order/gswlWaybill/querytaskEval', { waybillId: data.gswlWaybill.id }).then(res => {
        console.log('res', res.result)

        if (!res.result) {
          this.score = {
            evaCustomerSatisfaction: 0,
            evaEfficiency: 0,
            evaAll: 0,
            evaSafe: 0,
            evaServiceQuality: 0,
            evalRank: ''
          }
          return
        }
        this.score = res.result
        console.log('评价信息', this.score)
      })
    },
    handleSubmit() {
      let obj = {
        dataId: this.orderTableList[0].gswlWaybill.id,
        // driverName: this.orderTableList[0].gswlWaybill.driverName,
        // driverPhone: this.orderTableList[0].gswlWaybill.driverPhone,

        evaPartId: this.orderTableList[0].gswlWaybill.driverId,
        ...this.score,
        waybillStatus: this.orderTableList[0].gswlWaybill.waybillStatus
      }

      postAction('/order/gswlWaybill/taskEvalByWaybilld', obj).then(res => {
        if (res.message) {
          this.$message.success(res.message)
          this.close()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    close() {
      this.visible = false
      this.remark = ''
      ;(this.orderTableList = []),
        (this.score = {
          evaCustomerSatisfaction: 0,
          evaEfficiency: 0,
          evaAll: 0,
          evaSafe: 0,
          evaServiceQuality: 0
        })
    }
  }
}
</script>
<style scoped lang="less">
@import url('./waybillDetails/form.less');
/deep/ .detail-list {
  display: flex;
  flex-direction: column;
}
.info /deep/ .ant-col-md-8 {
  display: block;
  box-sizing: border-box;
  width: 19.333333%;
}
</style>