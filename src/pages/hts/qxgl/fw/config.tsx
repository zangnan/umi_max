import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 角色管理
 * author: wx
 */
const unitConfig: any = {};

// 配置项
unitConfig.module_key = 'CX_SAAS_QXGL_HDFWGL';
unitConfig.grid_show_serial_number = false; // 是否显示序号，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
// unitConfig.grid_click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
unitConfig.grid_row_key = 'fwDm'; // 列表主键，默认uuid
unitConfig.form_save_check = false; // 表单编辑是否执行后端校验
unitConfig.grid_scroll_x = '400px';

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '服务代码', dataIndex: 'fwDm', width: 100, ellipsis: true },
  { title: '服务名称', dataIndex: 'fwmc' , width: 200, align: 'left', ellipsis: true},
  { title: '服务描述', dataIndex: 'fwms', align: 'left', ellipsis: true},
  { title: '有效标志', dataIndex: 'yxbz',  width: 100, codeTable: 'code_static_yes_no:01'  ,filter: {
    type: 'Select',
    codeTable: 'code_static_yes_no:01'
  }, },];

// 配置项：列表筛选项
unitConfig.grid_filter_quick = [
  { name: 'fwDm', label: '服务代码', type: 'Input'},
  { name: 'fwmc', label: '服务名称', type: 'Input', searchButton: true },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  full: true,
  reload: true,
};

// 配置项：自定义工具栏
unitConfig.customer_toolbar = [
  { name: '导出脚本', key: 'addqxz34', func: 'exportJb'},
  { name: '新建', func: 'add' },
  { name: '修改', func: 'edit' },
  { name: '刪除', func: 'del' },
];

// 配置项：自定义操作列
unitConfig.handle_columns = [
  { name: '服务明细', func: 'editBd' },
];


export default unitConfig;
