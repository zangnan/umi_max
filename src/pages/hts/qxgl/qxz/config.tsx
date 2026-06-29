import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 进度查询
 * author: lincb
 */
const unitConfig: any = {};

// 配置项
unitConfig.module_key = 'CX_SAAS_QXGL_QXZGL';                                         // 业务单元key，对应后端接口
// api 列表查询
unitConfig.grid_show_serial_number = false;                                           // 是否显示序号，可选
unitConfig.grid_click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
unitConfig.grid_scroll_x = '1100px';                                                   // 默认700px
unitConfig.grid_row_key = 'qxzDm';



// 配置项：列表列
unitConfig.grid_columns = [
  { title: '权限组代码', dataIndex: 'qxzDm', width: 140, align: 'left', ellipsis: true, },
  { title: '权限组名称', dataIndex: 'qxzmc', width: 200, align: 'left', ellipsis: true, },
  { title: '权限组描述', dataIndex: 'qxzms', width: 200, align: 'left', ellipsis: true, },
  { title: '有效标志', dataIndex: 'yxbz', width: 100, codeTable: 'code_static_yes_no:01' },
  { title: '地区标志', dataIndex: 'dqbz1',  width: 100, codeTable: 'code_static_yes_no:01' },
  { title: '渠道标志', dataIndex: 'qdbz3', width: 100, codeTable: 'code_static_yes_no:01' },
  { title: '用户标志', dataIndex: 'yhbz', width: 100, codeTable: 'code_static_yes_no:01' },
  { title: '企业标志', dataIndex: 'qybz2', width: 100, codeTable: 'code_static_yes_no:01' },
];


unitConfig.grid_filter_quick = [
  { label: '权限组代码', name: 'qxzDm',  type: 'Input', width: '3w' },
  { label: '权限组名称', name: 'qxzmc',  type: 'Input', width: '3w', searchButton: true },
];

unitConfig.gridParams = {
}

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  reload: true,
  full: true,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};



unitConfig.customer_toolbar = [];
unitConfig.handle_columns = [];
export default unitConfig;