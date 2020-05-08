<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="25">
          <a-col :md="6" :sm="8">
            <a-form-item label="姓名">
              <a-input placeholder="请输入规则编码" v-model="queryParam.linkName"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="手机号">
              <a-input placeholder="请选择状态" v-model="queryParam.linkPhone"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- table区域-begin -->
    <div>
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
        >项
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
        <span slot="num" slot-scope="text, record, index">{{
          (ipagination.current - 1) * ipagination.pageSize + index + 1
        }}</span>

        <!-- 回复内容 -->
        <span slot="replyDesc" slot-scope="text, record">
          <a @click="handleDetail(record)">查看详情</a>
        </span>
        <!-- 回复内容 -->

        <!-- 图片 -->
        <template slot="feedbackImg" slot-scope="text, record, index">
          <JImageUpload v-model="dataSource[index].feedbackImg" :isMultiple="true" :valParams="val"></JImageUpload>
        </template>
        <!-- 图片 -->

        <!-- 操作 -->
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">回复</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
    <!-- 表单区域 -->
    <opinion-modal ref="modalForm" @ok="modalFormOk"></opinion-modal>
  </a-card>
</template>

<script>
import { filterObj } from '@/utils/util'
import { getAction, getFileAccessHttpUrl } from '@/api/manage'
// import Vue from 'vue'
// import { ACCESS_TOKEN } from '@/store/mutation-types'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

import api from '@/api/index'
import backstage from '@api/backstage'
import opinionModal from './modules/opinionModal'
import JImageUpload from './modules/JImageUpload'
// import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'

export default {
  name: '',
  mixins: [JeecgListMixin],
  components: { opinionModal, JImageUpload },
  data() {
    return {
      val: '1',
      dataSourceParams: [],
      columns: [{
        title: '序号',
        align: 'center',
        width: 60,
        dataIndex: 'num',
        scopedSlots: {
          customRender: 'num'
        }
      }, {
        title: '意见反馈',
        align: 'center',
        dataIndex: 'feedbackDesc',
        width: 100,
        ellipsis: true,
        customRender: (text, record) => {
          return (
            <a-tooltip placement='top'>
              <template slot='title'>
                <span>{{ text }}</span>
              </template>
              <div style='width:120px;overflow: hidden;white-space: nowrap;text-overflow:ellipsis;'>{{ text }}</div>
            </a-tooltip>
          )
        }
      },
      {
        title: '图片',
        align: 'center',
        dataIndex: 'feedbackImg',
        width: 100,
        scopedSlots: {
          customRender: 'feedbackImg'
        }
      },
      {
        title: '姓名',
        align: 'center',
        ellipsis: true,
        width: 100,
        dataIndex: 'linkName'
      },
      {
        title: '电话',
        align: 'center',
        ellipsis: true,
        width: 150,
        dataIndex: 'linkPhone'

      },
      {
        title: '反馈时间',
        align: 'center',
        ellipsis: true,
        width: 200,
        dataIndex: 'feedbackTime'

      },
      {
        title: '操作人',
        align: 'center',
        ellipsis: true,
        width: 100,
        dataIndex: 'replyBy'

      },
      {
        title: '回复内容',
        align: 'center',
        ellipsis: true,
        width: 200,
        dataIndex: 'replyDesc',
        scopedSlots: {
          customRender: 'replyDesc'
        }

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
      url: api.opinion
    }
  },
  computed: {},

  methods: {
    // 照片
    getAvatarView: function(avatar) {
      console.log('avatar', avatar)

      return getFileAccessHttpUrl(avatar, this.url.imgerver, 'http')
    },
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
      this.loading = true
      getAction(this.url.list, params).then(res => {
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
      // eslint-disable-next-line no-console
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
    }
  }
}
</script>
<style scoped></style>
