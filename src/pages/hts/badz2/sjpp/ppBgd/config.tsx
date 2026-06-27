import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title:
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '';
unitConfig.api_grid_query = `/yw/badze/sjpp/querySjppCkbgdList`;   // api 列表查询
unitConfig.grid_row_key = 'bgdhgbh';                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.grid_scroll_x = '1450px';
unitConfig.grid_selection_type = 'checkbox';                                               //复选框隐藏
unitConfig.toolbar_show_grid_checked_num = false;                                                 // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.grid_show_serial_number = false;                                           // 是否显示序号，可选，默认不显示


// 配置列表列
unitConfig.grid_columns = [
  { title: '合计（份）', dataIndex: 'zfs', width: 100 },
  { title: '报关单号', dataIndex: 'bgdhgbh', width: 150, align: 'right' },
  { title: '出口日期', dataIndex: 'ckrq1', width: 130, sorter: true, },
  { title: '合同协议号', dataIndex: 'ckhth', width: 120 , ellipsis: true, sorter: true},
  {
    title: '运输方式', dataIndex: 'ysfsDm', width: 120, codeTable: 'CODE_DM_CKTS_HGYSFS:01', ellipsis: true,
  },
  { title: '提运单号', dataIndex: 'tydh', width: 80, ellipsis: true},
  { title: '出口销售合同', dataIndex: 'ckxshtfs', width: 100, align: 'right' },
  { title: '购货合同', dataIndex: 'gwhtfs', width: 100, align: 'right' },
  { title: '外贸综合服务合同', dataIndex: 'wzfhtfs', width: 140, align: 'right' },
  { title: '提运单', dataIndex: 'tydfs', width: 100, align: 'right' },
  { title: '运输发票', dataIndex: 'ysfpfs', width: 100, align: 'right' },
  { title: '委托报关协议', dataIndex: 'wtbgxyfs', width: 100, align: 'right' },
  { title: '代理报关服务费发票', dataIndex: 'dlbgfwfpfs', width: 140, align: 'right' },
  { title: '其他单证', dataIndex: 'qtdzfs', width: 100, align: 'right' },
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'bgdhgbh', label: '报关单号', type: 'Input' },
  { name: 'ckhth', label: '合同协议号', type: 'Input' },
  { name: 'tydh', label: '提运单号', type: 'Input' },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  add: false,
  edit: false,
  delete: false,
  upload: false,
  setting: true,
  full: false,
  reload: true,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};


// 配置项：自定义操作列
unitConfig.handle_columns = [
  { name: '编辑', key: 'bj', func: 'handleColumnsBj' },
];
export default unitConfig;
