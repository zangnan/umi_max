
/**
 * title: 单位管理
 * author: wxl
 */
const dwConfig: any = {};

// 配置项
dwConfig.unit_key = 'CKTS_MTS_ZNPD_DWGL_CX';
dwConfig.form_title = '单位管理';                                                // 新建标题，可选
dwConfig.form_api_save = `${API_URL_BASE}/saas/pzgl/znpdpzgl/dwglSave`;
dwConfig.form_api_save_upload = `${API_URL_BASE}/saas/pzgl/znpdpzgl/dwglUpdate`;
dwConfig.form_api_delete = `${API_URL_BASE}/saas/pzgl/znpdpzgl/dwglDelete`;
dwConfig.grid_show_serial_number = true;                                            // 是否显示序号，可选，默认不显示
dwConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
dwConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
dwConfig.click_checked = '1';
dwConfig.import_key = 'PZGL_ZDPDPZGL_DWGL_DR';
dwConfig.export_key = 'PZGL_ZDPDPZGL_DWGL_DC';
dwConfig.layout_type = 'tabs';
dwConfig.pagination2 = false;

// 配置列表列
dwConfig.grid_columns = [
  { title: '发票单位', dataIndex: 'jldwmc', width: 180, ellipsis: true, },
  { title: '报关单位', dataIndex: 'hgjldwmc', width: 180, ellipsis: true },
  { title: '操作', dataIndex: 'yxbz', align: 'right', fixed: 'right', render: { func: 'renderqybz' } },
];

// 配置项：表单项
dwConfig.form_items = [
  { label: 'id', type: 'Hidden', name: 'sbqyuuid' },
  { label: '单位uuid', type: 'Hidden', name: 'uuid' },
  { label: '发票单位', type: 'Input', name: 'jldwmc', rules: [
    { type: 'base_required' },
    { type: 'base_string', range: 300 },
  ] },
  { label: '报关单位', type: 'Input', name: 'hgjldwmc', rules: [
    { type: 'base_required' },
    { type: 'base_string', range: 75 },
  ] },
];

// 配置项：工具栏
dwConfig.toolbar_default = {
  setting: true,
  add: true,
  edit: true,
  full: true,
  reload: true,
  upload: true,
  delete: true,
  tssb_download: true,
};

export default dwConfig;