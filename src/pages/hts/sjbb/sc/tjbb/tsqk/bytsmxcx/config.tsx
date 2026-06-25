import CONSTANTS from '@/components/DDAssist/constants';


/**
 * title: 不予退税明细查询-出口货物劳务免抵退税申报明细表
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '（单位：元、美元）';
unitConfig.module_key = 'CX_SJFX_SC_TSQK_BYTSMXCX_CKHWLWMDTSSBMXB';          // 业务单元key，对应后端接口
unitConfig.page_id = 'CX_SJFX_SC_TSQK_BYTSMXCX_CKHWLWMDTSSBMXB';           // 页面id
unitConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
unitConfig.grid_selection_type = false;                          // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.toolbar_show_grid_checked_num = false;                           // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.layout_type = 'tz';                                   // 页面类型，默认default 可选 default modal tabs tz台账
unitConfig.export_key = 'CX_SJFX_SC_TSQK_BYTSMXCX_CKHWLWMDTSSBMXB_PRINT_REPORT';
unitConfig.module_type = 'sjbb';      
// 配置项：列表列
// 配置项：列表列

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '所属期', dataIndex: 'ssq', width: 90, fixed: 'left', sorter: true, render: { type: 'date', format: 'YYYYMM' } },
  { title: '序号', dataIndex: 'sbxh', width: 100 },
  { title: '出口报关单号', dataIndex: 'ckbgdh', width: 180, sorter: true, },
  { title: '代理出口证明号', dataIndex: 'dlckhwzmhm', width: 180, sorter: true, },
  { title: '出口日期', dataIndex: 'ckrq1', width: 110, render: { type: 'date', format: 'YYYY-MM-DD' }, sorter: true },
  { title: '出口发票号', dataIndex: 'ckfph', width: 140, ellipsis: true, sorter: true },
  { title: '进料加工手（账）册号', dataIndex: 'jljgszch', width: 170, },
  { title: '先退税后核销出口合同号', dataIndex: 'ckhth', width: 200, ellipsis: true },
  { title: '出口商品代码', dataIndex: 'ckspDm', width: 120, ellipsis: true },
  { title: '出口商品名称', dataIndex: 'ckspmc', width: 140, ellipsis: true, },
  // { title: '下载商品名称', dataIndex: 'xzspmc', width: 140, ellipsis: true, },
  { title: '申报商品代码', dataIndex: 'sbspDm', width: 120, ellipsis: true, },
  { title: '申报商品名称', dataIndex: 'sbspmc', width: 140, ellipsis: true, },
  { title: '计量单位', dataIndex: 'hgjldwmc', width: 80, ellipsis: true },
  { title: '出口数量', dataIndex: 'cksl', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00000' } },
  { title: '原币币别', dataIndex: 'cjhghbszDm', width: 100, },
  { title: '原币币别名称', dataIndex: 'cjhbmc', width: 120, ellipsis: true },
  { title: '原币汇率', dataIndex: 'cjhbhl', width: 100, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '美元汇率', dataIndex: 'myhl', width: 100, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '美元出口销售额', dataIndex: 'mylaj', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '征税率', dataIndex: 'zssl', width: 80, align: 'right', render: { func: 'renderTslIsNumber2' } },
  { title: '退税率', dataIndex: 'tsl', width: 80, align: 'right', render: { func: 'renderTslIsNumber2' } },
  { title: '计划分配率', dataIndex: 'tzhjhfpl', width: 130, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '进料加工保税进口料件组成计税价格', dataIndex: 'jljgbsjkljzcjsjg', width: 250, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '国内购进免税原材料价格', dataIndex: 'gngjmsycljg', width: 180, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '不得免征和抵扣税额', dataIndex: 'mdtsbdmzhdkse', width: 180, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '免抵退税额', dataIndex: 'mdtse', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '业务类型代码', dataIndex: 'cktmsywlxdmjh', width: 110, ellipsis: true },
  { title: '业务类型名称', dataIndex: 'cktmsywlxmcjh', width: 110, ellipsis: true, },
  { title: '国内启运方式', dataIndex: 'gnqyfsmc', width: 110, ellipsis: true },
  { title: '海关总署认证企业类型', dataIndex: 'rzqylxmc', width: 160, ellipsis: true, },
  { title: '免抵退税年月', dataIndex: 'mdtsny', width: 110, },
  { title: '不予退税标志', dataIndex: 'bytsbz', width: 130, render: { func: 'renderTzBz' },},
  { title: '不予办理标志', dataIndex: 'byblbz', width: 130, render: { func: 'renderTzBz' },},
  { title: '暂不办理标志', dataIndex: 'zbblbz', width: 130, render: { func: 'renderTzBz' },},
  { title: '最终解除暂不办理准予年月', dataIndex: 'zzjczbblzyny', width: 200, },
  { title: '暂不办理年月', dataIndex: 'zbblny', width: 110, },
  { title: '不予办理年月', dataIndex: 'byblny', width: 110, },
  { title: '备注', dataIndex: 'bz', width: 180, ellipsis: true, },
  { title: '申报标志', dataIndex: 'sbbz1', width: 90, render: { func: 'renderTzSbbz' } },
  { title: '审核标志', dataIndex: 'shbz', width: 100, render: { func: 'renderTzShbz' } },
];


unitConfig.grid_filter_quick = [
  {
    label: '出口货物劳务免抵退税申报明细表',
    name: 'scqy',
    type: 'Select',
    defaultValue: '1',
    width: '5w',
    onChange: 'handleOnChangeBgd',
    list: [
      { label: '出口货物劳务免抵退税申报明细表', value: '1' },
      { label: '国际运输（港澳台运输）免抵退税申报明细表', value: '2' },
      { label: '跨境应税行为免抵退税申报明细表', value: '3' },
    ],
  },
];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
unitConfig.filter_items = [
  { name: 'sbrq', label: '申报日期', type: 'DatePicker', range: true,isLabel: true},
  { name: 'ssq', label: '所属期', type: 'Input' },
  { name: 'ckbgdh', label: '出口报关单号', type: 'Input',}, 
  { name: 'dlckhwzmhm', label: '代理出口证明号', type: 'Input' },
  { name: 'ckrq', label: '出口日期', type: 'DatePicker', range: true, allowClear: true },
	{ name: 'ckfph', label: '出口发票号',type: 'Input', },
  { name: 'jljgszch', label: '进料加工手（账）册号', type: 'Input', },
  { name: 'ckspDm', label: '商品代码', type: 'Input',},
  { name: 'cktmsywlxdmjh', label: '业务类型代码', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: 'code_dm_ckts_cktmsywlx:04' },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  sjgxUpdateData: true,               // 是否显示更新台账数据，默认关闭
  ckts_download: true,                   // 是否显示导出，默认关闭
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};

unitConfig.customer_toolbar = [];
unitConfig.handle_columns = [];
export default unitConfig;
