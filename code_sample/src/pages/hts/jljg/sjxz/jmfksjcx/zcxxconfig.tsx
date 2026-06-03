/**
 * title: 加贸反馈数据查询-已核销账册数据
 */
const unitConfig: any = {};

// 配置项
unitConfig.unit_key = 'ZXSB_WBSJ_HG_DZZCHXXX';                                         // 业务单元key，对应后端接口
unitConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.grid_selection_type = false;                                               //复选框隐藏
unitConfig.grid_show_data_num = false;                                              // 工具栏左侧是否显示数据条数及选中数，默认显示
unitConfig.export_key = 'ZXSB_WBSJ_HG_DZZCHXXX';                                         // 业务单元key，对应后端接口


// 配置列表列
unitConfig.grid_columns = [
  { title: '账册号', dataIndex: 'bah', fixed: 'left', width: 160, align: 'left', sorter: true},
  { title: '核销起始日期', dataIndex: 'hxqsrq', width: 140, align: 'left', sorter: true, render: { type: 'date', format: 'yyyy-MM-DD' }},
  { title: '核销截止日期', dataIndex: 'hxjzrq', width: 140, align: 'left', sorter: true, render: { type: 'date', format: 'yyyy-MM-DD' }},
  { title: '报关单张数', dataIndex: 'bgdts',  align: 'right' },
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
  download:  true,
  reload: true,
  full: true,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};

export default unitConfig;