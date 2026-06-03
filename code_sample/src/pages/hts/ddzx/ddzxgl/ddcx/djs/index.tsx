import React, { useRef } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from '../comm/config';
import { cloneDeep } from 'lodash';
import Func from './f';
import FwfjsModal from './jsModal/fwfjsModal';
import ShjsModal from './jsModal/shjsModal';
import TsjsModal from './jsModal/tsjsModal';
import { history } from 'umi';


const Index: React.FC = () => {

  const myConfig = cloneDeep(config);

  const fwfjsRef: any = useRef();
  const shjsRef: any = useRef();
  const tsjsRef: any = useRef();

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(fwfjsRef);
    otherRef.push(shjsRef);
    otherRef.push(tsjsRef);
    return otherRef;
  };

  if (history?.location?.pathname === '/40/4002/400201/40020103') {
    myConfig.gridParams = {
      initSearchModal: [
        { property: 'cxlx', value: "djs", op: 'zdy' },
        { property: 'khsbywlxDm', value: "1", op: 'zdy' },
      ],
    }
    // 配置项：自定义工具栏
    myConfig.costomer_toobar = [
      { name: '服务费结算', func: 'funcFwf' },
      { name: '收汇结算', func: 'funcSh' },
      { name: '退税结算', func: 'funcTs' },
    ];

    let col = cloneDeep(myConfig.grid_columns);

    myConfig.export_key = 'EXPORT_DDZX_DDGL_DBTS_DJSDC';

    col = col.filter(
      (item: { dataIndex: string; }) => item.dataIndex !== "kptzbz"
        && item.dataIndex !== "kptzsj"
        && item.dataIndex !== "sl1"
        && item.dataIndex !== "hhcb"
        && item.dataIndex !== "kprq"
        && item.dataIndex !== "hdrq"
        && item.dataIndex !== "fpDm"
        && item.dataIndex !== "fphm"
        && item.dataIndex !== "hh"
        && item.dataIndex !== "lrrq"
        && item.dataIndex !== "pdzt"
        && item.dataIndex !== "pdsj1"
        && item.dataIndex !== "pdbz"

        
    );
    myConfig.grid_columns = col;

  } else if (history?.location?.pathname === '/40/4002/400203/40020303') {
    myConfig.gridParams = {
      initSearchModal: [
        { property: 'cxlx', value: "djs", op: 'zdy' },
        { property: 'khsbywlxDm', value: "2", op: 'zdy' },
      ],
    }
    // 配置项：自定义工具栏
    myConfig.costomer_toobar = [
      { name: '服务费结算', func: 'funcFwf' },
      { name: '收汇结算', func: 'funcSh' },
      { name: '转用途', func: 'zyt' },
    ];

    let col = cloneDeep(myConfig.grid_columns);

    myConfig.export_key = 'EXPORT_DDZX_DDGL_DLCK_DJSDC';

    col = col.filter(
      (item: { dataIndex: string; }) => 
        item.dataIndex !== "kptzbz"
        && item.dataIndex !== "kptzsj"
        && item.dataIndex !== "sl1"
        && item.dataIndex !== "hhcb"
        && item.dataIndex !== "hdrq"
        && item.dataIndex !== "lrrq"
        && item.dataIndex !== "pdzt"

        
        
        && item.dataIndex !== "se"
        && item.dataIndex !== "hsje"
        && item.dataIndex !== "sjtse"
        && item.dataIndex !== "fpDm"
        && item.dataIndex !== "fphm"
        && item.dataIndex !== "hh"
        && item.dataIndex !== "pdbz"
        && item.dataIndex !== "kprq"
        && item.dataIndex !== "pdsj1"
        && item.dataIndex !== "ssqpc"
        && item.dataIndex !== "zbblbz"
        && item.dataIndex !== "tsrq1"
        && item.dataIndex !== "zfrq"
        && item.dataIndex !== "dsbz"
        && item.dataIndex !== "sbrq1"
    );

    myConfig.grid_columns = col;
    // 配置项：工具栏
    // 配置项：工具栏

  }else if(history?.location?.pathname === '/40/4002/400204/40020403'){
    myConfig.gridParams = {
      initSearchModal: [
        { property: 'cxlx', value: "djs", op: 'zdy' },
        { property: 'khsbywlxDm', value: "3", op: 'zdy' },
      ],
    }

    myConfig.export_key = 'EXPORT_DDZX_DDGL_ZYCK_DJSDC';

    // 配置项：自定义工具栏
    myConfig.costomer_toobar = [
      { name: '服务费结算', func: 'funcFwf' },
      { name: '收汇结算', func: 'funcSh' },
      { name: '退税结算', func: 'funcTs' },
    ];

    let col = cloneDeep(myConfig.grid_columns);

    col = col.filter(
      (item: { dataIndex: string; }) => item.dataIndex !== "kptzbz"
        && item.dataIndex !== "kptzsj"
        && item.dataIndex !== "sl1"
        && item.dataIndex !== "kprq"
        && item.dataIndex !== "hdrq"
        && item.dataIndex !== "fpDm"
        && item.dataIndex !== "fphm"
        && item.dataIndex !== "hh"
        && item.dataIndex !== "lrrq"
        && item.dataIndex !== "pdzt"
        && item.dataIndex !== "pdsj1"
        && item.dataIndex !== "pdbz"

    );
    myConfig.grid_columns = col;

  }


  myConfig.toolbar_default = {
    setting: true,
    reload: true,
    full: true,
    tssb_download:true,
  };

  return (
    <>
      <DDBunit2 config={myConfig} func={Func} />
      <FwfjsModal onRef={fwfjsRef} />
      <ShjsModal onRef={shjsRef} />
      <TsjsModal onRef={tsjsRef} />
    </>
  )
};

export default Index;
