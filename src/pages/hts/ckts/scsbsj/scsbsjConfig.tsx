import CONSTANTS from '@/components/DDAssist/constants';
// 退税申报
const unitConfig: any = {};

// 配置项
unitConfig.page_id = 'tslc_tssb_list_1';
unitConfig.grid_title = '退税申报';
unitConfig.api_grid_query = `/yw/bszx/ggfw/scsbsj/sjgl/querySbsjJlCp`;
unitConfig.grid_row_key = { type: '1', key: ['ssq', 'sbpc'] };
unitConfig.grid_selection_type = 'radio';
unitConfig.grid_scroll_x = '1200px';

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};

unitConfig.customer_toolbar = [];
unitConfig.handle_columns = [];
export default unitConfig;