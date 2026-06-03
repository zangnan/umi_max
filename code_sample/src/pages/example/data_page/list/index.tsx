/**
 * title: 数据封装页面：列表
 */
import React, { useRef } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import unitConfig from './config';
import Func from './f';
import { history } from 'umi';
import DrawerList from './drawer_list';

const Bgd: React.FC<unknown> = () => {
  // 改变默认配置项
  const myConfig = { ...unitConfig };
  if (history?.location?.pathname === '/example/data_page/list2') {
    myConfig.grid_columns = [
      { title: '报关单号', dataIndex: 'ckbgdh', width: 180 },
      { title: '海关商品名称', dataIndex: 'hgspmc', width: 180 },
      { title: '出口合同号', dataIndex: 'ckhth', width: 115 },
    ];
    myConfig.grid_title = '修改默认标题';
  }

  // 添加私有页面或组件
  const drawerRef: any = useRef();

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(drawerRef);
    return otherRef;
  };

  return <>
    <DDBunit2 config={myConfig} func={Func}  key='345123'/>
    <DrawerList onRef={drawerRef} />
  </>;
};

export default Bgd;