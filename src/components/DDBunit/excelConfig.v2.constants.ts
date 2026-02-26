let CONFIG_KEY: any = {
  //
  DICT_FIELD_ASSOCIATED: 'dict_field_associated', // 关联表字段
  DICT_FIELD_TYPE: 'dict_field_type', // 数据类型
  DICT_FIELD_KEY: 'dict_field_key', // 键
  DICT_FIELD_DEFAULT_VALUE: 'dict_field_default_value', // 默认值
  DICT_FIELD_NOT_NULL: 'dict_field_not_null', // 非空
  DICT_FIELD_REMARK: 'dict_field_remark', // 备注
  DICT_FIELD_EXPR: 'dict_field_expr', // 关联字段表达式
  DICT_FIELD_FILTER: 'dict_field_filter', // 字段过滤器
  DICT_FIELD_DEFAULT_ORDER: 'dict_field_default_order', // 字段初始排序
  // 字典字段
  DICT_FIELD_ID: 'dict_field_id', // 字段主键
  DICT_FIELD_NAME: 'dict_field_name', // 字段名称
  DICT_FIELD_DESC: 'dict_field_desc', // 字段含义
  // 主表字段
  DICT_FIELD_NAME_MAIN: 'dict_field_name_main', // 主表字段
  DICT_FIELD_NAME_REL: 'dict_field_name_rel', // 关联表字段
  // 模块
  DICT_NAME: 'dict_name', // 数据字典名
  DICT_NAME_DESC: 'dict_name_desc', // 数据字典名详细说明
  DICT_FIELD_REL_TABLE: 'dict_field_rel_table', // 关联数据表 (字段所处表)
  DICT_FIELD_FLAG: 'dict_field_flag', // 与原库间的关系 (主表 or 关联表)
  DICT_FIELD_ALIAS: 'dict_field_alias', // 其它名称（别名）
  MODULE_KEY: 'module_key', // 模块Key
  MODULE_NAME: 'module_name', // 模块名称
  GRID_TITLE: 'grid_title', // 类别名称
  FORM_TITLE: 'form_title', // 表单名称
  // grid
  GRID_SHOW_SERIAL_NUMBER: 'grid_show_serial_number', // 列表序号
  GRID_BORDER: 'grid_border', // 列表边框
  GRID_SELECTION_TYPE: 'grid_selection_type', // 列表首选项
  GRID_EXT: 'grid_ext', // 列表扩展
  GRID_TYPE: 'grid_type', // 列表展示方式
  GRID_TYPE_SWITCH: 'grid_type_switch', // 列表展示方式开关
  GRID_ROW_KEY: 'grid_row_key',
  // form
  FORM_LAYOUT_TYPE: 'form_layout_type', // 表单布局
  FORM_WIDTH: 'form_width', // 表单宽度
  FORM_SUBMIT_TYPE: 'form_submit_type', // 表单提交类型
  // customer btn
  CUSTOMER_BTN_TOOLBAR: 'customer_btn_toolbar', // 自定义按钮工具栏 customer_btn_toobar
  CUSTOMER_BTN_GRID_COL: 'customer_btn_grid_col', // 列表列自定义按钮
  // grid col btn
  GRID_COL_EDIT: 'grid_col_edit', // 列表列编辑
  GRID_COL_DEL: 'grid_col_del', // 列表列删除
  GRID_COL_DETAIL: 'grid_col_detail', // 列表列详情
  // toolbar btn
  TOOLBAR_DEFAULT_ADD: 'toolbar_default_add', // 工具栏增加
  TOOLBAR_DEFAULT_DELETE: 'toolbar_default_delete', // 工具栏删除
  TOOLBAR_DEFAULT_EDIT: 'toolbar_default_edit', // 工具栏编辑
  TOOLBAR_DEFAULT_UPLOAD: 'toolbar_default_upload', // 工具栏导入
  TOOLBAR_DEFAULT_DOWNLOAD: 'toolbar_default_download', // 工具栏导出
  TOOLBAR_DEFAULT_SETTING: 'toolbar_default_setting', // 工具栏设置
  TOOLBAR_DEFAULT_FULL: 'toolbar_default_full', // 工具栏全屏
  TOOLBAR_DEFAULT_RELOAD: 'toolbar_default_reload', // 工具栏刷新
  TOOLBAR_DEFAULT_ADVANCED_FILTER: 'toolbar_default_advanced_filter', // 工具栏筛选
  TOOLBAR_DEFAULT_STATISTICS: 'toolbar_default_statistics', // 工具栏维度表统计
  // api
  API_FORM_EDIT: 'api_form_edit', // Api保存
  API_FORM_QUERY: 'api_form_query', // Api查询表单
  API_FORM_DELETE: 'api_form_delete', // Api删除
  API_GRID_QUERY: 'api_grid_query', // Api查询列表
  API_EXCEL_EXPORT: 'api_excel_export', // Api导出
  API_EXCEL_IMPORT: 'api_excel_import', // Api导入
  API_EXCEL_TEMPLATE: 'api_excel_template', // Api模板下载
  // 字段
  DICT_FIELD_ENG: 'dict_field_eng', // 主表字段
  DICT_FIELD_CHI: 'dict_field_chi', // 字段中文名
  FIELD_CHI: 'field_chi', // 字段中文名
  FIELD_ENG: 'field_eng', // 字段英文名
  // 扩展项
  EXT_INFO: 'ext_info', // 字段扩展信息 前端扩展信息 tooltip...
  MENU_EXT_INFO: 'menu_ext_info', // 菜单扩展信息
  MODULE_EXT_INFO: 'module_ext_info', //  模块扩展信息
  // 列表项
  GRID_USED: 'grid_used', // 列表项开启标识
  GRID_KEY: 'grid_key', // 列表项主键标识
  GRID_ALIGN: 'grid_align', // 列表项对齐方式
  GRID_WIDTH: 'grid_width', // 列表项列宽
  GRID_FIXED: 'grid_fixed', // 列表项固定列
  GRID_HIDDEN: 'grid_hidden', // 列表项隐藏标识
  GRID_ELLIPSIS: 'grid_ellipsis', // 列表项超出隐藏
  GRID_RENDER: 'grid_render', // 列表项格式化列
  GRID_SORT: 'grid_sort', // 列表项排序开关
  GRID_INDEX: 'grid_index', // 列表项序列
  GRID_STATISTICS: 'grid_stat', // 列表项统计
  GRID_CHILDREN: 'grid_children', // 列表项合并列头
  GRID_SUM: 'grid_sum', // 当前合计
  GRID_SUM2: 'grid_sum2', // 全部合计
  GRID_MIN: 'grid_min', // 当前最小值
  GRID_MIN2: 'grid_min2', // 全部最小值
  GRID_MAX: 'grid_max', // 当前最大值
  GRID_MAX2: 'grid_max2', // 全部最大值
  GRID_AVG: 'grid_avg', // 当前平均
  GRID_AVG2: 'grid_avg2', // 全部平均
  // 筛选项
  FILTER_ITEM_TYPE: 'filter_item_type', // 筛选项类型
  FILTER_ITEM_EXTEND: 'filter_item_extend', // 筛选项类型扩展参数
  FILTER_ITEM_INDEX: 'filter_item_index', // 筛选项序列
  FILTER_ITEM_LABEL: 'filter_item_label', // 筛选项名称
  FILTER_ITEM_POSITION: 'filter_item_position', // 筛选项位置
  FILTER_ITEM_PLACEHOLDER: 'filter_item_placeholder', // 筛选项占位符
  FILTER_ITEM_LAYOUT: 'filter_item_layout', // 筛选项布局
  // 表单项
  FORM_ITEM_USED: 'form_item_used', // 表单项开启
  FORM_ITEM_TYPE: 'form_item_type', // 表单项类型
  FORM_ITEM_FORMAT: 'form_item_format', // 表单项格式化
  FORM_ITEM_READONLY: 'form_item_readonly', // 表单项只读
  FORM_ITEM_EXTEND: 'form_item_extend', // 表单项类型扩展参数
  FORM_ITEM_LAYOUT: 'form_item_layout', // 表单项布局
  FORM_ITEM_EVENT_ONBLUR: 'form_item_event_onblur', // 表单项事件失去焦点
  FORM_ITEM_EVENT_ONFOCUS: 'form_item_event_onfocus', // 表单项事件得到焦点
  FORM_ITEM_EVENT_ONCHANGE: 'form_item_event_onchange', // 表单项事件值改变
  FORM_ITEM_EVENT_ONSEARCH: 'form_item_event_onsearch', // 表单项事件查询
  FORM_ITEM_RULE: 'form_item_rule', // 表单项验证
  FORM_ITEM_INDEX: 'form_item_index', // 表单项序列
  // 数据字典表
  TABLE_NAME: 'tableName', // 物理表名称
  TABLE_DESC: 'tableDesc',// 物理表含义
  // DICT_NAME: 'dictName',// 数据字典
  DICT_DESC: 'dictDesc',// 数据字典含义
  TABLE_ALIAS: 'tableAlias',// 逻辑名
  TABLE_TYPE: 'tableType',// 逻辑表类型
  DB_SOURCE_ID: 'dbSourceId',// 多数据源ID
  DB_ORDER: 'dbOrder',// 缺省数据查询顺序
  DB_BACK_NAME: 'dbBakupName',// 数据备份名
  DB_BACK_GROUP: 'dbBakupGroup',// 数据备份分组
  DB_CLEAN_FLAG: 'dbCleanFlag',// 清空标志
};

