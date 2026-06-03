/**
 * title: 出口货物报关单管理
 */
import { itemType } from '@/components/DDForm/data.d';
import myUtil from '@/pages/common/myUtil';
import columnsRender from '@/pages/common/field/eventColRender';
// import eventOnBlur from '../../common/field/eventOnBlur';
// import eventOnChange from '../../common/field/eventOnChange';
// import validator from './validator';

const unitConfig: any = {};
unitConfig.unit_key = 'EXAMPLE_DATA_PAGE_1';                                       // 业务单元key，对应后端接口
unitConfig.page_id = 'example_list_1';                                                // 页面id
unitConfig.grid_title = '报关单';                                                      // 列表标题，可选  【废弃】
unitConfig.form_title = '报关单';
unitConfig.grid_show_serial_number = true;                                            // 是否显示序号，默认不显示
unitConfig.grid_selection_type = 'checkbox';                                          // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
unitConfig.grid_show_data_num = false;                                                 // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.show_toolbar = true;
// 配置列表列
unitConfig.gridColumns = [
  { title: '报关单号', dataIndex: 'ckbgdh', width: 180, align: 'left', fixed: 'left', sorter: true, render: (text: any, record: any) => columnsRender.renderCkbgdh(text, record) },
  { title: '项号', dataIndex: 'xh4', width: 60, align: 'center', fixed: 'left' },
  { title: '出口日期', dataIndex: 'ckrq1', width: 120, align: 'center', sorter: true, render: (text: any) => myUtil.grid.formatDate(text, 'yyyy-MM-DD') },
  { title: '数据检查状态', dataIndex: 'cytgbz', width: 135, align: 'center', sorter: true, render: (text: any) => columnsRender.renderCytgbz(text) },
  { title: '征免类型', dataIndex: 'zmlx', width: 95, align: 'center', render: (text: any) => columnsRender.renderZmlx(text) },
  { title: '申报业务', dataIndex: 'sbyw', width: 95, align: 'center', render: (text: any) => columnsRender.renderSbyw(text) },
  { title: '商品代码', dataIndex: 'ckspDm', width: 95, align: 'center' },
  { title: '商品名称', dataIndex: 'ckspmc', width: 180, align: 'left' },
  { title: '海关商品名称', dataIndex: 'hgspmc', width: 180, align: 'left' },
  { title: '出口合同号', dataIndex: 'ckhth', width: 115, align: 'left' },
  { title: '监管方式', dataIndex: 'jgfsDm', width: 135, align: 'left', sorter: true, codeTable: ['code_dm_ckts_hgjgfs', '01'] },
  { title: '成交方式', dataIndex: 'hgcjfsmc', width: 85, align: 'center' },
  { title: '成交单位', dataIndex: 'hgjldwmc', width: 90, align: 'center', ellipsis: true },
  { title: '成交数量', dataIndex: 'cjsl1', width: 140, align: 'right', render: (text: any) => myUtil.grid.formatNum(text, '0,0.0000') },
  { title: '成交币制', dataIndex: 'cjhghbzmDm', width: 85, align: 'center' },
  { title: '成交金额', dataIndex: 'cjzj', width: 140, align: 'right', render: (text: any) => myUtil.grid.formatNum(text, '0,0.00') },
  { title: '美元离岸价', dataIndex: 'mylaj', width: 140, align: 'right', render: (text: any) => myUtil.grid.formatNum(text, '0,0.00') },
  { title: '法定单位', dataIndex: 'dyjldwDm', width: 90, align: 'center', codeTable: ['code_dm_ckts_hgjldw', '01'], ellipsis: true },
  { title: '法定单位数量', dataIndex: 'cksl', width: 140, align: 'right', render: (text: any) => myUtil.grid.formatNum(text, '0,0.0000') },
  { title: '第二单位', dataIndex: 'dejldwDm', width: 90, align: 'center', codeTable: ['code_dm_ckts_hgjldw', '01'], ellipsis: true },
  { title: '第二单位数量', dataIndex: 'decksl', width: 140, align: 'right', render: (text: any) => myUtil.grid.formatNum(text, '0,0.0000') },
];

