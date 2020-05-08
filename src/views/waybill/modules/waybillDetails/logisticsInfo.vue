<!--
 * @Description:
 * @Date: 2020-03-31 08:58:14
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-04-23 17:47:44
 -->
<template>
  <div>
    <a-steps :current="current">
      <a-step
        v-for="item in logisticsInfo"
        :key="item.id"
        :title="item.action"
        :description="item.createTime"
      />
    </a-steps>
    <a-divider></a-divider>
    <div>
      <div class="stepTime">
        <div class="stepTimes" v-for="item in logisticsInfo" :key="item.id">{{item.createTime}}</div>
      </div>
      <a-steps class="stepCon" :current="current" direction="vertical" size="small">
        <a-step v-for="item in logisticsInfo" :key="item.id" :description="item.operaInfo" />
      </a-steps>
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  props: {
    logisticsInfo: {
      type: Array,
      required: true
    }
  },
  components: {},
  data() {
    return {
      current: 0,
      steps: []
    }
  },
  mounted() {
    //  数据处理按时间倒序
    for (var i = this.logisticsInfo.length - 1; i > 0; i--) {
      for (var j = 0; j < i; j++) {
        if (this.comptime(this.logisticsInfo[j].createTime, this.logisticsInfo[j + 1].createTime)) {
          [this.logisticsInfo[j], this.logisticsInfo[j + 1]] = [this.logisticsInfo[j + 1], this.logisticsInfo[j]]
        }
      }
    }
    console.log('logisticsInfo', this.logisticsInfo)

    this.current = this.logisticsInfo.length
  },
  methods: {
    comptime(beginTime, endTime) {
      var beginTimes = beginTime.substring(0, 10).split('-')
      var endTimes = endTime.substring(0, 10).split('-')

      beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' ' + beginTime.substring(10, 19)
      endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + endTime.substring(10, 19)
      var a = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000
      if (a <= 0) {
        return true
      } else if (a > 0) {
        return false
      }
    }
  }
}
</script>
<style scoped lang="less">
.stepTime {
  width: 140px;
  display: inline-block;
  float: left;
  text-align: right;
  margin-right: 10px;
  color: rgba(0, 0, 0, 0.447058823529412);
}
.stepTimes {
  display: block;
  height: 48px;
}
.stepCon {
  width: 80%;
  display: inline-block;
}
</style>
