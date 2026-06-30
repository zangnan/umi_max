/**
 * 台账配单明细-自动配单
 */
import React, { useImperativeHandle, useState } from 'react';
import { Button, DatePicker, Spin, Modal, Form, Checkbox, message, } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import myUtil from '@/components/DDAssist/util';
import { tssbTzpdZdpd } from '@/pages/hts/services/htsApi';
import moment from 'moment';
import DDAlert from '@/pages/hts/components/DDAlert';
import { useIntl } from 'umi';
import { history } from 'umi';




export interface AbgdBjProps {
  onRef?: any;
}

const ModelZdpd: React.FC<AbgdBjProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [formZdpd] = Form.useForm();
  const [masker, setMasker] = useState<boolean>(false); //
  const intl = useIntl();
  const [pdBgdts, setPdBgdts] = useState<any>(0); // 参与配单的报关单条数
  const [bgdSxtj, setBgdSxtj] = useState<any>([]);  // 参与配单的台账筛选条件

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

   //开启
  const showModal = (unitRef: any, params: any) => {
    setPdBgdts(params.bgdts);
    setBgdSxtj(params.sxtj);
    formZdpd.setFieldsValue({ckrq1: [],pdgz:['SPMC', 'DW', 'SL'], jhxfzzszyfpbz: 'N'});
    setModalVisible(true);

  };

  const options = [
    { label: '商品名称校验', value: 'SPMC' },
    { label: '单位校验', value: 'DW' },
    { label: '数量校验', value: 'SL' },
  ];

  // 自动配单
  const handlerZdpd = () => {
    formZdpd.validateFields().then((values: any) => {
      const params = {
        // ckrq1Q: moment(values.ckrq1[0]).format('yyyy-MM-DD'),
        // ckrq1Z: moment(values.ckrq1[1]).format('yyyy-MM-DD'),
        pdgz: values.pdgz,
        jhxfzzszyfpbz: values.jhxfzzszyfpbz,
        pdsxtj : bgdSxtj,
        pdbgdts : pdBgdts
      }
      setMasker(true);
      tssbTzpdZdpd(params).then(async (res) => {
        setMasker(false);
        const {code, desc} = res;
        if (code === '200') {
          setModalVisible(false);
          DDAlert.open({
            title: '任务情况',
            info: intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_info' }),
            infoType: 'success',
            content: ['可在配单任务管理菜单查询任务情况'],
            okText: '转配单任务管理',
            okCallbackFn: function () {
              history.push('/26/2604/260405/26040502');
            },
          });
        } else {
          message.error(desc);
        }
      });
    });
  }

  // 勾选发票状态
  const handlerJhxxChange = (param: any) => {
    if(param.target.checked){
      formZdpd.setFieldsValue({jhxfzzszyfpbz: 'Y'});
    }else{
      formZdpd.setFieldsValue({jhxfzzszyfpbz: 'N'});
    }
  }

  return (
      <Modal
        title="自动配单"
        destroyOnHidden={true}
        visible={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X1}
        mask={{ closable: false }}
        footer={
          <>
            <Button onClick={() => setModalVisible(false)}>取消</Button>
            <Button onClick={handlerZdpd} type="primary">确定</Button>
          </>
        }
        onCancel={() => setModalVisible(false)}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <Form
            form={formZdpd}
            name="form"
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
          >
            <div style={{ color: '#E51C23',marginLeft:'40px',width:'325px' }}>
              <p>本次配单涉及报关单{pdBgdts}条</p>
            </div>
            {/* <Form.Item label="出口日期" labelCol={{ span: 6 }} name='ckrq1' key="1" rules={[{ required: true, message: '请选择出口日期' },
                      () => ({
                        validator(_, value) {
                          if (value.length === 2) {
                            if (moment(value[0]).format('yyyy') != moment(value[1]).format('yyyy')) {
                              return Promise.reject(new Error('出口日期不可跨年'));
                            }
                            return Promise.resolve();
                          }
                          return Promise.resolve();
                        },
                      })
                    ]} >
                    <DatePicker.RangePicker style={{ width: 260 }}
                      allowClear={false}
                      format={myUtil.date.formatList()}
                    />
                  </Form.Item> */}
                  <Form.Item label="配单规则" labelCol={{ span: 6 }}  name='pdgz'
                    rules={[
                        () => ({
                          validator(_, value) {
                            if (value.length > 0 && value.includes('SL') && !value.includes('DW')) {
                                return Promise.reject(new Error('勾选数量校验时，请同步勾选单位校验'));
                            }
                            return Promise.resolve();
                          },
                        })
                      ]}
                      >
                    <Checkbox.Group options={options} style={{ width: '100%',display: 'grid',marginTop:'5px' }}/>
                    </Form.Item>
                  <Form.Item label="发票状态" labelCol={{ span: 6 }} name='jhxfzzszyfpbz' key="4">
                      <Checkbox onChange={handlerJhxxChange}>需要稽核信息</Checkbox>
                    </Form.Item>
                    <div style={{ color: '#E51C23',marginLeft:'40px',width:'325px' }}>
                      <p>说明：系统将提取每条报关单对应的全部台账信息，完整参与配单计算，保障数据无遗漏</p>
                    </div>
          </Form>
        </Spin>
      </Modal>
  );
};

export default ModelZdpd;
