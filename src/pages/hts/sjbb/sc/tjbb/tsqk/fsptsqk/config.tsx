import CONSTANTS from '@/components/DDAssist/constants';


/**
 * title: 分商品退税情况
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '（单位：万元、万美元）';
unitConfig.module_key = 'CX_SJFX_SC_TSQK_TSSBQK_SCQYFSPTSQK';          // 业务单元key，对应后端接口
unitConfig.page_id = 'CX_SJFX_SC_TSQK_TSSBQK_SCQYFSPTSQK';           // 页面id
unitConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
unitConfig.grid_selection_type = false;                          // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.toolbar_show_grid_checked_num = false;                           // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.layout_type = 'tz';                                   // 页面类型，默认default 可选 default modal tabs tz台账
unitConfig.export_key = 'CX_SJFX_SC_TSQK_TSSBQK_SCQYFSPTSQK_PRINT_REPORT';
unitConfig.module_type = 'sjbb';      

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '出口商品代码', dataIndex: 'ckspDm', width: 120, fixed: 'left'},
  { title: '出口商品名称', dataIndex: 'ckspmc',fixed: 'left', width: 150 , ellipsis: true },
  { title: '申报免抵退税额', dataIndex: 'sbmdtse',fixed: 'left', width: 150, sum: true, align: 'right', ellipsis: true, sorter: true, render: { type: 'number', format: '0,0.00' } },
  {
    title: '审核情况', dataIndex: 'shqk', children: [
      {
        title: '审核免抵退税额', dataIndex: 'shmtse', children: [
          { title: '审核免抵退税额', dataIndex: 'shmdtse', width: 140, sum: true,align: 'right',render: { type: 'number', format: '0,0.00' } },
          { title: '应退税额', dataIndex: 'shytse', width: 140, sum: true, align: 'right',render: { type: 'number', format: '0,0.00' }  },
          { title: '免抵税额', dataIndex: 'shmdse', width: 140, sum: true, align: 'right',render: { type: 'number', format: '0,0.00' }  },
        ]
      },
      {
        title: '未审核免抵退税额', dataIndex: 'wshmdtse', children: [
          { title: '合计', dataIndex: 'xj', width: 140, sum: true,align: 'right',render: { type: 'number', format: '0,0.00' }  },
          { title: '不予办理免抵退税额', dataIndex: 'byblmdtse', width: 150, sum: true, align: 'right',render: { type: 'number', format: '0,0.00' } },
          { title: '暂不办理免抵退税额', dataIndex: 'zbblmdtse', width: 150, sum: true, align: 'right',render: { type: 'number', format: '0,0.00' } },
          { title: '未反馈免抵退税额', dataIndex: 'wfkmdtse', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
          { title: '不予退税免抵退税额', dataIndex: 'bytsmdtse', width: 150, sum: true, align: 'right',render: { type: 'number', format: '0,0.00' } },
        ]
      },
    ]
  },
  { title: '申报明细{br}（条）', dataIndex: 'sbmxts', width: 100, sum: true, align: 'right', render: { type: 'number', format: '0,0' } },
  { title: '报关单{br}（条）', dataIndex: 'bgdts', width: 100, sum: true, align: 'right', render: { type: 'number', format: '0,0' } },
  { title: '代理证明{br}（条）', dataIndex: 'dlzmts', width: 100, sum: true, align: 'right', render: { type: 'number', format: '0,0' } },
  { title: '出口数量', dataIndex: 'cksl', width: 140, sum: true, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '计量单位', dataIndex: 'jldwmc', width: 80, ellipsis: true },
  { title: '美元离岸价', dataIndex: 'mylaj', width: 140, sum: true, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '人民币离岸价', dataIndex: 'rmblaj', width: 140, sum: true, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '不得免征和抵扣税额', dataIndex: 'mdtsbdmzhdkse', width: 150, sum: true, align: 'right', render: { type: 'number', format: '0,0.00' } },
];

unitConfig.grid_filter_quick = [
  { label: '申报日期', name: 'sbrq', type: 'DatePicker', range: true, isLabel: true, allowClear: false },
  { label: '出口商品代码', name: 'ckspDm', type: 'Input', searchButton: true },
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
