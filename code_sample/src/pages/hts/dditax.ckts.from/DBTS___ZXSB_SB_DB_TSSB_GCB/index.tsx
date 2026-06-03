/**
 * title: 外贸综合服务企业代办退税申报表
 * author: wx
 */
import React from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './auto_config';
import Func from './f'
const index: React.FC<unknown> = () => {

  const myConfig = { ...config };

  myConfig.form_api_save = `${API_URL_BASE}/yw/bszx/wzf/dbts/tssb/updateWzfDbts`; // api 表单更新
  myConfig.form_api_save_upload = `${API_URL_BASE}/yw/bszx/wzf/dbts/tssb/updateWzfDbts`;
  myConfig.form_api_delete = `${API_URL_BASE}/yw/bszx/wzf/dbts/tssb/deleteWzfDbts`; // api 表单删除
  // 开启批量修改
  myConfig.toolbar_default.batchEdit = true;
  myConfig.batch_update_url = `${API_URL_BASE}/yw/bszx/dbts/tssb/dbtsPlxgSbmxsj`;
  // 表单备注添加长度校验,
  myConfig.form_items[7].rules = [{ type: 'base_required' }, { type: 'base_string', length: '21' }, { type: 'base_type_number_english' }]; // 出口货物报关单号
  myConfig.form_items[32] = { label: '备注', name: 'bz', type: 'TextArea', rules: [{ type: 'base_string', range: [0, 200]}], autoSize: { minRows: 2, maxRows: 2}, layout: { label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3}, formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 } }},
  // 业务类型码表
  // myConfig.form_items[26].codeTable = ['code_dm_ckts_cktmsywlx', '05'];
  // // 调整列表顺序
  // myConfig.grid_columns[7] = { title: '出口商品名称', dataIndex: 'hgspmc', align: 'left', width: 180, ellipsis: true};
  // myConfig.grid_columns[8] = { title: '计量单位', dataIndex: 'hgjldwmc', align: 'left', width: 90};
  // myConfig.grid_columns[9] = { title: '申报商品代码', dataIndex: 'sbspDm', align: 'left', width: 120};

  // 筛选项业务类型名称cktmsywlxmcjh改为cktmsywlxdmjh
  // myConfig.filter_items[7] = { name: 'cktmsywlxdmjh', label: '业务类型名称', type: 'Select', codeTable: ['code_dm_ckts_cktmsywlx',  '05'] },
  myConfig.batch_update_items = [
    { dataIndex: 'ssq', label: '所属期', type: "Input" },
    { dataIndex: 'sbpc', label: '申报批次', type: "Input" },
    { dataIndex: 'dbtsywlxDm', label: '货物类型代码', type: "tableSelect", codeTable: ['code_dm_ckts_dbtsywlx', '01'] },
    { dataIndex: 'bz', label: '备注', type: "Input", rules: [{ type: 'base_string', range: [0, 200]}] },
  ];

  // 导入
  myConfig.import_key = 'SAAS_DBTS_MXCJ_WZFDBTS_DR';
  myConfig.toolbar_default.tssb_download = true;
  myConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出
  myConfig.toolbar_default.ckts_download = false;


  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>
};
export default index;
