/**
 * 外商管理
 */
import React from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
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