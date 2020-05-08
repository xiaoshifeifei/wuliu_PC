<template>
  <a-modal
    :title="title"
    :width="1200"
    v-if="visible"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :pagination="ipagination"
    @ok="handleSubmit"
    :footer="null"
    @cancel="close"
  >
    <a-tabs v-model="defaultActiveKey">
      <a-tab-pane tab="基本信息" key="1">
        <p style="color:#1890FF">注:手机号即为登陆账号。</p>
        <a-spin :spinning="confirmLoading">
          <a-form :form="form">
            <a-form-item label="单位全称：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input
                placeholder="请输入单位名称"
                v-decorator="['customerName', validatorRules.customerName]"
                :disabled="title === '详情'"
              />
            </a-form-item>
            <a-form-item label="单位简称：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input
                placeholder="请输入单位简称"
                v-decorator="['shortName', validatorRules.shortName]"
                :disabled="title === '详情'"
              />
            </a-form-item>
            <a-form-item label="单位编号：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input
                placeholder="请输入不大于5位大写英文字母的单位编号"
                v-decorator="['customerCode', validatorRules.customerCode]"
                :disabled="title === '详情'"
              />
            </a-form-item>
            <a-form-item label="联系人：" class="harf" :labelCol="labelCol2" :wrapperCol="wrapperCol2" hasFeedback>
              <a-input
                placeholder="请输入联系人"
                v-decorator="['linkName', validatorRules.linkName]"
                :disabled="title === '详情'"
              />
            </a-form-item>
            <a-form-item label="联系电话：" class="harf" :labelCol="labelCol" :wrapperCol="wrapperCol2" hasFeedback>
              <a-input
                placeholder="请输入联系电话"
                v-decorator="['linkPhone', validatorRules.linkPhone]"
                :disabled="title === '详情'"
              />
            </a-form-item>
            <a-form-item
              label="账号："
              class="harf"
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              hasFeedback
              v-if="addShow"
            >
              <a-input
                placeholder="请输入账号"
                v-decorator="['username', validatorRules.username]"
                :disabled="title === '详情' || title === '编辑'"
              />
            </a-form-item>
            <a-form-item
              label="密码："
              class="harf"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol2"
              hasFeedback
              v-if="addShow"
            >
              <a-input
                placeholder="输入时为修改密码，不输入时为原始密码"
                v-decorator="['password']"
                :disabled="title === '详情'"
              />
            </a-form-item>
            <a-form-item label="纳税人识别号：" class="harf" :labelCol="labelCol2" :wrapperCol="wrapperCol2">
              <a-input placeholder="请输入纳税人识别号" v-decorator="['actualId']" :disabled="title == '详情'" />
            </a-form-item>
            <a-form-item label="开户账号：" class="harf" :labelCol="labelCol" :wrapperCol="wrapperCol2">
              <a-input
                placeholder="请输入开户行账号"
                v-decorator="['openingBankAccount']"
                :disabled="title === '详情'"
              />
            </a-form-item>
            <a-form-item label="开户名：" class="harf" :labelCol="labelCol2" :wrapperCol="wrapperCol2">
              <a-input placeholder="请输入开户行名称" v-decorator="['accountName']" :disabled="title == '详情'" />
            </a-form-item>
            <a-form-item label="开户行：" class="harf" :labelCol="labelCol" :wrapperCol="wrapperCol2">
              <a-input placeholder="请输入开户行信息" v-decorator="['openingBank']" :disabled="title == '详情'" />
            </a-form-item>
            <a-form-item label="注册地址：" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input placeholder="请输入注册地址" v-decorator="['registerAddr']" :disabled="title == '详情'" />
            </a-form-item>
            <a-form-item
              label="所在城市："
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              hasFeedback
              v-if="title === '编辑' || title === '新增'"
            >
              <v-distpicker
                @selected="onSelected"
                v-decorator="['countryAddr', validatorRules.countryAddr]"
                :province="select.province"
                :city="select.city"
                :area="select.area"
              ></v-distpicker>
            </a-form-item>
            <a-form-item
              label="所在城市："
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              hasFeedback
              v-if="title === '详情'"
            >
              <a-input placeholder="请选择所在城市" v-model="cityAddr" :disabled="title == '详情'" />
            </a-form-item>

            <a-form-item label="企业费率(%)：" :labelCol="labelCol" :wrapperCol="wrapperCol3" hasFeedback>
              <a-input
                class="relet"
                placeholder="请输入企业费率"
                v-decorator="['customerRate', validatorRules.customerRate]"
                :disabled="title == '详情'"
              />
            </a-form-item>
            <a-form-item class="carri">%</a-form-item>

            <a-form-item label="详细地址：" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input
                placeholder="请输入详细地址"
                v-decorator="['detailAddr', validatorRules.detailAddr]"
                :disabled="title === '详情'"
              />
            </a-form-item>
          </a-form>
          <div style="width:900px;margin:auto" v-if="title === '详情'">
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
          </div>
        </a-spin>
      </a-tab-pane>

      <a-tab-pane tab="发货联系人" :disabled="title === '新增'" key="2">
        <shipContact-modal
          ref="shipModalForm"
          :shipparams="modelParams"
          :showType="showParams"
          :modelType="modelTypeParams"
          :titleParams="title"
        ></shipContact-modal>
      </a-tab-pane>
      <a-tab-pane tab="收货联系人" :disabled="title === '新增'" key="3">
        <receivingContact-modal
          ref="receivingModalForm"
          :shipparams="modelParams"
          :showType="showParams"
          :modelType="modelTypeParams"
          :titleParams="title"
        ></receivingContact-modal>
      </a-tab-pane>
    </a-tabs>
    <div style="margin-top:10px;text-align:right;margin-right:20px">
      <a-button type="primary" v-if="defaultActiveKey === '1'" @click="handleSubmit" style="margin-right: 10px;">
        确定
      </a-button>
      <a-button @click="close">
        关闭
      </a-button>
    </div>
  </a-modal>
