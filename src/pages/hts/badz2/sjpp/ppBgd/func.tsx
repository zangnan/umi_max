import React from 'react';
import 'moment/locale/zh-cn';
import { Form, message, Radio, Space } from 'antd';
import DDAlert from '@/pages/hts/components/DDAlert';
import htcxFun from '../../common/htcx/func';
import { badzJcpp } from '@/pages/hts/services/htsApi';
const Func: any = {
  refUnit: React.createRef(),
};

// 编辑
Func.handleColumnsBj = (param: any) => {
  const { otherRef } = param;
  if (otherRef[0]?.record?.sfzdcc === 'Y') {
    message.info('选定数据已完成备案，无法匹配！');
    return;
  }
  otherRef[1].current?.showModal(param);
};

// 详情
Func.handleColumnsXq = (param: any) => {
  const { otherRef, record } = param;
  otherRef[2].current?.showModal(param, record.ckbgdh);
};

Func.badzBgdjcpp = (param: any) => {
  // console.log(param);
  const { refUnit, selectionRowKeys } = param;
  const gridData = refUnit.current?.getGridData();
  if (!gridData || gridData.length <= 0) {
    message.info('当前页面无可解除匹配的数据！');
    return;
  }
  let jcppParam: any = {};
  const initSearchModal = refUnit.current?.getGridParams().initSearchModal;
  const searchModel = refUnit.current?.getGridParams().searchModel;
  const allSearchModel: any = searchModel.concat(initSearchModal);
  console.log(allSearchModel);
  htcxFun.convertJcppParam(allSearchModel, jcppParam);
  jcppParam.bgdhgbhs = selectionRowKeys;
  console.log(jcppParam);
  let text = '将选中的单证解除匹配，是否确认？';
  if (selectionRowKeys && selectionRowKeys.length <= 0) {
    text = '将筛选条件下的单证解除匹配，是否确认？';
  }

  DDAlert.open({
    title: '解除匹配',
    infoType: 'question',
    closeStatus: false,
    isFormContent: true,
    modalType: 'form',
    content: (
      <>
        <div style={{ marginBottom: '10px', marginLeft: '10px' }}>{text}</div>
        <Form.Item name="jcppfwDm" label="解除匹配数据范围" initialValue="01">
          <Radio.Group>
            <Space direction="vertical">
              <Radio value="01" style={{ padding: '5px 0' }}>
                <span style={{ paddingRight: '12px' }}>仅解除自动匹配的单证</span>
              </Radio>
              <Radio value="02">
                <span style={{ paddingRight: '12px' }}>解除所有已匹配的单证</span>
              </Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
      </>
    ),
    okCallbackFn: async function (thisObj: any) {
      let contentFormData = await DDAlert.getValidateFormData();
      console.log(contentFormData);
      jcppParam.jcppfsDm = '02';
      jcppParam.jcppfwDm = contentFormData.jcppfwDm;
      
      refUnit.current!.setMasker(true);
      badzJcpp(jcppParam).then((response) => {
        refUnit.current!.setMasker(false);
        refUnit.current!.reload2(param);
        const { code, desc } = response;
        if (code === '200') {
          message.success('解除匹配成功！');
        } else {
          message.error(desc);
        }
        DDAlert.close();
      });
    },
  });
};

export default Func;
