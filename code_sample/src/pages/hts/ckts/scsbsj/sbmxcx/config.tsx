// 退税申报
const unitConfig: any = {};

// 配置项
unitConfig.page_id = 'tslc_tssb_list_1';
unitConfig.grid_title = '退税申报';
unitConfig.layout_type = 'modal';    

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: false,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
  add: false,
  delete: false,
  ckts_download: true, // 是否显示导出按钮，默认关,
  upload: false,
  edit: false, // 是否显示修改按钮，默认关闭
  ckts_sum: false, // 是否显示小计按钮，默认关闭
  ckts_order: 3, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
};

export default unitConfig;