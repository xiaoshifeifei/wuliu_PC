<template>
  <a-modal :title="title"
           :width="1200"
           :visible="visible"
           :confirmLoading="confirmLoading"
           @ok="handleSubmit"
           @cancel="close"
           :okButtonProps="{ props: { disabled: disableSubmit } }"
           cancelText="关闭"
           okText="提交"
           style="top:20px;">
    <a-collapse v-model="activeKey">
      <a-collapse-panel header="基础信息"
                        key="1">
        <p>注：请让您的司机安装高速物流·司机版APP，以便能实时接收到您发布的运输任务！手机号即为登陆账号。</p>
        <a-spin :spinning="confirmLoading">
          <a-form layout="inline"
                  :form="form">
            <div>
              <a-form-item label="姓名："
                           :labelCol="labelCol"
                           :wrapperCol="wrapperCol"
                           hasFeedback>
                <a-input placeholder="请输入姓名"
                         v-decorator="['driverName', valCarRules.driverName]"></a-input>
              </a-form-item>
              <a-form-item label="性别："
                           :labelCol="labelCol"
                           :wrapperCol="wrapperCol"
                           hasFeedback>
                <j-dict-select-tag :triggerChange="true"
                                   dictCode="sex"
                                   v-decorator="['sex', valCarRules.sex]"
                                   placeholder="请输入性别"></j-dict-select-tag>
              </a-form-item>
              <a-form-item label="联系方式："
                           :labelCol="labelCol"
                           :wrapperCol="wrapperCol"
                           hasFeedback>
                <a-input placeholder="请输入联系方式"
                         v-decorator="['telephone', valCarRules.telephone]"></a-input>
              </a-form-item>
              <a-form-item label="身份证号："
                           :labelCol="labelCol"
                           :wrapperCol="wrapperCol"
                           hasFeedback>
                <a-input placeholder="请输入身份证号！"
                         v-decorator="['drivingLicense', valCarRules.drivingLicense]"></a-input>
              </a-form-item>
              <a-form-item label="司机所属："
                           :labelCol="labelCol"
                           :wrapperCol="wrapperCol">
                <a-radio-group v-decorator="['driverType', valCarRules.driverType]">
                  <a-radio value="0">自有</a-radio>
                  <a-radio value="1">外协</a-radio>
                </a-radio-group>
              </a-form-item>
            </div>
            <a-form-item label="身份证正面："
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         hasFeedback>
              <j-image-upload v-model="idFrontImg"
                              :bizPath="bizPath"></j-image-upload>
            </a-form-item>
            <a-form-item label="身份证背面："
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         hasFeedback>
              <j-image-upload v-model="idBackImg"
                              :bizPath="bizPath"></j-image-upload>
            </a-form-item>
          </a-form>
        </a-spin>
      </a-collapse-panel>
      <a-collapse-panel header="驾驶证信息"
                        key="2">
        <a-spin :spinning="confirmLoading">
          <a-form layout="inline"
                  :form="form">
            <div>
              <a-form-item label="驾驶证号："
                           :labelCol="labelCol"
                           :wrapperCol="wrapperCol"
                           hasFeedback>
                <a-input placeholder="请输入驾驶证号！"
                         v-decorator="['vehicleNo', valCarRules.vehicleNo]"></a-input>
              </a-form-item>
              <a-form-item label="驾驶证类型："
                           :labelCol="labelCol"
                           :wrapperCol="wrapperCol"
                           hasFeedback>
                <!-- <a-input
                      placeholder="请输入驾驶证类型！"
                      v-decorator="[ 'vehicleClass', valCarRules.vehicleClass]"
                    ></a-input>-->
                <j-dict-select-tag :triggerChange="true"
                                   dictCode="vehicleClass"
                                   v-decorator="['vehicleClass', valCarRules.vehicleClass]"
                                   placeholder="请输入驾驶证类型"></j-dict-select-tag>
              </a-form-item>
              <a-form-item label="初次领证时间："
                           :labelCol="labelCol"
                           :wrapperCol="wrapperCol"
                           hasFeedback>
                <j-date placeholder="请选择初次领证时间"
                        :trigger-change="true"
                        v-decorator="['firstCertData', valCarRules.firstCertData]"
                        date-format="YYYY-MM-DD HH:mm:ss"
                        :showTime="true"></j-date>
              </a-form-item>
            </div>
            <a-form-item label="驾驶证正页："
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         hasFeedback>
              <!-- 暂时使用 -->
              <!-- <updata-driver v-model="driverImg"></updata-driver> -->
              <j-image-upload v-model="driverImg"
                              :bizPath="bizPath"></j-image-upload>
            </a-form-item>
            <a-form-item label="驾驶证附页："
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         hasFeedback>
              <j-image-upload v-model="driverSecondImg"
                              :bizPath="bizPath"></j-image-upload>
              <!-- 暂时使用 -->
              <!-- <updata-driver v-model="driverSecondImg"></updata-driver> -->
            </a-form-item>
          </a-form>
        </a-spin>
      </a-collapse-panel>
      <a-collapse-panel header="从业资格信息"
                        key="3">
        <a-spin :spinning="confirmLoading">
          <a-form layout="inline"
                  :form="form">
            <a-form-item label="从业资格证号："
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         hasFeedback>
              <a-input placeholder="请输入从业资格证号！"
                       v-decorator="['qualificationCertificate', valCarRules.qualificationCertificate]"></a-input>
            </a-form-item>
            <a-form-item label="从业资格证证件照："
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         hasFeedback>
              <!-- 暂时使用 -->
              <!-- <updata-driver v-model="qualificationCertificateImg"></updata-driver> -->
              <j-image-upload v-model="qualificationCertificateImg"
                              :bizPath="bizPath"></j-image-upload>
            </a-form-item>
          </a-form>
        </a-spin>
      </a-collapse-panel>
      <a-collapse-panel header="收款信息"
                        key="4">
        <a-spin :spinning="confirmLoading">
          <a-form layout="inline"
                  :form="form">
            <!-- 新增原型没有部分  -->
            <a-form-item label="开户名称："
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         hasFeedback>
              <a-input placeholder="请输入开户名称！"
                       v-decorator="['accountName', valCarRules.accountName]"></a-input>
            </a-form-item>

            <a-form-item label="收款人开户行："
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         hasFeedback>
              <a-input placeholder="请输入收款人开户行！"
                       v-decorator="['openingBank', valCarRules.openingBank]"></a-input>
            </a-form-item>
            <a-form-item label="收款人开户账号："
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         hasFeedback>
              <a-input placeholder="请输入收款人开户账号！"
                       v-decorator="['openingBankAccount', valCarRules.openingBankAccount]"></a-input>
            </a-form-item>
            <a-form-item label="收款人身份证号："
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         hasFeedback>
              <a-input placeholder="请输入收款人身份证号！"
                       v-decorator="['payeeIdCard', valCarRules.payeeIdCard]"></a-input>
            </a-form-item>
            <!-- 结束 -->
          </a-form>
        </a-spin>
      </a-collapse-panel>
    </a-collapse>
  </a-modal>
