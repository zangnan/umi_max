import React from 'react';
import 'moment/locale/zh-cn';

const Func: any = {
  refUnit: React.createRef(),
};

Func.handleJmbgdDy = (param: any) => {
  const { selectionRows, refUnit, gridRef, otherRef} = param;
  const searchModel: any = [];
  const gridValues = refUnit.current?.getGridParams();
  gridValues.searchModel.forEach((item: any) => {
    searchModel.push(item);
  });
  const headerValues = param.refGrid.current?.getHeaderFilter();
  if (headerValues && headerValues.length > 0) {
    headerValues.forEach((item: any) => {
      searchModel.push(item);
    });
  }
  if (selectionRows && selectionRows.length > 0) {
    const selectedModel: any = [];
    selectionRows.forEach((item: any) => {
      selectedModel.push({ckbgdh: item.ckbgdh});
    });
    searchModel.push({property: "uuid", values: selectedModel, op: "ain"});
  }
  const params = {
    key : gridValues.key + '_DY',
    searchModel: searchModel
  };
  otherRef[0].current!.showModal(params);
}

Func.columnsRender = {
  // 加贸反馈数据查询-加工贸易手（账）册数据-进口报关单
  renderJmfkSzccxJkbgd: (param: any) => {
    const val = (param.record.jkbgdzs ? param.record.jkbgdzs : 0) + "/" + (param.record.jkbgdts ? param.record.jkbgdts : 0);
    return (
      <div>
        {val}
      </div>
    );
  },
  // 加贸反馈数据查询-加工贸易手（账）册数据-出口报关单
  renderJmfkSzccxCkbgd: (param: any) => {
    const val = (param.record.ckbgdzs ? param.record.ckbgdzs : 0) + "/" + (param.record.ckbgdts ? param.record.ckbgdts : 0);
    return (
      <div>
        {val}
      </div>
    );
  }
}

export default Func;