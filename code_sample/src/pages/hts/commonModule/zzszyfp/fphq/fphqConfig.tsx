// 发票获取
const unitConfig: any = {};

// 配置项
unitConfig.page_id = 'tslc_tsjgcx_shsjxz_1';
unitConfig.grid_api_grid_query = `${API_URL_BASE}/yw/saas/yzfpt/yzfptRwcxPage`;
unitConfig.grid_row_key = 'zrwuuid';
unitConfig.layout_type = 'modal';
unitConfig.show_toolbar = false;
unitConfig.grid_selection_type = false;

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};

export default unitConfig;