import myUtil from '@/components/DDAssist/util';
import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 智能分析-智能分析结果
 * author: yxy
 */
const bdjgConfig: any = {};

// 配置项
bdjgConfig.module_key = 'ZXSB_SB_JLJG_SZC_ZNFX'
bdjgConfig.grid_show_serial_number = false;                                           // 是否显示序号，可选
bdjgConfig.grid_click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
bdjgConfig.toolbar_show_grid_checked_num = false;
bdjgConfig.show_toolbar = true;                                                       // 是否开启工具栏，默认true开启
bdjgConfig.layout_type = 'modal';                                                     // 页面类型，默认default 可选 default modal tabs
bdjgConfig.grid_row_key = 'uuid';  
bdjgConfig.export_key = 'ZXSB_SB_JLJG_SZC_ZNFX'                                                   // 列表主键，默认uuid
bdjgConfig.module_type = 'znfx';  



// 配置项：列表列
bdjgConfig.grid_columns = [
  { title: '报关单号/清单编号', dataIndex: 'bgdhgbhqdbh', width: 160,fixed: 'left',
    render: (text: any,record: any) => {
      if (record.bgdhgbh) {
        return record.bgdhgbh;
      } else {
        return record.qdbh;
      }
    }
  },
  { title: '项号', dataIndex: 'hwxh', width: 60,fixed: 'left'},
  { title: '进（出）口标识', dataIndex: 'jckbzDm', width: 135, codeTable: 'CODE_STATIC_JLJGHX_JCKBZ:01',
    filter: {
      type: 'Radio',
      codeTable: 'CODE_STATIC_JLJGHX_JCKBZ:01',
    }
  },
  { title: '问题代码', dataIndex: 'jmfxjgwtDm', width: 100,filter: {
      type: 'Select',
      codeTable: 'CODE_DM_ZXSB_JMFXJGWT:01',
      showCode: true
    }
  },
  { title: '问题描述', dataIndex: 'jmfxjgwtms', width: 130, ellipsis: true},
  { title: '差异金额{br}（美元）', dataIndex: 'cys1', width: 110, align: 'right', render: { type: 'number', format: '0,0.00' }},
  { title: '差异率{br}（%）', dataIndex: 'cyl', width: 100, align: 'right', render: { type: 'number', format: '0,0.00000' }},
  { title: '忽略差异', dataIndex: 'tgbz', width: 95,codeTable: 'CODE_STATIC_JLJGHX_SFBZ:01',filter: {
      type: 'Radio',
      codeTable: 'CODE_STATIC_JLJGHX_SFBZ:01',
    }
  },
  { title: '进（出）口日期', dataIndex: 'ckrq1', width: 115, render: { type: 'date', format: 'YYYY-MM-DD' }},
  { title: '监管方式代码', dataIndex: 'jgfsDm', width: 120,
    // filter: {
    //   type: 'Select',
    //   codeTable: 'CODE_DM_CKTS_HGJGFS:01',
    //   showCode: true,
    // }
  },
  { title: '监管方式名称', dataIndex: 'jgfsmc', width: 120, render: (text: any, record: any) => myUtil.code.getCodeValByKey(record.jgfsDm, 'CODE_DM_CKTS_HGJGFS:01')
  },
  { title: '商品代码', dataIndex: 'ckspDm', width: 95},
  { title: '海关商品名称', dataIndex: 'hgspmc', width: 130, ellipsis: true},
];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
bdjgConfig.filter_items = [
  { name: 'bgdhgbh', label: '报关单号/清单编号', type: 'Input', layout: {
    formItem: {
      xs: {span: 23, offset:1, pull: 1},
      sm: {span: 23, offset:1, pull: 1},
      md: {span: 23, offset:1, pull: 1},
      lg: {span: 11, offset:1, pull: 1},
      xl: {span: 5, offset:1, pull: 1},
      xxl: {span: 5, offset:1, pull: 1}
    },
  }},
  { name: 'cyl', label: '差异率', type: 'Input', range: true, layout: {
    formItem: {
      xs: {span: 23, offset:1, pull: 1},
      sm: {span: 23, offset:1, pull: 1},
      md: {span: 23, offset:1, pull: 1},
      lg: {span: 11, offset:1, pull: 1},
      xl: {span: 7, offset:1, pull: 1},
      xxl: {span: 7, offset:1, pull: 1}
    },
  }},
  { name: 'cys1', label: '差异金额', type: 'Input', range: true, layout: {
    formItem: {
      xs: {span: 23, offset:1, pull: 1},
      sm: {span: 23, offset:1, pull: 1},
      md: {span: 23, offset:1, pull: 1},
      lg: {span: 23, offset:1, pull: 1},
      xl: {span: 9, offset:1, pull: 1},
      xxl: {span: 9, offset:1, pull: 1}
    }
  }},
  { name: 'jgfsDm', label: '监管方式代码', type: 'Select', showType: '3',showSearch: true, codeTable: 'CODE_DM_CKTS_HGJGFS:01',
   layout: {
    formItem: {
      xs: {span: 23, offset:1, pull: 1},
      sm: {span: 23, offset:1, pull: 1},
      md: {span: 23, offset:1, pull: 1},
      lg: {span: 11, offset:1, pull: 1},
      xl: {span: 5, offset:1, pull: 1},
      xxl: {span: 5, offset:1, pull: 1}
    },
  } }
];

// 配置项：工具栏
bdjgConfig.toolbar_default = {
  setting: true,
  download: true,
  reload:true,
};

// 配置项：列表操作列
bdjgConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};

// 配置项：自定义工具栏
bdjgConfig.customer_toolbar= [
  { name: '设置忽略差异', func: 'handleZnfxBdjgSzhl' },
  { name: '取消忽略差异', func: 'handleZnfxBdjgQxhl' },
];

bdjgConfig.handle_columns = [];
export default bdjgConfig;