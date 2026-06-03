import DDAlert from '@/components/DDAlert';
import React from 'react';
import { calBgdTjmyj, calHzqdTjmyj } from '@/services/hts/api';
import 'moment/locale/zh-cn';
import { message } from 'antd';
import { intl as intl2 } from  '@/pages/common/myUtil';

const Func: any = {
  unitRef: React.createRef(),
};

// 海关核注清单-打印
Func.handleHghzqdDy = (param: any) => {
  const { selectionRows, unitRef, gridRef, otherRef} = param;
  const gridData = unitRef.current?.getGridData();
  if (!gridData || gridData.length <= 0) {
    message.info(Func.initHzqd.formatMessage({ id: 'message_common_nodata_print' }));
    return;
  }
  const searchModel: any = [...param?.unitRef?.current?.getGridParams()?.initSearchModal];

  const gridValues = unitRef.current?.getGridParams();
  gridValues.searchModel.forEach((item: any) => {
    searchModel.push(item);
  });
  const headerValues = gridRef.current?.getHeaderFilter();
  if (headerValues && headerValues.length > 0) {
    headerValues.forEach((item: any) => {
      searchModel.push(item);
    });
  }
  if (selectionRows && selectionRows.length > 0) {
    const selectedModel: any = [];
    selectionRows.forEach((item: any) => {
      selectedModel.push(item.qdbh);
    });
    searchModel.push({property: "qdbh", values: selectedModel, op: "ain"});
  }
  let keys = '';
  if(param.unit_key=='JLJG_ZXSB_SB_JLJG_ZNFX_SJHQ_BSHZQD'){
    keys='ZXSB_SB_JLJG_ZNFX_SZCHZQD_QUERY_REPORT'
  }else if (param.unit_key=='JLJG_ZXSB_SB_JLJG_ZNFX_SJHQ_HGBGD'){
    keys='ZXSB_SB_JLJG_ZNFX_BGD18_QUERY_REPORT'
  }else if (param.unit_key=='ZXSB_WBSJ_DY_SZCHZQDMX'){
    keys='ZXSB_SB_JLJG_SJXZ_SZCHZQD_QUERY_REPORT'
  }else{
    keys='ZXSB_SB_JLJG_SJXZ_BGD18_QUERY_REPORT'
  }
  const params = {
    key : keys,
    searchModel: searchModel,
  };
  otherRef[0].current!.showModal(params,param);
}

Func.handleHgbgdDy = (param: any) => {
  const { selectionRows, unitRef, gridRef, otherRef} = param;
  const gridData = unitRef.current?.getGridData();
  if (!gridData || gridData.length <= 0) {
    message.info(Func.initBgd.formatMessage({ id: 'message_common_nodata_print' }));
    return;
  }
  const searchModel: any = [...param?.unitRef?.current?.getGridParams()?.initSearchModal];
  const gridValues = unitRef.current?.getGridParams();
  gridValues.searchModel.forEach((item: any) => {
    searchModel.push(item);
  });
  const headerValues = gridRef.current?.getHeaderFilter();
  if (headerValues && headerValues.length > 0) {
    headerValues.forEach((item: any) => {
      searchModel.push(item);
    });
  }
  if (selectionRows && selectionRows.length > 0) {
    const selectedModel: any = [];
    selectionRows.forEach((item: any) => {
      selectedModel.push(item.bgdhgbh);
    });
    searchModel.push({property: "bgdhgbh", values: selectedModel, op: "ain"});
  }
  const params = {
    key : 'ZXSB_SB_JLJG_SJXZ_BGD18_QUERY_REPORT',
    searchModel: searchModel
  };
  otherRef[0].current!.showModal(params,param);
}

// 重新计算统计美元价.
Func.handleBgdJstjmyj = (param: any) => {
  const { selectionRows, unitRef, gridRef, otherRef} = param;
  const searchModel: any = [];
  const gridValues = unitRef.current?.getGridParams();
  gridValues.searchModel.forEach((item: any) => {
    searchModel.push(item);
  });
  const headerValues = gridRef.current?.getHeaderFilter();
  if (headerValues && headerValues.length > 0) {
    headerValues.forEach((item: any) => {
      searchModel.push(item);
    });
  }
  if (selectionRows && selectionRows.length > 0) {
    const selectedModel: any = [];
    selectionRows.forEach((item: any) => {
      selectedModel.push(item.bgdhgbh);
    });
    searchModel.push({property: "bgdhgbh", values: selectedModel, op: "ain"});
  }
  const params = {
    key : 'JLJG_SJXZ_JSFX_BGD_TJMYJ',
    searchModel: searchModel
  };
  DDAlert.open({
    title: '系统提示',
    info: intl2.formatMessage({ id: 'message_jljghx_hgbgd_jstjmyj_title' }),
    infoType: 'info',
    closeStatus: false,
    isFormContent: true,
    modalType: 'confirm',
    okCallbackFn: function (thisObj: any) {
      thisObj.setState({ masker: true });
      calBgdTjmyj(params).then((response) => {
        thisObj.setState({ masker: false });
        if (response.code === '200') {
          DDAlert.close();
          message.success('重新计算美元金额成功！');
        } else {
          DDAlert.close();
          message.error('重新计算美元金额失败！');
        }
        gridRef.current!.reload();
      })
    },
    content: '确定选择的数据重新计算美元金额吗？'
  });
};

