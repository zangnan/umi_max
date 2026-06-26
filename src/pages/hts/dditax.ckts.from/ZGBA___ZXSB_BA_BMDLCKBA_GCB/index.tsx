/**
 * title: 边贸代理出口备案
 * author: wx
 */
import React from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import config from './auto_config';
import Func from './f'
const index: React.FC<unknown> = () => {

  const myConfig = { ...config };
  myConfig.api_form_edit = `/yw/bszx/zgba/bmdlck/updateBmdlck`; // api 表单更新
  myConfig.form_api_save_upload= `/yw/bszx/zgba/bmdlck/updateBmdlck`; // api 表单更新

  myConfig.api_form_delete = `/yw/bszx/zgba/bmdlck/deleteBmdlck`; // api 表单删除
  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>
};
export default index;