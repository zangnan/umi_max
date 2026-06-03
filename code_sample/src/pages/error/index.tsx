import React from 'react';
import { Button, Result } from 'antd';
import { history } from 'umi';
import style from './less.less';

const Index: React.FC<unknown> = () => {
  // let code = history.location.search.split('=')[1];
  const status = history?.location.query?.status || 300;
  const jcfs = localStorage.getItem('jcfs') ==null ?'x':localStorage.getItem('jcfs');
  const isBackLocal = history?.location.query?.isBack ;
  const jcfsLocal = history?.location.query?.jcfs;
  let msg: any = '系统异常，请联系管理员'
  let y = style.error300;
  if (status == '0') {
    msg = '无访问权限';
  } else if (status == '300') {
    msg = '登录失效，请重新登录';
    y = style.error300;
  } else if (status == '401') {
    msg = '无访问权限';
    y = style.error401;
  } else if (status == '403') {
    msg = '访问失效，请刷新后重试';
    // y = style.error403;
  } else if (status == '404') {
    msg = '功能完善中';
    y = style.error404;
  } else if (status == '408') {
    msg = '等待超时，请刷新后重试';
    y = style.error408;
  } else if (status == '500') {
    msg = '服务出现异常，请联系客服人员';
    y = style.error500;
  } else {
    msg = '系统异常，请联系管理员'
    y = style.error300;
  }
  msg = history?.location.query?.ERR == undefined || history?.location.query?.ERR == "" ? msg : history?.location.query?.ERR

  return (
   <div className={style.bgPage}>
    <div className={y}></div>
    <div className={style.bgPageText}>{msg}</div>
    {isBackLocal === 'Y' ? <></> : jcfs == 'menu_ym' || jcfs == 'menu_cd' || jcfsLocal =='menu_cd' || jcfsLocal == 'menu_ym' ? <></> :
     <Button className={style.bgPageBtn} onClick={() => history.push('/user/login')}>返回</Button>
    
    }
   
   </div>
  )
};

export default Index;
