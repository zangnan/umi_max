/**
 * title: 用户管理
 * author: wx
 */
import React from 'react';
import { message, Button, Switch } from 'antd';
import { intl as intl2 } from '@/components/DDAssist/util';
import { deleteYh, enableOrDisableYh } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/components/DDAlert';
import qxUtil from '@/pages/hts/common/qxUtil';

const Func: any = {
  refUnit: React.createRef(),
};

Func.columnsRender = {
  // 生成类型
  renderYxbz: (param: any) => {
    const { record } = param;
    return <>
      <Switch checked={record.yxbz == 'Y' ? true : false} checkedChildren="启用" unCheckedChildren="停用" onClick={(checked) => onChangeSwitch({ ...param, ...{ checked: checked } })} />
    </>
  },
  renderSysj:(param: any) => {
    const { record } = param;
    if(record?.sqyxqSyts <= 5){
      return <div style={{color: '#FF0000'}}>{record?.sqyxqSyts}</div>
    }else{
      return <>{record?.sqyxqSyts}</>
    }
  },
  // 关联企业数
  renderGlqy: (param: any) => {
    const { record } = param;
    let html;
    if (param.text == 0) {
      html = <>0</>
    } else {
      html = <Button type="link" onClick={() => Func.bdqy(param,'1')}>{param.text}</Button>;
    }
    return html;
  },
  // 关联用户数
  renderGlyh: (param: any) => {
    let html;
    if (param.text == 0) {
      html = <>0</>
    } else {
      html = <Button type="link" onClick={() => Func.bdyh(param,'1')}>{param.text}</Button>;
    }
    return html;
  },
}



// 绑定角色
Func.bdjs = (param: any) => {
  const { refUnit, selectionRowKeys } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[1]) {
    otherRef[1].current?.showModal(param, selectionRowKeys);
  } else if (param.otherRef && param.otherRef[1]) {
    param.otherRef[1].current?.showModal(param, selectionRowKeys);
  }
};

// 绑定企业
Func.bdqy = (param: any,flag :any) => {
  const {selectionRowKeys,otherRef ,selectionRows} = param;
  if('1' === flag){
    otherRef[2].current?.showModal(param, [param.record.yhuuid1Dqlb],flag);
  }else{
    flag = '2';
    if (!selectionRowKeys || selectionRowKeys.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
      return;
    }
    if (selectionRowKeys.length > 1) {
      message.info(intl2.formatMessage({ id: 'message_one_selected' }));
      return;
    }
    if(selectionRows[0]?.yhlxDm == '09' || selectionRows[0]?.yhlxDm == '11'|| selectionRows[0]?.yhlxDm == '13' || selectionRows[0]?.yhlxDm == '14' || selectionRows[0]?.yhlxDm == '15'){
      message.info('用户类型为管理员，不可关联企业！');
      return;
     }
    otherRef[2].current?.showModal(param, selectionRowKeys,flag);
  }

};

Func.del2 = (param: any) => {
  const {selectionRowKeys,otherRef ,selectionRows} = param;
  otherRef[4].current?.showModal(param, selectionRowKeys);

}
// 打开弹窗-新建用户
Func.addYh = (param: any) => {
  const { refUnit } = param;
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param,[], '新建');
  } else if (param.otherRef && param.otherRef[0]) {
    param.otherRef[0].current?.showModal(param, [], '新建');
  }
};

Func.yhsq = (param: any) => {
  const { selectionRows, refUnit } = param;
  // 选择数据条数判断
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRows.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  }
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param, selectionRows[0], '授权');
  } else if (param.otherRef && param.otherRef[0]) {
    param.otherRef[0].current?.showModal(param, selectionRows[0], '授权');
  }
}
// 打开弹窗-修改用户
Func.editYh = (param: any) => {
  const { selectionRows, refUnit } = param;
  // 选择数据条数判断
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRows.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  }
  if(selectionRows[0].yhlxDm === '10'){
    message.info('渠道用户不可修改！');
    return;
  }
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param, selectionRows[0], '修改');
  } else if (param.otherRef && param.otherRef[0]) {
    param.otherRef[0].current?.showModal(param, selectionRows[0], '修改');
  }
};

Func.del = (param: any) => {
  const { selectionRows, refUnit } = param;
  // 选择数据条数判断
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if(selectionRows[0].yhlxDm === '10'){
    message.info('渠道用户不可删除！');
    return;
  }
  let i = 0;
  selectionRows.forEach((element: any) => {
    if (element.glqys > 0) {
      message.info('勾选的数据中存在已关联企业的用户，无法删除。如确需删除，请先将已关联的企业取消关联后，再进行删除的操作。');
      i++;
    }
  });
  if (i > 0) {
    return;
  } else {
    DDAlert.open({
      title: '系统提示',
      info: '确定要删除选择的数据吗？',
      infoType: 'question',
      modalType: 'confirm',
      okCallbackFn: function (thisObj: any) {
        thisObj.setState({ masker: true });
        const yhuuid1s: any = [];
        selectionRows.forEach((row: any) => {
          yhuuid1s.push(row.yhuuid1Dqlb)
        });
        deleteYh({ yhuuid1s }).then((response) => {
          DDAlert.close();
          const { code, msg } = response;
          if (code === '200') {
            message.success(intl2.formatMessage({ id: 'message_delete_success' }));
            refUnit.current!.reload();
          } else {
            message.error(msg);
          }
        })
      },
    });
  }
}


Func.qyyg = (param: any) => {
  const {otherRef ,selectionRows,selectionRowKeys} = param;
  // 选择数据条数判断
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRows.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  }
  otherRef[3].current?.showModal(param,selectionRowKeys);
}



//开关值改变
const onChangeSwitch = (param: any) => {
  const { record, refUnit ,checked} = param;
  let bz = "N";
  if(checked){
    bz = "Y";
  }
  const params = {
    yhuuid1Dqlb: record.yhuuid1Dqlb,
    yxbz: bz,
  }
  refUnit.current?.setMasker(true);
  enableOrDisableYh(params).then((res: any) => {
    refUnit.current?.setMasker(false);
    const { code, msg } = res;
    if (code == '200') {
      refUnit.current?.reload();
      message.success("修改用户状态成功！");
    } else {
      message.error(msg)
    }
  });
}


Func.bdyh = (param: any,flag :any) => {
  const { refUnit } = param;
  const otherRef = refUnit.current?.getOtherRefs();
    otherRef[4].current?.showModal(param,[], flag);
}

Func.yhhy = (param: any) => {
  const { refUnit } = param;
  const otherRef = refUnit.current?.getOtherRefs();
  otherRef[6].current?.showModal(param,[]);
}
export default Func;
