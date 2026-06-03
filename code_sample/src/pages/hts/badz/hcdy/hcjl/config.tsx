/**
 * title: 备案单证-核查调阅-核查任务
 * author: mfc
 */
const config: any = {};

// 配置项
config.unit_key = 'CX_BADZ_ZXSB_BADZ_DZHC';
config.page_id = 'CX_BADZ_ZXSB_BADZ_DZHC';
config.click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
config.form_save_check = false;
config.grid_show_serial_number = false;                                           // 是否显示序号，可选
config.grid_scroll_x = '1080px';                             // 默认700px
config.grid_handle_width = 120;
config.grid_row_key = 'rwbh';

// 配置项：列表列
config.grid_columns = [
  { title: '任务编号', dataIndex: 'rwbh', fixed: 'left', width: 110 },
  { title: '业务事项', dataIndex: 'lcswsxDm', width: 100, fixed: 'left', codeTable: ['CODE_WM_CS_ZXSB_LCSWSX', '01'],
    filter: {
      type: 'Radio',
      codeTable: ['CODE_WM_CS_ZXSB_LCSWSX', '01'],
    } 
  },
  { title: '所属期', dataIndex: 'ssq', width: 95 },
  { title: '批次', dataIndex: 'sbpc', width: 70 }, // 外贸
  { title: '报关单/{br}代理证明张数', dataIndex: 'bgdzs', width: 140, align: 'right', render: { type: 'number', format: '0,0' } },
  { title: '已归档报关单/{br}代理证明张数', dataIndex: 'ygdbgdzs', width: 140, align: 'right', render: { type: 'number', format: '0,0' } },
  { title: '生成状态', dataIndex: 'bswjscztDm', render: { func: 'renderBadzSczt' }, width: 130 },
  { title: '生成时间', dataIndex: 'scsj', render: { type: 'date', format: 'yyyy-MM-DD HH:mm' } }
];

// 配置项：筛选
config.filter_items = [
  { name: 'ssq', label: '所属期', type: 'Input' },
  { name: 'sbpc', label: '批次', type: 'Input' },
  { name: 'bswjscztDm', label: '生成状态', type: 'Select', codeTable: ['CODE_DM_ZXSB_BSWJSCZT', '01'] },
];

// 配置项：工具栏
config.toolbar_default = {
  setting: true,
  reload: true,
  full: true,
};

// 配置项：列表操作列
config.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};

// 配置项：自定义工具栏
config.costomer_toobar = [
  { name: '创建任务', func: 'cjrw' },
  { name: '生成核查文件', func: 'schcwj' },
  { name: '打印成册', func: 'dycc' },
  { name: '下载资料', func: 'xzzl' },
];

// 配置项：自定义操作列
config.handle_columns = [
  //{ name: '获取', func: 'handlebadzHcjlQhqCz', display: 'gridBadzDzhcQhqCz' },
  { name: '详情', func: 'handlebadzHcjlCkxqCz', display: 'gridBadzDzhcCkxqCz' },
  { name: '调阅', func: 'handlebadzHcjlDyCz', display: 'gridBadzDzhcDyCz' },
  { name: '删除', func: 'handlebadzHcjlScCz', disabled: 'gridBadzDzhcScCz' }
];

export default config;
