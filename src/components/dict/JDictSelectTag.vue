<template>
  <a-radio-group v-if="tagType == 'radio'" @change="handleInput" :value="getValueSting" :disabled="disabled">
    <a-radio v-for="(item, key) in dictOptions" :key="key" :value="item.value">{{ item.text }}</a-radio>
  </a-radio-group>

  <a-select
    v-else-if="tagType == 'select'"
    :getPopupContainer="target => target.parentNode"
    :placeholder="placeholder"
    :disabled="disabled"
    :value="getValueSting"
    @change="handleInput"
  >
    <a-select-option :value="undefined">请选择</a-select-option>
    <a-select-option v-for="(item, key) in dictOptions" :key="key" :value="item.value">
      <span style="display: inline-block;width: 100%" :title="item.text || item.label">{{
        item.text || item.label
      }}</span>
    </a-select-option>
  </a-select>

  <a-radio-group
    v-else-if="tagType == 'tabs'"
    @change="handleInput"
    :value="getValueSting"
    :style="{ marginRight: '8px' }"
  >
    <a-radio-button :value="undefined">全部</a-radio-button>
    <a-radio-button v-for="(item, key) in dictOptions" :key="key" :value="item.value">{{
      item.text || item.label
    }}</a-radio-button>
  </a-radio-group>
</template>

<script>
import { ajaxGetDictItems } from '@/api/api'
import store from '@/store/'
export default {
  name: 'JDictSelectTag',
  props: {
    dictCode: String,
    placeholder: {
      type: String,
      default: '请选择'
    },
    triggerChange: Boolean,
    disabled: Boolean,
    value: [String, Number],
    type: String
  },
  data() {
    return {
      dictOptions: [],
      tagType: ''
      // changeValue: this.value
    }
  },
  watch: {
    dictCode: {
      immediate: true,
      handler() {
        this.initDictData()
      }
    }
    // value: {
    //   immediate: true,
    //   handler(newName, oldName) {
    //     this.value = newName
    //   }
    // }
  },
  created() {
    // console.log(this.dictCode);
    if (!this.type || this.type === 'list') {
      this.tagType = 'select'
    } else {
      this.tagType = this.type
    }
    // 获取字典数据
    // this.initDictData();
  },
  computed: {
    getValueSting() {
      return this.value ? this.value.toString() : undefined
      // set: function(newValue) {
      //   // console.log('newValue', newValue)
      //   this.changeValue = newValue
      // }
    }
  },
  methods: {
    initDictData() {
      // 根据字典Code, 初始化字典数组
      ajaxGetDictItems(this.dictCode, null).then(res => {
        if (res.success) {
          //  权限数据判断
          if (this.dictCode === 'dataSource' && (store.getters.userType === 'HZ' || store.getters.userType === 'CYS')) {
            res.result = res.result.splice(0, 2)
          }
          this.dictOptions = res.result
        }
      })
    },
    handleInput(e) {
      let val
      if (this.tagType === 'radio' || this.tagType === 'tabs') {
        val = e.target.value
      } else {
        val = e
      }
      console.log(val)
      if (this.triggerChange) {
        this.$emit('change', val)
      } else {
        this.$emit('input', val)
      }
    },
    setCurrentDictOptions(dictOptions) {
      this.dictOptions = dictOptions
    },
    getCurrentDictOptions() {
      return this.dictOptions
    }
  }
}
</script>

<style scoped></style>
