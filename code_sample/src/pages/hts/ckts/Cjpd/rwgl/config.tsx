

const rwConfig: any = {};

// 配置项
rwConfig.unit_key = 'MTS_SJPP_PDRW_QUERY_PAGE';                  // 业务单元key，对应后端接口
rwConfig.grid_row_key = 'pduuid';
rwConfig.grid_show_serial_number = false;                      // 工具栏左侧是否显示数据条数及选中数，默认true显示
rwConfig.click_checked = '1';                                 // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选   
rwConfig.grid_selection_type = "checkbox";   

// 配置列表列
rwConfig.grid_columns = [
  { title: '任务状态', fixed: 'left',  dataIndex: 'tzpdztDm', width: 90, codeTable: ['CODE_DM_ZXSB_TZPDZT_MC', '01'],
    filter: {
    type: 'Select',
    codeTable: ['CODE_DM_ZXSB_TZPDZT_MC', '01'],
  } },
  { title: '任务名称', dataIndex: 'pdrwlxDm', width: 150, align: 'left',  codeTable: ['CODE_DM_ZXSB_PDRWLX', '01'],
    filter: {
    type: 'Select',
    codeTable: ['CODE_DM_ZXSB_PDRWLX', '01'],
  } },
  { title: '任务描述', dataIndex: 'xxnr1', width: 180, ellipsis: true},
  { title: '配单条件', dataIndex: 'srcs1', width: 180, ellipsis: true,render: { func: 'renderPdtj' }},
  { title: '配单操作人', dataIndex: 'pdczrxm', width: 100, ellipsis: true},
  { title: '配单开始时间', dataIndex: 'zxkssj', width: 160,ellipsis: true, sorter: true, render: { type: 'date', format: 'yyyy-MM-DD HH:mm:ss' } },
  { title: '配单结束时间', dataIndex: 'zxjssj', width: 160,ellipsis: true, sorter: true, render: { type: 'date', format: 'yyyy-MM-DD HH:mm:ss' } },
  { title: '生成条件', dataIndex: 'sccs2', width: 180, ellipsis: true,render: { func: 'renderSctj' }},
  { title: '生成操作人', dataIndex: 'scczrxm', width: 100, ellipsis: true},
  { title: '生成开始时间', dataIndex: 'scsj', width: 160,ellipsis: true, sorter: true, render: { type: 'date', format: 'yyyy-MM-DD HH:mm:ss' } },
  { title: '生成结束时间', dataIndex: 'sjscsj', width: 160,ellipsis: true, sorter: true, render: { type: 'date', format: 'yyyy-MM-DD HH:mm:ss' } },
  { title: '操作', width: 200, fixed: 'right', align: 'center',  render: { func: 'renderPdrwcz' } },
];


// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
rwConfig.filter_items = [
  { name: 'sjgjsjmc', label: '任务名称', type: 'Input' },
  { name: 'zxkssj', label: '配单开始时间', type: 'DatePicker', range: true },
  { name: 'scsj', label: '生成开始时间', type: 'DatePicker', range: true },
];

// 配置项：工具栏
rwConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
  delete: true,  
};


export default rwConfig;
