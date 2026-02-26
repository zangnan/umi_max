import CONSTANTS from '@/components/DDAssist/constants';

export default {
  form_layout_type: 4, // 表单整体一列或多列布局: horizontal vertical 2 3 4 6 8 12
  form_label_input_layout: 'vertical', // 标签与录入框排列方式: horizontal vertical
  // 配置项：表单项
  form_items: [
    { label: 'ID', type: 'Hidden', name: 'uuid' },
    { label: '基本信息', type: 'GroupTitle', name: 'jbxx' },
    { label: '出口日期', type: 'DatePicker', name: 'ckrq1', format: 'YYYY-MM-DD' },
    { label: '出口时间', type: 'DatePicker', name: 'ckrq2', format: 'YYYY-MM-DD HH:mm:ss', showTime: true },
    { label: '出口合同号', type: 'Input', name: 'ckhth', desLayout: 'filled' },
    { label: '报关单号', type: 'Input', name: 'ckbgdh', tooltip: '报关单号说明...', desLayout: CONSTANTS.DEFAULT_DESCRIPTION_LAYOUT_100P_ROW },
    // { label: '核销单号', type: 'Input', name: 'hxdh' },
    // { label: 'InputTags', type: 'InputTags', name: 'InputTags' },
    // { label: '运输工具名称', type: 'Input', name: 'ysgjmc' },
    // { label: '单证', name: 'dz1', type: 'TreeSelect', isSelectLeaf: true, labelInValue: false, treeTable: 'code_dm_badz_01' },
    // { label: '单证', name: 'dz2', type: 'TreeSelect', isSelectLeaf: true, labelInValue: false, list: [
    //     { title: '退税单证', value: '1',
    //       children: [
    //         {title: '出口发票', value: '1-1', children: [{title: '出口发票1', value: '1-1-1'}]},
    //         {title: '进口发票', value: '1-2'}
    //       ]
    //     },
    //     { title: '退税单证2', value: '2'},
    //     { title: '退税单证3', value: '3', children: [
    //         { title: '退税单证3-1', value: '3-1', children: [{title: '退税单证3-1-1', value: '3-1-1'}, {title: '退税单证3-1-2', value: '3-1-2'}]},
    //         { title: '退税单证3-2', value: '3-2'}
    //     ]},
    //     ]
    // },
    // { label: '监管方式代码', type: 'Input', name: 'jgfsDm' },
    // { label: '海关成交方式', type: 'Select', name: 'hgcjfsmc', codeTable: 'code_static_hgcjfs_mc' },
    // { label: '国别', type: 'Select', name: 'gb',  list: [
    //     { name: '中国', value: 'china' },
    //     { name: '日本', value: 'japan' },
    //     { name: '韩国', value: 'korea' },
    // ] },
    // { label: '成交海关货币字母代码', type: 'Input', name: 'cjhghbzmDm' },
    // { label: '成交总价', type: 'InputNumber', name: 'cjzj', format: '0,0.00' },
    // { label: '运费海关货币字母代码', type: 'Input', name: 'yfhghbzmDm' },
    // { label: '运费金额', type: 'InputNumber', name: 'yfje', format: '0,0.00' },
    // { label: '运费计算方式代码', type: 'Select', name: 'yfjsfsDm', codeTable: 'code_dm_ckts_hgyfjsfs' },
    // { label: '运费折算数量', type: 'InputNumber', name: 'yfzssl', format: '0,0.0000' },
    // { label: '保费海关货币字母代码', type: 'Input', name: 'bfhghbzmDm' },
    // { label: '保费金额', type: 'InputNumber', name: 'bfje', format: '0,0.00' },
    // { label: '保费计算方式代码', type: 'Select', name: 'bfjsfsDm', codeTable: 'code_dm_ckts_hgbfjsfs' },
    // { label: '杂费海关货币字母代码', type: 'Input', name: 'zfhghbzmDm' },
    // { label: '杂费金额', type: 'InputNumber', name: 'zfje1', format: '0,0.00' },
    // { label: '杂费计算方式代码', type: 'Select', name: 'zfjsfsDm', codeTable: 'code_dm_ckts_hgzfjsfs' },
    // { label: '商品信息', type: 'GroupTitle', name: 'spxx' },
    // { label: '出口商品代码', type: 'Input', name: 'ckspDm' },
    // { label: '出口商品名称', type: 'Input', name: 'ckspmc', readOnly: true },
    // { label: '海关商品名称', type: 'Input', name: 'hgspmc' },
    // { label: '成交计量单位', type: 'Input', name: 'hgjldwmc' },
    // { label: '成交数量', type: 'InputNumber', name: 'cjsl1', format: '0,0.0000' },
    // { label: '法定计量单位', type: 'Input', name: 'dyjldwDm' },
    // { label: '法定数量', type: 'InputNumber', name: 'cksl', format: '0,0.0000' },
    // { label: '第二计量单位', type: 'Input', name: 'dejldwDm' },
    // { label: '第二出口数量', type: 'InputNumber', name: 'decksl', format: '0,0.0000' },
    // { label: '规格型号', type: 'Input', name: 'ggxh' },
    // { label: '数据检查标志', type: 'Hidden', name: 'cytgbz' },
    // { label: '公式计算', type: 'GroupTitle', name: 'qtxx' },
    // { label: '参数A', type: 'InputNumber', name: 'flp1', format: '0,0.00' },
    // { label: '参数B', type: 'InputNumber', name: 'flp2', format: '0,0.00' },
    // { label: '参数C', type: 'InputNumber', name: 'flp3', format: '0,0.00' },
    // { label: '结果1', type: 'InputNumber', name: 'flrs1', format: '0,0.0000', formula: '{flp1}+{flp2}+{flp2}+{flp3}', placeholder: '参数A+参数B+参数B+参数C' },
    // { label: '结果2', type: 'InputNumber', name: 'flrs2', format: '0,0.00', formula: '({flp1}+{flp2}+{flp3})*({flp1}+{flp2}+{flp3})', placeholder: '(参数A+参数B+参数C)*(参数A+参数B+参数C)' },
    // // { label: '子表展现', type: 'GroupTitle', name: 'qtxx' },
    // // { label: '商品信息列表', name: 'spxxArray', type: 'List', children: [
    // //   { label: '货物名称', name: 'spmc', type: 'Input', rules: [ { type: 'base_required' }, { type: 'base_string', range: [0, 150] }] },
    // //   { label: '单位', name: 'dw', type: 'Input', rules: [{ type: 'base_string', range: [0, 150] }] },
    // //   { label: '数量', name: 'sl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_number', length: 15, decimal: 5}] },
    // //   { label: '国别', type: 'Select', name: 'gb',  list: [
    // //     { name: '中国', value: 'china' },
    // //     { name: '日本', value: 'japan' },
    // //     { name: '韩国', value: 'korea' },
    // //   ] },
    // //   { label: '计算方式代码', type: 'Select', name: 'yfjsfsDm', codeTable: 'code_dm_ckts_hgyfjsfs' },
    // // ] },
    // { label: '其他信息', type: 'GroupTitle', name: 'qtxx' },
    // { label: '备注', type: 'TextArea', name: 'bz', autoSize: { minRows:3, maxRows: 3}, desLayout: CONSTANTS.DEFAULT_DESCRIPTION_LAYOUT_100P_ROW },
    // { label: '富文本编辑器', type: 'RichTextEditor', name: 'richTextEditor', desLayout: CONSTANTS.DEFAULT_DESCRIPTION_LAYOUT_100P_ROW },
    // { label: '合同', type: 'Upload', name: 'fj1' },
  ],
  form_value: {
    ckbgdh: '123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123',
    ckrq1: 1622476800000,
    ckrq2: 1622476800000,
    ckhth: '345',
  }
};