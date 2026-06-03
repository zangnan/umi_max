const abgdkjConfig: any = {};

// 配置项
abgdkjConfig.unit_key = 'FPZS_BGDKP_DKP18WBGDCX';
abgdkjConfig.grid_api_grid_query = `${API_URL_BASE}/yw/fpzs/bgdkp/dkpbgdfycx`;
abgdkjConfig.form_api_delete = `${API_URL_BASE}/yw/fpzs/bgdkp/scbgdsj`
abgdkjConfig.grid_show_serial_number = false; // 是否显示序号，可选
abgdkjConfig.grid_row_key = 'bgdhgbh'; // 列表主键，默认uuid
abgdkjConfig.form_save_check = false; // 表单编辑是否执行后端校验
abgdkjConfig.click_checked = '1';
abgdkjConfig.batch_delete_key = 'bgdhgbhs';

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
        { text: '可以开具发票数据', value: '1' },
        { text: '缺少购买方信息数据', value: '2' },
        { text: '缺少税收分类编码数据', value: '3' },
        { text: '暂不开票数据', value: '5' },
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
    codeTable: ['CODE_CKFP_ABGDKJ_GMFMC', '01']
  },
  { title: '出口日期', dataIndex: 'ckrq1', width: 120, sorter: true },
  { title: '申报日期', dataIndex: 'hgckhwbgdsbrq', width: 120, sorter: true },
  { title: '成交方式', dataIndex: 'hgcjfsmc', width: 100,
    filter: {
      type: 'Select',
      codeTable: ['code_dm_ckts_hgcjfs_mc', '01'],
    },
  },
  { title: '成交币制', dataIndex: 'hbzmDm', width: 70 },
  { title: '成交金额', dataIndex: 'hjcjzj', width: 100, align: 'right', sorter: true, render: { type: 'number', format: '0,0.00' } },
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
  { name: 'bgdhgbh', label: '18位或后4位报关单号/统一编号', type: 'InputTags' },
  { name: 'ckhth', label: '合同协议号', type: 'Input' },
  { name: 'ckrq1', label: '出口日期', type: 'DatePicker', range: true },
  { name: 'hgckhwbgdsbrq', label: '申报日期', type: 'DatePicker', range: true },
  { name: 'jgfsDm', label: '监管方式', type: 'Select', showType: '3', showSearch: true, codeTable: ['CODE_DM_CKTS_HGJGFS', '01'] }
];

// 配置项：工具栏
abgdkjConfig.toolbar_default = {
  setting: true,
  full: true,
  reload: true,
  delete: true
};

// 配置项：自定义工具栏
abgdkjConfig.costomer_toobar = [
  { name: '获取报关单', key: 'abgdkjHqbgd', func: 'abgdkjHqbgd' },
  { name: '生成开票申请单', func: 'btnScfpspd' },
  { name: '编辑开票', func: 'btnBjkp', key: 'btnBjkpKey' },
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
];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
abgdkjConfig.grid_filter_quick = [
  {
    name: 'bgdlx',
    type: 'Select',
    defaultValue: '1',
    onChange: 'handleOnChangeBgd',
    op: 'zdy',
    list: [
      { label: '按18位报关单开票', value: '1', },
      { label: '按21位报关单开票', value: '2' },
    ],
  },
];

export default abgdkjConfig;
