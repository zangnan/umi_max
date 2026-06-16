import React from 'react';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { querySjByHth, queryHlxx } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import dayjs from 'dayjs';
import DDAlert from '@/pages/hts/commonModule/DDAlert';
import { intl as intl2 } from '@/components/DDAssist/util';
import getStaticTableCode from '@/components/DDAssist/staticTableCode';
import baseValidator from '@/components/DDAssist/field/baseValidator';
import { history, useRouteData } from 'umi';
import cktsUtil from '@/pages/hts/cktsUtil';

const Func: any = {
  refUnit: React.createRef(),
};

// 新建表单初始化
Func.initAddForm = (param: any) => {
  DditCktsFormCommonFunc.initAddForm(param);
};

// 编辑表单初始化
Func.initEditForm = (param: any) => {
  const { form, formItems, setFormItems, handleModalVisible, unitKey } = param;
  const params: any = {
    form: form,
    myItems: formItems,
    setMyItems: setFormItems,
  };
  handleModalVisible(true);
  params.unitKey = unitKey;
};

// 表单校验
Func.validator = {
  ssq02: (form: any) => DditCktsFormCommonFunc.validator.ssq02(form),
};

// 表单事件：OnBlur
Func.eventOnBlur = {
  hth: (param: any) => {
    const { form } = param;
    const hth = form?.getFieldValue('hth');
    if (hth) {
      querySjByHth({ hth }).then((res) => {
        const { code, body } = res;
        if (code === '200' && body) {
          form.setFieldsValue({ fkyhmc: body.fkyhmc });
          // 测试 getCodeValByKey 3 参 → 2 参合并
          const gjhdqszDm = body.gjhdqszDm;
          const gbname = myUtil.code.getCodeValByKey(gjhdqszDm, 'code_dm_gy_gjhdq:01');
          if (gbname) {
            form.setFieldsValue({ gbname: gbname });
          }
        }
      });
    }
  },
};

// 表单事件：OnFocus
Func.eventOnFocus = {
  hbhlDm: (param: any) => {
    Func.eventOnChange.skrq(param);
  },
};

// 表单事件：OnChange
Func.eventOnChange = {
  // 测试 antd 4 → antd 6 迁移: moment → dayjs
  skrq: (param: any) => {
    const { form } = param;
    const skrq = form?.getFieldValue('skrq');
    DditCktsFormCommonFunc.util.loadCodeDmHbhlAutoComplete({
      form,
      url: '/test/url',
      key: 'test_key',
      codeViewKey: '01',
      ckrq: skrq ? dayjs(form?.getFieldValue('skrq')).format('YYYY-MM-DD') : ''
    });
  },
};

export default Func;
