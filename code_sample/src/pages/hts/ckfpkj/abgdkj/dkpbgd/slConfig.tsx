// 按报关单开具 顺络
const slConfig: any = {};

// 配置项
slConfig.unit_key = 'FPZS_BGDKP_DKP21WBGDCX';
slConfig.grid_api_grid_query = `${API_URL_BASE}/yw/fpzs/bgdkp/dkpbgdfycx`;
slConfig.form_api_delete = `${API_URL_BASE}/yw/fpzs/bgdkp/scbgdsj`
slConfig.grid_show_serial_number = false; // 是否显示序号，可选
slConfig.grid_row_key = { type: '1', key: ['ckbgdh', 'ckdh', 'id1'] }; // 列表主键，默认uuid
slConfig.form_save_check = false; // 表单编辑是否执行后端校验
slConfig.click_checked = '1';
slConfig.batch_delete_key = 'bgdhgbhs';

// 配置项：列表列
slConfig.grid_columns = [
  {
    title: '数据状态',
    dataIndex: 'ckfpkjsjztDm',
    width: 150,
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
    width: 160,
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
  { title: '报关单号/统一编号', dataIndex: 'bgdhgbh', width: 170, sorter: true, fixed: 'left', render: { func: 'renderAgdhgbh' }, },
  // { title: '21位出口报关单号', dataIndex: 'ckbgdh', hidden: true },
  { title: '项号', dataIndex: 'hwxh', width: 80, sorter: true, fixed: 'left' },
  { title: '购买方名称',
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
  { title: '出口日期', dataIndex: 'ckrq1', width: 100, sorter: true },
  { title: '申报日期', dataIndex: 'hgckhwbgdsbrq', width: 100, sorter: true },
  { title: '出库单号', dataIndex: 'ckdh', width: 170 },
  { title: '行ID', dataIndex: 'id1', width: 100 },
  { title: '顺络料号', dataIndex: 'sllh', width: 170 },
  { title: '商品代码', dataIndex: 'hgckspDm', width: 120 },
  { title: '海关商品名称', dataIndex: 'hgspmc', width: 150, ellipsis: true },
  { title: '规格型号', dataIndex: 'ggxh', width: 150, ellipsis: true },
  { title: '成交单位', dataIndex: 'sbjldwmc', width: 80 , ellipsis: true },
  { title: '成交单位数量', dataIndex: 'sbsl1', width: 130, render: { type: 'number', format: '0,0.00000' } },
  { title: '法定单位', dataIndex: 'hgjldwmc', width: 80, ellipsis: true },
  { title: '法定单位数量', dataIndex: 'cksl', width: 130, render: { type: 'number', format: '0,0.00000' } },
  { title: '成交方式', dataIndex: 'hgcjfsDm', width: 100 },
  { title: '成交币制', dataIndex: 'hbzmDm', width: 70 },
  { title: '成交金额', dataIndex: 'cjzj', width: 100, align: 'right', sorter: true, render: { type: 'number', format: '0,0.00' } },
  { title: '原币汇率', dataIndex: 'cjhbhl', width: 90, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '人民币成交价', dataIndex: 'rmbcjzj', width: 120, align: 'right', sorter: true, render: { type: 'number', format: '0,0.00' } },
  { title: '人民币离岸价', dataIndex: 'rmblaj', width: 120, align: 'right', sorter: true, render: { type: 'number', format: '0,0.00' } },
  { title: '剩余成交金额', dataIndex: 'sycjzj', width: 120, align: 'right', sorter: true, render: { type: 'number', format: '0,0.00' }},
  { title: '美元成交价', dataIndex: 'mycjzj', width: 120, align: 'right', sorter: true, render: { type: 'number', format: '0,0.00' } },
  { title: '美元离岸价', dataIndex: 'mylaj', width: 120, align: 'right', sorter: true, render: { type: 'number', format: '0,0.00' } },
  { title: '合同协议号', dataIndex: 'ckhth', ellipsis: true, width: 180 },
  { title: '监管方式', dataIndex: 'jgfsmc', width: 120, ellipsis: true, },
  { title: '客户名称', dataIndex: 'khmc', width: 120, ellipsis: true, },
];

// 配置项：列表筛选项
slConfig.filter_items = [
  { name: 'bgdhgbh', label: '18位或后4位报关单号/统一编号', type: 'InputTags' },
  { name: 'ckhth', label: '合同协议号', type: 'Input' },
  { name: 'ckrq1', label: '出口日期', type: 'DatePicker', range: true },
  { name: 'hgckhwbgdsbrq', label: '申报日期', type: 'DatePicker', range: true },
  { name: 'hgckspDm', label: '商品代码', type: 'Input', op: 'al' },
  { name: 'hgspmc', label: '海关商品名称', type: 'Input', op: 'al' },
  { name: 'hgcjfsDm', label: '成交方式', type: 'Input' },
];

// 配置项：工具栏
slConfig.toolbar_default = {
  full: true,
  reload: true,
  delete: false
};

// 配置项：自定义工具栏
slConfig.costomer_toobar = [
  { name: '生成开票申请单', func: 'btnScfpspd' },
  // { name: '编辑开票', func: 'btnBjkp', key: 'btnBjkpKey' },
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
  { name: '删除', key: 'slDelete', func: 'slDelete' },
];

export default slConfig;
