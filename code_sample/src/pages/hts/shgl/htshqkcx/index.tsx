/**
 * 合同收汇情况查询
 */
import React, { useRef } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import htshqkconfig from './htshqkconfig';
import func from './htshqkFunc'



const Index: React.FC<{ data: any }> = ({
  data,
}) => {
return <>
    <div key={data}>
      <DDBunit2 config={htshqkconfig} func={func} />
    </div>
  </>;
};

export default Index;

