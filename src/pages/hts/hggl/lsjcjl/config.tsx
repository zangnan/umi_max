import CONSTANTS from '@/components/DDAssist/constants';


const unitConfig: any = {};
// 配置项
unitConfig.grid_show_serial_number = true;                                            // 是否显示序号，可选，默认不显示
unitConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
unitConfig.module_key = 'CX_HGGL_TSQK_LSJCJLQUERY';
unitConfig.grid_selection_type = false;
unitConfig.module_type = 'QZ_type';




// 配置列表列
unitConfig.grid_columns = [
  { title: '检测日期', dataIndex: 'smkssj',width: 90, align: 'center', render: { type: 'date', format: 'YYYY-MM-DD' } , fixed: 'left'},
  { title: '指标个数', dataIndex: 'fxzbgs',width: 90, align: 'right', ellipsis: true},
  { title: '未通过', dataIndex: 'mzzbgs',width: 90, align: 'right', ellipsis: true},
  { title: '疑点总数', dataIndex: 'sjzjydsl',width: 90, align: 'right', render: { func: 'renderBadzYdzs' } },
  { title: '错误类疑点', dataIndex: 'sjzjcwlydsl',width: 90, align: 'right', ellipsis: true, render: { func: 'renderSjzjcwlydsl' } },
  { title: '警告类疑点', dataIndex: 'sjzjjglydsl',width: 90, align: 'right', ellipsis: true, render: { func: 'renderSjzjjglydsl' } },
  { title: '检测范围', dataIndex: 'jcfw',align: 'left', ellipsis: true},
];


// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
unitConfig.grid_filter_quick = [
  { name: 'smkssj', label: '检测日期', isLabel: true, range: true,type: 'DatePicker' },
];

unitConfig.filter_items = [
  // { name: 'smkssj', label: '检测日期', isLabel: true, range: true,type: 'DatePicker' },
];

// 配置项：自定义操作列
unitConfig.handle_columns = [
  { name: '疑点清册', func: 'ydqc'},
  // { name: '风险报告', func: 'fxbg'},
];


// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  add: false,
  full: true,
  reload: true,
  download: false,
};


// 配置项：自定义工具栏
unitConfig.customer_toolbar = [
  // { name: '疑点清册', func: 'ydqc' },
  // { name: '风险报告', func: 'fxbg' },
];


export default unitConfig;
