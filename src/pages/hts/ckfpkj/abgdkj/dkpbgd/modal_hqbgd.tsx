/**
 * 按报关单开具  编辑开票
 */
import React, { useImperativeHandle, useState } from 'react';
import { Button, DatePicker, Spin, Modal, Form, Radio, Space, Input, message, } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import { DrawerForm } from '@ant-design/pro-form';
import './style.less';
import locale from 'antd/es/date-picker/locale/zh_CN';
import myUtil from '@/components/DDAssist/util';
import { tbbgdsjtj, tbbgdsjcl, queryParams } from '@/pages/hts/services/htsApi';
import { intl as intl2 } from '@/components/DDAssist/util';
import DDAlert from '@/pages/hts/commonModule/DDAlert';



export interface AbgdBjProps {
  onRef?: any;
}

const ModalBj: React.FC<AbgdBjProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [sbrqFlag, setSbrqFlag] = useState();

  const [form] = Form.useForm();
  const [masker, setMasker] = useState<boolean>(false); // 蒙板
  const [disFlag, setDisFlag] = useState('1'); // 蒙板
  const [access, setAccess] = useState(); // 蒙板
  const [unitRef, setUnitRef] = useState(); // 蒙板

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 开启
  const showModal = (sbrqFlag: any,unitRef: any,access: any) => {
    setSbrqFlag(sbrqFlag);
    setModalVisible(true);
    setAccess(access);
    setUnitRef(unitRef);
    form.setFieldsValue({ tblx: '1',ckrq: [], hgckhwbgdsbrq: [], ckbgdxzrq: [] });

  };

// 获取报关单弹窗点击单选后根据单选赋值
  const onChangeHqbgd = (e: any) => {
    if (e.target.value === '2') {
      form.setFieldsValue({ ckrq: [], hgckhwbgdsbrq: [], ckbgdxzrq: [] });
      setDisFlag('2');
    } else if (e.target.value === '3') {
      form.setFieldsValue({ ckrq: [], ckbgd: '', ckbgdxzrq: []  });
      setDisFlag('3');
    } else if (e.target.value === '1') {
      form.setFieldsValue({ ckbgd: '', hgckhwbgdsbrq: [], ckbgdxzrq: [] });
      setDisFlag('1');
    } else if (e.target.value === '4') {
      form.setFieldsValue({ ckrq: [], ckbgd: '', hgckhwbgdsbrq: [] });
      setDisFlag('4');
    }
  }

  const close = () => { 
    setModalVisible(false);
    setMasker(false);
    setDisFlag('1');
    form.setFieldsValue({ ckrq: [], hgckhwbgdsbrq: [], ckbgdxzrq: [], ckbgd: '' , tblx: '1'});
  }
  const save = () => { 
    form.validateFields().then((values: any) => {
        const tblx = values.tblx;
        let param: any = { tblx: tblx };
        if (tblx === '1') {
          if (values.ckrq && values.ckrq.length > 0) {
            param.ckrq1Q = new Date(values.ckrq[0].format('YYYY/MM/DD')).getTime();
            param.ckrq1Z = myUtil.date.accurateDate(values.ckrq[1].format('YYYY/MM/DD'), '2');
          } else {
            message.info(intl2.formatMessage({ id: 'message_ckfp_abgdkj_hqbgd_check1' }));
            return;
          }
        } else if (tblx === '3') {
          if (values.hgckhwbgdsbrq && values.hgckhwbgdsbrq.length > 0) {
            param.hgckhwbgdsbrqQ = new Date(values.hgckhwbgdsbrq[0].format('YYYY/MM/DD')).getTime();
            param.hgckhwbgdsbrqZ = myUtil.date.accurateDate(values.hgckhwbgdsbrq[1].format('YYYY/MM/DD'), '2');
          } else {
            message.info(intl2.formatMessage({ id: 'message_ckfp_abgdkj_hgckhwbgdsbrq_check1' }));
            return;
          }
        } else if (tblx === '2') {
          if (values.ckbgd) {
            param.bgdhgbh = values.ckbgd;
          } else {
            message.info(intl2.formatMessage({ id: 'message_ckfp_abgdkj_hqbgd_check2' }));
            return;
          }
        } else if (tblx === '4') {
          if (values.ckbgdxzrq && values.ckbgdxzrq.length > 0) {
            param.ckbgdxzrqQ = new Date(values.ckbgdxzrq[0].format('YYYY/MM/DD')).getTime();
            param.ckbgdxzrqZ = myUtil.date.accurateDate(values.ckbgdxzrq[1].format('YYYY/MM/DD'), '2');
          } else {
            message.info(intl2.formatMessage({ id: 'message_ckfp_abgdkj_ckbgdxzrq_check1' }));
            return;
          }

        }
        setMasker(true);
        tbbgdsjtj(param).then((response: any) => {
          close();
          const { code, body, desc ,msg} = response;
          if (code === '200') {
            setMasker(false);
            openAckrqhq(body, param, unitRef, access);
          } else {
            setMasker(false);
            if (code === '300' && body.gdykpbz === 'Y') {
              message.info(intl2.formatMessage({ id: 'message_ckfp_abgdkj_hqbgd_error' }));
            } else {
              message.error(msg)
            }
          }
        })
      });
 
  }
  
