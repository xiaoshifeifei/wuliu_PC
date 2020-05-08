<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="close"
    :okButtonProps="{ props: { disabled: disableSubmit } }"
    cancelText="关闭"
    okText="提交"
    style="top:20px;textAlgin:center"
  >
    <a-collapse v-model="activeKey">
      <a-collapse-panel header="基础信息" key="1">
        <a-spin :spinning="confirmLoading">
          <a-form :form="form" :layout="layout">
            <a-form-item label="车牌号：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input placeholder="请输入车牌号" disabled v-decorator="['vehicleNumber']" />
            </a-form-item>
            <a-form-item label="车辆类型：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <j-dict-select-tag
                :triggerChange="true"
                dictCode="vehicleType"
                disabled
                v-decorator="['vehicleType']"
                placeholder="请选择物品类型"
              ></j-dict-select-tag>
            </a-form-item>
            <a-form-item label="车牌颜色：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <j-dict-select-tag
                :triggerChange="true"
                dictCode="vehicleColor"
                disabled
                v-decorator="['vehiclePlateColorCode']"
                placeholder="请选择物品类型"
              ></j-dict-select-tag>
            </a-form-item>

            <a-form-item label="司机所属：" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-radio-group v-decorator="['vtype']" disabled>
                <a-radio value="0">自有</a-radio>
                <a-radio value="1">外协</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="申请时间：" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date
                placeholder="申请时间"
                disabled
                :trigger-change="true"
                v-decorator="['updateTime']"
                date-format="YYYY-MM-DD HH:mm:ss"
                :showTime="true"
              ></j-date>
            </a-form-item>
            <a-form-item label="审核状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag v-decorator="['authState']" disabled placeholder="请选择状态" dictCode="auth_status" />
            </a-form-item>
            <a-form-item label="是否失效" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch
                checkedChildren="是"
                unCheckedChildren="否"
                :defaultChecked="model.delFlag === 1 ? true : false"
                disabled
              />
            </a-form-item>
          </a-form>
        </a-spin>
      </a-collapse-panel>

      <a-collapse-panel header="道路运输许可证信息" key="2">
        <a-spin :spinning="confirmLoading">
          <a-form :form="form" :layout="layout">
            <a-form-item label="道路运输证号：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input placeholder="请输入道路运输证" disabled v-decorator="['roadTransportCertificateNumber']" />
            </a-form-item>
          </a-form>
          <a-form-item label="道路运输证：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
            <j-image-upload v-model="roadTransportCertificateImg" disabled :bizPath="bizPath"></j-image-upload>
          </a-form-item>
        </a-spin>
      </a-collapse-panel>
      <a-collapse-panel header="行驶证信息" key="3">
        <a-spin :spinning="confirmLoading">
          <a-form :form="form" :layout="layout">
            <a-form-item label="车辆行驶证号：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input placeholder="请输入车辆行驶证号" disabled v-decorator="['vehicleDrivingCert']" />
            </a-form-item>
            <a-form-item label="车辆识别代号：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input placeholder="请输入车辆识别代号" disabled v-decorator="['vin']" />
            </a-form-item>
            <a-form-item label="发动机代号：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input placeholder="请输入发动机代号" disabled v-decorator="['engine']" />
            </a-form-item>
            <a-form-item label="额定载重(t)：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input placeholder="请输入额定载重" disabled v-decorator="['vehicleTonnage']" />
            </a-form-item>
            <a-form-item label="额定体积(m³)：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input placeholder="请输入额定体积" disabled v-decorator="['vehicleVolume']" />
            </a-form-item>
            <a-form-item label="车长(cm)：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <j-dict-select-tag
                :triggerChange="true"
                disabled
                dictCode="vehicleLength"
                v-decorator="['vehicleLength']"
                placeholder="请选择车长"
              ></j-dict-select-tag>
            </a-form-item>
            <a-form-item label="车宽(cm)：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input placeholder="请输入车宽" disabled v-decorator="['vehicleWide']" />
            </a-form-item>
            <a-form-item label="车高(cm)：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input placeholder="请输入车高" disabled v-decorator="['vehicleHeight']" />
            </a-form-item>
            <a-form-item label="行驶证正页：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <j-image-upload v-model="drivinLicenseFrontImg" disabled :bizPath="bizPath"></j-image-upload>
            </a-form-item>
            <a-form-item label="行驶证副页：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <j-image-upload v-model="drivinLicenseBackImg" disabled :bizPath="bizPath"></j-image-upload>
            </a-form-item>
            <a-form-item label="车辆照片：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <j-image-upload v-model="vehicleImgUrl" disabled :bizPath="bizPath"></j-image-upload>
            </a-form-item>
          </a-form>
        </a-spin>
      </a-collapse-panel>
      <a-collapse-panel header="审核结果" key="4">
        <a-spin :spinning="confirmLoading">
          <a-form :form="form" :layout="layout">
            <a-form-item label="审核意见：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input type="textarea" v-model="authRemark" />
            </a-form-item>
            <a-form-item
              label="审核时间："
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              v-if="model.authState !== '0'"
            >
              <j-date
                placeholder="审核时间"
                disabled
                :trigger-change="true"
                v-decorator="['authTime']"
                date-format="YYYY-MM-DD HH:mm:ss"
                :showTime="true"
              ></j-date>
            </a-form-item>
            <a-form-item
              label="审核人："
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              v-if="model.authState !== '0'"
              hasFeedback
            >
              <a-input v-decorator="['authBy']" />
            </a-form-item>
            <a-form-item
              label="审核结果："
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              v-if="model.authState !== '0'"
              hasFeedback
            >
              <div v-if="model.authState === '1'">审核通过</div>
              <div v-if="model.authState === '2'">审核失败</div>
            </a-form-item>
          </a-form>
        </a-spin>
      </a-collapse-panel>
    </a-collapse>
    <template slot="footer" v-if="title === '审核'">
      <a-button type="danger" @click="handleSubmit(2)">审核不通过</a-button>
      <a-button type="primary" @click="handleSubmit(1)">
        审核通过
      </a-button>
    </template>
  </a-modal>
