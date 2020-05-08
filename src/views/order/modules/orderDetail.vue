<!--
 * @Description:
 * @Date: 2020-03-06 14:45:00
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-04-30 11:03:34
 -->
<template>
  <div  style="padding:0 80px">
    <a-row :gutter="24" style="margin-bottom:10px">
      <div class="top-bar">
            <a-button @click="clear()">返回</a-button>
          </div>
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
                        style="width: 100%;"
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
                        style="width: 100%; min-width: 100px; "
                        date-format="YYYY-MM-DD HH:mm:ss"
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
        <a-table ref="table"
                 bordered
                 size="middle"
                 :columns="columns"
                 :dataSource="dataSource"
                 :pagination="false"
                 id="table"
                 rowKey="id">
          <!-- //TODO 序号-->
          <span slot="id"
                slot-scope="text, record,index">{{index+1}}</span>
          <!-- //TODO 货物名称-->
          <span slot="descriptionOfGoods"
                slot-scope="text, record,index">
            <a-select showSearch
                      allowClear
                      placeholder="请输入货物名称"
                      optionFilterProp="children"
                      disabled
                      v-model="dataSource[index].descriptionOfGoods">
              <a-select-option v-for="(role,roleindex) in goodsList"
                               :key="roleindex.toString()"
                               :value="role.descriptionOfGoods">{{ role.descriptionOfGoods }}</a-select-option>
            </a-select>
          </span>
          <!-- //TODO 货物类型-->
          <div slot="cargoTypeClassificationCode"
               slot-scope="text, record,index">
            <j-dict-select-tag dictCode="cargoClassificationCode"
                               v-model="dataSource[index].cargoTypeClassificationCode"
                               placeholder="请选择货物类型"
                               disabled></j-dict-select-tag>
          </div>

          <!-- //TODO 包装-->
          <div slot="cargoPackCode"
               slot-scope="text, record,index">
            <j-dict-select-tag dictCode="cargoPackCode"
                               v-model="dataSource[index].cargoPackCode"
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
                <a-select showSearch
                          allowClear
                          placeholder="请输入客户单位"
                          optionFilterProp="children"
                          v-decorator="[ 'consignor']"
                          disabled>
                  <a-select-option v-for="(role,roleindex) in consignorList"
                                   :key="roleindex.toString()"
                                   :value="role.id">{{ role.contactsName }}</a-select-option>
                </a-select>
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
                <a-select v-decorator="['consignee']"
                          allowClear
                          placeholder="请输入客户单位"
                          optionFilterProp="children"
                          disabled>
                  <a-select-option v-for="(role,roleindex) in consigneeList"
                                   :key="roleindex.toString()"
                                   :value="role.id">{{ role.contactsName }}</a-select-option>
                </a-select>
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
          <a-col :span="label">
            <a-form-item label="运费："
                         has-feedback>
              <a-input v-decorator="['freight']"
                       disabled></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="付款方式："
                         has-feedback>
              <j-dict-select-tag :triggerChange="true"
                                 dictCode="paymentMeansCode"
                                 disabled
                                 v-decorator="['paymentMeansCode']"
                                 placeholder="请选择发送方式"></j-dict-select-tag>
            </a-form-item>
          </a-col>

          <a-col :span="label">
            <a-form-item label="结算方式："
                         has-feedback>
              <j-dict-select-tag :triggerChange="true"
                                 dictCode="settlementWays"
                                 v-decorator="['settlementWays']"
                                 disabled
                                 placeholder="请选择发送方式"></j-dict-select-tag>
            </a-form-item>
          </a-col>

          <a-col :span="label">
            <a-form-item label="结算天数："
                         has-feedback>
              <a-input type="number"
                       :min="1"
                       :max="1000"
                       disabled
                       suffix="天"
                       v-decorator="['settlementDays']" />
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="回单："
                         style="border-right: 0px "
                         has-feedback>
              <j-dict-select-tag :triggerChange="true"
                                 dictCode="receiptType_dictionary"
                                 style="width:200px"
                                 disabled
                                 v-decorator="['receiptType']"></j-dict-select-tag>
            </a-form-item>
          </a-col>

          <a-col :span="label">
            <a-form-item has-feedback
                         style="border-left: 0px "
                         label="共">
              <a-input type="number"
                       :min="1"
                       disabled
                       :max="1000"
                       suffix="份"
                       v-decorator="['receiptNo']" />
            </a-form-item>
          </a-col>

          <a-col :span="label">
            <a-form-item label="结算类型："
                         has-feedback>
              <j-dict-select-tag :triggerChange="true"
                                 disabled
                                 dictCode="settlementType"
                                 v-decorator="['settlementType']"
                                 placeholder="请选择发送方式"></j-dict-select-tag>
            </a-form-item>
          </a-col>
        </a-form>
      </a-card>
    </a-row>
    <!-- <a-row :gutter="24">
      <a-card title="货主信息">
        <a-form :form="form"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol">
          <a-col :span="24">
            <a-form-item label="客户名称："
                         :labelCol="labelCol3"
                         :wrapperCol="wrapperCol3">
              <a-input v-decorator="[ 'customerName']"
                       disabled></a-input>
            </a-form-item>
          </a-col>
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

    <a-row :gutter="24"
           v-if="userType !== 'HZ'">
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

    <a-row :gutter="24"
           v-if="userType == 'CYS'">
      <a-card title="司机信息">
        <a-form :form="form"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol">
          <a-col :span="label">
            <a-form-item label="公司名称：">
              <a-input v-decorator="['carrierName']"
                       disabled></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="纳税资质：">
              <span v-if="model.enterpriseType == 0">小规模纳税人</span>
              <span v-if="model.enterpriseType == 1">一般纳税人</span>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="司机：">
              <a-input v-decorator="['driverName']"
                       disabled></a-input>
            </a-form-item>
          </a-col>

          <a-col :span="label">
            <a-form-item label="电话：">
              <a-input v-decorator="['telephone']"
                       disabled></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="车牌号：">
              <a-input v-decorator="['vehicleNo']"
                       disabled></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="身份证号：">
              <a-input v-decorator="['drivingLicense']"
                       disabled></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="收款人：">
              <a-input v-decorator="['accountName']"
                       disabled></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="开户行：">
              <a-input v-decorator="['openingBank']"
                       disabled></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="银行账号：">
              <a-input v-decorator="['openingBankAccount']"
                       disabled></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="身份证号：">
              <a-input v-decorator="['drivingLicense']"
                       disabled></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="运费：">
              <a-input v-decorator="['freight']"
                       disabled></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="差额率：">
              <a-input v-decorator="['MarginRatio']"
                       disabled></a-input>
            </a-form-item>
          </a-col>
        </a-form>
      </a-card>
    </a-row> -->
  </div>
