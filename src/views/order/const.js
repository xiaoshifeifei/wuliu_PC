const constData = {
  createOrderData: {

    columns: [
      {
        title: '序号',
        align: 'center',
        width: 30,
        dataIndex: 'id',
        scopedSlots: {
          customRender: 'id'
        }
      },
      {
        title: '货物名称',
        align: 'center',
        width: 100,
        dataIndex: 'descriptionOfGoods',
        scopedSlots: {
          customRender: 'descriptionOfGoods'
        }
      },
      {
        title: '货物类型',
        align: 'center',
        width: 100,
        dataIndex: 'cargoTypeClassificationCode',
        scopedSlots: {
          customRender: 'cargoTypeClassificationCode'
        }
      },

      {
        title: '包装',
        align: 'center',
        width: 100,
        dataIndex: 'cargoPackCode',
        scopedSlots: {
          customRender: 'cargoPackCode'
        }
      },
      {
        title: '数量',
        align: 'center',
        width: 100,
        dataIndex: 'totalNumberOfPackages',
        scopedSlots: {
          customRender: 'totalNumberOfPackages'
        }
      },
      {
        title: '重量（吨）',
        align: 'center',
        width: 100,
        dataIndex: 'goodsItemGrossWeight',
        scopedSlots: {
          customRender: 'goodsItemGrossWeight'
        }
      },
      {
        title: '体积（m³）',
        align: 'center',
        width: 100,
        dataIndex: 'cube',
        scopedSlots: {
          customRender: 'cube'
        }
      }
    ],
    loading: false,
    /* table选中keys*/
    selectedRowKeys: [],
    /* table选中records*/
    selectionRows: [],
    tagType: 'radio',
    userType: '',
    consignorList: [],
    consigneeList: [],
    goodsList: [],
    // show: true,
    settDayShow: false,
    model: {},
    initialValueCustomer: undefined,
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 }
    },
    labelCol2: {
      xs: { span: 24 },
      sm: { span: 4 }
    },
    wrapperCol2: {
      xs: { span: 24 },
      sm: { span: 20 }
    },
    label: 6,
    num: 0,
    weigth: 0,
    volume: 0,

    dataSource: [
      {
        rowkey: 1,
        cargoTypeClassificationCode: '',
        descriptionOfGoods: '',
        cargoPackCode: '',
        totalNumberOfPackages: '',
        goodsItemGrossWeight: '',
        cube: ''
      }
    ],
    tablelist: {},
    select: {},
    select2: {},
    roleList: [],
    initialValueActualFreight: '',
    path: ''

  },
  makeUpOrderData: {
    columns: [
      {
        title: '序号',
        align: 'center',
        width: 30,
        dataIndex: 'id',
        scopedSlots: {
          customRender: 'id'
        }
      },
      {
        title: '货物名称',
        align: 'center',
        width: 100,
        dataIndex: 'descriptionOfGoods',
        scopedSlots: {
          customRender: 'descriptionOfGoods'
        }
      },
      {
        title: '货物类型',
        align: 'center',
        width: 100,
        dataIndex: 'cargoTypeClassificationCode',
        scopedSlots: {
          customRender: 'cargoTypeClassificationCode'
        }
      },

      {
        title: '包装',
        align: 'center',
        width: 100,
        dataIndex: 'cargoPackCode',
        scopedSlots: {
          customRender: 'cargoPackCode'
        }
      },
      {
        title: '数量',
        align: 'center',
        width: 100,
        dataIndex: 'totalNumberOfPackages',
        scopedSlots: {
          customRender: 'totalNumberOfPackages'
        }
      },
      {
        title: '重量（吨）',
        align: 'center',
        width: 100,
        dataIndex: 'goodsItemGrossWeight',
        scopedSlots: {
          customRender: 'goodsItemGrossWeight'
        }
      },
      {
        title: '体积（m³）',
        align: 'center',
        width: 100,
        dataIndex: 'cube',
        scopedSlots: {
          customRender: 'cube'
        }
      }
    ],
    loading: false,
    /* table选中keys*/
    selectedRowKeys: [],
    /* table选中records*/
    selectionRows: [],
    tagType: 'radio',
    consignorList: [],
    consigneeList: [],
    goodsList: [],
    vehicleNum: '0',
    vehicleMoney: '0',
    show: true,
    settDayShow: false,
    model: {},
    initialValueCustomer: undefined,
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 }
    },
    labelCol2: {
      xs: { span: 24 },
      sm: { span: 4 }
    },
    wrapperCol2: {
      xs: { span: 24 },
      sm: { span: 20 }
    },
    labelCol3: {
      xs: { span: 24 },
      sm: { span: 6 }
    },
    wrapperCol3: {
      xs: { span: 24 },
      sm: { span: 18 }
    },
    label: 6,
    label2: 8,
    num: 0,
    weigth: '0',
    volume: '0',
    driverInfo: [],
    vehicleInfo: [],
    companyList: [],
    dataSource: [
      {
        rowkey: 1,
        cargoTypeClassificationCode: '',
        descriptionOfGoods: '',
        cargoPackCode: '',
        totalNumberOfPackages: '',
        goodsItemGrossWeight: '',
        cube: ''
      }
    ],
    tablelist: {},
    select: {},
    select2: {},
    roleList: [],
    path: '',
    showDetails: false,
    rowSelection: null
  }
}
export default constData
