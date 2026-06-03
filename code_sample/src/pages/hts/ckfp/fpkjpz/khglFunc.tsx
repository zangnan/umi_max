import { DatePicker, Form, message, Tooltip, Switch } from 'antd';
import React from 'react';
import { khglszzt, khglsc, khgltqbgdxx, checkghfnsrmc, qtspwhcheck } from '@/services/hts/api';
import DDAlert from '@/components/DDAlert';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { intl as intl2 } from '@/pages/common/myUtil';
import myUtil from '@/pages/common/myUtil';

const Func: any = {
  unitRef: React.createRef(),
};

// 客户管理:提取境外发货人
Func.handletqjwfhr = (param: any) => {
  const { unitRef } = param;
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
        const ckrq1ks = new Date(values.ckrq[0].format('YYYY/MM/DD')).valueOf();
        const ckrq1js = new Date(values.ckrq[1].format('YYYY/MM/DD')).valueOf();
        khgltqbgdxx({ ckrq1ks: ckrq1ks, ckrq1js: ckrq1js }).then((response) => {
          const { code, body, desc } = response;
          DDAlert.close();
          if (code === '200') {
            unitRef.current!.reload2();
            const tempMessage = myUtil.text.formatRepalce(intl2.formatMessage({ id: 'message_ckfp_fppz_khgl_khtq_success' }), { yxsl: body.yxsl })
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
  const { selectionRowKeys, unitRef } = param;
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
            unitRef.current!.reload2();
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
  const { record, unitRef } = param;
  let khzt = 'N';
  if (checked) {
    khzt = 'Y'
  }
  unitRef.current!.setMasker(true);
  khglszzt({ tybz: khzt, khuuid: record.khuuid }).then((response) => {
    const { code, desc } = response;
    unitRef.current!.setMasker(false);
    if (code === '200') {
      unitRef.current!.reload2();
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
    const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ', '01');
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
      const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ', '01');
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