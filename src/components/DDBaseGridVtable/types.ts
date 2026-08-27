/**
 * DDBaseGridVTable 类型定义
 *
 * 本文件包含组件所有的类型定义，便于维护和复用
 */

/**
 * 工具栏按钮配置类型
 */
export interface DDVTableToolbarConfig {
  /** 是否显示增加按钮 */
  add?: boolean;
  /** 是否显示修改按钮 */
  edit?: boolean;
  /** 是否显示删除按钮 */
  delete?: boolean;
  /** 是否显示设置按钮 */
  setting?: boolean;
  /** 是否显示全屏按钮 */
  full?: boolean;
  /** 是否显示导出按钮 */
  download?: boolean;
  /** 是否显示导入按钮 */
  upload?: boolean;
  /** 是否显示刷新按钮 */
  reload?: boolean;
}

/**
 * 列渲染配置类型
 */
export interface DDVTableColumnRender {
  /**
   * 渲染类型
   * - 'number': 数值格式化
   * - 'date': 日期格式化
   * - 'custom': 自定义格式化
   * - 'copy': 复制功能
   * - 'code_table': 码表映射
   */
  type: 'number' | 'date' | 'custom' | 'copy' | 'code_table';
  /**
   * 格式字符串
   * - number: 如 '0,0.00' 表示千分位，保留2位小数
   * - date: 如 'YYYY-MM-DD' 或 'YYYY-MM-DD HH:mm:ss'
   * - custom: 自定义格式化函数名（需配合自定义函数使用）
   */
  format?: string;
  /** 码表 key（code_table 类型使用），如 'code_dm_ckts_cktmspzlx' */
  key?: string;
}

/**
 * 列配置类型
 */
export interface DDVTableColumn {
  /** 列头显示文字 */
  title: string;
  /** 数据key */
  field: string;
  /** 列宽度，number或'auto' */
  width?: number | 'auto';
  /** 是否开启排序 */
  sort?: boolean;
  /** 统计配置 - 求和 */
  sum?: boolean;
  /** 统计配置 - 最小值 */
  min?: boolean;
  /** 统计配置 - 最大值 */
  max?: boolean;
  /** 统计配置 - 平均值 */
  avg?: boolean;
  /** 列对齐方式：'left' | 'right' | 'center'，默认左对齐 */
  align?: 'left' | 'right' | 'center';
  /** 是否隐藏该列，设为 true 则列不显示 */
  hidden?: boolean;
  /** 渲染配置，用于格式化数值或日期 */
  render?: DDVTableColumnRender;
  /** 列头说明提示：显示问号图标，hover 时显示提示文字 */
  titleTooltip?: string;
  /** 是否显示过滤图标，配置后可在列头显示过滤图标用于数据筛选 */
  filter?: boolean;
  /** 其他VTable列配置 */
  [key: string]: any;
}

/**
 * 行序号配置类型
 */
export interface DDVTableRowSeriesNumber {
  /** 序号列标题 */
  title?: string;
  /** 序号列宽度 */
  width?: number | string;
  /** 表头样式 */
  headerStyle?: Record<string, any>;
  /** 单元格样式 */
  style?: Record<string, any>;
  /** 其他VTable行序号配置 */
  [key: string]: any;
}

/**
 * 操作列按钮配置类型
 */
export interface DDVTableHandleColumnsConfig {
  /** 是否显示编辑链接 */
  edit?: boolean;
  /** 是否显示删除链接 */
  delete?: boolean;
  /** 是否显示详情链接 */
  detail?: boolean;
}

/** 列表选择类型 */
export type DDVTableSelectionType = 'checkbox' | 'radio' | false;

/** 列表紧凑程度 */
export type DDVTableSizeType = 'compact' | 'default' | 'loose';

/**
 * 设置弹窗配置类型
 */
export interface DDVTableSettingConfig {
  /** 列表紧凑程度 */
  size?: DDVTableSizeType;
  /** 是否自动换行 */
  autoWrapText?: boolean;
  /** 是否显示序号 */
  showIndex?: boolean;
  /** 是否显示操作列 */
  showHandleColumn?: boolean;
  /** 冻结列数 */
  frozenColCount?: number;
  /** 可选冻结的最大列数 */
  allowFrozenColCount?: number;
  /** 是否显示统计行 */
  showSummary?: boolean;
  /** 首列选择类型：checkbox 复选框 | radio 单选框 | false 不显示 */
  selectionType?: DDVTableSelectionType;
  /** 列显示配置：字段名 -> 是否显示 */
  columnVisibility?: Record<string, boolean>;
  /** 列顺序配置：按顺序排列的字段名数组 */
  columnOrder?: string[];
  /** 表格高度 */
  gridHeight?: number;
}

/**
 * 列表配置类型
 */
