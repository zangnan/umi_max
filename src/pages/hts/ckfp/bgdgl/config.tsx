import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 报关单数据
 */
const unitConfig: any = {};

// 配置项
unitConfig.api_grid_query = `/yw/fpzs/sjxzgl/bgdsjcx`;   // api 列表查询
unitConfig.module_key = 'CKFP_SJXZ_QUERY_BGD_DATA';                                               // 业务单元key，对应后端接口
unitConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.grid_scroll_x = '1450px';
unitConfig.grid_selection_type = 'checkbox';                                               //复选框隐藏
unitConfig.toolbar_show_grid_checked_num = false;                                                 // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.export_key = 'EXCEL_REPORT_CKFPKJSAAS_BGDGL'; // 业务单元key，对应后端接口


// 配置列表列
unitConfig.grid_columns = [
  { title: '结关状态', dataIndex: 'bgdjgzt', fixed: 'left', width: 100,
    render: { func: 'renderCkfpSjxzBgdJgzt' },
    filter: {
      type: 'Select',
      list: [
        { text: '已结关', value: '1' },
        { text: '未结关', value: '2' }
      ],
    }},
  { title: '获取状态', dataIndex: 'bgdhqzt', fixed: 'left', width: 100,
    render: { func: 'renderCkfpSjxzBgdHqzt' },
    filter: {
      type: 'Select',
      list: [
        { text: '已获取', value: '1' },
        { text: '未获取', value: '2' }
      ],
  }},
  { title: '开票状态', dataIndex: 'bgdkpzt', fixed: 'left', width: 100,
    render: { func: 'renderCkfpSjxzBgdKpzt' },
    filter: {
      type: 'Select',
      list: [
        { text: '已开票', value: '1' },
        { text: '未开票', value: '2' }
      ],
  }},
  { title: '报关单号/统一编号', dataIndex: 'ckbgdh', fixed: 'left', width: 180, sorter: true },
  { title: '申报日期', dataIndex: 'hgckhwbgdsbrq', width: 130, render: { type: 'date', format: 'YYYY-MM-DD' }, sorter: true },
  { title: '出口日期', dataIndex: 'ckrq1', width: 130, render: { type: 'date', format: 'YYYY-MM-DD' }, sorter: true },
  { title: '下载日期', dataIndex: 'xzsj', width: 130, render: { type: 'date', format: 'YYYY-MM-DD' }, sorter: true },
  { title: '境外收发货人', dataIndex: 'jwshrwwmc', width: 130, ellipsis: true },
  { title: '合同号', dataIndex: 'ckhth', width: 180, ellipsis: true, sorter: true },
  {
    title: '成交方式', dataIndex: 'hgcjfsmc', width: 115, ellipsis: true,
    filter: {
      type: 'Select',
      codeTable: 'code_dm_ckts_hgcjfs_mc:01',
    },
  },
  { title: '成交币制', dataIndex: 'cjhghbszDm', width: 70 },
  { title: '成交金额', dataIndex: 'cjzj', width: 125, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '海关出口商品代码', dataIndex: 'hgckspDm', width: 150, ellipsis: true },
  { title: '海关商品名称', dataIndex: 'hgspmc', width: 140, ellipsis: true },
  { title: '成交单位', dataIndex: 'sbjldwmc', width: 100, ellipsis: true },
  { title: '成交数量', dataIndex: 'sbsl1', width: 115, render: { type: 'number', format: '0,0.00000' },  },
  { title: '法定第一单位', dataIndex: 'dyjldwDm', width: 110, codeTable: 'CODE_DM_CKTS_HGJLDW:01'},
  { title: '法定第一数量', dataIndex: 'cksl', width: 115,  render: { type: 'number', format: '0,0.00000' }, },
  { title: '运费', dataIndex: 'yfszl', width: 80, align: 'right', render: { type: 'number', format: '0,0.000000' } },
  { title: '运费币制', dataIndex: 'yfhbmc', width: 70,ellipsis: true },
  { title: '保费', dataIndex: 'bfszl', width: 80, align: 'right', render: { type: 'number', format: '0,0.000000' } },
  { title: '保费币制', dataIndex: 'bfhbmc', width: 70,ellipsis: true },
  { title: '杂费', dataIndex: 'zfszl', width: 80, align: 'right', render: { type: 'number', format: '0,0.000000' } },
  { title: '杂费币制', dataIndex: 'zfhbmc', width: 70,ellipsis: true },
  // { title: '监管方式代码', dataIndex: 'jgfsDm', width: 100 },
  { title: '监管方式', dataIndex: 'jgfsmc', width: 130, ellipsis: true },
  {
    title: '运输方式', dataIndex: 'ysfsDm', width: 120, codeTable: 'CODE_DM_CKTS_HGYSFS:01', ellipsis: true,
    filter: {
      type: 'Select',
      codeTable: 'CODE_DM_CKTS_HGYSFS:01',
    },
  },
  { title: '提运单号', dataIndex: 'tydh', width: 150, ellipsis: true },
  { title: '口岸代码', dataIndex: 'hggqkaDm', width: 120 },
  { title: '出口口岸', dataIndex: 'hggqkajc', width: 140 },
  { title: '运抵国（地区）', dataIndex: 'ydggjhdqjc', width: 140 },
  { title: '出口发票号', dataIndex: 'ckfph', width: 140, ellipsis: true }
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'ckbgdhsec', label: '报关单号/统一编号', type: 'Input' },
  { name: 'ckrq1', label: '出口日期', type: 'DatePicker', range: true },
  { name: 'ckhth', label: '合同号', type: 'Input' },
  { name: 'jgfsDm', label: '监管方式', type: 'Select', showType: '3', showSearch: true, codeTable: 'CODE_DM_CKTS_HGJGFS:01' },
  { name: 'hggqkaDm', label: '出口口岸', type: 'Select', showType: '3', showSearch: true, codeTable: 'CODE_DM_GY_HGGQKA:01' },
  { name: 'ydgdqszDm', label: '运抵国（地区）', type: 'Select', showType: '3', showSearch: true, codeTable: 'CODE_T_GBCODE_INFO:02' },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  download: false,
  full: true,
  reload: true,
  ckts_download: true,                   // 是否显示导出，默认关闭
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};
// 配置项：自定义工具栏
unitConfig.customer_toolbar = [
// { name: '关单获取', key: 'xz', func: 'openBgdxzModal' },
  { name: '同步结关状态', key: 'fpzssjxzglBgdTbjgzt', func: 'handleBgdTbjgzt'},
];

unitConfig.handle_columns = [];
export default unitConfig;
