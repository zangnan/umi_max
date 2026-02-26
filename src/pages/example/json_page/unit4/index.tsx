import React from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import unitConfig from './config';

const Unit: React.FC<unknown> = () => {
  return <DDBunit2 config={unitConfig} />;
};
export default Unit;