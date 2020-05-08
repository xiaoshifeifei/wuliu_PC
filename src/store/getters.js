/*
 * @Description:
 * @Date: 2020-03-11 17:43:43
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-05-06 16:07:18
 */
import Vue from 'vue'
import {
  USER_INFO
} from '@/store/mutation-types'
const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => {
    state.user.avatar = Vue.ls.get(USER_INFO).avatar
    return state.user.avatar
  },
  username: state => state.user.username,
  nickname: state => {
    state.user.realname = Vue.ls.get(USER_INFO).realname
    return state.user.realname
  },
  welcome: state => state.user.welcome,
  permissionList: state => state.user.permissionList,
  userInfo: state => {
    state.user.info = Vue.ls.get(USER_INFO)
    return state.user.info
  },
  addRouters: state => state.permission.addRouters,
  userType: state => {
    state.user.userType = Vue.ls.get(USER_INFO).userType
    return state.user.userType
  }
}

export default getters
