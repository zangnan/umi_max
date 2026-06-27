import { DatePicker, Form, message, Tooltip, Switch } from 'antd';
import React from 'react';
import { khglszzt, khglsc, khgltqbgdxx, checkghfnsrmc, qtspwhcheck } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/commonModule/DDAlert';
import 'moment/locale/zh-cn';
import { intl as intl2 } from '@/components/DDAssist/util';
import myUtil from '@/components/DDAssist/util';

const Func: any = {
  unitRef: React.createRef(),
};

// 客户管理:删除
Func.delete = (param: any) => {
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

// 表单校验
Func.validator = {
  // 委托/受托方纳税人识别号
  stfnsrsbh01: (form: any) => {
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
  // 委托/受托方海关企业代码
  stfhgqydm01: (form: any) => {
    const validator =  (_rule: any, value: any) => {
			if (value && value.length != 10 && value && value.length != 18) {
        return Promise.reject(new Error('企业海关代码长度应为10位或18位，请确认后填报！'));
			}
      return Promise.resolve();
    };
    return { validator };
  },
}

// 表单事件：OnBlur
Func.eventOnBlur = {
  // 委托纳税人识别号
  stfnsrsbh: (param: any) => {
    // 委托纳税人识别号
    const { event, form } = param;
    const inputValue = event.target.value;
    // 字母转大写
    form.setFieldsValue({
      stfnsrsbh: inputValue.toUpperCase(),
    });
  },
}

// 列表自定义渲染
Func.columnsRender = {}
export default Func;