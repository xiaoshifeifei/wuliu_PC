<!--
 * @Description:
 * @Date: 2020-03-16 16:41:45
 * @LastEditors: 自己洗小红花
 * @LastEditTime: 2020-03-17 10:59:49
 -->
<template>
  <a-card :bordered="false">
    <!-- 操作按钮区域 -->
    <div style="text-align:right;margin-bottom:8px ">
      <a-button
        @click="handleNewAdd(getdefault,getTd)"
        type="primary"
        :disabled="this.titleParams  == '详情'"
      >新增</a-button>
    </div>

    <!-- table区域 -->
    <div>
      <a-table
        ref="table"
        bordered
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical"></a-divider>
          <a @click="handleDelete(record.id)">删除</a>
        </span>
      </a-table>
      <!-- table底部区域 -->
      <contact-modal ref="modalForm" @ok="modalFormOk"></contact-modal>
    </div>
  </a-card>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@/api/manage'
import api from '@/api/index'
// import { basicsApi } from '@api/basics'
import tableData from '@api/tableData'
import contactModal from './contactModal'
// import { setTimeout } from 'timers'
// import { log } from 'util'
export default {
  mixins: [JeecgListMixin],
  name: '',
  components: { contactModal },
  props: ['shipparams', 'modelType', 'showType', 'titleParams'],
  data() {
    return {
      ipagination: {},
      getTd: '',
      getdefault: '',
      columns: tableData.receiveTableData,
      url: api.customerUrl.ship
    }
  },
  watch: {
    shipparams() {
      this.loadData(1)
    },
    showType() {
      this.loadData(1)
    }
  },
  methods: {
    //  新增
    handleNewAdd: function(getdefault, shipparams) {
      this.$refs.modalForm.add(getdefault, shipparams)
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.disableSubmit = false
    },
    //  分页查询
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      this.getTd = this.shipparams
      if (arg === 1 || arg === 2 || arg === 3 || arg === undefined) {
        this.ipagination.current = 1
      }
      const params = {}
      params.cusId = this.shipparams
      const getdefaultActiveKey = sessionStorage.getItem('getdefaultActiveKey2')
      if (getdefaultActiveKey === '3') {
        params.cusConType = '0'
      }
      // console.log('params', params)
      // var params = this.getQueryParams() //查询条件
      this.loading = true
      const that = this
      getAction(this.url.list, params).then(res => {
        if (res.success) {
          const getdefaultActiveKey = sessionStorage.getItem('getdefaultActiveKey2')
          that.getdefault = getdefaultActiveKey
          this.dataSource = res.result
          this.ipagination.total = res.result.total
        }
        if (res.code === 510) {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
    }
  }
}
</script>
<style scoped lang="less">
/deep/ .ant-card-body {
  padding: 0px 24px 6px;
}
/deep/ .ant-input-disabled {
color:black
}
</style>
