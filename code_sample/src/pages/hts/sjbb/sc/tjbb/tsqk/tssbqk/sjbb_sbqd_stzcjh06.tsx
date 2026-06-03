/**
 * title: 6.视同自产进货明细清单
 * author: wxl
 */
const unitConfig: any = {};

// 配置项
// unitConfig.grid_title = '金额单位：元';
unitConfig.unit_key = 'CX_SJFX_SC_TSQK_TSSBQK_XZ_STZCJHMXQD';                            // 业务单元key，对应后端接口
unitConfig.page_id = 'CX_SJFX_SC_TSQK_TSSBQK_XZ_STZCJHMXQD';                                        // 页面id
unitConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
unitConfig.show_toolbar = true;                                                       // 是否开启工具栏，默认true开启
unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.layout_type = 'modal';                                                     // 页面类型，默认default 可选 default modal tabs
unitConfig.export_key = 'CX_SJFX_SC_TSQK_TSSBQK_XZ_STZCJHMXQD_PRINT_REPORT';
unitConfig.module_type = 'sjbb';

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '所属期', dataIndex: 'ssq', width: 90, fixed: 'left', render: { type: 'date', format: 'yyyyMM' } },
  { title: '序号', dataIndex: 'sbxh', width: 100, sorter: true },
  { title: '免抵退税申报明细序号', dataIndex: 'mxsbxh', width: 200, sorter: true },
  { title: '进货凭证号', dataIndex: 'jhpzh', width: 180, sorter: true, ellipsis: true },
  { title: '销方纳税人识别号', dataIndex: 'xhfnsrsbh', width: 200, ellipsis: true },
  { title: '销方纳税人名称', dataIndex: 'xhfnsrmc', width: 180, ellipsis: true },
  { title: '开票日期', dataIndex: 'kprq', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } },
  { title: '申报标志', dataIndex: 'sbbz1', width: 100, render: { func: 'renderTzSbbz' }, },
  {
    title: '审核标志', dataIndex: 'shbz', width: 110, render: { func: 'renderTzShbz' },
    filter: {
      type: 'Radio',
      codeTable: ['CODE_DM_TZ_SBBZ', '01'],
    }
  },
];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
unitConfig.filter_items = [
  { label: '进货凭证号', name: 'jhpzh', type: 'Input', },
  { label: '销方纳税人识别号', name: 'xhfnsrsbh', type: 'Input', },
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
