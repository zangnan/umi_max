/**
 * title: 外贸企业出口退税出口明细申报表录入 ZXSB_SB_MTS_TSSB_GCB
 * author: wx
 */
import React, { useEffect, useRef } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config from './auto_config';
import Func from './f'
import BgdscMx from '@/pages/hts/commonModule/scmx/scmx';
import myUtil from '@/components/DDAssist/util';
import Tszbcs from '@/pages/hts/commonModule/tszbcs/tszbcs';
import { message,} from 'antd';
import ByblzzmcjMoadl from './byblzzmcj/scmx';
import {delTzsx} from "@/pages/hts/services/htsApi";
import ErrorMsg from './errormsg';

const index: React.FC<unknown> = () => {

  const bgdScmxRef: any = useRef(); // 报关单生成明细
  const tszbcsRef: any = useRef(); // 退税指标测算
  const byblzzmcjRef: any = useRef(); // 不予办理转证明采集
  // 导入错误信息页面
  const ErrorMsgRef: any = useRef();

  useEffect( () => {
    // 台账筛选
    delTzsx({ cdDm: '26030101' }).then(() => { });
    Promise.all([myUtil.code.getCodeFromServerT1('code_dm_ckts_cktmsywlx:04')]).then(() => {
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      myUtil.code.getCode('code_dm_ckts_cktmsywlx:04');
    });
  }, []);


  const myConfig = { ...config };



  myConfig.batch_update_url = `/yw/bszx/mts/hwlw/tssb/mtsPlgxSbmxsj`;
  myConfig.api_form_edit = `/yw/bszx/mts/hwlw/tssb/updateHwlwTssb`; // api 表单更新
  myConfig.form_api_save_upload= `/yw/bszx/mts/hwlw/tssb/updateHwlwTssb`; // api 表单更新
  myConfig.api_form_delete = `/yw/bszx/mts/hwlw/tssb/deleteHwlwTssb`; // api 表单删除
  myConfig.batch_update_items = [
    { dataIndex: 'ssq', label: '申报年月', type: "Input" },
    { dataIndex: 'sbpc', label: '申报批次', type: "Input" },
    { dataIndex: 'ckfph', label: '出口发票号', type: "Input", rules: [{ type: 'base_string', range: [0, 30]}] },
    { dataIndex: 'ckrq1', label: '出口日期', type: "Date" },
    { dataIndex: 'cktmsywlxdmjh', label: '业务类型代码', type: "tableSelect", codeTable: 'code_dm_ckts_cktmsywlx:10' },
    { dataIndex: 'bz', label: '备注', type: "Input", rules: [{ type: 'base_string', range: [0, 200]}] },
  ];
  myConfig.form_items[3].eventOnBlur = 'sbpc'

  // 配置项：自定义工具栏
  myConfig.customer_toolbar = [
    { name: '台账筛选', key: '3', func: 'importTzsx' },
    { name: '关联号重排', key: 'glhcp', func: 'glhcp' },
    { name: '退税指标测算', key: 'tszbcs', func: 'tszbcs' },
    { name: '导入修改', key: 'importUpdate', func: 'importUpdate' },
    // { name: '报关单生成明细', key: 'bgdscmx', func: 'bgdscmx' },
  ];
  myConfig.customer_toolbar_tj = [ { name: '不予办理转明细采集', key: 'byblzzmcj', func: 'byblzzmcj' },];

  myConfig.grid_columns_tj.forEach((item: any) => {
    if(item.dataIndex === 'bytsbz') {
      item.filter={
        type: 'Select',
        codeTable: 'code_static_yes_no:01',
      }
    }
    if(item.dataIndex === 'byblbz') {
      item.filter={
        type: 'Select',
        codeTable: 'code_static_yes_no:01',
      }
    }
    if(item.dataIndex === 'zbblbz') {
      item.filter={
        type: 'Select',
        codeTable: 'code_static_yes_no:01',
      }
    }
  })

  // // 导入
  myConfig.import_key = 'SAAS_TSSB_MXCJ_CKMX_DR';

  myConfig.toolbar_default.tssb_download = true;
  myConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出
  myConfig.toolbar_default.ckts_download = false;
  myConfig.toolbar_default.batchEdit = true;

  // update by shilei 退税申报-查看明细 后 采集中此页面查不到数据
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'cdDm', value: "26030101", op: 'zdy' },
    ]
  }

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(bgdScmxRef);  // 报关单生成明细
    otherRef.push(tszbcsRef);
    otherRef.push(byblzzmcjRef);
    otherRef.push(ErrorMsgRef);
    return otherRef;
  };

  return <>
    <DDBunit2 config={myConfig} func={Func} />
    <BgdscMx onRef={bgdScmxRef} />
    <Tszbcs onRef={tszbcsRef} />
    <ByblzzmcjMoadl onRef={byblzzmcjRef} />
    <ErrorMsg onRef={ErrorMsgRef} />
  </>
};
export default index;