let style0 = { headerBgColor: 'C4BD97', headerColor: '000000' };
let style1 = { headerBgColor: '92CDDC', headerColor: '000000' };
let style2 = { headerBgColor: 'DAEEF3', headerColor: '000000' };
let style3 = { headerBgColor: 'B1A0C7', headerColor: '000000' };
let style5 = { headerBgColor: 'fde9d9', headerColor: '000000' };
let style6 = { headerBgColor: 'e4dfec', headerColor: '000000' };
let style7 = { headerBgColor: 'c5d9f1', headerColor: '000000' };
let style8 = { headerBgColor: 'ddd9c4', headerColor: '000000' };
let style9 = { headerBgColor: 'ebf1de', headerColor: '000000' };
let styleEditDisabled = { bgColor: '#f1f1f1' };

let SHEET_CONFIG_APP: any = [
  { title: '采集项', dataIndex: 'pro_name', width: 170, ...style9 },
  { title: '采集值', dataIndex: 'pro_value', width: 170, ...style9 },
];

SHEET_CONFIG_APP.forEach((item: any) => {
  item.name = item.title;
  item.field = item.dataIndex;
});

let SHEET_CONFIG_MODULE_COMMON: any = [
  // 列表
  { title: '列表序号', dataIndex: CONFIG_KEY.GRID_SHOW_SERIAL_NUMBER, defaultValue: '', width: 80, ...style6, editor: 'input-editor', flag: 'grid' },
  { title: '列表边框', dataIndex: CONFIG_KEY.GRID_BORDER, defaultValue: '', width: 80, ...style6, editor: 'input-editor', flag: 'grid' },
  { title: '列表首选项', dataIndex: CONFIG_KEY.GRID_SELECTION_TYPE, defaultValue: 'checkbox', width: 80, ...style6, editor: 'input-editor', flag: 'grid' },
  { title: '列表扩展', dataIndex: CONFIG_KEY.GRID_EXT, defaultValue: '', width: 80, ...style6, editor: 'input-editor', flag: 'grid' },
  { title: '列表列编辑', dataIndex: CONFIG_KEY.GRID_COL_EDIT, defaultValue: '1', width: 80, ...style8, editor: 'input-editor', flag: 'grid' },
  { title: '列表列删除', dataIndex: CONFIG_KEY.GRID_COL_DEL, defaultValue: '1', width: 80, ...style8, editor: 'input-editor', flag: 'grid' },
  { title: '列表列详情', dataIndex: CONFIG_KEY.GRID_COL_DETAIL, defaultValue: '1', width: 80, ...style8, editor: 'input-editor', flag: 'grid' },
  // 工具栏
  { title: '工具栏增加', dataIndex: CONFIG_KEY.TOOLBAR_DEFAULT_ADD, defaultValue: '1', width: 80, ...style8, editor: 'input-editor', flag: 'toolbar' },
  { title: '工具栏删除', dataIndex: CONFIG_KEY.TOOLBAR_DEFAULT_DELETE, defaultValue: '1', width: 80, ...style8, editor: 'input-editor', flag: 'toolbar' },
  { title: '工具栏编辑', dataIndex: CONFIG_KEY.TOOLBAR_DEFAULT_EDIT, defaultValue: '1', width: 80, ...style8, editor: 'input-editor', flag: 'toolbar' },
  { title: '工具栏导入', dataIndex: CONFIG_KEY.TOOLBAR_DEFAULT_UPLOAD, defaultValue: '', width: 80, ...style8, editor: 'input-editor', flag: 'toolbar' },
  { title: '工具栏导出', dataIndex: CONFIG_KEY.TOOLBAR_DEFAULT_DOWNLOAD, defaultValue: '1', width: 80, ...style8, editor: 'input-editor', flag: 'toolbar' },
  { title: '工具栏设置', dataIndex: CONFIG_KEY.TOOLBAR_DEFAULT_SETTING, defaultValue: '1', width: 80, ...style8, editor: 'input-editor', flag: 'toolbar' },
  { title: '工具栏全屏', dataIndex: CONFIG_KEY.TOOLBAR_DEFAULT_FULL, defaultValue: '1', width: 80, ...style8, editor: 'input-editor', flag: 'toolbar' },
  { title: '工具栏刷新', dataIndex: CONFIG_KEY.TOOLBAR_DEFAULT_RELOAD, defaultValue: '1', width: 80, ...style8, editor: 'input-editor', flag: 'toolbar' },
  { title: '工具栏筛选', dataIndex: CONFIG_KEY.TOOLBAR_DEFAULT_ADVANCED_FILTER, defaultValue: '1', width: 80, ...style8, editor: 'input-editor', flag: 'toolbar' },
  // Api
  { title: 'Api保存', dataIndex: CONFIG_KEY.API_FORM_EDIT, defaultValue: '', width: 280, ...style7, editor: 'input-editor', flag: 'api' },
  { title: 'Api删除', dataIndex: CONFIG_KEY.API_FORM_DELETE, defaultValue: '', width: 280, ...style7, editor: 'input-editor', flag: 'api' },
  { title: 'Api列表查询', dataIndex: CONFIG_KEY.API_GRID_QUERY, defaultValue: '', width: 280, ...style7, editor: 'input-editor', flag: 'api' },
  { title: 'Api表单查询', dataIndex: CONFIG_KEY.API_FORM_QUERY, defaultValue: '', width: 280, ...style7, editor: 'input-editor', flag: 'api' },
  { title: 'Api导出', dataIndex: CONFIG_KEY.API_EXCEL_EXPORT, defaultValue: '', width: 280, ...style7, editor: 'input-editor', flag: 'api' },
  { title: 'Api导入', dataIndex: CONFIG_KEY.API_EXCEL_IMPORT, defaultValue: '', width: 280, ...style7, editor: 'input-editor', flag: 'api' },
  { title: 'Api模板下载', dataIndex: CONFIG_KEY.API_EXCEL_TEMPLATE, defaultValue: '', width: 280, ...style7, editor: 'input-editor', flag: 'api' },
  // 表单
  { title: '表单布局', dataIndex: CONFIG_KEY.FORM_LAYOUT_TYPE, defaultValue: 'horizontal', width: 80, ...style5, editor: 'input-editor', flag: 'form' },
  { title: '表单宽度', dataIndex: CONFIG_KEY.FORM_WIDTH, defaultValue: 960, width: 80, ...style5, editor: 'input-editor', flag: 'form' },
  { title: '表单提交方式', dataIndex: CONFIG_KEY.FORM_SUBMIT_TYPE, defaultValue: '', width: 80, ...style5, editor: 'input-editor', flag: 'form' },
  // 自定义按钮
  { title: '自定义按钮工具栏', dataIndex: CONFIG_KEY.CUSTOMER_BTN_TOOLBAR, defaultValue: '', width: 500, ...style6, editor: 'input-editor', flag: 'btn' },
  { title: '列表列自定义按钮', dataIndex: CONFIG_KEY.CUSTOMER_BTN_GRID_COL, defaultValue: '', width: 500, ...style6, editor: 'input-editor', flag: 'btn' },
  // 扩展项
  { title: '扩展信息', dataIndex: CONFIG_KEY.MODULE_EXT_INFO, defaultValue: '', width: 200, ...style1, editor: 'input-editor', flag: 'other' },
];

