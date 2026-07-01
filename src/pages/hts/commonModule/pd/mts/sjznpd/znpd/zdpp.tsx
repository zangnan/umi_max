/**
 * title: 智能配单-自动匹配
 * author: yxy
 */
import React, { useImperativeHandle, useState, useEffect, useRef } from 'react';
import { Spin, Form, Modal, Checkbox, DatePicker, Row, Col, Radio, Input, InputNumber, message, Tooltip} from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import { queryZnpdZdppInfo, queryZnpdZdppPdgdts, queryZnpdZdppPdfpts, savemtsZnpdZdpd } from '@/pages/hts/services/htsApi';
import { history } from 'umi';
import moment from 'moment';
import './style.less';
import myUtil, { intl as intl2 } from '@/components/DDAssist/util';
import { QuestionCircleOutlined } from '@ant-design/icons';
import Znpdmx from '@/pages/hts/commonModule/pd/mts/sjznpd/znpdmx';

export interface ZdppProps {
  onRef?: any;
  CallbackFmFunc?: any
}

const ModalZdpp: React.FC<ZdppProps> = ({
  onRef,
  CallbackFmFunc
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [masker, setMasker] = useState<boolean>(false);
  const [gdts, setGdts]= useState<any>(0);
  const [fpts, setFpts]= useState<any>(0);
  const [hlzBz, setHlzBz] = useState<boolean>(false);

  const [zdppForm] = Form.useForm();

  const refZnpdmx: any = useRef();

  const showModal = () => {
    setModalVisible(true);
    setMasker(true);
    queryZnpdZdppInfo({pdppfsDm: "1"}).then((response) => {
      setMasker(false);
      const {code, body, desc} = response;
      if (code === '200') {
        if (JSON.stringify(body) != "{}") {
          const formVal: any = {...body};
          if (formVal.fappsxDm === '3') {
            setHlzBz(false);
          } else {
            setHlzBz(true);
            formVal.hhcbhlz = null;
          }
          // 后台值转换
          const gdfpppgx: any = [];
          if (!formVal.gdfpydyppbz || formVal.gdfpydyppbz === 'Y') {
            gdfpppgx.push("1");
          }
          if (formVal.gdfpyddppbz === 'Y') {
            gdfpppgx.push("2");
          }
          formVal.gdfpppgx = gdfpppgx;
          const fpdwppgx: any = [];
          if (formVal.fpygddyjldwyzcyppbz === 'Y') {
            fpdwppgx.push("1");
          }
          if (formVal.fpygddejldwyzcyppbz === 'Y') {
            fpdwppgx.push("2");
          }
          if (formVal.fpygdsbjldwyzcyppbz === 'Y') {
            fpdwppgx.push("3");
          }
          // 初次进入时上下限无值，给予默认值
          // if (formVal.hhcbhlxx === 0) {
          //   formVal.hhcbhlxx = 1
          // }
          if (formVal.hhcbhlsx === 0) {
            formVal.hhcbhlsx = 10000
          }
          formVal.fpdwppgx = fpdwppgx;
          formVal.jhxxjcbz = body.jhxxjcbz === 'Y'? true: false;
          formVal.ckrq1 = [moment(new Date(Number(formVal.ljDateStart))), moment(new Date(Number(formVal.ljDateEnd)))];
          formVal.kprq = [moment(new Date(Number(formVal.kprqStart))), moment(new Date(Number(formVal.kprqEnd)))];
          zdppForm.setFieldsValue(formVal);
          handlerSearchGdts({ckrq1: formVal.ckrq1});
          handlerSearchFpts({kprq: formVal.kprq,jhxxjcbz: body.jhxxjcbz});
        } else {
          zdppForm.setFieldsValue({gdfpppgx: ['1']});
        }
      } else {
        message.error(desc);
      }
    })
  }
  const closeModal = () => {
    setModalVisible(false);
  }

  // 查询可参与配单关单条数
  const handlerSearchGdts = (params: any) => {
    setMasker(true);
    const start: any = (new Date(params['ckrq1'][0].format('YYYY/MM/DD'))).getTime();
    const end: any = (new Date(params['ckrq1'][1].format('YYYY/MM/DD'))).getTime();
    const model: any = {
      ljDateStart: start,
      ljDateEnd: end
    };
    queryZnpdZdppPdgdts(model).then((response)=> {
      setMasker(false);
      const {code, body, desc} = response;
      if (code === '200') {
        setGdts(body?.kpdBgdCount || 0);
      } else {
        message.error(desc);
      }
    })
  }

  // 查询可参与配单发票条数
  const handlerSearchFpts = (params: any) => {
    setMasker(true);
    const start: any = (new Date(params['kprq'][0].format('YYYY/MM/DD'))).getTime();
    const end: any = (new Date(params['kprq'][1].format('YYYY/MM/DD'))).getTime();
    const model: any = {
      kprqQs: start,
      kprqJz: end,
      fpzt: params.jhxxjcbz,
      fpsbztDms:['1'],
      notInFpcllxDm:["2", "3", "4", "5"],
    }
    queryZnpdZdppPdfpts(model).then((response)=> {
      setMasker(false);
      const {code, body, desc} = response;
      if (code === '200') {
        setFpts(body?.kpdFpCount || 0);
      } else {
        message.error(desc);
      }
    })
  }

  const handleCkrqChange = (open: any) => {
    if (!open) {
      const ckrq: any = zdppForm.getFieldValue('ckrq1');
      if (ckrq?.length > 0) {
        const params: any = {
          ckrq1: ckrq
        };
        handlerSearchGdts(params);
      }
    }
  }

  const handleKprqChange = (open: any) => {
    if (!open) {
      const kprq: any = zdppForm.getFieldValue('kprq');
      if (kprq?.length > 0) {
        const params: any = {
          kprq: kprq,
          jhxxjcbz: zdppForm.getFieldValue('jhxxjcbz') ? 'Y': 'N'
        };
        handlerSearchFpts(params);
      }
    }
  }

  const handleFappsxChange = (e: any) => {
    const value = e.target.value;
    if (value === '3') {
      setHlzBz(false);
    } else {
      setHlzBz(true);
      zdppForm.setFieldsValue({hhcbhlz: null})
    }
  }

  const handleJhxxChange = (e: any) => {
    const jhxxjcbz = e.target.checked? 'Y': 'N';
    const kprq: any = zdppForm.getFieldValue('kprq');
    if (kprq?.length > 0) {
      const params: any = {
        kprq:kprq,
        jhxxjcbz: jhxxjcbz
      };
      handlerSearchFpts(params);
    }
  }

  // 表单布局
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };

  const handleQdpd = () => {
    zdppForm.validateFields().then((values: any) => {
      if (fpts === 0 || gdts === 0) {
        message.info(intl2.formatMessage({ id: 'message_mts_znpd_zdpp_nodata_message' }));
        return
      }
      setMasker(true);
      const ppgzModel: any = {};
      ppgzModel.fauuid = values.fauuid;
      ppgzModel.fappsxDm = values.fappsxDm;
      ppgzModel.hhcbhlz = values.hhcbhlz;
      ppgzModel.hhcbhlsx = values.hhcbhlsx;
      ppgzModel.hhcbhlxx = values.hhcbhlxx;
      ppgzModel.gdfpydyppbz = myUtil.array.isContiner(values.gdfpppgx, '1') ? 'Y': 'N';
      ppgzModel.gdfpyddppbz = myUtil.array.isContiner(values.gdfpppgx, '2') ? 'Y': 'N';

      ppgzModel.fpygddyjldwyzcyppbz = myUtil.array.isContiner(values.fpdwppgx, '1') ? 'Y': 'N';
      ppgzModel.fpygddejldwyzcyppbz = myUtil.array.isContiner(values.fpdwppgx, '2') ? 'Y': 'N';
      ppgzModel.fpygdsbjldwyzcyppbz = myUtil.array.isContiner(values.fpdwppgx, '3') ? 'Y': 'N';
      ppgzModel.jhxxjcbz = values.jhxxjcbz? 'Y' : 'N';

      const fpQueryModel: any = {
        kprqStart: (new Date(values.kprq[0].format('YYYY/MM/DD'))).getTime(),
        kprqEnd: (new Date(values.kprq[1].format('YYYY/MM/DD'))).getTime(),
        fpsbztDms:['1'],
        notInFpcllxDm:["2", "3", "4", "5"],
      };
      const bgdQueryModel: any = {
        ljDateStart: (new Date(values.ckrq1[0].format('YYYY/MM/DD'))).getTime(),
        ljDateEnd: (new Date(values.ckrq1[1].format('YYYY/MM/DD'))).getTime(),
      };
      const params : any = {
        ppgzModel: ppgzModel,
        fpQueryModel: fpQueryModel,
        bgdQueryModel: bgdQueryModel
      }
      savemtsZnpdZdpd(params).then((response) => {
        setMasker(false);
        const { code, body, desc } = response;
        if (code === '200') {
          const { ppcgckbgdts } = body;
          // if (ppcgckbgdts === 0) {
          //   message.info(intl2.formatMessage({ id: 'message_mts_znpd_zdpp_nodata_message' }));
          // } else {
          //   // history.push({ pathname: '/hts/mts/sjznpd/znpdmx', query: { bz: 'ZDPP', pduuid: body.pduuid } }); // 原/hts/mts/sjznpd/znpdmx
          // }
          refZnpdmx?.current?.showModal({ bz: 'ZDPP', pduuid: body.pduuid });
        } else {
          message.error(desc);
        }
      })
    })
  }

  const changeTimeData = (value?: any, label?: any) => {
    if (value) {
      const timeYear01 = moment(value[0]).format("YYYY");
      const timeYear02 = moment(value[1]).format("YYYY");
      const lastTime = moment(value[0]).endOf("year"); // 当前年结束时间
      if(timeYear01 === timeYear02){
        zdppForm.setFieldsValue({ [label]: value});
      } else {
        zdppForm.setFieldsValue({ [label]: [value[0], lastTime]});
      }
    }
  }

  const changeTimeDataRange = (value?: any, label?: any) => {
    if(value[0] && !value[1]){
      const timeYear01 = moment(value[0]).format("YYYY");
      const nowYear = moment().format("YYYY");
      const lastTime = moment(value[0]).endOf("year"); // 当前年结束时间
      if(timeYear01 === nowYear){
        zdppForm.setFieldsValue({ [label]: [value[0], moment()]});
      } else {
        zdppForm.setFieldsValue({ [label]: [value[0], lastTime]});
      }
    }
  }

  useEffect(() => {
  }, []);

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <>
      <Modal
        title={'自动匹配'}
        open={modalVisible}
        wrapClassName='standard-modal-1'
        width={CONSTANTS.C_MODAL_WIDTH_X4}
        okText="确定配单"
        okButtonProps={{ className: 'dd_btn_focus' }}
        cancelText="关闭"
        onCancel={() => setModalVisible(false)}
        onOk={handleQdpd}
        className={`${masker ? 'dd_modal_show_masker' : ''}`}
        mask={{ closable: false }}
        destroyOnHidden={true}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <div className="dd-form dd_zdpp_wrap">
            <Form form={zdppForm} name={'mts-znpd-form'} initialValues={{}}>
                <Form.Item name="fauuid" style={{display: "none"}}>
                  <Input type={'hidden'} />
                </Form.Item>
                <div className='groupTit'>数据范围</div>
                <Form.Item label="出口日期" {...layout}>
                  <div style={{display: 'inline-flex', height: 32}}>
                    <Form.Item name="ckrq1" rules={[
                        () => ({
                          validator(_, value) {
                            if (value && value.length === 2) {
                              if (value[0].get('year') != value[1].get('year')) {
                                return Promise.reject(new Error('出口日期不可跨年'));
                              }
                              if (value[1].diff(value[0], 'months') > 12) {
                                return Promise.reject(new Error('选择区间不能大于12个月'));
                              } else if (value[1].diff(value[0], 'months') === 12) {
                                if (!myUtil.date.compareTime(12, value[0].format('YYYY-MM-DD'), value[1].format('YYYY-MM-DD'))) {
                                  return Promise.reject(new Error('选择区间不能大于12个月'));
                                }
                              }
                              return Promise.resolve();
                            } else {
                              return Promise.reject(new Error('请选择出口日期！'));
                            }
                          },
                        })
                      ]} >
                        <DatePicker.RangePicker style={{ width: '230px' }} placeholder={['出口日期起', '出口日期止']} 
                        allowClear={false} inputReadOnly={true} onOpenChange={handleCkrqChange} 
                        onChange={(val: any) => changeTimeData(val, 'ckrq1')} onCalendarChange={(val: any) => changeTimeDataRange(val, 'ckrq1')} />
                      </Form.Item>
                  </div>
                  <div style={{display: 'inline-flex', height: 32}}>
                    <span style={{ marginLeft: 10 }}>可参与配单关单条数：{gdts} </span>
                  </div>
                </Form.Item>
                <Form.Item label="开票日期" {...layout}>
                  <div style={{display: 'inline-flex'}}>
                    <Form.Item name="kprq" rules={[
                      () => ({
                        validator(_, value) {
                          if (!value) {
                            return Promise.reject(new Error('请选择开票日期！'));
                          } else {
                            if (value[1].diff(value[0], 'months') > 12) {
                              return Promise.reject(new Error('选择区间不能大于12个月'));
                            } else if (value[1].diff(value[0], 'months') === 12) {
                              if (!myUtil.date.compareTime(12, value[0].format('YYYY-MM-DD'), value[1].format('YYYY-MM-DD'))) {
                                return Promise.reject(new Error('选择区间不能大于12个月'));
                              }
                            }
                          }
                          return Promise.resolve();
                        },
                      })
                    ]} >
                      <DatePicker.RangePicker style={{ width: '230px' }} placeholder={['开票日期起', '开票日期止']} 
                      allowClear={false} inputReadOnly={true} onOpenChange={handleKprqChange} />
                    </Form.Item>
                  </div>
                  <div style={{display: 'inline-flex'}}>
                    <span style={{ marginLeft: 10 }}>可参与配单发票条数：{fpts} </span>
                  </div>
                </Form.Item>
                <div className='groupTit'>配单规则</div>
                <Form.Item label="匹配顺序" {...layout}  className="dd_zdpp_ppsx"  name="fappsxDm" rules={[
                  () => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject(new Error('请选择匹配顺序'));
                      }
                      return Promise.resolve();
                    },
                  })
                ]} >
                  <Radio.Group className="dd_zdpp_ppsx_radio" onChange={handleFappsxChange}>
                    <Tooltip title="使用出口日期较早报关单优先匹配开票日期较早退税发票">
                      <Radio key={'fappsxDm1'} value={'1'}>{'先入先出'}<QuestionCircleOutlined /></Radio>
                    </Tooltip><br />
                    <Tooltip title="使用出口日期较早报关单匹配开票日期较晚退税发票">
                      <Radio key={'fappsxDm2'} value={'2'}>{'后入先出'}<QuestionCircleOutlined /></Radio>
                    </Tooltip><br />
                    <Radio key={'fappsxDm3'} value={'3'} className="dd_zdpp_ppsx_radio_yxmzhhcb">
                        <div style={{top: 4}}><span>优先满足换汇成本在</span></div>
                        <Form.Item style={{width: 330, left: 8}} name="hhcbhlz" rules={[
                            () => ({
                              validator(_, value) {
                                const ppsx = zdppForm.getFieldValue('fappsxDm');
                                const hhcbhlxx = zdppForm.getFieldValue('hhcbhlxx');
                                const hhcbhlsx = zdppForm.getFieldValue('hhcbhlsx');
                                if (!value && ppsx === '3') {
                                  return Promise.reject(new Error('匹配顺序为优先满足换汇成本时，换汇成本值必录！'));
                                }
                                if (ppsx === '3' && value && hhcbhlsx && hhcbhlxx) {
                                  if (!(value >= hhcbhlxx && value <= hhcbhlsx)) {
                                    return Promise.reject(new Error('换汇成本值位于合理下限与上限之间！'));
                                  }
                                }
                                return Promise.resolve();
                              },
                            })
                        ]} >
                          <InputNumber style={{ width: 10 }} controls={false} precision={0} max={10000} min={1} disabled={hlzBz}/>
                        </Form.Item>
                        <div style={{top: 4, left: -265}}><span>附近</span></div>
                    </Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="换汇成本合理范围" {...layout} className="dd_zdpp_hhcbhlfw">
                  <Row style={{ height: 32 }}>
                    <div style={{display: "inline-flex", alignItems: "center"}}>
                      <label>换汇成本合理下限</label>
                    </div>
                    <div style={{width: 120, position: 'relative', left: 8}} className="dd_zdpp_hhcbhlfw_hlsx">
                      <Form.Item name="hhcbhlxx" rules={[
                          () => ({
                            validator(_, value) {
                              if (value === null || value === undefined) {
                                return Promise.reject(new Error('请输入合理下限！'));
                              } else {
                                const hhcbhlsx = zdppForm.getFieldValue('hhcbhlsx');
                                if (hhcbhlsx && value > hhcbhlsx) {
                                  return Promise.reject(new Error('合理下限应小于上限！'));
                                }
                              }
                              return Promise.resolve();
                            },
                          })
                        ]}  >
                        <InputNumber style={{ textAlign: 'center' }} controls={false} precision={0} max={10000} min={0} />
                      </Form.Item>
                    </div>
                    <div style={{position: 'relative', left: -48, display: "inline-flex", alignItems: "center"}}>
                      <label>合理上限</label>
                    </div>
                    <div style={{width: 120, position: 'relative', left: -42}} className="dd_zdpp_hhcbhlfw_hlxx">
                      <Form.Item name="hhcbhlsx" rules={[
                          () => ({
                            validator(_, value) {
                              if (!value) {
                                return Promise.reject(new Error('请输入合理上限！'));
                              } else {
                                const hhcbhlxx = zdppForm.getFieldValue('hhcbhlxx');
                                if (hhcbhlxx && value < hhcbhlxx) {
                                  return Promise.reject(new Error('合理上限应大于下限！'));
                                }
                              }
                              return Promise.resolve();
                            },
                          })
                        ]} >
                        <InputNumber style={{ width: 10 }} controls={false} precision={0} max={10000} min={0} />
                      </Form.Item>
                    </div>
                  </Row>
                </Form.Item>
                <Form.Item name='gdfpppgx' label="匹配关系"  {...layout}>
                  <Checkbox.Group  >
                    <Checkbox value="1" disabled={true} style={{ lineHeight: '32px' }}>关单发票1对1匹配</Checkbox>
                    <br />
                    <Checkbox value="2" style={{ lineHeight: '32px' }}>关单发票1对多匹配</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
                <Form.Item name='fpdwppgx' label="单位匹配规则"  {...layout} rules={[
                      () => ({
                        validator(_, value) {
                          if (!value || value.length === 0) {
                            return Promise.reject(new Error('请选择单位匹配规则！'));
                          }
                          return Promise.resolve();
                        },
                      })
                    ]} >
                  <Checkbox.Group>
                    <Checkbox value="1" style={{ lineHeight: '32px' }}>发票与关单法定计量单位一致参与匹配</Checkbox>
                    <br />
                    <Checkbox value="3" style={{ lineHeight: '32px' }}>发票与关单成交单位一致参与匹配</Checkbox>
                    <br />
                    <Checkbox value="2" style={{ lineHeight: '32px' }}>发票与关单第二计量单位一致参与匹配</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
                <Form.Item name='jhxxjcbz' valuePropName="checked" label="发票状态"  {...layout}>
                  <Checkbox  onChange={handleJhxxChange}>需要稽核信息</Checkbox>
                </Form.Item>
              </Form>
          </div>
          <Znpdmx onRef={refZnpdmx} CallbackFmFunc={CallbackFmFunc} closeModal={closeModal} />
        </Spin>
      </Modal>
    </>
  );
};

export default ModalZdpp;
