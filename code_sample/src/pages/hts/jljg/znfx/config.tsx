/**
 * title: 智能分析
 * author: yxy
 */
import './style.less'; 

const unitConfig: any = {};

// 配置项
unitConfig.unit_key = 'JLJG_ZXSB_SB_JLJG_ZNFX_GETSZCMX';                              // 业务单元key，对应后端接口
unitConfig.grid_show_serial_number = false;                                           // 是否显示序号，可选
unitConfig.grid_row_key = 'zbuuid';                                                     // 列表主键，默认uuid
unitConfig.grid_show_data_num = false;
unitConfig.export_key = 'JLJG_ZXSB_SB_JLJG_ZNFX_GETSZCMX';                              // 业务单元key，对应后端接口

// 计算状态
const jsTitleTooltip = 
'计算中：正在进行重新计算美元额；{br}'+
// '待计算：已申请重新计算美元额，待进行计算；{br}'+
'计算失败：存在计算失败的报关单数据；{br}'+
'计算成功：重新计算成功，待进行智能分析。{br}';

// 分析状态
const fxTitleTooltip = '待分析：未进行智能分析；{br}'+
'分析中：正在进行智能分析；{br}'+
'有差异：智能分析结束，产生差异结果；{br}'+
'无差异：智能分析结束，无差异结果；{br}'+
'分析失败：智能分析失败；{br}';

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '手（账）册号', dataIndex: 'bah', width: 215, ellipsis: true, fixed: 'left' },
  { title: '核销周期', titleTooltip: '手册显示结案日期{br}账册显示海关的核销起始日期和核销截止日期', dataIndex: 'hxzqxs', width: 120 , fixed: 'left',sorter: true,render: { func: 'renderZnfxHxzq'}},
  { title: '申报{br}状态', titleTooltip: '未申报：未生成到明细采集；{br}待申报：已生成到明细采集且未正式申报核销；{br}已申报：已正式申报核销。', dataIndex: 'sbztDm',
    codeTable: ['CODE_DM_ZXSB_SBZT', '01'],width: 85, fixed: 'left',
    filter: {
      type: 'Select',
      codeTable: ['CODE_DM_ZXSB_SBZT', '01'],
    }
  },
  // { title: '分析{br}状态', titleTooltip: fxTitleTooltip, dataIndex: 'jmfxztDm',
  //   width: 140, render: { func: 'renderZnfxBdjg'},fixed: 'left',
  //   filter: {
  //     type: 'Select',
  //     codeTable: ['url_code_zxsb_jmfxzt', '01'],
  //   }
  // },
  { title: '计算{br}状态', titleTooltip: jsTitleTooltip, dataIndex: 'jmjejsztDm',
    width: 85,codeTable : ['CODE_DM_ZXSB_JMJEJSZT','01'],fixed: 'left',
    filter: {
      type: 'Select',
      codeTable: ['CODE_DM_ZXSB_JMJEJSZT', '01'],
    }
  },
  { title: '分析{br}状态', titleTooltip: fxTitleTooltip, dataIndex: 'jmfxztDm',
  width: 85, fixed: 'left', render: { func: 'renderZnfxBdjg'},
  filter: {
    type: 'Select',
    codeTable: ['CODE_DM_ZXSB_JMFXZT', '01'],
  }
},
  { title: '海关数据', children: [
      { title: '进口总额{br}（美元）', dataIndex: 'hgjsjkzz', width: 105, align: 'right', render: { func: 'renderZnfxJkzeHg' } },
      { title: '出口总额{br}（美元）', dataIndex: 'hgjsckzz', width: 105,  align: 'right', render: { func: 'renderZnfxCkzeHg' } },
      { title: '分配率{br}（%）', dataIndex: 'hgjsfpl', width: 90, align: 'right', render: { func: 'renderZnfxFplv' }},
      { title: '进口核注清单{br}（张/条）', titleTooltip: '只统计监管方式参与核销计算的进口保税核注清单', dataIndex: 'hgjkhzqd', width: 120, align: 'right', render: { func: 'renderZnfxJkhzqdHg'}},
      { title: '出口核注清单{br}（张/条）', titleTooltip: '只统计监管方式参与核销计算的出口保税核注清单', dataIndex: 'hgckhzqd', width: 120, align: 'right', render: { func: 'renderZnfxCkhzqdHg' }},
      { title: '进口关单{br}（张/条）', titleTooltip: '只统计监管方式参与核销计算的进口报关单', dataIndex: 'hgjkbgd', width: 100, align: 'right', render: { func: 'renderZnfxJkgdHg'}},
      { title: '出口关单{br}（张/条）', titleTooltip: '只统计监管方式参与核销计算的出口报关单', dataIndex: 'hgckbgd', width: 100, render: { func: 'renderZnfxCkgdHg' }},
    ]
  },
  { title: '税务反馈数据', children: [
      { title: '进口总额{br}（美元）', dataIndex: 'jsjkzz', width: 105, align: 'right', render: { func: 'renderZnfxJkzeSj' } },
      { title: '出口总额{br}（美元）', dataIndex: 'jsckzz', width: 105,  align: 'right', render: { func: 'renderZnfxCkzeSj' } },
      { title: '分配率{br}（%）', dataIndex: 'jsfpl', width: 90, align: 'right', render: { func: 'renderZnfxFplv' }},
      { title: '进口关单{br}（张/条）', titleTooltip: '只统计监管方式参与核销计算的进口报关单', dataIndex: 'jkbgd', width: 100, align: 'right', render: { func: 'renderZnfxJkgdSj'}},
      { title: '出口关单{br}（张/条）', titleTooltip: '只统计监管方式参与核销计算的出口报关单', dataIndex: 'ckbgd', width: 100, align: 'right', render: { func: 'renderZnfxCkgdSj'}},
      { title: '已申报出口额', dataIndex: 'sbrmblaj', width: 110, align: 'right', render: { func: 'renderZnfxYsbckeSj' }},
    ]
  },
];

