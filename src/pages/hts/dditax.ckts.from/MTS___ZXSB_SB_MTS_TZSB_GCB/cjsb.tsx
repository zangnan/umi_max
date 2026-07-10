import React, { useState, useImperativeHandle, useEffect } from 'react';
import { Button, Form, Space, Input, message, Checkbox, Tooltip, Spin, Modal, Radio, AutoComplete, Select, Row, Col } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import baseValidator from '@/components/DDAssist/field/baseValidator';
import businessValidator from '@/pages/hts/common/field/businessValidator';
import DDBaseGrid from "@/components/DDBaseGrid";
import { commonInitJbxx, cjxxcx, plcj, checkSsqPcYsb } from '@/pages/hts/services/htsApi';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import myUtil from '@/components/DDAssist/util';


export interface DDInvoiceProps {
  onRef?: any;
  data?: any;
}

const Hgdzxzjy: React.FC<DDInvoiceProps> = ({
  onRef,
  data,
}) => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('请输入冲减发票号，多条数据以英文逗号隔开');
  const [selectionRowKeys, setSelectionRowKeys] = useState<any>([]);
  const [queryParam, setQueryParam] = useState<any>([]);
  const [refUnit, setUnitRef] = useState<any>();
  const [ywlxList, setYwlxList] = useState<any>(myUtil.code.getCode('code_dm_ckts_cktmsywlx:08'));
  const [hzcjyyList, setHzcjyyList] = useState<any>(myUtil.code.getCode('code_dm_ckts_hzcjyy:01'));
  //下载按钮是否显示
  const [masker, setMasker] = useState(false);



  // 开启
  const showModal = (param: any) => {
    const vParam = { tableKey: 'MTS_ZXSB_SB_MTS_TZSB_G', lcswsxDm: '' };
    setModalVisible(true);
    setUnitRef(param);
    setYwlxList(myUtil.code.getCode('code_dm_ckts_cktmsywlx:08'));
    setHzcjyyList(myUtil.code.getCode('code_dm_ckts_hzcjyy:01'));
    commonInitJbxx(vParam).then((response) => {
      setMasker(false);
      const {code, body} = response;
      if (code === '200') {
        form.setFieldsValue({ cjsjtj: 1, ssq:body.ssq,sbpc:body.sbpc,cktmsywlxdmjh:'HZCJ', cktmsywlxmcjh:'红字冲减', hzcjyyDm:null })
      }
    })
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });



  const handleSave = async () => {
    if(selectionRowKeys?.length == 0){
      message.info('请勾选数据进行操作！');
      return;
    }
    const formVal = await form.validateFields();
    formVal.ysbglhs = [...selectionRowKeys];
    await checkSsqPcYsb({
      ssq: formVal.ssq,
      sbpc: formVal.sbpc,
      tableKey: 'MTS_ZXSB_SB_MTS_TZSB_G'
    }).then((response) => {
      if(response.code == '200'){
        plcj(formVal).then((response) => {
          setMasker(false);
          const {code, msg} = response;
          if (code === '200') {
            close();
            refUnit.current.reload();
          }else{
            message.error(msg);
          }
        })
      }else{
        message.error(response.msg);
      }
    });
  }

  const close = () => {
    setModalVisible(false);
    setSelectionRowKeys([]);
    setQueryParam([]);
    form.resetFields();
  }

  const onSearch = (param: any) => {
    const p = {
      "cjsjtj": form.getFieldValue('cjsjtj'),
      "bgdhfph": param ,
      }
      
    setModalVisible(true);
    cjxxcx(p).then((response) => {
      setMasker(false);
      const {code, body,msg} = response;
      if (code === '200') {
        setQueryParam(body);
      }else{
        message.error(msg);
      }
    })
  }

  const onchange = (param: any) => {
    if (param.target.value == 1) {
      setInputText('请输入冲减发票号，多条数据以英文逗号隔开');
    } else {
      setInputText('请输入报关单号，多条数据以英文逗号隔开');
    }
  }


  let columns: any = [
    { title: '报关单号/发票号', dataIndex: 'bgdhfph', ellipsis: true },
    { title: '商品名称', dataIndex: 'spmc',  width: 220 ,ellipsis: true },
    { title: '原申报关联号', dataIndex: 'ysbglh', width: 180 },
  ];


  // 列选择
  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any[]) => {
      setSelectionRowKeys(selectedRowKeys);
    },
  };

  const ywlxDmOnChange = (value: any) => {
    const rows = [...ywlxList];
    const tempRows = rows.filter((row: any) => {
      return (row.code === value);
    });
    if (tempRows && tempRows.length > 0) {
      form.setFieldsValue({
        cktmsywlxmcjh: tempRows[0].name,
      });
    } else {
      form.setFieldsValue({
        cktmsywlxmcjh: null,
      });
    }
  }


  return (

    <Modal
      title='冲减申报'
      wrapClassName='standard-modal-1  dd-gpy'
      open={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      okText="生成冲减"
      cancelText="关闭"
      onCancel={close}
      onOk={handleSave}
      destroyOnHidden
      mask={{ closable: false }}
    >
      <Spin tip="Loading..." spinning={masker} delay={200}>
        <Form form={form}   labelAlign="right"  >
          <div style={{ backgroundColor: '#f1f4f7', padding: "0 10px", lineHeight: '32px', margin: '0 0 20px 0' }}>1、本次申报年月、批次、业务类型及备注</div>
          <Row>
            <Col span={8}>
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="申报年月" name="ssq" rules={[{ required: true, message: '该项内容为必填项不能为空！' }, baseValidator.yyyyMM(),]} >
                <Input placeholder="申报年月" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}  label="申报批次" name="sbpc" rules={[{ required: true, message: '' }, businessValidator.sbpc(form)]}>
                <Input placeholder="申报批次" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item  label="业务类型代码" name="cktmsywlxdmjh" rules={[{ required: true, message: '该项内容为必填项不能为空！' }]} >
                <AutoComplete onChange={ywlxDmOnChange}>
                  {ywlxList.map((item: any) => {
                    return <AutoComplete.Option key={item.code} value={item.code}>{`[${item.code}]     ${item.name}`}</AutoComplete.Option>
                  })}
                </AutoComplete>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="业务类型名称" name="cktmsywlxmcjh">
                <Input placeholder="业务类型名称" readOnly={true}/>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="红字冲减原因" name="hzcjyyDm" rules={[() => {
                const validator = async (_rule: any, value: any) => {
                  const cktmsywlxdmjh = form.getFieldValue('cktmsywlxdmjh');
                  if (cktmsywlxdmjh) {
                    if (cktmsywlxdmjh === 'HZCJ') {
                      if (!value) {
                        return Promise.reject(new Error('业务类型包含“HZCJ”时，红字冲减原因不能为空'));
                      }
                      return Promise.resolve();
                    } else {
                      if (value) {
                        return Promise.reject(new Error('业务类型不包括“HZCJ”时，红字冲减原因须为空'));
                      }
                      return Promise.resolve();
                    }
                  }
                  return Promise.reject();
                };
                return { validator };
                }]}>
                <Select allowClear={true} placeholder={'红字冲减原因'}>
                  {hzcjyyList.map((item: any) => {
                    return <Select.Option key={item.code} value={item.code}>{`${item.name}`}</Select.Option>
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item labelAlign="right"  label="备注" name="bz" rules={[baseValidator.range2({ min: 0, max: 200 })]} style={{marginLeft:60}}>
                <Input.TextArea placeholder="备注" autoSize={{ minRows: 2, maxRows: 2 }}/>
                </Form.Item>
              </Col>
          </Row>
          <div style={{ backgroundColor: '#f1f4f7', padding: "0 10px", lineHeight: '32px', margin: '0 0 20px 0' }}>2、选择冲减数据条件</div>
          <Form.Item name="cjsjtj" rules={[baseValidator.range2({ min: 0, max: 200 })]}>
            <Radio.Group onChange={onchange}>
              <Radio value={1}>按进项发票号冲减</Radio>
              <Radio value={2}>按报关单号冲减</Radio>
            </Radio.Group>
          </Form.Item>
          <Input.Search placeholder={inputText} onSearch={onSearch}  size="large" style={{ width: 550, marginBottom: 30 }}  enterButton="查询"/>
          <div style={{ backgroundColor: '#f1f4f7', padding: "0 10px", lineHeight: '32px', margin: '0 0 20px 0' }}>3、选择数据</div>
          <DDBaseGrid
            columns={columns}
            userDataSource={queryParam}
            // showSerialNumber
            pagination={false}
            rowKey='ysbglh'
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
          />
        </Form>
      </Spin>
    </Modal>

  );
};

export default Hgdzxzjy;
