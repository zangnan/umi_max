import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Modal, Form } from 'antd';
import { automaticPageDef, queryForm, saveXmlcbbgxx } from '@/services/hts/api';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import assembleConfigUtil from '@/components/DDBunit/assemble_config_util';
import myUtil from '@/components/DDAssist/util';
import Func from '../yggl/f';
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
  const modelKeyXmjbxxb = 'nbgl_xmgl_xmlcbxxb'; // 里程碑信息

  // 里程碑信息
  const getXmjbxxForm = (param: any) => {
    let formItems: any;
    automaticPageDef(modelKeyXmjbxxb).then((response1: any) => {
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
        return queryForm({ key : modelKeyXmjbxxb, projectMilestoneId: param.record.projectMilestoneId }); // 模块配置信息
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
    getXmjbxxForm(param);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 里程碑变更
  const formSubmit = () => {
    form.validateFields().then(values => {
      // 格式化表单数据
      myUtil.module.formatFormValue({ formItems: formConfig.form_items, formValues: values });
      let formParam = {
        ...values,
        key: modelKeyXmjbxxb,
      }
      saveXmlcbbgxx(formParam).then((res: any) => {
        myUtil.modal.responseInfo(res);
        initParam.refGrid?.current?.reload();
      })
      setModalVisible(false);
    })
  }

  return (
    <Modal
      title="里程碑信息变更"
      open={modalVisible}
      onCancel={() => setModalVisible(false)}
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      destroyOnHidden={true}
      wrapClassName='standard-modal'
      mask={{ closable: false }}
      okText="保存"
      cancelText="关闭"
      onOk={() => formSubmit()}
    >
      <DDBaseForm config={formConfig} form={form} initialValues={{}} func={Func}/>
    </Modal>
  );
};

export default DrawerList;
