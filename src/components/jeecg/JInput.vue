<!--
 * @Description: 
 * @Date: 2020-03-11 17:43:43
 * @LastEditors: 自己洗小红花
 * @LastEditTime: 2020-03-25 15:06:46
 -->
<template>
  <a-input :placeholder="placeholder" :value="inputVal" @input="backValue"></a-input>
</template>

<script>
const JINPUT_QUERY_LIKE = 'like'
const JINPUT_QUERY_NE = 'ne'
const JINPUT_QUERY_GE = 'ge' //大于等于
const JINPUT_QUERY_LE = 'le' //小于等于

export default {
  name: 'JInput',
  props: {
    value: {
      type: String | Number,
      required: false
    },
    type: {
      type: String,
      required: false,
      default: JINPUT_QUERY_LIKE
    },
    placeholder: {
      type: String,
      required: false,
      default: ''
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function() {
        this.initVal()
      },
      deep: true
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      inputVal: ''
    }
  },
  methods: {
    initVal() {
      if (!this.value) {
        this.inputVal = ''
      } else {
        let text = this.value
        switch (this.type) {
          case JINPUT_QUERY_LIKE:
            text = text.substring(1, text.length - 1)
            break
          case JINPUT_QUERY_NE:
            text = text.substring(1)
            break
          case JINPUT_QUERY_GE:
            text = text.substring(2)
            break
          case JINPUT_QUERY_LE:
            text = text.substring(2)
            break
          default:
        }

        this.inputVal = text
      }
    },
    backValue(e) {
      let text = e.target.value
      switch (this.type) {
        case JINPUT_QUERY_LIKE:
          text = '*' + text + '*'
          break
        case JINPUT_QUERY_NE:
          text = '!' + text
          break
        case JINPUT_QUERY_GE:
          text = '>=' + text
          break
        case JINPUT_QUERY_LE:
          text = '<=' + text
          break
        default:
      }

      this.inputVal = text
      this.$emit('change', text)
    }
  }
}
</script>

<style scoped>
</style>