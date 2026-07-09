import React from 'react';
import 'moment/locale/zh-cn';
import { Button, message } from 'antd';
import { getXzbg, downloadTemplate } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';



const Func: any = {
  refUnit: React.createRef(),
};

// 列表自定义渲染
Func.columnsRender = {
  renderBadzYdzs: (param: any) => {
    const { record } = param;
    return <Button type="link" onClick={(event: any) => { event.stopPropagation(); Func.renderBadzYdzs(param,'Z') }}>{record.sjzjydsl}</Button>;
  },
  renderSjzjcwlydsl: (param: any) => {
    const { record } = param;
    return <Button type="link" onClick={(event: any) => { event.stopPropagation(); Func.renderBadzYdzs(param,'E') }}>{record.sjzjcwlydsl}</Button>;
  },
  renderSjzjjglydsl: (param: any) => {
    const { record } = param;
    return <Button type="link" onClick={(event: any) => { event.stopPropagation(); Func.renderBadzYdzs(param,'W') }}>{record.sjzjjglydsl}</Button>;
  },
}

Func.fxbg = (param: any) => {
  const { refUnit, record } = param;
  refUnit.current?.setMasker(true);
  getXzbg({ ny: record?.ny }).then((res2: any) => {
    refUnit.current?.setMasker(false);
    const { code, msg, body } = res2;
    if (!"200" == code) {
      message.error(msg);
      return;
    }
    if (body?.rtnCode != '200') {
      message.error(body?.rtnMsg);
      return;
    } else {
      myUtil.file.downloadPdf(body?.blob, body?.fileName);
    }
  });
}

Func.ydqc = (param: any) => {
  const { refUnit, record } = param;
  refUnit.current?.setMasker(true);
  const data = { "sfBhsj": "Y", "sfScsm": "Y", "key": "CX_HGGL_TSQK_YDLBQUERY_DC", "orderModel": [], "searchModel": [{ "type": 1, "property": "ny", "value": record?.ny, "op": "zdy" }] };
  if(myUtil.sessionStore.getItem('userInfo')?.qxQys[0].cktsqylxDm == 'SC'){
    data.key = "CX_HGGL_TSQK_YDLBQUERY_SC_DC";
   
  }
  downloadTemplate(data).then((response: any) => {
    refUnit.current?.setMasker(false);
    const { code, body, msg } = response;
    if (code === '200') {
      const { blob, fileName } = body;
      myUtil.file.downloadExcel(blob, fileName);
    }else{
      message.error(msg);
    }
  });
}




export default Func;