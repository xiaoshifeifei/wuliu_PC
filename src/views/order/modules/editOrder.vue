<!--
 * @Description:
 * @Date: 2020-03-18 09:37:24
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-05-07 15:00:58
 -->
<template>
  <div style="padding:0 80px">
    <a-row :gutter="24"   style="margin-bottom:10px">
      <div class="top-bar">
        <a-button type="primary" :loading="loading"   style="margin-right:10px" @click="submit">确定修改</a-button>
        <a-button type @click="clear">返回</a-button>
      </div>
      <a-card title="基础信息">

        <div class="box-container">
          <a-form :form="form" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-col :span="label">
              <a-form-item label="订单号：">
                <span>{{ model.orderNo }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="label">
              <a-form-item label="委托单号：" has-feedback>
                <a-input v-decorator="['shippingNoteNumber']"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="label">
              <a-form-item label="客户单位：" has-feedback>
                <a-select
                  showSearch
                  allowClear
                  placeholder="请输入客户单位"
                  optionFilterProp="children"
                  @change="customerInfo"
                  v-decorator="['customer', validatorRules.customer]"
                >
                  <a-select-option
                    v-for="(role, roleindex) in roleList"
                    :key="roleindex.toString()"
                    :value="role.customerId ? role.customerId : role.id + ',' + role.customerName"
                    >{{ role.customerName }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :span="label">
              <a-form-item label="托运时间：" has-feedback>
                <j-date
                  placeholder="请选择时间"
                  :trigger-change="true"
                  style="width: 100%;"
                  v-decorator="['consignmentDateTime', validatorRules.consignmentDateTime]"
                  date-format="YYYY-MM-DD HH:mm:ss"
                  :showTime="true"
                ></j-date>
              </a-form-item>
            </a-col>
            <a-col :span="label">
              <a-form-item label="业务类型：" has-feedback>
                <j-dict-select-tag
                  v-decorator="['businessTypeCode', validatorRules.businessTypeCode]"
                  :triggerChange="true"
                  dictCode="businessTypeCode"
                ></j-dict-select-tag>
              </a-form-item>
            </a-col>

            <a-col :span="label">
              <a-form-item label="运输模式：" has-feedback>
                <!-- <j-dict-select-tag
                  type="radio"
                  :triggerChange="true"
                  dictCode="transportTypeCode_dictionary"
                ></j-dict-select-tag>-->

                <a-radio-group v-decorator="['transportMode', validatorRules.transportMode]">
                  <a-radio value="0">整车</a-radio>
                  <a-radio value="1">零担</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="label">
              <a-form-item label="运输类型：" has-feedback>
                <j-dict-select-tag
                  :triggerChange="true"
                  dictCode="transportTypeCode"
                  v-decorator="['transportTypeCode', validatorRules.transportTypeCode]"
                ></j-dict-select-tag>
              </a-form-item>
            </a-col>
            <a-col :span="label">
              <a-form-item label="配送方式：" has-feedback>
                <a-radio-group v-decorator="['shippingMethod', validatorRules.shippingMethod]">
                  <a-radio value="0">送货</a-radio>
                  <a-radio value="1">自提</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>

            <a-col :span="label">
              <a-form-item label="配送时间：" has-feedback>
                <j-date
                  placeholder="请选择时间"
                  :trigger-change="true"
                  style="width: 100%;"
                  v-decorator="['shippingDateTime', validatorRules.shippingDateTime]"
                  date-format="YYYY-MM-DD HH:mm:ss"
                  :showTime="true"
                ></j-date>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="备注：" :labelCol="labelCol2" :wrapperCol="wrapperCol2" has-feedback>
                <a-input v-decorator="['remark', {}]"></a-input>
              </a-form-item>
            </a-col>
          </a-form>
        </div>
      </a-card>
    </a-row>

    <a-row :gutter="24" style="margin-bottom:10px">
      <a-col :span="12">
        <a-card title="发货信息">
          <a-form :form="form" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-col :span="24">
              <a-form-item label="发货单位：" has-feedback :labelCol="labelCol2" :wrapperCol="wrapperCol2">
                <a-select
                  showSearch
                  placeholder="请输入客户单位"
                  optionFilterProp="children"
                  @change="consignorHandleSelectChange"
                  v-decorator="['consignorId', validatorRules.consignor]"
                >
                  <a-select-option
                    v-for="(role, roleindex) in consignorList"
                    :key="roleindex.toString()"
                    :value="role.id"
                    >{{ role.contactsName }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="发货人：" has-feedback>
                <a-input
                  placeholder="请输入发货人"
                  v-decorator="['consignorLinkName', validatorRules.consignorLinkName]"
                  disabled
                ></a-input>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="联系电话：" has-feedback>
                <a-input disabled v-decorator="['consignorLinkPhone', validatorRules.consignorLinkPhone]"></a-input>
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item label="发货地址：" :labelCol="labelCol2" :wrapperCol="wrapperCol2">
                <a-input disabled v-decorator="['consignorAddr', validatorRules.consignorAddr]"></a-input>
                <!-- <v-distpicker
                  @selected="onSelected"
                  v-decorator="[ 'consignorAddr', validatorRules.consignorAddr]"
                  :province="select.province"
                  :city="select.city"
                  :area="select.area"
                  disabled
                ></v-distpicker> -->
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="详细地址：" has-feedback :labelCol="labelCol2" :wrapperCol="wrapperCol2">
                <a-input disabled v-decorator="['consignorDeailAddr', validatorRules.consignorDeailAddr]"></a-input>
              </a-form-item>
            </a-col>
          </a-form>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="收货信息">
          <a-form :form="form" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-col :span="24">
              <a-form-item label="收货单位：" has-feedback :labelCol="labelCol2" :wrapperCol="wrapperCol2">
                <a-select
                  showSearch
                  allowClear
                  placeholder="请输入客户单位"
                  optionFilterProp="children"
                  @change="consigneeHandleSelectChange"
                  v-decorator="['consigneeId', validatorRules.consignee]"
                >
                  <a-select-option
                    v-for="(role, roleindex) in consigneeList"
                    :key="roleindex.toString()"
                    :value="role.id"
                    >{{ role.contactsName }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="收货人：" has-feedback>
                <a-input disabled v-decorator="['consigneeLinkName', validatorRules.consigneeLinkName]"></a-input>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="联系电话：" has-feedback>
                <a-input disabled v-decorator="['consigneeLinkPhone', validatorRules.consigneeLinkPhone]"></a-input>
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item label="目的地：" :labelCol="labelCol2" :wrapperCol="wrapperCol2">
                <a-input disabled v-decorator="['consigneeAddr', validatorRules.consigneeAddr]"></a-input>
                <!-- <v-distpicker
                  v-decorator="[ 'consigneeAddr', validatorRules.consigneeAddr]"
                  @selected="onSelected2"
                  :province="select2.province"
                  :city="select2.city"
                  :area="select2.area"
                  disabled
                ></v-distpicker> -->
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="详细地址：" has-feedback :labelCol="labelCol2" :wrapperCol="wrapperCol2">
                <a-input v-decorator="['consigneeDeailAddr', validatorRules.consigneeDeailAddr]" disabled></a-input>
              </a-form-item>
            </a-col>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="24" style="margin-bottom:10px">
      <a-card title="货物信息">
        <!-- table区域 -->
        <!-- table区域-begin -->
        <div  slot="extra">
          <span  >
          <a-button type="primary" @click="addGoodsInfo" size="small"  style="margin-right:10px;font-size: 12px">添加</a-button>
          <a-button type="danger" @click="batchDel" size="small" style="font-size: 12px;color:red"  >删除</a-button>
          </span>
        </div>

        <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
          <i class="anticon anticon-info-circle ant-alert-icon"></i>
          总数量
          <a
            style="font-weight: 600;color:rgba(217, 0, 27, 0.647058823529412)"
          >{{ num }}</a>件&nbsp;&nbsp;
          总重量
          <a
            style="font-weight: 600;color:rgba(217, 0, 27, 0.647058823529412)"
          >{{ weigth }}</a>吨&nbsp;&nbsp;
          总体积
          <a
            style="font-weight: 600;color:rgba(217, 0, 27, 0.647058823529412)"
          >{{ volume }}</a>
          m³&nbsp;&nbsp;
        </div>-->
        <a-table
          ref="table"
          bordered
          size="middle"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false"
          has-feedback
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          id="table"
          rowKey="rowKey"
        >
          <!-- //TODO 序号-->
          <span slot="id" slot-scope="text, record, index">{{ index + 1 }}</span>

          <!-- //TODO 货物名称-->
          <span slot="descriptionOfGoods" slot-scope="text, record, index">
            <a-auto-complete
              allowClear
              backfill
              placeholder="请输入名称"
              @change="goodsSelectChange"
              v-model="dataSource[index].descriptionOfGoods"
            >
              <template slot="dataSource">
                <a-select-option
                  v-for="(role, roleindex) in goodsList"
                  :key="roleindex.toString()"
                  :value="role.descriptionOfGoods + ',' + index"
                  >{{ role.descriptionOfGoods }}</a-select-option
                >
              </template>
            </a-auto-complete>
          </span>
          <!-- //TODO 货物类型-->
          <div slot="cargoTypeClassificationCode" slot-scope="text, record, index">
            <j-dict-select-tag
              dictCode="cargoClassificationCode"
              v-model="dataSource[index].cargoTypeClassificationCode"
              placeholder="请选择货物类型"
            ></j-dict-select-tag>
          </div>

          <!-- //TODO 包装-->
          <div slot="cargoPackCode" slot-scope="text, record, index">
            <j-dict-select-tag
              dictCode="cargoPackCode"
              v-model="dataSource[index].cargoPackCode"
              placeholder="请选择货物包装"
            ></j-dict-select-tag>
          </div>

          <!-- //TODO 数量-->
          <span slot="totalNumberOfPackages" slot-scope="text, record, index">
            <j-input v-model="dataSource[index].totalNumberOfPackages" placeholder="请输入货物数量" type></j-input>
          </span>

          <!-- //TODO 重量-->
          <span slot="goodsItemGrossWeight" slot-scope="text, record, index">
            <j-input v-model="dataSource[index].goodsItemGrossWeight" placeholder="请输入货物重量" type></j-input>
          </span>

          <!-- //TODO 体积-->
          <span slot="cube" slot-scope="text, record, index">
            <j-input v-model="dataSource[index].cube" placeholder="请输入货物体积" type></j-input>
          </span>
        </a-table>
      </a-card>
    </a-row>
    <a-row :gutter="24" style="margin-bottom:10px">
      <a-card title="结算信息">
        <a-form :form="form" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="label">
            <a-form-item label="实际运费：" has-feedback>
              <a-input v-decorator="['freight', validatorRules.freight]"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="付款方式：" has-feedback>
              <j-dict-select-tag
                :triggerChange="true"
                dictCode="paymentMeansCode"
                v-decorator="['paymentMeansCode', validatorRules.paymentMeansCode]"
                placeholder="请选择发送方式"
              ></j-dict-select-tag>
            </a-form-item>
          </a-col>

          <a-col :span="label">
            <a-form-item label="结算方式：" has-feedback>
              <j-dict-select-tag
                :triggerChange="true"
                dictCode="settlementWays"
                v-decorator="['settlementWays', validatorRules.settlementWays]"
                placeholder="请选择发送方式"
              ></j-dict-select-tag>
            </a-form-item>
          </a-col>

          <a-col :span="label">
            <a-form-item label="结算天数：" has-feedback>
              <a-input
                type="number"
                :min="1"
                :max="1000"
                suffix="天"
                v-decorator="['settlementDays', validatorRules.settlementDays]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="回单：" style="border-right: 0px " has-feedback>
              <j-dict-select-tag
                :triggerChange="true"
                dictCode="receiptType_dictionary"
                style="width:200px"
                v-decorator="['receiptType', { initialValue: 1 }, validatorRules.receiptType]"
              ></j-dict-select-tag>
            </a-form-item>
          </a-col>

          <a-col :span="label">
            <a-form-item has-feedback  style="border-left: 0px "   label="共">
              <a-input
                type="number"
                :min="1"
                :max="1000"
                suffix="份"
                v-decorator="['receiptNo', validatorRules.receiptNo]"
              />
            </a-form-item>
          </a-col>

          <a-col :span="label">
            <a-form-item label="结算类型：" has-feedback>
              <j-dict-select-tag
                :triggerChange="true"
                dictCode="settlementType"
                v-decorator="['settlementType', validatorRules.settlementType]"
                placeholder="请选择发送方式"
              ></j-dict-select-tag>
            </a-form-item>
          </a-col>
        </a-form>
      </a-card>
    </a-row>

    <!-- -------底部按钮区域--------------- -->

  </div>
</template>
<script>
import pick from 'lodash.pick'

import JInput from '@/components/jeecg/JInput.vue'
import VDistpicker from 'v-distpicker'
import JDate from '@/components/jeecg/JDate.vue'
import { OrderApi } from '@api/order'
import { getAction } from '@/api/manage'

export default {
  name: '',
  components: { JInput, VDistpicker, JDate },
  data() {
    return {
      loading: false,
      /* table选中keys*/
      selectedRowKeys: [],
      /* table选中records*/
      selectionRows: [],
      form: this.$form.createForm(this),
      tagType: 'radio',
      consignorList: [],
      consigneeList: [],
      goodsList: [],
      show: true,
      model: {},
      validatorRules: {
        customer: { rules: [{ required: true, message: '请输入!' }] },
        consignmentDateTime: { rules: [{ required: true, message: '请输入!' }] },
        businessTypeCode: { rules: [{ required: true, message: '请输入!' }] },
        transportMode: { rules: [{ required: true, message: '请输入!' }] },
        transportTypeCode: { rules: [{ required: true, message: '请输入!' }] },
        shippingMethod: { rules: [{ required: true, message: '请输入!' }] },
        shippingDateTime: { rules: [{ required: true, message: '请输入!' }] },
        consignorLinkName: { rules: [{ required: true, message: '请输入!' }] },
        consignorLinkPhone: { rules: [{ validator: this.validateMobile }] },
        consignor: { rules: [{ required: true, message: '请输入!' }] },
        consignorAddr: { rules: [{ required: true, message: '请输入完整地址!' }] },
        consignorDeailAddr: { rules: [{ required: true, message: '请输入!' }] },
        consigneeLinkName: { rules: [{ required: true, message: '请输入!' }] },
        consigneeLinkPhone: { rules: [{ validator: this.validateMobile }] },
        consignee: { rules: [{ required: true, message: '请输入!' }] },
        consigneeAddr: { rules: [{ required: true, message: '请输入完整地址!' }] },
        consigneeDeailAddr: { rules: [{ required: true, message: '请输入!' }] },
        freight: { rules: [{ required: true, message: '请输入!' }] },
        paymentMeansCode: { rules: [{ required: true, message: '请输入!' }] },
        settlementWays: { rules: [{ required: true, message: '请输入!' }] },
        settlementDays: { rules: [{ required: true, min: 1, max: 1000, message: '请输入1到一千的整数!' }] },
        receiptType: { rules: [{ required: true, message: '请输入!' }] },
        receiptNo: { rules: [{ required: true, min: 1, max: 1000, message: '请输入1到一千的整数!' }] },
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
      dataSource: [
        {
          rowkey: 1,
          cargoTypeClassificationCode: '',
          descriptionOfGoods: '',
          cargoPackCode: '',
          totalNumberOfPackages: '',
          goodsItemGrossWeight: '',
          cube: ''
        }
      ],
      tablelist: {},
      select: {},
      select2: {},
      roleList: []
    }
  },

  mounted() {
    if (sessionStorage.getItem('OrderDetails') == null) {
      this.clear()
    }
    let record = JSON.parse(sessionStorage.getItem('OrderDetails'))
    record.gswlOrderTransfer.customer = record.gswlOrderTransfer.customerName
    record = { ...record, ...record.gswlOrderTransfer }
    this.dataSource = record.gswlOrderGoodsList
    //  表格数据处理
    console.log('record', record)
    this.edit(record)
  },
  methods: {
    edit(record) {
      //  获取收货客户，发货客户下拉列表
      if (!record.gswlOrderTransfer.customerId) {
        getAction('/customer/gswlBaseCustomer/queryCustomerByName', { customerName: record.customerName }).then(res => {
          console.log('res.result', res.result)
          if (res.result.length === 1) {
            record.gswlOrderTransfer.customerId = res.result[0].id
          } else if (res.result.length === 0) {
            record.gswlOrderTransfer.customerId = 'null'
          } else {
            record.gswlOrderTransfer.customerId = res.result.filter(
              item => item.customerName === record.customerName
            )[0].id
          }
          this.beforInfo(record.gswlOrderTransfer.customerId + ',' + record.customerName)
        })
      } else {
        this.beforInfo(record.gswlOrderTransfer.customerId + ',' + record.customerName)
      }
      record.consignorId = record.consignorId ? record.consignorId : record.consignor
      record.consigneeId = record.consigneeId ? record.consigneeId : record.consignee

      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.initialRoleList()
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'shippingNoteNumber',
            'customer',
            'consignmentDateTime',
            'businessTypeCode',
            'transportMode',
            'transportTypeCode',
            'shippingMethod',
            'shippingDateTime',
            'consignorLinkName',
            'consignorLinkPhone',
            'consignor',
            'consignorId',
            'consignorAddr',
            'consignorDeailAddr',
            'consigneeLinkName',
            'consigneeLinkPhone',
            'consignee',
            'consigneeId',
            'consigneeAddr',
            'consigneeDeailAddr',
            'freight',
            'paymentMeansCode',
            'settlementWays',
            'settlementDays',
            'receiptType',
            'receiptNo',
            'settlementType'
          )
        )
      })
    },

    //  点击删除货物信息
    //  多删
    batchDel: function() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      } else {
        this.selectedRowKeys.sort()
        console.log('selectedRowKeys', this.selectedRowKeys)

        for (var a = this.selectedRowKeys.length - 1; a >= 0; a--) {
          this.dataSource.splice(this.selectedRowKeys[a], 1)
          console.log('a', a)
        }
      }
      this.$message.success('删除成功')
      this.onClearSelected()
    },

    //  点击清空按钮
    clear() {
      this.form.resetFields()
      this.$router.back(-1)
      //  TODO 不 会动态删除菜单先用刷新页面
    },
    submit() {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          const that = this
          const formData = Object.assign(that.model, values)
          //  验证货物信息是否完整
          var aa
          this.dataSource.forEach((item, index, arr) => {
            aa = Object.values(item).every(function(value) {
              return value !== ''
            })
          })
          if (!aa) {
            this.$message.error('请填写完整货物信息！')
            return
          }

          console.log('formData', formData)
          const obj = {
            id: formData.id,
            businessTypeCode: formData.businessTypeCode,
            consignee: formData.consignee,
            consigneeAddr: formData.consigneeAddr,
            consigneeAddrCode: formData.consigneeAddrCode,
            consigneeDeailAddr: formData.consigneeDeailAddr,
            consigneeId: formData.consigneeId,
            consigneeIdno: formData.consigneeIdno,
            consigneeLinkName: formData.consigneeLinkName,
            consigneeLinkPhone: formData.consigneeLinkPhone,
            consignmentDateTime: formData.consignmentDateTime,
            consignor: formData.consignor,
            consignorAddr: formData.consignorAddr,
            consignorAddrCode: formData.consignorAddrCode,
            consignorDeailAddr: formData.consignorDeailAddr,
            consignorIdno: formData.consignorIdno,
            consignorLinkName: formData.consignorLinkName,
            consignorLinkPhone: formData.consignorLinkPhone,
            gswlOrderGoodsList: this.dataSource,
            receiptNo: formData.receiptNo,
            receiptType: formData.receiptType,
            gswlOrderTransfer: {
              customerId: formData.customerId,
              customerName: formData.customerName,
              freight: parseFloat(formData.orderFreight).toFixed(2),
              paymentMeansCode: formData.paymentMeansCode,

              settlementDays: formData.settlementDays,
              settlementType: formData.settlementType,
              settlementWays: formData.settlementWays
            },
            remark: formData.remark,
            shippingDateTime: formData.shippingDateTime,
            shippingMethod: formData.shippingMethod,
            shippingNoteNumber: formData.shippingNoteNumber,
            transportMode: formData.transportMode,
            transportTypeCode: formData.transportTypeCode,
            orderNo: formData.orderNo,
            consignorId: formData.consignorId,
            orderFreight: parseFloat(formData.freight).toFixed(2),
            orderRate: formData.orderRate
          }
          console.log('obj', obj)

          OrderApi.editOrder(obj)
            .then(res => {
              console.log('res', res)

              if (res.success) {
                this.$message.success(res.message)
                this.clear()
              } else {
                this.$message.warning(res.message)
              }
            })
            .finally(() => {
              this.confirmLoading = false
            })
        } else {
          this.$message.error('请注意页面提示！')
        }
      })
    },
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
    },
    onClearSelected() {
      this.selectedRowKeys = []
      this.selectionRows = []
    },
    //  新增客户
    handleAdd(show) {
      var record = {}
      this.$refs.modalForm.add(record)
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.disableSubmit = false
    },
    // -------------------表单联动---------------------
    // onSelected(data) {
    //   console.log('发货地址', data)
    //   this.form.setFieldsValue({
    //     consignorAddr: data.province.value + '-' + data.city.value + '-' + data.area.value
    //   })

    //   this.model.consignorAddr = data.province.value + '-' + data.city.value + '-' + data.area.value
    //   console.log('consignorAddr', this.model.consignorAddr)
    // },
    // onSelected2(data) {
    //   console.log('目的地', data)
    //   this.form.setFieldsValue({
    //     consigneeAddr: data.province.value + '-' + data.city.value + '-' + data.area.value
    //   })
    //   this.model.consigneeAddr = data.province.value + '-' + data.city.value + '-' + data.area.value
    //   console.log('consigneeAddr', this.model.consigneeAddr)
    // },
    //  客户单位列表
    initialRoleList() {
      getAction('/customer/gswlBaseCustomer/queryCustomerByName', {}).then(res => {
        if (res.success) {
          this.roleList = res.result
          console.log('客户单位列表', this.roleList)
        } else {
          console.log(res.message)
        }
      })
      //  获取货物信息下拉
      getAction('/goods/goodsEntity/queryGoodsByName', {}).then(res => {
        if (res.success) {
          this.goodsList = res.result
          console.log('货物信息列表', this.goodsList)
        } else {
          console.log(res.message)
        }
      })
    },
    //  客户信息变化时
    customerInfo(data) {
      this.beforInfo(data)
      this.clearInfo()
    },
    // 页面刚刚加载时根据客户信息获取收发货联系人信息
    beforInfo(data) {
      const arr = data.split(',')
      //  arr[0] = id,arr[1] = customerName
      this.model.customerId = arr[0]
      this.model.customerName = arr[1]
      //  获取发货单位下拉列表
      getAction('/customerCon/customerContacts/queryContactsByCusId', { cusId: arr[0], cusConType: '1' }).then(res => {
        this.consignorList = res.result
      })
      //  获取收货单位下拉列表
      getAction('/customerCon/customerContacts/queryContactsByCusId', { cusId: arr[0], cusConType: '0' }).then(res => {
        this.consigneeList = res.result
      })
    },
    clearInfo() {
      //  清空收货人发货人信息
      this.form.setFieldsValue({
        consignor: '',
        consignorId: '',
        consignorLinkName: '',
        consignorLinkPhone: '',
        consignorAddr: '',
        consignorDeailAddr: '',
        consignee: '',
        consigneeId: '',
        consigneeLinkName: '',
        consigneeLinkPhone: '',
        consigneeAddr: '',
        consigneeDeailAddr: ''
      })
      this.select = {}
      this.select2 = {}
    },

    //  发货单位表单联动
    consignorHandleSelectChange(id) {
      const data = this.consignorList.filter(item => item.id === id)

      this.form.setFieldsValue({
        consignorLinkName: data[0].linkName,
        consignorLinkPhone: data[0].linkPhone,
        consignorAddr: data[0].countryAddr,

        consignorDeailAddr: data[0].detailAddr
      })

      this.model.consignor = data[0].contactsName
      this.model.consignorAddrCode = data[0].countryCode ? data[0].countryCode : '123'
      this.model.consignorIdno = data[0].consignorIdno ? data[0].consignorIdno : null
    },
    //  收货单位表单联动
    consigneeHandleSelectChange(id) {
      const data = this.consigneeList.filter(item => item.id === id)

      this.form.setFieldsValue({
        consigneeLinkName: data[0].linkName,
        consigneeLinkPhone: data[0].linkPhone,
        consigneeAddr: data[0].countryAddr,
        consigneeDeailAddr: data[0].detailAddr
      })
      this.model.consigneeAddrCode = data[0].countryCode ? data[0].countryCode : '123'
      this.model.consigneeIdno = data[0].consigneeIdno ? data[0].consigneeIdno : null
      this.model.consignee = data[0].contactsName
    },
    //  货物信息表单联动
    goodsSelectChange(val) {
      const arr = val.split(',')
      if (arr.length < 2) {
        return
      }
      //  arr[0]=id arr[1]= index
      // this.dataSource[arr[1]].descriptionOfGoods = arr[0]
      this.dataSource[arr[1]].descriptionOfGoods = arr[0]
      const data = this.goodsList.filter(item => item.descriptionOfGoods === arr[0])[0]

      this.dataSource[arr[1]].cargoTypeClassificationCode = data.cargoTypeClassificationCode
      this.dataSource[arr[1]].cargoPackCode = data.cargoPackCode
      this.dataSource[arr[1]].totalNumberOfPackages = data.totalNumberOfPackages
      this.dataSource[arr[1]].goodsItemGrossWeight = data.goodsItemGrossWeight
      this.dataSource[arr[1]].cube = data.cube
    },
    //  点击添加货物信息
    addGoodsInfo() {
      this.dataSource.push({
        rowkey: this.dataSource.length + 2,
        cargoTypeClassificationCode: '',
        descriptionOfGoods: '',
        cargoPackCode: '',
        totalNumberOfPackages: '',
        goodsItemGrossWeight: '',
        cube: ''
      })
    },
    validateMobile(rule, value, callback) {
      if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
        callback()
      } else {
        callback('您的手机号码格式不正确!')
      }
    }
  }
}
</script>
<style scoped lang="less">
@import url('../orderCommon.less');
.top-bar {text-align: right;background:#fff;padding:10px 30px 5px 0px;border: solid #dddee1;border-width:1px 1px 0 1px;}
/deep/ .ant-calendar-picker-input {
  padding-right: 42px !important;
  font-size: 12px !important;
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
