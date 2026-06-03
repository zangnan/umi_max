import React from 'react';
import {plxgckfph, queryPager, yzfPtFpxxCx, batchSetJxfp, startDownload7MainInfoFp} from "@/services/hts/api";
import {Form, message, Tooltip, Radio, DatePicker} from "antd";
import DDAlert from "@/components/DDAlert";
import myUtil, {intl, intl as intl2} from '@/pages/common/myUtil';
import TextArea from "antd/lib/input/TextArea";
import baseValidator from '@/pages/common/field/baseValidator';
import {history} from "@@/core/history";
import locale from "antd/es/date-picker/locale/zh_CN";

const ksyFunc: any = {
  unitRef: React.createRef(),
};

// 批量修改出口发票号
ksyFunc.funcGxxxzt = (param: any) => {
  const {unitRef, gridRef, selectionRows} = param;
  const gridData = unitRef.current?.getGridData();
  if (gridData.length === 0) {
    message.info(intl2.formatMessage({id: 'message_common_type_no_griddata'}));
    return;
  }
  const searchModel = unitRef.current?.getGridParams().searchModel || [];
  const headerSearchModel = gridRef.current?.getHeaderFilter() || [];
  const allSearchModel: any = searchModel.concat(headerSearchModel);
  let params: any = {};
  if (selectionRows.length > 0) { // 如果有选择数据就 更新选择数据
    let uuidList: any = [];
    selectionRows.forEach((item: any) => {
      if (item.sybz != 'Y') {
        uuidList.push(item.fpDm ? item.fpDm + item.fphm : item.fphm);
      }
    });
    params.uuidList = uuidList;
  } else { // 没有选择数据按照筛选条件检查数据
    allSearchModel.forEach((item: any) => {
      params[item.property] = item.value;
    });
  }
  params.cxlx = '1'

  unitRef.current!.setMasker(true);
  yzfPtFpxxCx(params).then((res) => {
    unitRef.current!.setMasker(false);
    const { code, desc, msg } = res;
    if (code === '200') {
      unitRef.current!.reload2();
      DDAlert.open({
        title: '系统提示',
        info: '创建任务成功，是否跳转任务管理？',
        infoType: 'question',
        modalType: 'confirm',
        okCallbackFn: function (thisObj: any) {
          history.push({ pathname: '/02/0201' });
        },
      });
    } else {
      message.info(msg);
    }
  })
}


ksyFunc.columnsRender= {
  // 发票状态
  fpzt : (param: any) => {
    const rzzt = param?.record.rzxfzzszyfpbz; // 认证发票状态
    const jhzt = param?.record.jhxfzzszyfpbz; // 稽核发票状态
    let rzrtn = '';
    let jhrtn = '';
    if(rzzt == 'Y'){
      rzrtn = '已认证';
    } else {
      rzrtn = '未认证';
    }
    if(jhzt == 'Y'){
      jhrtn = '已稽核';
    } else {
      jhrtn = '未稽核';
    }
    const html = <div>{rzrtn}/{jhrtn} </div>;
    return html;
  },
  // 进货凭证号
  fpmx : (param: any) => {
    const jhpzh = param?.text;
    const html = <a onClick={(e) => { e.stopPropagation(); ksyFunc.openjhpzh(param) }}>{jhpzh}</a>;
    const html2 = <Tooltip title={jhpzh}>{html}</Tooltip>;
    return html2;
  }
}

ksyFunc.openjhpzh = (param: any, ckbgd: any) => {
  const { otherRef, record } = param;
  otherRef[0].current?.showModal(param, record);
}


