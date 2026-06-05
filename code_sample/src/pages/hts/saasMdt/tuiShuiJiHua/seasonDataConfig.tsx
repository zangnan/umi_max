/**
 * title: 退税计划-季度
 */
import myUtil from '@/pages/common/myUtil';
const seasonConfig: any = {};

// 配置项
seasonConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
seasonConfig.grid_selection_type = "checkbox";                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
seasonConfig.grid_show_data_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
seasonConfig.click_checked = '1';                                 // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
seasonConfig.grid_row_key = 'uuid';                               // 列表主键，默认uuid
seasonConfig.unit_key = 'CX_SAAS_MDT_TUISHUIJIHUA_SEASON'; // 业务单元key，对应后端接口
// seasonConfig.export_key = 'TUISHUIJIHUA_MONTHDATA_QUERY_DC'; // 业务单元key，对应后端接口
seasonConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出
seasonConfig.module_type = 'QZ_type';
seasonConfig.layout_type = 'tz';                                // 页面类型，默认default 可选 default modal tabs tz台账

// 配置列表列
seasonConfig.grid_columns = [
  { title: '年度', dataIndex: 'nd', width: 100, align: 'center',fixed: 'left' },
  { title: '季度', dataIndex: 'jd', width: 100, align: 'center',fixed: 'left' },
  { title: '计划退税额（元）', dataIndex: 'jhytse1', width: 160, align: 'right', sum: true,render: (text: any) => (myUtil.text.formatNum(text, '0,0.00'))},
  { title: '已使用计划退税额（元）', dataIndex: 'sjytse1', width: 180, align: 'right', sum: true,render: (text: any) => (myUtil.text.formatNum(text, '0,0.00'))},
  { title: '计划余额（元）', dataIndex: 'jhytse1ye', width: 150, align: 'right', sum: true,render: (text: any) => (myUtil.text.formatNum(text, '0,0.00'))},
  { title: '备注', dataIndex: 'bz', width: 150, ellipsis: true, align: 'left' },
  { title: '录入人', dataIndex: 'lrr', width: 120, align: 'left' },
  { title: '录入时间', dataIndex: 'lrrq', width: 150, align: 'center', render: { type: 'date', format: 'yyyy-MM-DD HH:mm:ss' }},
  { title: '修改人', dataIndex: 'xgr', width: 120, align: 'left' },
  { title: '修改时间', dataIndex: 'xgrq', width: 150, align: 'center', render: { type: 'date', format: 'yyyy-MM-DD HH:mm:ss' }},
];

//外贸
seasonConfig.wm_grid_columns = [
  { title: '年度', dataIndex: 'nd', width: 100, align: 'center',fixed: 'left' },
  { title: '季度', dataIndex: 'jd', width: 100, align: 'center',fixed: 'left' },
  { title: '计划退税额（元）', dataIndex: 'jhtse', width: 120, align: 'right', sum: true,render: (text: any) => (myUtil.text.formatNum(text, '0,0.00'))},
  { title: '已使用计划退税额（元）', dataIndex: 'sjtse', width: 150, align: 'right', sum: true,render: (text: any) => (myUtil.text.formatNum(text, '0,0.00'))},
  { title: '计划余额（元）', dataIndex: 'jhtseye', width: 120, align: 'right', sum: true,render: (text: any) => (myUtil.text.formatNum(text, '0,0.00'))},
  { title: '备注', dataIndex: 'bz', width: 150, ellipsis: true, align: 'left' },
  { title: '录入人', dataIndex: 'lrr', width: 120, align: 'left' },
  { title: '录入时间', dataIndex: 'lrrq', width: 150, align: 'center', render: { type: 'date', format: 'yyyy-MM-DD HH:mm:ss' }},
  { title: '修改人', dataIndex: 'xgr', width: 120, align: 'left' },
  { title: '修改时间', dataIndex: 'xgrq', width: 150, align: 'center', render: { type: 'date', format: 'yyyy-MM-DD HH:mm:ss' }},
];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
seasonConfig.filter_items = [
  { name: 'nd', label: '年度', type: 'Input' },
  { name: 'jd', label: '季度', type: 'Select', codeTable: ['CODE_STATIC_DM_JD', '01']},
  { name: 'bz', label: '备注', type: 'Input' },
];


// 配置项：工具栏
seasonConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
  delete: false,
  add: false,
  edit: false,
  upload: false,                    // 是否显示导入按钮，默认关闭
  tssb_download: false,              // 是否显示导出按钮，默认关闭
};

// 配置项：自定义工具栏
seasonConfig.costomer_toobar = [
  { name: '新增', func: 'seasonAdd' },
  { name: '修改', func: 'seasonModify' },
  { name: '删除', func: 'monthDel' },
  { name: '导出', key: 'dc', func: 'seasonDownload' },
];

export default seasonConfig;