</template>
<script>
import pick from 'lodash.pick'
import { postAction } from '@/api/manage'
import api from '@api/index'
import JDate from '@/components/jeecg/JDate'
import JImageUpload from './JImageUpload'
export default {
  name: '',
  components: { JImageUpload, JDate },
  data() {
    return {
      bizPath: 'vehicle',
      title: '',
      disableSubmit: false,
      confirmLoading: false,
      visible: false,
      imgList: [],

      value: 1,
      activeKey: ['1', '2', '3', '4'],
      baseInfo: {},
      driverInfo: {},

      previewVisible: false,
      previewImage: '',
      fileList: [],
      form: this.$form.createForm(this),
      model: {},
      layout: 'inline',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      authRemark: '',
      roadTransportCertificateImg: [],
      drivinLicenseFrontImg: [],
      drivinLicenseBackImg: [],
      vehicleImgUrl: []
    }
  },
  methods: {
    edit(record) {
      this.visible = true
      this.model = Object.assign({}, record)
      this.authRemark = this.model.authRemark
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
      if (this.title === '详情') {
        this.$nextTick(() => {
          this.form.setFieldsValue(
            pick(
              this.model,
              'vehicleNumber',
              'vehicleType',
              'vehiclePlateColorCode',
              'vtype',
              'vehicleDrivingCert',
              'vin',
              'engine',
              'vehicleTonnage',
              'vehicleVolume',
              'vehicleLength',
              'vehicleWide',
              'vehicleHeight',
              'updateTime',
              'authBy',
              'authTime'
            )
          )
        })
      } else {
        this.$nextTick(() => {
          this.form.setFieldsValue(
            pick(
              this.model,
              'vehicleNumber',
              'vehicleType',
              'vehiclePlateColorCode',
              'vtype',
              'vehicleDrivingCert',
              'vin',
              'engine',
              'vehicleTonnage',
              'vehicleVolume',
              'vehicleLength',
              'vehicleWide',
              'vehicleHeight',
              'updateTime'
            )
          )
        })
      }
    },
    close() {
      this.$emit('ok')
      this.visible = false
      this.confirmLoading = false
      this.model = {}
      this.form.resetFields()
      this.disableSubmit = false
      this.roadTransportCertificateImg = []
      this.drivinLicenseFrontImg = []
      this.drivinLicenseBackImg = []
      this.vehicleImgUrl = []
      this.authRemark = ''
    },
    handleSubmit(authStatus) {
      postAction('/vehicle/gswlBaseVehicle/auditVehicle/' + authStatus, {
        vehicleId: this.model.id,
        authRemark: this.authRemark
      })
        .then(res => {
          if (res.success) {
            this.$message.success(res.message)
            this.close()
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.confirmLoading = false
          this.$emit('ok')
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
  width: 50%;
  margin-right: 0px !important;
  margin: 5px 0px;
}
</style>
