import CONSTANTS from '@/components/DDAssist/constants';

const config: any = {};

config.module_key = 'MTS_ZNPD_QUERY_BGDINFO';
config.page_id = 'mts_wbsj_znpd_sppmflpd_ckbgd';
config.api_grid_query = `/yw/mts/znpd/bgd/queryBgdPager`;
config.grid_selection_type = 'checkbox';
config.grid_row_key = 'ckbgdId';
config.layout_type = 'modal';
config.grid_click_checked = false;
config.grid_columns = [
  { title: 'ckbgdId', dataIndex: 'ckbgdId', hidden: true },
  { title: '出口报关单号', dataIndex: 'bgdNo', width: 180, sorter: true, fixed: 'left' },
  { title: '出口日期', dataIndex: 'ljDate', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '海关商品代码', dataIndex: 'hgcmcode', width: 110, },
  { title: '海关商品名称', dataIndex: 'hgcmname', width: 180, ellipsis: true, },
  { title: '规格型号', dataIndex: 'ggxh', width: 150, ellipsis: true, },
  { title: '法定数量/单位', dataIndex: 'fdUnit', width: 170, render: { func: 'renderZnpdSdFd' }, },
  { title: '可用法定数量/单位', dataIndex: 'kyfdUnit', width: 170, render: { func: 'renderZnpdSdKyFd' }, },
  { title: '成交数量/单位', dataIndex: 'cjUnit', width: 170, render: { func: 'renderZnpdSdCj' }, },
  { title: '可用成交数量/单位', dataIndex: 'kycjUnit', width: 170, render: { func: 'renderZnpdSdKyCj' }, },
  { title: '第二数量/单位', dataIndex: 'fd2Unit', width: 170, render: { func: 'renderZnpdSdDe' }, },
  { title: '可用第二数量/单位', dataIndex: 'kyfd2Unit', width: 170, render: { func: 'renderZnpdSdKyDe' }, },
  { title: '出口发票号', dataIndex: 'invNo', width: 120, },
  { title: '出口合同号', dataIndex: 'htNo', width: 160, },
  { title: '美元离岸价', dataIndex: 'usdAmt', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
];
config.filter_items = [
  { name: 'bgdNo', type: 'Input', label: '出口报关单号' },
  { name: 'ljDate', type: "DatePicker", range: true, label: '出口日期' },
  { name: 'bgdFpSpmc', type: 'Input', label: '海关商品名称' },
  { name: 'ggxh', type: 'Input', label: '规格型号' },
  { name: 'htNo', type: 'Input', label: '出口合同号' },
  { name: 'invNo', type: 'Input', label: '出口发票号' },
];

// 配置项：自定义工具栏
config.customer_toolbar = [
  { name: '添加', func: 'addCkbgd' },
];

config.handle_columns = [];
export default config;
