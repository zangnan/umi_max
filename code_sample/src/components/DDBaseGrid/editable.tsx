import React, { useEffect, useState, useRef, useContext } from 'react';
import { Form, Select, Input } from 'antd';
import type { EditableCellProps, EditableRowProps } from './data.d';
import type { FormInstance } from 'antd/lib/form';
import eventOnChange from '@/pages/common/field/eventOnChange';
import myUtil from '@/pages/common/myUtil';
import './style.less';

// 编辑单元格
const EditableContext = React.createContext<FormInstance<any> | null>(null);

export const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

export const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  editType,
  func,
  showSearch,
  codeTable,
  handleSave,
  reload,
  unitRef,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<Input>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  const saveSelect = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
      eventOnChange[func]({ record, values, reload, });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
 const show = (input :any ,option:any) => {
   return option.children.includes(input)
 }

  let childNode = children;
  let inputNode: any;
  if (editType === 'Select') {
    if (codeTable) {
      const row = myUtil.code.getCode(codeTable[0], codeTable[1]);
      if (showSearch === true) {
        if ('购买方名称' === title) {
          inputNode = <Select showSearch onSelect={saveSelect} onBlur={saveSelect} ref={inputRef} 
            filterOption={(input, option) => show(input, option)}
          >
            {row.map(d => <Select.Option key={d.code} value={d.code}>{d.name}</Select.Option>)}
          </Select>
        }
      } else {
        inputNode = <Select onSelect={saveSelect} >
          {row.map(d => <Select.Option key={d.code} value={d.code}>{d.name}</Select.Option>)}
        </Select>
      }
    }
  } else {
    inputNode = <Input ref={inputRef} onPressEnter={save} onBlur={save} />;
  }

  if (editable) {
    childNode = editing ? (
      <Form.Item key={dataIndex} style={{ margin: 0 }} name={dataIndex}>
        {inputNode}
      </Form.Item>
    ) : (
      <div key={dataIndex} className="editable-cell-value-wrap editable-cell-value-ellipsis" style={{ paddingRight: 5, minHeight: 20 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td key={dataIndex} {...restProps}>{childNode}</td>;
};

// 设置: 可编辑列
export const getEditcomponents = (cols: any) => {
  return cols.find((col: any) => { return col.editable }) ? {
    body: {
      row: EditableRow,
      cell: EditableCell,
    }
  } : {}
};

export const setEditColumns = (params: any) => {
  const { columns, reload, handleSave, onClick,unitRef } = params;
  columns.map((col: any) => {
    if (col.editable) {
      const obj = col;
      obj.onCell = (record: any) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        editType: col.editType,
        func: col.func,
        showSearch: col.showSearch,
        codeTable: col.codeTable,
        reload,
        unitRef,
        handleSave,
        onClick,
      })
    }
  })
  return columns;
}