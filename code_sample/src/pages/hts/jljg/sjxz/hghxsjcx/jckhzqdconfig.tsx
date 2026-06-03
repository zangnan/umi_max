import { itemType } from '@/components/DDForm/data.d';
import myUtil from '@/pages/common/myUtil';

/**
 * title: 保税核注清单数据
 */
const unitConfig: any = {};

// 配置项
unitConfig.unit_key = 'ZXSB_WBSJ_DY_SZCHZQDMX';                                         // 业务单元key，对应后端接口
unitConfig.grid_row_key = 'ywKey';                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.grid_scroll_x = '1450px';
unitConfig.grid_selection_type = 'checkbox';                                               //复选框隐藏
unitConfig.grid_show_data_num = false;                                                 // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.export_key = 'SAAS_SJGL_JMHGSJCX_HGBSHZQDSJ_DC';                                         // 业务单元key，对应后端接口
unitConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出

// 配置列表列
unitConfig.grid_columns = [
  { title: '手（账）册号', dataIndex: 'bah', fixed: 'left', width: 215, ellipsis: true, sorter: true},
  { title: '进（出）口标识', dataIndex: 'jckbzDm', fixed: 'left', width: 140, codeTable: ['CODE_DM_ZXSB_JCKBZ', '01'],
    filter: {
      type: 'Radio',
      codeTable: ['CODE_DM_ZXSB_JCKBZ', '01'],
    },
  },
  { title: '清单编号', dataIndex: 'qdbh', fixed: 'left', width: 180, sorter: true },
  { title: '清单序号', dataIndex: 'qdxh', fixed: 'left', width: 80, },
  { title: '对应报关单编号', dataIndex: 'dybgdhgbh', width: 180, sorter: true,},
  { title: '报关单商品序号', dataIndex: 'hwxh', width: 120, },
  { title: '清单申报日期', dataIndex: 'sbrq1', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' }, sorter: true, },
  { title: '监管方式代码', dataIndex: 'jgfsDm', width: 130 },
  { title: '监管方式名称', dataIndex: 'jgfsmc', width: 130, ellipsis: true, render: (text: any, record: any) => myUtil.code.getCodeValByKey(record.jgfsDm, 'CODE_DM_CKTS_HGJGFS', '01')},
  { title: '币制', dataIndex: 'cjhghbszDm',  width: 80,
    filter: {
      type: 'Select',
      codeTable: ['code_dm_gy_hb', '01'],
    }
  },
  { title: '币制名称', dataIndex: 'hbmc', width: 80, ellipsis: true},
  { title: '企业申报总价', dataIndex: 'cjzj', width: 125, align: 'right', render: { type: 'number', format: '0,0.00' }},
  { title: '美元金额', dataIndex: 'mylaj', width: 125, align: 'right', titleTooltip: '进（出）口标识为进口，美元金额为进口美元到岸价；{br}进（出）口标识为出口，美元金额为出口美元离岸价。', render: { type: 'number', format: '0,0.00' }},
  { title: '人民币金额', dataIndex: 'rmblaj', width: 125, align: 'right', titleTooltip: '进（出）口标识为进口，人民币金额为进口人民币到岸价；{br}进（出）口标识为出口，人民币金额为出口人民币离岸价', render: { type: 'number', format: '0,0.00' }},
  { title: '商品代码', dataIndex: 'ckspDm', width: 110, },
  { title: '商品名称', dataIndex: 'hgspmc', width: 180, ellipsis: true, },
  { title: '规格型号', dataIndex: 'ggxh', width: 140, ellipsis: true, },
  { title: '申报计量单位', dataIndex: 'sbjldwDm', width: 110, codeTable: ['CODE_DM_CKTS_HGJLDW', '01']},
  { title: '申报数量', dataIndex: 'bcsbsl', width: 115, render: { type: 'number', format: '0,0.00000' } },
  { title: '法定计量单位', dataIndex: 'dyjldwDm', width: 110, codeTable: ['CODE_DM_CKTS_HGJLDW', '01']},
  { title: '法定数量', dataIndex: 'cksl', width: 115,  render: { type: 'number', format: '0,0.00000' }, },
  { title: '法定第二计量单位', dataIndex: 'dejldwDm', width: 130, codeTable: ['CODE_DM_CKTS_HGJLDW', '01']},
  { title: '第二法定数量', dataIndex: 'decksl', width: 115,  render: { type: 'number', format: '0,0.00000' }, },
  // 20250328 小工具暂时无法提供运输方式，暂时注释
  // { title: '运输方式', dataIndex: 'ysfsDm', width: 100,codeTable: ['CODE_DM_CKTS_HGYSFS', '01'],ellipsis: true,
  //   filter: {
  //     type: 'Select',
  //     codeTable: ['CODE_DM_CKTS_HGYSFS', '01'],
  //   },
  // },
  { title: '进（出）境关别', dataIndex: 'hggqkamc', width: 140},
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'bah', label: '手（账）册号', type: itemType.Input },
  { name: 'qdbh', label: '清单编号', type: itemType.Input },
  { name: 'dybgdhgbh', label: '对应报关单编号', type: itemType.Input },
  { name: 'ckspDm', label: '商品代码', type: itemType.Input },
  { name: 'jgfsDm', label: '监管方式代码', type: itemType.Select, showType: '3',showSearch: true, codeTable: ['CODE_DM_CKTS_HGJGFS', '01'] }
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  download: false,
  tssb_download: true,
  full: true,
  reload: true,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};

// 配置项：自定义工具栏
unitConfig.costomer_toobar= [
  // { name: '计算美元金额', key: 'hghxsjcxHzqdJstjmyj', func: 'handleHzqdJstjmyj'},
  { name: '打印', key: 'hghxsjcxJckhzqdDy', func: 'handleHghzqdDy'}
];

export default unitConfig;
