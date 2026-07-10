import React, { useRef } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import unitConfig from '../monthDataConfig';
import func from '../func';
import myUtil from '@/components/DDAssist/util';
import { cloneDeep } from 'lodash';

const Index: React.FC<{ data: any, mainref: any }> = ({
  data,
  mainref,
}) => {

  func.getOtherRef = () => {
    // const otherRef = [];
    // otherRef.push({'tjqlxDm':'1'});// 月度-标识
    // otherRef.push(gridRef);
    // otherRef.push(xjIndexRef);
    // otherRef.push(errorMsgRef);
    // otherRef.push(mainref);
    // return otherRef;
  };

  // const myConfigRz = {...unitConfig};
  const myConfigRz = cloneDeep(unitConfig);

  myConfigRz.gridParams = {
    initSearchModal: [
      { property: 'tjqlxDm', value: '1', op: 'zdy' },
    ],
  }

  myConfigRz.module_key = 'CX_SAAS_MDT_TUISHUIJIHUA_RZ'; // 业务单元key，对应后端接口
  myConfigRz.export_key = 'SAAS_TUISHUISHUJU_YD_RZ_EXPORT'; // 业务单元key，对应后端接口
  myConfigRz.toolbar_default={tssb_download: true, reload: true,full: true,setting: true,};
  myConfigRz.customer_toolbar = [];

  let myColumns = myConfigRz.grid_columns;

  myColumns.forEach((element: { children: any[]; sum: boolean; }) => {
    if (element.children) {
      element.children.forEach((e: { sum: boolean; }) => {
        if(e.sum){
          e.sum = false;
        }
      });
    } else {
      if(element.sum){
        element.sum = false;
      }
    }
  });

  const userInfo = myUtil.sessionStore.getItem('userInfo');
  const qxQys = userInfo?.qxQys[0];
  if (qxQys?.cktsqylxDm === 'WM') {
    myColumns =  myConfigRz.wm_grid_columns;
    myConfigRz.module_key = 'CX_SAAS_MTS_TUISHUIJIHUA_RZ'; // 业务单元key，对应后端接口
    myConfigRz.toolbar_default.tssb_download=false;
    myConfigRz.customer_toolbar=[{ name: '导出', key: 'dc', func: 'seasonDownload' }];
  }
  myColumns.push({ title: '删除人', dataIndex: 'scr', width: 120, align: 'left' });
  myColumns.push({ title: '删除时间', dataIndex: 'scrq1', width: 150, align: 'center', render: { type: 'date', format: 'yyyy-MM-DD HH:mm:ss' }});
  myConfigRz.grid_columns = myColumns;

  return <>
    <div key={data}>
      <DDBunit2 config={myConfigRz} func={func} />
    </div>
  </>;
};

export default Index;