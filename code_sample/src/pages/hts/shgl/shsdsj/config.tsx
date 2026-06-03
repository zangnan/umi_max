/**
 * title: 收汇水单
 */
const sdsjConfig: any = {};

// 配置项
sdsjConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
sdsjConfig.grid_show_data_num = false;                           // 工具栏左侧是否显示数据条数及选中数，默认true显示
sdsjConfig.layout_type = 'modal';                                // 页面类型，默认default 可选 default modal tabs tz台账
sdsjConfig.click_checked = '1';                                  // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
sdsjConfig.grid_row_key = 'uuid';                      // 列表主键，默认uuid
sdsjConfig.unit_key = 'CX_SHGL_SHSDSJ_SHSDSJCX';          // 业务单元key，对应后端接口
sdsjConfig.export_key = 'CX_SHGL_SHSDSJ_SHSDSJCX_DC';        // 业务单元key，对应后端接口
sdsjConfig.module_type = 'QZ_type';
sdsjConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出
sdsjConfig.form_api_show=`${API_URL_BASE}/saas/shgl/shsdsj/initForm`;            // api 表单查询
sdsjConfig.form_api_save=`${API_URL_BASE}/saas/shgl/shsdsj/save`;                // api 表单更新
sdsjConfig.form_api_save_upload=`${API_URL_BASE}/saas/shgl/shsdsj/save`;                // api 表单更新
sdsjConfig.form_title = '收汇信息';
sdsjConfig.form_api_delete = `${API_URL_BASE}/saas/shgl/shsdsj/shsdsjDelete`;

// 配置列表列
sdsjConfig.grid_columns = [
  {title: '匹配状态', dataIndex: 'ppztDm', width: 100, ellipsis: true, codeTable: ['code_dm_zxsb_ppzt', '01'],
    filter: {
      type: 'Select',
      codeTable: ['code_dm_zxsb_ppzt', '01'],
    }
  },
  {title: '匹配方式', dataIndex: 'sgppbz', width: 120, ellipsis: true,  codeTable: ['CODE_STATIC_DM_SHGL_PPFS', '01'],
    filter: {
      type: 'Select',
      codeTable: ['CODE_STATIC_DM_SHGL_PPFS', '01'],
    }
  },
  {
    title: '匹配币制', dataIndex: 'ppbzDm', width: 100, ellipsis: true, codeTable: ['CODE_DM_ZXSB_PPBZ', '01'],
    filter: {
      type: 'Select',
      codeTable: ['CODE_DM_ZXSB_PPBZ', '01'],
    }
  },
  {title: '收汇凭证号', dataIndex: 'shpzh', width: 140, ellipsis: true},
  {title: '收汇日期', dataIndex: 'ckshrq', width: 100, ellipsis: true},
  {title: '付汇人', dataIndex: 'fhr', ellipsis: true, width: 160},
  {title: '付汇方式', dataIndex: 'shgzDm', width: 100, ellipsis: true , codeTable: ['CODE_DM_ZXSB_SHGZ', '01'],
    filter: {
      type: 'Select',
      codeTable: ['CODE_DM_ZXSB_SHGZ', '01'],
    }},
  {title: '收汇币制', dataIndex: 'shbzDm', width: 85, ellipsis: true },
  {title: '收汇金额', dataIndex: 'ckshje', ellipsis: true, align: 'right', width: 140, render: {type: 'number', format: '0,0.00'}},
  {title: '实收金额', dataIndex: 'sjjsje', ellipsis: true, align: 'right', width: 140, render: {type: 'number', format: '0,0.00'}},
  {title: '手续费', dataIndex: 'sxf', ellipsis: true, align: 'right', width: 140, render: {type: 'number', format: '0,0.00'}},
  {title: '收汇汇率', dataIndex: 'shbzhl', ellipsis: true, align: 'right', width: 140, render: {type: 'number', format: '0,0.00000'}},
  {title: '人民币收汇金额', dataIndex: 'ckshjermb', ellipsis: true, align: 'right', width: 140, render: {type: 'number', format: '0,0.00'}},
  {title: '已匹配金额', dataIndex: 'yzje1', ellipsis: true, align: 'right', width: 140, render: {type: 'number', format: '0,0.00'}},
  {title: '剩余金额', dataIndex: 'syje', ellipsis: true, align: 'right', width: 140, render: {type: 'number', format: '0,0.00'}},
  {title: '收款账号', dataIndex: 'jwskrshzh', width: 170, ellipsis: true },
  {title: '收款银行', dataIndex: 'jwskrshyxmc', width: 250, ellipsis: true },
  {title: '附言', dataIndex: 'bz', width: 180, ellipsis: true },
  {title: '付款行', dataIndex: 'jnzfrfhyhmc', width: 250, ellipsis: true },
  {title: '付款账号', dataIndex: 'jnzfrfhzh', width: 170, ellipsis: true },
  {title: '付款人国家/地区', dataIndex: 'fhgjdq', width: 120, ellipsis: true },
  {title: '数据来源', dataIndex: 'ywsjlyDm', width: 120, ellipsis: true, codeTable: ['code_dm_zxsb_ywsjly',  '01'], 
    filter: {
      type: 'Select',
      codeTable: ['code_dm_zxsb_ywsjly', '01']
    }  
  },
  {title: '业务关系', dataIndex: 'htfs', width: 80,render:{func: 'renderHtfs'},fixed: 'right' , align: 'center'},
  {title: '关单份数', dataIndex: 'bgdfs', width: 80 ,render:{func:'renderGdfs'}, fixed: 'right', align: 'center'},
];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
sdsjConfig.filter_items = [
  {name: 'shpzh', label: '收汇凭证号', type: 'Input',},
  {name: 'ckshrq', label: '收汇日期', type: 'DatePicker', range: true},
  {name: 'fhr', label: '付汇人', type: 'Input',},
];

