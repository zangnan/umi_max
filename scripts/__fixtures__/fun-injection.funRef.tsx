import React from 'react';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { querySjByHth, queryHlxx } from '@/services/hts/api';
import myUtil from '@/pages/common/myUtil';
import moment from 'moment';
import DDAlert from '@/components/DDAlert';
import importStyle from './importStyle.less';
import tableStyle from './style.less';
import { intl as intl2 } from '@/pages/common/myUtil';
import getStaticTableCode from '@/pages/common/staticTableCode';
import baseValidator from '@/pages/common/field/baseValidator';
import { history, useRouteMatch } from 'umi';
import cjpzUtil from '@/pages/common/cjpzUtil';

const Func: any = {
  refUnit: React.createRef(),
};

Func.initAddForm = (param: any) => {
  DditCktsFormCommonFunc.initAddForm(param);
};

// 规则测试: 箭头函数形式（initEditForm）+ 变量改名（unit_key/myFormItems/setMyFormItems）
Func.initEditForm = (param: any) => {
  const { form, myFormItems, setMyFormItems, handleModalVisible, unit_key } = param;
  const params: any = {
    form: form,
    myItems: myFormItems,
    setMyItems: setMyFormItems,
  };
  handleModalVisible(true);
  params.unit_key = unit_key;
};

// 规则测试: 对象字面量形式（validator）
Func.validator = {
  ssq02: (form: any) => DditCktsFormCommonFunc.validator.ssq02(form),
};

// 规则测试: 对象字面量形式（eventOnBlur）+ getCodeValByKey 3→2 参合并
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
          const gbname = myUtil.code.getCodeValByKey(gjhdqszDm, 'code_dm_gy_gjhdq', '01');
          if (gbname) {
            form.setFieldsValue({ gbname: gbname });
          }
        }
      });
    }
  },
};

// 规则测试: 对象字面量形式（eventOnFocus）
Func.eventOnFocus = {
  hbhlDm: (param: any) => {
    Func.eventOnChange.skrq(param);
  },
};

// 规则测试: 对象字面量形式（eventOnChange）
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
      ckrq: skrq ? moment(form?.getFieldValue('skrq')).format('YYYY-MM-DD') : ''
    });
  },
};

export default Func;
