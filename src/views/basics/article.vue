<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="12">
            <a-form-item label="物品名称：">
              <a-input placeholder="请输入物品名称" v-model="queryParam.descriptionOfGoods"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="物品类型:">
              <j-dict-select-tag
                dictCode="cargoClassificationCode"
                v-model="queryParam.cargoTypeClassificationCode"
                placeholder="请选择货物类型"
              ></j-dict-select-tag>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="default" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 操作按钮区域 -->
    <div class="table-operator" style="border-top: 5px">
      <div class="block">
        <div class="ant-alert ant-alert-info">
          <i class="anticon anticon-info-circle ant-alert-icon"></i>已选择&nbsp;
          <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
          >项&nbsp;&nbsp;
          <a style="margin-left: 24px" @click="onClearSelected">清空</a>
        </div>

          <a-button @click="handleAdd" type="primary">新增</a-button>

          <a-button @click="batchDel" type="danger" ghost>删除</a-button>

      </div>
    </div>

    <!-- table区域 -->
    <div>
      <!-- table区域-begin -->

      <a-table
        ref="table"
        bordered
        size="middle"
        rowKey="id"
        tableLayout="auto"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :scroll="{ x: true }"
        @change="handleTableChange"
        :customRow="rowClick"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical"></a-divider>
          <a @click="handleDelete(record.id)">删除</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <article-modal ref="modalForm" @ok="modalFormOk"></article-modal>
  </a-card>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

import ArticleModal from './modules/articleModal'
import { filterObj } from '@/utils/util'
import { getAction } from '@/api/manage'
import api from '@/api/index'
// import tableData from '@api/tableData'
import JDate from '@/components/jeecg/JDate.vue'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'

export default {
  name: '',
  mixins: [JeecgListMixin],
  components: { ArticleModal, JDate },
  data() {
    return {
      url: api.basiceUrl,
      rowClick: record => ({
        on: {
          dblclick: () => {
            // this.handleDetail(record)
          }
        }
      }),
      queryParam: {},
      articleType_dictionary: [],
      cargoPackCode_dictionary: [],
      columns: [
        {
          title: '序号',
          align: 'center',
          ellipsis: true,
          width: 60,
          customRender: (text, record, index) => `${index + 1}`
        },
        {
          title: '物品名称',
          align: 'center',
          width: 150,
          ellipsis: true,
          dataIndex: 'descriptionOfGoods'
        },
        {
          title: '物品类型',
          align: 'center',
          ellipsis: true,
          width: 100,
          dataIndex: 'cargoTypeClassificationCode',
          scopedSlots: {
            customRender: 'cargoTypeClassificationCode'
          },
          customRender: text => {
            // 字典值替换通用方法
            return filterDictText(this.articleType_dictionary, text)
          }
        },
        {
          title: '物品包装',
          align: 'center',
          width: 60,
          ellipsis: true,
          dataIndex: 'cargoPackCode',
          scopedSlots: {
            customRender: 'cargoPackCode'
          },
          customRender: text => {
            // 字典值替换通用方法
            return filterDictText(this.cargoPackCode_dictionary, text)
          }
        },
        {
          title: '重量(吨)',
          align: 'center',
          width: 60,
          ellipsis: true,
          dataIndex: 'goodsItemGrossWeight'
        },
        {
          title: '体积(m³)',
          align: 'center',
          ellipsis: true,
          width: 60,
          dataIndex: 'cube'
        },
        {
          title: '总件数(件)',
          align: 'center',
          ellipsis: true,
          width: 60,
          dataIndex: 'totalNumberOfPackages'
        },
        {
          title: '创建时间',
          align: 'center',
          ellipsis: true,
          width: 100,
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          ellipsis: true,
          align: 'center',
          width: 100,
          dataIndex: 'action',
          scopedSlots: {
            customRender: 'action'
          }
        }
      ]
    }
  },
  methods: {
    searchReset() {
      this.queryParam = {
        dataId: JSON.parse(localStorage.getItem('pro__Login_Userinfo')).value.dataId
      }
      this.loadData(1)
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
      params.dataId = JSON.parse(localStorage.getItem('pro__Login_Userinfo')).value.dataId
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
    },
    //  -------------字典表处理--------------------
    initDictConfig() {
      //  物品类型状态
      initDictOptions('cargoClassificationCode').then(res => {
        if (res.success) {
          this.articleType_dictionary = res.result
        }
      })
      //  物品类型状态
      initDictOptions('cargoPackCode').then(res => {
        if (res.success) {
          this.cargoPackCode_dictionary = res.result
        }
      })
    }
  }
}
</script>
<style scoped lang="less">

</style>
