import React, { useState, useEffect } from 'react';
import { ListTable } from '@visactor/react-vtable';

const TableList: React.FC<unknown> = () => {
  const [myOption, setMyOption] = useState<any>({});
  const option = {
    columns: [
      { field: '0', title: 'name' },
      { field: '1', title: 'age' },
      { field: '2', title: 'gender' },
      { field: '3', title: 'hobby' }
    ],
    records: new Array(1000).fill(['John', 18, 'male', '🏀'])
  };

  useEffect(() => {
  }, []);

  return (<>
    <ListTable option={option} height={500} />
  </>);
};

export default TableList;
