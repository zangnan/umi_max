import { useState, useCallback } from 'react';

export default () => {
  const [searchModel, setSearchModel] = useState<any>({});
  const changeSearchModel = useCallback(setSearchModel, []);
  const [bgdKeys, setBgdKeys] = useState<any>([]);
  const changeBgdKeys = useCallback(setBgdKeys, []);
  const [bgdRows, setBgdRows] = useState<any>([]);
  const changeBgdRows = useCallback(setBgdRows, []);
  const [fpKeys, setFpKeys] = useState<any>([]);
  const changeFpKeys = useCallback(setFpKeys, []);
  const [fpRows, setFpRows] = useState<any>([]);
  const changeFpRows = useCallback(setFpRows, []);
  return {searchModel, changeSearchModel, bgdKeys, changeBgdKeys, bgdRows, changeBgdRows, fpKeys, changeFpKeys, fpRows, changeFpRows};
};