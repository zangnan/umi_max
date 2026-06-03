/**
 * title: 出口货物收汇情况表
 * author: wx
 */
import React from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './auto_config';
import Func from './f'
import { cloneDeep } from 'lodash';


export type HwcjProps = {
  closeHwcj: any;
  getKey:any
}

const index: React.FC<HwcjProps> = ({
  closeHwcj,
  getKey,
}) => {

  const myConfig = cloneDeep(config);
  // 关闭新增、修改、删除
  myConfig.toolbar_default.add = false;
  myConfig.toolbar_default.edit = false;
  myConfig.toolbar_default.delete = false;
  myConfig.grid_handle_columns_default.edit = false;
  myConfig.grid_handle_columns_default.delete = false;
  myConfig.layout_type = 'modal'


  // 配置项：自定义工具栏
  myConfig.costomer_toobar = [
    { name: '冲减出口', key: 'cjck', func: 'cjck' },
    { name: '台账筛选', key: '3', func: 'importTzsx' },
  ];

  if(getKey) {
    myConfig.unit_key = getKey; // 业务单元key,对应后端接口
  }

  Func.closeHwcj = closeHwcj;
  
  if(getKey){
    myConfig.unit_key = getKey; // 业务单元key，对应后端接口
  }
  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>
};
export default index;