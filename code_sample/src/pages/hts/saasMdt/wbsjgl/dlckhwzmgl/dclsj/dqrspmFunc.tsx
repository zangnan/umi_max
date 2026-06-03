import React from 'react';
import {queryPager, checkCkspSheet } from '@/services/hts/api';
import { message } from 'antd';
import { intl as intl2 } from '@/pages/common/myUtil';

const ckfpFunc: any = {
  unitRef: React.createRef(),
};

// 批量补填
ckfpFunc.btnPlbt = (param: any) => {
  const { unitRef, selectionRowKeys, gridRef } = param;
  const gridData = unitRef.current?.getGridData();
  if(gridData.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_common_type_no_griddata' }));
    return;
  }
  const searchModel = unitRef.current?.getGridParams().searchModel || [];
  const headerSearchModel = gridRef.current?.getHeaderFilter() || [];
  const allSearchModel: any = searchModel.concat(headerSearchModel);
  allSearchModel.push({ property: 'cxlx', value: '2', op: 'zdy' });
  allSearchModel.push({ property: 'sfcxZj', value: "Y", op: 'zdy' });
  let uuids:any = [];
  if(selectionRowKeys.length === 0) {
    const obj = {
      key: 'CX_SAAS_MDT_DLCKHWZMGL',
      page: 1,
      pageSize: 999999,
      searchModel: allSearchModel,
    }
    queryPager(obj).then((res: any)=> {
      const {code, body, msg} = res;
      if(code === '200') {
        uuids = body.rows;
        if(uuids.length > 0) {
          const obj2 = {
            uuids,
            ywlx: 'dlckhwzm',
          }
          allSearchModel.push({ property: 'ywlx', value: "dlckhwzm", op: 'zdy' });
          const removedArr = allSearchModel.filter((x: any) => x.property !== "sfcxZj" );
          apiCheckCkspSheet(param, obj2, allSearchModel, removedArr);
        } else {
          message.info(intl2.formatMessage({ id: 'message_common_type_no_griddata' }));
        }
      }
    })
  } else {
    const obj2 = {
      uuids: selectionRowKeys,
      ywlx: 'dlckhwzm',
    }
    allSearchModel.push({ property: 'ywlx', value: "dlckhwzm", op: 'zdy' });
    allSearchModel.push({ property: 'uuids', values: selectionRowKeys, op: 'zdy' });
    const removedArr = allSearchModel.filter((x: any) => x.property !== "sfcxZj" );
    apiCheckCkspSheet(param, obj2, allSearchModel, removedArr);
  }
}

const apiCheckCkspSheet = (param: any, obj: any, allSearchModel: any, obj3: any) => {
  const {otherRef, unitRef} = param;
  checkCkspSheet(obj).then((res:any)=> {
    const {code, body, msg} = res;
    if(code === '200') {
      const param = {
        keys: obj.uuids,
        ywlx: obj.ywlx,
      }
      if(!body.kzmts && !body.tzmts) {
        message.info(intl2.formatMessage({ id: 'message_common_type_no_griddata' }));
        return;
      }
      otherRef[0].current?.showModal(unitRef, param, otherRef[1], obj3, body);
    } else {
      message.error(msg);
    }
  })
}

ckfpFunc.columnsRender= {
};

export default ckfpFunc;