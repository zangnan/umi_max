/**
 * title: 资料调阅-按报关单调阅
 * author: lincb
 */
const unitConfig: any = {};

// 配置项
unitConfig.unit_key = 'CX_ABGDDY_BADZ_ZXSB_BADZ_BGD';                            // 业务单元key，对应后端接口
unitConfig.page_id = 'CX_ABGDDY_BADZ_ZXSB_BADZ_BGD';                                        // 页面id
// 是否显示序号，默认不显示
unitConfig.grid_row_key = 'badzbgduuid'; // 列表主键，默认uuid
unitConfig.form_save_check = false; // 表单编辑是否执行后端校验
unitConfig.click_checked = '1';// 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
unitConfig.grid_scroll_x = '1080px';

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '业务事项', dataIndex: 'lcswsxDm', width: 100, fixed: 'left', codeTable: ['CODE_WM_CS_ZXSB_LCSWSX', '01'],
    filter: {
      type: 'Radio',
      codeTable: ['CODE_WM_CS_ZXSB_LCSWSX', '01'],
    } 
  },
  { title: '所属期', dataIndex: 'ssq', width: 90, fixed: 'left', },
  { title: '批次', dataIndex: 'sbpc', width: 90, ellipsis: true },
  { title: '出口报关单号/{br}代理出口证明号', dataIndex: 'bgdhgbh', width: 180, ellipsis: true },
  { title: '单证份数', dataIndex: 'dzfs', width: 100, align: 'right', ellipsis: true, render: { type: 'number', format: '0,0' } },
  { title: '合同协议号', dataIndex: 'ckhth', width: 180, ellipsis: true },
  // { title: '归档人', dataIndex: 'gdr', width: 120, ellipsis: true },
  { title: '归档时间', dataIndex: 'gdrq', ellipsis: true, render: { type: 'date', format: 'YYYY-MM-DD HH:mm' } },
  { title: '打印次数', dataIndex: 'dycs', width: 90, align: 'right', render: { type: 'number', format: '0,0' } },
];

unitConfig.filter_items = [
  { name: 'ssq', label: '所属期', type: 'Input' },
  { name: 'sbpc', label: '批次', type: 'Input' },
  { name: 'bgdhgbh', label: '出口报关单号/代理证明号', type: 'Input' },
];

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                       // 是否显示编辑链接，默认关闭
  delete: false,                     // 是否显示删除链接，默认关闭
};

// 配置项：工具栏
unitConfig.toolbar_default = {
  tzUpdateData: false,               // 是否显示更新台账数据，默认关闭
  tzExport: false,                   // 是否显示导出，默认关闭
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};
// 配置项：自定义工具栏
unitConfig.costomer_toobar = [
  { name: '打印成册', func: 'dycc' },
  { name: '下载资料', func: 'xzzl' },
  { name: '资料撤档', func: 'zlcd' },
];
// 配置项：自定义操作列
unitConfig.handle_columns = [
  { name: '调阅', key: 'dy', func: 'zldy' },
  { name: '预览', key: 'dzbaZlgdPreview', func: 'dzbaZlgdPreview' },
];
export default unitConfig;
