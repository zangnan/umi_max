/**
 * 查看明细
 */
import React, { useImperativeHandle, useState} from 'react';
import { queryPdrwRwxq } from '@/pages/hts/services/htsApi';
import { Modal,message,Form,Button} from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import { itemType } from '@/components/DDForm/data.d';
import './style.less';

export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
  ywKey?: any;
}
const Mtspd: React.FC<DDModalGridProps> = ({ onRef, visible = false }) => {
  //全局变量页面开关
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  //Form
  const [form] = Form.useForm();
  //绑定组件
  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 开启页面，并设置参数
  const showModal = (param: any) => {
    const pduuid = param?.pduuid;
    if(pduuid) {
      setModalVisible(true);
      queryPdrwRwxq({pduuid: pduuid }).then(async (res) => {
        const { body, code } = res;
        if (code === '200') {
          form.setFieldsValue(body);
        }
      })
    } else {
      message.error('任务详情打开失败')
    }
  };

  
  // 表单项
  const formItems = [
    { label: '台账条数', type: itemType.GroupTitle, name: 'tz'},
    { label: '总条数', type: itemType.Input, name: 'tzzts', disabled: true },
    { label: '配单情况', type: itemType.GroupTitle2, name: 'bgdpdcgts' },
    { label: '配单成功', type: itemType.Input, name: 'tzpdcgts', disabled: true },
    { label: '配单失败', type: itemType.Input, name: 'tzpdsbts', disabled: true },
    { label: '生成情况', type: itemType.GroupTitle2, name: '' },
    { label: '生成成功', type: itemType.Input, name: 'tzsccgts', disabled: true },
    { label: '生成失败', type: itemType.Input, name: 'tzscsbts', disabled: true },
    { label: '报关单条数', type: itemType.GroupTitle, name: 'bgd'},
    { label: '总条数', type: itemType.Input, name: 'bgdzts', disabled: true },
    { label: '配单情况', type: itemType.GroupTitle2, name: 'bgdpdcgts' },
    { label: '配单成功', type: itemType.Input, name: 'bgdxj', disabled: true },
    { label: '配单失败', type: itemType.Input, name: 'bgdpdsbts', disabled: true },
    { label: '合理范围', type: itemType.Input, name: 'hlfwts', disabled: true },
    { label: '低于合理范围', type: itemType.Input, name: 'dyhlfwts', disabled: true },
    { label: '高于合理范围', type: itemType.Input, name: 'gyhlfwts', disabled: true },
    { label: '生成情况', type: itemType.GroupTitle2, name: '' },
    { label: '生成成功', type: itemType.Input, name: 'bgdsccgts', disabled: true },
    { label: '生成失败', type: itemType.Input, name: 'bgdscsbts', disabled: true },
  ];

  return (
    <>
      <Modal
        title="任务详情"
        destroyOnHidden={true}
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X4}
        wrapClassName="standard-modal-1"
        onCancel={() => setModalVisible(false)}
        footer={(<>
          <Button onClick={() => setModalVisible(false)} type="primary">确定</Button>
        </>)}
      >
        <DDBaseForm items={formItems} form={form} initialValues={{}} />
      </Modal>
    </>
  );
};

export default Mtspd;