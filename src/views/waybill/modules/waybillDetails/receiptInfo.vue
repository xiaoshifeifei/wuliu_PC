
<!--
 * @Description:
 * @Date: 2020-03-31 08:57:06
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-04-23 17:58:37
 -->
<template>
  <div>
    <a-row :gutter="24">
      <div class="box-container">
        <a-form :form="form"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol">
          <a-col :span="label2">
            <a-form-item label="回单状态："
                         :labelCol="labelCol2"
                         :wrapperCol="wrapperCol2">
              <div v-if="model.receiptStatus === '0'">未回单</div>
              <div v-if="model.receiptStatus === '1'">已回单</div>
            </a-form-item>
          </a-col>
          <a-col :span="label2">
            <a-form-item label="回单数量："
                         :labelCol="labelCol2"
                         :wrapperCol="wrapperCol2">
              <a-input v-decorator="['receiptNo']"
                       disabled></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="label2">
            <a-form-item label="回单照片："
                         :labelCol="labelCol2"
                         :wrapperCol="wrapperCol2">
              <JImageUpload v-model="model.receiptImg"
                            :isMultiple="true"></JImageUpload>
            </a-form-item>
          </a-col>
        </a-form>
      </div>
    </a-row>
  </div>
</template>
<script>
import pick from 'lodash.pick'
import JImageUpload from './JImageUpload'

export default {
  name: '',
  props: { receiptInfo: Object, required: true },
  components: { JImageUpload },
  mounted() {
    this.show()
  },
  data() {
    return {
      form: this.$form.createForm(this),
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
      label2: 12,
      label: 6
    }
  },
  methods: {
    show() {
      this.form = this.$form.createForm(this)
      this.model = Object.assign({}, this.receiptInfo)
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'receiptImg', 'receiptNo', 'receiptStatus'))
      })
    }
  }
}
</script>
<style scoped lang="less">
@import url('./form.less');
</style>
