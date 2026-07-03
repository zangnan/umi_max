/**
 * 免退税：商品分类配单 ---- 配比平衡 发票调整
 */
import { intl } from '@/components/DDAssist/util';
import React, { useState, useImperativeHandle, useContext, useEffect } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { message, Modal, Button, Table, Form, Input, InputNumber, Tooltip } from 'antd';
import myUtil from '@/components/DDAssist/util';

const EditableContext = React.createContext(null);

const EditableCell: React.FC<{ title: any, editable: boolean, dataIndex: any, record: any, handleSave: (record: any, dataIndex: any, form: any) => void, editType: string, index: number }> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  editType,
  index,
  ...restProps
}) => {
  const form: any = useContext(EditableContext);
  useEffect(() => {
    form.setFieldsValue(record);
    if (record) {
      // 初始单位和计量单位一致时，数量不可编辑
      if ((record.csjhsl && record.csjhdw === record.npdjhdw) || record.kxgbz === 'N') {
        record.slDisabled = true;
      }
      // 剩余金额为0（使用完）或者已占金额不为0（已使用）时，计量单位不可编辑
      if (record.syje === 0 || record.yzjsAmt != 0 || record.kxgbz === 'N') {
        record.npdjhmcDisabled = true;
      }
    }
  }, []);

  const save = async () => {
    try {
      const values = await form.validateFields();
      if ("npdjhdw" === dataIndex) {
        if (record.csjhdw === values.npdjhdw) {
          values.slDisabled = true;
        } else {
          values.slDisabled = false;
        }
      }
      handleSave({ ...record, ...values }, dataIndex, form);
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;
  if (editable) {
    if (editType === 'Input') {
      if ("npdspmc" === dataIndex) {
        childNode = <Form.Item id={dataIndex} name={dataIndex} style={{ margin: 0 }}>
          <Input onPressEnter={save} onBlur={save} />
        </Form.Item>;
      } else {
        childNode = <Form.Item id={dataIndex} name={dataIndex} style={{ margin: 0 }}>
          <Input onPressEnter={save} onBlur={save} disabled={record?.npdjhmcDisabled === true} />
        </Form.Item>;
      }
    } else if (editType === 'InputNumber') {
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
            if ("npdjhsl" === dataIndex) {
              if (Number(value) > Number(record.kpdsl)) {
                return Promise.reject(new Error('拟配单数量不能大于可配单数量'));
              }
            }
            return Promise.resolve();
          },
        }),
      ]}>
        <InputNumber controls={false} onPressEnter={save} onBlur={save} disabled={"npdjhsl" === dataIndex ? false : (record?.slDisabled === true ? true : false)}  formatter={(value: any, info: any)=>{return inputNumperFormatter(value, info, '0.00000')}} />
      </Form.Item>;
    }
  }

  return <td id={dataIndex} {...restProps}>{childNode}</td>;
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


export interface TzfpProps {
  onRef?: any;
  visible?: any;
}

