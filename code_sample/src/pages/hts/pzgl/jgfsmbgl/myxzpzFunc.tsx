import { message, Switch } from 'antd';
import React from 'react';
import { myxzsztsbz } from '@/services/hts/api';
import 'moment/locale/zh-cn';

const Func: any = {
  unitRef: React.createRef(),
};

// 贸易性质配置-设置退税标志
Func.setTsbz = (checked: any, param: any) => {
  const { record, unitRef } = param;
  let tsbz = 'N';
  if (checked) {
    tsbz = 'Y'
  }
  unitRef.current!.setMasker(true);
  myxzsztsbz({ tsbz: tsbz, jgfsDm: record.jgfsDm }).then((response) => {
    const { code, desc } = response;
    unitRef.current!.setMasker(false);
    if (code === '200') {
      unitRef.current!.reload2();
      message.success("退税标志设置成功！");
      return true;
    } else {
      message.error(desc);
      return false;
    }
  })
}

Func.handlerClfs= (params: any) => {
  const { selectionRowKeys, otherRef} = params;
  if (selectionRowKeys?.length <= 0) {
    message.error('请选择要修改的数据！');
    return;
  }
  otherRef[0].current?.showModal({selectionRows: params?.selectionRows, selectionRowKeys: selectionRowKeys, unitRef: params?.unitRef});
}

// 列表自定义渲染
Func.columnsRender = {
  // 是否申报退税
  rendertsbz: (param: any) => {
    let checked = param.text === 'N' ? false : true;
    const html = <Switch size="default" onChange={(checked: any, event: any) => {
      event.stopPropagation(); checked = Func.setTsbz(checked, param);
    }} checkedChildren="是" unCheckedChildren="否" checked={checked} />;
    return html;
  },
  renderJgfstslx: (param: any) => {
    const {record} = param;
    if (record?.jgfstslxDm === '0') {
      return (
        <span> {'不退税'} </span>
      );
    } else {
      return (
        <span> {'可退可不退'} </span>
      );
    }
  },
  renderBgdcllx: (param: any) => {
    const {record} = param;
    if (record?.bgdcllxDm === '0') {
      return (
        <span> {'退税'} </span>
      );
    } else if (record?.bgdcllxDm === '4') {
      return (
        <span> {'免税'} </span>
      );
    } else {
      return (
        <span> {'征税'} </span>
      );
    }
  }
}

export default Func;