<template>
  <a-modal
    :title="title"
    :width="1200"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="close"
    :okButtonProps="{ props: { disabled: disableSubmit } }"
    cancelText="关闭"
    okText="提交"
    style="top:20px;"
  >

      <div >
        <a-card title="基础信息" >
        <a-spin :spinning="confirmLoading">
          <a-form class="form1" :form="form" :layout="layout"  :labelCol="labelCol1"  :wrapperCol="wrapperCol1">

            <a-form-item label="车牌号：" hasFeedback>
              <a-input placeholder="请输入车牌号" v-decorator="['vehicleNumber', valCarRules.vehicleNumber]" />
            </a-form-item>
            <a-form-item label="车辆类型：" hasFeedback>
              <j-dict-select-tag
                style="width: 186px"
                :triggerChange="true"
                dictCode="vehicleType"
                v-decorator="['vehicleType', valCarRules.vehicleType]"
                placeholder="请选择物品类型"
              ></j-dict-select-tag>
            </a-form-item>
            <a-form-item label="车牌颜色："  hasFeedback>
              <j-dict-select-tag
                :triggerChange="true"
                 style="width: 186px"
                dictCode="vehicleColor"
                v-decorator="['vehiclePlateColorCode', valCarRules.vehiclePlateColorCode]"
                placeholder="请选择物品类型"
              ></j-dict-select-tag>
            </a-form-item>

            <a-form-item label="合作类型：">
              <a-radio-group v-decorator="['vtype', valCarRules.vtype]">
                <a-radio value="自有">自有</a-radio>
                <a-radio value="外协">外协</a-radio>
              </a-radio-group>
            </a-form-item>
            <!-- <a-form-item label="所有人：" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input placeholder="所有人" v-decorator="[ 'owner',valCarRules.owner]"/>
            </a-form-item>-->
          </a-form>
        </a-spin>
      </a-card>

     <a-card title="道路运输许可证信息" style="margin:20px 0 20px 0">
       <a-spin :spinning="confirmLoading">
          <a-form class="form2"  :labelCol="labelCol2" :wrapperCol="wrapperCol2" :form="form" :layout="layout">
            <a-form-item label="道路运输证号："  hasFeedback>
              <a-input
                placeholder="请输入道路运输证"
                v-decorator="['roadTransportCertificateNumber', valCarRules.roadTransportCertificateNumber]"
              />
            </a-form-item>

          <a-form-item label="道路运输证："  hasFeedback>
            <!-- 暂时使用 -->
            <j-image-upload v-model="roadTransportCertificateImg" :bizPath="bizPath"></j-image-upload>
            <!-- <j-image-upload v-model="roadTransportCertificateImg"></j-image-upload> -->
          </a-form-item>
           </a-form>
        </a-spin>
      </a-card>

      <a-card title="行驶证信息">
        <a-spin :spinning="confirmLoading">
          <a-form class="form3" :form="form" :layout="layout" :labelCol="labelCol3" :wrapperCol="wrapperCol4">
            <a-form-item label="车辆行驶证号："  hasFeedback>
              <a-input
                placeholder="请输入车辆行驶证号"
                v-decorator="['vehicleDrivingCert', valCarRules.vehicleDrivingCert]"
              />
            </a-form-item>
            <a-form-item label="车辆识别代号：" hasFeedback>
              <a-input placeholder="请输入车辆识别代号" v-decorator="['vin', valCarRules.vin]" />
            </a-form-item>
            <a-form-item label="发动机代号：" hasFeedback>
              <a-input placeholder="请输入发动机代号" v-decorator="['engine', valCarRules.engine]" />
            </a-form-item>
            <a-form-item label="额定载重(t)：" hasFeedback>
              <a-input placeholder="请输入额定载重" v-decorator="['vehicleTonnage', valCarRules.vehicleTonnage]" />
            </a-form-item>
            <a-form-item label="额定体积(m³)：" hasFeedback>
              <a-input placeholder="请输入额定体积" v-decorator="['vehicleVolume', valCarRules.vehicleVolume]" />
            </a-form-item>
            <a-form-item label="车长(m)：" hasFeedback>
              <j-dict-select-tag
                style="width: 170px"
                :triggerChange="true"
                dictCode="vehicleLength"
                v-decorator="['vehicleLength', valCarRules.vehicleLength]"
                placeholder="请选择车长"
              ></j-dict-select-tag>
            </a-form-item>
            <a-form-item label="车宽(m)：" hasFeedback>
              <a-input placeholder="请输入车宽" v-decorator="['vehicleWide', valCarRules.vehicleWide]" />
            </a-form-item>
            <a-form-item label="车高(m)：" hasFeedback>
              <a-input placeholder="请输入车高" v-decorator="['vehicleHeight', valCarRules.vehicleHeight]" />
            </a-form-item>
                          <a-form-item>
            </a-form-item>
            <a-form-item label="行驶证正页："  hasFeedback>
              <!-- 暂时使用 -->
              <!-- <updata-car v-model="drivinLicenseFrontImg"></updata-car> -->
              <j-image-upload v-model="drivinLicenseFrontImg" :bizPath="bizPath"></j-image-upload>
              <!-- <j-image-upload v-model="drivinLicenseFrontImg"></j-image-upload> -->
            </a-form-item>

            <a-form-item label="行驶证副页：" hasFeedback>
              <!-- 暂时使用 -->
              <!-- <updata-car v-model="drivinLicenseBackImg"></updata-car> -->
              <j-image-upload v-model="drivinLicenseBackImg" :bizPath="bizPath"></j-image-upload>
              <!-- <j-image-upload v-model="drivinLicenseBackImg"></j-image-upload> -->
            </a-form-item>
            <a-form-item label="车辆照片：" hasFeedback>
              <!-- 暂时使用 -->
              <j-image-upload v-model="vehicleImgUrl" :bizPath="bizPath"></j-image-upload>
              <!-- <j-image-upload v-model="vehicleImgUrl"></j-image-upload> -->
            </a-form-item>
          </a-form>
        </a-spin>
      </a-card>
      </div>
  </a-modal>
