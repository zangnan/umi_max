// AI 返回的 JSON 数据结构（简化版：仅 tables + modules）
export interface AIResponseData {
  tables: TableInfo[];
  modules: ModuleInfo[];
  codeTables?: CodeTableItem[];  // 可选的码表数据
}

// 码表数据（AI 返回格式）
export interface CodeTableItem {
  code_type: string;      // 码表类别，如 'education'
  code_type_desc: string; // 码表类别描述，如 '学历'
  name: string;          // 码值中文名称，如 '小学'
  code: string;          // 码值，如 'A01'
}

// 表信息（Java 版本额外包含 dictName）
export interface TableInfo {
  tableNameCn: string;
  tableNameEn: string;
  dictName: string;      // 数据字典名（Java 版本新增）
  dictDesc?: string;     // 数据字典含义（Java 版本新增）
  fields: TableField[];
}

// 表字段
export interface TableField {
  name: string;
  nameCn: string;
  type: string;
  key?: string;
  defaultValue?: string;
  required?: string;
  remark?: string;
}

// 模块配置
export interface ModuleInfo {
  moduleKey: string;
  moduleName: string;
  moduleDesc?: string; // 模块关联描述：sub:xxx,rel:xxx,rel2:xxx|xxx
}

// 模块关联关系
export interface ModuleRelation {
  type: 'sub' | 'rel' | 'rel2';
  moduleKey: string; // 关联的模块key
  refModuleKey?: string; // rel2 专用，中间表模块key
}

// 4 Sheet 数据结构
export interface SheetData {
  tableSheet: TableSheetRow[];   // 表管理 Sheet
  moduleSheet: ModuleSheetRow[]; // 模块 Sheet
  fieldSheet: FieldSheetRow[];   // 字典构建 Sheet
  menuSheet: MenuSheetRow[];     // 菜单构建 Sheet
  commonFieldSheet: any[];       // 业务表共通字段 Sheet
  tablecodeSheet: TableCodeSheetRow[];  // 业务码表 Sheet
}

// 业务码表 Sheet 行 (SHEET_BUSINESS_CODE_TABLE - 6列)
export interface TableCodeSheetRow {
  code_id: string;       // 序号
  code_name: string;     // 码表名称
  code_type: string;     // 码表类别
  name: string;          // 码值中文名称
  code: string;          // 码值
  notes: string;          // 备注
}

// 表管理 Sheet 行 (SHEET_CONFIG_DICT_TABLE - 11列)
export interface TableSheetRow {
  tableName: string;      // 物理表名称
  tableDesc: string;     // 物理表含义
  dictName: string;       // 数据字典
  dictDesc: string;      // 数据字典含义
  tableAlias: string;    // 逻辑名
  tableType: string;     // 逻辑表类型
  dbSourceId: string;    // 多数据源ID
  dbOrder: string;       // 缺省数据查询顺序
  dbBakupName: string;   // 数据备份名
  dbBakupGroup: string;  // 数据备份分组
  dbCleanFlag: string;   // 清空标志
  [key: string]: any;
}

// 模块 Sheet 行 (SHEET_CONFIG_MODULE - 34列)
export interface ModuleSheetRow {
  module_key: string;
  module_name: string;
  dict_name: string;
  // 列表配置
  grid_show_serial_number: string;
  grid_border: string;
  grid_selection_type: string;
  grid_ext: string;
  grid_col_edit: string;
  grid_col_del: string;
  grid_col_detail: string;
  // 工具栏按钮
  toolbar_default_add: string;
  toolbar_default_delete: string;
  toolbar_default_edit: string;
  toolbar_default_upload: string;
  toolbar_default_download: string;
  toolbar_default_setting: string;
  toolbar_default_full: string;
  toolbar_default_reload: string;
  toolbar_default_advanced_filter: string;
  // API配置
  api_form_edit: string;
  api_form_query: string;
  api_form_delete: string;
  api_grid_query: string;
  api_excel_export: string;
  api_excel_import: string;
  api_excel_template: string;
  // 表单配置
  form_layout_type: string;
  form_width: string;
  form_submit_type: string;
  // 自定义按钮
  customer_btn_toolbar: string;
  customer_btn_grid_col: string;
  // 扩展
  module_ext_info: string;
  [key: string]: any;
}

// 字典构建 Sheet 行 (SHEET_CONFIG_FIELD - 47列)
export interface FieldSheetRow {
  // 基础字段信息
  dict_field_name_main: string;  // 主表字段
  dict_field_name_rel: string;   // 关联表字段
  dict_field_desc: string;       // 字段中文名
  dict_field_type: string;       // 数据类型
  dict_field_key: string;        // 键
  dict_field_default_value: string; // 默认值
  dict_field_not_null: string;   // 非空
  dict_field_expr: string;       // 关联字段表达式
  dict_field_filter: string;    // 字段过滤器
  // 列表项配置
  grid_used: string;
  grid_key: string;
  grid_align: string;
  grid_width: string;
  grid_fixed: string;
  grid_hidden: string;
  grid_ellipsis: string;
  grid_render: string;
  grid_sort: string;
  grid_index: string;
  grid_stat: string;
  grid_children: string;
  // 筛选项配置
  filter_item_type: string;
  filter_item_extend: string;
  filter_item_index: string;
  filter_item_label: string;
  filter_item_position: string;
  filter_item_placeholder: string;
  filter_item_layout: string;
  // 表单项配置
  form_item_used: string;
  form_item_type: string;
  form_item_format: string;
  form_item_readonly: string;
  form_item_extend: string;
  form_item_layout: string;
  form_item_event_onblur: string;
  form_item_event_onfocus: string;
  form_item_event_onchange: string;
  form_item_event_onsearch: string;
  form_item_rule: string;
  form_item_index: string;
  // 扩展
  ext_info: string;
  [key: string]: any;
}

// 菜单构建 Sheet 行 (SHEET_MENU - 16列)
export interface MenuSheetRow {
  menu_id: string;
  menu_parent_id: string;
  menu_name: string;
  menu_name1: string;  // 扩展列，用于菜单名称
  menu_path: string;
  menu_light_path: string;
  menu_icon: string;
  menu_hide: string;
  menu_redirect: string;
  menu_component: string;
  menu_active: string;
  menu_full_screen: string;
  menu_index: string;
  menu_type: string;
  web_resource_code: string;
  menu_role: string;
  [key: string]: any;
}

// 聊天消息
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  status?: string;
  extraInfo?: any;
}