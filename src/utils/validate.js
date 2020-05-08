/*
 * @Author: your name
 * @Date: 2020-04-09 15:25:17
 * @LastEditTime: 2020-04-27 09:11:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \gswl-web\src\utils\validate.js
 */
/**
 * 邮箱
 * @param {*} s
 */
export function isEmail(s) {
  return /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile(s) {
  return /^1[0-9]{10}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone(s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * 不大于5位大写字母的正则
 * @param {*} s
 */
export function isZM(s) {
  return /^[A-Z]{0,5}$/.test(s)
}

/**
 * 手机号或者电话号码
 * @param {*} s
 */
export function isPhoneOrMobile(s) {
  return isMobile(s) || isPhone(s)
}

/**
 * 手机号或者电话号码---form表单验证
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function isPhoneOrMobileByForm(rule, value, callback) {
  if (!value || isPhoneOrMobile(value)) {
    callback()
  } else {
    callback('请输入正确的手机号或者电话号码!')
  }
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL(s) {
  return /^http[s]?:\/\/.*/.test(s)
}

/**
 * 车牌号
 *  @param {*} s
 */
export const isVehicleNumber = s => {
  return /^([京津晋冀蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新][ABCDEFGHJKLMNPQRSTUVWXY][1-9DF][1-9ABCDEFGHJKLMNPQRSTUVWXYZ]\d{3}[1-9DF]|[京津晋冀蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新][ABCDEFGHJKLMNPQRSTUVWXY][\dABCDEFGHJKLNMxPQRSTUVWXYZ]{5})$/.test(
    s
  )
}

/**
 * 车牌号验证
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function isVehicleNumberByForm(rule, value, callback) {
  if (!value || isVehicleNumber(value)) {
    callback()
  } else {
    callback('请输入正确的车牌号!')
  }
}

/**
 * 身份证
 * @param {*} s
 */
export function isSFZ(s) {
  // 350128199710140036
  //

  return /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(s)
}
/**
 * 不大于五位的大写字母
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function isZMOK(rule, value, callback) {
  if (!value || isZM(value)) {
    callback()
  } else {
    callback('请输入不大于五位的大写字母!')
  }
}
export function isSFZByForm(rule, value, callback) {
  if (!value || isSFZ(value)) {
    callback()
  } else {
    callback('请输入正确的身份证号!')
  }
}