// 弹出统计条数，点击确定后调用接口处理数据
const openAckrqhq = (param: any, param1: any, unitRef: any, access: any) => {
  const tmpMessage = intl2.formatMessage({ id: access.isNsrsbh ? 'message_ckfp_abgdkj_hqbgd_ackrq_sl_success' : 'message_ckfp_abgdkj_hqbgd_ackrq_success' });
  const infoMessage = myUtil.text.formatRepalce(tmpMessage, param)
  DDAlert.open({
    title: intl2.formatMessage({ id: 'message_ckfp_abgdkj_hqbgd_ackrq_title' }),
    info: infoMessage,
    infoType: 'warning',
    modalType: 'confirm',
    okText: '确定',
    closeStatus: false,
    isFormContent: false,
    okCallbackFn: function (thisObj: any) {
      thisObj.setState({ masker: true });
      // 获取数据对应的数据处理
      setMasker(true);
      tbbgdsjcl(param1).then((response: any) => {
        const { code, desc } = response;
        if (code === '200') {
          setMasker(false);
          queryParams({ key: 'GFCX_CS_ZXSB_FPKJ_KHGLPZ', searchModel: [{ property: 'qybz', value: 'Y', op: 'rl' }], }).then((response) => {
            const { code, body } = response;
            DDAlert.close();
            if (code === '200') {
              const temp: any = [];
              body.forEach((item: any) => {
                temp.push(Object.assign(item, { code: item.khuuid, name: item.ghfnsrmc }));
              })
              myUtil.code.saveCodeToLocalTable('CODE_CKFP_ABGDKJ_GMFMC',temp,'01');
              unitRef.current?.reload2();
              message.success(intl2.formatMessage({ id: 'message_ckfp_abgdkj_hqbgd_success' }));
            }
          });
        } else {
          DDAlert.close();
          message.error(desc)
        }
      })
    },
    content: '',
  });
}
  
  return (
      <Modal
        title="获取报关单"
        destroyOnHidden={true}
        visible={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X1}
        mask={{ closable: false }}
        footer={
          <>
            <Button onClick={close}>取消</Button>
            <Button onClick={save} type="primary">确定</Button>
          </>
        }
        onCancel={() => setModalVisible(false)}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 14 }}
            autoComplete="off"
            className="formClass"
          >
            <Form.Item name="tblx" wrapperCol={{ offset: 5, span: 14 }} rules={[{ required: true, message: '请选择获取方式' }]} >
              <Radio.Group onChange={onChangeHqbgd}>
                <Space direction="vertical">
                  <Radio value='1'>根据出口日期获取</Radio>
                  <Form.Item name="ckrq" wrapperCol={{ offset: 0, span: 14 }}>
                    <DatePicker.RangePicker locale={locale} format={myUtil.date.formatList()} style={{width:240}} disabled = {disFlag == '1' ? false:true} />
                  </Form.Item>
                  <Radio style= {{display : sbrqFlag ? 'block':'none'}} value='3'>根据申报日期获取</Radio>
                  <Form.Item name="hgckhwbgdsbrq" style = {{display : sbrqFlag ? 'block':'none'}} wrapperCol={{ offset: 0, span: 14 }}>
                    <DatePicker.RangePicker locale={locale} format={myUtil.date.formatList()} style={{width:240}} disabled = {disFlag == '3' ? false:true}/>
                  </Form.Item>
                  <Radio value='4'>根据下载日期获取</Radio>
                  <Form.Item name="ckbgdxzrq" wrapperCol={{ offset: 0, span: 14 }}>
                    <DatePicker.RangePicker locale={locale} format={myUtil.date.formatList()} style={{width:240}}  disabled = {disFlag == '4' ? false:true}/>
                  </Form.Item>
                  <Radio value='2'>根据报关单号获取</Radio>
                  <Form.Item name="ckbgd" wrapperCol={{ offset: 0, span: 14 }} >
                    <Input placeholder="请输入18位报关单号"  style={{width:240}}  disabled = {disFlag == '2' ? false:true}/>
                  </Form.Item>
                </Space>
              </Radio.Group>
            </Form.Item>
  
          </Form>
        </Spin>
      </Modal>
  );
};

export default ModalBj;
