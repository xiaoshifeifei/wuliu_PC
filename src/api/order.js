/*
 * @Description: 

 * @Date: 2020-03-05 15:48:38
 * @LastEditors: 自己洗小红花
 * @LastEditTime: 2020-04-09 13:10:48
 */
import api from './index'
import {
  axios
} from '@/utils/request'
export const OrderApi = {
  getCompony(parameter) {
    return axios({
      url: api.myorderUrl.compony,
      method: 'get',
      params: parameter
    })
  },

  getOrderDetail(parameter) {
    return axios({
      url: api.orderDetail,
      method: 'get',
      params: parameter
    })
  },
  //  指派承运商
  assignedCarrier(parameter) {
    return axios({
      url: api.myorderUrl.assignedCarrier,
      method: 'POST',
      data: parameter
    })
  },
  //  外部订单指派承运商
  assignedExCarrier(parameter, url) {
    return axios({
      url: url,
      method: 'POST',
      data: parameter
    })
  },
  //  获取客户列表
  getCustomerList(parameter) {
    return axios({
      url: api.createOrderUrl.customerList,
      method: 'get',
      params: parameter
    })
  },
  //  获取发货单位列表

  getConsignorList(parameter) {
    return axios({
      url: api.createOrderUrl.consignorList,
      method: 'get',
      params: parameter
    })
  },
  //  获取收货单位列表

  getConsigneeList(parameter) {
    return axios({
      url: api.createOrderUrl.consigneeList,
      method: 'get',
      params: parameter
    })
  },
  //  开单
  addOrder(parameter) {
    return axios({
      url: api.createOrderUrl.add,
      method: 'post',
      data: parameter
    })
  },
  //  修改订单
  editOrder(parameter) {
    return axios({
      url: api.createOrderUrl.edit,
      method: 'PUT',
      data: parameter
    })
  },
  //点击生成订单号
  createOrderNo(parameter) {

    return axios({
      url: api.createOrderUrl.orderNo,
      method: 'get',
      data: parameter
    })
  },
  //  更改车辆
  editVehicle(parameter) {
    return axios({
      url: api.createOrderUrl.add,
      method: 'post',
      data: parameter
    })
  },
  //put
  putAction(url, parameter) {
    return axios({
      url: url,
      method: 'put',
      params: parameter
    })
  }
}