/**
 * title: 智能配单明细-报关单明细
 * author: yxy
 */
import React, { useImperativeHandle, useState, useEffect } from 'react';
import pro from '@/pages/common/proConfig';
import {Spin, Drawer, Form, Row, Col, Input, InputNumber, message} from 'antd';
import myUtil from '@/pages/common/myUtil';
import { queryZnpdmxCkbgdMxInfo } from '@/services/hts/api';


export interface CkbgdmxProps {
  onRef?: any;
}

const ModalCkbgdmx: React.FC<CkbgdmxProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [masker, setMasker] = useState<boolean>(false);
  const [bgdmxForm] = Form.useForm();

  // 开启
  const showModal = (params: any) => {
    setModalVisible(true);
    setMasker(true);
    queryZnpdmxCkbgdMxInfo(params).then((response) => {
      setMasker(false);
      const {code ,body , desc} = response;
      if (code === '200') {
        body.ljDate = myUtil.grid.formatDate(body.ljDate, 'YYYY-MM-DD');
        bgdmxForm.setFieldsValue(body);
      } else {
        message.error(desc);
      }
    })
  };

  // 表单布局
  const layout = {
    labelCol: { span: 9 },
    wrapperCol: { span: 13 },
  };


  useEffect(() => {
  }, []);

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  const initValues = () => {
    return {}; // ..............
  }

  return (
    <>
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <Drawer
        title={'关单详情'}
        visible={modalVisible}
        width={pro.c_modal_width_x3}
        onClose={() => { setModalVisible(false) }}
        className="dd_data_page_modal"
        destroyOnClose={true}
        maskClosable={false}
      >
        <div className="dd-form">
          <Form form={bgdmxForm} initialValues={initValues()}>
            <Row style={{marginTop: 26}}>
              <Col span={2}></Col>
              <Col span={10}><Form.Item name="bgdNo" label="报关单号" {...layout}><Input readOnly={true} disabled={true}/></Form.Item></Col>
              <Col span={10}><Form.Item name="spxh" label="项号" {...layout}><Input readOnly={true} disabled={true}/></Form.Item></Col>
              <Col span={2}></Col>
            </Row>

            <Row>
              <Col span={2}></Col>
              <Col span={10}><Form.Item name="tyNo" label="统一编号" {...layout}><Input readOnly={true} disabled={true}/></Form.Item></Col>
              <Col span={10}><Form.Item name="kacode" label="口岸代码" {...layout}><Input readOnly={true} disabled={true}/></Form.Item></Col>
              <Col span={2}></Col>
            </Row>
            <Row>
              <Col span={2}></Col>
              <Col span={10}><Form.Item name="kaname" label="出口口岸" {...layout}><Input readOnly={true} disabled={true}/></Form.Item></Col>
              <Col span={10}><Form.Item name="hgdjcNo" label="海关登记册" {...layout}><Input readOnly={true} disabled={true}/></Form.Item></Col>
              <Col span={2}></Col>
            </Row>
            <Row>
              <Col span={2}></Col>
              <Col span={10}><Form.Item name="ydNo" label="提运单号" {...layout}><Input readOnly={true} disabled={true}/></Form.Item></Col>
              <Col span={10}><Form.Item name="htNo" label="合同号" {...layout}><Input readOnly={true} disabled={true}/></Form.Item></Col>
              <Col span={2}></Col>
            </Row>
            <Row>
              <Col span={2}></Col>
              <Col span={10}><Form.Item name="hxdNo" label="核销单号" {...layout}><Input readOnly={true} disabled={true}/></Form.Item></Col>
              <Col span={10}><Form.Item name="ljDate" label="出口日期" {...layout}><Input readOnly={true} disabled={true}/></Form.Item></Col>
              <Col span={2}></Col>
            </Row>
            <Row>
              <Col span={2}></Col>
              <Col span={10}><Form.Item name="jnhydname" label="境内货源地" {...layout}><Input readOnly={true} disabled={true}/></Form.Item></Col>
              <Col span={10}><Form.Item name="jhType" label="结汇方式" {...layout}><Input readOnly={true} disabled={true}/></Form.Item></Col>
              <Col span={2}></Col>
            </Row>
            <Row>
              <Col span={2}></Col>
              <Col span={10}><Form.Item name="xkzNo" label="许可证号" {...layout}><Input readOnly={true} disabled={true}/></Form.Item></Col>
              <Col span={10}><Form.Item name="zmxzname" label="征免性质" {...layout}><Input readOnly={true} disabled={true}/></Form.Item></Col>
              <Col span={2}></Col>
            </Row>
            <Row>
              <Col span={2}></Col>
              <Col span={10}><Form.Item name="ydgname" label="抵运国" {...layout}><Input readOnly={true} disabled={true}/></Form.Item></Col>
              <Col span={10}><Form.Item name="mddname" label="目的地" {...layout}><Input readOnly={true} disabled={true}/></Form.Item></Col>
              <Col span={2}></Col>
            </Row>
            <Row>
              <Col span={2}></Col>
              <Col span={10}><Form.Item name="zmType" label="征免方式" {...layout}><Input readOnly={true} disabled={true}/></Form.Item></Col>
              <Col span={10}><Form.Item name="ybPrice" label="单价" {...layout}><InputNumber readOnly={true} disabled={true} formatter={value =>myUtil.text.formatNum(value, '0,0.00')}/></Form.Item></Col>
              <Col span={2}></Col>
            </Row>
            <Row>
              <Col span={2}></Col>
              <Col span={10}><Form.Item name="cmcode" label="商品代码" {...layout}><Input readOnly={true} disabled={true}/></Form.Item></Col>
              <Col span={10}><Form.Item name="cmname" label="商品名称" {...layout}><Input readOnly={true} disabled={true}/></Form.Item></Col>
              <Col span={2}></Col>
            </Row>
            <Row>
              <Col span={2}></Col>
              <Col span={10}><Form.Item name="hgcmcode" label="下载商品代码" {...layout}><Input readOnly={true} disabled={true}/></Form.Item></Col>
              <Col span={10}><Form.Item name="hgcmname" label="下载商品名称" {...layout}><Input readOnly={true} disabled={true}/></Form.Item></Col>
              <Col span={2}></Col>
            </Row>
            <Row>
              <Col span={2}></Col>
              <Col span={10}><Form.Item name="fdUnit" label="法定单位" {...layout}><Input readOnly={true} disabled={true}/></Form.Item></Col>
              <Col span={10}><Form.Item name="fdQnt" label="法定单位数量" {...layout}><InputNumber readOnly={true} disabled={true} formatter={value =>myUtil.text.formatNum(value, '0,0.00000')}/></Form.Item></Col>
              <Col span={2}></Col>
            </Row>
            <Row>
              <Col span={2}></Col>
              <Col span={10}><Form.Item name="fd2Unit" label="第二单位" {...layout}><Input readOnly={true} disabled={true}/></Form.Item></Col>
              <Col span={10}><Form.Item name="fd2Qnt" label="第二单位数量" {...layout}><InputNumber readOnly={true} disabled={true} formatter={value =>myUtil.text.formatNum(value, '0,0.00000')}/></Form.Item></Col>
              <Col span={2}></Col>
            </Row>
            <Row>
              <Col span={2}></Col>
              <Col span={10}><Form.Item name="cjUnit" label="成交单位" {...layout}><Input readOnly={true} disabled={true}/></Form.Item></Col>
              <Col span={10}><Form.Item name="cjQnt" label="成交单位数量" {...layout}><InputNumber readOnly={true} disabled={true} formatter={value =>myUtil.text.formatNum(value, '0,0.00000')}/></Form.Item></Col>
              <Col span={2}></Col>
            </Row>
            <Row>
              <Col span={2}></Col>
              <Col span={10}><Form.Item name="cjType" label="成交方式" {...layout}><Input readOnly={true} disabled={true}/></Form.Item></Col>
              <Col span={10}><Form.Item name="ybBz" label="成交币制" {...layout}><Input readOnly={true} disabled={true}/></Form.Item></Col>
              <Col span={2}></Col>
            </Row>
          </Form>
        </div>
      </Drawer>
      </Spin>
    </>
  );
};

export default ModalCkbgdmx;
