/**
 * title: 未反馈明细查询
 */
 import React from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
 import Func from './f';
 import moment from 'moment';
import myUtil from '@/components/DDAssist/util';
 import configck from './config';
 import configjh from './configJh';
 import { history } from 'umi';

 const Index: React.FC<unknown> = () => {

  let myConfig;
  if (history?.location?.pathname === '/hts/sjbb/wm/tjbb/tsqk/wfkmxcx') {
    myConfig = { ...configck };
    myConfig.grid_filter_quick = [
      {
        label: '外贸企业出口退税出口明细申报表',
        name: 'wmqy',
        type: 'Select',
        defaultValue: 'ck',
        width: '5w',
        onChange: 'handleOnChangeBgd',
        list: [
          { label: '外贸企业出口退税出口明细申报表', value: 'ck' },
          { label: '外贸企业出口退税进货明细申报表', value: 'jh' },
        ],
      },
    ];
  }else if(history?.location?.pathname === '/hts/sjbb/wm/tjbb/tsqk/wfkmxcxjh'){
    myConfig = { ...configjh };
    myConfig.grid_filter_quick = [
      {
        label: '外贸企业出口退税进货明细申报表',
        name: 'wmqy',
        type: 'Select',
        defaultValue: 'jh',
        width: '5w',
        onChange: 'handleOnChangeBgd',
        list: [
          { label: '外贸企业出口退税出口明细申报表', value: 'ck' },
          { label: '外贸企业出口退税进货明细申报表', value: 'jh' },
        ],
      },
    ];
  } else {
    myConfig = { ...configck };
    myConfig.grid_filter_quick = [
      {
        label: '外贸企业出口退税出口明细申报表',
        name: 'wmqy',
        type: 'Select',
        defaultValue: 'ck',
        width: '5w',
        onChange: 'handleOnChangeBgd',
        list: [
          { label: '外贸企业出口退税出口明细申报表', value: 'ck' },
          { label: '外贸企业出口退税进货明细申报表', value: 'jh' },
        ],
      },
    ];
  }
      // 设置日期例如（20210801-当前日（20220729）。）
      let timeQ, timeZ;
      const time = new Date();
      const nowMonth = time.getMonth();
      let newMonth = (nowMonth + 1) < 10 ? '0' + (nowMonth + 2) : nowMonth + 2;
      if(newMonth === 13){
        timeQ = moment(myUtil.date.getYearBeforeCurr(0) + '-01-01');
      } else {
        timeQ = moment(myUtil.date.getYearBeforeCurr(1) + '-' + newMonth + '-01');
      }
      timeZ = moment(myUtil.date.accurateDate(new Date().getTime()));



  myConfig.filter_items[0].defaultValue = [timeQ, timeZ];
  myConfig.filter_items[0].allowClear = false;
  myConfig.filter_items[1].defaultValue = '';
  myConfig.filter_items[2].defaultValue = '';
  myConfig.toolbar_default.sjgxUpdateData = true;
  myConfig.initSearchModal= [];

   return <>
     <DDBunit2 config={myConfig} func={Func} />
   </>;
 };
 
 export default Index;