import React, { useEffect, useRef, useState } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import Func from './f';
import myUtil from '@/components/DDAssist/util';
import ModalSelMonth from '../kqgl/modal_sel_month';
import DDImportNodeEnv from '@/components/DDImportNodeEnv';

const Unit2: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = useState<any>({});

  useEffect(() => {
    let beforeSetConfig = (cc: any) => {
      let tmpToolbar = cc.customer_toolbar;
      let tmpToolbarNew: any = [];
      let tmpToolbarNewGropu1: any = [];
      let tmpToolbarNewGropu2: any = [];
      tmpToolbar.forEach((item: any) => {
        if (item.name === '导入提成' || item.name === '导入社保基数' || item.name === '导入专项扣除') {
          tmpToolbarNewGropu1.push(item);
        } else if (item.name === '导入历史工资' || item.name === '导入历史社保公积金') {
          tmpToolbarNewGropu2.push(item);
        } else {
          tmpToolbarNew.push(item);
        }
      })
      tmpToolbarNew.splice(1, 0, {name: '导入工资核算数据', type: 'dropdown', list: tmpToolbarNewGropu1});
      tmpToolbarNew.splice(4, 0, {name: '导入历史数据', type: 'dropdown', list: tmpToolbarNewGropu2});
      cc.customer_toolbar = tmpToolbarNew;
    }
    let extendConfig: any = { grid_scroll_x: '2700px' };
    myUtil.module.initAutomaticPageDef({ module_key: 'nbgl_gzgl_xzscglb', setMyConfig, extendConfig, beforeSetConfig });
  }, []);

  // 添加私有页面或组件
  const modal1Ref: any = useRef();
  const modal2Ref: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(modal1Ref);
    otherRef.push(modal2Ref);
    return otherRef;
  };

  // 导入提成/专项扣除/社保
  const doSubmit = (param: any) => {
    Func.importXzscglb(param);
  }

  return <>
    <DDBunit2 config={myConfig} func={Func} />
    <ModalSelMonth onRef={modal1Ref} />
    <DDImportNodeEnv onRef={modal2Ref} showRules={false} doSubmit={(param: any) => doSubmit(param)} />
  </>;
};

export default Unit2;