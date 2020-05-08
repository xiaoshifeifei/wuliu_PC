
<template>
  <a-modal title="业务往来"
           :width="700"
           v-if="visible"
           :visible="visible"
           :confirmLoading="confirmLoading"
           :footer="null"
           @cancel="close"
           style="top:20px;">
    <div style="width:650px;padding-left:60px">
      <div>
        选择时期：
        <a-range-picker @change="onChange" ><a-icon slot="suffixIcon" type="smile" />
        </a-range-picker>
        <a-button @click="handleSubmit"
                  type="primary"
                  style="margin-left: 20px">查询</a-button>
      </div>
      <div style="margin-top:30px;padding-left:90px">截止今日完成 &nbsp;&nbsp;&nbsp; {{form.totalOrder}} 单，总营业额：&nbsp;&nbsp;&nbsp; {{form.totalTurnover}}元</div>
      <div style="margin-top: 30px">
        <a-button @click="close"
                  type="primary"
                  style="margin-left: 220px">确定</a-button>
      </div>
    </div>
  </a-modal>
</template>
<script>
// import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@/api/manage'
import moment from 'moment'
// import { basicsApi } from '@api/basics'
import api from '@api/index'
export default {
  name: '',
  // mixins: [JeecgListMixin],
  components: {},
  data() {
    return {
      moment,
      visible: false,
      url: api.driverUrl.statisBus,
      carrierId: '',
      beginDt: '',
      form: { carrierName: '', totalOrder: '', totalTurnover: '' },
      endDt: '',
      confirmLoading: false,
      model: {}
    }
  },
  methods: {
    onChange(date, dateString) {
      this.beginDt = dateString[0]
      this.endDt = dateString[1]
    },
    show(id) {
      this.carrierId = id.id
      this.visible = true
    },
    handleSubmit() {
      // 触发表单验证
      this.confirmLoading = true
      const that = this
      const formData = {}
      this.url = this.url + '?driverId=' + this.carrierId + '&beginDt=' + this.beginDt + '&endDt=' + this.endDt
      const arr = this.url.split('?')
      this.url = arr[0] + '?' + arr[arr.length - 1]
      getAction(this.url, formData)
        .then(res => {
          if (res.success) {
            that.form.carrierName = res.result.driverName
            that.form.totalOrder = res.result.totalNumber
            that.form.totalTurnover = res.result.totalFreight
            this.$message.success(res.message)
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    close() {
      this.visible = false
      this.confirmLoading = false
      this.model = {}
      this.form = {}
      this.$emit('ok')
    }
  }
}
</script>
<style scoped lang="less">
/deep/ .ant-input-disabled {
color:black
}
</style>
