/**
 * title: 集成桥页（目前用于错误展示）
 * author: wx
 */
import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { Empty, Spin } from 'antd';
import './style.less';

const iframeIntegration: React.FC<unknown> = () => {

  const [description, setDescription] = useState('');

  useEffect(() => {
    const param = history?.location?.query; 
    if (param) {
      if (param?.ERR) {
        const errMsg: any = param.ERR;
        setDescription(errMsg);
      } else {
        setDescription('jcfs参数错误!'); 
      }
    }
  }, []);

  return <div className='iframe_integration_error'>
    { description ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={description} /> :  <Spin tip="Loading..." /> }
  </div>;
};

export default iframeIntegration;