<template>
  <a-modal title="更改司机"
           :width="800"
           :visible="visible"
           :confirmLoading="confirmLoading"
           @ok="handleSubmit"
           okText="确定"
           @cancel="handleCancel"
           cancelText="关闭"
           style="top:20px;">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline"
              @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="24"
                 :sm="24">
            <a-form-item label="选择司机：">
              <a-select showSearch
                        allowClear
                        optionFilterProp="children"
                        v-model="queryParam.id"
                        @change="driverInfo">
                <a-select-option v-for="(role,roleindex) in roleList"
                                 :key="roleindex.toString()"
                                 :value="role.id">{{ role.driverName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- table区域 -->
    <div>
      <!-- table区域-begin -->

      <a-table ref="table"
               bordered
               size="middle"
               rowKey="id"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="ipagination"
               :loading="loading"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type	:'radio'}"
               @change="handleTableChange"
               :customRow="rowClick"></a-table>
    </div>
  </a-modal>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction, putHeaderAction } from '@/api/manage'
export default {
  name: '',
  mixins: [JeecgListMixin],
  components: {},
  data() {
    return {
      url: {
        list: '/base/driver/getDriverByNameOrPhone',
        modifyDriverVehicle: '/vehicle/gswlBaseVehicle/modifyDriverVehicle'
      },
      visible: false,
      confirmLoading: false,
      confirmDirty: false,
      loading: false,
      record: {},
      roleList: [],
      columns: [
        {
          title: '司机',
          align: 'center',
          dataIndex: 'driverName'
        },
        {
          title: '手机号',
          align: 'center',
          dataIndex: 'telephone'
        },
        {
          title: '身份证号',
          align: 'center',
          dataIndex: 'drivingLicense'
        }
      ],
      rowClick: record => ({
        on: {
          dblclick: () => {
            this.driverInfo(record.id)
          },
          click: () => {
            this.driverInfo(record.id)
          }
        }
      })
    }
  },
  methods: {
    show(record) {
      this.visible = true
      this.record = record
      this.initialRoleList()
    },
    close() {
      this.$emit('ok')
      this.visible = false
      this.selectionRows = []
      this.selectedRowKeys = []
      this.queryParam = {}
      this.loadData(1)
    },
    //  提交
    handleSubmit() {
      if (this.selectionRows.length == 0) {
        this.$message.warning('请选择司机')
        return
      }
      const obj = {
        vehicleId: this.record.vehicleId,
        driverId: this.selectionRows[0].id
      }
      putHeaderAction(this.url.modifyDriverVehicle, obj).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.close()
        } else {
          this.$message.warning(res.message)
        }
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
          console.log('res.result.records', res.result.records)
          this.roleList = res.result.records
        }
      })
    },
    driverInfo(id) {
      console.log('id', id)

      this.queryParam.id = id
      this.selectedRowKeys = []
      this.selectionRows = []
      this.selectedRowKeys = [id]
      const roleList = JSON.parse(JSON.stringify(this.roleList))
      this.selectionRows = roleList.filter(item => item.id == id)
      //  点击清空
      if (id == undefined) {
        this.loadData(1)
      } else {
        this.ipagination.current = 1
        this.ipagination.total = 1
        this.dataSource = this.selectionRows
      }
    },
    initDictConfig() {}
  }
}
</script>
<style scoped lang="less">
</style>
