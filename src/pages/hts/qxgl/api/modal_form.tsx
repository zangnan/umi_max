/**
 * title: 角色管理-新增/修改角色
 * author: wx
 */
import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Modal, Button, Form, Spin, Input, Drawer, Radio } from 'antd';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';

export interface BdjgProps {
  onRef?: any;
}

const ModalForm: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [masker, setMasker] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [initParam, setInitParam] = useState<any>({});
  const [fwdm, setFwdm] = useState<any>({});

  const [form] = Form.useForm();
  const [name, setName] = useState();
  const [modalVisible2, setModalVisible2] = useState<boolean>(false);
  
  // 开启
  const showModal = (param: any) => {
    setInitParam(param);
    setFwdm(param?.record.fwdm);
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  const unitConfig: any = {};


  // 配置项
  unitConfig.unit_key = 'FPZS_BGDKP_DKP18WBGDCX';
  unitConfig.api_grid_query = `/yw/dditSaas/qxjs/queryJsPager`;
  unitConfig.api_form_delete = '/yw/dditSaas/qxyh/deleteYh'
  unitConfig.grid_show_serial_number = false; // 是否显示序号，可选
  unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
  unitConfig.grid_row_key = 'jsDm'; // 列表主键，默认uuid
  unitConfig.form_save_check = false; // 表单编辑是否执行后端校验
  unitConfig.batch_delete_key = 'jsDm';
  unitConfig.layout_type = 'modal';

  // 配置项：列表列
  unitConfig.grid_columns = [
    { title: 'bean名称', dataIndex: 'fwdm', width: 200, ellipsis: true },
    { title: '方法名称', dataIndex: 'fwmc', width: 200, align: 'left', ellipsis: true },
    { title: '备注', dataIndex: 'bz', align: 'left', ellipsis: true },
    {
      title: '有效标志', dataIndex: 'yxbz', width: 100, codeTable: 'code_static_yes_no:01', filter: {
        type: 'Select',
        codeTable: 'code_static_yes_no:01'
      },
    },
  ];

  // 配置项：列表筛选项
  unitConfig.grid_filter_quick = [
    { name: 'fwdm', label: 'bean名称', type: 'Input' },
    { name: 'fwmc', label: '方法名称', type: 'Input', searchButton: true },
  ];


  // 配置项：自定义工具栏
  unitConfig.customer_toolbar = [
    { name: '新建', func: 'add' },
    { name: '修改', func: 'edit' },
    { name: '刪除', func: 'del' },
  ];


  const Func: any = {
    unitRef: React.createRef(),
  };

  Func.add = (param: any) => {
    const { unitRef } = param;
    setModalVisible2(true);
  };
  

  const close =  ()  => {
    form.setFieldsValue({});
    setModalVisible2(false);
  };

  return (
    <>
      <Drawer
        title='编辑'
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X4}
        onClose={() => setModalVisible(false)}
      >
        <DDBunit2 config={unitConfig} func={Func} />
      </Drawer>
      <Modal
        title='新增'
        visible={modalVisible2}
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
            <Form.Item name="fwdm" label="服务代码"  initialValue={fwdm} >
              <Input placeholder="请录入服务代码" maxLength={10} disabled={true} />
            </Form.Item>
            <Form.Item name="beanName" label="bean名称" rules={[{ required: true, message: '请录入bean名称' }]}>
              <Input placeholder="请录入bean名称" maxLength={150} showCount  />
            </Form.Item>
            <Form.Item name="fwms" label="方法名称" rules={[{ required: true, message: '请录入方法名称' }]}>
              <Input placeholder="方法名称" maxLength={150} showCount  />
            </Form.Item>
            <Form.Item name="yxbz" label="备注" >
              <Input.TextArea placeholder="方法名称" maxLength={1000} showCount  autoSize={{ minRows: 4, maxRows: 24 }}/>
            </Form.Item>  
            <Form.Item name="yxbz" label="有效标志" >
              <Radio.Group defaultValue={'Y'} >
                  <Radio value='Y'>是</Radio>
                  <Radio value='N'>否</Radio>
              </Radio.Group>
          </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default ModalForm;
