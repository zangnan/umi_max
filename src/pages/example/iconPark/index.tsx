import React from 'react';
import {CheckOne, Home, Exchange} from '@icon-park/react';
import '@icon-park/react/styles/index.less';
import { Space } from 'antd';

const Report01: React.FC<unknown> = () => {

  // theme: 'outline' | 'filled' | 'two-tone' | 'multi-color'  default:'outline'
  // size: number | string
  // spin: default: false
  // strokeLinecap: 'butt' | 'round' | 'square'  default:'round'
  // strokeLinejoin: 'miter' | 'round' | 'bevel'  default:'round'
  // strokeWidth: number default:4

  return (
    <>
      https://iconpark.oceanengine.com/
      <Space>
        <Home theme="filled" size="32" fill="#000000"  />
        <CheckOne theme="filled" size="32" fill="#17bd08" />
        <Exchange theme="outline" size="24" fill="#333"/>
      </Space>
    </>
  );
};

export default Report01;
