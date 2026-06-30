import CONSTANTS from '@/components/DDAssist/constants';


/**
 * title: 分商品退税情况
 */
const unitConfig: any = {};
 
// 配置项
unitConfig.grid_title = '（单位：万元、万美元）';
unitConfig.module_key = 'CX_SJFX_WM_TSQK_TSSBQK_XZ_WMQYFSPTSQKMX';          // 业务单元key，对应后端接口
unitConfig.page_id = 'CX_SJFX_WM_TSQK_TSSBQK_XZ_WMQYFSPTSQKMX';           // 页面id
unitConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
unitConfig.grid_selection_type = false;                          // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.toolbar_show_grid_checked_num = false;                           // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.layout_type = 'tz';                                   // 页面类型，默认default 可选 default modal tabs tz台账
unitConfig.export_key = 'CX_SJFX_WM_TSQK_TSSBQK_XZ_WMQYFSPTSQKMX_PRINT_REPORT';
unitConfig.module_type = 'sjbb';      

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '出口商品代码', dataIndex: 'hgckspDm', width: 120, fixed: 'left'},
  { title: '出口商品名称', dataIndex: 'hgspmc',fixed: 'left', width: 150 , ellipsis: true, sorter: true},
  {
    title: '申报情况', dataIndex: 'sbqk', children: [
      { title: '合计', dataIndex: 'tse', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
      { title: '增值税', dataIndex: 'zzstse', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
      { title: '消费税', dataIndex: 'xfstse', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
    ]
  },
  {
    title: '审核情况', dataIndex: 'shqk', children: [
      {
        title: '实收退税款', dataIndex: 'sstsk', children: [
          { title: '合计', dataIndex: 'sstse', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
          { title: '增值税', dataIndex: 'sszzstse', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' }  },
          { title: '消费税', dataIndex: 'ssxfstse', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' }  },
        ]
      },
      {
        title: '未收退税款', dataIndex: 'wstsk', children: [
          { title: '合计', dataIndex: 'wstse', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' }  },
          { title: '不予退税', dataIndex: 'bytse', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
          { title: '暂不办理', dataIndex: 'zbbltse', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
          { title: '未反馈', dataIndex: 'wfktse', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
          { title: '不予办理', dataIndex: 'bybltse', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
        ]
      },
    ]
  },
  {
    title: '出口明细申报情况', dataIndex: 'ckmxsbqk', children: [
      { title: '出口明细（条）', dataIndex: 'ckmxsbbjlts1', width: 140,  align: 'right', sum: true, render: { type: 'number', format: '0,0' } },
      { title: '报关单（条）', dataIndex: 'ckbgdts', width: 140,  align: 'right', sum: true, render: { type: 'number', format: '0,0' } },
      { title: '人民币离岸价', dataIndex: 'mtsrmblaj', width: 140,  align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
      { title: '代理证明（条）', dataIndex: 'dlckzmts', width: 140,  align: 'right', sum: true, render: { type: 'number', format: '0,0' } },
      { title: '出口数量', dataIndex: 'sbcksl', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00000' } },
      { title: '计量单位', dataIndex: 'jldwmc', width: 140, ellipsis: true },
      { title: '美元离岸价', dataIndex: 'mylaj', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
    ]
  },
  {
    title: '进货明细申报情况', dataIndex: 'jhmxsbqk', children: [
      { title: '进货明细（条）', dataIndex: 'jhmxsbbjlts1', width: 140, align: 'right', sum: true,  render: { type: 'number', format: '0,0' } },
      { title: '进货发票（条）', dataIndex: 'zzszyfpzs', width: 140, align: 'right', sum: true,  render: { type: 'number', format: '0,0' } },
      { title: '计税金额', dataIndex: 'jsje', width: 140, align: 'right', sum: true,  render: { type: 'number', format: '0,0.00' } },
    ]
  },
];


unitConfig.grid_filter_quick = [
  { label: '申报日期', name: 'sbrq', type: 'DatePicker', range: true,isLabel: true, },
  { label: '出口商品代码', name: 'hgckspDm', type: 'Input', searchButton: true },
];
// 配置项：工具栏
unitConfig.toolbar_default = {
  sjgxUpdateData: true,               // 是否显示更新台账数据，默认关闭
  ckts_download: true,                   // 是否显示导出，默认关闭
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};

unitConfig.customer_toolbar = [];
unitConfig.handle_columns = [];
export default unitConfig;
