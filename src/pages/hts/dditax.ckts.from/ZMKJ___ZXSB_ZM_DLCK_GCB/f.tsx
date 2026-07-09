/**
 * title: 代理出口货物证明申请表
 * author: wx
 */
import React from 'react';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { checkWtqyshCk, checkWtqymcCk, queryBgdByBgdNo21, querySpdmXxCj, queryHlxx, queryQywtf } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import { message } from 'antd';
import { getCmCode } from '@/pages/hts/services/htsApi';
import qxUtil from '@/pages/hts/common/qxUtil';
import moment from 'moment';

const Func: any = {
  refUnit: React.createRef(),
};

// 新建表单初始化
Func.initAddForm = (param: any) => {
  getstfnsrsbh(param);
  DditCktsFormCommonFunc.initAddForm(param);
}

// 编辑表单初始化
Func.initEditForm = (param: any) => {
  const { form, formItems, setFormItems, handleModalVisible, unitKey } = param;
  getstfnsrsbh(param);
  const params: any = {
    form: form,
    myItems: formItems,
    setMyItems: setFormItems,
  }
  handleModalVisible(true);
  const hbzmDm = form?.getFieldValue('hbzmDm'); // 原币币别代码
  params.unitKey = unitKey;
  params.value = hbzmDm;
  params.item = { name: 'hbzmDm' };
  Func.eventOnBlur.hbhlDm(params);
  Func.eventOnChange.hgjgfsDm(params);
};

// 表单保存后执行
Func.formAfterSubmit = (param: any) => {
  const { form } = param;
  // 初始化新建界面的基本信息
  DditCktsFormCommonFunc.initAddForm(param);
  // 清空指定字段（保留委托方信息）
  form.resetFields(['ckbgdh', 'myfsDm', 'myfsName', 'ckspDm', 'ckspmc', 'hgjldwmc', 'cksl', 'hbzmDm', 'cjbz', 'cjzj', 'cjzj', 'mylaj', 'rmblaj', 'bz']);
  form.setFieldsValue({ckrq1: null});
}

// 受托方统一社会信用代码/纳税人识别号
const getstfnsrsbh = (param: any) => {
  const { myFormItems, setMyFormItems } = param
  const obj = {
    page: 1,
    pageSize: 999999,
    searchModel: [{ property: "stfnsrsbh", value: "", op: "al" }],
  }
  queryQywtf(obj).then((res: any) => {
    const { code, body } = res;
    if (code === '200') {
      let list: any[] = [];
      if (body.rows && body.rows.length > 0) {
        myUtil.code.saveCodeToLocalTable('url_gy_qywtf', body.rows, '01');
        const rows = body.rows;
        rows.forEach((item: any) => {
          list.push({
            value: item['stfnsrsbh'],
            name: item['stfnsrsbh'],
          });
        })
      }
      myFormItems[8].list = list;
      setMyFormItems([...myFormItems]);
    }
  });
}

