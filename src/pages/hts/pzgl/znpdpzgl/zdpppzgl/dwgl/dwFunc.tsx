import { message, Switch } from 'antd';
import React from 'react';
import { dwglUpdate } from '@/pages/hts/services/htsApi';

const Func: any = {
  refUnit: React.createRef(),
};

// 表单校验
Func.validator = {
}

// 客户管理:设置客户状态
Func.setKhzt = (checked: any, param: any) => {
  const { record, refUnit } = param;
  console.log(record)
  let khzt = 'N';
  if (checked) {
    khzt = 'Y'
  }
  refUnit.current!.setMasker(true);
  const params = {
    uuid: record.uuid,
    jldwmc: record.jldwmc,
    hgjldwmc: record.hgjldwmc,
    yxbz: khzt
  }
  dwglUpdate(params).then((response) => {
    const { code, desc } = response;
    refUnit.current!.setMasker(false);
    if (code === '200') {
      refUnit.current!.reload2();
      message.success('操作成功！');
      return true;
    } else {
      message.error(desc);
      return false;
    }
  })
}



// 列表自定义渲染
Func.columnsRender = {
  // 客户状态
  renderqybz: (param: any) => {
    let checked = param.text === 'N' ? false : true;
    const html = <Switch size="default" onChange={(checked: any, event: any) => {
      event.stopPropagation(); checked = Func.setKhzt(checked, param);
    }} checkedChildren="启用" unCheckedChildren="停用" checked={checked} />;
    return html;
  },
}
export default Func;