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
            title: '身份证号',
            align: 'center',
            width: 300,
            dataIndex: 'name'
        },
        {
            title: '姓名',
            align: 'center',
            width: 100,
            dataIndex: 'name'
        }, {
            title: '性别',
            align: 'center',
            width: 100,
            dataIndex: 'sex'
        }, {
            title: '联系电话',
            align: 'center',
            width: 200,
            dataIndex: 'phone'
        }, {
            title: '驾驶证号',
            align: 'center',
            width: 400,
            dataIndex: 'dun'
        }, {
            title: '驾驶证类型',
            align: 'center',
            width: 260,
            dataIndex: 'dun'
        }, {
            title: '从业资格证号',
            align: 'center',
            width: 300,
            dataIndex: 'dun'
        }, {
            title: '创建时间',
            align: 'center',
            width: 150,
            dataIndex: 'dun'
        },
        {
            title: '操作',
            align: 'center',
            width: 300,
            dataIndex: 'action',
            scopedSlots: {
                customRender: 'action'
            }
        }
    ],
    //  司机
    basiceUrl: [{
        list: '/basics/tableData',
        delete: '/basics/delete',
        deleteBatch: '/basics/deleteBatch',
        add: '/basics/add',
        edit: '/basics/edit',
        // 文件上传
        updata: '/sya/updata'
    }]
}
export default tableData