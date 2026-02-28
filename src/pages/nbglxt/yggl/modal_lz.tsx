import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Modal, Form } from 'antd';
import { automaticPageDef, saveOrUpdate } from '@/services/hts/api';
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
  const FuncForm: any = {};
  // const modelKeyJbxx = 'nbgl_ryxx_jbxx'; // 基本信息
  // const modelKeyYgxx = 'nbgl_yggl'; // 员工信息
  const modelKeyLzgl = 'nbgl_yggl_lzgl'; // 离职
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  // 查询离职表单配置 & 生成表单
  const drawForm = async () => {
    let formItem: any;
    // 查询配置数据
    let res: any = await automaticPageDef(modelKeyLzgl);
    if (res.code === '200') {
      let tmpConfig = assembleConfigUtil.module.assembleAll({
        moduleInfo: res.body.moduleInfo,
        appTableDict: res.body.appTableDict,
      });
      formItem = tmpConfig.form_items;
      // debugger
      // formItem.forEach((item: any) => {
      //   if (item.name === 'uuid') {
      //     item.type = itemType.Select;
      //     item.eventOnChange = 'searchPerson';
      //     item.list = personList;
      //     item.showSearch = true;
      //     item.readOnly = false;
      //     item.disabled = false;
      //     item.label = '姓名';
      //   } else if (item.name === 'xm') {
      //     item.type = itemType.Hidden;
      //   }
      // });
      const formConfig = {
        form_layout_type: tmpConfig.form_layout_type,
        form_label_input_layout: 'vertical',
        form_items: formItem,
      };
      setFormConfig(formConfig);
      return { formConfig };
    }
  }

  // 表单事件：OnChange
  // Func.eventOnChange = {
  //   searchPerson: (param: any) => {
  //     const uuid = param?.value;
  //     queryForm({ key : modelKeyYgxx, uuid : uuid }).then((resForm: any) => {
  //       if (resForm.code === '200') {
  //         let formValue: any = resForm.body;
  //         let formItems = formConfig.form_items;
  //         myUtil.module.setFormConfigValue({ formValue, form, formItems });
  //         }
  //     })
  //   },
  // }

  // 初始化表单
  const initForm = async () => {
    // 1. 查询离职表单配置 & 生成表单
    let reObj: any = await drawForm();
    // 2. 查询当前人员信息并赋值表单
    await Func.searchPersonAndSetForm(reObj.formConfig, currentUser, modelKeyLzgl, form);
    // 3. 开启表单
    setModalVisible(true);

    // let personList: any = [];
    // // 查询人员
    // queryList({page: 1, pageSize: 999999, searchModel: []}, 'nbgl_yggl').then((response0: any) => {
    //   // debugger
    //   if (response0?.code === '200' && response0?.body?.rowCount > 0) {
    //     let gridData: any = response0.body.rows || [];
    //     console.info(gridData);
    //     for (let i = 0; i < gridData.length; i++) {
    //       personList.push({ name: gridData[i].xm, value: gridData[i].uuid });
    //     }
    //   }
    // })
  }

  // 开启
  const showModal = (param: any) => {
    setInitParam(param);
    initForm();
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 离职申请
  const formSubmit = () => {
    form.validateFields().then(values => {
      // 格式化表单数据
      myUtil.module.formatFormValue({ formItems: formConfig.form_items, formValues: values });
      let formParam = {
        ...values,
        key: modelKeyLzgl,
        lzztDm: '1',
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
      title="离职申请"
      open={modalVisible}
      onCancel={() => setModalVisible(false)}
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      destroyOnHidden={true}
      wrapClassName='standard-modal'
      mask={{ closable: false }}
      okText="离职申请"
      cancelText="关闭"
      onOk={() => formSubmit()}
    >
      <DDBaseForm config={formConfig} form={form} initialValues={{}} func={FuncForm} />
    </Modal>
  );
};

export default DrawerList;
