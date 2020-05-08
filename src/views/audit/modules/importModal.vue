<!--
 * @Description: 发布货源
 * @Date: 2020-03-05 13:03:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-04-27 19:13:27
 -->
<template>
  <a-modal title="批次号导入"
           :width="800"
           :visible="visible"
           :confirmLoading="confirmLoading"
           @ok="handleSubmit"
           okText="确定"
           @cancel="handleCancel"
           cancelText="关闭"
           style="top:20px;">
    <a-form :layout="layout">
      <a-form-item label="批次号：">
        <a-input v-model="batchNo" placeholder="请输入批次号"></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { postHeaderAction } from '@/api/manage'
import api from '../const'

export default {
  name: 'reviewModal',
  data() {
    return {
      visible: false,
      confirmLoading: false,
      confirmDirty: false,
      loading: false,
      batchNo: '',
      layout: 'inline',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
  },

  methods: {
    show() {
      this.visible = true
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.disableSubmit = false
      this.batchNo = ''
    },

    handleSubmit() {
      this.confirmLoading = true
      postHeaderAction(api.url.confirmImport, { batchNo: this.batchNo })
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
      this.close()
    },

    handleCancel() {
      this.close()
    }
  }
}
</script>
<style scoped lang="less">
</style>
