/**
 * title: 备案单证-核查调阅-单证核查
 * author: mfc
 */
const config: any = {};

// 配置项
config.unit_key = 'CX_BADZ_ZXSB_BADZ_DZHC_MX';
config.page_id = 'CX_BADZ_ZXSB_BADZ_DZHC_MX';
// config.grid_api_grid_query = `${API_URL_BASE}/hts/badz/hcdy/queryHtsDzhcPage`;    // api 列表查询
config.grid_show_serial_number = false;                                           // 是否显示序号，可选
config.click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
config.form_save_check = false;
config.grid_scroll_x = '1200px';                             // 默认700px
config.grid_handle_width = 70;
config.grid_row_key = { type: '1', key: ['rwbh', 'bgdhgbh'] };

// 配置项：列表列
config.grid_columns = [
  { title: '任务编号', dataIndex: 'rwbh', fixed: 'left', width: 150 },
  { title: '业务事项', dataIndex: 'lcswsxDm', width: 100, fixed: 'left', codeTable: ['CODE_WM_CS_ZXSB_LCSWSX', '01'],
    filter: {
      type: 'Radio',
      codeTable: ['CODE_WM_CS_ZXSB_LCSWSX', '01'],
    } 
  },
  {
    title: '核查类型', dataIndex: 'assqpchcbz', width: 170, codeTable: ['CODE_DM_BADZ_HCLX', '01'],
    filter: {
      type: 'Radio',
      codeTable: ['CODE_DM_BADZ_HCLX', '01'],
    }
  },
  {
    title: '核查类型', dataIndex: 'assqpchcbz', width: 170, codeTable: ['CODE_DM_BADZ_HCLX', '02'], hidden: true,
    filter: {
      type: 'Radio',
      codeTable: ['CODE_DM_BADZ_HCLX', '02'],
    }
  },
  {
    title: '备案状态', dataIndex: 'dzbaztDm', width: 120, render: { func: 'renderBadzBazt' },
    filter: {
      type: 'Select', 
      codeTable: ['CODE_DM_ZXSB_DZBAZT', '01'],
    },
    titleTooltip:
      '不存在：该所属期批次下无此报关单数据；{br}' +
      '待备案：该条数据尚未上传单证；{br}' +
      '备案中：该条数据已上传单证，但未完成备案；{br}' +
      '已备案：该条数据已完成备案，但未归档；{br}' +
      '已归档：该条数据已归档。'
  },
  { title: '所属期', dataIndex: 'ssq', width: 95, fixed: 'center' },
  { title: '批次', dataIndex: 'sbpc', width: 70, hidden: true },
  { title: '出口报关单号/{br}代理出口证明号', dataIndex: 'bgdhgbh', width: 180 },
  { title: '单证份数', dataIndex: 'dzfs', width: 90, align: 'right' },
  { title: '核查说明', dataIndex: 'yysm', ellipsis: true },
  // { title: '任务编号', dataIndex: 'rwbh', width: 110 },
];

// 配置项：筛选
config.filter_items = [
  { name: 'rwbh', label: '任务编号', type: 'Input' },
  { name: 'ssq', label: '所属期', type: 'Input' },
  { name: 'sbpc', label: '批次', type: 'Input' },
  { name: 'bgdhgbh', label: '出口报关单号/代理出口证明号', type: 'Input' },
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
  // { name: '导入核查清单', func: 'drHcqd' },
  { name: '填写核查说明', func: 'txhcsm' },
  { name: '下载资料', func: 'xzzl' },
  // { name: '打印成册', func: 'dycc' },
  // { name: '核查报送', func: 'hcbs' }
];

// 配置项：自定义操作列
config.handle_columns = [
  // {name: '获取', func: 'handleBadzDzhcCz', disabled: 'gridBadzDzhc1Cz'},
  { name: '备案', func: 'handleBadzDzhcBa', display: 'gridBadzDzhc23Cz' },
  { name: '归档', func: 'handleBadzDzhcCj', display: 'gridBadzDzhc4Cz' },
  // { name: '调阅', func: 'handleBadzDzhcCz', display: 'gridBadzDzhc5Cz' },
  // { name: '填写核查说明', func: 'handleBadzDzhcCz', disabled: 'gridBadzDzhc6Cz' },
];

export default config;
