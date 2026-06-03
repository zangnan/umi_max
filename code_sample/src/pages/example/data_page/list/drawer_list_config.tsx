/**
 * title: 数据封装页面
 * author: zn
 */
const unitConfig: any = {};

// 配置项
unitConfig.form_title = '报关单';                                                     // 表单标题，可选
unitConfig.grid_api_grid_query = `${API_URL_BASE}/yw/bszx/wbsj/bgd/queryBgd18Page`;   // api 列表查询
unitConfig.form_api_show=`${API_URL_BASE}/yw/bszx/wbsj/bgd/queryBgdByKey`;            // api 表单查询
unitConfig.form_api_save=`${API_URL_BASE}/yw/bszx/wbsj/bgd/updateBgd`;                // api 表单更新
unitConfig.form_api_check=`${API_URL_BASE}/yw/bszx/wbsj/bgd/checkCkbgdh`;             // api 表单校验
unitConfig.form_api_delete=`${API_URL_BASE}/yw/bszx/wbsj/bgd/deleteBgd21`;            // api 表单删除
unitConfig.show_toolbar = true;                                                       // 是否开启工具栏，默认true开启
unitConfig.layout_type = 'modal';                                                     // 页面类型，默认default 可选 default modal tabs
// unitConfig.grid_sticky_affix = 51;                                                    // 列表锁定高度， 默认页头高度94
// unitConfig.toobar_affix = 44;                                                       // 工具条锁定高度， 默认页头高度44

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '报关单号', dataIndex: 'ckbgdh', width: 180, fixed: 'left', sorter: true,
    render: { func: 'renderCkbgdh' },
    filter: {
      type: 'Select',
      list: [
        { text: '已结关', value: 'yjg' },
        { text: '未结关', value: 'wjg' },
      ],
    }
  },
  { title: '出口日期', dataIndex: 'ckrq1', width: 120, sorter: true, render: { type: 'date', format: 'yyyy-MM-DD' }},
  { title: '出口合同号', dataIndex: 'ckhth', width: 115 },
  { title: '成交方式', dataIndex: 'hgcjfsmc', width: 85 },
  { title: '成交单位', dataIndex: 'hgjldwmc', width: 90, ellipsis: true },
  { title: '成交数量', dataIndex: 'cjsl1', width: 140, align: 'right', render: { type: 'number', format: '0,0.0000' } },
  { title: '成交币制', dataIndex: 'cjhghbzmDm', width: 85 },
  { title: '成交金额', dataIndex: 'cjzj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '美元离岸价', dataIndex: 'mylaj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '法定单位', dataIndex: 'dyjldwDm', width: 90, codeTable: ['code_dm_ckts_hgjldw', '01'], ellipsis: true },
];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
unitConfig.filter_items = [
  { name: 'zmlx', label: '征免类型', type: 'Select', codeTable: ['code_static_bgd_zmlx_dm', '01'] },
  { name: 'ckhth', label: '出口合同号', type: 'Input', },
  { name: 'ckrq1', label: '出口日期', type: 'DatePicker' },
  { name: 'jgfsDm', label: '监管方式', type: 'Input' },
];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
unitConfig.grid_filter_quick = [
  { label: '是否结关', name: 'sfjg', type: 'Select', onChange: 'handleOnChange', isReload: false, list: [
    { label: '全部', value: 'qb' },
    { label: '已结', value: 'yjg' },
  ]},
];

export default unitConfig;