export interface DDVTableGridConfig {
  /** 行序号配置：true 表示使用默认配置，false 或不配置表示不显示 */
  grid_row_series_number?: boolean | DDVTableRowSeriesNumber;
  /** 表格高度 */
  grid_height?: number | string;
  /** 可选做冻结的前几列数量 */
  grid_allow_frozen_col_count?: number;
  /** 初始冻结列数 */
  grid_frozen_col_count?: number;
  /** 是否显示冻结图标 */
  grid_show_frozen_icon?: boolean;
  /** 选择类型：checkbox 复选框 | radio 单选框 | false 不显示选择列 */
  grid_selection_type?: DDVTableSelectionType;
  /** 主键字段：用于删除等操作标识数据行 */
  grid_row_key?: string;
  /** 是否全局开启自动换行（配合 defaultRowHeight 使用），默认 false */
  grid_auto_wrap_text?: boolean;
  /** 表格标题：显示在"共 xx 条"前面 */
  grid_title?: string;
  /** 性能模式：启用后跳过所有复杂配置，只保留基础 field/title/width，用于性能测试 */
  grid_performance_mode?: boolean;
}

/**
 * 列表配置类型
 */
export interface DDVTableConfig {
  /** 列表列配置 */
  grid_columns: DDVTableColumn[];
  /** 列表配置 */
  grid_config?: DDVTableGridConfig;
  /** 工具栏按钮配置 */
  toolbar_default?: DDVTableToolbarConfig;
  /** 操作列按钮配置，配置后会在列表最后增加一列显示操作按钮 */
  grid_handle_columns_default?: DDVTableHandleColumnsConfig;
  /** API 配置 - 统一管理所有接口地址 */
  api_config?: {
    /** 列表查询 API 地址 */
    api_grid_query?: string;
    /** 表单查询 API 地址（编辑时查询） */
    api_form_query?: string;
    /** 表单保存 API 地址（新增/编辑时保存） */
    api_form_edit?: string;
    /** 表单删除 API 地址 */
    api_form_delete?: string;
  };
  /** 表单配置 */
  form_config?: DDVTableFormConfig;
  /** 表单字段配置 */
  form_items?: DDVTableFormItem[];
  /** 筛选字段配置 - 配置后会在表格上方显示筛选组件 */
  filter_items?: DDVTableFormItem[];
  /** 业务单元key */
  module_key?: string;
  /** 自定义工具栏按钮（来源：pageDef moduleInfo.customer_btn_toolbar） */
  customer_toolbar?: DDVTableCustomerToolbarItem[];
  /** 其他VTable配置（会覆盖默认配置） */
  [key: string]: any;
}

/**
 * 自定义工具栏按钮（来源于 pageDef moduleInfo.customer_btn_toolbar，
 * 由 assemble_config_util.module.assembleAll 解析得到）
 */
export interface DDVTableCustomerToolbarItem {
  /** 显示文本 */
  name: string;
  /** handler 名（在 onCustomBtn 映射表里查找） */
  func: string;
  /** 资源权限 key（当前未消费，保留字段） */
  key?: string;
  /** 禁用态 */
  disabled?: boolean;
}

/**
 * 数据类型
 */
export interface DDVTableData {
  /** 列表数据数组 */
  rows: Record<string, any>[];
}

/**
 * 过滤规则类型
 */
export interface DDVTableFilterRule {
  /** 过滤字段 */
  field: string;
  /** 过滤类型 */
  filter_type: 'text' | 'number' | 'date';
  /** 过滤条件值 */
  value: string | number | { min?: number; max?: number };
}

/**
 * 表单项配置类型（参考 DDBaseForm）
 */
export interface DDVTableFormItem {
  /** 字段名称 */
  name?: string;
  /** 字段类型 */
  type: string;
  /** 标签 */
  label?: string;
  /** 提示信息 */
  tooltip?: string;
  /** 占位符 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否只读 */
  readOnly?: boolean;
  /** 布局配置 */
  layout?: any;
  /** 校验规则 */
  rules?: any[];
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 选择列表 */
  list?: any[];
  /** 码表 */
  codeTable?: string;
  /** 树形选择数据 */
  treeTable?: string;
  /** 是否选择叶子节点 */
  isSelectLeaf?: boolean;
  /** 默认值 */
  defaultValue?: any;
  /** 格式 */
  format?: string;
  /** 显示搜索 */
  showSearch?: boolean;
  /** 多选模式 */
  mode?: any;
  /** 允许清除 */
  allowClear?: boolean;
  /** 最大长度 */
  maxlength?: number;
  /** 自动调整高度 */
  autoSize?: any;
  /** 范围选择 */
  range?: boolean;
  /** 隐藏字段 */
  hidden?: boolean;
  /** 其他属性 */
  [key: string]: any;
}

/**
 * 表单配置类型
 */
export interface DDVTableFormConfig {
  /** 表单标题 */
  form_title?: string;
  /** 表单宽度 */
  form_width?: number | string;
  /** 布局类型：horizontal | vertical | 数字（多列） */
  form_layout_type?: 'horizontal' | 'vertical' | number;
  /** 标签与输入框排列方式 */
  form_label_input_layout?: 'horizontal' | 'vertical';
  /** 提交类型：默认null，FormData可选 */
  form_submit_type?: 'FormData' | null;
  /** 是否执行后端校验 */
  form_save_check?: boolean;
  /** 是否从列表获取编辑数据 */
  form_get_value_by_grid?: boolean;
}

