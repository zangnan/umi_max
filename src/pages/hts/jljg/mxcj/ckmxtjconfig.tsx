import myUtil from '@/components/DDAssist/util';
import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 进料加工业务免抵退税核销表 查看明细 统计
 */
const unitConfig: any = {};

// 配置项
unitConfig.api_grid_query = `/yw/jljg/mxcj/mdthx/jssjfplyb`;
unitConfig.module_key = '';
unitConfig.grid_show_serial_number = true;                                           // 是否显示序号，可选
unitConfig.toolbar_show_grid_checked_num = false;
// unitConfig.show_toolbar = false;                                                       // 是否开启工具栏，默认true开启
unitConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
unitConfig.layout_type = 'modal';                                                     // 页面类型，默认default 可选 default modal tabs
unitConfig.grid_selection_type = false;                                               // 列表首选项类别，默认 checkbox，可选 false radio checkbox                                          // 工具栏左侧是否显示数据条数及选中数，默认true显示

// 配置列表列
unitConfig.grid_columns = [
  { title: '进（出）口标识', dataIndex: 'jckbz', width: 135,codeTable: 'CODE_STATIC_JLJGHX_JCKBZ:01',
    filter: {
      type: 'Radio',
      codeTable: 'CODE_STATIC_JLJGHX_JCKBZ:01',
    }
  },
  { title: '监管方式代码', dataIndex: 'jgfsDm', width: 130,
    filter: {
      type: 'Select',
      codeTable: 'CODE_DM_CKTS_HGJGFS:01',
      showCode: true,
    }
  },
  { title: '监管方式名称', dataIndex: 'jgfsmc', width: 105, ellipsis: true,  render: (text: any, record: any) => myUtil.code.getCodeValByKey(record.jgfsDm, 'CODE_DM_CKTS_HGJGFS:01')},
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
unitConfig.toolbar_default = {
  setting: true,
  full: true,
  reload: true,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};

// 配置项：自定义工具栏
unitConfig.customer_toolbar= [
  { name: '数据导出', key: 'sjdc', func: 'handleMdthxFplSjdc'},
];

unitConfig.handle_columns = [];
export default unitConfig;