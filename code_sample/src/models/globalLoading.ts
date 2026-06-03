import { useState, useCallback } from 'react';

export default () => {
  const [globalLoading, setGlobalLoading] = useState(false);

  const changeGlobalLoading = useCallback(setGlobalLoading, []);
  // const changeGlobalLoading2 = useCallback(setGlobalLoading, []);
  // const changeGlobalLoading3 = useCallback(setGlobalLoading, []);
  // const changeGlobalLoading4 = useCallback(setGlobalLoading, []);

  return { globalLoading, setGlobalLoading, changeGlobalLoading };
};