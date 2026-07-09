import React from 'react';
import { queryCjCsh, queryCjGlh, fpzxpdCheckByHistoryData } from '@/pages/hts/services/htsApi';

const Func: any = {
  refUnit: React.createRef(),
};

// 配单
Func.handPdColumns = async (param: any) => {
  //校验发票金额是否超出发票总金额
  const fpjeCheckObj = await fpzxpdCheckByHistoryData(param.record);
  param.record.syje = fpjeCheckObj.body.syje;
  param.record.pdje = fpjeCheckObj.body.syje;
  param.record.sl = fpjeCheckObj.body.sl;
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

Func.columnsRender = {
  fpzt: (param: any) => {
    const record = param?.record;
    let text = '';
    if (record.rzxfzzszyfpbz === 'Y') {
      text = text + '已认证/';
    }
    if (record.rzxfzzszyfpbz != 'Y') {
      text = text + '未认证/';
    }
    if (record.jhxfzzszyfpbz === 'Y') {
      text = text + '已稽核';
    }
    if (record.jhxfzzszyfpbz != 'Y') {
      text = text + '未稽核';
    }
    return text;
  },
}

export default Func;