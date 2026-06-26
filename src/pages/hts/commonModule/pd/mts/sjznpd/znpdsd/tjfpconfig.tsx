import CONSTANTS from '@/components/DDAssist/constants';

const config: any = {};

config.module_key = 'MTS_ZNPD_QUERY_DZFPPAGE';
config.page_id = 'mts_wbsj_znpd_sppmflpd_ckfp';
config.api_grid_query = `/yw/mts/znpd/fp/dzfpQueryPage`;
config.grid_selection_type = 'checkbox';
config.grid_row_key = 'fpcodeId';
config.layout_type = 'modal';
config.grid_click_checked = false;
config.grid_columns = [
  { title: '发票代码', dataIndex: 'fpDm', width: 130, fixed: 'left', },
  { title: '发票号码', dataIndex: 'fpNo', width: 120, fixed: 'left', },
  { title: '发票行号', dataIndex: 'fphh', width: 80, fixed: 'left', },
  { title: '商品名称', dataIndex: 'bgdFpSpmc', width: 180, ellipsis: true },
  { title: '规格型号', dataIndex: 'ggxh', width: 150, ellipsis: true },
  { title: '供货方税号', dataIndex: 'xfswsbh', width: 180, ellipsis: true },
  { title: '开票日期', dataIndex: 'kprq', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '数量/单位', dataIndex: 'sldw', width: 110, ellipsis: true , render: { func: 'renderZnpdSddw' } },
  { title: '剩余数量/单位', dataIndex: 'sysldw', width: 110, ellipsis: true , render: { func: 'renderZnpdSySddw' } },
  { title: '计税金额', dataIndex: 'je', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '剩余金额', dataIndex: 'syje', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
];
config.gridParams = {
  initSearchModal: [
    {property: "fpsbztDms", value: ['1'], op: "al"},
    {property: "notInFpcllxDm", value: ["2", "3", "4", "5"], op: "al"},
  ],
}
config.filter_items = [
  { name: 'fpNo', type: 'Input', label: '发票号码' },
  { name: 'bgdFpSpmc', type: 'Input', label: '商品名称' },
  { name: 'ggxh', type: 'Input', label: '规格型号' },
  { name: 'xfswsbh', type: 'Input', label: '供货方税号' },
  { name: 'kprq', type: "DatePicker", range: true, label: '开票日期' },
];
// 配置项：自定义工具栏
config.customer_toolbar = [
  { name: '添加', func: 'addFpxx' },
];

config.toolbar_default = {
  setting: false,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};
config.handle_columns = [];
export default config;
