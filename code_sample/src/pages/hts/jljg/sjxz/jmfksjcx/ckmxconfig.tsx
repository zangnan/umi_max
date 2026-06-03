import myUtil from '@/pages/common/myUtil';

/**
 * title: 免抵退出口明细数据
 */
const unitConfig: any = {};

// 配置项
unitConfig.unit_key = 'JLJG_ZXSB_SB_JLJG_TSSB_F';                                         // 业务单元key，对应后端接口
unitConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.grid_selection_type = false;                                               //复选框隐藏
unitConfig.grid_show_data_num = false;                                              // 工具栏左侧是否显示数据条数及选中数，默认显示
unitConfig.export_key = 'SAAS_SJGL_JMFKSJCX_SWMDTCKMXSJ_DC';
unitConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出

// 配置列表列
unitConfig.grid_columns = [
  { title: '所属期', dataIndex: 'ssq', fixed: 'left', width: 80, align: 'left', sorter: true},
  { title: '序号', dataIndex: 'sbxh', fixed: 'left', width: 80, align: 'left', },
  { title: '出口报关单号', dataIndex: 'ckbgdh',  width: 190, align: 'left',sorter: true },
  { title: '代理出口证明号', dataIndex: 'dlckhwzmhm', width: 190, align: 'left', sorter: true},
  { title: '出口日期', dataIndex: 'ckrq1', width: 120, align: 'left', render: { type: 'date', format: 'yyyy-MM-DD' }, sorter: true},
  { title: '出口发票号', dataIndex: 'ckfph', width: 140, align: 'left', ellipsis: true },
  { title: '手（账）册号', dataIndex: 'jljgszch', width: 215, ellipsis: true, align: 'left',sorter: true },
  { title: '先退后核合同号', dataIndex: 'ckhth', width: 140, align: 'left', titleTooltip: '先退税后核销出口合同号', ellipsis: true},
  { title: '出口商品代码', dataIndex: 'ckspDm', width: 120, align: 'left'},
  { title: '出口商品名称', dataIndex: 'sbhgspmc', width: 120, align: 'left',ellipsis: true},
  { title: '申报商品代码', dataIndex: 'sbspDm', width: 120, align: 'left', },
  { title: '申报商品名称', dataIndex: 'sbspmc', width: 120, align: 'left',ellipsis: true },
  { title: '计量单位', dataIndex: 'hgjldwmc', width: 80, align: 'left', },
  { title: '出口数量', dataIndex: 'cksl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '原币币别', dataIndex: 'cjhbzmDm', width: 100, align: 'left', ellipsis: true,filter: {
    type: 'Select',
    codeTable: ['code_dm_gy_hb', '01'],
    showCode: true,
  } },
  { title: '原币币别名称', dataIndex: 'cjhbzmmc', width: 120, align: 'left', ellipsis: true,render: (text: any, record: any) => myUtil.code.getCodeValByKey(record.cjhbzmDm, 'code_dm_gy_hb', '01')},
  { title: '原币汇率', dataIndex: 'cjhbhl', width: 100, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '原币离岸价', dataIndex: 'cjzj', width: 140, align: 'right',  render: { type: 'number', format: '0,0.00' } },
  { title: '人民币出口销售额', dataIndex: 'rmblaj', width: 160, align: 'right', render: { type: 'number', format: '0,0.00' }},
  { title: '美元汇率', dataIndex: 'myhl', width: 100, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '美元出口销售额', dataIndex: 'mylaj', width: 150, align: 'right', render: { type: 'number', format: '0,0.00' }},
  { title: '征税率', dataIndex: 'zssl', width: 80, align: 'right',  render: { type: 'number', format: '0,0.00000' }},
  { title: '退税率', dataIndex: 'tsl', width: 80, align: 'right', render: { type: 'number', format: '0,0.00000' }},
  { title: '计划分配率', dataIndex: 'jsfpl', width: 100, align: 'right',render: { type: 'number', format: '0,0.00000' } },
  { title: '进料组成计税价格',titleTooltip:'进料加工保税进口料件组成计税价格', dataIndex: 'jljgbsjkljzcjsjg', width: 150, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '免税原材价格',titleTooltip:'国内购进免税原材料价格',  dataIndex: 'gngjmsycljg', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' }},
  { title: '不得免征和抵扣税额', dataIndex: 'mdtsbdmzhdkse', width: 145, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '免抵退税额', dataIndex: 'mdtse', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' }},
  { title: '业务类型代码', dataIndex: 'cktmsywlxdmjh', width: 130 },
  { title: '业务类型名称', dataIndex: 'cktmsywlxmcjh', width: 140, ellipsis: true },
  { title: '免抵退税年月', dataIndex: 'mdtsny', width: 130, align: 'left',sorter: true },
  // { title: '暂缓标志', dataIndex: 'zhbz1', width: 100, align: 'left',codeTable: ['CODE_STATIC_JLJGHX_SFBZ', '01'],
  //   filter: {
  //     type: 'Radio',
  //     codeTable: ['CODE_STATIC_JLJGHX_SFBZ', '01'],
  //   }
  // },
  { title: '不予退税标志', dataIndex: 'bytsbz', width: 130, align: 'left',codeTable: ['CODE_STATIC_JLJGHX_SFBZ', '01'],
    filter: {
      type: 'Radio',
      codeTable: ['CODE_STATIC_JLJGHX_SFBZ', '01'],
    }
  },
  { title: '不予办理标志', dataIndex: 'byblbz', width: 130, align: 'left',codeTable: ['CODE_STATIC_JLJGHX_SFBZ', '01'],
    filter: {
      type: 'Radio',
      codeTable: ['CODE_STATIC_JLJGHX_SFBZ', '01'],
    }
  },
  { title: '暂不办理标志', dataIndex: 'zbblbz', width: 130, align: 'left',codeTable: ['CODE_STATIC_JLJGHX_SFBZ', '01'],
    filter: {
      type: 'Radio',
      codeTable: ['CODE_STATIC_JLJGHX_SFBZ', '01'],
    }
  },
  { title: '解除暂不办理年月', dataIndex: 'zzjczbblzyny', width: 150, align: 'left', titleTooltip: '最终解除暂不办理准予年月'},
  { title: '暂不办理年月', dataIndex: 'zbblny', width: 120, align: 'left', },
  { title: '不予办理年月', dataIndex: 'byblny', width: 120, align: 'left', },
  { title: '备注', dataIndex: 'bz', width: 100, align: 'left',  ellipsis: true },
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'ssq', label: '所属期', type: 'Input' },
  { name: 'ckbgdh', label: '出口报关单号', type: 'Input' },
  { name: 'dlckhwzmhm', label: '代理出口证明号', type: 'Input' },
	{ name: 'ckrq1', label: '出口日期', type: 'DatePicker', 'allowClear': true, 'range': true},
  { name: 'jljgszch', label: '手（账）册号', type: 'Input' },
  { name: 'ckspDm', label: '出口商品代码', type: 'Input' },
	{ name: 'cktmsywlxdmjh', label: '业务类型代码', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_ckts_cktmsywlx',  '01'] },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  ckts_download: false,
  tssb_download: true,
  reload: true,
  full: true,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};

export default unitConfig;
