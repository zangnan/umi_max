// 已生成数据/申报明细
import React, { useState, useEffect, useImperativeHandle, useContext } from 'react';
import { Tabs, Button, Spin, Form, Table, message, Tooltip, Space, InputNumber, Upload, Modal } from 'antd';
import pro from '@/pages/common/proConfig';
import { Drawer } from 'antd';
import { ScheduleOutlined, ReadOutlined, QuestionCircleOutlined, InboxOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/es/form';
import {btssjSsqd, downloadTemplate, btzssldrTS, commonDrwtdc} from '@/services/hts/api';
import myUtil from '@/pages/common/myUtil';
import ProCard from '@ant-design/pro-card';
import DDAlert from '@/components/DDAlert';
import importStyle from './importStyle.less';
import DDBaseGrid from '@/components/DDBaseGrid';
const { Dragger } = Upload;

export interface CkxqDataProps {
  visible?: any;
  onRef?: any;
}

const EditableContext = React.createContext(null);

// 确认表
const formListQr = new Set();
class EditableRowQr extends React.Component {
  constructor(props: any) {
    super(props);
  }
  formRefQr = React.createRef<FormInstance>();
  render() {
    if (this.formRefQr) {
      formListQr.add(this.formRefQr);
    }
    return (
      <Form ref={this.formRefQr} component={false}>
        <EditableContext.Provider value={this.formRefQr}>
          < tr {...this.props} />
        </EditableContext.Provider>
      </Form>
    )
  }
}

// 调整表
const formListTz = new Set();
class EditableRowTz extends React.Component {
  constructor(props: any) {
    super(props);
  }
  formRefTz = React.createRef<FormInstance>();
  render() {
    if (this.formRefTz) {
      formListTz.add(this.formRefTz);
    }
    return (
      <Form ref={this.formRefTz} component={false}>
        <EditableContext.Provider value={this.formRefTz}>
          < tr {...this.props} />
        </EditableContext.Provider>
      </Form>
    )
  }
}

// 调整表
const EditableCellTz = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSaveTz,
  editType,
  index,
  ...restProps
}) => {
  const formTz: any = useContext(EditableContext);
  useEffect(() => {
    if (record) {
      record.yfzssl = record.yfzssl ? record.yfzssl : '';
      formTz.current.setFieldsValue(record);
    }
  }, [record]);

  const saveTz = async () => {
    const values = await formTz.current.validateFields();
    handleSaveTz({ ...record, ...values, index });
  };

  const inputNumperFormatter = (value: any, info: any, format: any) => {
    if (info.userTyping) {
      if (info.input) {
        return info.input;
      } else {
        if (value) {
          return value;
        }
        return '';
      }
    } else {
      if (value) {
        return myUtil.text.formatNum(value, format);
      }
      return '';
    }
  }

  let childNode = children;
  if (editable && editType === 'Input') {
    childNode = <Form.Item name={dataIndex} style={{ margin: 0 }}>
      <InputNumber onPressEnter={saveTz} onBlur={saveTz} formatter={(value: any, info: any)=>{return inputNumperFormatter(value, info, '0,0.00000')}} />
    </Form.Item>;
  }
  return <td id={dataIndex} {...restProps}>{childNode}</td>;
};

