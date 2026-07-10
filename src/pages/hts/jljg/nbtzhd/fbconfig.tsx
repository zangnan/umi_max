import myUtil from '@/components/DDAssist/util';
import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 智能分析-智能分析结果
 * author: yxy
 */
const fb18config: any = {};

// 配置项
fb18config.module_key = 'JLJG_ZXSB_SB_JLJG_SZC_TZHD_JCKBGD_18';
fb18config.module_key_18 = 'JLJG_ZXSB_SB_JLJG_SZC_TZHD_JCKBGD_18';
fb18config.module_key_21 = 'JLJG_ZXSB_SB_JLJG_SZC_TZHD_JCKBGD_21';
fb18config.grid_show_serial_number = false;                                           // 是否显示序号，可选
fb18config.toolbar_show_grid_checked_num = false;
fb18config.show_toolbar = false;                                                       // 是否开启工具栏，默认true开启
fb18config.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
fb18config.layout_type = 'modal';                                                     // 页面类型，默认default 可选 default modal tabs
fb18config.grid_selection_type = false;                                               // 列表首选项类别，默认 checkbox，可选 false radio checkbox
// fb18config.grid_scroll_x = '700px';
// fb18config.grid_scroll_y = '320px';
// 配置项：列表列
fb18config.grid_columns = [
  { title: '报关单号/核注清单编号', dataIndex: 'bgdhgbhQdbh', width: 170, fixed: 'left', ellipsis: true,
    render: (text: any,record: any) => {
      if (record.bgdhgbh) {
        return record.bgdhgbh;
      } else {
        return record.qdbh;
      }
    }
  },
  { title: '进（出）口标识', dataIndex: 'jckbzDm', width: 135,codeTable: 'CODE_STATIC_JLJGHX_JCKBZ:01',
    filter: {
      type: 'Radio',
      codeTable: 'CODE_STATIC_JLJGHX_JCKBZ:01',
    }
  },
  {
    title: '核对结果', children: [
      { title: '海关数据', dataIndex: 'hgsjczbz', width: 110,codeTable: 'CODE_STATIC_JLJGHX_HDJG:01',
        filter: {
          type: 'Radio',
          codeTable: 'CODE_STATIC_JLJGHX_HDJG:01',
        }
      },
      { title: '税务反馈数据', dataIndex: 'fksjczbz', width: 130,codeTable: 'CODE_STATIC_JLJGHX_HDJG:01',
        filter: {
          type: 'Radio',
          codeTable: 'CODE_STATIC_JLJGHX_HDJG:01',
        }
      },
      { title: '台账数据', dataIndex: 'tzsjczbz', width: 110,codeTable: 'CODE_STATIC_JLJGHX_HDJG:01',
        filter: {
          type: 'Radio',
          codeTable: 'CODE_STATIC_JLJGHX_HDJG:01',
        }
      },
    ]
  },
  { title: '监管方式代码', dataIndex: 'jgfsDm', width: 130,
    filter: {
      type: 'Select',
      codeTable: 'CODE_DM_CKTS_HGJGFS:01',
      showCode: true,
    }
  },
  { title: '监管方式名称', dataIndex: 'jgfsmc', width: 120,  render: (text: any, record: any) => myUtil.code.getCodeValByKey(record.jgfsDm, 'CODE_DM_CKTS_HGJGFS:01')},
  { title: '进（出）口日期', dataIndex: 'ckrq1', width: 130, render: { type: 'date', format: 'YYYY-MM-DD' }},
];

fb18config.grid_columns_18 = [
  { title: '报关单号/核注清单编号', dataIndex: 'bgdhgbhQdbh', width: 170, fixed: 'left', ellipsis: true,
    render: (text: any,record: any) => {
      if (record.bgdhgbh) {
        return record.bgdhgbh;
      } else {
        return record.qdbh;
      }
    }
  },
  { title: '进（出）口标识', dataIndex: 'jckbzDm', width: 135,codeTable: 'CODE_STATIC_JLJGHX_JCKBZ:01',
    filter: {
      type: 'Radio',
      codeTable: 'CODE_STATIC_JLJGHX_JCKBZ:01',
    }
  },
  {
    title: '核对结果', children: [
      { title: '海关数据', dataIndex: 'hgsjczbz', width: 110,codeTable: 'CODE_STATIC_JLJGHX_HDJG:01',
        filter: {
          type: 'Radio',
          codeTable: 'CODE_STATIC_JLJGHX_HDJG:01',
        }
      },
      { title: '税务反馈数据', dataIndex: 'fksjczbz', width: 130,codeTable: 'CODE_STATIC_JLJGHX_HDJG:01',
        filter: {
          type: 'Radio',
          codeTable: 'CODE_STATIC_JLJGHX_HDJG:01',
        }
      },
      { title: '台账数据', dataIndex: 'tzsjczbz', width: 110,codeTable: 'CODE_STATIC_JLJGHX_HDJG:01',
        filter: {
          type: 'Radio',
          codeTable: 'CODE_STATIC_JLJGHX_HDJG:01',
        }
      },
    ]
  },
  { title: '监管方式代码', dataIndex: 'jgfsDm', width: 130,
    filter: {
      type: 'Select',
      codeTable: 'CODE_DM_CKTS_HGJGFS:01',
      showCode: true,
    }
  },
  { title: '监管方式名称', dataIndex: 'jgfsmc', width: 120,  render: (text: any, record: any) => myUtil.code.getCodeValByKey(record.jgfsDm, 'CODE_DM_CKTS_HGJGFS:01')},
  { title: '进（出）口日期', dataIndex: 'ckrq1', width: 130, render: { type: 'date', format: 'YYYY-MM-DD' }},
];

