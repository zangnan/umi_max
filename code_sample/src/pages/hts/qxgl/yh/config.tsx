/**
 * title: 用户管理
 * author: wx
 */
const unitConfig: any = {};

// 配置项
unitConfig.page_id = 'hts_qxgl_yh';
// unitConfig.unit_key = 'hts_qxgl_yh';
unitConfig.grid_api_grid_query = `${API_URL_BASE}/yw/dditSaas/qxyh/queryYhPager`;
unitConfig.form_api_delete = `${API_URL_BASE}/yw/dditSaas/qxyh/deleteYh`;
unitConfig.grid_show_serial_number = false; // 是否显示序号，可选
unitConfig.grid_row_key = 'yhuuid1Dqlb'; // 列表主键，默认uuid
unitConfig.form_save_check = false; // 表单编辑是否执行后端校验
unitConfig.click_checked = '1';
unitConfig.batch_delete_key = 'yhuuid1s';
unitConfig.grid_scroll_x = '900px';                                                   // 默认700px
// unitConfig.module_type = 'sjbb';



// 配置项：列表列
unitConfig.grid_columns = [
  { title: '登录账号', dataIndex: 'yddh', width: 140, ellipsis: true , fixed: 'left'},
  { title: '姓名', dataIndex: 'xm', width: 140, ellipsis: true , fixed: 'left'},
  { title: '证件号', dataIndex: 'sfzjhm', width: 140, ellipsis: true },
  { title: '用户类型', dataIndex: 'yhlxDm', width: 80, codeTable: ['code_dm_gy_yhlx', '01'],  filter: {
    type: 'Select',
    codeTable: ['code_dm_gy_yhlx', '01'],
  } },
  { title: '角色名称', dataIndex: 'jsmc',width: 140, ellipsis: true },
  {
    title: '有效标志', dataIndex: 'yxbz', width: 100, codeTable: ['code_static_yes_no', '01'], filter: {
      type: 'Select',
      codeTable: ['code_static_yes_no', '01']
    },
  },
  { title: '关联用户数', dataIndex: 'glyhs', width: 100, align: 'right' , render: { func: 'renderGlyh' } },
  { title: '关联企业数', dataIndex: 'glqys', width: 100, align: 'right' , render: { func: 'renderGlqy' } },

  // { title: '用户来源', dataIndex: 'yhly', width: 140, ellipsis: true, hidden: true },
  // { title: '渠道名称', dataIndex: 'qdmc', width: 140, ellipsis: true, hidden: true },
  // { title: '启用停用', dataIndex: 'yxbz', width: 80, render: { func: 'renderYxbz' } },
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'yddh', label: '登录账号', type: 'Input' },
  { name: 'xm', label: '姓名', type: 'Input' },
  // { name: 'sfzjhm', label: '用户类型', type: 'Select' , codeTable: ['code_dm_gy_yhlx', '01'] },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  full: true,
  reload: true,
  delete: false,
};

// 配置项：自定义工具栏
// unitConfig.costomer_toobar = [
//   // { name: '绑定角色', func: 'bdjs' },
//   { name: '关联企业', func: 'bdqy' },
//   { name: '新建', func: 'addYh' },
//   { name: '修改', func: 'editYh' },
//   { name: '删除', func: 'del' },
// ];

export default unitConfig;
