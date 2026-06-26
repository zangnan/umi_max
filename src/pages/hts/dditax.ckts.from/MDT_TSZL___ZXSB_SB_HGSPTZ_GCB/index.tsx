/**
 * title: 海关出口商品代码、名称、退税率调整对应表
 * author: wx
 */
import cktsUtil from '@/pages/hts/cktsUtil';
import React from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import config from './auto_config';
import Func from './f'
import UnitUtil from '@/components/DDBunit/unit_util';
const index: React.FC<unknown> = () => {

  const myConfig = { ...config };
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'lcswsxDm', value: cktsUtil.getLcswsxDm(config.unit_constant), op: 'al' },
    ],
  }
  // 导入
  myConfig.import_key = 'SAAS_TSSB_MXCJ_HGSPTZ_SC_DR';
  myConfig.toolbar_default.tssb_download = true;
  myConfig.toolbar_default.ckts_download = false;


  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>
};
export default index;