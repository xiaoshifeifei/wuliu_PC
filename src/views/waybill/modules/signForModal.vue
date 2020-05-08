<!--
 * @Description:
 * @Date: 2020-03-30 17:31:23
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-04-24 13:58:48
 -->
<template>
  <a-modal
    title="运单签收"
    :width="1200"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    okText="确定签收"
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
        tableLayout="auto"
        :scroll="{ x: true }"
      >
        <!-- //TODO 序号-->
        <span slot="id" slot-scope="text, record,index">{{index+1}}</span>
      </a-table>
    </div>
    <!-- ---  结算信息  --- -->
    <div>
      <a-row :gutter="24">
        <a-form :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="24">
            <a-form-item label="备注：" has-feedback>
              <a-input v-model="remark" />
            </a-form-item>
          </a-col>
        </a-form>
      </a-row>
    </div>
  </a-modal>
</template>
<script>
import { putAction } from '@/api/manage'

export default {
  name: '',
  components: {},
  data() {
    return {
      visible: false,
      confirmLoading: false,
      confirmDirty: false,
      loading: false,
      orderTableList: [],
      remark: '',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 }
      },
      columns: [
        {
          title: '序号',
          align: 'center',
          dataIndex: 'id',
          scopedSlots: {
            customRender: 'id'
          }
        },
        {
          title: '运单号',
          align: 'center',
          ellipsis: true,
          dataIndex: 'gswlWaybill.waybillNo'
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
          title: '物品名称',
          align: 'center',
          ellipsis: true,
          dataIndex: 'goodsNames'
        },
        {
          title: '总数量',
          align: 'center',
          ellipsis: true,
          dataIndex: 'gswlOrderGoodsList[0].totalNumberOfPackages'
        },
        {
          title: '总重量（吨）',
          align: 'center',
          ellipsis: true,
          dataIndex: 'gswlOrderGoodsList[0].goodsItemGrossWeight'
        },
        {
          title: '总体积（m³）',
          align: 'center',
          ellipsis: true,
          dataIndex: 'gswlOrderGoodsList[0].cube'
        },
        //  TODO
        {
          title: '运费收入',
          align: 'center',
          ellipsis: true,
          dataIndex: 'gswlOrderTransfer.freight',
          sorter: (a, b) => a['gswlOrderTransfer.freight'] - b['gswlOrderTransfer.freight']
        },
        {
          title: '运费支出',
          align: 'center',
          ellipsis: true,
          dataIndex: 'gswlWaybill.freight'
        },
        {
          title: '支出对象',
          align: 'center',
          ellipsis: true,
          dataIndex: 'gswlWaybill.driverName'
        }
      ]
    }
  },
  methods: {

    show() {
      this.orderTableList = this.$parent.$parent.selectionRows
      console.log('表格数据', this.orderTableList)
      this.visible = true
    },
    handleSubmit() {
      console.log('备注', this.remark)
      //  处理表格数据
      const ids = this.orderTableList.reduce(function(ids, currentValue) {
        return ids + currentValue.gswlWaybill.id + ','
      }, '')
      const obj = {
        remark: this.remark,
        waybillId: ids
      }
      //  TODO
      putAction('/order/gswlWaybill/doWaybillReceipt', obj).then(res => {
        if (res.message) {
          this.$message.success(res.message)
          this.$emit('ok')
          this.close()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    close() {
      this.visible = false
      this.remark = ''
      this.orderTableList = []
    }
  }
}
</script>
<style scoped lang="less">
.tabs {
  display: inline-block;
  margin-right: 15px;
}
</style>
