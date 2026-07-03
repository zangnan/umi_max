import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 进项发票
 */
const fpxxConfig: any = {};

// 配置项
fpxxConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
fpxxConfig.toolbar_show_grid_checked_num = false;                           // 工具栏左侧是否显示数据条数及选中数，默认true显示
fpxxConfig.layout_type = 'modal';                                // 页面类型，默认default 可选 default modal tabs tz台账
fpxxConfig.grid_click_checked = '1';                                  // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
fpxxConfig.grid_row_key = 'uuid';                      // 列表主键，默认uuid
fpxxConfig.module_key = 'SAAS_SJGL_JXFPCCX_SPXX';          // 业务单元key，对应后端接口
fpxxConfig.export_key = 'SAAS_SJGL_JXFPCCX_SPXX_DC';        // 业务单元key，对应后端接口
fpxxConfig.module_type = 'QZ_type';
fpxxConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出

fpxxConfig.gridParams = {
  initSearchModal: [
    {property: 'cdDm', value: "0210_SPXX", op: 'zdy'},
  ]
}

// 配置列表列
fpxxConfig.grid_columns = [
  {title: '发票号码', dataIndex: 'fphm', width: 180, ellipsis: true, render: {func: 'renderJxfpccxFpyl'}, fixed: 'left'},
  {title: '发票代码', dataIndex: 'fpDm', width: 120},
  {title: '开票日期', dataIndex: 'kprqdc', width: 140},
  {
    title: '发票种类', dataIndex: 'fplxmc1', width: 200,
    filter: {
      type: 'Select',
      codeTable: 'CODE_DM_FP_FPLX:01',
    }
  },
  {title: '行号', dataIndex: 'hh', width: 90},
  {title: '货物或应税劳务、服务名称', dataIndex: 'hwhyslwmc', width: 200, ellipsis: true},
  {title: '规格型号', dataIndex: 'ggxh', width: 180, ellipsis: true},
  {title: '单位', dataIndex: 'jldwmc', align: 'left', width: 80, ellipsis: true},
  {title: '数量', dataIndex: 'sl', width: 140, align: 'right', render: {type: 'number', format: '0,0.00000'}},
  {title: '单价', dataIndex: 'dj', align: 'right', width: 140, render: {type: 'number', format: '0,0.00'}},
  {title: '金额', dataIndex: 'je', align: 'right', width: 140, render: {type: 'number', format: '0,0.00'}},
  {title: '税率', dataIndex: 'sl1', align: 'right', width: 80, render: {type: 'number', format: '0,0.0000'}},
  {title: '税额', dataIndex: 'se', align: 'right', width: 140, render: {type: 'number', format: '0,0.00'}},
  {title: '备注', dataIndex: 'bz', width: 220, ellipsis: true},
  {
    title: '发票状态', dataIndex: 'fpztDm', width: 100,codeTable: 'CODE_DM_FP_FPZT:01',
    filter: {
      type: 'Select',
      codeTable: 'CODE_DM_FP_FPZT:01',
    }
  },
  {
    title: '是否认证', dataIndex: 'rzbzdc', width: 100,
    filter: {
      type: 'Select',
      list: [
        {text: '是', value: 'Y'},
        {text: '否', value: 'N'}
      ],
    }
  },
  {
    title: '签收状态', dataIndex: 'qsztmc', width: 100,
    filter: {
      type: 'Select',
      list: [
        {text: '已签收', value: '1'},
        {text: '未签收', value: '2'}
      ],
    }
  },
  {
    title: '勾选用途', dataIndex: 'gxytmc', width: 160,
    filter: {
      type: 'Select',
      codeTable: 'CODE_DM_FP_GXYT:01',
    }
  },
  {title: '销售方纳税人名称 ', dataIndex: 'xhfnsrmc', width: 180, ellipsis: true},
  {title: '销售方纳税人识别号', dataIndex: 'xhfnsrsbh', width: 180, ellipsis: true}
];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
fpxxConfig.filter_items = [
  {name: 'kprq', label: '开票日期', type: 'DatePicker', range: true, allowClear: false, qypzgl: 'QYPZGL_FPCXZDYFFW'},
  {name: 'fphm', label: '发票号码', type: 'Input',},
  {name: 'fpDm', label: '发票代码', type: 'Input'},
  {name: 'xhfnsrmc', label: '销售方纳税人名称  ', type: 'Input'},
  {name: 'xhfnsrsbh', label: '销售方纳税人识别号  ', type: 'Input'},
  {name: 'hwhyslwmc', label: '货物或应税劳务、服务名称', type: 'Input'},
  {name: 'tzsxbz', label: '台账数据', type: 'Select', codeTable: 'CODE_STATIC_SJGL_TZSJ:01'},
  {name: 'bz', label: '备注', type: 'Input',},
];

// 配置项：自定义工具栏
fpxxConfig.customer_toolbar = [
  {name: '台账筛选', key: '3', func: 'importTzsx'},
];

// 配置项：工具栏
fpxxConfig.toolbar_default = {
  download: true,
  delete: false,
  setting: true,
  reload: true,
  full: true,
};
fpxxConfig.grid_filter_quick = [
  {
    name: 'cxlx',
    type: 'Select',
    defaultValue: '1',
    op: 'zdy',
    onChange: 'handleOnChangeCxlx',
    list: [
      { label: '发票信息', value: '2', },
      { label: '商品信息', value: '1' },
    ],
  },
];

fpxxConfig.handle_columns = [];
export default fpxxConfig;
