import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 资料调阅-按所属期调阅
 * author: lincb
 */
const unitConfig: any = {};

// 配置项
//unitConfig.grid_title = '金额单位：元';
unitConfig.module_key = 'CX_BADZ_ZXSB_BADZ_SSQDY';                            // 业务单元key，对应后端接口
unitConfig.page_id = 'CX_BADZ_ZXSB_BADZ_SSQDY';                                        // 页面id
// 是否显示序号，默认不显示
unitConfig.grid_show_serial_number = false; // 是否显示序号，可选
unitConfig.grid_row_key = 'badzssquuid'; // 列表主键，默认uuid
unitConfig.form_save_check = false; // 表单编辑是否执行后端校验
unitConfig.grid_click_checked = '1';
unitConfig.grid_scroll_x = '1030px';

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '业务事项', dataIndex: 'lcswsxDm', width: 100, fixed: 'left', codeTable: 'CODE_WM_CS_ZXSB_LCSWSX:01',
    filter: {
      type: 'Radio',
      codeTable: 'CODE_WM_CS_ZXSB_LCSWSX:01',
    } 
  },
  { title: '所属期', dataIndex: 'ssq', width: 90, fixed: 'left', },
  { title: '批次', dataIndex: 'sbpc', width: 90, },
  { title: '报关单/{br}代理证明张数', dataIndex: 'bgdzs', width: 105, align: 'right', render: { type: 'number', format: '0,0' } },
  { title: '已归档报关单/{br}代理证明张数', dataIndex: 'ygdbgdzs', width: 110, align: 'right', render: { type: 'number', format: '0,0' } },
  { title: '单证份数', dataIndex: 'dzfs', align: 'right', render: { type: 'number', format: '0,0' }, width: 120 },
  // { title: '归档人', dataIndex: 'gdr', width: 120, },
  // { title: '归档时间', dataIndex: 'gdrq', ellipsis: true, render: { type: 'date', format: 'YYYY-MM-DD HH:mm' } },
  { title: '打印次数', dataIndex: 'dycs', align: 'right', render: { type: 'number', format: '0,0' }, ellipsis: true, width: 100 },
  { title: '生成状态', dataIndex: 'bswjscztDm', render: { func: 'renderBadzSczt' }, width: 100, },
  { title: '生成时间', dataIndex: 'scsj', render: { type: 'date', format: 'YYYY-MM-DD HH:mm' } }
];

// unitConfig.grid_filter_quick = [];

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
unitConfig.customer_toolbar = [
  { name: '生成pdf报告', func: 'scssqsj' },
  { name: '打印成册', func: 'dycc' },
  { name: '下载资料', func: 'xzzl' },
  { name: '资料撤档', func: 'zlcd' },
];
// 配置项：自定义操作列
unitConfig.handle_columns = [
  { name: '调阅', key: 'dy', func: 'zldy'},
];
export default unitConfig;
