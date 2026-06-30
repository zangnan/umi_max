import cktsUtil from '@/pages/hts/cktsUtil';
import formUtil from '@/components/DDForm/formUtil';
import React, {useState, useEffect, useImperativeHandle} from 'react';
import { Badge, Button, Modal, Spin, Form, message } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import UnitUtil from '@/components/DDBunit/unit_util';
import { queryJgbForm } from '@/pages/hts/services/htsApi';
import moment from 'moment';
import { itemType } from '@/components/DDForm/data.d';
import { useIntl } from 'umi';
import { baseEdit, callServiceCheck } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/components/DDAlert';
import myUtil from '@/components/DDAssist/util';
import { history } from 'umi';

export interface HwqdProps {
  onRef?: any;
  visible?: any;
}

const Hwqd: React.FC<HwqdProps> = ({
  onRef,
  visible = false,
}) => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(visible);
  const [masker2, setMasker2] = useState(false);
  const [myFormItems, setMyFormItems] = useState([]);
  const [unit_key, setUnit_key] = useState('');
  const [form] = Form.useForm();
  const [formName, setFormName] = useState('');
  const [record, setRecord] = useState({});
  const [cs, setCs] = useState({});
  const intl = useIntl();
  const [formSaveUrl, setFormSaveUrl] = useState(`/hx/ty/crud/saveOrUpdate`);
  const [formCheckUrl, setFormCheckUrl] = useState('');
  const [formSaveCheck, setFormSaveCheck] = useState('');
  const [unit_constant, setUnitConstant] = useState('');
  const [page_id, setPageId] = useState('');
  const [form_title, setFormTitle] = useState('');
  const [myFormSaveCheck] = useState(formSaveCheck);
  const [formItems, setFormItems] = useState<any>();
  const unit_lcswsx_dm = cktsUtil.getLcswsxDm(unit_constant);

  const [myConfig, setMyConfig] = useState([]);
  const [myFunc, setMyFunc] = useState([]);

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 改变表单配置
  const getFormConfiguration = (param: any, param2: any) => {
    const { sbywyzj, tablekey } = param;

    // 获取表单配置和func后初始化表单
    const setFormConfig = async (config: any, func: any) => {
      setUnit_key(config.unit_key);
      setFormSaveUrl(config.api_form_edit || `/hx/ty/crud/saveOrUpdate`);
      setFormCheckUrl(config.form_api_check);
      setFormSaveCheck(config.form_save_check);
      setUnitConstant(config.unit_constant);
      setPageId(config.page_id);
      setFormTitle(config.form_title);
      setFormName(`${config.page_id}_form`);
      const form_items  = config.form_items;
      for(let i = 0; i < form_items.length; i++){
        if (form_items[i].name === 'tse' && config.unit_key === 'MTS_ZXSB_SB_MTS_TSJH_G') {
          form_items[i].readOnly = false;
        }
        if(form_items[i].name === 'ssq' || form_items[i].name === 'sbpc' || form_items[i].name === 'sbxh' || form_items[i].name === 'glh'){
          if (config.unit_key === 'MTS_ZXSB_SB_MTS_TSJH_G') {
            form_items[i].disabled = true;
          } else {
            form_items[i].readOnly = true;
          }
        }
      }
      const newForm = formUtil.init({
        items: form_items,
        func: func,
      });
      setFormItems(newForm);
      initCode(newForm)

      setMyConfig(config);
      setMyFunc(func);
      // 查询表单信息
      await getQueryJgbForm(param, param2, newForm, config, func);
    }

    // 设置表单func
    const setFun = (pFrm: any) => {
      const func = pFrm.default;
      setFormConfig(config, func);
    }
    let completeTableKey: string;
    let tmpTableKey = tablekey.substr(0, tablekey.length - 2) + '_GCB';
    let tmpSbywyzj = sbywyzj
    if (sbywyzj.indexOf('ZMKJ_') > -1) { // eg: ZMKJ_CKHWZNX => ZMKJ
      tmpSbywyzj = sbywyzj.substr(0, 4);
    }
    if (tablekey.indexOf('ZXSB_SB_HGSPTZ_') > -1 || tablekey.indexOf('ZXSB_SB_CKSH_') > -1) { // eg: MTS_TSZL___ZXSB_SB_HGSPTZ_GCB
      completeTableKey = tmpSbywyzj + '_TSZL___' + tmpTableKey;
    } else if (tablekey.indexOf('ZXSB_ZM_TYYBSWTS_') > -1) { // eg: ZMKJ_WM___ZXSB_ZM_TYYBSWTS_GCB
      const qylx = cktsUtil.sys.enterpriseType();
      completeTableKey = tmpSbywyzj + '_' + qylx + '___' + tmpTableKey;
    } else { // eg: MTS___ZXSB_SB_MTS_TSSB_GCB
      completeTableKey = tmpSbywyzj + '___' + tmpTableKey;
    }
    const config = require(`@/pages/hts/dditax.ckts.from/${completeTableKey}/auto_config`)?.default;
    // 打包后require结构发生变化，采用不同引用方式
    if (process.env.NODE_ENV === 'production') {
      const func = require(`@/pages/hts/dditax.ckts.from/${completeTableKey}/f`);
      setFun(func);
    } else if (process.env.NODE_ENV === 'development') {
      const aa = require(`@/pages/hts/dditax.ckts.from/${completeTableKey}/f`);
      aa.then((Frm: any) => { setFun(Frm); });
    }
  };

  const showModal = async (param: any, param2: any) => {
    setRecord(param);
    setCs(param2);
    // 获取对应表单并配置
    getFormConfiguration(param, param2);
  }

  // 整合列表、表单、筛选中的码表参数
  const initCode = (newForm: any) => {
    // 整合列表、表单、筛选中的码表参数
    const param = UnitUtil.code.getCodeTableParam({
      formItems: [...(newForm || [])],
    });

    // 获取码表接口promise
    const promiseArr = myUtil.code.getCodeTablePromise(param);
    // 整合表单、筛选中的treeSelect参数
    const param1 = UnitUtil.treeCode.getTreeCodeTableParam({
      formItems: [...(newForm || [])],
    });
    const promiseArr1 = UnitUtil.treeCode.getTreeCodeTablePromise(param1);
    promiseArr1.forEach((item: any) => {
      promiseArr.push(item);
    })
    // 获取码表
    Promise.all(promiseArr).then(() => {
      // do nothing
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      const formItemNew = UnitUtil.code.initFormItemsCodeTable([...(newForm || [])]);
      setMyFormItems(formItemNew);
    });
  }

  const getQueryJgbForm = (param: any, param2: any, newForm: any, config: any, func: any) =>{
    let obj: object = {
      sbxh: param.sbxh,
      ssq: param2.ssq,
      tableKey: config.unit_key.substr(0, config.unit_key.length - 2) + '_J',
    }
    const qylx = cktsUtil.sys.enterpriseType();
    if (qylx === 'WM') {
      obj = {
        sbxh: param.sbxh,
        ssq: param2.ssq,
        tableKey: config.unit_key.substr(0, config.unit_key.length - 2) + '_J',
        sbpc: param2.sbpc
      }
    }
    queryJgbForm(obj).then((res: any)=>{
      if(res.code == '200') {
        const vBody = res.body;
        const formValue = { ...vBody };
        // 表单特殊类型处理
        newForm.forEach((item: any) => {
          if (formValue[item.name]?.constructor === String) {
            formValue[item.name] = formValue[item.name]?.trim() || '';
          }
          if (item.type === itemType.DatePicker && formValue[item.name]) {  // 日期类型
            const reg1 = /^((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))0229))$/;
            const reg2 = /^((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29))$/;
            if (new RegExp(reg1).test(formValue[item.name]) || new RegExp(reg2).test(formValue[item.name])) {
              // 后端返回 yyyymmdd
              formValue[item.name] = moment(new Date(formValue[item.name]))
            } else {
              // 后端返回时间戳格式
              if (formValue[item.name]?.constructor === String) {
                formValue[item.name] = moment(new Date(Number(formValue[item.name])));
              } else {
                formValue[item.name] = moment(new Date(formValue[item.name]));
              }
            }
          }
          if (item.type === itemType.InputNumber && formValue[item.name]?.constructor === String) {
            formValue[item.name] = Number(formValue[item.name]);
          }
          if (item.type === itemType.Input && formValue[item.name]?.constructor === String && (formValue[item.name] === null || formValue[item.name]?.trim() === '')) {
            formValue[item.name] = '';
          }
          if (item.type === itemType.Select && item.mode === 'multiple') {
            if (formValue[item.name]) {
              formValue[item.name] = formValue[item.name]?.split(',') || [];
            } else {
              formValue[item.name] = [];
            }
          }
        })
        if (Object.keys(formValue).length !== 0) {
          form.setFieldsValue(formValue);
        } else {
          form.resetFields();
          message.error(intl.formatMessage({ id: 'message_query_error' }));
          return
        }
        if (func.initEditForm) {
          func.initEditForm({
            form,
            page_id: config.page_id,
            unit_key: config.unit_key,
            handleModalVisible,
            myFormItems: config.form_items,
            setMyFormItems,
            unit_lcswsx_dm,
          });
        } else {
          handleModalVisible(true);
        }
      } else {
        message.error(intl.formatMessage({ id: 'message_query_error' }));
      }
    })
  }


  // 新建、编辑保存
  const handleSave = () => {
    // formSaveUrl = `/hx/ty/crud/saveOrUpdate/${cs.ywKey}_${record.tablekey}`;
    // 表单特殊类型处理
    formItems.forEach((item: any) => {
      // 去除后端空格
      if (item.type === itemType.Input && typeof form.getFieldValue(item.name) === 'string') {
        let itemValueTmp = {};
        itemValueTmp[item.name] = form.getFieldValue(item.name)?.trim() || '';
        form.setFieldsValue(itemValueTmp);
      }
    })
    form.validateFields().then(values => {
      // 表单特殊类型处理
      formItems.forEach((item: any) => {
        if (item.type === itemType.DatePicker && values[item.name]) {  // 日期类型
          values[item.name] = moment(values[item.name]).format('YYYY-MM-DD');
        }
        if (item.type === itemType.Select && item.mode === 'multiple') {
          if (values[item.name]) {
            values[item.name] = values[item.name].join(',');
          }
        }
        if (typeof values[item.name] === 'string') {
          values[item.name] = values[item.name]?.trim() || '';
        }
      })
      if (unit_lcswsx_dm) {
        values.lcswsxDm = unit_lcswsx_dm;
      }
      const param: any = {
        key: unit_key.substr(0, unit_key.length -2) + '_J',
        // formType: 'edit',
        ...values,
        // data: values,
      }
      // 是否执行后端校验
      let Check = [
        'MDT_ZXSB_SB_MDT_TLHY_G', 'MDT_ZXSB_SB_MDT_XTHH_G', 'MDT_ZXSB_SB_MDT_STZC_G', 'MDT_ZXSB_SB_MDT_SYYK_G',
        'MDT_ZXSB_SB_MDT_YFSJ_G', 'MDT_ZXSB_SB_MDT_HKYS_QS_G', 'MDT_ZXSB_SB_MDT_GJYS_G', 'MDT_ZXSB_SB_MDT_KYHJ_G','MDT_ZXSB_SB_MDT_TSJH_G',
        'MDT_ZXSB_SB_MDT_TSSB_G', 'MTS_ZXSB_SB_MTS_YSFWCK_G', 'MTS_ZXSB_SB_MTS_TZSB_G', 'MTS_ZXSB_SB_MTS_TSSB_G',
        'MTS_ZXSB_SB_MTS_TSJH_G', 'TSZL_ZXSB_SB_CKSH_G', 'TSZL_ZXSB_SB_BNSH_G', 'TSZL_ZXSB_SB_MDT_CYSM_G', 'TSZL_ZXSB_SB_HGSPTZ_G',
        'QTYW_ZXSB_QT_QYGLLBFPPD_G', 'ZGBA_ZXSB_SB_MDT_XTHHZG_G', 'ZBYW_ZXSB_SB_GJ_SBMX_G', 'ZXSB_BADZ_GWHT'
      ];
      // 如果未配置
      let needCheck = myFormSaveCheck;
      if (myFormSaveCheck === undefined) {
        if (!(Check.indexOf(unit_key) < 0)) {
          needCheck = true;
        }
      }
      // 表单提交前调用
      if (myFunc.formBeforeSubmit) {
        let result;
        const beforeResult = myFunc.formBeforeSubmit({
          form,
          page_id,
          unit_key,
          unitRef: myFunc.unitRef,
          handleModalVisible,
          myFormItems,
          setMyFormItems,
          unit_lcswsx_dm,
        });
        result = beforeResult !== undefined ? beforeResult : true;
        if (!result) {
          return
        }
      }
      if (needCheck) {
        setMasker2(true);
        callServiceCheck({ unit_key: unit_key + '_CHECK', data: values, url: formCheckUrl }).then((response1: any) => {
          const { code, msg, desc } = response1;
          if (code === '200') {
            return baseEdit({ data: param, url: formSaveUrl });
          } else if (code === '901') {
            DDAlert.open({
              title: '系统提示',
              info: desc,
              content: msg,
              modalType: 'confirm',
              infoType: 'info',
              okText: '继续',
              cancelText: '关闭',
              okCallbackFn: function (thisObj: any) {
                DDAlert.close();
                closeModal();
                baseEdit({ data: param, url: formSaveUrl }).then((response) => {
                  handleSave2(response);
                });
              },
              cancelCallbackFn: function () {
              }
            });
          } else {
            message.error(msg);
          }
          setMasker2(false);
          // message.error(msg);
          // throw new Error(desc);
        }).then((response) => {
          if (response) {
            handleSave2(response);
          }
        }).catch((error) => {
          message.error(error.message);
        });
      } else {
        setMasker2(true);
        baseEdit({ data: param, url: formSaveUrl }).then((response) => {
          handleSave2(response);
        })
      }
    })
  }

  // 新建、编辑保存
  const handleSave2 = (response: any) => {
    const { code, desc } = response;
    setMasker2(false);
    if (code === '200') {
      message.success(desc);
      closeModal()
    } else {
      message.error(desc);
    }
  }

  const closeModal = () => {
    handleModalVisible(false)
    const form_items  = myConfig.form_items;
    for(let i=0;i<form_items.length;i++){
      if(form_items[i].name === 'ssq' || form_items[i].name === 'sbpc' || form_items[i].name === 'sbxh' || form_items[i].name === 'glh'){
        if (unit_key === 'MTS_ZXSB_SB_MTS_TSJH_G') {
          form_items[i].disabled = false;
        } else {
          form_items[i].readOnly = false;
        }
      }
    }
  }

  return(
    <Modal
      title={`${form_title}编辑`}
      destroyOnHidden={true}
      visible={createModalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      wrapClassName="standard-modal-1"
      onCancel={closeModal}
      onOk={handleSave}
    >
    <Spin tip="Loading..." spinning={masker2} delay={100} key='DDBunit2DDBaseForm'>
      <DDBaseForm otherParam={{
                  unit_key,
      }} items={myFormItems} form={form} name={formName} />
    </Spin>
  </Modal>
  )
};

export default Hwqd;
