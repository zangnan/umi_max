import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Modal, Form } from 'antd';
import { automaticPageDef, queryForm, saveOrUpdate } from '@/services/hts/api';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import assembleConfigUtil from '@/components/DDBunit/assemble_config_util';
import myUtil from '@/components/DDAssist/util';
import Func from './f';
export interface BdjgProps {
  onRef?: any;
}

const DrawerList: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [initParam, setInitParam] = useState<any>({});
  const [form] = Form.useForm();
  const [formConfig, setFormConfig] = useState<any>({});
  const modelKeyLdht = 'nbgl_yggl_ldht'; // 劳动合同
  const modelKeyJbxx = 'nbgl_ryxx_jbxx'; // 基本信息

  // 劳动合同
  const getLdhtForm = (userId: any) => {
    let formItems: any
    automaticPageDef(modelKeyLdht).then((response1: any) => {
			if (response1.code === '200') {
        let tmpConfig = assembleConfigUtil.module.assembleAll({
          moduleInfo: response1.body.moduleInfo,
          appTableDict: response1.body.appTableDict,
        });
        formItems = tmpConfig.form_items;
        const formConfig = {
          form_layout_type: tmpConfig.form_layout_type,
          form_label_input_layout: 'vertical',
          form_items: formItems,
        };
        setFormConfig(formConfig);
        // 业务表单数据
        return queryForm({ key : modelKeyJbxx, userId : userId }); // 模块配置信息
			}
		}).then((resForm: any) => {
			if (resForm.code === '200') {
        let formValue: any = resForm.body;
        myUtil.module.setFormConfigValue({ formValue, form, formItems });
        setModalVisible(true);
      }
		});
  }

  // 开启
  const showModal = (param: any) => {
    setInitParam(param);
    let record: any = param.record;
    let userId: any = record.userId;
    getLdhtForm(userId);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 生成合同
  const formSubmit = () => {
    form.validateFields().then(values => {
      // 格式化表单数据
      myUtil.module.formatFormValue({ formItems: formConfig.form_items, formValues: values });
      let formParam = {
        ...values,
        key: modelKeyLdht,
      }
      if (initParam.isInit) {
        formParam.xtglProcessRunState = '4'; // 首次签订无需审批
        formParam.htztDm = '2'; // 合同状态	2	现行合同
      }
      saveOrUpdate(formParam).then((res: any) => {
        myUtil.modal.responseInfo(res);
        initParam.refGrid?.current?.reload();
      })
      setModalVisible(false);
    })
  }

  return (
    <Modal
      title="生成合同信息"
      open={modalVisible}
      onCancel={() => setModalVisible(false)}
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      destroyOnHidden={true}
      wrapClassName='standard-modal'
      maskClosable={false}
      okText="生成合同"
      cancelText="关闭"
      onOk={() => formSubmit()}
    >
      <DDBaseForm config={formConfig} form={form} initialValues={{}} func={Func}/>
    </Modal>
  );
};

export default DrawerList;
