import {Button, Form, Input, InputNumber, message} from 'antd';
import React from 'react';
import 'moment/locale/zh-cn';
import {bgdshqkSjgx, bgdshqkRgsz, shglBgdBatchSetBgd} from "@/pages/hts/services/htsApi";
import DDAlert from '@/pages/hts/components/DDAlert';
import { intl as intl2 } from '@/components/DDAssist/util';
import moment from 'moment';
import TextArea from "antd/lib/input/TextArea";
import baseValidator from '@/components/DDAssist/field/baseValidator';

const Func: any = {
  refUnit: React.createRef(),
};

Func.columnsRender = {
  // 收汇凭证份数
  renderShpzfs: (param: any) => {
    if (param.text == "0" || !param.text) {
      return <>
        <span>0</span>
      </>
    } else {
      return <>
        <Button type='link' onClick={() => openModalShpzfs(param)}>{param.text || 0}</Button>
      </>
    }

  },
}

// 打开弹窗-收汇凭证份数
const openModalShpzfs = (param: any) => {
  const {refUnit} = param;
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param);
  } else if (param.otherRef && param.otherRef[0]) {
    param.otherRef[0].current?.showModal(param);
  }
};

// 数据更新
Func.sjgx = async (param: any) => {
  const {refUnit} = param;
  // 校验
  refUnit.current!.setMasker(true);
  bgdshqkSjgx(param).then((res: any) => {
    refUnit.current!.setMasker(false);
    const {code, msg} = res;
    if (code == '200') {
      message.success('更新成功！');
      refUnit.current!.reload2();
    } else {
      message.error(msg);
    }
  });
}

// 人工设置
Func.rgsz = async (param: any) => {
  const { refUnit, selectionRowKeys, selectionRows } = param;
  if (selectionRowKeys.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  }
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  const cjzj: Number = selectionRows[0]['cjzj'] ? Number(('' + selectionRows[0]['cjzj']).replace(/,/g, '')) : Number(0);
  const wshje: Number = selectionRows[0]['wshje'] ? Number(('' + selectionRows[0]['wshje']).replace(/,/g, '')) : Number(0);
  const bshcjje: Number = selectionRows[0]['bshcjje'] ? Number(('' + selectionRows[0]['bshcjje']).replace(/,/g, '')) : Number(0);
  const kszbshje: Number = wshje.valueOf() + bshcjje.valueOf();
  if (kszbshje == 0) {
    message.info('未收汇成交金额、不能收汇金额合计为0，不能进行人工设置操作！');
    return;
  }
  DDAlert.open({
    title: '人工设置',
    infoType: 'info',
    closeStatus: false,
    isFormContent: true,
    modalType: 'form',
    content: <>
      <Form.Item name="bgdhgbh" label="报关单号" initialValue={selectionRows[0]['bgdhgbh']}>
        <Input placeholder="18位报关单号" style={{width: 312}} disabled={true}/>
      </Form.Item>
      <Form.Item name="ckrq1" label="出口日期" initialValue={moment(selectionRows[0]['ckrq1']).format('YYYY-MM-DD')}>
        <Input placeholder="" style={{width: 312}} disabled={true}/>
      </Form.Item>

      <Form.Item name="jwshrmc" label="境外收货人" initialValue={selectionRows[0]['jwshrmc']}>
        <Input placeholder="" style={{width: 312}} disabled={true}/>
      </Form.Item>

      <Form.Item name="cjzj" label="成交金额" initialValue={cjzj}>
        <Input placeholder="" style={{width: 312}} disabled={true}/>
      </Form.Item>

      <Form.Item name="wshje" label="未收汇成交金额" initialValue={wshje}>
        <Input placeholder="" style={{width: 312}} disabled={true}/>
      </Form.Item>

      <Form.Item name="bshcjje" label="不收汇成交金额" rules={[{required: true, message: '该项为必录'}]} initialValue={bshcjje}>
        <InputNumber placeholder="不可大于未收汇金额" min={0.00} max={99999999999999.99} style={{width: 100}}  onBlur={(value: any) => {
          const v = Number(value.target.value || '0.00').toFixed(2);
          DDAlert.getForms().setFieldsValue({
            yxwcfw: v,
          });
        }}/>
      </Form.Item>
    </>,
    okCallbackFn: function (thisObj: any) {
      const param = {};
      DDAlert.getForms().validateFields().then(async (values: any) => {
        const bshcjjeForm = Number(values['bshcjje']);
        if (bshcjjeForm > kszbshje) {
          message.error('“不收汇成交金额”不能大于' + kszbshje + '！');
          return;
        }
        param['bgdhgbh'] = values.bgdhgbh;
        param['bshcjje'] = bshcjjeForm;
        thisObj.setState({masker: true});
        await bgdshqkRgsz(param).then(async (res) => {
          const {code, msg} = res;
          if ('200' == code) {
            message.info('人工设置成功');
            DDAlert.close();
            refUnit.current!.reload2();
          } else {
            message.error(msg);
          }
        }).catch((err) => {
          message.error(err);
        }).finally(() => {
          thisObj.setState({masker: false});
        });
      })
    },
  });
}

// 批量修改---设置标签
Func.btnSetBq = async (param: any) => {
  const { selectionRowKeys, refUnit } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    DDAlert.open({
      title: '标签',
      infoType: 'info',
      closeStatus: false,
      isFormContent: true,
      modalType: 'form',
      content: <>
        <Form.Item label="标签" labelCol={{ span: 4 }} name='bqsm' rules={[baseValidator.range2({ min: 0, max: 1500 })]}>
          <TextArea autoSize={{ minRows: 6, maxRows: 14 }} placeholder="请您输入标签的内容" rows={14} style={{ width: 397 }} />
        </Form.Item>
      </>,
      okCallbackFn: function (thisObj: any) {
        DDAlert.getForms().validateFields().then((values: any) => {
          thisObj.setState({ masker: true });
          shglBgdBatchSetBgd({ szlx: 'bq', uuids: selectionRowKeys, bqsm: values.bqsm }).then((response: any) => {
            DDAlert.close();
            thisObj.setState({ masker: false });
            const { code, msg } = response;
            if (code === '200') {
              message.success('设置标签成功');
              refUnit.current!.reload2();
            } else {
              message.error(msg);
            }
          })
        });
      },
    });
  }
}

export default Func;