// ==================== API 查询相关类型 ====================

/**
 * API 查询条件项类型
 */
export interface DDVTableApiSearchItem {
  /** 字段名 */
  field?: string;
  /** 操作符 */
  operator?: string;
  /** 值 */
  value?: any;
  /** 逻辑符 */
  logic?: 'and' | 'or';
}

/**
 * API 排序项类型
 */
export interface DDVTableApiOrderItem {
  /** 字段名 */
  field?: string;
  /** 排序方向 */
  direction?: 'asc' | 'desc';
}

/**
 * API 查询参数类型
 */
export interface DDVTableApiQueryParams {
  /** 查询条件数组 */
  searchModel?: DDVTableApiSearchItem[];
  /** 排序条件数组 */
  orderModel?: DDVTableApiOrderItem[];
  /** 每页条数 */
  pageSize?: number;
  /** 当前页码 */
  page?: number;
  /** 每页条数（兼容格式） */
  pageNum?: number;
  /** 单个排序字段（兼容旧格式） */
  sortField?: string;
  /** 排序方向（兼容旧格式） */
  sortOrder?: 'asc' | 'desc';
  /** 其他查询参数（兼容旧格式） */
  [key: string]: any;
}

/**
 * API 响应数据类型 - 支持多种响应格式
 */
export interface DDVTableApiResponse {
  /** 响应码 */
  code?: string | number;
  /** 是否成功 */
  success?: boolean;
  /** 响应消息 */
  msg?: string;
  /** 响应体（部分接口使用） */
  body?: {
    /** 数据列表 */
    rows?: any[];
    /** 总记录数 */
    rowCount?: number;
    /** 其他数据 */
    [key: string]: any;
  };
  /** 数据对象（部分接口使用） */
  data?: {
    /** 数据列表 */
    list?: any[];
    /** 总记录数 */
    total?: number;
    /** 总记录数（兼容格式） */
    rowCount?: number;
    /** 数据列表（兼容格式） */
    rows?: any[];
    /** 当前页码 */
    pageNum?: number;
    /** 每页条数 */
    pageSize?: number;
    /** 其他数据 */
    [key: string]: any;
  };
  /** 直接数组格式 */
  rows?: any[];
  /** 其他响应字段 */
  [key: string]: any;
}

/**
 * DDVTable 组件属性
 */
export interface DDVTableProps {
  /** 列表相关配置 */
  config?: DDVTableConfig;
  /** 列表数据 - 直接传入数据时使用 */
  data?: DDVTableData;
  /** API 查询参数 - API 模式时使用 */
  apiParams?: DDVTableApiQueryParams;
  /** 是否自动加载数据（API 模式有效，默认 true） */
  autoLoad?: boolean;
  /** 自定义格式化函数映射 */
  customFormatters?: Record<string, (value: any) => string>;
  /** 表格就绪回调 */
  onReady?: (tableInstance: any) => void;
  /** 点击单元格回调 */
  onCellClick?: (args: any) => void;
  /** 排序变化回调 */
  onSort?: (args: any) => void;
  /** 增加按钮点击回调（新建表单） */
  onAdd?: () => void;
  /** 修改按钮点击回调（编辑表单） */
  onEdit?: (rowData?: any) => void;
  /** 删除按钮点击回调 */
  onDelete?: (rowData?: any) => void;
  /** 设置按钮点击回调 */
  onSetting?: (config: DDVTableSettingConfig) => void;
  /** 操作列编辑按钮点击回调 */
  onRowEdit?: (rowData: any, tableInstance: any) => void;
  /** 操作列删除按钮点击回调 */
  onRowDelete?: (rowData: any, tableInstance: any) => void;
  /** 操作列详情按钮点击回调 */
  onRowDetail?: (rowData: any, tableInstance: any) => void;
  /** 选择变化回调（复选框/单选框选中变化时触发） */
  onSelectionChange?: (selectedRows: any[], selectedKeys: any[]) => void;
  /** 过滤变化回调 */
  onFilter?: (filterRules: DDVTableFilterRule[]) => void;
  /** 加载状态变化回调（API 模式有效） */
  onLoadingChange?: (loading: boolean) => void;
  /** 数据加载完成回调（API 模式有效） */
  onDataLoad?: (data: DDVTableData, response: DDVTableApiResponse) => void;
  /** 数据加载失败回调（API 模式有效） */
  onError?: (error: any) => void;
  /** 刷新按钮点击回调（点击刷新按钮时触发） */
  onRefresh?: (selectedRows?: any[]) => void;
  /** 表单保存回调，返回 Promise 或 void */
  onFormSave?: (values: any, formType: 'add' | 'edit', record?: any) => Promise<void> | void;
  /** 表单加载数据完成后回调（用于编辑时回填数据） */
  onFormDataLoaded?: (form: any, record: any) => void;
  /**
   * 自定义工具栏按钮 handler 映射
   * 键名匹配 config.customer_toolbar[i].func
   * 主调用通道；未命中时回退到 window[handlerName]
   */
  onCustomBtn?: Record<string, (param: any) => void>;
}
