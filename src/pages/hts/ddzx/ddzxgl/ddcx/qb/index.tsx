import React,{useRef} from 'react';
import { history } from 'umi';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config from '../comm/config';
import { cloneDeep } from 'lodash';
import Func from './f';
import CKTS_Sjxj from '@/pages/hts/commonModule/xj/xj';          // 原在线申报系统模块 小计


const Index: React.FC = () => {

  const myConfig = cloneDeep(config);
  const refCktsSum: any = useRef();              // 原在线申报系统模块 小计


  if (history?.location?.pathname === '/40/4002/400201/40020105') {
    let file = cloneDeep(myConfig.filter_items);
    file.push({ name: 'hdrq', label: '核对日期', type: 'DatePicker', range: true, allowClear: true });
    file.push({ name: 'sbrq1', label: '申报月份', type: 'Input' });
    myConfig.filter_items = file;

    myConfig.gridParams = {
      initSearchModal: [
        { property: 'cxlx', value: "qb", op: 'zdy' },
        { property: 'khsbywlxDm', value: "1", op: 'zdy' },
      ],
    }
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
    myConfig.export_key = 'EXPORT_DDZX_DDGL_DBTS_QBDC';
    
  }else if (history?.location?.pathname === '/40/4002/400203/40020305') {
    myConfig.gridParams = {
      initSearchModal: [
        { property: 'cxlx', value: "qb", op: 'zdy' },
        { property: 'khsbywlxDm', value: "2", op: 'zdy' },
      ],
    }
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
    myConfig.export_key = 'EXPORT_DDZX_DDGL_DLCK_QBDC';

  }else if (history?.location?.pathname === '/40/4002/400204/40020405') {
    
    let file = cloneDeep(myConfig.filter_items);
    file.push({ name: 'hdrq', label: '核对日期', type: 'DatePicker', range: true, allowClear: true });
    file.push({ name: 'sbrq1', label: '申报月份', type: 'Input' });
    myConfig.filter_items = file;

    myConfig.gridParams = {
      initSearchModal: [
        { property: 'cxlx', value: "qb", op: 'zdy' },
        { property: 'khsbywlxDm', value: "3", op: 'zdy' },
      ],
    }
    let col = cloneDeep(myConfig.grid_columns);

    col = col.filter(
      (item: { dataIndex: string; }) => item.dataIndex !== "kptzbz"
           && item.dataIndex !== "kptzsj"
           && item.dataIndex !== "sl1"
    );
    col.push(  { title: '生成开票时间', dataIndex: 'kptzsj', width: 180, align: 'center', render: { type: 'date', format: 'yyyy-MM-DD  HH:mm:ss' } },    );
    col.push(  {
      title: '生成开票状态', dataIndex: 'kptzbz', width: 120, align: 'center',  codeTable: 'code_static_yes_no:01', filter: {
        type: 'Select',
        codeTable: 'code_static_yes_no:01',
      }
    },  );   
    myConfig.grid_columns = col;
    myConfig.export_key = 'EXPORT_DDZX_DDGL_ZYCK_QBDC';
  }

  myConfig.toolbar_default = {
    setting: true,
    reload: true,
    full: true,
    tssb_download:true,
    // ckts_sum: true,                     // 是否显示小计按钮，默认关闭
  };


  // 配置项：自定义工具栏
  myConfig.customer_toolbar = [
    { name: '小计', key: 'sxxas', func: 'xj' },
  ];

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(refCktsSum);
    return otherRef;
  };

  return (
    <>
      <DDBunit2 config={myConfig} func={Func} />
      <CKTS_Sjxj onRef={refCktsSum} />
    </>
  )
};

export default Index;
