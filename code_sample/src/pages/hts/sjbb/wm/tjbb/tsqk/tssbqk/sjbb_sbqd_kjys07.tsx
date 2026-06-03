/**
 * title: 07跨境应税行为免退税申报明细表
 * author: wxl
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '（单位：元、美元）';
unitConfig.unit_key = 'CX_SJFX_WM_TSQK_TSSBQK_XZ_KJYSXWMTSSBMXB';                            // 业务单元key，对应后端接口
unitConfig.page_id = 'CX_SJFX_WM_TSQK_TSSBQK_XZ_KJYSXWMTSSBMXB';                                        // 页面id
unitConfig.show_toolbar = true;                                                       // 是否开启工具栏，默认true开启
unitConfig.layout_type = 'modal';                                                     // 页面类型，默认default 可选 default modal tabs
unitConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.export_key = 'CX_SJFX_WM_TSQK_TSSBQK_XZ_KJYSXWMTSSBMXB_PRINT_REPORT';
unitConfig.module_type = 'sjbb';

unitConfig.grid_columns = [
  { title: '申报年月', dataIndex: 'ssq', width: 90, fixed: 'left', render: { type: 'date', format: 'yyyyMM' } },
  { title: '申报批次', dataIndex: 'sbpc', width: 90, fixed: 'left' },
  { title: '序号', dataIndex: 'sbxh', width: 100, sorter: true },
  { title: '出口发票开具日期', dataIndex: 'ckrq1', width: 150, sorter: true, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '出口发票号', dataIndex: 'ckfph', width: 120, ellipsis: true },
  { title: '跨境应税行为代码', dataIndex: 'ysfwDm', width: 160 },
  { title: '跨境应税行为名称', dataIndex: 'ysfwmc', width: 160, ellipsis: true },
  { title: '合同号', dataIndex: 'hth', width: 120, ellipsis: true },
  { title: '有关证明编号', dataIndex: 'ygzmbh', width: 140, ellipsis: true },
  { title: '境外单位名称', dataIndex: 'jwdwmc', width: 180, ellipsis: true },
  { title: '境外单位所在国家或地区代码', dataIndex: 'jwzcgjhdqszDm', width: 210 },
  { title: '境外单位所在国家或地区名称', dataIndex: 'jwzcgjhdqzwmc', width: 210, ellipsis: true },
  { title: '合同美元总金额', dataIndex: 'htzjemy', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '美元汇率', dataIndex: 'myhl', width: 130, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '合同人民币总金额', dataIndex: 'htzjermb', width: 160, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '人民币收入额', dataIndex: 'bqqrysfwyysrrmbje', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '美元收款额', dataIndex: 'skjemy', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '进货凭证号', dataIndex: 'jhpzh', width: 160 },
  { title: '供货方纳税人识别号', dataIndex: 'ghfnsrsbh1', width: 180 },
  { title: '开票日期', dataIndex: 'kprq', width: 110, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '计税金额', dataIndex: 'jsje', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '征税率', dataIndex: 'zssl', width: 100, align: 'right', render: { func: 'renderTslIsNumber2' } },
  { title: '退税率', dataIndex: 'tsl', width: 100, align: 'right', render: { func: 'renderTslIsNumber2' } },
  { title: '增值税退税额', dataIndex: 'zzstse', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '跨境应税行为类型代码', dataIndex: 'cktmsywlxdmjh', width: 190, ellipsis: true },
  { title: '跨境应税行为类型名称', dataIndex: 'cktmsywlxmcjh', width: 180, ellipsis: true }, 
  { title: '备注', dataIndex: 'bz', width: 140, ellipsis: true },
  {
    title: '不予办理标志', dataIndex: 'byblbz', width: 120, align: 'left', render: { func: 'renderTzBz' },
    filter: {
      type: 'Radio',
      codeTable: ['CODE_STATIC_JLJGHX_SFBZ', '01'],
    }
  },
  {
    title: '不予退税标志', dataIndex: 'bytsbz', width: 120, align: 'left', render: { func: 'renderTzBz' },
    filter: {
      type: 'Radio',
      codeTable: ['CODE_STATIC_JLJGHX_SFBZ', '01'],
    }
  },
  {
    title: '暂不办理标志', dataIndex: 'zbblbz', width: 120, align: 'left', render: { func: 'renderTzBz' },
    filter: {
      type: 'Radio',
      codeTable: ['CODE_STATIC_JLJGHX_SFBZ', '01'],
    }
  },
  { title: '申报标志', dataIndex: 'sbbz1', width: 100, render: { func: 'renderTzSbbz' }, },
  {
    title: '审核标志', dataIndex: 'shbz', width: 100, render: { func: 'renderTzShbz' },
    filter: {
      type: 'Radio',
      codeTable: ['CODE_DM_TZ_SBBZ', '01'],
    }
  },
];

unitConfig.grid_filter_quick = [
  { label: '合同号', name: 'hth', type: 'Input' },
  { label: '进货凭证号', name: 'jhpzh', type: 'Input', searchButton: true },
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
  reload: true,                     // 是否显示刷新按钮，默认关闭
};

export default unitConfig;