let SHEET_CONFIG_MODULE: any = [
  // 模块
  // { title: '模块key', dataIndex: CONFIG_KEY.MODULE_KEY, defaultValue: '', width: 280, ...style9, style: styleEditDisabled },
  // { title: '模块名称', dataIndex: CONFIG_KEY.MODULE_NAME, defaultValue: '', width: 220, ...style9, style: styleEditDisabled },
  // { title: '数据字典', dataIndex: CONFIG_KEY.DICT_NAME, defaultValue: '', width: 280, ...style9, style: styleEditDisabled },
  { title: '模块key', dataIndex: CONFIG_KEY.MODULE_KEY, defaultValue: '', width: 280, ...style9, editor: 'input-editor', flag: 'module'  },
  { title: '模块名称', dataIndex: CONFIG_KEY.MODULE_NAME, defaultValue: '', width: 220, ...style9, editor: 'input-editor', flag: 'module'  },
  { title: '数据字典', dataIndex: CONFIG_KEY.DICT_NAME, defaultValue: '', width: 280, ...style9, editor: 'input-editor', flag: 'module'  },
  // 共通字段
  ...SHEET_CONFIG_MODULE_COMMON,
];

SHEET_CONFIG_MODULE.forEach((item: any) => {
  item.name = item.title;
  item.field = item.dataIndex;
});

