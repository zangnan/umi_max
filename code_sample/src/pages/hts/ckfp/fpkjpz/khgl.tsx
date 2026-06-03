/**
 * 发票开具配置  客户管理
 */
import React from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import khglconfig from './khglconfig';
import func from './khglFunc'

const Index: React.FC<{ data: any }> = ({
  data,
}) => {

  return <>
    <div key={data}>
      <DDBunit2 config={khglconfig} func={func} />
    </div>
  </>;
};

export default Index;