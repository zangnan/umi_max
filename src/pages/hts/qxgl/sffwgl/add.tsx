// 生成进货
import React, {useImperativeHandle, useState} from 'react';
import { Button, Col, Form, Input, message, Modal, Row, Spin, Switch, TreeSelect} from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import '@/pages/hts/commonModule/style.less';
import {sffwglSaveOrUpdateSffw } from '@/pages/hts/services/htsApi';
import {TreeNodeProps} from 'rc-tree-select/lib/TreeNode';
import baseValidator from '@/components/DDAssist/field/baseValidator';

export interface DDTsort {
  onRef?: any;
  visible?: any;
  yhlx?: any;
}

const Add: React.FC<DDTsort> = ({onRef, visible = false, yhlx}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [form] = Form.useForm();
  const [masker, setMasker] = useState<boolean>(false);
  const [title, setTitle] = useState('新增');
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [mainRef, setMainRef] = useState<any>({}); //主页面的ref
  //有效标志
  const [yxbzCheck, setYxbzCheck] = useState<boolean>(true);
  //选用标志
  const [xybzCheck, setXybzCheck] = useState<boolean>(true);

  // 开启
  const showModal = (param: any, flag: any) => {
    //
    setMainRef(param);
    setModalVisible(true);
    // 表单初始化
    initForm(param, flag);
  };

  // useImperativeHandle
  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 表单初始化
  const initForm = (param: any, flag: any) => {
    if (flag == 'edit') {
      const {selectionRows} = param;
      setTitle('编辑');
      setIsEdit(true);
      const row = selectionRows[0];
      setYxbzCheck(row.yxbz == 'Y');
      setXybzCheck(row.yxbz == 'Y');
      form.setFieldsValue(row);
    }
  };

  const close = () => {
    form.resetFields();
    setModalVisible(false);
    setMainRef({});
    setYxbzCheck(true);
    setXybzCheck(true);
    setIsEdit(false);
    form.setFieldsValue({"syys": ''});
    form.setFieldsValue({"zsys": ''});
  }

  const save = async () => {
    const formValues = await form.validateFields();
    const syys = formValues?.syys;
    const zsys = formValues?.zsys;
    const data = {
      "sffwDm": formValues.sffwDm,
      "sffwmc": formValues.sffwmc,
      "yxbz": yxbzCheck ? 'Y' : 'N',
      "xybz": xybzCheck ? 'Y' : 'N',
      "syys": syys,
      "zsys": zsys,
      "editbz": isEdit ? 'Y' : 'N'
    };
    setMasker(true);
    await sffwglSaveOrUpdateSffw(data).then((response: any) => {
      setMasker(false);
      if (response.code === '200') {
        message.success('保存成功！');
        mainRef.refUnit.current!.reload();
        close();
      } else {
        message.error(response.msg);
      }
    })
  }

  const renderTreeNodes = (data: any) =>
    data.map((item: JSX.IntrinsicAttributes & TreeNodeProps & { children?: React.ReactNode; }) => {
      if (item.children) {
        item.disabled = true;
        return (
          <TreeSelect.TreeNode key={item.id} title={item.title} value={item.id}>
            {renderTreeNodes(item.children)}
          </TreeSelect.TreeNode>
        );
      }
      return <TreeSelect.TreeNode {...item} key={item.id} title={item.title} value={item.id}/>;
    });

  //有效标志
  const onChangeYxbzCheck = (data: any) => {
    setYxbzCheck(data);
  }

  //选用标志
  const onChangeXybzCheck = (data: any) => {
    setXybzCheck(data);
  }

  return (
    <Modal
      title={title}
      destroyOnHidden={true}
      open={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X1}
      footer={<>
        <Button onClick={() => close()}>取消</Button>
        <Button onClick={save} type="primary">确定</Button>
      </>}
      onCancel={() => close()}
      mask={{ closable: false }}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <Form form={form}>
          <Form.Item labelCol={{span: 6}} wrapperCol={{span: 14}}
                     rules={[{required: true, message: '请输入三方服务代码'}, baseValidator.range2({min: 0, max: 2})]} label="三方服务代码" name="sffwDm">
            <Input disabled={isEdit}/>
          </Form.Item>
          <Form.Item labelCol={{span: 6}} wrapperCol={{span: 14}}
                     rules={[{required: true, message: '请输入三方服务名称'}, baseValidator.range2({min: 0, max: 50})]} label="三方服务名称" name="sffwmc">
            <Input/>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item labelCol={{span: 12}} wrapperCol={{span: 12}} label="有效标志" name="yxbz">
                <Switch onChange={onChangeYxbzCheck} checked={yxbzCheck}/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item labelCol={{span: 12}} wrapperCol={{span: 12}} label="选用标志" name="xybz">
                <Switch onChange={onChangeXybzCheck} checked={xybzCheck}/>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item labelCol={{span: 6}} wrapperCol={{span: 14}}
                     rules={[{required: true, message: '试用月数'}, { type: 'base_number', range: '+'}, baseValidator.range2({min: 0, max: 3})]} label="试用月数" name="syys">
            <Input/>
          </Form.Item>
          <Form.Item labelCol={{span: 6}} wrapperCol={{span: 14}}
                     rules={[{required: true, message: '正式月数'}, { type: 'base_number', range: '+'}, baseValidator.range2({min: 0, max: 3})]} label="正式月数" name="zsys">
            <Input/>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}

export default Add;
