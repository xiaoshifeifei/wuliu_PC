<!--
 * @Description: 发布货源
 * @Date: 2020-03-05 13:03:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-04-21 23:47:43
 -->
<template>
  <a-modal
    title="发布货源"
    :width="1200"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    okText="确定"
    @cancel="handleCancel"
    cancelText="关闭"
    style="top:20px;"
  >
    <!-- ---  订单table区域 --- -->
    <a-table
      ref="table"
      bordered
      size="middle"
      rowKey="id"
      :columns="orderColumns"
      :dataSource="orderTableList"
      :pagination="false"
    ></a-table>

    <!-- ---  底部操作  --- -->
    <div class="box">
        <a-row :gutter="24" style="width: 100%">
            <a-card>
        <a-form :form="form" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :md="12" :sm="24">
            <a-form-item label="车型：" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag
                :triggerChange="true"
                v-decorator="[ 'vehicleType',validatorRules.vehicleType]"
                placeholder="请选择状态"
                dictCode="vehicleType"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="车长：" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag
                :triggerChange="true"
                v-decorator="[ 'vehicleLength',validatorRules.vehicleLength]"
                placeholder="请选择状态"
                dictCode="vehicleLength"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="装车时间：" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date
                placeholder="请选择时间"
                :trigger-change="true"
                v-decorator="['loadingTime',validatorRules.loadingTime]"
                date-format="YYYY-MM-DD HH:mm:ss"
                :showTime="true"
              ></j-date>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="备注：" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['remark']"></a-input>
            </a-form-item>
          </a-col>
        </a-form>
        </a-card>
      </a-row>
    </div>
  </a-modal>
</template>
<script>
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import JInput from '@/components/jeecg/JInput.vue'
import JDate from '@/components/jeecg/JDate.vue'
import { httpAction } from '@/api/manage'
export default {
  name: 'sourceModal',
  components: { JInput, JDate },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      confirmDirty: false,
      loading: false,
      flag: '',
      orderTableList: [],
      form: this.$form.createForm(this),
      model: {},
      orderColumns: [
        {
          title: '订单号',
          align: 'center',
          dataIndex: 'orderNo',
          width: 100
        },

        {
          title: '出发地',
          align: 'center',
          dataIndex: 'consignorAddr',
          width: 120
        },
        {
          title: '目的地',
          align: 'center',
          dataIndex: 'consigneeAddr',
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
          dataIndex: 'totalNumber',
          width: 50
        },
        {
          title: '总重量（吨）',
          align: 'center',
          dataIndex: 'totalWeight',
          width: 50
        },
        {
          title: '总体积（m³）',
          align: 'center',
          dataIndex: 'totalCube',
          width: 50
        }
      ],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      validatorRules: {
        vehicleType: { rules: [{ required: true, message: '请选择!' }] },
        vehicleLength: { rules: [{ required: true, message: '请选择!' }] },
        loadingTime: { rules: [{ required: true, message: '请选择!' }] }
      }
    }
  },

  methods: {
    show(flag) {
      this.flag = flag
      this.orderTableList = this.$parent.$parent.selectionRows
      console.log('表格数据', this.orderTableList)
      this.visible = true
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.disableSubmit = false
      this.gswlOrderGoodsList = []
      this.orderTableList = []
      this.selectedRowKeys = []
      this.selectionRows = []
      this.form.resetFields()
    },

    handleSubmit() {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          // this.confirmLoading = true
          let formData = Object.assign(this.model, values)
          console.log('订单数据', this.orderTableList)

          console.log('表单数据', formData)
          let tableData = []
          //  数据处理
          this.orderTableList.forEach((item, index) => {
            tableData[index] = {
              consigneeAddr: this.orderTableList[index].consigneeAddr,
              consigneeAddrCode: this.orderTableList[index].consigneeAddrCode,
              consigneeDeailAddr: this.orderTableList[index].consigneeDeailAddr,
              consignorAddr: this.orderTableList[index].consignorAddr,
              consignorAddrCode: this.orderTableList[index].consignorAddrCode,
              consignorDeailAddr: this.orderTableList[index].consignorDeailAddr,
              consignorLinkPhone: this.orderTableList[index].consignorLinkPhone,
              orderGoods: JSON.stringify({
                goodsNames: this.orderTableList[index].goodsNames,
                totalCube: this.orderTableList[index].totalCube,
                totalNumber: this.orderTableList[index].totalNumber,
                totalWeight: this.orderTableList[index].totalWeight
              }),
              orderId: this.orderTableList[index].id,
              supplyStatus: '',

              ...formData
            }
          })

          httpAction(
            '/order/gswlOrderSupply/releaseSource/' + this.orderTableList[0].gswlOrderTransfer.orderType,
            tableData,
            'POST'
          )
            .then(res => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit('ok')
                this.close()
              } else {
                this.$message.warning(res.message)
              }
            })
            .finally(() => {
              this.confirmLoading = false
            })
          this.close()
        } else {
          this.$message.error('请注意页面提示！')
        }
      })
    },

    handleCancel() {
      this.close()
    }
  }
}
</script>
<style scoped lang="less">
.box {
  width: 800px;
  margin: 0 auto;
  display: inline-block;
  margin-left: 50%;
  position: relative;
  right: 400px;
}
/deep/ .ant-card-bordered{
  border: 0px;
}
/deep/ .ant-form-item {
    border: 1px solid #dddee1;
    border-collapse: collapse;
    margin-bottom: 0;
  }
  .bottonIcon {
    text-align: right;
    font-size: 30px;
    i {
      margin-right: 30px;
    }
    i:hover {
      color: blue;
    }
  }
  /deep/ input,
  /deep/ textarea,
  /deep/ .ant-select-selection--single,
  /deep/ .ant-select-open,
  /deep/ .ant-input-number,
  /deep/ .ant-select-focuse {
    border: 0 !important; // 去除未选中状态边框
    outline: none !important; // 去除选中状态边框
    background-color: rgba(0, 0, 0, 0) !important; // 透明背景
  }

  /deep/ .ant-col-6,
  /deep/ .ant-col-12,
  /deep/ .ant-col-md-12,
  /deep/ .ant-col-24 {
    padding-left: 0px !important;
    padding-right: 0px !important;
    margin-top: -1px;
    margin-right: -1px;
  }
  /deep/ .ant-card-head-title {
    padding: 5px 0px;
  }
  /deep/ .ant-card-head,
  /deep/ .ant-card-head-wrapper {
    min-height: 35px;
    height: 35px;
  }
  /deep/ .ant-form-explain {
    top: 0;
    left: 100%;
    margin-left: 7px;
    width: 100px;
    padding: 10px;
    border-radius: 5px;
    background: rgba(205, 200, 209, 0.63);
    color: #fff;
    z-index: 2;
    line-height: 14px;
    animation: C 1s linear 0.8s forwards;
    position: absolute;
  }
  /deep/ .ant-form-explain::before {
    content: '';
    position: absolute;
    right: 100%;
    display: block;
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-right-color: #fc6a08;
  }
  /deep/ .ant-form-explain::after {
    box-sizing: border-box;
  }
  /deep/ .ant-radio-wrapper span:nth-of-type(2) {
    padding-right: 22px;
  }
  .distpicker-address-wrapper {
    display: flex;
  }
  .noborder {
    border: none !important;
    text-align: center !important;
  }
  #table /deep/ .ant-select {
    width: 100%;
  }
</style>