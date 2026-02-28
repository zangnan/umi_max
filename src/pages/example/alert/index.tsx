import React, { useState } from 'react';
import { Button, message, Form, Modal } from 'antd';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import ProCard from '@ant-design/pro-card';
import { itemType } from '@/components/DDForm/data.d';
import CONSTANTS from '@/components/DDAssist/constants';
import ModalGrid from './model_grid';
import myUtil from '@/components/DDAssist/util';

const Alert: React.FC<any> = ({ }) => {
  const refDDModalGrid: any = React.createRef();
  const [modalVisible1, handleModalVisible1] = useState<boolean>(false);
  const [modalVisible2, handleModalVisible2] = useState<boolean>(false);
  const [modalVisible3, handleModalVisible3] = useState<boolean>(false);
  const [form] = Form.useForm();

  const showAlert1 = () => {
    myUtil.modal.info({
      title: '导入成功',
      content: '导入勾选成功'
    });
  }

  const showAlert2 = () => {
    myUtil.modal.success({
      title: '导入成功',
      content: [
        '转待开票报关单5张',
        '生产单据号13个',
        '开票金额123,498.97元',
      ],
      onOk: () => {
        message.info('onOk');
      },
    });
  }

  const showAlert3 = () => {
    myUtil.modal.error({
      title: '导入成功',
      content: '导入勾选成功',
      okText: '知道了~',
    });
  }

  const showAlert4 = () => {
    let modal: any;
    const footer: any = [
      { name: '取消', key: 'testBtn', type: 'default', func: () => {
        modal.destroy();
      }},
      { name: '测试1', key: 'testBtn1', type: 'default', func: () => {
        message.info('测试1~~~');
      }},
      { name: '测试2', key: 'testBtn1', type: 'primary', func: () => {
        footer[2].loading = true;
        myUtil.modal.update(modal, {
          footer,
          title: '修改后标题',
        });
      }},
    ];
    modal = myUtil.modal.warning({
      title: '导入成功',
      content: '导入勾选成功',
      footer,
    });
  }

  const showConfirm1 = () => {
    myUtil.modal.confirm({
      title: '操作提示',
      content: '确定删除吗',
      icon: 'info', // info|success|error|warning
      onOk() {
        message.info('onOK');
      },
    });
  }

  const showConfirm2 = () => {
    myUtil.modal.confirm({
      title: '操作提示',
      content: '确定删除吗',
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!'));
      },
      cancelText: '关闭'
    });
  }

  // 表单项
  const formItems1 = [
    { label: '报关单号', type: itemType.Input, name: 'ckbgdh' },
    { label: '出口合同号', type: itemType.Input, name: 'ckhth' },
    { label: '核销单号', type: itemType.Select, name: 'hxdh' },
    { label: '累加', type: itemType.Checkbox, name: 'lj', list: [
      { name: '导入日期', value: '111' },
      { name: '生产日期', value: '222' }
    ]},
  ];

  // 表单项
  const formItems2 = [
    { label: '出口合同号', type: itemType.Select, name: 'ckhth' },
  ];

  // 表单项
  const formItems3 = [
    { label: '基本信息', type: itemType.GroupTitle, name: 'jbxx' },
    { label: '报关单号', type: itemType.Input, name: 'ckbgdh' },
    { label: '出口合同号', type: itemType.Input, name: 'ckhth' },
    { label: '核销单号', type: itemType.Input, name: 'hxdh' },
    { label: '运输工具名称', type: itemType.Input, name: 'ysgjmc' },
    { label: '杂费海关货币字母代码', type: itemType.Input, name: 'zfhghbzmDm' },
    { label: '商品信息', type: itemType.GroupTitle, name: 'spxx' },
    { label: '出口商品代码', type: itemType.Input, name: 'ckspDm' },
    { label: '出口商品名称', type: itemType.Input, name: 'ckspmc' },
  ];

  // handleSave
  const handleSave = () => {
    form.validateFields().then(values => {
      console.info(values);
    })
  }

  const showGrid1 = () => {
    refDDModalGrid.current!.showModal();
  };

  return (
    <>
      <ProCard>
        <Button onClick={() => showAlert1()} type='link'>info</Button>
        <Button onClick={() => showAlert2()} type='link'>success</Button>
        <Button onClick={() => showAlert3()} type='link'>error</Button>
        <Button onClick={() => showAlert4()} type='link'>warning</Button>
      </ProCard>
      <ProCard>
        <Button onClick={() => showConfirm1()} type='link'>confirm1</Button>
        <Button onClick={() => showConfirm2()} type='link'>confirm2</Button>
      </ProCard>
      <ProCard>
        <Button onClick={() => handleModalVisible1(true)} type='link'>form1</Button>
        <Button onClick={() => handleModalVisible2(true)} type='link'>form2</Button>
        <Button onClick={() => handleModalVisible3(true)} type='link'>form3</Button>
      </ProCard>
      <ProCard>
        <Button onClick={() => showGrid1()} type='link'>table1</Button>
      </ProCard>

      <Modal
        title='表单1'
        open={modalVisible1}
        width={CONSTANTS.C_MODAL_WIDTH_X1}
        footer={<>
          <Button onClick={() => handleModalVisible1(false)}>关闭</Button>
          <Button onClick={() => message.info('模板下载')}>模板下载</Button>
          <Button type="primary" onClick={() => handleSave()}>保存</Button>
        </>}
        onCancel={() => handleModalVisible1(false)}
        mask={{ closable: false }}
        // className={`${masker2 ? 'dd_modal_show_masker' : ''}`}
      >
        {/* <Spin description="Loading..." spinning={masker2} delay={100} key='DDBunit2DDBaseForm'> */}
          <DDBaseForm
            form={form}
            items={formItems1}
            initialValues={{}}
            layoutType="vertical" // horizontal vertical
            labelInputLayout="horizontal" // horizontal vertical
          />
        {/* </Spin> */}
      </Modal>

      <Modal
        title='表单2'
        open={modalVisible2}
        width={CONSTANTS.C_MODAL_WIDTH_X1}
        onCancel={() => handleModalVisible2(false)}
        mask={{ closable: false }}
        okText="保存"
        cancelText="关闭"
        onOk={() => handleModalVisible2(false)}
        // className={`${masker2 ? 'dd_modal_show_masker' : ''}`}
      >
        {/* <Spin description="Loading..." spinning={masker2} delay={100} key='DDBunit2DDBaseForm'> */}
          <DDBaseForm
            form={form}
            items={formItems2}
            initialValues={{}}
            layoutType="vertical" // horizontal vertical
            labelInputLayout="horizontal" // horizontal vertical
          />
        {/* </Spin> */}
      </Modal>

      <Modal
        title='表单3'
        open={modalVisible3}
        width={CONSTANTS.C_MODAL_WIDTH_X3}
        onCancel={() => handleModalVisible3(false)}
        mask={{ closable: false }}
        okText="保存"
        cancelText="关闭"
        onOk={() => handleSave()}
        // wrapClassName='standard-modal-1'
        // okButtonProps={{ className: 'dd_btn_focus' }}
        // className={`${masker2 ? 'dd_modal_show_masker' : ''}`}
      >
        {/* <Spin description="Loading..." spinning={masker2} delay={100} key='DDBunit2DDBaseForm'> */}
          <DDBaseForm
            form={form}
            items={formItems3}
            initialValues={{}}
            layoutType="horizontal"
            labelInputLayout="vertical"
          />
        {/* </Spin> */}
      </Modal>

      <ModalGrid onRef={refDDModalGrid} />
    </>
  );
};

export default Alert;