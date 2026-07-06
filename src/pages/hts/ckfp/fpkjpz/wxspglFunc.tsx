import cktsUtil from '@/pages/hts/cktsUtil';
import { DatePicker, Form, message, Tooltip } from 'antd';
import React from 'react';
import { wxspsc, wxspsztmsbz, wxsptqbgdxx, wxspfm } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/components/DDAlert';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { intl as intl2 } from '@/components/DDAssist/util';
import myUtil from '@/components/DDAssist/util';

const Func: any = {
  unitRef: React.createRef(),
};

// 外销商品管理页面：设置征税标志
Func.handleWxspglZsBz = (param: any) => {
  const { selectionRows, unitRef } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    const wxspVoList: any = [];
    selectionRows.forEach((row: any) => {
      wxspVoList.push({ hgckspDm: row.hgckspDm, hgspmc: row.hgspmc, ggxhhgsh: row?.ggxhhgsh });
    });
    Func.wxspsztmsbz({ cksptssplxDm: '3', wxspVoList: wxspVoList }, unitRef);
  }
}

// 外销商品管理页面：设置免税标志
Func.handleWxspglMsBz = (param: any) => {
  const { selectionRows, unitRef } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    const wxspVoList: any = [];
    selectionRows.forEach((row: any) => {
      wxspVoList.push({ hgckspDm: row.hgckspDm, hgspmc: row.hgspmc, ggxhhgsh: row?.ggxhhgsh });
    });
    Func.wxspsztmsbz({ cksptssplxDm: '2', wxspVoList: wxspVoList }, unitRef);
  }
}

// 外销商品管理页面：设置退税标志
Func.handleWxspglTsBz = (param: any) => {
  const { selectionRows, unitRef } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    const wxspVoList: any = [];
    selectionRows.forEach((row: any) => {
      wxspVoList.push({ hgckspDm: row.hgckspDm, hgspmc: row.hgspmc, ggxhhgsh: row?.ggxhhgsh });
    });
    Func.wxspsztmsbz({ cksptssplxDm: '1', wxspVoList: wxspVoList }, unitRef);
  }
}

// 外销商品管理 设置退免税类型
Func.wxspsztmsbz = (param: any, unitRef: any) => {
  unitRef.current!.setMasker(true);
  wxspsztmsbz(param).then((response) => {
    unitRef.current!.setMasker(false);
    const { code, desc } = response;
    if (code === '200') {
      message.success(intl2.formatMessage({ id: 'message_ckfp_fppz_wxspgl_settmslx_success' }));
      unitRef.current!.reload2();
    } else {
      message.error(desc);
    }
  })
}

// 外销商品管理页面:删除
Func.deleteWxspgl = (param: any) => {
  const { selectionRows, unitRef } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    DDAlert.open({
      title: '系统提示',
      info: '确定要删除选择的数据吗？',
      infoType: 'question',
      modalType: 'confirm',
      okCallbackFn: function (thisObj: any) {
        thisObj.setState({ masker: true });
        const wxspVoList: any = [];
        selectionRows.forEach((row: any) => {
          wxspVoList.push({ hgckspDm: row.hgckspDm, hgspmc: row.hgspmc, ggxhhgsh: row?.ggxhhgsh, sphfwssflhbbm: row?.sphfwssflhbbm });
        });
        wxspsc({ wxspVoList: wxspVoList }).then((response) => {
          DDAlert.close();
          const { code, msg } = response;
          if (code === '200') {
            message.success(intl2.formatMessage({ id: 'message_delete_success' }));
            unitRef.current!.reload2();
          } else {
            message.error(msg);
          }
        })
      },
    });
  }
}

// 外销商品管理页面：赋码按钮点击事件
Func.handleWxspglFm = (param: any) => {
  const { selectionRows, otherRef, unitRef } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    otherRef[0].current!.showModal({ data: selectionRows, mainRef: unitRef, zslx: 'wxspGrid' });
  }
}

// 外销商品管理 赋码列操作
Func.handleWxspglFmColumns = (param: any, event: any) => {
  event.stopPropagation();
  const { record, otherRef, unitRef } = param;
  otherRef[0].current!.showModal({ data: [].concat(record), mainRef: unitRef, zslx: 'wxspGrid' });
}

Func.initEditForm = (param: any) => {
  const { handleModalVisible, page_id } = param;
  if (page_id === 'wxspgl') {
    handleModalVisible(true);
    const inputEle1: any = document.querySelector("#wxspgl_form_hgckspDm");
    inputEle1.setAttribute('disabled', true);
    const inputEle2: any = document.querySelector("#wxspgl_form_hgspmc");
    inputEle2.setAttribute('disabled', true);
    const inputEle3: any = document.querySelector("#wxspgl_form_ggxhhgsh");
    inputEle3.setAttribute('disabled', true);
  } else {
    handleModalVisible(true);
  }
}

Func.initAddForm = (param: any) => {
  const { handleModalVisible, page_id } = param;
  if (page_id === 'wxspgl') {
    Promise.all(handleModalVisible(true)).then(() => {
    }).catch(() => {
    }).finally(() => {
      // 根据发票配置的商品维护规则判断海关规格型号是否可编辑
      const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01');
      const lableSpan1: any = document.querySelector("#wxspgl_form .dditem_label_ggxhhgsh span");
      if (temp[0].fphwxxxqgzDm === '1') {
        lableSpan1.classList.remove('required');
        const inputEle3: any = document.querySelector("#wxspgl_form_ggxhhgsh");
        inputEle3.setAttribute('disabled', true);
      } else if (temp[0].fphwxxxqgzDm === '2') {
        lableSpan1.classList.add('required');
      }
    });
  } else {
    handleModalVisible(true);
  }
}

