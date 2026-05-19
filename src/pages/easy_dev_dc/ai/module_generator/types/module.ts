// AI 返回的 JSON 数据结构（简化版：仅 tables + modules）
export interface AIResponseData {
  tables: TableInfo[];
  modules: ModuleInfo[];
}

// 表信息
export interface TableInfo {
  tableNameCn: string;
  tableNameEn: string;
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
  tableSheet: TableSheetRow[];
  moduleSheet: ModuleSheetRow[];
  fieldSheet: FieldSheetRow[];
  menuSheet: MenuSheetRow[];
}

// 表 Sheet 行
export interface TableSheetRow {
  '字段': string;
  '字段中文名': string;
  '数据类型': string;
  '键': string;
  '默认值': string;
  '非空': string;
  '备注': string;
  [key: string]: any;
}

// 模块 Sheet 行
export interface ModuleSheetRow {
  [key: string]: any;
}

// 字段 Sheet 行
export interface FieldSheetRow {
  [key: string]: any;
}

// 菜单 Sheet 行
export interface MenuSheetRow {
  // 中文 key（用于页面展示）
  '菜单id': string;
  '父级菜单id': string;
  '前端资源代码': string;
  '菜单名称': string;
  '菜单路径': string;
  '高亮节点路径': string;
  '菜单图标': string;
  '隐藏': string;
  '路径重定向': string;
  '组件': string;
  '有效标记': string;
  '默认全屏': string;
  '菜单类型': string;
  '菜单序列': string;
  '角色': string;
  // 英文 dataIndex（用于导出）
  'menu_id': string;
  'menu_parent_id': string;
  'web_resource_code': string;
  'menu_name': string;
  'menu_path': string;
  'menu_light_path': string;
  'menu_icon': string;
  'menu_hide': string;
  'menu_redirect': string;
  'menu_component': string;
  'menu_active': string;
  'menu_full_screen': string;
  'menu_type': string;
  'menu_index': string;
  'menu_role': string;
  [key: string]: any;
}

// 聊天消息
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  status?: string;
  extraInfo?: any;
}