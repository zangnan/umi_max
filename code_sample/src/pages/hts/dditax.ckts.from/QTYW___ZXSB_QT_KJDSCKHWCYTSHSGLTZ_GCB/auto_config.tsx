/**
 * title: 跨境电商出口海外仓预退税核算管理台账
 * serviceKey: QTYW_ZXSB_TY_KJDSHWC_HSTZ_F
 * unitId: qtyw_zxsb_qt_qynbfktxjs_gcb
*/

const unitConfig: any = {};

unitConfig.unit_key = 'QTYW_ZXSB_TY_KJDSHWC_HSTZ_F'; // 业务单元key，对应后端接口
unitConfig.page_id = 'qtyw_zxsb_ty_kjdshwc_hstz_fkb'; // 页面id
unitConfig.grid_title = '跨境电商出口海外仓预退税核算管理台账'; // 列表标题，可选
unitConfig.grid_title_end = { type: 'function', func: 'setGridTitle' }; // 列表标题，可选
unitConfig.form_title = '跨境电商出口海外仓预退税核算管理台账'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = 'SAAS_QTYW_KJDSHWC_HSTZ_DC'; // 采集导出key
unitConfig.export_key2 = 'SAAS_SJGL_SWFKCX_QTYW_KJDSHWCHSTZ_DC'; // 统计导出key
unitConfig.export_key3 = ''; // 申报结果查询导出key
unitConfig.module_type = 'sjbb';


