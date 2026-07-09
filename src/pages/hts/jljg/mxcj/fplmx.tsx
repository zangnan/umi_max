import React from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';

export interface FplmxProps {
  param?: any;
}

const Fplmx: React.FC<FplmxProps> = ({
  param,
}) => {
  return (
    <>
      <DDBunit2 config={param} func={{refUnit: React.createRef()}}/>
    </>
  );
};

export default Fplmx;
