/**
 * title: 数据封装页面
 */
const unitConfig: any = {};

// 配置项
unitConfig.form_title = '报关单';                                                     // 表单标题，可选
unitConfig.api_grid_query = `${API_URL_EXAMPLE}/hx/ty/crud/queryPager2`;                 // api：列表查询 不分页

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '报关单号', dataIndex: 'ckbgdh', width: 180 },
  { title: '商品代码', dataIndex: 'ckspDm', width: 95 },
];

export default unitConfig;