import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 失败原因
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '';
unitConfig.api_grid_query = `/hx/ty/crud/queryPager`;   // api 列表查询
unitConfig.module_key = 'CX_SAAS_ZDPD_PDJG_CKXQ';
unitConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.grid_selection_type = false;                                               //复选框隐藏
unitConfig.toolbar_show_grid_checked_num = false;                                                 // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.layout_type = 'modal';


// 配置列表列
unitConfig.grid_columns = [
  { title: '出口报关单号', dataIndex: 'ckbgdh', width: 180 },
  { title: '出口日期', dataIndex: 'ckrq1', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' }  },
  { title: '合同号', dataIndex: 'ckhth', width: 180, ellipsis: true },
  { title: '海关商品代码', dataIndex: 'ckspDm', width: 120 },
  { title: '海关商品名称', dataIndex: 'hgspmc', width: 180, ellipsis: true },
  { title: '成交单位', dataIndex: 'sbjldwmc', width: 120 },
  { title: '成交数量', dataIndex: 'sbsl1', width: 120, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '原因说明', dataIndex: 'cwxx', width: 180, ellipsis: true },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  add: false,
  edit: false,
  delete: false,
  upload: false,
  setting: true,
  full: false,
  reload: true,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};

// 配置项：自定义工具栏
unitConfig.customer_toolbar = [
  { name: '导出', key: 'dc', func: 'download' },
];
unitConfig.handle_columns = [];
export default unitConfig;
