import React from 'react';
import { plxgckfph, plxgckspDm, queryPager } from '@/pages/hts/services/htsApi';
import { message } from 'antd';
import DDAlert from '@/pages/hts/components/DDAlert';
import { intl, intl as intl2 } from '@/components/DDAssist/util';
import {Form, Input} from "antd";
import baseValidator from '@/components/DDAssist/field/baseValidator';

const dlzmKsyFunc: any = {
  refUnit: React.createRef(),
};

// 生成明细报表
dlzmKsyFunc.produceDetailsReport = (param: any) => {
  const { refUnit } = param;
  const gridData = refUnit.current?.getGridData();
  if (gridData.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_common_type_no_griddata' }));
    return;
  }
  const otherRef = param.refUnit.current?.getOtherRefs();
  if (otherRef) {
    otherRef[0].current?.showModal(param, '3');
  }
};

// 批量修改出口发票号
dlzmKsyFunc.ckfphPlxg = (param: any) => {
  const {refUnit, selectionRowKeys, gridRef} = param;
  const gridData = refUnit.current?.getGridData();
  if (gridData.length === 0) {
    message.info(intl2.formatMessage({id: 'message_common_type_no_griddata'}));
    return;
  }
  const searchModel = refUnit.current?.getGridParams().searchModel || [];
  const headerSearchModel = param.refGrid.current?.getHeaderFilter() || [];
  const allSearchModel: any = searchModel.concat(headerSearchModel);
  allSearchModel.push({property: 'cxlx', value: '3', op: 'zdy'});
  allSearchModel.push({property: 'sfcxZj', value: "Y", op: 'zdy'});
  let uuids: any = [];
  DDAlert.open({
    title: '批量修改',
    infoType: 'warning',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
    content: <>
      <Form.Item label="出口发票号" name="ckfph" rules={[{required: true, message: '请输入出口发票号'}, validatorFlag.ckfph]}>
        <Input placeholder="请输入出口发票号" maxLength={30} />
      </Form.Item>
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        if (values) {
          if (selectionRowKeys.length === 0) {
            // 走获取全部uuid的接口
            const obj = {
              page: 1,
              pageSize: 999999,
              key: 'CX_SAAS_MDT_DLCKHWZMGL',
              searchModel: allSearchModel,
            }
            queryPager(obj).then((res: any) => {
              const {code, body, msg} = res;
              if (code === '200') {
                uuids = body.rows;
                const obj2 = {
                  uuids,
                  ywlx: 'dlckhwzm',
                  ckfph: values.ckfph
                }
                plxgckfphApi(obj2, refUnit)
              } else {
                message.error(msg)
              }
            })
          } else {
            uuids = selectionRowKeys;
            const obj2 = {
              uuids,
              ywlx: 'dlckhwzm',
              ckfph: values.ckfph
            }
            plxgckfphApi(obj2, refUnit)
          }
        }
      })
    }
  })
}

// 批量修改出口发票号接口
const plxgckfphApi = (params: any, refUnit: any) => {
  plxgckfph(params).then((res: any) => {
    const {code, msg} = res;
    if (code === '200') {
      message.success(intl.formatMessage({ id: 'message_common_batchedit_success' }));
      refUnit.current!.reload();
      refUnit.current?.setSelectionRowKeys([]);
      refUnit.current?.setSelectionRows([]);
      DDAlert.close();
    } else {
      message.error(msg)
    }
  })
};

// 批量修改出口商品代码
dlzmKsyFunc.ckspdmPlxg = (param: any) => {
  const { refUnit, selectionRowKeys } = param;
  if (selectionRowKeys.length === 0) {
    message.info(intl.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  DDAlert.open({
    title: '批量修改',
    closeStatus: false,
    isFormContent: true,
    infoType: 'form',
    modalType: 'form',
    content:
      <>
        <Form.Item label="出口商品代码" name="ckspDm" rules={[{ required: true, message: '请输入出口商品代码' }, baseValidator.number()]} >
          <Input placeholder="请输入出口商品代码" style={{ width: 230 }}></Input>
        </Form.Item>
      </>,
    //#region 回调方法
    okCallbackFn: function () {
      DDAlert.getForms().validateFields().then((values: any) => {
        plxgckspDm({ uuids: selectionRowKeys, ckspDm: values.ckspDm, ywlx: "dlckhwzm" }).then((res: any) => {
          const { code, msg, body } = res;
          if (code === '200') {
            DDAlert.close();
            message.success(body);
            refUnit.current!.reload();
            refUnit.current?.setSelectionRowKeys([]);
            refUnit.current?.setSelectionRows([]);
          } else if (code === '900') {
            if (body === '' || body === null) {
              message.error(msg);
            } else {
              //#region  失败展示页面
              const otherRef = param.refUnit.current?.getOtherRefs();
              if (otherRef) {
                otherRef[1].current?.showModal(body, 'dlzm', '批量修改');
              }
              //#endregion
            }
          }
        })
      })
    }
    //#endregion
  })
}

// 校验
const validatorFlag = {
  ckfph: (form: any) => {
    const validator = async (_rule: any, value: any) => {
      if (value && /[\u4E00-\u9FA5]/g.test(value) || value && /\s/.test(value)) {
        return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_english_number_symbol' })));
      } else {
        return Promise.resolve();
      }
    }
    return { validator };
  },
};

export default dlzmKsyFunc;
