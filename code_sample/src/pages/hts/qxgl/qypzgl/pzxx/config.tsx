/**
 * title: 角色管理
 * author: wx
 */
const unitConfig: any = {};

// 配置项
unitConfig.unit_key = 'CX_SAAS_QXGL_QYPZGL_BYSBQQYUUID';
unitConfig.grid_show_serial_number = false; // 是否显示序号，可选
unitConfig.grid_selection_type = false; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.grid_row_key = 'uuid'; // 列表主键，默认uuid
unitConfig.form_save_check = false; // 表单编辑是否执行后端校验
unitConfig.grid_scroll_x = '400px';
unitConfig.module_type = 'sjbb';

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '配置项代码', dataIndex: 'csbm1', width: 140, ellipsis: true },
  { title: '配置项名称', dataIndex: 'csmc', width: 180 },
  { title: '配置项说明', dataIndex: 'cssm', width: 180, ellipsis: true  },
  { title: '配置值', dataIndex: 'cssz', width: 80, ellipsis: true  }
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'csbm1', label: '配置项代码', type: 'Input' },
  { name: 'csmc', label: '配置项名称', type: 'Input' },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: false,
  full: false,
  reload: true,
};

export default unitConfig;
