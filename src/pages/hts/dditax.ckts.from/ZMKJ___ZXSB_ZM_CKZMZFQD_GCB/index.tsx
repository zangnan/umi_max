/**
 * title: 作废出口退（免）税有关证明
 */
import React from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import config from './auto_config';
import Func from './f'
const index: React.FC<unknown> = () => {

  const myConfig = { ...config };
  const dataIndexellipsis = ['yzmkjswjgmc'];
  myConfig.grid_columns.forEach((item: any) => {
    if (dataIndexellipsis.length > 0 && dataIndexellipsis.indexOf(item.dataIndex) > -1) {
      item.ellipsis = true;
    }
  })
  myConfig.grid_columns_tj.forEach((item: any) => {
    if (dataIndexellipsis.length > 0 && dataIndexellipsis.indexOf(item.dataIndex) > -1) {
      item.ellipsis = true;
    }
  })

  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>
};
export default index;