// 审核数据下载
const unitConfig: any = {};

// 配置项
unitConfig.page_id = 'tslc_tsjgcx_shsjxz_1';
unitConfig.grid_api_grid_query = `${API_URL_BASE}/yw/bszx/ggfw/ycsb/yzqfk/ycsbYzfFkxzGetXzjlPage`;
unitConfig.form_api_delete = `${API_URL_BASE}/yw/bszx/ggfw/ycsb/yzqfk/ycsbYzfFkxzFksjbSc`;
unitConfig.grid_row_key = 'uuid';
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