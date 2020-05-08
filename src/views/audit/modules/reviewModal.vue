<!--
 * @Description: 订单审核
 * @Date: 2020-03-05 13:03:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-04-28 10:44:13
 -->
<template>
  <a-modal title="审核"
           :width="800"
           :visible="visible"
           :confirmLoading="confirmLoading"
           @ok="handleSubmit"
           okText="确定"
           @cancel="handleCancel"
           cancelText="关闭"
           style="top:20px;">
    <a-form :layout="layout" >
        <a-form-item label="审核结果：">
          <a-radio-group v-model="status">
            <a-radio :value="'2'">通过</a-radio>
            <a-radio :value="'3'">不通过</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="退回原因：" v-if="status === '3'">
          <a-input v-model="remark"></a-input>
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
      ids: '',
      impStats: '',
      remark: '',
      status: '2',
      layout: 'inline'
    }
  },

  methods: {
    show(ids, impStats) {
      this.ids = ids
      this.impStats = impStats
      this.visible = true
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.disableSubmit = false
    },

    handleSubmit() {
      this.confirmLoading = true
      const obj = {
        ids: this.ids,
        impStats: this.impStats,
        remark: this.remark
      }
      postHeaderAction(
        api.url.doExamine + this.status,
        obj,
      )
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
