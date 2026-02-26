/**
 * title: 数据封装页面
 */
const unitConfig: any = {};

// 配置项
unitConfig.module_key = 'EXAMPLE_DATA_PAGE_1';                                          // 业务单元key，对应后端接口
unitConfig.page_id = 'example_list_1';                                                // 页面id

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '出口日期', dataIndex: 'ckrq1', width: 120, sorter: true, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '海关商品名称', dataIndex: 'hgspmc', width: 180 },
  { title: '出口合同号', dataIndex: 'ckhth', width: 115 },
  { title: '美元离岸价', dataIndex: 'mylaj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
unitConfig.filter_items = [
  { name: 'ckhth', label: '出口合同号', type: 'Input', },
  { name: 'ckrq1', label: '出口日期', type: 'DatePicker' },
  { name: 'ckbgdh', label: '报关单号', type: 'Input' },
  { name: 'jgfsDm', label: '监管方式', type: 'Input' },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  download: true,                   // 是否显示导出按钮，默认关闭
  upload: true,                     // 是否显示导入按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};

export default unitConfig;