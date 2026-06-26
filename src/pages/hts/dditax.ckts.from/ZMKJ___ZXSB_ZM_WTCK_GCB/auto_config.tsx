import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 委托出口货物证明
 * serviceKey: ZMKJ_ZXSB_ZM_WTCK_G
 * unitId: zmkj_zxsb_zm_wtck_gcb
 */

const unitConfig: any = {};

unitConfig.module_key = 'ZMKJ_ZXSB_ZM_WTCK_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'zmkj_zxsb_zm_wtck_gcb'; // 页面id
unitConfig.grid_title = '委托出口货物证明'; // 列表标题，可选
unitConfig.form_title = '委托出口货物证明'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = ''; // 采集导出key
unitConfig.export_key2 = ''; // 统计导出key
unitConfig.export_key3 = ''; // 申报结果查询导出key
unitConfig.form_api_check = `/yw/bszx/zmkj/wtck/wtckGxqCheck`;
unitConfig.form_save_check = true;

// 配置列表列
unitConfig.grid_columns = [
  {title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left'},
  {title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90, fixed: 'left'},
  /*{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },*/
  {title: '编号', dataIndex: 'sbbh1', align: 'left', width: 100},
  {title: '序号', dataIndex: 'xh4', align: 'left', width: 60},
  {title: '代理出口协议号', dataIndex: 'dlckxyh', align: 'left', width: 180},
  {title: '出口货物报关单号', dataIndex: 'ckbgdh', align: 'left', width: 180},
  {title: '出口日期', dataIndex: 'ckrq1', width: 110, render: {type: 'date', format: 'YYYY-MM-DD'}},
  {title: '出口商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
  {title: '出口商品名称', dataIndex: 'ckspmc', align: 'left', width: 180, ellipsis: true},
  {title: '币种代码', dataIndex: 'hbzmDm', align: 'left', width: 150},
  {title: '金额', dataIndex: 'rmblaj', align: 'right', width: 140, sum: true, render: {type: 'number', format: '0,0.00'}},
  {title: '受托方纳税人识别号（统一社会信用代码）', dataIndex: 'stfnsrsbh', align: 'left', width: 310, ellipsis: true},
  {title: '受托企业名称', dataIndex: 'stfmc', align: 'left', width: 180, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
  {title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left'},
  {title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90, fixed: 'left'},
  /*{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },*/
  {title: '编号', dataIndex: 'sbbh1', align: 'left', width: 100},
  {title: '序号', dataIndex: 'xh4', align: 'left', width: 60},
  {title: '代理出口协议号', dataIndex: 'dlckxyh', align: 'left', width: 180},
  {title: '出口货物报关单号', dataIndex: 'ckbgdh', align: 'left', width: 180},
  {title: '出口日期', dataIndex: 'ckrq1', align: 'left', width: 120, render: {type: 'date', format: 'YYYY-MM-DD'}},
  {title: '出口商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
  {title: '出口商品名称', dataIndex: 'ckspmc', align: 'left', width: 180, ellipsis: true},
  {title: '币种代码', dataIndex: 'hbzmDm', align: 'left', width: 150},
  {title: '金额', dataIndex: 'rmblaj', align: 'right', width: 140, sum: true, render: {type: 'number', format: '0,0.00'}},
  {title: '受托方纳税人识别号（统一社会信用代码）', dataIndex: 'stfnsrsbh', align: 'left', width: 310, ellipsis: true},
  {title: '受托企业名称', dataIndex: 'stfmc', align: 'left', width: 180, ellipsis: true},
  {title: '委托出口货物证明编号', dataIndex: 'wtckhwzmbh', align: 'left', width: 220},
];

// 筛选项
unitConfig.filter_items = [
  {name: 'ckbgdh', label: '出口货物报关单号', type: 'Input'},
  {name: 'sbbh1', label: '编号', type: 'Input'},
  {name: 'sbpc', label: '申报批次', type: 'Input'},
  {name: 'ssq', label: '所属期', type: 'Input'},
  {name: 'ckrq1', label: '出口日期', type: 'DatePicker', 'allowClear': true, range: true},
];

// 表单项
unitConfig.form_items = [
  {label: 'ID', name: 'uuid', type: 'Hidden'},
  {label: '基本信息', name: 'jbxx', type: 'GroupTitle'},
  {
    label: '所属期',
    name: 'ssq',
    type: 'Input',
    rules: [{type: 'base_date', format: 'yyyyMM'}, {type: 'base_required'}, {type: 'base_string', range: [0, 6]}, {func: 'ssq01'}],
    eventOnChange: 'ssq'
  },
  {label: '申报批次', name: 'sbpc', type: 'Input', rules: [{type: 'base_required'}, {type: 'base_type_number'}, {func: 'sbpc02'}], eventOnBlur: 'sbpc'},
  /*{ label: '序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },*/
  {
    label: '编号',
    name: 'sbbh1',
    type: 'Input',
    rules: [{type: 'base_required'}, {type: 'base_type_number'}, {type: 'base_string', length: '10'}, {func: 'sbbh101'}, {func: 'sbbh102'}]
  },
  {
    label: '序号',
    name: 'xh4',
    type: 'Input',
    rules: [{type: 'base_required'}, {type: 'base_type_number'}, {type: 'base_string', range: [0, 2]}, {func: 'xh401'}],
    eventOnBlur: 'xh4'
  },
  {label: '受托方信息', name: 'stfxx', type: 'GroupTitle'},
  {
    label: '受托方纳税人识别号（统一社会信用代码）',
    name: 'stfnsrsbh',
    type: 'AutoComplete',
    showType: '2',
    codeTable: 'url_gy_qywtf:01',
    rules: [{type: 'base_required'}, {type: 'base_type_number_english'}, {type: 'base_string', range: ['15', '20']}, {func: 'stfnsrsbh01'}],
    eventOnBlur: 'stfnsrsbh'
  }
  ,
  {label: '受托企业名称', name: 'stfmc', type: 'Input', rules: [{type: 'base_required'}, {type: 'base_string', range: [0, 80]}, {func: 'stfmc01'}]},
  {label: '代理出口协议号', name: 'dlckxyh', type: 'Input', rules: [{type: 'base_required'}, {type: 'base_string', range: [0, 30]}]},
  {label: '出口信息', name: 'ckxx', type: 'GroupTitle'},
  {
    label: '出口货物报关单号',
    name: 'ckbgdh',
    type: 'Input',
    rules: [{type: 'base_required'}, {type: 'base_string', length: '21'}, {type: 'base_type_number_english'}],
    eventOnChange: 'ckbgdh'
  },
  {label: '出口日期', name: 'ckrq1', type: 'DatePicker', 'allowClear': true, format: 'YYYY-MM-DD', rules: [{type: 'base_required'}, {type: 'base_date', format: 'yyyyMMdd'}]},
  {label: '出口商品代码', name: 'ckspDm', type: 'Input', rules: [{type: 'base_required'}, {type: 'base_type_number'}, {type: 'base_string', range: [0, 10]}, {func: 'ckspdm01'}]},
  {label: '出口商品名称', name: 'ckspmc', type: 'Input', rules: [{type: 'base_required'}, {type: 'base_string', range: [0, 75]}]},
  {
    label: '出口额_币种',
    name: 'hbzmDm',
    type: 'Select',
    showType: '3',
    'showSearch': true,
    'allowClear': true,
    codeTable: 'code_dm_gy_hb:01',
    rules: [{type: 'base_required'}, {type: 'base_string', range: [0, 3]}],
    eventOnChange: 'hbDm'
  },
  {label: '币种名称', name: 'biname', type: 'Input', disabled: true},
  {
    label: '出口额_金额',
    name: 'rmblaj',
    type: 'InputNumber',
    format: '0,0.00',
    rules: [{type: 'base_required'}, {type: 'base_number', length: 14, decimal: 2}, {type: 'base_number', range: '+-'}]
  },
  {label: '已出具证明编号', name: 'wtckhwzmbh', type: 'Hidden'},
  {label: '申报标志', name: 'sbztDm', type: 'Hidden'},
  {label: '审核标志', name: 'shbz', type: 'Hidden'},
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  add: true, // 是否显示增加按钮，默认关闭
  edit: true, // 是否显示修改按钮，默认关闭
  delete: true, // 是否显示删除按钮，默认关闭
  setting: true, // 是否显示设置按钮，默认关闭
  reload: true, // 是否显示刷新按钮，默认关闭
  full: true, // 是否显示全屏按钮，默认关闭
  ckts_download: true, // 是否显示导出按钮，默认关闭
  upload: false,  // 是否显示导入按钮，默认关闭
  ckts_sum: false, // 是否显示小计按钮，默认关闭
  ckts_order: 5, // 是否显示序号重排 5 ： 证明专用 按所属期、批次、编号进行 序号重排，重拍字段为 xh_4
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                       	// 是否显示编辑链接，默认关闭
  delete: false,                     	// 是否显示删除链接，默认关闭
};

unitConfig.customer_toolbar = [];
unitConfig.handle_columns = [];
export default unitConfig;

