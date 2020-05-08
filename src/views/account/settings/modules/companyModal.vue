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
    style="top:20px;"
  >
  <a-spin :spinning="confirmLoading">
    <a-form :form="form">
            <a-form-item label="企业名称："  :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input placeholder="请输入企业名称" v-decorator="['carrierName', valCarRules.carrierName]"></a-input>
            </a-form-item>
            <a-form-item label="企业简称："  :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input placeholder="请输入企业简称" v-decorator="['shortName', valCarRules.shortName]"></a-input>
            </a-form-item>
            <a-form-item label="企业编号："  :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input placeholder="请输入企业编号" v-decorator="['carrierCode', valCarRules.carrierCode]"></a-input>
            </a-form-item>
            <a-form-item label="联系人："  :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input placeholder="请输入联系人"  v-decorator="['linkName', valCarRules.linkName]"></a-input>
            </a-form-item>
            <a-form-item label="联系电话："  :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input placeholder="请输入联系电话" v-decorator="['linkPhone', valCarRules.linkPhone]"></a-input>
            </a-form-item>
            <a-form-item label="企业地址："  :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input placeholder="请输入企业地址"  v-decorator="['officeAddr', valCarRules.officeAddr]"></a-input>
            </a-form-item>
      </a-form>
  </a-spin>
  </a-modal>
</template>
<script>
import pick from 'lodash.pick'
import api from '@api/index'
import {
  putAction
} from '@/api/manage'

import { isVehicleNumber } from '@/utils/validate'

export default {
  name: '',
  // mixins: [JeecgListMixin],
  // components: { JImageUpload },
  components: {
  },
  imgList: [],
  data() {
    return {
      title: '',
      disableSubmit: false,
      confirmLoading: false,
      visible: false,
      url: api.company,
      previewVisible: false,
      form: this.$form.createForm(this),
      model: {},
      layout: 'inline',
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
      valCarRules: {
        carrierName: {
          rules: [{
            required: true,
            message: '请输入企业名称!'
          }]
        },
        shortName: {
          rules: [{
            required: true,
            message: '请输入企业简称!'
          }]
        },
        carrierCode: {
          rules: [{
            required: true,
            message: '请输入企业编号!'
          }]
        },
        linkName: {
          rules: [{
            required: true,
            message: '请输入联系人!'
          }]
        },
        linkPhone: {
          rules: [{
            required: true,
            message: '请输入联系电话!'
          },
          { validator: this.validateMobile }]
        },
        officeAddr: {
          rules: [{
            required: true,
            message: '请输入企业地址!'
          }]
        }
      }
    }
  },
  watch: {
    // activeKey(key) {
    //   console.log(null)
    // }
  },
  methods: {
    validateMobile(rule, value, callback) {
      if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
        callback()
      } else {
        callback('您的手机号码格式不正确!')
      }
    },
    add(record) {
      this.visible = true
    },
    edit(record) {
      console.log('record', record)
      this.visible = true
      this.model = Object.assign({}, record)
      // eslint-disable-next-line no-console
      console.log('model', this.model)
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'carrierName',
            'shortName',
            'carrierCode',
            'linkName',
            'linkPhone',
            'officeAddr',
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
    },
    handleSubmit() {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          const that = this
          const formData = Object.assign(that.model, values)
          // eslint-disable-next-line no-console
          console.log('formData', formData)
          //  修改
          putAction(this.url, formData)
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

</style>