let SHEET_CONFIG_MODULE_NODE: any = [
  // 模块
  { title: '模块key', dataIndex: CONFIG_KEY.MODULE_KEY, defaultValue: '', width: 280, ...style9, style: styleEditDisabled, flag: 'module' },
  { title: '模块名称', dataIndex: CONFIG_KEY.MODULE_NAME, defaultValue: '', width: 220, ...style9, style: styleEditDisabled, flag: 'module' },
  // 共通字段
  ...SHEET_CONFIG_MODULE_COMMON,
];

SHEET_CONFIG_MODULE_NODE.forEach((item: any) => {
  item.name = item.title;
  item.field = item.dataIndex;
});

let SHEET_CONFIG_FIELD_COMMON: any = [
  // 列表项
  { title: '列表项开启标识', dataIndex: CONFIG_KEY.GRID_USED, defaultValue: '1', width: 90, type: 'number', ...style1, editor: 'input-editor', flag: 'grid' },
  { title: '列表项主键标识', dataIndex: CONFIG_KEY.GRID_KEY, defaultValue: '', width: 90, type: 'number', ...style1, editor: 'input-editor', flag: 'grid' },
  { title: '列表项对齐方式', dataIndex: CONFIG_KEY.GRID_ALIGN, defaultValue: '', width: 90, ...style1, editor: 'input-editor', flag: 'grid' },
  { title: '列表项列宽', dataIndex: CONFIG_KEY.GRID_WIDTH, defaultValue: '', width: 80, type: 'number', ...style1, editor: 'input-editor', flag: 'grid' },
  { title: '列表项固定列', dataIndex: CONFIG_KEY.GRID_FIXED, defaultValue: '', width: 80, ...style1, editor: 'input-editor', flag: 'grid' },
  { title: '列表项隐藏标识', dataIndex: CONFIG_KEY.GRID_HIDDEN, defaultValue: '', width: 90, type: 'number', ...style1, editor: 'input-editor', flag: 'grid' },
  { title: '列表项超出隐藏', dataIndex: CONFIG_KEY.GRID_ELLIPSIS, defaultValue: '', width: 90, type: 'number', ...style1, editor: 'input-editor', flag: 'grid' },
  { title: '列表项格式化列', dataIndex: CONFIG_KEY.GRID_RENDER, defaultValue: '', width: 140, ...style1, editor: 'input-editor', flag: 'grid' },
  { title: '列表项排序开关', dataIndex: CONFIG_KEY.GRID_SORT, defaultValue: '', width: 90, ...style1, editor: 'input-editor', flag: 'grid' },
  { title: '列表项序列', dataIndex: CONFIG_KEY.GRID_INDEX, defaultValue: '', width: 60, ...style1, editor: 'input-editor', flag: 'grid' },
  { title: '列表项统计', dataIndex: CONFIG_KEY.GRID_STATISTICS, defaultValue: '', width: 60, ...style1, editor: 'input-editor', flag: 'grid' },
  { title: '列表项合并列头', dataIndex: CONFIG_KEY.GRID_CHILDREN, defaultValue: '', width: 90, ...style1, editor: 'input-editor', flag: 'grid' },
  // 筛选项
  { title: '筛选项类型', dataIndex: CONFIG_KEY.FILTER_ITEM_TYPE, defaultValue: '', width: 80, ...style2, editor: 'input-editor', flag: 'filter' },
  { title: '筛选项类型扩展参数', dataIndex: CONFIG_KEY.FILTER_ITEM_EXTEND, defaultValue: '', width: 130, ...style2, editor: 'input-editor', flag: 'filter' },
  { title: '筛选项序列', dataIndex: CONFIG_KEY.FILTER_ITEM_INDEX, defaultValue: '', width: 80, ...style2, editor: 'input-editor', flag: 'filter' },
  { title: '筛选项名称', dataIndex: CONFIG_KEY.FILTER_ITEM_LABEL, defaultValue: '', width: 80, ...style2, editor: 'input-editor', flag: 'filter' },
  { title: '筛选项位置', dataIndex: CONFIG_KEY.FILTER_ITEM_POSITION, defaultValue: '', width: 80, ...style2, editor: 'input-editor', flag: 'filter' },
  { title: '筛选项占位符', dataIndex: CONFIG_KEY.FILTER_ITEM_PLACEHOLDER, defaultValue: '', width: 80, ...style2, editor: 'input-editor', flag: 'filter' },
  { title: '筛选项布局', dataIndex: CONFIG_KEY.FILTER_ITEM_LAYOUT, defaultValue: '', width: 80, ...style2, editor: 'input-editor', flag: 'filter' },
  // 表单项
  { title: '表单项开启', dataIndex: CONFIG_KEY.FORM_ITEM_USED, defaultValue: '1', type: 'number', width: 60, ...style3, editor: 'input-editor', flag: 'form' },
  { title: '表单项类型', dataIndex: CONFIG_KEY.FORM_ITEM_TYPE, defaultValue: '', width: 80, ...style3, editor: 'input-editor', flag: 'form' },
  { title: '表单项格式化', dataIndex: CONFIG_KEY.FORM_ITEM_FORMAT, defaultValue: '', width: 140, ...style3, editor: 'input-editor', flag: 'form' },
  { title: '表单项只读', dataIndex: CONFIG_KEY.FORM_ITEM_READONLY, defaultValue: '', width: 60, ...style3, editor: 'input-editor', flag: 'form' },
  { title: '表单项类型扩展参数', dataIndex: CONFIG_KEY.FORM_ITEM_EXTEND, defaultValue: '', width: 270, ...style3, editor: 'input-editor', flag: 'form' },
  { title: '表单项布局', dataIndex: CONFIG_KEY.FORM_ITEM_LAYOUT, defaultValue: '', width: 60, ...style3, editor: 'input-editor', flag: 'form' },
  { title: '表单项事件失去焦点', dataIndex: CONFIG_KEY.FORM_ITEM_EVENT_ONBLUR, defaultValue: '', width: 120, ...style3, editor: 'input-editor', flag: 'form' },
  { title: '表单项事件得到焦点', dataIndex: CONFIG_KEY.FORM_ITEM_EVENT_ONFOCUS, defaultValue: '', width: 120, ...style3, editor: 'input-editor', flag: 'form' },
  { title: '表单项事件值改变', dataIndex: CONFIG_KEY.FORM_ITEM_EVENT_ONCHANGE, defaultValue: '', width: 120, ...style3, editor: 'input-editor', flag: 'form' },
  { title: '表单项事件查询', dataIndex: CONFIG_KEY.FORM_ITEM_EVENT_ONSEARCH, defaultValue: '', width: 90, ...style3, editor: 'input-editor', flag: 'form' },
  { title: '表单项验证', dataIndex: CONFIG_KEY.FORM_ITEM_RULE, defaultValue: '', width: 300, ...style3, editor: 'input-editor', flag: 'form' },
  { title: '表单项序列', dataIndex: CONFIG_KEY.FORM_ITEM_INDEX, defaultValue: '', width: 80, ...style3, editor: 'input-editor', flag: 'form' },
  // 扩展项
  { title: '扩展信息', dataIndex: CONFIG_KEY.EXT_INFO, defaultValue: '', width: 200, ...style1, editor: 'input-editor', flag: 'other'  },
];

