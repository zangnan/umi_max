import CONSTANTS from '@/components/DDAssist/constants';
const abgdkjConfig: any = {};

// 配置项
abgdkjConfig.module_key = 'FPZS_BGDKP_DKP18WBGDCX';
abgdkjConfig.export_key='FPZS_BGDKP_DKP18WBGDCX_EXCLE';
abgdkjConfig.api_grid_query = `/yw/fpzs/bgdkp/dkpbgdfycx`;
abgdkjConfig.api_form_delete = `/yw/fpzs/bgdkp/scbgdsj`
abgdkjConfig.grid_show_serial_number = false; // 是否显示序号，可选
abgdkjConfig.grid_row_key = 'bgdhgbh'; // 列表主键，默认uuid
abgdkjConfig.form_save_check = false; // 表单编辑是否执行后端校验
abgdkjConfig.grid_click_checked = '1';
abgdkjConfig.batch_delete_key = 'bgdhgbhs';
abgdkjConfig.grid_title_end = { type: 'function', func: 'gridTitleEndFunc' };

// 配置项：列表列
abgdkjConfig.grid_columns = [
  {
    title: '数据状态',
    dataIndex: 'ckfpkjsjztDm',
    width: 160,
    render: { func: 'renderAbgdkjSjzt' },
    fixed: 'left',
    filter: {
      type: 'Select',
      list: [
        { text: '可以开具发票', value: '1' },
        { text: '缺少购买方信息', value: '2' },
        { text: '缺少税收分类编码', value: '3' },
        { text: '暂不开票', value: '5' },
      ],
    },
  },
  {
    title: '结关状态',
    dataIndex: 'bgsbztDm',
    width: 100,
    fixed: 'left',
    render: { func: 'renderBgsbztDm' },
    filter: {
      type: 'Radio',
      list: [
        { text: '全部', value: '' },
        { text: '已结关', value: '10' },
        { text: '未结关', value: '11' },
      ],
    },
  },
  {
    title: '与台账匹配状态',
    dataIndex: 'ytzppbz',
    width: 140,
    fixed: 'left',
    render: { func: 'renderYtzppbz' },
    filter: {
      type: 'Radio',
      list: [
        { text: '全部', value: '' },
        { text: '已匹配', value: 'Y' },
        { text: '未匹配', value: 'N' },
      ],
    },
  },
  {
    title: '报关单号/统一编号',
    dataIndex: 'bgdhgbh',
    width: 170,
    sorter: true,
    fixed: 'left',
    render: { func: 'renderAgdhgbh' },
  },
  {
    title: '购买方名称',
    dataIndex: 'khuuid',
    width: 180,
    ellipsis: true,
    editable: true,
    showSearch: true,
    editType: 'Select',
    className: 'dd_editable_column',
    func: 'selectChangeGmfmc',
    codeTable: 'CODE_CKFP_ABGDKJ_GMFMC:01'
  },
  { title: '出口日期', dataIndex: 'ckrq1', width: 120, sorter: true },
  { title: '申报日期', dataIndex: 'hgckhwbgdsbrq', width: 120, sorter: true },
  { title: '成交方式', dataIndex: 'hgcjfsmc', width: 100,
    filter: {
      type: 'Select',
      codeTable: 'code_dm_ckts_hgcjfs_mc:01',
    },
  },
  { title: '成交币制', dataIndex: 'hbzmDm', width: 70 },
  { title: '成交金额', dataIndex: 'hjcjzj', width: 100, align: 'right', sorter: true, render: { type: 'number', format: '0,0.00' } },
  { title: '原币离岸价', dataIndex: 'hjcjhblaj', width: 100, align: 'right', sorter: true, render: { type: 'number', format: '0,0.00' } },
  { title: '原币汇率', dataIndex: 'cjhbhl', width: 90, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '人民币成交价', dataIndex: 'hjrmbcjzj', width: 120, align: 'right', sorter: true, render: { type: 'number', format: '0,0.00' } },
  {
    title: '人民币离岸价',
    dataIndex: 'hjrmblaj',
    width: 120,
    align: 'right',
    sorter: true,
    render: { type: 'number', format: '0,0.00' },
  },
  {
    title: '剩余成交金额',
    dataIndex: 'hjsycjzj',
    width: 120,
    align: 'right',
    sorter: true,
    render: { type: 'number', format: '0,0.00' },
  },
  { title: '合同协议号', dataIndex: 'ckhth', ellipsis: true, width: 180, sorter: true },
  { title: '监管方式', dataIndex: 'jgfsmc', width: 120, ellipsis: true, },
];

// 配置项：列表筛选项
abgdkjConfig.filter_items = [
  { name: 'bgdhgbh', label: '18位或后4位报关单号/统一编号', type: 'InputTags' ,tooltip:"可多次输入报关单号进行多张报关单累加筛选。"},
  { name: 'ckhth', label: '合同协议号', type: 'Input' },
  { name: 'ckrq1', label: '出口日期', type: 'DatePicker', range: true },
  { name: 'hgckhwbgdsbrq', label: '申报日期', type: 'DatePicker', range: true },
  { name: 'jgfsDm', label: '监管方式', type: 'Select', showType: '3', showSearch: true, codeTable: 'CODE_DM_CKTS_HGJGFS:01' }
];

// 配置项：工具栏
abgdkjConfig.toolbar_default = {
  setting: true,
  full: true,
  reload: true,
  ckts_download: true,             
  delete: true
};

// 配置项：自定义工具栏
abgdkjConfig.customer_toolbar = [
  { name: '待开票台账导入', key: 'dkptzdr', func: 'dkptzdr' },
  { name: '立即开票', func: 'btnScfpspd' },
  {
    name: '批量设置',
    type: 'dropdown',
    list: [
      { name: '税收分类编码', func: 'btnSetSsflbm' },
      { name: '购买方', func: 'btnSetGmf' },
      { name: '汇率', func: 'btnSetHl' },
      { name: '暂不开票', func: 'zbkp' },
    ],
  },
  { name: '编辑开票', func: 'btnBjkp', key: 'btnBjkpKey' },
  { name: '获取未开票数据', key: 'abgdkjHqbgd', func: 'abgdkjHqbgd' },
  // { name: '导出', func: 'downloadExcel', key: 'export' },
];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
abgdkjConfig.grid_filter_quick = [
  {
    name: 'bgdlx',
    type: 'Select',
    defaultValue: '1',
    eventOnChange: 'handleOnChangeBgd',
    op: 'zdy',
    list: [
      { name: 'aa按18位报关单开票', value: '1' },
      { name: 'bb按21位报关单开票', value: '2' },
    ],
  },
];

abgdkjConfig.handle_columns = [];
export default abgdkjConfig;
