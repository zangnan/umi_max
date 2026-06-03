import React, { useRef } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import unitConfig from './seasonDataConfig';
import func from './func';
import myUtil from '@/pages/common/myUtil';
import { cloneDeep } from 'lodash';

const Index: React.FC<{ data: any, mainref: any }> = ({
  data,
  mainref,
}) => {

  // const hgbgdRef: any = useRef();
  // const errorMsgRef: any = useRef();
  func.getOtherRef = () => {
    const otherRef = [];
    // otherRef.push({'tjqlxDm':'2'});// 季度-标识
    // otherRef.push(hgbgdRef);
    // otherRef.push(errorMsgRef);
    // otherRef.push(mainref);
    return otherRef;
  };
  // const myConfig = {...unitConfig};
  const myConfig = cloneDeep(unitConfig);

  const userInfo = myUtil.sessionStore.getItem('userInfo');
  const qxQys = userInfo?.qxQys[0];
  if (qxQys?.cktsqylxDm === 'WM') {
    myConfig.grid_columns = myConfig.wm_grid_columns;//设置列表
    myConfig.unit_key = 'CX_SAAS_MTS_TUISHUIJIHUA'; // 业务单元key，对应后端接口
    myConfig.export_key = 'CX_SAAS_MTS_TUISHUIJIHUA_SEASON'; // 业务单元key，对应后端接口
  }

  myConfig.gridParams = {
    initSearchModal: [
      { property: 'tjqlxDm', value: '2', op: 'zdy' },
    ],
  }

  return <>
    <div key={data}>
      <DDBunit2 config={myConfig} func={func} />
    </div>
  </>;
};

export default Index;