let SHEET_CONFIG_FIELD: any = [//, editor: 'input-editor'
  // { title: '主表字段', dataIndex: CONFIG_KEY.DICT_FIELD_NAME_MAIN, defaultValue: '', width: 140, ...style9, style: styleEditDisabled },
  // { title: '关联表字段', dataIndex: CONFIG_KEY.DICT_FIELD_NAME_REL, defaultValue: '', width: 140, ...style9, style: styleEditDisabled },
  // { title: '字段中文名', dataIndex: CONFIG_KEY.DICT_FIELD_DESC, defaultValue: '', width: 180, ...style9, style: styleEditDisabled },
  // { title: '数据类型', dataIndex: CONFIG_KEY.DICT_FIELD_TYPE, defaultValue: '', width: 110, ...style9, style: styleEditDisabled },
  // { title: '键', dataIndex: CONFIG_KEY.DICT_FIELD_KEY, defaultValue: '', width: 100, ...style9, style: styleEditDisabled },
  // { title: '默认值', dataIndex: CONFIG_KEY.DICT_FIELD_DEFAULT_VALUE, defaultValue: '', width: 100, ...style9, style: styleEditDisabled },
  // { title: '非空', dataIndex: CONFIG_KEY.DICT_FIELD_NOT_NULL, defaultValue: '', width: 90, ...style9, style: styleEditDisabled },
  // { title: '关联字段表达式', dataIndex: CONFIG_KEY.DICT_FIELD_EXPR, defaultValue: '', width: 120, ...style9, style: styleEditDisabled },
  // { title: '字段过滤器', dataIndex: CONFIG_KEY.DICT_FIELD_FILTER, defaultValue: '', width: 120, ...style9, style: styleEditDisabled },
  { title: '主表字段', dataIndex: CONFIG_KEY.DICT_FIELD_NAME_MAIN, defaultValue: '', width: 140, ...style9, editor: 'input-editor', flag: 'field' },
  { title: '关联表字段', dataIndex: CONFIG_KEY.DICT_FIELD_NAME_REL, defaultValue: '', width: 140, ...style9, editor: 'input-editor', flag: 'field' },
  { title: '字段中文名', dataIndex: CONFIG_KEY.DICT_FIELD_DESC, defaultValue: '', width: 180, ...style9, editor: 'input-editor', flag: 'field' },
  { title: '数据类型', dataIndex: CONFIG_KEY.DICT_FIELD_TYPE, defaultValue: '', width: 110, ...style9, editor: 'input-editor', flag: 'db' },
  { title: '键', dataIndex: CONFIG_KEY.DICT_FIELD_KEY, defaultValue: '', width: 100, ...style9, editor: 'input-editor', flag: 'db' },
  { title: '默认值', dataIndex: CONFIG_KEY.DICT_FIELD_DEFAULT_VALUE, defaultValue: '', width: 100, ...style9, editor: 'input-editor', flag: 'db' },
  { title: '非空', dataIndex: CONFIG_KEY.DICT_FIELD_NOT_NULL, defaultValue: '', width: 90, ...style9, editor: 'input-editor', flag: 'db' },
  { title: '关联字段表达式', dataIndex: CONFIG_KEY.DICT_FIELD_EXPR, defaultValue: '', width: 120, ...style9, editor: 'input-editor', flag: 'db' },
  { title: '字段过滤器', dataIndex: CONFIG_KEY.DICT_FIELD_FILTER, defaultValue: '', width: 120, ...style9, editor: 'input-editor', flag: 'db' },
  // 共通字段
  ...SHEET_CONFIG_FIELD_COMMON,
];

