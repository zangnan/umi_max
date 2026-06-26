/**
 * title: 购进自用货物
 * author: wx
 */
import React from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import config from './auto_config';
import Func from './f'
const index: React.FC<unknown> = () => {

  const myConfig = { ...config };
  
  myConfig.grid_columns_tj[13].dataIndex = 'jhpzh';
  // myConfig.grid_columns_tj[20].hidden = true;
  const column20: any = myConfig.grid_columns_tj[20] || {}
  column20.hidden = true;

  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>
};
export default index;