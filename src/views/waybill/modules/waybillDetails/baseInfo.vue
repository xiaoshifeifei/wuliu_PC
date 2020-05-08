<!--
 * @Description:
 * @Date: 2020-03-06 14:45:00
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-04-30 11:35:09
 -->
<template>
  <div>
    <a-row :gutter="24" style="margin-bottom:10px">

      <a-card title="基础信息">
        <div class="box-container">
          <a-form :form="form"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol">
            <a-col :span="label">
              <a-form-item label="订单号：">
                <span>{{model.orderNo}}</span>
              </a-form-item>
            </a-col>
            <a-col :span="label">
              <a-form-item label="委托单号：">
                <a-input v-decorator="[ 'shippingNoteNumber']"
                         disabled></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="label">
              <a-form-item label="客户单位：">
                <a-input v-decorator="[ 'customer']"
                         disabled></a-input>
              </a-form-item>
            </a-col>

            <a-col :span="label">
              <a-form-item label="托运时间：">
                <j-date placeholder="请选择时间"
                        :trigger-change="true"
                        style="min-width: 100%;"
                        v-decorator="['consignmentDateTime']"
                        date-format="YYYY-MM-DD HH:mm:ss"
                        :showTime="true"
                        disabled></j-date>
              </a-form-item>
            </a-col>
            <a-col :span="label">
              <a-form-item label="业务类型：">
                <j-dict-select-tag v-decorator="[ 'businessTypeCode']"
                                   :triggerChange="true"
                                   dictCode="businessTypeCode"
                                   disabled></j-dict-select-tag>
              </a-form-item>
            </a-col>

            <a-col :span="label">
              <a-form-item label="运输模式：">
                <span v-if="model.transportMode == 0">整车</span>
                <span v-if="model.transportMode == 1">零担</span>
              </a-form-item>
            </a-col>
            <a-col :span="label">
              <a-form-item label="运输类型：">
                <j-dict-select-tag :triggerChange="true"
                                   dictCode="transportTypeCode"
                                   v-decorator="[ 'transportTypeCode']"
                                   disabled></j-dict-select-tag>
              </a-form-item>
            </a-col>
            <a-col :span="label">
              <a-form-item label="配送方式：">
                <span v-if="model.shippingMethod == 0">送货</span>
                <span v-if="model.shippingMethod == 1">自提</span>
              </a-form-item>
            </a-col>

            <a-col :span="label">
              <a-form-item label="配送时间：">
                <j-date placeholder="请选择时间"
                        :trigger-change="true"
                        v-decorator="['shippingDateTime']"
                        date-format="YYYY-MM-DD HH:mm:ss"
                        style="min-width: 100%;"
                        :showTime="true"
                        disabled></j-date>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="备注："
                           :labelCol="labelCol2"
                           :wrapperCol="wrapperCol2">
                <a-input v-decorator="[ 'remark']"
                         disabled></a-input>
              </a-form-item>
            </a-col>
          </a-form>
        </div>
      </a-card>
    </a-row>
    <a-row :gutter="24" style="margin-bottom:10px">
      <a-card title="货物信息">
        <!-- table区域 -->

        <div class="ant-alert ant-alert-info"
             style="margin-bottom: 16px;">
          <i class="anticon anticon-info-circle ant-alert-icon"></i>
          总数量
          <a style="font-weight: 600;color:rgba(217, 0, 27, 0.647058823529412)">{{ num }}</a>件&nbsp;&nbsp;
          总重量
          <a style="font-weight: 600;color:rgba(217, 0, 27, 0.647058823529412)">{{ weigth }}</a>吨&nbsp;&nbsp;
          总体积
          <a style="font-weight: 600;color:rgba(217, 0, 27, 0.647058823529412)">{{ capacity }}</a>
          m³&nbsp;&nbsp;
        </div>
        <a-table v-if="orderTableList.length !== 0"
                 ref="table"
                 bordered
                 size="middle"
                 rowKey="id"
                 :columns="columns"
                 :dataSource="orderTableList"
                 :pagination="false">
          <!-- //TODO 序号-->
          <span slot="id"
                slot-scope="text, record,index">{{index+1}}</span>

          <div slot="cargoTypeClassificationCode"
               slot-scope="text, record,index">
            <j-dict-select-tag dictCode="cargoClassificationCode"
                               v-model="orderTableList[index].cargoTypeClassificationCode"
                               placeholder="请选择货物类型"
                               disabled></j-dict-select-tag>
          </div>

          <div slot="cargoPackCode"
               slot-scope="text, record,index">
            <j-dict-select-tag dictCode="cargoPackCode"
                               v-model="orderTableList[index].cargoPackCode"
                               placeholder="请选择货物包装"
                               disabled></j-dict-select-tag>
          </div>
        </a-table>
      </a-card>
    </a-row>
    <a-row :gutter="24" style="margin-bottom:10px">
      <a-col :span="12">
        <a-card title="发货信息">
          <a-form :form="form"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol">
            <a-col :span="24">
              <a-form-item label="发货单位："
                           :labelCol="labelCol2"
                           :wrapperCol="wrapperCol2">
                <a-input v-decorator="[ 'consignor']"
                         disabled></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="发货人：">
                <a-input placeholder="请输入发货人"
                         v-decorator="[ 'consignorLinkName']"
                         disabled></a-input>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="联系电话：">
                <a-input v-decorator="[ 'consignorLinkPhone']"
                         disabled></a-input>
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item label="发货地址："
                           :labelCol="labelCol2"
                           :wrapperCol="wrapperCol2">
                <a-input v-decorator="[ 'consignorAddr']"
                         disabled></a-input>
                <!-- <v-distpicker
                  v-decorator="[ 'consignorAddr']"
                  :province="select.province"
                  :city="select.city"
                  :area="select.area"
                  disabled
                ></v-distpicker> -->
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="详细地址："
                           :labelCol="labelCol2"
                           :wrapperCol="wrapperCol2">
                <a-input v-decorator="[ 'consignorDeailAddr']"
                         disabled></a-input>
              </a-form-item>
            </a-col>
          </a-form>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="收货信息">
          <a-form :form="form"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol">
            <a-col :span="24">
              <a-form-item label="收货单位："
                           :labelCol="labelCol2"
                           :wrapperCol="wrapperCol2">
                <a-input v-decorator="[ 'consignee']"
                         disabled></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="收货人：">
                <a-input v-decorator="[ 'consigneeLinkName']"
                         disabled></a-input>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="联系电话：">
                <a-input v-decorator="[ 'consigneeLinkPhone']"
                         disabled></a-input>
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item label="目的地："
                           :labelCol="labelCol2"
                           :wrapperCol="wrapperCol2">
                <a-input v-decorator="[ 'consigneeAddr']"
                         disabled></a-input>

                <!-- <v-distpicker
                  v-decorator="[ 'consigneeAddr']"
                  :province="select2.province"
                  :city="select2.city"
                  :area="select2.area"
                  disabled
                ></v-distpicker> -->
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="详细地址："
                           :labelCol="labelCol2"
                           :wrapperCol="wrapperCol2">
                <a-input v-decorator="[ 'consigneeDeailAddr']"
                         disabled></a-input>
              </a-form-item>
            </a-col>
          </a-form>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="24" style="margin-bottom:10px">
      <a-card title="结算信息">
        <a-form :form="form"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol">
          <!-- <a-col :span="24">
            <a-form-item label="客户名称："
                         :labelCol="labelCol3"
                         :wrapperCol="wrapperCol3">
              <a-input v-decorator="[ 'customerName']"
                       disabled></a-input>
            </a-form-item>
          </a-col> -->
          <a-col :span="label">
            <a-form-item label="运费：">
              <a-input v-decorator="[ 'freight']"
                       disabled></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="结算类型：">
              <j-dict-select-tag :triggerChange="true"
                                 dictCode="settlementType"
                                 disabled
                                 v-decorator="[ 'settlementType']"></j-dict-select-tag>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="到付金额：">
              <a-input v-decorator="[ 'freight']"
                       disabled></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="付款方式：">
              <j-dict-select-tag :triggerChange="true"
                                 dictCode="paymentMeansCode"
                                 v-decorator="[ 'paymentMeansCode']"
                                 disabled></j-dict-select-tag>
            </a-form-item>
          </a-col>
        </a-form>
      </a-card>
    </a-row>

    <a-row :gutter="24" style="margin-bottom:10px">
      <a-card title="承运商信息">
        <a-form :form="form"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol">
          <a-col :span="24">
            <a-form-item label="客户名称："
                         :labelCol="labelCol2"
                         :wrapperCol="wrapperCol2">
              <a-input v-decorator="[ 'carrierName']"
                       disabled></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="承运商运费：">
              <a-input v-decorator="[ 'carrierFreight']"
                       disabled></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="利润率：">
              <a-input v-decorator="[ 'rate']"
                       disabled></a-input>
            </a-form-item>
          </a-col>
        </a-form>
      </a-card>
    </a-row>
  </div>