// 表单校验
Func.validator = {
  // 所属期
  ssq01: (form: any) => {
    return DditCktsFormCommonFunc.validator.ssq01(form);
  },
  // 申报批次
  sbpc02: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbpc02(form);
  },
  // 申报序号
  sbxh02: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbxh02(form);
  },
  // 编号
  sbbh101: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbbh101(form);
  },
  // 编号
  sbbh102: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbbh102(form);
  },
  // 项号
  xh401: (form: any) => {
    return DditCktsFormCommonFunc.validator.xh401(form);
  },
  // 委托企业名称一致性校验
  wtfnsrsbh01: (form: any) => {
    // 1.校验指定“所属期”、“编号”的代理证明申请记录是否与当前的委托纳税人名称是否一致
    const sbbh1 = form?.getFieldsValue().sbbh1;
    const uuid = form?.getFieldsValue().uuid;
    const ssq = form?.getFieldsValue().ssq;
    const wtfnsrsbh = form?.getFieldsValue().wtfnsrsbh;
    const validator = async (_rule: any, value: any) => {
      const params = {
        sbbh1: sbbh1,
        wtfnsrsbh: wtfnsrsbh,
        ssq: ssq,
        uuid: uuid
      };
      await checkWtqyshCk(params).then((response) => {
        const { code, msg } = response;
        if (code !== '200') {
          return Promise.reject(new Error(msg));
        }
        return Promise.resolve();
      })
      return Promise.resolve();
    };
    return { validator };
  },
  // 委托企业名称一致性校验
  wtfnsrmc01: (form: any) => {
    // 1.校验指定“所属期”、“编号”的代理证明申请记录是否与当前的委托纳税人名称是否一致
    const sbbh1 = form?.getFieldsValue().sbbh1;
    const uuid = form?.getFieldsValue().uuid;
    const ssq = form?.getFieldsValue().ssq;
    const wtfnsrmc = form?.getFieldsValue().wtfnsrmc;
    const validator = async (_rule: any, value: any) => {
      const params = {
        sbbh1: sbbh1,
        wtfnsrmc: wtfnsrmc,
        ssq: ssq,
        uuid: uuid,
      };
      await checkWtqymcCk(params).then((response) => {
        const { code, msg } = response;
        if (code !== '200') {
          return Promise.reject(new Error(msg));
        }
        return Promise.resolve();
      })
      return Promise.resolve();
    };
    return { validator };
  },
  dlckCksp: (form: any) => {
    const ckspDm = form?.getFieldValue('ckspDm');
    const validator = (_rule: any, value: any) => {
      if (ckspDm) {
        if (ckspDm.length != 10) {
          return Promise.reject(new Error('按报关单商品代码录入，不足10位的请在后面填0补位！'));
        }
      }
      return Promise.resolve();
    };
    return { validator };
  },
}
// 表单事件：OnBlur
Func.eventOnBlur = {
  // 申报批次
  sbpc: (param: any) => {
    // 申报批次自动补零
    DditCktsFormCommonFunc.eventOnBlur.sbpc(param);
  },
  // 申报序号
  sbxh: (param: any) => {
    // 申报序号自动补零
    DditCktsFormCommonFunc.eventOnBlur.sbxh(param);
  },
  // 序号
  xh4: (param: any) => {
    DditCktsFormCommonFunc.eventOnBlur.xh4(param);
  },
  // 美元离岸价
  mylaj: (param: any) => {
    DditCktsFormCommonFunc.eventOnBlur.mylaj(param);
  },
  // 美元汇率
  myhl: (param: any) => {
    const { form } = param;
    const mylaj = form?.getFieldsValue().mylaj; // 美元离岸价
    const myhl = form?.getFieldsValue().myhl; // 美元汇率
    // 计算：人民币离岸价= 美元离岸价 X 美元汇率
    const rmblaj = DditCktsFormCommonFunc.util.setRmbAmt({
      mylaj: mylaj,
      myhl: myhl
    });
    form.setFieldsValue({ rmblaj: rmblaj ? myUtil.text.getNumVal(myUtil.text.formatNum(rmblaj, '0, 0.00')) : '' });
  },
  // 出口商品代码
  ckspDm: (param: any) => {
    const { form } = param;
    // 通用的商品码回显逻辑
    const ckspDm = form?.getFieldValue('ckspDm');
    if (ckspDm) {
      handleCkspxxEvent(form);
    }
  },

  // 成交币制
  hbhlDm: (param: any) => {
    DditCktsFormCommonFunc.eventOnBlur.hbhlDm(param);
  },
  // 委托纳税人识别号
  wtfnsrsbh: (param: any) => {
    const { form } = param;
    const wtfnsrsbh = form?.getFieldValue('wtfnsrsbh');
    const option = myUtil.code.getCode('url_gy_qywtf:01');
    let wtfnsrmcs: any = '';
    let wtdlckhths: any = '';
    let wtdljkhths: any = '';
    const tempRows = option.filter((row: any) => {
      return (row.stfnsrsbh === wtfnsrsbh);
    })
    if (tempRows && tempRows.length > 0) {
      wtfnsrmcs = tempRows[0].stfmc;
      wtdlckhths = tempRows[0].wtdlckhth;
      wtdljkhths = tempRows[0].wtdlckhth;
    }
    if (wtfnsrmcs) {
      form.setFieldsValue({ wtfnsrmc: wtfnsrmcs })
    }
    if (wtdlckhths) {
      form.setFieldsValue({ wtdlckhth: String(wtdlckhths).trim(), })
    }
    if (wtdlckhths) {
      form.setFieldsValue({ wtdljkhth: wtdljkhths })
    }
  },
}
// 表单事件：OnFocus
Func.eventOnFocus = {
}
// 表单事件：OnChange
Func.eventOnChange = {
  // 所属期
  ssq: (param: any) => {
    DditCktsFormCommonFunc.eventOnChange.ssq(param);
  },
  // 贸易方式
  hgjgfsDm: (param: any) => {
    const { form } = param;
    const myfsDm = form?.getFieldsValue().myfsDm;
    const myfsName = myUtil.code.getCodeValByKey(myfsDm, 'code_dm_ckts_hgjgfs:01');
    form.setFieldsValue({
      myfsName: myfsName,
    });
  },
  // 出口报关单号
  ckbgdh: (param: any) => {
    // 该报关单号当期出口明细中不存在
    const { form } = param;
    const ckbgdh = form?.getFieldsValue().ckbgdh
    const ssq = form?.getFieldsValue().ssq
    const sbpc = form?.getFieldsValue().sbpc
    if (ckbgdh) {
      // 走后台接口
      queryBgdByBgdNo21({ ckbgdh }).then(async (res: any) => {
        const { body, code, msg } = res;
        if (code === '200') {
          if (body) {
            const option = myUtil.code.getCode('url_gy_hbhl:01');
            const tempRows = option.filter((row: any) => {
              return (row.hbzmDm === body?.cjhghbszDm);
            });
            let cjbz = '';
            if (tempRows && tempRows.length > 0) {
              cjbz = tempRows[0].hbmc;
            }
            form.setFieldsValue({
              myfsDm: body?.jgfsDm,
              myfsName: myUtil.code.getCodeValByKey(body.jgfsDm, 'code_dm_ckts_hgjgfs:01'),
              ckspDm: body.hgckspDm,
              ckspmc: body?.hgspmc,
              hgjldwmc: body?.hgjldwmc,
              cksl: myUtil.text.getNumVal(myUtil.text.formatNum(body.cksl, '0,0.00000')),
              hbzmDm: body.cjhghbszDm,
              cjbz: cjbz,
              cjzj: myUtil.text.getNumVal(myUtil.text.formatNum(body.cjzj, '0,0.00')),
              mylaj: myUtil.text.getNumVal(myUtil.text.formatNum(body.mylaj, '0,0.00')),
              rmblaj: myUtil.text.getNumVal(myUtil.text.formatNum(body.rmblaj, '0,0.00')),
              myhl: myUtil.text.getNumVal(myUtil.text.formatNum(body.myhl, '0,0.00000')),
              ckrq1: body?.ckrq1? moment(new Date(body.ckrq1)) : null
            });
            // const obj = {
            //   ssq: ssq,
            //   sbpc: sbpc,
            //   ckrq1: body.ckrq1,
            //   ckspDm: body.hgckspDm,
            //   ckbgdh: body.ckbgdh,
            //   slType: "Y"
            // }
            // querySpdmXxCjFun(obj, form);
            // getCodeDmGyHbhl01({ hbzmDm: 'USD' }, form)
          }
        } else {
          message.info(msg)
        }
      })
    }
  },
  // 委托纳税人识别号
  wtfnsrsbh: (param: any) => {
    const { form } = param;
    const stfnsrsbh = form?.getFieldValue('stfnsrsbh');
    const option = myUtil.code.getCode('url_gy_qywtf:01');
    let wtfnsrmcs: any = '';
    let wtdlckhths: any = '';
    let wtdljkhths: any = '';
    const tempRows = option.filter((row: any) => {
      return (row.stfnsrsbh === stfnsrsbh);
    })
    if (tempRows && tempRows.length > 0) {
      wtfnsrmcs = tempRows[0].stfmc;
      wtdlckhths = tempRows[0].wtdlckhth;
      wtdljkhths = tempRows[0].wtdlckhth;
    }
    form.setFieldsValue({
      wtfnsrmc: wtfnsrmcs,
      wtdlckhth: String(wtdlckhths).trim(),
      wtdljkhth: wtdljkhths
    });
  },
  hbhlDm: (param: any) => {
    const { form, value } = param;
    if (!value) {
      form.setFieldsValue({ cjbz: '' });
    }
  },
}

