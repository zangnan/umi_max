/**
 * 按报关单开具  设置税收分类编码
 */
import React, { useImperativeHandle, useState, useContext, useEffect, useRef } from 'react';
import { Modal, Button, message, Input, Form, Select, Table, Spin, Tooltip } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import { useIntl } from 'umi';
import myUtil from '@/components/DDAssist/util';
import { ssflbmsz } from '@/pages/hts/services/htsApi';
import Wxspglfm from '@/pages/hts/pzgl/fppzgl/fm/wxspglfm';
import { FormInstance } from 'antd/es/form';
import DDFormList from '@/pages/hts/components/DDForm/DDFormList';
const EditableContext = React.createContext(null);

const formList = new Set();

class EditableRow extends React.Component {
  constructor(props: any) {
    super(props);
  }
  formRef = React.createRef<FormInstance>();
  shouldComponentUpdate(nextProps: any) {
    return true;
    let tmp_ckfp_setssflbm_key = myUtil.sessionStore.getItem('tmp_ckfp_setssflbm_key');
    let nextPropsVal = nextProps.children[0].props.record;
    if (tmp_ckfp_setssflbm_key) {
      if ((tmp_ckfp_setssflbm_key === nextPropsVal.ckbgdhs)) {
        return true;
      }
      return false;
    } else {
      return true;
    }
  }
  render() {
    if (this.formRef) {
      formList.add(this.formRef);
    }
    return (
      <Form ref={this.formRef} component={false}>
        <EditableContext.Provider value={this.formRef}>
          < tr {...this.props} />
        </EditableContext.Provider>
      </Form>
    )
  }
}

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  editType,
  selectChange,
  index,
  ...restProps
}) => {
  const form: any = useContext(EditableContext);

  useEffect(() => {
    form.current.setFieldsValue(record);
    if (record) {
      if (record.syyhzcbz === '1') {
        if (record.fpssyhlxDm === '1') {
          record.sl1 = 1;
          record.sl1Disabled = true;
        } else if (record.fpssyhlxDm === '2') {
          record.sl1 = 2;
          record.sl1Disabled = true;
        } else {
          record.sl1Disabled = false;
        }
      } else {
        record.sl1Disabled = false;
      }
      // 享受优惠政策
      if (record.syyhzcbz === '1') {
        record.fpssyhlxDmDisabled = false;
      } else {
        record.fpssyhlxDmDisabled = true;
      }
    }
  }, [record]);

  const save = async () => {
    const values = await form.current.validateFields();
    handleSave({ ...record, ...values });
  };

  const otherSelect = (value: any) => {
    const formValue = form.current.getFieldsValue();
    // 享受优惠政策选择
    if ("syyhzcbz" === dataIndex) {
      // 享受优惠政策选择1,优惠政策类型可编辑，其他，优惠政策类型不可编辑
      if ("1" === value) {
        formValue.fpssyhlxDmDisabled = false;
      } else {
        formValue.fpssyhlxDmDisabled = true;
        formValue.fpssyhlxDm = '';
      }
    } else if ("fpssyhlxDm" === dataIndex && "1" === formValue.syyhzcbz) {
      // 享受优惠政策选择是，优惠政策类型类型
      if (value) {
        formValue.sl1Disabled = true;
        if (value === '2') {
          formValue.sl1 = 2;
        } else {
          formValue.sl1 = 1;
        }
      } else {
        formValue.sl1Disabled = false;
      }
    }
    selectChange({ value, dataIndex, index, formValue, record })
  };

  let childNode = children;
  if (editable) {
    if (editType === 'Input') {      
      childNode = <Form.Item name={dataIndex} style={{ margin: 0 }}>
        <Input onPressEnter={save} onBlur={save} />
      </Form.Item>;
    } else if (editType === 'Select') {
      if ("sl1" === dataIndex) {
        childNode = <Form.Item name={dataIndex} style={{ margin: 0, width: 100 }}
          rules={[{ required: true, message: `请输入${title}!` },]} >
          <Select onChange={(value: any) => { otherSelect(value) }} disabled={record.sl1Disabled}>
            <Select.Option key='0' value={0}>0%</Select.Option>
            <Select.Option key='3' value={0.03}>3%</Select.Option>
            <Select.Option key='6' value={0.06}>6%</Select.Option>
            <Select.Option key='9' value={0.09}>9%</Select.Option>
            <Select.Option key='13' value={0.13}>13%</Select.Option>
            <Select.Option key='MS' value={1} disabled>免税</Select.Option>
            <Select.Option key='BZS' value={2} disabled>不征税</Select.Option>
          </Select>
        </Form.Item>;
      } else if ("syyhzcbz" === dataIndex) {
        // 享受优惠政策
        childNode = <Form.Item name={dataIndex} style={{ margin: 0, width: 120 }}
          rules={[{ required: true, message: `请输入${title}!` },]} >
          <Select onChange={(value: any) => { otherSelect(value) }} disabled={record.syyhzcbzDisabled} >
            <Select.Option key='1' value='1'>是</Select.Option>
            <Select.Option key='0' value='0'>否</Select.Option>
          </Select>
        </Form.Item>;
      } else if ("fpssyhlxDm" === dataIndex) {
        // 优惠政策类型
        childNode = <Form.Item name={dataIndex} style={{ margin: 0, width: 120 }}
          rules={record.syyhzcbz === '1' ? [{ required: true, message: `请输入${title}!` },] : []}>
          <Select onChange={(value: any) => { otherSelect(value) }} disabled={record.fpssyhlxDmDisabled}>
            <Select.Option key='1' value='1'>免税</Select.Option>
            <Select.Option key='2' value='2'>不征税</Select.Option>
          </Select>
        </Form.Item>;
      } else {
        childNode = <Form.Item name={dataIndex} style={{ margin: 0, width: 130 }}
          rules={[{ required: true, message: `请输入${title}!` },]} >
          <Select onChange={(value: any) => { otherSelect(value) }} >
            <Select.Option key='1' value='1'>退税</Select.Option>
            <Select.Option key='2' value='2'>免税</Select.Option>
            <Select.Option key='3' value='3'>征税</Select.Option>
          </Select>
        </Form.Item>;
      }
    }
  }
  return <td id={dataIndex} {...restProps}>{childNode}</td>;
};