</template>
<script>
import pick from 'lodash.pick'
// import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { basicsApi } from '@api/basics'
// import { ACCESS_TOKEN } from '@/store/mutation-types'
import api from '@api/index'

import { getAction } from '@/api/manage'

import { isPhoneOrMobile, isSFZ } from '@/utils/validate'

import JDate from '@/components/jeecg/JDate'
// import JUpload from '@/components/jeecg/JUpload'
import JImageUpload from './JImageUpload'
import UpdataDriver from '@/components/jeecg/UpdataDriver' // 暂时使用

export default {
  name: '',
  // mixins: [JeecgListMixin],
  // components: { JImageUpload },
  components: {
    UpdataDriver,
    JDate,
    JImageUpload
  }, // 暂时使用
  imgList: [],
  data() {
    return {
      bizPath: 'driver',
      headers: {},
      url: api.basiceUrl.updata,
      value: 1,
      activeKey: ['1', '2', '3', '4'],
      driverInfo: {},
      visible: false,
      title: '',
      model: {},
      layout: 'inline',
      confirmLoading: false,
      disableSubmit: false,
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 6
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 16
        }
      },
      form: this.$form.createForm(this),
      valCarRules: {
        driverName: {
          rules: [
            {
              required: true,
              message: '请输入姓名!'
            }
          ]
        },
        sex: {
          rules: [
            {
              required: true,
              message: '请输入性别!'
            }
          ], initialValue: 'M'
        },
        telephone: {
          rules: [
            {
              required: true,
              message: '请输入联系方式!'
            },
            {
              validator: this.validateMobile
            }
          ]
        },
        drivingLicense: {
          rules: [
            {
              required: true,
              message: '请输入身份证号!'
            },
            {
              validator: this.drivingMobile
            }
          ]
        },
        driverType: {
          rules: [
            {
              required: true,
              message: '请选择司机所属!'
            }
          ], initialValue: '0'
        },
        idFrontImg: {
          rules: [
            {
              required: true,
              message: '请上传身份证正面!'
            }
          ]
        },
        idBackImg: {
          rules: [
            {
              required: true,
              message: '请上传身份证反面!'
            }
          ]
        },
        vehicleNo: {
          rules: [
            {
              required: true,
              message: '请输入驾驶证号!'
            }
          ]
        },
        vehicleClass: {
          rules: [
            {
              required: true,
              message: '请输入驾驶证类型!'
            }
          ], initialValue: 'A1'
        },
        firstCertData: {
          rules: [
            {
              required: true,
              message: '请输入初次领证时间!'
            }
          ]
        },
        payeeIdCard: {
          rules: [
            {
              required: true,
              message: '请输入收款人身份证号!'
            },
            {
              validator: this.drivingMobile
            }
          ]
        },
        driverImg: {
          rules: [
            {
              required: true,
              message: '请上传驾驶证正页!'
            }
          ]
        },
        driverSecondImg: {
          rules: [
            {
              required: true,
              message: '请上传驾驶证附页!'
            }
          ]
        },
        qualificationCertificate: {
          rules: [
            {
              required: true,
              message: '请输入从业资格证号!'
            }
          ]
        },

        accountName: {
          rules: [
            {
              required: true,
              message: '请输入开户名称!'
            }
          ]
        },
        openingBank: {
          rules: [
            {
              required: true,
              message: '请输入司机开户行!'
            }
          ]
        },
        openingBankAccount: {
          rules: [
            {
              required: true,
              message: '请输入司机开户账号!'
            }
          ]
        },
        username: {
          rules: [
            {
              required: true,
              message: '请输入登录人账号!'
            }
          ]
        },
        qualificationCertificateImg: {
          rules: [
            {
              required: true,
              message: '请上传从业资格证证件照!'
            }
          ]
        }
      },
      idFrontImg: [],
      idBackImg: [],
      driverImg: [],
      driverSecondImg: [],
      qualificationCertificateImg: [],
      getDate: ''
    }
  },
  watch: {
    // activeKey(key) {
    //   console.log(key)
    // }
  },
  methods: {
    // onChange(date, dateString) {
    //   console.log(date, dateString)
    //   // this.getDate = dateString
    // },
    add(record) {
      this.idFrontImg = []
      this.idBackImg = []
      this.driverImg = []
      this.driverSecondImg = []
      this.qualificationCertificateImg = []
      this.visible = true
      this.edit(record)
    },
    edit(record) {
      this.visible = true
      this.model = Object.assign({}, record)

      if (this.model.idFrontImg) {
        this.idFrontImg = this.model.idFrontImg.split(',')
      } else if (this.model.idFrontImg == null) {
        this.idFrontImg = []
      }

      if (this.model.idBackImg) {
        this.idBackImg = this.model.idBackImg.split(',')
      } else if (this.model.idBackImg == null) {
        this.idBackImg = []
      }
      if (this.model.driverImg) {
        this.driverImg = this.model.driverImg.split(',')
      } else if (this.model.driverImg == null) {
        this.driverImg = []
      }
      if (this.model.driverSecondImg) {
        this.driverSecondImg = this.model.driverSecondImg.split(',')
      } else if (this.model.driverSecondImg == null) {
        this.driverSecondImg = []
      }
      if (this.model.qualificationCertificateImg) {
        this.qualificationCertificateImg = this.model.qualificationCertificateImg.split(',')
      } else if (this.model.qualificationCertificateImg == null) {
        this.qualificationCertificateImg = []
      }

      // if (this.model.sex === '女') {
      //   this.model.sex = 'F'
      // } else {
      //   this.model.sex = 'M'
      // }
      // if (this.model.driverType === '外协') {
      //   this.model.driverType = '1'
      // } else {
      //   this.model.driverType = '0'
      // }
      // eslint-disable-next-line no-console
      console.log('model', this.model)
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'driverName',
            'sex',
            'telephone',
            'drivingLicense',
            'driverType',
            'idFrontImg',
            'idBackImg',
            'vehicleNo',
            'vehicleClass',
            'firstCertData',
            'driverImg',
            'driverSecondImg',
            'qualificationCertificate',
            'qualificationCertificateImg',
            'accountName',
            'username',
            'openingBank',
            'openingBankAccount',
            'payeeIdCard'
          )
        )
      })
    },
    validateMobile(rule, value, callback) {
      if (!value || isPhoneOrMobile(value)) {
        getAction('/base/driver/getDriverByTelephone' + '?telephone=' + value, {}).then(res => {
          if (this.title === '新增') {
            if (res.result) {
              const resParams = res.result
              this.title = '新增'
              this.edit(resParams)
            } else {
              // 当数据库没有这个号码时，如果有填过表单则不清空，否则直接清空表单
              const form = this.form
              if (form.getFieldValue('driverName') !== '' || form.getFieldValue('drivingLicense') !== '' || form.getFieldValue('vehicleNo') !== '' || form.getFieldValue('qualificationCertificate') !== '' || form.getFieldValue('accountName') !== '' || form.getFieldValue('openingBank') !== '' || form.getFieldValue('openingBankAccount') !== '' || form.getFieldValue('payeeIdCard') !== '' || form.getFieldValue('firstCertData') !== '') {
                return
              } else {
                const resParams = {
                  driverName: '',
                  drivingLicense: '',
                  vehicleNo: '',
                  qualificationCertificate: '',
                  accountName: '',
                  openingBank: '',
                  openingBankAccount: '',
                  payeeIdCard: '',
                  firstCertData: ''
                }
                this.add(resParams)
              }
            }
          } else if (this.title === '编辑') {
            return
          }
          if (res.code === 510) {
            this.$message.warning(res.message)
          }
          this.loading = false
        })
        callback()
      } else {
        callback('您的手机号码格式不正确!')
      }
    },
    drivingMobile(rule, value, callback) {
      if (!value || isSFZ(value)) {
        callback()
      } else {
        callback('您的身份证号码格式不正确!')
      }
    },
    close() {
      this.visible = false
      this.confirmLoading = false
      this.model = {}
      this.form.resetFields()
      this.disableSubmit = false
      this.idFrontImg = []
      this.idBackImg = []
      this.driverImg = []
      this.driverSecondImg = []
      this.qualificationCertificateImg = []
    },
    handleSubmit() {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          const that = this

          if (typeof this.driverImg === 'string') {
            this.model.driverImg = this.driverImg
          } else {
            this.model.driverImg = this.driverImg.join(',')
          }

          if (typeof this.idFrontImg === 'string') {
            this.model.idFrontImg = this.idFrontImg
          } else {
            this.model.idFrontImg = this.idFrontImg.join(',')
          }

          if (typeof this.idBackImg === 'string') {
            this.model.idBackImg = this.idBackImg
          } else {
            this.model.idBackImg = this.idBackImg.join(',')
          }

          if (typeof this.driverSecondImg === 'string') {
            this.model.driverSecondImg = this.driverSecondImg
          } else {
            this.model.driverSecondImg = this.driverSecondImg.join(',')
          }

          if (typeof this.qualificationCertificateImg === 'string') {
            this.model.qualificationCertificateImg = this.qualificationCertificateImg
          } else {
            this.model.qualificationCertificateImg = this.qualificationCertificateImg.join(',')
          }

          const loginUser = localStorage.getItem('getCarrierId')
          values.carrierId = loginUser
          const formData = Object.assign(that.model, values)

          // eslint-disable-next-line no-console
          console.log('formData', formData)

          // //  修改
          if (this.title === '编辑') {
            basicsApi
              .editDriverMessage(formData)
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
                // this.close()
              })
            return
          }
          basicsApi
            .addDriver(formData)
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
              // this.close()
            })
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.ant-form-item {
  width: 50%;
  margin-right: 0px !important;
  margin: 5px 0px;
}

/deep/ .ant-input-disabled {
  color: black;
}
</style>
