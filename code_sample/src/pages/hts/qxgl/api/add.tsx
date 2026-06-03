/**
 * title: 用户管理-新增/修改用户
 * author: wx
 */
import React, {useImperativeHandle, useState} from 'react';
import pro from '@/pages/common/proConfig';
import { Modal, Button, Form, Spin, Input, Radio, message, Select } from 'antd';
import myUtil from '@/pages/common/myUtil';
import { saveOrUpdateApifw, checkApifwDm, getApifwxx} from '@/services/hts/api';


export interface BdjgProps {
  onRef?: any;
}

const ModalForm: React.FC<BdjgProps> = ({
                                          onRef,
                                        }) => {
  const [masker, setMasker] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectOption, setSelectOption] = useState<any>([]);
  const [yzjdbz, setYzjdbz] = useState<boolean>(true);
  const [flag, setFlag] = useState<any>();
  const [name, setName] = useState<any>([]);
  const [initParam, setInitParam] = useState<any>({});
  const [form] = Form.useForm();


  // 开启
  const showModal = async (param: any, flag: any) => {

    Promise.all([myUtil.code.getCodeFromServerT1('CODE_DM_ZXSB_APIFW', '01')]).then(() => {
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      const temp = myUtil.code.getCode('CODE_DM_ZXSB_APIFW', '01');
      setSelectOption(temp);
    });

    setInitParam(param);
    setModalVisible(true);
    if ("edit" == flag) {
      setFlag(true);
      setName("编辑");
      const {selectionRows} = param;
      setMasker(true);
      getApifwxx(selectionRows[0]).then((res: any) => {
        setMasker(false);
        const {code, msg, body} = res;
        if (code == '200') {
          body['uuid'] = body['apifwDm'];
          form.setFieldsValue(body);
        } else {
          message.error(msg)
        }
      });
    } else {
      setFlag(false);
      setYzjdbz(true);
      setName("新建");
    }
  };
  // 保存
  const save = () => {
    form.validateFields().then(values => {
      let param = {...values};
      param.yxbz = param.yxbz == undefined ? "Y" : param.yxbz;
      if (param.yzjdbz == 'Y' && !param?.qqdz) {
        message.error('叶子节点标志为Y，请求地址不能为空');
        return;
      }
      setMasker(true);
      checkApifwDm(param).then((res: any) => {
        setMasker(false);
        const {code, msg} = res;
        if (code == '200') {
          setMasker(true);
          saveOrUpdateApifw(param).then((res1: any) => {
            const {code, msg} = res1;
            setMasker(false);
            if (code == '200') {
              close();
              message.success("保存成功！");
            } else {
              message.error(msg)
            }
          })
        } else {
          message.error(msg)
        }
      });

    })
  };

  const close = () => {
    setModalVisible(false);
    form.setFieldsValue({"uuid": "", "apifwDm": "", "apifwmc": "", "yzjdbz": "Y", "sjapifwDm": "", "qqdz":"","yxbz": "Y", "xybz": "Y"});
    initParam?.unitRef.current?.reload2();
  };


  const yzjdbzOnchange = (param: any) => {
    if (param.target.value == 'Y') {
      setYzjdbz(true);
    } else {
      setYzjdbz(false);
    }
  }

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });


  return (
    <Modal
      title={name}
      visible={modalVisible}
      width={pro.c_modal_width_x2}
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
          labelCol={{span: 6}}
          wrapperCol={{span: 16}}
        >
          <Form.Item name="uuid" label="uuid" initialValue={''} hidden={true}>
            <Input placeholder="uuid"/>
          </Form.Item>
          <Form.Item name="apifwDm" label="API服务代码" rules={[{required: true, message: '请录入API服务代码'}]}>
            <Input placeholder="请录入API服务代码" maxLength={10}/>
          </Form.Item>
          <Form.Item name="apifwmc" label="API服务名称" rules={[{required: true, message: '请录入API服务名称'}]}>
            <Input placeholder="请录入API服务名称" maxLength={10}/>
          </Form.Item>
          <Form.Item name="sjapifwDm" label="上级API服务代码" rules={[{required: yzjdbz, message: '请录入上级API服务代码'}]}>
            <Select placeholder="请选择上级API服务代码" showSearch allowClear>
              {selectOption.map((item: any) => (
                <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="qqdz" label="API请求地址" rules={[{required: false, message: '例：v1/saas/oauth/saasTestCx'}]}>
            <Input placeholder="请录入API请求地址,例：v1/saas/oauth/saasTestCx" maxLength={4000}/>
          </Form.Item>
          <Form.Item name="yzjdbz" label="叶子节点标志" initialValue={"Y"}>
            <Radio.Group onChange={yzjdbzOnchange}>
              <Radio value='Y'>是</Radio>
              <Radio value='N'>否</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="yxbz" label="启用标志" initialValue={"Y"}>
            <Radio.Group>
              <Radio value='Y'>是</Radio>
              <Radio value='N'>否</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="xybz" label="选用标志" initialValue={"Y"}>
            <Radio.Group>
              <Radio value='Y'>是</Radio>
              <Radio value='N'>否</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ModalForm;
