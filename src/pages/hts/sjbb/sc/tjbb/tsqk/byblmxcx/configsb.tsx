import CONSTANTS from '@/components/DDAssist/constants';


/**
 * title: 不予办理明细查询-国际运输（港澳台运输）免抵退税申报明细表
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '（单位：元、美元）';
unitConfig.module_key = 'CX_SJFX_SC_TSQK_BYBLMXCX_GJYSGATYSMDTSSBMXB';          // 业务单元key，对应后端接口
unitConfig.page_id = 'CX_SJFX_SC_TSQK_BYBLMXCX_GJYSGATYSMDTSSBMXB';           // 页面id
unitConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
unitConfig.grid_selection_type = false;                          // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.toolbar_show_grid_checked_num = false;                           // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.layout_type = 'tz';                                   // 页面类型，默认default 可选 default modal tabs tz台账
unitConfig.export_key = 'CX_SJFX_SC_TSQK_BYBLMXCX_GJYSGATYSMDTSSBMXB_PRINT_REPORT';
unitConfig.module_type = 'sjbb';      
// 配置项：列表列
// 配置项：列表列
unitConfig.grid_columns = [
  { title: '所属期', dataIndex: 'ssq', width: 90, fixed: 'left', render: { type: 'date', format: 'YYYYMM' } },
  { title: '序号', dataIndex: 'sbxh', width: 80 },
  { title: '出口发票号', dataIndex: 'ckfph', width: 140, sorter: true, ellipsis: true, },
  { title: '出口发票开具日期', dataIndex: 'ckrq1', width: 150, sorter: true, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '跨境应税行为代码', dataIndex: 'ysfwDm', width: 150 },
  { title: '跨境应税行为名称', dataIndex: 'ysfwmc', width: 160 }, //, ellipsis: true, codeTable: 'code_dm_tz_ysfwDm:01', filter: { type: 'Select', codeTable: 'code_dm_tz_ysfwDm:01', } },
  { title: '本期运输次数', dataIndex: 'bcysc', width: 130, align: 'right', sum: true },
  { title: '自运仓单份数', dataIndex: 'zycdfs', width: 130, align: 'right', sum: true },
  { title: '自运提单（运单）份数或载客人数', dataIndex: 'zytdydfshzkrs', width: 230, align: 'right', sum: true },
  { title: '原币代码', dataIndex: 'cjhbzmDm', width: 100, },
  { title: '原币币别', dataIndex: 'cjhbzmmc', width: 140, ellipsis: true, },
  { title: '原币营业额', dataIndex: 'cjzj', width: 180, sorter: true, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '原币汇率', dataIndex: 'cjhbhl', width: 120, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '人民币营业额', dataIndex: 'ysfwyyermb', width: 180, sorter: true, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '美元汇率', dataIndex: 'myhl', width: 120, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '美元营业额', dataIndex: 'ysfwyyemy', width: 180, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '免抵退税计税金额', dataIndex: 'ysfwyyemdtsjsje', width: 180, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '征税率', dataIndex: 'zssl', width: 80, align: 'right', render: { func: 'renderTslIsNumber2' } },
  { title: '退税率', dataIndex: 'tsl', width: 80, align: 'right', render: { func: 'renderTslIsNumber2' } },
  { title: '免抵退税计税金额乘征退税率之差', dataIndex: 'ztsce', width: 230, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '免抵退税计税金额乘退税率', dataIndex: 'ytse1', width: 190, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '免抵退税年月', dataIndex: 'mdtsny', width: 120, },
  { title: '期租、程租、湿租合同或协议号', dataIndex: 'hth', width: 220, ellipsis: true, },
  { title: '备注', dataIndex: 'bz', width: 210, ellipsis: true, },
  { title: '申报标志', dataIndex: 'sbbz1', width: 90, render: { func: 'renderTzSbbz' }, },
  { title: '审核标志', dataIndex: 'shbz', width: 100, render: { func: 'renderTzShbz' }, },
];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
unitConfig.filter_items = [
  { name: 'sbrq', label: '申报日期', type: 'DatePicker', range: true,isLabel: true},
  { name: 'ssq', label: '所属期', type: 'Input' },
	{ name: 'ckfph', label: '出口发票号',type: 'Input', },
];
// 配置项：工具栏
unitConfig.toolbar_default = {
  sjgxUpdateData: true,               // 是否显示更新台账数据，默认关闭
  ckts_download: true,                   // 是否显示导出，默认关闭
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};

unitConfig.grid_filter_quick = [
  {
    label: '出口货物劳务免抵退税申报明细表',
    name: 'scqy',
    type: 'Select',
    defaultValue: '2',
    width: '5w',
    eventOnChange: 'handleOnChangeBgd',
    list: [
      { name: '出口货物劳务免抵退税申报明细表', value: '1' },
      { name: '国际运输（港澳台运输）免抵退税申报明细表', value: '2' },
      { name: '跨境应税行为免抵退税申报明细表', value: '3' },
    ],
  },
];
unitConfig.customer_toolbar = [];
unitConfig.handle_columns = [];
export default unitConfig;
