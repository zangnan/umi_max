import React, {useRef} from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import unitConfig from './func-getotherref-pref.actual';
import Func from './func-getotherref-pref.actualFun';

const Unit: React.FC<unknown> = () => {
  const scmxRef: any = useRef();    // 生成明细
  const hwcjRef: any = useRef();    // 货物冲减
  const tszbcsRef: any = useRef(); // 退税指标测算
  const hwccjRef: any = useRef();    // 海外仓冲减
  const ErrorMsgRef: any = useRef(); // 导入错误信息页面
  // 改变默认配置项
  const myConfig = { ...unitConfig };
  myConfig.grid_columns.forEach((item: any) => {
    item.ellipsis = true;
  });

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(scmxRef);
    otherRef.push(hwcjRef);
    otherRef.push(tszbcsRef);
    otherRef.push(hwccjRef);
    otherRef.push(ErrorMsgRef);
    return otherRef;
  };

  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>;
};
export default Unit;
