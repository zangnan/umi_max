/**
 * title: 备案单证 - 资料归档
 */
import { message, Popover } from 'antd';
import React from 'react';
import myUtil, { intl as intl2 } from '@/components/DDAssist/util';
import { cancellationOfFiling, dataArchiving, dzbaZlgdXz } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/components/DDAlert';

const zlgdFunc: any = {
  unitRef: React.createRef(),
};

// 资料归档
zlgdFunc.dataArchiving = (param: any, event: any) => {
  const { selectionRows, unitRef, gridRef } = param;
  if (!selectionRows || selectionRows.length === 0) {
    const pagination  = gridRef.current.getPagination().total;
    DDAlert.open({
      title: '资料归档',
      info: `确认对当前${pagination}条数据进行资料归档的操作吗？`,
      modalType: 'info',
      infoType: 'question',
      isFormContent: false,
      okCallbackFn: function (thisObj: any) {
        const searchModel = param.unitRef.current.getGridParams().searchModel;
        unitRef.current!.setMasker(true);
        dataArchiving({adQuery:searchModel}).then((res: any) => {
          unitRef.current!.setMasker(false);
          if (res.code == '200') {
            message.success(intl2.formatMessage({ id: 'message_badz_zlgd_success' }));
            gridRef.current?.reload();
          } else {
            message.error(res.desc)
          }
        })
      }});
  } else {
    // 备案单证 - 资料归档 - 资料归档
    const uuids: any = [];
    for (let i = 0; i < selectionRows.length; i++) {
      uuids.push(selectionRows[i].badzbgduuid);
    }
    unitRef.current!.setMasker(true);
    dataArchiving({ badzbgduuids: uuids }).then((res: any) => {
      unitRef.current!.setMasker(false);
      if (res.code == '200') {
        message.success(intl2.formatMessage({ id: 'message_badz_zlgd_success' }));
        gridRef.current?.reload();
      } else {
        message.error(res.desc)
      }
    })
    //unitRef.current!.reload2();
  }
}
// 撤销备案
zlgdFunc.cancellationOfFiling = (param: any, event: any) => {
  const { selectionRows, unitRef } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    // 备案单证 - 资料归档 - 撤销备案
    const bgdss: any = [];
    for (let i = 0; i < selectionRows.length; i++) {
      bgdss.push({ badzbgduuid: selectionRows[i].badzbgduuid, dzfs: selectionRows[i].dzfs })
    }
    DDAlert.open({
      title: '撤销备案',
      info: intl2.formatMessage({ id: 'message_badz_cancellation_filing_question' }),
      infoType: 'question',
      modalType: 'confirm',
      closeStatus: true,
      okCallbackFn: function (thisObj: any) {
        thisObj.setState({ masker: true });
        const obj = {
          bgds: bgdss
        }
        cancellationOfFiling(obj).then((res: any) => {
          thisObj.setState({ masker: false });
          if (res.code == '200') {
            message.success(intl2.formatMessage({ id: 'message_badz_cancellation_filing_success' }));
          } else {
            message.error(res.desc)
          }
          unitRef.current!.reload2();
        })
      },
    });
  }
}
// 预览
zlgdFunc.dzbaZlgdPreview = (param: any, event: any) => {
  event.stopPropagation();
  const { unitRef, record } = param;
  // 打开弹窗
  const otherRef = param.unitRef.current?.getOtherRefs();
  unitRef.current!.setMasker(true);
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(record, unitRef, 'zlgd');
    unitRef.current!.setMasker(false);
  } else if (param.otherRef && param.otherRef[0]) {
    param.otherRef[0].current?.showModal(record, unitRef, 'zlgd');
    unitRef.current!.setMasker(false);
  }
}

// 下载
zlgdFunc.dzbaZlgdXz = (param: any, event: any) => {
  event.stopPropagation();
  const { record, unitRef } = param;
  const arry: any = [];
  arry.push(record.badzbgduuid);
  const model = {
    badzbgduuids: arry
  }
  unitRef.current!.setMasker(true);
  // 备案单证 - 资料归档 - 下载
  dzbaZlgdXz(model).then((response) => {
    unitRef.current!.setMasker(false);
    if (response.code === '200') {
      const { blob, fileName } = response.body;
      myUtil.file.downloadZip(blob, fileName);
    } else {
      message.error(response.desc)
    }
  })
}
// 下载按钮状态
zlgdFunc.dzbzZlcjXzDisable = (record: any) => {

  if (record.dzfs == 0) {
    return true;
  } else {
    return false;
  }
};

// 列表自定义渲染
zlgdFunc.columnsRender = {

  // 备案单证出口发票号
  renderBadzCkfph: (param: any) => {
    let col: any = <></>;
    if (param.text) {
      const array: any = param.text?.split(',');
      const arrayContent: any = [];
      array.forEach((element: any) => {
        arrayContent.push(<div key={element}>{element}</div>)
      });
      if (array.length > 1) {
        col = <div><Popover placement="right" content={arrayContent} title='出口发票号'><span>{array[0]}...</span></Popover></div>;
      } else {
        col = array[0];
      }
    }
    return col;
  },

  // 备案单证进货凭证号
  renderBadzJhpzh: (param: any) => {
    let col: any = <></>;
    if (param.text) {
      const array: any = param.text?.split(',');
      const arrayContent: any = [];
      array.forEach((element: any) => {
        arrayContent.push(<div key={element}>{element}</div>)
      });
      if (array.length > 1) {
        col = <div><Popover placement="right" content={arrayContent} title='进货凭证号'><span>{array[0]}...</span></Popover></div>;
      } else {
        col = array[0];
      }
    }
    return col;
  },

}

export default zlgdFunc;