// 重新计算统计美元价.
Func.handleHzqdJstjmyj = (param: any) => {
  const { selectionRows, unitRef, gridRef, otherRef} = param;
  const searchModel: any = [];
  const gridValues = unitRef.current?.getGridParams();
  gridValues.searchModel.forEach((item: any) => {
    searchModel.push(item);
  });
  const headerValues = gridRef.current?.getHeaderFilter();
  if (headerValues && headerValues.length > 0) {
    headerValues.forEach((item: any) => {
      searchModel.push(item);
    });
  }
  if (selectionRows && selectionRows.length > 0) {
    const selectedModel: any = [];
    selectionRows.forEach((item: any) => {
      selectedModel.push(item.dybgdhgbh);
    });
    searchModel.push({property: "bgdhgbh", values: selectedModel, op: "ain"});
  }
  const params = {
    key : 'JLJG_SJXZ_JSFX_HZQD_TJMYJ',
    searchModel: searchModel
  };
  DDAlert.open({
    title: '系统提示',
    info: intl2.formatMessage({ id: 'message_jljghx_hgbgd_jstjmyj_title' }),
    infoType: 'info',
    closeStatus: false,
    isFormContent: true,
    modalType: 'confirm',
    okCallbackFn: function (thisObj: any) {
      thisObj.setState({ masker: true });
      calHzqdTjmyj(params).then((response) => {
        thisObj.setState({ masker: false });
        if (response.code === '200') {
          DDAlert.close();
          message.success('重新计算美元金额成功！');
        } else {
          DDAlert.close();
          message.error('重新计算美元金额失败！');
        }
        gridRef.current!.reload();
      })
    },
    content: '确定选择的数据重新计算美元金额吗？'
  });
};

// 加贸海关数据查询-加工贸易手册数据-进口报关单
Func.columnsRender = {
  renderJmhgSccxJkbgd: (param: any) => {
    const val = (param.record.hgjkbgdzs ? param.record.hgjkbgdzs : 0) + "/" + (param.record.hgjkbgdts ? param.record.hgjkbgdts : 0);
    return (
      <div>
        {val}
      </div>
    );
  },
  // 加贸海关数据查询-加工贸易手册数据-出口报关单
  renderJmhgSccxCkbgd: (param: any) => {
    const val = (param.record.hgckbgdzs ? param.record.hgckbgdzs : 0) + "/" + (param.record.hgckbgdts ? param.record.hgckbgdts : 0);
    return (
      <div>
        {val}
      </div>
    );
  },
  // 加贸海关数据查询-加工贸易手册数据-进口核注清单
  renderJmhgSccxJkhzqd: (param: any) => {
    const val = (param.record.hgjkhzqdzs ? param.record.hgjkhzqdzs : 0) + "/" + (param.record.hgjkhzqdts ? param.record.hgjkhzqdts : 0);
    return (
      <div>
        {val}
      </div>
    );
  },
  // 加贸海关数据查询-加工贸易手册数据-出口核注清单
  renderJmhgSccxCkhzqd: (param: any) => {
    const val = (param.record.hgckhzqdzs ? param.record.hgckhzqdzs : 0) + "/" + (param.record.hgckhzqdts ? param.record.hgckhzqdts : 0);
    return (
      <div>
        {val}
      </div>
    );
  },
    // 加贸海关数据查询-加工贸易账册数据-进口报关单
  renderJmhgZccxJkbgd: (param: any) => {
    const val = (param.record.hgjkbgdzs ? param.record.hgjkbgdzs : 0) + "/" + (param.record.hgjkbgdts ? param.record.hgjkbgdts : 0);
    return (
      <div>
        {val}
      </div>
    );
  },

  // 加贸海关数据查询-加工贸易账册数据-出口报关单
  renderJmhgZccxCkbgd: (param: any) => {
    const val = (param.record.hgckbgdzs ? param.record.hgckbgdzs : 0) + "/" + (param.record.hgckbgdts ? param.record.hgckbgdts : 0);
    return (
      <div>
        {val}
      </div>
    );
  },

  // 加贸海关数据查询-加工贸易账册数据-进口核注清单
  renderJmhgZccxJkhzqd: (param: any) => {
    const val = (param.record.hgjkhzqdzs ? param.record.hgjkhzqdzs : 0) + "/" + (param.record.hgjkhzqdts ? param.record.hgjkhzqdts : 0);
    return (
      <div>
        {val}
      </div>
    );
  },
  // 加贸海关数据查询-加工贸易账册数据-出口核注清单
  renderJmhgZccxCkhzqd: (param: any) => {
    const val = (param.record.hgckhzqdzs ? param.record.hgckhzqdzs : 0) + "/" + (param.record.hgckhzqdts ? param.record.hgckhzqdts : 0);
    return (
      <div>
        {val}
      </div>
    );
  }
}


export default Func;