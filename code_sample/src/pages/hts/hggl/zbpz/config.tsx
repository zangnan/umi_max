

const unitConfig: any = {};
// 配置项
unitConfig.grid_show_serial_number = false;                                            // 是否显示序号，可选，默认不显示
unitConfig.grid_row_key = { type: '1', key: ['ydbh', 'lcswsxDm'] };
unitConfig.unit_key = 'CX_HGGL_TSQK_ZBPZQUERY';
unitConfig.grid_selection_type = 'checkbox';                       
unitConfig.layout_type = 'modal';                                        // 页面类型，默认default 可选 default modal tabs



// 配置列表列
unitConfig.grid_columns = [
  { title: '序号', dataIndex: 'xh',width: 90, align: 'center',},
  { title: '指标编码', dataIndex: 'ydbh',width: 130, align: 'center', ellipsis: true,},
  { title: '适用企业类型', dataIndex: 'lcswsxDm',width: 130,codeTable: ['code_static_syqylx_mc', '01'] ,filter: {
    type: 'Select',
    codeTable: ['code_static_syqylx_mc', '01']
  }, },
  { title: '风险描述', dataIndex: 'ydnr',width: 400, render: { func: 'renderfxms' } },
  { title: '风险等级', dataIndex: 'ydjbDm', width: 100, align: 'center',codeTable: ['code_static_syqylxydjb_mc', '01'] ,  filter: {
    type: 'Select',
    codeTable: ['code_static_syqylxydjb_mc', '01']
  }, },
  { title: '指标说明', dataIndex: 'jktjsm', width: 400, align: 'center',ellipsis: true,},
  { title: `启用标志`, dataIndex: 'sfkq', width: 90, align: 'center',  fixed: 'right' ,codeTable: ['code_static_zbpz_yes_no', '01'],  filter: {
    type: 'Select',
    codeTable: ['code_static_zbpz_yes_no', '01']
  }, },
];


// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
unitConfig.grid_filter_quick = [
  // { name: 'lcswsxDm', label: '适用企业类型', type: 'Select' ,codeTable: ['code_static_syqylx_mc', '01'] },
  // { name: 'sfkq', label: '启用标志', type: 'Select' ,codeTable: ['code_static_qybz_yes_no', '01']},
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: false,
  add: false,
  full: false,
  reload: false,
};


// 配置项：自定义工具栏
unitConfig.costomer_toobar = [
  { name: '批量设置', func: 'qybz' },
  // { name: '风险报告', func: 'fxbg' },
];


export default unitConfig;