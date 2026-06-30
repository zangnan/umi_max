import React from 'react';
import { history } from 'umi';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config from '../comm/config';
import { cloneDeep } from 'lodash';
import Func from './f';


const Index: React.FC = () => {

  const myConfig = cloneDeep(config);


  if (history?.location?.pathname === '/40/4002/400201/40020102') {
    myConfig.gridParams = {
      initSearchModal: [
        { property: 'cxlx', value: "dts", op: 'zdy' },
        { property: 'khsbywlxDm', value: "1", op: 'zdy' },
      ],
    }
    // 配置项：工具栏
    myConfig.toolbar_default = {
      setting: true,
      reload: true,
      full: true,
      tssb_download: true,
    };
    myConfig.export_key = 'EXPORT_DDZX_DDGL_DBTS_DTSDC';

    let col = cloneDeep(myConfig.grid_columns);
    col = col.filter(
      (item: { dataIndex: string; }) => item.dataIndex !== "kptzbz"
           && item.dataIndex !== "kptzsj"
           && item.dataIndex !== "sl1"
           && item.dataIndex !== "hhcb"
           && item.dataIndex !== "zfglfwfje"
           && item.dataIndex !== "fwfkprq"
           && item.dataIndex !== "sjtse"
           && item.dataIndex !== "ckshrq"
           && item.dataIndex !== "ckshhbzmDm"
           && item.dataIndex !== "ckshje"
           && item.dataIndex !== "ckshhbhl"
           && item.dataIndex !== "ckshjermb"
           && item.dataIndex !== "zfjk"
           && item.dataIndex !== "zfkxrq"
           && item.dataIndex !== "sbpc"
           && item.dataIndex !== "sbrq1"
           && item.dataIndex !== "zbblbz"
           && item.dataIndex !== "tsrq1"
           && item.dataIndex !== "zfrq"
           && item.dataIndex !== "dsbz"
           && item.dataIndex !== "ssqpc"
        );
     myConfig.grid_columns = col;

     let file = cloneDeep(myConfig.filter_items);
     file.push({ name: 'hdrq', label: '核对日期', type: 'DatePicker', range: true, allowClear: true });
     myConfig.filter_items = file;
  }else if (history?.location?.pathname === '/40/4002/400204/40020402'){
    myConfig.gridParams = {
      initSearchModal: [
        { property: 'cxlx', value: "dts", op: 'zdy' },
        { property: 'khsbywlxDm', value: "3", op: 'zdy' },
      ],
    }
    myConfig.export_key = 'EXPORT_DDZX_DDGL_ZYCK_DTSDC';

    // 配置项：工具栏
    myConfig.toolbar_default = {
      setting: true,
      reload: true,
      full: true,
      tssb_download: true,
    };


    let col = cloneDeep(myConfig.grid_columns);
    col = col.filter(
      (item: { dataIndex: string; }) => item.dataIndex !== "kptzbz"
           && item.dataIndex !== "kptzsj"
           && item.dataIndex !== "sl1"
           && item.dataIndex !== "zfglfwfje"
           && item.dataIndex !== "fwfkprq"
           && item.dataIndex !== "sjtse"
           && item.dataIndex !== "ckshrq"
           && item.dataIndex !== "ckshhbzmDm"
           && item.dataIndex !== "ckshje"
           && item.dataIndex !== "ckshhbhl"
           && item.dataIndex !== "ckshjermb"
           && item.dataIndex !== "zfjk"
           && item.dataIndex !== "zfkxrq"
           && item.dataIndex !== "sbpc"
           && item.dataIndex !== "sbrq1"
           && item.dataIndex !== "zbblbz"
           && item.dataIndex !== "tsrq1"
           && item.dataIndex !== "zfrq"
           && item.dataIndex !== "dsbz"
           && item.dataIndex !== "ssqpc"
        );
     myConfig.grid_columns = col;

     let file = cloneDeep(myConfig.filter_items);
     file.push({ name: 'hdrq', label: '核对日期', type: 'DatePicker', range: true, allowClear: true });
     myConfig.filter_items = file;

  }



  return (
    <>
      <DDBunit2 config={myConfig} func={Func} />
    </>
  )
};

export default Index;
