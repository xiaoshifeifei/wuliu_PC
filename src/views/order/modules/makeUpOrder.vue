<!--
 * @Description:
 * @Date: 2020-03-18 09:37:24
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-05-08 10:02:27
 -->
<template>
  <div style="padding:0 80px">
    <a-row :gutter="24"
           style="margin-bottom:10px">
      <div class="top-bar">
        <a-button type="primary"
                  :loading="loading"
                  @click="submit"
                  v-if="path !== 'audit-detailsOrder'">确定</a-button>
        <span style="margin-left: 15px;display:inline-block"></span>
        <a-button @click="clear"
                  v-if="path !== 'audit-detailsOrder'">清空</a-button>
        <span style="margin-left: 15px;display:inline-block"></span>

        <a-button @click="back()">返回</a-button>
      </div>

      <a-card title="基础信息">
        <div class="box-container">
          <a-form :form="form"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol">
            <a-col :span="label" v-if="path === 'audit-detailsOrder'">
              <a-form-item label="订单号：">
                <a-button @click="createOrderNo"
                          v-if="show">点击生成订单号</a-button>
                <a-input v-else
                         v-model="model.orderNo"
                         disabled />
              </a-form-item>
            </a-col>
            <a-col :span="label">
              <a-form-item label="委托单号："
                           :disabled="getPageStatus()"
                           has-feedback>
                <a-input v-decorator="['shippingNoteNumber']"
                         :disabled="getPageStatus()"
                         placeholder="请输入"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="label">
              <a-form-item label="客户单位："
                           has-feedback>
                <a-select showSearch
                          allowClear
                          :disabled="getPageStatus()"
                          placeholder="请输入客户单位"
                          optionFilterProp="children"
                          @change="customerInfo"
                          v-decorator="['customer', validatorRules.customer]">
                  <a-select-option v-for="(role, roleindex) in roleList"
                                   :key="roleindex.toString()"
                                   :value="role.customerId ? role.customerId : role.id + ',' + role.customerName">{{ role.customerName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="label">
              <a-form-item label="托运时间："
                           has-feedback>
                <j-date placeholder="请选择时间"
                        :disabled="getPageStatus()"
                        :trigger-change="true"
                        v-decorator="['consignmentDateTime', validatorRules.consignmentDateTime]"
                        date-format="YYYY-MM-DD HH:mm:ss"
                        style="width: 100%;"
                        :showTime="true"></j-date>
              </a-form-item>
            </a-col>
            <a-col :span="label">
              <a-form-item label="业务类型："
                           has-feedback>
                <j-dict-select-tag :disabled="getPageStatus()"
                                   v-decorator="['businessTypeCode', validatorRules.businessTypeCode]"
                                   :triggerChange="true"
                                   placeholder="请选择"
                                   dictCode="businessTypeCode"></j-dict-select-tag>
              </a-form-item>
            </a-col>

            <a-col :span="label">
              <a-form-item label="运输模式："
                           has-feedback>
                <a-radio-group :disabled="getPageStatus()"
                               v-decorator="['transportMode', validatorRules.transportMode]">
                  <a-radio value="0">整车</a-radio>
                  <a-radio value="1">零担</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="label">
              <a-form-item label="运输类型："
                           has-feedback>
                <j-dict-select-tag :disabled="getPageStatus()"
                                   :triggerChange="true"
                                   dictCode="transportTypeCode"
                                   v-decorator="['transportTypeCode', validatorRules.transportTypeCode]"></j-dict-select-tag>
              </a-form-item>
            </a-col>
            <a-col :span="label">
              <a-form-item label="配送方式："
                           has-feedback>
                <a-radio-group :disabled="getPageStatus()"
                               v-decorator="['shippingMethod', validatorRules.shippingMethod]">
                  <a-radio value="0">送货</a-radio>
                  <a-radio value="1">自提</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>

            <a-col :span="label">
              <a-form-item label="配送时间："
                           has-feedback>
                <j-date placeholder="请选择时间"
                        :disabled="getPageStatus()"
                        :trigger-change="true"
                        style="width: 100%;"
                        v-decorator="['shippingDateTime', validatorRules.shippingDateTime]"
                        date-format="YYYY-MM-DD HH:mm:ss"
                        :showTime="true"></j-date>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="备注："
                           :labelCol="labelCol2"
                           :wrapperCol="wrapperCol2"
                           has-feedback>
                <a-input :disabled="getPageStatus()"
                         v-decorator="['remark', {}]"></a-input>
              </a-form-item>
            </a-col>
          </a-form>
        </div>
      </a-card>
    </a-row>

    <a-row :gutter="24"
           style="margin-bottom:10px">
      <a-col :span="12">
        <a-card title="发货信息">
          <a-form :form="form"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol">
            <a-col :span="24">
              <a-form-item label="发货单位："
                           has-feedback
                           :labelCol="labelCol2"
                           :wrapperCol="wrapperCol2">
                <a-select showSearch
                          allowClear
                          :disabled="getPageStatus()"
                          placeholder="请输入客户单位"
                          optionFilterProp="children"
                          @change="consignorHandleSelectChange"
                          v-decorator="['consignorId', validatorRules.consignor]">
                  <a-select-option v-for="role in consignorList"
                                   :key="role.id"
                                   :value="role.id">{{
                    role.contactsName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="发货人："
                           has-feedback>
                <a-input v-decorator="['consignorLinkName', validatorRules.consignorLinkName]"
                         disabled></a-input>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="联系电话："
                           has-feedback>
                <a-input disabled
                         v-decorator="['consignorLinkPhone', validatorRules.consignorLinkPhone]"></a-input>
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item label="发货地址："
                           :labelCol="labelCol2"
                           :wrapperCol="wrapperCol2">
                <a-input disabled
                         v-decorator="['consignorAddr', validatorRules.consignorAddr]"></a-input>
                <!-- <v-distpicker @selected="onSelected"
                              v-decorator="[ 'consignorAddr', validatorRules.consignorAddr]"
                              :province="select.province"
                              :city="select.city"
                              :area="select.area"
                              disabled></v-distpicker> -->
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="详细地址："
                           has-feedback
                           :labelCol="labelCol2"
                           :wrapperCol="wrapperCol2">
                <a-input disabled
                         v-decorator="['consignorDeailAddr', validatorRules.consignorDeailAddr]"></a-input>
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
                           has-feedback
                           :labelCol="labelCol2"
                           :wrapperCol="wrapperCol2">
                <a-select showSearch
                          :disabled="getPageStatus()"
                          allowClear
                          placeholder="请输入客户单位"
                          optionFilterProp="children"
                          @change="consigneeHandleSelectChange"
                          v-decorator="['consigneeId', validatorRules.consignee]">
                  <a-select-option v-for="(role, roleindex) in consigneeList"
                                   :key="roleindex.toString()"
                                   :value="role.id">{{ role.contactsName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="收货人："
                           has-feedback>
                <a-input disabled
                         v-decorator="['consigneeLinkName', validatorRules.consigneeLinkName]"></a-input>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="联系电话："
                           has-feedback>
                <a-input disabled
                         v-decorator="['consigneeLinkPhone', validatorRules.consigneeLinkPhone]"></a-input>
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item label="目的地："
                           :labelCol="labelCol2"
                           :wrapperCol="wrapperCol2">
                <a-input v-decorator="['consigneeAddr', validatorRules.consigneeAddr]"
                         disabled></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="详细地址："
                           has-feedback
                           :labelCol="labelCol2"
                           :wrapperCol="wrapperCol2">
                <a-input v-decorator="['consigneeDeailAddr', validatorRules.consigneeDeailAddr]"
                         disabled></a-input>
              </a-form-item>
            </a-col>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="24"
           style="margin-bottom:10px">
      <a-card title="货物信息">
        <!-- table区域 -->
        <!-- table区域-begin -->
        <div slot="extra"
             v-if="this.path !== 'audit-detailsOrder'">
          <span>
            <a-button type="primary"
                      @click="addGoodsInfo"
                      size="small"
                      style="margin-right:10px;font-size: 12px">添加</a-button>
            <a-button type="danger"
                      @click="batchDel"
                      size="small"
                      style="font-size: 12px;color:red">删除</a-button>
          </span>
        </div>
        <a-table ref="table"
                 bordered
                 size="middle"
                 :columns="columns"
                 :dataSource="dataSource"
                 :pagination="false"
                 has-feedback
                 :rowSelection="{ selectedRowKeys: this.selectedRowKeys, onChange: this.onSelectChange }"
                 id="table"
                 rowKey="rowKey">
          <!-- //TODO 序号-->
          <span slot="id"
                slot-scope="text, record, index">{{ index + 1 }}</span>
          <!-- //TODO 货物名称-->
          <span slot="descriptionOfGoods"
                slot-scope="text, record, index">
            <a-auto-complete allowClear
                             backfill
                             :disabled="getPageStatus()"
                             placeholder="请输入名称"
                             @change="goodsSelectChange"
                             v-model="dataSource[index].descriptionOfGoods">
              <template slot="dataSource">
                <a-select-option v-for="(role, roleindex) in goodsList"
                                 :disabled="getPageStatus()"
                                 :key="roleindex.toString()"
                                 :value="role.descriptionOfGoods + ',' + index">{{ role.descriptionOfGoods }}</a-select-option>
              </template>
            </a-auto-complete>
          </span>
          <!-- //TODO 货物类型-->
          <div slot="cargoTypeClassificationCode"
               slot-scope="text, record, index">
            <j-dict-select-tag :disabled="getPageStatus()"
                               dictCode="cargoClassificationCode"
                               v-model="dataSource[index].cargoTypeClassificationCode"
                               placeholder="请选择类型"></j-dict-select-tag>
          </div>

          <!-- //TODO 包装-->
          <div slot="cargoPackCode"
               slot-scope="text, record, index">
            <j-dict-select-tag dictCode="cargoPackCode"
                               :disabled="getPageStatus()"
                               v-model="dataSource[index].cargoPackCode"
                               placeholder="请选择包装"></j-dict-select-tag>
          </div>

          <!-- //TODO 数量-->
          <span slot="totalNumberOfPackages"
                slot-scope="text, record, index">
            <j-input :disabled="getPageStatus()"
                     v-model="dataSource[index].totalNumberOfPackages"
                     placeholder="请输入数量"
                     type></j-input>
          </span>

          <!-- //TODO 重量-->
          <span slot="goodsItemGrossWeight"
                slot-scope="text, record, index">
            <j-input :disabled="getPageStatus()"
                     v-model="dataSource[index].goodsItemGrossWeight"
                     placeholder="请输入重量"
                     type></j-input>
          </span>

          <!-- //TODO 体积-->
          <span slot="cube"
                slot-scope="text, record, index">
            <j-input v-model="dataSource[index].cube"
                     placeholder="请输入 体积"
                     type></j-input>
          </span>
        </a-table>
      </a-card>
    </a-row>
    <a-row :gutter="24"
           style="margin-bottom:10px">
      <a-card title="配载信息">
        <a-form :form="form"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol">
          <a-col :span="12">
            <a-form-item label="公司名称："
                         :labelCol="labelCol2"
                         :wrapperCol="wrapperCol2"
                         has-feedback>
              <a-select showSearch
                        allowClear
                        :disabled="getPageStatus()"
                        placeholder="请输入公司名称"
                        optionFilterProp="children"
                        @change="companyInfo"
                        v-decorator="['carrierName', validatorRules.carrierName]">
                <a-select-option v-for="role in companyList"
                                 :key="role.id"
                                 :value="role.carrierName">{{
                  role.carrierName
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="纳税资质"
                         :labelCol="labelCol2"
                         :wrapperCol="wrapperCol2"
                         has-feedback>
              <a-radio-group :disabled="getPageStatus()"
                             v-decorator="['enterpriseType', validatorRules.enterpriseType]">
                <a-radio value="0">小规模纳税人</a-radio>
                <a-radio value="1">一般纳税人</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="车牌号："
                         has-feedback>
              <a-auto-complete allowClear
                               backfill
                               :disabled="getPageStatus()"
                               placeholder="请输入"
                               v-decorator="['vehicleNo', validatorRules.vehicleNo]">
                <template slot="dataSource">
                  <a-select-option :disabled="getPageStatus()"
                                   v-for="(role, roleindex) in vehicleInfo"
                                   :key="roleindex.toString()"
                                   :value="role.vehicleNumber">{{ role.vehicleNumber }}</a-select-option>
                </template>
              </a-auto-complete>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="车辆颜色："
                         has-feedback>
              <j-dict-select-tag :triggerChange="true"
                                 dictCode="vehicleColor"
                                 :disabled="getPageStatus()"
                                 v-decorator="['vehiclePlateColorCode', validatorRules.vehiclePlateColorCode]"
                                 placeholder="请选择"></j-dict-select-tag>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="司机："
                         has-feedback>
              <a-auto-complete allowClear
                               backfill
                               :disabled="getPageStatus()"
                               placeholder="请输入"
                               v-decorator="['driverName', validatorRules.driverName]">
                <template slot="dataSource">
                  <a-select-option v-for="(role, roleindex) in driverInfo"
                                   :key="roleindex.toString()"
                                   :disabled="getPageStatus()"
                                   :value="role.driverName">{{ role.driverName }}</a-select-option>
                </template>
              </a-auto-complete>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="联系方式"
                         has-feedback>
              <a-input :disabled="getPageStatus()"
                       v-decorator="['driverPhone', validatorRules.driverPhone]"
                       placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="身份证号："
                         has-feedback>
              <a-input :disabled="getPageStatus()"
                       v-decorator="['drivingLicense', validatorRules.drivingLicense]"
                       placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="收款人："
                         has-feedback>
              <a-input :disabled="getPageStatus()"
                       v-decorator="['accountName', validatorRules.accountName]"
                       placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="开户行："
                         has-feedback>
              <a-input :disabled="getPageStatus()"
                       v-decorator="['openingBank', validatorRules.openingBank]"
                       placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="银行账号："
                         has-feedback>
              <a-input :disabled="getPageStatus()"
                       v-decorator="['openingBankAccount', validatorRules.openingBankAccount]"
                       placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="收款人身份证："
                         has-feedback>
              <a-input :disabled="getPageStatus()"
                       v-decorator="['payeeIdCard', validatorRules.drivingLicense]"
                       placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item>
              <div class="prompt">
                温馨提示：本月一号至当日营业额
                <span>{{ vehicleMoney }}</span>元，运输次数 <span>{{ vehicleNum }}</span>次
              </div>
            </a-form-item>
          </a-col>
        </a-form>
      </a-card>
    </a-row>
    <a-row :gutter="24"
           style="margin-bottom:10px">
      <a-card title="结算信息">
        <a-form :form="form"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol">
          <a-col :span="label2">
            <a-form-item label="运费："
                         has-feedback
                         selfUpdate>
              <a-input type="number"
                       :min="1"
                       :disabled="getPageStatus()"
                       @change="freightChange"
                       v-decorator="['freight', validatorRules.freight]"
                       placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>

          <a-col :span="label2">
            <a-form-item label="司机运费："
                         has-feedback
                         selfUpdate>
              <a-input type="number"
                       :min="1"
                       :disabled="getPageStatus()"
                       @change="driverFreightChange"
                       v-decorator="['driverFreight', validatorRules.driverFreight]"
                       placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>

          <a-col :span="label2">
            <a-form-item label="承运商运费："
                         has-feedback
                         selfUpdate>
              <a-input type="number"
                       :min="1"
                       :disabled="getPageStatus()"
                       v-decorator="['carrierFreight', validatorRules.carrierFreight]"
                       placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>

          <a-col :span="label2">
            <a-form-item label="承运商："
                         has-feedback>
              <a-input disabled
                       v-decorator="['carrierName', validatorRules.carrierName]"
                       placeholder="请输入承运商"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="label2">
            <a-form-item label="利润率(%)："
                         has-feedback>
              <a-input-number :disabled="getPageStatus()"
                              :min="0"
                              :step="0.01"
                              style="width:100%"
                              :precision="2"
                              v-decorator="['carrierRate', validatorRules.floatNum]"
                              placeholder="请输入利润率" />
            </a-form-item>
          </a-col>
          <a-col :span="label2">
            <a-form-item label="差额率(%)："
                         has-feedback>
              <a-input-number :disabled="getPageStatus()"
                              :min="0"
                              style="width:100%"
                              :step="0.01"
                              :precision="2"
                              v-decorator="['differenceRate', validatorRules.floatNum]"
                              placeholder="请输入差额率" />
            </a-form-item>
          </a-col>

          <a-col :span="label2">
            <a-form-item label="付款方式："
                         has-feedback>
              <j-dict-select-tag :triggerChange="true"
                                 dictCode="paymentMeansCode"
                                 :disabled="getPageStatus()"
                                 v-decorator="['paymentMeansCode', validatorRules.paymentMeansCode]"
                                 placeholder="请选择"></j-dict-select-tag>
            </a-form-item>
          </a-col>

          <a-col :span="label2">
            <a-form-item label="结算方式："
                         has-feedback>
              <j-dict-select-tag :triggerChange="true"
                                 dictCode="settlementWays"
                                 :disabled="getPageStatus()"
                                 v-decorator="['settlementWays', validatorRules.settlementWays]"
                                 @change="settlementWaysChange"
                                 placeholder="请选择"></j-dict-select-tag>
            </a-form-item>
          </a-col>

          <a-col :span="label2"
                 v-if="settDayShow">
            <a-form-item label="结算天数："
                         has-feedback>
              <a-input type="number"
                       :min="1"
                       :max="30"
                       suffix="天"
                       :disabled="getPageStatus()"
                       placeholder="请输入"
                       v-decorator="['settlementDays', validatorRules.settlementDays]" />
            </a-form-item>
          </a-col>
          <a-col :span="label2">
            <a-form-item label="结算类型："
                         has-feedback>
              <j-dict-select-tag :triggerChange="true"
                                 dictCode="settlementType"
                                 :disabled="getPageStatus()"
                                 v-decorator="['settlementType', validatorRules.settlementType]"
                                 placeholder="请选择"></j-dict-select-tag>
            </a-form-item>
          </a-col>
          <a-col :span="label2">
            <a-form-item label="回单："
                         style="border-right: 0px "
                         has-feedback>
              <j-dict-select-tag :triggerChange="true"
                                 :disabled="getPageStatus()"
                                 dictCode="receiptType_dictionary"
                                 v-decorator="['receiptType', validatorRules.receiptType]"
                                 placeholder="请选择"></j-dict-select-tag>
            </a-form-item>
          </a-col>

          <a-col :span="label2">
            <a-form-item has-feedback
                         style="border-left: 0px "
                         label="共">
              <a-input type="number"
                       :min="1"
                       :max="1000"
                       suffix="份"
                       :disabled="getPageStatus()"
                       placeholder="请输入"
                       v-decorator="['receiptNo', validatorRules.receiptNo]" />
            </a-form-item>
          </a-col>
        </a-form>
      </a-card>
    </a-row>

    <!-- -------底部按钮区域--------------- -->

    <a-row :gutter="24"
           style="padding: 10px;text-align:center"
           v-if="path !== 'audit-detailsOrder'">
      <a-col>
        <div></div>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import pick from 'lodash.pick'

import JInput from '@/components/jeecg/JInput.vue'
import VDistpicker from 'v-distpicker'
import JDate from '@/components/jeecg/JDate.vue'
import { getAction } from '@/api/manage'
import store from '@/store/'
import constData from '../const'
import { isPhoneOrMobileByForm, isVehicleNumberByForm, isSFZByForm } from '@/utils/validate'
import { postAction, putAction } from '@/api/manage'
export default {
  name: '',
  components: { JInput, VDistpicker, JDate },
  data() {
    return {
      ...constData.makeUpOrderData,
      validatorRules: {
        customer: { rules: [{ required: true, message: '请输入!' }], initialValue: this.initialValueCustomer },
        consignmentDateTime: { rules: [{ required: true, message: '请输入!' }] },
        businessTypeCode: { rules: [{ required: true, message: '请输入!' }], initialValue: '1002996' },
        transportMode: { rules: [{ required: true, message: '请输入!' }], initialValue: '0' },
        transportTypeCode: { rules: [{ required: true, message: '请输入!' }], initialValue: '1' },
        shippingMethod: { rules: [{ required: true, message: '请输入!' }], initialValue: '0' },
        shippingDateTime: { rules: [{ required: true, message: '请输入!' }] },
        consignorLinkName: { rules: [{ required: true, message: '请输入!' }] },
        consignorLinkPhone: { rules: [{ validator: isPhoneOrMobileByForm }] },
        consignor: { rules: [{ required: true, message: '请输入!' }] },
        consignorAddr: { rules: [{ required: true, message: '请输入完整地址!' }] },
        consignorDeailAddr: { rules: [{ required: true, message: '请输入!' }] },
        consigneeLinkName: { rules: [{ required: true, message: '请输入!' }] },
        consigneeLinkPhone: { rules: [{ validator: isPhoneOrMobileByForm }] },
        consignee: { rules: [{ required: true, message: '请输入!' }] },
        consigneeAddr: { rules: [{ required: true, message: '请输入完整地址!' }] },
        consigneeDeailAddr: { rules: [{ required: true, message: '请输入!' }] },
        freight: { rules: [{ required: true, message: '请输入具体金额!' }] },
        paymentMeansCode: { rules: [{ required: true, message: '请输入!' }] },
        settlementWays: { rules: [{ required: true, message: '请输入!' }] },
        settlementDays: { rules: [{ required: true, min: 1, max: 1000, message: '请输入1到一千的整数!' }] },
        receiptType: { rules: [{ required: true, message: '请输入!' }] },
        receiptNo: { rules: [{ required: true, min: 1, max: 1000, message: '请输入1到一千的整数!' }] },
        settlementType: { rules: [{ required: true, message: '请输入!' }], initialValue: '0' },
        carrierName: { rules: [{ required: true, message: '请选择!' }] },
        enterpriseType: { rules: [{ required: true, message: '请选择!' }], initialValue: '0' },
        floatNum: { rules: [{ required: true, message: '请输入浮点数!' }] },
        vehiclePlateColorCode: { rules: [{ required: true, message: '请输入!' }], initialValue: '2' },
        driverName: { rules: [{ required: true, message: '请输入!' }] },
        driverPhone: { rules: [{ validator: isPhoneOrMobileByForm, required: true }] },
        drivingLicense: { rules: [{ validator: isSFZByForm, required: true }] },
        accountName: { rules: [{ required: true, message: '请输入!' }] },
        openingBank: { rules: [{ required: true, message: '请输入!' }] },
        openingBankAccount: { rules: [{ required: true, message: '请输入!' }] },
        vehicleNo: { rules: [{ validator: isVehicleNumberByForm, required: true }] },
        driverFreight: {
          rules: [
            {
              validator: (rule, value, callback) => {
                const money = this.model.freight ? this.model.freight : '0'
                if (value) {
                  if (parseFloat(money) >= parseFloat(value)) {
                    callback()
                  } else {
                    callback('司机运费不能高于运费收入')
                  }
                } else {
                  callback('请输入运费')
                }
              },
              required: true
            }
          ]
        },
        carrierFreight: {
          rules: [
            {
              validator: (rule, value, callback) => {
                const money = this.model.freight ? this.model.freight : '0'
                if (value) {
                  if (parseFloat(money) >= parseFloat(value)) {
                    callback()
                  } else {
                    callback('承运商运费不能高于运费收入')
                  }
                } else {
                  callback('请输入运费')
                }
              },
              required: true
            }
          ]
        }
      },
      form: this.$form.createForm(this),
      userType: store.getters.userType
    }
  },
  watch: {
    $route: {
      handler(newval, Val) {
        this.path = newval.name
        // console.log('path', newval)

        if (this.path === 'audit-detailsOrder') {
          this.showDetails = true
        } else {
          this.showDetails = false
        }
        this.add()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // //  点击生成订单号
    // createOrderNo() {
    //   OrderApi.createOrderNo().then(res => {
    //     if (res.success) {
    //       this.model.orderNo = res.result
    //       this.show = false
    //       this.$message.success(res.message)
    //     } else {
    //       this.$message.warning(res.message)
    //     }
    //   })
    // },

    getPageStatus() {
      // 获取当前页面是否可以编辑
      if (this.path === 'audit-detailsOrder') {
        return true
      }
      return false
    },

    add() {
      const data =
        this.path === 'order-createOrder-makeUpOrder' ? {} : JSON.parse(sessionStorage.getItem('OrderReviewDetails'))
      this.rowSelection = this.showDetails
        ? null
        : { selectedRowKeys: this.selectedRowKeys, onChange: this.onSelectChange }
      this.edit(data)
    },
    edit(record) {
      this.initialRoleList()

      //  获取收货客户，发货客户下拉列表
      if (Object.keys(record).length) {
        if (!record.customerId) {
          getAction('/customer/gswlBaseCustomer/queryCustomerByName', { customerName: record.customerName }).then(
            res => {
              if (res.result.length === 1) {
                record.customerId = res.result[0].id
              } else if (res.result.length === 0) {
                record.customerId = 'null'
              } else {
                record.customerId = res.result.filter(item => item.customerName === record.customerName)[0].id
              }

              this.beforInfo(record.customerId + ',' + record.customerName)
            }
          )
        } else {
          this.beforInfo(record.customerId + ',' + record.customerName)
        }
        record.consignorId = record.consignorId ? record.consignorId : record.consignor
        record.consigneeId = record.consigneeId ? record.consigneeId : record.consignee
        this.dataSource = record.gswlSupplementGoodsList ? record.gswlSupplementGoodsList : []
        record.carrierRate = (record.rate * 100).toFixed(4)
        record.differenceRate = (((record.freight - record.driverFreight) / record.freight) * 100).toFixed(4)
        record.customer = record.customerName
        this.show = false
        this.getDriverInfo(record.carrierId)
      }
      this.form.resetFields()
      this.model = Object.assign({}, record)
      //  收款人身份证号
      this.model.payeeIdCard = this.model.drivingLicense
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
            'settlementType',
            'driverFreight',
            'carrierFreight',
            'carrierName',
            'carrierRate',
            'differenceRate',
            'enterpriseType',
            'vehicleNo',
            'vehiclePlateColorCode',
            'driverName',
            'driverPhone',
            'drivingLicense',
            'accountName',
            'openingBank',
            'openingBankAccount',
            'payeeIdCard'
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

        for (var a = this.selectedRowKeys.length - 1; a >= 0; a--) {
          this.dataSource.splice(this.selectedRowKeys[a], 1)
        }
      }
      this.$message.success('删除成功')
      this.onClearSelected()
    },

    //  点击清空按钮
    clear() {
      this.form.resetFields()
      this.dataSource = [
        {
          rowkey: 1,
          cargoTypeClassificationCode: '',
          descriptionOfGoods: '',
          cargoPackCode: '',
          totalNumberOfPackages: '',
          goodsItemGrossWeight: '',
          cube: ''
        }
      ]
    },
    settlementWaysChange(val) {
      if (val === '2') {
        this.settDayShow = true
      } else {
        this.settDayShow = false
      }
    },
    // 点击提交按钮
    submit() {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          const formData = Object.assign(this.model, values)
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
          const obj = {
            accountName: formData.accountName,
            // 'batchNo': '',
            businessTypeCode: formData.businessTypeCode,
            // 'cargoTypes': '',
            carrierFreight: formData.carrierFreight,
            rate: formData.rate,
            consignmentDateTime: formData.consignmentDateTime,
            carrierId: this.model.carrierId,
            carrierName: formData.carrierName,
            consignee: formData.consignee,
            consigneeAddr: formData.consigneeAddr,
            consigneeAddrCode: formData.consigneeAddrCode,
            consigneeDeailAddr: formData.consigneeDeailAddr,
            consigneeId: formData.consigneeId,
            consigneeIdno: formData.consigneeIdno,
            consigneeLinkName: formData.consigneeLinkName,
            consigneeLinkPhone: formData.consigneeLinkPhone,
            consignor: formData.consignor,
            consignorAddr: formData.consignorAddr,
            consignorAddrCode: formData.consignorAddrCode,
            consignorDeailAddr: formData.consignorDeailAddr,
            consignorIdno: formData.consignorIdno,
            consignorLinkName: formData.consignorLinkName,
            consignorLinkPhone: formData.consignorLinkPhone,
            // 'createBy': '',
            // 'createTime': '',
            // 'cubes': '',
            customerId: formData.customerId,
            customerName: formData.customerName,
            delFlag: 0,
            // 'descriptionOfGoods': '',
            differenceRate: parseFloat(this.model.differenceRate) / 100,
            driverFreight: this.model.driverFreight,
            // 'driverId': '',
            driverName: formData.driverName,
            driverPhone: formData.driverPhone,
            drivingLicense: formData.drivingLicense,
            enterpriseType: formData.enterpriseType,
            // 'errorDesc': '',
            freight: formData.freight,
            // 'goodsNames': '',
            gswlSupplementGoodsList: this.dataSource,
            // 'id': '',
            // 'importFlag': 0,
            // 'importStatus': 0,
            // 'numbers': '',
            openingBank: formData.openingBank,
            openingBankAccount: formData.openingBankAccount,
            // 'orderId': '',
            orderNo: formData.orderNo,
            // 'packings': '',
            payeeIdCard: formData.drivingLicense,
            paymentMeansCode: formData.paymentMeansCode,
            receiptNo: formData.receiptNo,
            receiptType: formData.receiptType,
            remark: formData.remark,
            // 'returnReason': '',
            settlementDays: formData.settlementDays ? formData.settlementDays : 0,
            settlementType: formData.settlementType,
            settlementWays: formData.settlementWays,
            shippingDateTime: formData.shippingDateTime,
            shippingMethod: formData.shippingMethod,
            shippingNoteNumber: formData.shippingNoteNumber,
            transportMode: formData.transportMode,
            transportTypeCode: formData.transportTypeCode,
            // 'updateBy': '',
            // 'updateTime': '',
            // 'vehicleId': '',
            vehicleNo: formData.vehicleNo,
            vehiclePlateColorCode: formData.vehiclePlateColorCode
            // 'waybillId': '',
            // 'weights': ''
          }
          this.confirmLoading = true

          if (this.path === 'order-createOrder-makeUpOrder') {
            postAction('/order/gswlOrderSupplement/supplement', obj)
              .then(res => {
                if (res.success) {
                  this.$message.success(res.message)
                  this.$router.push({ name: 'audit-orderReview' })
                } else {
                  this.$message.warning(res.message)
                }
              })
              .finally(() => {
                this.confirmLoading = false
              })
          } else {
            this.model.carrierRate = parseFloat(this.model.carrierRate)
            this.model.differenceRate = parseFloat(this.model.differenceRate) / 100
            putAction('/order/gswlOrderSupplement/edit', this.model)
              .then(res => {
                if (res.success) {
                  this.$message.success(res.message)
                  this.$router.push({ name: 'audit-orderReview' })
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
      record.show = show
      record.type = 1
      this.$refs.modalForm.add(record)
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.disableSubmit = false
    },
    //  点击返回按钮
    back() {
      this.form.resetFields()
      // sessionStorage.removeItem('OrderDetails')
      this.$router.back(-1)
      //  TODO 不 会动态删除菜单先用刷新页面
    },
    // -------------------表单联动---------------------
    //  客户单位列表
    initialRoleList() {
      getAction('/customer/gswlBaseCustomer/queryCustomerByName', {}).then(res => {
        if (res.success) {
          this.roleList = res.result
          //  默认客户单位
          if (this.userType !== 'PT') {
            this.initialValueCustomer = this.roleList[0].id + ',' + this.roleList[0].customerName
            this.beforInfo(this.initialValueCustomer)
          }
        }
      })
      //  获取货物信息下拉
      getAction('/goods/goodsEntity/queryGoodsByName', {}).then(res => {
        if (res.success) {
          this.goodsList = res.result
        }
      })
      //  获取公司名称
      getAction('/carrier/gswlBaseCarrier/queryCarrierByName', { carrierName: '' }).then(res => {
        if (res.success) {
          this.companyList = res.result
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
      this.model.consigneeId = data[0].id
      this.model.consignee = data[0].contactsName
    },
    //  货物信息表单联动
    goodsSelectChange(val) {
      const arr = val.split(',')
      if (arr.length < 2) {
        return
      }
      //  arr[0]=id arr[1]= index
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
    //  公司名称变化时
    companyInfo(data) {
      const info = this.companyList.filter(item => item.carrierName === data)[0]
      if (!info) {
        this.form.setFieldsValue({
          enterpriseType: '',
          carrierName: '',
          carrierRate: ''
        })
        return
      }
      //  配载信息
      this.form.setFieldsValue({
        enterpriseType: info.enterpriseType,
        carrierRate: info.carrierRate * 100 + '%'
        //  TODO
        // vehicleNo: '闽A499C0',
        // driverName: '二狗子',
        // driverPhone: '13799970444',
        // drivingLicense: '350128199710140036',
        // accountName: '12345',
        // openingBank: '建设银行',
        // openingBankAccount: '231312312321'
      })
      this.vehicleMoney = info.vehicleMoney ? info.vehicleMoney : '0'
      this.vehicleNum = info.vehicleNum ? info.vehicleNum : '0'
      this.model.carrierId = info.id
      this.model.rate = info.carrierRate
      //  当运费收入已经填写情况下带出承运商运费
      if (this.model.freight) {
        const carrierFreight = parseFloat(this.model.freight * (1 - this.model.carrierRate)).toFixed(4)
        this.form.setFieldsValue({
          carrierFreight: carrierFreight
        })
      }
      this.getDriverInfo(info.id)
    },
    //  根据承运商id查询司机车辆信息下拉
    getDriverInfo(id) {
      if (!id) {
        this.driverInfo = []
        this.vehicleInfo = []
        return
      }

      //  获取车辆信息下拉列表
      getAction('/vehicle/gswlBaseVehicle/list', { carrierId: id, pageSize: '99999' }).then(res => {
        this.vehicleInfo = res.result.records
      })
      //  获取司机信息下拉列表
      getAction('/base/driver/list', { carrierId: id, pageSize: '99999' }).then(res => {
        this.driverInfo = res.result.records
      })
    },
    //  运费变化时
    freightChange(freight) {
      this.model.freight = parseFloat(freight.target.value).toFixed(2)
      //  司机运费
      if (this.model.driverFreight && parseInt(this.model.freight) > parseInt(this.model.driverFreight)) {
        const differenceRate = (((this.model.freight - this.model.driverFreight) / this.model.freight) * 100).toFixed(4)
        this.form.setFieldsValue({
          differenceRate: differenceRate
        })
      } else {
        this.form.setFieldsValue({
          differenceRate: ''
        })
      }
      //  承运商运费
      if (this.model.rate) {
        const carrierFreight = parseFloat(this.model.freight * (1 - this.model.rate)).toFixed(2)
        this.form.setFieldsValue({
          carrierFreight: carrierFreight
        })
      }
      //  当运费变化时，动态验证司机运费和承运商运费规则
      this.$nextTick(() => {
        this.form.validateFields(['driverFreight', 'carrierFreight'], { force: true })
      })
    },
    //  司机运费变化时
    driverFreightChange(driverFreight) {
      this.model.driverFreight = driverFreight.target.value
      if (this.model.freight && parseInt(this.model.freight) > parseInt(this.model.driverFreight)) {
        const differenceRate = (((this.model.freight - this.model.driverFreight) / this.model.freight) * 100).toFixed(4)
        this.form.setFieldsValue({
          differenceRate: differenceRate
        })
      } else {
        this.form.setFieldsValue({
          differenceRate: ''
        })
      }
    }
    // // 承运商运费变化时
    // carrierFreightChange(carrierFreight) {
    //   this.model.carrierFreight = carrierFreight.target.value
    //   if (this.model.freight && parseInt(this.model.freight) > parseInt(this.model.carrierFreight)) {
    //     const carrierRate = (((this.model.freight - this.model.carrierFreight) / this.model.freight) * 100).toFixed(2)
    //     this.form.setFieldsValue({
    //       carrierRate: carrierRate + '%'
    //     })
    //   } else {
    //     this.form.setFieldsValue({
    //       carrierRate: ''
    //     })
    //   }
    // }
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
/deep/ .ant-col-4,
/deep/ .ant-col-5,
/deep/ .ant-col-6,
/deep/ .ant-col-8,
/deep/ .ant-col-10,
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

/deep/ .ant-radio-group {
  width: 100%;
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
.prompt {
  font-size: 16px;
  font-family: 'PingFangSC-Semibold', 'PingFang SC Semibold', 'PingFang SC';
  font-weight: 650;
  font-style: normal;
  position: relative;
  left: 299px;
  span {
    font-size: 18px;
    color: #d9001b;
  }
}
/deep/ .ant-radio-disabled + span,
/deep/ .ant-input-number-disabled {
  color: #666;
}
/deep/ .ant-select-auto-complete.ant-select .ant-input[disabled],
/deep/ .ant-radio-disabled,
/deep/ .ant-input[disabled] {
  color: #666;
}
</style>
