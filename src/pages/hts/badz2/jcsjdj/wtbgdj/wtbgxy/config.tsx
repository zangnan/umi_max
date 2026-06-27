import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 委托报关协议采集
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '委托报关协议';
unitConfig.form_title = '委托报关协议';
unitConfig.api_grid_query = `/yw/badze/wtbgxy/queryPageWtbgxy`;   // api 列表查询
// unitConfig.api_form_delete = `/yw/badze/wtbgxy/deleteWtbgxyByIds`      // api 列表删除
unitConfig.form_api_show=`/yw/badze/wtbgxy/queryWtbgxyForm`;            // api 表单查询
unitConfig.api_form_edit=`/yw/badze/wtbgxy/saveOrUpdateWtbgxy`;                // api 表单更新
unitConfig.form_api_save_upload=`/yw/badze/wtbgxy/saveOrUpdateWtbgxy`;                // api 表单更新
// unitConfig.form_api_check=`/yw/badze/gtgn/checkDateUnique`;             // api 表单校验
unitConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.grid_scroll_x = '1450px';
unitConfig.grid_selection_type = 'checkbox';                                               //复选框隐藏
unitConfig.toolbar_show_grid_checked_num = false;                                                 // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.grid_api_import = `/yw/badze/sjdr/importExcel`;
unitConfig.grid_api_templateUrl = '/yw/badze/sjdr/downloadBadzTemplateGet';
unitConfig.import_key = 'ZXSB_BADZBASE_WTBGXY';
unitConfig.exprotMsg = ' ';
unitConfig.gridParams = {
  initSearchModal: [
    { property: 'pageLb', value: true, op: 'al' },
  ],
}


// 配置列表列
unitConfig.grid_columns = [
  { title: '业务编号', dataIndex: 'ywbh', width: 160, ellipsis: true },
  { title: '协议编号', dataIndex: 'xybh', width: 120, ellipsis: true },
  { title: '协议类型', dataIndex: 'xylxDm', width: 120, codeTable: 'code_static_badz_wtbgxy_xylx_dm:01' , ellipsis: true,filter: {
    type: 'Select',
    codeTable: 'code_static_badz_wtbgxy_xylx_dm:01'
  }},
  { title: '委托方名称', dataIndex: 'jfmc', width: 120, ellipsis: true },
  { title: '受托方名称', dataIndex: 'yfmc', width: 120, ellipsis: true },
  { title: '签订日期', dataIndex: 'qdrq', width: 115, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '数据来源', dataIndex: 'sjlyDm', width: 120, codeTable: 'code_static_badz_sjly_dm:01' , ellipsis: true,filter: {
    type: 'Select',
    codeTable: 'code_static_badz_sjly_dm:01'
  }},
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
  { label: '协议编号', name: 'xybh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 90] }, { func: 'xybh' }] },
  { label: '协议类型', name: 'xylxDm', type: 'Select', rules: [ { type: 'base_required' } ], codeTable: 'code_static_badz_wtbgxy_xylx_dm:01' },
  { label: '签订日期', name: 'qdrq', type: 'DatePicker', format: 'YYYY-MM-DD' },
  { label: '委托方名称', name: 'jfmc', type: 'Input', rules: [{ type: 'base_string', range: [0, 90] }] },
  { label: '受托方名称', name: 'yfmc', type: 'Input', rules: [{ type: 'base_string', range: [0, 90] }] },
  { label: '附件资料', name: 'fjzl', type: 'GroupTitle' },
  { label: '上传附列资料', name: 'wjnrstring', fileName: 'wjm', type: 'Upload', tooltip: '支持上传PDF/JPG/PNG/JPEG格式文件且大小不应超过10M', rules: [{ type: 'base_required' }] },
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'ywbh', label: '业务编号', type: 'Input' },
  { name: 'xybh', label: '协议编号', type: 'Input' },
  { name: 'jfmc', label: '委托方名称', type: 'Input' },
  { name: 'yfmc', label: '受托方名称', type: 'Input' },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  add: true,
  edit: true,
  // delete: true,
  upload: true,
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
unitConfig.customer_toolbar = [
  { name: '批量下载', key: 'download', func: 'plxz' },
  { name: '删除', func: 'del' },
];

// 配置项：自定义操作列
unitConfig.handle_columns = [
  { name: '预览', key: 'yl', func: 'handleColumnsYl', display: 'ylDisplay' },
  { name: '上传附件', key: 'scfj', func: 'handleColumnsScfj', display: 'scfjDisplay' },
];
export default unitConfig;
