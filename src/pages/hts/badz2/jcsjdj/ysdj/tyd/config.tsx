import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 提运单
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '提运单';
unitConfig.form_title = '提运单';
unitConfig.api_grid_query = `/yw/badze/tyd/queryPageTyd`;   // api 列表查询
// unitConfig.api_form_delete = `/yw/badze/tyd/deleteTydByIds`      // api 列表删除
unitConfig.form_api_show=`/yw/badze/tyd/queryTydForm`;            // api 表单查询
unitConfig.api_form_edit=`/yw/badze/tyd/saveOrUpdateTyd`;                // api 表单更新
unitConfig.form_api_save_upload=`/yw/badze/tyd/saveOrUpdateTyd`;                // api 表单更新
// unitConfig.form_api_check=`/yw/badze/gtgn/checkDateUnique`;             // api 表单校验
unitConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.grid_scroll_x = '1450px';
unitConfig.grid_selection_type = 'checkbox';                                               //复选框隐藏
unitConfig.toolbar_show_grid_checked_num = false;                                                 // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.grid_api_import = `/yw/badze/sjdr/importExcel`;
unitConfig.grid_api_templateUrl = '/yw/badze/sjdr/downloadBadzTemplateGet';
unitConfig.import_key = 'ZXSB_BADZBASE_TYD';
unitConfig.exprotMsg = ' ';
unitConfig.gridParams = {
  initSearchModal: [
    { property: 'pageLb', value: true, op: 'al' },
  ],
}


// 配置列表列
unitConfig.grid_columns = [
  { title: '业务编号', dataIndex: 'ywbh', width: 160, ellipsis: true },
  { title: '提运单类型', dataIndex: 'tydlxDm', width: 120, codeTable: 'code_static_badz_tydlx_dm:01' },
  { title: '提运单号码', dataIndex: 'tydhm', width: 120, ellipsis: true },
  { title: '箱号', dataIndex: 'xh', width: 120, ellipsis: true },
  { title: '数据来源', dataIndex: 'sjlyDm', width: 120, codeTable: 'code_static_badz_sjly_dm:01' },
  { title: '目的地', dataIndex: 'mdd', width: 140, ellipsis: true },
  { title: '毛重量', dataIndex: 'mzl', width: 150, ellipsis: true },
  { title: '签发日期', dataIndex: 'qfrqhdd', width: 115, ellipsis: true },
  { title: '商品信息', dataIndex: 'hwpmdwjsl', width: 160, fixed: 'right', render: { func: 'renderHwpmdwjsl' } },
  { title: '关联关系', dataIndex: 'glgx', width: 100, fixed: 'right', render: { func: 'renderGlgx' } },
  { title: '是否装订成册', dataIndex: 'sfzdcc', width: 100, fixed: 'right', align: 'center', render: { 
      icon: [
        { value: 'Y', icon: 'CheckOutlined', color: 'success', isShowText: false },
        { value: 'N', icon: 'CloseOutlined', color: 'error', isShowText: false },
        { value: '', icon: 'CloseOutlined', color: 'error', isShowText: false },
      ]
    }
  },
];
// 配置项：表单项
unitConfig.form_items = [
  { label: 'uuid', type: 'Hidden', name: 'uuid' },
  { label: '采集信息', name: 'cjxx', type: 'GroupTitle' },
  { label: '业务编号', name: 'ywbh', type: 'Input', rules: [{ type: 'base_string', range: [0, 90] }] },
  { label: '提运单类型', name: 'tydlxDm', type: 'Select', rules: [ { type: 'base_required' } ], codeTable: 'code_static_badz_tydlx_dm:01' },
  { label: '提运单号码', name: 'tydhm', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 150] }, { func: 'tydhm' }] },
  { label: '箱号', name: 'xh', type: 'Input', rules: [{ type: 'base_string', range: [0, 150] }] },
  { label: '目的地', name: 'mdd', type: 'Input', rules: [{ type: 'base_string', range: [0, 150] }] },
  { label: '毛重量（KG）', name: 'mzl', type: 'Input', rules: [{ type: 'base_string', range: [0, 150] }] },
  { label: '签发日期', name: 'qfrqhdd', type: 'Input', rules: [{ type: 'base_string', range: [0, 150] }] },
  { label: '商品信息', name: 'spxx', type: 'GroupTitle' },
  { label: '商品信息列表', name: 'spxxArray', type: 'List', children: [
      { label: '商品名称', name: 'spmc', type: 'Input', rules: [{ type: 'base_string', range: [0, 150] }] },
      { label: '单位', name: 'dw', type: 'Input', rules: [{ type: 'base_string', range: [0, 150] }] },
      { label: '数量', name: 'sl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_number', length: 15, decimal: 5}] },
    ]
  },
  { label: '附件资料', name: 'fjzl', type: 'GroupTitle' },
  { label: '上传附列资料', name: 'wjnrstring', fileName: 'wjm', type: 'Upload', tooltip: '支持上传PDF/JPG/PNG/JPEG格式文件且大小不应超过10M', rules: [{ type: 'base_required' }] },
	{ label: '填表说明', name: 'tbsm', type: 'GroupTitle', disabled: true},
	{ label: '填表说明', name: 'tbsmIntro', type: 'Intro', children: [
		{ label: '提运单号：', level: 'h1' },
		{ label: '● 提运单类型为航空运单时，提运单号码应填写航空运单中的运单号；', level: 'h2' },
		{ label: '● 提运单类型为海运提单时，提运单号码应填写海运提单中的提单号；', level: 'h2' },
		{ label: '● 提运单类型为铁路运单时，提运单号码应填写铁路运单中的运单号；', level: 'h2' },
		{ label: '● 提运单类型为公路运输载货清单时，提运单号码应填写公路运输单中的载货清单号；', level: 'h2' },
		{ label: '● 提运单类型为邮政运输单时，提运单号码应填写邮政运输单中的邮政包裹单号。', level: 'h2' },
		{ label: '箱号：', level: 'h1' },
		{ label: '● 提运单类型为航空运单时，箱号或牌号应填写航空运单中的航班号；', level: 'h2' },
		{ label: '● 提运单类型为海运提单时，箱号或牌号应填写海运提单中的集装箱箱号；', level: 'h2' },
		{ label: '● 提运单类型为铁路运单时，箱号或牌号应填写铁路运单中的车厢编号；', level: 'h2' },
		{ label: '● 提运单类型为公路运输载货清单时，箱号或牌号应填写公路运输单中的承运车辆的车牌号。', level: 'h2' },
	]},
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'ywbh', label: '业务编号', type: 'Input' },
  { name: 'tydlxDm', label: '提运单类型', type: 'Select', showSearch: true, codeTable: 'code_static_badz_tydlx_dm:01' },
  { name: 'tydhm', label: '提运单号码', type: 'Input' },
  { name: 'sjlyDm', label: '数据来源', type: 'Select', showSearch: true, codeTable: 'code_static_badz_sjly_dm:01' },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  add: true,
  edit: true,
  // delete: true,
  upload: true,
  setting: true,
  full: true,
  reload: true,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};
// 配置项：自定义工具栏
unitConfig.customer_toolbar = [
  { name: '批量下载', key: 'download', func: 'plxz' },
  { name: '删除', func: 'del' },
];

// 配置项：自定义操作列
unitConfig.handle_columns = [
  { name: '预览', key: 'yl', func: 'handleColumnsYl', display: 'ylDisplay' },
  { name: '上传附件', key: 'scfj', func: 'handleColumnsScfj', display: 'scfjDisplay' },
];
export default unitConfig;
