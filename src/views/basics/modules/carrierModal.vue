<!--
 * @Description:
 * @Date: 2020-03-12 10:35:46
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-04-23 11:06:28
 -->
<template>
  <a-modal
    :title="title"
    :width="1200"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="close"
    :okButtonProps="{ props: { disabled: disableSubmit } }"
    cancelText="关闭"
    okText="提交"
    style="top:20px;"
  >
    <a-collapse v-model="defaultActiveKey">
      <a-collapse-panel header="企业信息" key="1">
         <p>注：联系电话为登陆账号。</p>
        <a-spin :spinning="confirmLoading">
          <a-form :form="form" :layout="layout">
            <a-form-item label="账号：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback v-if="addShow">
              <a-input
                placeholder="请输入账号"
                v-decorator="['username', validatorRules.username]"
                :disabled="title == '详情'||title == '编辑'"
              />
            </a-form-item>
            <a-form-item label="密码：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback v-if="addShow">
              <a-input
                type="password"
                placeholder="输入时为修改密码，不输入时为原始密码"
                v-decorator="['password']"
                :disabled="title == '详情'"
              />
            </a-form-item>
            <a-form-item label="企业全称：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input
                placeholder="请输入企业全称"
                v-decorator="['carrierName', validatorRules.carrierName]"
                :disabled="title == '详情'"
              />
            </a-form-item>
            <a-form-item label="企业简称：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input
                placeholder="请输入企业简称"
                v-decorator="['shortName', validatorRules.shortName]"
                :disabled="title == '详情'"
              />
            </a-form-item>

            <a-form-item label="企业类型：" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-radio-group
                v-decorator="['enterpriseType', validatorRules.enterpriseType]"
                :disabled="title == '详情'"
              >
                <a-radio value="0">小规模纳税人</a-radio>
                <a-radio value="1">一般纳税人</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="业务类型：" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-radio-group
                v-decorator="['carrierType', validatorRules.carrierType]"
                :disabled="title == '详情'"
              >
                <a-radio value="0">开票</a-radio>
                <a-radio value="1">常规</a-radio>
              </a-radio-group>
              <!-- <j-dict-select-tag
                :triggerChange="true"
                dictCode="businessTypeCode"
                v-decorator="['carrierType', validatorRules.carrierType]"
                placeholder="请选择车长"
              ></j-dict-select-tag>-->
            </a-form-item>
            <a-form-item label="企业编码：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input
                placeholder="请输入不大于5位大写英文字母的企业编码"
                v-decorator="['carrierCode', validatorRules.carrierCode]"
                :disabled="title == '详情'"
              />
            </a-form-item>
            <a-form-item label="联系人：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input
                placeholder="请输入联系人"
                v-decorator="['linkName', validatorRules.linkName]"
                :disabled="title == '详情'"
              />
            </a-form-item>
            <a-form-item label="联系电话：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input
                placeholder="请输入联系电话"
                v-decorator="['linkPhone', validatorRules.linkPhone]"
                :disabled="title == '详情'"
              />
            </a-form-item>
            <a-form-item label="企业地址：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input
                placeholder="请输入企业地址"
                v-decorator="['registerAddr', validatorRules.registerAddr]"
                :disabled="title == '详情'"
              />
            </a-form-item>
            <a-form-item label="企业费率：" :labelCol="labelCol" hasFeedback class="carriver">
              <a-input
                placeholder="请输入企业费率"
                v-decorator="['carrierRate', validatorRules.carrierRate]"
                :disabled="title == '详情'"
              />
            </a-form-item>
            <a-form-item class="carri">%</a-form-item>
          </a-form>
        </a-spin>
      </a-collapse-panel>

      <a-collapse-panel header="许可信息" key="2">
        <a-spin :spinning="confirmLoading">
          <a-form :form="form" :layout="layout">
            <a-form-item label="营业执照号：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input
                placeholder="请输入营业执照号"
                v-decorator="['companyBusinessLicense', validatorRules.companyBusinessLicense]"
                :disabled="title == '详情'"
              />
            </a-form-item>
            <a-form-item label="法定代表人：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input
                placeholder="请输入法定代表人"
                v-decorator="['legalPerson', validatorRules.legalPerson]"
                :disabled="title == '详情'"
              />
            </a-form-item>
            <a-form-item label="法定代表人电话：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input
                placeholder="请输入法定代表人电话"
                v-decorator="['legalerTel', validatorRules.legalerTel]"
                :disabled="title == '详情'"
              />
            </a-form-item>
            <a-form-item label="注册资本：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input
                placeholder="请输入注册资本"
                v-decorator="['registerMoney', validatorRules.registerMoney]"
                :disabled="title == '详情'"
              />
            </a-form-item>
            <a-form-item label="成立日期：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <j-date
                placeholder="请选择时间"
                :trigger-change="true"
                v-decorator="['foundTime', validatorRules.foundTime]"
                date-format="YYYY-MM-DD HH:mm:ss"
                :showTime="true"
                :disabled="title == '详情'"
              ></j-date>
            </a-form-item>
            <a-form-item label="统一社会信用代码：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input
                placeholder="请输入统一社会信用代码"
                v-decorator="['actualCarrierId', validatorRules.actualCarrierId]"
                :disabled="title == '详情'"
              />
            </a-form-item>
            <a-form-item label="纳税人识别号：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input
                placeholder="请输入纳税人识别号"
                v-decorator="['taxpayer', validatorRules.taxpayer]"
                :disabled="title == '详情'"
              />
            </a-form-item>
            <a-form-item label="运输经营许可证号：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input
                placeholder="请输入运输经营许可证号"
                v-decorator="['actualCarrierBusinessLicense', validatorRules.actualCarrierBusinessLicense]"
                :disabled="title == '详情'"
              />
            </a-form-item>
            <a-form-item label="经营范围：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input
                placeholder="请输入经营范围"
                type="textarea"
                v-decorator="['busiScope', validatorRules.busiScope]"
                :disabled="title == '详情'"
              />
            </a-form-item>
            <div>
              <a-form-item label="营业执照：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
                <j-image-upload v-model="actualCarrierImg" :bizPath="bizPath"></j-image-upload>
              </a-form-item>
              <a-form-item label="运输经营许可证：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
                <j-image-upload v-model="businessLicenseImg" :bizPath="bizPath"></j-image-upload>
              </a-form-item>
            </div>
          </a-form>
        </a-spin>
      </a-collapse-panel>

      <a-collapse-panel header="开户信息" key="3">
        <a-spin :spinning="confirmLoading">
          <a-form :form="form" :layout="layout">
            <a-form-item label="开户行：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input
                placeholder="请输入开户行"
                v-decorator="['openingBank', validatorRules.openingBank]"
                :disabled="title == '详情'"
              />
            </a-form-item>
            <a-form-item label="开户名称：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input
                placeholder="请输入开户名称"
                v-decorator="['accountName', validatorRules.accountName]"
                :disabled="title == '详情'"
              />
            </a-form-item>
            <a-form-item label="开户账号：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input
                placeholder="请输入开户账号"
                v-decorator="['openingBankAccount', validatorRules.openingBankAccount]"
                :disabled="title == '详情'"
              />
            </a-form-item>
          </a-form>
        </a-spin>
      </a-collapse-panel>

      <a-collapse-panel header="费率记录" key="4" v-if="title == '详情'">
        <a-table
          ref="table"
          bordered
          size="middle"
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          :rowSelection="{ onChange: onSelectChange }"
          @change="handleTableChange"
        ></a-table>
      </a-collapse-panel>
      <a-collapse-panel header="结算信息" key="5" v-if="title !== '详情'">
        <a-spin :spinning="confirmLoading">
          <a-form :form="form" :layout="layout">
            <a-form-item label="结算类型：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <j-dict-select-tag
                :triggerChange="true"
                dictCode="settlementType"
                v-decorator="['settlementType', validatorRules.settlementType]"
                placeholder="请选结算类型"
              ></j-dict-select-tag>
            </a-form-item>
            <a-form-item label="结算方式：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <j-dict-select-tag
                :triggerChange="true"
                dictCode="settlementWays"
                v-decorator="['settlementWays', validatorRules.settlementWays]"
                placeholder="请选结算方式"
              ></j-dict-select-tag>
            </a-form-item>
            <a-form-item label="结算天数：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input-number
                id="inputNumber"
                :min="1"
                :max="31"
                v-decorator="['settlementDays', validatorRules.settlementDays]"
                :disabled="title == '详情'"
              />
            </a-form-item>
          </a-form>
        </a-spin>
      </a-collapse-panel>
    </a-collapse>
  </a-modal>
