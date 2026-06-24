import CONSTANTS from '@/components/DDAssist/constants';
const ysysjConfig: any = {};

// 配置项
ysysjConfig.module_key = 'WBSJ_CKBGD_QUERY_PAGE';                  // 业务单元key，对应后端接口
ysysjConfig.export_key = 'WBSJ_CKBGD_YSYSJ_DC';
ysysjConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出
ysysjConfig.grid_show_serial_number = false;                     // 是否显示序号，默认不显示
ysysjConfig.toolbar_show_grid_checked_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
ysysjConfig.grid_row_key = 'uuid';                               // 列表主键，默认uuid
ysysjConfig.module_type = 'QZ_type';
ysysjConfig.grid_click_checked = '1';                                 // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
ysysjConfig.grid_selection_type = "checkbox";                     // 列表首选项类别，默认 checkbox，可选 false radio checkbox
ysysjConfig.page_id = 'WBSJ_CKBGD_QUERY_PAGE_YSY';

// 配置项：列表列
ysysjConfig.grid_columns = [
  { title: '出口货物报关单号', dataIndex: 'ckbgdh', width: 180,  sorter: true, fixed: 'left', render: { func: 'renderBgdscmx18bgdh' } },
  { title: '出口日期', dataIndex: 'ckrq1', width: 120, sorter: true, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '出口合同号', dataIndex: 'ckhth', width: 180, ellipsis: true },
  { title: '出口发票号', dataIndex: 'ckfph', width: 150, ellipsis: true },
  { title: '海关商品代码', dataIndex: 'hgspDm', width: 160,},
  { title: '海关商品名称', dataIndex: 'hgspmc', width: 180, ellipsis: true },
  { title: '出口商品代码', dataIndex: 'ckspDm', width: 160,},
  { title: '出口商品名称', dataIndex: 'ckspmc', width: 180, ellipsis: true },
  { title: '备案号', dataIndex: 'bah', width: 120, ellipsis: true },
  { title: '监管方式', dataIndex: 'jgfsDm', width: 120, codeTable: 'code_dm_ckts_hgjgfs:01'  },
  { title: '法定单位', dataIndex: 'hgjldwmc', width: 80, ellipsis: true },
  { title: '法定单位数量', dataIndex: 'cksl', width: 150,  align: 'right', render: { type: 'number', format: '0,0.00000' },},
  { title: '第二单位', dataIndex: 'dejldwDm', width: 80, ellipsis: true, codeTable: 'CODE_DM_CKTS_HGJLDW:01', },
  { title: '第二单位数量', dataIndex: 'decksl', width: 150,  align: 'right', render: { type: 'number', format: '0,0.00000' },},
  { title: '成交方式', dataIndex: 'hgcjfsmc', width: 120,
    filter: {
      type: 'Select',
      codeTable: 'code_dm_ckts_hgcjfs_mc:01',
    },
  },
  { title: '成交币制', dataIndex: 'cjhghbzmDm', width: 70, },
  { title: '成交汇率', dataIndex: 'cjhbhl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' },},
  { title: '成交金额', dataIndex: 'cjzj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' },},
  { title: '原币离岸价', dataIndex: 'yblaj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' },},
  { title: '成交单位', dataIndex: 'sbjldwmc', width: 80, ellipsis: true },
  { title: '成交数量', dataIndex: 'cjsl1', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' },},
  { title: '美元离岸价', dataIndex: 'mylaj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' },},
  { title: '美元汇率', dataIndex: 'myhl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' },},
  { title: '人民币离岸价', dataIndex: 'rmblaj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' },},
  { title: '运费金额', dataIndex: 'yfszl', width: 140, align: 'right', render: { type: 'number', format: '0,0.000000' } },
  { title: '运费币制', dataIndex: 'yfhghbzmDm', width: 70, ellipsis: true },
  { title: '运费汇率', dataIndex: 'yfhl', width: 140,  align: 'right', render: { type: 'number', format: '0,0.00000' },},
  { title: '运费标志', dataIndex: 'yfjsfsDm', width: 100, ellipsis: true },
  { title: '折算数量', dataIndex: 'yfzssl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' },  },
  { title: '保费金额', dataIndex: 'bfszl', width: 140, align: 'right', render: { type: 'number', format: '0,0.000000' } },
  { title: '保费币制', dataIndex: 'bfhghbzmDm', width: 70, ellipsis: true },
  { title: '保费汇率', dataIndex: 'bfhl', width: 140,  align: 'right', render: { type: 'number', format: '0,0.00000' },},
  { title: '保费标志', dataIndex: 'bfjsfsDm', width: 100, ellipsis: true },
  { title: '杂费金额', dataIndex: 'zfszl', width: 140, align: 'right', render: { type: 'number', format: '0,0.000000' } },
  { title: '杂费币制', dataIndex: 'zfhghbzmDm', width: 70, ellipsis: true },
  { title: '杂费汇率', dataIndex: 'zfhl', width: 140,  align: 'right', render: { type: 'number', format: '0,0.00000' },},
  { title: '杂费标志', dataIndex: 'zfjsfsDm', width: 100, ellipsis: true },
  { title: '操作人', dataIndex: 'czrxm', width: 100, ellipsis: true },
  { title: '操作时间', dataIndex: 'czsj', width: 100, ellipsis: true},

];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
ysysjConfig.filter_items = [
  { name: 'ckbgdh', label: '出口货物报关单号', type: 'Input' },
  { name: 'ckhth', label: '出口合同号', type: 'Input' },
  { name: 'ckrq1', label: '出口日期', type: 'DatePicker', range: true, allowClear: true },
  { name: 'ckspDm', label: '出口商品代码', type: 'Input' },
  { name: 'jgfsDm', label: '监管方式', type: 'Select', showType: '3', allowClear: true, showSearch: true, codeTable: 'CODE_DM_CKTS_HGJGFS:01' },
  { name: 'hgspmc', label: '海关商品名称', type: 'Input' },
];

// 配置项：工具栏
ysysjConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
  delete: false,
  add: false,
  edit: false,
  upload: false,                    // 是否显示导入按钮，默认关闭
  download: true,             // 是否显示导出按钮，默认关闭
};
// 配置项：自定义工具栏
ysysjConfig.customer_toolbar = [
  { name: '生成明细报表', key: 'scmxbb', func: 'produceDetailsReport' },
];

ysysjConfig.handle_columns = [];
export default ysysjConfig;
