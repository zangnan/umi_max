/**
 * title: 其他单证
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '其他单证';
unitConfig.form_title = '其他单证';
unitConfig.grid_api_grid_query = `${API_URL_BASE}/yw/badze/qtdz/queryPageQtdz`;   // api 列表查询
// unitConfig.form_api_delete = `${API_URL_BASE}/yw/badze/qtdz/deleteQtdzByIds`      // api 列表删除
unitConfig.form_api_show=`${API_URL_BASE}/yw/badze/qtdz/queryQtdzForm`;            // api 表单查询
unitConfig.form_api_save=`${API_URL_BASE}/yw/badze/qtdz/saveOrUpdateQtdz`;                // api 表单更新
unitConfig.form_api_save_upload=`${API_URL_BASE}/yw/badze/qtdz/saveOrUpdateQtdz`;                // api 表单更新
unitConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.grid_scroll_x = '1450px';
unitConfig.grid_selection_type = 'checkbox';                                               //复选框隐藏
unitConfig.grid_show_data_num = false;                                             // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.gridParams = {
  initSearchModal: [
    { property: 'pageLb', value: true, op: 'al' },
  ],
}


// 配置列表列
unitConfig.grid_columns = [
  { title: '业务编号', dataIndex: 'ywbh', width: 160, ellipsis: true },
  { title: '单证类型', dataIndex: 'qtdzlx', width: 120, codeTable: ['url_badz_qtdz_dzlx',  '01'] , ellipsis: true,filter: {
    type: 'Select',
    codeTable: ['url_badz_qtdz_dzlx', '01']
  } },
  { title: '单证编号', dataIndex: 'dzbh', width: 120 },
  { title: '数据来源', dataIndex: 'sjlyDm', width: 120, codeTable: ['code_static_badz_sjly_dm',  '01'] , ellipsis: true,filter: {
    type: 'Select',
    codeTable: ['code_static_badz_sjly_dm', '01']
  }},
  { title: '文件名称', dataIndex: 'wjmc', width: 120, ellipsis: true },
  { title: '上传时间', dataIndex: 'scsj', width: 115, render: { type: 'date', format: 'yyyy-MM-DD' } },
  { title: '关联关系', dataIndex: 'glgx', width: 100, fixed: 'right', render: { func: 'renderGlgx' } },
  { title: '是否装订成册', dataIndex: 'sfzdcc', width: 100, fixed: 'right', align: 'center', render: { 
      icon: [
        { value: 'Y', icon: 'CheckOutlined', color: 'success', isShowText: false },
        { value: 'N', icon: 'CloseOutlined', color: 'error', isShowText: false },
        { value: '', icon: 'CloseOutlined', color: 'error', isShowText: false },
      ]
    }
  },
];
// 配置项：表单项
unitConfig.form_items = [
  { label: 'uuid', type: 'Hidden', name: 'uuid' },
  { label: '采集信息', name: 'cjxx', type: 'GroupTitle' },
  { label: '业务编号', name: 'ywbh', type: 'Input', rules: [{ type: 'base_string', range: [0, 90] }] },
  { label: '单证类型', name: 'qtdzlx', type: 'AutoComplete', showType: '3', 'allowClear': true, codeTable: ['url_badz_qtdz_dzlx', '01'], rules: [{ type: 'base_required' }] },
  { label: '单证编号', name: 'dzbh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 90] }] },
  { label: '文件名称', name: 'wjmc', type: 'Input', rules: [{ type: 'base_string', range: [0, 150] }] },
  { label: 'ST', name: 'st', type: 'Blank' },
  { label: '备注', name: 'bz', type: 'TextArea', rules: [{ type: 'base_string', range: [0, 150] }], autoSize: { minRows: 2, maxRows: 2}, layout: { label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3}, formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 } }},
  { label: '附件资料', name: 'fjzl', type: 'GroupTitle' },
  { label: '上传附列资料', name: 'wjnrstring', fileName: 'wjm', type: 'Upload', tooltip: '支持上传PDF/JPG/PNG/JPEG格式文件且大小不应超过10M', rules: [{ type: 'base_required' }] },
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  // { name: 'sjlyDm', label: '数据来源', type: 'Select', showSearch: true, codeTable: ['code_static_badz_sjly_dm',  '01'] },
  { name: 'ywbh', label: '业务编号', type: 'Input' },
  { name: 'dzbh', label: '单证编号', type: 'Input' },
  { name: 'sfscfj', label: '是否上传附件', type: 'Select', showSearch: true, codeTable: ['code_static_badz_sfscfj_dm',  '01'] },
  { name: 'wjmc', label: '文件名称', type: 'Input' },
  { name: 'scsj', label: '上传时间', type: 'DatePicker', range: true, format: 'YYYY-MM-DD' },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  add: true,
  edit: true,
  // delete: true,
  upload: false,
  setting: true,
  full: true,
  reload: true,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};
// 配置项：自定义工具栏
unitConfig.costomer_toobar = [
  { name: '批量下载', key: 'download', func: 'plxz' },
  { name: '删除', func: 'del' },
];
// 配置项：自定义操作列
unitConfig.handle_columns = [
  { name: '预览', key: 'yl', func: 'handleColumnsYl', display: 'ylDisplay' },
  { name: '上传附件', key: 'scfj', func: 'handleColumnsScfj', display: 'scfjDisplay' },
];
export default unitConfig;
