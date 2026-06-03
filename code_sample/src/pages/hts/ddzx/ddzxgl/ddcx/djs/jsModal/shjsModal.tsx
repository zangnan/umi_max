// 维护
import React, { useState, useContext, useImperativeHandle, useEffect } from 'react';
import { Spin, Form, Table, Input, Button, message, Modal, DatePicker, InputNumber, Select, Tooltip } from 'antd';
import pro from '@/pages/common/proConfig';
import { updateDjsdd } from '@/services/hts/api';
import myUtil from '@/pages/common/myUtil';
import { cloneDeep } from 'lodash';
import moment from 'moment';

const EditableContext = React.createContext(null);

const EditableRow: React.FC<any> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell: React.FC<any> = ({
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
  codeDmGyHbOptions,
  ...restProps
}) => {
  const form: any = useContext(EditableContext);

  useEffect(() => {
    form.setFieldsValue(record);
  }, []);

  const save = async () => {
    const values = await form.validateFields();
    if (dataIndex === 'ckshje' || dataIndex === 'ckshhbhl') {
      if (values.ckshje && values.ckshhbhl) {
        values.ckshjermb = values.ckshje * values.ckshhbhl / 100
        form.setFieldsValue(values);
      }
    }
    handleSave({ ...record, ...values });
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
  
  const otherSelect = (value: any) => {
    const formValue = form.getFieldsValue();
    selectChange({ value, dataIndex, index, formValue, record })
  };

  let childNode = children;
  if (editable) {
    if (editType === 'Input') {
        childNode = <Form.Item name={dataIndex} style={{ margin: 0 }} >
          <Input onPressEnter={save} onBlur={save} />
        </Form.Item>;
    } else if (editType === 'InputNumber') {
      if ("ckshhbhl" === dataIndex) {
        childNode = 
          <Form.Item name={dataIndex} style={{ margin: 0 }}>
            <InputNumber onPressEnter={save} onBlur={save} controls={false} max={99999.99999} formatter={(value: any, info: any)=>{return inputNumperFormatter(value, info, '0,0.00000')}} />
          </Form.Item>;
      } else {
        childNode = 
          <Form.Item name={dataIndex} style={{ margin: 0 }}>
            <InputNumber onPressEnter={save} onBlur={save} controls={false} max={999999999999.99} formatter={(value: any, info: any)=>{return inputNumperFormatter(value, info, '0,0.00')}} />
          </Form.Item>;
      }
    } else if (editType === 'Select') {
      if ("ckshhbzmDm" === dataIndex) {
        childNode = <Form.Item name={dataIndex} style={{ margin: 0 }}>
          <Select onChange={(value: any) => { otherSelect(value) }} options={codeDmGyHbOptions}>
          </Select>
        </Form.Item>;
      } 
    } else if (editType === 'DatePicker') {
      childNode = 
        <Form.Item name={dataIndex} style={{ margin: 0 }}>
          <DatePicker onChange={save}/>
        </Form.Item>;
    }
  }

  return <td id={dataIndex} {...restProps}>{childNode}</td>;
};

export interface Props {
  onRef?: any;
}

const Maintain: React.FC<Props> = ({
  onRef,
}) => {

  const [masker, setMasker] = useState<any>(false);
  const [dataSource, setDataSource] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [mainRef, setMainRef] = useState<any>([]); // 主列表Ref

  const codeDmGyHb = myUtil.code.getCode('code_dm_gy_hb', '01')
  let codeDmGyHbOptions: any = [];
  codeDmGyHb.forEach((item: any) => {
    codeDmGyHbOptions.push({ value: item.code, label: item.code })
  });

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  const handleSave = (row: any) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.ddbh === item.ddbh);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item, ...row
    });
    setDataSource(newData);
  };

  // 下拉选择
  const selectChange = (param: any) => {
    const { index, dataIndex, value, formValue } = param;
    const newData = [...dataSource]
    const tempData = newData[index];
    // 将下拉框是否可编辑放入到数据中
    const temp = { ...tempData, ...formValue };
    temp[dataIndex] = value;
    newData.splice(index, 1, temp);
    setDataSource(newData);
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  
  const columns = [
    { title: '工厂', dataIndex: 'hzdwmc', width: 200, ellipsis: true, fixed: 'left', render: (text: any, record: any) => {
        return text ? <Tooltip placement="topLeft" key={record.ddbh} title={text}>{text}</Tooltip> : '';;
      } 
    },
    { title: '出口日期', dataIndex: 'ckrq1', width: 100, ellipsis: true, fixed: 'left', render: (text: any) => { return myUtil.date.formatDate(text, 'YYYY-MM-DD') } },
    { title: '报关合同号', dataIndex: 'ckhth', width: 170, fixed: 'left' },
    { title: '报关单号', dataIndex: 'bgdhgbh', width: 160 },
    { title: '项号', dataIndex: 'hwxh', width: 100 },
    { title: '品名', dataIndex: 'hgspmc', width: 180 },
    { title: '出口数量', dataIndex: 'sbsl1', width: 100, align: 'right', render: (text: any) => { return myUtil.text.formatNum(text, '0,0.00000') } },
    { title: '成交单位', dataIndex: 'sbjldwmc', width: 100, ellipsis: true },
    { title: '美元金额', dataIndex: 'mylaj', width: 100, align: 'right', render: (text: any) => { return myUtil.text.formatNum(text, '0,0.00') } },
    { title: '不含税金额', dataIndex: 'rmblaj', width: 100, align: 'right', render: (text: any) => { return myUtil.text.formatNum(text, '0,0.00') } },
    { title: '收汇日期', dataIndex: 'ckshrq', width: 140, editable: true, editType: 'DatePicker' },
    { title: '收汇币种', dataIndex: 'ckshhbzmDm', width: 140, editable: true, editType: 'Select' },
    { title: '收汇金额', dataIndex: 'ckshje', width: 140, editable: true, editType: 'InputNumber' },
    { title: '收汇汇率', dataIndex: 'ckshhbhl', width: 140, editable: true, editType: 'InputNumber' },
    { title: '结汇金额RMB', dataIndex: 'ckshjermb', width: 140, editable: true, editType: 'InputNumber' },
    { title: '支付结汇额', dataIndex: 'zfjk', width: 140, editable: true, editType: 'InputNumber' },
    { title: '支付日期', dataIndex: 'zfkxrq', width: 140, editable: true, editType: 'DatePicker' }
  ]
  // 设置列
  const mergedColumns = columns.map((col) => {
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
        index,
        codeDmGyHbOptions
      }),
    };
  });

  // 开启
  const showModal = (data: any, ref: any) => {
    const list = cloneDeep(data);
    list.map((item: any) => {
      item.ckshrq = item.ckshrq ? moment(new Date(item.ckshrq)) : null;
      item.zfkxrq = item.zfkxrq ? moment(new Date(item.zfkxrq)) : null;
    })
    setDataSource(list)
    setMainRef(ref);
    setModalVisible(true);
  };
  // 关闭
  const close = () => { 
    setModalVisible(false);
    setMasker(false);
  }
  // 保存
  const save = () => {
    const list = cloneDeep(dataSource);
    list.map((item: any) => {
      item.ckshrq = item.ckshrq ? moment(new Date(item.ckshrq)).format('YYYY-MM-DD') : null
      item.zfkxrq = item.zfkxrq ? moment(new Date(item.zfkxrq)).format('YYYY-MM-DD') : null
    })
    const param = {
      bclx: 'shjs',
      ddmxList: list
    }
    setMasker(true);
    updateDjsdd(param).then((response: any) => {
      setMasker(false);
      const { code } = response;
      if (code === '200') {
        mainRef.current!.reload2();
        close();
        message.success('保存成功！');
      }
    })
  }

  return (
    <Modal
      title="收汇结算"
      destroyOnClose={true}
      visible={modalVisible}
      width={pro.c_modal_width_x4}
      maskClosable={false}
      footer={
        <>
          <Button onClick={close}>取消</Button>
          <Button onClick={save} type="primary">确定</Button>
        </>
      }
      onCancel={() => setModalVisible(false)}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <Table
          components={components}
          bordered
          dataSource={dataSource}
          columns={mergedColumns}
          scroll={{ x: '1100px', y: `${document.documentElement.clientHeight - 170}px` }}
          pagination={false}
          rowKey='ddbh'
        />
      </Spin>
    </Modal>
  );
};

export default Maintain;
