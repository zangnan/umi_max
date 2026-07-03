/**
 * title: 跨境应税行为收讫营业款明细清单
 * author: wx
 */
import React from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './auto_config';
import Func from './f'
const index: React.FC<unknown> = () => {

  const myConfig = { ...config };
  myConfig.form_api_save = `${API_URL_BASE}/yw/bszx/mdt/ysfw/syyk/saveSyyk`; // api 表单更新
  myConfig.form_api_save_upload = `${API_URL_BASE}/yw/bszx/mdt/ysfw/syyk/saveSyyk`; // api 表单更新

  myConfig.form_api_delete = `${API_URL_BASE}/yw/bszx/mdt/ysfw/syyk/deleteSyyk`; // api 表单删除

  myConfig.toolbar_default.tssb_download = true;
  myConfig.toolbar_default.ckts_download = false;

  // 导入
  myConfig.import_key = 'SAAS_TSSB_MXCJ_SYYK_DR';

  const dataIndex = ['hth', 'skpzh'];

  myConfig.grid_columns.forEach((item: any) => {
    if (dataIndex.length > 0 && dataIndex.indexOf(item.dataIndex) > -1) {
      item.ellipsis = true;
    }
  })
  myConfig.grid_columns_tj.forEach((item: any) => {
    if (dataIndex.length > 0 && dataIndex.indexOf(item.dataIndex) > -1) {
      item.ellipsis = true;
    }
  })
  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>
};
export default index;