let SHEET_CONFIG_FIELD_NODE: any = [
  { title: '数据字典', dataIndex: CONFIG_KEY.DICT_NAME, defaultValue: '', width: 120, ...style9, style: styleEditDisabled, flag: 'field' },
  { title: '字段名称', dataIndex: CONFIG_KEY.DICT_FIELD_NAME, defaultValue: '', width: 140, ...style9, style: styleEditDisabled, flag: 'field' },
  { title: '字段中文名', dataIndex: CONFIG_KEY.DICT_FIELD_DESC, defaultValue: '', width: 180, ...style9, style: styleEditDisabled, flag: 'field' },
  { title: '关联字段表达式', dataIndex: CONFIG_KEY.DICT_FIELD_EXPR, defaultValue: '', width: 340, ...style9, editor: 'input-editor', flag: 'field' },
  { title: '字段初始排序', dataIndex: CONFIG_KEY.DICT_FIELD_DEFAULT_ORDER, defaultValue: '', width: 80, ...style9, editor: 'input-editor', flag: 'field' },
  // 共通字段
  ...SHEET_CONFIG_FIELD_COMMON,
];

SHEET_CONFIG_FIELD.forEach((item: any) => {
  item.name = item.title;
  item.field = item.dataIndex;
});

SHEET_CONFIG_FIELD_NODE.forEach((item: any) => {
  item.name = item.title;
  item.field = item.dataIndex;
});

let SHEET_CONFIG_DICT_TABLE: any = [
  { title: '物理表名称', dataIndex: CONFIG_KEY.TABLE_NAME, defaultValue: '', width: 160, ...style5 },
  { title: '物理表含义', dataIndex: CONFIG_KEY.TABLE_DESC, defaultValue: '', width: 200, ...style5 },
  { title: '数据字典', dataIndex: CONFIG_KEY.DICT_NAME, defaultValue: '', width: 160, ...style5 },
  { title: '数据字典含义', dataIndex: CONFIG_KEY.DICT_DESC, defaultValue: '', width: 240, ...style5 },
  { title: '逻辑名', dataIndex: CONFIG_KEY.TABLE_ALIAS, defaultValue: '', width: 160, ...style5 },
  { title: '逻辑表类型', dataIndex: CONFIG_KEY.TABLE_TYPE, defaultValue: '', width: 100, ...style5 },
  { title: '多数据源ID', dataIndex: CONFIG_KEY.DB_SOURCE_ID, defaultValue: '', width: 100, ...style5 },
  { title: '缺省数据查询顺序', dataIndex: CONFIG_KEY.DB_ORDER, defaultValue: '', width: 100, ...style5 },
  { title: '数据备份名', dataIndex: CONFIG_KEY.DB_BACK_NAME, defaultValue: '', width: 100, ...style5 },
  { title: '数据备份分组', dataIndex: CONFIG_KEY.DB_BACK_GROUP, defaultValue: '', width: 100, ...style5 },
  { title: '清空标志', dataIndex: CONFIG_KEY.DB_CLEAN_FLAG, defaultValue: '', width: 60, ...style5, type: 'number' },
];

SHEET_CONFIG_DICT_TABLE.forEach((item: any) => {
  item.name = item.title;
  item.field = item.dataIndex;
});

let SHEET_BUSINESS_CODE_TABLE: any = [
  { title: '序号', dataIndex: 'code_id', width: 50, ...style5, type: 'number' },
  { title: '码表名称', dataIndex: 'code_name', width: 150, ...style5 },
  { title: '码表类别', dataIndex: 'code_type', width: 120, ...style5 },
  { title: '码值', dataIndex: 'code', width: 120, ...style5 },
  { title: '码值中文名称', dataIndex: 'name', width: 220, ...style5 },
  { title: '备注', dataIndex: 'notes', width: 120, ...style5 },
];

let SHEET_BUSINESS_CODE_TABLE_CUSTOMER: any = [
  { title: '序号', dataIndex: 'code_manager_id', width: 50, ...style5 },
  { title: '码表KEY', dataIndex: 'code_manage_key', width: 120, ...style5 },
  { title: '码表数据库表', dataIndex: 'code_manage_table', width: 120, ...style5 },
  { title: '码表类别', dataIndex: 'code_type', width: 160, ...style5 },
  { title: 'codeName数据库字段名称', dataIndex: 'code_name_db_property', width: 150, ...style5 },
  { title: 'codeValue数据库字段名称', dataIndex: 'code_value_db_property', width: 150, ...style5 },
  { title: 'codeName前端名称', dataIndex: 'code_name_web_property', width: 120, ...style5 },
  { title: 'codeValue前端名称', dataIndex: 'code_value_web_property', width: 120, ...style5 },
  { title: '自定义SQL', dataIndex: 'code_sql', width: 500, ...style5 },
  { title: '码表描述', dataIndex: 'code_manage_name', width: 160, ...style5 },
];

