import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 申报结果查询的计划分配率数据
 * author: zxy
 */
const jhfplsjConfig: any = {};

// 配置项
jhfplsjConfig.api_grid_query = `/hts/ckts/mdthx/queryJhfplsjYsbMainPage`;   // api 列表查询
jhfplsjConfig.grid_click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
jhfplsjConfig.grid_selection_type = false;                                               // 列表首选项类别，默认 checkbox，可选 false radio checkbox
// jhfplsjConfig.toolbar_show_grid_checked_num = false;                                                // 工具栏左侧是否显示数据条数及选中数，默认显示
// jhfplsjConfig.show_toolbar = false;                                                   // 是否开启工具栏，默认开启
// jhfplsjConfig.form_save_check = false;                                                // 表单编辑是否执行后端校验
// jhfplsjConfig.form_api_check=`/yw/bszx/wbsj/bgd/checkCkbgdh`;          // api 表单校验
// jhfplsjConfig.grid_title = '报关单';                                                  // 列表标题，可选
jhfplsjConfig.layout_type = 'tabs';



// 配置项：列表操作列
jhfplsjConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};

// 配置项：工具栏
jhfplsjConfig.toolbar_default = {
  add: false,                   // 是否显示增加按钮，默认开启
  delete: false,                // 是否显示删除按钮，默认开启
  ckts_download: false,              // 是否显示下载按钮，默认开启
  upload: false,                // 是否显示上传按钮，默认开启
  setting: true,
  full: true,                   // 是否显示全屏按钮，默认开启
  reload: true
};

// 配置项：列表列
jhfplsjConfig.grid_columns = [
  { title: '所属期', dataIndex: 'ssq', width: 95 },
  { title: '上年度已核销手（账）册实际分配率', dataIndex: 'sndyhxszcsjfpl', width: 105, align: 'right', render: { type: 'number', format: '0,0.00000' } },
];

jhfplsjConfig.customer_toolbar = [];
jhfplsjConfig.handle_columns = [];
export default jhfplsjConfig;