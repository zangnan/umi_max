import CONSTANTS from '@/components/DDAssist/constants';

const config: any = {};

// config.api_grid_query = `/yw/bszx/wbsj/dlckhwzm/queryDlckhwzmPage`; // api 列表查询
config.module_key = 'MTS_SJPP_TZPD_QUERY_PAGE';                  // 业务单元key，对应后端接口
config.grid_row_key = 'uuid';
config.grid_show_serial_number = false;                      // 工具栏左侧是否显示数据条数及选中数，默认true显示
config.grid_click_checked = '1';                                 // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
config.grid_selection_type = "checkbox";
config.api_form_delete = `/saas/tssb/tzpd/batchDeleteTzpdmx`; // api 表单删除
config.module_type = 'QZ_type';

config.grid_columns = [
  { title: '使用状态', dataIndex: 'scbz1', width: 100, codeTable: 'CODE_STATIC_SJPP_TZPD:01',fixed:'left',
    filter: {
    type: 'Select',
    codeTable: 'CODE_STATIC_SJPP_TZPD:01',
  } },
  { title: '报关单号', dataIndex: 'bgdhgbh', width: 180, },
  { title: '项号', dataIndex: 'hwxh', width: 50,  },
  { title: '出口发票号', dataIndex: 'ckfph', width: 170, },
  { title: '发票代码', dataIndex: 'fpDm', width: 100,  ellipsis: true},
  { title: '发票号码', dataIndex: 'fphm', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '数电票号码', dataIndex: 'sdfphm', width: 180, ellipsis: true},
  // { title: '进货凭证号', dataIndex: 'jhpzh', width: 100, ellipsis: true},
  { title: '行号', dataIndex: 'hh', width: 50, ellipsis: true},
  { title: '占用发票数量', dataIndex: 'bcsl', width: 120, render: { type: 'number', format: '0,0.00000' },align: 'right',  },
  { title: '占用发票计税金额', dataIndex: 'bcje', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '合同协议号', dataIndex: 'ckhth', align: 'left', width: 160, ellipsis: true},
  { title: '出口日期', dataIndex: 'ckrq1', width: 120, sorter: true, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '海关商品代码', dataIndex: 'hgckspDm', width: 120, },
  { title: '海关商品名称', dataIndex: 'hgspmc', width: 160,  ellipsis: true},
  { title: '法定单位', dataIndex: 'hgjldwmc', width: 80, ellipsis: true },
  { title: '可用法定数量', dataIndex: 'kyfdsl', width: 110, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '成交单位', dataIndex: 'sbjldwmc', width: 80, ellipsis: true },
  { title: '可用成交数量', dataIndex: 'kycjsl', width: 110, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '可用美元离岸价', dataIndex: 'kymylaj', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
  { title: '数据来源', dataIndex: 'sjlyDm2', align: 'right', width: 100, codeTable: 'CODE_DM_ZXSB_SJLY_MC:01',
    filter: {
    type: 'Select',
    codeTable: 'CODE_DM_ZXSB_SJLY_MC:01',
  } },
];
config.filter_items = [
  { name: 'bgdhgbh', label: '出口报关单号', type: 'Input' },
  { name: 'ckfph', label: '出口发票号', type: 'Input' },
  { name: 'fpDm', label: '发票代码', type: 'Input' },
  { name: 'fphm', label: '发票号码',type: 'Input'},
  { name: 'sdfphm', label: '数电票号码',type: 'Input'},
  { name: 'ckrq1', label: '出口日期', isLabel: true, range: true,type: 'DatePicker' },
];
// 配置项：自定义工具栏
config.customer_toolbar = [
  { name: '模版下载', key: 'mbxz', func: 'mbxz' },
  { name: '台账导入', key: 'tzdr', func: 'tzdr' },
  { name: '自动配单', key: 'zdpd', func: 'zdpd' },
];
// 配置项：工具栏
config.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
  delete: true,
};
config.handle_columns = [];
export default config;
