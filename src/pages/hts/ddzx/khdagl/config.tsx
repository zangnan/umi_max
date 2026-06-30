import CONSTANTS from '@/components/DDAssist/constants';

const config: any = {};

// 配置项
config.api_grid_query = `/ddzx/khdagl/queryKhda`;
config.form_api_show = `/ddzx/khdagl/getKhda`;
config.api_form_edit = `/ddzx/khdagl/bckhda`;
config.api_form_delete = `/ddzx/khdagl/deleteKhda`
config.batch_delete_key = 'khuuids';
config.form_api_save_upload = `/ddzx/khdagl/bckhda`;
config.grid_show_serial_number = false;                                           // 是否显示序号，可选
config.grid_click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
config.form_save_check = false;
config.grid_scroll_x = '1200px';                             // 默认700px
config.grid_row_key = 'khuuid';
config.page_id = 'khuuid';
config.form_title = '';   // 表单标题，可选
config.module_type = 'sjbb';

// 配置项：列表列
config.grid_columns = [
  { title: '客户名称', dataIndex: 'khmc', fixed: 'left', width: 200, align: 'left' , ellipsis: true},
  { title: '客户简称', dataIndex: 'khjc', fixed: 'left', width: 80, align: 'left' , ellipsis: true},
  { title: '所属地区', dataIndex: 'sjswjgDm1', fixed: 'left', width: 100, align: 'left' , codeTable: 'CODE_DM_ZXSB_SJSWJG:01' ,},
  { title: '业务类型', dataIndex: 'khsbywlxDm', fixed: 'left', width: 100 ,align: 'left', codeTable: 'CODE_DM_ZXSB_KHSBYWLX:01' ,filter: {
    type: 'Select',
    codeTable: 'CODE_DM_ZXSB_KHSBYWLX:01',
  }},
	{ title: '服务费比例（%）', dataIndex: 'jfbl',align: 'right', width: 140},
	{ title: '服务费计算依据', dataIndex: 'fwfjsyjDm',align: 'left', width: 120, codeTable: 'CODE_DM_ZXSB_FWFJSYJ:01'},
	{ title: '社会信用代码', dataIndex: 'khshxydm',align: 'left', width: 200},
	{ title: '纳税人识别号', dataIndex: 'khnsrsbh',align: 'left', width: 200},
	{ title: '纳税信用等级', dataIndex: 'nsrxydjDm', width: 120, codeTable: 'CODE_DM_NP_NSRXYDJ:01' ,filter: {
    type: 'Select',
    codeTable: 'CODE_DM_NP_NSRXYDJ:01',
  }},
  { title: '企业注册地址', dataIndex: 'zcdz',align: 'left', width: 200, ellipsis: true},
  { title: '企业经营地址', dataIndex: 'qysjyjdz',align: 'left', width: 200, ellipsis: true},
  { title: '成立时间', dataIndex: 'clsj1', width: 150, render: { type: 'date', format: 'YYYY-MM-DD' }, align: 'left', },
  { title: '合同号', dataIndex: 'hth',align: 'left', width: 150, ellipsis: true },
  { title: '银行名称', dataIndex: 'tskhyhmc',align: 'left', width: 200, ellipsis: true },
  { title: '银行账号', dataIndex: 'tskhyhzh',align: 'left', width: 170, ellipsis: true },
  { title: '联系人', dataIndex: 'lxrxm',align: 'left', width: 100, ellipsis: true },
  { title: '联系电话', dataIndex: 'lxdh', width: 160, ellipsis: true },
  { title: '邮箱', dataIndex: 'dzxx', width: 200, ellipsis: true },
  { title: '访问账号', dataIndex: 'dlzh',align: 'left', width: 200, ellipsis: true },
  { title: '访问密码', dataIndex: 'dlmm',align: 'left', width: 200, ellipsis: true },
  { title: '角色名称', dataIndex: 'jsmc',align: 'left', width: 120, ellipsis: true },
  { title: '备注', dataIndex: 'bz',align: 'left', width: 200, ellipsis: true },
];

// // 配置项：筛选
// config.filter_items = [
//   { name: 'khmc', label: '客户名称', type: 'Input' },
//   { name: 'bgdhgbh', label: '合同号', type: 'Input' },
// ];
// 配置项：筛选
config.grid_filter_quick = [
  { name: 'khmc', label: '客户名称', type: 'Input' },
  { name: 'hth', label: '合同号', type: 'Input', searchButton: true, width: "5w"  },
];


// 配置项：表单项
config.form_items = [
  { label: 'ID', type: 'Hidden', name: 'khuuid' },
  { label: '客户名称', type: 'Input', name: 'khmc', rules: [{ type: 'base_required' },{ type: 'base_string', range: [0, 80]}]},
  { label: '客户简称', type: 'Input', name: 'khjc', rules: [{ type: 'base_required' },{ type: 'base_string', range: [0, 80]}]},
  { label: '所属地区', type: 'Select', name: 'sjswjgDm1', codeTable: 'CODE_DM_ZXSB_SJSWJG:01'  },
  { label: '业务类型', type: 'Select', name: 'khsbywlxDm', codeTable: 'CODE_DM_ZXSB_KHSBYWLX:01'  , rules: [{ type: 'base_required' }]},
  { label: '服务费比例（%）', type: 'InputNumber', name: 'jfbl', format: '0,0.000000', rules: [{ type: 'base_number', length: 10, decimal: 6 },]},
  { label: '服务费计算依据', type: 'Select', name: 'fwfjsyjDm', codeTable: 'CODE_DM_ZXSB_FWFJSYJ:01'},
  { label: '社会信用代码', type: 'Input', name: 'khshxydm', rules: [{ type: 'base_required' },{ type: 'base_string', range: [0, 18]}], },
  { label: '纳税人识别号', type: 'Input', name: 'khnsrsbh', rules: [{ type: 'base_string', range: [0, 18]}]},
  { label: '纳税信用等级', type: 'Select', name: 'nsrxydjDm', codeTable: 'CODE_DM_NP_NSRXYDJ:01' },
  { label: '企业注册地址', type: 'Input', name: 'zcdz', rules: [{ type: 'base_string', range: [0, 150]}]},
  { label: '企业经营地址', type: 'Input', name: 'qysjyjdz', rules: [{ type: 'base_string', range: [0, 150]}]},
  { label: '成立时间', name: 'clsj1', type: 'DatePicker', 'allowClear': true, format: 'YYYY-MM-DD', rules: [{ type: 'base_date', format: 'yyyyMMdd' }] },
  { label: '合同号', type: 'Input', name: 'hth', rules: [{ type: 'base_string', range: [0, 20]}]},
  { label: '银行名称', type: 'Input', name: 'tskhyhmc', rules: [{ type: 'base_required' },{ type: 'base_string', range: [0, 120]},]},
  { label: '银行账号', type: 'Input', name: 'tskhyhzh', rules: [{ type: 'base_required' },{ type: 'base_string', range: [0, 50]}]},
  { label: '联系人', type: 'Input', name: 'lxrxm', rules: [{ type: 'base_required' },{ type: 'base_string', range: [0, 50]}]},
  { label: '联系电话', type: 'Input', name: 'lxdh', rules: [{ type: 'base_required' },{ type: 'base_type_phone' }]},
  { label: '邮箱', type: 'Input', name: 'dzxx', rules: [{ type: 'base_type_mail' },{ type: 'base_string', range: [0, 90]}]},

  { label: 'ST', name: 'st', type: 'Blank' },


];

// 配置项：列表操作列
config.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};




config.customer_toolbar = [];
config.handle_columns = [];
export default config;
