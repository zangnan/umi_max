import React from 'react';
import { intl as intl2 } from '@/components/DDAssist/util';
import DDAlert from '@/pages/hts/components/DDAlert';
import { message, Form, Input, } from 'antd';
import {scQxz, scjy, dcjb } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';

const Func: any = {
  unitRef: React.createRef(),
};



Func.add = (param: any) => {
  const { otherRef } = param;

  otherRef[0].current?.showModal(param, 'add');
}


Func.edit = (param: any) => {
  const { selectionRowKeys, otherRef} = param;
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
  await scjy({ qxlx: '1', qxzDms: selectionRowKeys }).then((response: any) => {
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
          await scQxz({qxzdms:selectionRowKeys}).then((response: any) => {
            thisObj.setState({ masker: false });
            if (response.code === '200') {
              // 清空选中并设置按钮可用状态
              message.success('删除成功！');
              unitRef.current!.reload2();
              DDAlert.close();
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

//屏蔽菜单
Func.pbcd = (param: any) => {
  const { selectionRowKeys, otherRef} = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRowKeys.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  }
  otherRef[1].current?.showModal(param, 'pbcd');
}



//关联地区
Func.gldq = (param: any) => {
  const { selectionRowKeys, otherRef,selectionRows} = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRowKeys.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  } 
  if (selectionRows[0].dqbz1 != 'Y') {
    message.info('勾拳的权限组代码的地区标志应为“是”');
    return;
  }
  otherRef[3].current?.showModal(param,selectionRowKeys);
}


// 关联服务
Func.glfw =(param: any) => {
  const { otherRef,selectionRowKeys,unitRef} = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRowKeys.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  }
  otherRef[5].current?.showModal(unitRef,selectionRowKeys);
}


//关联渠道
Func.glqd = (param: any) => {
  const { selectionRowKeys, otherRef,selectionRows} = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRowKeys.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  }
  if (selectionRows[0].qdbz3 != 'Y') {
    message.info('勾选的权限组代码的渠道标志应为“是”');
    return;
  }
  otherRef[2].current?.showModal(param,selectionRowKeys);
}

// 屏蔽资源
Func.pbzy = (param: any) => {
  const { selectionRowKeys, otherRef} = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRowKeys.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  }
  otherRef[4].current?.showModal(param,selectionRowKeys);
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
        values.dcbs = 'QXZ';
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