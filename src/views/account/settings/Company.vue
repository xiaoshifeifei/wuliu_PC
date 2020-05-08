
<template>
  <a-card :bordered="false">
    <a-button @click="handleEditNew"
                  type="primary"
                  style="margin-bottom:20px">修改</a-button>
     <div class="table-page-search-wrapper">
      <a-form >
            <a-form-item label="企业名称：" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input placeholder="请输入企业名称" v-model="carrierName" :disabled="true"></a-input>
            </a-form-item>
            <a-form-item label="企业简称：" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input placeholder="请输入企业简称" v-model="shortName" :disabled="true" ></a-input>
            </a-form-item>
            <a-form-item label="企业编号：" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input placeholder="请输入企业编号" v-model="carrierCode" :disabled="true" ></a-input>
            </a-form-item>
            <a-form-item label="联系人：" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input placeholder="请输入联系人" v-model="linkName" :disabled="true"></a-input>
            </a-form-item>
            <a-form-item label="联系电话：" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input placeholder="请输入联系电话" v-model="linkPhone" :disabled="true"></a-input>
            </a-form-item>
            <a-form-item label="企业地址：" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input placeholder="请输入企业地址" v-model="officeAddr" :disabled="true"></a-input>
            </a-form-item>
      </a-form>
    </div>
    <companny-modal ref="modalForm" @ok="modalFormOk"></companny-modal>
  </a-card>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction, putAction } from '@/api/manage'
import CompannyModal from './modules/companyModal'
import api from '@/api/index'

export default {
  name: '',
  mixins: [JeecgListMixin],
  components: { CompannyModal },
  data() {
    return {
      carrierName: '',
      shortName: '',
      carrierCode: '',
      linkName: '',
      linkPhone: '',
      officeAddr: '',
      recordParams: '',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      },

      url: api.systemSttings
    }
  },
  created() {
    // this.getParams()
  },
  methods: {
    //  分页查询
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      // 加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      // var params = this.getQueryParams() // 查询条件
      this.loading = true
      getAction(this.url.list, {}).then(res => {
        if (res.success) {
          console.log('res', res)
          this.recordParams = res.result
          this.carrierName = res.result.carrierName
          this.shortName = res.result.shortName
          this.carrierCode = res.result.carrierCode
          this.linkName = res.result.linkName
          this.linkPhone = res.result.linkPhone
          this.officeAddr = res.result.officeAddr
        }
        if (res.code === 510) {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
    },
    handleEditNew() {
      this.$refs.modalForm.edit(this.recordParams)
      this.$refs.modalForm.title = '编辑'
      this.$refs.modalForm.disableSubmit = false
    }
    // getParams(){
    //      getAction(this.url.list,{}).then(res => {
    //             if (res.success) {
    //               this.recordParams = res.result
    //               this.carrierName = res.result.carrierName
    //               this.shortName = res.result.shortName
    //               this.carrierCode = res.result.carrierCode
    //               this.linkName = res.result.linkName
    //               this.linkPhone = res.result.linkPhone
    //               this.officeAddr = res.result.officeAddr
    //               this.$message.success(res.message)
    //               this.$emit('ok')
    //               this.close()
    //             } else {
    //               this.$message.warning(res.message)
    //             }
    //           })
    //           .finally(() => {
    //             this.confirmLoading = false
    //             // this.close()
    //           })
    //         return
    // }
  } }
</script>
<style scoped lang="less">
/deep/ .ant-input-disabled {
  color: black;
}
  .ant-form-item {
        width: 50%;
        margin-right: 0px !important;
        margin: 5px 0px;
        float: left;
    }
</style>
