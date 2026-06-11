import React from 'react';
import myUtil from '@/components/DDAssist/util';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import unitConfig from './yearDataConfig';
import Func from './yearDataFun';

const Unit: React.FC<unknown> = () => {
  // 改变默认配置项
  const myConfig = { ...unitConfig };
  const userInfo = myUtil.sessionStore.getItem('userInfo');
  const qxQys = userInfo?.qxQys[0];
  if (qxQys?.cktsqylxDm === 'WM') {
    myConfig.grid_columns = myConfig.wm_grid_columns;//设置列表
    myConfig.unit_key = 'CX_SAAS_MTS_TUISHUIJIHUA'; // 业务单元key，对应后端接口
    myConfig.export_key = 'CX_SAAS_MTS_TUISHUIJIHUA_YEAR'; // 业务单元key，对应后端接口
  }
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'tjqlxDm', value: '4', op: 'zdy' },
    ],
  };

  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>;
};
export default Unit;
