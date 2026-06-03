import { useState, useCallback } from 'react';

export default () => {
  const [DDB2PageData, setDDB2PageData] = useState({});
  const changeDDB2PageData = useCallback(setDDB2PageData, []);
  return { DDB2PageData, setDDB2PageData, changeDDB2PageData };
};