// 配置项：自定义工具栏 报关单生成明细
Func.bgdscmx = (param: any) => {
  DditCktsFormCommonFunc.bgdscmx({ ...param, type: 'zmkj' });
}

const querySpdmXxCjFun = (obj: {}, form: any) => {
  querySpdmXxCj(obj).then((res: any) => {
    const { body } = res;
    if (res.code == '200') {
      form.setFieldsValue({
        ckspmc: body?.sbhgspmc,
        hgjldwmc: body?.hgjldwmc,
      });
    } else if (res.code == '900') {
      message.info(res.msg)
    } else {
      message.error(res.desc)
    }
  })
}

/**
 * @author liwc
 * @method setVal
 * @desc 带出表单其他项（针对getCodeDmGyHbhl01反写）
 */
const getCodeDmGyHbhl01 = (data: any, form: any) => {
  if (data && data.hbzmDm) {
    const params = {
      searchModel: [
        { property: "hbzmDm", value: data.hbzmDm, op: "al" },
        { property: "ssq", value: data.ssq, op: "al" },
        { property: "ckrq", value: data.ckrq1, op: "al" },
        { property: "hlny", value: data.hlny, op: "al" },
      ],
      // searchModel: {
      //   hbzmDm: data.hbzmDm,
      //   ssq: data.ssq,
      //   ckrq: data.ckrq1,
      //   hlny: data.hlny
      // }
    };
    let result;
    queryHlxx(params).then((res: any) => {
      const { body, code } = res;
      if (code == '200' && body) {
        if (body.rows && body.rows.length > 0) {
          result = body.rows[0];
          if (result.myhl) {
            form.setFieldsValue({
              myhl: myUtil.text.getNumVal(myUtil.text.formatNum(result.myhl, '0,0.0000')),
            });
          } else {
            form.setFieldsValue({
              myhl: 0,
            });
          }
        }
      } else if (code == '900') {
        message.info(res.msg)
      } else {
        message.error(res.desc)
      }
    })
    return result;
  } else {
    return null;
  }
}
/**
 * @author jiangyg
 * @method handleCkspxxEvent
 * @desc 通用的商品码回显
 */
