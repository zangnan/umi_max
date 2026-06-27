import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 境外收货人配置
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_show_serial_number = false; // 是否显示序号，可选
unitConfig.grid_row_key = 'jwshruuid'; // 列表主键，默认uuid
unitConfig.form_save_check = false; // 表单编辑是否执行后端校验
unitConfig.grid_click_checked = '1';
unitConfig.grid_scroll_x = '1020px'; // 默认700px
unitConfig.module_key = 'PZGL_WSGL_WSFHPZGL_JWSHRCX';

// 配置项：列表列
unitConfig.grid_columns = [
  { title: 'jwshruuid', dataIndex: 'jwshruuid', hidden: true },
  { title: 'fhruuid', dataIndex: 'fhruuid', hidden: true },
  { title: '规范化境外收货人', dataIndex: 'gfhjwshrmc', width: 160, ellipsis: true },
  { title: '报关单境外收货人', dataIndex: 'jwshrmc', width: 120, ellipsis: true },
  { title: '境外收货人别名', dataIndex: 'jwshrbm', width: 120, ellipsis: true },
  { title: '关联报关单境外收货人数', dataIndex: 'gljwshrs', width: 100, ellipsis: true, render: { func: 'renderGljwshrs' }   },
  { title: '关联付汇人数', dataIndex: 'glfhrs', width: 100, ellipsis: true, render: { func: 'renderGlfhrs' }  },

];

// unitConfig.grid_handle_columns_default = {
//   edit: true,                       	// 是否显示编辑链接，默认关闭
// };
unitConfig.handle_columns = [
  { name: '编辑', func: 'handleJwshrpzbj' },
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'gfhjwshrmc', label: '规范化境外收货人', type: 'Input' },
  { name: 'jwshrbm', label: '境外收货人别名', type: 'Input' },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  full: false,
  reload: false,
  delete: false,
};

// 配置项：自定义工具栏
unitConfig.customer_toolbar = [
  { name: '提取境外收货人', func: 'handletqJwshr' },
  { name: '关联付汇人', func: 'glfhr' },
  { name: '删除', func: 'deleteJwshr' },
];



export default unitConfig;
