import myUtil from '@/pages/common/myUtil';
/**
 * title: 申报结果查询的已核销调整表
 * author: zxy
 */
const yhxtzConfig: any = {};

// 配置项 
yhxtzConfig.unit_key = 'JLJG_ZXSB_SB_JLJG_HGSJTZ_J';                                      // 业务单元key，对应后端接口
yhxtzConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
yhxtzConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
yhxtzConfig.grid_selection_type = false;                                               // 列表首选项类别，默认 checkbox，可选 false radio checkbox
yhxtzConfig.grid_show_data_num = false;                                                // 工具栏左侧是否显示数据条数及选中数，默认true显示
yhxtzConfig.layout_type = 'tabs';


// 配置项：列表列
yhxtzConfig.grid_columns = [
  { title: '所属期', dataIndex: 'ssq', width: 80, fixed: 'left', sorter: true },
  { title: '申报批次', dataIndex: 'sbpc', width: 80, fixed: 'left' },
  { title: '序号', dataIndex: 'sbxh', width: 105, fixed: 'left' },
  { title: '申报核销手（账）册号', dataIndex: 'jljgszch', width: 215, ellipsis: true, sorter: true, fixed: 'left' },
  { title: '核销起始日期', dataIndex: 'hxqsrq', width: 140, render: { type: 'date', format: 'yyyy-MM-DD' }, sorter: true },
  { title: '核销截止日期', dataIndex: 'hxjzrq', width: 140, render: { type: 'date', format: 'yyyy-MM-DD' }, sorter: true },
  {
    title: '进（出）口标识', dataIndex: 'jckbzDm', width: 140 , codeTable: ['CODE_STATIC_JLJGHX_JCKBZ', '01'],
    filter: {
      type: 'Radio',
      codeTable: ['CODE_STATIC_JLJGHX_JCKBZ', '01'],
    }
  },
  { title: '报关单号', dataIndex: 'ckbgdh', width: 190,ellipsis: true, },
  { title: '代理证明号', dataIndex: 'dlckhwzmhm', width: 190, titleTooltip: '代理进（出）口货物证明号',ellipsis: true,},
  { title: '进（出）口日期', dataIndex: 'ckrq1', width: 130, sorter: true,render: { type: 'date', format: 'yyyy-MM-DD' } },
  { title: '美元到岸价', dataIndex: 'jljgmsjkljzcjsjgmy', width: 125, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '人民币到岸价', dataIndex: 'jljgmsjkljzcjsjgrmb', width: 125, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '美元销售额', dataIndex: 'sbckxsemy', width: 125, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '人民币销售额', dataIndex: 'ckxse', width: 125, align: 'right', render: { type: 'number', format: '0,0.00' } },
  {
    title: '监管方式代码', dataIndex: 'jgfsDm', ellipsis: true, width: 130,
    // filter: {
    //   type: 'Select',
    //   codeTable: ['CODE_DM_CKTS_HGJGFS', '01'],
    //   showCode: true,
    // }
  },
  { title: '监管方式名称', dataIndex: 'jgfsmc', ellipsis: true, width: 160, render: (text: any, record: any) => myUtil.code.getCodeValByKey(record.jgfsDm, 'CODE_DM_CKTS_HGJGFS', '01')},
  { title: '海关实征关税和消费税', dataIndex: 'msjkljhgszgshxfs', width: 180, align: 'right', render: { type: 'number', format: '0,0.00' }, titleTooltip: '免税进口料件组成计税价格海关实征关税和消费税', },
  { title: '进料组成计税价格合计', dataIndex: 'jljgmsjkljzcjsjg', width: 180, align: 'right', render: { type: 'number', format: '0,0.00' }, titleTooltip: '免税进口料件组成计税价格合计', },
  { title: '所属年度', dataIndex: 'nd', width: 80, },
  { title: '备注', dataIndex: 'bz', width: 200, ellipsis: true },
  // { title: '审核标志', dataIndex: 'shbz', width: 90, codeTable: ['CODE_STATIC_JLJGHX_SFBZ', '01']},
];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
yhxtzConfig.filter_items = [
  { name: 'ssq', label: '所属期', type: 'Input' },
  { name: 'sbpc', label: '申报批次', type: 'Input' },
  { name: 'jljgszch', label: '申报核销手（账）册号', type: 'Input' },
  { name: 'ckbgdh', label: '报关单号', type: 'Input' },
  { name: 'dlckhwzmhm', label: '代理证明号', type: 'Input' },
  { name: 'jgfsDm', label: '监管方式代码', type: 'Select', showType: '3',showSearch: true, codeTable: ['CODE_DM_CKTS_HGJGFS', '01'] }
];


// 配置项：工具栏
yhxtzConfig.toolbar_default = {
  add: false,                   // 是否显示增加按钮，默认开启
  delete: false,                // 是否显示删除按钮，默认开启
  ckts_download: true,               // 是否显示下载按钮，默认开启
  upload: false,                // 是否显示上传按钮，默认开启
  setting: true,
  full: true,                   // 是否显示全屏按钮，默认开启
  reload: true,
  ckts_sum: true

};

// 配置项：列表操作列
yhxtzConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};

yhxtzConfig.grid_filter_quick = [
  {
    label: '数据标识',
    name: 'sjbs',
    searchModelBz: false,
    searchFlag: false,
    type: 'Select',
    defaultValue: 'JLJG_ZXSB_SB_JLJG_HGSJTZ_J',
    onChange: 'yhxtzSjbsOnChange',
    list: [
      { label: '已申报数据', value: 'JLJG_ZXSB_SB_JLJG_HGSJTZ_J' },
      { label: '已核销数据', value: 'JLJG_ZXSB_SB_JLJG_HGSJTZ_F' },
    ],
  },
];

yhxtzConfig.costomer_toobar = [
  { name: '报表打印', key: 'yhxtzCxBbdy', func: 'handleMdthxHgsjtzCxBbdy' },
];

export default yhxtzConfig;