// 配置项：列表排序字段
unitConfig.grid_setting_sort = [
  { col: '报关单号', order: 'asc', name: 'bgd' },
  { col: '出口日期', order: 'desc', name: 'ckrq' },
  { col: '数据检查状态', order: 'default', name: 'sjjczt' },
  { col: '征免类型', order: 'default', name: 'zmlx' }
];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
unitConfig.grid_filter_quick = [
  {
    label: '核销',
    name: 'hxztDm',
    type: 'Select',
    list: [
      { label: '全部', value: '0' },
      { label: '已核销', value: '1' },
      { label: '应核销', value: '2' },
      { label: '可不核销', value: '3'},
    ],
    tooltip: '账册：在海关已核销，核销截止日期在核销时间范围内账册，则需申报核销。账核销周期需连续且不重叠。{br}手册：在海关已核销，结案日期在核销时间范围内，且手册下报关单涉及申报退税，则需申报核销。{br}以上规则适用于一般情况，如有特殊规定，以当地税务机关要求为准。',
    style:{width: 100},
  },
  {
    label: '核销周期',
    name: 'hxzq',
    type: 'DatePicker',
    range:true,
    allowClear: false,
    tooltip: '调整核销周期范围',
    onChange : 'handleOnChangeHxzq',
  },
  { label: '手（账）册号', name: 'bah', type: 'Input', width: '3w', searchButton: true },

];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  // download: {name: '导出', key: 'znfxSjdc', func: 'handleZnfxSjdc'},               // 是否显示下载按钮，默认开启
  download: true,               // 是否显示下载按钮，默认开启
  reload: true,
  full: true,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};

// 配置项：自定义工具栏
unitConfig.costomer_toobar= [
  { name: '差异分析', key: 'znfx', func: 'handleZnfxZnfx'},
  { name: '重新计算美元额', key: 'mye',func: 'handleZnfxMye'},
  { name: '生成核销明细', key: 'scmx',func: 'handleZnfxScmx'},
];

export default unitConfig;