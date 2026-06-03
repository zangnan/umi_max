const unitConfig: any = {};

// 配置项
unitConfig.layout_type = 'modal';
unitConfig.unit_key = 'DC_MBCX_CKTS_TY_CKSPTSLWK_WK';
unitConfig.grid_selection_type = false;
unitConfig.grid_row_key = 'uuid';
unitConfig.grid_show_data_num = false;
unitConfig.show_toolbar = false;
unitConfig.grid_show_serial_number = true;                      // 是否显示序号，默认不显示
// 配置项：列表列
unitConfig.grid_columns = [
  { title: '商品代码', dataIndex: 'ckspDm', width: 100, ellipsis: true ,fixed: 'left'  },
  { title: '商品名称', dataIndex: 'ckspmc', width: 160, ellipsis: true  ,fixed: 'left'},
  { title: '商品码单位', dataIndex: 'hgjldwmc', width: 100, ellipsis: true},
  { title: '起始日期', dataIndex: 'yxqq', width: 120, ellipsis: true },
  { title: '终止日期', dataIndex: 'yxqz', width: 120, ellipsis: true  },

  { title: '基本商品标志', dataIndex: 'jbspbz', width: 100, ellipsis: true },
  { title: '是否退税', dataIndex: 'tsbzmc', width: 80, ellipsis: true  },
  { title: '税种', dataIndex: 'sz', width: 80, ellipsis: true },
  { title: '征税税率', dataIndex: 'zssljh', width: 100, ellipsis: true  },
  { title: '退税率', dataIndex: 'tsl', width: 100, ellipsis: true },
  { title: '从量定额', dataIndex: 'cldezs', width: 120, ellipsis: true  },
  { title: '从价定率', dataIndex: 'cjdlzs', width: 120, ellipsis: true },
  { title: '特殊商品标识', dataIndex: 'cksptssplxDm', width: 100, ellipsis: true  },
  { title: '标准商品标志', dataIndex: 'bzspbz', width: 100, ellipsis: true },
  { title: '标准单位标志', dataIndex: 'bzdwbz', width: 100, ellipsis: true  },
];

export default unitConfig;