sdsjConfig.form_items = [
  { label: 'uuid', type: 'Hidden', name: 'uuid' },
  { label: '匹配状态', type: 'Hidden', name: 'ppztDm' },
  { label: '已匹配金额', type: 'Hidden', name: 'yzje1' },
  { label: '收汇信息', name: 'shxx', type: 'GroupTitle' },
  { label: '收汇凭证号', name: 'shpzh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 30] }, { func: 'shpzhWxy' }] },
  { label: '收汇日期', name: 'ckshrq', type: 'DatePicker', format: 'YYYY-MM-DD',rules: [{ type: 'base_required' }], eventOnBlur: 'getShhl' },
  { label: '付汇人', name: 'fhr', type: 'Input', eventOnBlur : 'fhrOnblur', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 300] }] },
  { label: '匹配币制', type: 'Select', name: 'ppbzDm', codeTable: ['CODE_DM_ZXSB_PPBZ', '01'],rules: [{ type: 'base_required' }] },
  { label: '付汇方式', type: 'Select', name: 'shgzDm', disabled: true, codeTable: ['code_dm_zxsb_shgz', '01'] },
  { label: '收汇币种代码', name: 'shbzDm', type: 'AutoComplete', showType: '3', 'allowClear': true, codeTable: ['url_gy_hbhl', '01'], rules: [{ type: 'base_required' }], eventOnBlur: 'shbzDmOnblur'},
	{ label: '收汇币种名称', name: 'shbzmc', type: 'Input', readOnly: true},
  { label: '收汇金额', name: 'ckshje', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+' }, { func: 'ckshjeJy' }], eventOnBlur: 'shjeOrShhlOnblur'},
  { label: '收汇汇率', name: 'shbzhl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 5}, { type: 'base_number', range: '+0' }], eventOnBlur: 'shjeOrShhlOnblur'},
  { label: '人民币收汇金额', name: 'ckshjermb', type: 'InputNumber', format: '0,0.00', readOnly: true },
  { label: '实收金额', name: 'sjjsje', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+0' }] },
  { label: '手续费', name: 'sxf', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+0' }] },
  { label: '收款账号', type: 'Input', name: 'jwskrshzh',rules: [{ type: 'base_string', range: [0, 50] }]  },
  { label: '收款银行', type: 'Input', name: 'jwskrshyxmc',rules: [{ type: 'base_string', range: [0, 120] }]  },
  { label: '付款行', type: 'Input', name: 'jnzfrfhyhmc',rules: [{ type: 'base_string', range: [0, 120] }]  },
  { label: '付款账号', type: 'Input', name: 'jnzfrfhzh',rules: [{ type: 'base_string', range: [0, 50] }]  },
  { label: '付款人国家/地区', name: 'fhgjdq', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_gy_gjhdq', '01'] },
  { label: 'ST', name: 'st', type: 'Blank' },
	{ label: '附言', name: 'bz', type: 'TextArea', autoSize: { minRows: 2, maxRows: 2}, layout: { label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3}, formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 } }, rules: [{ type: 'base_string', range: [0, 300]}]},
  { label: '对应业务信息', name: 'dyhtxx', tooltip: '1. 合同收汇、关单收汇需填写，滚动收汇无需填写；2. 对应业务号部分收汇时需填写占用收汇金额，对应业务号的全部金额，可不填写占用收汇金额。', type: 'GroupTitle' },
  { label: '对应业务信息', name: 'dyhtxxArr', type: 'List', children: [
      { label: '业务号', name: 'ckhth', type: 'Input', rules: [{ type: 'base_string', range: [0, 150] }, { func: 'dyhtxxJy' }] },
      { label: '占用收汇金额', name: 'ckshje', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_number', length: 15, decimal: 2}, { type: 'base_number', range: '+0' }] },
      { label: '匹配标志', type: 'Hidden', name: 'ppbz' },
    ]
  },
  { label: '附件资料', name: 'fjzl', type: 'GroupTitle' },
  {label: '上传附列资料', name: 'wjnrStr', fileName: 'wjm', type: 'Upload', tooltip: '支持上传PDF/JPG/PNG/JPEG格式文件且大小不应超过10M', editInit: 'true'},
];

// 配置项：自定义工具栏
// sdsjConfig.costomer_toobar = [
//   {
//     name: '批量修改',
//     type: 'dropdown',
//     key: 'jxfpplxg',
//     list: [
//       {name: '签收状态', func: 'btnSetQszt'},
//     ],
//   },
//   {name: '台账筛选', key: '3', func: 'importTzsx'},

// ];

sdsjConfig.costomer_toobar = [
  // { name: '删除', func: 'shsdsjBatchDelete' },
  // { name: '导入', func: 'shsdsjImport' },
  { name: '批量自动匹配', func: 'btnPlzdpp' },
  { name: '批量补填', func: 'btnPlbtHl' },
];



// 配置项：工具栏
// sdsjConfig.toolbar_default = {
//   tssb_download: true,
//   delete: false,
//   setting: true,
//   reload: true,
//   full: true,
// };


// 配置项：工具栏
sdsjConfig.toolbar_default = {
  add: true,
  edit: true,
  delete: true,
  upload: {name: '导入', func: 'shsdsjImport', key: 'shsdsjImport'},
  setting: true,
  full: true,
  reload: true,
  tssb_download: true,
};

sdsjConfig.handle_columns = [
  { name: '匹配', key: 'shsdsjpp', func: 'handleColumnsPp' },
  { name: '预览', key: 'scfj', func: 'handleColumnsScfj', display: 'scfjDisplay' },
];


export default sdsjConfig;