const CkxqData: React.FC<CkxqDataProps> = ({
  visible = false,
  onRef,
}) => {
  const [ modalVisible, setModalVisible ] = useState<boolean>(visible);
  const [ modalVisibleExport, setModalVisibleExport ] = useState<boolean>(false); // 导入报错弹窗
  const [ errList, setErrList ] = useState<any>([]); // 错误信息
  const [ pageRef, setPageRef ] = useState<any>([]);
  const [ masker, setMasker ] = useState(false);  // 蒙版
  const [ modalDataQr, setModalDataQr ] = useState<any>([]); // 传递的数据 表1
  const [ modalDataTz, setModalDataTz ] = useState<any>([]); // 传递的数据 表2
  const [ selectionRowKeys, setSelectionRowKeys ] = useState<any>([]); // 选中数据主键
  const [ activeKey, setActiveKey ] = useState<string>('tab01'); // 当前活动tab
  const [hlgz, setHlgz] = useState<any>('');
  const [startLxFlay, setStartLxFlay] = useState<any>(true);
  const [sj, setSj] = useState<any>();
  // 确认表
const EditableCellQr = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSaveQr,
  editType,
  index,
  ...restProps
}) => {
  const formQr: any = useContext(EditableContext);

  useEffect(() => {
    if (record) {
      record.rmbhl = record.rmbhl ? record.rmbhl : '';
      formQr.current.setFieldsValue(record);
    }
  }, [record]);

  const saveQr = async () => {
    const values = await formQr.current.validateFields();
    handleSaveQr({ ...record, ...values }, values);
  };

// 商品码下拉有问题 一点开就关闭 并且 点击 为上次数据
  let childNode = children;
  if (editable && editType === 'Input') {
    childNode = <Form.Item name={dataIndex} style={{ margin: 0 }}>
    <InputNumber onPressEnter={saveQr} onBlur={saveQr} />
  </Form.Item>;
  }
  return <td id={dataIndex} {...restProps}>{childNode}</td>;
};

  // 开启 初始化
  const showModal = (unitRef:any, params: any, dataBody: any,sj :any) => {
    setSj(sj);
    setSelectionRowKeys(params.uuids);  // 主键集合
    const bzhlList = dataBody?.bzhlList || [];
    setModalDataQr(bzhlList);
    const yfzsslList = dataBody?.yfzsslList || [];
    if(bzhlList.length > 0) {
      setActiveKey('tab01');
    } else {
      setActiveKey('tab02');
    }

    Promise.all([myUtil.code.getCodeFromServerT1('CODE_CS_ZXSB_FPKJ_CSPZ', '01')]).then(() => {
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ', '01');
      setHlgz(temp[0].fphlxqgzDm);
      setModalDataTz(yfzsslList);
      setPageRef(unitRef);
      setModalVisible(true);
    });
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
      closeModal,
    };
  });

  const closeModal = () => {
    setModalVisible(false);
  }

  // 保存
  const saveModal = () => {
    if(modalDataQr.length > 0) {
      for(let i=0; i<modalDataQr.length; i++) {
        const item = modalDataQr[i];
        if(!item.rmbhl) {
          message.info('存在汇率为空的数据，请填写后重试！');
          return;
        }
      }
    }
    if(modalDataTz.length > 0) {
      for(let i=0; i<modalDataTz.length; i++) {
        const item = modalDataTz[i];
        if(!item.yfzssl) { 
          message.info('存在折算数量为空的数据，请填写后重试！');
          return;
        }
      }
    }
    setMasker(true);
    btssjSsqd({
      bzhlList: modalDataQr,
      yfzsslList: modalDataTz,
      uuids: selectionRowKeys,
    }).then((res: any) => {
      setMasker(false);
      const { code, msg } = res;
      if (code === '200') {
        closeModal();
        const otherRef = pageRef.current?.getOtherRefs();
        if (otherRef[3]) {
          otherRef[3].current?.showModal(pageRef, sj);
        }
      } else {
        message.error(msg)
      }
    })
  }

  const titleNamermbhl = (
    <Tooltip placement="rightTop" title="100外币兑换人民币汇率，如：泰铢汇率19.51。">
      <span>
        币制汇率 <QuestionCircleOutlined />
      </span>
    </Tooltip>
  );

  // 确认表列表
  const conColumnsQr = [
    { title: '进出口年月', dataIndex: 'jckrqhjckny', width: 120, hidden: hlgz === '11' ? true : false },
    { title: '进出口日期', dataIndex: 'jckrqhjckny', width: 120, hidden: hlgz === '11' ? false : true },
    { title: '币制', dataIndex: 'hbzmDm', width: 70 },
    { title: titleNamermbhl, dataIndex: 'rmbhl', width: 140, editable: true, editType: 'Input' },
  ];

  // 隐藏列 确认表
  const myColumnsQr = conColumnsQr.filter((col: any) => {
    return (!(col.hidden && col.hidden !== false));
  })

  // 设置列 确认表
  const firmColumnsQr = myColumnsQr.map((col) => {
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
        handleSaveQr: handleSaveQr,
        index
      }),
    };
  });

  // 调整表列表
  const conColumnsTz = [
    { title: '进（出）口日期', dataIndex: 'ckrq1', width: 120 },
    { title: '报关单号', dataIndex: 'bgdhgbh', width: 160 },
    { title: '项号', dataIndex: 'xh4', width: 80 },
    { title: '商品代码', dataIndex: 'hgckspDm', width: 110 },
    {
      title: '商品名称', dataIndex: 'hgspmc', width: 160, ellipsis: true, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    { title: '折算数量', dataIndex: 'yfzssl', width: 110, editable: true, editType: 'Input' },
  ];

  // 隐藏列 调整表
  const myColumnsTz = conColumnsTz.filter((col: any) => {
    return (!(col.hidden && col.hidden !== false));
  })

  // 设置列 调整表
  const firmColumnsTz = myColumnsTz.map((col) => {
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
        handleSaveTz: handleSaveTz,
        index
      }),
    };
  });

  // 文本框调整
  const handleSaveQr = (param: any, values: any) => {
    // 1.将修改文本框信息放入到主体数据中
    const newData = [...modalDataQr];
    const index = newData.findIndex((item) => param.uuid === item.uuid);
    newData.splice(index, 1, param);
    setModalDataQr(newData);
  }

  // 文本框 调整表
  const handleSaveTz = (param: any) => {
    const newData = [...modalDataTz];
    const index = newData.findIndex((item) => param.uuid === item.uuid);
    newData.splice(index, 1, param);
    setModalDataTz(newData);
  };

  const beforeUpload = (file: any) => {
    if(!file.name.toUpperCase().endsWith(".XLS") && !file.name.toUpperCase().endsWith(".XLSX")) {
      message.info('上传文件必须是Excel文件。');
      return Upload.LIST_IGNORE;
    } else {
      return false;
    }
  }

  // 导入
  const importModal = async () => {
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
            formData.append('uuids', selectionRowKeys);
            btzssldrTS(formData).then(async (response: any) => {
              const { code, body, desc } = response;
              DDAlert.close();
              if (code === '200') {
                const yfzsslList = body?.yfzsslList || [];
                if(yfzsslList.length > 0) {
                  setModalDataTz(yfzsslList); // 覆盖原有数据
                  message.success('导入成功！')
                }
              } else if(code == '900') {
                setModalVisibleExport(true);
                setErrList(body.errorMsg || []);
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
    setMasker(true);
    const searchModel = [{property: "uuids",value: selectionRowKeys, op: "zdy"}]
    downloadTemplate({ key: 'TSSB_WBSJ_BTSSJ_PLXG_YFZSSL_DC', sfBhsj: "Y", searchModel,}).then((response) => {
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

  // 导出错误信息
  const exportModalError = async () => {
    setMasker(true);
    commonDrwtdc({ key: 'TSSB_WBSJ_BTSSJ_PLXG_ERRORLIST'}).then((response) => {
      const { code, body, desc } = response;
      if (code === '200') {
        const { blob, fileName } = body;
        message.success('错误信息导出成功！');
        myUtil.file.downloadExcel(blob, fileName);
      } else {
        message.error(desc);
      }
      setMasker(false);
    });
  };


  const errColumns = [
    { title: '序号', dataIndex: 'xh', width: 70 },
    { title: '失败原因', dataIndex: 'sbyy', width: 300, ellipsis: true },
  ]

  const tabCallback = (key: any) => {
    // 如果点击当前所在页面，不进行以下校验操作
    setActiveKey(key);
  }

  return (
    <Drawer
      title="批量补填"
      visible={modalVisible}
      onClose={() => { closeModal() }}
      width={pro.c_modal_width_x3}
      destroyOnClose={true}
      className="dd_data_page_modal"
      maskClosable={false}
      footerStyle={{ textAlign: 'right' }}
      footer={(
        <Space>
          {activeKey === 'tab02' ?
            <>
            <Button onClick={importModal}>导入</Button>
            <Button onClick={exportModal}>导出</Button>
            </> : <></>
          }
          <Button onClick={() => closeModal()}>取消</Button>
          <Button onClick={saveModal} type="primary">确定</Button>
        </Space>
      )}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
          <Tabs defaultActiveKey={modalDataQr.length>0 ? "tab01" : "tab02"} type="editable-card" tabBarGutter={5} hideAdd={true} onChange={tabCallback}>
            {modalDataQr.length>0 ? <Tabs.TabPane tab={<span><ScheduleOutlined />补填汇率</span>} key="tab01" closable={false} >
              <ProCard>
              <Table
                components={{
                  body: {
                    row: EditableRowQr,
                    cell: EditableCellQr,
                  }
                }}
                bordered
                rowKey='uuid'
                scroll={{ x: '900px', y: `${document.documentElement.clientHeight - 240}px` }}
                dataSource={modalDataQr}
                columns={firmColumnsQr}
                pagination={false}
              />
              </ProCard>
              </Tabs.TabPane> : <></>
            }
            {modalDataTz.length > 0 ?
              <Tabs.TabPane tab={<span><ReadOutlined />补填折算数量</span>} key="tab02" closable={false} >
                <ProCard>
                  <Table
                    components={{
                      body: {
                        row: EditableRowTz,
                        cell: EditableCellTz,
                      }
                    }}
                    bordered
                    rowKey='uuid'
                    scroll={{ x: '900px', y: `${document.documentElement.clientHeight - 240}px` }}
                    dataSource={modalDataTz}
                    columns={firmColumnsTz}
                    pagination={false}
                  />
                </ProCard>
              </Tabs.TabPane> : <></>
            }
          </Tabs>
          <Modal
            title="错误信息"
            destroyOnClose={true}
            visible={modalVisibleExport}
            width={pro.c_modal_width_x3}
            wrapClassName="standard-modal-1"
            footer={
              <>
                <Button onClick={exportModalError}>导出</Button>
                <Button onClick={() => setModalVisibleExport(false)}>关闭</Button>
              </>
            }
            onCancel={() => setModalVisibleExport(false)}
            maskClosable={false}
          >
            <DDBaseGrid
              userDataSource={errList}
              components={true}
              columns={errColumns}
              pagination={false}
              scroll={{ x: '0px' }}
            />
          </Modal >
      </Spin>
    </Drawer>
  );
};

export default CkxqData;
