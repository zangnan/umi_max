/**
 * title: 企业管理
 * author: wx
 */
import React from 'react';
import {Button, message, Switch} from 'antd';
import myUtil, {intl as intl2} from '@/pages/common/myUtil';
import {deleteQy, downloadTemplate, qyHtyQy, tbsffwsjForQxqygl} from '@/services/hts/api';
import DDAlert from '@/components/DDAlert';

const Func: any = {
  unitRef: React.createRef(),
};

Func.columnsRender = {
  // 生成类型
  renderYxbz: (param: any) => {
    const {record} = param;
    return <Switch checked={record.yxbz == 'Y' ? true : false} checkedChildren="停用" unCheckedChildren="启用"
                   onClick={(checked) => onChangeSwitch({...param, ...{checked: checked}})}/>
  },
  // 三方授权详情
  renderCz: (param: any) => {
    const {record} = param;
    let col: any = <></>;
    if (record?.sfysffwbz == 'Y') {
      col = (
        <span className="dd_grid_icon">
        <Button type="link" onClick={(e) => {
          Func.cksfsqxq(param, e)
        }} style={{marginTop: '2px'}}>三方授权详情</Button>
      </span>
      );
    }
    return col;
  },
  // 关联企业数
  renderGlqy: (param: any) => {
    let html;
    if (param.text == 0) {
      html = <>0</>
    } else {
      html = <Button type="link" onClick={() => Func.bdyh(param, '1')}>{param.text}</Button>;
    }
    return html;
  },
  renderSysj: (param: any) => {
    const {record} = param;
    if (record?.sqyxqSyts <= 5) {
      return <div style={{color: '#FF0000'}}>{record?.sqyxqSyts}</div>
    } else {
      return <>{record?.sqyxqSyts}</>
    }
  },
}

// 查看三方授权详情
Func.cksfsqxq = async (param: any, e: any) => {
  const {record, otherRef} = param;
  otherRef[7].current?.showModal(param, record.sbqyuuidDqlb);
}

// 同步三方服务时间
Func.tbsffwsj = async (param: any, e: any) => {
  const {selectionRowKeys, unitRef, gridRef} = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({id: 'message_handle_unselected'}));
    return;
  }
  if (selectionRowKeys.length > 50) {
    message.info('最多只能勾选50条数据进行操作');
    return;
  }
  const data = {
    sbqyuuids: selectionRowKeys
  };
  unitRef.current!.setMasker(true);
  tbsffwsjForQxqygl(data).then((response: any) => {
    const {code, msg, body} = response;
    if (code === '200') {
      message.success(body);
      gridRef.current?.reload();
    } else {
      message.error(msg);
      return;
    }
  }).catch(() => {
    message.error('同步三方服务时间失败');
  }).finally(() => {
    unitRef.current!.setMasker(false);
  });
}

// 企业信息及三方服务授权信息导出
Func.sffwxxdc = async (param: any, e: any) => {
  const {unitRef, gridRef, selectionRowKeys} = param;
  const searchModel = unitRef.current?.getGridParams().searchModel || [];
  const headerSearchModel = gridRef.current?.getHeaderFilter() || [];
  let allSearchModel: any;
  if (selectionRowKeys?.length > 0) {
    allSearchModel = searchModel.concat([ ...headerSearchModel, { property: 'sbqyuuids', values: selectionRowKeys, op: 'zdy' }]);
  } else {
    allSearchModel = searchModel.concat([...headerSearchModel]);
  }
  for (let i = 0; i < allSearchModel.length; i++) {
    allSearchModel[i].op = 'zdy'
  }
  const obj = {
    sfBhsj: 'Y',
    sfScsm: 'Y',
    key: 'SAAS_QXGL_QYGL_SFFWXX_DC',
    searchModel: allSearchModel
  }
  unitRef.current!.setMasker(true);
  downloadTemplate(obj).then((response: any) => {
    DDAlert.close();
    if (response.code === '200') {
      const {blob, fileName} = response.body;
      myUtil.file.downloadExcel(blob, fileName);
    } else {
      message.error(response.desc);
    }
  }).catch(() => {
    message.error('操作失败');
  }).finally(() => {
    unitRef.current!.setMasker(false);
  });
}

