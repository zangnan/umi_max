import React from 'react';
import { intl as intl2 } from '@/components/DDAssist/util';
import DDAlert from '@/pages/hts/components/DDAlert';
import { message, Switch, Form, Input, DatePicker } from 'antd';
import { scjy, scQd, xzHxgQd, dcjb, cdDcsjzd, qdsq } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import locale from 'antd/es/date-picker/locale/zh_CN';



const Func: any = {
  unitRef: React.createRef(),
};

Func.add = (param: any) => {
  const { otherRef } = param;
  otherRef[0].current?.showModal(param, 'add');
}

Func.columnsRender = {
  // 生成类型
  renderYxbz2: (param: any) => {
    const { record } = param;
    return <Switch checked={record.yxbz == 'Y' ? true : false} checkedChildren="停用" unCheckedChildren="启用" onClick={(checked) => onChangeSwitch({ ...param, ...{ checked: checked } })} />
  },
}

//开关值改变
const onChangeSwitch = (param: any) => {
  const { record, unitRef, checked } = param;
  const par = { ...record };
  par.yxbz = checked ? "Y" : "N";
  unitRef.current?.setMasker(true);
  xzHxgQd(par).then((res: any) => {
    unitRef.current?.setMasker(false);
    const { code, msg } = res;
    if (code == '200') {
      unitRef.current?.reload2();
    } else {
      message.error(msg)
    }
  })
}


Func.edit = (param: any) => {
  const { selectionRowKeys, otherRef } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRowKeys.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  }
  otherRef[0].current?.showModal(param, 'edit');
}



Func.del = async (param: any) => {
  const { selectionRowKeys, unitRef } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  unitRef.current!.setMasker(true);
  await scjy({ qxlx: '2', qdDms: selectionRowKeys }).then((response: any) => {
    unitRef.current!.setMasker(false);
    if (response.code === '200') {
      DDAlert.open({
        title: '删除',
        info: '确定对勾选数据进行删除的操作吗？',
        infoType: 'question',
        modalType: 'confirm',
        closeStatus: false,
        okCallbackFn: async function (thisObj: any) {
          thisObj.setState({ masker: true });
          await scQd({ qdDms: selectionRowKeys }).then((response: any) => {
            thisObj.setState({ masker: false });
            if (response.code === '200') {
              // 清空选中并设置按钮可用状态
              message.success('删除成功！');
              DDAlert.close();
              unitRef.current!.reload2();
            } else {
              message.error(response.msg);
            }
          })
        }
      });
    } else {
      message.error(response.msg);
    }
  })
}

Func.glqxz = (param: any) => {
  const { selectionRowKeys, otherRef } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRowKeys.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  }
  otherRef[1].current?.showModal(param, 'yh');
}


Func.glqyqxz = (param: any) => {
  const { selectionRowKeys, otherRef } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRowKeys.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  }
  otherRef[1].current?.showModal(param, 'qy');
}



Func.glcd = (param: any) => {
  const { selectionRowKeys, otherRef } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRowKeys.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  }
  otherRef[2].current?.showModal(param,);
}

Func.exportZd = (param: any) => {
  const { selectionRowKeys, unitRef } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRowKeys.length > 1) {
    message.info('只能选择一条数据进行操作!');
    return;
  }
  unitRef.current!.setMasker(true);
  cdDcsjzd({ qdDm: selectionRowKeys[0] }).then((res: any) => {
    unitRef.current!.setMasker(false);
    const { code, body, msg } = res;
    if (code === '200') {
      const { blob, fileName } = body;
      DDAlert.close();
      myUtil.file.downloadExcel(blob, fileName);
    } else {
      message.error(msg);
    }
  });
}

Func.exportJb = (param: any) => {
  const { selectionRowKeys } = param;
  DDAlert.open({
    title: '导出脚本',
    infoType: 'warning',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
    content: <>
      <Form.Item label="版本号" name="bbh" rules={[{ required: true, message: '请输入版本号' }]}>
        <Input placeholder="请输入版本号" />
      </Form.Item>
      <Form.Item label="排除内容集合" name="pcnrs" initialValue={''}>
        <Input placeholder="请输入排除内容集合" />
      </Form.Item>
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        thisObj.setState({ masker: true });
        values.dcbs = 'QD';
        values.dcnrs = selectionRowKeys.join(',');
        dcjb(values).then((res: any) => {
          thisObj.setState({ masker: false });
          const { code, body, msg } = res;
          if (code === '200') {
            const { blob, fileName } = body;
            DDAlert.close();
            myUtil.file.downloadExcel(blob, fileName);
          } else {
            message.error(msg);
          }
        });
      });
    }
  });
}

Func.exportSq = (param: any) => {
  const { selectionRowKeys } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRowKeys.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  }
  DDAlert.open({
    title: '渠道授权', 
    infoType: 'warning',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
    content: <>
      <Form.Item label="授权有效期" name="yxq" rules={[{ required: true, message: '请输入授权有效期' }]} >
        <DatePicker.RangePicker locale={locale} format={myUtil.date.formatList()} />
      </Form.Item>
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        let yxqq = myUtil.grid.formatDate(values.yxq[0], 'YYYY-MM-DD');
        let yxqz = myUtil.grid.formatDate(values.yxq[1], 'YYYY-MM-DD');
        const params = {"qdDm": selectionRowKeys[0],"yxqq": yxqq,"yxqz": yxqz};
        thisObj.setState({ masker: true });
        qdsq(params).then((res: any) => {
          thisObj.setState({ masker: false });
          const { code,  msg } = res;
          if (code === '200') {
            DDAlert.close();
            message.success('授权成功！');
          } else {
            message.error(msg);
          }
        });
      });
    }
  });
}
export default Func;