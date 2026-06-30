/**
 * 配置管理-自动匹配配置管理-单位管理
 */
import React from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import dwConfig from './dwConfig';
import func from './dwFunc'

const Index: React.FC<{ data: any }> = ({
  data,
}) => {

  return <>
    <div key={data}>
      <DDBunit2 config={dwConfig} func={func} />
    </div>
  </>;
};

export default Index;