// 批量修改---是否退税
ksyFunc.btnSetSfts = async (param: any) => {
  const { selectionRowKeys, unitRef } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    DDAlert.open({
      title: '是否退税',
      infoType: 'info',
      modalType: 'form',
      closeStatus: false,
      isFormContent: true,
      content: <>
        <Form.Item name="tsbz" initialValue={'Y'} label="选择是否退税" rules={[{ required: true, message: '请选择是否退税' }]} labelCol={{ span: 11 }} wrapperCol={{ span: 11 }}>
          <Radio.Group >
            <Radio value="Y">是</Radio>
            <Radio value="N">否</Radio>
          </Radio.Group>
        </Form.Item>
      </>,
      okCallbackFn: function (thisObj: any) {
        DDAlert.getForms().validateFields().then((values: any) => {
          thisObj.setState({ masker: true });
          batchSetJxfp({ szlx: 'sfts', uuids: selectionRowKeys, tsbz: values.tsbz }).then((response: any) => {
            DDAlert.close();
            thisObj.setState({ masker: false });
            const { code, msg } = response;
            if (code === '200') {
              message.success('设置是否退税成功');
              unitRef.current!.reload2();
            } else {
              message.error(msg);
            }
          })
        });
      },
    });
  }
}
// 批量修改---业务编号
ksyFunc.btnSetYwbh = async (param: any) => {
  const { selectionRowKeys, unitRef } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    DDAlert.open({
      title: '业务编号',
      infoType: 'info',
      closeStatus: false,
      isFormContent: true,
      modalType: 'form',
      content: <>
        <Form.Item label="业务编号" labelCol={{ span: 4 }} name='ywbh' rules={[{ required: true, message: '业务编号为必填项' }, baseValidator.range2({ min: 0, max: 60 })]}>
          <TextArea autoSize={{ minRows: 6, maxRows: 14 }} placeholder="请您输入业务编号的内容" rows={14} style={{ width: 397 }} />
        </Form.Item>
      </>,
      okCallbackFn: function (thisObj: any) {
        DDAlert.getForms().validateFields().then((values: any) => {
          thisObj.setState({ masker: true });
          batchSetJxfp({ szlx: 'ywbh', uuids: selectionRowKeys, ywbh: values.ywbh }).then((response: any) => {
            DDAlert.close();
            thisObj.setState({ masker: false });
            const { code, msg } = response;
            if (code === '200') {
              message.success('设置业务编号成功');
              unitRef.current!.reload2();
            } else {
              message.error(msg);
            }
          })
        });
      },
    });
  }
}


// 批量修改---设置标签
ksyFunc.btnSetBq = async (param: any) => {
  const { selectionRowKeys, unitRef } = param;
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
          batchSetJxfp({ szlx: 'bq', uuids: selectionRowKeys, bqsm: values.bqsm }).then((response: any) => {
            DDAlert.close();
            thisObj.setState({ masker: false });
            const { code, msg } = response;
            if (code === '200') {
              message.success('设置标签成功');
              unitRef.current!.reload2();
            } else {
              message.error(msg);
            }
          })
        });
      },
    });
  }
}

// 申报情况更新
ksyFunc.btnSbqkgx = async () => {
  DDAlert.open({
    title: '申报情况更新',
    infoType: 'warning',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
    initFormContentValues: {},
    content: <>
      <Form.Item label="开票日期" name="kprq" rules={[
        () => ({
          validator(_, value) {
            if (value) {
              if (value[0].diff(value[1], 'month') > 2 || value[1].diff(value[0], 'month') > 2) {
                return Promise.reject(new Error('时间范围不能超过3个月'));
              }
              return Promise.resolve();
            }
            return Promise.reject(new Error('请输入开票日期'));
          },
        })
      ]}>
        <DatePicker.RangePicker locale={locale} placeholder={['开票日期起', '开票日期止']} />
      </Form.Item>
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        thisObj.setState({ masker: true });
        const kprqQ = values.kprq[0].format('YYYY-MM-DD');
        const kprqZ = values.kprq[1].format('YYYY-MM-DD');
        startDownload7MainInfoFp({ kprqQ, kprqZ }).then((res) => {
          const { code, desc } = res;
          thisObj.setState({ masker: false });
          if (code === '200') {
            message.success("申报情况更新成功！请到任务管理查看结果");
            DDAlert.close();
          } else {
            message.error(desc);
          }
        })
      })
    }
  })
}

export default ksyFunc;
