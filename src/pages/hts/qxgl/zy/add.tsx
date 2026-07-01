// 生成进货
import React, { useImperativeHandle, useState } from 'react';
import { message, Modal, TreeSelect, Form, Input, Spin, Button, Select } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import '@/pages/hts/commonModule/style.less';
import { xzHxgZy, cxQxzQdcdlb, sczydm } from '@/pages/hts/services/htsApi';
import { TreeNodeProps } from 'rc-tree-select/lib/TreeNode';
import myUtil from '@/components/DDAssist/util';
import baseValidator from '@/components/DDAssist/field/baseValidator';

export interface DDTsort {
  onRef?: any;
  visible?: any;
}

const Add: React.FC<DDTsort> = ({ onRef, visible = false }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [form] = Form.useForm();
  const [masker, setMasker] = useState<boolean>(false);
  const [ediybz, setEdiybz] = useState<boolean>(false);
  const [title, setTitle] = useState('新增');
  const [mainRef, setMainRef] = useState<any>({}); //主页面的ref
  const [tree, setTree] = useState<any>([]); // 单证名称树
  const [codeDmGlZylx, setCodeDmGlZylx] = useState<any>([]); 
  const [zy, setZy] = useState<boolean>(false);

  

  // 开启
  const showModal = async (param: any, flag: any) => {
    const codeDmGlZylx: any = await myUtil.code.getCodeFromServerT1('CODE_DM_GY_ZYLX:01');
    setCodeDmGlZylx(codeDmGlZylx);

    setMainRef(param);
    setModalVisible(true);
    // 表单初始化
    initForm(param, flag);
    initTree();
  };


  // useImperativeHandle
  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });


  const initTree = async () => {
    setMasker(true);
    const param2 = { "qxlx": "3" };
    await cxQxzQdcdlb(param2).then((response: any) => {
      setMasker(false);
      if (response.code === '200') {
        setTree(response.body);
      } else {
        message.error(response.msg);
      }
    });

  };

  // 表单初始化
  const initForm = (param: any, flag: any) => {
    if (flag == 'edit') {
      setTitle('编辑');
      setEdiybz(true);
      const { selectionRows } = param;
      setZy(true);
      form.setFieldsValue(selectionRows[0]);
    }
  };

  const close = () => {
    form.resetFields();
    setEdiybz(false);
    setModalVisible(false);
    setMainRef({});
    setZy(false);
    mainRef.unitRef.current!.reload2();
  }

  const save = async () => {
    const formValues = await form.validateFields();
    setMasker(true);
    await xzHxgZy(formValues).then((response: any) => {
      setMasker(false);
      if (response.code === '200') {
        message.success('保存成功！');
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
          // <TreeSelect.TreeNode key={item.id} title={item.title} value={item.id} disabled={item.disabled}>
          <TreeSelect.TreeNode key={item.id} title={item.title} value={item.id} >
            {renderTreeNodes(item.children)}
          </TreeSelect.TreeNode>
        );
      }
      return <TreeSelect.TreeNode {...item} key={item.id} title={item.title} value={item.id} />;
    });

  const onSelect = async (data: any) => {
    const formValues = { "cdDm": data };
    setMasker(true);
    await sczydm(formValues).then((response: any) => {
      setMasker(false);
      if (response.code === '200') {
        // 清空选中并设置按钮可用状态
        form.setFieldsValue(response.body);
      } else {
        message.error(response.msg);
      }
    })
  }



  return (
    <Modal
      title={title}
      destroyOnHidden={true}
      open={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X2}
      footer={<>
        <Button onClick={() => close()}>取消</Button>
        <Button onClick={save} type="primary">确定</Button>
      </>}
      onCancel={() => close()}
      mask={{ closable: false }}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <Form form={form}>
          {ediybz ? <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="菜单名称" name="cdmc">
            <Input maxLength={500} disabled={true} />
          </Form.Item> : <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} rules={[{ required: true, message: '请选择单名称' },]} label="菜单名称" name="cdDm">
            <TreeSelect
              showSearch
              treeNodeFilterProp={'title'}
              virtual={false}
              onSelect={onSelect}
            // treeDefaultExpandAll={true} 
            // dropdownMatchSelectWidth={220} 
            >
              {renderTreeNodes(tree)}
            </TreeSelect>
          </Form.Item>}
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="uuid" name="uuid" hidden={true}>
            <Input />
          </Form.Item>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="资源代码" name="zyDm2"  rules={[{ type: 'string', max: 20, message: '最大长度不能超过20' }]}>
            <Input maxLength={500} disabled={zy} />
          </Form.Item>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="资源类型代码" name="zylxDm">
            <Select placeholder="请选择资源类型" allowClear>
                {codeDmGlZylx?.map((item: any) => (
                  <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="序号" name="xh">
            <Input disabled={true} />
          </Form.Item>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="资源名称" name="zymc2"
            rules={[{ required: true, message: '请输入资源名称' },]} initialValue={''}>
            <Input maxLength={150} />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}

export default Add;