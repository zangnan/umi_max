/**
 * title: 智能分析-分析状态功能实现
 * author: yxy
 */
import cktsUtil from '@/pages/hts/cktsUtil';
import React from 'react';
import { message } from 'antd';
import {znfxszhl } from '@/pages/hts/services/htsApi';
import { intl as intl2 } from '@/components/DDAssist/util';
import myUtil from '@/components/DDAssist/util';

const ZnfxBdjgFunc: any = {
  refUnit: React.createRef(),
};

const dealCs = (params: any, tgbz: any) => {
  const { selectionRows, refUnit, gridRef} = params;
  const uuids: any[] = [];
  if (selectionRows && selectionRows.length > 0) {
    for (let i = 0; i < selectionRows.length; i++ ) {
      uuids.push(selectionRows[i].uuid);
    }
  }
  const data: any = {
    key: 'JLJG_ZXSB_SB_JLJG_ZNFX_XGTGBZ',
    zdyModel : {
      tgbz: tgbz
    },
  };
  if (uuids.length > 0) {
    data.searchModel= [{property: 'uuid', values: uuids, op: 'ain'}];
  } else {
    const commonValue = refUnit.current?.getGridParams();
    const initVal = commonValue.initSearchModal;
    const val = commonValue.searchModel;
    const headerVal = gridRef.current?.getHeaderFilter();
    const model: any = [];
    if (initVal) {
      initVal.forEach((item: any) => {
        model.push(item);
      });
    }
    if (val) {
      val.forEach((item: any) => {
        model.push(item);
      });
    }
    if (headerVal) {
      headerVal.forEach((item: any) => {
        model.push(item);
      });
    }
    data.searchModel= model;
  }
  return data;
}
// 设置忽略
ZnfxBdjgFunc.handleZnfxBdjgSzhl = (params: any) => {
  const { refUnit} = params;
  const data = dealCs(params, 'Y');
  data.hlModel = data.searchModel
  refUnit.current?.setMasker(true);
  delete data.searchModel;
  znfxszhl(data).then((response) => {
    refUnit.current?.setMasker(false);
    const {code, body} = response;
    if (code === '200') {
      refUnit.current?.setSelectionRowKeys([]);
      refUnit.current?.setSelectionRows([]);
      refUnit.current?.reload();
      const tmpMessage = intl2.formatMessage({ id: 'message_jljghx_znfx_bdjg_szhl' });
      const successMessage = cktsUtil.text.formatRepalce(tmpMessage, body);
      message.success(successMessage);
    } else {
      message.error(response.desc);
      return;
    }
  })
}

// 取消忽略
ZnfxBdjgFunc.handleZnfxBdjgQxhl = (params: any) => {
  const { refUnit} = params;
  const data = dealCs(params, 'N');
  data.hlModel = data.searchModel
  refUnit.current?.setMasker(true);
  delete data.searchModel;
  znfxszhl(data).then((response) => {
    refUnit.current?.setMasker(false);
    const {code, body} = response;
    if (code === '200') {
      refUnit.current?.setSelectionRowKeys([]);
      refUnit.current?.setSelectionRows([]);
      refUnit.current?.reload();
      const tmpMessage = intl2.formatMessage({ id: 'message_jljghx_znfx_bdjg_qxhl' });
      const successMessage = cktsUtil.text.formatRepalce(tmpMessage, body);
      message.success(successMessage);
    } else {
      message.error(response.desc);
      return;
    }
  })
}

export default ZnfxBdjgFunc;