</template>
<script>
import pick from 'lodash.pick'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import tableData from '@api/tableData'
import { basicsApi } from '@/api/basics'
import JDate from '@/components/jeecg/JDate'
import { putAction, getAction } from '@/api/manage'
import JUpload from '@/components/jeecg/JUpload'
import JImageUpload from './JImageUpload'
import api from '@/api/index'
import UpdataCarrier from '@/components/jeecg/UpdataCarrier' // 暂时使用
import { isPhoneOrMobileByForm, isZM } from '@/utils/validate'
export default {
  name: '',
  // components: { JImageUpload },
  components: {
    UpdataCarrier,
    JDate,
    JImageUpload,
    JUpload
  }, // 暂时使用
  mixins: [JeecgListMixin],
  imgList: [],
  data() {
    return {
      url: api.basicsCarrierUrl,
      // 是否禁用
      bizPath: 'carrier',
      disabledEate: false,
      addShow: true,
      columns: tableData.rateRecordTableData,
      defaultActiveKey: [1, 2, 3, 4, 5],
      title: '',
      oldRateParams: '',
      confirmLoading: false,
      visible: false,
      model: {},
      layout: 'inline',
      disableSubmit: false,
      form: this.$form.createForm(this),
      showType: true,
      carrierRates: '',
      actualCarrierImg: [],
      businessLicenseImg: [],
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
        username: {
          rules: [
            {
              required: true,
              message: '请输入账号!'
            }
          ]
        },
        linkPhone: {
          rules: [
            {
              required: true,
              message: '请输入联系人手机!'
            },
            {
              validator: isPhoneOrMobileByForm
            }
          ]
        },
        shortName: {
          rules: [
            {
              required: true,
              message: '请输入企业简称!'
            },
            {
              validator: this.shortNameisOK
            }
          ]
        },
        carrierType: {
          rules: [
            {
              required: true,
              message: '业务类型!'
            }
          ], initialValue: '0'
        },
        enterpriseType: {
          rules: [
            {
              required: true,
              message: '企业类型!'
            }
          ], initialValue: '0'
        },
        carrierCode: {
          rules: [
            {
              required: true,
              message: '请输入企业编码!'
            }, {
              validator: this.carrierCodeisOK
            }
          ]
        },
        linkName: {
          rules: [
            {
              required: true,
              message: '请输入联系人!'
            }
          ]
        },
        mobile: {
          rules: [
            {
              validator: isPhoneOrMobileByForm
            }
          ]
        },
        registerAddr: {
          rules: [
            {
              required: true,
              message: '请输入企业地址!'
            }
          ]
        },
        carrierRate: {
          rules: [
            {
              required: true,
              message: '请输入企业费率!'
            }
          ]
        },
        companyBusinessLicense: {
          rules: [
            {
              required: true,
              message: '请输入营业执照号!'
            },
            {
              validator: this.companyisOK
            }
          ]
        },
        legalPerson: {
          rules: [
            {
              required: true,
              message: '请输入法定代表人!'
            }
          ]
        },
        legalerTel: {
          rules: [
            {
              required: true,
              message: '请输入法定代表人电话!'
            },
            {
              validator: isPhoneOrMobileByForm
            }
          ]
        },
        registerMoney: {
          rules: [
            {
              required: true,
              message: '请输入注册资本!'
            }
          ]
        },
        foundTime: {
          rules: [
            {
              required: true,
              message: '成立日期!'
            }
          ]
        },
        actualCarrierId: {
          rules: [
            {
              required: true,
              message: '请输入统一社会信用代码!'
            },
            {
              validator: this.actualCarrierIdisOK
            }
          ]
        },
        taxpayer: {
          rules: [
            {
              required: true,
              message: '请输入纳税人识别号!'
            }
          ]
        },
        actualCarrierBusinessLicense: {
          rules: [
            {
              required: true,
              message: '请输入运输经营许可证号!'
            },
            {
              validator: this.actualCarrierBusinessLicenseisOK
            }
          ]
        },
        busiScope: {
          rules: [
            {
              required: true,
              message: '请输入经营范围!'
            }
          ]
        },
        actualCarrierImg: {
          rules: [
            {
              required: true,
              message: '请输入营业执照!'
            }
          ]
        },
        businessLicenseImg: {
          rules: [
            {
              required: true,
              message: '请输入运输经营许可证!'
            }
          ]
        },
        openingBank: {
          rules: [
            {
              required: true,
              message: '请输入开户行!'
            }
          ]
        },
        accountName: {
          rules: [
            {
              required: true,
              message: '请输入开户名称!'
            }
          ]
        },
        openingBankAccount: {
          rules: [
            {
              required: true,
              message: '请输入开户账号!'
            }
          ]
        },
        settlementType: {
          rules: [
            {
              required: true,
              message: '结算类型!'
            }
          ], initialValue: '0'
        },
        settlementWays: {
          rules: [
            {
              required: true,
              message: '结算方式!'
            }
          ], initialValue: '0'
        },
        settlementDays: {
          rules: [
            {
              required: true,
              message: '结算天数!'
            }
          ], initialValue: '1'
        },
        carrierName: {
          rules: [
            {
              required: true,
              message: '企业名!'
            },
            {
              validator: this.carrierNameisOK
            }
          ]
        }
      }
    }
  },
  created() {
    // this.queryParam.userId = JSON.parse(localStorage.getItem('pro__Login_Userinfo')).value.dataId
    // this.loadData()
  },
  methods: {
    // 企业编码校验
    carrierCodeisOK(rule, value, callback) {
      if (!value || isZM(value)) {
        const params = {
          pageSize: 99999
        }
        getAction(this.url.list, params).then(res => {
          if (res.success) {
            const itemParams = res.result.records.filter(item => {
              return item.carrierCode === value
            })
            if (this.title === '新增') {
              if (itemParams.length < 1) {
                callback()
              } else {
                callback('您输入的企业简称已存在，请重新输入!')
              }
            } else if (this.title === '编辑') {
              callback()
            }
          }
        })
      } else {
        callback('请输入不大于五位的大写字母!')
      }
    },
    // 企业简称校验
    shortNameisOK(rule, value, callback) {
      const params = {
        pageSize: 99999
      }
      getAction(this.url.list, params).then(res => {
        if (res.success) {
          const itemParams = res.result.records.filter(item => {
            return item.shortName === value
          })
          if (this.title === '新增') {
            if (itemParams.length < 1) {
              callback()
            } else {
              callback('您输入的企业简称已存在，请重新输入!')
            }
          } else if (this.title === '编辑') {
            callback()
          }
          // if (itemParams.length < 1) {
          //   callback()
          // } else {
          //   callback('您输入的企业简称已存在，请重新输入!')
          // }
        }
      })
    },
    // 企业全称校验
    carrierNameisOK(rule, value, callback) {
      const params = {
        pageSize: 99999
      }
      getAction(this.url.list, params).then(res => {
        if (res.success) {
          const itemParams = res.result.records.filter(item => {
            return item.carrierName === value
          })
          if (this.title === '新增') {
            if (itemParams.length < 1) {
              callback()
            } else {
              callback('您输入的企业全称已存在，请重新输入!')
            }
          } else if (this.title === '编辑') {
            callback()
          }
          // if (itemParams.length < 1) {
          //   callback()
          // } else {
          //   callback('您输入的企业全称已存在，请重新输入!')
          // }
        }
      })
    },
    // 运输经营许可证校验
    actualCarrierBusinessLicenseisOK(rule, value, callback) {
      const params = {
        pageSize: 99999
      }
      getAction(this.url.list, params).then(res => {
        if (res.success) {
          const itemParams = res.result.records.filter(item => {
            return item.actualCarrierBusinessLicense === value
          })
          if (this.title === '新增') {
            if (itemParams.length < 1) {
              callback()
            } else {
              callback('您输入的运输经营许可证号已存在，请重新输入!')
            }
          } else if (this.title === '编辑') {
            callback()
          }
          // if (itemParams.length < 1) {
          //   callback()
          // } else {
          //   callback('您输入的运输经营许可证号已存在，请重新输入!')
          // }
        }
      })
    },
    // 统一社会信用代码校验
    actualCarrierIdisOK(rule, value, callback) {
      const params = {
        pageSize: 99999
      }
      getAction(this.url.list, params).then(res => {
        if (res.success) {
          const itemParams = res.result.records.filter(item => {
            return item.actualCarrierId === value
          })
          if (this.title === '新增') {
            if (itemParams.length < 1) {
              callback()
            } else {
              callback('您输入的统一社会信用代码已存在，请重新输入!')
            }
          } else if (this.title === '编辑') {
            callback()
          }
          // if (itemParams.length < 1) {
          //   callback()
          // } else {
          //   callback('您输入的统一社会信用代码已存在，请重新输入!')
          // }
        }
      })
    },
    // 营业执照号校验
    companyisOK(rule, value, callback) {
      const params = {
        pageSize: 99999
      }
      getAction(this.url.list, params).then(res => {
        if (res.success) {
          const itemParams = res.result.records.filter(item => {
            return item.companyBusinessLicense === value
          })
          if (this.title === '新增') {
            if (itemParams.length < 1) {
              callback()
            } else {
              callback('您输入的营业执照号已存在，请重新输入!')
            }
          } else if (this.title === '编辑') {
            callback()
          }
          // if (itemParams.length < 1) {
          //   callback()
          // } else {
          //   callback('您输入的营业执照号已存在，请重新输入!')
          // }
        }
      })
    },

    searchReset() {
      this.queryParam = {
        userId: JSON.parse(localStorage.getItem('pro__Login_Userinfo')).value.dataId
      }
      this.loadData(1)
    },
    add(record) {
      this.addShow = false
      this.form.resetFields()
      this.actualCarrierImg = []
      this.businessLicenseImg = []
      this.visible = true
    },
    edit(record, Aparams) {
      this.oldRateParams = record.carrierRate
      // this.form.resetFields()
      this.addShow = true
      if (Aparams === 'HQXQ') {
        this.getParams(record.id)
      }

      if (this.title === '详情') {
        this.disabledEate = true
      }

      if (record === undefined) {
        // eslint-disable-next-line no-console
        console.log(null)
      } else {
        this.carrierRates = record.carrierRate
      }

      this.visible = true
      this.model = Object.assign({}, record)
      if (this.model.actualCarrierImg) {
        this.actualCarrierImg = this.model.actualCarrierImg.split(',')
      } else if (this.model.actualCarrierImg === '') {
        this.actualCarrierImg = []
      }

      if (this.model.businessLicenseImg) {
        this.businessLicenseImg = this.model.businessLicenseImg.split(',')
      } else if (this.model.businessLicenseImg === '') {
        this.businessLicenseImg = []
      }
      this.model.carrierRate = this.model.carrierRate * 100
      // eslint-disable-next-line no-console
      console.log('model', this.model)
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'username',
            'password',
            'carrierName',
            'shortName',
            'carrierType',
            'enterpriseType',
            'carrierCode',
            'linkName',
            'linkPhone',
            'registerAddr',
            'carrierRate',
            'companyBusinessLicense',
            'legalPerson',
            'legalerTel',
            'registerMoney',
            'foundTime',
            'actualCarrierId',
            'taxpayer',
            'actualCarrierBusinessLicense',
            'busiScope',
            'actualCarrierImg',
            'businessLicenseImg',
            'openingBank',
            'accountName',
            'openingBankAccount',
            'settlementType',
            'settlementWays',
            'settlementDays'
          )
        )
      })
    },
    close() {
      this.visible = false
      this.confirmLoading = false
      this.model = {}
      this.form.resetFields()
      this.showType = true
      this.disableSubmit = false
      this.actualCarrierImg = []
      this.businessLicenseImg = []
    },
    getParams(id) {
      getAction('/carrier/gswlBaseCarrier/queryById', {
        id
      })
        .then(res => {
          if (res.success) {
            this.$message.success(res.message)
            this.$emit('ok')
            this.dataSource = res.result.rateLogList
            this.ipagination.total = res.result.rateLogList.length
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    handleSubmit() {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          const that = this

          if (typeof this.actualCarrierImg === 'string') {
            this.model.actualCarrierImg = this.actualCarrierImg
          } else {
            this.model.actualCarrierImg = this.actualCarrierImg.join(',')
          }

          if (typeof this.businessLicenseImg === 'string') {
            this.model.businessLicenseImg = this.businessLicenseImg
          } else {
            this.model.businessLicenseImg = this.businessLicenseImg.join(',')
          }

          const formData = Object.assign(that.model, values)
          if (formData.username !== '') {
            formData.loginUser = {}
            formData.loginUser.username = formData.username
            formData.loginUser.password = formData.password
          }
          // eslint-disable-next-line no-console
          console.log('formData', formData)
          formData.carrierRate = formData.carrierRate / 100

          // //  修改
          if (this.title === '编辑') {
            putAction('/carrier/gswlBaseCarrier/edit?oldRate=' + this.oldRateParams + '&password=' + formData.password, formData)
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
            return
          }
          basicsApi
            .addCarrier(formData)
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
    // validateMobile(rule, value, callback) {
    //   if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
    //     callback()
    //   } else {
    //     callback('您的手机号码格式不正确!')
    //   }
    // }
  }
}
</script>
<style scoped lang="less">
.ant-form-item {
  width: 50%;
  margin-right: 0px !important;
  margin: 5px 0px;
}

.carriver {
  position: relative;
}

.carri {
  position: absolute;
  right: 210px;
}

/deep/ .ant-input-disabled {
  color: black;
}
</style>
