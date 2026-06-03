

/**
 * title: 暂不办理明细查询-进货
 */
 const unitConfig: any = {};

 // 配置项
 unitConfig.grid_title = '（单位：元）';
 unitConfig.unit_key = 'CX_SJFX_WM_TSQK_WFKMXCX_WMQYCKTSJHMXSBB';                            // 业务单元key，对应后端接口
 unitConfig.page_id = 'CX_SJFX_WM_TSQK_WFKMXCX_WMQYCKTSJHMXSBB';                          // 页面id
 unitConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
 unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
 unitConfig.grid_show_data_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
 unitConfig.layout_type = 'tz';                                  // 页面类型，默认default 可选 default modal tabs tz台账
 unitConfig.export_key = 'CX_SJFX_WM_TSQK_WFKMXCX_WMQYCKTSJHMXSBB_PRINT_REPORT';
 unitConfig.module_type = 'sjbb';      
 
 unitConfig.grid_filter_quick = [
   {
     label: '外贸企业出口退税进货明细申报表',
     name: 'wmqy',
     type: 'Select',
     defaultValue: 'jh',
     width: '5w',
     onChange: 'handleOnChangeBgd',
     list: [
       { label: '外贸企业出口退税出口明细申报表', value: 'ck' },
       { label: '外贸企业出口退税进货明细申报表', value: 'jh' },
     ],
   },
   // { name: 'kprq', label: '开票日期', type: 'DatePicker', range: true,isLabel: true},
 
 ];
 
 // 配置项：筛选_普通筛选 页面最上方 第一层筛选
 unitConfig.filter_items = [
   { name: 'sbrq', label: '申报日期', type: 'DatePicker', range: true },
   { name: 'ssq', label: '申报年月', type: 'Input' },
   { name: 'sbpc', label: '申报批次', type: 'Input'},
   { name: 'glh', label: '关联号', type: 'Input'},
   { name: 'kprq', label: '开票日期', type: 'DatePicker', range: true, allowClear: true },
   { name: 'jhpzhjh', label: '进货凭证号', type: 'Input'},
   { name: 'ghfnsrsbh1', label: '供货方税号', type: 'Input' },
   { name: 'ckspDm', label: '出口商品代码', type: 'Input' },
 ];
 
 unitConfig.grid_columns = [
   { title: '关联号', dataIndex: 'glh', width: 170, fixed: 'left', sorter: true },
   {
     title: '税种', dataIndex: 'sz', width: 90, codeTable: ['CODE_DM_TZ_SZ', '01'],
     filter: {
       type: 'Radio',
       codeTable: ['CODE_DM_TZ_SZ', '01'],
     }
   },
   { title: '申报年月', dataIndex: 'ssq', width: 100, sorter: true, render: { type: 'date', format: 'yyyyMM' } },
   { title: '申报批次', dataIndex: 'sbpc', width: 100, sorter: true },
   { title: '序号', dataIndex: 'sbxh', width: 90, sorter: true },
   { title: '发票号码', dataIndex: 'fphm', width: 120 },
   { title: '发票代码', dataIndex: 'fpDm', width: 120, sorter: true },
   {
     title: '凭证种类', dataIndex: 'cktmspzlxDm', width: 140, ellipsis: true, codeTable: ['CODE_STATIC_TZ_CKTMSPZLX', '01'],
     filter: {
       type: 'Select',
       codeTable: ['CODE_STATIC_TZ_CKTMSPZLX', '01']
     },
   },
   { title: '进货凭证号', dataIndex: 'jhpzh', width: 180 },
   { title: '供货方税号', dataIndex: 'ghfnsrsbh1', width: 160 },
   { title: '开票日期', dataIndex: 'kprq', width: 90, sorter: true, render: { type: 'date', format: 'YYYY-MM-DD' } },
   { title: '出口商品代码', dataIndex: 'ckspDm', width: 120, ellipsis: true },
   { title: '商品名称', dataIndex: 'sbhgspmc', width: 140, ellipsis: true },
   // { title: '发票品名', dataIndex: 'hwhyslwmc', width: 130, ellipsis: true },
   { title: '计量单位', dataIndex: 'hgjldwmc', width: 80, ellipsis: true },
   { title: '数量', dataIndex: 'sl', width: 180, align: 'right', sum: true, render: { type: 'number', format: '0,0.00000' } },
   { title: '计税金额', dataIndex: 'jsje', width: 180, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
   { title: '征税率', dataIndex: 'zssl', width: 80, align: 'right', render: { func: 'renderTslIsNumber2' } },
   { title: '退税率', dataIndex: 'tsl', width: 80, align: 'right', render: { func: 'renderTslIsNumber2' } },
   // { title: '税额', dataIndex: 'zsse', width: 130, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
   { title: '可退税额', dataIndex: 'tse', width: 180, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
   { title: '备注', dataIndex: 'bz', width: 120, ellipsis: true },
   {
     title: '不予办理标志', dataIndex: 'byblbz', width: 140, align: 'left', render: { func: 'renderTzBz' },
   },
   {
     title: '不予退税标志', dataIndex: 'bytsbz', width: 140, align: 'left', render: { func: 'renderTzBz' },
   },
   {
     title: '暂不办理标志', dataIndex: 'zbblbz', width: 140, align: 'left', render: { func: 'renderTzBz' },
   },
   {
     title: '申报标志', dataIndex: 'sbbz1', width: 100, render: { func: 'renderTzSbbz' },
   },
   {
     title: '审核标志', dataIndex: 'shbz', width: 100, render: { func: 'renderTzShbz' },
   },
 ];
 
 // 配置项：工具栏
 unitConfig.toolbar_default = {
   sjgxUpdateData: true,               // 是否显示更新台账数据，默认关闭
   ckts_download: true,                   // 是否显示导出，默认关闭
   setting: true,                    // 是否显示设置按钮，默认关闭
   full: true,                       // 是否显示全屏按钮，默认关闭
   reload: true,                     // 是否显示刷新按钮，默认关闭
 };
 
 export default unitConfig;
 