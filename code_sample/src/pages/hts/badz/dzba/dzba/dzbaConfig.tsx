/**
 * title: 备案单证 - 单证备案 - 单证备案
 */
const dzbaConfig: any = {};

// 配置项
dzbaConfig.unit_key = 'CX_BADZ_ZXSB_BADZ_BGD_TJQ_PC';                            // 业务单元key，对应后端接口
dzbaConfig.page_id = 'CX_BADZ_ZXSB_BADZ_BGD_TJQ_PC';                          // 页面id
dzbaConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
dzbaConfig.grid_selection_type = "checkbox";                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
dzbaConfig.grid_show_data_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
dzbaConfig.layout_type = 'default';                                  // 页面类型，默认default 可选 default modal tabs tz台账
dzbaConfig.click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
dzbaConfig.grid_scroll_x = '1130px';                             // 默认700px
dzbaConfig.grid_row_key = 'badzssquuid';

// 配置项：列表列
dzbaConfig.grid_columns = [
  { title: '业务事项', dataIndex: 'lcswsxDm', width: 100, fixed: 'left', codeTable: ['CODE_WM_CS_ZXSB_LCSWSX', '01'],
    filter: {
      type: 'Radio',
      codeTable: ['CODE_WM_CS_ZXSB_LCSWSX', '01'],
    } 
  },
  { title: '所属期', dataIndex: 'ssq', width: 80, fixed: 'left', },
  { title: '批次', dataIndex: 'sbpc', width: 80, fixed: 'left', },
  { title: '报关单/{br}代理证明张数', dataIndex: 'bgdzs', align: 'right', render: { type: 'number', format: '0,0' }, width: 105, },
  { title: '待备案报关单/{br}代理证明张数', dataIndex: 'dbabgdzs', align: 'right', render: { type: 'number', format: '0,0' }, width: 110 },
  { title: '备案中报关单/{br}代理证明张数', dataIndex: 'bazbgdzs', align: 'right', render: { type: 'number', format: '0,0' }, width: 110 },
  { title: '已备案报关单/{br}代理证明张数', dataIndex: 'dgdbgdzs', align: 'right', render: { type: 'number', format: '0,0' }, width: 110 },
  { title: '已归档报关单/{br}代理证明张数', dataIndex: 'ygdbgdzs', align: 'right', render: { type: 'number', format: '0,0' }, width: 110 },
  { title: '受理日期', dataIndex: 'slrq', width: 120, render: { func: 'renderBadzSlrq' } },
  { title: '备案期限', dataIndex: 'baqx', render: { func: 'renderBadzBaqx' }, }
];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
dzbaConfig.grid_filter_quick = [
  { name: 'ssq', label: '所属期', type: 'Input' },
  { name: 'sbpc', label: '批次', type: 'Input', searchButton: true },
];

// 配置项：工具栏
dzbaConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
  delete: false,                     // 是否显示删除按钮，默认关闭
};
// 配置项：自定义工具栏
dzbaConfig.costomer_toobar = [
  //{ name: '获取申报数据', key: 'obtainDeclarationData', func: 'obtainDeclarationData' },
  { name: '删除', key: 'delete2', func: 'del' },
];

// 配置项：自定义操作列
dzbaConfig.handle_columns = [
  { name: '办理', key: 'dzbaHandle', func: 'dzbaHandle' },
];
export default dzbaConfig;
