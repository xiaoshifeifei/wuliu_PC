<template>
  <a-modal
    title="更改司机"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    okText="确定"
    @cancel="handleCancel"
    cancelText="关闭"
    style="top:20px;"
  >
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item label="选择司机：">
              <a-select
                showSearch
                allowClear
                optionFilterProp="children"
                v-model="queryParam.id"
                @change="vehicleInfo"
              >
                <a-select-option
                  v-for="(role,roleindex) in roleList"
                  :key="roleindex.toString()"
                  :value="role.id"
                >{{ role.driverName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- table区域 -->
    <div>
      <!-- table区域-begin -->

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
        :customRow="rowClick"
      ></a-table>
    </div>
  </a-modal>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { basicsApi } from '@api/basics'
import api from '@/api/index'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
import { getAction } from '@/api/manage'
export default {
  name: '',
  mixins: [JeecgListMixin],
  components: {},
  data() {
    return {
      // url: {
      //   list: '/base/driver/list'
      // },
      url: api.driverUrl,
      visible: false,
      confirmLoading: false,
      confirmDirty: false,
      loading: false,
      model: {},
      record: {},
      roleList: [],
      form: this.$form.createForm(this),
      vehicleLength_dictionary: [],
      vehicleStatus_dictionary: [],
      vehicleType_dictionary: [],
      columns: [
        {
          title: '司机',
          align: 'center',
          dataIndex: 'driverName',
          width: 50
        },
        {
          title: '手机号',
          align: 'center',
          dataIndex: 'telephone',
          width: 100
        },
        {
          title: '身份证号',
          align: 'center',
          dataIndex: 'drivingLicense',
          width: 250
        }
      ],
      rowClick: record => ({
        on: {
          dblclick: () => {
            this.vehicleInfo(record.id)
          },
          click: () => {
            this.vehicleInfo(record.id)
          }
        }
      })
    }
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
      // var params = this.getQueryParams() //查询条件
      this.loading = true
      getAction(this.url.list, {}).then(res => {
        if (res.success) {
          this.dataSource = res.result.records
          this.ipagination.total = res.result.total
        }
        if (res.code === 510) {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
    },
    show(record) {
      this.queryParam.id = ''
      this.visible = true
      this.record = record
      this.initialRoleList()
      this.loadData()
    },
    close() {
      this.visible = false
      this.confirmLoading = false
      this.model = {}
      this.form.resetFields()
      this.disableSubmit = false
    },
    //  提交
    handleSubmit() {
      // eslint-disable-next-line no-console
      console.log('指派司机table信息', this.record)
      // eslint-disable-next-line no-console
      console.log('选中车辆信息', this.selectionRows)
      const obj = {}
      obj.vehicleId = this.record.id
      obj.driverId = this.selectionRows[0].id

      basicsApi
        .editDriver(obj)
        .then(res => {
          if (res.success) {
            this.$message.success(res.message)
            this.$emit('ok')
            this.close()
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.confirmLoading = false
          // this.close()
        })
    },
    //  关闭
    handleCancel() {
      this.close()
    },
    //  车辆下拉列表
    initialRoleList() {
      getAction(this.url.list, { pageSize: 99999 }).then(res => {
        if (res.success) {
          this.roleList = res.result.records
        }
      })
    },
    vehicleInfo(id) {
      this.queryParam.id = id
      this.selectedRowKeys = []
      this.selectionRows = []
      this.selectedRowKeys = [id]
      const roleList = JSON.parse(JSON.stringify(this.roleList))
      this.selectionRows = roleList.filter(item => item.id === id)
      this.searchQuery()
    },
    initDictConfig() {
      //  车辆类型
      initDictOptions('vehicleType').then(res => {
        if (res.success) {
          this.vehicleType_dictionary = res.result
        }
      })
      //  车辆状态
      initDictOptions('vehicleStatus').then(res => {
        if (res.success) {
          this.vehicleStatus_dictionary = res.result
        }
      })
      //  车长
      initDictOptions('vehicleLength').then(res => {
        if (res.success) {
          this.vehicleLength_dictionary = res.result
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
