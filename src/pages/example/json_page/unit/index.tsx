import React, { useRef } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import unitConfig from './config';
import Func from './f';
import { history } from 'umi';
import DrawerList from './drawer_list';
import DDImportNodeEnv from '@/components/DDImportNodeEnv';
import myUtil from '@/components/DDAssist/util';

const Unit: React.FC<unknown> = () => {
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
  const ModalRef: any = useRef();
  const ModalRef3: any = useRef();
  const ModalRef4: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(drawerRef);
    otherRef.push(ModalRef);
    otherRef.push(ModalRef3);
    otherRef.push(ModalRef4);
    return otherRef;
  };

  // 创建表
  const createTables = (param: any) => {
    param.form.validateFields().then(() => {
      let createTableData1: any = param.data[0].jsonData || [];
      let createTableData2: any = param.data[1].jsonData || [];
      myUtil.mysql.createTable([...createTableData1, ...createTableData2]);
    })
  }

  // 初始化数据
  const initDbData = (param: any) => {
    param.form.validateFields().then(() => {
      let initDataOrigin: any = param.data || [];
      let inintData: any = [];
      initDataOrigin.forEach((data: any) => {
        let tmpJsonData = data?.jsonData || [];
        let tmpSheetName = data?.sheetName;
        inintData.push({ tableName: tmpSheetName, data: tmpJsonData });
      });
      myUtil.mysql.initTableData(inintData);
    })
  }

  return <>
    <DDBunit2 config={myConfig} func={Func} />
    <DrawerList onRef={drawerRef} />
    <DDImportNodeEnv onRef={ModalRef} />
    {/* 导入弹窗 创建表 */}
    <DDImportNodeEnv onRef={ModalRef3} showRules={false} doSubmit={(param: any) => createTables(param)} />
    {/* 导入弹窗 初始化数据 */}
    <DDImportNodeEnv onRef={ModalRef4} showRules={false} doSubmit={(param: any) => initDbData(param)} />
  </>;
};
export default Unit;