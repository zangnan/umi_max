/**
 * title: 跨境应税行为免抵退税申报明细表
 * author: wx
 */
import React from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import config from './auto_config';
import Func from './f'
const index: React.FC<unknown> = () => {

  const myConfig = { ...config };
  const dataIndexellipsis = ['hth', 'cktszmbh', 'cktmsywlxdmjh'];
  myConfig.grid_columns.forEach((item: any) => {
    if (dataIndexellipsis.length > 0 && dataIndexellipsis.indexOf(item.dataIndex) > -1) {
      item.ellipsis = true;
    }
    if (item.dataIndex === 'cktmsywlxmcjh') {
      item.width = 260;
    }
  })
  myConfig.grid_columns_tj.forEach((item: any) => {
    if (dataIndexellipsis.length > 0 && dataIndexellipsis.indexOf(item.dataIndex) > -1) {
      item.ellipsis = true;
    }
    if (item.dataIndex === 'cktmsywlxmcjh') {
      item.width = 260;
    }
  })

  // 导入
  myConfig.import_key = 'SAAS_TSSB_MXCJ_YFSJ_DR';

  myConfig.toolbar_default.tssb_download = true;
  myConfig.toolbar_default.ckts_download = false;



return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>
};
export default index;
