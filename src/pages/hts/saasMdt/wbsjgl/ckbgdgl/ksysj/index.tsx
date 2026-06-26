// 出口报关单管理-可使用数据
import React, {useRef, useEffect} from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import config from "./bgdKsyConfig";
import bgdKsyFunc from "./bgdKsyFunc";
import Hgbgd from "@/pages/hts/commonModule/ckhwbgd/Yl";
import DrawerListHl from '@/pages/hts/saasMdt/wbsjgl/common/modal_plbthl';
import ScmxSaasMdt from '@/pages/hts/commonModule/scmx/scmxSaasMdt';
import CheckErrModel from '../../common/checkErrModel';
import { history } from 'umi';
import { delTzsx } from '@/pages/hts/services/htsApi';

const Index: React.FC<{ data: any }> = ({
  data,
}) => {

  useEffect(() => {
    delTzsx({cdDm: '25020103'}).then(() => {});
  }, []);


  const hgbgdRef: any = useRef();
  const drawerRefHl: any = useRef();
  const scmxSaasRef: any = useRef();
  const errRefCkspDm: any = useRef();

  const myConfig = {...config};
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'cxlx', value: '6', op: 'zdy' },
    ]
  };

  if(history?.location?.pathname.indexOf('/26/2602') > -1 || history?.location?.pathname.indexOf('/27/2702') > -1){
    myConfig.filter_items = [
      { name: 'ckbgdh', label: '出口货物报关单号', type: 'Input' },
      { name: 'ckhth', label: '出口合同号', type: 'Input' },
      { name: 'ckrq1', label: '出口日期', type: 'DatePicker', range: true, allowClear: true },
      { name: 'ckspDm', label: '出口商品代码', type: 'Input' },
      { name: 'jgfsDm', label: '监管方式', type: 'Select', showType: '3', allowClear: true, showSearch: true, codeTable: 'CODE_DM_CKTS_HGJGFS:01' },
      { name: 'hgspmc', label: '海关商品名称', type: 'Input' },
    ];
    myConfig.customer_toolbar = [
      {
        name: '批量修改',
        type: 'dropdown',
        list: [
          { name: '出口发票号', key: 'ckfphPlxg', func: 'ckfphPlxg' },
          { name: '出口商品代码', key: 'ckspdmPlxg', func: 'ckspdmPlxg' },
          { name: '汇率', func: 'btnPlXgHl' },
          { name: '运费折算数量', key: 'yfzsslPlxg', func: 'yfzsslPlxg' },
        ],
      },
      { name: '转不退税', func: 'btnZbts' },
    ];
  } else {
    myConfig.filter_items = [
      { name: 'ckbgdh', label: '出口货物报关单号', type: 'Input' },
      { name: 'ckhth', label: '出口合同号', type: 'Input' },
      { name: 'ckrq1', label: '出口日期', type: 'DatePicker', range: true, allowClear: true },
      { name: 'ckspDm', label: '出口商品代码', type: 'Input' },
      { name: 'jgfsDm', label: '监管方式', type: 'Select', showType: '3', allowClear: true, showSearch: true, codeTable: 'CODE_DM_CKTS_HGJGFS:01' },
      { name: 'tzsxbz', label: '台账数据', type: 'Select', codeTable: 'CODE_STATIC_SJGL_TZSJ:01' },
      { name: 'hgspmc', label: '海关商品名称', type: 'Input' },
    ];
    myConfig.gridParams = {
      initSearchModal: [
        { property: 'cxlx', value: '6', op: 'zdy' },
        { property: 'cdDm', value: "25020103", op: 'zdy' }
      ]
    };
    myConfig.customer_toolbar = [
      { name: '生成明细报表', func: 'produceDetailsReport' },
      { name: '台账筛选', key: '3', func: 'importTzsx' },
      {
        name: '批量修改',
        type: 'dropdown',
        list: [
          { name: '出口发票号', key: 'ckfphPlxg', func: 'ckfphPlxg' },
          { name: '出口商品代码', key: 'ckspdmPlxg', func: 'ckspdmPlxg' },
          { name: '汇率', func: 'btnPlXgHl' },
          { name: '运费折算数量', key: 'yfzsslPlxg', func: 'yfzsslPlxg' },
        ],
      },
      { name: '转不退税', func: 'btnZbts' },
    ];
  }


  bgdKsyFunc.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(hgbgdRef);
    otherRef.push(drawerRefHl);
    otherRef.push(scmxSaasRef);
    otherRef.push(errRefCkspDm);
    return otherRef;
  };

  return <>
    <div key={data}>
      <DDBunit2 config={myConfig} func={bgdKsyFunc} />
      <Hgbgd onRef={hgbgdRef} />
      <DrawerListHl onRef={drawerRefHl} />
      <ScmxSaasMdt onRef={scmxSaasRef} />
      <CheckErrModel onRef={errRefCkspDm} />
    </div>
  </>
};

export default Index;
