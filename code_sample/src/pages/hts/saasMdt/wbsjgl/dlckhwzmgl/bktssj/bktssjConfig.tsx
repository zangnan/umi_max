import ysysjConfig from "@/pages/hts/saasMdt/wbsjgl/ckbgdgl/ysysj/ysysjConfig";

const bktssjConfig: any = {};

// 配置项
bktssjConfig.unit_key = 'CX_SAAS_MDT_DLCKHWZMGL';                  // 业务单元key，对应后端接口
bktssjConfig.export_key = 'CX_SAAS_MDT_DLCKHWZMGL_5';
bktssjConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出
bktssjConfig.grid_show_serial_number = false;                     // 是否显示序号，默认不显示
bktssjConfig.grid_show_data_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
bktssjConfig.grid_row_key = 'uuid';                               // 列表主键，默认uuid
bktssjConfig.module_type = 'QZ_type';
bktssjConfig.click_checked = '1';                                 // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
bktssjConfig.grid_selection_type = "checkbox";                     // 列表首选项类别，默认 checkbox，可选 false radio checkbox
bktssjConfig.page_id = 'CX_SAAS_MDT_DLCKHWZMGL_BTS';

// 配置项：列表列
bktssjConfig.grid_columns = [
  { title: '代理出口货物证明号码', dataIndex: 'dlckhwzmhm', width: 200,  sorter: true, fixed: 'left' },
  { title: '委托（代理）出口合同号', dataIndex: 'wtdlckhth', sorter: true, width: 200 },
  { title: '出口发票号', dataIndex: 'ckfph', width: 150, ellipsis: true },
  { title: '出口货物报关单号', dataIndex: 'ckbgdh', width: 180, sorter: true, ellipsis: true },
  { title: '出口日期', dataIndex: 'ckrq1', width: 120, sorter: true, render: { type: 'date', format: 'yyyy-MM-DD' } },
  { title: '海关商品代码', dataIndex: 'hgspDm', width: 160,},
  { title: '海关商品名称', dataIndex: 'hgspmc', width: 180, ellipsis: true },
  { title: '出口商品代码', dataIndex: 'ckspDm', width: 160,},
  { title: '备案号', dataIndex: 'bah', width: 120, },
  { title: '监管方式', dataIndex: 'jgfsDm', width: 120, codeTable: ['code_dm_ckts_hgjgfs', '01']  },
  { title: '成交方式', dataIndex: 'hgcjfsmc', width: 120, },
  { title: '成交单位', dataIndex: 'sbjldwmc', width: 80, ellipsis: true },
  { title: '成交数量', dataIndex: 'cksl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' },},
  { title: '成交币制', dataIndex: 'hbzmDm', width: 70, },
  { title: '成交总价', dataIndex: 'cjzj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' },},
  // { title: '成交币制汇率', dataIndex: 'cjhbhl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' },},
  // { title: '美元汇率', dataIndex: 'myhl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' },},
  { title: '美元离岸价', dataIndex: 'mylaj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' },},
  { title: '法定单位', dataIndex: 'hgjldwmc', width: 80, ellipsis: true },
  { title: '法定单位数量', dataIndex: 'sbsl1', width: 150,  align: 'right', render: { type: 'number', format: '0,0.00000' },},
  { title: '第二单位', dataIndex: 'dejldwmc', width: 80, ellipsis: true },
  { title: '第二单位数量', dataIndex: 'decksl', width: 150,  align: 'right', render: { type: 'number', format: '0,0.00000' },},
];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
bktssjConfig.filter_items = [
  { name: 'dlckhwzmhm', label: '代理出口货物证明号码', type: 'Input' },
  { name: 'wtdlckhth', label: '委托（代理）出口合同号', type: 'Input' },
  { name: 'ckbgdh', label: '出口货物报关单号', type: 'Input' },
  { name: 'ckrq1', label: '出口日期', type: 'DatePicker', range: true, allowClear: true },
  { name: 'jgfsDm', label: '监管方式', type: 'Select', showType: '3', allowClear: true, showSearch: true, codeTable: ['CODE_DM_CKTS_HGJGFS', '01'] },
];

// 配置项：工具栏
bktssjConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
  delete: false,
  add: false,
  edit: false,
  upload: false,                    // 是否显示导入按钮，默认关闭
  tssb_download: true,             // 是否显示导出按钮，默认关闭
};
// 配置项：自定义工具栏
bktssjConfig.costomer_toobar = [
];

export default bktssjConfig;
