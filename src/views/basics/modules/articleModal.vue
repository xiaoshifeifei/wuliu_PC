<!--
 * @Description:
 * @Date: 2020-03-10 14:58:53
 * @LastEditors: 自己洗小红花
 * @LastEditTime: 2020-03-16 13:28:46
 -->
<template>
  <a-modal :title="title"
           :width="800"
           :visible="visible"
           :confirmLoading="confirmLoading"
           @ok="handleSubmit"
           :okButtonProps="{ props: {disabled: disableSubmit} }"
           @cancel="close"
           cancelText="关闭"
           okText="提交"
           style="top:20px;">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="名称："
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     hasFeedback>
          <a-input placeholder="请输入物品名称"
                   v-decorator="[ 'descriptionOfGoods', validatorRules.descriptionOfGoods]" />
        </a-form-item>

        <a-form-item label="类型："
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     hasFeedback>
          <j-dict-select-tag :triggerChange="true"
                             dictCode="cargoClassificationCode"
                             v-decorator="[ 'cargoTypeClassificationCode', validatorRules.cargoTypeClassificationCode]"
                             placeholder="请选择物品类型"></j-dict-select-tag>
        </a-form-item>

        <a-form-item label="包装"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     hasFeedback>
          <j-dict-select-tag :triggerChange="true"
                             dictCode="cargoPackCode"
                             v-decorator="[ 'cargoPackCode', validatorRules.cargoPackCode]"
                             placeholder="请选择物品包装"></j-dict-select-tag>
        </a-form-item>
        <a-form-item label="重量（吨） ："
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     hasFeedback>
          <a-input placeholder="请输入物品重量"
                   v-decorator="[ 'goodsItemGrossWeight']" />
        </a-form-item>
        <a-form-item label="体积(m³) ："
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     hasFeedback>
          <a-input placeholder="请输入物品体积"
                   v-decorator="[ 'cube']" />
        </a-form-item>
        <a-form-item label="总件数(件) ："
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     hasFeedback>
          <a-input placeholder="请输入总件数"
                   v-decorator="[ 'totalNumberOfPackages']" />
        </a-form-item>
        <a-form-item label="备注："
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     hasFeedback>
          <a-input type="teatarea"
                   placeholder="请输入物品备注"
                   v-decorator="[ 'remark', validatorRules.remark]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import pick from 'lodash.pick'
import { basicsApi } from '@api/basics'
import JDate from '@/components/jeecg/JDate.vue'
// import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
export default {
  name: '',
  components: {
    JDate
  },
  data() {
    return {
      disableSubmit: false,
      title: '',
      confirmLoading: false,
      articleType_dictionary: [],
      visible: false,
      model: {},
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      validatorRules: {
        descriptionOfGoods: {
          rules: [
            {
              required: true,
              message: '请输入物品名称!'
            }
          ]
        },
        cargoTypeClassificationCode: {
          rules: [
            {
              required: true,
              message: '请输入物品类型!'
            }
          ]
        },
        cargoPackCode: {
          rules: [
            {
              required: true,
              message: '请输入物品包装!'
            }
          ]
        }
      }
    }
  },
  methods: {
    add(record) {
      this.visible = true
    },
    edit(record) {
      this.visible = true
      this.model = Object.assign({}, record)
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'descriptionOfGoods',
            'cargoTypeClassificationCode',
            'cargoPackCode',
            'goodsItemGrossWeight',
            'cube',
            'totalNumberOfPackages',
            'remark'
          )
        )
      })
    },
    close() {
      this.visible = false
      this.confirmLoading = false
      this.model = {}
      this.form.resetFields()
    },
    handleSubmit() {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          const that = this
          that.$nextTick(() => {
            that.form.setFieldsValue(
              pick(
                that.model,
                'descriptionOfGoods',
                'cargoTypeClassificationCode',
                'cargoPackCode',
                'goodsItemGrossWeight',
                'cube',
                'totalNumberOfPackages',
                'remark'
              )
            )
          })
          const formData = Object.assign(that.model, values)
          // eslint-disable-next-line no-console
          console.log('formData', formData)
          //  修改
          if (this.title === '编辑') {
            basicsApi
              .editArticle(formData)
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
            .addArticle(formData)
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
