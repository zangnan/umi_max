import myUtil from '@/components/DDAssist/util';
import React from 'react';
import 'moment/locale/zh-cn';
import { getXzbg, downloadTemplate, cxscbg } from '@/pages/hts/services/htsApi';
import { message } from "antd";
import DDAlert from '@/pages/hts/components/DDAlert';


const Func: any = {
  unitRef: React.createRef(),
};

Func.fxbg=(param :any)=>{
  const {unitRef} = param;
  unitRef.current?.setMasker(true);
  getXzbg({ ny: myUtil.date.getCurrentYearMonth()}).then((res2: any) => {
    unitRef.current?.setMasker(false);
    const {code,msg,body} = res2;
    if(!"200" == code){
      message.error(msg);
      return;
    }
    if(body?.rtnCode != '200'){
      if(body?.rtnCode == '500'){
        DDAlert.open({
          title: '系统提示',
          info: body?.rtnMsg,
          infoType: 'warning',
          closeStatus: false,
          okCallbackFn: function (thisObj: any) {
            thisObj.setState({ masker: true });
            cxscbg({ ny: myUtil.date.getCurrentYearMonth()}).then((res3: any) => {
              thisObj.setState({ masker: false });
              const {code,msg,} = res3;
              if(!"200" == code){
                message.error(msg);
              }else{
                message.success('报告重新生成中！');
              }
            });
            DDAlert.close();
          },
        });
      }else{
        message.error(body?.rtnMsg);
      }
    }else{
      myUtil.file.downloadPdf(body?.blob, body?.fileName);
    }
  });
}

Func.ydqc=(param :any)=>{
  const {unitRef} = param;
  unitRef.current?.setMasker(true);
  downloadTemplate({ ny: myUtil.date.getCurrentYearMonth()}).then((res2: any) => {
    unitRef.current?.setMasker(false);
    const {code,msg,body} = res2;
    if(!"200" == code){
      message.error(msg);
      return;
    }
    if(body?.rtnCode != '200'){
      message.error(body?.rtnMsg);
      return;
    }else{
      myUtil.file.downloadPdf(body?.blob, body?.fileName);
    }
  });
}




export default Func;