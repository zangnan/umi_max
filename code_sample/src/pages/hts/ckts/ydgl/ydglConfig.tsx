// 疑点管理
const unitConfig: any = {};

// 配置项
unitConfig.page_id = 'tslc_scsbsj_ydgl_1';
unitConfig.grid_api_grid_query = `${API_URL_BASE}/yw/bszx/ggfw/ydgl/queryAllYdxxPageCp`;
unitConfig.grid_show_serial_number = true;
unitConfig.grid_selection_type = false;
unitConfig.layout_type = 'modal';

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};

// 配置项：自定义工具栏
unitConfig.costomer_toobar = [
  { name: '导出', key: 'ydgldc', func: 'exportYd' },
];

export default unitConfig;