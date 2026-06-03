/**
 * title: 退税计划-月度
 */
const monthConfig: any = {};

// 配置项
monthConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
monthConfig.grid_selection_type = "checkbox";                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
monthConfig.grid_show_data_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
monthConfig.click_checked = '1';                                 // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
monthConfig.grid_row_key = 'uuid';                               // 列表主键，默认uuid
monthConfig.unit_key = 'CX_SAAS_MDT_TUISHUIJIHUA'; // 业务单元key，对应后端接口
monthConfig.export_key = 'SAAS_TUISHUISHUJU_YD_EXPORT'; // 业务单元key，对应后端接口
monthConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出
monthConfig.module_type = 'QZ_type';
monthConfig.layout_type = 'tz';                                // 页面类型，默认default 可选 default modal tabs tz台账



// 配置列表列
monthConfig.grid_columns = [
  { title: '年月', titleTooltip: '退税申报的自然年月', dataIndex: 'tjqDm', width: 100, ellipsis: true, align: 'center',fixed: 'left' },
  {
    title: '计划', dataIndex: 'jh', children: [
      { title: '退税额（元）', dataIndex: 'jhytse1', width: 120, align: 'right', sum: true,  render: { type: 'number', format: '0,0.00' } },
      { title: '免抵额（元）', dataIndex: 'jhmdse', width: 120, align: 'right', render: { type: 'number', format: '0,0.00' } },
    ]
  },
  {
    title: '已使用计划', dataIndex: 'ysyjh', children: [
      { title: '退税额（元）', dataIndex: 'sjytse1', width: 120, align: 'right', sum: true,  render: { type: 'number', format: '0,0.00' } },
      { title: '免抵额（元）', dataIndex: 'sjmdse', width: 120, align: 'right', render: { type: 'number', format: '0,0.00' } },
    ]
  },
  { title: '计划退税额余额（元）', dataIndex: 'jhytse1ye', width: 180, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' }},
  { title: '备注', dataIndex: 'bz', width: 150, ellipsis: true, align: 'left' },
  { title: '录入人', dataIndex: 'lrr', width: 120, align: 'left' },
  { title: '录入时间', dataIndex: 'lrrq', width: 150, align: 'center', render: { type: 'date', format: 'yyyy-MM-DD HH:mm:ss' }},
  { title: '修改人', dataIndex: 'xgr', width: 120, align: 'left' },
  { title: '修改时间', dataIndex: 'xgrq', width: 150, align: 'center', render: { type: 'date', format: 'yyyy-MM-DD HH:mm:ss' }},
];

//外贸
monthConfig.wm_grid_columns = [
  { title: '年月', titleTooltip: '退税申报的自然年月', dataIndex: 'tjqDm', width: 100, ellipsis: true, align: 'center',fixed: 'left' },
  { title: '计划退税额（元）', dataIndex: 'jhtse', width: 150, align: 'right', sum: true,  render: { type: 'number', format: '0,0.00' } },
  { title: '已使用计划退税额（元）', dataIndex: 'sjtse', width: 180, align: 'right', sum: true,  render: { type: 'number', format: '0,0.00' } },
  { title: '申报次数', dataIndex: 'sbcs', width: 80, align: 'right' },
  { title: '计划退税额余额（元）', dataIndex: 'jhtseye', width: 180, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' }},
  { title: '备注', dataIndex: 'bz', width: 150, ellipsis: true, align: 'left' },
  { title: '录入人', dataIndex: 'lrr', width: 120, align: 'left' },
  { title: '录入时间', dataIndex: 'lrrq', width: 150, align: 'center', render: { type: 'date', format: 'yyyy-MM-DD HH:mm:ss' }},
  { title: '修改人', dataIndex: 'xgr', width: 120, align: 'left' },
  { title: '修改时间', dataIndex: 'xgrq', width: 150, align: 'center', render: { type: 'date', format: 'yyyy-MM-DD HH:mm:ss' }},
];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
monthConfig.filter_items = [
  { name: 'sbny', label: '申报年或申报年月', type: 'Input' },
  { name: 'bz', label: '备注', type: 'Input' },
];


// 配置项：工具栏
monthConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
  delete: false,
  add: false,
  edit: false,
  upload: false,                    // 是否显示导入按钮，默认关闭
  tssb_download: true,              // 是否显示导出按钮，默认关闭
};

// 配置项：自定义工具栏
monthConfig.costomer_toobar = [
  { name: '新增', func: 'monthAdd' },
  { name: '修改', func: 'monthModify' },
  { name: '删除', func: 'monthDel' },
];

export default monthConfig;
