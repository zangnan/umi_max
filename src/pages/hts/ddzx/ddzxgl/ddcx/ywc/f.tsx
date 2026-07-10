
import React from 'react';
import DDAlert from '@/pages/hts/components/DDAlert';
import { Select, Input, message, Form } from 'antd';
import baseValidator from '@/components/DDAssist/field/baseValidator';
import { getJsxxByFjyhuuid, qyKhda, yrhmdKhda, remvoeHmdKhda } from '@/pages/hts/services/htsApi';
import { intl as intl2 } from '@/components/DDAssist/util';
import myUtil from '@/components/DDAssist/util';


const Func: any = {
  // 加载时蒙板使用
  refUnit: React.createRef(),
};


Func.eventOnBlur = {
  mxcjBlursbxh: (param: any) => {
    const { form,event } = param;
    const shje  = form.getFieldValue('ckshje');
    const hl  = form.getFieldValue('ckshhbhl');
    if(shje && hl){
     const val =  shje*(hl/100);
     form.setFieldsValue({ckshjermb: val});
    }
  },
}
// 签约
Func.qianyue = async (param: any) => {
  const { selectionRowKeys, refUnit, } = param;
  if (selectionRowKeys?.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRowKeys?.length !== 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  }
  await getJsxxByFjyhuuid({}).then((response) => {
    if (response.code === '200') {
      DDAlert.open({
        title: '签约',
        infoType: 'warning',
        modalType: 'form',
        closeStatus: false,
        isFormContent: true,
        content: <>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="签约合同号" name="qyhth"
            rules={[{ required: true, message: '请输入签约合同号' }, baseValidator.range2({ min: 0, max: 20 })]}>
            <Input />
          </Form.Item>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="访问账号" name="dlzh"
            rules={[{ required: true, message: '请输入访问账号' }, baseValidator.range2({ min: 0, max: 20 })]}>
            <Input />
          </Form.Item>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="访问密码" name="dlmm"
            rules={[{ required: true, message: '请输入访问密码' }, baseValidator.range2({ min: 0, max: 20 })]}>
            <Input />
          </Form.Item>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="角色" name="jsDm"
            rules={[{ required: true, message: '请选择角色' }]}>
            <Select>
              {response.body?.map((item: any) => (
                <Select.Option key={item.jsDm} value={item.jsDm}>{item.jsMc}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </>,
        okCallbackFn: function (thisObj: any) {
          DDAlert.getForms().validateFields().then(async (values: any) => {
            thisObj.setState({ masker: true });
            await qyKhda({ khuuid: selectionRowKeys[0], ...values }).then((response2) => {
              thisObj.setState({ masker: false });
              if (response2.code == '200') {
                message.success('客户签约成功！');
                DDAlert.close();
                refUnit.current!.reload();
              } else {
                message.error(response2.msg);
              }
            })
          });
        }
      });
    } else {
      message.error('获取角色信息失败，请联系管理员！');
    }
  });
}

//移至黑名单 
Func.yzhmd = async (param: any) => {
  const { selectionRowKeys, refUnit, } = param;
  if (selectionRowKeys?.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  refUnit.current?.setMasker(true);
  await yrhmdKhda({ khuuids: selectionRowKeys }).then((response2) => {
    refUnit.current?.setMasker(false);
    if (response2.code == '200') {
      message.success('操作成功！');
      refUnit.current!.reload();
    } else {
      message.error(response2.msg);
    }
  })

}



//移除黑名单 
Func.ychmd = async (param: any) => {
  const { selectionRowKeys, refUnit, } = param;
  if (selectionRowKeys?.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  refUnit.current?.setMasker(true);
  await remvoeHmdKhda({ khuuids: selectionRowKeys }).then((response2) => {
    refUnit.current?.setMasker(false);
    if (response2.code == '200') {
      message.success('操作成功！');
      refUnit.current!.reload();
    } else {
      message.error(response2.msg);
    }
  })

}
export default Func;
