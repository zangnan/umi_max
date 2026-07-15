import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import ProCard from '@ant-design/pro-card';
import { Button, Form, Input, Space, Modal, Table, DatePicker, InputNumber, Tooltip, Dropdown } from 'antd';
import myUtil from '@/components/DDAssist/util';
import CONSTANTS from '@/components/DDAssist/constants';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { DownOutlined, SettingOutlined } from '@ant-design/icons';
import DDGridViewSetting from '@/components/DDGridViewSetting';
import { cloneDeep } from 'lodash';
import './style.less';


const EditableContext = React.createContext(null);

const EditableCell: React.FC<{ title: any, editable: boolean, dataIndex: any, record: any, handleSaveRight: (record: any, dataIndex: any, form: any) => void, editType: string, index: number }> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSaveRight,
  editType,
  index,
  ...restProps
}) => {
  const form: any = useContext(EditableContext);
  useEffect(() => {
    form.setFieldsValue(record);
    if (record) {
      if (record.fpsbztDm == '2') {
        record.dwDisabled = true;
      }
    }
  }, []);

  const save = async () => {
    try {
      const values = await form.validateFields();
      handleSaveRight({ ...record, ...values }, dataIndex, form);
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;
  if (editable) {
    if (editType === 'Input') {
      if ("jldwmc" === dataIndex) {
        childNode = <Form.Item id={dataIndex} name={dataIndex} style={{ margin: 0 }}>
          <Input onPressEnter={save} onBlur={save} disabled={record.fpsbztDm == '2' ? true : false} />
        </Form.Item>;
      } else {
        childNode = <Form.Item id={dataIndex} name={dataIndex} style={{ margin: 0 }}>
          <Input onPressEnter={save} onBlur={save} />
        </Form.Item>;
      }
    } else if (editType === 'InputNumber') {
      if("npdsl"=== dataIndex){
        childNode = <Form.Item id={dataIndex} name={dataIndex} style={{ margin: 0 }} rules={[
          () => ({
            validator(_, value) {
              if (isNaN(value)) {
                return Promise.reject(new Error('该项必须录入数字'));
              } else {
                if (Number(value) > 9999999999.99999) {
                  return Promise.reject(new Error('最大值为9999999999.99999'));
                }
                if (Number(value) <= 0) {
                  return Promise.reject(new Error('该项只能录入正数'));
                }
              }
              if ("yzsl" === dataIndex) {
                if (Number(value) > Number(record.sl3)) {
                  return Promise.reject(new Error('拟配单数量不能大于数量'));
                }
              }
              return Promise.resolve();
            },
          }),
        ]}>
          <InputNumber controls={false} onPressEnter={save} onBlur={save} formatter={(value: any, info: any) => { return inputNumperFormatter(value, info, '0.00000') }} />
        </Form.Item>;
      }else{
        childNode = <Form.Item id={dataIndex} name={dataIndex} style={{ margin: 0 }} rules={[
          () => ({
            validator(_, value) {
              if (isNaN(value)) {
                return Promise.reject(new Error('该项必须录入数字'));
              } else {
                if (Number(value) > 9999999999.99999) {
                  return Promise.reject(new Error('最大值为9999999999.99999'));
                }
                if (Number(value) <= 0) {
                  return Promise.reject(new Error('该项只能录入正数'));
                }
              }
              if ("yzsl" === dataIndex) {
                if (Number(value) > Number(record.sl3)) {
                  return Promise.reject(new Error('拟配单数量不能大于数量'));
                }
              }
              return Promise.resolve();
            },
          }),
        ]}>
          <InputNumber controls={false} onPressEnter={save} onBlur={save} disabled={record?.sldisabled=='1'} formatter={(value: any, info: any) => { return inputNumperFormatter(value, info, '0.00000') }} />
        </Form.Item>;
      }
      
    }
  }


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

  return <td id={dataIndex} {...restProps}>{childNode}</td>;
};

export type ScsbsjProps = {
  pduuid:any;
  rightSearchForm:any;
  fpForm:any
  fpSx?: any;
  keyRight: any;
  dataRight: any;
  selectFpRowKeys:any;
  setSelectFpRowKeys:any;
  selectFpRows:any;
  setSelectFpRows:any;
  setRightsx:any;
  setDataRight:any;
  rightPagination:any;
  setRightPagination:any;
  zzsfpxx:any;
  dcFp:any;
}

const Scsbsj: React.FC<ScsbsjProps> = ({
  pduuid,
  rightSearchForm,
  fpForm,
  fpSx,
  keyRight,
  dataRight,
  selectFpRowKeys,
  setSelectFpRowKeys,
  selectFpRows,
  setSelectFpRows,
  setRightsx,
  setDataRight,
  rightPagination,
  setRightPagination,
  zzsfpxx,
  dcFp,
}) => {
  // 表单布局
  const layoutLeftModal = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };
  const columns = [
    {
      title: '认证/稽核状态', dataIndex: 'fpztmc', width: 120, fixed: 'left', ellipsis: { showTitle: true }
    },
    {
      title: '发票号码', dataIndex: 'fphm', width: 180, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {text} </Tooltip>
        }
        return '';
      }
    },
    {
      title: '发票代码', dataIndex: 'fpDm', width: 180, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {text} </Tooltip>
        }
        return '';
      }
    },
    {
      title: '行号', dataIndex: 'hh', width: 120, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {text} </Tooltip>
        }
        return '';
      }
    },
    {
      title: '开票日期', dataIndex: 'kprq', width: 120, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {text} </Tooltip>
        }
        return '';
      }
    },
    {
      title: '货物或应税劳务、服务名称', dataIndex: 'hwhyslwmc', ellipsis: { showTitle: true }, width: 200, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {text} </Tooltip>
        }
        return '';
      }
    },
    {
      title: '规范化商品名称', dataIndex: 'gfhhwhyslwmc1', width: 150, ellipsis: { showTitle: false }, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {text} </Tooltip>
        }
        return '';
      }
    },
    {
      title: '规格型号', dataIndex: 'ggxh', width: 150, align: 'left', ellipsis: { showTitle: false }, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '计量单位名称', dataIndex: 'jldwmc', editable: true, editType: 'Input', width: 120, ellipsis: { showTitle: false }, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {text} </Tooltip>
        }
        return '';
      }
    },
    {
      title: '数量', dataIndex: 'sl3', width: 120, editable: true, editType: 'InputNumber', align: 'right',
    },
    {
      title: '可配单数量', dataIndex: 'kysl', width: 150, align: 'right', editable: true,
    },
    {
      title: '拟配单数量', dataIndex: 'npdsl', align: 'right', editable: true, editType: 'InputNumber', width: 120, ellipsis: { showTitle: false }, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {text} </Tooltip>
        }
        return '';
      }
    },
    {
      title: '单价', dataIndex: 'dj', align: 'right', width: 150,  ellipsis: { showTitle: false }, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '计税金额', align: 'right', dataIndex: 'je', width: 150, ellipsis: { showTitle: false }, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '剩余金额', align: 'right', dataIndex: 'kyje', width: 150, ellipsis: { showTitle: false }, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '税率', align: 'right', dataIndex: 'sl1', width: 150, ellipsis: { showTitle: false }, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '销售方名称', dataIndex: 'xhfnsrmc', width: 150, align: 'left', ellipsis: { showTitle: false }, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '销售方纳税人识别号', dataIndex: 'xfnsrsbh', width: 150, align: 'left', ellipsis: { showTitle: false }, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '备注', dataIndex: 'bz', width: 150, align: 'left', ellipsis: { showTitle: false }, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '标签说明', dataIndex: 'bqsm', width: 150, align: 'left', ellipsis: { showTitle: false }, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '业务编号', dataIndex: 'ywbh', width: 150, align: 'left', ellipsis: { showTitle: false }, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },


  ];

  // 隐藏列
  const myColumns = columns.filter((col: any) => {
    return (!(col.hidden && col.hidden !== false));
  });

  const getMergedColumns = (columns: any) => {// 设置列
    const mergedColumns = columns.map((col: any) => {
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
          handleSaveRight,
          index
        }),
      };
    });
    return mergedColumns
  }


  // 文本框调整
  const handleSaveRight = (param: any, dataIndex: any, form: any) => {
    let changeData = myUtil.localStore.getItem('datarightChange');   
    // if(keyRight == 'SAAS_TSSB_MTS_AIPD_ZZSFP_CX'){
    //   changeData= [...myUtil.localStore.getItem('ybChange', changeData)];
    // }else{
    //   changeData= [...myUtil.localStore.setItem('jgbChange', changeData)];
    // }
    const newData = [...myUtil.localStore.getItem('datarightLocal')];
    const index = newData.findIndex((item) => param.jhpzh+param.hh === item.jhpzh+item.hh);
    newData[index].flag = 0;
    if (dataIndex == 'jldwmc') {
      if (newData[index]?.jldwmc != form.getFieldsValue().jldwmc) {
        newData[index].sldisabled = '2';
        newData[index].jldwmc = form.getFieldsValue().jldwmc;
      }
    } else if (dataIndex == 'sl3') {
      newData[index].sl3 = form.getFieldsValue().sl3;
      newData[index].kysl = form.getFieldsValue().sl3;
      newData[index].npdsl = form.getFieldsValue().sl3;
      param.sl3 = form.getFieldsValue().sl3;
      param.kysl = form.getFieldsValue().sl3;
      param.npdsl = form.getFieldsValue().sl3;
    } else {
      // npdsl
      if(form.getFieldsValue().npdsl <= form.getFieldsValue().sl3){
        newData[index].npdsl = form.getFieldsValue().npdsl;
      }
    }
    const i = changeData.findIndex((item) => param.jhpzh+param.hh === item.jhpzh +item.hh );
    if (i >= 0) {
      changeData[i] = param;
    } else {
      changeData.push(param);
    }
    setDataRight(newData);
    myUtil.localStore.setItem('datarightLocal', newData);
    myUtil.localStore.setItem('datarightChange', changeData);
    // if(keyRight == 'SAAS_TSSB_MTS_AIPD_ZZSFP_CX'){
    //   myUtil.localStore.setItem('ybChange', changeData);
    // }else{
    //   myUtil.localStore.setItem('jgbChange', changeData);
    // }
  };


  // 右侧发票form

  // 右侧更多modal
  const [rightgdModal, setRightgdModal] = useState<any>(false);
  // 右侧可编辑form        
  const formList: any = []; // form数组，用于点击保存时校验表单是否正确
  const [rightCommt, setRightCommt] = useState<any>([]);
  const [originalColumns, setOriginalColumns] = useState<any>([]);

  useEffect(() => {
    // const viewConfig = refRightViewSetting?.current?.getViewConfigScheme();
    // const mergedColumns = getMergedColumns(viewConfig?.column || myColumns);
    const mergedColumns = getMergedColumns(myColumns);
    setOriginalColumns(mergedColumns);
    setRightCommt(mergedColumns);
  }, []);

  const rightGd = () => {
    setRightgdModal(true);
  }

  const getFooter=()=>{
    return zzsfpxx;
  }
  // 视图设置相关配置
  const refRightViewSetting: any = useRef();

  const gridSettingRight = () => {
    refRightViewSetting.current!.showModal();
  };

  // 视图设置后更新（右）
  const updateGridViewTmpRight = (params: any) => {
    const { column } = params;
    const tmpColViews = cloneDeep([...column?.all]);
    setRightCommt(tmpColViews);
  }
  const updateGridViewRight: any = useCallback(updateGridViewTmpRight, []);



  const handleOnChangeRight = (currentPagination: any, filters: any, sorter: any) => {
    setRightPagination(Object.assign(rightPagination, currentPagination));
    fpSx(keyRight,'2');
  }

  

  // 右侧发票
  const rowFpSelection = {
    selectedRowKeys: selectFpRowKeys,
    fixed: true,
    onSelect: (record: any, selected: any, selectedRows: any, nativeEvent: any) => {
      const tmpRowKeys = [...selectFpRowKeys];
      const tmpRows = [...selectFpRows];
      if (selected) {
        // 可用值替换原始值 确保以前的方法不需要调整
        tmpRowKeys.push(record.uuid);
        tmpRows.push(record);
      } else {
        const index1 = tmpRowKeys.findIndex((item: any) => record.uuid === item.uuid);
        tmpRowKeys.splice(index1, 1);
        const index2 = tmpRows.findIndex((item: any) => record.uuid === item.uuid);
        tmpRows.splice(index2, 1);
      }
      // 更改当前页选中
      setSelectFpRowKeys(tmpRowKeys);
      setSelectFpRows(tmpRows);
    },
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
      const tmpRowKeys = [...selectFpRowKeys];
      const tmpRows = [...selectFpRows];
      if (selected) {
        changeRows.forEach((item: any) => {
          tmpRowKeys.push(item.uuid);
          tmpRows.push(item);
        })
        // 更改当前页选中
        setSelectFpRowKeys(tmpRowKeys);
        setSelectFpRows(tmpRows);
      } else {
        const lsRows0: any = [];
        const lsRows1: any = [];
        const lsRows2: any = [];
        changeRows.forEach((item: any) => {
          lsRows0.push(item.uuid);
        });
        tmpRowKeys.forEach((item: any) => {
          if (!myUtil.array.isContiner(lsRows0, item)) {
            lsRows1.push(item);
          }
        });
        tmpRows.forEach((item: any) => {
          if (!myUtil.array.isContiner(lsRows0, item.uuid)) {
            lsRows2.push(item);
          }
        });
        // 更改当前页选中
        setSelectFpRowKeys(lsRows1);
        setSelectFpRows(lsRows2);
      }
    }
  }


  const rightgdsave = async () => {
    const form = await rightSearchForm.validateFields();
    const querys = [];
    if (form.fpFphm) {
      const fpFphm = form.fpFphm.replaceAll(" ", ",");
      querys.push({ "property": "fpFphm", "values": fpFphm.split(","), "op": "zdy" });
    }
    if (form.fpXfnsrsbh) {
      querys.push({ "property": "fpXfnsrsbh", "value": form.fpXfnsrsbh, "op": "zdy" });
    }
    if (form.fpXhfnsrmc) {
      querys.push({ "property": "fpXhfnsrmc", "value": form.fpXhfnsrmc, "op": "zdy" });
    }
    if (form.fpGgxh) {
      querys.push({ "property": "fpGgxh", "value": form.fpGgxh, "op": "zdy" });
    }
    if (form.fpDjQ) {
      querys.push({ "property": "fpDjQ", "value": form.fpDjQ, "op": "zdy" });
    }
    if (form.fpDjZ) {
      querys.push({ "property": "fpDjZ", "value": form.fpDjZ, "op": "zdy" });
    }
    setRightsx(querys);
    setRightgdModal(false);
  }

  return (
    <div>
      <ProCard className="dd-grid-wrap">
        <div style={{ lineHeight: 3 }}>
          <Space size={0} align="start">
            <div className="grid_header_info" style={{ fontSize: 16, marginRight: 20, color: '#32363a', fontWeight: 'bold' }}>{'增值税发票'}</div>
          </Space>
          <Space size={0} align="start">
            <Form form={fpForm} style={{ fontSize: 14, marginTop: 8, }} className='grid_filter_margin'>
              <Form.Item name="ckrq">
                <DatePicker.RangePicker locale={locale} format={myUtil.date.formatList()} style={{ width: 240 }} />
              </Form.Item>
            </Form>
            <Button type="link" style={{ fontSize: 14, margin: '9px 4px 0px' }} onClick={rightGd}>更多<DownOutlined /></Button>
            {
                pduuid?.length > 10 ?
                <Dropdown menu={{ items: [
        { key: 'szwytz11', label: <a onClick={() => fpSx('SAAS_TSSB_MTS_AIPD_ZZSFP_CX','1')}>原始数据</a> },
        { key: 'szwwtz22', label: <a onClick={() => fpSx('SAAS_TSSB_MTS_AIPD_ZZSFP_PDJG_CX','1')}>配单结果</a> },
      ] }}>
                  <Button type="primary" style={{ fontSize: 14, margin: '9px 4px 0px' }}>筛选<DownOutlined /></Button>
                  </Dropdown>: <Button type='primary' style={{ fontSize: 14, margin: '9px 4px 0px' }} onClick={() => fpSx('SAAS_TSSB_MTS_AIPD_ZZSFP_CX','1')}>筛选</Button>
              }
            <Button style={{ fontSize: 14, margin: '9px 4px 0px' }} onClick={() => dcFp(keyRight)}>导出</Button>
            <DDGridViewSetting
              onRef={refRightViewSetting}
              updateGridView={updateGridViewRight}
              settingDataColumn={rightCommt}
              originalColumn={originalColumns}
              cacheId={'aipdfp'}
            />
          </Space>

        </div>

        {/* <div className="grid_header_search_popconfirm">
          <Button style={{ marginLeft: "10px" }} onClick={gridSettingRight} icon={<SettingOutlined />} />
        </div> */}

        <Table
          components={{
            body: {
              row: ({ index, ...props }) => {
                const [form] = Form.useForm();
                formList.push(form);
                return (
                  <Form form={form} component={false}>
                    <EditableContext.Provider value={form}>
                      <tr {...props} />
                    </EditableContext.Provider>
                  </Form>
                );
              },
              cell: EditableCell,
            }
          }}
          scroll={{ x: `${document.documentElement.clientWidth - 645}px` }}
          bordered
          rowKey={'uuid'}
          size="small"
          footer={getFooter}
          dataSource={dataRight}
          pagination={rightPagination}
          onChange={handleOnChangeRight}
          // columns={refRightViewSetting?.current?.getColumns(rightCommt)}
          columns={rightCommt}
          rowSelection={{ ...rowFpSelection, selectedRowKeys: selectFpRowKeys }}
        />
      </ProCard>
      <Modal
        title="筛选项"
        centered
        destroyOnHidden
        visible={rightgdModal}
        width={CONSTANTS.C_MODAL_WIDTH_X2}
        onCancel={() => setRightgdModal(false)}
        footer={(<>
          <Button onClick={rightgdsave} >确定</Button>
        </>)}
      >
        <Form  {...layoutLeftModal} form={rightSearchForm}>
          <Form.Item name="fpFphm" label="发票号码" tooltip="批量查询，多条以空格或英文逗号隔开，支持Excel例粘贴查询。">
            <Input style={{ width: 288 }} />
          </Form.Item>
          <Form.Item name="fpXfnsrsbh" label="发票销方税号">
            <Input style={{ width: 288 }} />
          </Form.Item>
          <Form.Item name="fpXhfnsrmc" label="发票销方名称">
            <Input style={{ width: 288 }} />
          </Form.Item>
          <Form.Item name="fpGgxh" label="规格型号">
            <Input style={{ width: 288 }} />
          </Form.Item>
          <Space style={{ marginLeft: 150 }}>
            <Form.Item name="fpDjQ" label="单价" >
              <InputNumber />
            </Form.Item>
            <div style={{    marginBottom: 20,marginLeft: -20}}>~</div>
            <Form.Item name="fpDjZ" style={{ width: 240 }}>
              <InputNumber />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default Scsbsj;
