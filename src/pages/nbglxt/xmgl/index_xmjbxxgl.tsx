import React, { useEffect, useRef, useState } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import { itemType } from '@/components/DDForm/data.d';
import CONSTANTS from '@/components/DDAssist/constants';
import Func from './f';
import myUtil from '@/components/DDAssist/util';
import ModalXmjbxx from './modal_xmjbxx';
import { set } from 'lodash';
import DDImportNodeEnv from '@/components/DDImportNodeEnv';
import { automaticPageDef } from '@/services/hts/api';
import assembleConfigUtil from '@/components/DDBunit/assemble_config_util';

const Unit2: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = useState<any>({});

  useEffect(() => {
    let extendConfig: any = {
      grid_scroll_x: '2700px',
      gridParams: {
        initSearchModal: [
          { property: 'nbglYxbj', value: '1', op: CONSTANTS.FILTER_CONDITION.equal.condetionCode, type: '1', },
        ]
      }
    };
    // let beforeSetConfig = (cc: any) => {
    //   let tmpCol = cc.grid_columns.find((tmp: any) => { return tmp.title === '变更信息' }) || {};
    //   let tmpColArr2 = tmpCol?.render?.config.grid_columns || [];
    //   let tmpColArr21 = tmpColArr2.find((tmp: any) => { return tmp.dataIndex === 'nbglDqjzxm' }) || {}; // 名称
    //   let tmpColArr23 = tmpColArr2.find((tmp: any) => { return tmp.dataIndex === 'nbglBgqrbj' }) || {}; // 确认标识
    //   tmpColArr21.hidden = true;
    //   tmpColArr23.hidden = true;
    //   let tmpFilterArr2 = tmpCol?.render?.config.filter_items || [];

    //   set(tmpCol, ['render', 'config', 'filter_items'], [ tmpFilterArr2[2] ]);
    //   // tmpCol.render.config.filter_items = [ tmpFilterArr2[2] ];
    //   // 列表查询时不显示变更项
    //   let gridColumns = cc.grid_columns;
    //   let fieldsHidden1 = ['nbglBgys', 'nbglBgly', 'nbglBgyy', 'nbglBgfqr', 'nbglBgspr', 'nbglBz', 'nbglBgsj', 'nbglYxbj'];
    //   gridColumns.forEach((item: any) => {
    //     if (fieldsHidden1.indexOf(item?.dataIndex) > -1) {
    //       item.hidden = true;
    //     }
    //   })
    //   cc.form_items.unshift({ label: '合同信息', name: 'xmhtxx', type: 'List', children: [
    //     { label: '合同名称', type: 'Select', name: 'nbgl_contract_id', codeTable: 'code_dm_def_contract' },
    //     { label: '合同金额（万）', name: 'nbgl_htje', type: 'InputNumber', format: '0,0.00', disabled: true },
    //     { label: '合同金额不含税（万）', name: 'nbgl_htje_bhs', type: 'InputNumber', format: '0,0.00', disabled: true },
    //     { label: '合同状态', name: 'nbgl_htzt', type: 'Select', codeTable: 'code_dm_pm_htzt', disabled: true },
    //     { label: '客户名称', type: 'Input', name: 'nbgl_khmc', disabled: true },
    //     { label: '合同有效期', type: 'InputNumber', format: '0,0', name: 'nbgl_htyxq', disabled: true },
    //   ] },)
    // }
    automaticPageDef('nbgl_xmgl_xmhtxxb').then((res: any) => {
      if (res.code === '200') {
        let tmpConfig = assembleConfigUtil.module.assembleAll({
          moduleInfo: res.body.moduleInfo,
          appTableDict: res.body.appTableDict,
        });
        let form_items_htxx = tmpConfig?.form_items || [];
        let grid_columns_htxx = tmpConfig?.grid_columns || [];
        let beforeSetConfig = (cc: any) => {
          let tmpCol = cc.grid_columns.find((tmp: any) => { return tmp.title === '变更信息' }) || {};
          let tmpColArr2 = tmpCol?.render?.config.grid_columns || [];
          let tmpColArr21 = tmpColArr2.find((tmp: any) => { return tmp.dataIndex === 'nbglDqjzxm' }) || {}; // 名称
          let tmpColArr23 = tmpColArr2.find((tmp: any) => { return tmp.dataIndex === 'nbglBgqrbj' }) || {}; // 确认标识
          tmpColArr21.hidden = true;
          tmpColArr23.hidden = true;
          let tmpFilterArr2 = tmpCol?.render?.config.filter_items || [];
          set(tmpCol, ['render', 'config', 'filter_items'], [ tmpFilterArr2[2] ]);
          // 列表查询时不显示变更项
          let gridColumns = cc.grid_columns;
          let fieldsHidden1 = ['nbglBgys', 'nbglBgly', 'nbglBgyy', 'nbglBgfqr', 'nbglBgspr', 'nbglBz', 'nbglBgsj', 'nbglYxbj'];
          gridColumns.forEach((item: any) => {
            if (fieldsHidden1.indexOf(item?.dataIndex) > -1) {
              item.hidden = true;
            }
          })
          let indexNex = cc.form_items.findIndex((tmp: any) => { return tmp.label === '合同信息'; });
          form_items_htxx.map((tmp: any) => {
            if (tmp.label === '合同名称') {
              // tmp.type = 'Select';
              // tmp.codeTable = 'code_dm_def_contract';
              tmp.type = 'Cascader';
              tmp.treeTable = 'code_dm_def_contract_jd2';
              tmp.eventOnChange = 'changeContract2';
              tmp.name = 'nbglContractId';
            } else if (tmp.name === 'nbglQdrq' || tmp.name === 'nbglHtjeBhs') { // 签订日期 合同金额不含税
              tmp.type = itemType.Hidden;
            } else {
              tmp.disabled = true;
            }
            tmp.rules = [];
          });
          // console.info(form_items_htxx);
          // debugger;
          // form_items_htxx.push({ label: '合同阶段', type: 'Select', name: 'nbglContractJdId', codeTable: 'code_dm_def_contract_jd', eventOnChange: 'changeJd' });
          cc.form_items.splice(indexNex + 1, 0, { label: '合同信息', name: 'xmhtxx', type: 'List', children: form_items_htxx, grid_columns: grid_columns_htxx, addLineText: '增加合同' });
        }
        myUtil.module.initAutomaticPageDef({ module_key: 'nbgl_xmgl_xmjbxxb', setMyConfig, extendConfig, beforeSetConfig });
      }
    })
  }, []);

    // 表单事件：OnChange
    // Func.eventOnChange = {
    // }

  // 添加私有页面或组件
  const modal1Ref: any = useRef();
  const modal2Ref: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(modal1Ref);
    otherRef.push(modal2Ref);
    return otherRef;
  };

  // 导入项目基本信息
  const doSubmit = (param: any) => {
    Func.importXmgl(param, 2);
  }

  return <>
    <DDBunit2 config={myConfig} func={Func} />
    <ModalXmjbxx onRef={modal1Ref} />
    <DDImportNodeEnv onRef={modal2Ref} showRules={false} doSubmit={(param: any) => doSubmit(param)} />
  </>;
};

export default Unit2;