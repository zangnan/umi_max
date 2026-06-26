/**
 * title: 先退税后核销申请
 */
import React from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import config from './auto_config';
import Func from './f'
const index: React.FC<unknown> = () => {

  const myConfig = { ...config };
  //生成的文件缺少dycskbl01
  myConfig.form_items = [
    { label: 'UUID', name: 'uuid', type: 'Hidden' },
    { label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
    { label: '申请日期', name: 'tbrq1', type: 'DatePicker', format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }, { func: 'tbrq104' }]},
    { label: '序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
    { label: '企业信息', name: 'qyxx', type: 'GroupTitle' },
    { label: '出口合同号', name: 'ckhth', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 32]}]},
    { label: '外商名称', name: 'wsdwmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 200]}]},
    { label: '出口商品代码', name: 'ckspDm', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 12]}], eventOnBlur: 'ckspDm' },
    { label: '出口商品名称', name: 'ckspmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 75]}]},
    { label: '出口合同规定的内容_投产日期', name: 'tcrq', type: 'DatePicker', format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }, { func: 'tcrq01' }]},
    { label: '出口合同规定的内容_完工日期', name: 'wgrq', type: 'DatePicker', format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }, { func: 'wgrq01' }]},
    { label: '出口合同规定的内容_出口额（美元）', name: 'mylaj', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}]},
    { label: '出口合同规定的内容_预计收款次数', name: 'yjskcs', type: 'InputNumber', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_number', range: '+-' }, { type: 'base_number', length: 10, decimal: 0}]},
    { label: '出口合同规定的每期付款金额占合同出口总额的比例_第一次', name: 'dycskbl', type: 'InputNumber', format: '0,0.0000', rules: [{ type: 'base_required' }, { type: 'base_number', range: '+-' }, { type: 'base_number', length: 3, decimal: 0},{func:'dycskbl01'}], eventOnBlur: 'dycskbl' },
    { label: '出口合同规定的每期付款金额占合同出口总额的比例_第二次', name: 'decskbl', type: 'InputNumber', format: '0,0.0000', rules: [{ type: 'base_number', length: 3, decimal: 0}, { type: 'base_required' },{func:'dycskbl01'}], eventOnBlur: 'decskbl' },
    { label: '剩余比例', name: 'qyskbl', type: 'InputNumber', format: '0,0.0000', rules: [{ type: 'base_number', length: 3, decimal: 0}],},
    { label: '业务类型', name: 'cktmsywlxdmjh', type: 'Select', showType: '3', 'showSearch': true, 'mode': 'multiple', eventOnChange: 'cktmsywlxdmjh', 'allowClear': true, readOnly: true, codeTable: 'code_dm_ckts_cktmsywlx:01', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 30]}]},
    { label: '其他信息', name: 'qtxx', type: 'GroupTitle' },
    { label: '备注', name: 'bz', type: 'TextArea', autoSize: { minRows: 2, maxRows: 2}, layout: { label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3}, formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 } }},
  ];

  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>
};
export default index;