import CONSTANTS from '@/components/DDAssist/constants';

const config: any = {};



// 配置项
config.module_key = 'QUERY_DDZX_DDGL';
config.page_id = 'QUERY_DDZX_DDGL';
config.grid_show_serial_number = false;                                           // 是否显示序号，可选
config.grid_click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
config.form_save_check = false;
config.grid_scroll_x = '1200px';                             // 默认700px
config.grid_row_key = 'ddbh';
config.form_title = '';
config.form_api_save_upload = `/ddzx/ddgl/updateYwcdd`;
config.api_form_edit = `/ddzx/ddgl/updateYwcdd`;
config.module_type = 'sjbb';
config.api_form_delete = `/ddzx/ddgl/deleteDkpDd`;
config.batch_delete_key = 'ddbhs';


// 配置项：工具栏
config.toolbar_default = {
  setting: true,
  reload: true,
  full: true,
  delete: true,
  download:true,
};

// 配置项：列表列
config.grid_columns = [
  {
    title: '生成开票状态', dataIndex: 'kptzbz', width: 120, align: 'center', fixed: 'left', codeTable: 'code_static_yes_no:01', filter: {
      type: 'Select',
      codeTable: 'code_static_yes_no:01',
    }
  },
  { title: '生成开票时间', dataIndex: 'kptzsj', width: 160, align: 'center', fixed: 'left', render: { type: 'date', format: 'YYYY-MM-DD  HH:mm:ss' } },
  { title: '出口月份', dataIndex: 'ckny', width: 90, align: 'left', fixed: 'left', },
  { title: '工厂', dataIndex: 'hzdwmc', width: 200, align: 'left', fixed: 'left', ellipsis: true },

  { title: '申报日期', dataIndex: 'hgckhwbgdsbrq', width: 100, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '出口日期', dataIndex: 'ckrq1', width: 100, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '报关合同号', dataIndex: 'ckhth', width: 150, ellipsis: true },
  { title: '报关单号', dataIndex: 'bgdhgbh', width: 150, ellipsis: true },

  { title: '项号', dataIndex: 'hwxh', width: 60, ellipsis: true },
  { title: '目的国', dataIndex: 'zzmdgdqszDm', width: 100, codeTable: 'CODE_DM_CKTS_HGGJHDQ:01', ellipsis: true },
  { title: '商品代码', dataIndex: 'hgckspDm', width: 120, ellipsis: true },
  { title: '品名', dataIndex: 'hgspmc', width: 110, ellipsis: true },

  { title: '出口数量', dataIndex: 'sbsl1', width: 110, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '成交单位', dataIndex: 'sbjldwmc', width: 90, ellipsis: true },
  { title: '原币单价', dataIndex: 'sbdj', width: 110, align: 'right', render: { type: 'number', format: '0,0.000000' } },
  { title: '原币金额', dataIndex: 'cjzj', width: 110, align: 'right', render: { type: 'number', format: '0,0.00' } },

  { title: '美元金额', dataIndex: 'mylaj', width: 110, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '美元汇率', dataIndex: 'myhl', width: 100, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '不含税金额', dataIndex: 'rmblaj', width: 110, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '税率', dataIndex: 'sl1', width: 80, align: 'right', render: { type: 'number', format: '0,0.00000' } },

  { title: '税额', dataIndex: 'se', width: 110, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '含税金额', dataIndex: 'hsje', width: 110, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '换汇成本', dataIndex: 'hhcb', width: 110, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '服务费', dataIndex: 'zfglfwfje', width: 110, align: 'right', render: { type: 'number', format: '0,0.00' } },

  { title: '服务费开票日期', dataIndex: 'fwfkprq', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '实际退税额', dataIndex: 'sjtse', width: 110, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '收汇日期', dataIndex: 'ckshrq', width: 100, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '收汇币种', dataIndex: 'ckshhbzmDm', align: 'left', width: 115, codeTable: 'code_dm_gy_hb:01' },

  { title: '收汇金额', dataIndex: 'ckshje', align: 'right', width: 110, render: { type: 'number', format: '0,0.00' } },
  { title: '收汇汇率', dataIndex: 'ckshhbhl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '结汇金额RMB', dataIndex: 'ckshjermb', width: 120, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '支付结汇额', dataIndex: 'zfjk', width: 120, align: 'right', render: { type: 'number', format: '0,0.00' } },

  { title: '支付日期', dataIndex: 'zfkxrq', width: 100, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '开票月份', dataIndex: 'kprq', width: 100, render: { type: 'date', format: 'YYYYMM' } },
  { title: '发票代码', dataIndex: 'fpDm', width: 140, ellipsis: true },
  { title: '发票号码', dataIndex: 'fphm', width: 180, ellipsis: true },

  { title: '行号', dataIndex: 'hh', width: 100 },
  {
    title: '核对日期', dataIndex: 'hdrq', width: 100, render: { type: 'date', format: 'YYYY-MM-DD' }
  },

  {
    title: '生成退税状态', dataIndex: 'pdbz', width: 120, codeTable: 'code_static_yes_no:01', filter: {
      type: 'Select',
      codeTable: 'code_static_yes_no:01',
    }
  },
  { title: '生成退税时间', dataIndex: 'pdsj1', width: 200, render: { type: 'date', format: 'YYYY-MM-DD HH:mm:ss' } },
  { title: '退税批次', dataIndex: 'ssqpc', width: 90 },
  { title: '申报月份', dataIndex: 'sbrq1', width: 150, },
  { title: '函调标志', dataIndex: 'zbblbz', width: 90, codeTable: 'code_static_yes_no:01' },
  { title: '退税日期', dataIndex: 'tsrq1', width: 100, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '支付给客户日期', dataIndex: 'zfrq', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
  {
    title: '是否垫税', dataIndex: 'dsbz', width: 90, codeTable: 'code_static_yes_no:01', filter: {
      type: 'Select',
      codeTable: 'code_static_yes_no:01',
    }
  },
];

// 配置项：筛选
config.filter_items = [
  { name: 'hzdwmc', label: '工厂', type: 'Input' },
  { name: 'ckrq1', label: '出口日期', type: 'DatePicker', range: true, allowClear: true },
  { name: 'ckhth', label: '报关合同号', type: 'Input' },
  { name: 'bgdhgbh', label: '报关单号', type: 'Input' },
  { name: 'hgspmc', label: '品名', type: 'Input' },
];




config.customer_toolbar = [];
config.handle_columns = [];
export default config;
