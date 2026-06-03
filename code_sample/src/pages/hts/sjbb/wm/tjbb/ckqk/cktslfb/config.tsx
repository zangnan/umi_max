/**
 * title: 外贸出口情况 出口退税率分布
 */
const config: any = {};

// 配置项
config.grid_title = '（单位：万元、万美元）';
config.unit_key = 'CX_SJFX_WM_CKQK_CKTSLFB';                            // 业务单元key，对应后端接口
config.page_id = 'CX_SJFX_WM_CKQK_CKTSLFB';                             // 页面id
config.export_key = 'CX_SJFX_WM_CKQK_CKTSLFB_PRINT_REPORT';
config.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
config.grid_show_data_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
config.layout_type = 'tz';                                  // 页面类型，默认default 可选 default modal tabs tz台账
config.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
config.grid_show_serial_number = true;                      // 是否显示序号，默认不显示
config.module_type = 'sjbb';

// 配置项：列表列
config.grid_columns = [
  { title: '退税率', dataIndex: 'tsl', width: 100, align: 'right' },
  {
    title: '美元离岸价（万美元）', dataIndex: 'x', children: [
      { title: '本期', dataIndex: 'mylaj', width: 140, align: 'right', sum: true, sorter: true, render: { func: 'renderMylajbq', format: '0,0.00' } },
      { title: '占比（%）', dataIndex: 'mylajbqzb', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
    ]
  },
  { title: '人民币离岸价{br}（万元）', dataIndex: 'rmblaj', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
config.grid_filter_quick = [
  { label: '出口年月', name: 'ckny', isLabel: true, type: 'DatePicker', range: true, format: 'yyyyMM', picker: 'month', allowClear: false },
];

// 配置项：工具栏
config.toolbar_default = {
  sjgxUpdateData: true,               // 是否显示更新台账数据，默认关闭
  ckts_download: true,                   // 是否显示导出，默认关闭
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};

export default config;
