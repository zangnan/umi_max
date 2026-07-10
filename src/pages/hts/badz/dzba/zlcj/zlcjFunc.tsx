/**
 * title: 备案单证 - 单证备案 - 资料采集
 */
import { message, Badge, Popover } from 'antd';
import React from 'react';
import myUtil, { intl as intl2 } from '@/components/DDAssist/util';
import { completeFiling, dzbaZlcjXz } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/components/DDAlert';

const zlcjFunc: any = {
  refUnit: React.createRef(),
};

// 关联单证
zlcjFunc.relatedDocuments = (param: any, event: any) => {
  const { selectionRows, refUnit } = param;
  // 选择数据条数判断
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRows.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_badz_dzba_zlcj_dzgl_warning' }));
    return;
  }
  // 打开单证信息弹窗
  const otherRef = param.refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[1]) {
    otherRef[1].current?.showModal(param, refUnit, 'gldz');
  } else if (param.otherRef && param.otherRef[1]) {
    param.otherRef[1].current?.showModal(param, refUnit, 'gldz');
  }
}

// 解除关联
zlcjFunc.disassociate = (param: any, event: any) => {
  const { selectionRows, refUnit } = param;
  // 选择数据条数判断
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRows.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_badz_dzba_zlcj_jcgl_warning' }));
    return;
  }
  if (selectionRows[0].dzbaztDm == '1') {
    message.info(intl2.formatMessage({ id: 'message_badz_dzba_zlcj_jcglzt_warning' }));
    return;
  }
  // 打开单证信息弹窗
  const otherRef = param.refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[1]) {
    otherRef[1].current?.showModal(param, refUnit, 'jcgl');
  } else if (param.otherRef && param.otherRef[1]) {
    param.otherRef[1].current?.showModal(param, refUnit, 'jcgl');
  }
}
// 完成备案
zlcjFunc.completeFiling = (param: any, event: any) => {
  const { selectionRows, refUnit, selectionRowKeys, gridRef } = param;
  const gridData = refUnit.current?.getGridData();
  if (!gridData || gridData.length <= 0) {
    message.info('当前页面无可完成备案的数据！');
    return;
  }

  let title = '';
  let infoType = 'warning';
  let data = {}
  if(selectionRows.length > 0) {
    data = { badzbgduuids: selectionRowKeys };
    title = '完成备案后，请到资料归档界面进行资料归档。';
    infoType = 'warning';
  } else {
    title = '确认对当前筛选条件下所有数据进行完成备案操作？';
    infoType = 'question';
    const searchModel: any = [...refUnit?.current?.getGridParams()?.initSearchModal];

    const gridValues = refUnit.current?.getGridParams();
    gridValues.searchModel.forEach((item: any) => {
      searchModel.push(item);
    });
    const headerValues = gridRef.current?.getHeaderFilter();
    if (headerValues && headerValues.length > 0) {
      headerValues.forEach((item: any) => {
        searchModel.push(item);
      });
    }
    if(searchModel?.length > 0) {
      searchModel.forEach((item: any) => {
        if(item.value) {
          data[item.property] = item.value
        } else {
          data[item.property] = item.values
        }
      });
    }
  }

  DDAlert.open({
    title: '完成备案',
    info: title,
    infoType,
    modalType: 'confirm',
    closeStatus: false,
    okCallbackFn: function (thisObj: any) {
      // 备案单证 - 单证备案 - 资料采集 - 完成备案
      thisObj.setState({ masker: true });
      completeFiling(data).then((res: any) => {
        thisObj.setState({ masker:  false});
        DDAlert.close();
        if (res.code == '200') {
          message.success(intl2.formatMessage({ id: 'message_badz_complete_filing_success' }));
          refUnit.current!.reload();
        } else {
          message.error(res.desc)
        }
      })
    }
  });
}
// 下载
zlcjFunc.dzbaZlcjXz = (param: any, event: any) => {
  event.stopPropagation();
  const { record, refUnit } = param;
  const badzbgduuid = record.badzbgduuid;
  const model = { badzbgduuids: [badzbgduuid] }
  refUnit.current!.setMasker(true);
  // 备案单证 - 单证备案 - 资料查询 - 下载
  dzbaZlcjXz(model).then((response) => {
    refUnit.current!.setMasker(false);
    if (response.code === '200') {
      const { blob, fileName } = response.body;
      myUtil.file.downloadZip(blob, fileName);
    } else {
      message.error(response.desc)
    }
  })
  // badzUtil.common.xzzl(param);
}


// 上传单证：导入
zlcjFunc.dzbaZlcjImport = (param: any) => {
  const { refUnit, selectionRows } = param;
  // 选择数据条数判断
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRows.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_badz_dzba_zlcj_scdz_warning' }));
    return;
  }
  // 打开弹窗
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(selectionRows[0], refUnit, 'dr');
  } else if (param.otherRef && param.otherRef[0]) {
    param.otherRef[0].current?.showModal(selectionRows[0], refUnit, 'dr');
  }
}

// 上传单证：扫描
zlcjFunc.dzbaZlcjSm = async (param: any) => {
  const { refUnit, selectionRows, } = param;
  // 选择数据条数判断
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRows.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_badz_dzba_zlcj_scdz_warning' }));
    return;
  }
  // 打开弹窗
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(selectionRows[0], refUnit, 'sm');
  } else if (param.otherRef && param.otherRef[0]) {
    param.otherRef[0].current?.showModal(selectionRows[0], refUnit, 'sm');
  }
}

// 下载按钮状态
zlcjFunc.dzbzZlcjXzDisable = (record: any) => {
  if (record.dzbaztDm === '2') {
    return false;
  } else {
    return true;
  }
};

// 列表自定义渲染
zlcjFunc.columnsRender = {
  // 资料采集
  renderBadzBaztZlcj: (param: any) => {
    let col: any = <></>;
    if (param.text === '1') {
      // 待备案
      col = (
        <span className="dd_grid_icon">
          <Badge status="default" />{myUtil.code.getCodeValByKey(param.text, 'CODE_DM_BADZ_BAZT:01')}
        </span>
      );
    } else if (param.text === '2') {
      // 备案中
      col = (
        <span className="dd_grid_icon">
          <Badge status="processing" />{myUtil.code.getCodeValByKey(param.text, 'CODE_DM_BADZ_BAZT:01')}
        </span>
      );
    }
    return col;
  },

  // 出口发票号、进货凭证号特殊显示
  renderCkfphJhpzh: (param: any) => {
    let col: any = <></>;
    if (param.text) {
      const array: any = param.text?.split(',');
      const arrayContent: any = [];
      let title = '';
      array.forEach((element: any) => {
        arrayContent.push(<div key={element}>{element}</div>)
      });
      if (param.text === param.record.ckfph) {
        title = '出口发票号';
      } else if (param.text === param.record.jhpzh) {
        title = '进货凭证号';
      }
      // 出口发票号数组大于1，弹出层显示
      if (array.length > 1) {
        col = <div><Popover placement="right" content={arrayContent} title={title}><span>{array[0]}...</span></Popover></div>;
      } else {
        col = array[0];
      }
    }
    return col;
  },
}

export default zlcjFunc;