/**
 * title: 角色管理
 * author: wx
 */
import React from 'react';
import { intl as intl2 } from '@/components/DDAssist/util';
import { Button, message, Form, Input} from 'antd';
import { deleteApifw, dcjb, apifwDcsjzd } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/components/DDAlert';
import myUtil from '@/components/DDAssist/util';

const Func: any = {
  unitRef: React.createRef(),
};

Func.columnsRender = {
  // 关联用户数
  renderGlyhs: (param: any) => {
    if(param.text == "0" || !param.text) {
      return <>
       <span>0</span>
      </>
    } else {
      return <>
       <Button type='link' onClick={() => openModalGlyh(param)}>{param.text || 0}</Button>
      </>
    }

  },

  // 关联用户列表-启用标志
  renderYxbz: (param: any) => {
    return <>
      {param.text === 'Y' ? '启用' : '停用'}
    </>
  }
}
// 打开弹窗-关联用户
const openModalGlyh = (param: any) => {
  const { unitRef } = param;
  const otherRef = unitRef.current?.getOtherRefs();
  if (otherRef && otherRef[1]) {
    otherRef[1].current?.showModal(param);
  } else if (param.otherRef && param.otherRef[1]) {
    param.otherRef[1].current?.showModal(param);
  }
};

Func.add = (param: any) => {
  const { unitRef } = param;
  const otherRef = unitRef.current?.getOtherRefs();
  param.otherRef[0].current?.showModal(param,"add");
};


Func.edit = (param: any, event: any) => {
  const { unitRef, record,selectionRowKeys } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRowKeys?.length !== 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  }
  param.otherRef[0].current?.showModal(param,"edit");
  
};


Func.del = (param: any, event: any) => {
  const { unitRef, selectionRowKeys } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  unitRef.current?.setMasker(true);
  const data = {"uuids": selectionRowKeys};
  deleteApifw(data).then((res: any) => {
    unitRef.current?.setMasker(false);
    const { code, msg } = res;
    // setMasker(false);
    if (code == '200') {
      close();
      message.success("保存成功！");
      unitRef.current?.reload2();
    } else {
      message.error(msg)
    }
  })
};


Func.editBd = (param: any, event: any) => {
  param.otherRef[1].current?.showModal(param);
};




Func.exportZd = (param: any) => {
  const { selectionRowKeys, unitRef } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  unitRef.current!.setMasker(true);
  apifwDcsjzd().then((res: any) => {
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
        values.dcbs = 'APIFW';
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

export default Func;