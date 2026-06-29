import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 进度查询
 * author: lincb
 */
const unitConfig: any = {};

// 配置项
unitConfig.module_key = 'CX_SAAS_QXGL_QXZGL_CXGLDQ';                                         // 业务单元key，对应后端接口
// api 列表查询
unitConfig.grid_show_serial_number = false;                                           // 是否显示序号，可选
unitConfig.grid_click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
unitConfig.grid_scroll_x = '1100px';                                                   // 默认700px
unitConfig.grid_row_key = 'ssdq';
unitConfig.pagination2 = false;
unitConfig.layout_type = 'modal';
unitConfig.module_type = 'sjbb';



// 配置项：列表列
unitConfig.grid_columns = [
  { title: '地区码', dataIndex: 'ssdq', width: 120, align: 'left', ellipsis: true, },
  { title: '地区名称', dataIndex: 'ssdq1mc', width: 200, align: 'left', ellipsis: true, },
];


unitConfig.filter_items = [
  { name: 'ssdq', label: '地区码', type: 'Input' },
  { name: 'ssdq1mc', label: '地区名称', type: 'Input' },
  { name: 'sfgl', label: '是否关联', type: 'Select', codeTable: 'code_static_yes_no:01' },
];


unitConfig.gridParams = {
}

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: false,
  reload: false,
  full: false,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};


unitConfig.customer_toolbar = [];
unitConfig.handle_columns = [];
export default unitConfig;