</template>
<script>
import pick from 'lodash.pick'
import store from '@/store/'
import JInput from '@/components/jeecg/JInput.vue'
import VDistpicker from 'v-distpicker'
import JDate from '@/components/jeecg/JDate.vue'
import { getAction } from '@/api/manage'
export default {
  name: 'orderdetail',
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
      dataSource: [],
      tablelist: {},
      select: {},
      select2: {},
      roleList: [],
      capacity: 0,
      userType: '',
      goodsList: []
    }
  },

  mounted() {
    this.userType = store.getters.userType

    if (sessionStorage.getItem('OrderDetails') == null) {
      this.clear()
    }
    let record = JSON.parse(sessionStorage.getItem('OrderDetails'))

    record.gswlOrderTransfer.customer = record.gswlOrderTransfer.customerName
    record = { ...record, ...record.gswlOrderTransfer }

    this.dataSource = record.gswlOrderGoodsList

    //   表格数据
    this.dataSource.forEach(element => {
      // 总数量
      this.num += parseFloat(element.totalNumberOfPackages)
      // 总重量
      this.weigth += parseFloat(element.goodsItemGrossWeight)

      // 总体积
      this.capacity += parseFloat(element.cube)
    })

    this.edit(record)
  },

  methods: {
    edit(record) {
      this.form = this.$form.createForm(this)
      this.initialRoleList(record)

      this.model = Object.assign({}, record)
      //  利润率
      this.model.rate = this.model.rate ? this.model.rate * 100 + '%' : ''
      this.model.MarginRatio = this.model.MarginRatio ? parseFloat(this.model.MarginRatio).toFixed(2) + '%' : ''
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
            'settlementWays',
            'settlementDays',
            'receiptType',
            'receiptNo',
            'customerName',
            'carrierName',
            'carrierFreight',
            'rate',
            'driverName',
            'drivingLicense',
            'accountName',
            'openingBank',
            'openingBankAccount',
            'telephone',
            'vehicleNo',
            'MarginRatio'
          )
        )
      })
    },
    close() {
      this.visible = false
    },

    //  客户单位列表
    initialRoleList(data) {
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

      //  获取发货单位下拉列表
      getAction('/customerCon/customerContacts/queryContactsByCusId', { cusId: data.customerId, cusConType: '1' }).then(
        res => {
          this.consignorList = res.result
          console.log('发货单位下拉列表', this.consignorList)
        }
      )
      //  获取收货单位下拉列表
      getAction('/customerCon/customerContacts/queryContactsByCusId', { cusId: data.customerId, cusConType: '0' }).then(
        res => {
          this.consigneeList = res.result
          console.log('收货单位下拉列表', this.consigneeList)
        }
      )
    },
    //  点击返回按钮
    clear() {
      this.form.resetFields()
      // sessionStorage.removeItem('OrderDetails')
      this.$router.back(-1)
      //  TODO 不 会动态删除菜单先用刷新页面
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
@import url('../orderCommon.less');
.top-bar {
  text-align: right;
  background: #fff;
  padding: 10px 30px 5px 0px;
  border: solid #dddee1;
  border-width: 1px 1px 0 1px;
}
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
/deep/ .ant-input-disabled {
  color: black;
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
/deep/ .ant-alert {
  text-align: right;
}
</style>
