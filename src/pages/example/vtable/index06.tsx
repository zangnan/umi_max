import React, { useState, useRef, useEffect } from 'react';
import DDListTable from '@/components/DDVTable/DDListTable';
import config from './index06Config';
import func from './index06Func';
import { FooterToolbar } from '@ant-design/pro-components';
import { Button } from 'antd';
import { cloneDeep } from 'lodash';

const TableList: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = useState<any>(config);
  const ref: any = useRef();
  useEffect(() => {
  }, []);

  // 保存
  const saveRecord = () => {
    let records = ref?.current.getRecords();
    console.info(records);
  }

  // 变更配置
  const changeConfig = () => {
    let cc = cloneDeep(myConfig);
    cc?.columns?.splice(0, 1); // 第一个参数是要删除的元素索引，第二个参数是要删除的元素个数
    setMyConfig(cc);
  }

  return (<>
    <DDListTable config={myConfig} func={func} refDDListTable={ref}/>
    <FooterToolbar >
      <Button type='primary' onClick={saveRecord}>保存</Button>
      <Button type='primary' onClick={changeConfig}>变更配置</Button>
    </FooterToolbar>
  </>);
};

export default TableList;
