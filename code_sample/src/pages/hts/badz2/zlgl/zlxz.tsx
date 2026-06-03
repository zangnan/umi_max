// 资料下载
import React, { useImperativeHandle, useState } from 'react';
import { Modal, Button, Form, Spin, Input, Radio, Checkbox, Select, message, Row, Col } from 'antd';
import pro from '@/pages/common/proConfig';
import './style.less';
import myUtil from '@/pages/common/myUtil';
import cktsUtil from '@/pages/common/cktsUtil';
import { queryBadzepz } from '@/services/hts/api';
import { request } from 'umi';
export interface DDTsort {
  onRef?: any;
  visible?: any;
}

const Zlxz: React.FC<DDTsort> = ({ onRef, visible = false }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [form] = Form.useForm();
  const [masker, setMasker] = useState<boolean>(false);
  const [xzfwItem, setXzfwItem] = useState<any>({
    title: '报关单号',
    placeholder: '请您输入报关单号，多条数据以英文;隔开',
  });
  const [gridData, setGridData] = useState<any>([]);
  const [selectedRadio, setSelectedRadio] = useState<string>('01');
  const qylx = myUtil.sys.enterpriseType();
  // 开启
  const showModal = (param: any) => {
    setModalVisible(true);
    queryBadzepz({}).then((res: any) => {
      setMasker(false);
      // console.log(res.body);
      if (res.code == '200') {
        setGridData(res.body);
        // console.log(gridData);
        const items = res.body
          .filter((item: { xybz: string }) => item.xybz === 'Y')
          .map((item: { dzlxDm: any }) => item.dzlxDm);
        items.push('09');
        form.setFieldsValue({
          xzlxArray: items,
        });
      } else {
        message.error(res.desc);
      }
    });
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 保存
  const save = async () => {
    form.validateFields().then(async (formValues: any) => {
      setMasker(true);
      // await cktsUtil.downloadFilePost("/yw/badze/gdzlk/downloadBadzfj", formValues);
      await downloadFile(`${API_URL_BASE}/yw/badze/gdzlk/downloadBadzfj`,formValues);
      setMasker(false);
      setModalVisible(false);
    })
  };

  const downloadFile = async (url: string, formValues: any) => {
    try {
      const response = await request(url, {
        method: 'POST',
        data: formValues
      });
      if (response?.code === '200') {
        const wjm = response?.body?.wjm;
        const wjlj = response?.body?.wjlj;
        myUtil.file.downloadFileByPath(wjlj, wjm);
      } else {
        message.error(response?.msg);
      }
      // // 👉 从 headers 获取 Content-Disposition
      // const disposition = response.response.headers.get('content-disposition');
      // let filename = '下载文件.zip';
      // if (disposition && disposition.includes('filename=')) {
      //   filename = decodeURIComponent(disposition.split('filename=')[1]);
      // }
      //
      // // 👉 创建下载链接
      // const blob = new Blob([response.data]);
      // const link = document.createElement('a');
      // link.href = window.URL.createObjectURL(blob);
      // link.download = filename;
      // link.click();
      // window.URL.revokeObjectURL(link.href); // 清理
    } catch (err) {
      console.error('下载失败', err);
    }
  };

  // 下载数据范围改变触发
  const radioChange = (e: any) => {
    const value = e.target.value;
    setSelectedRadio(value);
    const temp = { ...xzfwItem };
    if ('01' === value) {
      temp.title = '报关单号';
      temp.placeholder = '请您输入报关单号，多条数据以英文;隔开';
    }
    if ('02' === value) {
      temp.title = '所属期批次';
      temp.placeholder = '请您输入9位所属期批次，例202312001';
    }
    if ('03' === value) {
      temp.title = '出口发票号';
      temp.placeholder = '请您输入出口发票号，多条数据以英文;隔开';
    }
    if ('05' === value) {
      temp.title = '出口合同号';
      temp.placeholder = '请您输入出口合同号，多条数据以英文;隔开';
    }
    setXzfwItem(temp);
  };

  // 组件偏移量
  const wrapperCol = { offset: 3, span: 22 };

  // 下载资料类型复选框类型
  const checkboxItem = gridData
    .filter((item: { xybz: string }) => item.xybz === 'Y') // 只保留 xybz 为 "Y" 的数据
    .map((item: { dzlxDm: any; dzlxmc: any }) => ({
      code: item.dzlxDm,
      name: item.dzlxmc,
    }));
  // 默认备案单证目录
  checkboxItem.push({
    code: '09',
    name: '备案单证目录',
  });
  const getSelectOptions = () => {
    const qylx = myUtil.sys.enterpriseType(); // 企业类型
    if ('WM' == qylx) {
      return [
        { value: 'LCSXA081039001', label: '出口货物劳务免退税申报' },
        { value: 'LCSXA081040001', label: '外贸综合服务企业代办退税申报' },
      ];
    } else if ('SC' == qylx) {
      return [{ value: 'LCSXA081038001', label: '出口货物劳务免抵退申报' }];
    }
    return [];
  };

  return (
    <Modal
      title="资料下载"
      destroyOnClose={true}
      centered
      visible={modalVisible}
      width={pro.c_modal_width_x2}
      footer={
        <>
          <Button onClick={() => setModalVisible(false)}>取消</Button>
          <Button onClick={save} type="primary">
            下载
          </Button>
        </>
      }
      onCancel={() => setModalVisible(false)}
      className={`${masker ? 'dd_modal_show_masker' : ''}`}
      maskClosable={false}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <div style={{ padding: '20px' }}>
          <Form form={form} name="zlxz_form">
            <div className="zlxzTitle">1、选择下载业务事项</div>
            <Form.Item
              label="业务事项"
              style={{ marginBottom: '10px' }}
              labelCol={{ span: 6 }}
              name="lcswsxDm"
              rules={[{ required: true, message: `请选择业务事项` }]}
            >
              <Select placeholder="请选择业务事项">
                {getSelectOptions().map((item: any) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <div className="zlxzTitle">2、选择下载数据范围</div>
            <Form.Item
              style={{ marginBottom: '10px' }}
              wrapperCol={wrapperCol}
              name="xzlx"
              initialValue={'01'}
            >
              <Radio.Group onChange={radioChange}>
                <Radio value="01">按报关单号下载</Radio>
                <Radio value="02">按所属期批次下载</Radio>
                <Radio value="03">按出口发票号下载</Radio>
                {qylx == 'WM' ? (
                  <>
                    <Radio value="04">按照供货商下载</Radio>
                  </>
                ) : (
                  <></>
                )}
                <Radio value="05">按出口合同号下载</Radio>
              </Radio.Group>
            </Form.Item>
            {selectedRadio === '04' ? (
              <>
                <Row gutter={16} style={{ marginLeft: '80px' }}>
                  <Col span={12}>
                    <Form.Item
                      name="ssqSbpc"
                      dependencies={['xzlx']}
                      rules={[{ required: true, message: `请输入所属期批次` }]}
                    >
                      <Input placeholder="请您输入9位所属期批次，例202312001" />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item
                      name="ghfnsrsbh"
                      dependencies={['xzlx']}
                      rules={[{ required: true, message: `请输入供应商税号` }]}
                    >
                      <Input placeholder="请输入供应商税号" />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            ) : (
              <Form.Item
                wrapperCol={wrapperCol}
                name="value"
                dependencies={['xzlx']}
                rules={[{ required: true, message: `请输入${xzfwItem.title}` }]}
              >
                <Input placeholder={xzfwItem.placeholder} />
              </Form.Item>
            )}
            <div style={{ color: 'red',paddingLeft:'80px' }}>温馨提示：按所属期批次备案时，无对应报关单关系，将下载所属期批次下的所有单证</div>
            <div className="zlxzTitle">3、选择下载资料类型</div>
            <Form.Item
              wrapperCol={wrapperCol}
              name="xzlxArray"
              rules={[{ required: true, message: `请选择下载资料类型` }]}
            >
              <Checkbox.Group name="xzlxArray">
                {checkboxItem.map((item: any) => (
                  <Checkbox
                    style={{ marginLeft: '0px', marginBottom: '10px', width: '180px' }}
                    key={item.code}
                    value={item.code}
                  >
                    {item.name}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </div>
      </Spin>
    </Modal>
  );
};

export default Zlxz;
