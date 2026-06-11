/**
 * 参照文件模板 - 模拟源 auto_config.tsx 同目录的 index.tsx
 * 含 5 个 useRef 在 myConfig 之前（带紧邻 // 注释） + Func.getOtherRef 引用这 5 个
 * 预期：工具应在生成的 myConfig 之前注入 5 个 useRef 定义
 */
import React from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import unitConfig from './func-getotherref-pref';

const Index: React.FC<unknown> = () => {
  const scmxRef: any = useRef();    // 生成明细
  const hwcjRef: any = useRef();    // 货物冲减
  const tszbcsRef: any = useRef(); // 退税指标测算
  const hwccjRef: any = useRef();    // 海外仓冲减
  const ErrorMsgRef: any = useRef(); // 导入错误信息页面

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
    <DDBunit2 config={myConfig} />
  </>;
};
export default Index;
