// 进项发票管理-已使用数据
import React, {useRef}  from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from '../ksysj/ksyConfig';
import Func from '../ksysj/ksyFunc';
import Fpmx from '../ksysj/fpmx';
import {useAccess } from 'umi';
import qxUtil from '@/pages/common/qxUtil';
import { cloneDeep } from 'lodash';

const Index: React.FC = () => {
  const access = useAccess();

  const zyParam = {
    zycode: '',
    accessObj: access,
  }

  const myConfig = cloneDeep(config);

  if (qxUtil.getZy(zyParam)) {
    // 配置项：自定义工具栏
    myConfig.costomer_toobar = [];
  }

  myConfig.costomer_toobar.push(
    {
      name: '申报情况更新',
      key: 'xhsjzrsbqkgx',
      func: 'btnSbqkgx'
    },
    {
    name: '批量修改',
    type: 'dropdown',
    key: 'jxfpplxg',
    list: [
      { name: '是否退税', func: 'btnSetSfts' },
      { name: '业务编号', func: 'btnSetYwbh' },
      { name: '标签', func: 'btnSetBq' },
    ],
  });

  // 配置列表列
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'cxlx', value: '1', op: 'zdy' },
      { property: 'cdType', value: 'MTS', op: 'zdy' },
    ]
  }

  const mtsPdRef: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(mtsPdRef);
    return otherRef;
  };

  return (
    <div>
      <DDBunit2 config={myConfig} func={Func} />
      <Fpmx onRef={mtsPdRef} />
    </div>
  );
}

export default Index;
