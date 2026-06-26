import myUtil from '@/components/DDAssist/util';
import CONSTANTS from '@/components/DDAssist/constants';
import { itemType } from '@/components/DDForm/data.d';
/**
 * title: 加贸反馈数据查询-已核销报关单数据
 */
const unitConfig: any = {};

// 配置项
unitConfig.module_key = 'JLJG_ZXSB_SB_HXBGD_F';                                         // 业务单元key，对应后端接口
unitConfig.grid_show_serial_number = false;                                            // 是否显示序号，可选，默认不显示
unitConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.grid_scroll_x = '1450px';
unitConfig.grid_selection_type = false;                                               //复选框隐藏
unitConfig.toolbar_show_grid_checked_num = false;                                              // 工具栏左侧是否显示数据条数及选中数，默认显示
unitConfig.export_key = 'SAAS_SJGL_JMFKSJCX_SWYHXBGDSJ_DC';
unitConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出

// 配置列表列
unitConfig.grid_columns = [
  { title: '手（账）册号', dataIndex: 'bah', fixed: 'left', width: 215, ellipsis: true, align: 'left', },
  {
    title: '进（出）口标识',dataIndex: 'jckbzDm', width: 140, align: 'left', fixed: 'left', codeTable: 'CODE_STATIC_JLJGHX_JCKBZ:01',
    filter: {
      type: 'Radio',
      codeTable: 'CODE_STATIC_JLJGHX_JCKBZ:01',
    },
  },
  { title: '报关单号', dataIndex: 'ckbgdh', fixed: 'left', width: 190, align: 'left', sorter: true },
  { title: '进（出）口日期', dataIndex: 'ckrq1', width: 140, align: 'left', render: { type: 'date', format: 'YYYY-MM-DD' }, sorter: true },
  { title: '申报日期', dataIndex: 'tbrq1', width: 140, align: 'left', render: { type: 'date', format: 'YYYY-MM-DD' }, sorter: true },
  {
    title: '申报口岸', dataIndex: 'hggqkaDm', width: 130, align: 'left',codeTable: 'CODE_DM_GY_HGGQKA:01'
  },
  { title: '监管方式代码', dataIndex: 'jgfsDm', width: 130, align: 'left'},
  {
    title: '监管方式名称', dataIndex: 'jgfsmc', width: 160, align: 'left', render: (text: any, record: any) => myUtil.code.getCodeValByKey(record.jgfsDm, 'CODE_DM_CKTS_HGJGFS:01'), ellipsis: true
  },
  { title: '商品代码', dataIndex: 'ckspDm', width: 100, align: 'left', },
  { title: '数量', dataIndex: 'sl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' }},
  { title: '第一计量单位', dataIndex: 'jldwDm', width: 120, codeTable: 'code_dm_ckts_hgjldw:01'},
  { title: '统计美元价', dataIndex: 'mylaj', width: 100, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '统计人民币价', dataIndex: 'rmblaj', width: 140, align: 'right',  render: { type: 'number', format: '0,0.00' } },
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'bah', label: '手（账）册号', type: itemType.Input },
  { name: 'ckbgdh', label: '报关单号', type: itemType.Input },
  { name: 'ckspDm', label: '商品代码', type: itemType.Input },
  { name: 'hggqkaDm', label: '申报口岸代码', type: itemType.Select, showType: '3',showSearch: true, codeTable: 'CODE_DM_GY_HGGQKA:01' },
  { name: 'jgfsDm', label: '监管方式代码', type: itemType.Select, showType: '3',showSearch: true, codeTable: 'CODE_DM_CKTS_HGJGFS:01' },
];


// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  download:  false,
  download: true,
  reload: true,
  full: true,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};

// unitConfig.customer_toolbar= [
//   { name: '打印', key: 'jmfksjcxJckBgdDy', func: 'handleJmbgdDy'}
// ];

unitConfig.handle_columns = [];
export default unitConfig;
