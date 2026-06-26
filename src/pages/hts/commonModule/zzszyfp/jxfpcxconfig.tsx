import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 进项发票
 */
const ckbgdConfig: any = {};

ckbgdConfig.gridParams = {
  initSearchModal: [
    { property: 'cdDm', value: "JXFP_020601", op: 'zdy' },
  ]
}
// 配置列表列
ckbgdConfig.grid_columns = [
  { title: '发票号码', dataIndex: 'fphm', width: 180, ellipsis: true, sorter: true, render: { func: 'renderBgdscmxbgdhSjgl' },fixed: 'left' },
  { title: '发票代码', dataIndex: 'fpDm', width: 120, sorter: true },
  {
    title: '认证/稽核状态', dataIndex: 'rzjhztdm', width: 160, codeTable: 'CODE_STATIC_TZ_FPZT:01',
    filter: {
      type: 'Select',
      codeTable: 'CODE_STATIC_TZ_FPZT:01',
    }
  },
  {
    title: '发票种类', dataIndex: 'fpzlDm1', width: 160, codeTable: 'CODE_DM_ZXSB_FPZLXQGZ:01',
    filter: {
      type: 'Select',
      codeTable: 'CODE_DM_ZXSB_FPZLXQGZ:01',
    }
  },
  {
    title: '发票用途', dataIndex: 'fpcllxDm', width: 160, codeTable: 'CODE_STATIC_FPYT:01',
    filter: {
      type: 'Select',
      codeTable: 'CODE_STATIC_FPYT:01',
    }
  },
  {
    title: '是否退税', dataIndex: 'tsbz', width: 100, render: { func: 'renderYAndN' },
    filter: {
      type: 'Select',
      list: [
        { text: '是', value: 'Y' },
        { text: '否', value: 'N' }
      ],
    }
  },
  { title: '销售方纳税人识别号', dataIndex: 'xfnsrsbh', width: 180, ellipsis: true },
  { title: '销售方纳税人名称 ', dataIndex: 'xhfnsrmc', width: 180, ellipsis: true },
  { title: '开票日期', dataIndex: 'kprq', width: 140, sorter: true, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '行号', dataIndex: 'hh', width: 90 },
  { title: '货物或应税劳务、服务名称', dataIndex: 'hwhyslwmc', width: 200, ellipsis: true },
  { title: '规格型号', dataIndex: 'ggxh', width: 180, ellipsis: true },
  { title: '单位', dataIndex: 'jldwmc', align: 'left', width: 80, ellipsis: true },
  { title: '数量', dataIndex: 'sl3', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '内销数量', dataIndex: 'nxsl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '单价', dataIndex: 'dj', align: 'right', width: 140 },
  { title: '金额', dataIndex: 'je', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
  { title: '税率', dataIndex: 'sl1', align: 'right', width: 80, render: { type: 'number', format: '0,0.0000' } },
  { title: '税额', dataIndex: 'se', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
  { title: '备注', dataIndex: 'bz', width: 160, ellipsis: true },
  { title: '业务编号', dataIndex: 'ywbh', width: 160, ellipsis: true },
  { title: '标签', dataIndex: 'bqsm', width: 160, ellipsis: true },
];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
ckbgdConfig.filter_items = [
  { name: 'fphm', label: '发票号码', type: 'Input', },
  { name: 'fpDm', label: '发票代码', type: 'Input' },
  { name: 'xfnsrsbh', label: '销售方纳税人识别号  ', type: 'Input' },
  { name: 'kprq', label: '开票日期', type: 'DatePicker', range: true },
  { name: 'hwhyslwmc', label: '货物或应税劳务、服务名称', type: 'Input' },
  { name: 'ywbh', label: '业务编号', type: 'Input' },
  { name: 'tzsxbz', label: '台账数据', type: 'Select', codeTable: 'CODE_STATIC_SJGL_TZSJ:01' },
  { name: 'xhfnsrmc', label: '销售方纳税人名称  ', type: 'Input'},
  { name: 'bqsm', label: '标签  ', type: 'Input'},
];
// 配置项：自定义工具栏
ckbgdConfig.customer_toolbar = [
  {
    name: '批量修改',
    type: 'dropdown',
    key: 'jxfpplxg',
    list: [
      { name: '是否退税', func: 'btnSetSfts' },
      { name: '业务编号', func: 'btnSetYwbh' },
      { name: '发票用途', func: 'btnSetFpyt' },
      { name: '标签', func: 'btnSetBq' },
    ],
  },
  { name: '台账筛选', key: '3', func: 'importTzsx' },
  { name: '打印', key: '1719970930', func: 'fpdyFuncDy' },
  { name: '小计', key: '1719910660', func: 'xj' },

];

ckbgdConfig.handle_columns = [];
export default ckbgdConfig;
