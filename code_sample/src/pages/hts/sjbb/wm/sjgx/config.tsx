const config: any = {};

// 配置项
config.unit_key = 'ZXSB_TZ_RW';                            // 业务单元key，对应后端接口
config.page_id = 'ZXSB_TZ_RW';                             // 页面id
config.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
config.grid_show_data_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
config.layout_type = 'tz';                                  // 页面类型，默认default 可选 default modal tabs tz台账
config.grid_row_key = 'rwuuid';                                                     // 列表主键，默认uuid
config.module_type = 'sjbb';
config.click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选

// 配置项：列表列
config.grid_columns = [
  { title: '任务名称', dataIndex: 'tzlxmc', width: 200, ellipsis: true },
  { title: '任务编号', dataIndex: 'rwuuid', width: 150, ellipsis: true },
  { title: '查询条件', dataIndex: 'cxtj', width: 190, ellipsis: true },
  { title: '执行状态', dataIndex: 'cgbz', width: 110, render: { func: 'renderTzGxjdcx' }, filter: { type: 'Select', codeTable: ['CODE_STATIC_SJBB_ZXZT', '01'] } },
  { title: '计划完成时间', dataIndex: 'jhjssj', width: 150, render: { type: 'date', format: 'yyyy-MM-DD HH:mm' } },
  { title: '任务执行情况', dataIndex: 'xxnr', width: 180, ellipsis: true },
  { title: '任务开始时间', dataIndex: 'zxkssj', width: 150, render: { type: 'date', format: 'yyyy-MM-DD HH:mm' } },
  { title: '任务结束时间', dataIndex: 'zxjssj', width: 150, render: { type: 'date', format: 'yyyy-MM-DD HH:mm' } },
  // { title: '计划剩余时间', dataIndex: 'sysj', width: 120, render: { func: 'renderTzSysj' } },
];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
config.grid_filter_quick = [
  { name: 'zxkssj', label: '任务开始时间', isLabel: true, type: 'DatePicker', range: true },
  { name: 'tzlxmc', label: '任务名称', isLabel: true, type: 'Input', searchButton: true },
];

// 配置项：工具栏
config.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};
// 配置项：自定义工具栏
config.costomer_toobar = [
  { name: '更新报表', key: 'cs1', func: 'updateDataSjbb' },
  { name: '删除', key: 'cs2', func: 'deleteDataSjbb' },
];

export default config;
