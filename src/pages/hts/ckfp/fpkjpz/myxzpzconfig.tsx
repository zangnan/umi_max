import CONSTANTS from '@/components/DDAssist/constants';

/**
 * title: 贸易性质配置
 * author: mazh
 */
const myxzpzConfig: any = {};

 // 配置项
myxzpzConfig.api_grid_query = `/yw/fpzs/fppz/myxzpz/queryMyxzpz`;   // api 列表查询
myxzpzConfig.grid_show_serial_number = true;                                            // 是否显示序号，可选，默认不显示
myxzpzConfig.grid_row_key = 'jgfsDm';                                                     // 列表主键，默认uuid
myxzpzConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
myxzpzConfig.layout_type = 'tabs';                                                      // 页面类型，默认default 可选 default modal tabs
myxzpzConfig.grid_click_checked = '1';
myxzpzConfig.form_title = '贸易性质配置';
myxzpzConfig.module_key = 'FPKJ_FPPZ_MYXZPZ';

// 配置列表列
myxzpzConfig.grid_columns = [
  { title: '贸易性质代码', dataIndex: 'jgfsDm', width: 120 },
  { title: '贸易性质名称', dataIndex: 'jgfsmc' },
  { title: '退税类型', dataIndex: 'jgfstslxmc', width: 110 },
  {
    title: '是否申报退税', dataIndex: 'tsbz', width: 120, render: { func: 'rendertsbz' },
    filter: {
      type: 'Select',
      list: [
        { text: '是', value: 'Y' },
        { text: '否', value: 'N' },
      ],
    }
  },
];

// 配置项：工具栏
myxzpzConfig.toolbar_default = {
  setting: true,
  add: false,
  full: true,
  reload: true
};

//  myxzpzConfig.grid_handle_columns_default = {
//    edit: true
//  }
// 配置项：自定义工具栏
//  myxzpzConfig.customer_toolbar = [
//    { name: '提取客户', func: 'handletqjwfhr' },
//    { name: '删除', func: 'deleteKhgl' },
//  ];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
myxzpzConfig.grid_filter_quick = [
  { label: '贸易性质名称', name: 'jgfsmc', type: 'Input', width: '5w', op: 'al', searchButton: true },
];
myxzpzConfig.handle_columns = [];
export default myxzpzConfig;