import React from 'react';
import myUtil from '@/components/DDAssist/util';
import { testReturnCode500 } from '@/services/hts/api';

const Func: any = {
  refUnit: React.createRef(),
};

// 表单校验
Func.validator = {
  // 自定义校验
  myValidator51: (form: any) => {
    const formId = form?.__INTERNAL__?.name;    // 表单id
    const test01 = form?.getFieldValue('test01');    // 表单其他项目
    console.info(formId);
    console.info(test01);
    const validator = async (_rule: any, value: any) => {
      if (value !== '111') {
        return Promise.reject(new Error('自定义校验error'));
      }
      return Promise.resolve();
    };
    return { validator };
  },

  // 自定义校验 后端
  myValidator52: (form: any) => {
    const formId = form?.__INTERNAL__?.name;    // 表单id
    const test01 = form?.getFieldValue('test01');    // 表单其他项目
    console.info(formId);
    console.info(test01);
    const validator = async (_rule: any, value: any) => {
      console.info(_rule);
      console.info(value);
      await testReturnCode500({}).then((response) => {
        if (response.code === '500') {
          return Promise.reject(new Error('error 测试后端校验'));
        }
        return Promise.resolve();
      }).catch((err) => {
        return Promise.reject(err);
      });
      return Promise.resolve();
    };
    return { validator };
  },

  // 自定义校验
  myValidator02: (form: any) => {
    const test91 = form?.getFieldValue('test91');    // 表单其他项目
    const validator = async (_rule: any, value: any) => {
      if (test91) {
        if (!value) {
          return Promise.reject(new Error('按需必录项目'));
        }
      }
      return Promise.resolve();
    };
    return { validator };
  },
}

// 表单事件：OnChange
Func.eventOnChange = {
  test91: (param: any) => {
    const { event, form, myItems, setMyItems } = param;
    // onChange({event, form: useform, myItems, setMyItems});
    // 表单id、录入值
    const formId = form.__INTERNAL__.name;
    const inputValue = event.target.value;
    // 获取其他项目值
    const test31 = form.getFieldValue('test31') || 0;
    // 表单赋值
    form.setFieldsValue({
      test01: 'onBlur测试数据',
      test11: myUtil.text.leadingZeroize(inputValue, 8),
      test12: myUtil.text.toUpper(formId),
      test13: test31,
    });
    // 按需必填字段
    const lableSpan: any = document.querySelector("#example_list_3_form .dditem_label_test02 span");
    if (inputValue) {
      lableSpan.classList.add('required');
    } else {
      lableSpan.classList.remove('required');
    }
    // 设置只读非只读 方式1
    const inputEle: any = document.querySelector("#example_list_3_form_test03");
    if (inputValue) {
      inputEle.setAttribute('readonly', true);
    } else {
      inputEle.removeAttribute('readonly');
    }
    // 设置只读非只读 方式2
    myItems[15].disabled = true;
    setMyItems([...myItems]);
  },
  test94: (param: any) => {
    const { value, form, option } = param;
    console.info(value);
    console.info(form);
    console.info(option);
  },
  test95: (param: any) => {
    const { date, dateString, form } = param;
    console.info(date);
    console.info(dateString);
    console.info(form);
  },
  test83: (param: any) => {
    const { value, form } = param;
    form.setFieldsValue({
      test84: myUtil.code.getCodeValByKey(value, 'code_dm_ckts_cktmsywlx'),
    });
  },
}

// 表单事件：OnBlur
Func.eventOnBlur = {
  test92: (param: any) => {
  }
}

// 表单事件：OnFocus
Func.eventOnFocus = {
  test93: (e: any, form: any) => {
  }
}

// 自定义导出
Func.handleExport = (param: any) => {
  console.info('自定义handleExport', param);
};

export default Func;