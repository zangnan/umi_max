/**
 * title: 备案单证-核查调阅-单证核查
 * author: mfc
 */
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import React from 'react';
import { useIntl } from 'umi';
import dzhcFunc from './f';
import config from "./config";
import { history } from 'umi';
import myUtil from '@/pages/common/myUtil';

export type ActionType = {
  reload: () => void;
}

export type ScsbsjProps = {
  ywKey?: any;
}

const Index: React.FC<ScsbsjProps> = ({
  ywKey = 'MDT',
}) => {
  const myConfig = { ...config }
  // 区分生产外贸
  const qylx = myUtil.sys.enterpriseType();
  // 取企业类型，生产SC， 外贸WM
  if (qylx === 'WM') {
    myConfig.grid_columns[1].codeTable = ['CODE_WM_CS_ZXSB_LCSWSX', '01'];
    myConfig.grid_columns[1].filter = { type: 'Radio', codeTable: ['CODE_WM_CS_ZXSB_LCSWSX', '01'] };
    myConfig.grid_columns[6].hidden = false;
    myConfig.grid_columns[2].hidden = true;
    myConfig.grid_columns[3].hidden = false;
    myConfig.filter_items = [
      { name: 'rwbh', label: '任务编号', type: 'Input' },
      { name: 'ssq', label: '所属期', type: 'Input' },
      { name: 'sbpc', label: '批次', type: 'Input' },
      { name: 'bgdhgbh', label: '出口报关单号/代理出口证明号', type: 'Input' },
    ];
  } else {
    myConfig.grid_columns[1].codeTable = ['CODE_SC_CS_ZXSB_LCSWSX', '01'];
    myConfig.grid_columns[1].filter = {};
    myConfig.grid_columns[6].hidden = true;
    myConfig.grid_columns[2].hidden = false;
    myConfig.grid_columns[3].hidden = true;
    myConfig.filter_items = [
      { name: 'rwbh', label: '任务编号', type: 'Input' },
      { name: 'ssq', label: '所属期', type: 'Input' },
      { name: 'bgdhgbh', label: '出口报关单号/代理出口证明号', type: 'Input' },
    ];
  }
  const rwbh = history?.location?.query?.rwbh == undefined ? '' : history?.location?.query?.rwbh;
  myConfig.filter_items[0].defaultValue = rwbh;
  // const ssq = history?.location?.query?.ssq == undefined ? '' : history?.location?.query?.ssq;
  // myConfig.filter_items[1].defaultValue = ssq;

  myConfig.filter_items[0].allowClear = true;
  dzhcFunc.init = useIntl();


  return (
    <>
      <DDBunit2 config={myConfig} func={dzhcFunc} />
    </>
  );
};

export default Index;
