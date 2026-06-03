/**
 * title: 受托/委托企业信息管理
 */
import React from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import khglconfig from './qyxxConfig';
import func from './qyxxFunc'

const Index: React.FC<unknown> = () => {
  return <>
      <DDBunit2 config={khglconfig} func={func} />
  </>;
};

export default Index;