// 配置列表列
unitConfig.grid_columns = [
	{ title: '预退税申报事项', dataIndex: 'lcswsxDm', align: 'left', width: 130, fixed: 'left',codeTable: ['code_dm_gy_lcswsx_mc',  '02'], filter: {
      type: 'Select',
      codeTable: ['code_dm_gy_lcswsx_mc', '02'],
    }, ellipsis: true },
	{ title: '预退税申报年月', dataIndex: 'ytssbny', align: 'left', width: 110, fixed: 'left', ellipsis: true },
	{ title: '预退税关联号', dataIndex: 'ytsglh', align: 'left', width: 140, fixed: 'left', ellipsis: true},
	{ title: '预退税申报批次', dataIndex: 'ytssbpc', align: 'left', width: 110, fixed: 'left', ellipsis: true },
	{ title: '预退税申报序号', dataIndex: 'ytssbxh', align: 'left', width: 110, fixed: 'left', ellipsis: true },
	{ title: '出口货物报关单号', dataIndex: 'ckbgdh', align: 'left', width: 180, ellipsis: true},
	{ title: '代理出口货物证明号码', dataIndex: 'dlckhwzmhm', align: 'left', width: 160, ellipsis: true},
	{ title: '出口日期', dataIndex: 'ckrq1',align: 'left', width: 80, render: { type: 'date', format: 'yyyy-MM-DD' }, ellipsis: true },
	{ title: '预退税税种', dataIndex: 'ytssz', align: 'left', width: 90, ellipsis: true},
	{ title: '增值税退税额', dataIndex: 'zzstse', align: 'right', width: 110, sum: true, render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '消费税退税额', dataIndex: 'xfstse', align: 'right', width: 110, sum: true, render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '预退税办理时间', dataIndex: 'ytsblsj', align: 'left', width: 110, render: { type: 'date', format: 'yyyy-MM-DD' }, ellipsis: true},
	{ title: '预退税核算截止期', dataIndex: 'ytshsjzr1', sorter: true, align: 'left', width: 140, ellipsis: true},
	{ title: '是否已核算标志', dataIndex: 'sfyhsbz', align: 'left', width: 130, codeTable: ['code_static_yes_no',  '01'], filter: {
      type: 'Select',
      codeTable: ['code_static_yes_no', '01'],
    },ellipsis: true},
	{ title: '最新核算日期', dataIndex: 'zxhsrq', align: 'left', width: 100, render: { type: 'date', format: 'yyyy-MM-DD' }, ellipsis: true},
	{ title: '最新核算类型', dataIndex: 'ckhwcytshslxDm', align: 'left', width: 120, codeTable: ['code_dm_ckts_ckhwcytshslx_mc',  '01'], filter: {
      type: 'Select',
      codeTable: ['code_dm_ckts_ckhwcytshslx_mc', '01'],
    },ellipsis: true},
	
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '预退税申报事项', dataIndex: 'lcswsxDm', align: 'left', width: 130, fixed: 'left',codeTable: ['code_dm_gy_lcswsx_mc',  '02'], filter: {
      type: 'Select',
      codeTable: ['code_dm_gy_lcswsx_mc', '02'],
    }, ellipsis: true },
	{ title: '预退税申报年月', dataIndex: 'ytssbny', align: 'left', width: 110, fixed: 'left', ellipsis: true },
	{ title: '预退税关联号', dataIndex: 'ytsglh', align: 'left', width: 140, fixed: 'left', ellipsis: true},
	{ title: '预退税申报批次', dataIndex: 'ytssbpc', align: 'left', width: 110, fixed: 'left', ellipsis: true },
	{ title: '预退税申报序号', dataIndex: 'ytssbxh', align: 'left', width: 110, fixed: 'left', ellipsis: true },
	{ title: '出口货物报关单号', dataIndex: 'ckbgdh', align: 'left', width: 180, ellipsis: true},
	{ title: '代理出口货物证明号码', dataIndex: 'dlckhwzmhm', align: 'left', width: 160, ellipsis: true},
	{ title: '出口日期', dataIndex: 'ckrq1',align: 'left', width: 80, render: { type: 'date', format: 'yyyy-MM-DD' }, ellipsis: true },
	{ title: '预退税税种', dataIndex: 'ytssz', align: 'left', width: 90, ellipsis: true},
	{ title: '增值税退税额', dataIndex: 'zzstse', align: 'right', width: 110, sum: true, render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '消费税退税额', dataIndex: 'xfstse', align: 'right', width: 100, sum: true, render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '预退税办理时间', dataIndex: 'ytsblsj', align: 'left', width: 110, render: { type: 'date', format: 'yyyy-MM-DD' }, ellipsis: true},
	{ title: '预退税核算截止期', dataIndex: 'ytshsjzr1', sorter: true, align: 'left', width: 140, ellipsis: true},
	{ title: '是否已核算标志', dataIndex: 'sfyhsbz', align: 'left', width: 130, codeTable: ['code_static_yes_no',  '01'], filter: {
      type: 'Select',
      codeTable: ['code_static_yes_no', '01'],
    },ellipsis: true},
	{ title: '最新核算日期', dataIndex: 'zxhsrq', align: 'left', width: 100, render: { type: 'date', format: 'yyyy-MM-DD' }, ellipsis: true},
	{ title: '最新核算类型', dataIndex: 'ckhwcytshslxDm', align: 'left', width: 120, codeTable: ['code_dm_ckts_ckhwcytshslx_mc',  '01'], filter: {
      type: 'Select',
      codeTable: ['code_dm_ckts_ckhwcytshslx_mc', '01'],
    },ellipsis: true},
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'ytssbny', label: '预退税申报年月', type: 'Input' },
	{ name: 'ytssbpc', label: '预退税申报批次', type: 'Input' },
	{ name: 'ckbgdh', label: '出口货物报关单号', type: 'Input' },
	{ name: 'dlckhwzmhm', label: '代理出口货物证明号码', type: 'Input' },
	{ name: 'ytsblsj', label: '预退税办理时间', type: 'DatePicker', 'allowClear': true, range: true},
	{ name: 'ytshsjzr1', label: '预退税核算截止期', isLabel: true, type: 'DatePicker', range: true, format: 'yyyyMM', picker: 'month', allowClear: false },
	{ name: 'dqrzt', label: '待确认状态', type: 'Select', showSearch: true, codeTable: ['CODE_STATIC_DQRZT_DM',  '01'] },
];



// 配置项：工具栏
unitConfig.toolbar_default = {
  reload: true, // 是否显示刷新按钮，默认关闭
  full: true, // 是否显示全屏按钮，默认关闭
  ckts_download: false, // 是否显示导出按钮，默认关闭
  upload: false,  // 是否显示导入按钮，默认关闭
  ckts_sum: false, // 是否显示小计按钮，默认关闭
  ckts_order: false, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                       	// 是否显示编辑链接，默认关闭
  delete: false,                     	// 是否显示删除链接，默认关闭
};

export default unitConfig;

