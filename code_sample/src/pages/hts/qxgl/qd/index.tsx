import React, {useRef,} from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import unitConfig from './config';
import Func from './f';
import Glcd from './glcd';
import Add from './add';
import Glqxz from './glqxz';
import {useAccess} from 'umi';
import qxUtil from '@/pages/common/qxUtil';
import {cloneDeep} from 'lodash';


const Index: React.FC = () => {


  const qdConfig = cloneDeep(unitConfig);
  const qdFunc = {...Func};


  const addRef: any = useRef();
  const glqxzRef: any = useRef();
  const glcdRef: any = useRef();
  const access = useAccess(); // 权限

  Func.access = access;

  const paramPtgly = {
    accessObj: access,
  }

  qdFunc.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(addRef);
    otherRef.push(glqxzRef);
    otherRef.push(glcdRef);
    return otherRef;
  };

  let yhlx = qxUtil.getYhlx(paramPtgly);
  // 配置项：列表列

  // 平台管理员
  if (yhlx == '09') {
    qdConfig.grid_columns.push({ title: '有效标志', dataIndex: 'yxbz', width: 80, render: { func: 'renderYxbz2' }, align: 'center', fixed: 'right'});
  } else if (yhlx == '13') {// 运营管理员
    // 运营管理员只提供修改按钮，且只能修改授权方式相关选项
    qdConfig.costomer_toobar = qdConfig.costomer_toobar.filter((item: { key: string; }) => 'editqxzxgqd'.includes(item.key));
  }

  return (
    <>
      <DDBunit2 config={qdConfig} func={qdFunc} />
      <Add onRef={addRef} yhlx={yhlx}/>
      <Glqxz onRef={glqxzRef} />
      <Glcd onRef={glcdRef} />
    </>

  );
}

export default Index;
