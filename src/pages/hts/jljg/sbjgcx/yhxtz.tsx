/**
 * title: 申报结果查询的已核销调整表
 * creator: zxy
 */
import { intl } from '@/components/DDAssist/util';
import React, { useRef } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import yhxtzConfig from './yhxtzconfig';
import Func from './fyhxtz';
import { history } from 'umi';
import ReportGrid from './reportGrid';

const Yhxtz: React.FC<unknown> = () => {
  const myConfig = {...yhxtzConfig};
  if (history?.location?.pathname.indexOf('CXTJ_') > 0) { // 数据管理进入
    if (history?.location?.pathname === '/02/0207/020708/CXTJ_02070804') {
      myConfig.unit_key = 'JLJG_ZXSB_SB_JLJG_HGSJTZ_F';
      myConfig.export_key = 'JLJGHX_HXSBSJGL_YHXSZCHGSJTZB_FKB_DC';                               // 业务单元key，对应后端接口
      myConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出
      myConfig.toolbar_default['ckts_download'] = false;
      myConfig.toolbar_default['tssb_download'] = true;
    } else if (history?.location?.pathname === '/02/0207/020708/CXTJ_02070805') {
      myConfig.unit_key = 'JLJG_ZXSB_SB_JLJG_HGSJTZ_J';
    } else {
      myConfig.unit_key = 'JLJG_ZXSB_SB_JLJG_HGSJTZ_J';
    }
    myConfig.layout_type = 'default';
    myConfig.grid_filter_quick = [];
  } else {
    if (history?.location?.pathname === '/hts/jljg/sbjgcxHyhxtzF') {
      myConfig.unit_key = 'JLJG_ZXSB_SB_JLJG_HGSJTZ_F';
      myConfig.grid_filter_quick[0].defaultValue = 'JLJG_ZXSB_SB_JLJG_HGSJTZ_F';
      myConfig.grid_filter_quick[0].value = 'JLJG_ZXSB_SB_JLJG_HGSJTZ_F';
      myConfig.export_key = 'JLJGHX_HXSBSJGL_YHXSZCHGSJTZB_FKB_DC';                               // 业务单元key，对应后端接口
      myConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出
      myConfig.toolbar_default['ckts_download'] = false;
      myConfig.toolbar_default['tssb_download'] = true;
      myConfig.grid_filter_quick = [
        {
          label: '数据标识',
          name: 'sjbs',
          searchModelBz: false,
          searchFlag: false,
          type: 'Select',
          defaultValue: 'JLJG_ZXSB_SB_JLJG_HGSJTZ_F',
          onChange: 'yhxtzSjbsOnChange',
          list: [
            { label: '已申报数据', value: 'JLJG_ZXSB_SB_JLJG_HGSJTZ_J' },
            { label: '已核销数据', value: 'JLJG_ZXSB_SB_JLJG_HGSJTZ_F' },
          ],
        },
      ];
    } else if (history?.location?.pathname === '/hts/jljg/sbjgcxHyhxtzJ') {
      myConfig.unit_key = 'JLJG_ZXSB_SB_JLJG_HGSJTZ_J';
      myConfig.grid_filter_quick[0].defaultValue = 'JLJG_ZXSB_SB_JLJG_HGSJTZ_J';
      myConfig.grid_filter_quick[0].value = 'JLJG_ZXSB_SB_JLJG_HGSJTZ_J';
      myConfig.export_key = 'JLJGHX_HXSBSJGL_YHXSZCHGSJTZB_JGB_DC';                               // 业务单元key，对应后端接口
      myConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出
      myConfig.toolbar_default['ckts_download'] = false;
      myConfig.toolbar_default['tssb_download'] = true;
      myConfig.grid_filter_quick = [
        {
          label: '数据标识',
          name: 'sjbs',
          searchModelBz: false,
          searchFlag: false,
          type: 'Select',
          defaultValue: 'JLJG_ZXSB_SB_JLJG_HGSJTZ_J',
          onChange: 'yhxtzSjbsOnChange',
          list: [
            { label: '已申报数据', value: 'JLJG_ZXSB_SB_JLJG_HGSJTZ_J' },
            { label: '已核销数据', value: 'JLJG_ZXSB_SB_JLJG_HGSJTZ_F' },
          ],
        },
      ];
    } else {
      myConfig.unit_key = 'JLJG_ZXSB_SB_JLJG_HGSJTZ_J';
      myConfig.grid_filter_quick[0].defaultValue = 'JLJG_ZXSB_SB_JLJG_HGSJTZ_J';
      myConfig.grid_filter_quick[0].value = 'JLJG_ZXSB_SB_JLJG_HGSJTZ_J';
      myConfig.export_key = 'JLJGHX_HXSBSJGL_YHXSZCHGSJTZB_JGB_DC';                               // 业务单元key，对应后端接口
      myConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出
      myConfig.toolbar_default['ckts_download'] = false;
      myConfig.toolbar_default['tssb_download'] = true;
      myConfig.grid_filter_quick = [
        {
          label: '数据标识',
          name: 'sjbs',
          searchModelBz: false,
          searchFlag: false,
          type: 'Select',
          defaultValue: 'JLJG_ZXSB_SB_JLJG_HGSJTZ_J',
          onChange: 'yhxtzSjbsOnChange',
          list: [
            { label: '已申报数据', value: 'JLJG_ZXSB_SB_JLJG_HGSJTZ_J' },
            { label: '已核销数据', value: 'JLJG_ZXSB_SB_JLJG_HGSJTZ_F' },
          ],
        },
      ];
    }

  }

  const refReportGrid: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(refReportGrid);
    return otherRef;
  };

  Func.intl = intl;
  return <>
    <DDBunit2 config={myConfig} func={Func}/>
    <ReportGrid onRef={refReportGrid} />
  </>
};

export default Yhxtz;
