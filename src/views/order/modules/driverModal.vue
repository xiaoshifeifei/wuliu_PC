<!--
 * @Description:
 * @Date: 2020-03-05 13:03:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-04-30 11:15:52
 -->
<template>
  <a-modal
    title="指派司机"
    :width="1200"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    okText="确定"
    @cancel="handleCancel"
    cancelText="关闭"
    style="top:20px;"
  >
    <!-- ---  订单table区域 --- -->
    <a-table
      ref="table"
      bordered
      size="middle"
      rowKey="id"
      :columns="orderColumns"
      :dataSource="orderTableList"
      :pagination="false"
      :scroll="{ x: true }"
      table-layout="auto"
    >
      <!-- 指派司机运费 -->
      <span slot="freight" slot-scope="text, record, index">
        <a-input v-model="orderTableList[index].freight" placeholder="请输入司机运费" suffix="元"></a-input>
      </span>
    </a-table>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="8" :sm="24">
            <a-form-item>
              <a-input-search
                v-model="queryParam.queryParams"
                placeholder="根据联系人、手机号、车牌号等进行搜索"
                @search="searchQuery"
              />
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="8">
            <a-form-item label="车型：">
              <j-dict-select-tag
                @input="searchQuery"
                v-model="queryParam.vehicleType"
                placeholder="请选择状态"
                dictCode="vehicleType"
              />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="8">
            <a-form-item label="车长：">
              <j-dict-select-tag
                @input="searchQuery"
                v-model="queryParam.vehicleLength"
                placeholder="请选择状态"
                dictCode="vehicleLength"
              />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="8">
            <a-form-item label="状态：">
              <j-dict-select-tag
                @input="searchQuery"
                v-model="queryParam.state"
                placeholder="请选择状态"
                dictCode="vehicleStatus"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- ---  司机表格数据  --- -->
    <a-table
      ref="table"
      bordered
      size="middle"
      rowKey="rowkey"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio' }"
      @change="handleTableChange"
      :customRow="rowClick"
      :scroll="{ x: true }"
      table-layout="auto"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="handledriver(record)" v-if="record.vehicleId">更改司机</a>
        <a-divider type="vertical" v-if="record.vehicleId"></a-divider>
        <a @click="handleVehicle(record)" v-if="record.driverId">更改车辆</a>
      </span>
    </a-table>
    <!-- ---  底部操作  --- -->
    <a-row :gutter="24">
      <a-form :form="form" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-col :span="16">
          <a-form-item label="备注：">
            <a-input v-model="remark"></a-input>
          </a-form-item>
        </a-col>
      </a-form>
    </a-row>
    <!-- --- 弹窗 --- -->
    <edit-vehicle ref="vehiclemodal" @ok="modalFormOk"></edit-vehicle>
    <edit-driver ref="editdrivermodal" @ok="modalFormOk"></edit-driver>
  </a-modal>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import editVehicle from './editVehicle'
