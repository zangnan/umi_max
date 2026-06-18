/**
 * title: 免抵退税申报汇总
 * serviceKey: MDT_ZXSB_SB_MDT_SBHZ_G
 * unitId: mdt_zxsb_sb_mdt_sbhz
*/
import React from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import config from './auto_config';
import Func from './f';
import { history } from 'umi';

const index: React.FC<unknown> = () => {

  const myConfig = { ...config };
  // const dataIndexWidth210 = [
  //   'mdtsbdmzhdkse', 'ckhwbdmzhdkse', 'ysfwbdmzhdkse',
  //   'bnljckhwmdtse', 'bnljysfwmdtse', 'jzbmzdkdje'
  // ]
  // const dataIndexWidth240 = [
  //   'mdtsbdmzhdksehj', 'jljghxytzmdtse', 'zzsnssbbqmldse', 
  //   'bnljckhwxsemy', 'bnljysfwxsemy', 'bdmzdkseynsbce', 'ytzbdmzhdkseyzzsnssbbce'
  // ]
  // const dataIndexWidth260 = ['bnljmdtckxsermb', 'bnljmdtsbdmzhdkse', 'bnljckhwbdmzhdkse', 'bnljysfwbdmzhdkse', 'bnljmdtckxsemy'];
  // const dataIndexWidth290 = ['jljghxytzbdmzhdkse', 'bnljmdtsbdmzhdksehj', 'bnljjljghxytzmdtse']
  // const dataIndexWidth330 = ['bnljjljghxytzbdmzhdkse'];
  // myConfig.grid_columns.forEach((item: any) => {
  //   if (dataIndexWidth210.length > 0 && dataIndexWidth210.indexOf(item.dataIndex) > -1) {
  //     item.width = 210;
  //   }
  //   if (dataIndexWidth240.length > 0 && dataIndexWidth240.indexOf(item.dataIndex) > -1) {
  //     item.width = 240;
  //   }
  //   if (dataIndexWidth260.length > 0 && dataIndexWidth260.indexOf(item.dataIndex) > -1) {
  //     item.width = 260;
  //   }
  //   if (dataIndexWidth290.length > 0 && dataIndexWidth290.indexOf(item.dataIndex) > -1) {
  //     item.width = 290;
  //   }
  //   if (dataIndexWidth330.length > 0 && dataIndexWidth330.indexOf(item.dataIndex) > -1) {
  //     item.width = 330;
  //   }
  // })
  // 如果为数据管理查询页面CXTJ_
  if(history?.location?.pathname.indexOf('CXTJ_')>-1){
    myConfig.toolbar_default = {
      add: false, // 是否显示增加按钮，默认关闭
      edit: false, // 是否显示修改按钮，默认关闭
      delete: false, // 是否显示删除按钮，默认关闭
      setting: true, // 是否显示设置按钮，默认关闭
      reload: true, // 是否显示刷新按钮，默认关闭
      full: true, // 是否显示全屏按钮，默认关闭
      ckts_download: true, // 是否显示导出按钮，默认关闭
      upload: false,  // 是否显示导入按钮，默认关闭
      ckts_sum: false, // 是否显示小计按钮，默认关闭
      ckts_order: false, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
    };
  }

  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>
};
export default index;