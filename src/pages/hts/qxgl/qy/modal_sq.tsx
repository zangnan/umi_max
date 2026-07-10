/**
 * title: 用户管理-新增/修改用户
 * author: wx
 */
import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Modal, Button, Form, Spin, Input, Select, message, DatePicker } from 'antd';
import myUtil from '@/components/DDAssist/util';
import { saveOrUpdateYh, cxjslb, cxqxzlb, queryDmAdminDqSaas, getYhInfo, qysqForQxqygl } from '@/pages/hts/services/htsApi';
import moment from 'moment';

export interface BdjgProps {
  onRef?: any;
  yhlx?: any;
}

const ModalForm: React.FC<BdjgProps> = ({
  onRef, yhlx
}) => {
  const [yhlx2, setYhlx2] = useState<any>(yhlx);
  const [masker, setMasker] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectOption, setSelectOption] = useState<any>([]);
  const [selectJs, setSelectJs] = useState<any>([]);
  const [selectQxz, setSelectQxz] = useState<any>([]);
  const [name, setName] = useState<any>([]);
  const [yhsqCode2, setYhsqCode2] = useState<any>([]);
  const [initParam, setInitParam] = useState<any>({});
  const [queryDmAdminDq, setQueryDmAdminDq] = useState<any>([]);
  const [form] = Form.useForm();

  // 开启
  const showModal = async (param: any, record: any, name: any) => {
    setName(name);
    if (yhlx2 === '09') {
      const tmpCodeTable: any = await myUtil.code.getCodeFromServerT1('code_static_dm_gy_yhlx:02');
      setSelectOption(tmpCodeTable);
    } else {
      const tmpCodeTable: any = await myUtil.code.getCodeFromServerT1('code_static_dm_gy_yhlx:01');
      setSelectOption(tmpCodeTable);
    }
    const yhsqCode: any = await myUtil.code.getCodeFromServerT1('CODE_DM_ZXSB_SQZT:01');
    setYhsqCode2(yhsqCode);
    const q = record?.yxqq ? moment(new Date(Number(record?.yxqq))) :moment(new Date()) ;
    const z = record?.yxqz ? moment(new Date(Number(record?.yxqz))) :moment(new Date()) ;
    record.yxq = [q,z];
    form.setFieldsValue(record);

    // if (record?.yddh) {
    //   // record.yxq = [moment(new Date(Number(record?.yxqq))), moment(new Date(Number(record?.yxqz)))];
    //   await getYhInfo({ "yhuuid1Dqlb": record?.yhuuid1Dqlb }).then((res: any) => {
    //     const { code, msg, body } = res;
    //     if (code == '200') {
    //       if(body?.yxqq && body?.yxqz){
    //         body.yxq = [moment(new Date(Number(body?.yxqq))), moment(new Date(Number(body?.yxqz)))];
    //       }
    //     } else {
    //       message.error(msg)
    //     }
    //   });
    // } else {
    //   form.resetFields();
    // }
    setInitParam(param);
    setModalVisible(true);
    setMasker(true);
    await cxjslb({}).then((res: any) => {
      const { code, msg } = res;
      setMasker(false);
      if (code == '200') {
        setSelectJs(res.body);
      } else {
        message.error(msg)
      }
    });


    setMasker(true);
    await cxqxzlb({}).then((res: any) => {
      const { code, msg } = res;
      setMasker(false);
      if (code == '200') {
        setSelectQxz(res.body);
      } else {
        message.error(msg)
      }
    });

    setMasker(true);
    await queryDmAdminDqSaas({}).then((res: any) => {
      const { code, msg, body } = res;
      setMasker(false);
      if (code == '200') {
        setQueryDmAdminDq(body);
      } else {
        message.error(msg)
      }
    });

  };
  // 保存
  const save = () => {
    form.validateFields().then(values => {
      setMasker(true);
      const params = form.getFieldsValue(true);
      if ((yhlx2 === '13' || yhlx2 === '15') && name == "授权") {
        let yxqq = myUtil.grid.formatDate(params.yxq[0], 'YYYY-MM-DD');
        let yxqz = myUtil.grid.formatDate(params.yxq[1], 'YYYY-MM-DD');
        params.yxqq = yxqq;
        params.yxqz = yxqz;
      }
      // let yddh = params.yddh.trim();
      // params.yddh = yddh;
      if("授权" === name){
        qysqForQxqygl(params).then((res: any) => {
          const { code, msg } = res;
          setMasker(false);
          if (code == '200') {
            close();
            message.success("保存成功！");
          } else {
            message.error(msg)
          }
        });
      }else{
        saveOrUpdateYh(params).then((res: any) => {
          const { code, msg } = res;
          setMasker(false);
          if (code == '200') {
            close();
            message.success("保存成功！");
          } else {
            message.error(msg)
          }
        });
      }
    })
  };

  const close = () => {
    setModalVisible(false);
    form.setFieldsValue({});
    initParam?.refUnit.current?.reload();
  };


  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Modal
      title={name}
      open={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X1}
      onCancel={() => close()}
      footer={(<>
        <Button onClick={() => save()} type="primary">保存</Button>
        <Button onClick={() => close()} type="default">关闭</Button>
      </>)}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <Form
          form={form}
          name="form"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
        >
          {name != '授权' ?
          <Form.Item name="sbqyuuidDqlb" label="登录账号" hidden ={true}>
            <Input/>
          </Form.Item>: <></>}
          {name != '授权' ?
            <Form.Item name="yddh" label="登录账号" rules={[{ required: true, message: '请录入登录账号' }]}>
              {
                name == '修改' ? <Input placeholder="请录入登录账号" maxLength={20} disabled={true} /> : <Input placeholder="请录入登录账号" maxLength={20} />
              }
            </Form.Item> : <></>}
          {name != '授权' ?
            <Form.Item name="dlmm" label="登录密码" rules={[{ required: true, message: '请录入登录密码' }]}>
              <Input.Password placeholder="请录入登录密码" maxLength={100} />
            </Form.Item> : <></>
          }
          {name != '授权' ?
            <Form.Item name="xm" label="姓名" rules={[{ required: true, message: '请录入姓名' }]}>
              <Input placeholder="请录入姓名" maxLength={50} />
            </Form.Item> : <></>}
          {name != '授权' ?
            <Form.Item name="sfzjhm" label="证件号码">
              <Input placeholder="请录入证件号码" maxLength={30} />
            </Form.Item> : <></>}

          {yhlx2 == '11' || yhlx2 == '09' ?
            <Form.Item name="yhlxDm" label="用户类型" rules={[{ required: true, message: '请选择用户类型' }]} >
              {
                name == '修改' ?
                  <Select placeholder="请选择用户类型" disabled>
                    {selectOption.map((item: any) => (
                      <Select.Option key={item.code} value={item.code} >{item.name}</Select.Option>
                    ))}
                  </Select> :
                  <Select placeholder="请选择用户类型">
                    {selectOption.map((item: any) => (
                      <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                    ))}
                  </Select>
              }
            </Form.Item> : <></>}
          {yhlx2 == '11' || yhlx2 == '13' && name != '授权' ?
            <Form.Item name="jsDm" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
              <Select placeholder="请选择角色">
                {selectJs?.map((item: any) => (
                  <Select.Option key={item.jsDm} value={item.jsDm}>{item.jsmc}</Select.Option>
                ))}
              </Select>
            </Form.Item> : <></>}
          {yhlx2 == '11' || yhlx2 == '13' && name != '授权' ?
            <Form.Item name="qxzDm" label="用户版本" rules={[{ required: true, message: '请选择用户版本' }]}>
              <Select placeholder="请选择用户版本">
                {selectQxz?.map((item: any) => (
                  <Select.Option key={item.qxzDm} value={item.qxzDm}>{item.qxzmc}</Select.Option>
                ))}
              </Select>
            </Form.Item> : <></>}
          {yhlx2 == '11' || yhlx2 == '13' && name != '授权' ?
            <Form.Item name="ssdq1s" label="企业所属地区" rules={[{ required: true, message: '请选择企业所属地区' }]} >
              <Select placeholder="请选择企业所属地区" mode="multiple" allowClear maxTagCount={3}>
                {queryDmAdminDq?.map((item: any) => (
                  <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                ))}
              </Select>
            </Form.Item> : <></>}
          {(yhlx2 === '13' || yhlx2 === '15') && name == '授权' ?
            <Form.Item name="sqztDm" label="用户授权" rules={[{ required: true, message: '请选择用户授权' }]}>
              <Select placeholder="请选择用户授权">
                {yhsqCode2?.map((item: any) => (
                  <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                ))}
              </Select>
            </Form.Item> : <></>}
          {(yhlx2 === '13' || yhlx2 === '15') && name == '授权' ?
            <Form.Item name="yxq" label="授权日期" rules={[{ required: true, message: '请输入授权日期' }]}>
              <DatePicker.RangePicker format={myUtil.date.formatList()} placeholder={['授权日期起', '授权日期日期止']} />
            </Form.Item> : <></>}
        </Form>
      </Spin>
    </Modal>
  );
};

export default ModalForm;
