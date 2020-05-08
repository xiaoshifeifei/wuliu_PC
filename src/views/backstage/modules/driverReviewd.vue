<template>
  <a-modal
    :title="title"
    :width="1300"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="close"
    :okButtonProps="{ props: { disabled: disableSubmit } }"
    cancelText="关闭"
    okText="提交"
    style="top:20px;"
    :footer="null"
  >
    <a-collapse v-model="activeKey">
      <a-collapse-panel header="基础信息" key="1">
        <a-spin :spinning="confirmLoading">
          <a-col :md="12" :sm="12">
            <a-form :form="form">
              <a-form-item class="form-item">
                <span>真实姓名： </span>
                {{ this.driverName }}
              </a-form-item>

              <a-form-item class="form-item">
                <span>性别: </span>
                {{ this.sex }}
              </a-form-item>

              <a-form-item class="form-item">
                <span>身份证号码： </span>
                {{ this.drivingLicense }}
              </a-form-item>

              <a-form-item class="form-item">
                <span>手机号码： </span>
                {{ this.telephone }}
              </a-form-item>

              <a-form-item class="form-item">
                <span>司机所属： </span>
                {{ this.driverType }}
              </a-form-item>

              <a-form-item class="form-item">
                <span>申请时间： </span>
                {{ this.authTime }}
              </a-form-item>

              <a-form-item class="form-item">
                <span>审核状态： </span>
                {{ this.authState_dictText }}
              </a-form-item>

              <a-form-item class="form-item">
                <span>是否失效： </span>
                {{ this.delFlag }}
              </a-form-item>
            </a-form>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="身份证正面：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <!-- 暂时使用 -->
              <j-image-upload v-model="idFrontImg" :bizPath="bizPath"></j-image-upload>
            </a-form-item>
            <a-form-item label="身份证背面：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <!-- 暂时使用 -->
              <j-image-upload v-model="idBackImg" :bizPath="bizPath"></j-image-upload>
            </a-form-item>
          </a-col>
        </a-spin>
      </a-collapse-panel>
      <a-collapse-panel header="驾驶证信息" key="2">
        <a-spin :spinning="confirmLoading">
          <a-form layout="inline" :form="form">
            <a-form-item label="驾驶证号：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input placeholder="请输入驾驶证号！" v-decorator="['vehicleNo', valCarRules.vehicleNo]"></a-input>
            </a-form-item>
            <a-form-item label="驾驶证类型：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <!-- <a-input
                placeholder="请输入驾驶证类型！"
                v-decorator="[ 'vehicleClass', valCarRules.vehicleClass]"
              ></a-input>-->
              <j-dict-select-tag
                :triggerChange="true"
                dictCode="vehicleClass"
                v-decorator="['vehicleClass', valCarRules.vehicleClass]"
                placeholder="请输入驾驶证类型"
              ></j-dict-select-tag>
            </a-form-item>
            <a-form-item label="初次领证时间：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <j-date
                placeholder="请选择初次领证时间"
                :trigger-change="true"
                v-decorator="['firstCertData', valCarRules.firstCertData]"
                date-format="YYYY-MM-DD HH:mm:ss"
                :showTime="true"
              ></j-date>
            </a-form-item>
            <div>
              <a-form-item label="驾驶证正页：" :labelCol="{ span: 6 }" :wrapperCol="{ span: 8 }" hasFeedback>
                <!-- 暂时使用 -->
                <j-image-upload v-model="driverImg" :bizPath="bizPath"></j-image-upload>
                <!-- <j-image-upload v-model="driverImg"></j-image-upload> -->
              </a-form-item>
              <a-form-item label="驾驶证附页：" :labelCol="{ span: 6 }" :wrapperCol="{ span: 8 }" hasFeedback>
                <!-- <j-image-upload v-model="driverSecondImg"></j-image-upload> -->
                <!-- 暂时使用 -->
                <j-image-upload v-model="driverSecondImg" :bizPath="bizPath"></j-image-upload>
              </a-form-item>
            </div>
          </a-form>
        </a-spin>
      </a-collapse-panel>
      <a-collapse-panel header="从业资格信息" key="3">
        <a-spin :spinning="confirmLoading">
          <a-form layout="inline" :form="form">
            <a-form-item label="从业资格证号：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input
                placeholder="请输入从业资格证号！"
                v-decorator="['qualificationCertificate', valCarRules.qualificationCertificate]"
              ></a-input>
            </a-form-item>
            <a-form-item label="开户名称：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input placeholder="请输入开户名称！" v-decorator="['accountName', valCarRules.accountName]"></a-input>
            </a-form-item>
            <a-form-item label="司机开户行：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input
                placeholder="请输入司机开户行！"
                v-decorator="['openingBank', valCarRules.openingBank]"
              ></a-input>
            </a-form-item>
            <a-form-item label="司机开户账号：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input
                placeholder="请输入司机开户账号！"
                v-decorator="['openingBankAccount', valCarRules.openingBankAccount]"
              ></a-input>
            </a-form-item>
            <a-form-item label="从业资格证证件照：" :labelCol="{ span: 6 }" :wrapperCol="{ span: 8 }" hasFeedback>
              <j-image-upload v-model="qualificationCertificateImg" :bizPath="bizPath"></j-image-upload>
            </a-form-item>
            <div class="reviewd">
              <p>请检查用户提交的照片是否清晰、用户填写资料与照片信息是否相符</p>
              <div>
                <a-col :md="4" :sm="24">
                  <span class="formStype">认证信息</span>
                </a-col>
                <a-col :md="10" :sm="24">
                  <a-form-item label="真实姓名：" class="form-item formWidth">
                    <!-- <span>真实姓名： </span> -->
                    {{ this.driverName }}
                  </a-form-item>

                  <a-form-item label="身份证号码：" class="form-item formWidth">
                    <!-- <span>身份证号码： </span> -->
                    {{ this.drivingLicense }}
                  </a-form-item>
                </a-col>
                <a-col :md="10" :sm="24">
                  <a-form-item label="手机号码：" class="formWidth">
                    <!-- <span>手机号码： </span> -->
                    {{ this.telephone }}
                  </a-form-item>
                  <!-- <a-form-item
                    label="身份证地址："
                    class="formWidth"
                  >
                  {{ this.qualificationCertificate }}
                  </a-form-item> -->
                  <a-form-item
                    label="是否失效："
                    class="formWidth"
                  >
                  {{ this.delFlag }}
                  </a-form-item>

                </a-col>
              </div>
              <div>
                <a-col :md="4" :sm="24">
                  <span class="formStype">审核意见</span>
                </a-col>
                <a-col :md="20" :sm="24">
                  <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    hasFeedback
                    style="width:100%;margin-right: 0px !important;"
                    v-if="this.authState_dictText === null"
                  >
                    <a-input placeholder="请输入审核意见" type="textarea" rows="4" v-decorator="['authRemark']" />
                  </a-form-item>

                  <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    hasFeedback
                    class="formWidth"
                    v-if="this.authState_dictText === '审核失败'"
                  >
                    <span style="color:red">姓名、身份证号码不匹配</span>
                  </a-form-item>
                  <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    hasFeedback
                    class="formWidth"
                    v-if="this.authState_dictText === '审核通过'"
                  >
                    <span>{{ this.authRemark }}</span>
                  </a-form-item>
                </a-col>
              </div>
              <div>
                <a-col :md="4" :sm="24">
                  <span class="formStype">审核时间</span>
                </a-col>
                <a-col :md="20" :sm="24">
                  <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    hasFeedback
                    v-if="this.authState_dictText === null"
                  >
                    <j-dict-select-tag
                      dictCode="cargoClassificationCode"
                      v-decorator="['qualificationCertificate', valCarRules.qualificationCertificate]"
                      placeholder="请选择货物类型"
                    ></j-dict-select-tag>
                  </a-form-item>

                  <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    hasFeedback
                    v-if="this.authState_dictText === '审核失败'"
                  >
                    {{ this.authTime }}
                  </a-form-item>

                  <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    hasFeedback
                    v-if="this.authState_dictText === '审核通过'"
                  >
                    {{ this.authTime }}
                  </a-form-item>
                </a-col>
              </div>
              <div v-if="this.authState_dictText === '审核失败'">
                <a-col :md="4" :sm="24">
                  <span class="formStype">审核人</span>
                </a-col>
                <a-col :md="20" :sm="24">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
                    {{ this.driverName }}
                  </a-form-item>
                </a-col>
              </div>
              <div v-if="this.authState_dictText === '审核通过'">
                <a-col :md="4" :sm="24">
                  <span class="formStype">审核人</span>
                </a-col>
                <a-col :md="20" :sm="24">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
                    {{ this.driverName }}
                  </a-form-item>
                </a-col>
              </div>

              <div v-if="this.authState_dictText === null">
                <a-button type="primary" ghost class="reviewdBtn" @click="handleSubmit(1)">审核通过</a-button>
                <a-button type="primary" ghost style="margin-left:200px;" @click="handleSubmit(2)">审核不通过</a-button>
              </div>
              <div id="u24" v-if="this.authState_dictText === '审核失败' || this.authState_dictText === '审核通过'">
                <div id="u24_div" class=""></div>
                <div id="u24_text" class="text">
                  <p>
                    <span v-if="this.authState_dictText === '审核失败'">审核不通过</span>
                    <span v-if="this.authState_dictText === '审核通过'">审核通过</span>
                  </p>
                </div>
              </div>
              <!-- <div id="u24" v-if="this.authState_dictText === '审核成功'">
                    <div id="u24_div" class=""></div>
                    <div id="u24_text" class="text ">
                        <p><span>审核通过</span></p>
                    </div>
                 </div> -->
            </div>
          </a-form>
        </a-spin>
      </a-collapse-panel>
    </a-collapse>
  </a-modal>
