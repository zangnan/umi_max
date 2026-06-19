// 生成进货：发票生成进货列表
import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import myUtil from '@/components/DDAssist/util';
import { querySpdmXxCj, fpxxScTsjh } from '@/pages/hts/services/htsApi';
import { Modal, Spin, Button, Form, Select, InputNumber, message, Input, Row, Col } from 'antd';
import DDAlert from '@/pages/hts/commonModule/DDAlert';
import '@/pages/hts/commonModule/style.less';

export interface DDTsort {
  onRef?: any;
  visible?: any;
}

const Jhmx2: React.FC<DDTsort> = ({
  onRef,
  visible = false
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [masker, setMasker] = useState<boolean>(false);
  const [layout] = useState<any>('horizontal'); // vertical horizontal inline
  const [glhspxx, setGlhspxx] = useState<any>();
  const [formValue, setFormValue] = useState<any>();
  const [pCurrent, setPCurrent] = useState<any>();
  const [pCurrent2, setPCurrent2] = useState<any>();
  const [form] = Form.useForm();

  // 开启
  const showModal = (param: any) => {
    setPCurrent(param.current);
    setPCurrent2(param.current2);
    setModalVisible(true);
    let val = param.fpxx;
    val?.forEach((item: any) => {
      item.sbhgspmc = item.hwhyslwmc;
    });
    setGlhspxx(param.glhspxx);
    setFormValue({fpList: val});
    form.setFieldsValue({fpList: val});
  };

  // useImperativeHandle
  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 保存
  const save = async () => {
    form.validateFields().then((formValues: any) => {
      let glhsl: any = {};                                                        // 【关联号】和【数量】对应的JSON
      let hhJhpzh: any = {};                                                      // 【进货凭证号-行号】和【计税金额】对应的JSON
      let hhJhpzhSyje: any = {};                                                  // 【进货凭证号-行号】和【发票剩余金额】对应的JSON
      let sbxhArr: any = [];                                                      // 可退税额与计算结果不符的申报序号
      let msgArr = [];                                                            // 提示信息
      formValue?.fpList?.forEach((item: any) => {
        // 【关联号】累加数量存至glhsl
        let glhTmp = item.glh;                                                    // 当前循环行【关联号】
        let jhslSum = glhsl[glhTmp] || 0;                                         // 已保存的【关联号】累加【数量】，首次置0
        jhslSum += Number(myUtil.text.formatNum((item.sl || 0), '0.00000'));       // 【关联号】累加进货数量
        glhsl[glhTmp] = jhslSum;                                                  // 【关联号】和【数量】对应的JSON
        // 【行号-进货凭证号】累加计税金额存至hhJhpzh
        let jhpzhTd = item.jhpzh;                                                 // 当前循环行【进货凭证号】
        let hhTd = item.hh;                                                       // 当前循环行【发票行号】
        let jsjeSum = hhJhpzh[jhpzhTd + '-' + hhTd] || 0;                         // 已保存的【进货凭证号-行号】累加计税金额，首次置0
        jsjeSum += Number(myUtil.text.formatNum((item.jsje || 0), '0.00'));       // 【行号-进货凭证号】累加计税金额
        hhJhpzh[jhpzhTd + '-' + hhTd] = jsjeSum;                                  // 【进货凭证号-行号】计税金额对应的JSON
        // 【行号-进货凭证号】发票剩余金额存至hhJhpzhSyje
        hhJhpzhSyje[jhpzhTd + '-' + hhTd] = Number(myUtil.text.formatNum((item.fpsyje1 || 0), '0.00'));
        // 校验可退税额
        let je = Number(myUtil.text.formatNum((item.jsje || 0), '0.00'));         // 当前循环行【金额】
        let tsl = Number(myUtil.text.formatNum((item.tsl || 0), '0.00000'));      // 当前循环行【退税率】
        let tse = Number(myUtil.text.formatNum((item.tse || 0), '0.00'));         // 当前循环行【退税额】
        let sbxh = item.sbxh;                                                     // 当前循环行【申报序号】
        let jstse = Number(myUtil.text.formatNum(je * tsl / 100, '0.00'));        // 计算退税额
        if (jstse !== tse) {
          sbxhArr.push('申报序号：' + sbxh + '可退税额不等于计税金额乘以退税率，是否继续保存？');
        }
      });
      // 1、校验【关联号对应的数量总和】是否超过超过【此关联号对应的出口数量】
      for (let k = 0; k < glhspxx.length; k++) {
        const glhSl = Number(myUtil.text.formatNum(glhsl[glhspxx[k].glh], '0.00000')); // 【关联号对应的数量总和】
        const glhCksl = Number(myUtil.text.formatNum(glhspxx[k].cksl, '0.00000'));     // 【关联号对应的出口数量】
        if (glhSl > glhCksl) {
          msgArr.push('关联号：' + glhspxx[k].glh + '对应的数量总和超过此关联号对应的出口数量，请确认！' + glhspxx[k].cksl);
        }
      }
      // 2、校验【进货凭证号对应的计税金额总和】是否超过【此进货凭证号的剩余金额】
      for (let key in hhJhpzh) {
        if (Number(hhJhpzh[key]) > Number(hhJhpzhSyje[key])) {
          msgArr.push('进货凭证号：' + key.split('-')[0] + '对应的计税金额总和超过此进货凭证号的剩余金额，请确认！' + Number(hhJhpzh[key]) + '  &&& ' + Number(hhJhpzhSyje[key]));
        }
      }
      if (msgArr.length > 0) {
        DDAlert.open({
          title: '系统提示',
          info: '校验提示如下',
          content: msgArr,
          infoType: 'info',
        });
        return;
      }
      if (sbxhArr.length > 0) {
        DDAlert.open({
          title: '系统提示',
          info: '是否继续保存',
          infoType: 'question',
          modalType: 'confirm',
          content: sbxhArr,
          okCallbackFn: function () {
            saveJhmx(formValue);
          },
        });
      } else {
        saveJhmx(formValue);
      }
    })
  };

  const saveJhmx = (formValue: any) => {
    setMasker(true);
    const apiParam = {
      data: formValue.fpList,
    }
    console.info(apiParam);
    console.info(formValue.fpList);
    // return;
    // 提交接口地址
    fpxxScTsjh(apiParam).then((response) => {
      const { code, body, desc, msg } = response;
      if (code === '200') {
        setModalVisible(false);
        // 更新发票转进货的发票列表、进货明细列表
        pCurrent.reload2();
        pCurrent2?.reload();
        message.success(body || desc);
      } else {
        message.error(msg);
      }
      setMasker(false);
    });
  }

  // 关联号 onchange
  const glhOnChange = (value: any, key: any) => {
    let newFormVal = { ...formValue };
    let glhspxxTmp = glhspxx.find((item: any) => item.glh === value );
    // 关联号
    newFormVal.fpList[key].glh = value;
    newFormVal.fpList[key].glhspxx = glhspxxTmp;
    // 数量：赋值
    newFormVal.fpList[key].sl = Number(myUtil.text.formatNum(glhspxxTmp.cksl || 0, '0.00000'));
    // 计量单位：赋值并置只读
    newFormVal.fpList[key].hgjldwmc = glhspxxTmp.hgjldwmc;
    newFormVal.fpList[key].hgjldwmcReadonly = true;
    // 商品代码：赋值并置只读
    newFormVal.fpList[key].ckspDm = glhspxxTmp.ckspDm;
    newFormVal.fpList[key].ckspDmReadonly = true;
    // 商品名称：如果初始化时商品名称为空，则取关联号中商品名称
    if (!newFormVal.fpList[key].sbhgspmc) {
      newFormVal.fpList[key].sbhgspmc = glhspxxTmp.sbhgspmc;
    }
    // 设置表单值
    form.setFieldsValue(newFormVal);
    // 获取退税率
    querySpdmXxCj({
      ckrq1: glhspxxTmp.ckrq1,
      ckspDm: glhspxxTmp.ckspDm,
      kprq: newFormVal.fpList[key].kprq,
      slType: "Y",
      dlckhwzmhm: glhspxxTmp.dlckhwzmhm,
      ckbgdh: glhspxxTmp.ckbgdh,
      ssq: newFormVal.fpList[key].ssq,
      sbpc: newFormVal.fpList[key].sbpc,
    }).then((response) => {
      const { code, body, desc, msg } = response;
      if (code !== '200' && desc.trim()) {
        message.error(msg);
        return;
      }
      let tsl = Number(myUtil.text.formatNum(body.tsl || 0, '0.0000'));
      let zssl = Number(myUtil.text.formatNum(newFormVal.fpList[key].zssl || 0, '0.0000'));
      // 设置退税率
      if (zssl < tsl) {
        tsl = zssl;
      }
      newFormVal.fpList[key].tsl = tsl;
      // 设置可退税额
      let jsje = Number(myUtil.text.formatNum(newFormVal.fpList[key].jsje || 0, '0.0000'));
      if (jsje) {
        let tse = Number(myUtil.text.formatNum(tsl * jsje / 100, '0.00'));
        newFormVal.fpList[key].tse = tse;
      }
      // 设置表单值
      form.setFieldsValue(newFormVal);
    })
  };

  // 计税金额 OnBlur
  const jsjeOnBlur = (event: any, key: any) => {
    let newFormVal = { ...formValue };
    let jsje = Number(myUtil.text.formatNum(event.target.value, '0.00'));
    newFormVal.fpList[key].jsje = jsje;
    // 设置表单值
    form.setFieldsValue(newFormVal);
    // 进货凭证号
    let jhpzh = formValue.fpList[key]['jhpzh'];
    // 发票行号
    let hh = formValue.fpList[key]['hh'];
    jhpzh = jhpzh + '-' + hh;
    // 遍历当前列表中相同进货凭证号+行号计税金额之和
    let jsjeSum = 0;
    formValue?.fpList?.forEach((item: any) => {
      // 取得循环当前行进货凭证号
      let jhpzhTd = item.jhpzh;
      // 当前循环行发票行号
      let hhTd = item.hh;
      if ((jhpzhTd + '-' + hhTd) === jhpzh) {
        let jsje1 = Number(myUtil.text.formatNum(item?.jsje || 0, '0.00'));
        jsjeSum += jsje1;
      }
    });
    // 发票剩余金额
    let fpsyje = Number(myUtil.text.formatNum(formValue.fpList[key]['fpsyje1'] || 0, '0.00'));
    if (fpsyje < jsjeSum) {
      message.info('当前发票下进货计税金额之和已超过此发票的剩余金额，请确认！');
      return;
    }
    let tsl = Number(myUtil.text.formatNum(formValue.fpList[key]['tsl'] || 0, '0.00000'));
    if (tsl) {
      // 设置可退税额
      let tse = Number(myUtil.text.formatNum(tsl * jsje / 100, '0.00'));
      newFormVal.fpList[key].tse = tse;
      // 设置表单值
      form.setFieldsValue(newFormVal);
    }
  };

  // 数量 OnBlur
  const slOnBlur = (event: any, key: any) => {
    let newFormVal = { ...formValue };
    newFormVal.fpList[key].sl = Number(myUtil.text.formatNum(event.target.value, '0.00000'));
    // 设置表单值
    form.setFieldsValue(newFormVal);
    // 关联号
    let glh = formValue.fpList[key].glh;
    let glhspxx = formValue.fpList[key].glhspxx;
    // 获得出口数量
    let cksl = Number(myUtil.text.formatNum(glhspxx?.cksl || 0, '0.00000'));
    // 遍历当前列表中相同关联号数量之和
    let jhslSum = 0;
    formValue?.fpList?.forEach((item: any) => {
      // 当前行的关联号
      let glhTd = item.glh;
      if (glhTd === glh) {
        jhslSum += Number(myUtil.text.formatNum(item?.sl || 0, '0.00000'));
      }
    });
    if (jhslSum > cksl) {
      message.info('当前关联号下进货数量之和已超过出口数量，请确认！');
      return;
    }
  };

  // 征税税率 OnBlur
  const zsslOnBlur = (event: any, key: any) => {
    let newFormVal = { ...formValue };
    // 获取退税率
    let zssl = Number(myUtil.text.formatNum(event.target.value, '0.0000'));
    newFormVal.fpList[key].zssl = zssl;
    // 设置表单值
    form.setFieldsValue(newFormVal);
    // 获得法定征税税率tsl
    var tsl = Number(myUtil.text.formatNum(formValue.fpList[key].tsl, '0.0000'));
    if (zssl < tsl) {
      message.info('征税税率不能小于退税率，已自动与退税率相等！');
      newFormVal.fpList[key].zssl = tsl;
      form.setFieldsValue(newFormVal);
      return;
    }
  };

  // 退税率 OnBlur
  const tsllOnBlur = (event: any, key: any) => {
    let newFormVal = { ...formValue };
    // 获取退税率
    let tsl =  Number(myUtil.text.formatNum(event.target.value || 0, '0.0000'));
    newFormVal.fpList[key].tsl = tsl;
    // 设置表单值
    form.setFieldsValue(newFormVal);
    // 获得法定征税税率
    let zssl = Number(myUtil.text.formatNum(formValue.fpList[key].zssl, '0.0000'));
    if (zssl < tsl) {
      message.info('退税率不能大于征税税率，已自动与法定征税税率相等！');
      newFormVal.fpList[key].tsl = zssl;
      form.setFieldsValue(newFormVal);
    }
    // 取得进货凭证号
    let jhpzh = formValue.fpList[key].jhpzh;
    // 发票行号
    let hh = formValue.fpList[key].hh;
    jhpzh = jhpzh + '-' + hh;
    // 遍历当前列表中相同进货凭证号+行号计税金额之和
    let jsjeSum = 0;
    formValue?.fpList?.forEach((item: any) => {
      // 取得循环当前行进货凭证号
      let jhpzhTd = item.jhpzh;
      // 当前循环行发票行号
      let hhTd = item.hh;
      if ((jhpzhTd + '-' + hhTd) === jhpzh) {
        let jsje1 = Number(myUtil.text.formatNum(item.jsje || 0, '0.00'));
        jsjeSum = jsjeSum + jsje1;
      }
    });
    // 发票剩余金额
    let fpsyje = Number(myUtil.text.formatNum(formValue.fpList[key]['fpsyje1'] || 0, '0.00'));
    if (fpsyje < jsjeSum) {
      message.info('当前发票下进货计税金额之和已超过此发票的剩余金额，请确认！');
      return;
    }
    let jsje = Number(myUtil.text.formatNum(formValue.fpList[key]['jsje'] || 0, '0.00'));
    if (jsje) {
      // 设置可退税额
      let tse = Number(myUtil.text.formatNum(tsl * jsje / 100, '0.00'));
      newFormVal.fpList[key].tse = tse;
      // 设置表单值
      form.setFieldsValue(newFormVal);
    }
  };

  const inputNumperFormatter = (value: any, info: any, format: any) => {
    if (info.userTyping) {
      if (info.input) {
        return info.input;
      } else {
        if (value) {
          return value;
        }
        return '';
      }
    } else {
      if (value) {
        return myUtil.text.formatNum(value, format);
      }
      return '';
    }
  };

  // 表单布局
  const col = {
    label: {xs: 6, sm: 6, md: 4, lg: 4, xl: 3, xxl: 3},
    value: {xs: 6, sm: 6, md: 4, lg: 4, xl: 3, xxl: 3},
    labelmim: {xs: 6, sm: 6, md: 4, lg: 4, xl: 2, xxl: 2},
    valuemax: {xs: 6, sm: 6, md: 4, lg: 4, xl: 4, xxl: 4},
  };

  return (
    <Modal
      title="发票生成进货信息列表"
      destroyOnHidden={true}
      visible={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      wrapClassName='standard-modal-1'
      footer={<>
        <Button onClick={() => setModalVisible(false)}>取消</Button>
        <Button onClick={save} type="primary">数据保存</Button>
      </>}
      onCancel={() => setModalVisible(false)}
      className={`${masker ? 'dd_modal_show_masker' : ''}`}
      mask={{ closable: false }}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <div className='bgdscmx'>
          <Form form={form} name="dynamic_form_nest_item" layout={layout} autoComplete="off" >
            <Form.List name="fpList">
              {(fields) => (<>
                {fields.map(({ key, name, ...restField }) => {
                  return (
                    <div className='form_list_group'>
                      <Row>
                        <Col {...col.labelmim}><div className='form_list_label'>所属期：</div></Col>
                        <Col {...col.valuemax}><div className='form_list_value'>{formValue?.fpList[key]['ssq']}</div></Col>
                        <Col {...col.labelmim}><div className='form_list_label'>申报批次：</div></Col>
                        <Col {...col.value}><div className='form_list_value'>{formValue?.fpList[key]['sbpc']}</div></Col>
                        <Col {...col.label}><div className='form_list_label'>供货方纳税号：</div></Col>
                        <Col {...col.valuemax}><div className='form_list_value'>{formValue?.fpList[key]['ghfnsrsbh1']}</div></Col>
                        <Col {...col.label}><div className='form_list_label'>发票剩余金额：</div></Col>
                        <Col {...col.value}><div className='form_list_value form_list_value_money'>{formValue?.fpList[key]['fpsyje1']}</div></Col>
                        <Col {...col.labelmim}><div className='form_list_label'>开票日期：</div></Col>
                        <Col {...col.value}><div className='form_list_value'>{formValue?.fpList[key]['kprq']}</div></Col>
                        <Col {...col.label}><div className='form_list_label'>申报序号：</div></Col>
                        <Col {...col.value}><div className='form_list_value'>{formValue?.fpList[key]['sbxh']}</div></Col>
                        <Col {...col.label}><div className='form_list_label'>进货凭证号：</div></Col>
                        <Col {...col.valuemax}><div className='form_list_value'>{formValue?.fpList[key]['jhpzh']}</div></Col>
                        <Col {...col.label}><div className='form_list_label'>可退税额：</div></Col>
                        <Col {...col.value}><div className='form_list_value form_list_value_money'>{myUtil.text.formatNum(formValue?.fpList[key]['tse'], '0,0.00')}</div></Col>
                      </Row>
                      <Row style={{marginTop: '15px'}}>
                        <Col {...col.labelmim}><div className='form_list_label'>关联号：</div></Col>
                        <Col  {...col.valuemax}>
                          <Form.Item {...restField} name={[name, 'glh']} rules={[
                              { required: true, message: '该项内容为必填项不能为空！' }
                            ]}>
                            <Select onChange={(value)=>{glhOnChange(value, key)}} placeholder="关联号">
                              {glhspxx.map((e: any) => <Select.Option key={e.glh} value={e.glh}>{e.glh}</Select.Option>)}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col {...col.labelmim}><div className='form_list_label'>商品代码：</div></Col>
                        <Col  {...col.value}>
                          <Form.Item {...restField} name={[name, 'ckspDm']} >
                            <Input placeholder="商品代码" readOnly={formValue.fpList[key]['ckspDmReadonly']}/>
                          </Form.Item>
                        </Col>
                        <Col {...col.label}><div className='form_list_label'>商品名称：</div></Col>
                        <Col  {...col.valuemax}>
                          <Form.Item {...restField} name={[name, 'sbhgspmc']} >
                            <Input placeholder="商品名称" />
                          </Form.Item>
                        </Col>
                        <Col {...col.label}><div className='form_list_label'>计量单位：</div></Col>
                        <Col  {...col.value}>
                          <Form.Item {...restField} name={[name, 'hgjldwmc']} >
                            <Input placeholder="计量单位" readOnly={formValue.fpList[key]['hgjldwmcReadonly']}/>
                          </Form.Item>
                        </Col>
                        <Col {...col.labelmim}><div className='form_list_label'>数量：</div></Col>
                        <Col  {...col.valuemax}>
                          <Form.Item {...restField} name={[name, 'sl']} >
                            <InputNumber min={0} max={999999999999.99} controls={false} placeholder="数量"
                              onBlur={(event: any)=>{slOnBlur(event, key)}}
                              formatter={(value: any, info: any)=>{return inputNumperFormatter(value, info, '0,0.00000')}}/>
                          </Form.Item>
                        </Col>
                        <Col {...col.labelmim}><div className='form_list_label'>计税金额：</div></Col>
                        <Col  {...col.value}>
                          <Form.Item {...restField} name={[name, 'jsje']} >
                            <InputNumber min={0} max={999999999999.99} controls={false} placeholder="计税金额" onBlur={(event: any)=>{jsjeOnBlur(event, key)}}
                              formatter={(value: any, info: any)=>{return inputNumperFormatter(value, info, '0,0.00')}}/>
                          </Form.Item>
                        </Col>
                        <Col {...col.label}><div className='form_list_label'>法定征税税率：</div></Col>
                        <Col  {...col.valuemax}>
                          <Form.Item {...restField} name={[name, 'zssl']} >
                            <InputNumber min={0} max={999999999999.99} controls={false} placeholder="征税率（%）" onBlur={(event: any)=>{zsslOnBlur(event, key)}}
                              formatter={(value: any, info: any)=>{return inputNumperFormatter(value, info, '0,0.0000')}}/>
                          </Form.Item>
                        </Col>
                        <Col {...col.label}><div className='form_list_label'>退税率：</div></Col>
                        <Col  {...col.value}>
                          <Form.Item {...restField} name={[name, 'tsl']} >
                            <InputNumber min={0} max={999999999999.99} controls={false} placeholder="退税率（%）" onBlur={(event: any)=>{tsllOnBlur(event, key)}}
                              formatter={(value: any, info: any)=>{return inputNumperFormatter(value, info, '0,0.0000')}}/>
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  )})
                }
              </>)}
            </Form.List>
        </Form>
        </div>
      </Spin>
    </Modal>
  );
}

export default Jhmx2;
