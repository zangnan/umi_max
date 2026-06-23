import CONSTANTS from '@/components/DDAssist/constants';
// 申报数据查询
const unitConfig: any = {};

// 配置项
unitConfig.page_id = 'tslc_tsjgcx_list_1';
unitConfig.grid_title = '申报结果查询';
unitConfig.api_grid_query = `/yw/bszx/ggfw/shjgcx/queryPagerSblbCp`;
unitConfig.grid_row_key = { type: '1', key: ['ssq', 'sbpc'] };
unitConfig.grid_selection_type = false;
unitConfig.grid_scroll_x = '1000px';

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: false,                     // 是否显示刷新按钮，默认关闭
};

// 配置项：自定义工具栏
unitConfig.customer_toolbar = [
  // { name: '历史申报记录', key: 'lssbjl', func: 'historyRecord' },
  { name: '反馈读入', key: 'fkdr', func: 'shfkdr' },
  { name: '审核数据下载', key: 'shsjxz', func: 'shsjxz' },
];

unitConfig.handle_columns = [];
export default unitConfig;