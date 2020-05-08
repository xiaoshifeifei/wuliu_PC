<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="25">
          <a-col :md="6" :sm="8">
            <a-form-item label="手机号">
              <a-input placeholder="请输入手机号" v-model="queryParam.telephone"></a-input>
            </a-form-item>
          </a-col>

           <a-col :md="6" :sm="8">
             <a-form-item label="真实姓名">
              <a-input placeholder="请输入真实姓名" v-model="queryParam.driverName"></a-input>
            </a-form-item>
          </a-col>
            <!-- 收起展开列表 -->
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="身份证号：">
                <a-input v-model="queryParam['drivingLicense']" placeholder="请输入收货客户名称"></a-input>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="8">
            <a-form-item label="审核状态：">
              <j-dict-select-tag
                v-model="queryParam.authState"
                placeholder="请选择审核状态"
                dictCode="auth_status"
              />
            </a-form-item>
            </a-col>

          </template>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 8px"
              >重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- table区域-begin -->
    <div>
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div> -->

      <a-table
        ref="table"
        bordered
        rowKey="id"
        size="middle"
        :columns="columns"
         tableLayout="auto"
        :scroll="{ x: true }"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
      <!-- 序号 -->
        <span
          slot="num"
          slot-scope="text, record,index"
        >{{(ipagination.current-1)*ipagination.pageSize+index+1}}</span>
        <!-- 图片 -->
         <template slot="feedbackImg" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <!-- .avatar -->
            <a-avatar shape="square" :src="getAvatarView(record)" icon="user" />
          </div>
        </template>
        <!-- 操作 -->
        <span slot="action" slot-scope="text, record">
          <a @click="driverReviewd(record)">审核</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
    <!-- 表单区域 -->
    <driver-reviewd  ref="modalForm" @ok="modalFormOk"></driver-reviewd>
  </a-card>
</template>

<script>
import { filterObj } from '@/utils/util'
import { deleteAction, getAction, downFile, postAction, editStatus, getFileAccessHttpUrl } from '@/api/manage'
// import Vue from 'vue'
// import { ACCESS_TOKEN } from '@/store/mutation-types'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

import api from '@/api/index'
import backstage from '@api/backstage'
// import JDate from '@/components/jeecg/JDate.vue'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'

import driverReviewd from './modules/driverReviewd'
export default {
  name: '',
  mixins: [JeecgListMixin],
  components: { driverReviewd },
  data() {
    return {
      authState_dictionary: [],
      columns: [{
        title: '序号',
        align: 'center',
        width: 40,
        dataIndex: 'num',
        scopedSlots: {
          customRender: 'num'
        }
      }, {
        title: '是否失效',
        align: 'center',
        dataIndex: 'delFlag',
        width: 60
      },
      {
        title: '真实姓名',
        align: 'center',
        dataIndex: 'driverName',
        ellipsis: true,
        width: 100
      },
      {
        title: '手机号',
        align: 'center',
        ellipsis: true,
        width: 100,
        dataIndex: 'telephone'
      },
      {
        title: '身份证号码',
        align: 'center',
        width: 150,
        ellipsis: true,
        dataIndex: 'drivingLicense'

      },
      {
        title: '当前状态',
        ellipsis: true,
        align: 'center',
        width: 100,
        dataIndex: 'authState_dictText',
        customRender: text => {
          // 字典值替换通用方法
          return filterDictText(this.authState_dictionary, text)
        }

      },
      {
        title: '审核时间',
        align: 'center',
        ellipsis: true,
        width: 200,
        dataIndex: 'authTime'

      },
      {
        title: '操作',
        align: 'center',
        ellipsis: true,
        dataIndex: 'action',
        width: 80,
        scopedSlots: {
          customRender: 'action'
        }
      }
      ],
      url: api.driverContent
    }
  },
  computed: {},

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
      var params = this.getQueryParams() // 查询条件
      // 只有自创的与要审核
      // params.dataSource = '2'
      this.loading = true
      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          res.result.records.map((item) => {
            if (item.delFlag === '1') {
              item.delFlag = '是'
            } else {
              item.delFlag = '否'
            }
          })
          this.dataSource = res.result.records
          this.ipagination.total = res.result.total
        }
        if (res.code === 510) {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
    }, getQueryParams() {
      // 获取查询条件
      const sqp = {}
      if (this.superQueryParams) {
        sqp['superQueryParams'] = encodeURI(this.superQueryParams)
      }
      var param = Object.assign(sqp, this.queryParam, this.isorter, this.filters)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      console.log('查询条件', param)

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
    // 司机审核按钮
    driverReviewd(record) {
      this.$refs.modalForm.add(record)
      this.$refs.modalForm.title = '审核'
      this.$refs.modalForm.disableSubmit = false
    },
    //  -------------字典表处理--------------------
    initDictConfig() {
      //  车辆颜色
      initDictOptions('auth_status').then(res => {
        if (res.success) {
          this.authState_dictionary = res.result
        }
      })
    }

  }
}
</script>
<style scoped>
</style>
