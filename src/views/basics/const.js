import { filterDictText } from '@/components/dict/JDictSelectUtil'
//  承包商
export const carrierTableData = [{
        title: '序号',
        align: 'center',
        width: 60,
        dataIndex: 'num',
        scopedSlots: {
            customRender: 'num'
        },
        fixed: 'left'
    },
    {
        title: '企业全称',
        align: 'center',
        width: 100,
        ellipsis: true,
        fixed: 'left',
        dataIndex: 'carrierName'
    },
    {
        title: '账号',
        align: 'center',
        width: 120,
        ellipsis: true,
        dataIndex: 'username'
    },
    {
        title: '企业简称',
        align: 'center',
        width: 100,
        ellipsis: true,
        dataIndex: 'shortName'
    },
    {
        title: '企业编码',
        align: 'center',
        width: 100,
        ellipsis: true,
        dataIndex: 'carrierCode'
    },
    {
        title: '企业类型',
        align: 'center',
        width: 100,
        ellipsis: true,
        dataIndex: 'enterpriseType',
        scopedSlots: {
            customRender: 'unitType'
        }
    },
    {
        title: '法人',
        align: 'center',
        ellipsis: true,
        dataIndex: 'legalPerson'
    },
    {
        title: '营业执照',
        align: 'center',
        ellipsis: true,
        dataIndex: 'companyBusinessLicense'
    },
    {
        title: '运输经营许可证',
        align: 'center',
        width: 150,
        ellipsis: true,
        dataIndex: 'actualCarrierBusinessLicense'
    },
    {
        title: '联系人',
        align: 'center',
        width: 100,
        ellipsis: true,
        dataIndex: 'linkName'
    },
    {
        title: '联系电话',
        align: 'center',
        width: 100,
        ellipsis: true,
        dataIndex: 'linkPhone'
    },
    {
        title: '创建时间',
        align: 'center',
        width: 200,
        ellipsis: true,
        dataIndex: 'createTime'
    },
    {
        title: '操作',
        align: 'center',
        width: 270,
        ellipsis: true,
        dataIndex: 'action',
        scopedSlots: {
            customRender: 'action'
        },
        fixed: 'right'
    }
]

export const customerTableData = [{
            title: '序号',
            align: 'center',
            ellipsis: true,
            width: 60,
            customRender: (text, record, index) => `${index + 1}`
        },
        {
            title: '公司名称',
            align: 'center',
            width: 70,
            dataIndex: 'customerName',
            ellipsis: true
        },
        {
            title: '账号',
            align: 'center',
            width: 100,
            dataIndex: 'username',
            ellipsis: true
        },
        {
            title: '联系人',
            align: 'center',
            width: 100,
            ellipsis: true,
            dataIndex: 'linkName'
        },
        {
            title: '电话',
            align: 'center',
            width: 100,
            ellipsis: true,
            dataIndex: 'linkPhone'
        },
        {
            title: '所在地',
            align: 'center',
            width: 100,
            ellipsis: true,
            dataIndex: 'countryAddr'
        },
        {
            title: '添加时间',
            align: 'center',
            width: 100,
            ellipsis: true,
            dataIndex: 'createTime'
        },
        {
            title: '操作',
            align: 'center',
            width: 170,
            ellipsis: true,
            dataIndex: 'action',
            scopedSlots: {
                customRender: 'action'
            }
        }
    ]
    // 货主显示页面
export const customerTableDataUser = [{
        title: '序号',
        align: 'center',
        width: 60,
        customRender: (text, record, index) => `${index + 1}`,
        fixed: 'left'
    },
    {
        title: '客户名称',
        align: 'center',
        width: 100,
        dataIndex: 'customerName',
        ellipsis: true
    },

    {
        title: '联系人',
        align: 'center',
        width: 100,
        ellipsis: true,
        dataIndex: 'linkName'
    },
    {
        title: '联系电话',
        align: 'center',
        ellipsis: true,
        width: 100,
        dataIndex: 'linkPhone'
    },
    {
        title: '所在城市',
        align: 'center',
        ellipsis: true,
        width: 100,
        dataIndex: 'countryAddr'
    },
    {
        title: '详细地址',
        align: 'center',
        ellipsis: true,
        width: 100,
        dataIndex: 'detailAddr'
    },
    {
        title: '添加时间',
        ellipsis: true,
        align: 'center',
        width: 100,
        dataIndex: 'createTime'
    },
    {
        title: '操作',
        align: 'center',
        ellipsis: true,
        width: 150,
        dataIndex: 'action',
        scopedSlots: {
            customRender: 'action'
        }
    }
]

