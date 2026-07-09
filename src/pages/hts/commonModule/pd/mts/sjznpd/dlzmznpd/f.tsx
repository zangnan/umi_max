import React from 'react';
import { queryCjCsh, queryCjGlh } from '@/pages/hts/services/htsApi';

const Func: any = {
  refUnit: React.createRef(),
};

// 配单
Func.handPdColumns = (param: any) => {
  const { refUnit, record, otherRef } = param;
  refUnit.current!.setMasker(true);
  queryCjCsh({tableKey: "MTS_ZXSB_SB_MTS_TSSB_G"}).then((response) => {
    const { code, body } = response;
    refUnit.current!.setMasker(false);
    if (code === '200') {
      const obj = {
        sbpc: body.sbpc,
        ssq: body.ssq,
      }
      queryCjGlh(obj).then((res: any)=>{
        if(res.code === '200') {
          const para = body;
          para.glh = res.body.glh
          otherRef[0].current!.showModal(para, refUnit,record);
        }
      })
    }
  })
}


export default Func;