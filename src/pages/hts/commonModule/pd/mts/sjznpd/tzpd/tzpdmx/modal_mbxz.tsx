/**
 * 按报关单开具  编辑开票
 */
import React, { useImperativeHandle, useState } from 'react';
import { Button, DatePicker, Spin, Modal, Form, Radio, Space, Input, message, } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import myUtil from '@/components/DDAssist/util';
import { tssbTzpdMbxz } from '@/pages/hts/services/htsApi';
import moment from 'moment';




export interface AbgdBjProps {
  onRef?: any;
}

const ModelMbxz: React.FC<AbgdBjProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [formMbxz] = Form.useForm();
  const [masker, setMasker] = useState<boolean>(false); //
  const [ckrqkybz, setCkrqkybz] = useState<boolean>(true);


  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

   //开启
  const showModal = (unitRef: any) => {
    formMbxz.setFieldsValue({xzlx: '1', ckrq: []});
    setModalVisible(true);

  };

  // 下载模板
  const handlerMbxz = () => {
    formMbxz.validateFields().then((values: any) => {
      const params: any = {
        key: 'CKTS_MTS_TZPD_TZPDMX_MBDC',
        sfScsm: 'Y'
      }
      const xzlx = values.xzlx;
      if (xzlx === '3') {
        params.sfBhsj = 'N';
      } else {
        params.sfBhsj = 'Y';
      }
      const searchModel = [];
      if (xzlx === '2') {
        searchModel.push({property: 'ckrq1Q', value: moment(values.ckrq[0]).format('yyyy-MM-DD'), op: 'zdy'});
        searchModel.push({property: 'ckrq1Z', value: moment(values.ckrq[1]).format('yyyy-MM-DD'), op: 'zdy'});
      }
      params.searchModel = searchModel;
      params.orderModel = [];
      setMasker(true);
      tssbTzpdMbxz(params).then(async (res) => {
        const {code, body, desc} = res;
        if (code === '200') {
          const { blob, fileName } = body;
          myUtil.file.downloadExcel(blob, fileName);
          setMasker(false);
          setModalVisible(false);
        } else {
          setMasker(false);
          message.error(desc);
        }
      });
    });
  }

  // 修改下载报关单类型
  const handlerxzlxChange = (e: any) => {
    const val = e?.target?.value;
    if (val === '1' || val === '3') {
      formMbxz.setFieldsValue({xzlx: val, ckrq: []});
      setCkrqkybz(true);
    } else {
      setCkrqkybz(false);
    }
  }

  return (
      <Modal
        title="模板下载"
        destroyOnHidden={true}
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X1}
        mask={{ closable: false }}
        footer={
          <>
            <Button onClick={() => setModalVisible(false)}>取消</Button>
            <Button onClick={handlerMbxz} type="primary">确定</Button>
          </>
        }
        onCancel={() => setModalVisible(false)}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <Form
            form={formMbxz}
            name="form"
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
        >
          <Form.Item name="xzlx">
            <Radio.Group  onChange={handlerxzlxChange}>
              <Space direction="vertical">
                <br/>
                <Radio key={'wpd'} value={'1'} >所有未配单的报关单<br/><br/></Radio>
                <Radio key={'zdpd'} value={'2'}>指定未配单的报关单<br/><br/>
                  <Form.Item name='ckrq' key="4" rules={[
                    () => ({
                      validator(_, value) {
                        const {xzlx} = formMbxz.getFieldsValue();
                        if (xzlx === '2') {
                          if(value.length > 0){
                            return Promise.resolve();
                          }else{
                            return Promise.reject(new Error('请选择出口日期范围'));
                          }
                        }
                        return Promise.resolve();
                      },
                    })
                  ]} >
                    <DatePicker.RangePicker style={{ width: 360 }}
                      allowClear={false}
                      placeholder={['出口日期起', '出口日期止']}
                      format={myUtil.date.formatList()}
                      disabled={ckrqkybz}
                    />
                  </Form.Item>
                </Radio>
                <Radio key={'kmb'} value={'3'} >下载空模板<br/><br/></Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Form>
        </Spin>
      </Modal>
  );
};

export default ModelMbxz;