let SHEET_COMMON_FIELD: any = [
  { title: '序号', dataIndex: 'uuid', width: 50, ...style5 },
  { title: '字段名称', dataIndex: CONFIG_KEY.DICT_FIELD_NAME, width: 120, ...style5 },
  { title: '字段中文名', dataIndex: CONFIG_KEY.DICT_FIELD_DESC, width: 120, ...style5 },
  { title: '数据类型', dataIndex: CONFIG_KEY.DICT_FIELD_TYPE, width: 120, ...style5 },
  { title: '关联字段表达式', dataIndex: CONFIG_KEY.DICT_FIELD_EXPR, width: 120, ...style5 },
];

let SHEET_CONFIG_SQL: any = [
  { title: '自定义SQL唯一标志', dataIndex: 'sql_key', width: 160, ...style5 },
  { title: 'SQL描述', dataIndex: 'sql_name', width: 160, ...style5 },
  { title: 'SQL代码', dataIndex: 'sql_cvalue', width: 500, ...style5 },
];

let SHEET_MENU: any = [
  { title: '序号', dataIndex: 'menu_id', defaultValue: '', width: 30, ...style5, type: 'number', align: 'left' },
  // { title: '菜单名称', dataIndex: 'menu_name', defaultValue: '', width: 160, ...style5, colSpan: 4},
  { title: '菜单名称', dataIndex: 'menu_name', defaultValue: '', width: 30, ...style5},
  { title: '', dataIndex: 'menu_name1', defaultValue: '', width: 30, ...style5 }, // 合并赋值列
  { title: '', dataIndex: 'menu_name2', defaultValue: '', width: 30, ...style5 }, // 合并赋值列
  { title: '', dataIndex: 'menu_name3', defaultValue: '', width: 30, ...style5 }, // 合并赋值列
  { title: '', dataIndex: 'menu_name4', defaultValue: '', width: 100, ...style5 }, // 合并赋值列
  { title: '前端组件ID', dataIndex: 'web_id', defaultValue: '', width: 200, ...style5 },
  { title: '菜单路径', dataIndex: 'menu_path', defaultValue: '', width: 280, ...style5 },
  { title: '高亮节点路径', dataIndex: 'menu_light_path', defaultValue: '', width: 90, ...style5 },
  { title: '菜单图标', dataIndex: 'menu_icon', defaultValue: 'ProfileOutlined', width: 100, ...style5 },
  { title: '隐藏', dataIndex: 'menu_hide', defaultValue: 'N', width: 40, ...style5 },
  { title: '路径重定向', dataIndex: 'menu_redirect', defaultValue: '', width: 70, ...style5 },
  { title: '组件', dataIndex: 'menu_component', defaultValue: './common/automatic_page', width: 220, ...style5 },
  { title: '默认全屏', dataIndex: 'menu_full_screen', defaultValue: 'N', width: 60, ...style5 },
  { title: '角色', dataIndex: 'menu_role', defaultValue: '系统管理', width: 260, ...style5 },
  { title: 'colSpan', dataIndex: 'colSpan' }, // 合并赋值列
];

SHEET_MENU.forEach((item: any) => {
  item.name = item.title;
  item.field = item.dataIndex;
});

let SHEET_MENU_NODE: any = [
  { title: '菜单id', dataIndex: 'menu_id', defaultValue: '', width: 100, ...style5, align: 'left' },
  { title: '父级菜单id', dataIndex: 'menu_parent_id', defaultValue: '', width: 100, ...style5, align: 'left' },
  { title: '菜单名称', dataIndex: 'menu_name', defaultValue: '', width: 150, ...style5},
  { title: '菜单路径', dataIndex: 'menu_path', defaultValue: '', width: 280, ...style5 },
  { title: '高亮节点路径', dataIndex: 'menu_light_path', defaultValue: '', width: 90, ...style5 },
  { title: '菜单图标', dataIndex: 'menu_icon', defaultValue: 'ProfileOutlined', width: 100, ...style5 },
  { title: '隐藏', dataIndex: 'menu_hide', defaultValue: '0', width: 40, ...style5, type: 'number' },
  { title: '路径重定向', dataIndex: 'menu_redirect', defaultValue: '', width: 70, ...style5 },
  { title: '组件', dataIndex: 'menu_component', defaultValue: './common/automatic_page', width: 240, ...style5 },
  { title: '有效标记', dataIndex: 'menu_active', defaultValue: '1', width: 60, ...style5, type: 'number' },
  { title: '默认全屏', dataIndex: 'menu_full_screen', defaultValue: '0', width: 60, ...style5, type: 'number' },
  { title: '菜单序列', dataIndex: 'menu_index', defaultValue: '', width: 60, ...style5 },
  { title: '菜单类型', dataIndex: 'menu_type', defaultValue: '', width: 60, ...style5 },
  { title: '前端资源代码', dataIndex: 'web_resource_code', defaultValue: '', width: 120, ...style5 },
  { title: '角色', dataIndex: 'menu_role', defaultValue: '管理员', width: 260, ...style5 },
];

SHEET_MENU_NODE.forEach((item: any) => {
  item.name = item.title;
  item.field = item.dataIndex;
});

SHEET_CONFIG_SQL.forEach((item: any) => {
  item.name = item.title;
  item.field = item.dataIndex;
});

let SHEET_CUSTOMER_SQL_NODE: any = [
  { title: '自定义sql主键', dataIndex: 'uuid', defaultValue: '', width: 100, ...style5 },
  { title: '自定义唯一标志', dataIndex: 'sql_key', defaultValue: '', width: 100, ...style5 },
  { title: 'SQL描述', dataIndex: 'sql_name', defaultValue: '', width: 150, ...style5},
  { title: 'SQL代码', dataIndex: 'sql_cvalue', defaultValue: '', width: 280, ...style5 },
];

