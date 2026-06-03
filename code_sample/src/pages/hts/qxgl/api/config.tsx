/**
 * title: 角色管理
 * author: wx
 */
const unitConfig: any = {};

// 配置项
unitConfig.unit_key = 'CX_SAAS_QXGL_APIFWGL';
unitConfig.grid_show_serial_number = false; // 是否显示序号，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.grid_row_key = 'uuid'; // 列表主键，默认uuid
unitConfig.form_save_check = false; // 表单编辑是否执行后端校验
unitConfig.grid_scroll_x = '400px';
unitConfig.module_type = 'sjbb';


// 配置项：列表列
unitConfig.grid_columns = [
  { title: 'API服务代码', dataIndex: 'apifwDm', width: 100, ellipsis: true },
  { title: 'API服务名称', dataIndex: 'apifwmc' , width: 200, align: 'left', ellipsis: true},
  // { title: 'API请求地址', dataIndex: 'glyhs', align: 'left', ellipsis: true},
  { title: '上级API服务代码', dataIndex: 'sjapifwDm', align: 'left', ellipsis: true},
  { title: '叶子节点标志', dataIndex: 'yzjdbz',  width: 120, codeTable: ['code_static_yes_no', '01'] },
  { title: '启用标志', dataIndex: 'yxbz',  width: 100, codeTable: ['code_static_yes_no', '01']  ,filter: {
    type: 'Select',
    codeTable: ['code_static_yes_no', '01']
  }, },
  { title: '选用标志', dataIndex: 'xybz',  width: 100, codeTable: ['code_static_yes_no', '01']  ,filter: {
    type: 'Select',
    codeTable: ['code_static_yes_no', '01']
  }, },];


unitConfig.filter_items = [
  { name: 'apifwDm', label: 'API服务代码', type: 'Input' },
  { name: 'apifwmc', label: 'API服务名称', type: 'Input' },
  { name: 'sjapifwDm', label: '上级API服务代码', type: 'Input' },
  { name: 'yzjdbz', label: '叶子节点标志', type: 'Select',codeTable: ['code_static_yes_no', '01'] },
];
// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  full: true,
  reload: true,
};

// 配置项：自定义工具栏
unitConfig.costomer_toobar = [
  // { name: '导出字典', key: 'addqxz42', func: 'exportZd'},
  { name: '导出脚本', key: 'addqxz34', func: 'exportJb'},
  { name: '新建', func: 'add' },
  { name: '修改', func: 'edit' },
  { name: '刪除', func: 'del' },
];

// 配置项：自定义操作列
// unitConfig.handle_columns = [
//   { name: '編輯', func: 'editBd' },
// ];


export default unitConfig;
