import React from 'react';
import { bgdzbts } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/components/DDAlert';
import {Form, message, Radio} from 'antd';
import { intl as intl2 } from '@/components/DDAssist/util';

const CkbgdFunc: any = {
  refUnit: React.createRef(),
};

// 转不退税
CkbgdFunc.btnZbts = (param: any, refCurrent: any, cdly:any) => {
  const {refUnit, selectionRowKeys} = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({id: 'message_handle_unselected'}));
    return;
  }
  // cdly == 'btsplxg' 不退税 批量修改来源，不能更新人工处理标志
  DDAlert.open({
    title: cdly == 'btsplxg' ? '批量修改' : '转不退税',
    infoType: 'info',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
    content: <>
      <Form.Item name="bgdcllxDm" label="退税类型" rules={[{ required: true, message: '退税类型不允许为空' }]} labelCol={{span: 8}} wrapperCol={{span: 16}}>
        <Radio.Group>
          <Radio key="4" value="4">免税</Radio>
          <Radio key="5" value="5">征税</Radio>
        </Radio.Group>
      </Form.Item>
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        thisObj.setState({masker: true});
        const data = {uuids: selectionRowKeys, bgdcllxDm: values?.bgdcllxDm};
        bgdzbts(data).then((response: any) => {
          const {code, msg} = response;
          if (code === '200') {
            message.success('操作成功！');
            if (refCurrent) {
              // 刷新头部条数
              refCurrent!.getDclsjBttj();
              setTimeout(() => {
                refUnit.current!.reload();
                DDAlert.close();
              }, 300)
            } else {
              refUnit.current!.reload();
              DDAlert.close();
            }
          } else {
            message.error(msg);
          }
        }).catch(() => {
          message.error('操作失败');
        }).finally(() => {
          thisObj.setState({masker: false});
        });
      });
    }
  })
}

export default CkbgdFunc;
