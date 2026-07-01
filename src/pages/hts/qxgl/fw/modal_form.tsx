/**
 * title: 角色管理-新增/修改角色
 * author: wx
 */
import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Modal, Button, Form, Spin, Input, Drawer, Radio, message } from 'antd';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import {saveOrUpdateFffw, deleteFffw, queryPager } from '@/pages/hts/services/htsApi';
import { intl as intl2 } from '@/components/DDAssist/util';

export interface BdjgProps {
  onRef?: any;
}

const ModalForm: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [masker, setMasker] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [initParam, setInitParam] = useState<any>({});
  const [fwdm, setFwdm] = useState<any>();

  const [form] = Form.useForm();
  const [modalVisible2, setModalVisible2] = useState<boolean>(false);
  const [config, setConfig] = useState<any>({});
  const [param2, setParam2] = useState<any>();

  
  
  // 开启
  const showModal = (param: any) => {
    const unitConfig: any = {};
    // 配置项
    unitConfig.unit_key = 'CX_SAAS_QXGL_HDFWGL_FFFWMX';
    unitConfig.grid_show_serial_number = false; // 是否显示序号，可选
    unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
    unitConfig.grid_row_key = 'fffwuuid'; // 列表主键，默认uuid
    unitConfig.form_save_check = false; // 表单编辑是否执行后端校验
    unitConfig.layout_type = 'modal';
    unitConfig.api_form_delete = `/yw/dditSaas/qxhdfw/deleteFffw`;
    unitConfig.batch_delete_key = 'fffwuuids';
    // 配置项：工具栏
    unitConfig.toolbar_default = {
      add: false, // 是否显示增加按钮，默认关闭
      edit: false, // 是否显示修改按钮，默认关闭
      delete: true, // 是否显示删除按钮，默认关闭
      setting: true, // 是否显示设置按钮，默认关闭
      reload: true, // 是否显示刷新按钮，默认关闭
      full: true, // 是否显示全屏按钮，默认关闭
    };

    // 配置项：列表列
    unitConfig.grid_columns = [
      { title: 'bean名称', dataIndex: 'bm1', width: 200, ellipsis: true },
      { title: '方法名称', dataIndex: 'ffm', width: 200, align: 'left', ellipsis: true },
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
      { name: 'bm1', label: 'bean名称', type: 'Input' },
      { name: 'ffm', label: '方法名称', type: 'Input', searchButton: true },
    ];
  
  
    // 配置项：自定义工具栏
    unitConfig.customer_toolbar = [
      { name: '新建', func: 'add' },
      { name: '修改', func: 'edit' },
    ];

    unitConfig.gridParams = { // 默认查询参数
      initSearchModal: [
        { property: 'fwDm', value: param?.record.fwDm, op: 'zdy',type:1 },
      ],
    };
    setFwdm(param?.record.fwDm);
    setConfig(unitConfig);
    setInitParam(param);
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });



  const Func: any = {
    unitRef: React.createRef(),
  };

  Func.add = (param: any) => {
    const { unitRef} = param;
    setParam2(unitRef?.current);
    form.setFieldsValue({"fwDm":fwdm})
    setModalVisible2(true);
  };

  Func.edit = (param: any) => {
    const {unitRef,selectionRowKeys,selectionRows} = param;
    setParam2(unitRef?.current);
    if (!selectionRowKeys || selectionRowKeys.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
      return;
    }
    if (selectionRowKeys.length > 1) {
      message.info(intl2.formatMessage({ id: 'message_one_selected' }));
      return;
    }
    form.setFieldsValue(selectionRows[0]);
    setModalVisible2(true);
  };

  

  Func.del33 = (param: any) => {
    const {selectionRowKeys,unitRef} = param;
    setMasker(true);
    deleteFffw({"fffwuuids": selectionRowKeys}).then((res: any) => {
      setMasker(false);
      const { code, msg } = res;
      if (code == '200') {
        message.success("删除成功！");
      } else {
        message.error(msg)
      }
    })
  }

  
  const close2 =  ()  => {
    param2?.reload2();
    form.resetFields();
    setModalVisible2(false);
  };


  const save =  ()  => {
    const value = form.getFieldsValue();
    setMasker(true);
    saveOrUpdateFffw(value).then((res: any) => {
      setMasker(false);
      const { code, msg } = res;
      if (code == '200') {
        message.success("保存成功！");
        param2?.current?.reload2();
        close2();
      } else {
        message.error(msg)
      }
    })

  };
  
  const close = () =>{
    setModalVisible(false)  ;
    setFwdm('');
    form.resetFields();
    initParam.unitRef.current!.reload2();
  }
  return (
    <>
      <Drawer
        title='服务明细'
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X4}
        onClose={() => close() }
      >
        <DDBunit2 config={config} func={Func} />
        <Modal
        title='新增'
        visible={modalVisible2}
        width={CONSTANTS.C_MODAL_WIDTH_X1}
        onCancel={() => close2()}
        footer={(<>
          <Button onClick={() => save()} type="primary">保存</Button>
          <Button onClick={() => close2()} type="default">关闭</Button>
        </>)}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <Form
            form={form}
            name="form"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
          >
             <Form.Item name="fffwuuid" label="uuid"  initialValue={''} hidden={true}>
              <Input placeholder="uuid"  disabled={true} />
            </Form.Item>
            <Form.Item name="fwDm" label="服务代码"  >
              <Input placeholder="请录入服务代码" maxLength={10} disabled={true} />
            </Form.Item>
            <Form.Item name="bm1" label="bean名称" rules={[{ required: true, message: '请录入bean名称' }]}>
              <Input placeholder="请录入bean名称" maxLength={150} showCount  />
            </Form.Item>
            <Form.Item name="ffm" label="方法名称" rules={[{ required: true, message: '请录入方法名称' }]}>
              <Input placeholder="方法名称" maxLength={150} showCount  />
            </Form.Item>
            <Form.Item name="bz" label="备注" initialValue={''}>
              <Input.TextArea placeholder="方法名称" maxLength={1000} showCount  autoSize={{ minRows: 4, maxRows: 24 }}/>
            </Form.Item>  
            <Form.Item name="yxbz" label="有效标志" initialValue={'Y'}>
              <Radio.Group >
                  <Radio value='Y'>是</Radio>
                  <Radio value='N'>否</Radio>
              </Radio.Group>
          </Form.Item>
          </Form>
        </Spin>
      </Modal>
      </Drawer>
      
    </>
  );
};

export default ModalForm;
