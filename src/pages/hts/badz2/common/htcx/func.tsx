import React from 'react';
import 'moment/locale/zh-cn';
import { Button, message } from "antd";
import { intl as intl2 } from '@/components/DDAssist/util';
import { deleteBaqkAndDzRelation, saveBaqkAndDzRelation } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/components/DDAlert';
import cktsUtil from '@/pages/hts/cktsUtil';
const Func: any = {
  refUnit: React.createRef(),
};

// 列表自定义渲染
Func.columnsRender = {
  // 商品名称及数量
  renderSpmcjsl: (param: any) => {
    const { otherRef, record } = param;

    // 根据dzlx获取点击来源调用不同的商品信息接口
    const typeList = {
      "01": "ckxsht",
      "02": "ghht",
      "03": "wmzhfwht",
      "04": "tyd",
      "05": "ysfp",
      "06": "wtngxy",
      "07": "dlbgfwffp",
      "08": "qtdz",
    }
    const type = typeList[record.dzlx];
    return (
      <>
        <Button type="link" onClick={(event: any) => {
          event.stopPropagation();
          otherRef[1].current?.showModal(param, type);
        }}>
          查看详情
        </Button>
      </>
    );
  },
}

// 匹配
Func.costomerToobarMatching = (param: any) => {
  const { otherRef } = param;
  if (otherRef[0]?.record?.sfzdcc === 'Y') {
    message.info('选定数据已完成备案，无法匹配！');
    return;
  }
  otherRef[2].current?.showModal(param, 'ckxsht');
}

// 删除
Func.costomerToobarDelete = async (param: any) => {
  const { otherRef, refUnit, selectionRowKeys, selectionRows } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (otherRef[0]?.record?.sfzdcc === 'Y') {
    message.info('选定数据已完成备案，无法删除！');
    return;
  }
  const obj = {
    uuid: otherRef[0]?.record?.uuid,
    ppgzDm: otherRef[0]?.record?.ppgzDm,
    dzuuids: selectionRowKeys,
    dzlx: selectionRows[0]?.dzlx
  }
  deleteBaqkAndDzRelation(obj).then((response) => {
    const { code, desc } = response;
    if (code === '200') {
      refUnit.current!.reload();
      message.success('数据删除成功');
    } else {
      message.error(desc);
    }
  })
}

// 保存
Func.costomerToobarSave = async (param: any) => {
  const { otherRef, refUnit, selectionRowKeys, selectionRows } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  for (let i = 0; i < selectionRows.length; i++) {
    if (selectionRows[i].wjm == null || selectionRows[i].wjm === ' ' || selectionRows[i].wjm === undefined) {
      message.warning('存在未上传资料的单证，请上传单证资料后再进行匹配');
      return;
    }
  }
  const obj = {
    uuid: otherRef[0]?.record?.uuid,
    lcswsxDm: otherRef[0]?.record?.lcswsxDm,
    ssq: otherRef[0]?.record?.ssq,
    sbpc: otherRef[0]?.record?.sbpc,
    dzuuids: selectionRowKeys,
    dzlx: selectionRows[0]?.dzlx
  }
  saveBaqkAndDzRelation(obj).then((response) => {
    const { code, desc } = response;
    if (code === '200') {
      refUnit.current!.reload();
      otherRef[4]?.refUnit?.current!.reload();
      message.success('单证匹配成功');
    } else {
      message.error(desc);
    }
  })
}

// 预览
Func.handleColumnsYl = (param: any) => {
  const { otherRef } = param;
  if (otherRef && otherRef[0]) {
    otherRef[3].current?.showModal(param, true);
  }
}
// 是否展示预览按钮
Func.ylDisplay = (record: any) => {
  if (record.wjm?.trim()) {
    return false;
  } else {
    return true;
  }
};

Func.commonPlxz =(param:any,dzlx:string) => {
  const { selectionRowKeys, selectionRows, refUnit, gridRef } = param;
  // 当前页面的数据
  const gridData = refUnit.current?.getGridData();
  if (!gridData || gridData.length <= 0) {
    message.info('当前页面无可下载的数据！');
    return;
  }
  // 定义一个传递给后端的参数
  let downloadParam:any = {};
  // 出口销售合同为01，后续
  downloadParam.dzlx = dzlx;
  // 获取选中的数据
  if (selectionRowKeys.length > 0) {
    downloadParam.uuids = selectionRowKeys;
  }
  // 获取筛选条件
  const searchModel = refUnit.current?.getGridParams().searchModel;
  const headerSearchModel = gridRef.current?.getHeaderFilter();
  const allSearchModel: any = searchModel.concat(headerSearchModel);
  convertAdQueryToSearchModel(allSearchModel,downloadParam);
  // 此时拿到了所有的条件，准备下载附件 
  DDAlert.open({
    title: '系统提示',
    info: '确定批量下载当前条件下的附件数据？',
    infoType: 'question',
    modalType: 'confirm',
    okCallbackFn: async function (thisObj: any) {
      thisObj.setState({ masker: true });
      await cktsUtil.downloadFilePost("/yw/badze/gtgn/plxzBadzWj", downloadParam);
      thisObj.setState({ masker: false });
    },
  });
}

Func.convertJcppParam= (adQuery: [], searchModel:any = {}) => {
  convertAdQueryToSearchModel(adQuery,searchModel);
}
const convertAdQueryToSearchModel = (adQuery: [], searchModel:any = {}) => {

  adQuery.forEach((item) => {
    const { op, property, value, values } = item;

    if (!property) return; // 如果property不存在，跳过当前项

    switch (op) {
      case 'dydy':
      case '>=':
        searchModel[`${property}Start`] = new Date(value); // 处理日期范围开始
        break;
      case 'xydy':
      case '<=':
        searchModel[`${property}End`] = new Date(value); // 处理日期范围结束
        break;
      case 'ain':
      case 'nin':
        searchModel[`${property}Arr`] = values; // 处理数组类型值
        break;
      default:
        searchModel[property] = value; // 默认处理单值
        break;
    }
  });

  return searchModel;
};
export default Func;
