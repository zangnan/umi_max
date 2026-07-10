/**
 * 按报关单开具  设置购买方
 */
import React, { useImperativeHandle, useState, useContext ,useEffect} from 'react';
import { Modal, Button, Form, message, Select, Input, Table, Divider, Spin, Tooltip, Upload, Space, Switch, Checkbox } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import { exportgmf, gmfxxsz, importgmf, queryParams, szwxtbz, gmfxxcx, queryPager, downloadTemplate } from '@/pages/hts/services/htsApi';
import myUtil, { intl as intl2 } from '@/components/DDAssist/util';
import { FormInstance } from 'antd/es/form';
import DDAlert from '@/pages/hts/components/DDAlert';
import { ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';
import DDBaseGrid from '@/components/DDBaseGrid';
const EditableContext = React.createContext(null);
export const GmfContext = React.createContext('GmfContext');
import baseValidator from '@/components/DDAssist/field/baseValidator';
import importStyle from './importStyle.less';

const { Dragger } = Upload;

const formList = new Set();

const gmfFunc: any = {
  // 加载时蒙板使用
  refUnit: React.createRef(),
};

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
    const szwxtgmfbz = myUtil.sessionStore.getItem('szwxtgmfbz');
    if (szwxtgmfbz) {
      return true;
    } else {
      let nextPropsVal = nextProps.children[0].props.record;
      let props = this.props.children[0].props.record;
      if (nextPropsVal.ghfnsrmc != props.ghfnsrmc ||
        nextPropsVal.ghfqyjc != props.ghfqyjc ||
        nextPropsVal.ghfshxydm != props.ghfshxydm ||
        nextPropsVal.ghfkhyxmc != props.ghfkhyxmc ||
        nextPropsVal.ghfyhzh != props.ghfyhzh ||
        nextPropsVal.ghfdz != props.ghfdz ||
        nextPropsVal.ghflxdh != props.ghflxdh ||
        nextPropsVal.jwshrmc != props.jwshrmc ||
        nextPropsVal.ckhth != props.ckhth) {
        return true;
      }
      return false;
    }
  }
  render() {
    if (this.formRef) {
      formList.add(this.formRef);
    }
    return (
      <Form ref={this.formRef} component={false} initialValues={{ ...this.props.children[0].props.record }}>
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
  addItem,
  ...restProps
}) => {
  const form: any = useContext(EditableContext);
  const GmfContextInfo: any = useContext(GmfContext);

  const save = async () => {
    const values = await form.current.validateFields();
    handleSave({ ...record, ...values }, values);
  };

  const buttonSave = () => {
    const tjghfnsrmc = form.current.getFieldValue('tjghfnsrmc');
    let len = 0;
    for (let i = 0; i < tjghfnsrmc.length; i++) {
      if (tjghfnsrmc.charCodeAt(i) > 127 || tjghfnsrmc.charCodeAt(i) == 94) { // 中文字符占3位
        len += 3;
      } else {
        len++;
      }
    }
    if(len >= 150){
      return;
    } else {
      addItem(form, GmfContextInfo);
    }
  };

  const validator = {
    ghfshxydm01: () =>{
      const validator = (_rule: any, values: any) => {  
        if (values) {
          if(values.length < 15) {
            return Promise.reject(new Error('长度不能小于15位！'));
          } else if (values.length > 20) {
            return Promise.reject(new Error('长度不能大于20位！'));
          }
          return Promise.resolve();
        }
        return Promise.resolve();
      }
      return { validator };
    },
    ghfyhzh01: () => {
      const validator = async (_rule: any, values: any) => {
        if (values) {
          if(values.length < 15) {
            return Promise.reject(new Error('长度不能小于15位！'));
          } else if (values.length > 25) {
            return Promise.reject(new Error('长度不能大于25位！'));
          }
          return Promise.resolve();
        }
        return Promise.resolve();
      }
      return { validator };
    },
  }

  let childNode = children;
  if (editable) {
    if (editType === 'InputHidden') {
      childNode = <Form.Item name={dataIndex} style={{ margin: 0 }} >
        <Input hidden />
      </Form.Item>;
    } else if (editType === 'Input') {
      if(dataIndex === 'ghfshxydm') {
        childNode = <Form.Item name={dataIndex} style={{ margin: 0 }} rules={[baseValidator.english_number(), validator.ghfshxydm01()]} >
          <Input onPressEnter={save} onBlur={save} />
        </Form.Item>;
      } else if(dataIndex === 'ghfyhzh') {
        childNode = <Form.Item name={dataIndex} style={{ margin: 0 }} rules={[baseValidator.english_number(), validator.ghfyhzh01()]} >
          <Input onPressEnter={save} onBlur={save} />
        </Form.Item>;
      } else if(dataIndex === 'ghfqyjc' || dataIndex === 'ghfkhyxmc' || dataIndex === 'ghfdz' || dataIndex === 'ghflxdh') {
        let verifyLength: number = 0;
        switch (dataIndex) {
          case 'ghfqyjc': // 购买方简称
            verifyLength = 150;
            break;
          case 'ghfkhyxmc': // 开户银行
            verifyLength = 120;
            break;
          case 'ghfdz': // 地址
            verifyLength = 300;
            break;
          case 'ghflxdh': // 电话
            verifyLength = 20;
            break;
          default:
            break;
        }
        childNode = <Form.Item name={dataIndex} style={{ margin: 0 }} rules={[baseValidator.range2({ min: 0, max: verifyLength })]} >
          <Input onPressEnter={save} onBlur={save} />
        </Form.Item>;
      } else {
        childNode = <Form.Item name={dataIndex} style={{ margin: 0 }} >
          <Input onPressEnter={save} onBlur={save} />
        </Form.Item>;
      }
    } else if (editType === 'Select') {
      childNode = <Form.Item name={dataIndex} style={{ margin: 0, width: 100 }}
        rules={[{ required: true, message: `请输入${title}!` },]} >
        <Select dropdownMatchSelectWidth={300} showSearch onChange={(value: any) => selectChange({ value, index, form, GmfContextInfo })}
          dropdownRender={menu => (
            <div>
              {menu}
              {/* <Divider style={{ margin: '4px 0' }} />
              <div style={{ display: 'flex', marginLeft: '8px', }}>
                <Form.Item name="tjghfnsrmc" rules={[baseValidator.range2({ min: 0, max: 150 })]}>
                  <Input />
                </Form.Item>
                <Button style={{ flex: 'none', marginLeft: '8px', display: 'block', cursor: 'pointer' }} onClick={buttonSave} type="primary">添加</Button>
              </div> */}
            </div>
          )}>
          {GmfContextInfo.map((d: any, index: any) => <Select.Option key={d.khuuid + index} value={d.ghfnsrmc}>{d.ghfnsrmc}</Select.Option>)}
        </Select>
      </Form.Item >;
    }
  }

  return <td id={dataIndex} {...restProps}>{childNode}</td>;
};


