import CONSTANTS from '@/components/DDAssist/constants';
// 历史申报记录
const unitConfig: any = {};

// 配置项
unitConfig.page_id = 'tslc_tsjgcx_lssbjl_1';
unitConfig.api_grid_query = `/yw/bszx/ggfw/shjgcx/lssbsjcx`;
unitConfig.grid_row_key = 'his_uuid';
unitConfig.layout_type = 'modal';

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
unitConfig.grid_filter_quick = [
  { label: '申报时间', name: 'ckrq1', type: 'DatePicker', range: true },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};

unitConfig.customer_toolbar = [];
unitConfig.handle_columns = [];
export default unitConfig;