import React from 'react';
import DDBunitTreeGrid from '@/components/DDBunit/DDBunitTreeGrid';
import config1 from './tree_grid_config_left';
import config2 from './tree_grid_config_right';
import func1 from './tree_grid_f_left';
import func2 from './tree_grid_f_right';

const index: React.FC<unknown> = () => {
  return <DDBunitTreeGrid config={config1} config2={config2} func={func1} func2={func2} />
};

export default index;