// 绑定用户
Func.bdyh = (param: any, flag: any) => {
  const {selectionRowKeys, otherRef} = param;
  if ('1' === flag) {
    param.otherRef[1].current?.showModal(param, [param.record.sbqyuuidDqlb], flag);
  } else {
    flag = '2';
    if (!selectionRowKeys || selectionRowKeys.length === 0) {
      message.info(intl2.formatMessage({id: 'message_handle_unselected'}));
      return;
    }
    if (selectionRowKeys.length > 1) {
      message.info(intl2.formatMessage({id: 'message_one_selected'}));
      return;
    }
    otherRef[1].current?.showModal(param, selectionRowKeys, flag);
  }
};

Func.yhsq = (param: any) => {
  const {selectionRows, unitRef} = param;
  // 选择数据条数判断
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({id: 'message_handle_unselected'}));
    return;
  }
  if (selectionRows.length > 1) {
    message.info(intl2.formatMessage({id: 'message_one_selected'}));
    return;
  }
  const otherRef = unitRef.current?.getOtherRefs();
  if (otherRef && otherRef[5]) {
    otherRef[5].current?.showModal(param, selectionRows[0], '授权');
  } else if (param.otherRef && param.otherRef[5]) {
    param.otherRef[5].current?.showModal(param, selectionRows[0], '授权');
  }
}


Func.sffwsq = (param: any) => {
  const {selectionRows, unitRef} = param;
  // 选择数据条数判断
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({id: 'message_handle_unselected'}));
    return;
  }
  if (selectionRows.length > 1) {
    message.info(intl2.formatMessage({id: 'message_one_selected'}));
    return;
  }
  const otherRef = unitRef.current?.getOtherRefs();
  if (otherRef && otherRef[8]) {
    otherRef[8].current?.showModal(param, selectionRows[0]);
  }
}

Func.deleteQy = (param: any) => {
  const {gridRef, selectionRows, unitRef, selectionRowKeys} = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({id: 'message_delete_unselected'}));
    return;
  }
  let i = 0;
  selectionRows.forEach((element: any) => {
    if (element.glyhs > 0) {
      message.info('勾选的数据中存在已关联用户的企业，无法删除。如确需删除，请先将已关联的用户取消关联后，再进行删除的操作。');
      i++;
    }
  });
  if (i > 0) {
    return;
  } else {
    DDAlert.open({
      title: '系统提示',
      info: '删除企业后，业务数据将一并删除且无法恢复，确定继续操作吗？',
      infoType: 'question',
      modalType: 'confirm',
      closeStatus: true,
      content: '',
      isFormContent: false,
      okCallbackFn: function () {
        const data = {
          sbqyuuids: selectionRowKeys
        };
        unitRef.current!.setMasker(true);
        deleteQy(data).then((response: any) => {
          unitRef.current!.setMasker(false);
          const {code, msg} = response;
          if (code === '200') {
            unitRef.current?.setSelectionRowKeys([]);
            unitRef.current?.setSelectionRows([]);
            gridRef.current?.reload();
            message.success('删除成功！');
          } else {
            message.error(msg);
            return;
          }
        })
      }
    });
  }
}


//开关值改变
const onChangeSwitch = (param: any) => {
  const {record, unitRef} = param;
  const params = {
    sbqyuuids: [record.sbqyuuidDqlb],
    yxbz: param?.checked ? "Y" : "N"
  }
  unitRef.current?.setMasker(true);
  qyHtyQy(params).then((res: any) => {
    unitRef.current?.setMasker(false);
    const {code, msg} = res;
    if (code == '200') {
      unitRef.current?.reload2();
      message.success("修改用户状态成功！");
    } else {
      message.error(msg)
    }
  })
}


//关联API服务
Func.glApiFw = (param: any) => {
  const {otherRef, selectionRows, selectionRowKeys} = param;
  // 选择数据条数判断
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({id: 'message_handle_unselected'}));
    return;
  }
  if (selectionRows.length > 1) {
    message.info(intl2.formatMessage({id: 'message_one_selected'}));
    return;
  }
  otherRef[3].current?.showModal(param, selectionRowKeys);
}

Func.qyhf = (param: any) => {
  const {otherRef} = param;
  otherRef[4].current?.showModal(param);
}

Func.qyhy = (param: any) => {
  const {unitRef} = param;
  const otherRef = unitRef.current?.getOtherRefs();
  otherRef[6].current?.showModal(param, []);
}
export default Func;