</template>
<script>
import pick from 'lodash.pick'
// import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import {
  basicsApi
} from '@api/basics'
// import { ACCESS_TOKEN } from '@/store/mutation-types'
import api from '@api/index'
import {
  deleteAction
} from '@/api/manage'

import JDate from '@/components/jeecg/JDate'
// import JUpload from '@/components/jeecg/JUpload'
// import JImageUpload from '@/components/jeecg/JImageUpload'
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
      authRemark: '',
      driverName: '',
      sex: '',
      drivingLicense: '',
      telephone: '',
      qualificationCertificate: '',
      driverType: '',
      authTime: '',
      authState_dictText: '',
      delFlag: '',
      // 默认路径配置
      bizPath: 'temp',
      headers: {},
      url: api.driverContent.reviewdDriver,
      value: 1,
      activeKey: ['1', '2', '3'],
      driverInfo: {},
      visible: false,
      title: '',
      model: {},
      paramsId: '',
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
          rules: [{
            required: true,
            message: '请输入姓名!'
          }]
        },
        sex: {
          rules: [{
            required: true,
            message: '请输入性别!'
          }]
        },
        telephone: {
          rules: [{
            required: true,
            message: '请输入联系方式!'
          }, {
            validator: this.validateMobile
          }]
        },
        drivingLicense: {
          rules: [{
            required: true,
            message: '请输入身份证号!'
          }]
        },
        driverType: {
          rules: [{
            required: true,
            message: '请选择司机所属!'
          }]
        },
        idFrontImg: {
          rules: [{
            required: true,
            message: '请上传身份证正面!'
          }]
        },
        idBackImg: {
          rules: [{
            required: true,
            message: '请上传身份证反面!'
          }]
        },
        vehicleNo: {
          rules: [{
            required: true,
            message: '请输入驾驶证号!'
          }]
        },
        vehicleClass: {
          rules: [{
            required: true,
            message: '请输入驾驶证类型!'
          }]
        },
        firstCertData: {
          rules: [{
            required: true,
            message: '请输入初次领证时间!'
          }]
        },
        driverImg: {
          rules: [{
            required: true,
            message: '请上传驾驶证正页!'
          }]
        },
        driverSecondImg: {
          rules: [{
            required: true,
            message: '请上传驾驶证附页!'
          }]
        },
        qualificationCertificate: {
          rules: [{
            required: true,
            message: '请输入从业资格证号!'
          }]
        },

        accountName: {
          rules: [{
            required: true,
            message: '请输入开户名称!'
          }]
        },
        openingBank: {
          rules: [{
            required: true,
            message: '请输入司机开户行!'
          }]
        },
        openingBankAccount: {
          rules: [{
            required: true,
            message: '请输入司机开户账号!'
          }]
        },
        username: {
          rules: [{
            required: true,
            message: '请输入登录人账号!'
          }]
        },
        qualificationCertificateImg: {
          rules: [{
            required: true,
            message: '请上传从业资格证证件照!'
          }]
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
    onChange(date, dateString) {
      // eslint-disable-next-line no-console
      console.log(date, dateString)
      // this.getDate = dateString
    },
    add(record) {
      console.log('新增', record)
      this.paramsId = record.id
      this.driverName = record.driverName
      this.authTime = record.authTime
      this.authRemark = record.authRemark
      if (this.authRemark === null) {
        this.authRemark = '无'
      }
      if (record.sex === 'M') {
        this.sex = '男'
      } else {
        this.sex = 'nv'
      }

      this.drivingLicense = record.drivingLicense
      this.telephone = record.telephone
      this.qualificationCertificate = record.qualificationCertificate

      this.authState_dictText = record.authState_dictText

      this.authTime = record.authTime

      if (record.driverType === '0') {
        this.driverType = '自有'
      } else {
        this.driverType = '外协'
      }

      if (record.delFlag === '1') {
        this.delFlag = '是'
      } else {
        this.delFlag = '否'
      }

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
      } else if (this.model.idFrontImg === null) {
        this.idFrontImg = []
      }

      if (this.model.idBackImg) {
        this.idBackImg = this.model.idBackImg.split(',')
      } else if (this.model.idBackImg === null) {
        this.idBackImg = []
      }
      if (this.model.driverImg) {
        this.driverImg = this.model.driverImg.split(',')
      } else if (this.model.driverImg === null) {
        this.driverImg = []
      }
      if (this.model.driverSecondImg) {
        this.driverSecondImg = this.model.driverSecondImg.split(',')
      } else if (this.model.driverSecondImg === null) {
        this.driverSecondImg = []
      }
      if (this.model.qualificationCertificateImg) {
        this.qualificationCertificateImg = this.model.qualificationCertificateImg.split(',')
      } else if (this.model.qualificationCertificateImg === null) {
        this.qualificationCertificateImg = []
      }
      if (this.model.sex === '女') {
        this.model.sex = 'F'
      } else {
        this.model.sex = 'M'
      }
      if (this.model.driverType === '外协') {
        this.model.driverType = '1'
      } else {
        this.model.driverType = '0'
      }
      // console.log('model', this.model)
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
            'authRemark'
          )
        )
      })
    },
    validateMobile(rule, value, callback) {
      if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
        callback()
      } else {
        callback('您的手机号码格式不正确!')
      }
    },
    close() {
      this.visible = false
      this.confirmLoading = false
      this.model = {}
      this.form.resetFields()
      this.disableSubmit = false
    },
    handleSubmit(params) {
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

          formData.id = this.paramsId
          formData.authStatus = params
          this.url =
                            this.url +
                            '?authStatus=' +
                            formData.authStatus +
                            '&id=' +
                            formData.id +
                            '&authRemark=' +
                            formData.authRemark
          const arr = this.url.split('?')
          this.url = arr[0] + '?' + arr[arr.length - 1]
          // eslint-disable-next-line no-console
          console.log('formData', formData)

          // //  修改
          deleteAction(this.url, {})
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
/deep/ .form-item[data-v-5237037a] {
    padding-left:0px !important;
}
    .ant-form-item {
        width: 50%;
        margin-right: 0px !important;
        margin: 5px 0px;
    }

    .formWidth {
        width: 100%;
        margin-right: 0px !important;
        margin: 5px 0px;
    }

    .form-item {
        padding-left: 50px;
    }

    .reviewd {
        position: relative;
        width: 100%;
        height: 400px;
        padding: 60px 50px 0 50px;
        border: 1px solid #000;
    }

    .reviewd p {
        color: red;
        position: absolute;
        right: 35px;
        top: 25px;
    }

    .formStype {
        font-size: 30px;
        font-weight: 700;
    }

    .reviewdBtn {
        margin: 30px 0 0 350px;
    }

    #u24 {
        border-width: 0px;
        position: absolute;
        right: 300px;
        top: 200px;
        width: 200px;
        height: 100px;
        display: flex;
        -webkit-transform: rotate(338deg);
        -moz-transform: rotate(338deg);
        -ms-transform: rotate(338deg);
        transform: rotate(338deg);
        font-size: 28px;
        color: #ff0000;
        border: 3px solid red;
    }
</style>
