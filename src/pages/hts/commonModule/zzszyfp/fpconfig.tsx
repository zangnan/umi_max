import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 进项发票
 */
const jxfpFpxxConfig: any = {};

// 配置项
jxfpFpxxConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
jxfpFpxxConfig.toolbar_show_grid_checked_num = false;                           // 工具栏左侧是否显示数据条数及选中数，默认true显示
jxfpFpxxConfig.layout_type = 'modal';                                // 页面类型，默认default 可选 default modal tabs tz台账
jxfpFpxxConfig.grid_click_checked = '1';                                  // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
jxfpFpxxConfig.grid_row_key = 'uuid';                      // 列表主键，默认uuid
jxfpFpxxConfig.module_key = 'CX_SAAS_SJGL_JXFPSJCX_ZZSFPDZSJCX_FPXX';          // 业务单元key，对应后端接口
jxfpFpxxConfig.export_key = 'SAAS_SJGL_JXFPSJCX_ZZSFPDZSJ_FPXX_DC';        // 业务单元key，对应后端接口
jxfpFpxxConfig.module_type = 'QZ_type';
jxfpFpxxConfig.export_large = true;

// 配置列表列
jxfpFpxxConfig.grid_columns = [
  { title: '发票号码', dataIndex: 'fphm', width: 180, ellipsis: true, sorter: true, render: { func: 'renderBgdscmxbgdhSjgl' },fixed: 'left' },
  { title: '发票代码', dataIndex: 'fpDm', width: 120, sorter: true },
  { title: '认证/稽核状态', dataIndex: 'rzjhztdm', width: 160, codeTable: 'CODE_STATIC_TZ_FPZT:01',
    filter: {
    type: 'Select',
    codeTable: 'CODE_STATIC_TZ_FPZT:01',
  } },
  { title: '发票种类', dataIndex: 'fpzlDm1', width: 200, codeTable: 'CODE_DM_ZXSB_FPZLXQGZ:01',
    filter: {
    type: 'Select',
    codeTable: 'CODE_DM_ZXSB_FPZLXQGZ:01',
  } },
  {
    title: '发票状态', dataIndex: 'fpztDm', width: 100,codeTable: 'CODE_DM_FP_FPZT:01',
    filter: {
      type: 'Select',
      codeTable: 'CODE_DM_FP_FPZT:01',
    }
  },
  { title: '销售方纳税人名称 ', dataIndex: 'xhfnsrmc', width: 180, ellipsis: true },
  { title: '销售方纳税人识别号', dataIndex: 'xfnsrsbh', width: 180, ellipsis: true },
  { title: '开票日期', dataIndex: 'kprq', width: 140, sorter: true, },
  { title: '金额', dataIndex: 'je', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
  { title: '税额', dataIndex: 'se', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
  { title: '价税合计', dataIndex: 'jshj', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
  { title: '备注', dataIndex: 'bz', width: 260, ellipsis: true  },
];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
  jxfpFpxxConfig.filter_items = [
    { name: 'kprq', label: '开票日期', type: 'DatePicker' ,range: true, allowClear: false, qypzgl: 'QYPZGL_FPCXZDYFFW'},
    { name: 'fphm', label: '发票号码', type: 'Input', },
    { name: 'fpDm', label: '发票代码', type: 'Input'},
    { name: 'xhfnsrmc', label: '销售方纳税人名称', type: 'Input'},
    { name: 'xfnsrsbh', label: '销售方纳税人识别号', type: 'Input'},
    { name: 'bz', label: '备注', type: 'Input'},
    { name: 'tzsxbz', label: '台账数据', type: 'Select', codeTable: 'CODE_STATIC_SJGL_TZSJ:01' },
  ];

  // 配置项：自定义操作列
  jxfpFpxxConfig.handle_columns = [
    { name: '发票明细', key: '892414756f084af8a0ac8b606a0762fc', func: 'handleColumnCkfp'},
  ];

  jxfpFpxxConfig.customer_toolbar = [
    { name: '台账筛选', key: '3', func: 'importTzsx' },
    { name: '打印', key: '1719970930', func: 'fpdyFuncDy' },
    { name: '小计', key: '1719910660', func: 'xj' },

  ];
  // 配置项：工具栏
  jxfpFpxxConfig.toolbar_default = {
    setting: false,                   // 是否显示设置按钮，默认关闭
    full: true,                       // 是否显示全屏按钮，默认关闭
    reload: true,                     // 是否显示刷新按钮，默认关闭
    download: true,              // 是否显示导出按钮，默认关闭
 };

 jxfpFpxxConfig.grid_filter_quick = [
  {
    name: 'cxlx',
    type: 'Select',
    defaultValue: '2',
    op: 'zdy',
    eventOnChange: 'handleOnChangeCxlx',
    list: [
      { name: '商品信息', value: '1' },
      { name: '发票信息', value: '2', },
    ],
  },
];

export default jxfpFpxxConfig;
