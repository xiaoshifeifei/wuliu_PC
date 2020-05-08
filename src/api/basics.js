/*
 * @Description:
 * @Date: 2020-02-27 10:05:52
 * @LastEditors: 自己洗小红花
 * @LastEditTime: 2020-03-17 15:13:56
 */
import api from './index'
import { axios } from '@/utils/request'
export const basicsApi = {
  // 物品新增
  addArticle(parameter) {
    return axios({
      url: api.basiceUrl.add,
      method: 'post',
      data: parameter
    })
  },
  // 物品修改
  editArticle(parameter) {
    return axios({
      url: api.basiceUrl.edit,
      method: 'put',
      data: parameter
    })
  },

  addCustomer(parameter) {
    return axios({
      url: api.customerUrl.add,
      method: 'post',
      data: parameter
    })
  },
  editCustomer(parameter) {
    return axios({
      url: api.customerUrl.edit,
      method: 'put',
      data: parameter
    })
  },
  addCarrier(parameter) {
    return axios({
      url: api.basicsCarrierUrl.add,
      method: 'post',
      data: parameter
    })
  },
  editCarrier(parameter) {
    return axios({
      url: api.basicsCarrierUrl.edit,
      method: 'put',
      data: parameter
    })
  },
  addContact(parameter) {
    return axios({
      url: api.customerUrl.ship.add,
      method: 'post',
      data: parameter
    })
  },
  // 司机列表获取
  getContact(parameter) {
    return axios({
      url: api.customerUrl.list,
      method: 'get',
      data: parameter
    })
  },
  // 车辆添加
  addCar(parameter) {
    return axios({
      url: api.carUrl.add,
      method: 'post',
      data: parameter
    })
  },
  // 车辆修改
  editCar(parameter) {
    return axios({
      url: api.carUrl.edit,
      method: 'put',
      data: parameter
    })
  },
  // 更改司机
  editDriver(parameter) {
    return axios({
      url: api.carUrl.editCar,
      method: 'put',
      params: parameter
    })
  },
  // 司机管理添加
  addDriver(parameter) {
    return axios({
      url: api.driverUrl.add,
      method: 'post',
      data: parameter
    })
  },
  // 司机管理修改
  editDriverMessage(parameter) {
    return axios({
      url: api.driverUrl.edit,
      method: 'put',
      data: parameter
    })
  },
  // 承运商业务往来
  accountStatus(parameter) {
    return axios({
      url: api.basicsCarrierUrl.statisBus,
      method: 'get',
      data: parameter
    })
  },
  // 客户修改新增收发货信息
  editcontactMessage(oldRate, data) {
    return axios({
      url: api.customerUrl.editContact + '?oldRate=' + oldRate,
      method: 'put',
      data
    })
  }
}
