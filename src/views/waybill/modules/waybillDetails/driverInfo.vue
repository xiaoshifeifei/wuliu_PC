<!--
 * @Description:
 * @Date: 2020-03-31 08:57:06
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-05-06 16:17:31
 -->
<template>
  <div>
    <a-row :gutter="24"
           v-if="userType !== 'HZ'">
      <div class="box-container">
        <a-form :form="form"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol">
          <a-col :span="label2"
                 v-if="showFlag">
            <a-form-item label="公司名称："
                         :labelCol="labelCol2"
                         :wrapperCol="wrapperCol2">
              <a-input v-decorator="['carrierName']"
                       disabled></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="label2"
                 v-if="showFlag">
            <a-form-item label="纳税资质："
                         :labelCol="labelCol2"
                         :wrapperCol="wrapperCol2">
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
            <a-form-item label="电话："
                         v-if="showFlag">
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
            <a-form-item label="身份证号："
                         v-if="showFlag">
              <a-input v-decorator="['drivingLicense']"
                       disabled></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="收款人："
                         v-if="showFlag">
              <a-input v-decorator="['accountName']"
                       disabled></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="开户行："
                         v-if="showFlag">
              <a-input v-decorator="['openingBank']"
                       disabled></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="银行账号："
                         v-if="showFlag">
              <a-input v-decorator="['openingBankAccount']"
                       disabled></a-input>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="label">
              <a-form-item label="身份证号：">
                <a-input v-decorator="['drivingLicense']" disabled></a-input>
              </a-form-item>
            </a-col> -->
          <a-col :span="label">
            <a-form-item label="运费："
                         v-if="showFlag">
              <a-input v-decorator="['freight']"
                       disabled></a-input>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="label">
            <a-form-item label="差额率："
                         v-if="showFlag">
              <a-input v-decorator="['MarginRatio']"
                       disabled></a-input>
            </a-form-item>
          </a-col> -->
          </a-form-item>
         </a-col>
        </a-form>
      </div>
    </a-row>
    <a-row :gutter="24"
           v-else>
      <div class="box-container">
        <a-form :form="form"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol">
          <a-col :span="label">
            <a-form-item label="司机：">
              <a-input v-decorator="['driverName']"
                       disabled></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="label">
            <a-form-item label="车牌号：">
              <a-input v-decorator="['vehicleNo']"
                       disabled></a-input>
            </a-form-item>
          </a-col>
        </a-form>
      </div>
    </a-row>
  </div>
</template>
<script>
import pick from 'lodash.pick'
import store from '@/store/'

export default {
  name: '',
  props: { driverInfo: Object, required: true },

  components: {},
  mounted() {
    this.show()
  },
  data() {
    return {
      form: this.$form.createForm(this),
      model: {},
      showFlag: true,
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
      userType: store.getters.userType,
      label2: 12,
      label: 6
    }
  },
  methods: {
    show() {
      this.form = this.$form.createForm(this)
      this.model = Object.assign({}, this.driverInfo)
      console.log('this.model.showFlag', this.model.showFlag)

      if (this.model.showFlag === '0') {
        this.showFlag = false
      } else {
        this.showFlag = true
      }
      this.model.MarginRatio = parseFloat(this.model.MarginRatio).toFixed(2) + '%'
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'carrierName',
            'driverName',
            'drivingLicense',
            'accountName',
            'openingBank',
            'openingBankAccount',
            'telephone',
            'vehicleNo',
            'MarginRatio',
            'freight'
          )
        )
      })
    }
  }
}
</script>
<style scoped lang="less">
@import url('./form.less');
</style>
