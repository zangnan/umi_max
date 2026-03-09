import logo from '@/assets/css/img/logo_rpa.png';
import logo_dark from '@/assets/css/img/logo_rpa_dark.png';
import { AppstoreOutlined } from '@ant-design/icons';

let GRID_PAGINATION_PAGESIZE = 10;
let GRID_PAGINATION_PAGESIZE_OPTIONS = [10, 20, 50, 100, 500];
let GRID_PAGINATION_SHOW_QUICK_JUMPER = false;
let GRID_SHOW_TOTAL_TEXT = true;

const ROUTE_LOGIN = '/user/login';
const ROUTE_INIT = '/easy_dev/init';
const ROUTE_INIT_DC = '/easy_dev_dc/init';
const ROUTE_LOGIN_REDIRECT_DEFAULT = '/sys/user_setting';
const ROUTE_LOGIN_REDIRECT_DEFAULT_DC = '/easy_dev_dc/sys/sys_user_setting';
const ROUTE_LOGIN_EXT = '/user/transition';
const ROUTE_AI_X = '/ai/x';

let CC: any = {
  SYS_TITLE: SYS_TITLE,
  SYS_COPYRIGHT: 'Copyright © 2024 - 2025 TaxRefund.com.cn All Right Reserver By 大连龙图信息技术股份有限公司',
  SYS_LOGO: logo,
  SYS_LOGO_DARK: logo_dark,
  SYS_LOGO_FONT: <AppstoreOutlined />,
  // 弹窗
  C_MODAL_WIDTH_X1: 480,
  C_MODAL_WIDTH_X2: 720,
  C_MODAL_WIDTH_X3: 960,
  C_MODAL_WIDTH_X4: 1200,
  C_MODAL_WIDTH_X5: 1400,
  C_MODAL_WIDTH_MAX: 'max',
  // 布局
  LAYOUT_HEADER_HEIGHT: 44,
  LAYOUT_TOOLBAR_HEIGHT: 50,
  // 列表
  GRID_PAGINATION_PAGESIZE: GRID_PAGINATION_PAGESIZE,
  GRID_PAGINATION_PAGESIZE_OPTIONS,
  GRID_PAGINATION_SHOW_QUICK_JUMPER,
  GRID_SHOW_TOTAL_TEXT,
  GRID_PAGINATION: {
    current: 1,
    pageSize: GRID_PAGINATION_PAGESIZE,
    total: 0,
    size: 'default',
    hideOnSinglePage: false,
    showSizeChanger: true,
    showQuickJumper: GRID_PAGINATION_SHOW_QUICK_JUMPER,
    pageSizeOptions: GRID_PAGINATION_PAGESIZE_OPTIONS,
    showTotal(total: any, range: any[]) {
      return GRID_SHOW_TOTAL_TEXT ? `共${total}条，当前${range[0]}到${range[1]}条` : '';
    },
  },
  // 筛选条件
  FILTER_CONDITION: {
    range: { condetionCode: 'range', conditionDescChi: '范围', conditionCodeDesc: 'range' },
    equal: { condetionCode: 'eq', conditionDescChi: '等于', conditionCodeDesc: '=' },
    notEqual: { condetionCode: 'neq', conditionDescChi: '不等于', conditionCodeDesc: '<>' },
    greaterThan: { condetionCode: 'dy', conditionDescChi: '大于', conditionCodeDesc: '>' },
    greaterThanOrEqual: { condetionCode: 'dydy', conditionDescChi: '大于等于', conditionCodeDesc: '>=' },
    lessThan: { condetionCode: 'xy', conditionDescChi: '小于', conditionCodeDesc: '<' },
    lessThanOrEqual: { condetionCode: 'xydy', conditionDescChi: '小于等于', conditionCodeDesc: '<=' },
    include: { condetionCode: 'alike', conditionDescChi: '包含', conditionCodeDesc: 'like' },
    notInclude: { condetionCode: 'notlike', conditionDescChi: '不包含', conditionCodeDesc: 'not like' },
    startWith: { condetionCode: 'llike', conditionDescChi: '已...开头', conditionCodeDesc: 'llike' },
    startEnd: { condetionCode: 'rlike', conditionDescChi: '已...结尾', conditionCodeDesc: 'rlike' },
    isNull: { condetionCode: 'isEmpty', conditionDescChi: '为空', conditionCodeDesc: 'is null' },
    isNotNull: { condetionCode: 'isNotEmpty', conditionDescChi: '不为空', conditionCodeDesc: 'is not null' },
    in: { condetionCode: 'in', conditionDescChi: '包含', conditionCodeDesc: 'in' },
    notIn: { condetionCode: 'notIn', conditionDescChi: '不包含', conditionCodeDesc: 'not in' },
  },
  // 主题
  DEFAULT_THEME_GRID_BORDER: true,
  DEFAULT_THEME_GRID_SIZE: 'small',
  DEFAULT_THEME_RADIUS: 'theme_radius_4px',
  DEFAULT_THEME_SKIN: 'skin01',
  DEFAULT_THEME_FORM_ITEM_LAYOUT: 'vertical',
  DEFAULT_THEME_FORM_ITEM_LABEL_SHOW: true,
  DEFAULT_THEME_LAYOUT: 'side', // top side mix
  DEFAULT_THEME_FIXED_HEADER: true,
  DEFAULT_THEME_COMPACT: 'theme_compact_false',
  DEFAULT_THEME_FONT_SIZE: 'theme_font_size_14px',
  DEFAULT_THEME_GRID_PAGINATION_PAGESIZE: GRID_PAGINATION_PAGESIZE,
  // filter grid layout
  DEFAULT_FILTER_LAYOUT_33P_ROW: {
    xs: {span: 23, offset:1, pull: 1},
    sm: {span: 23, offset:1, pull: 1},
    md: {span: 23, offset:1, pull: 1},
    lg: {span: 11, offset:1, pull: 1},
    xl: {span: 7, offset:1, pull: 1},
    xxl: {span: 7, offset:1, pull: 1}
  },
  DEFAULT_FILTER_LAYOUT_66P_ROW: { // 日期范围控件等较长录入组件
    xs: {span: 23, offset:1, pull: 1},
    sm: {span: 23, offset:1, pull: 1},
    md: {span: 23, offset:1, pull: 1},
    lg: {span: 23, offset:1, pull: 1},
    xl: {span: 15, offset:1, pull: 1},
    xxl: {span: 15, offset:1, pull: 1},
  },
  DEFAULT_FILTER_LAYOUT_100P_ROW: { // 日期范围控件等较长录入组件
    xs: {span: 23, offset:1, pull: 1},
    sm: {span: 23, offset:1, pull: 1},
    md: {span: 23, offset:1, pull: 1},
    lg: {span: 23, offset:1, pull: 1},
    xl: {span: 23, offset:1, pull: 1},
    xxl: {span: 23, offset:1, pull: 1},
  },
  DEFAULT_FILTER_LAYOUT_50P_ROW: { // 用于侧滑列表中
    xs: {span: 23, offset:1, pull: 1},
    sm: {span: 23, offset:1, pull: 1},
    md: {span: 23, offset:1, pull: 1},
    lg: {span: 11, offset:1, pull: 1},
    xl: {span: 11, offset:1, pull: 1},
    xxl: {span: 11, offset:1, pull: 1}
  },
  DEFAULT_FORM_LAYOUT_33P_ROW: { // 表单项目默认占1/3显示，所有表单项默认规则
    xs: {span: 24, offset: 0, pull: 0},
    sm: {span: 24, offset: 0, pull: 0},
    md: {span: 24, offset: 0, pull: 0},
    lg: {span: 12, offset: 0, pull: 0},
    xl: {span: 8, offset: 0, pull: 0},
    xxl: {span: 8, offset: 0, pull: 0},
  },
  DEFAULT_FORM_LAYOUT_100P_ROW: { // 表单项目默认占整行显示，如备注字段、多选字段
    xs: {span: 24, offset: 0, pull: 0},
    sm: {span: 24, offset: 0, pull: 0},
    md: {span: 24, offset: 0, pull: 0},
    lg: {span: 24, offset: 0, pull: 0},
    xl: {span: 24, offset: 0, pull: 0},
    xxl: {span: 24, offset: 0, pull: 0},
  },
  DEFAULT_FORM_LAYOUT_66P_ROW: { // 表单项目默认占2/3显示，如日期范围字段、多选字段
    xs: {span: 24, offset: 0, pull: 0},
    sm: {span: 24, offset: 0, pull: 0},
    md: {span: 24, offset: 0, pull: 0},
    lg: {span: 24, offset: 0, pull: 0},
    xl: {span: 16, offset: 0, pull: 0},
    xxl: {span: 16, offset: 0, pull: 0},
  },
  DEFAULT_DESCRIPTION_LAYOUT_33P_ROW: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 },  // 表单Description项目默认占1/3显示，所有表单项默认规则
  DEFAULT_DESCRIPTION_LAYOUT_66P_ROW: { xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 },  // 表单Description项目默认占2/3显示，如日期范围字段、多选字段
  DEFAULT_DESCRIPTION_LAYOUT_100P_ROW: { xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }, // 表单Description项目默认占整行显示，如备注字段、多选字段
  LOGIN: {
    ACCESS_TOKEN_KEY: 'accessToken', // localstore中关键字
    HEADER_TOKEN_KEY: 'accessToken',// 请求时headers中关键字
  },
  DEFAULT_API: {
    GRID_QUERY: '/dict/automatic/exp/bs/queryPager',
    GRID_QUERY_CUSTOMER: '/dict/automatic/exp/bs/queryPagerCustomer',
    FORM_DELETE: '/dict/automatic/exp/bs/delete',
    FORM_QUERY: '/dict/automatic/exp/bs/queryForm',
    FORM_EDIT: '/dict/automatic/exp/bs/saveOrUpdate',
    EXCEL_EXPORT: '/dict/automatic/exp/bs/export',
    EXCEL_IMPORT: '/dict/automatic/exp/bs/import',
    EXCEL_TEMPLATE: '/dict/automatic/exp/bs/template',
    FORM_CHECK: '/hx/ty/check/callServiceCheck',
  },
  ROUTE: {
    LOGIN: ROUTE_LOGIN,
    INIT: ROUTE_INIT,
    INIT_DC: ROUTE_INIT_DC,
    ROUTE_LOGIN_REDIRECT_DEFAULT,
    ROUTE_LOGIN_REDIRECT_DEFAULT_DC,
  },
  WHITE_LIST: [ ROUTE_LOGIN, ROUTE_INIT, ROUTE_INIT_DC, ROUTE_LOGIN_EXT, ROUTE_AI_X ],
  WHITE_LIST_ROUTER: [ ROUTE_INIT, ROUTE_INIT_DC ],
  RESPONSE: {
    CODE_SUCCESS: '200',
    MESSAGE_KEY_ERROR: 'msg',
    MESSAGE_KEY_SUCCESS: 'msg',
  },
  OPEN_RESOURCE_AUTHORITY: true, // 是否开启资源权限判断
  DICT_MODULE_RESOURCE: {
    // 工具类默认
    TOOLBAR_DEFAULT_DELETE_BY_CONDITION: 'toolbar_delete_by_condition',
    TOOLBAR_DEFAULT_ADD: 'toolbar_add',
    TOOLBAR_DEFAULT_DELETE: 'toolbar_delete',
    TOOLBAR_DEFAULT_EDIT: 'toolbar_edit',
    TOOLBAR_DEFAULT_UPLOAD: 'toolbar_upload',
    TOOLBAR_DEFAULT_DOWNLOAD: 'toolbar_download',
    TOOLBAR_DEFAULT_DOWNLOAD_PDF: 'toolbar_download_pdf',
    // 列表行默认
    GRID_COL_EDIT: 'grid_col_edit',
    GRID_COL_DEL: 'grid_col_delete',
  },
  MEDIA: {
    TYPE_VIDEO: [ 'mp4', 'avi', 'mov', 'mpg', 'mpeg', 'flv', 'mov', 'rmvb', 'video' ],
    TYPE_MUSIC: [ 'mp3', 'wma', 'flac', 'aac' ],
    TYPE_PICTURED: [ 'png', 'jpg', 'gif', 'bmg', 'jpeg', 'webp', 'heif', 'picture' ],
    TYPE_EXCEL: [ 'xlsx', 'xls' ],
    TYPE_WORD: [ 'docx', 'doc' ],
    TYPE_PPT: [ 'pptx', 'ppt' ],
    TYPE_ZIP: [ 'zip' ],
  },
  CHI_CHAR_LENG: 1,
  SHORTCUT_KEYS_OPEN: false, // 是否开启快捷键
  MOCK_DATA_NUM: 1000, // 增加模拟数据调试
};
export default CC;