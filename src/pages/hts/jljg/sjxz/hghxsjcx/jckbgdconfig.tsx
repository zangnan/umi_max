import myUtil from '@/components/DDAssist/util';
import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 核销报关单数据
 */
const unitConfig: any = {};

// 配置项
unitConfig.module_key = 'ZXSB_WBSJ_HG_DZKABGD';                                               // 业务单元key，对应后端接口
unitConfig.grid_row_key = 'ywKey';                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.grid_scroll_x = '1450px';
unitConfig.grid_selection_type = 'checkbox';                                               //复选框隐藏
unitConfig.toolbar_show_grid_checked_num = false;                                                 // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.export_key = 'SAAS_SJGL_JMHGSJCX_HGHXBGDSJ_DC';                                               // 业务单元key，对应后端接口
unitConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出


// 配置列表列
unitConfig.grid_columns = [
  { title: '手（账）册号', dataIndex: 'bah', fixed: 'left', width: 215, ellipsis: true, sorter: true },
  {
    title: '进（出）口标识', dataIndex: 'jckbzDm', fixed: 'left', width: 140, codeTable: 'CODE_STATIC_JLJGHX_JCKBZ:01',
    filter: {
      type: 'Radio',
      codeTable: 'CODE_STATIC_JLJGHX_JCKBZ:01',
    },
  },
  { title: '报关单号', dataIndex: 'bgdhgbh', fixed: 'left', width: 180, sorter: true },
  { title: '项号', dataIndex: 'hwxh', fixed: 'left', width: 60, },
  { title: '进（出）口日期', dataIndex: 'ckrq1', width: 130, render: { type: 'date', format: 'YYYY-MM-DD' }, sorter: true, },
  { title: '监管方式代码', dataIndex: 'jgfsDm', width: 130 },
  { title: '监管方式名称', dataIndex: 'jgfsmc', width: 130,ellipsis: true, render: (text: any, record: any) => myUtil.code.getCodeValByKey(record.jgfsDm, 'CODE_DM_CKTS_HGJGFS:01')},
  { title: '成交币制', dataIndex: 'cjhghbszDm', width: 100,
    filter: {
      type: 'Select',
      codeTable: 'code_dm_gy_hb:01',
    }
  },
  { title: '成交币制名称', dataIndex: 'cjhbmc', width: 100,ellipsis: true },
  { title: '成交金额', dataIndex: 'cjzj', width: 125, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '美元金额', dataIndex: 'tjmyj', width: 125, align: 'right', titleTooltip: '进（出）口标识为进口，美元金额为进口美元到岸价；{br}进（出）口标识为出口，美元金额为出口美元离岸价。', render: { type: 'number', format: '0,0.00' } },
  { title: '人民币金额', dataIndex: 'tjrmbj', width: 125, align: 'right', titleTooltip: '进（出）口标识为进口，人民币金额为进口人民币到岸价；{br}进（出）口标识为出口，人民币金额为出口人民币离岸价', render: { type: 'number', format: '0,0.00' } },
  { title: '出口合同号', dataIndex: 'ckhth', width: 120, sorter: true, },
  { title: '商品代码', dataIndex: 'hgckspDm', width: 110, ellipsis: true, },
  { title: '海关商品名称', dataIndex: 'hgspmc', width: 180, ellipsis: true, },
  { title: '规格型号', dataIndex: 'ggxh', ellipsis: true, width: 140, },
  { title: '成交单位', dataIndex: 'sbjldwDm', width: 80, codeTable: 'CODE_DM_CKTS_HGJLDW:01'},
  { title: '成交数量', dataIndex: 'sbsl1', width: 115, render: { type: 'number', format: '0,0.00000' },  },
  {
    title: '运输方式', dataIndex: 'ysfsDm', width: 120, codeTable: 'CODE_DM_CKTS_HGYSFS:01', ellipsis: true,
    filter: {
      type: 'Select',
      codeTable: 'CODE_DM_CKTS_HGYSFS:01',
    },
  },
  {
    title: '成交方式', dataIndex: 'hgcjfsDm', width: 115,codeTable: 'CODE_DM_CKTS_HGCJFS:01', ellipsis: true,
    filter: {
      type: 'Select',
      codeTable: 'CODE_DM_CKTS_HGCJFS:01',
    },
  },
  { title: '法定单位', dataIndex: 'dyjldwDm', width: 80, codeTable: 'CODE_DM_CKTS_HGJLDW:01'},
  { title: '法定单位数量', dataIndex: 'cksl', width: 115,  render: { type: 'number', format: '0,0.00000' }, },
  { title: '第二单位', dataIndex: 'dejldwDm', width: 80, codeTable: 'CODE_DM_CKTS_HGJLDW:01'},
  { title: '第二单位数量', dataIndex: 'decksl', width: 115,  render: { type: 'number', format: '0,0.00000' }, },
  {
    title: '进（出）境口岸', dataIndex: 'sbhggqkajc', width: 140
  },
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'bah', label: '手（账）册号', type: 'Input' },
  { name: 'bgdhgbh', label: '报关单号', type: 'Input' },
  { name: 'ckhth', label: '出口合同号', type: 'Input' },
  { name: 'hgckspDm', label: '商品代码', type: 'Input' },
  { name: 'jgfsDm', label: '监管方式代码', type: 'Select', showType: '3',showSearch: true, codeTable: 'CODE_DM_CKTS_HGJGFS:01' }
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  download: false,
  download: true,
  full: true,
  reload: true,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};

// 配置项：自定义工具栏
unitConfig.customer_toolbar= [
  // { name: '计算美元金额', key: 'hghxsjcxBgdJstjmyj', func: 'handleBgdJstjmyj'},
  { name: '打印', key: 'hghxsjcxJckBgdDy', func: 'handleHgbgdDy'}
];

unitConfig.handle_columns = [];
export default unitConfig;
