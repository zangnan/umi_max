import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 报关单数据
 */
const unitConfig: any = {};

// 配置项
unitConfig.api_grid_query = `/hx/ty/crud/queryPager/MBCX_DM_GY_HGGQKA/05`;        // api 列表查询
unitConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.grid_scroll_x = '1450px';
unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.grid_show_serial_number = true;                      // 是否显示序号，默认不显示


// 配置列表列
unitConfig.grid_columns = [
  { title: '海关关区口岸代码', dataIndex: 'hggqkaDm', fixed: 'left', width: 350},
  { title: '海关关别名称', dataIndex: 'hggqkamc',  ellipsis: true  },
];

unitConfig.grid_filter_quick = [
  { name: 'hggqkaDm', label: '海关关区口岸代码', type: 'Input' },
  { name: 'hggqkamc', label: '海关关别名称', type: 'Input', searchButton: true },
];
// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  download: false,
  full: true,
  reload: true,
  ckts_download: false,                   // 是否显示导出，默认关闭
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};

unitConfig.customer_toolbar = [];
unitConfig.handle_columns = [];
export default unitConfig;
