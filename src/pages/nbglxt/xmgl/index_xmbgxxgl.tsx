import React, { useEffect, useState } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import Func from './f';
import { automaticPageDef } from '@/services/hts/api';
import { theme } from 'antd';

const { useToken } = theme;

const Unit2: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = useState<any>({});
  const { token } = useToken();

  useEffect(() => {
    let promiseArr: any = [];
    let promise1: any = automaticPageDef('nbgl_xmgl_xmjbxxb');
    let promise2: any = automaticPageDef('nbgl_xmgl_xmlcbxxb');
    promiseArr.push(promise1);
    promiseArr.push(promise2);
    Promise.all(promiseArr).then((res) => {
      Func.initXmbg({setMyConfig, res, token, moduleKey: 'nbgl_xmgl_xmbgxxb'});
    })
  }, []);

  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>;
};

export default Unit2;