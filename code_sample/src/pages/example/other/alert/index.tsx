import React, { useState } from 'react';
import { Button, message, Space, Form, Input, Checkbox, Select, Modal } from 'antd';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import ProCard from '@ant-design/pro-card';
import DDAlert from '@/components/DDAlert';
import { itemType } from '@/components/DDForm/data.d';
import pro from '@/pages/common/proConfig';
import ModalGrid from './model_grid';
import './style.less';

export interface DDModalProps {
  data?: any;
}

const Test: React.FC<DDModalProps> = ({ }) => {
  const refDDModalGrid: any = React.createRef();
  const [modalVisible, handleModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  const showAlert1 = () => {
    DDAlert.open({
      title: '导入成功',
      info: '导入勾选成功',
    });
  };

  const showAlert2 = () => {
    DDAlert.open({
      title: '发票开具',
      info: '发票开具成功',
      content: <>
        <p className="item">文件生成：<a>20211026-20211026.xml</a></p>
        <p className="item">
          <Space>
            <a>查看开具记录</a>
            <a>下载文件</a>
            <a>复诊文件路径</a>
          </Space>
        </p>
      </>,
    });
  };

  const showAlert3 = () => {
    DDAlert.open({
      title: '发票开具',
      info: '发票开具成功',
      content: [
        '转待开票报关单5张；',
        '生产单据号13个；',
        '开票金额123,498.97元。',
      ],
    });
  };

  const showConfirm1 = () => {
    DDAlert.open({
      title: '系统提示',
      info: '尚未进行开票设置',
      infoType: 'error',
      modalType: 'confirm',
      okText: '跳转',
      content: <>
        <p className="item">
          系统检查出您尚未进行开票设置，请点击“<a>开票设置</a>”配置开票相关信息。
        </p>
      </>,
    });
  };

  const showConfirm2 = () => {
    DDAlert.open({
      title: '发票开具',
      info: '发票开具信息',
      infoType: 'info',
      modalType: 'confirm',
      content: [
        '开具发票13张；',
        '开具金额13,123.00元；',
        '涉及报关单5张。',
      ],
    });
  };

  const showConfirm3 = () => {
    DDAlert.open({
      title: '取消开票',
      info: '确定取消开具发票吗？',
      infoType: 'question',
      modalType: 'confirm',
      closeStatus: false,
      button: [
        <Button onClick={() => test()} key='mbxz'>模板下载</Button>,
        {name: '测试按钮', key: 'testBtn', type: 'default', func: (thisObj: any) => {
          thisObj.setState({ masker: true });
          setTimeout(() => {
            thisObj.setState({ masker: false });
          }, 2000);
        }}
      ],
      content: [
        '取消开具发票13张；',
        '取消开具发票金额13,123.00元；',
        '涉及报关单5张。',
      ],
      okCallbackFn: function (thisObj: any) {
        thisObj.setState({ masker: true });
        setTimeout(() => {
          thisObj.setState({ masker: false });
        }, 2000);
      },
    });
  };


  const showConfirm4 = () => {
    DDAlert.open({
      title: '取消开票',
      info: '确定取消开具发票吗？',
      infoType: 'question',
      modalType: 'confirm',
      closeStatus: false,
      okText: '继续',
      button: [
        <Button onClick={() => test()} key='mbxz'>模板下载</Button>,
      ],
      content: [
        '取消开具发票13张；',
        '取消开具发票金额13,123.00元；',
        '涉及报关单5张。',
      ],
      okCallbackFn: function () {
        DDAlert.open({
          title: '取消开票成功',
          info: '取消成功',
          infoType: 'info',
          modalType: 'success',
          okText: '确定',
          button: [], // 将上一个弹窗的按钮重置
          closeStatus: true,
          content: [
            '取消开票成功',
          ],
          okCallbackFn: function () {

          },
        });
      },
    });
  };

  const showForm1 = () => {
    DDAlert.open({
      title: '导入勾选',
      infoType: 'warning',
      modalType: 'form',
      button: [
        <Button onClick={() => test()}>模板下载</Button>,
      ],
      content: <>
        <Form name="basic" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }} autoComplete="off" >
          <Form.Item label="文件" name="exportFfileName" >
            <Input />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 6, span: 14 }}>
            <Checkbox>累加勾选</Checkbox>
          </Form.Item>
        </Form>
      </>,
    });
  };

  const showForm2 = () => {
    DDAlert.open({
      title: '转单据号',
      infoType: 'warning',
      modalType: 'form',
      content: <>
        <Form name="basic" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }} autoComplete="off" >
          <Form.Item name="djh" label="转让单据号" >
            <Select placeholder="请选择单据号" allowClear >
              <Select.Option value="2110271346201">2110271346201</Select.Option>
              <Select.Option value="2220271346202">2220271346202</Select.Option>
              <Select.Option value="2330271346203">2330271346203</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </>,
    });
  };

  const showForm3 = () => {
    handleModalVisible(true);
  };

  const showGrid1 = () => {
    refDDModalGrid.current!.showModal();
  };

  const test = () => {
    message.info('模板下载');
    DDAlert.open({
      title: '发票开具',
      info: '发票开具信息',
      infoType: 'info',
      modalType: 'confirm',
      content: [
        '开具发票13张；',
        '开具金额13,123.00元；',
        '涉及报关单5张。',
      ],
    });
  }

  // 表单项
  const formItems = [
    { label: '基本信息', type: itemType.GroupTitle, name: 'jbxx' },
    { label: '报关单号', type: itemType.Input, name: 'ckbgdh' },
    { label: '出口合同号', type: itemType.Input, name: 'ckhth' },
    { label: '核销单号', type: itemType.Input, name: 'hxdh' },
    { label: '运输工具名称', type: itemType.Input, name: 'ysgjmc' },
    { label: '监管方式代码', type: itemType.Input, name: 'jgfsDm' },
    { label: '杂费海关货币字母代码', type: itemType.Input, name: 'zfhghbzmDm' },
    { label: '商品信息', type: itemType.GroupTitle, name: 'spxx' },
    { label: '出口商品代码', type: itemType.Input, name: 'ckspDm' },
    { label: '出口商品名称', type: itemType.Input, name: 'ckspmc' },
    { label: '海关商品名称', type: itemType.Input, name: 'hgspmc' },
    { label: '成交计量单位', type: itemType.Input, name: 'hgjldwmc' },
    { label: '第二计量单位', type: itemType.Input, name: 'dejldwDm' },
    { label: '规格型号', type: itemType.Input, name: 'ggxh' },
  ];

  // 新建、编辑保存
  const handleSave = () => {
    // form
    //   .validateFields()
    //   .then(values => {
    //     editUser(values)
    //       .then((response) => {
    //         const { code } = response;
    //         if (code === '200') {
    //           message.success('操作成功');
    //           handleModalVisible(false);
    //           ref.current!.reload();
    //         } else {
    //           message.error('操作失败');
    //         }
    //       })
    //   })
  }

  return (
    <>
      <ProCard>
        <Button onClick={() => showAlert1()} type='link'>info1</Button>
        <Button onClick={() => showAlert2()} type='link'>info2</Button>
        <Button onClick={() => showAlert3()} type='link'>info3</Button>
      </ProCard>
      <ProCard>
        <Button onClick={() => showConfirm1()} type='link'>confirm1</Button>
        <Button onClick={() => showConfirm2()} type='link'>confirm2</Button>
        <Button onClick={() => showConfirm3()} type='link'>confirm3</Button>
        <Button onClick={() => showConfirm4()} type='link'>confirm4</Button>
      </ProCard>
      <ProCard>
        <Button onClick={() => showForm1()} type='link'>form1</Button>
        <Button onClick={() => showForm2()} type='link'>form2</Button>
        <Button onClick={() => showForm3()} type='link'>form3</Button>
      </ProCard>
      <ProCard>
        <Button onClick={() => showGrid1()} type='link'>table1</Button>
      </ProCard>

      <ModalGrid onRef={refDDModalGrid} />

      <Modal
        title="企业信息"
        visible={modalVisible}
        wrapClassName='standard-modal-1'
        width={pro.c_modal_width_x4}
        okText="保存"
        cancelText="关闭"
        onCancel={() => handleModalVisible(false)}
        onOk={handleSave}
      >
        <DDBaseForm items={formItems} form={form} initialValues={{}} />
      </Modal>
    </>
  );
};

export default Test;