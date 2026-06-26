import CONSTANTS from '@/components/DDAssist/constants';
const unitConfig: any = {};

// 配置项
unitConfig.layout_type = 'modal';
unitConfig.module_key = 'CODE_DM_FP_SPHFWSSFLYBM';
unitConfig.api_grid_query = `/hx/ty/code/queryCodePager`;
unitConfig.grid_selection_type = false;
unitConfig.grid_row_key = 'sphfwssflhbbm';
unitConfig.toolbar_show_grid_checked_num = false;
unitConfig.show_toolbar = false;

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '编码', dataIndex: 'sphfwssflhbbm', width: 160 },
  { title: '名称', dataIndex: 'hwhlwmc', width: 160, ellipsis: true },
  { title: '简称', dataIndex: 'hwhlwjc', width: 80, ellipsis: true },
  { title: '说明', dataIndex: 'sm2', width: 160, ellipsis: true },
  { title: '增值税特殊管理', dataIndex: 'zzstsgl', width: 110 },
  { title: '关键字', dataIndex: 'gjz2', width: 80, ellipsis: true },
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'gjz2', label: '商品关键字', type: 'Input' },
  { name: 'sphfwssflhbbm', label: '编码', type: 'Input' },
  { name: 'hwhlwmc', label: '名称', type: 'Input' },
];

// 配置项：自定义操作列
unitConfig.handle_columns = [
  { name: '选择', func: 'handleFpsqdTzSave' },
];
export default unitConfig;