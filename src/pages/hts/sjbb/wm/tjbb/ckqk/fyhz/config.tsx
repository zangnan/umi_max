import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 出口报关单台账 01-生产企业出口报关单明细表
 */
const config: any = {};

// 配置项
config.grid_title = '（单位：万元、万美元）';
config.module_key = 'CX_SJFX_WM_CKQK_FYHZ';                            // 业务单元key，对应后端接口
config.page_id = 'CX_SJFX_WM_CKQK_FYHZ';                             // 页面id
config.export_key = 'CX_SJFX_WM_CKQK_FYHZ_PRINT_REPORT';
config.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
config.toolbar_show_grid_checked_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
config.layout_type = 'tz';                                  // 页面类型，默认default 可选 default modal tabs tz台账
config.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
config.grid_show_serial_number = true;                      // 是否显示序号，默认不显示
config.module_type = 'sjbb';

// 配置项：列表列
config.grid_columns = [
  { title: '分组项目', dataIndex: 'fzxmmc', width: 150, fixed: 'left', render: { func: 'renderFzxm' } },
  {
    title: '美元离岸价（万美元）', dataIndex: 'mylaj', children: [
      { title: '本期', dataIndex: 'mylajbq', width: 140, align: 'right', sum: true, sorter: true, render: { type: 'number', format: '0,0.00' } },
      { title: '上年同期', dataIndex: 'mylajsntq', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
      { title: '同比增长（%）', dataIndex: 'mylajtb', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
      { title: '占比（%）', dataIndex: 'mylajbqzb', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
    ]
  },
  { title: '人民币离岸价{br}（万元）', dataIndex: 'rmblaj', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '报关单{br}（张/条）', dataIndex: 'ckbgdzsTs', width: 100, align: 'right', sum: true, render: { type: 'number', format: '0,0' }  },
];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
config.grid_filter_quick = [
  { name: 'ckny', label: '出口年月', isLabel: true, type: 'DatePicker', range: true, format: 'YYYYMM', picker: 'month', allowClear: false },
];

// 配置项：工具栏
config.toolbar_default = {
  sjgxUpdateData: true,               // 是否显示更新报表，默认关闭
  ckts_download: true,                   // 是否显示导出，默认关闭
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};

config.customer_toolbar = [];
config.handle_columns = [];
export default config;
