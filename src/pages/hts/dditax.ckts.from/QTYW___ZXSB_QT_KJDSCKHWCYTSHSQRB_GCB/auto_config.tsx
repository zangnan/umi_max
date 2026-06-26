import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title:跨境电商出口海外仓预退税核算确认表
 * serviceKey: QTYW_ZXSB_TY_KJDSHWC_HSSB_G
 * unitId: qtyw_zxsb_qt_qynbfktxjs_gcb
*/

const unitConfig: any = {};

unitConfig.module_key = 'QTYW_ZXSB_TY_KJDSHWC_HSSB_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'qtyw_zxsb_ty_kjdshwc_hssb_gcb'; // 页面id
unitConfig.grid_title = '跨境电商出口海外仓预退税核算确认表'; // 列表标题，可选
unitConfig.form_title = '跨境电商出口海外仓预退税核算确认表'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = 'SAAS_QTYW_KJDSHWC_HSSB_DC'; // 采集导出key
unitConfig.export_key2 = 'SAAS_SJGL_SWFKCX_QTYW_KJDSHWCHSSB_DC'; // 统计导出key
unitConfig.export_key3 = 'SAAS_QTTMS_QTYW_SBMXCK_KJDSHWC_DC'; // 申报结果查询导出key
unitConfig.form_save_check = true;   
unitConfig.form_api_check=`/yw/bszx/qtyw/khdshwc/checkFlglfpYcj/QTYW_ZXSB_TY_KJDSHWC_HSSB_G`; 
unitConfig.batch_update_url = `/yw/bszx/qtyw/khdshwc/kjdshwcplxg`; // 批量修改保存接口


// 配置列表列
unitConfig.grid_columns = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 60, fixed: 'left', ellipsis: true },
	{ title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 70, fixed: 'left', ellipsis: true },
	{ title: '申报序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left', ellipsis: true },
	{ title: '预退税申报事项', dataIndex: 'ytslcswsxdm', align: 'left', width: 130,  codeTable: 'code_dm_gy_lcswsx_mc:02', filter: {
      type: 'Select',
      codeTable: 'code_dm_gy_lcswsx_mc:02',
    },ellipsis: true },
	{ title: '预退税申报年月', dataIndex: 'ytssbny', align: 'left', width: 110,  ellipsis: true },
	{ title: '预退税关联号', dataIndex: 'ytsglh', align: 'left', width: 120, ellipsis: true},
	{ title: '预退税申报批次', dataIndex: 'ytssbpc', align: 'left', width: 110,  ellipsis: true },
	{ title: '预退税申报序号', dataIndex: 'ytssbxh', align: 'left', width: 110,  ellipsis: true },
	{ title: '出口货物报关单号', dataIndex: 'ckbgdh', align: 'left', width: 180, ellipsis: true},
	{ title: '代理出口货物证明号码', dataIndex: 'dlckhwzmhm', align: 'left', width: 150, ellipsis: true},
	{ title: '出口海外仓预退税核算类型代码', dataIndex: 'ckhwcytshslxDm', align: 'left', width: 220, codeTable: 'code_dm_ckts_ckhwcytshslx_mc:01', filter: {
      type: 'Select',
      codeTable: 'code_dm_ckts_ckhwcytshslx_mc:01',
    }, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 60, fixed: 'left', ellipsis: true },
	{ title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 70, fixed: 'left', ellipsis: true },
	{ title: '申报序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left', ellipsis: true },
	{ title: '预退税申报事项', dataIndex: 'ytslcswsxdm', align: 'left', width: 130,  codeTable: 'code_dm_gy_lcswsx_mc:02', filter: {
      type: 'Select',
      codeTable: 'code_dm_gy_lcswsx_mc:02',
    },ellipsis: true },
	{ title: '预退税申报年月', dataIndex: 'ytssbny', align: 'left', width: 110,  ellipsis: true },
	{ title: '预退税关联号', dataIndex: 'ytsglh', align: 'left', width: 120, ellipsis: true},
	{ title: '预退税申报批次', dataIndex: 'ytssbpc', align: 'left', width: 110,  ellipsis: true },
	{ title: '预退税申报序号', dataIndex: 'ytssbxh', align: 'left', width: 110,  ellipsis: true },
	{ title: '出口货物报关单号', dataIndex: 'ckbgdh', align: 'left', width: 180, ellipsis: true},
	{ title: '代理出口货物证明号码', dataIndex: 'dlckhwzmhm', align: 'left', width: 150, ellipsis: true},
	{ title: '出口海外仓预退税核算类型代码', dataIndex: 'ckhwcytshslxDm', align: 'left', width: 220, codeTable: 'code_dm_ckts_ckhwcytshslx_mc:01', filter: {
      type: 'Select',
      codeTable: 'code_dm_ckts_ckhwcytshslx_mc:01',
    }, ellipsis: true},
	{ title: '最新核算日期', dataIndex: 'zxhsrq', align: 'left', width: 100, render: { type: 'date', format: 'YYYY-MM-DD' }, ellipsis: true},
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'ssq', label: '所属期', type: 'Input' },
	{ name: 'sbpc', label: '申报批次', type: 'Input' },
	{ name: 'ckbgdh', label: '出口货物报关单号', type: 'Input' },
	{ name: 'dlckhwzmhm', label: '代理出口货物证明号码', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: '基础信息', name: 'jbxx', type: 'GroupTitle', disabled: true},
	{ label: 'ID', name: 'uuid', type: 'Hidden' },
	{ label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}], eventOnChange: 'ssq' },
	{ label: '申报批次', name: 'sbpc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' },  { func: 'sbpc02' }],eventOnBlur: 'sbpc' },
	{ label: '申报序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
	{ label: '预退税申报信息', name: 'ckxx', type: 'GroupTitle', disabled: true},
	{ label: '预退税申报事项', name: 'ytslcswsxdm', type: 'Select',disabled: true, 'allowClear': true, codeTable: 'code_dm_gy_lcswsx_mc:02'},
	{ label: '预退税申报年月', name: 'ytssbny', type: 'Input', disabled: true },
	{ label: '预退税关联号', name: 'ytsglh', type: 'Input', disabled: true},
	{ label: '预退税申报批次', name: 'ytssbpc', type: 'Input', disabled: true},
	{ label: '预退税申报序号', name: 'ytssbxh', type: 'Input', disabled: true},
	{ label: '出口货物报关单号', name: 'ckbgdh', type: 'Input', disabled: true},
	{ label: '代理出口货物证明号', name: 'dlckhwzmhm', type: 'Input', disabled: true},
	{ label: '预退税核算信息', name: 'qtxx', type: 'GroupTitle', disabled: true},
	{ label: '出口海外仓预退税核算类型代码', name: 'ckhwcytshslxDm', type: 'Select', showType: '3', 'allowClear': true, codeTable: 'code_dm_ckts_ckhwcytshslx_mc:01', rules: [{ type: 'base_required'}]},
	
];

