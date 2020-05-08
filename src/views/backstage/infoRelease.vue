<!--
 * @Author: your name信息发布
 * @Date: 2020-04-17 10:26:13
 * @LastEditTime: 2020-04-29 16:26:12
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
            <a-form-item label="规则编号：">
              <a-input placeholder="请输入规则编号"
                       v-model="queryParam.sort"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="状态">
              <j-dict-select-tag v-model="queryParam.advertStatus"
                                 placeholder="请选择状态"
                                 dictCode="advert_status" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
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
    <!-- 操作按钮区域 -->
    <div class="table-operator"
         style="border-top: 5px">

      <a-button @click="handleAdd"
                 type="primary">新增</a-button>
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
        <!-- //图片显示与预览 -->
        <span slot="advertImg"
              slot-scope="text,record,index">
          <JImageUpload v-model="dataSource[index].advertImg" :isMultiple="true" :valParams="val"></JImageUpload>
        </span>
        <!-- //TODO 操作-->
        <span slot="action"
              slot-scope="text, record">
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical"></a-divider>
          <a @click="handleDeleteStatus(record)" v-if="record.advertStatus !== '0'">发布</a>
          <a-divider type="vertical" v-if="record.advertStatus !== '0'"></a-divider>
          <a @click="handleDeleteStatus(record)" v-if="record.advertStatus === '0'">禁用</a>
          <a-divider type="vertical" v-if="record.advertStatus === '0'"></a-divider>
          <a href="javascript:;"
             @click="handleDetail(record)">详情</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <infoRelease-modal ref="modalForm" @ok="modalFormOk"></infoRelease-modal>

  </a-card>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import infoReleaseModal from './modules/infoReleaseModal'
import { putHeaderAction } from '@/api/manage'
import JImageUpload from './modules/JImageUpload'
export default {
  name: '',
  mixins: [JeecgListMixin],
  components: { infoReleaseModal, JImageUpload },
  data() {
    return {
      val: '2',
      url: {
        list: '/list'

      },
      carStatus_dictionary: [],
      advertStatus_dictionary: [],
      columns: [
        {
          title: '序号',
          align: 'center',
          ellipsis: true,
          dataIndex: 'number',
          width: 50,
          scopedSlots: {
            customRender: 'number'
          }
        },
        {
          title: '规则编号',
          ellipsis: true,
          align: 'center',
          dataIndex: 'sort',
          width: 50
        },
        {
          title: '名称',
          align: 'center',
          ellipsis: true,
          dataIndex: 'advertName',
          width: 100
        },
        {
          title: '广告区域',
          align: 'center',
          ellipsis: true,
          dataIndex: 'advertArea_dictText',
          width: 100
        },
        {
          title: '描述',
          align: 'center',
          ellipsis: true,
          width: 150,
          dataIndex: 'remark'
        },
        {
          title: '图片',
          align: 'center',
          ellipsis: true,
          width: 100,
          dataIndex: 'advertImg',
          scopedSlots: {
            customRender: 'advertImg'
          }
        },
        {
          title: '状态',
          ellipsis: true,
          align: 'center',
          dataIndex: 'advertStatus',
          width: 100,
          customRender: text => {
            // 字典值替换通用方法
            return filterDictText(this.advertStatus_dictionary, text)
          }
        },

        {
          title: '操作时间',
          ellipsis: true,
          align: 'center',
          dataIndex: 'updateTime',
          width: 100
        },
        {
          title: '操作人',
          ellipsis: true,
          align: 'center',
          dataIndex: 'updateBy',
          width: 80
        },
        {
          title: '操作',
          ellipsis: true,
          align: 'center',
          dataIndex: 'action',
          width: 150,
          scopedSlots: {
            customRender: 'action'
          }
        }
      ]
    }
  },
  methods: {
    //  发布禁用
    handleDeleteStatus(record) {
      console.log('record', record)
      const aa = Object.assign({}, record)
      if (aa.advertStatus === '0') {
        aa.advertStatus = '2'
      } else {
        aa.advertStatus = '0'
      }
      putHeaderAction('/isPublishAdvert/' + aa.advertStatus, {
        advertStatus: aa.advertStatus,
        advertArea: aa.advertArea,
        id: aa.id
      }).then(res => {
        if (res.success) {
          this.$message.success(res.message)
        } else {
          this.$message.warning(res.message)
        }
      })
        .finally(() => {
          this.loadData(1)
        })
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
