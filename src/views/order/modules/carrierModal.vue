<!--
 * @Description:
 * @Date: 2020-03-05 13:03:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-04-30 10:03:39
 -->
<template>
  <a-modal :title="title"
           :width="800"
           :visible="visible"
           :confirmLoading="confirmLoading"
           @ok="handleSubmit"
           okText="确定派单"
           @cancel="handleCancel"
           cancelText="关闭"
           style="top:20px;">
    {{title}}：
    <a-select v-if="userType === 'PT'"
              showSearch
              style="width: 500px"
              @change="handleChange"
              v-model="carriers"
              placeholder="请输入企业名称"
              optionFilterProp="children">
      <a-select-option v-for="item in carrierOptions"
                       :key="item.id"
                       :value="item.id">{{
        item.carrierName
      }}</a-select-option>
    </a-select>
    <a-input v-if="userType !== 'PT'"
             disabled
             style="width: 500px"
             v-model="carrierInfo.carrierName"></a-input>
    <!-- 承运商公司信息 -->
    <div id="carrier">
      <a-row :gutter="24"
             style="width: 100%">
        <a-form :form="carrierInfo"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                v-if="Object.keys(carrierInfo).length > 0"
                class="form">
          <a-col :span="12">
            <a-form-item label="企业名称：">
              <a-input v-model="carrierInfo.carrierName"
                       disabled></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="参考利润："
                         v-if="userType === 'PT'">
              <a-input v-model="carrierInfo.carrierRateNum"
                       disabled></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系人：">
              <a-input v-model="carrierInfo.linkName"
                       disabled></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系人电话：">
              <a-input v-model="carrierInfo.linkPhone"
                       disabled></a-input>
            </a-form-item>
          </a-col>
        </a-form>
      </a-row>
    </div>
    <a-divider />
    <!-- table区域 -->
    <div>
      <!-- table区域-begin -->

      <div class="ant-alert ant-alert-info"
           style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i>已选择&nbsp; 总数量
        <a style="font-weight: 600;color:rgba(217, 0, 27, 0.647058823529412)">{{ num.toFixed(0) }}</a>件&nbsp;&nbsp; 总重量
        <a style="font-weight: 600;color:rgba(217, 0, 27, 0.647058823529412)">{{ weigth.toFixed(2) }}</a>吨&nbsp;&nbsp; 总体积
        <a style="font-weight: 600;color:rgba(217, 0, 27, 0.647058823529412)">{{ capacity.toFixed(2) }}</a>
        m³&nbsp;&nbsp;
      </div>

      <a-table ref="table"
               bordered
               size="middle"
               rowKey="id"
               :columns="columns"
               :dataSource="orderTableList"
               :loading="loading"
               :pagination="false"
               :scroll="{ x: true }"
               table-layout="auto">
        <!-- //TODO 序号-->
        <span slot="id"
              slot-scope="text, record, index">{{ index + 1 }}</span>
        <!-- //TODO 运费收入-->
        <span slot="freight"
              slot-scope="text, record">
          <div style="color:rgba(217, 0, 27, 0.647058823529412)">{{ text }}</div>
        </span>
        <!-- //TODO 承运商运费-->
        <span slot="gswlOrderTransfer.carrierFreight"
              slot-scope="text, record, index">
          <a-input v-model="orderTableList[index].gswlOrderTransfer.carrierFreight"
                   suffix="元"
                   ></a-input>
        </span>
      </a-table>

      <!-- table区域-end -->
      <div class="ant-alert ant-alert-info"
           style="margin-bottom: 16px;"
           v-if="userType !== 'HZ'">
        运费收入
        <a style="font-weight: 600;color:rgba(217, 0, 27, 0.647058823529412)">{{ income.toFixed(2) }}</a>元&nbsp;&nbsp; 运费支出
        <a style="font-weight: 600;color:rgba(217, 0, 27, 0.647058823529412)">{{ expenditure.toFixed(2) }}</a>元&nbsp;&nbsp; 利润
        <a style="font-weight: 600;color:rgba(217, 0, 27, 0.647058823529412)">{{
          (income - expenditure).toFixed(2)
        }}</a>
        元&nbsp;&nbsp;
      </div>
    </div>
    <!-- ---  结算信息  --- -->
    <div>
      <a-row :gutter="24"
             style="width: 100%">
        <a-card title="结算信息">
          <a-form :form="form"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  class="form">
            <a-col :span="12">
              <a-form-item label="付款方式："
                           has-feedback>
                <j-dict-select-tag :triggerChange="true"
                                   dictCode="paymentMeansCode"
                                   v-decorator="['paymentMeansCode', validatorRules.paymentMeansCode]"
                                   placeholder="请选择发送方式"></j-dict-select-tag>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="结算方式："
                           has-feedback>
                <j-dict-select-tag :triggerChange="true"
                                   dictCode="settlementWays"
                                   @change="settlementWaysChange"
                                   v-decorator="['settlementWays', validatorRules.settlementWays]"
                                   placeholder="请选择发送方式"></j-dict-select-tag>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="结算天数："
                           has-feedback  v-if="settDayShow">
                <a-input type="number"

                         :min="1"
                         :max="1000"
                         suffix="天"
                         v-decorator="['settlementDays', validatorRules.settlementDays]" />

              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="结算类型："
                           has-feedback>
                <j-dict-select-tag :triggerChange="true"
                                   dictCode="settlementType"
                                   v-decorator="['settlementType', validatorRules.settlementType]"
                                   placeholder="请选择发送方式"></j-dict-select-tag>
              </a-form-item>
            </a-col>
          </a-form>
        </a-card>
      </a-row>
    </div>
  </a-modal>