const Tzfp: React.FC<TzfpProps> = ({ onRef, visible = false }) => {
  // const intl = useIntl();
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [mainRef, setMainRef] = useState<any>([]);
  const [gridData, setGridData] = useState<any>([]);
  const [delFpuuid, setDelFpuuid] = useState<any>([]); // 已删除发票数据
  const [pbDataIndex, setPbDataIndex] = useState<any>([]);
  const formList: any = []; // form数组，用于点击保存时校验表单是否正确
  // 开启
  const showModal = (param: any) => {
    setModalVisible(true);
    setGridData(param.data);
    setPbDataIndex(param.index);
    setMainRef(param.ref);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  const columns = [
    {
      title: '序号', dataIndex: 'index', width: 50, fixed: 'left', render: (_text: any, _record: any, index: number) => (
        <span>{index + 1}</span>)
    },
    { title: '发票代码', dataIndex: 'fpDm', width: 120, fixed: 'left' },
    { title: '发票号码', dataIndex: 'fpNo', width: 180, fixed: 'left' },
    { title: '行号', dataIndex: 'fphh', width: 50, fixed: 'left' },
    {
      title: '商品名称（发票）', dataIndex: 'bgdFpSpmc', width: 150, ellipsis: { showTitle: false }, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {text} </Tooltip>
        }
        return '';
      }
    },
    { title: '商品名称（拟配单）', dataIndex: 'npdspmc', width: 150, editable: true, editType: 'Input', },
    { title: '计量单位名称', dataIndex: 'npdjhdw', width: 120, editable: true, editType: 'Input', },
    { title: '数量', dataIndex: 'csjhsl', align: 'right', width: 190, editable: true, editType: 'InputNumber', },
    { title: '可配单数量', dataIndex: 'kpdsl', width: 150, align: 'right', render: (text: any, record: any) => {
      return myUtil.text.formatNum(text, '0.00000');
    }},
    { title: '拟配单数量', dataIndex: 'npdjhsl', width: 210, align: 'right', editable: true, editType: 'InputNumber', },
    {
      title: '操作', width: 110, fixed: 'right', render: (text: any, record: any) => {
        return <Button type='link' onClick={() => deleteFd(record)}>删除发票</Button>
      }
    },
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
        handleSave,
        index
      }),
    };
  });

  // 文本框调整
  const handleSave = (param: any, dataIndex: any, form: any) => {
    const newData = [...gridData];
    const index = newData.findIndex((item) => param.fpcodeId === item.fpcodeId);
    // 修改计量单位时，数量变为可编辑
    if ("npdjhdw" === dataIndex) {
      // 将useState中的数据重新赋值
      param.kpdsl = param.cskpdsl;
      param.csjhsl = param.csjhsl;
      param.npdjhsl = param.cskpdsl;
      // 给文本框同步设置值
      form.setFieldsValue({ csjhsl: param.cskpdsl, npdjhsl: param.cskpdsl });
    }
    // 修改进货数量时同步修改可配单数量、拟配单数量
    if ("csjhsl" === dataIndex) {
      // 将useState中的数据重新赋值
      param.kpdsl = (param.csjhsl < param.cskpdsl ? param.csjhsl : param.param.csjhsl) - param.nxsl;
      param.npdjhsl = (param.csjhsl < param.cskpdsl ? param.csjhsl : param.param.csjhsl) - param.nxsl;
      // 给文本框同步设置值
      form.setFieldsValue({ npdjhsl: param.csjhsl });
    }
    newData.splice(index, 1, param);
    setGridData(newData);
  };

  const deleteFd = (record: any) => {
    const newData = [...gridData];
    const newDeluuid = [...delFpuuid];
    const index = newData.findIndex((item: any) => record.fpcodeId === item.fpcodeId);
    if (index > -1) {
      newData.splice(index, 1);
      setGridData(newData);
      setDelFpuuid(newDeluuid.concat(record.fpcodeId));
    }
  }

  // 确认生成明细
  const save = async () => {
    for (let i = 0; i < formList.length; i++) {
      await formList[i].validateFields();
    }
    const checkedId = gridData && gridData.map((item: any) => item.npdjhdw);
    if (Array.from(new Set(checkedId)).length > 1) {
      message.info(intl.formatMessage({ id: 'message_znpd_pmpd_fpxx_dwsame' }));
      return;
    }
    mainRef.current!.tzFpSave(gridData, pbDataIndex, delFpuuid);
    message.success(intl.formatMessage({ id: 'message_znpdsd_tzfp_save_success_message' }));
    setModalVisible(false);
  }

  return (
    <Modal
      title="调整发票"
      destroyOnHidden={true}
      open={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      wrapClassName='standard-modal-1'
      footer={
        <>
          <Button onClick={save} type="primary">保存</Button>
          <Button onClick={() => setModalVisible(false)}>关闭</Button>

        </>
      }
      onCancel={() => setModalVisible(false)}
    >
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
        bordered
        rowKey='fpcodeId'
        dataSource={gridData}
        columns={mergedColumns}
        pagination={false}
        scroll={{ x: '1100px' }}
      />
    </Modal>
  );
}

export default Tzfp;