// 外销商品管理 表单页面onChange事件
Func.eventOnChange = {
  // 享受优惠政策
  syyhzcbzOnChange: (param: any) => {
    const { value, myItems, setMyItems, form } = param;
    if (value === '1') {
      myItems[10].disabled = false;
    } else if (value === '0') {
      myItems[10].disabled = true;
      myItems[10].value = '';
      myItems[8].disabled = false;
      form.resetFields(['fpssyhlxDm']);
      form.setFieldsValue({ fpssyhlxDm: '' });
    }
    setMyItems([...myItems]);
  },
  // 优惠政策类型
  fpssyhlxDmOnChange: (param: any) => {
    const { form, myItems, setMyItems } = param;
    // 优惠政策类型选择免税、不征税时税率不可编辑
    myItems[8].disabled = true;
    setMyItems([...myItems]);
    form.setFieldsValue({ sl1: 0 });
  },
}

Func.eventOnFocus = {
  // 外销商品管理 税收分类编码选择
  wspgSphfwssflhbbmFocus: (param: any) => {
    const { form, otherParam } = param;
    if (otherParam.otherRef) {
      otherParam.otherRef[0].current!.showModal({ zslx: 'wxspForm', form: form });
    }
  },
}

// 税收分类编码选中回显到表单
Func.setFormValues = (param: any) => {
  const { form, record, fmMainRef } = param;
  message.info(intl2.formatMessage({ id: 'message_ckfp_fppz_fm_success' }));
  fmMainRef.current.closeModal();
  form.setFieldsValue({
    sphfwssflhbbm: record.sphfwssflhbbm,
    hwhlwmc: record.hwhlwmc,
    hwhlwjc: record.hwhlwjc,
  });
}

// 外销商品列表设置税收分类编码
Func.setGridWxspfm = (param: any) => {
  const { selectRows, record, fmUnitRef, fmMainRef, wxspGridRef } = param;
  const wxspVoList: any = [];
  selectRows.forEach((row: any) => {
    wxspVoList.push({ hgckspDm: row.hgckspDm, hgspmc: row.hgspmc, ggxhhgsh: row.ggxhhgsh });
  });
  fmUnitRef.current!.setMasker(true);
  wxspGridRef.current!.setMasker(true);
  wxspfm({ sphfwssflhbbm: record.sphfwssflhbbm, hwhlwmc: record.hwhlwmc, hwhlwjc: record.hwhlwjc, wxspVoList: wxspVoList }).then((response) => {
    fmUnitRef.current?.setMasker(false);
    wxspGridRef.current!.setMasker(false);
    // 关闭赋码弹窗
    fmMainRef.current.closeModal();
    const { code, desc } = response;
    if (code === '200') {
      wxspGridRef.current.reload2();
      message.success(intl2.formatMessage({ id: 'message_ckfp_fppz_fm_success' }));
    } else {
      message.error(desc);
    }
  })
}

// 表单校验
Func.validator = {
  //自定义校验：根据发票配置的商品维护规则判断海关规格型号是否必填
  cksptssplxDmCheck: () => {
    const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01');
    const validator = async (_rule: any, value: any) => {
      if (temp[0].fphwxxxqgzDm === '2') {
        if (!value) {
          return Promise.reject(new Error('该项内容为必填项不能为空！'));
        }
      }
      return Promise.resolve();
    };
    return { validator };
  },
  //自定义校验：是否享受优惠政策判断优惠政策类型是否必填
  fpssyhlxDmCheck: (form: any) => {
    const syyhzcbz = form?.getFieldValue('syyhzcbz');    // 是否享受优惠政策
    const validator = async (_rule: any, value: any) => {
      if (syyhzcbz === '1') {
        if (!value) {
          return Promise.reject(new Error('该项内容为必填项不能为空！'));
        }
      }
      return Promise.resolve();
    };
    return { validator };
  },
}

// 外销商品管理 提取商品信息
Func.getSpxx = (param: any) => {
  const { unitRef } = param;
  DDAlert.open({
    title: '提取商品信息',
    infoType: 'warning',
    closeStatus: false,
    isFormContent: true,
    modalType: 'form',
    content: <>
      <Form.Item name="ckrq" rules={[{ required: true, message: '请输入提取时间' }]} label={<Tooltip title="系统将只提取输入的出口日期起止范围内的报关单对应商品信息">
        提取时间范围<QuestionCircleOutlined />
      </Tooltip>} >
        <DatePicker.RangePicker locale={locale} format={myUtil.date.formatList()} />
      </Form.Item>
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        thisObj.setState({ masker: true });
        const ckrq1ks = new Date(values.ckrq[0].format('YYYY/MM/DD')).valueOf();
        const ckrq1js = new Date(values.ckrq[1].format('YYYY/MM/DD')).valueOf();
        wxsptqbgdxx({ ckrq1ks: ckrq1ks, ckrq1js: ckrq1js }).then((response) => {
          const { code, body, desc } = response;
          DDAlert.close();
          if (code === '200') {
            unitRef.current!.reload2();
            const tempMessage = cktsUtil.text.formatRepalce(intl2.formatMessage({ id: 'message_ckfp_fppz_wxspgl_spxxtqcg_success' }), { yxsl: body.yxsl })
            message.success(tempMessage);
          } else {
            message.error(desc);
          }
        })
      });
    },
  });
}

// 批量修改参数
Func.getBatchEditParam = (param: any) => {
  const { selectionRows } = param;
  const wxspVoList: any = [];
  selectionRows.forEach((row: any) => {
    wxspVoList.push({ hgckspDm: row.hgckspDm, hgspmc: row.hgspmc, ggxhhgsh: row?.ggxhhgsh });
  });
  return { wxspVoList };
}

export default Func;