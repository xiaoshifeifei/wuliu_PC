<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <div class="tabs">
        <a-radio-group  v-model="dataType" @change="showChange">
          <a-radio-button value="">全部</a-radio-button>
          <a-radio-button value="1">发货信息</a-radio-button>
          <a-radio-button value="0">收货信息</a-radio-button>
        </a-radio-group>
        <a-button @click="handleNewAdd" type="primary" icon="plus" style="margin-left:20px">新增</a-button>
      </div>
    </div>
    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        bordered
        rowKey="id"
        size="middle"
        tableLayout="auto"
        :scroll="{ x: 600 }"
        :columns="columns"
        :customRow="rowClick"
        :loading="loading"
        :dataSource="dataSource"
        :pagination="ipagination"
        @change="handleTableChange"
      >
        <!-- //TODO 序号-->
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical"></a-divider>
          <a @click="handleDelete(record.id)">删除</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
    <!-- 表单区域 -->
    <clien-contact-modal ref="modalForm" @ok="modalFormOk"></clien-contact-modal>
  </a-card>
</template>

<script>
import {
  filterObj
} from '@/utils/util'
// import Vue from 'vue'
import clienContactModal from './modules/clienContactModal'
import {
  getAction
} from '@/api/manage'
// import { ACCESS_TOKEN } from '@/store/mutation-types'
import {
  JeecgListMixin
} from '@/mixins/JeecgListMixin'
import api from '@/api/index'
import { receiveTableData } from './const.js'
export default {
  name: '',
  mixins: [JeecgListMixin],
  components: {
    clienContactModal
  },
  data() {
    return {
      customerId: '',
      carParams: '',
      dataType: '',
      rowClick: record => ({
        on: {
          dblclick: () => {
            // this.handleDetail(record)
          }
        }
      }),
      columns: receiveTableData(this) || [],
      url: api.customerUrl.customerId
    }
  },
  created() {
    // this.columns = this.columnsAll
  },
  methods: {
    showChange() {
      this.columns = receiveTableData(this)
      this.loadData(this.dataType)
    },
    //  分页查询
    loadData(arg) {
      localStorage.setItem('getShow', this.show)

      if (!this.url) {
        this.$message.error('请设置url属性!')
        return
      }

      // 加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }

      var params = this.getQueryParams() // 查询条件
      params.contactsType = this.dataType
      // if (this.show === 'all') {
      //   params.contactsType = '0'
      // } else if (this.show === 'enable') {
      //   params.contactsType = '1'
      // } else if (this.show === 'everyOne') {
      //   params.contactsType = ''
      // }
      params.customerId = JSON.parse(localStorage.getItem('pro__Login_Userinfo')).value.dataId
      this.loading = true
      getAction(this.url.list, params).then(res => {
        if (res.success) {
          if (res.result.records.length) {
            const customerId = res.result.records[0].customerId
            sessionStorage.setItem('id', customerId)
          }
          // if (this.dataType === '') {
          //   this.dataSource = res.result.records.filter(item => {
          //     return item.contactsType === '0'
          //   })
          //   this.ipagination.total = res.result.total
          // } else if (this.show === 'enable') {
          //   this.dataSource = res.result.records.filter(item => {
          //     return item.contactsType === '1'
          //   })
          //   this.ipagination.total = res.result.total
          // } else if (this.show === 'everyOne') {
          // this.dataSource = res.result.records.filter(item => {
          // return item
          // })
          this.dataSource = res.result.records
          this.ipagination.total = res.result.total
          // }
        }

        this.loading = false
      })
    },
    getQueryParams() {
      // 获取查询条件
      const sqp = {}
      if (this.superQueryParams) {
        sqp['superQueryParams'] = encodeURI(this.superQueryParams)
      }
      var param = Object.assign(sqp, this.queryParam, this.isorter, this.filters)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      return filterObj(param)
    },
    getQueryField() {
      // TODO 字段权限控制
      var str = 'id,'
      this.columns.forEach(function(value) {
        str += ',' + value.dataIndex
      })
      return str
    },
    //  新增
    handleNewAdd(getdefault, customerId) {
      this.$refs.modalForm.add(getdefault, customerId)
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.disableSubmit = false
    }
  }
}
</script>
<style scoped></style>
