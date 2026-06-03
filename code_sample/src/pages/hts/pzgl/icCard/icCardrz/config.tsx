// 海关IC卡操作日志
const config: any = {};

// 配置项
config.page_id = 'PZGL_HGIC_CZRZ';                           // 页面id
// config.unit_key = 'ZXSB_TZ_RW';                            // 暂时
config.grid_api_grid_query = `${API_URL_BASE}/yw/saas/pzgl/kak/queryKakCzrz`;        // api 列表查询
config.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
config.grid_show_data_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
config.layout_type = 'modal';                                  // 页面类型，默认default 可选 default modal tabs tz台账
config.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
config.export_key = 'EXCEL_REPORT_PZGL_KAK_RZ_PRINT_REPORT';

// 配置项：列表列
config.grid_columns = [
  { title: 'IC卡类型', dataIndex: 'kaklxDm', width: 140, codeTable: ['code_dm_zxsb_kaklx', '01'], filter: { type: 'Select', codeTable: ['code_dm_zxsb_kaklx', '01'] } },
  { title: 'IC卡别名', dataIndex: 'kakbm', width: 150, ellipsis: true },
  { title: '操作人', dataIndex: 'czr', width: 100, ellipsis: true },
  { title: '操作时间', dataIndex: 'lrsj', width: 170, render: { type: 'date', format: 'yyyy-MM-DD HH:mm:ss' } },
  { title: '操作内容', dataIndex: 'kakcznrDm', ellipsis: true , width: 160, codeTable: ['code_dm_zxsb_kakcznr', '01'], filter: { type: 'Select', codeTable: ['code_dm_zxsb_kakcznr', '01'] } },
  { title: '成功标志', dataIndex: 'cgbz', width: 100, render: { func: 'renderICCgbz' }, 
    filter: { 
      type: 'Radio',
      list: [
        { text: '全部', value: '' },
        { text: '成功', value: 'Y' },
        { text: '失败', value: 'N' },
      ],
    } 
  },
  { title: '错误信息', dataIndex: 'cwxx', width: 180, ellipsis: true },
];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
config.grid_filter_quick = [
  { name: 'kakbm', label: 'IC卡别名', isLabel: true, type: 'Input' },
  { name: 'czr', label: '操作人', isLabel: true, type: 'Input', searchButton: true },
];

// 配置项：工具栏
config.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
  ckts_download: true,                   // 是否显示导出，默认关闭
};
// 配置项：自定义工具栏
config.costomer_toobar = [];

export default config;
