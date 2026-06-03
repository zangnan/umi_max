import myUtil from '@/pages/common/myUtil';

/**
 * title: 进料加工业务免抵退税核销表 查看明细
 */
const unitConfig: any = {};

// 配置项
unitConfig.unit_key = 'JLJGHX_HXSBSJGL_JLJGYWMDTSHXB_CKMX';                                               // 业务单元key，对应后端接口
unitConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.grid_scroll_x = '1450px';
unitConfig.grid_selection_type = false;  
// unitConfig.grid_selection_type = 'checkbox';                                               //复选框隐藏
unitConfig.grid_show_data_num = false;                                                 // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.export_key = 'JLJGHX_HXSBSJGL_JLJGYWMDTSHXB_CKMX';
unitConfig.layout_type = 'modal';

// 配置列表列
unitConfig.grid_columns = [
  // { title: '手（账）册号', dataIndex: 'jljgszch', width: 215, ellipsis: true, sorter: true },
  // { title: '核销起始日期', dataIndex: 'hxqsrq', width: 140, render: { type: 'date', format: 'yyyy-MM-DD' } },
  // { title: '核销截止日期', dataIndex: 'hxjzrq', width: 140, render: { type: 'date', format: 'yyyy-MM-DD' } },
  { title: '进（出）口标识', dataIndex: 'jckbzDm', width: 140, codeTable: ['CODE_STATIC_JLJGHX_JCKBZ', '01'] ,filter: {
    type: 'Radio',
    codeTable: ['CODE_STATIC_JLJGHX_JCKBZ', '01'],
  },},
  { title: '报关单号', dataIndex: 'bgdhgbh', width: 180, sorter: true },
  { title: '代理证明号', dataIndex: 'ckhth', width: 180, sorter: true },
  { title: '进（出）口日期', dataIndex: 'ckrq1', width: 130, render: { type: 'date', format: 'yyyy-MM-DD' }, sorter: true, },
  { title: '统计美元价', dataIndex: 'tjmyj', width: 125, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '统计人民币价', dataIndex: 'tjrmbj', width: 125, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '监管方式代码', dataIndex: 'jgfsDm', width: 130, },
  { title: '监管方式名称', dataIndex: 'jgfsmc', width: 130,ellipsis: true, render: (text: any, record: any) => myUtil.code.getCodeValByKey(record.jgfsDm, 'CODE_DM_CKTS_HGJGFS', '01')},
  { title: '数据来源', dataIndex: 'sjly', width: 180 , codeTable: ['code_static_fpgl_zxkp_sjly', '01'],filter: {
    type: 'Radio',
    codeTable: ['code_static_fpgl_zxkp_sjly', '01'],
  },},
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'bgdhgbh', label: '报关单号', type: 'Input' },
  { name: 'ckhth', label: '代理证明号', type: 'Input' },
  { name: 'jgfsDm', label: '监管方式代码', type: 'Select', showType: '3',showSearch: true, codeTable: ['CODE_DM_CKTS_HGJGFS', '01'] }
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  full: true,
  reload: true,
  tssb_download: true,              // 是否显示下载按钮，默认开启
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};

// 配置项：自定义工具栏
unitConfig.costomer_toobar= [
  { name: '统计', key: 'ckmxtj', func: 'handleCkmxtj'},
  // { name: '导出', key: 'sjdc', func: 'exportPager'},
];

export default unitConfig;