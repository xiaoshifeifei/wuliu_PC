/*
 * @Description:
 * @Date: 2020-02-27 10:05:52
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-04-24 17:02:19
 */
// 此文件用来存放表头数据， 方便和对端对接时修改

const tableData = {
    //  ------------------我的订单------------------
    myorderData: [{
            title: '订单号',
            align: 'center',
            dataIndex: 'orderNo',
            width: 100,
            fixed: 'left'
        },
        {
            title: '委托单号',
            align: 'center',
            dataIndex: 'shippingNoteNumber',
            width: 100,
            fixed: 'left'
        },
        {
            title: '托运时间',
            align: 'center',
            width: 300,
            dataIndex: 'consignmentDateTime'
        },
        {
            title: '配送时间',
            align: 'center',
            width: 300,
            dataIndex: 'shippingDateTime',
            scopedSlots: {
                customRender: 'shippingDateTime'
            }
        },
        {
            title: '订单来源',
            align: 'center',
            width: 80,
            dataIndex: 'dataSource'
        },
        {
            title: '状态',
            align: 'center',
            width: 150,
            dataIndex: 'gswlOrderTransfer.orderStatus',
            scopedSlots: {
                customRender: 'gswlOrderTransfer.orderStatus'
            }
        },
        {
            title: '承运商',
            align: 'center',
            width: 100,
            dataIndex: 'gswlOrderTransfer.carrierName'
        },
        {
            title: '承运商运费',
            align: 'center',
            width: 180,
            dataIndex: 'gswlOrderTransfer.carrierFreight',
            scopedSlots: {
                customRender: 'gswlOrderTransfer.carrierFreight'
            },
            sorter: (a, b) => a['gswlOrderTransfer.carrierFreight'] - b['gswlOrderTransfer.carrierFreight']
        },
        {
            title: '发货单位',
            align: 'center',
            width: 80,
            dataIndex: 'consignor'
        },
        {
            title: '发货人',
            dataIndex: 'consignorLinkName',
            align: 'center',
            width: 170
        },
        {
            title: '发货电话',
            align: 'center',
            dataIndex: 'consignorLinkPhone',
            width: 120
        },
        {
            title: '出发地',
            align: 'center',
            dataIndex: 'consignorAddr',
            width: 120
        },
        {
            title: '发货地址',
            align: 'center',
            dataIndex: 'consignorDeailAddr',
            width: 120
        },
        {
            title: '收货单位',
            align: 'center',
            dataIndex: 'consignee',
            width: 120
        },
        {
            title: '收货人',
            align: 'center',
            dataIndex: 'consigneeLinkName',
            width: 120
        },
        {
            title: '收货电话',
            align: 'center',
            dataIndex: 'consigneeLinkPhone',
            width: 120
        },
        {
            title: '目的地',
            align: 'center',
            dataIndex: 'consigneeAddr',
            width: 120
        },
        {
            title: '发货地址',
            align: 'center',
            dataIndex: 'consigneeDeailAddr',
            width: 120
        },
        {
            title: '运输模式',
            align: 'center',
            dataIndex: 'transportMode',
            width: 120
        },
        {
            title: '物品名称',
            align: 'center',
            dataIndex: 'goodsNames',
            width: 120
        },
        {
            title: '总数量',
            align: 'center',
            dataIndex: ' gswlOrderGoodsList[0].totalNumberOfPackages',
            width: 120
        },
        {
            title: '总重量（吨）',
            align: 'center',
            dataIndex: 'gswlOrderGoodsList[0].goodsItemGrossWeight',
            width: 120
        },
        {
            title: '总体积（m³）',
            align: 'center',
            dataIndex: 'gswlOrderGoodsList[0].cube',
            width: 120
        },
        {
            title: '结算方式',
            align: 'center',
            dataIndex: 'gswlOrderTransfer.settlementWays',
            width: 120
        },
        {
            title: '回单类型',
            align: 'center',
            dataIndex: 'gswlOrderTransfer.receiptType',
            width: 120
        },
        {
            title: '回单数量',
            align: 'center',
            dataIndex: 'gswlOrderTransfer.receiptNo',
            width: 120
        },
        {
            title: '运费收入',
            align: 'center',
            dataIndex: 'gswlOrderTransfer.freight',
            width: 120,
            scopedSlots: {
                customRender: 'gswlOrderTransfer.freight'
            },
            sorter: (a, b) => a['gswlOrderTransfer.freight'] - b['gswlOrderTransfer.freight']
        },
        {
            title: '结算天数',
            align: 'center',
            dataIndex: 'gswlOrderTransfer.settlementDays',
            width: 120
        },
        {
            title: '操作人',
            align: 'center',
            dataIndex: 'createBy',
            width: 120
        },
        {
            title: '操作',
            align: 'center',
            fixed: 'right',
            dataIndex: 'action',
            width: 250,
            scopedSlots: {
                customRender: 'action'
            }
        }
    ],
    carrierTable: [{
            title: '订单号',
            align: 'center',
            dataIndex: 'id',
            width: 100
        },
        {
            title: '订单来源',
            align: 'center',
            width: 80,
            dataIndex: 'dataSource_dictionary'
        },
        {
            title: '运费收入',
            align: 'center',
            dataIndex: 'FreightIncome',
            width: 120,
            scopedSlots: {
                customRender: 'FreightIncome'
            },
            sorter: (a, b) => a.FreightIncome - b.FreightIncome
        },

        {
            title: '承运商运费',
            align: 'center',
            width: 180,
            dataIndex: 'gswlOrderTransfer.carrierFreight',
            scopedSlots: {
                customRender: 'gswlOrderTransfer.carrierFreight'
            },
            sorter: (a, b) => a['gswlOrderTransfer.carrierFreight'] - b['gswlOrderTransfer.carrierFreight']
        }
    ],
    //  指派司机 - 订单详情
    driverOrderTable: [{
            title: '订单号',
            align: 'center',
            dataIndex: 'orderNo',
            width: 100
        },
        {
            title: '出发地',
            align: 'center',
            dataIndex: 'consignorAddr',
            width: 120
        },
        {
            title: '目的地',
            align: 'center',
            dataIndex: 'consigneeAddr',
            width: 120
        },
        {
            title: '物品名称',
            align: 'center',
            dataIndex: 'goodsNames',
            width: 120
        },
        {
            title: '总数量',
            align: 'center',
            dataIndex: ' gswlOrderGoodsList[0].totalNumberOfPackages',
            width: 80
        },
        {
            title: '总重量（吨）',
            align: 'center',
            dataIndex: 'gswlOrderGoodsList[0].goodsItemGrossWeight',
            width: 80
        },
        {
            title: '总体积（m³）',
            align: 'center',
            dataIndex: 'gswlOrderGoodsList[0].cube',
            width: 80
        },
        {
            title: '回单类型',
            align: 'center',
            dataIndex: 'gswlOrderTransfer.receiptType',
            width: 120
        },
        {
            title: '回单数量',
            align: 'center',
            dataIndex: 'gswlOrderTransfer.receiptNo',
            width: 120
        }
    ],

    // 指派司机 - 司机表格数据
    driverTableData: [],

    orderDetail: [{
            title: '货物名称',
            align: 'center',
            dataIndex: 'id',
            width: 100
        },
        {
            title: '货物类型',
            align: 'center',
            dataIndex: 'id',
            width: 100
        },
        {
            title: '包装',
            align: 'center',
            dataIndex: 'id',
            width: 100
        },
        {
            title: '数量',
            align: 'center',
            dataIndex: 'id',
            width: 100
        },
        {
            title: '重量（吨）',
            align: 'center',
            dataIndex: 'id',
            width: 100
        },
        {
            title: '体积（m³）',
            align: 'center',
            dataIndex: 'id',
            width: 100
        },
        {
            title: '运费支出',
            align: 'center',
            dataIndex: 'id',
            width: 100
        }
    ],
    //  基础管理
    //  物品管理
    basicsTableData: [{
            title: '物品名称',
            align: 'center',
            width: 100,
            dataIndex: 'descriptionOfGoods'
        },
        {
            title: '物品类型',
            align: 'center',
            width: 100,
            dataIndex: 'cargoTypeClassificationCode',
            scopedSlots: {
                customRender: 'cargoTypeClassificationCode'
            }
        },
        {
            title: '物品包装',
            align: 'center',
            width: 100,
            dataIndex: 'cargoPackCode',
            scopedSlots: {
                customRender: 'cargoPackCode'
            }
        },
        {
            title: '重量(吨)',
            align: 'center',
            width: 100,
            dataIndex: 'goodsItemGrossWeight'
        },
        {
            title: '体积（m³）',
            align: 'center',
            width: 100,
            dataIndex: 'cube'
        },
        {
            title: '总件数',
            align: 'center',
            width: 100,
            dataIndex: 'totalNumberOfPackages'
        },
        {
            title: '创建时间',
            align: 'center',
            width: 100,
            dataIndex: 'createTime'
        },
        {
            title: '操作',
            align: 'center',
            fixed: 'right',
            width: 100,
            dataIndex: 'action',
            scopedSlots: {
                customRender: 'action'
            }
        }
    ],
    customerTableData: [{
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
    ],
    // 货主显示页面
    customerTableDataUser: [{
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
    ],
    //  发货联系人
    shipTableData: [{
            title: '发货单位',
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
    ],
    // 全部客户信息
    receiveTableDataAll: [{
            title: '收/发货单位',
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
    ],
    //  收货联系人
    receiveTableData: [{
            title: '收货单位',
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
    ],
    //  承包商
    carrierTableData: [{
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
    ],
    //  费率记录
    rateRecordTableData: [{
            title: '费率',
            align: 'center',
            width: 100,
            dataIndex: 'rate'
        },
        {
            title: '开始时间',
            align: 'center',
            width: 100,
            dataIndex: 'beginDt'
        },
        {
            title: '结束时间',
            align: 'center',
            width: 100,
            dataIndex: 'endDt'
        },
        {
            title: '操作人',
            align: 'center',
            width: 100,
            dataIndex: 'createBy'
        },
        {
            title: '操作时间',
            align: 'center',
            width: 100,
            dataIndex: 'createTime'
        }
    ]
}

export default tableData