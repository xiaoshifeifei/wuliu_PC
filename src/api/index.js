/*
 * @Description:
 * @Date: 2020-02-27 10:05:52
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-04-24 11:20:41
 */
const api = {
    Login: '/sys/login',
    Logout: '/sys/logout',
    ForgePassword: '/auth/forge-password',
    Register: '/auth/register',
    SendSms: '/account/sms',
    // get my info
    UserInfo: '/user/info',

    //  基础管理
    // 物品
    basiceUrl: {
        list: '/goods/goodsEntity/list', // +
        delete: '/goods/goodsEntity/delete', // +
        deleteBatch: '/goods/goodsEntity/deleteBatch', // +
        add: '/goods/goodsEntity/add', // +
        edit: '/goods/goodsEntity/edit' // +
    },
    // 客户
    customerUrl: {
        list: '/customer/gswlBaseCustomer/list', // +
        delete: '/customer/gswlBaseCustomer/delete', // +
        deleteBatch: '/customer/gswlBaseCustomer/deleteBatch', // +
        add: '/customer/gswlBaseCustomer/add', // +
        edit: '/customer/gswlBaseCustomer/edit', // +
        deleteStatus: '/customer/gswlBaseCustomer/isEnable', // +
        // 客户修改新增收发货信息
        editContact: '/customerCon/customerContacts/edit', // +
        // 收发货联系人新增
        ship: {
            list: '/customerCon/customerContacts/queryContactsByCusId',
            delete: '/customerCon/customerContacts/delete',
            add: '/customerCon/customerContacts/add'
        },
        // 收发货联系人信息  勿删
        customerId: {
            list: '/customerCon/customerContacts/list', // +
            delete: '/customerCon/customerContacts/delete', // +
            edit: '/customerCon/customerContacts/edit' // +
        }
    },
    // 承运商
    basicsCarrierUrl: {
        list: '/carrier/gswlBaseCarrier/list', // +
        delete: '/basics/carrier/delete',
        deleteBatch: '/basics/carrier/deleteBatch',
        add: '/carrier/gswlBaseCarrier/add', // +
        edit: '/carrier/gswlBaseCarrier/edit', // +
        deleteStatus: '/carrier/gswlBaseCarrier/isEnable', // +

        // 根据承运商名称查询承运商信息
        getCarrier: '/carrier/gswlBaseCarrier/getCarrierByName', // +
        // 启用禁用承运商
        isEnable: '/carrier/gswlBaseCarrier/isEnable', // +
        // 承运商详情信息表
        BaseCarrier: '/carrier/gswlBaseCarrier/queryById', // +
        // 统计业务往来
        statisBus: '/carrier/gswlBaseCarrier/statisBusContacts' // +
    },
    //  费率记录
    rateRecordUrl: {
        list: '/carrier/gswlBaseCarrier/list'
    },

    //  我的订单

    //  订单详情
    orderDetail: 'order/detail',
    //  我的订单管理
    myorderUrl: {
        list: '/order/gswlOrder/list',
        // imgerver: window._CONFIG['staticDomainURL'],
        // syncUser: '/process/extActProcess/doSyncUser',
        delete: '/order/gswlOrder/cancle',
        deleteBatch: '/order/gswlOrder/cancleBatch',
        exportXlsUrl: '/order/gswlOrder/exportXls/0',
        importExcelUrl: `${window._CONFIG['domianURL']}/order/gswlOrder/importExcel`,
        assignedCarrier: '/order/gswlOrder/assignCarrierByOwner',
        // 承运商公司
        compony: '/carrier/gswlBaseCarrier/getCarrierByName',
        commonDown: '/sys/common/download/excelTemplate/订单导入模板.xls'
    },
    //  外部订单
    externalorderUrl: {
        list: '/order/gswlOrder/list',

        delete: '/order/gswlOrder/isAcceptOrder',
        deleteBatch: '/order/gswlOrder/isAcceptOrder',
        exportXlsUrl: '/order/gswlOrder/exportXls/1',
        assignedCarrier: '/order/gswlOrder/assignCarrierByOwner'
    },
    //  创建订单
    createOrderUrl: {
        //  开单
        add: '/order/gswlOrder/createOrder',
        //  修改订单
        edit: '/order/gswlOrder/edit',
        //  获取客户单位
        customerList: '/createorder/customerList',
        //  获取发货单位列表
        consignorList: '/createorder/getConsignorList',
        //  获取收货单位列表
        consigneeList: '/createorder/getConsigneeList',
        //  生成订单号
        orderNo: '/order/gswlOrder/getOrderNo'
    },
    // 车辆管理
    carUrl: {
        list: '/vehicle/gswlBaseVehicle/list', // +
        delete: '/vehicle/gswlBaseVehicle/delete', // +
        deleteBatch: '/vehicle/gswlBaseVehicle/deleteBatch', // +
        add: '/vehicle/gswlBaseVehicle/add', // +
        edit: '/vehicle/gswlBaseVehicle/modify', // +
        // 更改车辆司机信息
        editCar: '/vehicle/gswlBaseVehicle/modifyDriverVehicle' // +
    },
    // 司机管理
    driverUrl: {
        list: '/base/driver/list', // +
        delete: '/base/driver/del', // +
        add: '/base/driver/add', // +
        edit: '/base/driver/edit', // +
        // 导出
        excelc: '/base/driver/exportXls', // +
        // 导入数据
        excelr: '/base/driver/importExcel', // +
        // 根据司机姓名或手机号查询司机信息
        finds: '/base/driver/importExcel', // +
        // 司机业务
        statisBus: '/base/driver/statisDriverBusContacts' // ++
    },
    // 系统设置
    systemSttings: {
        list: '/carrier/gswlBaseCarrier/queryCompanyInfo', //+
    },
    // 司机审核
    driverContent: {
        list: '/base/driver/list', // +
        reviewdDriver: '/base/driver/review' // +
    },
    // 投诉反馈
    opinion: {
        list: '/feedback/gswlCommonFeedback/list', // +
        delete: '/feedback/gswlCommonFeedback/delete', // +
        add: '/feedback/gswlCommonFeedback/add', // +
        edit: '/feedback/gswlCommonFeedback/edit' // +
    },
    // 系统设置
    company: '/carrier/gswlBaseCarrier/modifyCompanyInfo' // +

}
export default api