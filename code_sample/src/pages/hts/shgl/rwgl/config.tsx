
const config: any = {};

config.unit_key = 'CX_SHGL_RWGL_LBCX';                  // 业务单元key，对应后端接口
config.grid_row_key = 'uuid';
config.grid_show_serial_number = false;                      // 工具栏左侧是否显示数据条数及选中数，默认true显示
config.click_checked = '1';                                 // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选   
config.grid_selection_type = "checkbox";   
config.module_type = 'QZ_type';

config.grid_columns = [

  { title: '任务名称', dataIndex: 'shrwlxDm', width: 150, align: 'left',  codeTable: ['CODE_DM_ZXSB_SHRWLX', '01'],
    filter: {
    type: 'Select',
    codeTable: ['CODE_DM_ZXSB_SHRWLX', '01'],
  } },
  { title: '任务条件', dataIndex: 'csz1', width: 120, ellipsis: true},
  {
    title: '任务执行状态', dataIndex: 'xzztDm', width: 130, align: 'left', ellipsis: true, codeTable: ['code_dm_zxsb_xzzt', '02'], filter: {
      type: 'ZdySelect',
      codeTable: 'CODE_SHGL_RWGL_ZDY_RWZT',
    }
  },
  { title: '任务执行情况', dataIndex: 'xxnr1', width: 180, ellipsis: true},
  { title: '任务开始时间', dataIndex: 'zxkssj', width: 160,ellipsis: true, sorter: true, render: { type: 'date', format: 'yyyy-MM-DD HH:mm:ss' } },
  { title: '任务结束时间', dataIndex: 'zxjssj', width: 160,ellipsis: true, sorter: true, render: { type: 'date', format: 'yyyy-MM-DD HH:mm:ss' } },
  { title: '操作', width: 200, fixed: 'right', align: 'center',  render: { func: 'renderShrwglcz' } },
];
config.grid_filter_quick = [
  { name: 'rwsj', label: '执行时间', type: 'DatePicker', width: '3w', format: 'YYYY-MM-DD', range: true },
];
// 配置项：工具栏
config.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
  delete: false,
};

// 配置项：自定义工具栏
config.costomer_toobar = [
  { name: '删除', func: 'handlerDel' },
];

export default config;