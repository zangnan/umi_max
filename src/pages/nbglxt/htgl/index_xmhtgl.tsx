import React, { useEffect, useState } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import Func from './f';
import myUtil from '@/components/DDAssist/util';
import { automaticPageDef } from '@/services/hts/api';
import assembleConfigUtil from '@/components/DDBunit/assemble_config_util';

const Unit2: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = useState<any>({});

  useEffect(() => {
    myUtil.code.updateCodeTableByKeys(['code_dm_def_project_contract']);
    automaticPageDef('nbgl_xmgl_xmhtjdxxb').then((res: any) => {
      if (res.code === '200') {
        let tmpConfig = assembleConfigUtil.module.assembleAll({
          moduleInfo: res.body.moduleInfo,
          appTableDict: res.body.appTableDict,
        });
        let form_items = tmpConfig?.form_items || [];
        let grid_columns = tmpConfig?.grid_columns || [];
        let beforeSetConfig = (cc: any) => {
          cc.form_items.push({ label: '项目合同阶段信息', name: 'xmhtjdxx', type: 'List', children: form_items, grid_columns, addLineText: '增加阶段信息' },)
        }
        myUtil.module.initAutomaticPageDef({ module_key: 'nbgl_xmgl_xmhtxxb', setMyConfig, beforeSetConfig });
      }
    })
  }, []);

  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>;
};

export default Unit2;