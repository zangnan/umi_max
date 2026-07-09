import React from 'react';
import 'moment/locale/zh-cn';
import { Button, message } from "antd";
import { intl as intl2 } from '@/components/DDAssist/util';
import { deleteBaqkAndDzRelation, saveBaqkAndDzRelation } from '@/pages/hts/services/htsApi';

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
      refUnit.current!.reload2();
      otherRef[4]?.refUnit?.current!.reload2();
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

export default Func;
