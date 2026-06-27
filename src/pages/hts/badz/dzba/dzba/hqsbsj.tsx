// 报送资料
import cktsUtil from '@/pages/hts/cktsUtil';
import React, { useState, useImperativeHandle, Fragment } from 'react';
import { Modal, Input, Button, Form, Radio, Upload, message } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import { FolderAddOutlined } from '@ant-design/icons';
import validateMessages from '@/components/DDForm/validateMess';
import { obtainDeclarationData, fkhqsbsjqzjy, hqsbsjSave } from '@/pages/hts/services/htsApi';
import myUtil, { intl as intl2 } from '@/components/DDAssist/util';
import DDBaseGrid from '@/components/DDBaseGrid';

export type AttachmentDataProps = {
  visible?: any;
  onRef?: any;
  gridRef?: any;
}

const Hqsbsj: React.FC<AttachmentDataProps> = ({
  visible = false,
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [modalVisible2, setModalVisible2] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [flaggd, setFlaggd] = useState<any>(1);
  const [param2, setParam2] = useState<any>();
  const [crcs, setCrcs] = useState<any>();
  //查询数据
  const [queryParam, setQueryParam] = useState({});
  //数据列表
  const [gridData, setGridData] = useState<any>([]);
  // 开启
  const showModal = (param: any) => {
    setModalVisible(true);
    setParam2(param);
  };
  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });
  const close = () => {
    setModalVisible(false);
    setFlaggd(1);
    form.resetFields();
  }
  const close2 = () => {
    setModalVisible2(false);
    setGridData([]);
    setQueryParam({});
  }
  const radioChange = (e: any) => {
    setFlaggd(e.target.value);
  }

  const beforeUpload = (file: any) => {
    return file.name.toUpperCase().endsWith(".XML") ? true : Upload.LIST_IGNORE;
  }
  const save = () => {
    const { unitRef, } = param2;
    const qylx = cktsUtil.sys.enterpriseType();
    form.validateFields().then(values => {
      if ('1' == values.bz) {
        //从小图获取
        const data = { "hqrq": values.ssq, "badzsbsjlyDm": "1", "tbrwmxBz": "N", "lcswsxDm": qylx === 'WM' ? values.lcswsxDm : 'LCSXA081038001' }
        unitRef.current!.setMasker(true);
        // 获取申报数据
        close();
        obtainDeclarationData(data).then((response) => {
          const { code, desc, body } = response;
          if (code === '200') {
            if (body.hqsbsjVos.length > 0) {
              setCrcs({ 'hqrq': body.hqrq, 'badzsbsjlyDm': body.badzsbsjlyDm, 'tbrwmxBz': 'N', "lcswsxDm": qylx === 'WM' ? values.lcswsxDm : 'LCSXA081038001' });
              setModalVisible2(true);
              setGridData(body.hqsbsjVos);
            } else {
              hqsbsjSave({
                'hqrq': body.hqrq,
                'badzsbsjlyDm': body.badzsbsjlyDm,
                'tbrwmxBz': 'N',
                "lcswsxDm": qylx === 'WM' ? values.lcswsxDm : 'LCSXA081038001',
              }).then((response) => {
                const { code, desc } = response;
                if (code === '200') {
                  message.success(intl2.formatMessage({ id: 'message_badz_dzba_dzba_hqsbsj_success' }));
                  unitRef.current!.reload2();
                  unitRef.current!.setMasker(false);
                } else {
                  message.error(desc);
                  unitRef.current!.setMasker(false);
                }
              })
            }
            unitRef.current!.setMasker(false);
          } else {
            message.error(desc);
            unitRef.current!.setMasker(false);
          }
        })
      } else {
        //申报文件上传
        const data = new FormData();
        data.append('file', values.fkwj[0].originFileObj);
        data.append('badzsbsjlyDm', '2');
        data.append('tbrwmxBz', 'N');
        unitRef.current!.setMasker(true);
        // 获取申报数据
        close();
        fkhqsbsjqzjy(data).then((response) => {
          const { code, desc, body } = response;
          if (code === '200') {
            if (body?.hqsbsjVos.length > 0) {
              setCrcs({ 'hqrq': body.hqrq, 'badzsbsjlyDm': body.badzsbsjlyDm, 'tbrwmxBz': 'N', 'lcswsxDm': body.lcswsxDm });
              setModalVisible2(true);
              setGridData(body.hqsbsjVos);
            } else {
              hqsbsjSave({
                'hqrq': body.hqrq,
                'badzsbsjlyDm': body.badzsbsjlyDm,
                'tbrwmxBz': 'N',
                'lcswsxDm': body.lcswsxDm,
              }).then((response) => {
                const { code, desc } = response;
                if (code === '200') {
                  message.success(intl2.formatMessage({ id: 'message_badz_dzba_dzba_hqsbsj_success' }));
                  unitRef.current!.reload2();
                  unitRef.current!.setMasker(false);
                } else {
                  message.error(desc);
                  unitRef.current!.setMasker(false);
                }
              })
            }
            unitRef.current!.setMasker(false);
          } else {
            message.error(desc);
            unitRef.current!.setMasker(false);
          }
        })
      }
    })
  }
  const save2 = () => {
    const { unitRef, } = param2;
    unitRef.current!.setMasker(true);
    close2();
    hqsbsjSave(crcs).then((response) => {
      const { code, desc } = response;
      if (code === '200') {
        message.success(intl2.formatMessage({ id: 'message_badz_dzba_dzba_hqsbsj_success' }));
        unitRef.current!.reload2();
        unitRef.current!.setMasker(false);
      } else {
        message.error(desc);
        unitRef.current!.setMasker(false);
      }
    })
  }

  // 配置列表列
  const columns = cktsUtil.sys.enterpriseType() === "WM" ? [
    { title: '更新类型', dataIndex: 'xzbz1mc', width: 120 },
    { title: '所属期', dataIndex: 'ssq', width: 60 },
    { title: '批次', dataIndex: 'sbpc', width: 60 },
    { title: '报关单号/代理证明号', dataIndex: 'bgdhgbh', width: 140 }
  ] : [
    { title: '更新类型', dataIndex: 'xzbz1mc', width: 120 },
    { title: '所属期', dataIndex: 'ssq', width: 60 },
    { title: '报关单号/代理证明号', dataIndex: 'bgdhgbh', width: 140 }
  ];
  return (
    <>
      <Modal
        title="获取申报数据"
        centered
        destroyOnHidden
        visible={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X1}
        onCancel={() => setModalVisible(false)}
        footer={(
          <Fragment>
            <Button type="primary" onClick={save}>确认</Button>
            <Button type="default" onClick={close}>关闭</Button>
          </Fragment>
        )}
      >
        <Form form={form} validateMessages={validateMessages} >
          {cktsUtil.sys.enterpriseType() === "WM" ?
            <Form.Item wrapperCol={{ offset: 3, span: 19 }} name="bz" initialValue={1}>
              <Radio.Group onChange={radioChange}>
                <Radio value={1} >从小图退税获取已申报数据</Radio>
                <div id="div1" style={{ height: 90 }}></div>
                <Radio value={2}>读入审核结果反馈文件</Radio>
                <div id="div1" style={{ height: 102 }}></div>
              </Radio.Group>
            </Form.Item>
            :
            <Form.Item wrapperCol={{ offset: 5, span: 19 }} name="bz" initialValue={1}>
              <Radio.Group onChange={radioChange}>
                <Radio value={1} >从小图退税获取已申报数据</Radio>
                <div id="div1" style={{ height: 60 }}></div>
                <Radio value={2}>读入审核结果反馈文件</Radio>
                <div id="div1" style={{ height: 60 }}></div>
              </Radio.Group>
            </Form.Item>
          }
          {cktsUtil.sys.enterpriseType() === "WM" ?
            <>
              <Form.Item wrapperCol={{ offset: 3, span: 19 }} name="ssq" rules={[{ required: flaggd == 1 ? true : false },]} style={{ marginTop: -236 }}>
                <Input placeholder="请输入4位所属年度、6位所属期或9位所属期批次" disabled={flaggd == 1 ? false : true} style={{ width: '330px' }} ></Input>
              </Form.Item><br />
              <Form.Item wrapperCol={{ offset: 3, span: 19 }} name="lcswsxDm" style={{ marginTop: -36 }} rules={[{ required: true}]}  initialValue={'LCSXA081039001'}>
                <Radio.Group disabled={flaggd == 1 ? false : true}>
                  <Radio key={'LCSXA081039001'} value={'LCSXA081039001'}>免退税申报</Radio>
                  <Radio key={'LCSXA081040001'} value={'LCSXA081040001'}>代办退税申报</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 5, span: 16 }} name="fkwj" rules={[{ required: flaggd == 2 ? true : false },]} style={{ width: '280px' }} valuePropName="fileList" getValueFromEvent={(e: any) => { if (Array.isArray(e)) { return e; } return e && e.fileList; }}>
                <Upload disabled={flaggd == 2 ? false : true} beforeUpload={beforeUpload} maxCount={1} showUploadList={true} accept=".xml">
                  <Button disabled={flaggd == 2 ? false : true} style={{ marginTop: '13px', width: '330px' }} icon={<FolderAddOutlined />}>请选择上传的文件</Button>
                  {/* <Space>
                    <Input disabled={flaggd == 2 ? false : true} style={{ marginTop: '5px', width: '320px' }} suffix={<FolderAddOutlined />}></Input> */}
                  {/* readOnly={true} */}
                  {/* </Space> */}
                </Upload>
              </Form.Item>
            </> :
            <>
              <Form.Item wrapperCol={{ offset: 5, span: 19 }} name="ssq" rules={[{ required: flaggd == 1 ? true : false },]} style={{ marginTop: -160 }}>
                <Input placeholder="请输入4位年度或6位所属期" disabled={flaggd == 1 ? false : true} style={{ width: '240px' }} ></Input>
              </Form.Item><br />
              <Form.Item wrapperCol={{ offset: 8, span: 16 }} name="fkwj" rules={[{ required: flaggd == 2 ? true : false },]} style={{ width: '280px' }} valuePropName="fileList" getValueFromEvent={(e: any) => { if (Array.isArray(e)) { return e; } return e && e.fileList; }}>
                <Upload disabled={flaggd == 2 ? false : true} beforeUpload={beforeUpload} maxCount={1} showUploadList={true} accept=".xml">
                  <Button disabled={flaggd == 2 ? false : true} style={{ marginTop: '5px', width: '240px' }} icon={<FolderAddOutlined />}>请选择上传的文件</Button>
                </Upload>
              </Form.Item>
            </>
          }
        </Form>
      </Modal>
      <Modal
        title="系统提示"
        centered
        destroyOnHidden
        visible={modalVisible2}
        width={CONSTANTS.C_MODAL_WIDTH_X3}
        onCancel={() => setModalVisible2(false)}
        footer={(
          <Fragment>
            <Button type="primary" onClick={save2}>继续</Button>
            <Button type="default" onClick={close2}>取消</Button>
          </Fragment>
        )}
      >
        <div style={{ fontSize: 15, marginBottom: 20 }}>以下报关单发生变化，若继续获取，系统将对发生变化的数据进行更新或删除操作（包括已归档的数据），是否继续？</div>
        <DDBaseGrid
          queryParam={queryParam}
          userDataSource={gridData}
          columns={columns}
          showSerialNumber
        />
      </Modal>
    </>
  );
};
export default Hqsbsj;
