<!--
 * @Description:
 * @Date: 2020-03-16 17:15:06
 * @LastEditors: 自己洗小红花
 * @LastEditTime: 2020-03-17 10:54:10
 -->
<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="close"
    :okButtonProps="{ props: {disabled: disableSubmit} }"
    cancelText="关闭"
    okText="提交"
    style="top:20px;"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="单位全称：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
          <a-input
            placeholder="请输入单位名称"
            v-decorator="[ 'contactsName', validatorRules.contactsName]"
          />
        </a-form-item>
        <a-form-item label="联系人：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
          <a-input placeholder="请输入联系人" v-decorator="[ 'linkName', validatorRules.linkName]"/>
        </a-form-item>
        <a-form-item label="联系电话：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
          <a-input placeholder="请输入联系电话" v-decorator="[ 'linkPhone', validatorRules.linkPhone]"/>
        </a-form-item>
        <a-form-item label="所在城市：" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <v-distpicker
            @selected="onSelected"
            v-decorator="[ 'countryAddr', validatorRules.countryAddr]"
            :province="select.province"
            :city="select.city"
            :area="select.area"
          ></v-distpicker>
        </a-form-item>

        <a-form-item label="详细地址：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
          <a-input placeholder="请输入详细地址" v-decorator="[ 'detailAddr', validatorRules.detailAddr]"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import pick from 'lodash.pick'
import { basicsApi } from '@api/basics'
// import api from '@/api/index'
import VDistpicker from 'v-distpicker'
// import { log } from 'util'

export default {
  name: '',
  components: {
    VDistpicker
  },
  data() {
    return {
      select: {},
      title: '',
      confirmLoading: false,
      contactsType: '',
      visible: false,
      model: {},
      paramsId: '',
      disableSubmit: false,
      form: this.$form.createForm(this),
      showType: true,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      validatorRules: {
        contactsName: {
          rules: [
            {
              required: true,
              message: '请输入单位全称!'
            }
          ]
        },
        linkName: {
          rules: [
            {
              required: true,
              message: '请输入联系人!'
            }
          ]
        },
        linkPhone: {
          rules: [
            {
              required: true,
              message: '请输入联系电话!'
            },
            { validator: this.validateMobile }
          ]
        },
        countryAddr: {
          rules: [
            {
              required: true,
              message: '请选择所在城市!'
            }
          ]
        },
        detailAddr: {
          rules: [
            {
              required: true,
              message: '请输入详细地址!'
            }
          ]
        }
      }
    }
  },

  methods: {
    // -------------------表单联动---------------------
    onSelected(data) {
      this.form.setFieldsValue({
        countryAddr: data.province.value + '-' + data.city.value + '-' + data.area.value
      })

      this.model.countryAddr = data.province.value + '-' + data.city.value + '-' + data.area.value
      this.model.countryCode = data.province.code + ',' + data.city.code + ',' + data.area.code

      const address = this.model.countryAddr.split('-')

      this.select = {
        province: address[0],
        city: address[1],
        area: address[2]
      }
    },
    add(record, id) {
      this.select = {}
      const getShowParams = localStorage.getItem('getShow')
      if (record === '2' || getShowParams === 'enable') {
        this.contactsType = '1'
      } else if (record === '3' || getShowParams === 'all') {
        this.contactsType = '0'
      }
      this.edit(record, id)
    },
    edit(record, id) {
      this.paramsId = id
      this.visible = true
      this.model = Object.assign({}, record)
      if (this.model.countryAddr) {
        const address = this.model.countryAddr.split('-')

        this.select = {
          province: address[0],
          city: address[1],
          area: address[2]
        }
      }

      if (this.contactsType === '') {
        this.contactsType = this.model.contactsType
      }
      // this.contactsType = this.model.contactsType
      // this.customerId = this.model.customerId

      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'contactsName', 'linkName', 'linkPhone', 'countryAddr', 'detailAddr'))
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
      this.select = {}
      this.form.resetFields()
      this.disableSubmit = false
      this.select = {}
    },
    handleSubmit() {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          const that = this
          const formData = Object.assign(that.model, values)
          formData.contactsType = this.contactsType
          formData.delFlag = 0
          formData.customerId = this.paramsId
          // eslint-disable-next-line no-console
          console.log('formData', formData)

          if (this.title === '编辑') {
            basicsApi
              .editcontactMessage(formData)
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
            .addContact(formData)
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
/deep/ .ant-input-disabled {
color:black
}
</style>
