import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 生产企业退税情况汇总表
 * author: lincb
 */
const unitConfig: any = {};

// 配置项
//unitConfig.grid_title = '金额单位：元';
unitConfig.module_key = 'TZ_CKYWTZ_CKBGDHZ';                            // 业务单元key，对应后端接口
unitConfig.page_id = 'TZ_CKYWTZ_CKBGDHZ';                                        // 页面id
unitConfig.show_toolbar = true;                                                       // 是否开启工具栏，默认true开启
unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.layout_type = 'tz';                                                     // 页面类型，默认default 可选 default modal tabs
unitConfig.grid_show_serial_number = true;                      // 是否显示序号，默认不显示

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '备案类型', dataIndex: 'balx', width: 200, },
  { title: '单证类型', dataIndex: 'dzlx', width: 200, },
  { title: '单证名称', dataIndex: 'dzmc', width: 200, },
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
  setting: true,
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: false,                     // 是否显示刷新按钮，默认关闭
};
// 配置项：自定义工具栏
unitConfig.customer_toolbar = [
  { name: '添加单证', func: 'addDz' },
  { name: '保存', func: 'save' },
];

unitConfig.handle_columns = [];
export default unitConfig;