/**
 * title: 出口企业申请提醒服务
 */
import React, { useEffect, useImperativeHandle, useState } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config from './auto_config';
import Func from './f'
const index: React.FC<unknown> = () => {


  const myConfig = { ...config };

  //需要动态改变form表单

// 表单项
myConfig.form_items = [
	{ label: 'ID', name: 'uuid', type: 'Hidden' },
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
	{ label: '申请日期', name: 'tbrq1', type: 'DatePicker', format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }, { func: 'tbrq01' }]},
	{ label: '退税业务提醒信息', name: 'tsywtxxx', type: 'GroupTitle' },
	{ label: '登记人员姓名', name: 'djryxm', type: 'Input', rules: [{ type: 'base_string', range: [0, 30]}, { func: 'djryxm01' }]},
	{ label: '登记人员职务', name: 'zw', type: 'Input', rules: [{ type: 'base_string', range: [0, 30]}, { func: 'zw01' }]},
	{ label: '登记人员手机号码', name: 'lxdh', type: 'Input', rules: [{ type: 'base_string', range: [0, 16]}, { type: 'base_type_phone' }, { func: 'lxdh01' }]},
	{ label: '登记人员电子邮件', name: 'yx', type: 'Input', rules: [{ type: 'base_string', range: [0, 30]}, { type: 'base_type_mail' }, { func: 'yx01' }]},
	{ label: '登记人姓名2', name: 'djryxm2', type: 'Input', rules: [{ type: 'base_string', range: [0, 30]}]},
	{ label: '职务2', name: 'zw2', type: 'Input', rules: [{ type: 'base_string', range: [0, 12]}]},
	{ label: '手机号码2', name: 'lxdh2', type: 'Input', rules: [{ type: 'base_string', range: [0, 16]}, { type: 'base_type_phone' }]},
	{ label: '电子邮件2', name: 'yx2', type: 'Input', rules: [{ type: 'base_string', range: [0, 30]}, { type: 'base_type_mail' }]},
	{ label: '是否申请退税提醒服务', name: 'sqtstxfwbz', type: 'Select', 'allowClear': true, codeTable: 'code_static_yes_no:01', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 1]}], eventOnChange: 'sqtstxfwbz' },
	{ label: '申请提醒内容', name: 'sqtxnr', type: 'Select', showType: '4', 'showSearch': true, 'mode': 'multiple', eventOnChange: 'sqtxnr', 'allowClear': true, codeTable: 'code_cs_ckts_sqtxnr:01', rules: [{ func: 'sqtxnr01' }]},
	{ label: '填表人', name: 'tbrxm1', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 100]}]},
	{ label: '填表人身份证件类型', name: 'sfzjlxDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: 'code_dm_gy_sfzjlx:01', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 3]}],},
	{ label: '填表人身份证件号码', name: 'sfzjhm', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 30]}]},
];
  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>
};
export default index;