</template>
<script>
import pick from 'lodash.pick'
import tableData from '@api/tableData'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { basicsApi } from '@api/basics'
import ReceivingContactModal from './receivingContactModal'
import ShipContactModal from './shipContactModal'
import { isPhoneOrMobileByForm, isZMOK } from '@/utils/validate'
export default {
  name: '',
  mixins: [JeecgListMixin],
  components: {
    ReceivingContactModal,
    ShipContactModal
  },
  data() {
    return {
      columns: tableData.rateRecordTableData,
      select: {},
      title: '',
      addShow: true,
      userIdParams: '',
      defaultActiveKey: '3',
      confirmLoading: false,
      visible: false,
      ipagination: {},
      getId: '',
      cityAddr: '',
      modelParams: '',
      modelTypeParams: '',
      showParams: '',
      model: {},
      form: this.$form.createForm(this),
      showType: true,
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 5
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
      labelCol2: {
        xs: {
          span: 24
        },
        sm: {
          span: 10
        }
      },
      wrapperCol2: {
        xs: {
          span: 24
        },
        sm: {
          span: 13
        }
      },
      wrapperCol3: {
        xs: {
          span: 24
        },
        sm: {
          span: 6
        }
      },
      validatorRules: {
        customerName: {
          rules: [
            {
              required: true,
              message: '请输入单位全称!'
            }
          ]
        },
        customerCode: {
          rules: [
            {
              required: true,
              message: '请输入单位编号!'
            },
            {
              validator: isZMOK
            }
          ]
        },
        shortName: {
          rules: [
            {
              required: true,
              message: '请输入单位简称!'
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
        linkPhone: {
          rules: [
            {
              required: true,
              message: '请输入联系电话!'
            },
            {
              validator: isPhoneOrMobileByForm
            }
          ]
        },
        username: {
          rules: [
            {
              required: true,
              message: '请输入账号!'
            }
          ]
        },
        countryAddr: {
          rules: [
            {
              required: true,
              message: '请输入所在城市!'
            }
          ]
        },
        detailAddr: {
          rules: [
            {
              required: true,
              message: '请输入详细地址!'
            }
          ]
        },
        customerRate: {
          rules: [
            {
              required: true,
              message: '请输入小数!'
            }
          ]
        }
      },
      beforCustomerRate: ''
    }
  },

  methods: {
    // -------------------表单联动---------------------
    onSelected(data) {
      this.form.setFieldsValue({
        countryAddr: data.province.value + '-' + data.city.value + '-' + data.area.value
      })

      this.model.countryAddr = data.province.value + '-' + data.city.value + '-' + data.area.value
      this.model.countryCode = data.province.code + ',' + data.city.code + ',' + data.area.code
      const address = this.model.countryAddr.split('-')

      this.select = {
        province: address[0],
        city: address[1],
        area: address[2]
      }
    },
    add(record) {
      this.select = {}
      this.showParams = record.type
      this.addShow = false
      this.visible = true
    },
    edit(record, Aparams) {
      this.cityAddr = record.countryAddr.split('-').join(' ')
      this.addShow = true
      this.visible = true
      this.userIdParams = record.userId

      this.model = Object.assign({}, record)
      this.dataSource = this.model.rateLogList ? this.model.rateLogList : []
      this.model.customerRate = this.model.customerRate ? (parseFloat(this.model.customerRate) * 100).toFixed(4) : '0'
      this.beforCustomerRate = this.model.customerRate ? this.model.customerRate : '0'
      this.modelParams = record.id
      this.modelTypeParams = record.type
      this.select = {
        province: this.model.countryAddr.split('-')[0],
        city: this.model.countryAddr.split('-')[1],
        area: this.model.countryAddr.split('-')[2]
      }

      this.userId = this.model.id
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'customerName',
            'shortName',
            'customerCode',
            'linkName',
            'linkPhone',
            'countryAddr',
            'detailAddr',
            'username',
            'password',
            'actualId',
            'openingBankAccount',
            'accountName',
            'openingBank',
            'registerAddr',
            'customerRate'
          )
        )
      })
    },
    close() {
      // 关闭弹窗
      this.visible = false
      this.confirmLoading = false
      this.model = {}
      this.form.resetFields()
      this.defaultActiveKey = '1'
      this.$emit('ok')
      this.select = {}
    },
    handleSubmit() {
      // 触发表单验证
      this.form.validateFields(async (err, values) => {
        if (!err) {
          this.confirmLoading = true
          const that = this
          const formData = Object.assign(that.model, values)
          if (formData.username !== '') {
            formData.loginUser = { username: '1', password: '1' }
          }
          //  修改
          if (this.title === '编辑') {
            const { success, message } = await basicsApi.editcontactMessage(this.beforCustomerRate, formData)
            this.confirmLoading = false
            if (success) {
              this.$message.success(message)
              this.close()
            } else {
              this.$message.warning(message)
            }
          } else {
            // 新增
            const { success, message, result } = await basicsApi.addCustomer(formData)
            this.confirmLoading = false
            if (success) {
              this.$message.success(message)
              this.modelParams = result
              this.defaultActiveKey = '2'
              this.title = ''
            } else {
              this.$message.warning(message)
            }
          }
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.harf {
  display: inline-block;
  width: 50%;
  text-align: center;
}
.relet {
  position: relative;
}
.carri {
  position: absolute;
  left: 540px;
  bottom: 40px;
}

/deep/ .ant-card-body {
  padding: 0px 24px 6px;
}

// @import url('../../order/orderCommon.less');
/deep/ .ant-input-disabled {
  color: black;
}
</style>
