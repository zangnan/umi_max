/**
 * 发票开具配置  其他商品管理
 */
import React, { useRef } from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import unitConfig from './qtspglconfig';
import func from './qtspglFunc';
import FmGrid from './fm/wxspglfm';

const Index: React.FC<{ data: any }> = ({
  data
}) => {
  const fmGrid: any = useRef();
  func.getOtherRef = () => {
    const otherRef = [];
    // 赋码弹窗页面页面
    otherRef.push(fmGrid);
    return otherRef;
  };
  return <>
    <div key={data}>
      <DDBunit2 config={unitConfig} func={func} />
      <FmGrid onRef={fmGrid} />
    </div>
  </>;
};

export default Index;