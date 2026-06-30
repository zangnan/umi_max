import React from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import unitConfig from './spglconfig';
import func from './spglFunc'

const Index: React.FC<unknown> = () => {
  return <DDBunit2 config={unitConfig} func={func}/>;
};

export default Index;