import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 报关单数据
 */
const unitConfig: any = {};

// 配置项
unitConfig.module_key = 'CX_MBCX_CKTS_TY_CKSPTSLWK';

unitConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.grid_scroll_x = '1450px';
unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.grid_show_serial_number = true;                      // 是否显示序号，默认不显示
unitConfig.export_key = 'DC_MBCX_CKTS_TY_CKSPTSLWK_YSFWSL'; // 业务单元key，对应后端接口


// 配置列表列
unitConfig.grid_columns = [
  { title: '商品代码', dataIndex: 'ckspDm', fixed: 'left', width: 100},
  { title: '商品名称', dataIndex: 'ckspmc', width: 300, ellipsis: true  },
  { title: '标准商品全称', dataIndex: 'ckspqc', width: 300, ellipsis: true  },
  { title: '征税率', dataIndex: 'zssljh', width: 80,align: 'right' },
  { title: '退税率', dataIndex: 'tsl', width: 80,align: 'right' },
  { title: '从量定额', dataIndex: 'cldezs',align: 'right', width: 140 , render: { type: 'number', format: '0,0.00000' } },
  { title: '从价定率', dataIndex: 'cjdlzs',align: 'right', width: 140 , render: { type: 'number', format: '0,0.0000' } },
  { title: '商品码单位', dataIndex: 'hgjldwmc', width: 140 },
  { title: '税种', dataIndex: 'sz',  width: 140 },
  { title: '是否退税', dataIndex: 'tsbz',width: 100 , codeTable: 'code_static_yes_no:01' },
];

unitConfig.grid_filter_quick = [
  { name: 'ckspDm', label: '商品代码', type: 'Input' },
  { name: 'ckspmc', label: '商品名称', type: 'Input' , searchButton: true },
];
// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  download: false,
  full: true,
  reload: true,
  ckts_download: false,                   // 是否显示导出，默认关闭
  download: true,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};

unitConfig.customer_toolbar = [];
unitConfig.handle_columns = [];
export default unitConfig;
