
<!--
 * @Description:
 * @Date: 2020-03-29 13:22:26
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-04-21 22:25:36
 -->
<template>
  <a-modal title="更改车辆"
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
            <a-form-item label="选择车辆：">
              <a-select showSearch
                        allowClear
                        optionFilterProp="children"
                        v-model="queryParam.vehicleNumber"
                        @change="vehicleInfo">
                <a-select-option v-for="(role,roleindex) in roleList"
                                 :key="roleindex.toString()"
                                 :value="role.vehicleNumber">{{ role.vehicleNumber }}</a-select-option>
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
               rowKey="vehicleNumber"
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
import { OrderApi } from '@api/order'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import { putHeaderAction, getAction } from '@/api/manage'

export default {
  name: '',
  mixins: [JeecgListMixin],
  components: {},
  data() {
    return {
      url: {
        list: '/vehicle/gswlBaseVehicle/list',
        modifyDriverVehicle: '/vehicle/gswlBaseVehicle/modifyDriverVehicle'
      },
      queryParam: {
        vehicleState: '0'
      },
      visible: false,
      confirmLoading: false,
      confirmDirty: false,
      loading: false,
      record: {},
      roleList: [],
      vehicleLength_dictionary: [],
      vehicleStatus_dictionary: [],
      vehicleType_dictionary: [],
      columns: [
        {
          title: '车牌号',
          align: 'center',
          dataIndex: 'vehicleNumber',
          width: 100
        },
        {
          title: '车型',
          align: 'center',
          dataIndex: 'vehicleType',
          width: 100,
          customRender: text => {
            // 字典值替换通用方法
            return filterDictText(this.vehicleType_dictionary, text)
          }
        },
        {
          title: '车长',
          align: 'center',
          dataIndex: 'vehicleLength',
          width: 100,
          customRender: text => {
            // 字典值替换通用方法
            return filterDictText(this.vehicleLength_dictionary, text)
          }
        },
        {
          title: '车宽',
          align: 'center',
          dataIndex: 'vehicleWide',
          width: 100
        },
        {
          title: '车高',
          align: 'center',
          dataIndex: 'vehicleHeight',
          width: 100
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'vehicleState',
          width: 100,
          customRender: text => {
            // 字典值替换通用方法
            return filterDictText(this.vehicleStatus_dictionary, text)
          }
        }
      ],
      rowClick: record => ({
        on: {
          dblclick: () => {
            this.vehicleInfo(record.vehicleNumber)
          },
          click: () => {
            this.vehicleInfo(record.vehicleNumber)
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
      this.queryParam = {
        vehicleState: 0
      }
      this.loadData(1)
    },
    //  提交
    handleSubmit() {
      console.log('指派司机table信息', this.record)
      console.log('选中车辆信息', this.selectionRows)
      if (this.selectionRows.length == 0) {
        this.$message.warning('请选择车辆')
        return
      }
      const obj = {
        vehicleId: this.selectionRows[0].id,
        driverId: this.record.driverId
      }
      putHeaderAction(this.url.modifyDriverVehicle, obj).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.close()
        } else {
          this.$message.warning(res.message)
          this.close()
        }
      })
    },
    //  关闭
    handleCancel() {
      this.close()
    },
    //  车辆下拉列表
    initialRoleList() {
      getAction(this.url.list, { pageSize: 99999, vehicleState: 0 }).then(res => {
        if (res.success) {
          console.log('res.result.records', res.result.records)
          this.roleList = res.result.records
        }
      })
    },
    vehicleInfo(vehicleNumber) {
      this.queryParam.vehicleNumber = vehicleNumber
      this.selectedRowKeys = []
      this.selectionRows = []
      this.selectedRowKeys = [vehicleNumber]
      const roleList = JSON.parse(JSON.stringify(this.roleList))
      this.selectionRows = roleList.filter(item => item.vehicleNumber == vehicleNumber)
      //  点击清空
      if (vehicleNumber == undefined) {
        this.loadData(1)
      } else {
        this.ipagination.current = 1
        this.ipagination.total = 1
        this.dataSource = this.selectionRows
      }
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
  @import url('../orderCommon.less');

</style>
