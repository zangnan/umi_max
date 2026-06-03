/**
 * title: 外贸企业出口退税进货明细申报表
 * author: wx
 */
import React, { useRef } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './auto_config';
import Func from './f';
import Jhmx from '@/pages/hts/commonModule/jhmx/jhmx';
import Tszbcs from '@/pages/hts/commonModule/tszbcs/tszbcs';
import ByblzzmcjMoadl from '@/pages/hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TSSB_GCB/byblzzmcj/scmx';



const index: React.FC<unknown> = () => {

  const jhmxRef: any = useRef(); // 生成进货明细
  const tszbcsRef: any = useRef(); // 退税指标测算
  const byblzzmcjRef: any = useRef(); // 不予办理转证明采集


  const myConfig = { ...config };

  myConfig.batch_update_url = `${API_URL_BASE}/yw/bszx/mts/hwlw/tsjh/tsjhPlgxSbmxsj`;
  myConfig.form_api_save = `${API_URL_BASE}/yw/bszx/mts/hwlw/tsjh/updateHwlwTsjh`; // api 表单更新
  myConfig.form_api_save_upload=`${API_URL_BASE}/yw/bszx/mts/hwlw/tsjh/updateHwlwTsjh`; // api 表单更新
  myConfig.form_api_delete = `${API_URL_BASE}/yw/bszx/mts/hwlw/tsjh/deleteHwlwTsjh`; // api 表单删除
  // 表单项-关联号（下拉和手动录入都可以）-将Select替换为AutoComplete控件，并把onChange替换为blur
  myConfig.form_items[5] = { label: '关联号', name: 'glh', type: 'AutoComplete', showType: '2', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_string', range: [0, 17]}, { func: 'glh01' }, { func: 'glh02' }], eventOnChange: 'glh' },
  myConfig.batch_update_items = [
    { dataIndex: 'ssq', label: '申报年月', type: "Input" },
    { dataIndex: 'sbpc', label: '申报批次', type: "Input" },
    { dataIndex: 'bz', label: '备注', type: "Input", rules: [{ type: 'base_string', range: [0, 200]}] },
  ];

  // 配置项：自定义工具栏
  myConfig.costomer_toobar = [
    { name: '关联号重排', key: 'glhcp', func: 'glhcp' },
    { name: '退税指标测算', key: 'tszbcs', func: 'tszbcs' },
    // { name: '生成进货明细', key: 'scjhmx', func: 'jhmx' },
  ];

  myConfig.costomer_toobar_tj = [ { name: '不予办理转明细采集', key: 'byblzzmcj', func: 'byblzzmcj' },];

  myConfig.grid_columns_tj.forEach((item: any) => {
    if(item.dataIndex === 'bytsbz') {
      item.filter={
        type: 'Select',
        codeTable: ['code_static_yes_no', '01'],
      }
    }
    if(item.dataIndex === 'byblbz') {
      item.filter={
        type: 'Select',
        codeTable: ['code_static_yes_no', '01'],
      }
    }
    if(item.dataIndex === 'zbblbz') {
      item.filter={
        type: 'Select',
        codeTable: ['code_static_yes_no', '01'],
      }
    }
  })

  // 导入
  myConfig.import_key = 'SAAS_TSSB_MXCJ_TSJH_DR';

  myConfig.toolbar_default.tssb_download = true;
  myConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出
  myConfig.toolbar_default.ckts_download = false;

  myConfig.toolbar_default.batchEdit = true;

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(jhmxRef);  // 报关单生成明细
    otherRef.push(tszbcsRef);
    otherRef.push(byblzzmcjRef);
    return otherRef;
  };

  return <>
    <DDBunit2 config={myConfig} func={Func} />
    <Jhmx onRef={jhmxRef} />
    <Tszbcs onRef={tszbcsRef} />
    <ByblzzmcjMoadl onRef={byblzzmcjRef} />
  </>
};
export default index;
