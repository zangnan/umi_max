// 表单通用业务模块
import cktsUtil from '@/pages/hts/cktsUtil';
import { message, Modal, Form, Radio, Input } from 'antd';
import React from 'react';
import { glhcp, queryCjCsh, queryCjGlh, queryCjBh, checkMtsTssbGlh, checkJtgszbQydm, getUrlCode, checkSsqPcYsb, checkJtgszbSqrq, querySpdmXxCj, checkZmkjJyBhYsb, checkSsqYsbCj, checkZmkjJyXh, queryHlxx, queryShmxByCkbgdh } from '@/pages/hts/services/htsApi';
import myUtil, { intl as intl2 } from '@/components/DDAssist/util';
import moment from 'moment';
import { history } from 'umi';
import DDAlert from '@/pages/hts/components/DDAlert';

const DditCktsFormCommonFunc: any = {
  refUnit: React.createRef(),
};

// 新建表单初始化
DditCktsFormCommonFunc.initAddForm = (param: any) => {
  const { form, handleModalVisible, unitKey, unit_lcswsx_dm = '', refUnit, doSuccess, setMasker, tcbz } = param;
  if (setMasker) {
    setMasker(true);  // 按报关单生成明细：外贸、生产、证明开具
  } else {
    refUnit.current?.setMasker(true); // 通用页面
  }
  let apiParam: any = {
    lcswsxDm: unit_lcswsx_dm,
    tableKey: unitKey,
  };
  // 表单初始化1 除关联号外的其他字段
  queryCjCsh(apiParam).then((response) => {
    const { code, body } = response;
    if (code === '200') {
      let sbbh1 = body.sbbh1;
      if (tcbz === 'ZXSB_ZM_DLCK_GCB_ABGDSC') {
          sbbh1 = Number(sbbh1) + 1;
          sbbh1 = sbbh1 + '';
      }
      form.setFieldsValue({
        ssq: body.ssq,
        sbpc: body.sbpc,
        sbxh: body.sbxh,
        sbbh1: sbbh1,
        xh4: body.xh4,
        xh: body.xh,
        sqrq: body.sqrq ? moment(new Date(body.sqrq)) : null,
        tbrq1: body.tbrq1 ? moment(new Date(body.sqrq)) : null,
      });
      if (unitKey === 'ZMKJ_ZXSB_ZM_TYYBSWTS_G' &&  cktsUtil.sys.enterpriseType() == 'WM') { // 出口货物已补税/未退税证明采集
        form.setFieldsValue({
          ywclfs: '补税', // 业务处理方式
          czlx: '1'
        });
      } else if(unitKey === 'ZMKJ_ZXSB_ZM_TYYBSWTS_G' &&  cktsUtil.sys.enterpriseType() == 'SC') { // 出口货物已补税/未退税证明采集
        form.setFieldsValue({
          czlx: '1'
        });
      } else if(unitKey === 'MTS_ZXSB_SB_MTS_TSJH_G') { // 外贸企业出口退税进货明细申报表
        form.setFieldsValue({
          sz: 'V', // 税种
          cktmspzlxDm: '02', // 凭证种类
        });
      } else if (unitKey === 'MTS_ZXSB_SB_MTS_TSSB_G' || unitKey === 'MDT_ZXSB_SB_MDT_TSSB_G') { // 企业出口退税出口明细申报采集
        form.setFieldsValue({
          cktmsywlxdmjh: [],
        });
      } else if (unitKey === 'ZGBA_ZXSB_SB_MDT_XTHHZG_G') {
        form.setFieldsValue({
          tbrq1: moment(new Date(body.tbrq1))
        });
      } else if (unitKey === 'ZGBA_ZXSB_TX_CKTSYWTX_G') {
        form.setFieldsValue({
          tbrq1: moment(new Date(body.tbrq1))
        });
      } else if (unitKey === 'MTS_ZXSB_SB_MTS_TZSB_G') {
        form.setFieldsValue({
          wmqytzsblxDm: '1'
        });
      } else if (unitKey === 'ZMKJ_ZXSB_ZM_CKHWZNX_G') {
        form.setFieldsValue({
          czlx: '1'
        });
      }
      // 成功回调
      if (doSuccess) {
        doSuccess(response);
      }
      // 获取属期批次下最大申报编号+1
      // if (unitKey === 'ZMKJ_ZXSB_ZM_LLJG_G' || unitKey === 'ZMKJ_ZXSB_ZM_LLJGHX_G'
      //         || unitKey === 'ZMKJ_ZXSB_ZM_DLCK_G' || unitKey === 'ZMKJ_ZXSB_ZM_DLJK_G'
      //         || unitKey === 'ZMKJ_ZXSB_ZM_WTCK_G' || unitKey === 'ZMKJ_ZXSB_ZM_CKHWZNX_G'
      //         || unitKey === 'ZMKJ_ZXSB_ZM_TYYBSWTS_G'
      // ){
      //   let data ={ssq:'',sbpc:'',tableKey:unitKey};
      //   data.ssq = body?.ssq || '',
      //   data.sbpc = body?.sbpc || '',
      //   queryCjBh(data).then((res: any)=>{
      //     const {code, body, desc} = res;
      //     if(code === '200') {
      //       form.setFieldsValue({sbbh1:body?.sbbh1})
      //     }else{
      //       message.error(desc)
      //     }
      //   })
      // }
      // 表单初始化2 关联号
      if (unitKey === 'MTS_ZXSB_SB_MTS_TSSB_G') { // 外贸企业出口退税出口明细申报采集
        return queryCjGlh({
          sbpc: body?.sbpc || '',
          ssq: body?.ssq || '',
        });
      }
    }
    return;
  }).then((response2) => {
    if (response2) {
      const { code, body } = response2;
      if (code === '200') {
        form.setFieldsValue(body);  // 设置关联号
      }
    }
  }).finally(() => {
    if (setMasker) {
      setMasker(false);  // 按报关单生成明细：外贸、生产、证明开具
    } else {
      refUnit.current?.setMasker(false); // 通用页面
    }
    if (handleModalVisible) {
      handleModalVisible(true); // 通用页面
    }
  });
};

// 配置项：自定义工具栏 关联号重排
DditCktsFormCommonFunc.glhcp = (param: any) => {
  // edit by yangzq 关联号重排增加按所属期、申报批次进行排序
  const { refUnit, unit_key, unit_lcswsx_dm = '' } = param;
  const gridData = refUnit.current?.getGridData();
  if (!gridData || gridData.length <= 0) {
    message.info("无需要操作的数据");
    return;
  }
  queryCjCsh({ lcswsxDm: unit_lcswsx_dm, tableKey: unit_key }).then((response) => {
    const { code, body } = response;
    if (code === '200') {
      DDAlert.open({
        title: '关联号重排',
        infoType: 'warning',
        modalType: 'form',
        closeStatus: false,
        isFormContent: true,
        initFormContentValues: { ssq: body.ssq, sbpc: body.sbpc, qsglh: body.ssq + body.sbpc + "00000001", cpgz: '1' },
        content: <>
          <Form.Item name="ssq" label="申报年月" rules={[{ required: true, message: '请输入6位申报年月' }, () => ({
            validator(_, value) {
              if (value && (!value.match(/^[1-9]\d{3}(0[1-9]|1[0-2])$/))) {
                  return Promise.reject(new Error('请输入正确的格式'));
              }
              return Promise.resolve();
            },
          })
          ]}>
            <Input placeholder="请输入申报年月" onChange={(event: any) => {
              const ssq = event.target.value;
              const sbpc = DDAlert.getForms()?.getFieldsValue().sbpc;
              const qsglh = DDAlert.getForms()?.getFieldsValue().qsglh;
              if (ssq && sbpc) {
                if (qsglh) {
                  DDAlert.getForms().setFieldsValue({ qsglh: ssq + sbpc + qsglh.substring(qsglh.length - 8, qsglh.length) });
                } else {
                  DDAlert.getForms().setFieldsValue({ qsglh: ssq + sbpc + '00000001' });
                }
              }
            }}></Input>
          </Form.Item>
          <Form.Item name="sbpc" label="申报批次" rules={[{ required: true, message: '请输入3位申报批次' },
          () => ({
            validator(_, value) {
              if (value && !value.match(/^\d+$/)) {
                return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_number' })));
              }
              return Promise.resolve();
            }
          })
          ]}>
            <Input placeholder="请输入申报批次" onBlur={async (event: any) => {
              try {
                await DDAlert.getForms().validateFields(['sbpc'])
                let sbpc = event.target.value;
                if (sbpc && Number(sbpc) === 0) {
                  sbpc = '001';
                } else if (sbpc) {
                  sbpc = myUtil.text.leadingZeroize(sbpc, 3);
                }
                DDAlert.getForms().setFieldsValue({ sbpc: sbpc });
                const ssq = DDAlert.getForms()?.getFieldsValue().ssq;
                const qsglh = DDAlert.getForms()?.getFieldsValue().qsglh;
                if (ssq && sbpc) {
                  if (qsglh) {
                    DDAlert.getForms().setFieldsValue({ qsglh: ssq + sbpc + qsglh.substring(qsglh.length - 8, qsglh.length) });
                  } else {
                    DDAlert.getForms().setFieldsValue({ qsglh: ssq + sbpc + '00000001' });
                  }
                }
              } catch (error) {
              }
            }} />
          </Form.Item>
          <Form.Item name="qsglh" label="起始关联号" rules={[{ required: true, message: '请输入起始关联号' },
          () => ({
            validator(_, value) {
              if (value) {
                if (!value.match(/^\d+$/)) {
                  return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_number' })));
                }
                const ssq = DDAlert.getForms()?.getFieldsValue().ssq;
                const sbpc = DDAlert.getForms()?.getFieldsValue().sbpc;
                if (ssq && sbpc && (ssq +sbpc != value.substr(0,9))) {
                  return Promise.reject(new Error("与关联号规则（所属期+申报批次+8位流水号）不符，请确认后操作！"));
                }
              }
              return Promise.resolve();
            }
          })
          ]}>
            <Input placeholder="请输入起始关联号" />
          </Form.Item>
          <Form.Item label="重排规则" name="cpgz" >
            <Radio.Group >
              <Radio value="1">录入顺序</Radio>
              <Radio value="2">出口日期升序</Radio>
            </Radio.Group>
          </Form.Item>
        </>,
        okCallbackFn: function (thisObj: any) {
          DDAlert.getForms().validateFields().then((values: any) => {
            thisObj.setState({ masker: true });
            glhcp(values).then((response) => {
              const { code, desc } = response;
              thisObj.setState({ masker: false });
              if (code === '200') {
                DDAlert.close();
                message.info('关联号重排成功');
                refUnit.current?.setSelectionRowKeys([]);  // 设置SelectionRows
                refUnit.current?.setSelectionRows([]);     // 设置SelectionRowKeys
                refUnit.current?.reload2();
              } else {
                message.error(desc);
              }
            })
          });
        },
      });
    }
  })
}