import JInput from '@/components/jeecg/JInput.vue'
import editDriver from './editDriver'
import { httpAction } from '@/api/manage'
export default {
  name: 'driverModal',
  mixins: [JeecgListMixin],
  components: { editVehicle, editDriver, JInput },
  data() {
    return {
      url: {
        list: '/base/driver/queryDriverVehicleByParam'
      },
      visible: false,
      confirmLoading: false,
      confirmDirty: false,
      loading: false,
      remark: '',
      receiptType_dictionary: [],
      vehicleLength_dictionary: [],
      vehicleStatus_dictionary: [],
      vehicleType_dictionary: [],
      orderTableList: [],
      /* 分页参数 */
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: false,
        showSizeChanger: true,
        total: 0
      },
      orderColumns: [
        {
          title: '订单号',
          align: 'center',
          dataIndex: 'orderNo'
        },

        {
          title: '出发地',
          align: 'center',
          dataIndex: 'consignorAddr',
          width: 100,
          ellipsis: true
        },
        {
          title: '目的地',
          align: 'center',
          dataIndex: 'consigneeAddr',
          width: 100,
          ellipsis: true
        },
        {
          title: '物品名称',
          align: 'center',
          dataIndex: 'goodsNames',
          width: 120,
          ellipsis: true
        },
        {
          title: '总数量',
          align: 'center',
          dataIndex: 'totalNumber',
          width: 50,
          ellipsis: true
        },
        {
          title: '总重量（吨）',
          align: 'center',
          dataIndex: 'totalWeight',
          width: 50,
          ellipsis: true
        },
        {
          title: '总体积（m³）',
          align: 'center',
          dataIndex: 'totalCube',
          width: 50,
          ellipsis: true
        },
        {
          title: '回单类型',
          align: 'center',
          dataIndex: 'receiptType',
          width: 80,
          customRender: text => {
            // 字典值替换通用方法
            return filterDictText(this.receiptType_dictionary, text)
          },
          ellipsis: true
        },
        {
          title: '回单数量',
          align: 'center',
          dataIndex: 'receiptNo',
          width: 50,
          ellipsis: true
        },
        {
          title: '运费收入',
          align: 'center',
          dataIndex: 'gswlOrderTransfer.freight',
          width: 60,
          ellipsis: true
        },
        {
          title: '司机运费',
          align: 'center',
          dataIndex: 'freight',
          width: 180,
          scopedSlots: {
            customRender: 'freight'
          },
          fixed: 'right'
        }
      ],
      columns: [
        {
          title: '司机',
          align: 'center',
          dataIndex: 'driverName',
          width: 100
        },
        {
          title: '联系电话',
          align: 'center',
          dataIndex: 'driverPhone',
          width: 100
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'state',
          width: 100,
          customRender: text => {
            // 字典值替换通用方法
            return filterDictText(this.vehicleStatus_dictionary, text)
          }
        },
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
          title: '操作',
          align: 'center',
          dataIndex: 'action',
          scopedSlots: {
            customRender: 'action'
          },
          width: 100
        }
      ],

      form: this.$form.createForm(this),

      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      labelCol2: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol2: {
        xs: { span: 24 },
        sm: { span: 20 }
      },
      rowClick: record => ({
        on: {
          click: () => {
            console.log('record', record)
            this.selectedRowKeys = []
            this.selectionRows = []
            this.selectedRowKeys = [record.rowkey]
            this.selectionRows = [record]
          }
        }
      })
    }
  },

  methods: {
    show() {
      this.orderTableList = this.$parent.$parent.selectionRows
      this.initDictConfig()
      console.log('表格数据', this.orderTableList)

      this.visible = true
    },
    modalFormOk() {
      this.selectedRowKeys = []
      this.selectionRows = []
      this.loadData()
    },
    close() {
      this.$emit('ok')
      this.visible = false
      this.disableSubmit = false
      this.gswlOrderGoodsList = []
      this.orderTableList = []
      this.selectedRowKeys = []
      this.selectionRows = []
      this.form.resetFields()
    },
    //  更改司机
    handledriver(record) {
      this.$refs.editdrivermodal.show(record)
    },
    //  更改车辆
    handleVehicle(record) {
      this.$refs.vehiclemodal.show(record)
    },
    handleSubmit() {
      var driverCheck = false
      this.orderTableList.forEach((item, index) => {
        console.log('freight', item.freight)

        if (item.freight == '' || item.freight == undefined) {
          driverCheck = true
          return
        }
      })
      if (driverCheck) {
        this.$message.warning('司机运费不能为空！')
        return
      }
      if (this.selectionRows.length == 0) {
        this.$message.warning('未指派司机！')
        return
      }

      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          console.log('订单数据', this.orderTableList)
          console.log('司机数据', this.selectionRows[0])
          console.log('备注', this.remark)

          const tableData = []
          //  订单数据处理
          this.orderTableList.forEach((item, index) => {
            tableData[index] = {
              orderId: item.id,
              orderNo: item.orderNo,
              freight: parseFloat(item.freight).toFixed(2),
              remark: this.remark
            }
          })
          const obj = {
            driverId: this.selectionRows[0].driverId,
            driverName: this.selectionRows[0].driverName,
            vehicleId: this.selectionRows[0].vehicleId,
            vehicleNo: this.selectionRows[0].vehicleNumber,
            driverPhone: this.selectionRows[0].driverPhone,
            waybillParams: tableData
          }
          console.log('obj', obj)
          httpAction(
            '/order/gswlOrder/designatedDriver/' + this.orderTableList[0].gswlOrderTransfer.orderType,
            obj,
            'POST'
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
        }
      })
    },

    handleCancel() {
      this.close()
    },

    //  -------------字典表处理--------------------
    initDictConfig() {
      // //  回单类型
      initDictOptions('receiptType_dictionary').then(res => {
        if (res.success) {
          this.receiptType_dictionary = res.result
        }
      })
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
/deep/ .ant-row {
  margin-top: 10px;
}
</style>
