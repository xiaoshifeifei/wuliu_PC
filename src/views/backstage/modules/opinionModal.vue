<!--
 * @Description:
 * @Date: 2020-03-10 14:58:53
 * @LastEditors: 自己洗小红花
 * @LastEditTime: 2020-03-16 13:28:46
 -->
<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    :okButtonProps="{ props: { disabled: disableSubmit } }"
    @cancel="close"
    cancelText="关闭"
    okText="提交"
    style="top:20px;"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          label="回复内容："
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
          v-if="this.title === '编辑'"
        >
          <a-input placeholder="请输入回复内容" rows="8" type="textarea" v-decorator="['replyDesc']" :disabled="title === '详情'"/>
        </a-form-item>
        <a-form-item
          v-if="this.title === '详情'"
          label="回复内容："
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
        >
          <a-input placeholder="请输入名称" v-decorator="['replyDesc', validatorRules.replyDesc]" :disabled="title === '详情'"/>
        </a-form-item>

        <a-form-item
          v-if="this.title === '详情'"
          label="姓名："
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
        >
          <a-input placeholder="请输入姓名!" v-decorator="['linkName', validatorRules.linkName]" :disabled="title === '详情'"/>
        </a-form-item>
        <a-form-item
          v-if="this.title === '详情'"
          label="意见反馈："
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
        >
          <a-input  placeholder="请输入意见反馈!" rows="8" type="textarea" v-decorator="['feedbackDesc', validatorRules.feedbackDesc]" :disabled="title === '详情'"/>
        </a-form-item>
        <a-form-item
          v-if="this.title === '详情'"
          label="电话："
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
        >
          <a-input placeholder="请输入电话号码!" v-decorator="['linkPhone', validatorRules.linkPhone]" :disabled="title === '详情'"/>
        </a-form-item>
        <a-form-item
          v-if="this.title === '详情'"
          label="反馈时间："
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
        >
          <a-input placeholder="请选择反馈时间!" v-decorator="['linkPhone', validatorRules.linkPhone]" :disabled="title === '详情'"/>
        </a-form-item>
        <a-form-item
          v-if="this.title === '详情'"
          label="操作人："
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
        >
          <a-input placeholder="请选择反馈时间!" v-decorator="['feedbackTime', validatorRules.feedbackTime]" :disabled="title === '详情'"/>
        </a-form-item>

        <a-form-item
          v-if="this.title === '详情'"
          label="图片："
          :labelCol="{ span: 6 }"
          :wrapperCol="{ span: 8 }"
          hasFeedback
        >
          <j-image-upload v-model="feedbackImg" :isMultiple="false" :bizPath="bizPath"></j-image-upload>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import pick from 'lodash.pick'
import {
  putAction
} from '@/api/manage'
import api from '@/api/index'
import {
  basicsApi
} from '@api/basics'
import JImageUpload from './JImageUpload'
import JDate from '@/components/jeecg/JDate.vue'
// import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
export default {
  name: '',
  components: {
    JDate,
    JImageUpload
  },
  data() {
    return {
      feedbackDesc: '',
      linkName: '',
      feedbackTime: '',
      linkPhone: '',
      replyDesc: '',
      replyBy: '',
      feedbackImg: [],
      url: api.opinion,
      disableSubmit: false,
      title: '',
      confirmLoading: false,
      visible: false,
      model: {},
      form: this.$form.createForm(this),
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 6
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 16
        }
      },
      validatorRules: {
        replyDesc: {
          rules: [{
            message: '请输入物品名称!'
          }]
        },
        linkName: {
          rules: [{
            message: '请输入姓名!'
          }]
        },
        feedbackDesc: {
          rules: [{
            message: '请输入意见反馈!'
          }]
        },
        linkPhone: {
          rules: [{
            message: '请输入电话号码!'
          }]
        },
        replyBy: {
          rules: [{
            message: '请输入操作人!'
          }]
        },
        feedbackTime: {
          rules: [{
            message: '请选择反馈时间!'
          }]
        }
      }
    }
  },
  methods: {
    add(record) {
      this.visible = true
    },
    edit(record) {
      this.visible = true
      this.model = Object.assign({}, record)
      if (this.model.feedbackImg) {
        this.feedbackImg = this.model.feedbackImg.split(',')
      } else if (this.model.feedbackImg === null) {
        this.feedbackImg = []
      }
      this.feedbackDesc = this.model.feedbackDesc
      this.linkName = this.model.linkName
      this.linkPhone = this.model.linkPhone
      this.feedbackTime = this.model.feedbackTime
      this.replyBy = this.model.replyBy
      this.replyDesc = this.model.replyDesc

      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.model, 'replyDesc', 'linkName', 'feedbackDesc', 'linkPhone', 'replyBy', 'feedbackTime')
        )
      })
    },
    close() {
      this.visible = false
      this.confirmLoading = false
      this.model = {}
      this.form.resetFields()
    },
    handleSubmit() {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          const that = this
          that.$nextTick(() => {
            that.form.setFieldsValue(pick(that.model, 'replyDesc', 'feedbackImg'))
          })
          const gswlCommonFeedback = Object.assign(that.model, values)
          // eslint-disable-next-line no-console
          console.log('formData', gswlCommonFeedback)
          //  修改
          putAction(this.url.edit, gswlCommonFeedback)
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
              // this.close()
            })
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
/deep/ .ant-input-disabled {
color:black
}</style>
