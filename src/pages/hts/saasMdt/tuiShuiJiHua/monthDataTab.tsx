import React, { useRef } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import unitConfig from './monthDataConfig';
import func from './func';
import myUtil from '@/components/DDAssist/util';
import { cloneDeep } from 'lodash';

const Index: React.FC<{ data: any, mainref: any }> = ({
  data,
  mainref,
}) => {

  func.getOtherRef = () => {
    const otherRef = [];
    // otherRef.push({'tjqlxDm':'1'});// 月度-标识
    // otherRef.push(gridRef);
    // otherRef.push(xjIndexRef);
    // otherRef.push(errorMsgRef);
    // otherRef.push(mainref);
    return otherRef;
  };

  // const myConfig = {...unitConfig};
  const myConfig = cloneDeep(unitConfig);

  const userInfo = myUtil.sessionStore.getItem('userInfo');
  const qxQys = userInfo?.qxQys[0];

  if (qxQys?.cktsqylxDm === 'WM') {
    myConfig.customer_toolbar.unshift({ name: '更新数据', func: 'btnGxsj' });
    myConfig.grid_columns = myConfig.wm_grid_columns;//设置列表
    myConfig.unit_key = 'CX_SAAS_MTS_TUISHUIJIHUA'; // 业务单元key，对应后端接口
    myConfig.export_key = 'CX_SAAS_MTS_TUISHUIJIHUA'; // 业务单元key，对应后端接口
    myConfig.toolbar_default.tssb_download = false;
    myConfig.customer_toolbar.push({ name: '导出', key: 'dc', func: 'seasonDownload' });
  }
    
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'tjqlxDm', value: '1', op: 'zdy' },
    ],
  }

  return <>
    <div key={data}>
      <DDBunit2 config={myConfig} func={func} />
    </div>
  </>;
};

export default Index;