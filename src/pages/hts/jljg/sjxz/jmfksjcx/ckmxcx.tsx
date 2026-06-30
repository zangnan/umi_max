import React, { useRef } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import unitConfig from './ckmxconfig';
import func from './func'
import ErrorMsgGrid from '@/pages/hts/ckfp/drmbkj/errormsg_grid';

const Index: React.FC<unknown> = () => {
  const errorMsgRef: any = useRef();
  func.getOtherRef = () => {
    const otherRef = [];
    // 导入模板数据异常页面
    otherRef.push(errorMsgRef);
    return otherRef;
  };

  return <>
    <DDBunit2 config={unitConfig} func={func} />
    <ErrorMsgGrid onRef={errorMsgRef} />
  </>;
};

export default Index;