import myUtil from '@/components/DDAssist/util';
import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 客户管理
 * author: zn
 */
const unitConfig: any = {};
// 配置项

unitConfig.grid_title = '疑点明细';
unitConfig.module_key = 'CX_HGGL_TSQK_YDLBQUERY';                            // 业务单元key，对应后端接口
unitConfig.page_id = 'CX_HGGL_TSQK_YDLBQUERY';                          // 页面id
unitConfig.grid_show_serial_number = true;                      // 是否显示序号，默认不显示
unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.toolbar_show_grid_checked_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
// unitConfig.layout_type = 'tz';                                  // 页面类型，默认default 可选 default modal tabs tz台账
// unitConfig.export_key = 'CX_SJFX_WM_TSQK_ZBBLGYSQK_PRINT_REPORT';
unitConfig.module_type = 'sjbb';
unitConfig.export_name ='疑点清册';
unitConfig.export_key = 'CX_HGGL_TSQK_YDLBQUERY_DC';                               // 业务单元key，对应后端接口




unitConfig.gridParams = { // 默认查询参数
  initSearchModal: [{ type: 1, property: "ny", value: myUtil.date.getCurrentYearMonth(), op: "zdy" }],
}

// 配置列表列
unitConfig.grid_columns = [
  { title: '疑点编号', dataIndex: 'ydbh', fixed: 'left', width: 110, align: 'center', ellipsis: true, },
  { title: '疑点级别', dataIndex: 'ydjbmc', width: 100, },
  { title: '疑点内容', dataIndex: 'ydnr', width: 300, ellipsis: true, },

  { title: '关联号', dataIndex: 'glh', width: 170, align: 'center', sorter: true},
  { title: '申报序号', dataIndex: 'sbxh', width: 90, align: 'center' },
  {
    title: '申报年月', dataIndex: 'ssq', width: 90, align: 'center', filter: {
      type: 'Input',
    }
  },
  {
    title: '批次', dataIndex: 'sbpc', width: 90, align: 'center', filter: {
      type: 'Input',
    }
  },
  { title: '疑点对象', dataIndex: 'shdxmc', width: 140, ellipsis: true, },
  { title: '指标分类', dataIndex: 'ydzbflmc', width: 140, ellipsis: true, },
  /*{ title: '疑点说明', dataIndex: 'jktjsm', width: 650, ellipsis: true, },*/
];



// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
unitConfig.grid_filter_quick = [
  // { label: '申报年月', name: 'ssq', type: 'Input', op: 'zdy' },
  // { label: '批次', name: 'sbpc', type: 'Input', op: 'zdy', searchButton: true },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: false,
  add: false,
  full: false,
  reload: false,
  download: true,
};


// 配置项：自定义工具栏
unitConfig.customer_toolbar = [
  // { name: '风险报告', func: 'fxbg' },
];


unitConfig.handle_columns = [];
export default unitConfig;
