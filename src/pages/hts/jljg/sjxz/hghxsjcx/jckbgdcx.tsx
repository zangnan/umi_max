import { intl } from '@/components/DDAssist/util';
import React, { useRef } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import unitConfig from './jckbgdconfig';
import func from './func'
import ErrorMsgGrid from '@/pages/hts/ckfp/drmbkj/errormsg_grid';
import DyGrid from '../common/dyGrid';



const Index: React.FC<unknown> = () => {

  const myConfig = {...unitConfig};
  for (let i = 0; i < myConfig.grid_columns.length; i++) {
    if (myConfig.grid_columns[i].dataIndex === 'jckbzDm') {
      myConfig.grid_columns[i].title = '进（出）口标识';
      myConfig.grid_columns[i].filter= {
        type: 'Radio',
        codeTable: 'CODE_STATIC_JLJGHX_JCKBZ:01',
      }
    }
    if (myConfig.grid_columns[i].dataIndex === 'sbhggqkajc') {
      myConfig.grid_columns[i].title = '进（出）境口岸';
    }
    if (myConfig.grid_columns[i].dataIndex === 'ckrq1') {
      myConfig.grid_columns[i].title = '进（出）口日期';
    }
  }
  myConfig.layout_type = "default";
  myConfig.unit_key = 'ZXSB_WBSJ_HG_DZKABGD';
  const errorMsgRef: any = useRef();
  const dyGridRef: any = useRef();
  func.initBgd = useIntl();
  func.getOtherRef = () => {
    const otherRef = [];
    // 导入模板数据异常页面
    otherRef.push(dyGridRef);
    otherRef.push(errorMsgRef);
    return otherRef;
  };

  return <>
    <DDBunit2 config={myConfig} func={func} />
    <DyGrid onRef={dyGridRef} dyType={'bgdhgbh'} />
    <ErrorMsgGrid onRef={errorMsgRef} />
  </>;
};

export default Index;