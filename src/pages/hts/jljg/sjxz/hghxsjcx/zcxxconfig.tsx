import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 加工贸易账册数据
 */
const unitConfig: any = {};

// 配置项
unitConfig.module_key = 'ZXSB_WBSJ_DY_ZCBHBT';
unitConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.grid_selection_type = false;                                               //复选框隐藏
unitConfig.toolbar_show_grid_checked_num = false;                                                 // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.export_key = 'ZXSB_WBSJ_DY_ZCBHBT';

// 配置列表列
unitConfig.grid_columns = [
  { title: '预录入统一编号', dataIndex: 'ylrtybh', fixed: 'left', width: 160, align: 'left'},
  { title: '账册号', dataIndex: 'bah', fixed: 'left', width: 140, align: 'left', sorter: true},
  { title: '核销起始日期', dataIndex: 'hxqsrq', width: 140, align: 'left', sorter: true, render: { type: 'date', format: 'YYYY-MM-DD' }},
  { title: '核销截止日期', dataIndex: 'hxjzrq', width: 140, align: 'left', sorter: true, render: { type: 'date', format: 'YYYY-MM-DD' }},
  { title: '进口报关单{br}（张/条）', dataIndex: 'hgjkbgd', width: 120, align: 'right', render: { func: 'renderJmhgZccxJkbgd'} },
  { title: '出口报关单{br}（张/条）', dataIndex: 'hgckbgd', width: 120, align: 'right', render: { func: 'renderJmhgZccxCkbgd'} },
  { title: '进口保税核注清单{br}（张/条）', dataIndex: 'hgjkhzqd', width: 140, align: 'right', render: { func: 'renderJmhgZccxJkhzqd'}  },
  { title: '出口保税核注清单{br}（张/条）', dataIndex: 'hgckhzqd', width: 140, align: 'right', render: { func: 'renderJmhgZccxCkhzqd'} },
  { title: '报核次数', dataIndex: 'bhcs', width: 100, align: 'left'},
  { title: '经营单位编码', dataIndex: 'hgqyDm',  width: 120, align: 'left', ellipsis: true},
  { title: '经营单位社会信用代码', dataIndex: 'shxydm',  width: 160, align: 'left', ellipsis: true},
  { title: '经营单位名称', dataIndex: 'jydwmc',  width: 150, align: 'left', ellipsis: true},
  { title: '加工单位编码', dataIndex: 'jgdwdm',  width: 140, align: 'left', ellipsis: true},
  { title: '加工单位社会信用代码', dataIndex: 'jgqyshxydm',  width: 160, align: 'left', ellipsis: true},
  { title: '加工单位名称', dataIndex: 'jgdwmc',  width: 150, align: 'left', ellipsis: true},
  { title: '申报单位编码', dataIndex: 'sbdwdm',  width: 120, align: 'left', ellipsis: true},
  { title: '申报单位社会信用代码', dataIndex: 'sbdwshxydm',  width: 160, align: 'left', ellipsis: true},
  { title: '申报单位名称', dataIndex: 'sbdwmc',  width: 150, align: 'left', ellipsis: true},
  { title: '进口报核清单总份数', dataIndex: 'jkqdzs',  width: 150, align: 'right'},
  { title: '出口报核清单总份数', dataIndex: 'ckqdzs',  width: 150, align: 'right'},
  { title: '料件进口总金额', dataIndex: 'jkljwsjg',  width: 125, align: 'right', render: { type: 'number', format: '0,0.00' }},
  { title: '申报类型', dataIndex: 'sblxmc',  width: 120, align: 'left', ellipsis: true},
  { title: '主管海关', dataIndex: 'zghggqkamc',  width: 150, align: 'left', ellipsis: true},
  { title: '成品出口总金额', dataIndex: 'cjzj',  width: 125, align: 'right', render: { type: 'number', format: '0,0.00' }},
  { title: '录入单位编码', dataIndex: 'lrdwdm',  width: 120, align: 'left', ellipsis: true},
  { title: '录入单位社会信用代码', dataIndex: 'lrdwshxydm',  width: 160, align: 'left', ellipsis: true},
  { title: '录入单位名称', dataIndex: 'lrdwmc',  width: 150, align: 'left', ellipsis: true},
  { title: '申报日期', dataIndex: 'sbrq1', width: 110, align: 'left',render: { type: 'date', format: 'YYYY-MM-DD' }},
  { title: '录入日期', dataIndex: 'lrrq', width: 110, align: 'left',render: { type: 'date', format: 'YYYY-MM-DD' }},
  { title: '报核标志', dataIndex: 'bhztmc', width: 100, align: 'left' },
  { title: '备注', dataIndex: 'bz', width: 130, align: 'left', ellipsis: true},
];

unitConfig.grid_filter_quick = [
  { name: 'hxjzrq', label: '核销截止日期', type: 'DatePicker', range: true, tooltip: '查询核销截止日期在该范围内的账册数据', layout: {
    formItem: {
      xs: {span: 23, offset:1, pull: 1},
      sm: {span: 23, offset:1, pull: 1},
      md: {span: 23, offset:1, pull: 1},
      lg: {span: 23, offset:1, pull: 1},
      xl: {span: 15, offset:1, pull: 1},
      xxl: {span: 15, offset:1, pull: 1}
    }
  }, style:{width: '300px'}},
  { label: '账册号', name: 'bah', type: 'Input', width: '3w', searchButton: true  },
];

// 配置项：列表筛选项
// unitConfig.filter_items = [
//   { name: 'bah', label: '账册号', type: 'Input' },
//   { name: 'hxjzrq', label: '核销截止日期', type: 'DatePicker', range: true, tooltip: '查询核销截止日期在该范围内的账册数据', layout: {
//     formItem: {
//       xs: {span: 23, offset:1, pull: 1},
//       sm: {span: 23, offset:1, pull: 1},
//       md: {span: 23, offset:1, pull: 1},
//       lg: {span: 23, offset:1, pull: 1},
//       xl: {span: 15, offset:1, pull: 1},
//       xxl: {span: 15, offset:1, pull: 1}
//     }
//   }},
// ];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  download: true,
  full: true,
  reload: true,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};

unitConfig.customer_toolbar = [];
unitConfig.handle_columns = [];
export default unitConfig;