/**
 * title: 12.跨境应税行为收讫营业款明细清单
 * author: wxl
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '（单位：元、美元）';
unitConfig.unit_key = 'CX_SJFX_SC_TSQK_TSSBQK_XZ_KJYSXWSQYYKMXQD';                            // 业务单元key，对应后端接口
unitConfig.page_id = 'CX_SJFX_SC_TSQK_TSSBQK_XZ_KJYSXWSQYYKMXQD';                                        // 页面id
unitConfig.show_toolbar = true;                                                       // 是否开启工具栏，默认true开启
unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.layout_type = 'modal';                                                     // 页面类型，默认default 可选 default modal tabs
unitConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
unitConfig.export_key = 'CX_SJFX_SC_TSQK_TSSBQK_XZ_KJYSXWSQYYKMXQD_PRINT_REPORT';
unitConfig.module_type = 'sjbb';

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '所属期', dataIndex: 'ssq', width: 90, fixed: 'left', render: { type: 'date', format: 'yyyyMM' } },
  { title: '序号', dataIndex: 'sbxh', width: 90, sorter: true },
  { title: '合同号', dataIndex: 'hth', width: 140 },
  { title: '本期收款时间', dataIndex: 'skrq', width: 120, sorter: true, render: { type: 'date', format: 'yyyy-MM-DD' } },
  { title: '本期收款凭证号', dataIndex: 'skpzh', width: 120, ellipsis: true },
  { title: '收款凭证美元总金额', dataIndex: 'skpzzjemy', width: 180, sorter: true, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '原币代码', dataIndex: 'cjhbzmDm', width: 100 },
  { title: '原币币别', dataIndex: 'cjhbmc', width: 120 },
  { title: '原币收款额', dataIndex: 'cjzj', width: 140, sorter: true, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '原币汇率', dataIndex: 'cjhbhl', width: 120, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '本期收款人民币额', dataIndex: 'skjermb', width: 160, sorter: true, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '美元汇率', dataIndex: 'myhl', width: 120, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '本期收款美元额', dataIndex: 'skjemy', width: 160, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '本期收款银行名称', dataIndex: 'skyhmc', width: 150, ellipsis: true },
  { title: '本期付款单位名称', dataIndex: 'fkdwmc', width: 150, ellipsis: true },
  { title: '付款单位所在国家（地区）代码', dataIndex: 'gjhdqszDm', width: 220 },
  { title: '付款单位所在国家（地区）名称', dataIndex: 'gjhdqjc', width: 220, ellipsis: true },
  { title: '本期付款银行名称', dataIndex: 'fkyhmc', width: 150, ellipsis: true },
  { title: '累计已收款美元额 ', dataIndex: 'ljysyykmy', width: 160, sorter: true, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '累计已收款人民币额 ', dataIndex: 'ljysyykrmb', width: 160, sorter: true, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '申报标志 ', dataIndex: 'sbbz1', width: 120, render: { func: 'renderTzSbbz' }, },
  {
    title: '审核标志', dataIndex: 'shbz', width: 120, render: { func: 'renderTzShbz' },
    filter: {
      type: 'Radio',
      codeTable: 'CODE_DM_TZ_SBBZ:01',
    }
  },

];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
unitConfig.grid_filter_quick = [
  { label: '合同号', name: 'hth', type: 'Input', },
  { label: '本期收款凭证号', name: 'skpzh', type: 'Input', searchButton: true },
];

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                       // 是否显示编辑链接，默认关闭
  delete: false,                     // 是否显示删除链接，默认关闭
};

// 配置项：工具栏
unitConfig.toolbar_default = {
  ckts_download: true,                   // 是否显示导出，默认关闭
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: false,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};

export default unitConfig;
