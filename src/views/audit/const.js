/*
 * @Author: 订单审核
 * @Date: 2020-04-27 10:27:40
 * @LastEditTime: 2020-04-28 13:00:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \gswl-web\src\views\audit\const.js
 */
const api = {
  url: {
    list: '/order/gswlOrderSupplement/list',
    deleteBatch: '/order/gswlOrderSupplement/deleteBatch',
    submitExamine: '/order/gswlOrderSupplement/submitExamine',
    doExamine: '/order/gswlOrderSupplement/doExamine/',
    confirmImport: '/order/gswlOrderSupplement/confirmImport',
    importSupplement: '/order/gswlOrderSupplement/importSupplement',
    commonDown: '/sys/common/download/excelTemplate/订单补录导入模板.xls'
  }
}
export default api