</template>
<script>
import pick from 'lodash.pick'

import JInput from '@/components/jeecg/JInput.vue'
import VDistpicker from 'v-distpicker'
import JDate from '@/components/jeecg/JDate.vue'
export default {
  name: 'baseInfo',
  components: { JInput, VDistpicker, JDate },
  data() {
    return {
      form: this.$form.createForm(this),
      tagType: 'radio',
      consignorList: [],
      consigneeList: [],
      model: {},
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
      labelCol3: {
        xs: { span: 24 },
        sm: { span: 2 }
      },
      wrapperCol3: {
        xs: { span: 24 },
        sm: { span: 22 }
      },
      label: 6,
      num: 0,
      weigth: 0,
      volume: 0,
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
          title: '货物名称',
          align: 'center',
          width: 100,
          dataIndex: 'descriptionOfGoods',
          scopedSlots: {
            customRender: 'descriptionOfGoods'
          }
        },
        {
          title: '货物类型',
          align: 'center',
          width: 100,
          dataIndex: 'cargoTypeClassificationCode',
          scopedSlots: {
            customRender: 'cargoTypeClassificationCode'
          }
        },

        {
          title: '包装',
          align: 'center',
          width: 100,
          dataIndex: 'cargoPackCode',
          scopedSlots: {
            customRender: 'cargoPackCode'
          }
        },
        {
          title: '数量',
          align: 'center',
          width: 100,
          dataIndex: 'totalNumberOfPackages',
          scopedSlots: {
            customRender: 'totalNumberOfPackages'
          }
        },
        {
          title: '重量（吨）',
          align: 'center',
          width: 100,
          dataIndex: 'goodsItemGrossWeight',
          scopedSlots: {
            customRender: 'goodsItemGrossWeight'
          }
        },
        {
          title: '体积（m³）',
          align: 'center',
          width: 100,
          dataIndex: 'cube',
          scopedSlots: {
            customRender: 'cube'
          }
        }
      ],
      orderTableList: [],
      tablelist: {},
      select: {},
      select2: {},
      roleList: [],
      num: 0,
      weigth: 0,
      capacity: 0
    }
  },
  props: { baseInfo: Object, required: true },

  mounted() {
    let record = JSON.parse(JSON.stringify(this.baseInfo))
    record.gswlOrderTransfer.customer = record.gswlOrderTransfer.customerName
    record = { ...record, ...record.gswlOrderTransfer }
    this.orderTableList = record.gswlOrderGoodsList
    //   表格数据
    this.orderTableList.forEach(element => {
      // 总数量
      this.num += parseFloat(element.totalNumberOfPackages)
      // 总重量
      this.weigth += parseFloat(element.goodsItemGrossWeight)

      // 总体积
      this.capacity += parseFloat(element.cube)
    })
    console.log('record', record)
    this.edit(record)
  },

  methods: {
    edit(record) {
      this.form = this.$form.createForm(this)
      this.model = Object.assign({}, record)
      this.model.rate = this.model.rate ? this.model.rate * 100 + '%' : ''

      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'shippingNoteNumber',
            'customer',
            'consignmentDateTime',
            'businessTypeCode',
            'transportTypeCode',
            'shippingDateTime',
            'consignorLinkName',
            'consignorLinkPhone',
            'consignor',
            'consignorAddr',
            'consignorDeailAddr',
            'consigneeLinkName',
            'consigneeLinkPhone',
            'consignee',
            'consigneeAddr',
            'consigneeDeailAddr',
            'freight',
            'paymentMeansCode',
            'settlementType',
            'customerName',
            'carrierName',
            'carrierFreight',
            'rate'
          )
        )
      })
    },
    close() {
      this.visible = false
      this.form.resetFields()
    },

    handleCancel() {
      this.close()
    },
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
    },
    onClearSelected() {
      this.selectedRowKeys = []
      this.selectionRows = []
    }
  }
}
</script>
<style scoped lang="less">
@import url('./form.less');
/deep/ .ant-alert {
  padding: 5px 15px;
  text-align: right !important;
}
</style>