fb18config.grid_columns_21 = [
  { title: '核注清单编号', dataIndex: 'qdbh', width: 170, fixed: 'left', ellipsis: true,
    filter: {
      type: 'Input',
    }
  },
  { title: '报关单号', dataIndex: 'bgdhgbh', width: 170, fixed: 'left', ellipsis: true,
    filter: {
      type: 'Input',
    }
  },
  { title: '项号', dataIndex: 'hwxh', width: 80},
  { title: '进（出）口标识', dataIndex: 'jckbzDm', width: 135,codeTable: 'CODE_STATIC_JLJGHX_JCKBZ:01',
    filter: {
      type: 'Radio',
      codeTable: 'CODE_STATIC_JLJGHX_JCKBZ:01',
    }
  },
  {
    title: '海关数据', children: [
      { title: '美元金额', dataIndex: 'hgmylaj', width: 135, align: 'right' , render: { type: 'number', format: '0,0.00' }},
      { title: '人民币金额', dataIndex: 'hgrmblaj', width: 135, align: 'right' , render: { type: 'number', format: '0,0.00' }},
      { title: '核对结果', dataIndex: 'hgsjczbz', width: 110,codeTable: 'CODE_STATIC_JLJGHX_HDJG:01',
        filter: {
          type: 'Radio',
          codeTable: 'CODE_STATIC_JLJGHX_HDJG:01',
        }
      },
    ]
  },
  {
    title: '税务反馈数据', children: [
      { title: '美元金额', dataIndex: 'fkmylaj',width: 135, align: 'right' , render: { type: 'number', format: '0,0.00' }},
      { title: '人民币金额', dataIndex: 'fkrmblaj', width: 135, align: 'right' , render: { type: 'number', format: '0,0.00' }},
      { title: '核对结果', dataIndex: 'fksjczbz', width: 110,codeTable: 'CODE_STATIC_JLJGHX_HDJG:01',
        filter: {
          type: 'Radio',
          codeTable: 'CODE_STATIC_JLJGHX_HDJG:01',
        }
      },
    ]
  },
  {
    title: '台账数据', children: [
      { title: '美元金额', dataIndex: 'mylaj', width: 135, align: 'right' , render: { type: 'number', format: '0,0.00' }},
      { title: '人民币金额', dataIndex: 'rmblaj', width: 135, align: 'right', render: { type: 'number', format: '0,0.00' }},
      { title: '核对结果', dataIndex: 'tzsjczbz', width: 110,codeTable: 'CODE_STATIC_JLJGHX_HDJG:01',
        filter: {
          type: 'Radio',
          codeTable: 'CODE_STATIC_JLJGHX_HDJG:01',
        }
      },
    ]
  },
  { title: '监管方式代码', dataIndex: 'jgfsDm', width: 130,
    filter: {
      type: 'Select',
      codeTable: 'CODE_DM_CKTS_HGJGFS:01',
      showCode: true,
    }
  },
  { title: '监管方式名称', dataIndex: 'jgfsmc', width: 120,  render: (text: any, record: any) => myUtil.code.getCodeValByKey(record.jgfsDm, 'CODE_DM_CKTS_HGJGFS:01')},
  { title: '进（出）口日期', dataIndex: 'ckrq1', width: 130, render: { type: 'date', format: 'YYYY-MM-DD' }},
];

// 配置项：工具栏
fb18config.toolbar_default = {
  setting: true,
  download: true,
  reload:true,
};

// 配置项：列表操作列
fb18config.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};

// 配置项：自定义工具栏
fb18config.customer_toolbar= [
];

fb18config.handle_columns = [];
export default fb18config;