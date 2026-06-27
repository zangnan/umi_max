/**
 * title: 申报结果查询的免抵退核销表
 * creator: zxy
 */
import React, { useRef }  from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import mdthxConfig from './mdthxconfig';
import Func from './f';
import { history } from 'umi';
import ReportGrid from './reportGrid';
import { useIntl } from 'umi';


const Mdthx: React.FC<unknown> = () => {
  const myConfig = {...mdthxConfig};
  if (history?.location?.pathname.indexOf('CXTJ_') > 0) { // 数据管理进入
    if (history?.location?.pathname === '/02/0207/020708/CXTJ_02070802') {
      myConfig.unit_key = 'JLJG_ZXSB_SB_JLJG_MDTHX_F';
      myConfig.grid_filter_quick[0].defaultValue = 'JLJG_ZXSB_SB_JLJG_MDTHX_F';
      myConfig.grid_filter_quick[0].value = 'JLJG_ZXSB_SB_JLJG_MDTHX_F';
    } else if (history?.location?.pathname === '/02/0207/020708/CXTJ_02070803') {
      myConfig.unit_key = 'JLJG_ZXSB_SB_JLJG_MDTHX_J';
      myConfig.grid_filter_quick[0].defaultValue = 'JLJG_ZXSB_SB_JLJG_MDTHX_J';
      myConfig.grid_filter_quick[0].value = 'JLJG_ZXSB_SB_JLJG_MDTHX_J';
    } else {
      myConfig.unit_key = 'JLJG_ZXSB_SB_JLJG_MDTHX_J';
      myConfig.grid_filter_quick[0].defaultValue = 'JLJG_ZXSB_SB_JLJG_MDTHX_J';
      myConfig.grid_filter_quick[0].value = 'JLJG_ZXSB_SB_JLJG_MDTHX_J';
    }
    myConfig.layout_type = 'default';
    myConfig.grid_filter_quick = [
      { label: '所属期', name: 'ssq', type: 'Input', width: '2w' },
      { label: '申报批次', name: 'sbpc', type: 'Input', width: '2w' },
      { label: '申报核销手（账）册号', name: 'jljgszch', type: 'Input', width: '3w', searchButton: true },
    ];
  } else {
    if (history?.location?.pathname === '/hts/jljg/sbjgcxHmdthxF') {
      myConfig.unit_key = 'JLJG_ZXSB_SB_JLJG_MDTHX_F';
      myConfig.grid_filter_quick[0].defaultValue = 'JLJG_ZXSB_SB_JLJG_MDTHX_F';
      myConfig.grid_filter_quick[0].value = 'JLJG_ZXSB_SB_JLJG_MDTHX_F';
      myConfig.grid_filter_quick = [
        {
          label: '数据标识',
          name: 'sjbs',
          searchModelBz: false,
          searchFlag: false,
          type: 'Select',
          defaultValue: 'JLJG_ZXSB_SB_JLJG_MDTHX_F',
          onChange: 'mdthxSjbsOnChange',
          list: [
            { label: '已申报数据', value: 'JLJG_ZXSB_SB_JLJG_MDTHX_J' },
            { label: '已核销数据', value: 'JLJG_ZXSB_SB_JLJG_MDTHX_F' },
          ],
        },
        { label: '所属期', name: 'ssq', type: 'Input', width: '2w' },
        { label: '申报批次', name: 'sbpc', type: 'Input', width: '2w' },
        { label: '申报核销手（账）册号', name: 'jljgszch', type: 'Input', width: '3w', searchButton: true },
      ];
    } else if (history?.location?.pathname === '/hts/jljg/sbjgcxHmdthxJ') {
      myConfig.unit_key = 'JLJG_ZXSB_SB_JLJG_MDTHX_J';
      myConfig.grid_filter_quick[0].defaultValue = 'JLJG_ZXSB_SB_JLJG_MDTHX_J';
      myConfig.grid_filter_quick[0].value = 'JLJG_ZXSB_SB_JLJG_MDTHX_J';
      myConfig.grid_filter_quick = [
        {
          label: '数据标识',
          name: 'sjbs',
          searchModelBz: false,
          searchFlag: false,
          type: 'Select',
          defaultValue: 'JLJG_ZXSB_SB_JLJG_MDTHX_J',
          onChange: 'mdthxSjbsOnChange',
          list: [
            { label: '已申报数据', value: 'JLJG_ZXSB_SB_JLJG_MDTHX_J' },
            { label: '已核销数据', value: 'JLJG_ZXSB_SB_JLJG_MDTHX_F' },
          ],
        },
        { label: '所属期', name: 'ssq', type: 'Input', width: '2w' },
        { label: '申报批次', name: 'sbpc', type: 'Input', width: '2w' },
        { label: '申报核销手（账）册号', name: 'jljgszch', type: 'Input', width: '3w', searchButton: true },
      ];
    } else {
      myConfig.unit_key = 'JLJG_ZXSB_SB_JLJG_MDTHX_J';
      myConfig.grid_filter_quick[0].defaultValue = 'JLJG_ZXSB_SB_JLJG_MDTHX_J';
      myConfig.grid_filter_quick[0].value = 'JLJG_ZXSB_SB_JLJG_MDTHX_J';
      myConfig.grid_filter_quick = [
        {
          label: '数据标识',
          name: 'sjbs',
          searchModelBz: false,
          searchFlag: false,
          type: 'Select',
          defaultValue: 'JLJG_ZXSB_SB_JLJG_MDTHX_J',
          onChange: 'mdthxSjbsOnChange',
          list: [
            { label: '已申报数据', value: 'JLJG_ZXSB_SB_JLJG_MDTHX_J' },
            { label: '已核销数据', value: 'JLJG_ZXSB_SB_JLJG_MDTHX_F' },
          ],
        },
        { label: '所属期', name: 'ssq', type: 'Input', width: '2w' },
        { label: '申报批次', name: 'sbpc', type: 'Input', width: '2w' },
        { label: '申报核销手（账）册号', name: 'jljgszch', type: 'Input', width: '3w', searchButton: true },
      ];
    }


  }

  const refReportGrid: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(refReportGrid);
    return otherRef;
  };

  Func.intl = useIntl();
  return <>
    <DDBunit2 config={myConfig} func={Func} />
    <ReportGrid onRef={refReportGrid} />
  </>
};

export default Mdthx;