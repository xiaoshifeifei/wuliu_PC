<!--
 * @Description: 
 * @Date: 2020-04-02 16:15:00
 * @LastEditors: 自己洗小红花
 * @LastEditTime: 2020-04-02 17:54:22
 -->
<template>
  <a-card :bordered="false">
    <a-row>
      <!-- //  地图信息 -->
      <a-col :span="18">
        <div id="container"></div>
      </a-col>

      <!-- //  运单信息 -->
      <a-col :span="6">
        <div>
          <a-card title="托运单信息">
            <a-form :form="form" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="24">
                <a-form-item label="订单号：">{{data.orderNo}}</a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="托运时间：">{{data.consignmentDateTime}}</a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item label="配送时间：">{{data.shippingDateTime}}</a-form-item>
              </a-col>

              <a-col :span="24" v-if="data.gswlWaybill ">
                <a-form-item label="司机：">{{data.gswlWaybill.driverName}}</a-form-item>
              </a-col>
              <a-col :span="24" v-if="data.gswlWaybill ">
                <a-form-item label="车牌号：">{{data.gswlWaybill.vehicleNo}}</a-form-item>
              </a-col>
            </a-form>
          </a-card>
          <a-card title="发货信息">
            <a-form :form="form" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="24">
                <a-form-item label="发货单位：">{{data.consignor}}</a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="发货人：">{{data.consignorLinkName}}</a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item label="联系电话：">{{data.consignorLinkPhone}}</a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item label="发货地址：">{{data.consignorAddr}}</a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="详细地址：">{{data.consignorDeailAddr}}</a-form-item>
              </a-col>
            </a-form>
          </a-card>
          <a-card title="收货信息">
            <a-form :form="form" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="24">
                <a-form-item label="收货单位：">{{data.consignee}}</a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="收货人：">{{data.consigneeLinkName}}</a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item label="联系电话：">{{data.consigneeLinkPhone}}</a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item label="目的地：">{{data.consigneeAddr}}</a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="详细地址：">{{data.consigneeDeailAddr}}</a-form-item>
              </a-col>
            </a-form>
          </a-card>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>
<script>
import { getAction } from '@/api/manage'
import AMap from 'AMap' // 引入高德地图
export default {
  name: '',
  components: {},

  data() {
    return {
      data: {},
      center: [],
      waypoint: [],
      currentLocation: [],
      trackInfo: {},
      form: this.$form.createForm(this),
      tagType: 'radio',
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    }
  },
  mounted() {
    //  运单信息
    this.data = JSON.parse(window.localStorage.getItem('trackInfo'))
    console.log('运单信息', this.data)
    //  地图轨迹信息
    getAction('/order/gswlWaybill/trackInfo', { waybillId: this.data.gswlWaybill.id }).then(res => {
      this.trackInfo = res.result
      console.log('地图轨迹信息', this.trackInfo)
      this.init()
    })
    //  地图轨迹信息
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
      // //  当前位置
      // let position = new AMap.LngLat(this.currentLocation[0], this.currentLocation[1])
      // // 以 icon URL 的形式创建一个途经点
      // var currentLocation = new AMap.Marker({
      //   position: position,
      //   // 将一张图片的地址设置为 icon
      //   icon: 'https://webapi.amap.com/images/car.png',
      //   // 设置了 icon 以后，设置 icon 的偏移量，以 icon 的 [center bottom] 为原点
      //   offset: new AMap.Pixel(-26, -13),
      //   autoRotation: true,
      //   angle: -90
      // })
      // map.add([currentLocation])

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
    }
  }
}
</script>
<style scoped lang="less">
#box {
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
}
#container {
  height: 800px;
}
#info {
  width: 20%;
  border-style: solid;
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
/deep/ .ant-form-item {
  margin-bottom: 0px;
}
/deep/ .ant-card-head-title {
  padding: 11px 0;
}

/deep/.ant-card-wider-padding,
/deep/ .ant-card-body {
  padding: 9px 5px;
}
/deep/ .ant-card-head {
  padding: 0px 5px;
}
</style>