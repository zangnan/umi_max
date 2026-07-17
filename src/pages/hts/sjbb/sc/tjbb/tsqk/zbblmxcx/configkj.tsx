import CONSTANTS from '@/components/DDAssist/constants';


/**
 * title: 暂不办理明细查询-跨境应税行为免抵退税申报明细表
 */
 const unitConfig: any = {};

 // 配置项
 unitConfig.grid_title = '（单位：元、美元）';
 unitConfig.module_key = 'CX_SJFX_SC_TSQK_ZBBLMXCX_KJYSXWMDTSSBMXB';          // 业务单元key，对应后端接口
 unitConfig.page_id = 'CX_SJFX_SC_TSQK_ZBBLMXCX_KJYSXWMDTSSBMXB';           // 页面id
 unitConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
 unitConfig.grid_selection_type = false;                          // 列表首选项类别，默认 checkbox，可选 false radio checkbox
 unitConfig.toolbar_show_grid_checked_num = false;                           // 工具栏左侧是否显示数据条数及选中数，默认true显示
 unitConfig.layout_type = 'tz';                                   // 页面类型，默认default 可选 default modal tabs tz台账
 unitConfig.export_key = 'CX_SJFX_SC_TSQK_ZBBLMXCX_KJYSXWMDTSSBMXB_PRINT_REPORT';
 unitConfig.module_type = 'sjbb';      
 // 配置项：列表列
 // 配置项：列表列
 
 // 配置项：列表列
 unitConfig.grid_columns = [
   { title: '所属期', dataIndex: 'ssq', width: 90, fixed: 'left', render: { type: 'date', format: 'YYYYMM' } },
   { title: '序号', dataIndex: 'sbxh', width: 90, sorter: true },
   { title: '出口发票号', dataIndex: 'ckfph', width: 180, sorter: true },
   { title: '出口发票开具日期', dataIndex: 'kprq', width: 150, sorter: true, render: { type: 'date', format: 'YYYY-MM-DD' } },
   { title: '跨境应税行为代码', dataIndex: 'ysfwDm', width: 150 },
   { title: '跨境应税行为名称', dataIndex: 'ysfwmc', width: 150 },
   { title: '合同号', dataIndex: 'hth', width: 150, ellipsis: true, sorter: true },
   { title: '有关证明编号', dataIndex: 'cktszmbh', width: 150, ellipsis: true },
   { title: '境外单位名称', dataIndex: 'jwdwmc', width: 150, ellipsis: true },
   { title: '境外单位所在国家或地区代码', dataIndex: 'gjhdqszDm', width: 200, ellipsis: true },
   { title: '境外单位所在国家或地区名称', dataIndex: 'gjhdqmc', width: 200, ellipsis: true },
   { title: '合同人民币总金额', dataIndex: 'htzjermb', width: 160, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' }, sorter: true },
   { title: '合同美元总金额', dataIndex: 'htzjemy', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
   { title: '收入原币代码', dataIndex: 'srybzmDm', width: 150 },
   { title: '原币币别', dataIndex: 'srybbb', width: 90 },
   { title: '营业收入原币金额', dataIndex: 'srybje', width: 160, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' }, sorter: true },
   { title: '收入原币汇率', dataIndex: 'srybhl', width: 130, align: 'right', render: { type: 'number', format: '0,0.00000' } },
   { title: '营业收入人民币金额', dataIndex: 'bqqrysfwyysrrmbje', width: 160, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' }, sorter: true },
   { title: '收入美元汇率', dataIndex: 'srmyhl', width: 130, align: 'right', render: { type: 'number', format: '0,0.00000' } },
   { title: '营业收入美元金额', dataIndex: 'skjemy', width: 160, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' }, sorter: true },
   { title: '收款原币代码', dataIndex: 'skybzmDm', width: 130 },
   { title: '收款原币币别', dataIndex: 'skybbb', width: 120 },
   { title: '本期原币收款额', dataIndex: 'skybje', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' }, sorter: true },
   { title: '收款原币汇率', dataIndex: 'cjhbhl', width: 130, align: 'right', render: { type: 'number', format: '0,0.00000' } },
   { title: '本期人民币收款额', dataIndex: 'ysfwyyermb', width: 160, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' }, sorter: true },
   { title: '收款美元汇率', dataIndex: 'myhl', width: 130, align: 'right', render: { type: 'number', format: '0,0.00000' } },
   { title: '本期美元收款额', dataIndex: 'bqskjemy', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' }, sorter: true },
   { title: '免抵退税计税金额', dataIndex: 'ysfwyyemdtsjsje', width: 160, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' }, sorter: true },
   { title: '征税率', dataIndex: 'zssl', width: 80, align: 'right', render: { func: 'renderTslIsNumber2' } },
   { title: '退税率', dataIndex: 'tsl', width: 80, align: 'right', render: { func: 'renderTslIsNumber2' } },
   { title: '免抵退税计税金额乘征退税率之差', dataIndex: 'ztsce', width: 230, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
   { title: '销售额乘退税率', dataIndex: 'ytse1', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
   { title: '跨境应税行为业务类型代码', dataIndex: 'cktmsywlxdmjh', width: 220, ellipsis: true },
   { title: '跨境应税行为业务类型名称', dataIndex: 'cktmsywlxmcjh', width: 220, ellipsis: true },
   { title: '备注', dataIndex: 'bz', width: 230, ellipsis: true },
   { title: '免抵退税年月', dataIndex: 'mdtsny', width: 110 },
   { title: '不予办理标志', dataIndex: 'byblbz', width: 130, align: 'left', render: { func: 'renderTzBz' } },
   { title: '不予退税标志', dataIndex: 'bytsbz', width: 130, align: 'left', render: { func: 'renderTzBz' } },
   { title: '暂不办理标志', dataIndex: 'zbblbz', width: 130, align: 'left', render: { func: 'renderTzBz' } },
   { title: '申报标志', dataIndex: 'sbbz1', width: 90, render: { func: 'renderTzSbbz' }, },
   { title: '审核标志', dataIndex: 'shbz', width: 110, render: { func: 'renderTzShbz' }, },
 ];
 
 // 配置项：筛选_普通筛选 页面最上方 第一层筛选
 unitConfig.filter_items = [
   { name: 'sbrq', label: '申报日期', type: 'DatePicker', range: true,isLabel: true},
   { name: 'ssq', label: '所属期', type: 'Input' },
   { name: 'ckhth', label: '合同号', type: 'Input',},
   { name: 'jwdwmc', label: '境外单位名称',type: 'Input', },
   { name: 'cktszmbh', label: '有关证明编号', type: 'Input', },
 ];
 // 配置项：工具栏
 unitConfig.toolbar_default = {
   sjgxUpdateData: true,               // 是否显示更新台账数据，默认关闭
   ckts_download: true,                   // 是否显示导出，默认关闭
   setting: true,                    // 是否显示设置按钮，默认关闭
   full: true,                       // 是否显示全屏按钮，默认关闭
   reload: true,                     // 是否显示刷新按钮，默认关闭
 };
 unitConfig.grid_filter_quick = [
   {
     label: '出口货物劳务免抵退税申报明细表',
     name: 'scqy',
     type: 'Select',
     defaultValue: '3',
     width: '5w',
     eventOnChange: 'handleOnChangeBgd',
     list: [
       { name: '出口货物劳务免抵退税申报明细表', value: '1' },
       { name: '国际运输（港澳台运输）免抵退税申报明细表', value: '2' },
       { name: '跨境应税行为免抵退税申报明细表', value: '3' },
     ],
   },
 ];
 
 unitConfig.customer_toolbar = [];
unitConfig.handle_columns = [];
export default unitConfig;
 