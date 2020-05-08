<!--
 * @Description: 
 * @Date: 2020-03-31 08:58:44
 * @LastEditors: 自己洗小红花
 * @LastEditTime: 2020-04-02 16:42:20
 -->
<template>
  <div>
    <div id="container"></div>
    <div id="panel" class="ant-card ant-card-bordered ant-card-small">
      <div>
        湖南
        <span>长沙</span>
      </div>
      <div class="pro">-------</div>
      <div>司机：林程 15880098587</div>
      <div>车辆：川AS8911 17.5米 厢式货车 30吨</div>
      <div>配载率：20吨/0方/66.7%</div>
      <div>运费：8000元</div>
    </div>
    <a-card id="panel" :title="title">
      <div slot="cover" class="cover">
        <div>
          湖南
          <div class="city">长沙</div>
        </div>
        <div class="pro">-------</div>
        <div>
          成都
          <div class="city">内江</div>
        </div>
      </div>
      <a href="#" slot="extra">1226.58km</a>
      <div class="contant">
        <div>司机：林程 15880098587</div>
        <div>车辆：川AS8911 17.5米 厢式货车 30吨</div>
        <div>配载率：20吨/0方/66.7%</div>
        <div>运费：8000元</div>
      </div>
    </a-card>
  </div>
</template>

<script>
import AMap from 'AMap' // 引入高德地图
export default {
  mounted() {
    this.init()
  },
  props: {
    trackInfo: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      center: [],
      waypoint: [],
      title: '湖南-------长沙',
      currentLocation: []
    }
  },
  methods: {
    init() {
      this.center = this.trackInfo.center
      this.waypoint = this.trackInfo.waypoint
      this.currentLocation = this.trackInfo.currentLocation
      var that = this
      //基本地图加载
      var map = new AMap.Map('container', {
        resizeEnable: true,
        center: this.center, //地图中心点
        zoom: 13 //地图显示的缩放级别
      })
      //  当前位置
      let position = new AMap.LngLat(this.currentLocation[0], this.currentLocation[1])
      // 以 icon URL 的形式创建一个途经点
      var currentLocation = new AMap.Marker({
        position: position,
        // 将一张图片的地址设置为 icon
        icon: 'https://webapi.amap.com/images/car.png',
        // 设置了 icon 以后，设置 icon 的偏移量，以 icon 的 [center bottom] 为原点
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true,
        angle: -90
      })

      //构造路线导航类
      var truckDriving = new AMap.TruckDriving({
        map: map,
        policy: 0, // 规划策略
        size: 1, // 车型大小
        width: 2.5, // 宽度
        height: 2, // 高度
        load: 1, // 载重
        weight: 12, // 自重
        axlesNum: 2, // 轴数
        isOutline: true,
        outlineColor: '#ffeeee'
      })
      // 根据起终点经纬度规划驾车导航路线
      let path = []
      //  途径点异步传入数据渲染
      that.waypoint.forEach(element => {
        path.push({ lnglat: [element.start, element.end] })
      })

      truckDriving.search(path, function(status, result) {
        // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
        if (status === 'complete') {
          // that.$message.success('绘制驾车路线完成')
        } else {
          that.$message.error('获取驾车数据失败：' + result)
        }
      })
      map.add([currentLocation])
    }
  }
}
</script>
<style scoped lang="less">
#container {
  width: 100%;
  height: 400px;
}
#panel {
  position: absolute;
  background-color: white;
  max-height: 90%;
  overflow-y: auto;
  top: 30px;
  right: 10px;
  width: 320px;
  text-align: center;
}
#panel .amap-call {
  background-color: #009cf9;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
#panel .amap-lib-driving {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  overflow: hidden;
}
.cover {
  font-size: 16px;
  font-family: 'PingFangSC-Semibold', 'PingFang SC Semibold', 'PingFang SC';
  font-weight: 650;
  div {
    display: inline-block;
  }
  .pro {
    display: inline-block;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.447058823529412);
    padding: 0px 15px;
  }
  .city {
    display: inline-block;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.447058823529412);
  }
}
.contant {
  text-align: left;
  div {
    margin: 10px 0px;
  }
}
</style>