const handleCkspxxEvent = (form: any) => {
  const ckspDm = form.getFieldValue('ckspDm');
  const ssq = form.getFieldValue('ssq');
  const ckrq1 = form.getFieldValue('ckrq1');
  // 如果商品代码为空则直接清空商品名称和计量单位
  if (!ckspDm) {
    setCkspxx(form, {});
    return;
  }
  let param = { ckspDm, ssq, ckrq1, cxType: '1' };

  // 单一窗口调整(弃用)
  // const paramDyck = {
  //   qxCode: 'tssb_dyck',
  //   accessObj: Func.access,
  // }
  // if (qxUtil.getQxz(paramDyck)) {
  //   param.cxType='1';
  // }
  getCmCode(param).then((response) => {
    const { code, body, desc, msg } = response;
    if (code === '200') {
      if (body) {
        setCkspxx(form, {
          ckspDm: body.ckspDm,
          ckspmc: body.ckspmc,
          hgjldwmc: body.hgjldwmc,
        });
      }
      // else {
      //   message.info('此商品码不存在，请确认后填报');
      //   setCkspxx(form, {});
      // }
    } else if (code !== '200' && desc.trim()) {
      message.error(msg);
      return;
    }
  })
}
// 设置商品信息
const setCkspxx = (form: any, obj: any, eleName?: any) => {
  form.setFieldsValue({
    ckspDm: obj.ckspDm || '',
    ckspmc: obj.ckspmc || '',
    hgjldwmc: obj.hgjldwmc || '',
  });
}

export default Func;