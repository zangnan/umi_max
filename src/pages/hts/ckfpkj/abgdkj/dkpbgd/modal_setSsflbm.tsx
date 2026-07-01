/**
 * 按报关单开具  设置税收分类编码
 */
import React, { useImperativeHandle, useState, useContext, useEffect, useRef } from 'react';
import { Modal, Button, message, Input, Form, Select, Table, Spin, Tooltip, Upload, Switch, Space } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import { useIntl } from 'umi';
import myUtil from '@/components/DDAssist/util';
import { exportssflbm, importssflbm, ssflbmsz, szwxtbz } from '@/pages/hts/services/htsApi';
import Wxspglfm from '@/pages/hts/pzgl/fppzgl/fm/wxspglfm';
import { FormInstance } from 'antd/es/form';
import DDAlert from '@/pages/hts/components/DDAlert';
import DDBaseGrid from '@/components/DDBaseGrid';
import { ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';
const EditableContext = React.createContext(null);
import importStyle from './importStyle.less';
import baseValidator from '@/components/DDAssist/field/baseValidator';


const { Dragger } = Upload;

const formList = new Set();

const beforeUpload = (file: any) => {
  if(!file.name.toUpperCase().endsWith(".XLS") && !file.name.toUpperCase().endsWith(".XLSX")) {
    message.info('上传文件必须是Excel文件。');
    return Upload.LIST_IGNORE;
  } else {
    return false;
  }
}

class EditableRow extends React.Component {
  constructor(props: any) {
    super(props);
  }
  formRef = React.createRef<FormInstance>();
  shouldComponentUpdate(nextProps: any) {
    const szwxtssflbmbz = myUtil.sessionStore.getItem('szwxtssflbmbz');
    if (szwxtssflbmbz) {
      return true;
    } else {
      let propsVal = myUtil.sessionStore.getItem('tmp_ckfp_setssflbm');
      if (propsVal) {
        let nextPropsVal = nextProps.children[0].props.record;
        if (propsVal.ckbgdhs === nextPropsVal.ckbgdhs) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
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
  onFocusShow,
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
    myUtil.sessionStore.setItem('tmp_ckfp_setssflbm', record);
    const values = await form.current.validateFields();
    handleSave({ ...record, ...values });
  };

  const otherSelect = (value: any) => {
    myUtil.sessionStore.setItem('tmp_ckfp_setssflbm', record);
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
    if (editType === 'InputFlbm') {
      childNode = <Form.Item name={dataIndex} style={{ margin: 0 }}
        rules={[{ required: true, message: `请输入${title}!` },]} >
        <Input onFocus={() => { onFocusShow(record) }} />
      </Form.Item>;
    } else if (editType === 'Input') {
      if (dataIndex === 'ggxh') {
        childNode = <Form.Item name={dataIndex} style={{ margin: 0 }} rules={[baseValidator.range2({ item:{name:'ggxh'},min: 0, max: 40 }),]} >
          <Input onPressEnter={save} onBlur={save} maxLength={50} />
        </Form.Item>;
      } else {
        childNode = <Form.Item name={dataIndex} style={{ margin: 0 }}>
          <Input onPressEnter={save} onBlur={save} />
        </Form.Item>;
      }
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
  const [modalVisibleExport, setModalVisibleExport] = useState<boolean>(false);
  const [modalData, setModalData] = useState<any>([]); // 传递的数据
  const [errList, setErrListt] = useState<any>([]);
  const [mainRef, setMainRef] = useState<any>([]); //主列表Ref

  const [fphwxxxqgzDm, setFphwxxxqgzDm] = useState<string>('1'); // 商品维护规则

  const [masker, setMasker] = useState<boolean>(false); // 蒙板

  const intl = useIntl(); // 提示信息
  //相同税收分类编码标志
  const [szwxtssflbmbz, setSzwxtssflbmbz] = useState<any>(false);

  const [bgdlx, setBgdlx] = useState<any>();
  const [bgdhs, setBgdhs] = useState<any>();

  const wxspglfmRef: any = useRef();
  // 开启
  const showModal = (param: any) => {
    const szwxtssflbmbz = param?.temp?.szwxtssflbmbz;
    setModalData(param?.data);
    setMainRef(param?.ref);
    setFphwxxxqgzDm(param?.fphwxxxqgzDm);
    setModalVisible(true);
    if (param?.ssflTemp != null) {
      setBgdlx(param?.ssflTemp.bgdlx);
      setBgdhs(param?.ssflTemp.bgdhs);
    }
    if('Y' == szwxtssflbmbz){
      setSzwxtssflbmbz(true);
      myUtil.sessionStore.setItem('szwxtssflbmbz', true);
    }else{
      setSzwxtssflbmbz(false);
      myUtil.sessionStore.setItem('szwxtssflbmbz', false);
    }

    myUtil.sessionStore.setItem('tmp_ckfp_setssflbm_tableSource', param?.data);
  };

  // 设置税收分类编码表格
  const columns = [
    { title: 'ckbgdhs', dataIndex: 'ckbgdhs', hidden: true },
    { title: '海关商品代码', dataIndex: 'hgckspDm', fixed: 'left', width: 110 },
    {
      title: '海关商品名称', dataIndex: 'hgspmc', fixed: 'left', width: 110, ellipsis: true, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '海关规格型号', dataIndex: 'ggxhhgsh', fixed: 'left', width: 150, ellipsis: true, hidden: fphwxxxqgzDm === '1' ? true : false, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    { title: '税收分类编码', dataIndex: 'sphfwssflhbbm', width: 210, editable: true, editType: 'InputFlbm' },
    {
      title: '税收分类名称', dataIndex: 'hwhlwmc', width: 110, ellipsis: true, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '简称', dataIndex: 'hwhlwjc', width: 100, ellipsis: true, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    { title: '简码', dataIndex: 'jm1', width: 100, editable: true, editType: 'Input', },
    { title: '发票规格型号', dataIndex: 'ggxh', editable: true, editType: 'Input', width: 120, },
    {
      title: '税率', dataIndex: 'sl1', width: 120, editable: true, editType: 'Select'
    },
    { title: '享受优惠政策', dataIndex: 'syyhzcbz', editable: true, editType: 'Select', width: 140 },
    { title: '优惠政策类型', dataIndex: 'fpssyhlxDm', editable: true, editType: 'Select', width: 150 },
    { title: '退（免）税类型', dataIndex: 'cksptssplxDm', editable: true, editType: 'Select', width: 160 },
  ];

  const errColumns = [
    { title: '序号', dataIndex: 'xh', width: 70 },
    { title: '失败原因', dataIndex: 'sbyy', width: 300 },
  ]
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
        onFocusShow: onFocusShow,
        index
      }),
    };
  });

  //将可编辑列表数据存入缓存
  const storageTempTableSource = (temp: any, index: any) => {
    let tempTableSource = myUtil.sessionStore.getItem('tmp_ckfp_setssflbm_tableSource');
    tempTableSource.splice(index, 1, temp);
    myUtil.sessionStore.setItem('tmp_ckfp_setssflbm_tableSource', tempTableSource);
  }

  // 下拉选择
  const selectChange = (param: any) => {
    const { index, dataIndex, value, formValue ,record} = param;
    const newData = [...modalData]
    if (szwxtssflbmbz) {
      let ccc: any = [];
      formList.forEach((item: any) => {
        if (item.current) {
          ccc.push(item);
        }
      })
      newData.forEach(async (item, index) => {
        const tempData = newData[index];
        const temp = { ...tempData, ...formValue };
        temp[index] = item;
        temp.sl1 = formValue.sl1;
        temp.hwhlwmc = record.hwhlwmc;
        temp.hwhlwjc = record.hwhlwjc;
        newData.splice(index, 1, temp);
        const form1: any = ccc[index];
        if (form1.current) {
          form1.current.setFieldsValue(temp);
        }
        // 数据存入缓存
        storageTempTableSource(temp, index);
      })
    }else{
      const tempData = newData[index];
      // 将下拉框是否可编辑放入到数据中
      const temp = { ...tempData, ...formValue };
      temp[dataIndex] = value;
      temp.sl1 = formValue.sl1;
      newData.splice(index, 1, temp);
      // 数据存入缓存
      storageTempTableSource(temp, index);
    }
    setModalData(newData);
  }

  // 文本框调整
  const handleSave = (param: any) => {
    const newData = [...modalData];
    if (szwxtssflbmbz) {
      let ccc: any = [];
      formList.forEach((item: any) => {
        if (item.current) {
          ccc.push(item);
        }
      })
      newData.forEach(async (item, index) => {
        // 将分类编码、名称、简称回显
        item.jm1 = param.jm1;
        item.ggxh = param.ggxh;
        newData.splice(index, 1, item);
        const form1: any = ccc[index];
        if (form1.current) {
          form1.current.setFieldsValue(item);
        }
        // 数据存入缓存
        storageTempTableSource(item, index);
      })
    } else {
      const index = newData.findIndex((item) => param.ckbgdhs === item.ckbgdhs);
      newData.splice(index, 1, param);
      // 数据存入缓存
      storageTempTableSource(param, index);
    }
    setModalData(newData);
  };

  // 税收分类编码文本框
  const onFocusShow = (record: any) => {
    myUtil.sessionStore.setItem('tmp_ckfp_setssflbm', record);
    wxspglfmRef.current!.showModal({ data: record, mainRef: onRef, zslx: 'abgdkj' });
  }

  // 赋码选中值回写
  const CallbackFmFunc = (param: any) => {
    const { record, data, fmMainRef } = param;
    const newData = [...modalData];
    if (szwxtssflbmbz) {
      let ccc: any = [];
      formList.forEach((item: any) => {
        if (item.current) {
          ccc.push(item);
        }
      })
      newData.forEach(async (item, index) => {
        // 将分类编码、名称、简称回显
        item.sphfwssflhbbm = record.sphfwssflhbbm;
        item.hwhlwmc = record.hwhlwmc;
        item.hwhlwjc = record.hwhlwjc;
        newData.splice(index, 1, item);
        const form1: any = ccc[index];
        if (form1.current) {
          form1.current.setFieldsValue(item);
        }
        // 数据存入缓存
        storageTempTableSource(item, index);
      })
    } else {
      const index = newData.findIndex((item: any) => data.ckbgdhs === item.ckbgdhs);
      const tempData = { ...newData[index] };
      // 将分类编码、名称、简称回显
      tempData.sphfwssflhbbm = record.sphfwssflhbbm;
      tempData.hwhlwmc = record.hwhlwmc;
      tempData.hwhlwjc = record.hwhlwjc;
      newData.splice(index, 1, tempData);
      // 数据存入缓存
      storageTempTableSource(tempData, index);
    }
    setModalData(newData);
    message.success(intl.formatMessage({ id: 'message_ckfp_fppz_fm_success' }));

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
    const ccc = [...formList];
    for (let index = 0; index < ccc.length; index++) {
      const form1: any = ccc[index];
      if (form1.current) {
        await form1.current.validateFields();
      }
    }
    const tempTableSource = myUtil.sessionStore.getItem('tmp_ckfp_setssflbm_tableSource');

    const temp = tempTableSource.filter((item: any) => !item.sphfwssflhbbm);
    if (temp.length > 0) {
      message.info(intl.formatMessage({ id: 'message_ckfp_abgdkj_setssflbm_check' }));
      return;
    }
    tempTableSource.forEach((item: any) => {
      const ckbgdhs = item.ckbgdhs.split(',');
      item.ckbgdhs = ckbgdhs;
      // 税率为1或者2时是 选择的免税或者不征税，将税率设置为0
      if (item.sl1 === 1 || item.sl1 === 2) {
        item.sl1 = 0;
      }
    });


    setMasker(true);
    await ssflbmsz({ ssflbmmxs: tempTableSource }).then((response: any) => {
      setMasker(false);
      const { code } = response;
      if (code === '200') {
        mainRef.current!.reload2();
        onclose();
        message.success(intl.formatMessage({ id: 'message_ckfp_abgdkj_setssflbm_success' }));
      }
    })
  };

  // 导入
  const importModal = async (param: any) => {
    const { unitRef, otherRef } = param;
    DDAlert.open({
      title: '导入Excel文件',
      infoType: 'warning',
      modalType: 'form',
      closeStatus: false,
      isFormContent: true,
      width: 720,
      content: <>
        <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label="导入Excel文件" name="file" valuePropName="fileList" rules={[{ required: true, message: '请选择上传的文件' }]} getValueFromEvent={(e: any) => { if (Array.isArray(e)) { return e; } return e && e.fileList; }}>
          <Dragger
            maxCount={1}
            showUploadList={true}
            beforeUpload={beforeUpload}
            itemRender={(originNode, file, currFileList, actions: { download: any, preview: any, remove: any }) => (
              <table className={importStyle.importTable}>
                <tr>
                  <th>文件名</th>
                  <th>文件大小</th> 
                  <th>状态</th>
                  <th>操作</th>
                </tr>
                <tr>
                  <td width='45%' className={importStyle.textCenter}>
                    <Tooltip title={file.name}>
                      <div className={importStyle.textName}>{file.name}</div>
                    </Tooltip>
                  </td>
                  <td width="20%" className={importStyle.textCenter}>{myUtil.text.formatNum(file.size?(file.size/1024):0, '0,0')}KB</td>
                  <td width="18%" className={importStyle.textCenter}><ClockCircleOutlined />&nbsp;待上传</td>
                  <td width="17%" className={importStyle.textCenter}><a onClick={()=>actions.remove()}>删除</a></td>
                </tr>
              </table>
            )}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或将文件拖拽到此区域</p>
          </Dragger>
        </Form.Item>
      </>,
      okCallbackFn: function (thisObj: any) {
        DDAlert.getForms().validateFields().then((values: any) => {
          thisObj.setState({ masker: true });
          const formData = new FormData();
          formData.append('file', values.file[0].originFileObj);
          formData.append('bgdlx', bgdlx);
          formData.append('bgdhs', bgdhs);
          formData.append('importMode', '1');
          importssflbm(formData).then(async (response) => {
            const { code, body, desc } = response;
            DDAlert.close();
            if (code === '200') {
              myUtil.sessionStore.setItem('tmp_ckfp_setssflbm_tableSource', body);
              await setModalData([{}]); // 字段有相同值时无法重新渲染，所以先置空
              setModalData(body);
              message.success("导入成功");
            } else if (code == '900') {
              message.error(desc);
              setModalVisibleExport(true);
              setErrListt(body.drycxx);
            } else {
              message.error(desc);
            }
          }).catch(() => {
            message.error('导入失败，请重新上传文件。');
          }).finally(() => {
            thisObj.setState({ masker: false });
          });
        });
      },
    });
  };

  // 导出
  const exportModal = async () => {
    const tempTableSource = myUtil.sessionStore.getItem('tmp_ckfp_setssflbm_tableSource');
    tempTableSource.forEach((item: any) => {
      const ckbgdhs = item.ckbgdhs.split(',');
      item.ckbgdhs = ckbgdhs;
    });
    setMasker(true);
    exportssflbm({ ssflbmmxs: tempTableSource }).then((response) => {
      const { code, body, desc } = response;
      if (code === '200') {
        const { blob, fileName } = body;
        message.success('导出成功！');
        myUtil.file.downloadExcel(blob, fileName);
      } else {
        message.error(desc);
      }
      setMasker(false);
    });
  };
  // 
  const setFlag = async (e: any) => {
    //调用接口修改
    const d= e?'Y':'N';
    const data = {szwxtssflbmbz :d};
    await szwxtbz(data).then((response) => {
      const {code,msg} = response;
      if(code == '200'){
        setSzwxtssflbmbz(e);
        myUtil.sessionStore.setItem('szwxtssflbmbz', e);
      }else{
        message.error(msg);
      }

    });

  }

  const onclose=async ()=>{
    setModalVisible(false);
    myUtil.sessionStore.clear('szwxtssflbmbz');
    await myUtil.code.getCodeFromServerT1('CODE_CKFP_ABGDKJ_GMFMC:01');
    setModalVisibleExport(false);
    setModalData([]);
    setErrListt([]);
    setMainRef([]);
    setFphwxxxqgzDm('1');
  }

  return (
    <>
      <Modal
        title="设置税收分类编码"
        destroyOnHidden={true}
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X4}
        wrapClassName="standard-modal-1"
        footer={
          <>
            <Button onClick={importModal} type="primary">导入</Button>
            <Button onClick={exportModal} type="primary">导出</Button>
            <Button onClick={onclose}>取消</Button>
            <Button onClick={saveModal} type="primary">确定</Button>
          </>
        }
        onCancel={onclose}
        className={`${masker ? 'dd_modal_show_masker' : ''}`}
        mask={{ closable: false }}
      >
        <Space style={{ float: 'right', marginBottom: 10 }}>
          <div>默认设置为相同税收分类编码</div>
          {myUtil.sessionStore.getItem('szwxtssflbmbz') ?
            <Switch defaultChecked onChange={setFlag} /> :
            <Switch onChange={setFlag} />}
        </Space>
        <br />
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <Table
            components={{
              body: {
                row: EditableRow,
                cell: EditableCell,
              }
            }}
            bordered
            rowKey='ckbgdhs'
            scroll={{ x: '1100px', y: `${document.documentElement.clientHeight - 200}px` }}
            dataSource={modalData}
            columns={mergedColumns}
            pagination={false}
          />
        </Spin>
        <Wxspglfm onRef={wxspglfmRef} />
      </Modal>
      <Modal
        title="数据检查异常疑点列表"
        destroyOnHidden={true}
        visible={modalVisibleExport}
        width={CONSTANTS.C_MODAL_WIDTH_X4}
        wrapClassName="standard-modal-1"
        footer={
          <>
            <Button onClick={() => setModalVisibleExport(false)}>关闭</Button>
          </>
        }
        onCancel={() => setModalVisibleExport(false)}
        mask={{ closable: false }}
      >
        <DDBaseGrid
          userDataSource={errList}
          components={true}
          columns={errColumns}
          pagination={false}
          scroll={{ x: '0px' }}
        />
      </Modal >
    </>
  );
};

export default Modalsphfwssflhbbm;