// 筛选项
unitConfig.filterItems = [
  { name: 'sbyw', label: '申报业务', type: itemType.Select, codeTable: ['code_static_bgd_sbyw_dm', '01'] },
  { name: 'sybz', label: '生成状态', type: itemType.Select, codeTable: ['code_static_bgd_zt_dm', '01'] },
  { name: 'zmlx', label: '征免类型', type: itemType.Select, codeTable: ['code_static_bgd_zmlx_dm', '01'] },
  { name: 'czbz1', label: '关单信息', type: itemType.Select, codeTable: ['code_static_bgd_gdxx_dm', '01'] },
  { name: 'ckhth', label: '出口合同号', type: itemType.Input, },
  { name: 'ckrq1', label: '出口日期', type: itemType.DatePicker, },
  { name: 'ckbgdh', label: '报关单号', type: itemType.Input, },
  { name: 'jgfsDm', label: '监管方式', type: itemType.Input, },
  { name: 'cytgbz', label: '数据检查状态', type: itemType.Select, codeTable: ['code_static_bgd_cytgbz_dm', '01'] },
];

// 表单项
unitConfig.formItems = [
  { label: 'ID', type: itemType.Hidden, name: 'uuid' },
  { label: '基本信息', type: itemType.GroupTitle, name: 'jbxx' },
  { label: '报关单号', type: itemType.Input, name: 'ckbgdh' },
  { label: '出口日期', type: itemType.DatePicker, name: 'ckrq1', format: 'YYYY-MM-DD' },
  { label: '出口合同号', type: itemType.Input, name: 'ckhth' },
  { label: '核销单号', type: itemType.Input, name: 'hxdh' },
  { label: '运输工具名称', type: itemType.Input, name: 'ysgjmc' },
  { label: '监管方式代码', type: itemType.Input, name: 'jgfsDm' },
  { label: '海关成交方式', type: itemType.Select, name: 'hgcjfsmc', codeTable: ['code_static_hgcjfs_mc', '01'] },
  { label: '成交海关货币字母代码', type: itemType.Input, name: 'cjhghbzmDm' },
  { label: '成交总价', type: itemType.InputNumber, name: 'cjzj', format: (value: any) => myUtil.text.formatNum(value, '0,0.00') },
  { label: '运费海关货币字母代码', type: itemType.Input, name: 'yfhghbzmDm' },
  { label: '运费金额', type: itemType.InputNumber, name: 'yfje', format: (value: any) => myUtil.text.formatNum(value, '0,0.00') },
  { label: '运费计算方式代码', type: itemType.Select, name: 'yfjsfsDm', codeTable: ['code_dm_ckts_hgyfjsfs', '01'] },
  { label: '运费折算数量', type: itemType.InputNumber, name: 'yfzssl', format: (value: any) => myUtil.text.formatNum(value, '0,0.0000') },
  { label: '保费海关货币字母代码', type: itemType.Input, name: 'bfhghbzmDm' },
  { label: '保费金额', type: itemType.InputNumber, name: 'bfje', format: (value: any) => myUtil.text.formatNum(value, '0,0.00') },
  { label: '保费计算方式代码', type: itemType.Select, name: 'bfjsfsDm', codeTable: ['code_dm_ckts_hgbfjsfs', '01'] },
  { label: '杂费海关货币字母代码', type: itemType.Input, name: 'zfhghbzmDm' },
  { label: '杂费金额', type: itemType.InputNumber, name: 'zfje1', format: (value: any) => myUtil.text.formatNum(value, '0,0.00') },
  { label: '杂费计算方式代码', type: itemType.Select, name: 'zfjsfsDm', codeTable: ['code_dm_ckts_hgzfjsfs', '01'] },
  { label: '商品信息', type: itemType.GroupTitle, name: 'spxx' },
  { label: '出口商品代码', type: itemType.Input, name: 'ckspDm' },
  { label: '出口商品名称', type: itemType.Input, name: 'ckspmc', readOnly: true },
  { label: '海关商品名称', type: itemType.Input, name: 'hgspmc' },
  { label: '成交计量单位', type: itemType.Input, name: 'hgjldwmc' },
  { label: '成交数量', type: itemType.InputNumber, name: 'cjsl1', format: (value: any) => myUtil.text.formatNum(value, '0,0.0000') },
  { label: '法定计量单位', type: itemType.Input, name: 'dyjldwDm' },
  { label: '法定数量', type: itemType.InputNumber, name: 'cksl', format: (value: any) => myUtil.text.formatNum(value, '0,0.0000') },
  { label: '第二计量单位', type: itemType.Input, name: 'dejldwDm' },
  { label: '第二出口数量', type: itemType.InputNumber, name: 'decksl', format: (value: any) => myUtil.text.formatNum(value, '0,0.0000') },
  { label: '规格型号', type: itemType.Input, name: 'ggxh' },
  { label: '数据检查标志', type: itemType.Hidden, name: 'cytgbz' },
];

export default unitConfig;