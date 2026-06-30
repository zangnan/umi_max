import React, { useRef } from 'react';
import { history } from 'umi';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config from '../../ddzxgl/ddcx/comm/config';
import { cloneDeep } from 'lodash';
import Func from './f';



const Index: React.FC = () => {

  const myConfig = cloneDeep(config);


  // 代办退税
  if (history?.location?.pathname === '/41/4101') {

    myConfig.unit_key = 'QUERY_DDZX_SJCX_DDCX';
    myConfig.page_id = 'QUERY_DDZX_SJCX_DDCX';
    myConfig.export_key = 'REPORT_DDZX_DDCX_DBTSDDCX';
    myConfig.gridParams = {
      initSearchModal: [
        { property: 'khsbywlxDm', value: "1", op: 'zdy' },
      ],
    }
    // 配置项：工具栏
    myConfig.toolbar_default = {
      setting: true,
      reload: true,
      full: true,
      tssb_download: true
    };

    let col = cloneDeep(myConfig.grid_columns);

    col = col.filter(
      (item: { dataIndex: string; }) => item.dataIndex !== "kptzbz"
           && item.dataIndex !== "kptzsj"
           && item.dataIndex !== "sl1"
           && item.dataIndex !== "hhcb"
    );
    col.push(  { title: '生成开票时间', dataIndex: 'kptzsj', width: 180, align: 'center', render: { type: 'date', format: 'yyyy-MM-DD  HH:mm:ss' } },    );
    col.push(  {
      title: '生成开票状态', dataIndex: 'kptzbz', width: 120, align: 'center', codeTable: 'code_static_yes_no:01', filter: {
        type: 'Select',
        codeTable: 'code_static_yes_no:01',
      }
    },  );
    myConfig.grid_columns = col;

  } else {
    myConfig.export_key = 'REPORT_DDZX_DDCX_DLCKDDCX';
    myConfig.unit_key = 'QUERY_DDZX_SJCX_DDCX';
    myConfig.page_id = 'QUERY_DDZX_SJCX_DDCX';
    myConfig.gridParams = {
      initSearchModal: [
        { property: 'khsbywlxDm', value: "2", op: 'zdy' },
      ],
    }
    // 配置项：工具栏
    myConfig.toolbar_default = {
      setting: true,
      reload: true,
      full: true,
      tssb_download: true
    };
    let col = cloneDeep(myConfig.grid_columns);

    col = col.filter(
      (item: { dataIndex: string; }) => item.dataIndex !== "kptzbz"
           && item.dataIndex !== "kptzsj"
           && item.dataIndex !== "sl1"
           && item.dataIndex !== "se"
           && item.dataIndex !== "hsje"
           && item.dataIndex !== "hhcb"
           && item.dataIndex !== "sjtse"
           && item.dataIndex !== "sjtse"
           && item.dataIndex !== "kprq"
           && item.dataIndex !== "fpDm"
           && item.dataIndex !== "fphm"
           && item.dataIndex !== "hh"
           && item.dataIndex !== "hdrq"
           && item.dataIndex !== "pdbz"
           && item.dataIndex !== "pdsj1"
           && item.dataIndex !== "ssqpc"
           && item.dataIndex !== "sbrq1"
           && item.dataIndex !== "zbblbz"
           && item.dataIndex !== "tsrq1"
           && item.dataIndex !== "zfrq"
           && item.dataIndex !== "dsbz"
    );
    myConfig.grid_columns = col;
  }

  let col = cloneDeep(myConfig.grid_columns);
  myConfig.grid_columns = col;

  let file = cloneDeep(myConfig.filter_items);

  myConfig.filter_items = file;

  return (
    <>
      <DDBunit2 config={myConfig} func={Func} />
    </>
  )
};

export default Index;
