const backstage = {
    //  ------------------投诉处理------------------
    opinionContent: [{
            title: '序号',
            align: 'center',
            width: 50,
            dataIndex: 'num',
            scopedSlots: {
                customRender: 'num'
            }
        }, {
            title: '意见反馈',
            align: 'center',
            dataIndex: 'feedbackDesc',
            width: 200
        },
        {
            title: '图片',
            align: 'center',
            dataIndex: 'feedbackImg',
            width: 100,
            scopedSlots: {
                customRender: 'feedbackImg'
            }
        },
        {
            title: '姓名',
            align: 'center',
            ellipsis: true,
            width: 100,
            dataIndex: 'linkName'
        },
        {
            title: '电话',
            align: 'center',
            ellipsis: true,
            width: 150,
            dataIndex: 'linkPhone'

        },
        {
            title: '反馈时间',
            align: 'center',
            ellipsis: true,
            width: 200,
            dataIndex: 'feedbackTime'

        },
        {
            title: '操作人',
            align: 'center',
            ellipsis: true,
            width: 100,
            dataIndex: 'replyBy'

        },
        {
            title: '回复内容',
            align: 'center',
            ellipsis: true,
            width: 200,
            dataIndex: 'replyDesc',
            scopedSlots: {
                customRender: 'replyDesc'
            }

        },
        {
            title: '操作',
            align: 'center',
            ellipsis: true,
            dataIndex: 'action',
            width: 80,
            scopedSlots: {
                customRender: 'action'
            }
        }
    ],
    //  ------------------司机审核------------------
    driverContent: [{
            title: '序号',
            align: 'center',
            width: 100,
            dataIndex: 'num',
            scopedSlots: {
                customRender: 'num'
            }
        }, {
            title: '是否失效',
            align: 'center',
            dataIndex: 'delFlag',
            width: 100
        },
        {
            title: '真实姓名',
            align: 'center',
            dataIndex: 'driverName',
            width: 100
        },
        {
            title: '手机号',
            align: 'center',
            width: 100,
            dataIndex: 'telephone'
        },
        {
            title: '身份证号码',
            align: 'center',
            width: 150,
            dataIndex: 'drivingLicense'

        },
        {
            title: '当前状态',
            align: 'center',
            width: 100,
            dataIndex: 'authState_dictText'

        },
        {
            title: '申请审核时间',
            align: 'center',
            width: 200,
            dataIndex: 'authTime'

        },
        {
            title: '操作',
            align: 'center',
            dataIndex: 'action',
            width: 80,
            scopedSlots: {
                customRender: 'action'
            }
        }
    ]

}

export default backstage