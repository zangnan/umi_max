import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 其他商品管理
 * author: zxy
 */
const unitConfig: any = {};

// 配置项
unitConfig.layout_type = 'modal';
unitConfig.api_grid_query = `/yw/fpzs/fppz/qtspcx`;
unitConfig.grid_selection_type = false;
unitConfig.grid_row_key = 'uuid';                                                    // 列表主键，默认uuid
unitConfig.toolbar_show_grid_checked_num = false;
unitConfig.show_toolbar = false;

// 配置列表列
unitConfig.grid_columns = [
  { title: '商品名称', dataIndex: 'hwhyslwmc', width: 150, ellipsis: true, fixed: 'left' },
  { title: '规格型号', dataIndex: 'ggxh', width: 150, ellipsis: true },
  { title: '计量单位', dataIndex: 'jldwmc', width: 90 },
  { title: '税率', dataIndex: 'sl1', align: 'right', width: 80, render: { func: 'qtsprenderSl1' } },
  { title: '税收分类编码', dataIndex: 'sphfwssflhbbm', width: 170 },
  { title: '税收分类名称', dataIndex: 'hwhlwmc', width: 150, ellipsis: true },
  { title: '含税标志', dataIndex: 'hsbz1', width: 100, hidden: true },
  { title: '享受优惠政策', dataIndex: 'syyhzcbz', width: 120, hidden: true },
  { title: '优惠政策类型', dataIndex: 'fpssyhlxDm', width: 120, hidden: true },
  { title: '零税率类型代码', dataIndex: 'lsllxDm', width: 120, hidden: true },
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'hwhyslwmc', label: '商品名称', type: 'Input' },
];

// 配置项：自定义工具栏
unitConfig.handle_columns = [
  { name: '选择', func: 'handleFpsqdTzSave' },
];

export default unitConfig;