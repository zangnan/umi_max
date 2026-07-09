import React from 'react';
import DDAlert from '@/pages/hts/components/DDAlert';
import { intl as intl2 } from '@/components/DDAssist/util';
import { ycsbYzfFkxzFksjbSc } from '@/pages/hts/services/htsApi';
import { message } from 'antd';

const Func: any = {
  refUnit: React.createRef(),
};

// 按钮显隐-刷新
Func.displayReload = (record: any) => {
  if (record.shjgxzztDm == '0' || record.shjgxzztDm == '1') { // 未处理
    return false;
  }
  return true;
}
// 按钮显隐-反馈数据包下载
Func.displayDownload = (record: any) => {
  if (record.wjm?.trim() != '') { // 可下载文件
    return false;
  }
  return true;
}

// 配置项：删除
Func.handleColumnDelete = (param: any, event: any) => {
  event.stopPropagation();
  const { refUnit, record } = param;
  DDAlert.open({
    title: '系统提示',
    info: intl2.formatMessage({ id: 'message_inquiry_delete' }),
    infoType: 'question',
    modalType: 'confirm',
    closeStatus: false,
    okCallbackFn: function (thisObj: any) {
      thisObj.setState({ masker: true });
      ycsbYzfFkxzFksjbSc({uuid: record.uuid}).then((res: any) => {
        DDAlert.close();
        const { code, msg } = res;
        if (code == '200') {
          message.success("删除成功！");
          refUnit?.current!.reload2();
        } else {
          message.error(msg);
        }
      })
    },
  });
};

export default Func;