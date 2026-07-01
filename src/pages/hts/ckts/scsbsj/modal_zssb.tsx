/**
 * 台账配单明细-自动配单
 */
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { Button, Spin, Modal, Form, message, Input } from 'antd';
import { queryYcsbZssbDzxx, sendTestMail, ycsbZssbNew } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/components/DDAlert';
import { useIntl } from 'umi';
import { history } from 'umi';
import baseValidator from '@/components/DDAssist/field/baseValidator';
import {QuestionCircleOutlined } from '@ant-design/icons';
import './zssbStyle.less';




export interface AbgdBjProps {
  onRef?: any;
  visible?: any;
  gridRef?: any;
  ywKey?: any;
}

const ModelZssb: React.FC<AbgdBjProps> = ({
  onRef,
  ywKey
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [formZssb] = Form.useForm();
  const [masker, setMasker] = useState<boolean>(false); //
  const [param, setParam] = useState<any>({});
  const [dzxx, setDzxx] = useState<any>('');
  const intl = useIntl();
  const [ref, setRef] = useState<any>();

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

   //开启
  const showModal = (params: any, unitRef: any) => {
    setParam(params);
    setRef(unitRef);
    initDzxx();
    setModalVisible(true);
  };

  useEffect(() => {
    formZssb.setFieldsValue({ dzxx: dzxx });
  }, [dzxx]);

  const initDzxx = async () => {
    const params = {
      ywKey: ywKey
    }
    await queryYcsbZssbDzxx(params).then((res: any) => {
      if (res.code === '200') {
        setDzxx(res.body.dzxx);
      }
    });
  }

  const sendEmail = (thisObj: any) => {
    const params = formZssb.getFieldsValue();
    const dzxxs = [];
    if (!params.dzxx) {
      message.error('请录入消息通知邮箱！');
      return;
    }
    dzxxs.push(params.dzxx);
    setMasker(true);
    sendTestMail({ dzxxs: dzxxs }).then((res: any) => {
      setMasker(false);
      const { code, msg, } = res;
      if (code === '200') {
        message.success('邮箱地址测试完成！');
      } else {
        message.error(msg);
      }
    });
  }


  // 自动配单
  const zssb = () => {
    formZssb.validateFields().then((values: any) => {
      setMasker(true);
      const vals = {
        dzxx: values.dzxx,
        sbwjuuid : param.sbwjuuid,
        ywKey: ywKey
      }
       ycsbZssbNew(vals).then(async (res) => {
         setMasker(false);
         const {code, desc} = res;
         if (code === '200') {
           setModalVisible(false);
           ref.current?.reload2();
           if (history.location.pathname.indexOf('/25/2505') > -1) {
             successTzNew('/25/2506', ref);
           }
           if (history.location.pathname.indexOf('/26/2605') > -1) {
             successTzNew('/26/2606', ref);
           }
           if (history.location.pathname.indexOf('/27/2705') > -1) {
             successTzNew('/27/2706', ref);
           }
           if (history.location.pathname.indexOf('/hts/jljg/ckts/scsbsj/JLJG_MDTHX') > -1) {
             successTzNew('/hts/jljg/ckts/sbsjcx/JLJG_MDTHX', ref);
           }
         } else {
           message.error(desc);
         }
       });
    });
  }

  const successTzNew =(param :any,unitRef:any)=>{
    DDAlert.open({
      title: '系统提示',
      info: '数据正式申报成功，请跳转至申报结果查询，尝试刷新操作，更新审核状态',
      modalType: 'confirm',
      infoType: 'success',
      isShowcancelText:false,
      okText: '转申报结果查询',
      okCallbackFn: function (thisObj: any) {
        history.push(param);
        unitRef.current?.reload2();
        // message.success('数据申报成功');
      },
    });
  }


  return (
      <Modal
        title="正式申报"
        destroyOnHidden={true}
        open={modalVisible}
        width={550}
        mask={{ closable: false }}
        footer={
          <>
            <Button onClick={() => setModalVisible(false)}>取消</Button>
            <Button onClick={sendEmail}>发送测试邮件</Button>
            <Button onClick={zssb} type="primary">确定</Button>
          </>
        }
        onCancel={() => setModalVisible(false)}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <div className="header">
            <div className="icon" style={{color: '#FAAD15'}}><QuestionCircleOutlined /></div>
              <div className="info" style={{color: '#272424', fontSize: 16,display:'inline-block', marginLeft: 45}}>确定要正式申报么？</div>
              <p className="item" style={{ marginLeft: 20}}>温馨提示：</p>
              <p className="item" style={{ marginLeft: 20}} >1、正式申报后请操作刷新，直至申报状态为“已申报”说明本次业务提交成功;</p>
              <p className="item" style={{ marginLeft: 20}} >2、可配置通知邮箱，系统将提交异常情况发送至该邮箱</p>
          </div>
          <div className="body">
              <Form
                form={formZssb}
                name="form"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 17 }}
              >
                <Form.Item labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} style={{ marginLeft: "-44px", marginTop: "10px" }}
                rules={[{type: 'email'},]} label="消息通知邮箱" name="dzxx" >
                <Input maxLength={50} style={{ width: "250px" }} />
              </Form.Item>
            </Form>
          </div>
        </Spin>
      </Modal>
  );
};

export default ModelZssb;