export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
}

const ModalGmf: React.FC<DDModalGridProps> = ({ onRef, visible = false }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [modalVisibleExport, setModalVisibleExport] = useState<boolean>(false);
  const [errList, setErrListt] = useState<any>([]);
  const [data, setData] = useState<any>([]); // 购买方全量信息
  const [gmfData, setGmfData] = useState<any>([]); // 购买方全量信息
  const [mainRef, setMainRef] = useState<any>([]); //主列表Ref
  
  const [masker, setMasker] = useState<boolean>(false); // 蒙板
  const [szwxtgmfbz, setSzwxtgmfbz] = useState<any>(false);

  const [bgdlx, setBgdlx] = useState<any>();
  const [bgdhs, setBgdhs] = useState<any>();
  
  const [abgdhwdxs, setAbgdhwdxs] = useState<any>(false);
  const [tempParam, setTempParam] = useState<any>();

  const [drbgdhs, setDrbgdhs] = useState<any>(''); // 导入用到的key

  // const intl = useIntl(); // 提示信息

  // 开启
  const showModal = async (param: any, ref: any, tempParam: any,param2:any) => {
    setData(param?.dataList);
    setDrbgdhs(param?.bgdhs);
    // 获取购买方信息（启用）
    const gmf = await myUtil.code.getCodeFromServerT1('CODE_CKFP_ABGDKJ_GMFMC:01');
    setGmfData(gmf || []);
    setMainRef(ref);
    setModalVisible(true);
    if(tempParam != null)
    {
      setBgdlx(tempParam.bgdlx);
      setBgdhs(tempParam.bgdhs);
      setTempParam(tempParam);
    }
    if('Y' == param2?.szwxtgmfbz){
      setSzwxtgmfbz(true);
      myUtil.sessionStore.setItem('szwxtgmfbz', true);
    }else{
      setSzwxtgmfbz(false);
      myUtil.sessionStore.setItem('szwxtgmfbz', false);
    }
    myUtil.sessionStore.setItem('tmp_ckfp_setGmf_tableSource', param?.dataList);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  useEffect(()=>{
    setMasker(false);
  },[szwxtgmfbz])


  const columns = [
    {
      title: '境外收发货人', dataIndex: 'jwshrmc', width: 100, ellipsis: true, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '出口合同号', dataIndex: 'ckhth', width: 120, ellipsis: true, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '报关单号/统一编号', dataIndex: 'bgdhgbhs', width: 140, ellipsis: true, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    { title: '购买方名称', dataIndex: 'ghfnsrmc', width: 110, editable: true, editType: 'Select', ellipsis: true, },
    { title: '购买方简称', dataIndex: 'ghfqyjc', width: 170, editable: true, editType: 'Input', ellipsis: true, },
    { title: '社会信用代码', dataIndex: 'ghfshxydm', width: 170, editable: true, editType: 'Input', ellipsis: true, },
    { title: '开户银行', dataIndex: 'ghfkhyxmc', width: 170, editable: true, editType: 'Input', ellipsis: true, },
    { title: '银行账号', dataIndex: 'ghfyhzh', width: 170, editable: true, editType: 'Input', ellipsis: true, },
    { title: '地址', dataIndex: 'ghfdz', width: 170, editable: true, editType: 'Input', ellipsis: true, },
    { title: '电话', dataIndex: 'ghflxdh', width: 170, editable: true, editType: 'Input', ellipsis: true, },
    { title: 'khuuid', dataIndex: 'khuuid', width: 170, editable: true, editType: 'InputHidden', hidden: true },
  ]

  const errColumns = [
    { title: '序号', dataIndex: 'xh', width: 70 },
    { title: '失败原因', dataIndex: 'sbyy', width: 300 },
  ]
  // 设置列
  const myColumns = columns.map((col) => {
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
        addItem: addItem,
        index
      }),
    };
  });

  // 隐藏列
  const mergedColumns = myColumns.filter((col: any) => {
    return (!(col.hidden && col.hidden !== false));
  })

  //将可编辑列表数据存入缓存
  const storageTempTableSource = (temp: any, index: any) => {
    let tempTableSource = myUtil.sessionStore.getItem('tmp_ckfp_setGmf_tableSource');
    tempTableSource.splice(index, 1, temp);
    myUtil.sessionStore.setItem('tmp_ckfp_setGmf_tableSource', tempTableSource);
  }

  // 下拉选择
  const selectChange = async (param: any) => {
    const { index, value, form, GmfContextInfo } = param;
    // 根据选中购买方名称获取到其他信息
    const newGmfData = [...GmfContextInfo];
    const arrData = myUtil.sessionStore.getItem('tmp_ckfp_setGmf_tableSource');
    const newData = [...arrData];
    if (szwxtgmfbz) {
      let ccc: any = [];
      formList.forEach((item: any) => {
        if (item.current) {
          ccc.push(item);
        }
      });

      const rowIndex = newGmfData.findIndex((item: any) => value === item.ghfnsrmc);
      const gmf: any = newGmfData[rowIndex];
      delete gmf?.jwshrmc;
      newData.forEach(async (item, index) => {
        // 删除购买方中的境外收发货人，防止切换页面中显示的境外收发货人
        // 将购买方数据放入到整体数据中
        const temp: any = newData[index];
        newData.splice(index, 1, {
          ...temp,
          ...gmf,
        });
        const form1: any = ccc[index];
        form1.current.setFieldsValue(gmf);
        // 数据存入缓存
        storageTempTableSource(newData[index], index);
      });
      setData(newData);
    }else{
      const rowIndex = newGmfData.findIndex((item: any) => value === item.ghfnsrmc);
      const gmf: any = newGmfData[rowIndex];
      // 删除购买方中的境外收发货人，防止切换页面中显示的境外收发货人
      // delete gmf.jwshrmc;
      form.current.setFieldsValue(gmf);
      // 将购买方数据放入到整体数据中
      const temp: any = newData[index];
      newData.splice(index, 1, {
        ...temp,
        ...gmf,
      });
      // 数据存入缓存
      storageTempTableSource(newData[index], index);
      setData(newData);
    }
  }

  // 文本框调整
  const handleSave = (param: any, values: any) => {
    if (szwxtgmfbz) {
      const arrData = myUtil.sessionStore.getItem('tmp_ckfp_setGmf_tableSource');
      const newData = [...arrData];
      let ccc: any = [];
      formList.forEach((item: any) => {
        if (item.current) {
          ccc.push(item);
        }
      });
      newData.forEach(async (item, index) => {
        // 将分类编码、名称、简称回显
        // item.jm1 = param.jm1;
        // item.ggxh = param.ggxh;
        item.ghfqyjc = param.ghfqyjc;
        item.ghfnsrmc = param.ghfnsrmc;
        item.ghfshxydm = param.ghfshxydm;
        item.ghfkhyxmc = param.ghfkhyxmc;
        item.ghflxdh = param.ghflxdh;
        item.ghfyhzh = param.ghfyhzh;
        item.ghfdz = param.ghfdz;
        // newData.splice(index, 1, item);
        newData.splice(index, 1, {
          ...item,
          // ...param,
        });
        const form1: any = ccc[index];
        if (form1.current) {
          form1.current.setFieldsValue(param);
        }
        // 数据存入缓存
        storageTempTableSource(item, index);
      });
      setData([...newData]);
    }else{
      const arrData = myUtil.sessionStore.getItem('tmp_ckfp_setGmf_tableSource');
      const newData = [...arrData];
      const index = newData.findIndex((item) => param.bgdhgbhs === item.bgdhgbhs);
      newData.splice(index, 1, param);
      // 数据存入缓存
      storageTempTableSource(param, index);
      setData([...newData]);
    }
    const newGmfData = [...gmfData];
    const rowIndex = newGmfData.findIndex((item: { ghfnsrmc: any; }) => values.ghfnsrmc === item.ghfnsrmc);
    if (rowIndex < 0) {
      newGmfData.push(values);
    } else {
      const temp: any = newGmfData[rowIndex];
      newGmfData.splice(rowIndex, 1, {
        ...temp,
        ...values,
      });
      // 数据存入缓存
      // storageTempTableSource(param, rowIndex);
    }
    setGmfData(newGmfData);
  };

  // 添加购买方名称
  const addItem = (form: any, GmfContextInfo: any) => {
    const tjghfnsrmc = form.current.getFieldValue("tjghfnsrmc")?.trim();
    if(tjghfnsrmc == ""){
      message.info("请填写购买方名称！");
      return ;
    }
    const newData = [...GmfContextInfo];
    if(tjghfnsrmc?.trim()) {
      if(tjghfnsrmc.length >150){
        message.info('购买方名称长度错误，应为【1-150位字符】!')
        return ;
      }
      const index = newData.findIndex((item: any) => item.ghfnsrmc === tjghfnsrmc);
      if (index != -1) {
        message.info(intl.formatMessage({ id: 'message_ckfp_abgdkj_existgmf' }));
      } else {
        setGmfData(newData.concat({ ghfnsrmc: tjghfnsrmc, khuuid: '' }));
        form.current.setFieldsValue({ tjghfnsrmc: '' });
      }
    } else {
      message.info('请输入有效数据！')
    }
  }
  // 数据保存
  const saveModal = async () => {
    const ccc = [...formList];
    const formValues: any = [];
    for (let index = 0; index < ccc.length; index++) {
      const form1: any = ccc[index];
      if (form1.current) {
        await form1.current.validateFields();
        formValues.push(form1.current.getFieldsValue());
      }
    }
    data.forEach((item: any, index: any) => {
      const bgdhgbhs = item.bgdhgbhs.split(',');
      item.bgdhgbhs = bgdhgbhs;
      const tempValue = formValues[index];
      // 重新赋值khuuid
      const tempGmf = gmfData.filter((itemData: any) => itemData.ghfnsrmc === tempValue.ghfnsrmc)[0];
      Object.assign(item, formValues[index], { khuuid: tempGmf?.khuuid || '' });
    });
    setMasker(true);
    await gmfxxsz({ gmfxxmxs: data }).then(async (response) => {
      const { code, desc } = response;
      if (code === '200') {
        await queryParams({ key: 'GFCX_CS_ZXSB_FPKJ_KHGLPZ', searchModel: [{ property: 'qybz', value: 'Y', op: 'rl' }], }).then((response) => {
          const { code, body } = response;
          if (code === '200') {
            const temp: any = [];
            body.forEach((item: any) => {
              temp.push(Object.assign(item, { code: item.khuuid, name: item.ghfnsrmc }));
            })
            myUtil.code.saveCodeToLocalTable('CODE_CKFP_ABGDKJ_GMFMC',temp,'01');
            // mainRef.current!.reload();
            onclose();
            message.success(intl.formatMessage({ id: 'message_ckfp_abgdkj_setgmf_success' }));
          }
        });
      } else {
        message.error(desc);
      }
      setMasker(false);
    });
  };

  // 导入
  const importModal = async (param: any) => {
    const { refUnit, otherRef } = param;
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
            formData.append('bgdhs', drbgdhs);
            formData.append('importMode', '1');
            formData.append('bgdwd', abgdhwdxs ? 'Y' : 'N');
            importgmf(formData).then(async (response) => {
              const { code, body, desc } = response;
              DDAlert.close();
              if (code === '200') {
                // const temp: any = [];
                const tempBody = JSON.parse(JSON.stringify(body?.dataList));
                // tempBody.forEach((item: any) => {
                //   temp.push(Object.assign(item, { code: item.khuuid, name: item.ghfnsrmc }));
                // })
                const newGmfData = [...gmfData];
                tempBody.forEach((element:any) => {
                  const rowIndex = newGmfData.findIndex((item: { ghfnsrmc: any; }) => element.ghfnsrmc === item.ghfnsrmc);
                  if (rowIndex < 0) {
                    newGmfData.push(element);
                  }
                });
                setGmfData(newGmfData);
                const newData:any = []
                await setData([{...newData}]); // 字段有相同值时无法重新渲染，所以先置空
                myUtil.sessionStore.setItem('tmp_ckfp_setGmf_tableSource', body?.dataList);
                setData(body?.dataList);
                setDrbgdhs(body?.bgdhs)
                message.success("导入成功");
              } else if(code == '900') {
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
    // const ccc = [...formList];
    // const formValues: any = [];
    // for (let index = 0; index < ccc.length; index++) {
    //   const form1: any = ccc[index];
    //   if (form1.current) {
    //     await form1.current.validateFields();
    //     formValues.push(form1.current.getFieldsValue());
    //   }
    // }
    // data.forEach((item: any, index: any) => {
    //   const bgdhgbhs = item.bgdhgbhs.split(',');
    //   item.bgdhgbhs = bgdhgbhs;
    //   const tempValue = formValues[index];
    //   // 重新赋值khuuid
    //   const tempGmf = gmfData.filter((itemData: any) => itemData.ghfnsrmc === tempValue.ghfnsrmc)[0];
    //   Object.assign(item, formValues[index], { khuuid: tempGmf?.khuuid || '' });
    // });
    // const temData = JSON.parse(JSON.stringify(data));
    const tempTableSource = myUtil.sessionStore.getItem('tmp_ckfp_setGmf_tableSource');
    tempTableSource?.forEach((item: any, index: any) => {
      const bgdhgbhs = item.bgdhgbhs?.split(',');
      if(bgdhgbhs.length > 0) {
        item.bgdhgbhs = bgdhgbhs;
      }
    })
    setMasker(true);
    exportgmf({ gmfxxmxs: tempTableSource, bgdwd: abgdhwdxs ? 'Y' : 'N' }).then((response) => {
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
  
  const setFlag = (e: any) => {
    //调用接口修改
    const d= e?'Y':'N';
    const data = {szwxtgmfbz :d};
    setMasker(true);
    szwxtbz(data).then((response) => {
      const {code,msg} = response;
      if(code == '200'){
        setSzwxtgmfbz(e);
        myUtil.sessionStore.setItem('szwxtgmfbz', e);
      }else{
        message.error(msg);
      }
    });
  }

  // 按报关单号维度显示勾选事件
  const onChangeAbgdhwdxs = (e: any) => {
    setAbgdhwdxs(e.target.checked);
    setMasker(true);

    if (e.target.checked) {
      tempParam.bgdwd = 'Y'
      // let searchModel: any;
      // if (tempParam.bgdhs?.length > 0) {
      //   searchModel = [...tempParam.cxtj, { property: 'bgdhs', values: tempParam.bgdhs, op: 'ain' }];
      // } else {
      //   searchModel = [...tempParam.cxtj];
      // }
      // const obj = {
      //   key: 'CX_SAAS_CKFPKJ_ABGDKJ_PLSZ_GMF18BGD',
      //   page: 1,
      //   pageSize: 999999,
      //   searchModel: searchModel,
      // }
      // queryPager(obj).then((res: any)=> {
      //   setMasker(false);
      //   const { code, body, desc } = res;
      //   if(code === '200') {
      //     setData(body.rows);
      //     myUtil.sessionStore.setItem('tmp_ckfp_setGmf_tableSource', body.rows);
      //   } else if(code === '900'){
      //     message.info(desc);
      //   } else {
      //     message.error(desc);
      //   }
      // })
    } else {
      tempParam.bgdwd = 'N';
    }
    gmfxxcx(tempParam).then((response: any) => {
      setMasker(false);
      const { code, body, desc } = response;
      if (code === '200' && body?.dataList.length > 0) {
        setData(body.dataList);
        setDrbgdhs(body?.bgdhs)
        myUtil.sessionStore.setItem('tmp_ckfp_setGmf_tableSource', body.dataList);
      } else if(code === '300') {
        message.info(intl2.formatMessage({ id: 'message_common_type_no_griddata' }));
      } else if(code === '900'){
        message.info(desc);
      } else {
        message.error(desc);
      }
    })
  }


  const onclose=async ()=>{
    mainRef.current!.reload();
    setModalVisible(false);
    myUtil.sessionStore.clear('szwxtgmfbz');
    // myUtil.sessionStore.clear('codeTable');
    await myUtil.code.getCodeFromServerT1('CODE_CKFP_ABGDKJ_GMFMC:01');
    setModalVisibleExport(false);
    setErrListt([]);
    setMainRef([]);
  }
  return (
    <>
      <Modal
        title="设置购买方"
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
      
        <Space style={{ marginBottom: 10 }}>
          <Checkbox onChange={onChangeAbgdhwdxs}>按报关单号维度显示所有数据</Checkbox>
        </Space>
       <Space style={{ float: 'right', marginBottom: 10 }}>
        <div>默认设置为相同购买方</div>
        {myUtil.sessionStore.getItem('szwxtgmfbz') ?
          <Switch defaultChecked onChange={setFlag} /> :
          <Switch onChange={setFlag} />}
      </Space>
    <br />
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <GmfContext.Provider value={gmfData}>
            <Table
              components={{
                body: {
                  row: EditableRow,
                  cell: EditableCell,
                }
              }}
              bordered
              rowKey='bgdhgbhs'
              scroll={{ x: '1170px', y: `${document.documentElement.clientHeight - 200}px` }}
              dataSource={data}
              columns={mergedColumns}
              pagination={false}
            />
          </GmfContext.Provider>
        </Spin>
      </Modal >
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

export default ModalGmf;
