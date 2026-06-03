/**
 * title: 出口退（免）税备案变更
 * author: wx
 */
import React, {useRef} from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './auto_config';
import Func from './f'
import DrawerList from './drawer_list';
import { history } from 'umi';

const index: React.FC<unknown> = () => {

  const myConfig = {...config}
  myConfig.costomer_toobar = [
    { name: '新建', key: 'add1', func: 'handleCostomerAdd' },
    { name: '修改', key: 'edit1', func: 'handleCostomerEdit' },
  ]
  if(history?.location?.pathname.indexOf('SBMXCX_0701010201') > -1) {
    myConfig.filter_items = [
      { name: 'bgzdmc', label: '变更事项', type: 'Select', 'allowClear': true, codeTable: ['code_dm_ckts_bgx',  '01'] },
    ]
  } else {
    myConfig.filter_items = [
      { name: 'bgzdmc', label: '变更事项', type: 'Select', 'allowClear': true, codeTable: ['code_dm_ckts_bgx',  '01'] },
      { name: 'tbrq1', label: '申请日期', type: 'DatePicker', range: true},    
    ]
  }

  // 配置项：工具栏
  myConfig.toolbar_default = {
    add: false, // 是否显示增加按钮，默认关闭
    edit: false, // 是否显示修改按钮，默认关闭
    delete: true, // 是否显示删除按钮，默认关闭
    setting: true, // 是否显示设置按钮，默认关闭
    reload: true, // 是否显示刷新按钮，默认关闭
    full: true, // 是否显示全屏按钮，默认关闭
    ckts_download: true, // 是否显示导出按钮，默认关闭
    upload: false,  // 是否显示导入按钮，默认关闭
    ckts_sum: false, // 是否显示小计按钮，默认关闭
    ckts_order: false, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
  };

  // 添加私有页面或组件
  const drawerRef: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(drawerRef);
    return otherRef;
  };

  return <>
    <DDBunit2 config={myConfig} func={Func} />
    <DrawerList onRef={drawerRef} />
  </>
};
export default index;