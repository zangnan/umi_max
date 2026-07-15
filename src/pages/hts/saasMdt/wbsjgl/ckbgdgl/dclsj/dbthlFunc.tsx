import React from 'react';
import { queryPager, getBgdInfoHgck, bgdpdfyl } from '@/pages/hts/services/htsApi';
import { message, Tooltip } from 'antd';
import { intl as intl2 } from '@/components/DDAssist/util';
import CkbgdFunc from "../../common/CkbgdFunc";

const ckfpFunc: any = {
  refUnit: React.createRef(),
};

// 批量补填
ckfpFunc.btnPlbtHl = (param: any) => {
  const { refUnit, selectionRowKeys, gridRef, otherRef } = param;
  const gridData = refUnit.current?.getGridData();
  if(gridData.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_common_type_no_griddata' }));
    return;
  }
  const searchModel = refUnit.current?.getGridParams().searchModel || [];
  const headerSearchModel = param.refGrid.current?.getHeaderFilter() || [];
  const allSearchModel: any = searchModel.concat(headerSearchModel);
  allSearchModel.push({ property: 'cxlx', value: '3', op: 'zdy' });
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
        allSearchModel.push({ property: 'uuids', values: body?.rows, op: 'zdy' });
        let removedArr = allSearchModel.filter((x: any) => x.property !== "sfcxZj" );
        const obj2 = {
          searchModel: removedArr,
          key: 'WBSJ_CKBGD_DBTHL_QUERY_PAGER',
        }
        otherRef[1].current?.showModal(refUnit, uuids, otherRef[2], obj2);
      } else {
        message.info(msg);
      }
    })
  } else {
    allSearchModel.push({ property: 'uuids', values: selectionRowKeys, op: 'zdy' });
    let removedArr = allSearchModel.filter((x: any) => x.property !== "sfcxZj" );
    const obj2 = {
      searchModel: removedArr,
      key: 'WBSJ_CKBGD_DBTHL_QUERY_PAGER',
    }
    otherRef[1].current?.showModal(refUnit, selectionRowKeys, otherRef[2], obj2);
  }
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
  const { otherRef, record, refUnit} = param;
  refUnit.current!.setMasker(true);
  bgdpdfyl({ uuid: record?.uuid, bgdhgbh: record?.bgdhgbh }).then((res: any) => {
    refUnit.current!.setMasker(false);
    if (res.code == '200') {
      otherRef[0].current?.showModal(res?.body, { uuid: record?.uuid, bgdhgbh: record?.bgdhgbh });
    } else {
      message.error(res.msg);
    }
  })
}

ckfpFunc.btnZbts = (param: any) => {
  const { otherRef } = param;
  CkbgdFunc.btnZbts(param, otherRef[2].current);
  /*const { refUnit, selectionRowKeys, otherRef } = param;
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
            refUnit.current!.reload();
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
