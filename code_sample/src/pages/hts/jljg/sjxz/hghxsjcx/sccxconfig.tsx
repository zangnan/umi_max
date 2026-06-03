/**
 * title: 加工贸易手册数据
 */
const unitConfig: any = {};

// 配置项
unitConfig.unit_key = 'ZXSB_WBSJ_DY_SCBHBT';
unitConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.grid_selection_type = false;                                               //复选框隐藏
unitConfig.grid_show_data_num = false;                                                 // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.export_key="ZXSB_WBSJ_DY_SCBHBT";

// 配置列表列
unitConfig.grid_columns = [
  { title: '预录入统一编号', dataIndex: 'ylrtybh', fixed: 'left', width: 160, align: 'left'},
  { title: '手册号', dataIndex: 'bah', fixed: 'left', width: 140, align: 'left', sorter: true },
  { title: '结案日期', dataIndex: 'jarq', width: 110, align: 'left', sorter: true, render: { type: 'date', format: 'yyyy-MM-DD' } },
  { title: '进口报关单{br}（张/条）', dataIndex: 'jkbgd', width: 120, align: 'right', render: { func: 'renderJmhgSccxJkbgd'} },
  { title: '出口报关单{br}（张/条）', dataIndex: 'ckbgd', width: 120, align: 'right', render: { func: 'renderJmhgSccxCkbgd'} },
  { title: '进口保税核注清单{br}（张/条）', dataIndex: 'jkhzqd', width: 140, align: 'right', render: { func: 'renderJmhgSccxJkhzqd'} },
  { title: '出口保税核注清单{br}（张/条）', dataIndex: 'ckhzqd', width: 140, align: 'right', render: { func: 'renderJmhgSccxCkhzqd'} },
  { title: '主管海关', dataIndex: 'zghggqkamc', width: 140, align: 'left', ellipsis: true},
  { title: '经营单位编码', dataIndex: 'hgqyDm', width: 120, align: 'left', ellipsis: true},
  { title: '经营单位社会信用代码', dataIndex: 'shxydm', width: 160, align: 'left', ellipsis: true},
  { title: '经营单位名称', dataIndex: 'jydwmc', width: 150, align: 'left', ellipsis: true},
  { title: '加工单位编码', dataIndex: 'jgdwdm', width: 140, align: 'left', ellipsis: true},
  { title: '加工单位社会信用代码', dataIndex: 'jgqyshxydm', width: 160, align: 'left', ellipsis: true},
  { title: '加工单位名称', dataIndex: 'jgqynsrmc', width: 150, align: 'left', ellipsis: true},
  { title: '进口清单总数', dataIndex: 'jkqdzs', width: 105, align: 'right'},
  { title: '出口清单总数', dataIndex: 'ckqdzs', width: 105, align: 'right'},
  { title: '录入日期', dataIndex: 'lrrq', width: 105, align: 'left',render: { type: 'date', format: 'yyyy-MM-DD' } },
  { title: '报核料件总数', dataIndex: 'bhljzs', width: 105, align: 'right'},
  { title: '报核成品总数', dataIndex: 'bhcpzs', width: 105, align: 'right'},
  { title: '报核申报日期', dataIndex: 'bhsbrq', width: 110, align: 'left',render: { type: 'date', format: 'yyyy-MM-DD' }},
  { title: '申报单位编码', dataIndex: 'sbdwdm', width: 140, align: 'left', ellipsis: true},
  { title: '申报单位社会信用代码', dataIndex: 'sbdwshxydm', width: 160, align: 'left', ellipsis: true},
  { title: '申报单位名称', dataIndex: 'sbdwmc', width: 150, align: 'left', ellipsis: true},
  { title: '录入单位编码', dataIndex: 'lrdwdm', width: 140, align: 'left', ellipsis: true},
  { title: '录入单位社会信用代码', dataIndex: 'lrdwshxydm', width: 160, align: 'left', ellipsis: true},
  { title: '录入单位名称', dataIndex: 'lrdwmc', width: 150, align: 'left', ellipsis: true},
  { title: '备注', dataIndex: 'bz', width: 130, align: 'left', ellipsis: true},
];

unitConfig.grid_filter_quick = [
  { name: 'jarq', label: '结案日期', type: 'DatePicker', range: true, layout: {
    formItem: {
      xs: {span: 23, offset:1, pull: 1},
      sm: {span: 23, offset:1, pull: 1},
      md: {span: 23, offset:1, pull: 1},
      lg: {span: 23, offset:1, pull: 1},
      xl: {span: 15, offset:1, pull: 1},
      xxl: {span: 15, offset:1, pull: 1}
    }
  } },
  { label: '手册号', name: 'bah', type: 'Input', width: '3w', searchButton: true  },
];
// 配置项：列表筛选项
// unitConfig.filter_items = [
//   { name: 'bah', label: '手册号', type: 'Input' },
//   { name: 'jarq', label: '结案日期', type: 'DatePicker', range: true, layout: {
//     formItem: {
//       xs: {span: 23, offset:1, pull: 1},
//       sm: {span: 23, offset:1, pull: 1},
//       md: {span: 23, offset:1, pull: 1},
//       lg: {span: 23, offset:1, pull: 1},
//       xl: {span: 15, offset:1, pull: 1},
//       xxl: {span: 15, offset:1, pull: 1}
//     }
//   } },
// ];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  download: true,
  reload: true,
  full: true,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};

export default unitConfig;