export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
}

const Modalsphfwssflhbbm: React.FC<DDModalGridProps> = ({ onRef, visible = false }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);

  const [modalData, setModalData] = useState<any>([]); // 传递的数据

  const [mainRef, setMainRef] = useState<any>([]); //主列表Ref

  const [fphwxxxqgzDm, setFphwxxxqgzDm] = useState<string>('1'); // 商品维护规则

  const [masker, setMasker] = useState<boolean>(false); // 蒙板

  const intl = useIntl(); // 提示信息

  const wxspglfmRef: any = useRef();

  const DDFormListRef: any = useRef();

  // 开启
  const showModal = (param: any) => {
    param?.data.forEach((item: any) => {
      item.sl1Disabled = false;
      item.syyhzcbzDisabled = false;
      item.fpssyhlxDmDisabled = false;
      item.fpssyhlxDmRequired = true;

      if (item.syyhzcbz === '1') {
        if (item.fpssyhlxDm === '1') {
          item.sl1 = 1;
          item.sl1Disabled = true;
        } else if (item.fpssyhlxDm === '2') {
          item.sl1 = 2;
          item.sl1Disabled = true;
        } else {
          item.sl1Disabled = false;
        }
      } else {
        item.sl1Disabled = false;
      }
      // 享受优惠政策
      if (item.syyhzcbz === '1') {
        item.fpssyhlxDmDisabled = false;
        item.fpssyhlxDmRequired = true;
      } else {
        item.fpssyhlxDmDisabled = true;
        item.fpssyhlxDmRequired = false;
      }
    });
    setModalData(param?.data);
    setMainRef(param?.ref);
    setFphwxxxqgzDm(param?.fphwxxxqgzDm);
    setModalVisible(true);
  };

  // 税率列表
  const sl1vList = [
    { key: '0', value: 0, name: '0%' },
    { key: '3', value: 0.03, name: '3%' },
    { key: '6', value: 0.06, name: '6%' },
    { key: '9', value: 0.09, name: '9%' },
    { key: '13', value: 0.13, name: '13%' },
    { key: 'MS', value: 1, name: '免税', disabled: true },
    { key: 'BZS', value: 2, name: '不征税', disabled: true },
  ];
  // 享受优惠政策
  const syyhzcbzList = [
    { key: '1', value: '1', name: '是' },
    { key: '0', value: '0', name: '否' },
  ];
  // 优惠政策类型
  const fpssyhlxDmList = [
    { key: '1', value: '1', name: '免税' },
    { key: '2', value: '2', name: '不征税' },
  ];
  // 退（免）税类型
  const tmslxList = [
    { key: '1', value: '1', name: '退税'},
    { key: '2', value: '2', name: '免税'},
    { key: '3', value: '3', name: '征税'},
  ]

  const changeSelect = (params: any) => {
    const { value, option, form, index, rowIndex, dataIndex } = params;
    const formValue = form.getFieldsValue().formList[index];
    // 享受优惠政策选择
    if ("syyhzcbz" === dataIndex) {
      // 享受优惠政策选择1,优惠政策类型可编辑，其他，优惠政策类型不可编辑
      if ("1" === value) {
        formValue.fpssyhlxDmDisabled = false;
        formValue.fpssyhlxDmRequired = true;
      } else {
        formValue.fpssyhlxDmDisabled = true;
        formValue.fpssyhlxDmRequired = false;
        formValue.sl1Disabled = false;
        formValue.fpssyhlxDm = '';
        formValue.sl1 = '';
      }
    } else if ("fpssyhlxDm" === dataIndex && "1" === formValue.syyhzcbz) {
      // 享受优惠政策选择是，优惠政策类型类型
      if (value) {
        formValue.sl1Disabled = true;
        if (value === '2') {
          formValue.sl1 = 2;
        } else {
          formValue.sl1 = 1;
        }
      } else {
        formValue.sl1Disabled = false;
      }
    }
    selectChange({ value, dataIndex, rowIndex, formValue })
  }
  // 设置税收分类编码表格
  const columns = [
    { title: 'ckbgdhs', dataIndex: 'ckbgdhs', hidden: true },
    { title: '海关商品代码', dataIndex: 'hgckspDm', fixed: 'left', width: 110, readOnly: true},
    { title: '海关商品名称', dataIndex: 'hgspmc', fixed: 'left', width: 110, readOnly: true, ellipsis: true },
    { title: '海关规格型号', dataIndex: 'ggxhhgsh', fixed: 'left', width: 150, readOnly: true, ellipsis: true, hidden: fphwxxxqgzDm === '1' ? true : false },
    { title: '税收分类编码', dataIndex: 'sphfwssflhbbm', width: 210, onFocus: (params: any) => {
        const { record } = params;
        myUtil.sessionStore.setItem('tmp_ckfp_setssflbm_key', record.ckbgdhs);
        wxspglfmRef.current!.showModal({ data: record, mainRef: onRef, zslx: 'abgdkj' });
      }
    },
    { title: '税收分类名称', dataIndex: 'hwhlwmc', width: 110, ellipsis: true, readOnly: true },
    { title: '简称', dataIndex: 'hwhlwjc', width: 100, ellipsis: true, readOnly: true },
    { title: '简码', dataIndex: 'jm1', width: 100, editable: true, editType: 'Input', },
    { title: '发票规格型号', dataIndex: 'ggxh', editable: true, editType: 'Input', width: 120, },
    { title: '税率', dataIndex: 'sl1', width: 120, editable: true, editType: 'Select', option: sl1vList, onChange: (params: any) => {changeSelect(params)}, rules: [
        { required: true, message: '请选择税率' },
      ]
    },
    { title: '享受优惠政策', dataIndex: 'syyhzcbz', editable: true, editType: 'Select', width: 140, option: syyhzcbzList, onChange: (params: any) => {changeSelect(params)}, rules: [
        { required: true, message: '请选择享受优惠政策' },
      ]
    },
    { title: '优惠政策类型', dataIndex: 'fpssyhlxDm', editable: true, editType: 'Select', width: 150, option: fpssyhlxDmList, onChange: (params: any) => {changeSelect(params)}, rules: [
        { required: true, message: '请选择优惠政策类型' },
      ]
    },
    { title: '退（免）税类型', dataIndex: 'cksptssplxDm', editable: true, editType: 'Select', width: 160, option: tmslxList, onChange: (params: any) => {changeSelect(params)}, rules: [
        { required: true, message: '请选择退（免）税类型' },
      ]
    },
  ];

  // 隐藏列
  const myColumns = columns.filter((col: any) => {
    return (!(col.hidden && col.hidden !== false));
  })

  // 设置列
  const mergedColumns = myColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any, index: any) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        editType: col.editType,
        handleSave: handleSave,
        selectChange: selectChange,
        index
      }),
    };
  });

  // 下拉选择
  const selectChange = (param: any) => {
    const { rowIndex, dataIndex, value, formValue } = param;
    const newData = [...modalData]
    const tempData = newData[rowIndex];
    // 将下拉框是否可编辑放入到数据中
    const temp = { ...tempData, ...formValue };
    temp[dataIndex] = value;
    temp.sl1 = formValue.sl1;
    newData.splice(rowIndex, 1, temp);
    setModalData(newData);
  }

  // 文本框调整
  const handleSave = (param: any) => {
    myUtil.sessionStore.setItem('tmp_ckfp_setssflbm_key', param.ckbgdhs);
    const newData = [...modalData];
    const index = newData.findIndex((item) => param.ckbgdhs === item.ckbgdhs);
    newData.splice(index, 1, param);
    setModalData(newData);
  };
  // 税收分类编码文本框
  const onFocusShow = (record: any) => {
    myUtil.sessionStore.setItem('tmp_ckfp_setssflbm_key', record.ckbgdhs);
    wxspglfmRef.current!.showModal({ data: record, mainRef: onRef, zslx: 'abgdkj' });
  }

  // 赋码选中值回写
  const CallbackFmFunc = (param: any) => {
    const { record, data, fmMainRef } = param;
    const newData = [...modalData];
    const index = newData.findIndex((item: any) => data.ckbgdhs === item.ckbgdhs);
    const tempData = newData[index];
    // 将分类编码、名称、简称回显
    tempData.sphfwssflhbbm = record.sphfwssflhbbm;
    tempData.hwhlwmc = record.hwhlwmc;
    tempData.hwhlwjc = record.hwhlwjc;
    newData.splice(index, 1, tempData);
    setModalData(newData);
    message.info(intl.formatMessage({ id: 'message_ckfp_fppz_fm_success' }));
    // 关闭赋码弹窗
    fmMainRef.current.closeModal();
  }

  useImperativeHandle(onRef, () => {
    return {
      showModal,
      CallbackFmFunc,
    };
  });

  const saveModal = async () => {
    DDFormListRef.current!.form.validateFields().then(() => {
      const temp = modalData.filter((item: any) => !item.sphfwssflhbbm);
      if (temp.length > 0) {
        message.info(intl.formatMessage({ id: 'message_ckfp_abgdkj_setssflbm_check' }));
        return;
      }
      modalData.forEach((item: any) => {
        item.sl1Disabled = false;
        item.syyhzcbzDisabled = false;
        item.fpssyhlxDmDisabled = false;
        const ckbgdhs = item.ckbgdhs.split(',');
        item.ckbgdhs = ckbgdhs;
        // 税率为1或者2时是 选择的免税或者不征税，将税率设置为0
        if (item.sl1 === 1 || item.sl1 === 2) {
          item.sl1 = 0;
        }
      });
      setMasker(true);
      ssflbmsz({ ssflbmmxs: modalData }).then((response: any) => {
        setMasker(false);
        const { code } = response;
        if (code === '200') {
          mainRef.current!.reload2();
          setModalVisible(false);
          message.success(intl.formatMessage({ id: 'message_ckfp_abgdkj_setssflbm_success' }));
        }
      })
    })

  };

  return (
    <>
      <Modal
        title="设置税收分类编码"
        destroyOnHidden={true}
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_MAX}
        wrapClassName="standard-modal-1"
        footer={
          <>
            <Button onClick={() => setModalVisible(false)}>取消</Button>
            <Button onClick={saveModal} type="primary">确定</Button>
          </>
        }
        onCancel={() => setModalVisible(false)}
        className={`${masker ? 'dd_modal_show_masker' : ''}`}
        mask={{ closable: false }}
      >
        {/* <Spin tip="Loading..." spinning={masker} delay={100}>
          <Table
            components={{
              body: {
                row: EditableRow,
                cell: EditableCell,
              }
            }}
            bordered
            rowKey='ckbgdhs'
            scroll={{ x: '1100px' }}
            dataSource={modalData}
            columns={mergedColumns}
            pagination={false}
          />
        </Spin> */}
        <DDFormList onRef={DDFormListRef} cotArr={modalData} columns={mergedColumns} addBtn={false} />
        <Wxspglfm onRef={wxspglfmRef} />
      </Modal>
    </>
  );
};

export default Modalsphfwssflhbbm;
