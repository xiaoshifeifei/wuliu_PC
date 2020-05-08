<!--
 * @Description:
 * @Date: 2020-03-30 19:09:35
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-04-23 13:50:15
 -->
<template>
  <a-modal
    title="回单照片上传"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    okText="提交"
    @cancel="close"
    cancelText="取消"
    style="top:20px;"
  >
    <j-image-upload v-model="imgList" :isMultiple="true" :bizPath="bizPath" v-if="imgList"></j-image-upload>
    <div>1.本地上传图片大小不能超过2M</div>
    <div>2.回单最多您可以传5张图片</div>
  </a-modal>
</template>
<script>
import JImageUpload from './JImageUpload'
import { putAction } from '@/api/manage'

export default {
  name: '',
  components: { JImageUpload },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      confirmDirty: false,
      loading: false,
      orderTableList: [],
      imgList: [],
      //  回单上传图片路径
      bizPath: 'replay'
    }
  },
  methods: {
    show(data) {
      this.orderTableList = data
      //  预览图片路径

      if (this.orderTableList.gswlWaybill.receiptImg) {
        this.imgList = this.orderTableList.gswlWaybill.receiptImg.split(',')
      }
      this.visible = true
    },
    handleSubmit() {
      const obj = {
        waybillId: this.orderTableList.gswlWaybill.id,
        waybillStatus: '3',
        receiptImg: this.imgList
      }
      //  TODO
      putAction('/order/gswlWaybill/uploadReply', obj).then(res => {
        if (res.message) {
          this.$message.success(res.message)
          this.close()
          this.$emit('ok')
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    close() {
      this.visible = false
      this.orderTableList = []
      this.imgList = []
    }
  }
}
</script>
<style scoped lang="less">
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
