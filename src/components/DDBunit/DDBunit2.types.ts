/**
 * DDBunit2 组件类型定义与常量
 */

/** 组件 props 类型 */
export interface DDBunit2Props {
  /** 配置对象 */
  config: DDBunit2Config;
  /** 回调函数 */
  func?: DDBunit2Func;
  /** 权限配置 */
  authority?: DDBunit2Authority;
  /** 组件引用 */
  refDDBunit2?: React.Ref<any>;
}

/** 配置对象类型 */
export interface DDBunit2Config {
  // 基础信息
  module_type?: string;
  module_key?: string;
  page_id?: string;
  grid_setting_sort?: any;

  // 表单配置
  form_title?: string;
  form_layout_type?: string;
  form_width?: number | string;
  get_edit_value_by_grid?: boolean;
  form_submit_type?: string;
  form_items?: any[];
  form_save_check?: boolean;

  // 表格配置
  gridIsInitSearch?: boolean;
  grid_click_checked?: boolean;
  grid_row_key?: string;
  delete_key?: string;
  grid_show_serial_number?: boolean;
  grid_handle_columns_default?: any;
  handle_columns?: any[];
  grid_border?: boolean;
  grid_scroll_x?: number | string;
  grid_scroll_y?: number | string;
  grid_sticky_affix?: any;
  gridParams?: any;
  grid_type_switch?: boolean;
  grid_list_card_type?: string;
  grid_list_card_field?: string;
  grid_list_card_render?: any;
  grid_list_card_action?: any;
  grid_handle_width?: number;
  grid_type?: string;
  grid_pagination?: any;
  grid_title?: string | { type: string; func?: string };
  grid_sum_field?: Array<{ field: string; label?: string; format?: string; unit?: string }>;
  grid_columns?: any[];
  grid_filter_quick?: any[];
  grid_setting_filter_advanced?: any;

  // 工具栏配置
  toolbar_default?: {
    download?: boolean;
    download_config?: { type?: 'front' | 'back' };
    upload?: boolean;
    reload?: boolean;
    full?: boolean;
    setting?: boolean;
    advanced_filter?: boolean;
    statistics?: boolean;
    add?: boolean;
    edit?: boolean;
    delete?: boolean;
    delete_by_condition?: boolean;
    download_pdf?: boolean;
  };
  toolbar_open?: boolean;
  toolbar_show_grid_checked_num?: boolean;
  customer_toolbar?: any[];

  // API 配置
  api_grid_query?: string;
  api_form_delete?: string;
  api_form_query?: string;
  api_form_edit?: string;
  api_form_check?: string;
  api_excel_export?: string;
  api_excel_import?: string;
  api_excel_template?: string;

  // 布局配置
  layout_type?: string;
  toobar_affix?: any;
  grid_selection_type?: 'checkbox' | 'radio' | false;

  // 筛选配置
  filter_items?: any[];

  // 其他配置
  leaf_config?: any;
  backend_dev_dict?: { appModule?: { appModulePath?: string } };
}

/** 回调函数类型 */
export interface DDBunit2Func {
  refUnit?: React.Ref<any>;
  initAddForm?: (params: any) => void;
  handleExport?: (params: any) => void;
  handlePrint?: (params: any) => void;
  rowSelection?: (params: any) => void;
  onSelect?: (params: any) => void;
  onSelectAll?: (params: any) => void;
  useEffectEnd?: (params: any) => void;
  afterReload?: (params: any) => void;
  getOtherRef?: () => any[];
  [key: string]: any;
}

/** 权限配置类型 */
export interface DDBunit2Authority {
  toolbar_default?: {
    delete_by_condition?: boolean;
    add?: boolean;
    edit?: boolean;
    delete?: boolean;
    setting?: boolean;
    full?: boolean;
    download?: boolean;
    download_pdf?: boolean;
    upload?: boolean;
    reload?: boolean;
    statistics?: boolean;
    advanced_filter?: boolean;
  };
  grid_handle_columns_defaul?: {
    edit?: boolean;
    delete?: boolean;
    detail?: boolean;
  };
}

/** 业务单元导出接口 */
export interface DDBunit2ImperativeHandle {
  setMasker: (value: boolean) => void;
  getSelectionRowKeys: () => any[];
  getSelectionRows: () => any[];
  getGridParams: () => any;
  getOtherRefs: () => any[];
  handleCustomerToobarBtn: () => any;
  getGridData: () => any;
  setSelectionRowKeys: (keys: any[]) => void;
  setSelectionRows: (rows: any[]) => void;
  reload: (adfTreeOnEdit?: any) => void;
  addQueryModel: (val: any, name: any) => void;
  handleReset: () => void;
  handleModalVisible: (visible: boolean) => void;
  setFormType: (type: string) => void;
  form: any;
  setFormItems: (items: any[]) => void;
  formItems: any[];
  refGrid: React.RefObject<any>;
}

// ==================== 常量定义 ====================

/** 硬编码文本常量 */
export const DDBUNIT2_CONSTANTS = {
  // 按钮文本
  BTN_ADD: '新建',
  BTN_EDIT: '编辑',
  BTN_DELETE: '删除',
  BTN_FILTER_DELETE: '筛选删除',
  BTN_EXPORT: '导出',
  BTN_IMPORT: '导入',
  BTN_REFRESH: '刷新',
  BTN_FULLSCREEN: '全屏',
  BTN_EXIT_FULLSCREEN: '退出全屏',
  BTN_PRINT: '打印',
  BTN_PDF_EXPORT: 'PDF导出',
  BTN_CHART_STATISTICS: '图表统计',
  BTN_FILTER: '筛选',
  BTN_SAVE: '保存',
  BTN_CLOSE: '关闭',

  // 弹窗标题
  MODAL_TITLE_ADD: '采集',
  MODAL_TITLE_EDIT: '编辑',
  MODAL_TITLE_DETAIL: '详情',
  MODAL_TITLE_ADVANCED_FILTER: '高级筛选',
  MODAL_TITLE_STATISTICS: '统计',

  // 提示信息
  MSG_EXPORT_LIMIT: '本次导出的数据条数已超过上限（5万条），无法导出。',
  MSG_PRINT_LIMIT: '本次打印的数据条数已超过上限（5千条），无法打印。',
  MSG_PRINT_TITLE: '打印数据',

  // 文件名
  EXPORT_FILE_NAME: '导出数据.xlsx',

  // 视图设置
  VIEW_RESET: '重置',
  VIEW_DELETE_TITLE: '删除',

  // 快捷键
  SHORTCUT_KEYS_ENABLED: false,

  // 默认值
  DEFAULT_ROW_KEY: 'uuid',
  DEFAULT_DELETE_KEY: 'uuids',
  DEFAULT_SELECTION_TYPE: 'checkbox',
  DEFAULT_LAYOUT_TYPE: 'default',
  DEFAULT_MODAL_WIDTH: 800,
} as const;

/** 导出限制常量 */
export const EXPORT_LIMITS = {
  EXCEL_MAX_ROWS: 50000,
  PRINT_MAX_ROWS: 5000,
} as const;

/** 表格类型常量 */
export const GRID_TYPE = {
  EMPTY: '',
  LIST: 'list',
  GRID: 'grid',
} as const;

/** 导出类型常量 */
export const EXPORT_TYPE = {
  FRONT: 'front',
  BACK: 'back',
} as const;

/** 表单类型常量 */
export const FORM_TYPE = {
  ADD: 'add',
  EDIT: 'edit',
} as const;
