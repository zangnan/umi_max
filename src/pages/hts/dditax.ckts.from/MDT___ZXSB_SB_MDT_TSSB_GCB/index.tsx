/**
 * title: 生产企业出口货物劳务免抵退税申报明细表
 * author: wx
 */
import React, {useEffect, useRef} from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import config from './auto_config';
import Func from './f';
import BgdscMx from '@/pages/hts/commonModule/scmx/scmx';
import Hwcj from '@/pages/hts/commonModule/hwcj/hwcj';
import Tszbcs from '@/pages/hts/commonModule/tszbcs/tszbcs_sc';
import { delTzsx } from '@/pages/hts/services/htsApi';
import ErrorMsg from './errormsg';
import Hwccj from './hwccjModal';

const index: React.FC<unknown> = () => {

  const scmxRef: any = useRef();    // 生成明细
  const hwcjRef: any = useRef();    // 货物冲减
  const tszbcsRef: any = useRef(); // 退税指标测算
  const hwccjRef: any = useRef();    // 海外仓冲减
  // 导入错误信息页面
  const ErrorMsgRef: any = useRef();

  useEffect(() => {
    // 台账筛选
    delTzsx({cdDm: '25030101'}).then(() => {
    });
    delTzsx({cdDm: '020999'}).then(() => {
    });
  }, []);

  const myConfig = {...config};

  myConfig.api_form_edit = `/yw/bszx/mdt/hwlw/tssb/updateHwlwTssb`; // api 表单更新
  myConfig.form_api_save_upload = `/yw/bszx/mdt/hwlw/tssb/updateHwlwTssb`; // api 表单更新
  myConfig.api_form_delete = `/yw/bszx/mdt/hwlw/tssb/deleteHwlwTssb`; // api 表单删除
  // 开启批量修改
  myConfig.toolbar_default.batchEdit = true;

  // 导入
  myConfig.import_key = 'SAAS_TSSB_MXCJ_CKHWLW_DR';

  // 开启导出
  myConfig.toolbar_default.ckts_download = false;
  myConfig.toolbar_default.tssb_download = true;
  myConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出

  myConfig.batch_update_url = `${API_URL_BASE}/yw/bszx/mdt/hwlw/tssb/mdtPlgxSbmxsj`;

  // 配置项：自定义工具栏
  myConfig.costomer_toobar = [
    {name: '台账筛选', key: '3', func: 'importTzsx'},
    /*{name: '货物冲减', key: 'glhcp', func: 'hwcj'},*/
    {
      name: '红字冲减',
      type: 'dropdown',
      list: [
        {name: '明细冲减', key: 'mxcj', func: 'hwcj'},
        {name: '海外仓冲减', key: 'hwccj', func: 'hwccj'},
      ],
    },
    {name: '退税指标测算', key: 'tszbcs', func: 'tszbcs'},
    {name: '导入修改', key: 'importUpdate', func: 'importUpdate'},
    // { name: '报关单生成明细', key: 'bgdscmx', func: 'bgdscmx' },
  ];

  // 补充悬浮
  const dataIndex = ['cktmsywlxdmjh'];
  myConfig.grid_columns.forEach((item: any) => {
    if (dataIndex.length > 0 && dataIndex.indexOf(item.dataIndex) > -1) {
      item.ellipsis = true;
    }
    if (item.dataIndex === 'dlckhwzmhm') {
      item.width = 180;
    }
  })
  myConfig.grid_columns_tj.forEach((item: any) => {
    if (dataIndex.length > 0 && dataIndex.indexOf(item.dataIndex) > -1) {
      item.ellipsis = true;
    }
    if (item.dataIndex === 'dlckhwzmhm') {
      item.width = 180;
    }
  })

  myConfig.form_items.forEach((item: any) => {
    if (item.name === 'cjhbzmDm') {
      item.eventOnChange = 'hbhlDm'
    }
    // 添加校验
    if (item.name === 'cjzj' || item.name === 'rmblaj') {
      item.rules = [{type: 'base_required'}, {type: 'base_number', length: 14, decimal: 2}, {type: 'base_number', range: '+-'}, {func: 'ywlxHzcjSzjy01'}]
    }
  })

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(scmxRef);  // 生成明细
    otherRef.push(hwcjRef);  // 货物冲减
    otherRef.push(tszbcsRef);
    otherRef.push(ErrorMsgRef);
    otherRef.push(hwccjRef);
    return otherRef;
  };

  myConfig.batch_update_items = [
    {dataIndex: 'ssq', label: '所属期', type: "Input"},
    {dataIndex: 'cjhbhl', label: '原币汇率', type: "InputNumber", rules: [{type: 'base_number', length: 10, decimal: 5}], precision: 5},
    {dataIndex: 'myhl', label: '美元汇率', type: "InputNumber", rules: [{type: 'base_number', length: 10, decimal: 5}], precision: 5},
    {dataIndex: 'ckfph', label: '出口发票号', type: "Input", rules: [{type: 'base_string', range: [0, 30]}]},
    {dataIndex: 'ckrq', label: '出口日期', type: "Date"},
    {dataIndex: 'cktmsywlxdmjh', label: '业务类型代码', type: "tableSelect", codeTable: ['code_dm_ckts_cktmsywlx', '09']},
    {dataIndex: 'jljgszch', label: '进料加工手（账）册号', type: "Input", rules: [{type: 'base_string', range: [0, 20]}]},
    {dataIndex: 'bz', label: '备注', type: "Input", rules: [{type: 'base_string', range: [0, 200]}]},
    {dataIndex: 'tzhjhfpl', label: '更新计划分配率', type: "Input"},
  ];

  // update by shilei 退税申报-查看明细 后 采集中此页面查不到数据
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'cdDm', value: "25030101", op: 'zdy' },
    ]
  }

  return <>
    <DDBunit2 config={myConfig} func={Func}/>
    <BgdscMx onRef={scmxRef}/>
    <Hwcj onRef={hwcjRef}/>
    <Tszbcs onRef={tszbcsRef}/>
    <ErrorMsg onRef={ErrorMsgRef}/>
    <Hwccj onRef={hwccjRef}/>
  </>
};
export default index;
