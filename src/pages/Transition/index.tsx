import React, { useEffect, useState } from 'react';
import { Spin, message } from 'antd';
import { login, loginForExt } from '@/services/api';
import CONSTANTS from '@/components/DDAssist/constants';
import { history, useModel } from '@umijs/max';
import myUtil from '@/components/DDAssist/util';
import { flushSync } from 'react-dom';

const HomePage: React.FC = () => {
  const [spinning, setSpinning] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await myUtil.sdp.init({currentUser: userInfo?.body});
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleLogin = async () => {
    setSpinning(true);
    const tmpUrl = window.location.href;
    // console.info(tmpUrl);
    // debugger;
    // http://localhost:3001/user/transition?encodedData=fmOTHru8bcQm9BDjn+gCTltpz/OY5PCGAEv+YfldVclQqe90OyjWd0r+U7Ly1+I31b8ubz3mJMG+VL77WFDE6GgzUEHDfxTRFv2g6LM+VjGx7x0GlAo0t/iAOwqwDG4DLVttC+xynznCzAarTnpZAAlQ2Tw2WelPM+6AZf9+0b8=
    // http://localhost:3001/user/transition?encodedData=OwWAlnjOB5Q/OSt54NzpZrCA9O+Fu+IOKl8sx8se07s2OviQt3YwEDaCkEytifzxGfqi891jXSU5d/eBFfslw/PYnB7q45A6SeAG4qcCEB9fkzYfTnoDzv0U8ld4rNX3XRv83Kd3ehx0umFQ6PGK185bMfN46Ab8KkcgMyFQsHs=
    let encodedData: any = '';
    if (tmpUrl.indexOf('?') > -1) {
      let tmp = tmpUrl.split('?encodedData=');
      encodedData = tmp.length > 1 ? tmp[1] : '';
    }
    const param = { encodedData };
    const res: any = await loginForExt(param);
    if (res.code === '200') {
      message.success('登录成功！');
      if (res?.body?.token) {
        localStorage.setItem(CONSTANTS.LOGIN.ACCESS_TOKEN, res?.body?.token);
      }
      await fetchUserInfo();
      history.push('/');
      setSpinning(false);
      return;
    }
  }

  useEffect(() => {
    handleLogin()
  }, []);

  return (
    <Spin spinning={spinning} fullscreen />
  );
};

export default HomePage;
