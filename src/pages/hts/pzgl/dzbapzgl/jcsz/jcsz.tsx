import React, { useState, useEffect } from 'react';
import { Switch, Form, Space, Input, InputNumber, Radio, Button, Spin, Typography, Tooltip, Modal, message, Steps } from 'antd';
import ProCard from '@ant-design/pro-card';
import myUtil from '@/components/DDAssist/util';
import style from './style.less';
import { DownloadOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { badzszjccx, badzszjccxSave, badzszjccxCheck, getOneTimeToken, badzjcszQueryXtbb, downloadGet } from '@/pages/hts/services/htsApi';
import businessValidator from "@/pages/hts/badz/badzcommon/businessValidator";
import CONSTANTS from '@/components/DDAssist/constants';
import cktsUtil from '@/pages/hts/cktsUtil';

const Jcsz: React.FC<{ data?: any }> = ({
  data,
}) => {
  useEffect(() => {

    //loadjcszBb();
    badzszjccx({}).then((response) => {
      const { body } = response;
      setBdbalj(body.bdbalj);

      form.setFieldsValue({ smycsDm: body.smycsDm, bdbalj: body.bdbalj, slrqmrz: body.slrqmrz, baqx: body.baqx });
      if (body.baqxqybz == 'Y') {
        setCheck(true);
      } else {
        setCheck(false);
      }
    })
  }, []);
  const [form] = Form.useForm();

  //备案期限：申报数据受理后的天
  const [sbsjslr, setSbsjslr] = useState<any>(data?.baqx);
  const [flaggd, setFlaggd] = useState<any>(1);
  const [masker, setMasker] = useState(false);
  //高拍仪设置
  const [gpy, setGpy] = useState(true);
  //onChangeSwitch
  const [check, setCheck] = useState<any>(true);
  //bdbalj
  const [bdbalj, setBdbalj] = useState<any>();
  const [modalVisible, setModalVisible] = useState<any>(false);
  const [flag, setFlag] = useState<any>(false);


  const [num, setNum] = useState(0);
  const [msg, setMsg] = useState("文件存储路径检查中，请稍后！");
  const [status2, setStatus2] = useState("process");

  const [bbdm, setBbdm] = useState<any>('01'); // 本地版：01；税代版：02

  const loadjcszBb = () => {
    badzjcszQueryXtbb({}).then((response) => {
      const { code, body } = response;
      if (code === '200') {
        setBbdm(body?.bbdm);
      }
    })
  }

  //开关值改变
  const onChangeSwitch = (e: any) => {
    setCheck(e);
  }

  // 表单布局
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  // 表单布局
  const tailLayout = {
    wrapperCol: { offset: 4, span: 20 },
  };
  //保存
  const save = () => {
    form.validateFields().then(values => {
        save3(values);
    })

  }

  const save2 = (values: any) => {
    const data = { "baqxqybz": check, "slrqmrz": values.slrqmrz, "baqx": values.baqx, "gdfsDm": values.smycsDm, "bdbalj": values.bdbalj, "smycsDm": values.smycsDm };
    data.baqxqybz = data.baqxqybz ? 'Y' : 'N';
    badzszjccxSave(data).then((response) => {
      const { code, desc } = response;
      if (code == '200') {
        setMsg("保存成功！");
        setNum(2);
        setBdbalj(values.bdbalj)
        setFlag(true);
      } else {
        setMsg(desc);
        setFlag(true);
        setStatus2("error");
      }
    })
  }
  const save3 = (values: any) => {
    const data = { "baqxqybz": check, "slrqmrz": values.slrqmrz, "baqx": values.baqx, "gdfsDm": values.smycsDm, "bdbalj": values.bdbalj, "smycsDm": values.smycsDm };
    data.baqxqybz = data.baqxqybz ? 'Y' : 'N';
    badzszjccxSave(data).then((response) => {
      const { code, desc } = response;
      if (code == '200') {
        message.success("保存成功！");
      } else {
        message.info(desc);
      }
    })
  }

  const close = () => {
    setModalVisible(false);
    setFlag(false);
    setNum(0);
    setMsg("文件存储路径检查中，请稍后！");
    setStatus2("process");
  }
  const calcParam = ['header', 'cardMargin', 'footerBtn', 'headerTab'];
  // 下载excel模板
  const downloadZip = async () => {
    const url = '/hx/ty/crud/downloadStaticFile/KHGPYSERVER/';
    setMasker(true);
    await cktsUtil.downloadFileCkts(url, {});
    setMasker(false);
  };

  return (
    <>
    <Spin tip="Loading..." spinning={masker} delay={100}>
        <ProCard split="horizontal" className="dd_layout_form_01 dd_xsfpz_wraf">
          <ProCard style={{ height: myUtil.heightCalc.getCalc(calcParam), overflowY: 'auto' }}>
            <div className={style.groupTit}>高拍仪设置</div>
            <Form {...layout} form={form}  >
              <Form.Item {...tailLayout} name="smycsDm">
                <Radio.Group>
                  <Radio value='00'>
                    <Space>
                      <span>广州科密</span>
                      <span><Tooltip title="适配项号：GP2318Z"><QuestionCircleOutlined /></Tooltip></span>
                      <Typography.Link onClick={downloadZip}>
                        <Tooltip title="驱动下载"><DownloadOutlined style={{ fontSize: "larger" }} /></Tooltip>
                      </Typography.Link>
                    </Space>
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
            <div className={style.groupTit} style={{ marginTop: -5 }}>备案单证期限</div>
            <Form.Item {...tailLayout}>
              <Space>
                <Form.Item >
                  <Switch checked={check} onChange={onChangeSwitch} />
                </Form.Item>
                <Form.Item label="受理日期：所属期次月的"></Form.Item>
                <div style={{ width: 60 }}>
                  <Form form={form}>
                    <Form.Item name="slrqmrz" rules={[businessValidator.notNull()]} >
                      <InputNumber min={1} max={31} disabled={check ? false : true} />
                    </Form.Item>
                  </Form>
                </div>
                <Form.Item label="日&#12288;&#12288;备案期限：申报数据受理后的"></Form.Item>
                <div style={{ width: 60 }}>
                  <Form form={form}>
                    <Form.Item name="baqx" rules={[businessValidator.notNull()]} >
                      <InputNumber min={0} max={31} disabled={check ? false : true} />
                    </Form.Item>
                  </Form>
                </div>
                <Form.Item label="天" colon={false}></Form.Item>
              </Space>
            </Form.Item>

          </ProCard>
          <ProCard className="ddlf01_footer">
            <Space>
              <Button htmlType="submit" type='primary' onClick={save} >保存</Button>
            </Space>
          </ProCard>
        </ProCard>
      </Spin>
      <Modal
        title='系统提示'
        mask={{ closable: false }}
        keyboard={false}
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X1}
        destroyOnHidden={true}
        closable={false}
        footer={flag ? [
          <Button key="back" type="primary" onClick={close} >
            关闭
          </Button>,
        ] : null}
      >
        <p>{msg}</p>
        <br /><br />
        <Steps current={num} status={status2} size="small">
          <Steps.Step title="文件路径检查" />
          <Steps.Step title="保存" />
          <Steps.Step title="保存成功" />
        </Steps>
      </Modal>
    </>
  );
};
export default Jcsz;
