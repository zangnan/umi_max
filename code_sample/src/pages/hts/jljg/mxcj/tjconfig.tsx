import myUtil from '@/pages/common/myUtil';

/**
 * title: 核销申报数据管理-重新计算分配率
 * author: yxy
 */
const cxjsfplconfig: any = {};

// 配置项
cxjsfplconfig.unit_key = 'JLJGHX_HXSBSJGL_JLJGYWMDTSHXB_CKMX_TJ';
cxjsfplconfig.export_key = 'JLJGHX_HXSBSJGL_JLJGYWMDTSHXB_CKMX_TJ';
cxjsfplconfig.grid_show_serial_number = true;                                          
cxjsfplconfig.grid_show_data_num = false;
cxjsfplconfig.show_toolbar = true;                                                       // 是否开启工具栏，默认true开启
cxjsfplconfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
cxjsfplconfig.layout_type = 'modal';                                                     // 页面类型，默认default 可选 default modal tabs
cxjsfplconfig.grid_selection_type = false;                                               // 列表首选项类别，默认 checkbox，可选 false radio checkbox

// 配置项：列表列
cxjsfplconfig.grid_columns = [
  { title: '进（出）口标识', dataIndex: 'jckbz', width: 135,codeTable: ['CODE_STATIC_JLJGHX_JCKBZ', '01'],
    filter: {
      type: 'Radio',
      codeTable: ['CODE_STATIC_JLJGHX_JCKBZ', '01'],
    }
  },
  { title: '监管方式代码', dataIndex: 'jgfsDm', width: 130,
    filter: {
      type: 'Select',
      codeTable: ['CODE_DM_CKTS_HGJGFS', '01'],
      showCode: true,
    }
  },
  { title: '监管方式名称', dataIndex: 'jgfsmc', width: 105, ellipsis: true,  render: (text: any, record: any) => myUtil.code.getCodeValByKey(record.jgfsDm, 'CODE_DM_CKTS_HGJGFS', '01')},
  {
    title: '美元金额', children: [
      { title: '合计', dataIndex: 'hj', width: 110, align: 'right', render: { type: 'number', format: '0,0.00' }},
      { title: '税务反馈', dataIndex: 'fkmyje', width: 110, align: 'right', render: { type: 'number', format: '0,0.00' } },
      { title: '调整表', dataIndex: 'tzbmyje', width: 110, align: 'right', render: { type: 'number', format: '0,0.00' } },
    ] 
  },
  {
    title: '关单份数', children: [
      { title: '合计', dataIndex: 'gdhj', width: 110, align: 'right', render: { type: 'number', format: '0,0' }},
      { title: '税务反馈', dataIndex: 'fkgdfs', width: 110, align: 'right', render: { type: 'number', format: '0,0' } },
      { title: '调整表', dataIndex: 'tzbgdfs', width: 110, align: 'right', render: { type: 'number', format: '0,0' } },
    ] 
  }
];

// 配置项：工具栏
cxjsfplconfig.toolbar_default = {
  setting: true,
  tssb_download: true,
  reload:true,
};

// 配置项：列表操作列
cxjsfplconfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};

// 配置项：自定义工具栏
cxjsfplconfig.costomer_toobar= [
  // { name: '统计', key: 'ckmxtj', func: 'handleCkmxtj'},
];

export default cxjsfplconfig;