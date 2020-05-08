// axios拦截器

import Vue from 'vue'
import axios from 'axios'
import store from '@/store'

import {
  VueAxios
} from './axios'
import {
  Modal,
  notification
} from 'ant-design-vue'
import {
  ACCESS_TOKEN
} from '@/store/mutation-types'

// 自动设置后台服务 baseURL (也可以手工指定写死项目名字)
const baseDomain = window._CONFIG['domianURL']
// eslint-disable-next-line no-unused-vars
const baseProject = baseDomain.substring(baseDomain.lastIndexOf('/'))
// eslint-disable-next-line no-unused-vars
const baseUrl = process.env.NODE_ENV === 'production' ? '/gswl-boot' : '/api'
// console.log('baseDomain= ', baseDomain)
// console.log('baseProject= ', baseProject)

// 创建 axios 实例
const service = axios.create({
  // baseURL: '/gswl-boot',
  //  TODO
  baseURL: '/api', // api base_url
  timeout: 30000 // 请求超时时间
})

const err = error => {
  if (error.response) {
    const goLoginPage = () => {
      if (window.location.href.indexOf('/login') !== -1) {
        Modal.error({
          title: '登录已过期',
          content: '很抱歉，登录已过期，请重新登录',
          okText: '重新登录',
          mask: false,
          onOk: () => {
            store.dispatch('Logout').then(() => {
              Vue.ls.remove(ACCESS_TOKEN)
              window.location.reload()
            })
          }
        })
      }
      return
    }
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    // console.log('我是响应拦截器');
    // console.log("------异常响应------", token)
    // console.log("------异常响应------", error.response.status)
    switch (error.response.status) {
      case 403:
        notification.error({
          message: '系统提示',
          description: '拒绝访问',
          duration: 4
        })
        break
      case 500:
        // notification.error({ message: '系统提示', description:'Token失效，请重新登录!',duration: 4})
        if (token && data.message.indexOf('tokenInvalid') !== -1) {
          goLoginPage()
          return
          // update-end- --- author:scott ------ date:20190225 ---- for:Token失效采用弹框模式，不直接跳转----
        }
        notification.error({
          message: '系统提示',
          description: data.message,
          duration: 4
        })
        break
      case 404:
        notification.error({
          message: '系统提示',
          description: '很抱歉，资源未找到!',
          duration: 4
        })
        break
      case 504:
        notification.error({
          message: '系统提示',
          description: '网络超时'
        })
        break
      case 401:
        notification.error({
          message: '系统提示',
          description: '未授权，请重新登录',
          duration: 4
        })
        if (token) {
          store.dispatch('Logout').then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 1500)
          })
        }
        break
      default:
        if (data.message.indexOf('tokenInvalid') !== -1) {
          goLoginPage()
        } else {
          notification.error({
            message: '系统提示',
            description: data.message,
            duration: 4
          })
        }

        break
    }
  }
  return Promise.reject(error)
}

// request interceptor// 添加请求拦截器
service.interceptors.request.use(
  config => {
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (token) {
      config.headers['X-Access-Token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
    }

    //  开启mock自动过滤responseType: 'blob'问题

    // if (process.env.NODE_ENV === 'development') {
    //   if (config.url.indexOf('order/gswlOrder/exportXls') > 0) {
    //     config.responseType = 'blob'
    //   }
    // }
    // console.log('我是请求拦截器', config)

    if (config.method === 'get') {
      // console.log('config', config)
      config.url = config.url ? config.url : ''
      if (config.url.indexOf('sys/dict/getDictItems') < 0) {
        config.params = {
          _t: Date.parse(new Date()) / 1000,
          ...config.params
        }
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor//返回状态判断(添加响应拦截器)
service.interceptors.response.use(response => {
  // console.log('我是响应拦截器', response.data);

  //  如果表格数据id为空时加上rowkey字段用于主键判断
  //  判断是否是分页
  if (response.data.result && response.data.result.size && response.data.result.total) {
    response.data.result.records.forEach((element, index) => {
      element.rowkey = index
      if (element.id) {
        element.rowkey = (response.data.result.current - 1) * response.data.result.size + 1 + index
      }
      // console.log('我是分页数据', response.config.url, response.data.result);
    })
  }

  // if(response.data)
  return response.data
}, err)

const installer = {
  vm: {},
  install(Vue, router = {}) {
    Vue.use(VueAxios, router, service)
  }
}
export {
  installer as VueAxios, service as axios
}
