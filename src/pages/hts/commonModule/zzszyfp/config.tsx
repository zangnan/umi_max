import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 进项发票
 */
const ckbgdConfig: any = {};

// 配置项
ckbgdConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
ckbgdConfig.toolbar_show_grid_checked_num = false;                           // 工具栏左侧是否显示数据条数及选中数，默认true显示
ckbgdConfig.layout_type = 'modal';                                // 页面类型，默认default 可选 default modal tabs tz台账
ckbgdConfig.grid_click_checked = '1';                                  // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
ckbgdConfig.grid_row_key = 'uuid';                      // 列表主键，默认uuid
ckbgdConfig.module_key = 'CX_SAAS_SJGL_JXFPSJCX_ZZSFPDZSJCX';          // 业务单元key，对应后端接口
ckbgdConfig.export_key = 'SAAS_SJGL_JXFPSJCX_ZZSFPDZSJ_DC';        // 业务单元key，对应后端接口
ckbgdConfig.module_type = 'QZ_type';
ckbgdConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出

// 配置列表列
ckbgdConfig.grid_columns = [
  { title: '发票号码', dataIndex: 'fphm', width: 240, ellipsis: true, sorter: true },
  { title: '发票代码', dataIndex: 'fpDm', width: 120, sorter: true },
  { title: '认证/稽核状态', dataIndex: 'rzjhztdm', width: 160, codeTable: 'CODE_STATIC_TZ_FPZT:01',
    filter: {
    type: 'Select',
    codeTable: 'CODE_STATIC_TZ_FPZT:01',
  } },
  { title: '发票种类', dataIndex: 'fpzlDm1', width: 160, codeTable: 'CODE_DM_ZXSB_FPZLXQGZ:01',
    filter: {
    type: 'Select',
    codeTable: 'CODE_DM_ZXSB_FPZLXQGZ:01',
  } },
  { title: '销售方纳税人识别号', dataIndex: 'xfnsrsbh', width: 180, ellipsis: true },
  { title: '开票日期', dataIndex: 'kprq', width: 140, sorter: true, render: { type: 'date', format: 'YYYY-MM-DD' }},
  { title: '行号', dataIndex: 'hh', width: 90 },
  { title: '货物或应税劳务、服务名称', dataIndex: 'hwhyslwmc', width: 200, ellipsis: true },
  { title: '规格型号', dataIndex: 'ggxh', width: 180, ellipsis: true },
  { title: '单位', dataIndex: 'jldwmc', align: 'left', width: 80, ellipsis: true},
  { title: '数量', dataIndex: 'sl3', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '单价', dataIndex: 'dj', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
  { title: '金额', dataIndex: 'je', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
  { title: '税率', dataIndex: 'sl1', align: 'right', width: 80, render: { type: 'number', format: '0,0.0000' } },
  { title: '税额', dataIndex: 'se', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
  { title: '备注', dataIndex: 'bz', width: 160, ellipsis: true  },
];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
  ckbgdConfig.filter_items = [
    { name: 'fphm', label: '发票号码', type: 'Input', },
    { name: 'fpDm', label: '发票代码', type: 'Input'},
    { name: 'xfnsrsbh', label: '销售方纳税人识别号  ', type: 'Input'},
    { name: 'kprq', label: '开票日期', type: 'DatePicker' ,range: true},
    { name: 'hwhyslwmc', label: '货物或应税劳务、服务名称', type: 'Input'},
  ];

  // 配置项：自定义操作列
  ckbgdConfig.handle_columns = [
    { name: '发票明细', key: '892414756f084af8a0ac8b606a0762fc', func: 'handleColumnCkfp'},
  ];
  // 配置项：工具栏
  ckbgdConfig.toolbar_default = {
    setting: false,                   // 是否显示设置按钮，默认关闭
    full: true,                       // 是否显示全屏按钮，默认关闭
    reload: true,                     // 是否显示刷新按钮，默认关闭
    download: true,              // 是否显示导出按钮，默认关闭
 };

export default ckbgdConfig;
