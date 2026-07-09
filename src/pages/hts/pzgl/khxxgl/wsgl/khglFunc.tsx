import cktsUtil from '@/pages/hts/cktsUtil';
import { DatePicker, Form, message, Tooltip, Switch } from 'antd';
import React from 'react';
import { khglszzt, khglsc, khgltqbgdxx, checkghfnsrmc, qtspwhcheck, checkjwshrmc, queryGhfxx } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/components/DDAlert';
import 'moment/locale/zh-cn';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { intl as intl2 } from '@/components/DDAssist/util';
import myUtil from '@/components/DDAssist/util';

const Func: any = {
  refUnit: React.createRef(),
};

// 客户管理:提取境外发货人
Func.handletqjwfhr = (param: any) => {
  const { refUnit } = param;
  DDAlert.open({
    title: '提取客户',
    infoType: 'warning',
    closeStatus: false,
    isFormContent: true,
    modalType: 'form',
    content: <>
      <Form.Item name="ckrq" rules={[{ required: true, message: '请输入提取时间' }]} label={<Tooltip title="系统将只提取输入的日期起止范围内的报关单对应境外收发货人。">
        提取时间范围<QuestionCircleOutlined />
      </Tooltip>} >
        <DatePicker.RangePicker placeholder={['出口日期起', '出口日期止']} locale={locale} format={myUtil.date.formatList()} />
      </Form.Item>
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        thisObj.setState({ masker: true });
        const endTime = values.ckrq[1].endOf('day');
        const ckrq1ks = new Date(values.ckrq[0].format('YYYY/MM/DD')).valueOf();
        const ckrq1js = new Date(endTime.format('YYYY/MM/DD HH:mm:ss')).valueOf();
        khgltqbgdxx({ ckrq1ks: ckrq1ks, ckrq1js: ckrq1js }).then((response) => {
          const { code, body, desc } = response;
          DDAlert.close();
          if (code === '200') {
            refUnit.current!.reload2();
            const tempMessage = cktsUtil.text.formatRepalce(intl2.formatMessage({ id: 'message_ckfp_fppz_khgl_khtq_success' }), { yxsl: body.yxsl })
            message.success(tempMessage);
          } else {
            message.error(desc);
          }
        })
      });
    },
  });
}

// 客户管理:删除
Func.deleteKhgl = (param: any) => {
  const { selectionRowKeys, refUnit } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
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
        khglsc({ khuuids: selectionRowKeys }).then((response) => {
          DDAlert.close();
          const { code, desc } = response;
          if (code === '200') {
            message.success(intl2.formatMessage({ id: 'message_delete_success' }));
            refUnit.current!.reload2();
          } else {
            message.error(desc);
          }
        })
      },
    });
  }
}

// 客户管理:设置客户状态
Func.setKhzt = (checked: any, param: any) => {
  const { record, refUnit } = param;
  let khzt = 'N';
  if (checked) {
    khzt = 'Y'
  }
  refUnit.current!.setMasker(true);
  khglszzt({ tybz: khzt, khuuid: record.khuuid }).then((response) => {
    const { code, desc } = response;
    refUnit.current!.setMasker(false);
    if (code === '200') {
      refUnit.current!.reload2();
      message.success(intl2.formatMessage({ id: 'message_ckfp_fppz_khgl_setkhzt_success' }));
      return true;
    } else {
      message.error(desc);
      return false;
    }
  })
}

Func.initEditForm = (param: any) => {
  const { handleModalVisible, page_id } = param;
  if (page_id === 'wxspgl') {
    handleModalVisible(true);
    const inputEle1: any = document.querySelector("#wxspgl_form_hgckspDm");
    inputEle1.setAttribute('disabled', true);
    const inputEle2: any = document.querySelector("#wxspgl_form_hgspmc");
    inputEle2.setAttribute('disabled', true);
    // 根据发票配置的商品维护规则判断海关规格型号是否可编辑
    const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01');
    if (temp[0].fphwxxxqgzDm === '2') {
      const inputEle3: any = document.querySelector("#wxspgl_form_ggxhhgsh");
      inputEle3.setAttribute('disabled', true);
    }
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
      if (temp[0].fphwxxxqgzDm === '1') {
        const lableSpan1: any = document.querySelector("#wxspgl_form .dditem_label_ggxhhgsh span");
        lableSpan1.classList.remove('required');
      }
    });
  } else {
    handleModalVisible(true);
  }
}

