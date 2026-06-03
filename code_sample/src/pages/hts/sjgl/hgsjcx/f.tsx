import React from 'react';
import cktsUtil from '@/pages/common/cktsUtil';
import { message } from 'antd';

const Func: any = {
  unitRef: React.createRef(),
};


Func.handleMdthxFplSjdc = async (param :any) =>{
  if(param.unitRef.current.getGridData().length == 0 ){
    message.info('当前筛选条件下无数据，请确认！');
    return  
  }
  let  mbxzkey ='EXCEL_REPORT_SJGLSAAS_HGSJCX_JKJKS';
  let url = `/hx/ty/report/excelPostReport/${mbxzkey}/`;
  let tmp = {
    key: mbxzkey,
    relx: 'xls',
    iszip: 'N',
    searchModel:param.unitRef.current.getGridParams().searchModel,
    orderModel: [],
  }
  const selectionRows =  param?.selectionRowKeys;
  if(selectionRows.length > 0){
    const uuids = {"property" : "uuids", "values": selectionRows, "op": "ain" };
    tmp.searchModel.push(uuids);

  }
  await cktsUtil.downloadFilePost(url, tmp);
}
export default Func;


