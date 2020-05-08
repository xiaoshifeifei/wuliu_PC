<!--
 * @Author: your name车辆审核
 * @Date: 2020-04-17 10:26:13
 * @LastEditTime: 2020-04-29 16:47:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \gswl-web\src\views\backstage\vehicle.vue
 -->
<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline"
              @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6"
                 :sm="8">
            <a-form-item label="车牌号码：">
              <a-input placeholder="请输入车牌号码"
                       v-model="queryParam.vehicleNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6"
                 :sm="8">
            <a-form-item label="车牌类型：">

              <j-dict-select-tag v-model="queryParam.vehicleType"
                                 placeholder="请选择车牌类型"
                                 dictCode="vehicleType" />
            </a-form-item>
          </a-col>
          <a-col :md="6"
                 :sm="8">
            <a-form-item label="审核状态">
              <j-dict-select-tag v-model="queryParam.authState"
                                 placeholder="请选择状态"
                                 dictCode="auth_status" />
            </a-form-item>
          </a-col>
          <a-col :md="6"
                 :sm="8">
            <span style="float: left;overflow: hidden;"
                  class="table-page-search-submitButtons">
              <a-button type="primary"
                        @click="searchQuery"
                        icon="search">查询</a-button>
              <a-button type="default"
                        @click="searchReset"
                        icon="reload"
                        style="margin-left: 8px">重置</a-button>

            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- table区域 -->
    <div>
      <a-table ref="table"
               bordered
               size="middle"
               rowKey="id"
               :columns="columns"
               :dataSource="dataSource"
               :scroll="{x:true}"
               table-layout="auto"
               :pagination="ipagination"
               :loading="loading"
               @change="handleTableChange">
        <!-- //TODO 序号-->
        <span slot="number"
              slot-scope="text, record,index">{{(ipagination.current-1)*ipagination.pageSize+index+1}}</span>
        <!-- //是否失效 -->
        <span slot="delFlag"
              slot-scope="text">
          <a-switch checkedChildren="是"
                    unCheckedChildren="否"
                    :defaultChecked="text.delFlag == 0? true :false "
                    disabled />
        </span>
        <!-- //合作类型 -->
        <span slot="vtype"
              slot-scope="text">
          <div v-if="text === '0'">自有</div>
          <div v-if="text === '1'">外协</div>
        </span>

        <!-- //TODO 操作-->
        <span slot="action"
              slot-scope="text, record">
          <a @click="handleEdit(record)">审核</a>
          <a-divider type="vertical"></a-divider>
          <a href="javascript:;"
             @click="handleDetail(record)">详情</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <vehicle-modal ref="modalForm" @ok="modalFormOk"></vehicle-modal>

  </a-card>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import vehicleModal from './modules/vehicleModal'
import moment from 'moment'

export default {
  name: '',
  mixins: [JeecgListMixin],
  components: { vehicleModal },
  data() {
    return {
      url: {
        list: '/vehicle/gswlBaseVehicle/authList'
      },
      carStatus_dictionary: [],
      authStatus_dictionary: [],
      columns: [
        {
          title: '序号',
          align: 'center',
          ellipsis: true,
          width: 60,
          dataIndex: 'number',
          scopedSlots: {
            customRender: 'number'
          }
        },
        {
          title: '申请审核时间',
          ellipsis: true,
          align: 'center',
          dataIndex: 'createTime',
          sorter: (a, b) => (moment(a['createTime'])).valueOf() - (moment(b['createTime'])).valueOf()
        },
        {
          title: '车牌号',
          ellipsis: true,
          align: 'center',
          dataIndex: 'vehicleNumber'

        },
        {
          title: '是否失效',
          align: 'center',
          ellipsis: true,
          dataIndex: 'delFlag',
          scopedSlots: {
            customRender: 'delFlag'
          }
        },
        {
          title: '合作类型',
          align: 'center',
          ellipsis: true,
          dataIndex: 'vtype',
          scopedSlots: {
            customRender: 'vtype'
          }
        },
        {
          title: '车辆类型',
          align: 'center',
          dataIndex: 'vehicleType',
          customRender: text => {
            // 字典值替换通用方法
            return filterDictText(this.carStatus_dictionary, text)
          },
          ellipsis: true
        },
        {
          title: '道路运输证',
          ellipsis: true,
          align: 'center',
          dataIndex: 'roadTransportCertificateNumber'

        },
        {
          title: '核定载重（t）',
          ellipsis: true,
          align: 'center',
          dataIndex: 'vehicleTonnage'

        },
        {
          title: '核定体积（m³）',
          align: 'center',
          ellipsis: true,
          dataIndex: 'vehicleVolume'

        },
        {
          title: '车长（cm）',
          ellipsis: true,
          align: 'center',
          dataIndex: 'vehicleLength'
        },
        {
          title: '车宽(cm)',
          align: 'center',
          ellipsis: true,
          dataIndex: 'vehicleWide'

        },
        {
          title: '车高（cm）',
          ellipsis: true,
          align: 'center',
          dataIndex: 'vehicleHeight'
        },
        {
          title: '审核时间',
          align: 'center',
          ellipsis: true,
          dataIndex: 'authTime'
        },
        {
          title: '当前状态',
          ellipsis: true,
          align: 'center',
          dataIndex: 'authState',
          customRender: text => {
            // 字典值替换通用方法
            return filterDictText(this.authStatus_dictionary, text)
          }
        },
        {
          title: '操作',
          ellipsis: true,
          align: 'center',
          dataIndex: 'action',
          scopedSlots: {
            customRender: 'action'
          }
        }
      ]
    }
  },
  methods: {
    //  编辑
    handleEdit: function(record) {
      // 非待审核状态车辆不能审核
      if (record.authState !== '0') {
        this.$message.warning('非待审核状态车辆不能审核')
        return
      }
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = '审核'
      this.$refs.modalForm.disableSubmit = false
    },

    //  -------------字典表处理--------------------
    initDictConfig() {
      // 状态
      initDictOptions('advert_status').then(res => {
        if (res.success) {
          this.advertStatus_dictionary = res.result
        }
      })
      // 审核状态

      initDictOptions('auth_status').then(res => {
        if (res.success) {
          this.authStatus_dictionary = res.result
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
@import url('./backstage.less');
</style>
