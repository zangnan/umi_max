import CONSTANTS from '@/components/DDAssist/constants';


/**
 * title: 暂不办理明细查询-进口
 */
 const unitConfig: any = {};

 // 配置项
 unitConfig.grid_title = '（单位：美元）';
 unitConfig.module_key = 'CX_SJFX_WM_TSQK_ZBBLMXCX_WMQYCKTSCKMXSBB';                            // 业务单元key，对应后端接口
 unitConfig.page_id = 'CX_SJFX_WM_TSQK_ZBBLMXCX_WMQYCKTSCKMXSBB';                          // 页面id
 unitConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
 unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
 unitConfig.toolbar_show_grid_checked_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
 unitConfig.layout_type = 'tz';                                  // 页面类型，默认default 可选 default modal tabs tz台账
 unitConfig.export_key = 'CX_SJFX_WM_TSQK_ZBBLMXCX_WMQYCKTSCKMXSBB_PRINT_REPORT';
 unitConfig.module_type = 'sjbb';      
 
 unitConfig.grid_filter_quick = [
   {
     label: '外贸企业出口退税出口明细申报表',
     name: 'wmqy',
     type: 'Select',
     defaultValue: 'ck',
     width: '5w',
     onChange: 'handleOnChangeBgd',
     list: [
       { label: '外贸企业出口退税出口明细申报表', value: 'ck' },
       { label: '外贸企业出口退税进货明细申报表', value: 'jh' },
     ],
   },
   // { name: 'kprq', label: '开票日期', type: 'DatePicker', range: true,isLabel: true},
 ];
 // 配置项：列表列
 unitConfig.grid_columns = [
    { title: '关联号', dataIndex: 'glh', align: 'center', width: 150 , fixed: 'left', sorter: true },
    { title: '申报年月', dataIndex: 'ssq', align: 'center', width: 90},
    { title: '申报批次', dataIndex: 'sbpc', align: 'center', width: 90},
    { title: '申报序号', dataIndex: 'sbxh', width: 100 , sorter: true},
    { title: '出口发票号', dataIndex: 'ckfph', width: 180 },
    { title: '出口日期', dataIndex: 'ckrq1', width: 120, sorter: true, render: { type: 'date', format: 'YYYY-MM-DD' } },
    { title: '报关单号', dataIndex: 'ckbgdh', width: 180, align: 'left' , sorter: true, ellipsis: true },
    { title: '代理证明号', dataIndex: 'dlzmh', align: 'left' , sorter: true, width: 140, ellipsis: true },
    { title: '美元离岸价', dataIndex: 'mylaj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
    { title: '出口商品代码', dataIndex: 'ckspDm', width: 120, align: 'left'},
    { title: '出口商品名称', dataIndex: 'sbhgspmc', width: 180, align: 'left', ellipsis: true },
    // { title: '下载商品名称', dataIndex: 'xzspmc', width: 140, ellipsis: true, },
    { title: '计量单位', dataIndex: 'hgjldwmc', width: 80, ellipsis: true},
    { title: '申报商品代码', dataIndex: 'sbspDm', align: 'left', width: 120},
    { title: '申报商品名称', dataIndex: 'sbspmc', width: 120, align: 'left',ellipsis: true },
    { title: '出口数量', dataIndex: 'cksl', align: 'left', width: 140},
    { title: '业务类型代码', dataIndex: 'cktmsywlxdmjh', width: 140, ellipsis: true },
    { title: '业务类型名称', dataIndex: 'cktmsywlxmcjh', width: 130, ellipsis: true },
   { title: '国内启运方式', dataIndex: 'gnqyfsmc', align: 'left', width: 120, ellipsis: true },
   { title: '海关总署认证企业类型', dataIndex: 'rzqylxmc', align: 'left', width: 170, ellipsis: true },
   { title: '备注', dataIndex: 'bz', align: 'left', width: 150 , ellipsis: true},
   { title: '不予办理标志', dataIndex: 'byblbz', width: 130, render: { func: 'renderTzBz' }, },
   { title: '不予退税标志', dataIndex: 'bytsbz', width: 130, render: { func: 'renderTzBz' }, },
   { title: '暂不办理标志', dataIndex: 'zbblbz', width: 130, render: { func: 'renderTzBz' },},
   { title: '申报标志', dataIndex: 'sbbz1', width: 90, render: { func: 'renderTzSbbz' }, },
   { title: '审核标志', dataIndex: 'shbz', width: 100, render: { func: 'renderTzShbz' },},
 ];
 
 // 配置项：筛选_普通筛选 页面最上方 第一层筛选
 unitConfig.filter_items = [
   { name: 'sbrq', label: '申报日期', type: 'DatePicker', range: true },
   { name: 'ssq', label: '申报年月', type: 'Input' },
   { name: 'sbpc', label: '申报批次', type: 'Input'},
   { name: 'glh', label: '关联号', type: 'Input'},
   { name: 'ckbgdh', label: '报关单号', type: 'Input'},
   { name: 'dlzmh', label: '代理证明号', type: 'Input'},
   { name: 'ckfph', label: '出口发票号', type: 'Input'},
   { name: 'ckrq', label: '出口日期', type: 'DatePicker', range: true, allowClear: true },
   { name: 'ckspDm', label: '出口商品代码', type: 'Input'},
   { name: 'cktmsywlxdmjh', label: '退（免）税业务类型', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: 'code_dm_ckts_cktmsywlx:06' },
 ];
 
 // 配置项：工具栏
 unitConfig.toolbar_default = {
   sjgxUpdateData: true,               // 是否显示更新台账数据，默认关闭
   ckts_download: true,                   // 是否显示导出，默认关闭
   setting: true,                    // 是否显示设置按钮，默认关闭
   full: true,                       // 是否显示全屏按钮，默认关闭
   reload: true,                     // 是否显示刷新按钮，默认关闭
 };
 
 unitConfig.customer_toolbar = [];
unitConfig.handle_columns = [];
export default unitConfig;
 