import React from 'react';
import wxspFunc from '../wxspglFunc';
import qtspglFunc from '../qtspglFunc';

const Func: any = {
  unitRef: React.createRef(),
};

Func.handleFpsqdTzSave = (param: any) => {
  const { record, otherRef, unitRef } = param;
  // 主页面的ref
  const mainRef = otherRef[0].mainRef;
  // 侧滑赋码主页面
  const fmMainRef = otherRef[1];
  // 展示类型 wxspGrid:外销商品列表  wxspForm:外销商品表单 fpsqd：发票申请单 abgdkj：按报关单开具
  const zslx = otherRef[0].zslx;
  if (zslx === 'fpsqd') {
    // 发票申请单
    mainRef.current!.CallbackFmFunc({ record, fmMainRef, hwxx: otherRef[0].data });
  } else if (zslx === 'wxspForm') {
    // 外销商品新建表单
    wxspFunc.setFormValues({ form: otherRef[0].form, record, fmMainRef });
  } else if (zslx === 'wxspGrid') {
    // 外销商品列展示
    wxspFunc.setGridWxspfm({ selectRows: otherRef[0].data, fmUnitRef: unitRef, wxspGridRef: mainRef, record, fmMainRef });
  } else if (zslx === 'abgdkj') {
    // 按报关开具 设置税收分类编码
    mainRef.current!.CallbackFmFunc({ record, fmMainRef, data: otherRef[0].data });
  } else if (zslx === 'qtspForm') {
    // 其他商品新建表单
    qtspglFunc.setFormValues({ form: otherRef[0].form, record, fmMainRef });
  } else if (zslx === 'batchUpdate') {
    // 批量修改页面
    mainRef.current!.CallbackFmFunc({ record, fmMainRef });
  }
}
export default Func;