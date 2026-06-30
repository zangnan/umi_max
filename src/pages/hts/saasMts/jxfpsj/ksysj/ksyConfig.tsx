import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 代理出口货物证明管理-可使用数据
 */

const ksyConfig: any = {};

// 配置项
ksyConfig.module_key = 'CX_SAAS_MTS_TSSB_JXFPGL';                  // 业务单元key，对应后端接口
ksyConfig.export_key = 'DC_SAAS_MTS_TSSB_JXFPGL_KSYSJCX';
ksyConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出
ksyConfig.grid_show_serial_number = false;                     // 是否显示序号，默认不显示
ksyConfig.toolbar_show_grid_checked_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
ksyConfig.grid_row_key = 'uuid';                               // 列表主键，默认uuid
ksyConfig.module_type = 'QZ_type';
ksyConfig.grid_click_checked = '1';                                 // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
ksyConfig.grid_selection_type = "checkbox";                     // 列表首选项类别，默认 checkbox，可选 false radio checkbox

// 配置列表列
ksyConfig.grid_columns = [
  // { title: '进货凭证号', dataIndex: 'jhpzh', width: 200, sorter: true, fixed: 'left', render:{ func: 'fpmx' } },
  { title: '发票号码', dataIndex: 'fphm', width: 240, ellipsis: true, sorter: true },
  { title: '发票代码', dataIndex: 'fpDm', width: 120, ellipsis: true, sorter: true },
  { title: '开票日期', dataIndex: 'kprq', width: 100, sorter: true, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '行号', dataIndex: 'hh', width: 40, ellipsis: true },
  { title: '货物或应税劳务、服务名称', dataIndex: 'hwhyslwmc', width: 180, ellipsis: true },
  { title: '规格型号', dataIndex: 'ggxh', width: 140, ellipsis: true },
  { title: '单位', dataIndex: 'jldwmc', width: 60, ellipsis: true },
  { title: '数量', dataIndex: 'sl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' }},
  { title: '单价', dataIndex: 'dj', width: 140,  align: 'right', },
  { title: '金额', dataIndex: 'je', width: 140,  align: 'right', render: { type: 'number', format: '0,0.00' },},
  { title: '税率', dataIndex: 'sl1', width: 100, align: 'right', render: { type: 'number', format: '0,0.0000' } },
  { title: '税额', dataIndex: 'se', width: 140,  align: 'right', render: { type: 'number', format: '0,0.00' },},
  { title: '已占数量', dataIndex: 'yzsl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '已占金额', dataIndex: 'yzje1', width: 140,  align: 'right', render: { type: 'number', format: '0,0.00' },},
  { title: '内销数量', dataIndex: 'nxsl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '内销金额', dataIndex: 'znxje', width: 140,  align: 'right', render: { type: 'number', format: '0,0.00' },},
  { title: '内销税额', dataIndex: 'znxse', width: 140,  align: 'right', render: { type: 'number', format: '0,0.00' },},
  { title: '剩余数量', dataIndex: 'sysl', width: 140,  align: 'right', render: { type: 'number', format: '0,0.00000' },},
  { title: '剩余金额', dataIndex: 'syje', width: 140,  align: 'right', render: { type: 'number', format: '0,0.00' },},
  { title: '备注', dataIndex: 'bz', width: 100, ellipsis: true },
  { title: '业务编号', dataIndex: 'ywbh', width: 140, ellipsis: true },
  { title: '销售方纳税人名称', dataIndex: 'xhfnsrmc', width: 180, ellipsis: true },
  { title: '销售方纳税人识别号', dataIndex: 'xfnsrsbh', width: 180, ellipsis: true },
  { title: '认证/稽核状态', dataIndex: 'fpzt', width: 140, render: { func: 'fpzt' },
  filter: {
    type: 'Radio',
    codeTable: 'CODE_STATIC_FPZT_DM:01',
  } },
  { title: '发票种类', dataIndex: 'fpzlDm', width: 180, codeTable: 'CODE_DM_ZXSB_FPZLXQGZ:02',
    filter: {
    type: 'Select',
    codeTable: 'CODE_DM_ZXSB_FPZLXQGZ:02',
  } },
  { title: '标签', dataIndex: 'bqsm', width: 100, ellipsis: true },


  // { title: '剩余计税金额', dataIndex: 'syje', width: 140,  align: 'right', render: { type: 'number', format: '0,0.00' },},
  // { title: '退税已占税额', dataIndex: 'yzse1', width: 140,  align: 'right', render: { type: 'number', format: '0,0.00' },},
  // { title: '剩余税额', dataIndex: 'syse', width: 140,  align: 'right', render: { type: 'number', format: '0,0.00' },},
];

// 配置项：筛选_筛选
ksyConfig.filter_items = [
  { name: 'fphm', label: '发票号码', type: 'Input' },
  { name: 'fpDm', label: '发票代码', type: 'Input' },
  { name: 'kprq', label: '开票日期', type: 'DatePicker', range: true, allowClear: true },
  { name: 'hwhyslwmc', label: '货物或应税劳务、服务名称', type: 'Input' },
  { name: 'ywbh', label: '业务编号', type: 'Input' },
  { name: 'xhfnsrmc', label: '销售方纳税人名称', type: 'Input' },
  { name: 'xfnsrsbh', label: '销售方纳税人识别号', type: 'Input' },
  { name: 'bqsm', label: '标签', type: 'Input' },
];

// 配置项：工具栏
ksyConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
  delete: false,
  add: false,
  edit: false,
  upload: false,                    // 是否显示导入按钮，默认关闭
  download: true,                   // 是否显示导出按钮，默认关闭
};

// 配置项：自定义工具栏
ksyConfig.customer_toolbar = [
  { name: '更新信息状态', func: 'funcGxxxzt' },
];


ksyConfig.handle_columns = [];
export default ksyConfig;
