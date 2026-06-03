import React from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';

export interface FplmxProps {
  param?: any;
}

const Fplmx: React.FC<FplmxProps> = ({
  param,
}) => {
  return (
    <>
      <DDBunit2 config={param} func={{unitRef: React.createRef()}}/>
    </>
  );
};

export default Fplmx;
