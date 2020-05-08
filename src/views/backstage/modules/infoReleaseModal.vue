<!--
 * @Author: your name
 * @Date: 2020-04-20 08:51:19
 * @LastEditTime: 2020-04-20 16:12:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \gswl-web\src\views\backstage\modules\infoReleaseModal.vue
 -->
<template>
  <div>
    <a-modal
      :title="title"
      :width="800"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleSubmit"
      @cancel="close"
      :okButtonProps="{ props: { disabled: disableSubmit } }"
      cancelText="关闭"
      okText="发布"
      style="top:20px;textAlgin:center"
    >
      <a-form :form="form">
        <a-form-item label="广告名称：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
          <a-input placeholder="请输入名称" v-decorator="['advertName', validatorRules.advertName]" />
        </a-form-item>
        <a-form-item label="链接：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
          <a-input placeholder="请输入链接" v-decorator="['advertLink']">
            <a-icon slot="addonAfter" type="setting" />
          </a-input>
        </a-form-item>
        <a-form-item label="广告区域：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
          <j-dict-select-tag
            v-decorator="['advertArea', { initialValue: '1' }, validatorRules.advertArea]"
            placeholder="请选择"
            dictCode="advert_area"
            :triggerChange="true"
          />
        </a-form-item>
        <a-form-item label="时间类型：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
          <j-dict-select-tag
            v-decorator="['timeType', { initialValue: '1' }]"
            placeholder="请选择"
            dictCode="time_type"
            type="radio"
            :triggerChange="true"
            @change="timeTypeChange"
          />
        </a-form-item>
        <a-form-item
          label="时间范围："
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
          v-if="model.timeType === '2'"
        >
          <a-range-picker
            :ranges="{ Today: [moment(), moment().endOf('day')], 'This Month': [moment(), moment().endOf('month')] }"
            showTime
            :defaultValue="defaultValue"
            format="YYYY-MM-DD HH:mm:ss"
            @change="timeChange"
          />
        </a-form-item>
        <a-form-item label="规则编号：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
          <a-input placeholder="请输入规则编号" v-decorator="['sort', validatorRules.sort]" />
        </a-form-item>
        <a-form-item label="描述：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
          <a-input placeholder="请输入描述" type="textArea" v-decorator="['remark']" />
        </a-form-item>
        <a-form-item label="图片：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
          <j-image-upload v-model="imgList" :bizPath="bizPath" :isMultiple="false"  v-if="imgList"></j-image-upload>
        </a-form-item>
      </a-form>
      <template slot="footer" v-if="title === '新增'">
        <a-button type="primary" @click="handleSubmit(0)">
          发布
        </a-button>
        <a-button type="success" @click="handleSubmit(1)">
          存为草稿
        </a-button>
        <a-button type="default" @click="close()">
          取消
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment'
import pick from 'lodash.pick'
import { postAction,putAction } from '@/api/manage'
import api from '@api/index'
import JDate from '@/components/jeecg/JDate'
import JImageUpload from '../../waybill/modules/JImageUpload'


export default {
  name: '',
  components: { JImageUpload, JDate },
  data() {
    return {
      title: '',
      visible: false,
      confirmLoading: false,
      disableSubmit: false,
      form: this.$form.createForm(this),
      validatorRules: {
        sort: { rules: [{ required: true, message: '请输入!' }] },
        advertArea: { rules: [{ required: true, message: '请输入!' }] },
        advertName: { rules: [{ required: true, message: '请输入!' }] }
      },
      model: {},
      layout: 'inline',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      imgList: [],
      bizPath: 'advert',
      startTime: '',
      endTime :'',
      defaultValue:[]
    }
  },
  methods: {
    moment,
    add(record) {
      this.visible = true
      record = {}
    },
    edit(record) {
      this.add(record)
      this.model = Object.assign({}, record)
      console.log('model', this.model)
      this.imgList = this.model.advertImg ? [this.model.advertImg] : []
      this.startTime = this.model.startDate ? this.model.startDate : ""
      this.endTime = this.model.endDate ? this.model.endDate : ""
      this.defaultValue = this.startTime && this.endTime ?[moment(this.startTime,'YYYY-MM-DD HH:mm:ss'), moment(this.endTime,'YYYY-MM-DD HH:mm:ss')]:[]
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.model, 'advertName', 'advertLink', 'advertArea', 'timeType', 'sort', 'remark')
        )
      })
    },
    handleSubmit(advertStatus) {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {

          const formData = Object.assign(this.model, values)
          console.log('formData', formData)

          //  选择临时有效，时间范围必输入
          if (formData.timeType === '2') {
            if (
              formData.startDate === undefined ||
              formData.endDate === undefined ||
              formData.startDate === '' ||
              formData.endDate === ''
            ) {
              this.$message.warning('请输入时间范围')
              return
            }
          }
          // 数据处理
          this.confirmLoading = false
          
          formData.advertImg =Array.isArray(this.imgList) ? this.imgList[0]: this.imgList
          //  类型判断
          if (this.title === '新增') {
          formData.advertStatus = advertStatus
          this.confirmLoading = true

            postAction('/add', formData)
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
          } else if (this.title === '编辑') {
            putAction('/modify', formData)
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
          }
        } else {
          this.$message.warning('请检测页面提示')
        }
      })
    },
    timeTypeChange(value) {
      if (this.model.timeType === '1') {
        this.model.startDate = ""
        this.model.endDate = ""
        this.startTime = ""
        this.endTime = ""
      }
      this.model.timeType = value
    },
    timeChange(dates, dateStrings) {
      this.model.startDate = dateStrings[0]
      this.model.endDate = dateStrings[1]
    },
    close() {
      this.visible = false
      this.form = this.$form.createForm(this)
      this.model = {}
      this.imgList = []
      this.confirmLoading = false
      this.startTime = ''
      this.endTime = ''
      this.defaultValue = []
    }
  }
}
</script>
<style scoped lang="less"></style>
