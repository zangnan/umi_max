// 疑点管理
import React, { useState, useEffect, } from 'react';
import { Button, Form, Input, Space, Modal, Select } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import {PlusOutlined, MinusOutlined} from '@ant-design/icons';


export type YdglProps = {
  ywKey?: any;
  setSxModal?:any;
  sxModal?:any;
  zlbsx:any;
  searchForm:any,
}

const Ydgl: React.FC<YdglProps> = ({
  ywKey,
  sxModal,
  setSxModal,
  zlbsx,
  searchForm,
}) => {


  // 初始化执行
  useEffect(() => {
  }, []);

  // 主列表-更多- 保存
  const sxsave = async () => {
    setSxModal(false);
  }

  // 主列表 - 更多- 删除筛选项目
  const removeQybzSwitch = (qybzIndex: any) => {
    let tempSign = false;
    const temp = searchForm.getFieldValue("dyjList");
    const tempArr: any = [];
    temp.forEach((item: any, index: any) => {
      if (item === undefined) {
        item = {
          mrbz: false,
        }
      }
      if (item.mrbz) {
        tempSign = true
      }
      tempArr.push(item)
    });
    if (!tempSign) {
      tempArr[0].mrbz = true
    }
    searchForm.setFieldsValue({
      dyjList: tempArr,
    });
  }

  return (
    <Modal
      title="筛选项"
      centered
      destroyOnHidden
      visible={sxModal}
      width={CONSTANTS.C_MODAL_WIDTH_X2}
      onCancel={() => setSxModal(false)}
      footer={(<>
        <Button onClick={sxsave} >确定</Button>
      </>)}
    >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} form={searchForm} initialValues={{ dyjList: [{}] }}>
        <Form.List name="dyjList">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item key={field.name} wrapperCol={{ span: 18 }}>
                  <Space align="baseline">
                    <Form.Item name={[field.name, 'k']} noStyle rules={[{ required: true, message: '请输入内容！' }, ]} >
                      <Select style={{ width: 240 }} placeholder="请选择">
                        {zlbsx.map((item: any) => {
                          return <Select.Option value={item.value}>{item.name}</Select.Option>
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item name={[field.name, 'v']} noStyle >
                      <Input placeholder="请输入内容" />
                    </Form.Item>
                    <Button icon={<PlusOutlined />} size="small" onClick={() => add()} />
                    <Button icon={<MinusOutlined />} disabled={fields.length > 1 ? false : true} size="small" onClick={() => { remove(field.name); removeQybzSwitch(field.name) }} />
                  </Space>
                </Form.Item>
              ))}
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};


export default Ydgl;