unitConfig.batch_update_items = [
  { dataIndex: 'ssq', label: '所属期', type: "Input",  rules: [{ type: 'base_date', format: 'YYYYMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}], eventOnChange: 'ssq' },
  { dataIndex: 'sbpc', label: '申报批次', type: "Input", rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbpc01' }, { func: 'sbpc02' }], eventOnChange: 'sbpc'  },
  { dataIndex: 'ckhwcytshslxDm', label: '出口海外仓预退税核算类型代码', type: "tableSelect", rules: [{ type: 'base_required' }],codeTable: 'code_dm_ckts_ckhwcytshslx_mc:01' },

];


// 配置项：工具栏
unitConfig.toolbar_default = {
  add: false, // 是否显示增加按钮，默认关闭
  edit: true, // 是否显示修改按钮，默认关闭
  delete: true, // 是否显示删除按钮，默认关闭
  setting: true, // 是否显示设置按钮，默认关闭
  reload: true, // 是否显示刷新按钮，默认关闭
  full: true, // 是否显示全屏按钮，默认关闭
  ckts_download: false, // 是否显示导出按钮，默认关闭
  upload: false,  // 是否显示导入按钮，默认关闭
  ckts_sum: false, // 是否显示小计按钮，默认关闭
  ckts_order: 3, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭 。1/4:所属期;2:申请日期;3:所属期，批次;5:所属期，批次，编号
  batchEdit: true,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                       	// 是否显示编辑链接，默认关闭
  delete: false,                     	// 是否显示删除链接，默认关闭
};

unitConfig.customer_toolbar = [];
unitConfig.handle_columns = [];
export default unitConfig;

