/*
 * @Description:
 * @Date: 2020-02-27 10:05:52
 * @LastEditors: 自己洗小红花
 * @LastEditTime: 2020-03-10 14:20:59
 */
// 此文件用来存放表头数据， 方便和对端对接时修改
const tableData = {
    //  基础管理
    //  司机管理
    driverData: [{
            title: '序号',
            align: 'center',
            width: 100,
            dataIndex: 'num',
            scopedSlots: {
                customRender: 'num'
            },
            fixed: 'left'
        }, {
            title: '身份证号',
            align: 'center',
            width: 250,
            dataIndex: 'drivingLicense'
        },
        {
            title: '姓名',
            align: 'center',
            width: 80,
            dataIndex: 'driverName'
        }, {
            title: '性别',
            align: 'center',
            width: 50,
            dataIndex: 'sex'
        }, {
            title: '联系电话',
            align: 'center',
            width: 180,
            dataIndex: 'telephone'
        }, {
            title: '驾驶证号',
            align: 'center',
            width: 250,
            dataIndex: 'vehicleNo'
        }, {
            title: '驾驶证类型',
            align: 'center',
            width: 100,
            dataIndex: 'vehicleClass'
        }, {
            title: '从业资格证号',
            align: 'center',
            width: 200,
            dataIndex: 'qualificationCertificate'
        }, {
            title: '创建时间',
            align: 'center',
            width: 150,
            dataIndex: 'createTime'
        },
        {
            title: '操作',
            align: 'center',
            width: 180,
            dataIndex: 'action',
            scopedSlots: {
                customRender: 'action'
            },
            fixed: 'right'
        }
    ],
    carData: [{
            title: '车牌号',
            align: 'center',
            width: 220,
            dataIndex: 'vehicleNumber'
        },
        {
            title: '合作类型',
            align: 'center',
            width: 130,
            dataIndex: 'vtype'
        }, {
            title: '车辆类型',
            align: 'center',
            width: 130,

            dataIndex: 'vehicleType'
        },
        {
            title: '司机',
            align: 'center',
            width: 180,
            scopedSlots: {
                customRender: 'driverName'
            },
            dataIndex: 'driverName'
        },
        {
            title: '车牌颜色',
            align: 'center',
            width: 120,
            scopedSlots: {
                customRender: 'carBgc'
            },
            dataIndex: 'vehiclePlateColorCode'
        }, {
            title: '道路运输证',
            align: 'center',
            width: 110,
            dataIndex: 'roadTransportCertificateNumber'
        }, {
            title: '额定载重(t)',
            align: 'center',
            width: 100,
            dataIndex: 'vehicleTonnage'
        }, {
            title: '额定体积(m³)',
            align: 'center',
            width: 100,
            dataIndex: 'vehicleVolume'
        }, {
            title: '车长(cm)',
            align: 'center',
            width: 100,
            dataIndex: 'vehicleLength'
        }, {
            title: '车宽(cm)',
            align: 'center',
            width: 100,
            dataIndex: 'vehicleWide'
        }, {
            title: '车高(cm)',
            align: 'center',
            width: 100,
            dataIndex: 'vehicleHeight'
        }, {
            title: '车辆状态',
            align: 'center',
            width: 100,
            dataIndex: 'vehicleState'
        }, {
            title: '创建时间',
            align: 'center',
            width: 200,
            dataIndex: 'creatTime'
        },

        {
            title: '操作',
            align: 'center',
            width: 100,
            dataIndex: 'action',
            scopedSlots: {
                customRender: 'action'
            },
            fixed: 'right'
        }
    ],
    CarEditDriverName: [{
        title: '司机',
        align: 'center',
        width: 220,
        dataIndex: 'driverName'
    }, {
        title: '手机号',
        align: 'center',
        width: 130,
        dataIndex: 'vtype'
    }, {
        title: '身份证',
        align: 'center',
        width: 130,
        dataIndex: 'vehicleType'
    }]
}
export default tableData