export function receiveTableData(that) {
    //  发货联系人
    let title = '收/发货单位'
    switch (that.dataType) {
        case '1':
            title = '发货单位'
            break
        case '0':
            title = '收货单位'
            break
        case '':
            title = '收/发货单位'
            break
        default:
            null
    }
    return [{
            title: '序号',
            align: 'center',
            width: 60,
            customRender: (text, record, index) => `${index + 1}`
        },
        {
            title,
            align: 'center',
            width: 100,
            ellipsis: true,
            dataIndex: 'contactsName'
        },
        {
            title: '联系人',
            align: 'center',
            width: 100,
            ellipsis: true,
            dataIndex: 'linkName'
        },
        {
            title: '联系电话',
            align: 'center',
            width: 100,
            ellipsis: true,
            dataIndex: 'linkPhone'
        },
        {
            title: '所在城市',
            align: 'center',
            width: 100,
            ellipsis: true,
            dataIndex: 'countryAddr'
        },
        {
            title: '详细地址',
            align: 'center',
            width: 100,
            ellipsis: true,
            dataIndex: 'detailAddr'
        },
        {
            title: '操作',
            align: 'center',
            width: 150,
            ellipsis: true,
            dataIndex: 'action',
            scopedSlots: {
                customRender: 'action'
            }
        }
    ]
}

export const carTableData = (that) => {
    return [{
            title: '序号',
            align: 'center',
            width: 60,
            customRender: (text, record, index) => `${index + 1}`,
            fixed: 'left'
        },
        {
            title: '车牌号',
            align: 'center',
            width: 220,
            ellipsis: true,
            dataIndex: 'vehicleNumber'
        },
        {
            title: '合作类型',
            align: 'center',
            width: 130,
            ellipsis: true,
            dataIndex: 'vtype'
        },
        {
            title: '车辆类型',
            align: 'center',
            width: 130,
            ellipsis: true,
            dataIndex: 'vehicleType',
            customRender: text => {
                // 字典值替换通用方法
                return filterDictText(that.carType_dictionary, text)
            }
        },
        {
            title: '司机',
            align: 'center',
            width: 180,
            ellipsis: true,
            scopedSlots: {
                customRender: 'driverName'
            },
            dataIndex: 'driverName'
        },
        {
            title: '车牌颜色',
            align: 'center',
            width: 120,
            ellipsis: true,
            scopedSlots: {
                customRender: 'carBgc'
            },
            dataIndex: 'vehiclePlateColorCode',
            customRender: text => {
                // 字典值替换通用方法
                return filterDictText(that.carbgc_dictionary, text)
            }
        },
        {
            title: '道路运输证',
            align: 'center',
            width: 110,
            ellipsis: true,
            dataIndex: 'roadTransportCertificateNumber'
        },
        {
            title: '额定载重(t)',
            align: 'center',
            width: 100,
            ellipsis: true,
            dataIndex: 'vehicleTonnage'
        },
        {
            title: '额定体积(m³)',
            align: 'center',
            width: 100,
            ellipsis: true,
            dataIndex: 'vehicleVolume'
        },
        {
            title: '车长(m)',
            align: 'center',
            width: 100,
            ellipsis: true,
            dataIndex: 'vehicleLength'
        },
        {
            title: '车宽(m)',
            align: 'center',
            width: 100,
            ellipsis: true,
            dataIndex: 'vehicleWide'
        },
        {
            title: '车高(m)',
            align: 'center',
            width: 100,
            ellipsis: true,
            dataIndex: 'vehicleHeight'
        },
        {
            title: '车辆状态',
            align: 'center',
            width: 100,
            ellipsis: true,
            dataIndex: 'vehicleState',
            customRender: text => {
                // 字典值替换通用方法
                return filterDictText(that.carStatus_dictionary, text)
            }
        },
        {
            title: '创建时间',
            align: 'center',
            ellipsis: true,
            width: 200,
            dataIndex: 'createTime'
        },

        {
            title: '操作',
            align: 'center',
            width: 100,
            dataIndex: 'action',
            ellipsis: true,
            scopedSlots: {
                customRender: 'action'
            },
            fixed: 'right'
        }
    ]
}