</template>
<script>
import pick from 'lodash.pick'

import JMultiSelectTag from '@/components/dict/JMultiSelectTag'
import { OrderApi } from '@api/order'
import store from '@/store/'
export default {
  name: 'carrierModal',
  components: { JMultiSelectTag },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      confirmDirty: false,
      loading: false,
      carrierInfo: {},
      model: {},
      bumen: [],
      settDayShow: false,
      orderTableList: [],
      selectValue: '',
      carrierOptions: [],
      gswlOrderGoodsList: [],
      weigth: 0,
      capacity: 0,
      income: 0,
      expenditure: 0,
      title: '',
      num: 0,
      form: this.$form.createForm(this),
      url: '',
      validatorRules: {
        paymentMeansCode: { rules: [{ required: true, message: '请输入!' }] },
        settlementWays: { rules: [{ required: true, message: '请输入!' }] },
        settlementDays: { rules: [{ required: true, min: 1, max: 1000, message: '请输入1到一千的整数!' }] },

        settlementType: { rules: [{ required: true, message: '请输入!' }] }
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      labelCol2: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol2: {
        xs: { span: 24 },
        sm: { span: 20 }
      },
      label: 6,
      columns: [],
      carriers: '',
      userType: ''
    }
  },
  mounted() {
    OrderApi.getCompony({ carrierName: '' }).then(res => {
      if (this.userType === 'PT') {
        this.carrierOptions = res.result
      } else {
        this.carrierInfo = res.result
        this.handleChange2()
      }
    })
    //  判断登陆角色展示表格信息
    this.userType = store.getters.userType
    this.title = this.userType === 'PT' ? '指派承运商' : '指派平台'
    if (this.userType === 'PT') {
      this.columns = [
        {
          title: '序号',
          align: 'center',
          dataIndex: 'id',
          width: 100,
          scopedSlots: {
            customRender: 'id'
          },
          ellipsis: true
        },
        {
          title: '订单号',
          align: 'center',
          dataIndex: 'orderNo'
        },
        {
          title: '订单来源',
          align: 'center',
          width: 80,
          dataIndex: 'dataSource_dictText',
          ellipsis: true
        },
        {
          title: '运费收入',
          align: 'center',
          dataIndex: 'gswlOrderTransfer.freight',
          width: 120,
          scopedSlots: {
            customRender: 'gswlOrderTransfer.freight'
          },
          sorter: (a, b) => a['gswlOrderTransfer.freight'] - b['gswlOrderTransfer.freight'],
          ellipsis: true
        },

        {
          title: '承运商运费',
          align: 'center',
          width: 180,
          dataIndex: 'gswlOrderTransfer.carrierFreight',
          scopedSlots: {
            customRender: 'gswlOrderTransfer.carrierFreight'
          },
          fixed: 'right'
        }
      ]
    } else if (this.userType === 'HZ') {
      this.columns = [
        {
          title: '序号',
          align: 'center',
          dataIndex: 'id',
          width: 100,
          scopedSlots: {
            customRender: 'id'
          },
          ellipsis: true
        },
        {
          title: '订单号',
          align: 'center',
          dataIndex: 'orderNo',
          width: 100,
          ellipsis: true
        },

        {
          title: '运费收入',
          align: 'center',
          dataIndex: 'gswlOrderTransfer.freight',
          width: 120,
          scopedSlots: {
            customRender: 'gswlOrderTransfer.freight'
          },
          sorter: (a, b) => a['gswlOrderTransfer.freight'] - b['gswlOrderTransfer.freight'],
          ellipsis: true
        },
        {
          title: '总数量',
          align: 'center',
          dataIndex: 'totalNumber',
          width: 80,
          ellipsis: true
        },
        {
          title: '总重量（吨）',
          align: 'center',
          dataIndex: 'totalWeight',
          width: 80,
          ellipsis: true
        },
        {
          title: '总体积（m³）',
          align: 'center',
          dataIndex: 'totalCube',
          width: 80,
          ellipsis: true
        },
        {
          title: '承运商运费',
          align: 'center',
          width: 180,
          dataIndex: 'gswlOrderTransfer.carrierFreight',
          scopedSlots: {
            customRender: 'gswlOrderTransfer.carrierFreight'
          },
          fixed: 'right'
        }
      ]
    } else if (this.userType === 'CYS') {
      this.columns = [
        {
          title: '序号',
          align: 'center',
          dataIndex: 'id',
          scopedSlots: {
            customRender: 'id'
          },
          ellipsis: true
        },
        {
          title: '订单号',
          align: 'center',
          dataIndex: 'orderNo',
          width: 100,
          ellipsis: true
        },

        {
          title: '运费收入',
          align: 'center',
          dataIndex: 'gswlOrderTransfer.freight',
          width: 120,
          scopedSlots: {
            customRender: 'gswlOrderTransfer.freight'
          },
          sorter: (a, b) => a['gswlOrderTransfer.freight'] - b['gswlOrderTransfer.freight'],
          ellipsis: true
        },
        {
          title: '总数量',
          align: 'center',
          dataIndex: 'totalNumber',
          width: 80
        },
        {
          title: '总重量（吨）',
          align: 'center',
          dataIndex: 'totalWeight',
          width: 80,
          ellipsis: true
        },
        {
          title: '总体积（m³）',
          align: 'center',
          dataIndex: 'totalCube',
          width: 80,
          ellipsis: true
        },
        {
          title: '承运商运费',
          align: 'center',
          width: 180,
          dataIndex: 'gswlOrderTransfer.carrierFreight',
          scopedSlots: {
            customRender: 'gswlOrderTransfer.carrierFreight'
          },
          fixed: 'right'
        }
      ]
    }
  },
  watch: {
    visible() {
      this.weigth = 0
      this.capacity = 0
      this.income = 0
      this.orderTableList.forEach(item => {
        this.gswlOrderGoodsList = [...this.gswlOrderGoodsList, ...item.gswlOrderGoodsList]
      })
      console.log('gswlOrderGoodsList', this.gswlOrderGoodsList)
      this.gswlOrderGoodsList.forEach(element => {
        // 总重量
        this.weigth += parseFloat(element.goodsItemGrossWeight)
        // 总数量
        this.num += parseFloat(element.totalNumberOfPackages)
        // 总体积
        this.capacity += parseFloat(element.cube)
      })
    }
  },
  methods: {
    show(carriers, url) {
      const urls = arguments[1] ? arguments[1] : ''
      this.url = urls
      this.orderTableList = this.$parent.$parent.selectionRows
      console.log('表格数据', this.orderTableList)
      this.visible = true
      if (this.userType !== 'PT') {
        this.handleChange2()
      }
      //  如果是单条数据的情况下带入结算信息
      if (this.orderTableList.length !== 1) return
      this.form.resetFields()
      this.model = Object.assign({}, this.orderTableList[0])
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.model.gswlOrderTransfer, 'settlementWays', 'settlementDays', 'settlementType', 'paymentMeansCode')
        )
      })
      this.settlementWaysChange(this.model.gswlOrderTransfer.settlementWays)
    },
    close() {
      this.$emit('ok')
      this.visible = false
      this.disableSubmit = false
      if (this.userType === 'PT') {
        this.carriers = ''
        this.carrierInfo = {}
      }
      this.weigth = 0
      this.capacity = 0
      this.income = 0
      this.expenditure = 0
      this.num = 0
      this.gswlOrderGoodsList = []
      this.orderTableList = []
      this.form.resetFields()
    },
    handleSubmit() {
      if (Object.keys(this.carrierInfo) === 0) {
        this.$message.warning('请指派承运商！')
        return
      }
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          const that = this
          const formData = Object.assign(that.model, values)
          console.log('承运商信息', this.carrierInfo)
          console.log('表格信息', this.orderTableList)
          console.log('结算信息', formData)
          //  表格信息处理
          const tableList = []

          this.orderTableList.forEach(item => {
            tableList.push({ orderId: item.id, carrierFrieght: item['gswlOrderTransfer'].carrierFreight })
          })

          console.log('处理完的表格信息', tableList, this.orderTableList[0].gswlOrderTransfer.orderType)
          const obj = {
            carrierId: this.carrierInfo.id,
            carrierName: this.carrierInfo.carrierName,
            orderParamList: tableList,
            orderType: this.orderTableList[0].gswlOrderTransfer.orderType,
            rate: this.carrierInfo.carrierRate,
            ...formData
          }
          console.log('obj', obj)
          console.log('url', this.url)

          if (this.url === '') {
            OrderApi.assignedCarrier(obj)
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
          } else {
            OrderApi.assignedExCarrier(obj, this.url)
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
          }
        } else {
          this.$message.error('请注意页面提示！')
        }
      })
    },

    handleCancel() {
      this.close()
    },
    //  平台端指派承运商
    handleChange(value) {
      console.log(value)
      const arr = JSON.parse(JSON.stringify(this.carrierOptions))
      this.carrierInfo = arr.filter(item => item.id === value)[0]
      console.log('承运商信息', this.carrierInfo)
      this.carrierInfo.carrierRate = this.carrierInfo.carrierRate ? this.carrierInfo.carrierRate : 0

      // 参考利润
      this.carrierInfo.carrierRateNum = this.carrierInfo.carrierRate ? this.carrierInfo.carrierRate * 100 + '%' : ''

      this.orderTableList.forEach(item => {
        //  表格承运商运费
        item['gswlOrderTransfer'].carrierFreight =
          item['gswlOrderTransfer'].freight * (1 - this.carrierInfo.carrierRate)

        item['gswlOrderTransfer'].carrierFreight = parseFloat(item['gswlOrderTransfer'].carrierFreight).toFixed(2)

        //  运费收入    运费支出

        this.income += parseFloat(item['gswlOrderTransfer'].freight)

        this.expenditure += parseFloat(item['gswlOrderTransfer'].carrierFreight)
      })
    },
    //  货主/承运商端指派承运商
    handleChange2() {
      console.log('承运商信息', this.carrierInfo)
      this.carrierInfo.carrierRate = this.carrierInfo.carrierRate ? this.carrierInfo.carrierRate : 0
      this.orderTableList.forEach(item => {
        //  表格承运商运费
        item['gswlOrderTransfer'].carrierFreight =
          item['gswlOrderTransfer'].freight * (1 - this.carrierInfo.carrierRate)
        //  运费收入    运费支出
        item['gswlOrderTransfer'].carrierFreight = parseFloat(item['gswlOrderTransfer'].carrierFreight)
        console.log('gswlOrderTransfer', item['gswlOrderTransfer'].carrierFreight)

        this.income += item['gswlOrderTransfer'].freight
        this.expenditure += item['gswlOrderTransfer'].carrierFreight
      })
    },
    settlementWaysChange(val) {
      if (val === '2') {
        this.settDayShow = true
      } else {
        this.settDayShow = false
      }
    }
  }
}
</script>
<style scoped lang="less">
#carrier {
  margin-top: 20px;
}
/deep/ .ant-row {
  margin: 0 0 !important;
}
.form {
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
}
</style>
