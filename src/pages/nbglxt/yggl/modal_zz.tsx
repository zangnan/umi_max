import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Modal, Form } from 'antd';
import { automaticPageDef, queryForm, saveOrUpdate } from '@/services/hts/api';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import assembleConfigUtil from '@/components/DDBunit/assemble_config_util';
import myUtil from '@/components/DDAssist/util';
import { useModel } from 'umi';
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
  const modelKeyJbxx = 'nbgl_ryxx_jbxx'; // 基本信息
  const modelKeyZzgl = 'nbgl_yggl_zzgl'; // 转正
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  // 转正
  const drawForm = async () => {
    let formItem: any;
    // 查询配置数据
    let res: any = await automaticPageDef(modelKeyZzgl);
    if (res.code === '200') {
      let tmpConfig = assembleConfigUtil.module.assembleAll({
        moduleInfo: res.body.moduleInfo,
        appTableDict: res.body.appTableDict,
      });
      formItem = tmpConfig.form_items;
      const formConfig = {
        form_layout_type: tmpConfig.form_layout_type,
        form_label_input_layout: 'vertical',
        form_items: formItem,
      };
      setFormConfig(formConfig);
      return { formConfig };
    }

    // let formItems: any
    // // debugger
    // automaticPageDef(modelKeyZzgl).then((response1: any) => {
    //   // debugger
		// 	if (response1.code === '200') {
    //     let tmpConfig = assembleConfigUtil.module.assembleAll({
    //       moduleInfo: response1.body.moduleInfo,
    //       appTableDict: response1.body.appTableDict,
    //     });
    //     formItems = tmpConfig.form_items;
    //     const formConfig = {
    //       form_layout_type: tmpConfig.form_layout_type,
    //       form_label_input_layout: 'vertical',
    //       form_items: formItems,
    //     };
    //     setFormConfig(formConfig);
    //     // 业务表单数据
    //     return queryForm({ key : modelKeyJbxx, userId : userId }); // 模块配置信息
		// 	}
		// }).then((resForm: any) => {
    //   // debugger
		// 	if (resForm.code === '200') {
    //     let formValue: any = resForm.body;
    //     formValue.uuid = uuid;
    //     myUtil.module.setFormConfigValue({ formValue, form, formItems });
    //     setModalVisible(true);
    //   }
		// });
  }

  // 初始化表单
  const initForm = async () => {
    // 1. 查询离职表单配置 & 生成表单
    let reObj: any = await drawForm();
    // 2. 查询当前人员信息并赋值表单
    await Func.searchPersonAndSetForm(reObj.formConfig, currentUser, modelKeyZzgl, form);
    // 3. 开启表单
    setModalVisible(true);
  }

  // 开启
  const showModal = (param: any) => {
    setInitParam(param);
    initForm();
    // let record: any = param.record;
    // let userId: any = record.userId;
    // let uuid: any = record.uuid;
    // // debugger
    // getZzForm({userId, uuid});
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 转正申请
  const formSubmit = () => {
    form.validateFields().then(values => {
      // debugger;
      // 格式化表单数据
      myUtil.module.formatFormValue({ formItems: formConfig.form_items, formValues: values });
      // debugger;
      let formParam = {
        ...values,
        key: modelKeyZzgl,
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
      title="转正申请"
      open={modalVisible}
      onCancel={() => setModalVisible(false)}
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      destroyOnHidden={true}
      wrapClassName='standard-modal'
      maskClosable={false}
      okText="转正申请"
      cancelText="关闭"
      onOk={() => formSubmit()}
    >
      <DDBaseForm config={formConfig} form={form} initialValues={{}}/>
    </Modal>
  );
};

export default DrawerList;