// 配置项：自定义工具栏 发票生成明细
DditCktsFormCommonFunc.fpscmx = (param: any) => {
  const { otherRef, modelIndex = 0 } = param;
  otherRef[modelIndex].current!.showModal(param);
};

// 配置项：自定义工具栏 报关单生成明细
DditCktsFormCommonFunc.bgdscmx = (param: any) => {
  const { otherRef, modelIndex = 0 } = param;
  otherRef[modelIndex].current!.showModal(param);
};

// 配置项：自定义工具栏 货物冲减
DditCktsFormCommonFunc.hwcj = (param: any) => {
  const { otherRef, modelIndex = 0 } = param;
  otherRef[modelIndex].current!.showModal(param);
};

// 配置项：自定义工具栏 进货明细
DditCktsFormCommonFunc.jhmx = (param: any) => {
  const { otherRef, modelIndex = 0 } = param;
  otherRef[modelIndex].current!.showModal(param);
};

// 表单事件：OnBlur
DditCktsFormCommonFunc.eventOnBlur = {
  // 申报批次
  sbpc: (param: any) => {
    const { event, form, otherParam } = param;
    const inputValue = event.target.value;
    if(inputValue && Number(inputValue) === 0) {
      form.setFieldsValue({
        sbpc: '001',
      });
    } else if(inputValue) {
      form.setFieldsValue({
        sbpc: myUtil.text.leadingZeroize(inputValue, 3),
      });
    }

    const sbpc = event.target.value;
    const ssq = form?.getFieldsValue().ssq;
    const unitKey = otherParam?.unit_key;
    // 修改申报批次-获取属期批次下最大申报编号
    if (unitKey === 'ZMKJ_ZXSB_ZM_LLJG_G' || unitKey === 'ZMKJ_ZXSB_ZM_LLJGHX_G'
            || unitKey === 'ZMKJ_ZXSB_ZM_DLCK_G' || unitKey === 'ZMKJ_ZXSB_ZM_DLJK_G'
            || unitKey === 'ZMKJ_ZXSB_ZM_WTCK_G' || unitKey === 'ZMKJ_ZXSB_ZM_CKHWZNX_G'
            || unitKey === 'ZMKJ_ZXSB_ZM_TYYBSWTS_G'
    ){
      let data ={ssq:ssq,sbpc:sbpc,tableKey:unitKey};
      queryCjBh(data).then((res: any)=>{
        const {code, body, desc} = res;
        if(code === '200') {
          form.setFieldsValue({sbbh1:body?.sbbh1})
        }else{
          message.error(desc)
        }
      })
      return
    }

  },
  // 申报序号
  sbxh: (param: any) => {
    const { event, form, item } = param;
    const inputValue = event.target.value;
    if(inputValue && Number(inputValue) === 0) {
      form.setFieldsValue({
        [item.name]: '00000001',  // 自动补零
      });
    } else {
      form.setFieldsValue({
        [item.name]: myUtil.text.leadingZeroize(inputValue, 8),  // 自动补零
      });
    }
  },
  // 出口货物销售额
  cjzj: (param: any) => {
    const { form, otherParam } = param;
    const unitKey = otherParam?.unit_key;
    if (unitKey === 'MDT_ZXSB_SB_MDT_TSSB_G') {

    } else {
      // 计算出口货物销售额折合人民币金额=出口销售金额*销售币种汇率/100，保留2位小数
      let cjhbhl = form.getFieldsValue().cjhbhl;
      let cjzj =  form.getFieldsValue().cjzj;
      if(cjhbhl && cjzj){
        let ckxsermb = (cjhbhl * cjzj)/100;
        form.setFieldsValue({
          ckxsermb: myUtil.text.getNumVal(myUtil.text.formatNum(ckxsermb, '0,0.00')),
        });
      }
    }
  },
  // 销售币种汇率
  cjhbhl: (param: any) => {
    // 计算出口货物销售额折合人民币金额=出口销售金额*销售币种汇率/100，保留2位小数
    const { form } = param;
    let cjhbhl = form.getFieldsValue().cjhbhl;
    let cjzj =  form.getFieldsValue().cjzj;
    if(cjhbhl && cjzj){
      let ckxsermb = (cjhbhl * cjzj)/100;
      form.setFieldsValue({
        ckxsermb: myUtil.text.getNumVal(myUtil.text.formatNum(ckxsermb, '0,0.00')),
      });
    }
  },
  // 出口收汇金额
  ckshje: (param: any) => {
    // 计算出口货物收汇折合人民币金额=出口收汇金额*出口收汇币种汇率/100，保留2位小数
    const { form } = param;
    let ckshje = form.getFieldsValue().ckshje;
    let ckshhbhl =  form.getFieldsValue().ckshhbhl;
    if(ckshje && ckshhbhl){
      let ckshjermb = (ckshje * ckshhbhl)/100;
      form.setFieldsValue({
        ckshjermb: myUtil.text.getNumVal(myUtil.text.formatNum(ckshjermb, '0,0.00')),
      });
    }
  },
  // 出口收汇金额
  ckshhbhl: (param: any) => {
    // 计算出口货物收汇折合人民币金额=出口收汇金额*出口收汇币种汇率/100，保留2位小数
    const { form } = param;
    let ckshje = form.getFieldsValue().ckshje;
    let ckshhbhl =  form.getFieldsValue().ckshhbhl;
    if(ckshje && ckshhbhl){
      let ckshjermb = (ckshje * ckshhbhl)/100;
      form.setFieldsValue({
        ckshjermb: myUtil.text.getNumVal(myUtil.text.formatNum(ckshjermb, '0,0.00')),
      });
    }
  },
  // 视同收汇举证材料种类代码（原tableSelect）
  stshqkjzclzl: (param: any) => {
    const { form } = param;
    const stshqkjzclzl = form?.getFieldsValue().stshqkjzclzl
    const option = myUtil.code.getCode('code_cs_ckts_stshqkjzclzl:01');
    let arrId: any[] = [];
    for (let i = 0; i < option.length; i++) {
      for (let j = 0; j < stshqkjzclzl.length; j++) {
        if (option[i].code == stshqkjzclzl[j]) {
          arrId.push(option[i]['code']);
        }
      }
    }
    form.setFieldsValue({ stshqkjzclzl: arrId });
  },
  // 美元离岸价
  mylaj: (param: any) => {
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
  // 项号
  xh4: (param: any) => {
    // 申报序号自动补零
    const { event, form } = param;
    const inputValue = event.target.value;
    if(inputValue) {
      if(inputValue == 0 || inputValue == '00'){
        form.setFieldsValue({
          xh4: '01',
        });
      } else {
        form.setFieldsValue({
          xh4: myUtil.text.leadingZeroize(inputValue, 2),
        });
      }
    }
  },
  // 成交币制
  hbhlDm: (param: any, glName:any) => {
    const { form, event, value, item, otherParam, unit_key } = param;
    const unitKey = unit_key || otherParam?.unit_key;
    const inputValue = event?.target?.value || value;
    // 根据币种带出名称
    const option = myUtil.code.getCode('url_gy_hbhl:01');
    let arrId: any = '';
    let newVal: any = '';
		let rmbhlVals: any = '';
		let myhlVals: any = '';
    const tempRows = option.filter((row: any) => {
      return (row.hbzmDm === inputValue);
    });
    if (tempRows && tempRows.length < 1) {
      if(inputValue){
        message.info('不存在该选项');
      }
      if(glName && glName.length > 0) {
        glName.forEach((element:any) => {
          form.resetFields([[element]]);
        });
      }
      form.resetFields([[item.name]]);
      return;
    }
    arrId = tempRows[0].hbzmDm;
    newVal = tempRows[0].hbmc;
    rmbhlVals = tempRows[0].rmbhl;
    myhlVals = tempRows[0].myhl;
    // unit_Key有值时为编辑表单初始化加载，rmbhl与myhl取表单内的值
    if (unit_key) {
      rmbhlVals = form?.getFieldValue('rmbhl');
      myhlVals = form?.getFieldValue('myhl');
      if (unitKey === 'TSZL_ZXSB_SB_CKSH_G') {
        if (item.name === 'cjhbzmDm') {
          rmbhlVals = form?.getFieldValue('cjhbhl');
        } else if (item.name === 'ckshhbzmDm') {
          rmbhlVals = form?.getFieldValue('ckshhbhl');
        }
      } else if (unitKey === 'ZMKJ_ZXSB_ZM_DLCK_G') {
        myhlVals = form?.getFieldValue('myhl');
      } else if (unitKey === 'MDT_ZXSB_SB_MDT_TSSB_G') {
        rmbhlVals = form?.getFieldValue('cjhbhl');
        myhlVals = form?.getFieldValue('myhl');
      } else if (unitKey === 'MDT_ZXSB_SB_MDT_HKYS_QS_G') {
        rmbhlVals = form?.getFieldValue('cjhbhl');
      } else if (unitKey === 'MDT_ZXSB_SB_MDT_KYHJ_G') {
        rmbhlVals = form?.getFieldValue('cjhbhl');
      } else if (unitKey === 'MDT_ZXSB_SB_MDT_SYYK_G') {
        rmbhlVals = form?.getFieldValue('ybhl');
        myhlVals = form?.getFieldValue('myhl');
      } else if (unitKey === 'MDT_ZXSB_SB_MDT_YFSJ_G') {
        if (item.name === 'srybzmDm') {
          rmbhlVals = form?.getFieldValue('srybhl');
          myhlVals = form?.getFieldValue('srmyhl');
        } else if (item.name === 'skybzmDm') {
          rmbhlVals = form?.getFieldValue('cjhbhl');
          myhlVals = form?.getFieldValue('myhl');
        }
      } else if (unitKey === 'MDT_ZXSB_SB_MDT_GJYS_G') {
        rmbhlVals = form?.getFieldValue('ybhl');
        myhlVals = form?.getFieldValue('myhl');
      }
    }
    if (unitKey === 'TSZL_ZXSB_SB_CKSH_G') {
      if (item.name === 'cjhbzmDm') {
        form.setFieldsValue({
          cjhbzmmc: newVal,
          cjhbhl: myUtil.text.getNumVal(myUtil.text.formatNum(rmbhlVals, '0,0.00000')),
        });
      } else if (item.name === 'ckshhbzmDm') {
        form.setFieldsValue({
          ckshhbzmmc: newVal,
          ckshhbhl: myUtil.text.getNumVal(myUtil.text.formatNum(rmbhlVals, '0,0.00000')),
        });
      }
    } else if (unitKey === 'ZMKJ_ZXSB_ZM_DLCK_G') {
      form.setFieldsValue({
        hbzmDm: arrId,
        cjbz: newVal,
        myhl: myUtil.text.getNumVal(myUtil.text.formatNum(myhlVals, '0,0.00000')),
      });
    } else if (unitKey === 'MDT_ZXSB_SB_MDT_TSSB_G') {
      form.setFieldsValue({
        ckshhbzmDm: arrId,
        biname: newVal,
        cjhbhl: myUtil.text.getNumVal(myUtil.text.formatNum(rmbhlVals, '0,0.00000')),
        myhl: myUtil.text.getNumVal(myUtil.text.formatNum(myhlVals, '0,0.00000')),
      });
      DditCktsFormCommonFunc.util.setMdtTssbgtjs(param, 'ckxxjs-rmb');
      DditCktsFormCommonFunc.util.setMdtTssbgtjs(param, 'ckxxjs-my');
      DditCktsFormCommonFunc.util.setMdtTssbgtjs(param, 'tsxxjs');
    } else if (unitKey === 'MDT_ZXSB_SB_MDT_HKYS_QS_G') {
      form.setFieldsValue({
        qsbzmc: newVal,
        cjhbhl: myUtil.text.getNumVal(myUtil.text.formatNum(rmbhlVals, '0,0.00000')),
      });
    } else if (unitKey === 'MDT_ZXSB_SB_MDT_KYHJ_G') {
      form.setFieldsValue({
        ybbiname: newVal,
        cjhbhl: myUtil.text.getNumVal(myUtil.text.formatNum(rmbhlVals, '0,0.00000')),
      });
      const ljDate = form.getFieldValue('kjrq') ? myUtil.grid.formatDate(form.getFieldValue('kjrq'), 'YYYY-MM-DD') : '';
      DditCktsFormCommonFunc.util.getmyhlByLjDate(ljDate, param);
    } else if (unitKey === 'MDT_ZXSB_SB_MDT_SYYK_G') {
      form.setFieldsValue({
        biname: newVal,
        ybhl: myUtil.text.getNumVal(myUtil.text.formatNum(rmbhlVals, '0,0.00000')),
        myhl: myUtil.text.getNumVal(myUtil.text.formatNum(myhlVals, '0,0.00000')),
      });
      DditCktsFormCommonFunc.util.setMdtSyykgtjs(param)
    } else if (unitKey === 'MDT_ZXSB_SB_MDT_YFSJ_G') {
      if (item.name === 'srybzmDm') {
        form.setFieldsValue({
          srbiname: newVal,
          srybhl: myUtil.text.getNumVal(myUtil.text.formatNum(rmbhlVals, '0,0.00000')),
          srmyhl: myUtil.text.getNumVal(myUtil.text.formatNum(myhlVals, '0,0.00000')),
        });
				DditCktsFormCommonFunc.util.setMdtYfsjgtjs(param, 'sr');
				DditCktsFormCommonFunc.util.setMdtYfsjgtjs(param, 'sr-rmb');
      } else if (item.name === 'skybzmDm') {
        form.setFieldsValue({
          skbiname: newVal,
          cjhbhl: myUtil.text.getNumVal(myUtil.text.formatNum(rmbhlVals, '0,0.00000')),
          myhl: myUtil.text.getNumVal(myUtil.text.formatNum(myhlVals, '0,0.00000')),
        });
				DditCktsFormCommonFunc.util.setMdtYfsjgtjs(param, 'sk');
				DditCktsFormCommonFunc.util.setMdtYfsjgtjs(param, 'sk-rmb');
      }
    } else if (unitKey === 'MDT_ZXSB_SB_MDT_GJYS_G') {
      // 通过原币汇率，美元汇率，反算人民币营业额、应税服务营业额（美元）
      form.setFieldsValue({
        ybbiname: newVal,
        ybhl: myUtil.text.getNumVal(myUtil.text.formatNum(rmbhlVals, '0,0.00000')),
        myhl: myUtil.text.getNumVal(myUtil.text.formatNum(myhlVals, '0,0.00000')),
      });
      // 业务逻辑参考老代码
      DditCktsFormCommonFunc.util.setYsfwyye(param);
    }
  },
  bgdCksh: async (param: any, btzd: any) => {
    const { form, event, dbtzd, ywKey } = param;
    const obj: any = {
      ckbgdh: event.target.value,
      ywKey: ywKey
    };
    if ('MTS' === ywKey) {
      obj.ssq = form?.getFieldValue('ssq');
      obj.sbpc = form?.getFieldValue('sbpc');
    }
    if ('MDT' === ywKey) {
      obj.ssq = form?.getFieldValue('ssq');
    }
    await queryShmxByCkbgdh(obj).then((res: any) => {
      const { code, body } = res;
      if (code === '200') {
        const result: any = {};
        dbtzd.forEach((item: any) => {
          result[item] = body[item];
        });
        form.setFieldsValue(result);
      }
    });
  },
};

// 表单事件：OnChange
DditCktsFormCommonFunc.eventOnChange = {
  // 所属期
  ssq: (param: any) => {
    const { event, form, otherParam } = param;
    const ssq = event.target.value;
    const sbpc = form?.getFieldsValue().sbpc;
    const glh = form?.getFieldsValue().glh;
    const unitKey = otherParam?.unit_key;
    // 赋值关联号
    // 外贸企业出口退税出口明细申报
    if (unitKey === 'MTS_ZXSB_SB_MTS_TSSB_G') {
      if (ssq && sbpc) {
        if (glh) {
          form.setFieldsValue({ glh: ssq + sbpc + glh.substring(glh.length - 8, glh.length) });
        } else {
          form.setFieldsValue({ glh: ssq + sbpc + '00000001' });
        }
      }
      return
    }

    // 修改所属期-获取属期批次下最大申报编号
    if (unitKey === 'ZMKJ_ZXSB_ZM_LLJG_G' || unitKey === 'ZMKJ_ZXSB_ZM_LLJGHX_G'
            || unitKey === 'ZMKJ_ZXSB_ZM_DLCK_G' || unitKey === 'ZMKJ_ZXSB_ZM_DLJK_G'
            || unitKey === 'ZMKJ_ZXSB_ZM_WTCK_G' || unitKey === 'ZMKJ_ZXSB_ZM_CKHWZNX_G'
            || unitKey === 'ZMKJ_ZXSB_ZM_TYYBSWTS_G'
    ){
      let data ={ssq:ssq,sbpc:sbpc,tableKey:unitKey};
      queryCjBh(data).then((res: any)=>{
        const {code, body, desc} = res;
        if(code === '200') {
          form.setFieldsValue({sbbh1:body?.sbbh1})
        }else{
          message.error(desc)
        }
      })
      return
    }

    const sbbh1  = form?.getFieldsValue().sbbh1;
    if (sbbh1) {
      form.setFieldsValue({ sbbh1: ssq + sbbh1.substring(sbbh1.length - 4, sbbh1.length) });
    } else {
      form.setFieldsValue({ sbbh1: ssq + '0001' });
    }
  },
  // 调整后商品代码
  tzhckspDm: (param: any) => {
    // 根据调整后商品代码带出名称, 校验是否为无效商品代码
    const { form } = param;
    const tzhckspDm = form.getFieldsValue().tzhckspDm
    const ssq = form.getFieldsValue().ssq;
    let ckrq1 = form.getFieldsValue().ckrq1;
    if(tzhckspDm) {
      if(ckrq1) {
        ckrq1 = moment(ckrq1).format('YYYY-MM-DD');
      } else  if (!ckrq1 && ssq) {
        ckrq1 = ssq.substr(0, 4) + '-' + ssq.substr(4, 6) + '-01';
      }
      const obj = {
        ssq,
        slType: "Y",
        ckrq1: moment(ckrq1).format('YYYY-MM-DD'),
        ckspDm: tzhckspDm,
      }
      querySpdmXxCj(obj).then((res: any) => {
        if (res.code == '200') {
          form.setFieldsValue({
            tzhhgspmc: res.body.sbspmc,
            tzhtsl: myUtil.text.getNumVal(myUtil.text.formatNum(res.body.tsl, '0, 0.0000')),
          });
        } else if(res.code == '900') {
          message.info(res.msg)
          form.setFieldsValue({
            tzhhgspmc: '',
            tzhtsl: 0,
            tzhckspDm: '',
          });
        } else {
          message.error(res.desc)
          form.setFieldsValue({
            tzhhgspmc: '',
            tzhtsl: 0,
            tzhckspDm: '',
          });
        }
      })
    } else {
      form.setFieldsValue({
        tzhhgspmc: '',
        tzhtsl: 0,
        tzhckspDm: '',
      });
    }
  },
  // 申报商品代码
  sbspDm2: (param: any) => {
    const { form, value, otherParam } = param;
    const unitKey = otherParam?.unit_key;
    const ckspDm = value;
    const ckrq1 = form.getFieldValue('ckrq1');
    const ssq = form.getFieldValue('ssq');
    const ckbgdh = form.getFieldValue('ckbgdh');
    const sbspmc = myUtil.code.getCodeValByKey(value, 'code_dm_cs_ckts_cksp:03');
    if (sbspmc) {
      form.setFieldsValue({
        sbspDm: value,
        sbspmc: sbspmc
      });
    }
		if (!ckspDm) {
      form.setFieldsValue({
        sbspDm: '',
        sbspmc: '',
      });
      if (unitKey == 'MDT_ZXSB_SB_MDT_TSSB_G') {
        form.setFieldsValue({
          tsl: '',
        });
      }
			return;
		}
		if (!ckrq1) {
			message.info('请先录入出口日期！');
      form.setFieldsValue({
        sbspDm: '',
        sbspmc: '',
      });
			return;
		}
    if (unitKey === 'MTS_ZXSB_SB_MTS_TSSB_G' || unitKey === 'MDT_ZXSB_SB_MDT_TSSB_G') {
      querySpdmXxCj({
        ckspDm: ckspDm,
        ssq: ssq,
        ckrq1: ckrq1,
        slType: 'Y',
        ckbgdh: ckbgdh
      }).then((res: any) => {
        const { body } = res;
        if (res.code != '200') {
          message.info('申报商品代码无效，请确认后填报！')
          form.setFieldsValue({
            sbspDm: '',
            sbspmc: '',
          });
        } else {
          // 代办退税和免抵退出口表 需要重新设置退税率
          if (unitKey == 'MDT_ZXSB_SB_MDT_TSSB_G') {
            let data = body;
            // 设置退税率
            form.setFieldsValue({
              tsl: body.tsl ? myUtil.text.getNumVal(myUtil.text.formatNum(data.tsl, '0,0.00')) : '',
            });
          }
        }
      })
    }
  },
  // 业务类型代码（原tableSelect）
  cktmsywlxdmjh: async (param: any) => {
    const { form, otherParam,myItems, setMyItems} = param;
    const unitKey = otherParam?.unit_key;
    const cktmsywlxdmjh = form?.getFieldValue('cktmsywlxdmjh');
    let codeKey = '01';
    if (unitKey == 'DBTS_ZXSB_SB_DB_TSSB_G') {
      codeKey = '05';
    } else if (unitKey == 'MDT_ZXSB_SB_MDT_TSSB_G') {
      codeKey = '04';
    } else if (unitKey == 'MTS_ZXSB_SB_MTS_TSSB_G') {
      codeKey = '06';
    }
    await myUtil.code.getCodeFromServerT1('code_dm_ckts_cktmsywlx', codeKey);
    let option = myUtil.code.getCode('code_dm_ckts_cktmsywlx', codeKey);
    let arrId: any[] = [];
    let newVal: any[] = [];
    for (let i = 0; i < option.length; i++) {
      for (let j = 0; j < cktmsywlxdmjh.length; j++) {
        if (option[i].code == cktmsywlxdmjh[j]) {
          arrId.push(option[i]['code']);
          newVal.push(option[i]['name']);
        }
      }
    }
    // 出口非自产货物 出口明细业 代办退税明细 业务类型
    if (arrId.length > 3) {
      message.info('业务类型最多选择三项，请确认后填报！');
      arrId = arrId.splice(0, 3);
      newVal = newVal.splice(0, 3);
    }
    form.setFieldsValue({ cktmsywlxdmjh: arrId });
    if (arrId) {
      form.setFieldsValue({ cktmsywlxmcjh: newVal.join(',') });
    } else {
      form.setFieldsValue({ cktmsywlxmcjh: '' });
    }

    let lableSpan1: any;
    let lableSpan2: any;
    let lableSpan4: any;
    if (unitKey === 'MTS_ZXSB_SB_MTS_TSSB_G') {
      lableSpan1 = document.querySelector("#mts_zxsb_sb_mts_tssb_gcb_form .dditem_label_gnqyfsDm span");
      lableSpan2 = document.querySelector("#mts_zxsb_sb_mts_tssb_gcb_form .dditem_label_hgzsrzqylxDm span");
      lableSpan4 = document.querySelector("#mts_zxsb_sb_mts_tssb_gcb_form .dditem_label_hzcjyyDm span");
    } else if (unitKey === 'DBTS_ZXSB_SB_DB_TSSB_G') {
      lableSpan1 = document.querySelector("#dbts_zxsb_sb_db_tssb_gcb_form .dditem_label_gnqyfsDm span");
      lableSpan2 = document.querySelector("#dbts_zxsb_sb_db_tssb_gcb_form .dditem_label_hgzsrzqylxDm span");
      lableSpan4 = document.querySelector("#dbts_zxsb_sb_db_tssb_gcb_form .dditem_label_hzcjyyDm span");
    } else if (unitKey === 'MDT_ZXSB_SB_MDT_TSSB_G') {
      lableSpan1 = document.querySelector("#mdt_zxsb_sb_mdt_tssb_gcb_form .dditem_label_gnqyfsDm span");
      lableSpan2 = document.querySelector("#mdt_zxsb_sb_mdt_tssb_gcb_form .dditem_label_hgzsrzqylxDm span");
      lableSpan4 = document.querySelector("#mdt_zxsb_sb_mdt_tssb_gcb_form .dditem_label_hzcjyyDm span");
      const lableSpan3: any = document.querySelector("#mdt_zxsb_sb_mdt_tssb_gcb_form .dditem_label_bz span");
      if (arrId.indexOf('JGW') > -1 || arrId.indexOf('HXWH') > -1 || arrId.indexOf('HCWH') > -1) {
        lableSpan3.classList.add('required');
      } else {
        lableSpan3.classList.remove('required');
      }
    }
    const hzcjyyDmItem = myItems.find((row: any) => {
      return (row.name === 'hzcjyyDm');
    });
    if (arrId && arrId.indexOf('QYGTS') != -1) {
      lableSpan1.classList.add('required');
      lableSpan2.classList.add('required');
      if(lableSpan4){
        lableSpan4.classList.remove('required');
        hzcjyyDmItem.disabled = true;
      }
    } else if (arrId && arrId.includes('HZCJ') && lableSpan4) {
      lableSpan4.classList.add('required');
      hzcjyyDmItem.disabled = false;
      lableSpan1.classList.remove('required');
      lableSpan2.classList.remove('required');
    } else{
      lableSpan1.classList.remove('required');
      lableSpan2.classList.remove('required');
      if(lableSpan4){
        lableSpan4.classList.remove('required');
        form.setFieldsValue({
          hzcjyyDm: '',
        });
        hzcjyyDmItem.disabled = true;
      }
    }
    setMyItems([...myItems])
  },
  // 出口收汇日期
  ckshrq: (param: any) => {
    const { form } = param;
    // 根据收汇日期改变码表内容
    const url = '/yw/bszx/ggfw/sbcs/ywcsxx/queryHlxx';
    const ckshrq = form?.getFieldValue('ckshrq');
    DditCktsFormCommonFunc.util.loadCodeDmHbhlAutoComplete({
      form,
      url,
      key: 'url_gy_hbhl',
      codeViewKey: '01',
      ckrq: ckshrq ? moment(ckshrq).format('YYYY-MM-DD') : ''
    })
  },
  // 视同收汇原因代码
  stshqkyy: (param: any) => {
    const { form } = param;
    const stshqkyy = form?.getFieldsValue().stshqkyy
    const option = myUtil.code.getCode('code_cs_ckts_stshqkyy:01');
    let arrId: any[] = [];
    let newVal: any[] = [];
    for (let i = 0; i < option.length; i++) {
      for (let j = 0; j < stshqkyy.length; j++) {
        if (option[i].code == stshqkyy[j]) {
          arrId.push(option[i]['code']);
          newVal.push(option[i]['name']);
        }
      }
    }
    form.setFieldsValue({ stshqkyy: arrId });
    form.setFieldsValue({ stshqkyyjtsm: newVal.join(',') });
  },
  // 国内启运方式（原系统change方法仅赋值使用，本系统无需翻译）
  gnqyfsDm: (param: any) => {
  },
  // 海关总署认证企业类型（原系统change方法仅赋值使用，本系统无需翻译）
  hgzsrzqylxDm: (param: any) => {
  },
};

// 表单事件：OnFocus
DditCktsFormCommonFunc.eventOnFocus = {
};

DditCktsFormCommonFunc.validator = {
  // 所属期
  ssq01: (form?: any) => {
    const ssq = form?.getFieldValue('ssq');
    const sbpc = form?.getFieldValue('sbpc');
    const unitKey = form?.otherParam?.unit_key;
    const apiParam: any = {
      ssq,
      tableKey: unitKey,
    };
    if (unitKey !== 'MDT_ZXSB_SB_MDT_TSSB_G') {
      apiParam.sbpc = sbpc;
    }
    // 请求后端验证所属期是否已申报
    const validator = async (_rule: any, value: any) => {
      if (unitKey === 'TSZL_ZXSB_SB_CKSH_G' || unitKey === 'TSZL_ZXSB_SB_HPSGTZ_G' || history.location.pathname.indexOf('SBMXCX') > -1
      || history.location.pathname.indexOf('/27/2705') > -1 || history.location.pathname.indexOf('/26/2605') > -1 || history.location.pathname.indexOf('/25/2505') > -1) {
        return Promise.resolve();
      } else {
        await checkSsqPcYsb(apiParam).then((response) => {
          if (response.code !== '200') {
            return Promise.reject(new Error(response.msg));
          }
          return Promise.resolve();
        }).catch((err) => {
          return Promise.reject(err);
        });
        return Promise.resolve();
      }
    };
    return { validator };
  },
  // 所属期
  ssq02: (form?: any) => {
    const unitKey = form?.otherParam?.unit_key;
    // 该申报所属期已申报，请确认后填报
    const validator = async (_rule: any, value: any) => {
      if (history.location.pathname.indexOf('SBMXCX') == -1 && (unitKey === 'MDT_ZXSB_SB_MDT_TSSB_G' || unitKey ===  'QTYW_ZXSB_QT_QYNBFKTXJS_G' || unitKey === 'ZBYW_ZXSB_SB_GJ_SBMX_G'
        || unitKey === 'QTYW_ZXSB_QT_QYGLLBFPPD_G' || unitKey === 'QTYW_ZXSB_QT_SCXQYSCNLQK_G' || unitKey === 'ZGBA_ZXSB_BA_BMDLCKBA_G'
        || unitKey === 'JLJG_ZXSB_SB_JLJG_MDTHX_G' || unitKey === 'JLJG_ZXSB_SB_JLJG_HGSJTZ_G' || unitKey === 'JLJG_ZXSB_SB_JLJG_JHFPL_G')
        && history.location.pathname.indexOf('/27/2705') == -1 && history.location.pathname.indexOf('/26/2605') == -1 && history.location.pathname.indexOf('/25/2505') == -1
      ) {
        await checkSsqYsbCj({
          ssq: value,
          tableKey: unitKey
        }).then((response) => {
          if (response.code === '900') {
            return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_ssq_01' })));
          }
          return Promise.resolve();
        }).catch((err) => {
          return Promise.reject(err);
        });
        return Promise.resolve();
      } else {
        return Promise.resolve();
      }
    };
    return { validator };
  },
  // 申请日期
  tbrq02: (form?: any) => {
    const unitKey = form?.otherParam?.unit_key;
    // 该申报所属期已申报，请确认后填报
    const validator = async (_rule: any, value: any) => {
      if (unitKey === 'ZGBA_ZXSB_BA_JTCYBA_G') {
        await checkJtgszbSqrq({
          tbrq1: value,
          uuid: ""
        }).then((response) => {
          if (response.code != '200') {
            return Promise.reject(new Error(response?.msg));
          }
          return Promise.resolve();
        }).catch((err) => {
          return Promise.reject(err);
        });
        return Promise.resolve();
      } else {
        return Promise.resolve();
      }
    };
    return { validator };
  },

  // 申报批次
  sbpc01: (form?: any) => {
    const unitKey = form?.otherParam?.unit_key;
    const ssq = form?.getFieldValue('ssq');
    const sbpc = form?.getFieldValue('sbpc');
    // 请求后端验证所属期是否已申报
    const validator = async (_rule: any, value: any) => {
      if (unitKey === 'MTS_ZXSB_SB_MTS_TSJH_G' || history.location.pathname.indexOf('SBMXCX') > -1
      || history.location.pathname.indexOf('/27/2705') > -1 || history.location.pathname.indexOf('/26/2605') > -1 || history.location.pathname.indexOf('/25/2505') > -1
      ) {
        return Promise.resolve();
      } else {
        await checkSsqPcYsb({
          ssq: ssq,
          sbpc: sbpc,
          tableKey: unitKey
        }).then((response) => {
          if (response.code === '900') {
            return Promise.reject(new Error(response.msg));
          }
          return Promise.resolve();
        }).catch((err) => {
          return Promise.reject(err);
        });
        return Promise.resolve();
      }
    };
    return { validator };
  },
  // 申报批次
  sbpc02: (form?: any) => {
    // 校验申报批次范围应从001~999，请确认后填报！
    const validator =  (_rule: any, value: any) => {
      // 申报批次需要是一个正数
      if (value && myUtil.text.getNumVal(value) <= 0) {
        return Promise.reject(new Error('该项只能录入正数'));
      }
      return Promise.resolve();
    };
    return { validator };
  },
  // 申报序号
  sbxh02: (form?: any) => {
    const validator =  (_rule: any, value: any) => {
      // 申报批次需要是一个正数
      if (value && myUtil.text.getNumVal(value) <= 0) {
        return Promise.reject(new Error('该项只能录入正数'));
      }
      return Promise.resolve();
    };
    return { validator };
  },
  // 企业海关代码
  cyhgqydm02: (form?: any) => {
    const validator = async (_rule: any, value: any) => {
      const params ={
        cyhgqydm: value,
        qyzjtgsdwDm: "2"
      };
      if (value) {
        await checkJtgszbQydm(params).then((response) => {
          const { code, msg } = response;
          if (code !== '200') {
            return Promise.reject(new Error(msg));
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
  // 关联号
  glh: (form?: any) => {
    const validator = async (_rule: any, value: any) => {
      const uuid = form?.getFieldValue('uuid');    // 表单其他项目
      const ssq = form?.getFieldValue('ssq');    // 表单其他项目
      const sbpc = form?.getFieldValue('sbpc');    // 表单其他项目
      const unitKey = form?.otherParam?.unit_key;//MTS_ZXSB_SB_MTS_TSSB_G
      let params = {
        glh: value,
        uuid: uuid,
        ssq,
        sbpc,
      };
      if (value) {
        if (unitKey == 'MTS_ZXSB_SB_MTS_TSSB_G' && history.location.pathname.indexOf('SBMXCX') == -1
        && history.location.pathname.indexOf('/27/2705') == -1 && history.location.pathname.indexOf('/26/2605') == -1 && history.location.pathname.indexOf('/25/2505') == -1
        ) { // 报关单生成明细
          await checkMtsTssbGlh(params).then((response) => {
            const { code, msg } = response;
            if (code !== '200') {
              return Promise.reject(new Error(msg));
            }
            return Promise.resolve();
          }).catch((err) => {
            return Promise.reject(err);
          });
        }
      }
      return Promise.resolve();
    };
    return { validator };
  },
  // 国内启运方式
  gnqyfsDm01: (form?: any) => {
    const cktmsywlxdmjh = form?.getFieldValue('cktmsywlxdmjh');
    // 业务类型为QYGTS时国内启运方式不能为空，请确认后填报！
    const validator = (_rule: any, value: any) => {
      if (cktmsywlxdmjh && cktmsywlxdmjh.indexOf('QYGTS') > -1) {
        if (!value) {
          return Promise.reject(new Error('业务类型为QYGTS时国内启运方式不能为空，请确认后填报！'));
        }
        return Promise.resolve();
      }
      return Promise.resolve();
    };
    return { validator };
  },
  // 海关总署认证企业类型
  hgzsrzqylxDm01: (form?: any) => {
    const cktmsywlxdmjh = form?.getFieldValue('cktmsywlxdmjh');
    // 业务类型为QYGTS时海关总署认证企业类型不能为空，请确认后填报！
    const validator = (_rule: any, value: any) => {
      if (cktmsywlxdmjh && cktmsywlxdmjh.indexOf('QYGTS') > -1) {
        if (!value) {
          return Promise.reject(new Error('业务类型为QYGTS时海关总署认证企业类型不能为空，请确认后填报！'));
        }
        return Promise.resolve();
      }
      return Promise.resolve();
    };
    return { validator };
  },
  // 红字冲减原因代码
  hzcjyyDm01: (form?: any) => {
    const cktmsywlxdmjh = form?.getFieldValue('cktmsywlxdmjh');
    // 当业务类型包括“HZCJ”业务类型时，不得为空
    const validator = (_rule: any, value: any) => {
      if (cktmsywlxdmjh && cktmsywlxdmjh.includes('HZCJ')) {
        if (!value) {
          return Promise.reject(new Error('业务类型为HZCJ时红字冲减原因不能为空，请确认后填报！'));
        }
        return Promise.resolve();
      }
      return Promise.resolve();
    };
    return { validator };
  },
  // 调整后商品代码
  tzhckspDm01: (form?: any) => {
    // 调整前和调整后代码不能一致
    const ckspDm = form.getFieldsValue().ckspDm;
    const validator = (_rule: any, value: any) => {
      if (ckspDm && value == ckspDm) {
        return Promise.reject(new Error('调整前和调整后的商品码不能相同，请确认后填报！'));
      }
      return Promise.resolve();
    };
    return { validator };
  },
  // 公共税率取值范围
  ggslqzfw01: (form?: any) => {
    const unitKey = form?.otherParam?.unit_key;
    // 公共税率取值范围 校验处理
    const validator = (_rule: any, val: any) => {
      const zsslQzfwArr = [1, 2, 3, 4, 6, 9, 10, 11, 13, 16, 17, 0.5];
      const tslQzfwArr = [0.5, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 13, 14, 15, 16, 17];
      if (unitKey === 'TSZL_ZXSB_SB_HGSPTZ_G') {
        const tzhtsl = form?.getFieldValue('tzhtsl');
        if (tslQzfwArr.indexOf(myUtil.text.getNumVal(tzhtsl)) == -1) {
          return Promise.reject(new Error('退税率应在以下范围内：0.5,1,2,3,4,5,6,8,9,10,11,13,14,15,16,17！'));
        }
      } else if (unitKey === 'MDT_ZXSB_SB_MDT_TSSB_G' || unitKey === 'MTS_ZXSB_SB_MTS_TSJH_G') {
        // 进货明细，消费税时，退税率与征税率会保证相同
        const zssl = form?.getFieldValue('zssl');
        const tsl = form?.getFieldValue('tsl');
        if (unitKey === 'MTS_ZXSB_SB_MTS_TSJH_G') {
          const sz = form?.getFieldValue('sz');
          // 退税进货消费税时不校验范围
          if (sz == 'C') {
            return Promise.resolve();
          }
        }
        if (zssl) {
          if (zsslQzfwArr.indexOf(myUtil.text.getNumVal(zssl)) == -1) {
            // 征税税率应在以下范围内：1,2,3,4,6,9,10,11,13,16,17!
            return Promise.reject(new Error('征税税率应在以下范围内：1,2,3,4,6,9,10,11,13,16,17,0.5！'));
          }
        }
        if (tsl) {
          if (tslQzfwArr.indexOf(myUtil.text.getNumVal(tsl)) == -1) {
            tslQzfwArr.splice(0, 0, 0);
            if (tslQzfwArr.indexOf(myUtil.text.getNumVal(tsl)) == -1) {
              return Promise.reject(new Error('退税率应在以下范围内：0,0.5,1,2,3,4,5,6,8,9,10,11,13,14,15,16,17！'));
            }
          }
        }
      }
      return Promise.resolve();
    };
    return { validator };
  },
  // 税种
  sz01: (form?: any) => {
    // 请求后端验证所属期是否已申报
    const validator =  (_rule: any, value: any) => {
      if (value) {
        const strExp = /^[C|V]$/;
        if (!strExp.test(value)) {
          return Promise.reject(new Error('税种只能录入C或者V，请确认后填报！'));
        }
        return Promise.resolve();
      }
      return Promise.resolve();
    };
    return { validator };
  },
  // 进货凭证号
  jhpzh03: (form?: any) => {
    const unitKey = form?.otherParam?.unit_key;
    // 请求后端验证所属期是否已申报
    const validator =  (_rule: any, value: any) => {
      if (unitKey === 'MTS_ZXSB_SB_MTS_TSJH_G') {
        // 税种
        const sz = form?.getFieldValue('sz');
        if (sz.toUpperCase() == 'V' && !value) { // 增值税时， 进货凭证号是必录
          return Promise.reject(new Error('增值税时，进货凭证号必录!'));
        }
      } else if (unitKey === 'QTYW_ZXSB_SB_QYCHSBSJ_G') {

        const chyyDm = form?.getFieldValue('chyyDm');
        const chywlxDm = form?.getFieldValue('chywlxDm');
        const jhpzh = form?.getFieldValue('jhpzh');
        const cktmspzlxDm = form?.getFieldValue('cktmspzlxDm');
        if(jhpzh && jhpzh.length > 20 && cktmspzlxDm === '03') {
          return Promise.reject(new Error('该项内容长度不能大于20！'));
        } else if(jhpzh && jhpzh.length > 30 && cktmspzlxDm === '09') {
          return Promise.reject(new Error('该项内容长度不能大于30！'));
        } else if(jhpzh && jhpzh.length != 21 && cktmspzlxDm === '01') {
          return Promise.reject(new Error('该项内容长度必须为21！'));
        }
        // 撤回原因为2 不得为空
        if (chyyDm == '200') {
          if ('202' == chywlxDm || '203' == chywlxDm) {
            return Promise.resolve();
          }
          if (!jhpzh) {
            return Promise.reject(new Error('该项内容为必填项不能为空！'));
          }
          return Promise.resolve();
        }
      } else if (unitKey === 'ZMKJ_ZXSB_ZM_TYYBSWTS_G') {
        if (cktsUtil.sys.enterpriseType() === 'WM') {
          const tmsztbz  = form?.getFieldsValue().tmsztbz;
          if (tmsztbz == '已办理退（免）税') {
            const jhpzh  = form?.getFieldsValue().jhpzh;
            if (!jhpzh) {
              return Promise.reject(new Error('该项内容为必填项不能为空！'));
            }
          }
        }
      }
      return Promise.resolve();
    };
    return { validator };
  },
  // 编号
  sbbh101: (form?: any) => {
    const ssq  = form?.getFieldsValue().ssq;
    const validator =  (_rule: any, value: any) => {
      let ssqSbbh = value.substring(0, 6);
      if (ssqSbbh != ssq) {
        return Promise.reject(new Error('编号格式应为6位所属期+4位流水号，请按格式输入！'));
      }
      return Promise.resolve();
    };
    return { validator };
  },
  // 编号
  sbbh102: (form?: any) => {
    const unitKey = form?.otherParam?.unit_key;
    const validator =  async (_rule: any, value: any) => {
      if (history.location.pathname.indexOf('SBMXCX') == -1 && history.location.pathname.indexOf('/27/2705') == -1 && history.location.pathname.indexOf('/26/2605') == -1 && history.location.pathname.indexOf('/25/2505') == -1) {
        let params = {
          sbbh1: value,
          tableKey: unitKey,
        };
        await checkZmkjJyBhYsb(params).then((response) => {
          const { code, msg } = response;
          if(code !== '200') {
            return Promise.reject(new Error(msg));
          }
          return Promise.resolve();
        })
      }
      return Promise.resolve();
    };
    return { validator };
  },
  // 项号
  xh401: (form: any) => {
    const sbbh1  = form?.getFieldsValue().sbbh1;
    const uuid = form?.getFieldsValue().uuid;
    const unitKey = form?.otherParam?.unit_key;
    const validator =  async (_rule: any, value: any) => {
      const params = {
        sbbh1: sbbh1,
				xh4: value,
        tableKey: unitKey,
        uuid: uuid
      };
      await checkZmkjJyXh(params).then((response) => {
        const { code, msg } = response;
        if(code !== '200') {
          return Promise.reject(new Error(msg));
        }
        return Promise.resolve();
      })
      return Promise.resolve();
    };
    return { validator };
  },
  // 值为空赋0
  setZero: (form: any) => {
    const validator = (_rule: any, value: any) => {
      // const { field } = _rule;
      // if (!value) {
      //   form.setFieldsValue({ [field]: 0 });
      // }
      return Promise.resolve();
    };
    return { validator };
  },
  // 备注
  bz02: (form?: any) => {
    const validator = async (_rule: any, value: any) => {
			// 出口货物收汇申报表
			// 1. 存在非进口商付汇原因/非进口国家（地区）付汇原因，备注不能为空
      const fjksfhyy  = form?.getFieldValue('fjksfhyy');
      const fjkgjdqfhyy  = form?.getFieldValue('fjkgjdqfhyy');
      const bz  = form?.getFieldValue('bz');
      const yzsz = [];
			if (fjksfhyy?.trim()) {
				yzsz.push('非进口商付汇原因');
			}
			if (fjkgjdqfhyy?.trim()) {
				yzsz.push('非进口国家（地区）付汇原因');
      }
			if (yzsz.length > 0 && !bz) {
        return Promise.reject(new Error(`存在${yzsz.join('/')}时备注不能为空，请确认后填报！`));
			}
      return Promise.resolve();
    };
    return { validator };
  },
};

// 计算
DditCktsFormCommonFunc.util = {
  /**
   * @author jiangyg
   * @method setAmt
   * @desc 计算：计算金额，公式：a X b
   * @param params { a 金额, b 税率, format: format }
   * @returns 返回精确两位小数的千分位
   */
  setAmt: function(params: any) {
    let a = params.a; // 金额
    let b = params.b; // 税率
    let c = '';
    let format = params.format;
    if (a && b) {
      format = format ? format : '0,0.00';
      a = Number(myUtil.text.formatNum(myUtil.text.getNumVal(a), format));
      b = Number(myUtil.text.formatNum(myUtil.text.getNumVal(b), format));
      c = myUtil.text.formatNum((a * b), format);
    }
    return c;
  },
  /**
   * @author jiangyg
   * @method setTaxAmt
   * @desc 计算：计算税额，公式：a * b / 100
   * @param params { a 金额, b 税率, format: format }
   * @returns 返回精确两位小数的千分位
   */
  setTaxAmt: function(params: any) {
    let a = params.a; // 金额
    let b = params.b; // 税率
    let c = '';
    let format = params.format;
    if (a && b) {
      format = format ? format : '0,0.00';
      a = myUtil.text.getNumVal(a);
      b = myUtil.text.getNumVal(b);
      c = myUtil.text.formatNum((a * b / 100), format);
    }
    return c;
  },
  /**
   * @method setRmbAmt
   * @desc 计算：人民币离岸价，赋值表单
   * 人民币离岸价= 美元离岸价 X 美元汇率
   * @param obj { mylaj 美元离岸价, myhl 美元汇率 }
   * @returns rmbAmt 人民币离岸价
   */
  setRmbAmt: (obj: any) => {
    let mylaj: any = myUtil.text.getNumVal(obj.mylaj);
    let myhl: any = myUtil.text.getNumVal(obj.myhl);
    let rmblaj: any = '';
    if (!mylaj || !myhl) {
      rmblaj = '';
    } else {
      rmblaj = mylaj * myhl / 100;
      if (rmblaj > 99999999999999.99 || rmblaj < -99999999999999.99) {
        rmblaj = '';
      }
    }
    return rmblaj;
  },
  /**
   * @method setUsAmt
   * @desc 计算：美元离岸价，赋值表单
   * 美元离岸价 = 人民币离岸价 / 美元汇率 / 100
   * 人民币离岸价来源需要注意
   * 当人民币离岸价失去焦点时计算美元离岸价，不用原币汇率 * 原币离岸价的值计算人民币离岸价 wangsy add 20180321
   * @param paras { rmbAmt 人民币离岸价, myhl 美元汇率, formId 目标表单, isRmbAmtBlur 是否来自人民币离岸价失去焦点事件 }
   *
   * param01
   * param02
   * param03
   */
  setUsAmt: (params: any, form: any) => {
    let rmbAmt = myUtil.text.getNumVal(params.rmbAmt);
    let myhl = myUtil.text.getNumVal(params.myhl);
    let usdAmt;
    if (!rmbAmt || !myhl || myhl == 0) {
      usdAmt = '';
    } else {
      rmbAmt = rmbAmt; // update by shil 20200826
      myhl = myhl; // update by shil 20200826
      usdAmt = myhl == 0.0000 ? 0.00 : myUtil.text.getNumVal((rmbAmt * 100000 / myhl * 100 / 100000)); // update by shil 20200826
      if (usdAmt > 999999999999.99 || usdAmt < -999999999999.99) {
        message.warning('美元离岸价数据溢出，数据丢失，请确认后填报！');
        usdAmt = '';
      }
    }
    form.setFieldsValue({ usdAmt: myUtil.text.getNumVal(myUtil.text.formatNum(usdAmt, '0,0.00')) });
    return myUtil.text.getNumVal(myUtil.text.formatNum(usdAmt, '0,0.00'));
  },
	/**
	 * @method loadCodeDmHbhlAutoComplete
	 * @param param { form 表单实例, url 码表的url, key 码表, codeViewKey 码表key }
	 * @description 重置码表
	 */
	loadCodeDmHbhlAutoComplete: async (param: any) => {
    const { form, url, key, codeViewKey } = param;
    // 查询参数
    const params = {
      page: 1,
      pageSize: 999999,
      searchModel: [
        { property: 'hbzmDm', value: '', op: 'al' },
        { property: 'ckrq', value: param.ckrq ? moment(param.ckrq).format('YYYY-MM-DD') : '', op: 'al' },
        { property: 'ssq', value: form?.getFieldsValue().ssq, op: 'al' },
        { property: 'nyfzbz', value: param.nyfzbz ? param.nyfzbz : '', op: 'al' },
      ],
    };
    const result = await getUrlCode(url, params);
    const { code, body } = result;
    if (code === '200') {
      myUtil.code.saveCodeToLocalTable(key, body.rows, codeViewKey);
    }
	},
  /**
   * @method getMultiplyResult
   * @desc 计算：计算乘法结果
   * 计算规则：param1 * param2
   * @param paras { param1 乘数, param2 乘数}
   */
  getMultiplyResult: function(paras: any) {
    let param1 = myUtil.text.getNumVal(paras.param1);
    let param2 = myUtil.text.getNumVal(paras.param2);
    if (param1 == '' || param1 == undefined || param2 == '' || param2 == undefined) {
      return '';
    }
    let result = param1 * param2;
    return result;
  },
  /**
   * @method getDivideResult
   * @desc 计算：计算除法结果
   * 计算规则：param1 / param2
   * @param paras { param1 被除数, param2 除数}
   */
  getDivideResult: function(paras: any) {
    let param1 = myUtil.text.getNumVal(paras.param1);
    let param2 = myUtil.text.getNumVal(paras.param2);
    if (param1 == '' || param1 == undefined || param2 == '' || param2 == undefined || param2 === 0) {
      return '';
    }
    let result = param1 / param2;
    return result;
  },
  /**
   * @method setDeductibleTax
   * @desc 计算：可抵扣税额
   * 可抵扣税额 = （ 购货税额 / 购货数量 ）* 内销数量
   * @param paras { sl 购货征税率, amt 购货金额, se 购货税额, qnt 购货数量, nxQnt 内销数量, formId 目标表单, target 表单元素名称}
   */
  setDeductibleTax: function(paras: any) {
    let se = paras.se;
    let qnt = paras.qnt;
    let nxQnt = paras.nxQnt;
    let kdkSe: any = '';
    if (!qnt || !nxQnt || !se) {
      kdkSe = '';
    } else {
      kdkSe = (se / qnt) * nxQnt;
      if (kdkSe > 999999999999.99 || kdkSe < -999999999999.99) {
        message.info('可抵扣税额数据溢出，数据丢失，请确认后填报！')
        kdkSe = '';
      }
    }
    return kdkSe;
  },
  /**
   * @method setPurchaseTax
   * @desc 计算：购货税额（计算：税额）
   * 购货税额 = 购货征税率 * 购货金额 / 100
   * @param paras {ghje 购货金额, ghzssl 购货征税税率}
   */
  setPurchaseTax: function(paras: any) {
    let ghje = myUtil.text.getNumVal(paras.ghje);
    let ghzssl = myUtil.text.getNumVal(paras.ghzssl);
    let ghzsse = 0;
    if (!ghje || !ghzssl) {
      ghzsse = 0;
    } else {
      ghzsse = DditCktsFormCommonFunc.util.accMul(ghje, ghzssl) / 100;
      if (ghzsse > 999999999999.99 || ghzsse < -999999999999.99) {
        message.info('税额数据溢出，数据丢失，请确认后填报！')
        ghzsse = 0;
      }
    }
    return ghzsse;
  },
  accMul: function(arg1: any, arg2: any) {
    let m = 0;
    let s1 = arg1.toString();
    let s2 = arg2.toString();
    try {
      m += s1.split('.')[1].length;
    // eslint-disable-next-line no-empty
    } catch (e) {}
    try {
      m += s2.split('.')[1].length;
    // eslint-disable-next-line no-empty
    } catch (e) {}
    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
  },
  /**
   * @method getSubtractResult
   * @desc 计算：计算差值结果
   * 计算规则：param1 - param2
   * @param paras { param1 被减数, param2 减数}
   */
  getSubtractResult: function(paras: any) {
    let param1 = myUtil.text.getNumVal(paras.param1);
    let param2 = myUtil.text.getNumVal(paras.param2);
    if ((param1 != '' || param1 === 0) && (param2 != '' || param2 === 0)) {
      let result = param1 - param2;
      return result;
    }
    return '';
  },
  /**
   * @method setCkxsermb
   * @desc 计算人民币销售额，公式为：出口销售金额*销售币种汇率/100，保留2位小数
   * @param paras {cjhbhl 销售币种汇率, cjzj 出口销售金额}
   */
  setCkxsermb: function(paras: any) {
    let cjhbhl = myUtil.text.getNumVal(paras.cjhbhl);
    let cjzj = myUtil.text.getNumVal(paras.cjzj);
    let ckxsermb: any = '';
    if (!cjhbhl || !cjzj) {
      ckxsermb = '';
    } else {
      ckxsermb = cjhbhl * cjzj / 100;
      if (ckxsermb > 999999999999.99 || ckxsermb < -999999999999.99) {
        message.info('人民币销售额数据溢出，数据丢失，请确认后填报！');
        ckxsermb = '';
      }
    }
    return ckxsermb;
  },
  /**
   * @author liwc
   * @method setMdtTssbgtjs
   * @desc 计算：免抵退 货物出口 计算
   * @param paras
   */
  setMdtTssbgtjs: function(param: any, type: any) {
    const { form } = param;
    let rmblaj: any;
    switch (type) {
      // 第一部分，用原币计算人民币价格
      case 'ckxxjs-rmb':
        const cjzj = myUtil.text.getNumVal(form?.getFieldValue('cjzj'));
        const cjhbhl = myUtil.text.getNumVal(form?.getFieldValue('cjhbhl'));
        // 人民币离岸价 = 原币离岸价 * 原币汇率 / 100
        if (cjzj && cjhbhl) {
          // 如果原币离岸价和原币汇率有值
          rmblaj = DditCktsFormCommonFunc.util.setRmbAmt({
            mylaj: cjzj, // 原币离岸价
            myhl: cjhbhl // 原币汇率
          });
        }
        if (rmblaj === 0 || rmblaj) {
          form.setFieldsValue({ rmblaj: rmblaj ? myUtil.text.getNumVal(myUtil.text.formatNum(rmblaj, '0,0.00')) : '' });
        }
        break;
        // 第二部分，用人民币计算美元价格
      case 'ckxxjs-my':
        rmblaj = myUtil.text.getNumVal(form?.getFieldValue('rmblaj'));
        // 美元离岸价 = 美元汇率 * 人民币离岸价 / 100
        let myhl = myUtil.text.getNumVal(form?.getFieldValue('myhl'));
        let mylaj;
        if (myhl) {
          mylaj = DditCktsFormCommonFunc.util.setUsAmt({
            rmbAmt: rmblaj, // 人民币离岸价
            myhl: myhl // 美元汇率
          }, form);
        }
        if (mylaj === 0 || mylaj) {
          form.setFieldsValue({ mylaj: myUtil.text.getNumVal(myUtil.text.formatNum(mylaj, '0,0.00')) });
        }
        break;
        // 第三部分退税信息计算
      case 'tsxxjs':
        // 人民币离岸价
        rmblaj = myUtil.text.getNumVal(form?.getFieldValue('rmblaj'));
        // 调整后计划分配率
        let tzhjhfpl = myUtil.text.getNumVal(form?.getFieldValue('tzhjhfpl'));
        // 保税料件计税价格
        let jljgbsjkljzcjsjg = 0;
        if (tzhjhfpl && rmblaj) {
          jljgbsjkljzcjsjg = rmblaj * tzhjhfpl / 100;
          if (jljgbsjkljzcjsjg > 999999999999.99 || jljgbsjkljzcjsjg < -999999999999.99) {
            message.warning('金额数据溢出，数据丢失，请确认后填报！');
            jljgbsjkljzcjsjg = 0;
          }
        }
        // 保税料件计税价格赋值
        form.setFieldsValue({ jljgbsjkljzcjsjg: myUtil.text.getNumVal(myUtil.text.formatNum(jljgbsjkljzcjsjg, '0,0.00')) });
        jljgbsjkljzcjsjg = myUtil.text.getNumVal(form?.getFieldValue('jljgbsjkljzcjsjg'));
        // 国内免税原材价格
        let gngjmsycljg = myUtil.text.getNumVal(form?.getFieldValue('gngjmsycljg'));
        // 征税税率
        let zssl = myUtil.text.getNumVal(form?.getFieldValue('zssl'));
        // 退税率
        let tsl = myUtil.text.getNumVal(form?.getFieldValue('tsl'));
        // 免抵退税不得免征和抵扣税额计算 系统自动计算，等于（人民币离岸价-保税料件计税价格-免税原材料价格）*（征税率-退税率）
        let mdtsbdmzhdkse = myUtil.text.getNumVal(rmblaj - jljgbsjkljzcjsjg - gngjmsycljg) * (zssl - tsl) / 100; // update by shil 20200826
        if (zssl < tsl) {
          mdtsbdmzhdkse = 0;
        }
        if (mdtsbdmzhdkse === 0 || mdtsbdmzhdkse) {
          form.setFieldsValue({ mdtsbdmzhdkse: myUtil.text.getNumVal(myUtil.text.formatNum(mdtsbdmzhdkse, '0,0.00')) });
        }
        // 免抵退税额 系统自动计算，等于（人民币离岸价-保税料件计税价格-免税原材料价格）*退税率
        let mdtse = myUtil.text.getNumVal(rmblaj - jljgbsjkljzcjsjg - gngjmsycljg) * tsl / 100;
        // 判断国内免税原材料价格是否输入过高，不合理
        if (Math.abs(rmblaj) - Math.abs(jljgbsjkljzcjsjg) - Math.abs(gngjmsycljg) < 0) {
          message.warning('“国内购进免税原材料价格”应小于“出口销售额（人民币）”-“进料加工保税进口料件组成计税价格”！');
          mdtse = 0;
        }
        if (mdtse === 0 || mdtse) {
          form.setFieldsValue({ mdtse: myUtil.text.getNumVal(myUtil.text.formatNum(mdtse, '0,0.00')) });
        }
        break;
    }
  },
  /**
   * @author liwc
   * @method setMdtYfsjgtjs
   * @desc 计算：免抵退 研发设计服务 计算
   * @param paras
   */
  setMdtYfsjgtjs: function(param: any, type: any) {
    const { form } = param;
    // sr 收入额计算， sk 收款额计算， js 计税额计算
    let bqqrysfwyysrrmbje: any;
    let ysfwyyermb: any;
    switch (type) {
      case 'sr':
        // 收入原币金额
        let srybje = myUtil.text.getNumVal(form?.getFieldValue('srybje'));
        let srybhl = myUtil.text.getNumVal(form?.getFieldValue('srybhl'));
        // 人民币收入额 = 收入原币金额 * 收入原币汇率 / 100
        if (srybje && srybhl) {
          // 如果收入原币金额和收入原币汇率有值
          bqqrysfwyysrrmbje = DditCktsFormCommonFunc.util.setRmbAmt({
            mylaj: srybje, // 收入原币金额
            myhl: srybhl // 收入原币汇率
          });
        }
        if (!bqqrysfwyysrrmbje) {
          // 如果重算不了人民币收入额，则尝试取页面当前录入的值，进行下一步计算
          bqqrysfwyysrrmbje = myUtil.text.getNumVal(form?.getFieldValue('bqqrysfwyysrrmbje'));
        }
        if (bqqrysfwyysrrmbje === 0 || bqqrysfwyysrrmbje) {
          // 人民币收入额 收入额赋值
          form.setFieldsValue({ bqqrysfwyysrrmbje: myUtil.text.getNumVal(myUtil.text.formatNum(bqqrysfwyysrrmbje, '0.00')) });
        }
        break;
      case 'sr-rmb':
        // 人民币收入额
        bqqrysfwyysrrmbje = myUtil.text.getNumVal(form?.getFieldValue('bqqrysfwyysrrmbje'));
        // 美元收入金额 = 收入美元汇率 * 人民币收入额 / 100
        let srmyhl = myUtil.text.getNumVal(form?.getFieldValue('srmyhl'));
        let srjemy;
        if (srmyhl) {
          srjemy = DditCktsFormCommonFunc.util.setUsAmt({
            rmbAmt: bqqrysfwyysrrmbje, // 人民币收入额
            myhl: srmyhl // 收入美元汇率
          }, form);
        }
        if (srjemy === 0 || srjemy) {
          form.setFieldsValue({ skjemy: myUtil.text.getNumVal(myUtil.text.formatNum(srjemy, '0.00')) });
        }
        break;
      case 'sk':
        // 收款原币金额
        let skybje = myUtil.text.getNumVal(form?.getFieldValue('skybje'));
        let cjhbhl = myUtil.text.getNumVal(form?.getFieldValue('cjhbhl'));
        // 人民币收款额 = 收款原币金额 * 收款原币汇率 / 100
        if (skybje && cjhbhl) {
          // 如果收款原币金额和收款原币汇率有值
          ysfwyyermb = DditCktsFormCommonFunc.util.setRmbAmt({
            mylaj: skybje, // 收款原币金额
            myhl: cjhbhl // 收款原币汇率
          });
        }
        if (!ysfwyyermb) {
          // 如果重算不了人民币收款额，则尝试取页面当前录入的值，进行下一步计算
          ysfwyyermb = myUtil.text.getNumVal(form?.getFieldValue('ysfwyyermb'));
        }
        if (ysfwyyermb === 0 || ysfwyyermb) {
          // 人民币收款额 收款额赋值
          form.setFieldsValue({ ysfwyyermb: myUtil.text.getNumVal(myUtil.text.formatNum(ysfwyyermb, '0.00')) });
        }
        break;
      case 'sk-rmb':
        // 人民币收款额
        ysfwyyermb = myUtil.text.getNumVal(form?.getFieldValue('ysfwyyermb'));
        // 跨境应税行为营业额免抵退税计税金额
        form.setFieldsValue({ ysfwyyemdtsjsje: myUtil.text.getNumVal(myUtil.text.formatNum(ysfwyyermb, '0.00')) });
        // 美元收款金额 = 收款美元汇率 * 人民币收款额 / 100
        let myhl = myUtil.text.getNumVal(form?.getFieldValue('myhl'));
        let bqskjemy;
        if (myhl) {
          bqskjemy = DditCktsFormCommonFunc.util.setUsAmt({
            rmbAmt: ysfwyyermb, // 人民币收款额
            myhl: myhl // 收款美元汇率
          }, form);
        }
        if (bqskjemy === 0 || bqskjemy) {
          form.setFieldsValue({ bqskjemy: myUtil.text.getNumVal(myUtil.text.formatNum(bqskjemy, '0.00')) });
        }
        // 税额计算
        // 计税金额
        let ysfwyyemdtsjsje = form?.getFieldValue('ysfwyyemdtsjsje');
        if (!ysfwyyemdtsjsje) {
          return;
        }
        let zssl = form?.getFieldValue('zssl');
        let se; // 税额
        if (zssl) {
          se = DditCktsFormCommonFunc.util.setPurchaseTax({
            ghje: ysfwyyemdtsjsje, // 计税金额
            ghzssl: zssl // 征税税率
          });
        }
        let tsl = form?.getFieldValue('tsl');
        if (tsl) {
          let ytse1 = DditCktsFormCommonFunc.util.setPurchaseTax({
            ghje: ysfwyyemdtsjsje, // 计税金额
            ghzssl: tsl // 退税率
          });
          // 征退税差额 = 税额 - 应退税额
          let ztsce = se - ytse1;
          if (ztsce < 0) {
            ztsce = 0;
          }
          if (ztsce === 0 || ztsce) {
            form.setFieldsValue({ ztsce: myUtil.text.getNumVal(myUtil.text.formatNum(ztsce, '0.00')) });
          }
          // 应退税额
          if (ytse1 === 0 || ytse1) {
            form.setFieldsValue({ ytse1: myUtil.text.getNumVal(myUtil.text.formatNum(ytse1, '0.00')) });
          }
        }
        break;
    }
  },
  /**
   * @author liwc
   * @method setMdtSyykgtjs
   * @desc 计算：免抵退 收营业款 计算
   * @param paras
   */
  setMdtSyykgtjs: function(param: any, type: any) {
    const { form } = param;
    let skjermb: any;
    switch (type) {
      case 'sk':
        let cjzj = myUtil.text.getNumVal(form?.getFieldValue('cjzj'));
        let ybhl = myUtil.text.getNumVal(form?.getFieldValue('ybhl'));
        // 人民币收款额 = 原币收款额 * 原币汇率 / 100
        if (cjzj && ybhl) {
          // 如果原币收款额和原币汇率有值
          skjermb = DditCktsFormCommonFunc.util.setRmbAmt({
            mylaj: cjzj, // 原币收款额
            myhl: ybhl // 原币汇率
          });
        }
        if (!skjermb) {
          // 如果重算不了人民币收款额，则尝试取页面当前录入的值，进行下一步计算
          skjermb = myUtil.text.getNumVal(form?.getFieldValue('skjermb'));
        }
        if (skjermb === 0 || skjermb) {
          form.setFieldsValue({ skjermb: myUtil.text.getNumVal(myUtil.text.formatNum(skjermb, '0.00')) });
        }
        break;
      case 'sk-rmb':
        // 人民币收款金额
        skjermb = myUtil.text.getNumVal(form?.getFieldValue('skjermb'));
        // 美元收款金额 = 美元汇率 * 人民币收款额 / 100
        let myhl = myUtil.text.getNumVal(form?.getFieldValue('myhl'));
        let skjemy;
        if (myhl) {
          skjemy = DditCktsFormCommonFunc.util.setUsAmt({
            rmbAmt: skjermb, // 人民币收款额
            myhl: myhl // 美元汇率
          }, form);
        }
        if (skjemy === 0 || skjemy) {
          form.setFieldsValue({ skjemy: myUtil.text.getNumVal(myUtil.text.formatNum(skjemy, '0.00')) });
        }
        break;
    }
    // 美元累计款 & 人民币累计款 赋值 (老系统内无对应代码)
  },
  /**
   * @method setYsfwyye
   * @desc 通过原币汇率，美元汇率，反算人民币营业额、应税服务营业额（美元）
   * @param formId formId
   */
  setYsfwyye: function(param: any) {
    const { form } = param;
    // 原币营业额
    let cjzj = myUtil.text.getNumVal(form?.getFieldValue('cjzj'));
    // 原币汇率
    let ybhl = myUtil.text.getNumVal(form?.getFieldValue('ybhl'));
    // 应税服务营业额（人民币）
    let ysfwyyermb;
    if (cjzj && ybhl) {
      ysfwyyermb = myUtil.text.getNumVal(myUtil.text.formatNum(cjzj * ybhl / 100, '0.00'));
      if (ysfwyyermb.length <= 15) {
        form.setFieldsValue({ ysfwyyermb: myUtil.text.getNumVal(myUtil.text.formatNum(ysfwyyermb, '0.00')) });
      }
    }
    // 美元汇率
    let myhl = myUtil.text.getNumVal(form?.getFieldValue('myhl'));
    // 应税服务营业额（美元）
    let ysfwyyemy;
    if (myhl == null || myhl == 0.00000) {
      ysfwyyemy = 0.00;
    } else {
      if (ysfwyyermb) {
        ysfwyyemy = myUtil.text.getNumVal(myUtil.text.formatNum(ysfwyyermb / myhl * 100, '0.00'));
        if (ysfwyyemy.length <= 15) {
          form.setFieldsValue({ ysfwyyemy: myUtil.text.getNumVal(myUtil.text.formatNum(ysfwyyemy, '0.00')) });
        }
      }
    }
  },
  /**
   * @method getmyhlByLjDate
   * @desc 根据出口日期获取USD汇率
   * @param ljDate 出口日期
   * @param item 表单元素
   */
  getmyhlByLjDate: function(ljDate: any, param: any) {
    const { form, func, otherParam } = param;
    const unitKey = otherParam?.unit_key;
    if (!ljDate) {
      ljDate = form?.getFieldValue('kprq1');
    }
    // 通过kprq获取美元汇率
    let data: any = [
      { property: "hbzmDm", value: 'USD', op: "al" },
      { property: "ckrq", value: ljDate, op: "al" },
    ];
    let params: any = { page: 1, pageSize: 999999, searchModel: data };
    queryHlxx(params).then((res: any) => {
      if (res.code == '200' && res?.body?.rows) {
        let myhl = res.body.rows[0].rmbhl;
        if (myhl) {
          form.setFieldsValue({ myhl: myUtil.text.getNumVal(myUtil.text.formatNum(myhl, '0.0000')) });
        }
      }
    })
    if (unitKey == 'MDT_ZXSB_SB_MDT_KYHJ_G') {
      func.eventOnBlur.myhl(param);
    }
  },
  /**
   * @method getComboResult1
   * @desc 计算：混合计算结果
   * 计算规则：param1 * param2 / 100
   * @param paras { param1 乘数, param2 乘数}
   */
  getComboResult1: function(paras: any) {
    let param1 = myUtil.text.getNumVal(paras.param1);
    let param2 = myUtil.text.getNumVal(paras.param2);
    if (param1 == '' || param1 == undefined || param2 == '' || param2 == undefined) {
      return '';
    }
    let result = param1 * param2 / 100;
    return result;
  },
  /**
   * @method getComboResult2
   * @desc 计算：混合计算结果
   * 计算规则：param1 / param2 * 100
   * @param paras { param1 被除数, param2 除数}
   */
  getComboResult2: function(paras: any) {
    let param1 = myUtil.text.getNumVal(paras.param1);
    let param2 = myUtil.text.getNumVal(paras.param2);
    if (param1 == '' || param1 == undefined || param2 == '' || param2 == undefined || param2 === 0) {
      return '';
    }
    let result = param1 / param2 * 100;
    return result;
  },
  /**
  *@description 加法的精确计算
  * */
  addSum: function(paras: any) {
    let param1 = myUtil.text.getNumVal(paras.param1);
    let param2 = myUtil.text.getNumVal(paras.param2);
    let r1, r2, m;
    try {
      r1 = param1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = param2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    const sum = (param1 * m + param2 * m).toFixed(Math.max(r1, r2)) / m;
    return sum;
  }
};


export default DditCktsFormCommonFunc;
