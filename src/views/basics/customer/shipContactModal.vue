<!--
 * @Description:
 * @Date: 2020-03-16 16:41:45
 * @LastEditors: 自己洗小红花
 * @LastEditTime: 2020-03-17 11:00:17
 -->
<template>
  <a-card :bordered="false">
    <!-- 操作按钮区域 -->
    <div style="text-align:right;margin-bottom:8px ">
      <a-button @click="handleNewAdd(getdefault, getTd)" type="primary" :disabled="this.titleParams == '详情'"
        >新增</a-button
      >
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
// import { basicsApi } from '@api/basics'
import api from '@/api/index'
import contactModal from './contactModal'
import tableData from '@api/tableData'
// import { setTimeout } from 'timers'
// import { log } from 'util'
export default {
  mixins: [JeecgListMixin],
  name: '',
  components: { contactModal },
  props: ['shipparams', 'showType', 'titleParams'],
  data() {
    return {
      getdefault: '',
      title: '',
      ipagination: {},
      getTd: '',
      columns: tableData.shipTableData,
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
    handleNewAdd(getdefault, id) {
      this.$refs.modalForm.add(getdefault, id)
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.disableSubmit = false
    },
    //  分页查询
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      // 加载数据 若传入参数1则加载第一页的内容
      if (arg === 1 || arg === 2 || arg === 3) {
        this.ipagination.current = 1
      }
      // eslint-disable-next-line no-console
      console.log('父组件传值', this.shipparams, 'title', this.title)

      this.getTd = this.shipparams

      // var params = this.getQueryParams() //查询条件
      this.loading = true
      const that = this
      const params = {}
      params.cusId = this.shipparams
      const getdefaultActiveKey = sessionStorage.getItem('getdefaultActiveKey1')
      if (getdefaultActiveKey === '2') {
        params.cusConType = '1'
      }
      getAction(this.url.list, params).then(res => {
        if (res.success) {
          const getdefaultActiveKey = sessionStorage.getItem('getdefaultActiveKey1')
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
/deep/ .ant-input-disabled {
  color: black;
}
</style>
