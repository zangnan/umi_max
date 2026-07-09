/**
 * title: 先退后核附表
 * author: wx
 */
import cktsUtil from '@/pages/hts/cktsUtil';
import React from 'react';
import myUtil from '@/components/DDAssist/util';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { queryCkxxByCondition, checkSjcz, queryXthhJe } from '@/pages/hts/services/htsApi';
import { message } from 'antd';

const Func: any = {
  refUnit: React.createRef(),
};

// 新建表单初始化
Func.initAddForm = (param: any) => {
  DditCktsFormCommonFunc.initAddForm(param);
  Func.eventOnChange.cktmsywlxdmjh(param);
}

// 表单校验
Func.validator = {
  // 所属期
  ssq02: (form: any) => {
    return DditCktsFormCommonFunc.validator.ssq02(form);
  },
  // 申报序号
  sbxh02: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbxh02(form);
  },
  // 出口报关单号
  ckbgdh03: (form: any) => {
    const validator = async (_rule: any, value: any) => {
      const ssq = form?.getFieldValue('ssq');
      const ckbgdh = form?.getFieldValue('ckbgdh');
      const ckhth = form?.getFieldValue('ckhth'); 
			if (ssq && ckbgdh && ckhth) {
        await checkSjcz({ 
          ssq: ssq, 
          ckbgdh: ckbgdh, 
          ckhth: ckhth
        }).then((response) => {
          if (response.code !== '200') {
            return Promise.reject(new Error(response.msg));
          }
          return Promise.resolve();
        }).catch((err) => {
          return Promise.reject(err);
        });
			}
      return Promise.resolve();
    };
    return { validator };
  },
}
// 表单事件：OnBlur
Func.eventOnBlur = {
  // 申报序号
  sbxh: (param: any) => {
    // 申报序号自动补零
    DditCktsFormCommonFunc.eventOnBlur.sbxh(param);
  },
  // 出口报关单号
  ckbgdh: (param: any) => {
    const { form } = param;
    const ckbgdh = form?.getFieldValue('ckbgdh'); 
    const ssq = form?.getFieldValue('ssq'); 
    const sbpc = form?.getFieldValue('sbpc'); 
    const sbxh = form?.getFieldValue('sbxh'); 
    const qylx = cktsUtil.sys.enterpriseType();
    queryCkxxByCondition({ ssq, sbpc, qylx, sbxh, ckbgdh }).then((res: any) => {
      const { body, code, msg } = res;
      if(code === '200') {
        if(body && body.length > 0){
          form.setFieldsValue({ ckhth: body[0]?.ckhth ? body[0].ckhth : '' });
          setMylajMdtseByCkbgdhCkhth(param)
        }
      } else {
        message.info(msg)
      }
    })
  },
}
// 表单事件：OnFocus
Func.eventOnFocus = {
}
// 表单事件：OnChange
Func.eventOnChange = {
  cktmsywlxdmjh: (param: any) => {
    const { form } = param;
    const cktmsywlxdmjh = ['XTHH-XT'];
    const option = myUtil.code.getCode('code_dm_ckts_cktmsywlx:01');
    let arrId: any[] = [];
    let newVal: any[] = [];
    for (let i = 0; i < option.length; i++) {
      for (let j = 0; j < cktmsywlxdmjh.length; j++) {
        if (option[i].code === 'XTHH-XT') {
          arrId.push(option[i]['code']);
          newVal.push(option[i]['name']);
        }
      }
    }
    form.setFieldsValue({ cktmsywlxdmjh: arrId });
    if (arrId) {
      form.setFieldsValue({ cktmsywlxmcjh: newVal.join(',') });
    } else {
      form.setFieldsValue({ cktmsywlxmcjh: '' });
    }
  }
}

/**
 * @author jiangyg
 * @method setMylajMdtseByCkbgdhCkhth
 * @desc 根据报关单号、出口合同号、所属期，（业务类型中包含XTHH）检索免抵退出口明细过程表，获取美元离岸价和免抵退税额
 */
function setMylajMdtseByCkbgdhCkhth(param: any) {
  const { form } = param;
  const ckbgdh = form?.getFieldValue('ckbgdh'); 
  const ssq = form?.getFieldValue('ssq'); 
  const ckhth = form?.getFieldValue('ckhth'); 
  const mylaj = form?.getFieldValue('mylaj'); 
  const mdtse = form?.getFieldValue('mdtse'); 
  if (ssq && ckhth && ckbgdh && (!mylaj || !mdtse)) {
    queryXthhJe({ ssq, ckhth, ckbgdh }).then((res: any) => {
      const { body, code, msg, desc } = res;
      if (code != '200' && desc?.trim() != '') {
        message.info(msg);
        return;
      }
      if (!body) {
        return;
      }
      if (!mylaj) {
        form.setFieldsValue({ rmblaj: body.rmblaj ? myUtil.text.getNumVal(myUtil.text.formatNum(body.rmblaj, '0, 0.00')) : '' });
      }
      if (!mdtse) {
        form.setFieldsValue({ mdtse: body.mdtse ? myUtil.text.getNumVal(myUtil.text.formatNum(body.mdtse, '0, 0.00')) : '' });
      }
    })
  }
}
export default Func;