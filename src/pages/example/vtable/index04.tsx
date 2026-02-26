import React, { useState, useEffect } from 'react';
import DDPivotTable from '@/components/DDVTable/DDPivotTable';
import config from './index04Config';

const TableList: React.FC<unknown> = () => {
  return (<>
    <DDPivotTable config={config} />
  </>);
};

export default TableList;
