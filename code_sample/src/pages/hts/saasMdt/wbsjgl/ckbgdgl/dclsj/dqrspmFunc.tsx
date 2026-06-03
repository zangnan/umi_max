import React from 'react';
import {queryPager, checkCkspSheet, getBgdInfoHgck, bgdpdfyl } from '@/services/hts/api';
import { message, Tooltip } from 'antd';
import { intl as intl2 } from '@/pages/common/myUtil';
import CkbgdFunc from "../../common/CkbgdFunc";

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
      key: 'WBSJ_CKBGD_QUERY_PAGE',
      page: 1,
      pageSize: 999999,
      searchModel: allSearchModel,
    }
    queryPager(obj).then((res: any)=> {
      const {code, body, msg} = res;
      if(code === '200') {
        uuids = body.rows;
        const obj2 = {
          uuids,
          ywlx: 'ckbgd',
        }
        allSearchModel.push({ property: 'ywlx', value: "ckbgd", op: 'zdy' });
        allSearchModel.push({ property: 'uuids', value: uuids, op: 'zdy' });
        const removedArr = allSearchModel.filter((x: any) => x.property !== "sfcxZj" );
        apiCheckCkspSheet(param, obj2, allSearchModel, removedArr);
      } else {
        message.info(msg)
      }
    })
  } else {
    const obj2 = {
      uuids: selectionRowKeys,
      ywlx: 'ckbgd',
    }
    allSearchModel.push({ property: 'ywlx', value: "ckbgd", op: 'zdy' });
    allSearchModel.push({ property: 'uuids', values: selectionRowKeys, op: 'zdy' });
    const removedArr = allSearchModel.filter((x: any) => x.property !== "sfcxZj" );
    apiCheckCkspSheet(param, obj2, allSearchModel, removedArr);
  }
}

const apiCheckCkspSheet = (param: any, obj: any, allSearchModel: any, obj3: any) => {
  const {otherRef, unitRef} = param;
  checkCkspSheet(obj).then((res:any)=> {
    const {code, msg, body} = res;
    if(code === '200') {
      const param = {
        keys: obj.uuids,
        ywlx: obj.ywlx,
      }
      otherRef[1].current?.showModal(unitRef, param, otherRef[2], obj3, body);
    } else {
      message.error(msg);
    }
  })
}


ckfpFunc.columnsRender= {
  renderBgdscmx18bgdh: (param: any) => {
    const ckbgdh = param?.text;
    const html = <a onClick={(e)=>{ e.stopPropagation();ckfpFunc.openCkbgdh2(param, ckbgdh)}}>{ckbgdh}</a>;
    const html2 = <Tooltip title={ckbgdh}>{html}</Tooltip>;
    return html2;
  },
};

ckfpFunc.openCkbgdh = (param: any, ckbgd: any) => {
  const {otherRef } = param;
  ckbgd = ckbgd.substring(0, 18);
  getBgdInfoHgck({ckbgdh: ckbgd}).then((res: any) => {
    if (res.code == '200') {
      otherRef[0].current?.showModal(param, ckbgd, res?.body);
    }
  })
}

ckfpFunc.openCkbgdh2 = (param: any, ckbgd: any) => {
  const { otherRef, record, unitRef} = param;
  unitRef.current!.setMasker(true);
  bgdpdfyl({ uuid: record?.uuid, bgdhgbh: record?.bgdhgbh }).then((res: any) => {
    unitRef.current!.setMasker(false);
    if (res.code == '200') {
      otherRef[0].current?.showModal(res?.body, { uuid: record?.uuid, bgdhgbh: record?.bgdhgbh });
    } else {
      message.error(res.msg);
    }
  })
}

// 转不退税
ckfpFunc.btnZbts = (param: any) => {
  const { otherRef } = param;
  CkbgdFunc.btnZbts(param, otherRef[2].current);
  /*const { unitRef, selectionRowKeys, otherRef } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  DDAlert.open({
    title: '转不退税',
    info: '确定对勾选数据进行转不退税操作吗？',
    modalType: 'confirm',
    infoType: 'question',
    okCallbackFn: function (thisObj: any) {
      thisObj.setState({ masker: true });
      const data = { uuids: selectionRowKeys };
      bgdzbts(data).then((response: any) => {
        const { code, msg } = response;
        if (code === '200') {
          message.success('转不退税成功！');
          // 刷新头部条数
          otherRef[2].current!.getDclsjBttj();
          setTimeout(() => {
            unitRef.current!.reload2();
            close();
            thisObj.setState({ masker: false });
          },300)
        } else {
          message.error(msg);
          thisObj.setState({ masker: false });
        }
      })
    }
  })*/
}


export default ckfpFunc;