</template>
<script>
import pick from 'lodash.pick'
import {
  basicsApi
} from '@api/basics'
// import { JeecgListMixin } from '@/mixins/JeecgListMixin'
// import { ACCESS_TOKEN } from '@/store/mutation-types'
import api from '@api/index'
import {
  getAction
} from '@/api/manage'

import { isVehicleNumber } from '@/utils/validate'

import JDate from '@/components/jeecg/JDate'
import JUpload from '@/components/jeecg/JUpload'
import JImageUpload from './JImageUpload'
import UpdataCar from '@/components/jeecg/UpdataCar' // 临时
export default {
  name: '',
  // mixins: [JeecgListMixin],
  // components: { JImageUpload },
  components: {
    JImageUpload,
    UpdataCar,
    JDate,
    JUpload
  },
  imgList: [],
  data() {
    return {
      bizPath: 'vehicle',
      vehicleNumber: '',
      title: '',
      disableSubmit: false,
      confirmLoading: false,
      visible: false,

      headers: {},
      url: api.basiceUrl.updata,
      value: 1,
      activeKey: ['1', '2', '3'],
      baseInfo: {},
      driverInfo: {},

      previewVisible: false,
      previewImage: '',
      fileList: [],
      form: this.$form.createForm(this),
      model: {},
      layout: 'inline',
      labelCol1: {
        xs: {
          span: 24
        },
        sm: {
          span: 8
        }
      },
      wrapperCol1: {
        xs: {
          span: 24
        },
        sm: {
          span: 16
        }
      },
      labelCol2: {
        xs: {
          span: 24
        },
        sm: {
          span: 10
        }
      },
      wrapperCol2: {
        xs: {
          span: 24
        },
        sm: {
          span: 14
        }
      },
      labelCol3: {
        xs: {
          span: 24
        },
        sm: {
          span: 10
        }
      },
      wrapperCol3: {
        xs: {
          span: 24
        },
        sm: {
          span: 14
        }
      },
      valCarRules: {
        vehicleNumber: {
          rules: [{
            required: true,
            min: 0,
            max: 7,
            message: '请输入车牌号!'
          }, {
            validator: this.validateMobile
          }]
        },
        vehicleType: {
          rules: [{
            required: true,
            message: '请输入车辆类型!'
          }], initialValue: 'H10'
        },
        vehiclePlateColorCode: {
          rules: [{
            required: true,
            message: '请输入车牌颜色!'
          }], initialValue: '1'
        },
        vtype: {
          rules: [{
            required: true,
            message: '请填写合作类型!'
          }], initialValue: '自有'
        },
        roadTransportCertificateNumber: {
          rules: [{
            required: true,
            message: '请输入道路运输证号!'
          }]
        },
        roadTransportCertificateImg: {
          rules: [{
            required: true,
            message: '请输入道路运输证!'
          }]
        },
        vehicleDrivingCert: {
          rules: [{
            required: true,
            message: '请输入车辆行驶证号!'
          }]
        },
        vin: {
          rules: [{
            required: true,
            message: '请输入车辆识别代号!'
          }]
        },
        engine: {
          rules: [{
            required: true,
            message: '请输入发动机代号!'
          }]
        },
        vehicleTonnage: {
          rules: [{
            required: true,
            message: '请输入额定载重!'
          }]
        },
        vehicleVolume: {
          rules: [{
            required: true,
            message: '请输入额定体积!'
          }]
        },
        vehicleLength: {
          rules: [{
            required: true,
            message: '请输入车长!'
          }], initialValue: '17.5'
        },
        vehicleWide: {
          rules: [{
            required: true,
            message: '请输入车宽!'
          }]
        },
        vehicleHeight: {
          rules: [{
            required: true,
            message: '请输入车高!'
          }]
        },
        drivinLicenseFrontImg: {
          rules: [{
            required: true,
            message: '请输入行驶证正页!'
          }]
        },
        drivinLicenseBackImg: {
          rules: [{
            required: true,
            message: '请输入行驶证副页!'
          }]
        },
        vehicleImgUrl: {
          rules: [{
            required: true,
            message: '请输入车辆照片!'
          }]
        }
      },
      roadTransportCertificateImg: [],
      drivinLicenseFrontImg: [],
      drivinLicenseBackImg: [],
      vehicleImgUrl: []
    }
  },
  watch: {
    // activeKey(key) {
    //   console.log(null)
    // }
  },
  methods: {
    validateMobile(rule, value, callback) {
      if (!value || isVehicleNumber(value)) {
        getAction('/vehicle/gswlBaseVehicle/queryByVehicleNum' + '?vehicleNumber=' + value, {}).then(res => {
          if (this.title === '新增') {
            if (res.result) {
              const resParams = res.result
              this.title = '新增'
              this.edit(resParams)
            } else {
              const form = this.form
              if (form.getFieldValue('roadTransportCertificateNumber') !== '' || form.getFieldValue('vehicleDrivingCert') !== '' || form.getFieldValue('vin') !== '' || form.getFieldValue('engine') !== '' || form.getFieldValue('vehicleTonnage') !== '' || form.getFieldValue('vehicleVolume') !== '' || form.getFieldValue('vehicleWide') !== '' || form.getFieldValue('vehicleHeight') !== '') {
                return
              } else {
                const resParams = {
                  roadTransportCertificateNumber: '',
                  vehicleDrivingCert: '',
                  vin: '',
                  engine: '',
                  vehicleTonnage: '',
                  vehicleVolume: '',
                  vehicleWide: '',
                  vehicleHeight: ''
                }
                this.edit(resParams)
              }
            }
          } else if (this.title === '编辑') {
            return
          }
          if (res.code === 510) {
            this.$message.warning(res.message)
          }
        })
        callback()
      } else {
        callback('车牌号格式不正确')
      }
    },
    add(record) {
      this.roadTransportCertificateImg = []
      this.drivinLicenseFrontImg = []
      this.drivinLicenseBackImg = []
      this.vehicleImgUrl = []
      this.visible = true
    },
    edit(record) {
      if (record.vtype === '自有') {
        record.vtype = '自有'
      } else {
        record.vtype = '外协'
      }
      this.visible = true
      this.model = Object.assign({}, record)
      if (this.model.roadTransportCertificateImg) {
        this.roadTransportCertificateImg = this.model.roadTransportCertificateImg.split(',')
      } else if (this.model.roadTransportCertificateImg === '') {
        this.roadTransportCertificateImg = []
      }

      if (this.model.drivinLicenseFrontImg) {
        this.drivinLicenseFrontImg = this.model.drivinLicenseFrontImg.split(',')
      } else if (this.model.drivinLicenseFrontImg === '') {
        this.drivinLicenseFrontImg = []
      }
      if (this.model.drivinLicenseBackImg) {
        this.drivinLicenseBackImg = this.model.drivinLicenseBackImg.split(',')
      } else if (this.model.drivinLicenseBackImg === '') {
        this.drivinLicenseBackImg = []
      }
      if (this.model.vehicleImgUrl) {
        this.vehicleImgUrl = this.model.vehicleImgUrl.split(',')
      } else if (this.model.vehicleImgUrl === '') {
        this.vehicleImgUrl = []
      }

      // eslint-disable-next-line no-console
      console.log('model', this.model)
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'vehicleNumber',
            'vehicleType',
            'vehiclePlateColorCode',
            'vtype',
            'roadTransportCertificateNumber',
            'roadTransportCertificateImg',
            'vehicleDrivingCert',
            'vin',
            'engine',
            'vehicleTonnage',
            'vehicleVolume',
            'vehicleLength',
            'vehicleWide',
            'vehicleHeight',
            'drivinLicenseFrontImg',
            'drivinLicenseBackImg',
            'vehicleImgUrl'
          )
        )
      })
    },
    close() {
      this.visible = false
      this.confirmLoading = false
      this.model = {}
      this.form.resetFields()
      this.disableSubmit = false
      this.roadTransportCertificateImg = []
      this.drivinLicenseFrontImg = []
      this.drivinLicenseBackImg = []
      this.vehicleImgUrl = []
    },
    handleSubmit() {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          const that = this
          // console.log('类型',);

          if (typeof this.roadTransportCertificateImg === 'string') {
            this.model.roadTransportCertificateImg = this.roadTransportCertificateImg
          } else {
            this.model.roadTransportCertificateImg = this.roadTransportCertificateImg.join(',')
          }
          if (typeof this.drivinLicenseFrontImg === 'string') {
            this.model.drivinLicenseFrontImg = this.drivinLicenseFrontImg
          } else {
            this.model.drivinLicenseFrontImg = this.drivinLicenseFrontImg.join(',')
          }
          if (typeof this.drivinLicenseBackImg === 'string') {
            this.model.drivinLicenseBackImg = this.drivinLicenseBackImg
          } else {
            this.model.drivinLicenseBackImg = this.drivinLicenseBackImg.join(',')
          }
          if (typeof this.vehicleImgUrl === 'string') {
            this.model.vehicleImgUrl = this.vehicleImgUrl
          } else {
            this.model.vehicleImgUrl = this.vehicleImgUrl.join(',')
          }
          const formData = Object.assign(that.model, values)
          formData.owner = '1'
          if (formData.vtype === '自有') {
            formData.vtype = '0'
          } else {
            formData.vtype = '1'
          }

          // eslint-disable-next-line no-console
          console.log('formData', formData)
          //  修改
          if (this.title === '编辑') {
            basicsApi
              .editCar(formData)
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
            .addCar(formData)
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
      })
    }
  }
}
</script>
<style scoped lang="less">
    .clearup {
        position: relative;
        height: 120px;
        margin-top: 20px;
        margin-bottom: 30px;
    }

    .clearfix {
        position: absolute;
        top: 10px;
    }

    .clearfixfrend {
        position: relative;
        width: 100px;
    }

    .clearupdata {
        margin-left: 80px;
    }

    .btn {
        position: absolute;
        bottom: 0;
        left: 80px;
    }

    .ant-form-item {

        margin-right: 0px !important;
        margin: 5px 0px;
    }
    .form1 {
      .ant-form-item {width: 25%;}
    }
    .form2 {
      .ant-form-item {width: 30%;}
    }
     .form3 {
      .ant-form-item {width: 33%;}
    }

    /deep/ .ant-input-disabled {
        color: black;
    }
    /deep/.ant-card-head {
      background-color: #e8ecef;
    }
</style>
