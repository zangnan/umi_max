import React from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import unitConfig from './form-api-save-delete-rename.actual';
import Func from './form-api-save-delete-rename.actualFun';

const Unit: React.FC<unknown> = () => {
  // 改变默认配置项
  const myConfig = { ...unitConfig };
  myConfig.api_form_edit = `/ref/save`;
  myConfig.form_api_save_upload = `${API_URL_BASE}/ref/saveUpload`;
  myConfig.api_form_delete = `/ref/delete`;

  myConfig.grid_columns.forEach((item: any) => {
    item.ellipsis = true;
  });

  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>;
};
export default Unit;
