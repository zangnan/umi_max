// 生成申报数据
// sbpc 3位补零 未完成
import React, { useState, useImperativeHandle, Fragment , useRef} from 'react';
import { Modal, message, Button, Form } from 'antd';
import ErrorMsgGrid from '@/pages/hts/components/DDImport/checkErrorProp';
import { itemType } from '@/components/DDForm/data.d';
import cktsUtil from '@/pages/hts/cktsUtil';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import ExceptionGrid from '@/pages/hts/ckts/scsbsj/sjjcydlb/sjjcydlb';
import CreateData from '@/pages/hts/ckts/scsbsj/scsjqk/scsjqk';
import { queryScsbCsh, checkScsbsj, mtsJcSjhfx, mdtJcSjhfx, checkCkshScsbsj, queryDsbsjLb } from '@/pages/hts/services/htsApi';
import CONSTANTS from '@/components/DDAssist/constants';
import moment from 'moment';
import baseValidator from '@/components/DDAssist/field/baseValidator';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';

export type GeneratedFormProps = {
  visible?: any;
  onRef?: any;
  ywKey?: any;
  showFlzl?: any;
}


const GeneratedForm: React.FC<GeneratedFormProps> = ({
  visible = false,
  onRef,
  ywKey,
  showFlzl,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [exceptionData, setExceptionData] = useState<any>({});
  const [createDataGrid, setCreateDataGrid] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const refCreateData: any = React.createRef();
  const [form] = Form.useForm();
  const refExceptionGrid: any = React.createRef();
  const [initParam, setInitParam] = useState<any>({});
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const errorMsgRef: any = useRef();

  // 表单项: 生成申报数据
  const getFormItemsCreateData = () => {
    const formItems = [];
    if (cktsUtil.moduleType(ywKey, 'SQRQ')) {  // 申请日期
      formItems.push({ name: 'tbrq1', type: itemType.DatePicker, label: '申请日期' });
    } else {
      formItems.push({ name: 'ssq', type: itemType.Input, label: '所属期', validator: [baseValidator.required()],rules: [{type: 'base_required'}], });
      if (cktsUtil.moduleType(ywKey, 'SBPC')) {  // 申报批次
        formItems.push({ name: 'sbpc', type: itemType.Input, label: '批次', onBlur: onBlurSbpc, validator: [baseValidator.required()], rules: [{type: 'base_required'}] });
      }
    }
    return formItems;
  }

  const onBlurSbpc = (param: any) => {
    // 申报批次自动补零
    DditCktsFormCommonFunc.eventOnBlur.sbpc(param);
  }

  // 初始化数据
  const initFormData = () => {
    const params = {ywKey};
    queryScsbCsh(params).then((response) => {
      const { code, body, msg } = response;
      if (code === '200') {
        if (body?.tbrq1) {
          body.tbrq1 = moment(new Date(body.tbrq1));
        }
        form.setFieldsValue(body);
        setModalVisible(true);
      } else {
        message.error(msg);
      }
    })
  }

  // 开启
  const showModal = (param: any) => {
    console.info('generatedForm.tsx -> showModal');
    console.info(param);
    initFormData();
    setInitParam(param)
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 表单提交
  const dataCreateSave = () => {
    form.validateFields().then(values => {
      const params = values;
      params.ywKey = ywKey;
      if (values?.tbrq1) {
        params.tbrq1 = values.tbrq1.format('yyyy-MM-DD');
      }
      checkScsbsj(params).then((response) => {
        const { code, msg, body } = response;
        if (code === '900') {
          const html: any = [];
          const errorMsg = body?.bgdlist || [];
          if (body && errorMsg.length > 0) {
            errorMsgRef.current!.showModal(body);
            // errorMsg?.forEach((item: any, index: any) => {
            //   html.push(<span className="item" key={index}>{item}<br /></span>);
            // });
            // message.info(<>已核销手（账）册海关数据调整表中，存在以下报关单的监管方式为空的情况，请自行调整数据:<br /><div style={{textAlign:'left'}}>{html}</div></>); // 申报端返回数组，显示可优化

          } else if(Array.isArray(msg)) {
            const msghtml:any = []
            msg?.forEach((item: any, index: any) => {
              msghtml.push(<span className="item" key={index}>{item}<br /></span>);
            });
            message.info(<>校验异常信息如下:<br /><div style={{textAlign:'left'}}>{msghtml}</div></>); // 申报端返回数组，显示可优化
          } else {
            html.push(<span className="item">{msg}<br /></span>);
            message.info(<>校验异常信息如下:<br /><div style={{textAlign:'left'}}>{html}</div></>); // 申报端返回数组，显示可优化
          }
          // message.error(`校验异常信息如下: ${msg}`); // 申报端返回数组，显示可优化
        } else if (code === '200') {
          if (ywKey === 'MTS' || ywKey === 'MDT' || ywKey === 'DBTS' || ywKey === 'ZBYW_YSSB' || ywKey === 'ZBYW_FZCSB') {
            // 对免退税所有表单的数据合法性检查
            checkData(params);
          } else {
            // 跳转生成申报数据页面
            popupCreateData(params);
          }
        }
      })
    })
  }

  // 生成申报数据 3.1 对免退税所有表单的数据合法性检查
  const checkData = (param: any) => {
    let tmpFunc = checkCkshScsbsj;
    if ('MDT' == ywKey) {
      tmpFunc = mdtJcSjhfx;
    } else if ('MTS' == ywKey) {
      tmpFunc = mtsJcSjhfx;
    }
    (tmpFunc(param)).then((response) => { // async:false // 原方法同步 ???
      const { code, msg, body } = response;
      if (code !== '200') {
        if (msg) {
          message.error(msg);
        } else if (body) {
          // 弹出信息提示页面
          popupCreateWarningInfo({
            data: param,
            body
          });
          setFormData(param);
        }
      } else {
        // 跳转生成申报数据页面
        popupCreateData(param);
        setFormData(param);
      }
    })
  }

	// 生成申报数据 3.2 跳转生成申报数据页面
  const popupCreateData = (param: any) => {
    const curShowModal = refCreateData.current!.showModal;
    setFormData(param);
    setConfirmLoading(true);
    queryDsbsjLb(param || formData).then((response) => {
      setConfirmLoading(false);
      const { code, body, msg } = response;
      if (code === '200') {
        setCreateDataGrid(body);
        curShowModal(initParam);
      } else {
        message.error(msg);
      }
      // 关闭当前表单弹窗
      setModalVisible(false);
    })
  }

  // 生成申报数据 3.3 弹出信息提示页面
  const popupCreateWarningInfo = (params: any) => {
    const curShowModal = refExceptionGrid.current!.showModal;
    setExceptionData(params.body);
    curShowModal(params.data);
    // 关闭当前表单弹窗
    setModalVisible(false);
  }

  return (
    <Fragment>
      <Modal
        title="确认生成申报数据"
        centered
        destroyOnHidden
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X1}
        okButtonProps={{ className: 'dd_btn_focus' }}
        okText="确认"
        cancelText="关闭"
        onCancel={() => setModalVisible(false)}
        onOk={dataCreateSave}
        confirmLoading={confirmLoading}
        mask={{ closable: false }}
      >
        <DDBaseForm items={getFormItemsCreateData()} form={form} initialValues={{}} layoutType='vertical' />
      </Modal>
      <ExceptionGrid onRef={refExceptionGrid} data={exceptionData} ywKey={ywKey} onContinue={popupCreateData}/>
      <CreateData onRef={refCreateData} gridData={createDataGrid} showFlzl={showFlzl} formData={formData} />
      <ErrorMsgGrid onRef={errorMsgRef} />
    </Fragment>
  );
};
export default GeneratedForm;
