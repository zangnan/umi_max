/**
 * title: 跨境电商出口海外仓预退税核算确认表
 * author: wx
 */
import React from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import config from './auto_config';
import Func from './f'
import { cloneDeep } from 'lodash';
const index: React.FC<unknown> = () => {

  const myConfig = cloneDeep(config);
  myConfig.toolbar_default.tssb_download = true;
  myConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出
  myConfig.toolbar_default.ckts_download = false;
  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>
};
export default index;