SHEET_CUSTOMER_SQL_NODE.forEach((item: any) => {
  item.name = item.title;
  item.field = item.dataIndex;
});

let SHEET_CUSTOMER_CODETABLE_NODE: any = [
  { title: '主键', dataIndex: 'code_manage_id', defaultValue: '', width: 100, ...style5 },
  { title: '码表KEY', dataIndex: 'code_manage_key', defaultValue: '', width: 100, ...style5 },
  { title: '码表名称', dataIndex: 'code_manage_name', defaultValue: '', width: 100, ...style5 },
  { title: '码表数据库表', dataIndex: 'code_manage_table', defaultValue: '', width: 100, ...style5 },
  { title: 'codeName数据库字段名称', dataIndex: 'code_name_db_property', defaultValue: '', width: 100, ...style5 },
  { title: 'codeValue数据库字段名称', dataIndex: 'code_value_db_property', defaultValue: '', width: 100, ...style5 },
  { title: 'codeName前端名称', dataIndex: 'code_name_web_property', defaultValue: '', width: 100, ...style5 },
  { title: 'codeValue前端名称', dataIndex: 'code_value_web_property', defaultValue: '', width: 100, ...style5 },
  { title: '父节点codeValue数据库字段名称', dataIndex: 'code_value_db_property_pid', defaultValue: '', width: 100, ...style5 },
  { title: '自定义SQL', dataIndex: 'code_sql', defaultValue: '', width: 100, ...style5 },
  { title: '备注', dataIndex: 'notes', defaultValue: '', width: 100, ...style5 },
  { title: '有效标志', dataIndex: 'used_flag', defaultValue: '', width: 100, ...style5 },
];

SHEET_CUSTOMER_CODETABLE_NODE.forEach((item: any) => {
  item.name = item.title;
  item.field = item.dataIndex;
});

let DB_TABLE: any = [
  { db_table_name: 'app_module', db_table_desc: '应用模块', sheet_desc: '模块', config_name: 'SHEET_CONFIG_MODULE' },
  // { db_table_name: 'app_module_field', db_table_desc: '应用模块字段', sheet_desc: '字段', config_name: 'SHEET_CONFIG_FIELD' },
  { db_table_name: 'app_module_field', db_table_desc: '应用模块字段', sheet_desc: '字段', config_name: 'SHEET_CONFIG_FIELD_NODE' },
  { db_table_name: 'sys_menu', db_table_desc: '菜单表', sheet_desc: '菜单', config_name: 'SHEET_MENU_NODE' },
  { db_table_name: 'sys_customer_sql', db_table_desc: '自定义SQL', sheet_desc: '自定义SQL', config_name: 'SHEET_CUSTOMER_SQL_NODE' },
  { db_table_name: 'sys_customer_codetable', db_table_desc: '自定义码表', sheet_desc: '自定义码表', config_name: 'SHEET_CUSTOMER_CODETABLE_NODE' },
];

let SHEET_TABLE_FIELD: any = [
  { title: '字段', dataIndex: CONFIG_KEY.DICT_FIELD_NAME, width: 120, ...style5 },
  { title: '字段中文名', dataIndex: CONFIG_KEY.DICT_FIELD_DESC, width: 200, ...style5 },
  { title: '数据类型', dataIndex: CONFIG_KEY.DICT_FIELD_TYPE, width: 120, ...style5 },
  { title: '键', dataIndex: CONFIG_KEY.DICT_FIELD_KEY, width: 120, ...style5 },
  { title: '默认值', dataIndex: CONFIG_KEY.DICT_FIELD_DEFAULT_VALUE, width: 120, ...style5 },
  { title: '非空', dataIndex: CONFIG_KEY.DICT_FIELD_NOT_NULL, width: 120, ...style5 },
  { title: '备注', dataIndex: CONFIG_KEY.DICT_FIELD_REMARK, width: 120, ...style5 },
];

SHEET_TABLE_FIELD.forEach((item: any) => {
  item.name = item.title;
  item.field = item.dataIndex;
});

export const GRID_WIDTH = 150;
export const GRID_WIDTH_NUMBER = 140;
export const GRID_WIDTH_DATE = 95;
export const GRID_ROW_KEY = 'uuid';
export const GRID_DEFAULT_SORT = 'grid_default_sort';
export const DELETE_KEY = 'uuids';
export const C_GRID_COLUMNS = 'grid_columns';
export const C_FORM_ITEMS = 'form_items';
export const C_FILTER_ITEMS = 'filter_items';
export const C_GRID_FILTER_QUICK = 'grid_filter_quick';
export const C_GRID_SUM_FIELD = 'grid_sum_field';
export const C_HANDLE_COLUMNS = 'handle_columns';
export const C_CUSTOMER_TOOLBAR = 'customer_toolbar';
export const DEFAULT_CONFIG = {
  delete_key: DELETE_KEY,
};

let excelConfigConstants: any = {
  // 导出配置
  SHEET_CONFIG_APP,
  SHEET_CONFIG_MODULE,
  SHEET_CONFIG_MODULE_NODE,
  SHEET_CONFIG_FIELD,         // 字段
  SHEET_CONFIG_FIELD_NODE,    // 字段 node
  SHEET_CONFIG_DICT_TABLE,
  SHEET_BUSINESS_CODE_TABLE,
  SHEET_BUSINESS_CODE_TABLE_CUSTOMER,
  SHEET_COMMON_FIELD,
  SHEET_MENU,
  SHEET_MENU_NODE,
  SHEET_CONFIG_SQL,
  CONFIG_KEY,
  DB_TABLE,
  SHEET_TABLE_FIELD,
  SHEET_CUSTOMER_SQL_NODE,
  SHEET_CUSTOMER_CODETABLE_NODE,
};

export default excelConfigConstants;