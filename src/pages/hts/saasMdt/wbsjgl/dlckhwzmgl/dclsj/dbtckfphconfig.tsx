import CONSTANTS from '@/components/DDAssist/constants';
import bktssjConfig from "@/pages/hts/saasMdt/wbsjgl/dlckhwzmgl/bktssj/bktssjConfig";

/**
 * title: 代理出口货物证明-待处理-待补填出口发票号
 */

const ckfpConfig: any = {};

// 配置项
ckfpConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
ckfpConfig.grid_selection_type = "checkbox";                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
ckfpConfig.toolbar_show_grid_checked_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
ckfpConfig.grid_click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
ckfpConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
ckfpConfig.module_key = 'CX_SAAS_MDT_DLCKHWZMGL'; // 业务单元key，对应后端接口
ckfpConfig.export_key = 'CX_SAAS_MDT_DLCKHWZMGL_1'; // 业务单元key，对应后端接口
ckfpConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出
ckfpConfig.module_type = 'QZ_type';
ckfpConfig.page_id = 'CX_SAAS_MDT_DLCKHWZMGL_DBTHL';
bktssjConfig.gridParams = {
  initSearchModal: [
    { property: 'cxlx', value: '1', op: 'zdy' },
  ]
}

// 配置列表列
ckfpConfig.grid_columns = [
  { title: '代理出口货物证明号码', dataIndex: 'dlckhwzmhm', width: 200, sorter: true, fixed: 'left'},
  { title: '委托（代理）出口合同号', dataIndex: 'wtdlckhth', width: 200, ellipsis: true, sorter: true, },
  { title: '出口发票号', dataIndex: 'ckfph', width: 180 },
  { title: '出口货物报关单号', dataIndex: 'ckbgdh', width: 180, sorter: true },
  { title: '出口日期', dataIndex: 'ckrq1', width: 120, sorter: true, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '海关商品代码', dataIndex: 'hgspDm', width: 160,},
  { title: '海关商品名称', dataIndex: 'hgspmc', width: 180, ellipsis: true },
  { title: '成交币制', dataIndex: 'hbzmDm', width: 70,  },
  { title: '监管方式', dataIndex: 'jgfsDm', width: 120, codeTable: 'code_dm_ckts_hgjgfs:01'  },
];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
ckfpConfig.filter_items = [
  { name: 'dlckhwzmhm', label: '代理出口货物证明号码', type: 'Input' },
  { name: 'wtdlckhth', label: '委托（代理）出口合同号', type: 'Input', },
  { name: 'ckbgdh', label: '出口货物报关单号', type: 'Input', },
  { name: 'ckrq1', label: '出口日期', type: 'DatePicker', range: true, allowClear: true },
  { name: 'jgfsDm', label: '监管方式', type: 'Select', showType: '3', allowClear: true, showSearch: true, codeTable: 'CODE_DM_CKTS_HGJGFS:01' },
];


// 配置项：工具栏
ckfpConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
  delete: false,
  add: false,
  edit: false,
  upload: false,                    // 是否显示导入按钮，默认关闭
  download: true,              // 是否显示导出按钮，默认关闭
};

// 配置项：自定义工具栏
ckfpConfig.customer_toolbar = [
  {
    name: '配置出口发票号',
    type: 'dropdown',
    list: [
      { name: '批量补录', func: 'btnPlbl' },
      { name: '批量导入', func: 'btnPldr' },
    ],
  },
];

ckfpConfig.handle_columns = [];
export default ckfpConfig;
