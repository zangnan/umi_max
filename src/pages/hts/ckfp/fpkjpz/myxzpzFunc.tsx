import { message, Switch } from 'antd';
import React from 'react';
import { myxzsztsbz } from '@/pages/hts/services/htsApi';
import 'moment/locale/zh-cn';

const Func: any = {
  refUnit: React.createRef(),
};

// 贸易性质配置-设置退税标志
Func.setTsbz = (checked: any, param: any) => {
  const { record, refUnit } = param;
  let tsbz = 'N';
  if (checked) {
    tsbz = 'Y'
  }
  refUnit.current!.setMasker(true);
  myxzsztsbz({ tsbz: tsbz, jgfsDm: record.jgfsDm }).then((response) => {
    const { code, desc } = response;
    refUnit.current!.setMasker(false);
    if (code === '200') {
      refUnit.current!.reload2();
      message.success("退税标志设置成功！");
      return true;
    } else {
      message.error(desc);
      return false;
    }
  })
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
}

export default Func;