// 表单校验
Func.validator = {



  // 社会信用代码 大于15 小于20
  ghfshxydm01: (form: any) => {
    const validator = async (_rule: any, value: any) => {
      if (value) {
        if(value.length < 15) {
          return Promise.reject(new Error('该项内容长度不能小于15位！'));
        } else if (value.length > 20) {
          return Promise.reject(new Error('该项内容长度不能大于20位！'));
        }
        return Promise.resolve();
      }
      return Promise.resolve();
    }
    return { validator };
  },

  // 银行账号 大于15 小于25
  ghfyhzh01: (form: any) => {
    const validator = async (_rule: any, value: any) => {
      if (value) {
        if(value.length < 15) {
          return Promise.reject(new Error('该项内容长度不能小于15位！'));
        } else if (value.length > 25) {
          return Promise.reject(new Error('该项内容长度不能大于25位！'));
        }
        return Promise.resolve();
      }
      return Promise.resolve();
    }
    return { validator };
  },

  // 自定义校验：境外收货人名称唯一
  checkJwshrmc: (form: any) => {
    const khuuid = form?.getFieldValue('khuuid');
    const validator = async (_rule: any, value: any) => {
      if (value) {
      await checkjwshrmc({ khuuid: khuuid, jwshrmc: value }).then((response) => {
          if (response.code === '900') {
            return Promise.reject(new Error(response.desc));
          }
          return Promise.resolve();
        }).catch((err) => {
          return Promise.reject(err);
        });
      } else {
        return Promise.resolve();
      }
    };
    return { validator };
  },
  // 自定义校验：购买方名称唯一
  checkGhfnsrmc: (form: any) => {
    // 当购买方名称和境外收发货人同时存在值触发校验
    const khuuid = form?.getFieldValue('khuuid');
    const validator = async (_rule: any, value: any) => {
      if (value) {
        await checkghfnsrmc({ khuuid: khuuid, ghfnsrmc: value }).then((response) => {
          if (response.code === '900') {
            return Promise.reject(new Error(response.desc));
          }
          return Promise.resolve();
        }).catch((err) => {
          return Promise.reject(err);
        });
      } else {
        return Promise.resolve();
      }
    };
    return { validator };
  },
  //自定义校验：新增其他商品信息，校验商品信息是否已存在。
  qtspwhcheck: (form: any) => {
    // 新增其他商品信息，校验商品信息是否已存在。
    const qyspbm = form?.getFieldValue('qyspbm');
    const ggxh = form?.getFieldValue('ggxh');
    const validator = async (_rule: any, value: any) => {
      if (qyspbm && ggxh) {
        await qtspwhcheck({ ggxh, qyspbm }).then((response) => {
          if (response.code === '300') {
            return Promise.reject(new Error(response.desc));
          }
          return Promise.resolve();
        }).catch((err) => {
          return Promise.reject(err);
        });
      } else {
        return Promise.resolve();
      }
    };
    return { validator };
  }
}

// 表单事件：OnBlur
Func.eventOnBlur = {
  // 境外收货人
  jwshrmc: (param: any) => {
    const { form } = param;
    const jwshrmc = form?.getFieldsValue().jwshrmc;
    const ghfnsrmc = form?.getFieldsValue().ghfnsrmc;
    if (!ghfnsrmc) {
      form.setFieldsValue({ghfnsrmc: jwshrmc});
    }
  },
  ghfnsrmc: async (param: any) => {
    const { form } = param;
    const ghfnsrmc = form?.getFieldsValue().ghfnsrmc;
    if (ghfnsrmc) {
      await queryGhfxx({ghfnsrmc: ghfnsrmc}).then((res: any) => {
        const {code, body} = res;
        if (code === '200') {
          const result = {
            ghfqyjc: body?.ghfqyjc,
            ghfshxydm: body?.ghfshxydm,
            ghfkhyxmc: body?.ghfkhyxmc,
            ghfyhzh: body?.ghfyhzh,
            ghfdz: body?.ghfdz,
            ghflxdh: body?.ghflxdh
          }
          form.setFieldsValue(result);
        }
      });
    }
  }
}

// 列表自定义渲染
Func.columnsRender = {
  // 客户状态
  renderqybz: (param: any) => {
    let checked = param.text === 'N' ? false : true;
    const html = <Switch size="default" onChange={(checked: any, event: any) => {
      event.stopPropagation(); checked = Func.setKhzt(checked, param);
    }} checkedChildren="启用" unCheckedChildren="停用" checked={checked} />;
    return html;
  },
}
export default Func;