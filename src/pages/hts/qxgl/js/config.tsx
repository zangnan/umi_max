import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 角色管理
 * author: wx
 */
const unitConfig: any = {};

// 配置项
unitConfig.module_key = 'FPZS_BGDKP_DKP18WBGDCX';
unitConfig.api_grid_query = `/yw/dditSaas/qxjs/queryJsPager`;
unitConfig.api_form_delete = '/yw/dditSaas/qxyh/deleteYh'
unitConfig.grid_show_serial_number = false; // 是否显示序号，可选
unitConfig.grid_selection_type = 'radio'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
// unitConfig.grid_click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
unitConfig.grid_row_key = 'jsDm'; // 列表主键，默认uuid
unitConfig.form_save_check = false; // 表单编辑是否执行后端校验
unitConfig.batch_delete_key = 'jsDm';
unitConfig.grid_scroll_x = '400px';

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '角色名称', dataIndex: 'jsmc', width: 100, ellipsis: true },
  { title: '角色描述', dataIndex: 'jsms', ellipsis: true },
  { title: '关联用户数', dataIndex: 'glyhs', width: 100, align: 'right', render: { func: 'renderGlyhs' } },
  { title: '创建人', dataIndex: 'lrrmc',width: 100, ellipsis: true },
];

// 配置项：列表筛选项
unitConfig.grid_filter_quick = [
  { name: 'jsmc', label: '角色名称', type: 'Input', searchButton: true },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  full: true,
  reload: true,
};

// 配置项：自定义工具栏
unitConfig.customer_toolbar = [
  { name: '新建', func: 'addJs' },
];

// 配置项：自定义操作列
unitConfig.handle_columns = [
  { name: '修改', func: 'editJs' },
  { name: '删除', func: 'deleteJs' },
];


export default unitConfig;
