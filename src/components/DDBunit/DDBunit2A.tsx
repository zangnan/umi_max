import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'umi';
import { Flex, Spin, InputNumber, Select, DatePicker, TimePicker, Drawer, FloatButton, Modal, Tabs, message, Divider } from 'antd';
import { Button, Form, Input, Popconfirm, Table, Space, Switch, Radio, List, Avatar, Badge, Typography, Dropdown, notification } from 'antd';
import { ProCard } from '@ant-design/pro-components';
import { CSS } from '@dnd-kit/utilities';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DropDownList, AddSubtract, Repair, Calendar } from '@icon-park/react';
import CONSTANTS from '../DDAssist/constants';
import ReactJson from 'react-json-view';
import myUtil from '../DDAssist/util';
import { SelectOutlined, DownOutlined, UpOutlined, DoubleRightOutlined, DoubleLeftOutlined, CheckOutlined, MinusOutlined, CodeOutlined } from '@ant-design/icons';
import { CloudUploadOutlined, FormOutlined, PlusOutlined, SaveOutlined, RetweetOutlined, KeyOutlined, FallOutlined, RiseOutlined, MenuOutlined, MinusCircleOutlined, TagOutlined } from '@ant-design/icons';
import { FileDoneOutlined, DeleteOutlined, ClearOutlined, DatabaseOutlined, FileExcelOutlined, BarsOutlined, LayoutOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import DDBunit2 from './DDBunit2';
import DDBaseForm from '../DDForm/DDBaseForm';
import { itemType } from '../DDForm/data.d';
import unitConfigExample from './config_example';
import type { FormInstance } from 'antd/es/form';
import { cloneDeep } from 'lodash';
import dayjs from "dayjs";
import './style.less';
import VanillaJSONEditor from './VanillaJSONEditor';
import ExcelConfigV2 from './excelConfig.v2';
import { retrieveObjectByDomain, getDbField, retrieveAppModuleDetail, createAppModule, createAppModuleByExcelData } from '@/services/hts/api';
import { C_GRID_COLUMNS, GRID_WIDTH, GRID_WIDTH_NUMBER, GRID_WIDTH_DATE, GRID_ROW_KEY, DELETE_KEY } from './excelConfig.v2.constants';
import { C_FORM_ITEMS, C_FILTER_ITEMS, C_GRID_FILTER_QUICK, C_GRID_SUM_FIELD, C_HANDLE_COLUMNS, C_CUSTOMER_TOOLBAR, GRID_DEFAULT_SORT } from './excelConfig.v2.constants';
import DDBunit2ADBUtil from './DDBunit2ADBUtil';

// EditableContext *************************************************************************
const EditableContext = React.createContext<FormInstance<any> | null>(null);

// EditableRow *****************************************************************************
const EditableRow: React.FC<any> = ({ children, ...props }) => {
  const [form] = Form.useForm();
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props['data-row-key'],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} ref={setNodeRef} style={style} {...attributes}>
          {React.Children.map(children, (child) => {
            if ((child as React.ReactElement).key === 'sort') {
              return React.cloneElement(child as React.ReactElement, {
                children: (
                  <MenuOutlined ref={setActivatorNodeRef} style={{ touchAction: 'none', cursor: 'move' }} {...listeners} />
                ),
              });
            }
            return child;
          })}
        </tr>
      </EditableContext.Provider>
    </Form>
  );
};

// EditableCell ****************************************************************************
const EditableCell: React.FC<any> = ({
  editType,
  editable,
  editRange,
  children,
  dataIndex,
  record,
  handleSave,
  cellFlag,
  range,
  dbFields,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const [currentEditType, setCurrentEditType] = useState(null);
  const inputRef = useRef<any>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);


  const getDbFieldSelectOpt = () => {
    const children: any = [];
    for (let i = 0; i < dbFields.length; i++) {
      children.push(<Select.Option key={i.toString(36) + i} value={dbFields[i].dictFieldId}>
        {`${dbFields[i].dictObjectTableName}_${dbFields[i].dictFieldName}_${dbFields[i].dictFieldDesc}`}
      </Select.Option>);
    }
    return children;
  }

  const toggleEdit = () => {
    setEditing(!editing);
    if (editType === 'Compact2') {
      setCurrentEditType(record[dataIndex]);
      if (record[dataIndex] === itemType.Input) {
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
        form.setFieldsValue({ range: record.range || false });
      } else if (record[dataIndex] === itemType.Select) {
        let codeTable = record?.codeTable || '';
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
        form.setFieldsValue({ codeTable });
      } else if (record[dataIndex] === itemType.DatePicker) {
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
        form.setFieldsValue({ range: record.range || false });
      } else  {
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
      }
    } else {
      if (dataIndex === 'codeTable') {
        // form.setFieldsValue({ [dataIndex]: record[dataIndex]?.length > 0 ? record[dataIndex][0] : record[dataIndex]});
        form.setFieldsValue({ [dataIndex]: record[dataIndex]});
      } else {
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
      }
    }
  };

  const save = async () => {
    try {
      let values: any = await form.validateFields();
      if (editRange === 'rules') {

      } else {
        if (editType === 'Compact2') {
          setCurrentEditType(values.type);
          if (values.type === itemType.Select) {
            if (values.codeTable) {
              // values.codeTable = [values.codeTable, '01'];
              values.codeTable = values.codeTable;
            }
          } else if (values.type === itemType.Input) {
          } else if (values.type === itemType.DatePicker) {
          }
        } else if (values?.render?.type === '-') {
          delete values.render;
          delete record.render;
        } else if (values.codeTable) {
          // values.codeTable = [values.codeTable, '01']
          values.codeTable = values.codeTable;
        } else if (editType === 'SelectLayoutDesc') {
        }
        if (editType === 'Select') {
          let dbField = dbFields.find((tmp: any) => { return tmp.dictFieldId === values.dictFieldId });
          values.dbField = dbField;
        }
      }
      if (editType !== 'Compact2' && editType !== 'Compact') {
        toggleEdit();
      }
      handleSave({ ...record, ...values, cellFlag, editType });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let inputNode: any;
  if (editType === 'Input') {
    inputNode = <Input ref={inputRef} onPressEnter={save} onBlur={save} />;
  } else if (editType === 'Compact') {
    inputNode = <>
      <Space.Compact>
        <Form.Item name={['render', 'type']} noStyle
          // rules={[{ required: true, message: 'Province is required' }]}
        >
          <Select onChange={save} onBlur={save} ref={inputRef} options={[
            { value: 'number', label: 'number' },
            { value: 'date', label: 'date' },
            { value: 'mask', label: 'mask' },
            // { value: 'json', label: 'json' },
            { value: '-', label: '——' },
          ]} />
        </Form.Item>
        <Form.Item name={['render', 'format']} noStyle
          // rules={[{ required: true, message: 'Street is required' }]}
        >
          {/* <Input style={{ width: '50%' }} placeholder="Input street" /> */}
          <Input onPressEnter={save} onBlur={save} />
        </Form.Item>
        <Form.Item noStyle>
          <Button type='link' size='small' onClick={() => {toggleEdit()}} icon={<CheckOutlined />}></Button>
        </Form.Item>
      </Space.Compact>
    </>
  } else if (editType === 'Compact2') {
    inputNode = <>
      <Space.Compact>
        <Form.Item name={'type'} noStyle>
          <Select onChange={save} ref={inputRef} style={{width: '100px'}} options={[
            { value: itemType.Input, label: 'Input' },
            { value: itemType.DatePicker, label: 'DatePicker' },
            { value: itemType.Select, label: 'Select' },
            { value: itemType.InputNumber, label: 'InputNumber' },
            { value: itemType.Hidden, label: 'Hidden' },
            { value: itemType.GroupTitle, label: 'GroupTitle' },
            { value: itemType.RichTextEditor, label: 'RichTextEditor' },
            { value: itemType.Upload, label: 'Upload' },
          ]} />
        </Form.Item>
        {(currentEditType === itemType.DatePicker || currentEditType === itemType.Input || currentEditType === itemType.InputNumber) && <Form.Item name='range' noStyle>
          <Select onChange={save} ref={inputRef} style={{width: '200px'}} options={[
            { value: true, label: '范围筛选' },
            { value: false, label: '非范围筛选' },
          ]} />
        </Form.Item>
        }
        {currentEditType === itemType.Select && <Form.Item name='codeTable' noStyle>
          <Input onPressEnter={save} onBlur={save} ref={inputRef} style={{width: '200px'}}/>
        </Form.Item>
        }
        <Button type='link' size='small' onClick={() => {toggleEdit()}} icon={<CheckOutlined />}></Button>
      </Space.Compact>
    </>
  } else if (editType === 'InputNumber') {
    inputNode = <InputNumber ref={inputRef} onPressEnter={save} onBlur={save}/>;
  } else if (editType === 'Select') {
    inputNode = <Select ref={inputRef} onChange={save} onBlur={save}>
      {getDbFieldSelectOpt()}
    </Select>;
  } else if (editType === 'SelectRulesType') {
    inputNode = <Select ref={inputRef} onChange={save} onBlur={save} allowClear>
      <Select.Option value='base_required'>base_required</Select.Option>
      <Select.Option value='base_type_number'>base_type_number</Select.Option>
      <Select.Option value='base_type_number_english'>base_type_number_english</Select.Option>
      <Select.Option value='base_type_mail'>base_type_mail</Select.Option>
      <Select.Option value='base_type_phone'>base_type_phone</Select.Option>
      <Select.Option value='base_type_idcard'>base_type_idcard</Select.Option>
      <Select.Option value='base_type_chinese'>base_type_chinese</Select.Option>
    </Select>;

  } else if (editType === 'SelectLayoutDesc') {
    inputNode = <Select ref={inputRef} onChange={save} onBlur={save} allowClear>
      <Select.Option value='66'>66</Select.Option>
      <Select.Option value='100'>100</Select.Option>
    </Select>;
  } else if (editType === 'DatePicker' && range) {
    inputNode = <DatePicker.RangePicker />;
  } else if (editType === 'DatePicker') {
    inputNode = <DatePicker/>;
  } else if (editType === 'TimePicker') {
    inputNode = <TimePicker />;
  }
  let childNode = children;
  if (editable) {
    if (editing) { // 可编辑组件：编辑状态
      if (editType === 'Compact') {
        childNode = <Form.Item style={{ margin: 0 }}>
          { inputNode }
        </Form.Item>
      } else if (editType === 'Compact2') {
        childNode = <><Form.Item style={{ margin: 0 }}>
        { inputNode }
      </Form.Item></>
      } else {
        childNode = <Form.Item style={{ margin: 0 }} name={dataIndex}
          // rules={[ { required: true, message: `${title} is required.`, }, ]}
        >
          { inputNode }
        </Form.Item>
      }
    } else { // 可编辑组件：显示状态
      if (editType === 'Compact') {
        let type = record?.render?.type || '';
        let format = record?.render?.format || '';
        if (record?.render?.type=== 'number' || record?.render?.type === 'date') {
          type += ': ';
        }
        childNode = <div className="editable-cell-value-wrap" onClick={toggleEdit}>{`${type}${format}`}</div>
      } else if (editType === 'Compact2') { // 过滤项、表单项
        let type = record?.type;
        let editElement: any;
        let txt: any;
        if (type === itemType.Input) {
          let range = record?.range || false;
          txt = `${range ? '范围筛选' : ''}`;
          editElement = <Repair theme="outline" size="18" fill="#333" strokeWidth={3}/>;
        } else if (type === itemType.InputNumber) {
          let range = record?.range || false;
          txt = `${range ? '范围筛选' : ''}`;
          editElement = <AddSubtract theme="outline" size="18" fill="#333" strokeWidth={3}/>;
        } else if (type === itemType.Select) {
          let codeTable = record?.codeTable?.length > 0 ? ` 码表：${record?.codeTable}` : '';
          txt = `${codeTable}`;
          editElement = <DropDownList theme="outline" size="18" fill="#333" strokeWidth={3}/>;
        } else if (type === itemType.DatePicker) {
          let range = record?.range || false;
          txt = `${range ? '范围筛选' : '非范围筛选'}`;
          editElement = <Calendar theme="outline" size="18" fill="#333" strokeWidth={3}/>;
        } else if (record?.type === itemType.Hidden) {
          editElement = <EyeInvisibleOutlined />;
        } else if (record?.type === itemType.GroupTitle) {
          editElement = <TagOutlined />;
        } else if (record?.type === itemType.RichTextEditor) {
          editElement = <FormOutlined />;
        } else if (record?.type === itemType.Upload) {
          editElement = <CloudUploadOutlined />;
        }
        childNode = <div className="editable-cell-value-wrap" onClick={toggleEdit}>
          {editElement} {children} {txt}
        </div>
      } else {
        if (dataIndex === 'codeTable' && record?.codeTable) {
          childNode = <div className="editable-cell-value-wrap" onClick={toggleEdit}>
            {record?.codeTable}
          </div>
        } else {
          childNode = <div className="editable-cell-value-wrap" onClick={toggleEdit}>
            {children}
          </div>
        }
      }
    }
  }
  return <td {...restProps}>{childNode}</td>;
};

// DDBunit2Props ***************************************************************************
export type DDBunit2Props = {
  config: any;
  func?: any;
};

// Unit2 ***********************************************************************************
const Unit2: React.FC<DDBunit2Props> = ({ config, func = {} }) => {
  const [masker, setMasker] = useState(false);
  const [loadingViewSetting, setLoadingViewSetting] = useState(false);
  const [loadingScheme, setLoadingScheme] = useState(false);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [dbForm] = Form.useForm();
  const FuncForm: any = {};
  const [activeKey, setActiveKey] = useState(C_GRID_COLUMNS); // other C_GRID_COLUMNS C_FORM_ITEMS
  const [myConfig, setMyConfig] = useState({ ...config });
  const [editJson, setEditJson] = useState<any>({ text: undefined, json: {} });
  const [count, setCount] = useState(100);
  const [pageId] = useState<any>(config.page_id);
  const showBtnIcon = false; // 是否显示按钮图标
  const [modalVisible0, setModalVisible0] = useState<boolean>(false);         // 弹窗: 配置主界面
  const [modalVisible1, setModalVisible1] = useState<boolean>(false);         // 弹窗: 预览Json
  const [modalVisible2, setModalVisible2] = useState<boolean>(false);         // 弹窗: 编辑Json
  const [modalVisible3, setModalVisible3] = useState<boolean>(false);         // 弹窗: 选择方案
  const [modalVisible4, setModalVisible4] = useState<boolean>(false);         // 弹窗: 保存方案
  const location: any = useLocation();
  const [isEditJsonFlag, setIsEditJsonFlag]  = useState<boolean>(false);      // 编辑Json: 全量编辑 true | 当前Tab编辑 false
  const [schemeList, setSchemeList] = useState<any>([]);
  const [requestJson, setRequestJson] = useState<any>();
  const [showPageElement, setShowPageElement] = useState<boolean>(false);     // 当前页面是否已有元素显示
  const [showQuickIcon, setShowQuickIcon] = useState<boolean>(false);         // 当前页面是否已有元素显示
  const [appModule, setAppModule] = useState<any>({});                        // App Module
  // Excel 导入 ********************************
  const [modalVisible6, setModalVisible6] = useState<boolean>(false);         // 弹窗: Excel 导入模块
  const [excelImportUnitList, setExcelImportUnitList] = useState<any>([]);    // 弹窗: Excel 导入模块
  const [excelOriginalData, setExcelOriginalData] = useState<any>({});        // 弹窗: Excel 原始数据
  const refModalExcelV1: any = useRef();                                      // 弹窗: Excel v1 配置
  const refModalExcelV2: any = useRef();                                      // 弹窗: Excel v2 配置
  const [modal6Loading, setModal6Loading] = useState<boolean>(false);         // 弹窗: Excel 导入模块
  // 数据元 Modal ********************************
  const [modalVisible5, setModalVisible5] = useState<boolean>(false);                           // 数据元 Modal - 是否可见
  const [dbTables, setDbTables] = useState<any>([]);                                            // 数据元 Modal - 物理表
  const [dbTableChecked, setDbTableChecked] = useState<any>({});                                // 数据元 Modal - 左侧选中的物理表
  const [dbFieldsOriginal, setDbFieldsOriginal] = useState<any>([]);                            // 数据元 Modal - 原始数据字段
  const [dbFields, setDbFields] = useState<any>(myConfig?.backend_dev_dict?.db_fields || []);   // 数据元 Modal - 已选择数据字段
  const [dbFieldsTables, setDbFieldsTables] = useState<any>([]);                                // 数据元 Modal - 已选择数据字段的数据元
  const [dbConnectings, setDbConnectings] = useState<any>([]);                                  // 数据元 Modal - 物理表关联关系
  const [dbKeys, setDbKeys] = useState<any>([]);                                                // 数据元 Modal - 物理表主键
  // 视图设置 Drawer ********************************
  const [gridColumns, setGridColumns] = useState<any>([]);                    // 视图设置 Drawer 配置：列表项
  const [formItems, setFormItems] = useState<any>([]);                        // 视图设置 Drawer 配置：表单项
  const [filterItems, setFilterItems] = useState<any>([]);                    // 视图设置 Drawer 配置：筛选
  const [gridFilterQuick, setGridFilterQuick] = useState<any>([]);            // 视图设置 Drawer 配置：工具栏筛选
  const [gridSumField, setGridSumField] = useState<any>([]);                  // 视图设置 Drawer 配置：统计字段
  const [handleColumns, setHandleColumns] = useState<any>([]);                // 视图设置 Drawer 配置：自定义操作列
  const [customerToobar, setCustomerToobar] = useState<any>([]);              // 视图设置 Drawer 配置：自定义工具栏
  const [gridDefaulteSort, setGridDefaulteSort] = useState<any>([]);          // 视图设置 Drawer 配置：列表排序

  // 重置视图设置Drawer
  // formItemKey 仅用于增加校验行
  const setPreviewByType = ({type, newDataSource, formItemKey}: any) => {
    if (type === C_GRID_COLUMNS) {
      setGridColumns(myUtil.array.setKey(newDataSource));
    } else if (type === C_FILTER_ITEMS) {
      setFilterItems(myUtil.array.setKey(newDataSource));
    } else if (type === C_GRID_FILTER_QUICK) {
      setGridFilterQuick(myUtil.array.setKey(newDataSource));
    } else if (type === C_FORM_ITEMS) {
      setFormItems(myUtil.array.setKey(newDataSource));
    } else if (type === C_GRID_SUM_FIELD) {
      setGridSumField(myUtil.array.setKey(newDataSource));
    } else if (type === C_HANDLE_COLUMNS) {
      setHandleColumns(myUtil.array.setKey(newDataSource));
    } else if (type === C_CUSTOMER_TOOLBAR) {
      setCustomerToobar(myUtil.array.setKey(newDataSource));
    } else if (type === GRID_DEFAULT_SORT) {
      setGridDefaulteSort(myUtil.array.setKey(newDataSource));
    } else if (type === 'rules') {
      const formItemsTemp: any = [...formItems];
      formItemsTemp.forEach((item: any, index: any) => {
        if (item.key === formItemKey) {
          formItemsTemp[index]['rules'] = myUtil.array.setKey(newDataSource);
        }
      })
      setFormItems(formItemsTemp);
    }
  }

  // getTargetDataByType
  const getTargetDataByType = ({type, formItemKey}: any) => {
    let targetData: any;
    if (type === C_GRID_COLUMNS) {
      targetData = [...gridColumns];
    } else if (type === C_FILTER_ITEMS) {
      targetData = [...filterItems];
    } else if (type === C_GRID_FILTER_QUICK) {
      targetData = [...gridFilterQuick];
    } else if (type === C_FORM_ITEMS) {
      targetData = [...formItems];
    } else if (type === C_GRID_SUM_FIELD) {
      targetData = [...gridSumField];
    } else if (type === 'rules') {
      const tmpFormItem = formItems?.find((item: any) => { return formItemKey === item.key });
      targetData = [...(tmpFormItem?.rules || [])];
    } else if (type === C_HANDLE_COLUMNS) {
      targetData = [...handleColumns];
    } else if (type === C_CUSTOMER_TOOLBAR) {
      targetData = [...customerToobar];
    } else if (type === GRID_DEFAULT_SORT) {
      targetData = [...gridDefaulteSort];
    }
    return targetData;
  }

  // 重置设置视图&预览视图
  const resetPreview = ({record, index, newArr, type, formItemKey}: any) => {
    let newDataSource: any = newArr ? [...newArr] : getTargetDataByType({type});
    if (record && index) {
      newDataSource[index] = record;
    }
    const newConfig: any = cloneDeep(myConfig);
    setPreviewByType({type, newDataSource, formItemKey});
    if (type === 'rules') {
      const newFormItems: any = cloneDeep(formItems);
      const tmpFormItem: any = newFormItems?.find((item: any) => { return formItemKey === item.key });
      tmpFormItem.rules = newDataSource;
      newConfig.form_items = newFormItems;
    } else {
      newConfig[type] = newDataSource;
    }
    setMyConfig(newConfig);
    // setMyConfig(cloneDeep(newConfig))
    isShowPageElement(newConfig);
  }

  // 列表：上移、下移、置顶、置底
  const setPosition = (index: any, flag: any, record: any, type: any) => {
    let tmpArr: any = getTargetDataByType({type});
    const fixedType = record.fixed; // 获取列类型（固定列、自由列）
    let tempData: any = [];
    let parentIndex: any = '';
    if (record.type === 'children') {// 当前列为二级表头时，做以下处理（将操作数据元替换为当前二级表头所在的范围）
      tempData = tmpArr.filter((item: any, index: any) => {
        if (record.parentNode === item.dataIndex) {
          parentIndex = index;
        }
        return record.parentNode === item.dataIndex;
      })
      tempData = [].concat(tempData[0].children);
    } else {// 不是二级表头时正常获取数据元
      tempData = [].concat(tmpArr);
    }
    let leftFreeIndex = 0; // 自由列首列索引
    let leftFixedIndex = 0; // 居左末列索引
    for (let i = 0; i < tempData.length; i++) {
      if (tempData[i]?.fixed !== 'left') {
        leftFreeIndex = i;
        leftFixedIndex = i - 1;
        break;
      }
    }
    let rightFreeIndex = tempData.length - 1; // 自由列末列索引
    let rightFixedIndex = tempData.length - 1; // 居右首列索引
    for (let i = tempData.length - 1; i >= 0; i--) {
      if (tempData[i]?.fixed !== 'right') {
        rightFreeIndex = i;
        rightFixedIndex = i + 1;
        break;
      }
    }
    if (flag === 'up') {// 上移
      [tempData[index], tempData[index - 1]] = [tempData[index - 1], tempData[index]];
    } else if (flag === 'down') {// 下移
      [tempData[index], tempData[index + 1]] = [tempData[index + 1], tempData[index]];
    } else if (flag === 'top') {// 置顶
      if (fixedType === 'left') {
        tempData.unshift(tempData.splice(index, 1)[0]);
      } else if (fixedType === 'right') {
        tempData.splice(rightFixedIndex, 0, tempData.splice(index, 1)[0]);
      } else {
        tempData.splice(leftFreeIndex, 0, tempData.splice(index, 1)[0]);
      }
    } else if (flag === 'bottom') {// 置底
      if (fixedType === 'right') {
        tempData.push(tempData.splice(index, 1)[0]);
      } else if (fixedType === 'left') {
        tempData.splice(leftFixedIndex, 0, tempData.splice(index, 1)[0]);
      } else {
        tempData.splice(rightFreeIndex, 0, tempData.splice(index, 1)[0]);
      }
    } else if (flag === 'left') {// 居左冻结
      tempData[index].fixed = 'left';
      tempData.splice(leftFreeIndex, 0, tempData.splice(index, 1)[0]);
    } else if (flag === 'right') {// 居右冻结
      tempData[index].fixed = 'right';
      tempData.splice(rightFreeIndex, 0, tempData.splice(index, 1)[0]);
    } else if (flag === 'cancel') {// 取消冻结
      delete tempData[index].fixed;
      if (fixedType === 'left') {
        tempData.splice(leftFixedIndex, 0, tempData.splice(index, 1)[0]);
      } else if (fixedType === 'right') {
        tempData.splice(rightFixedIndex, 0, tempData.splice(index, 1)[0]);
      }
    }
    let newArr: any = [];
    if (record.parentNode) {// 当前列为二级表头时，做以下处理后重新赋值
      tmpArr[parentIndex].children = [].concat(tempData);
      newArr = [].concat(tmpArr);
    } else {// 不是二级表头时正常赋值
      newArr = [].concat(tempData);
    }
    // 重置设置视图&预览视图
    // resetPreview({record, index, newArr, type});
    resetPreview({newArr, type});
  };

  // handleDelete
  const handleDelete = ({key, type, formItemKey, index}: any) => {
    let newData: any = getTargetDataByType({type, formItemKey});
    newData.splice(index, 1);
    setPreviewByType({type, newDataSource: newData, formItemKey});
    resetPreview({newArr: newData, type, formItemKey});
  };

  // 列表：排序是否可用
  const isDisabled = ({index, direction, record, type}: any) => {
    let tmpArr: any = getTargetDataByType({type});
    const fixedType = record.fixed; // 获取列类型（固定列、自由列）
    let tempData: any = [];
    if (record.type === 'children') {// 当前列为二级表头时，做以下处理（将操作数据元替换为当前二级表头所在的范围）
      tempData = tmpArr.filter((item: any) => {
        return record.parentNode === item.dataIndex;
      })
      tempData = [].concat(tempData[0].children);
    } else {// 不是二级表头时正常获取数据元
      tempData = [].concat(tmpArr);
    }
    let leftFreeIndex = 0; // 自由列首列索引
    let leftFixedIndex = 0; // 居左末列索引
    for (let i = 0; i < tempData.length; i++) {
      if (tempData[i]?.fixed !== 'left') {
        leftFreeIndex = i;
        leftFixedIndex = i - 1;
        break;
      }
    }
    let rightFreeIndex = tempData.length - 1; // 自由列末列索引
    let rightFixedIndex = tempData.length - 1; // 居右首列索引
    for (let i = tempData.length - 1; i >= 0; i--) {
      if (tempData[i]?.fixed !== 'right') {
        rightFreeIndex = i;
        rightFixedIndex = i + 1;
        break;
      }
    }
    let fixedLeftTop = record?.fixed === 'left' && index === 0 ? true : false;
    let freeTop = leftFreeIndex === index || index === 0 ? true : false;
    let fixedRightTop = rightFixedIndex === index ? true : false;
    let fixedLeftBottom = leftFixedIndex === index ? true : false;
    let freeBottom = rightFreeIndex === index || (tempData.length - 1) === index ? true : false;
    let fixedRightBottom = record?.fixed === 'right' && (tempData.length - 1) === index ? true : false;

    if (direction === 'up') {
      return (fixedLeftTop || freeTop || fixedRightTop) ? true : false;
    } else if (direction === 'down') {
      return (fixedLeftBottom || freeBottom || fixedRightBottom) ? true : false;
    } else if (direction === 'top') {
      return (fixedLeftTop || freeTop || fixedRightTop) ? true : false;
    } else if (direction === 'bottom') {
      return (fixedLeftBottom || freeBottom || fixedRightBottom) ? true : false;
    } else if (direction === 'left') {
      return (fixedType === 'left' || record.type === 'children') ? true : false;
    } else if (direction === 'right') {
      return (fixedType === 'right' || record.type === 'children') ? true : false;
    } else if (direction === 'cancel') {
      return (!fixedType || !(fixedType === 'left' || fixedType === 'right') || record.type === 'children') ? true : false;
    } else {
      return true;
    }
  };

  // 列表：改变自动省略
  const changeEllipsis = (index: any, record: any, checked: any) => {
    record.ellipsis = checked;
    resetPreview({record, index, type: C_GRID_COLUMNS});
  }

  // 列表：改变合计
  const changeSum = (index: any, record: any, checked: any, flag?: any) => {
    if (flag === '2') {
      record.sum2 = checked;
    } else {
      record.sum = checked;
    }
    resetPreview({record, index, type: C_GRID_COLUMNS});
  }

  // 列表：改变最小值
  const changeMin = (index: any, record: any, checked: any, flag?: any) => {
    if (flag === '2') {
      record.min2 = checked;
    } else {
      record.min = checked;
    }
    resetPreview({record, index, type: C_GRID_COLUMNS});
  }

  // 列表：改变最大值
  const changeMax = (index: any, record: any, checked: any, flag?: any) => {
    if (flag === '2') {
      record.max2 = checked;
    } else {
      record.max = checked;
    }
    resetPreview({record, index, type: C_GRID_COLUMNS});
  }

  // 列表：改变平均值
  const changeAvg = (index: any, record: any, checked: any, flag?: any) => {
    if (flag === '2') {
      record.avg2 = checked;
    } else {
      record.avg = checked;
    }
    resetPreview({record, index, type: C_GRID_COLUMNS});
  }

  // 列表：改变隐藏列
  const changeHidden = (index: any, record: any, checked: any) => {
    record.hidden = checked;
    resetPreview({record, index, type: C_GRID_COLUMNS});
  }

  // 列表：改变列头排序
  const changeSorter = (index: any, record: any, checked: any) => {
    record.sorter = checked;
    resetPreview({record, index, type: C_GRID_COLUMNS});
  }

  // 列表：改变对齐方式
  const changeAlign = (index: any, record: any, event: any) => {
    record.align = event.target.value || 'left';
    resetPreview({record, index, type: C_GRID_COLUMNS});
  };

  // 列表：改变固定列
  const changeFixed = (index: any, record: any, event: any) => {
    setPosition(index, event.target.value || 'cancel', record, C_GRID_COLUMNS);
  };

  // 表单：改变只读
  const changeReadonly = (index: any, record: any, checked: any) => {
    record.readOnly = checked;
    resetPreview({record, index, type: C_FORM_ITEMS});
  }

  // 列表默认排序
  const changeRule = useCallback(
    (index: number, rule: any) => {
      const newData = gridDefaulteSort.concat([]);
      newData[index].order = rule;
      setGridDefaulteSort(newData);
    },
    [gridDefaulteSort]
  );

  // Tab: 列表列配置 通用操作列：排序 删除
  const getConfigHandleColumn: any = ({type}: any) => {
    let arr = [
      { title: '排序', width: 160, fixed: 'right', render: (_text: any, _record: any, index: number) => (<Space size={0}>
        <Button type='link' size='small' onClick={() => setPosition(index ,'top', _record, type)} disabled={isDisabled({index, direction: 'top', record: _record, type: type})}><DoubleLeftOutlined rotate={90}/></Button>
        <Button type='link' size='small' onClick={() => setPosition(index, 'up', _record, type)} disabled={isDisabled({index, direction: 'up', record: _record, type: type})}><UpOutlined /></Button>
        <Button type='link' size='small' onClick={() => setPosition(index, 'down', _record, type)} disabled={isDisabled({index, direction: 'down', record: _record, type: type})}><DownOutlined /></Button>
        <Button type='link' size='small' onClick={() => setPosition(index, 'bottom', _record, type)} disabled={isDisabled({index, direction: 'bottom', record: _record, type: type})}><DoubleRightOutlined rotate={90} /></Button>
        {type === GRID_DEFAULT_SORT && <>
          <Button type='link' disabled={_record.order === 'asc'} onClick={() => changeRule(index ,'asc')} >升序</Button>
          <Button type='link' disabled={_record.order === 'desc'} onClick={() => changeRule(index, 'desc')} >降序</Button>
        </>}
      </Space>)
      },
      { title: '操作', width: type === C_FORM_ITEMS ? 130 : 100, fixed: 'right', render: (_text: any, _record: any, index: number) => (<Space size={0}>
          <Button type='link' size='small' onClick={() => handleDelete({key: _record.key, type, index})}>删除</Button>
          {type === C_FORM_ITEMS && <Button type='link' size='small' onClick={() => {handleAdd({type: 'rules', formItemKey: _record.key})}}>增加校验</Button>}
        </Space>)
      },
    ];
    return arr;
  }

  // Tab: 列表列配置 数据元列渲染
  const renderDbField = (_record: any) => {
    let showDbField: any = '';
    if (_record.dictObjectTableName && _record.dictFieldName) {
      showDbField = _record.dictObjectTableName + '.' + _record.dictFieldName;
    }
    return <>{showDbField}</>
  }

  // Tab: 列表列配置
  const configColumns: any = [
    { key: 'sort', width: 50, align: 'center', fixed: 'left' },
    { title: '数据元（表_字段）', width: 260, dataIndex: 'dictFieldId', fixed: 'left', editable: true, editType: 'Select', render: (_text: any, _record: any) => {
      return renderDbField(_record);
    }},
    { title: '标题', width: 150, dataIndex: 'title', editable: true, editType: 'Input' },
    { title: '接口字段', width: 150, dataIndex: 'dataIndex', editable: true, editType: 'Input' },
    { title: '标题说明', width: 180, dataIndex: 'titleTooltip', editable: true, editType: 'Input' },
    { title: '码表', width: 150, dataIndex: 'codeTable', editable: true, editType: 'Input' },
    { title: '格式化', width: 150, dataIndex: 'render', editable: true, editType: 'Compact' },
    { title: '列宽', width: 70, dataIndex: 'width', editable: true, editType: 'InputNumber' },
    { title: '自动省略', width: 80, dataIndex: 'ellipsis',  render: (_text: any, _record: any, index: number) => {
      return <Switch size="small" checked={_text} onChange={(checked) => changeEllipsis(index, _record, checked)}/>
    }},
    { title: '列头排序', width: 80, dataIndex: 'sorter',  render: (_text: any, _record: any, index: number) => {
      return <Switch size="small" checked={_text} onChange={(checked) => changeSorter(index, _record, checked)}/>
    }},
    { title: '合计', width: 60, dataIndex: 'sum',  render: (_text: any, _record: any, index: number) => {
      return <Switch size="small" checked={_text} onChange={(checked) => changeSum(index, _record, checked)}/>
    }},
    { title: '合计后端', width: 80, dataIndex: 'sum2',  render: (_text: any, _record: any, index: number) => {
      return <Switch size="small" checked={_text} onChange={(checked) => changeSum(index, _record, checked, '2')}/>
    }},
    { title: '最大值', width: 60, dataIndex: 'max',  render: (_text: any, _record: any, index: number) => {
      return <Switch size="small" checked={_text} onChange={(checked) => changeMax(index, _record, checked)}/>
    }},
    { title: '最大值后端', width: 100, dataIndex: 'max2',  render: (_text: any, _record: any, index: number) => {
      return <Switch size="small" checked={_text} onChange={(checked) => changeMax(index, _record, checked, '2')}/>
    }},
    { title: '最小值', width: 60, dataIndex: 'min',  render: (_text: any, _record: any, index: number) => {
      return <Switch size="small" checked={_text} onChange={(checked) => changeMin(index, _record, checked)}/>
    }},
    { title: '最小值后端', width: 100, dataIndex: 'min2',  render: (_text: any, _record: any, index: number) => {
      return <Switch size="small" checked={_text} onChange={(checked) => changeMin(index, _record, checked, '2')}/>
    }},
    { title: '平均值', width: 60, dataIndex: 'avg',  render: (_text: any, _record: any, index: number) => {
      return <Switch size="small" checked={_text} onChange={(checked) => changeAvg(index, _record, checked)}/>
    }},
    { title: '平均值后端', width: 100, dataIndex: 'avg2',  render: (_text: any, _record: any, index: number) => {
      return <Switch size="small" checked={_text} onChange={(checked) => changeAvg(index, _record, checked, '2')}/>
    }},
    { title: '隐藏列', width: 70, dataIndex: 'hidden',  render: (_text: any, _record: any, index: number) => {
      return <Switch size="small" checked={_text} onChange={(checked) => changeHidden(index, _record, checked)}/>
    }},
    { title: '对齐方式', width: 160, dataIndex: 'align', render: (_text: any, _record: any, index: number) => {
      return <Radio.Group size="small" optionType="button" buttonStyle="solid" defaultValue={_text || 'left'}
        options={[
          { label: '居左', value: 'left' },
          { label: '居中', value: 'center' },
          { label: '居右', value: 'right' },
        ]}
        onChange={(event) => changeAlign(index, _record, event)}
      />
    }},
    { title: '固定列', width: 160, dataIndex: 'fixed', render: (_text: any, _record: any, index: number) => {
      return <Radio.Group size="small" optionType="button" buttonStyle="solid" defaultValue={_text || ''}
        options={[
          { label: '居左', value: 'left' },
          { label: '不固定', value: '' },
          { label: '居右', value: 'right' },
        ]}
        onChange={(event) => changeFixed(index, _record, event)}
      />
    }},
    ...getConfigHandleColumn({type: C_GRID_COLUMNS})
  ];

  // Tab: 表单项配置
  const configFormItems: any = [
    { key: 'sort', width: 50, align: 'center', fixed: 'left' },
    { title: '数据元（表_字段）', width: 260, dataIndex: 'dictFieldId', fixed: 'left', editable: true, editType: 'Select', render: (_text: any, _record: any) => {
      return renderDbField(_record);
    }},
    { title: '标签', width: 220, dataIndex: 'label', editable: true, editType: 'Input' },
    { title: '接口字段', width: 220, dataIndex: 'name', editable: true, editType: 'Input' },
    { title: '标签说明', width: 180, dataIndex: 'tooltip', editable: true, editType: 'Input' },
    { title: '类型', width: 400, dataIndex: 'type', editable: true, editType: 'Compact2', render: (_text: any) => {
      return <>{itemType[_text]}</>
    }},
    { title: '只读', width: 80, dataIndex: 'readOnly',  render: (_text: any, _record: any, index: number) => {
      return <Switch size="small" checked={_text} onChange={(checked) => changeReadonly(index, _record, checked)}/>
    }},
    { title: 'blur', width: 130, dataIndex: 'eventOnBlur', editable: true, editType: 'Input' },
    { title: 'focus', width: 130, dataIndex: 'eventOnFocus', editable: true, editType: 'Input' },
    { title: 'onchange', width: 130, dataIndex: 'eventOnChange', editable: true, editType: 'Input' },
    { title: '筛选布局', width: 180, dataIndex: 'layoutDesc', editable: true, editType: 'SelectLayoutDesc' },
    ...getConfigHandleColumn({type: C_FORM_ITEMS})
  ];

  // Tab: 过滤项一配置
  const configFilter: any = [
    { key: 'sort', width: 50, align: 'center', fixed: 'left' },
    { title: '数据元（表_字段）', width: 260, dataIndex: 'dictFieldId', fixed: 'left', editable: true, editType: 'Select', render: (_text: any, _record: any) => {
      return renderDbField(_record);
    }},
    { title: '标签', width: 220, dataIndex: 'label', editable: true, editType: 'Input' },
    { title: '接口字段', width: 220, dataIndex: 'name', editable: true, editType: 'Input' },
    { title: '标签说明', width: 180, dataIndex: 'tooltip', editable: true, editType: 'Input' },
    { title: '类型', width: 400, dataIndex: 'type', editable: true, editType: 'Compact2', render: (_text: any) => {
      return <>{itemType[_text]}</>
    }},
    { title: '筛选占位符', width: 180, dataIndex: 'placeholder', editable: true, editType: 'Input' },
    { title: '筛选布局', width: 180, dataIndex: 'layoutDesc', editable: true, editType: 'SelectLayoutDesc' },
    ...getConfigHandleColumn({type: C_FILTER_ITEMS})
  ];

  // Tab: 过滤项二配置
  const configGridFilterQuick: any = [
    { key: 'sort', width: 50, align: 'center', fixed: 'left' },
    { title: '数据元（表_字段）', width: 260, dataIndex: 'dictFieldId', fixed: 'left', editable: true, editType: 'Select', render: (_text: any, _record: any) => {
      return renderDbField(_record);
    }},
    { title: '标签', width: 220, dataIndex: 'label', editable: true, editType: 'Input' },
    { title: '接口字段', width: 220, dataIndex: 'name', editable: true, editType: 'Input' },
    { title: '类型', width: 400, dataIndex: 'type', editable: true, editType: 'Compact2', render: (_text: any) => {
      return <>{itemType[_text]}</>
    }},
    ...getConfigHandleColumn({type: C_GRID_FILTER_QUICK})
  ];

  // Tab: 统计字段配置
  const configGridSumField: any = [
    { key: 'sort', width: 50, align: 'center', fixed: 'left' },
    { title: '数据元（表_字段）', width: 260, dataIndex: 'dictFieldId', fixed: 'left', editable: true, editType: 'Select', render: (_text: any, _record: any) => {
      return renderDbField(_record);
    }},
    { title: '标签', width: 220, dataIndex: 'label', editable: true, editType: 'Input' },
    { title: '接口字段', width: 220, dataIndex: 'field', editable: true, editType: 'Input' },
    { title: '单位', width: 120, dataIndex: 'unit', editable: true, editType: 'Input' },
    { title: '格式化', width: 120, dataIndex: 'format', editable: true, editType: 'Input' },
    ...getConfigHandleColumn({type: C_GRID_SUM_FIELD})
  ];

  // Tab: 操作列配置
  const configHandleColumns: any = [
    { key: 'sort', width: 50, align: 'center', fixed: 'left' },
    { title: '按钮名称', width: 120, dataIndex: 'name', fixed: 'left', editable: true, editType: 'Input' },
    { title: '按钮key', width: 120, dataIndex: 'key', editable: true, editType: 'Input' },
    { title: '按钮方法名', width: 220, dataIndex: 'func', editable: true, editType: 'Input' },
    ...getConfigHandleColumn({type: C_HANDLE_COLUMNS})
  ];

  // Tab: 工具栏配置
  const configCustomerToobar: any = [
    { key: 'sort', width: 50, align: 'center', fixed: 'left' },
    { title: '按钮名称', width: 120, dataIndex: 'name', fixed: 'left', editable: true, editType: 'Input' },
    { title: '按钮key', width: 120, dataIndex: 'key', editable: true, editType: 'Input' },
    { title: '按钮方法名', width: 220, dataIndex: 'func', editable: true, editType: 'Input' },
    ...getConfigHandleColumn({type: C_CUSTOMER_TOOLBAR})
  ];

  // Tab: 列表排序配置
  const configGridDefaultSort: any = [
    { key: 'sort', width: 50, align: 'center', fixed: 'left' },
    { title: '数据元（表_字段）', width: 260, dataIndex: 'dictFieldId', fixed: 'left', editable: true, editType: 'Select', render: (_text: any, _record: any) => {
      return renderDbField(_record);
    }},
    { title: '标签', width: 220, dataIndex: 'label' },
    { title: '排序规则', dataIndex: 'order', align: 'center', width: 80, render: (text: string) => {
      if (text === 'desc') {
        return <FallOutlined style={{fontSize: '14px', color: '#3b5999'}} />;
      } else if (text === 'asc') {
        return <RiseOutlined style={{fontSize: '14px', color: '#55acee'}} />;
      }
      return <MinusOutlined style={{fontSize: '14px', color: '#d2d2d2'}}/>;
    }},
    ...getConfigHandleColumn({type: GRID_DEFAULT_SORT})
  ];

  // 增加行
  // formItemKey 仅用于增加校验行
  const handleAdd = ({ type, formItemKey }: any) => {
    const newData: any = {
      key: count,
    };
    let originData: any = getTargetDataByType({type, formItemKey });
    originData = [...originData, newData];
    setPreviewByType({type, newDataSource: originData, formItemKey});
    setCount(count + 1);
  };

  // handleSave
  const handleSave = (row: any) => {
    let newData: any = getTargetDataByType({type: row.cellFlag, key: row.key, formItemKey: row.formItemKey, formItemName: row.formItemName});
    const index = newData.findIndex((item: any) => row.key === item.key);
    const item = newData[index];
    // 筛选布局
    if (row.layoutDesc) { // 66 100
      if (row.layoutDesc.toString() === '100') {
        row.layout = CONSTANTS.DEFAULT_FILTER_LAYOUT_100P_ROW;
        row.layoutDesc = 100;
      } else if (row.layoutDesc.toString() === '66') {
        row.layout = CONSTANTS.DEFAULT_FILTER_LAYOUT_66P_ROW;
        row.layoutDesc = 66;
      }
    } else {
      delete row.layoutDesc;
      delete item.layoutDesc;
      delete row.layout;
      delete item.layout;
      // delete row.layoutDesc;
    }
    // 如果改变数据元 -> 改变
    // 1、title - dictFieldDesc
    // 2、dataIndex - dictFieldName
    // 3、align - dbFieldType === number && right
    // 4、width
    if (row?.dbField) {
      let dictFieldTypeTmp: any = row?.dbField?.dictFieldType || '';
      if (row.cellFlag === C_GRID_COLUMNS) {
        row.title = row?.dbField?.dictFieldDesc;
        row.dataIndex = row?.dbField?.dictFieldName;
        if (dictFieldTypeTmp.indexOf('decimal') !== -1) {
          row.align = 'right';
          row.width = GRID_WIDTH_NUMBER;
        } else {
          row.align = 'left';
          row.width = GRID_WIDTH;
        }
      } else if (row.cellFlag === C_FORM_ITEMS || row.cellFlag === C_FILTER_ITEMS || row.cellFlag === C_GRID_FILTER_QUICK) {
        row.label = row?.dbField?.dictFieldDesc;
        row.name = row?.dbField?.dictFieldName;
        let isNumber: any = false;
        if (dictFieldTypeTmp?.indexOf('decimal') !== -1 ||
            dictFieldTypeTmp?.indexOf('int') !== -1 ||
            dictFieldTypeTmp?.indexOf('double') !== -1) {
          isNumber = true;
        }
        if (isNumber) {
          row.type = itemType.InputNumber;
        } else if (dictFieldTypeTmp === 'datetime' || dictFieldTypeTmp === 'date') {
          row.type = itemType.DatePicker;
          row.format = 'YYYY-MM-DD';
        } else {
          row.type = itemType.Input;
        }
      } else if (row.cellFlag === GRID_DEFAULT_SORT) {
        row.label = row?.dbField?.dictFieldDesc;
        row.order = 'desc';
      }
      row.dbKeyDesc = row?.dbField?.dictObjectTableName + '_' + row?.dbField?.dictFieldName + '_' + row?.dbField?.dictFieldDesc;
    }
    newData.splice(index, 1, {
      ...item,
      ...row,
      ...row?.dbField,
    });
    setPreviewByType({type: row.cellFlag, newDataSource: newData, formItemKey: row.formItemKey});
    const newConfig: any = cloneDeep(myConfig);
    // if (row.cellFlag === C_HANDLE_COLUMNS) {
    //   newConfig.handle_columns = newData;
    // } else
    if (row.cellFlag !== 'rules') {
      newConfig[row.cellFlag] = newData;
    } else {
      const changedIndex: any = formItems?.findIndex((item: any) => { return row.formItemKey === item.key });
      newConfig.form_items[changedIndex].rules = newData;
    }
    setMyConfig(cloneDeep(newConfig))
  };

  // getConfigShow
  const getConfigShow: any = ({columns, type}: any) => {
    const configShow: any = columns.map((col: any) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: any) => ({
          record,
          editType: col.editType,
          editable: col.editable,
          editRange: col.editRange,
          dataIndex: col.dataIndex,
          type: col.type,
          title: col.title,
          cellFlag: type,
          range: col.range,
          handleSave,
          dbFields: dbFields,
        }),
      };
    });
    return configShow;
  }

  const configColumnsShow: any = getConfigShow({columns: configColumns, type: C_GRID_COLUMNS});
  const configFormItemsShow: any = getConfigShow({columns: configFormItems, type: C_FORM_ITEMS});
  const configFilterShow: any = getConfigShow({columns: configFilter, type: C_FILTER_ITEMS});
  const configGridFilterQuickShow: any = getConfigShow({columns: configGridFilterQuick, type: C_GRID_FILTER_QUICK});
  const configGridSumFieldShow: any = getConfigShow({columns: configGridSumField, type: C_GRID_SUM_FIELD});
  const configHandleColumnsShow: any = getConfigShow({columns: configHandleColumns, type: C_HANDLE_COLUMNS});
  const configCustomerToobarShow: any = getConfigShow({columns: configCustomerToobar, type: C_CUSTOMER_TOOLBAR});
  const configGridDefaultSortShow: any = getConfigShow({columns: configGridDefaultSort, type: GRID_DEFAULT_SORT});

  // onReset
  const onReset = () => {
    form.resetFields();
  };

  // onSave
  const onSave = () => {
    form.validateFields().then(async (values: any) => {
      const newConfig: any = cloneDeep(myConfig);
      newConfig.toolbar_default = {
        ...values
      };
      newConfig.grid_handle_columns_default = {
        edit: values.gird_edit,
        delete: values.gird_delete,
        detail: values.gird_detail,
      };
      setMyConfig(newConfig);
    });
  };

  // 保存视图
  const saveView = () => {
    setLoadingViewSetting(true);
    let dictAppModuleDef = {
      ...initValue(myConfig),
      ...myConfig,
    }
    deleteConfigKey(dictAppModuleDef);
    let para: any = {
      ...appModule,
      dictAppModuleDef: dictAppModuleDef,
    };
    // 匹配后端api
    let dictObjectIdTmp = dbFieldsTables?.length > 0 ? dbFieldsTables[0].dictObjectId : '';
    let dictObjectTableTmp = dbFieldsTables.find((item: any) => {return item.dictObjectId === dictObjectIdTmp});
    // 根据 查找 dictFieldId  dictFieldName
    let targetDictFieldName = myConfig?.grid_row_key || GRID_ROW_KEY;
    let tmpField = dbFields.find((item: any) => {return item.dictFieldName === targetDictFieldName});
    let targetDictFieldId = tmpField?.dictFieldId; // 当前仅支持单表数据元的删除、修改、查询

    if (!para?.dictAppModuleDef?.backend_dev_dict) {
      para.dictAppModuleDef.backend_dev_dict = {}
    }
    para.dictAppModuleDef.backend_dev_dict.api = {};

    let relObj = {
      mainObject: dictObjectIdTmp,
      mainObjectTableName: dictObjectTableTmp.dictObjectTableName, // 用于前端excel导出时回显
      joins: dbConnectings,
      key: dbKeys,
    };


    // 排序规则
    let tmpGridDefaulteSort: any = [];
    gridDefaulteSort.forEach((item: any) => {
      tmpGridDefaulteSort.push({
        dictObjectName: item.dictObjectName,
        dictObjectTableName: item.dictObjectTableName,
        dictFieldDesc: item.dictFieldDesc,
        dictFieldName: item.dictFieldName,
        order: item.order,
        label: item.label,
        dictDomainId: item.dictDomainId,
        dictFieldId: item.dictFieldId,
      });
    })
    // para.dictAppModuleDef.backend_dev_dict.grid_default_sort = tmpGridDefaulteSort;

    para.dictAppModuleDef.backend_dev_dict.api.dict_api_grid_query = { // api：列表查询
      type: 'c',
      url: myConfig?.api_grid_query || `${CONSTANTS.DEFAULT_API.GRID_QUERY}/${myConfig?.module_key}`,
      rel: relObj,
      sort: tmpGridDefaulteSort,
    };
    para.dictAppModuleDef.backend_dev_dict.api.dict_api_form_delete = { // api：表单删除
      type: 'c',
      url: myConfig?.api_form_delete || `${CONSTANTS.DEFAULT_API_FORM_DELETE}/${myConfig.module_key}`,
      rel: relObj,
    };
    para.dictAppModuleDef.backend_dev_dict.api.dict_api_form_query = { // api：表单查询
      type: 'c',
      url: myConfig?.api_form_query || `${CONSTANTS.DEFAULT_API_FORM_QUERY}/${myConfig?.module_key}`,
      rel: relObj,
    };
    para.dictAppModuleDef.backend_dev_dict.api.dict_api_form_edit = { // api：表单更新
      type: 'c',
      url: myConfig?.api_form_edit || `${CONSTANTS.DEFAULT_API_FORM_EDIT}/${myConfig.module_key}`,
      rel: relObj,
    };
    para.dictAppModuleDef.backend_dev_dict.api.dict_api_excel_export = {
      type: 'c',
      url: myConfig?.api_excel_export || `${CONSTANTS.DEFAULT_API_EXCEL_EXPORT}/${myConfig.module_key}`,
      rrel: relObj,
    };
    para.dictAppModuleDef.backend_dev_dict.api.dict_api_excel_import = {
      type: 'c',
      url: myConfig?.api_excel_import || `${CONSTANTS.DEFAULT_API_EXCEL_IMPORT}/${myConfig.module_key}`,
      rel: relObj,
    };
    para.dictAppModuleDef.backend_dev_dict.api.dict_api_excel_template = {
      type: 'c',
      url: myConfig?.api_excel_template || `${CONSTANTS.DEFAULT_API_EXCEL_TEMPLATE}/${myConfig.module_key}`,
      rel: relObj,
    };

    // para.dictAppModuleDef.backend_dev_dict = {
    //   appModule: { ...appModule },
    // }
    para.dictAppModuleDef.backend_dev_dict.appModule = { ...appModule };
    createAppModule(para).then((response1) => {
      // setMasker(false);
      setLoadingViewSetting(false);
      if (response1.code === '200') {
        message.info('保存视图成功')
        // loadConfigView(cloneDeep(response1.body.config));
        // let appModuleTmp = cloneDeep(response1.body);
        // delete appModuleTmp.config;
        // setAppModule(appModuleTmp);
      } else {
        // message.info(response1?.msg || '保存视图失败')
        notification.error({
          message: '保存失败',
          description: <>{JSON.stringify(response1.msg)}</>,
          placement: 'top',
          duration: null,
        });
      }
    });
  }

  // formConfig
  const formConfig = {
    form_layout_type: 4, // 表单整体一列或多列布局: horizontal vertical 2 3 4 6 8 12
    form_label_input_layout: 'horizontal', // 标签与录入框排列方式: horizontal vertical
    form_items: [
      { label: '接口', type: 'GroupTitle', name: 'bd' },
      { editRange: 'api', label: '列表查询', type: 'Input', name: 'api_grid_query', eventOnChange: 'test91' },
      { editRange: 'api', label: '表单查询', type: 'Input', name: 'api_form_query', eventOnChange: 'test91' },
      { editRange: 'api', label: '表单更新', type: 'Input', name: 'api_form_edit', eventOnChange: 'test91' },
      { editRange: 'api', label: '表单删除', type: 'Input', name: 'api_form_delete', eventOnChange: 'test91' },
      { editRange: 'api', label: '数据导出', type: 'Input', name: 'api_excel_export', eventOnChange: 'test91' },
      { editRange: 'api', label: '数据导入', type: 'Input', name: 'api_excel_import', eventOnChange: 'test91' },
      { editRange: 'api', label: '模板下载', type: 'Input', name: 'api_excel_template', eventOnChange: 'test91' },
      { label: '表单', type: 'GroupTitle', name: 'bd' },
      { editRange: C_FORM_ITEMS, label: '标题', type: 'Input', name: 'form_title', eventOnChange: 'test91' },
      { editRange: C_FORM_ITEMS, label: '表单布局', type: 'Radio', name: 'form_layout_type', eventOnChange: 'test91', list: [
        { name: '平铺', value: 'horizontal' },
        { name: '纵向', value: 'vertical' },
        { name: '2列', value: 2 },
        { name: '4列', value: 4 },
      ] },
      { editRange: C_FORM_ITEMS, label: '表单宽度', type: 'Radio', name: 'form_width', eventOnChange: 'test91', list: [
        { name: '480px', value: 480 },
        { name: '720px', value: 720 },
        { name: '960px', value: 960 },
        { name: '1200px', value: 1200 },
        { name: 'max', value: 'max' },
      ] },
      { label: '列表', type: 'GroupTitle', name: 'lb' },
      { editRange: C_GRID_COLUMNS, label: '显示序号', type: 'Switch', name: 'grid_show_serial_number', eventOnChange: 'test91' },
      { editRange: C_GRID_COLUMNS, label: '显示边框', type: 'Switch', name: 'grid_border', eventOnChange: 'test91' },
      { editRange: C_GRID_COLUMNS, label: '默认查询', type: 'Switch', name: 'gridIsInitSearch', eventOnChange: 'test91' },
      { editRange: C_GRID_COLUMNS, label: '显示分页', type: 'Switch', name: 'grid_pagination', eventOnChange: 'test91' },
      { editRange: C_GRID_COLUMNS, label: '首选项类别', type: 'Radio', optionType: 'button', name: 'grid_selection_type', eventOnChange: 'test91', list: [
        { name: 'radio', value: 'radio' },
        { name: 'checkbox', value: 'checkbox' },
        { name: '无', value: '' },
      ] },
      { editRange: C_GRID_COLUMNS, label: '勾选', type: 'Radio', optionType: 'button', name: 'grid_click_checked', eventOnChange: 'test91', list: [
        { name: '单击勾选', value: '1' },
        { name: '双击勾选', value: '2' },
        { name: '不勾选', value: '' },
      ] },
      { editRange: C_GRID_COLUMNS, label: '表单主键', type: 'Input', name: 'grid_row_key', eventOnChange: 'test91', tooltip: '表单查询、更新、删除时使用，默认为uuid' },
      { editRange: C_GRID_COLUMNS, label: '删除接口参数键', type: 'Input', name: 'delete_key', eventOnChange: 'test91' },
      { label: '工具栏', type: 'GroupTitle', name: 'gjl' },
      { editRange: 'toolbar', label: '开启', type: 'Switch', name: 'toolbar_open', eventOnChange: 'test91' },
      { editRange: 'toolbar', label: '显示总数及选中数', type: 'Switch', name: 'toolbar_show_grid_checked_num', eventOnChange: 'test91' },
      { label: '工具栏按钮', type: 'GroupTitle', name: 'gjlmran' },
      { editRange: 'toolbarBtn', label: '新建', type: 'Switch', name: 'add', eventOnChange: 'test91' },
      { editRange: 'toolbarBtn', label: '编辑', type: 'Switch', name: 'edit', eventOnChange: 'test91' },
      { editRange: 'toolbarBtn', label: '删除', type: 'Switch', name: 'delete', eventOnChange: 'test91' },
      { editRange: 'toolbarBtn', label: '设置', type: 'Switch', name: 'setting', eventOnChange: 'test91' },
      { editRange: 'toolbarBtn', label: '全屏', type: 'Switch', name: 'full', eventOnChange: 'test91' },
      // { editRange: 'toolbarBtn', label: '导出', type: 'Switch', name: 'download', eventOnChange: 'test91' },
      { editRange: 'toolbarBtn', label: '导出', type: 'Radio', optionType: 'button', name: 'download', eventOnChange: 'test91', list: [
        { name: '前端导出', value: 'front' },
        { name: '后端导出', value: 'back' },
        { name: '关闭', value: ''},
      ] },
      { editRange: 'toolbarBtn', label: '导入', type: 'Switch', name: 'upload', eventOnChange: 'test91' },
      { editRange: 'toolbarBtn', label: '刷新', type: 'Switch', name: 'reload', eventOnChange: 'test91' },
      { editRange: 'toolbarBtn', label: '筛选', type: 'Switch', name: 'advanced_filter', eventOnChange: 'test91' },
      { label: '列表操作列', type: 'GroupTitle', name: 'lbmrczl' },
      { editRange: 'gridBtn', label: '编辑', type: 'Switch', name: 'gird_edit', eventOnChange: 'test91' },
      { editRange: 'gridBtn', label: '删除', type: 'Switch', name: 'gird_delete', eventOnChange: 'test91' },
      { editRange: 'gridBtn', label: '详情', type: 'Switch', name: 'gird_detail', eventOnChange: 'test91' },
    ],
  }

  // 表单事件：OnChange
  FuncForm.eventOnChange = {
    test91: (param: any) => {
      const newConfig: any = cloneDeep(myConfig) || {};
      if (param.item.editRange === 'gridBtn') {
        if (!newConfig.grid_handle_columns_default) {
          newConfig.grid_handle_columns_default = {};
        }
        newConfig.grid_handle_columns_default[(param.item.name).replace('gird_', '')] = param.checked;
      } else if (param.item.editRange === 'toolbarBtn')  {
        if (!newConfig.toolbar_default) {
          newConfig.toolbar_default = {};
        }
        if (param.item.type === 19) { // switch
          newConfig.toolbar_default[param.item.name] = param.checked;
        } else if (param.item.type === 7) { // radio
          delete newConfig.toolbar_default[param.item.name + '_config'];
          if (param.event.target.value) {
            // 导出开启
            newConfig.toolbar_default[param.item.name] = true;
            if (param.event.target.value === 'back') {
              newConfig.toolbar_default[param.item.name + '_config'] = {
                type: param.event.target.value,
              };
            }
          } else {
            // 导出关闭
            newConfig.toolbar_default[param.item.name] = false;
          }
        }
        // newConfig.toolbar_default[param.item.name] = param.checked;
      } else {
        if (param.item.type === 19) { // switch
          newConfig[param.item.name] = param.checked;
        } else if (param.item.type === 4) { // select
          newConfig[param.item.name] = param.value;
        } else {
          if (param.event.target.value.indexOf(',')) {
            newConfig[param.item.name] = param.event.target.value.split(',');
          } else {
            newConfig[param.item.name] = param.event.target.value;
          }
        }
      }
      setMyConfig(newConfig);
    }
  }

  // initValue
  const initValue = (targetConfig: any = {}) => {
    let tmp = {
      ...targetConfig,
      ...targetConfig?.toolbar_default, // Tab1 中的表单使用，内部数据平铺
      gridIsInitSearch: targetConfig?.gridIsInitSearch || true,
      grid_pagination: targetConfig?.grid_pagination || true,
      grid_show_serial_number: targetConfig?.grid_show_serial_number || false,
      toolbar_open: targetConfig?.toolbar_open || true,
      grid_border: targetConfig?.grid_border || false,
      gird_edit: targetConfig?.grid_handle_columns_default?.edit,
      gird_delete: targetConfig?.grid_handle_columns_default?.delete,
      gird_detail: targetConfig?.grid_handle_columns_default?.detail,
      grid_selection_type: targetConfig?.grid_selection_type || 'checkbox',
      grid_click_checked: targetConfig?.grid_click_checked || '',
      grid_row_key: targetConfig?.grid_row_key || GRID_ROW_KEY,
      delete_key: targetConfig?.delete_key || DELETE_KEY,
      form_title: targetConfig?.form_title,
      form_layout_type: targetConfig?.form_layout_type || 'horizontal',
      form_width: targetConfig?.form_width || 960,
      toolbar_show_grid_checked_num: targetConfig?.toolbar_show_grid_checked_num,
    };
    let downloadTmp = '';
    if (targetConfig?.toolbar_default?.download) {
      downloadTmp = targetConfig?.toolbar_default?.download_config?.type === 'back' ? 'back': 'front';
    }
    tmp.download = downloadTmp;
    return tmp;
  }

  // 删除 config 中不需要保存的key
  const deleteConfigKey = (targetConfig: any = {}) => {
    delete targetConfig?.delete;
    delete targetConfig?.setting;
    delete targetConfig?.download;
    delete targetConfig?.upload;
    delete targetConfig?.reload;
    delete targetConfig?.full;
    delete targetConfig?.edit;
    delete targetConfig?.advanced_filter;
    delete targetConfig?.add;
    delete targetConfig?.gird_delete;
    delete targetConfig?.gird_detail;
    delete targetConfig?.gird_edit;
  }

  // json预览
  const showModal1 = () => {
    if (myConfig) {
      setRequestJson(myConfig);
    } else {
      message.info('非json类型数据');
    }
    setModalVisible1(true);
  };

  // json编辑
  const showModal2 = (flag?: any) => {
    let tmpEditJson: any = {};
    if (flag === 'all') { // 全量编辑
      tmpEditJson = cloneDeep(myConfig);
      setIsEditJsonFlag(true);
    } else {
      setIsEditJsonFlag(false);
      if (activeKey !== 'other') {
        tmpEditJson[activeKey] = [...(myConfig[activeKey] || [])];
      } else {
        tmpEditJson = cloneDeep(myConfig);
        delete tmpEditJson.grid_columns;
        delete tmpEditJson.filter_items;
        delete tmpEditJson.grid_filter_quick;
        delete tmpEditJson.grid_sum_field;
        delete tmpEditJson.form_items;
      }
    }
    setEditJson({
      text: undefined,
      json: {
        ...tmpEditJson,
      }
    });
    setModalVisible2(true);
  };

  // Tab1默认空数据
  const defaultEmptyTab1Value: any = {
    gird_edit: false,
    gird_delete: false,
    gird_detail: false,
    toolbar_open:  true,
    grid_border:  false,
    grid_selection_type:  'checkbox',
    form_layout_type:  'horizontal',
    form_width:  960,
    gridIsInitSearch: true,
    grid_pagination: true,
    grid_show_serial_number: false,
    add: false,
    edit: false,
    delete: false,
    setting: false,
    full: false,
    advanced_filter: false,
    // download: false,
    download: '',
    upload: false,
    reload: false,
    api_grid_query: '',
    api_form_query: '',
    api_form_edit: '',
    api_form_delete: '',
    grid_columns: [],
    filter_items: [],
    grid_filter_quick: [],
    grid_sum_field: [],
    form_items: [],
    toolbar_default: {},
    grid_handle_columns_default: {},
  };

  // 清空当前
  const handleCleanConfig = (key?: any) => {
    let cleanKey = key || activeKey;
    let myConfigNew: any;
    if (cleanKey !== 'other') {
      myConfigNew = cloneDeep(myConfig);
      myConfigNew[cleanKey] = [];
      setPreviewByType({type: cleanKey, newDataSource: []});
    } else {
      myConfigNew = {
        grid_columns: myConfig.grid_columns,
        filter_items: myConfig.filter_items,
        grid_filter_quick: myConfig.grid_filter_quick,
        grid_sum_field: myConfig.grid_sum_field,
        form_items: myConfig.form_items,
        toolbar_default: {},
        grid_handle_columns_default: {},
      }
      form.setFieldsValue(defaultEmptyTab1Value);
    }
    setMyConfig({...myConfigNew});
    isShowPageElement({...myConfigNew});
  }

  // 加载配置视图数据
  const loadConfigView = (newConfig: any) => {
    setGridColumns(myUtil.array.setKey(newConfig?.grid_columns || []));
    setFormItems(myUtil.array.setKey(newConfig?.form_items || []));
    setFilterItems(myUtil.array.setKey(newConfig?.filter_items || []));
    setGridFilterQuick(myUtil.array.setKey(newConfig?.grid_filter_quick || []));
    setGridSumField(myUtil.array.setKey(newConfig?.grid_sum_field || []));
    setHandleColumns(myUtil.array.setKey(newConfig?.handle_columns || []));
    setCustomerToobar(myUtil.array.setKey(newConfig?.customer_toobar || []));
    setGridDefaulteSort(myUtil.array.setKey(newConfig?.backend_dev_dict?.grid_default_sort || []));
    form.setFieldsValue({
      ...newConfig,
      ...initValue(newConfig),
    });
    // 数据元
    let tmpDbFields: any = newConfig?.backend_dev_dict?.db_fields || [];
    tmpDbFields.map((tmp: any) => {
      tmp.dictFieldName = tmp.dictFieldName.toLowerCase();
      // tmp.dictObjectName = tmp.dictObjectName.toLowerCase();
      // tmp.dictObjectTableName = tmp.dictObjectTableName.toLowerCase();
    })
    setDbFields(newConfig?.backend_dev_dict?.db_fields || []); // 数据元 Modal - 已选择数据字段
    let tmpDbFieldsTables: any = [];
    for (let i=0; i<tmpDbFields.length; i++) {
      let tmpTab = tmpDbFieldsTables.find((item: any) => {return item.dictObjectTableName === tmpDbFields[i].dictObjectTableName});
      if (!tmpTab) {
        tmpDbFieldsTables.push({
          dictObjectTableName: tmpDbFields[i].dictObjectTableName,
          dictObjectDesc: tmpDbFields[i].dictObjectDesc,
          dictObjectId: tmpDbFields[i].dictObjectId,
        });
      }
    }
    setDbFieldsTables(tmpDbFieldsTables); // 数据元 Modal - 已选择数据字段的数据元
    setDbConnectings(newConfig?.backend_dev_dict?.api?.dict_api_grid_query?.rel?.joins || []); // 数据元 Modal - 关联关系
    setDbKeys(newConfig?.backend_dev_dict?.api?.dict_api_form_query?.rel?.key || newConfig?.backend_dev_dict?.api?.dict_api_form_delete?.rel?.key || []); // 数据元 Modal - 主键
    let tmpJoins: any = newConfig?.backend_dev_dict?.api?.dict_api_grid_query?.rel?.joins || [];
    dbForm.setFieldsValue({
      connecting: tmpJoins,
      dbKeys: newConfig?.backend_dev_dict?.api?.dict_api_form_query?.rel?.key || newConfig?.backend_dev_dict?.api?.dict_api_form_delete?.rel?.key || [],
    });
    // config
    setMyConfig(cloneDeep(newConfig))
    isShowPageElement(newConfig);
  }

  // 清空全部
  const handleCleanConfigAll = () => {
    form.setFieldsValue(defaultEmptyTab1Value);
    loadConfigView(defaultEmptyTab1Value);
  }

  // setContent
  const setContent = (param: any) => {
    setEditJson(param);
  }

  // 配置Json编辑 保存
  const handleSaveConfig = () => {
    let { text, json } = editJson;
    if (text || json) {
      let tmpJsonObj = json || JSON.parse(text);
      let myConfigNew: any = cloneDeep(myConfig);
      if (isEditJsonFlag) { // 全量编辑
        myConfigNew = {
          ...myConfigNew,
          ...tmpJsonObj,
        }
        loadConfigView(myConfigNew);
      } else {
        if (activeKey !== 'other') {
          myConfigNew[activeKey] = tmpJsonObj[activeKey];
          setPreviewByType({type: activeKey, newDataSource: [...tmpJsonObj[activeKey]]});
        } else {
          myConfigNew = {
            ...myConfigNew,
            ...tmpJsonObj,
          }
          form.setFieldsValue({
            ...initValue(tmpJsonObj),
          });
        }
      }
      setEditJson({
        text: undefined,
        json: tmpJsonObj,
      });
      myConfigNew.customer_toolbar = [];
      setMyConfig({...myConfigNew});
      message.info('保存成功');
      setModalVisible2(false)
      isShowPageElement({...myConfigNew});
    }
  }

  // 配置Json编辑 加载示例
  const handleLoadExample = () => {
    let tmpEditJson: any = {};
    if (isEditJsonFlag) { // 全量编辑
      tmpEditJson = cloneDeep(unitConfigExample);
    } else {
      if (activeKey !== 'other') {
        tmpEditJson[activeKey] = [...unitConfigExample[activeKey]];
      } else {
        tmpEditJson = cloneDeep(unitConfigExample);
        delete tmpEditJson.grid_columns;
        delete tmpEditJson.filter_items;
        delete tmpEditJson.grid_filter_quick;
        delete tmpEditJson.grid_sum_field;
        delete tmpEditJson.form_items;
      }
    }
    setEditJson({
      text: undefined,
      json: {
        ...tmpEditJson,
      }
    });
  }

  // components
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  // tableDefaultConfig
  const tableDefaultConfig: any = {
    rowClassName: 'editable-row',
    bordered: false,
    pagination: false,
    size: 'small',
    components: components,
    rowKey: 'key',
  }

  // onDragEnd
  const onDragEnd = ({ active, over, type }: any) => {
    if (active.id !== over?.id) {
      let beforeDargArr: any = getTargetDataByType({type});
      if (type === C_GRID_COLUMNS) {
        const activeItem = beforeDargArr.find((item: any) => { return active.id === item.key });
        const overItem = beforeDargArr.find((item: any) => { return over.id === item.key });
        if (!(activeItem?.fixed === overItem?.fixed)) {
          const dragType = activeItem?.fixed === 'left' ? '居左冻结列' : activeItem?.fixed === 'right' ? '居右冻结列' : '自由列';
          const dropType = overItem?.fixed === 'left' ? '居左冻结列' : overItem?.fixed === 'right' ? '居右冻结列' : '自由列';
          message.error('当前列为' + dragType + '，不能将其拖拽至' + dropType + '中。');
          return;
        }
      }
      let getAfterDragArr = (previous: any) => {
        const activeIndex = previous.findIndex((i: any) => i.key === active.id);
        const overIndex = previous.findIndex((i: any) => i.key === over?.id);
        return arrayMove(previous, activeIndex, overIndex);;
      }
      let afterDragArr = getAfterDragArr(beforeDargArr);
      setPreviewByType({type, newDataSource: afterDragArr});
      const newConfig: any = cloneDeep(myConfig);
      newConfig[type] = (afterDragArr);
      setMyConfig(newConfig);
    }
  };

  // 加载默认
  const handleLoadDefault = () => {
    // 加载默认config
    let newConfig: any = cloneDeep(config);
    // 加载配置视图数据
    loadConfigView(newConfig);
    // 取消使用状态
    schemeList.forEach((item: any) => {
      delete item.used;
    });
    setSchemeList(schemeList);
    const viewId: string = pageId;
    const schemeConfig: any = myUtil.localStore.getItem('scheme_config') || {};
    schemeConfig[viewId] = schemeList ;
    myUtil.localStore.setItem('scheme_config', schemeConfig);
  }

  // useEffect
  useEffect(() => {
    let newConfig: any;
    if (location?.state?.appModuleId) {
      retrieveAppModuleDetail({appModuleId: location?.state?.appModuleId}).then((response1: any) => {
        if (response1.code === '200') {
          let newConfig = cloneDeep(response1?.body?.appModuleView?.dictAppModuleDef || {});
          let tmpUnitKey = response1.body?.appModule?.appModulePath;
          newConfig.module_key  = tmpUnitKey;
          // newConfig = {
          //   ...defaultEmptyTab1Value,
          //   ...newConfig,
          // }
          // 补充默认api
          newConfig.api_grid_query = newConfig.api_grid_query ? newConfig.api_grid_query : `${CONSTANTS.DEFAULT_API.GRID_QUERY}/${tmpUnitKey}`;
          newConfig.api_form_query = newConfig.api_form_query ? newConfig.api_form_query : `${CONSTANTS.DEFAULT_API.FORM_QUERY}/${tmpUnitKey}`;
          newConfig.api_form_edit = newConfig.api_form_edit ? newConfig.api_form_edit : `${CONSTANTS.DEFAULT_API.FORM_EDIT}/${tmpUnitKey}`;
          newConfig.api_form_delete = newConfig.api_form_delete ? newConfig.api_form_delete : `${CONSTANTS.DEFAULT_API.FORM_DELETE}/${tmpUnitKey}`;
          newConfig.api_excel_export = newConfig.api_excel_export ? newConfig.api_excel_export : `${CONSTANTS.DEFAULT_API.EXCEL_EXPORT}/${tmpUnitKey}`;
          newConfig.api_excel_import = newConfig.api_excel_import ? newConfig.api_excel_import : `${CONSTANTS.DEFAULT_API.EXCEL_IMPORT}/${tmpUnitKey}`;
          newConfig.api_excel_template = newConfig.api_excel_template ? newConfig.api_excel_template : `${CONSTANTS.DEFAULT_API.EXCEL_TEMPLATE}/${tmpUnitKey}`;
          // 补充默认表单标题
          newConfig.form_title = response1.body?.appModule?.appModuleName || '表单';
          loadConfigView(newConfig);
          let appModuleTmp = cloneDeep(response1.body?.appModule || {});
          delete appModuleTmp.dictAppModuleDef;
          setAppModule(appModuleTmp);
        }
      });
    } else {
      loadConfigView(defaultEmptyTab1Value);
    }
    // // 加载localstore中已选择的config
    // const viewId: string = pageId;
    // const schemeConfig: any = myUtil.localStore.getItem('scheme_config') || {};
    // const currentSchemeConfig = schemeConfig[viewId] || [];
    // for(let i = 0; i<currentSchemeConfig.length; i++) {
    //   if (currentSchemeConfig[i].used) {
    //     newConfig = currentSchemeConfig[i].config;
    //     break;
    //   }
    // }
    // // 加载默认config
    // if (!newConfig) {
    //   newConfig = cloneDeep(myConfig);
    // }
    // // 加载配置视图数据
    // loadConfigView(newConfig);
    // 加载方案列表
    loadSehemeList();
    // 加载数据元表
    intDbTables();
  }, []);

  // Excel配置方案 ****************************************************************************** start

  // Excel配置方案 - 弹窗 - 宽表
  const showModalExcelV2 = () => {
    refModalExcelV2.current?.showModal({
      setMyConfig,
      isShowPageElement,
      loadConfigView,
      setExcelImportUnitList,
      setModalVisible6,
      setExcelOriginalData,
      setLoadingViewSetting,
      setMasker,
      setModal6Loading,
    });
  }

  // Excel配置方案 - 选择方案
  const selectExcelUnits = (record: any, index: any) => {
    const { config } = record;
    loadConfigView(config);
    // 设置config使用状态
    // const viewId: string = pageId;
    // const schemeConfig: any = myUtil.localStore.getItem('scheme_config') || {};
    // const excelImportUnitList: any = schemeConfig[viewId] || [];
    excelImportUnitList.forEach((item: any) => {
      if (record.module_key === item.module_key) {
        item.used = true;
      } else {
        item.used = false;
      }
    });
    setExcelImportUnitList(excelImportUnitList);
    // schemeConfig[viewId] = excelImportUnitList;
    // myUtil.localStore.setItem('scheme_config', schemeConfig);
    // 设置方案列表状态
    // schemeList.forEach((item: any) => {
    //   if (record.id === item.id) {
    //     item.used = true;
    //   } else {
    //     delete item.used;
    //   }
    // });
    // setSchemeList(schemeList);
  }

  // Excel配置方案 - 弹窗 - 宽表
  const saveExcelV2 = () => {
    setLoadingViewSetting(true);
    let excelData = excelImportUnitList;
    let para = {
      excelData,
      excelOriginalData
    }
    createAppModuleByExcelData(para).then((response1) => {
      setLoadingViewSetting(false);
      if (response1.data.code === '200') {
        message.info('保存成功')
      } else {
        notification.error({
          message: '保存失败',
          description: <>{JSON.stringify(response1.data.msg)}</>,
          placement: 'top',
          duration: null,
        });
      }
    });
  }
  // Excel配置方案 ****************************************************************************** end

  // 根据Config重新加载视图
  const refreshCongfigView = ({type, data}: any) => {
    const newConfig: any = cloneDeep(myConfig);
    newConfig[type] = data;
    setMyConfig(newConfig);
    isShowPageElement(newConfig);
  }

  const expandedRowRender = ({record}: any) => {
    const columns: any = [
      { title: '校验类型', width: 220, dataIndex: 'type', key: 'type', editable: true, editType: 'SelectRulesType', editRange: 'rules' },
      { title: 'format', width: 200, dataIndex: 'format', key: 'format', editable: true, editType: 'Input', editRange: 'rules' },
      { title: 'range', width: 100, dataIndex: 'range', key: 'range', editable: true, editType: 'Input', editRange: 'rules', render: (_text: any, _record: any) => {
        return <span>{_text ? _text.toString() : ''}</span>
      } },
      { title: 'length', width: 80, dataIndex: 'length', key: 'length', editable: true, editType: 'InputNumber', editRange: 'rules' },
      { title: 'decimal', width: 80, dataIndex: 'decimal', key: 'decimal', editable: true, editType: 'InputNumber', editRange: 'rules' },
      { title: '校验信息', dataIndex: 'message', key: 'message', editable: true, editType: 'Input', editRange: 'rules' },
      { title: 'func', width: 180, dataIndex: 'func', key: 'func', editable: true, editType: 'Input', editRange: 'rules' },
      { title: '操作', width: 120, render: (_text: any, _record: any, index: number) => (<Space size={0}>
          <Popconfirm title="确定删除?" onConfirm={() => handleDelete({key: _record.key, type: 'rules', formItemKey: record.key, index})}>
            <Button type='link' size='small' >删除</Button>
          </Popconfirm>
        </Space>)
      },
    ];
    const columnsShow: any = getConfigShow({columns: columns, type: 'rules'});
    const data = record.rules || [];
    data.forEach((item: any, index: any) => {
      item.key = index;
      item.formItemName = record.name;
      item.formItemKey = record.key;
    })
    return <Table columns={columnsShow} dataSource={data} {...tableDefaultConfig}/>;
  };

  const getTab: any = ({dataSource, columns, scrollX, type}: any) => {
    const commonConfig: any = {...tableDefaultConfig};
    if (type === C_FORM_ITEMS) {
      commonConfig.expandable = {
        expandedRowRender: (record: any, index: any, indent: any, expanded: any) => {
          return expandedRowRender({record, index, indent, expanded})
        },
      }
    }
    return <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={({ active, over }: any) => {onDragEnd({ active, over, type })}}>
      <SortableContext items={dataSource.map((i: any) => i.key)} strategy={verticalListSortingStrategy} >
        <Table dataSource={dataSource} columns={columns} scroll={{x: scrollX || '1000px', y: '450px'}} {...commonConfig} />
      </SortableContext>
    </DndContext>;
  }

  const tab2: any = getTab({dataSource: formItems, columns: configFormItemsShow, type: C_FORM_ITEMS, scrollX: '1800px'});
  const tab3: any = getTab({dataSource: filterItems, columns: configFilterShow, type: C_FILTER_ITEMS, scrollX: '1300px'});
  const tab5: any = getTab({dataSource: gridFilterQuick, columns: configGridFilterQuickShow, type: C_GRID_FILTER_QUICK, scrollX: '1200px'});
  const tab4: any = getTab({dataSource: gridColumns, columns: configColumnsShow, type: C_GRID_COLUMNS, scrollX: '2300px'});
  const tab6: any = getTab({dataSource: gridSumField, columns: configGridSumFieldShow, type: C_GRID_SUM_FIELD});
  const tab7: any = getTab({dataSource: handleColumns, columns: configHandleColumnsShow, type: C_HANDLE_COLUMNS});
  const tab8: any = getTab({dataSource: customerToobar, columns: configCustomerToobarShow, type: C_CUSTOMER_TOOLBAR});
  const tab9: any = getTab({dataSource: gridDefaulteSort, columns: configGridDefaultSortShow, type: GRID_DEFAULT_SORT});
  const tab1: any = <div style={{height: '485px', overflowY: 'auto', overflowX: 'hidden', padding: '0 24px'}}>
    <DDBaseForm config={formConfig} form={form} initialValues={initValue} func={FuncForm}/>
  </div>;

  // 工具 ****************************************************************************** start
  const isShowPageElement = (targetConfig: any) => {
    if (targetConfig?.grid_columns?.length > 0 || targetConfig?.filter_items?.length > 0 ||
        targetConfig?.grid_filter_quick?.length > 0 || targetConfig?.grid_sum_field?.length > 0) {
      setShowPageElement(true);
      setShowQuickIcon(false);
      return;
    }
    if (targetConfig?.toolbar_default?.add || targetConfig?.toolbar_default?.edit || targetConfig?.toolbar_default?.delete
        || targetConfig?.toolbar_default?.setting || targetConfig?.toolbar_default?.full || targetConfig?.toolbar_default?.download
        || targetConfig?.toolbar_default?.upload || targetConfig?.toolbar_default?.reload || targetConfig?.toolbar_default?.advanced_filter) {
      setShowPageElement(true);
      setShowQuickIcon(false);
      return;
    }
    setShowPageElement(false);
    setShowQuickIcon(true);
  }
  // 工具 ****************************************************************************** end

  // 方案 ****************************************************************************** start

  // 方案 - 保存方案
  const showModal4 = () => {
    form2.setFieldsValue({
      schemeName: '',
      schemeDesc: '',
    });
    setModalVisible4(true)
  }

  // 方案 - 加载数据
  const loadSehemeList = () => {
    const viewId: string = pageId;
    const schemeConfig = myUtil.localStore.getItem('scheme_config') || {};
    const currentSchemeConfig = schemeConfig[viewId] || [];
    setSchemeList(currentSchemeConfig);
  }

  // 方案 - 开启选择方案弹窗
  const chooseScheme = () => {
    setModalVisible3(true);
  }

  // 方案 - 删除方案
  const deleteScheme = (index: number) => {
    const viewId: string = pageId;
    const schemeConfig: any = myUtil.localStore.getItem('scheme_config') || {};
    schemeConfig[viewId].splice(index, 1);
    myUtil.localStore.setItem('scheme_config', schemeConfig);
    setSchemeList(schemeConfig[viewId]);
  }

  // 方案 - 选择方案
  const selectScheme = (record: any, index: any) => {
    const { config } = record;
    loadConfigView(config);
    // 设置config使用状态
    const viewId: string = pageId;
    const schemeConfig: any = myUtil.localStore.getItem('scheme_config') || {};
    const currentSchemeConfig: any = schemeConfig[viewId] || [];
    currentSchemeConfig.forEach((item: any) => {
      if (record.id === item.id) {
        item.used = true;
      } else {
        delete item.used;
      }
    });
    schemeConfig[viewId] = currentSchemeConfig;
    myUtil.localStore.setItem('scheme_config', schemeConfig);
    // 设置方案列表状态
    schemeList.forEach((item: any) => {
      if (record.id === item.id) {
        item.used = true;
      } else {
        delete item.used;
      }
    });
    setSchemeList(schemeList);
  }

  // 方案 - 方案保存表单项
  const schemeSaveItems = [
    { label: '方案名称', type: itemType.Input, name: 'schemeName' },
    { label: '方案描述', type: itemType.TextArea, name: 'schemeDesc', autoSize: { minRows:5, maxRows: 5} },
  ];

  // 方案 - 保存方案
  const saveScheme = () => {
    setLoadingScheme(true);
    form2.validateFields().then(values => {
      const newConfig: any = cloneDeep(myConfig);
      const scheme: any = {
        id: myUtil.text.uuid(),
        name: values.schemeName || '方案名称' +  myUtil.text.uuid(),
        desc: values.schemeDesc || '方案描述' +  myUtil.text.uuid(),
        time: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        config: newConfig,
        used: true,
      }
      const viewId: string = pageId;
      const schemeConfig: any = myUtil.localStore.getItem('scheme_config') || {};
      const currentSchemeConfig: any = schemeConfig[viewId] || [];
      currentSchemeConfig.forEach((item: any) => {
        delete item.used;
      });
      currentSchemeConfig.push(scheme);
      schemeConfig[viewId] = currentSchemeConfig;
      myUtil.localStore.setItem('scheme_config', schemeConfig);
      message.info('保存成功');
      setModalVisible4(false)
      setSchemeList(currentSchemeConfig);
      setLoadingScheme(false);
    })
  }

  // 方案 ****************************************************************************** end

  // 数据元 ****************************************************************************** start

  // 数据元弹窗 - 获取物理表
  const intDbTables = () => {
    retrieveObjectByDomain({page: 1, pageSize: 999999, searchModel: []}).then((response) => {
      const { code, body={} } = response;
      if (code === '200') {
        let tmpRows: any = body.rows || [];
        tmpRows.map((tmp: any) => {
          tmp.dictObjectName = tmp?.dictObjectName;
          tmp.dictObjectTableName = tmp?.dictObjectTableName?.toLowerCase();
          tmp.isObjectShow = true;
        })
        setDbTables(tmpRows);
      }
    })
  }

  // 数据元弹窗 - link -切换数据元表
  const changeDbTable = (item: any, index: any) => {
    if (item.dictObjectTableName === dbTableChecked.dictObjectTableName) {
      return;
    }
    getDbField({...item}).then((response) => {
      const { code, body=[] } = response;
      if (code === '200') {
        let tmpRows: any = body || [];
        tmpRows.map((tmp: any) => {
          tmp.dictFieldName = tmp.dictFieldName.toLowerCase();
          tmp.dictObjectName = tmp.dictObjectName;
          tmp.dictObjectTableName = tmp.dictObjectTableName.toLowerCase();
        })
        // 修改弹窗中间dbOriginalFields使用状态
        for (let i=0; i<tmpRows.length; i++) {
          let tmpField = dbFields.find((tmp: any) => {
            return tmp.dictFieldId === tmpRows[i].dictFieldId && tmp.dictObjectId === tmpRows[i].dictObjectId;
          });
          if (tmpField) {
            tmpRows[i].isUsed = true;
          }
        }
        setDbFieldsOriginal(tmpRows);
        setDbTableChecked(item);
      }
    })
  }

  // 数据元弹窗 - 同步更新config中的数据元
  const updateConfigDbField = (rightData: any) => {
    let tmpMyConfig = cloneDeep(myConfig) || {};
    if (!tmpMyConfig.backend_dev_dict) {
      tmpMyConfig.backend_dev_dict = {};
    }
    tmpMyConfig.backend_dev_dict.db_fields = [...(rightData || [])];
    setMyConfig(tmpMyConfig);
  }

  // 数据元弹窗 - 设置数据元主键
  const setDefaultDbKey = (items: any) => {
    let dbKeysCurrent = cloneDeep(dbKeys);
    let tabGridRowKeyArr: any = [];
    items.forEach((item: any) => {
      // hasDictKeys格式 ['invoice_record_id', 'order_id']
      let isDictKey: any = DDBunit2ADBUtil.isDictKey({ fieldObj: item });  // 是否主键
      if (isDictKey) {
        dbKeysCurrent.push({
          dictObjectId: item.dictObjectId,
          dictFieldId: item.dictFieldId,
          dictObjectTableName: item.dictObjectTableName,
          dictFieldName: item.dictFieldName,
          dictObjectId___dictFieldId: item.dictObjectId + '___' + item.dictFieldId,
        });
      }
    });
    // 筛选数据，仅设置第一个表，即主表主键，其他关联表的主键不添加到主键数组中
    let dbKeyMainTableTmp = ''; // 主表表明
    if (dbKeysCurrent.length > 0) {
      dbKeyMainTableTmp = dbKeysCurrent[0].dictObjectTableName;
    }
    // console.info("主键主表，dbKeyMainTableTmp = " + dbKeyMainTableTmp);
    dbKeysCurrent = dbKeysCurrent.filter((tmp: any) => (tmp.dictObjectTableName === dbKeyMainTableTmp));
    // 设置主键state & 主键采集表单采集值
    setDbKeys(dbKeysCurrent);
    dbForm.setFieldsValue({ dbKeys: dbKeysCurrent });
    // 设置Tab1中grid_row_key
    dbKeysCurrent.forEach((item: any) => {
      tabGridRowKeyArr.push(item.dictFieldName);
    });
    form.setFieldsValue({
      grid_row_key: tabGridRowKeyArr.join(','),
    });
  }

  // removeDbDey
  const removeDbDey = (targetIndex: any) => {
    let dbKeysCurrent = cloneDeep(dbKeys);
    dbKeysCurrent = dbKeysCurrent.filter((tmp: any, index: any) => { return (index !== targetIndex)});
    setDbKeys(dbKeysCurrent);
    dbForm.setFieldsValue({ dbKeys: dbKeysCurrent });
  }

  // 数据元弹窗 - link -添加数据元
  const addDbField = (item: any, index: any) => {
    let leftData = cloneDeep(dbFieldsOriginal);
    let rightData = cloneDeep(dbFields);
    if (leftData[index].isUsed) {
      return;
    }
    // 添加右侧dbFields
    rightData.push(item);
    setDbFields(rightData);
    // 同步更新config中的数据元
    updateConfigDbField(rightData);
    // 修改弹窗中间dbOriginalFields使用状态
    leftData[index].isUsed = true;
    setDbFieldsOriginal(leftData);
    // 数据元主键 设置默认主键
    setDefaultDbKey([item]);
    // 添加数据元表
    let dbFieldsTablesTmp = cloneDeep(dbFieldsTables);
    let tmpTab = dbFieldsTablesTmp.find((item2: any) => {return item2.dictObjectTableName === item.dictObjectTableName});
    if (!tmpTab) {
      dbFieldsTablesTmp.push({
        dictObjectTableName: item.dictObjectTableName,
        dictObjectDesc: item.dictObjectDesc,
        dictObjectId: item.dictObjectId,
      });
    }
    setDbFieldsTables(dbFieldsTablesTmp);
  }

  // 数据元弹窗 - 添加全部数据元
  const addAllDbfields = () => {
    let leftData = cloneDeep(dbFieldsOriginal);     // 左侧原有字段
    let rightData = cloneDeep(dbFields);            // 右侧原有字段
    let tmpNewRightData: any = [];                  // 右侧新增增字段
    // 添加右侧dbFields
    leftData.forEach((item: any) => {
      let tmpTab = rightData.find((item2: any) => {return item2.dictFieldId === item.dictFieldId && item2.dictObjectId === item.dictObjectId });
      if (!tmpTab) {
        rightData.push(item);
        tmpNewRightData.push(item);
      }
    });
    // 设置主键
    setDefaultDbKey(tmpNewRightData);

    // 设置数据元
    setDbFields(rightData);
    // 同步更新config中的数据元
    updateConfigDbField(rightData);
    // 修改弹窗中间dbOriginalFields使用状态
    leftData.map((tmp: any) => tmp.isUsed = true);
    setDbFieldsOriginal(leftData);
    // 添加数据元表
    let dbFieldsTablesTmp = cloneDeep(dbFieldsTables);
    let tmpTab = dbFieldsTablesTmp.find((item2: any) => {return item2.dictObjectTableName === dbTableChecked.dictObjectTableName});
    if (!tmpTab) {
      dbFieldsTablesTmp.push({
        dictObjectTableName: dbTableChecked.dictObjectTableName,
        dictObjectDesc: dbTableChecked.dictObjectDesc,
        dictObjectId: dbTableChecked.dictObjectId,
      });
    }
    setDbFieldsTables(dbFieldsTablesTmp);
  }

  // 数据元弹窗 - link - 删除数据元
  const deleteDbField = (item: any, index: any) => {
    let leftData = cloneDeep(dbFieldsOriginal);
    let rightData = cloneDeep(dbFields);
    // 减少右侧dbFields
    rightData.splice(index, 1);
    setDbFields(rightData);
    // 同步更新config中的数据元
    updateConfigDbField(rightData);
    // 修改弹窗中间dbOriginalFields使用状态
    let tmpField = leftData.find((tmp: any) => { return tmp.dictFieldId === item.dictFieldId && item.dictObjectId === tmp.dictObjectId});
    if (tmpField) {
      tmpField.isUsed = false;
    }
    setDbFieldsOriginal(leftData);
    // 数据元主键 删除主键
    // if (item.dictFieldName === 'uuid') {
      let dbKeysCurrent = cloneDeep(dbKeys);
      dbKeysCurrent = dbKeysCurrent.filter((tmp: any) => { return !(item.dictObjectId === tmp.dictObjectId && tmp.dictFieldId === item.dictFieldId); });
      setDbKeys(dbKeysCurrent);
      dbForm.setFieldsValue({ dbKeys: dbKeysCurrent });
    // }
  }

  // 数据元弹窗 - 清空数据元
  const clearDbfields = () => {
    setDbFields([]);
    let leftData = cloneDeep(dbFieldsOriginal);
    // 修改弹窗中间dbOriginalFields使用状态
    leftData.map((tmp: any) => tmp.isUsed = false);
    setDbFieldsOriginal(leftData);
    // 清空当前数据元表
    setDbFieldsTables([]);
    // 同步更新config中的数据元
    updateConfigDbField([]);
    // 数据元主键 清空主键
    setDbKeys([]);
    dbForm.setFieldsValue({ dbKeys: [] });
  }

  // 数据元弹窗 - btn: 追加列表 / 替换列表 / 追加表单 / 替换表单 / 追加筛选一 / 替换筛选一 / 追加筛选二 / 替换筛选二
  // item -> 用于单项追加
  const addGridFormColumns = ({ isReplace, type, item }: any) => {
    let formItemKey;
    let newData: any = [];
    let tmpApiField: any = []; // 用于判断接口字段是否重复
    let tmpApiFieldIndex: any = 1; // 用于判断接口字段是否重复
    const addSingleDbFiled = ({item, key}: any) => {
      let isNumber: any = false;    // 是否数值
      let isInt: any = false;       // 是否Int
      let isDictKey: any = DDBunit2ADBUtil.isDictKey({ fieldObj: item });  // 是否主键
      if (item?.dictFieldType?.indexOf('decimal') !== -1 ||
          item?.dictFieldType?.indexOf('int') !== -1 ||
          item?.dictFieldType?.indexOf('double') !== -1) {
        isNumber = true;
      }
      if (item?.dictFieldType?.indexOf('int') !== -1) {
        isInt = true;
      }
      if (type === C_GRID_COLUMNS) {
        let tmpGridCol: any = {
          ...item,
          key,
          title: item.dictFieldDesc,
          dataIndex: item.dictFieldName?.toLowerCase(),
          align: isNumber? 'right' : 'left',
        };
        if (isNumber) {
          tmpGridCol.render = { type: 'number', format: isInt ? '0,0' : '0,0.00' };
          tmpGridCol.sum = true;
          tmpGridCol.width = GRID_WIDTH_NUMBER;
          // decimal(15,4) decimal(15,0)
          if (tmpGridCol.dictFieldType.indexOf('decimal') > -1) {
            let aa = tmpGridCol.dictFieldType?.split(',') || [];
            if (aa.length > 1) {
              let bb = aa[1]?.replace(')', '');
              let result2 = Array.from({ length: bb }, (_, i) => '0').join('');
              let cc = bb === '0' ? `0,0`: `0,0.${result2}`;
              tmpGridCol.render.format = cc;
            }
          }
        } else if (item.dictFieldType === 'datetime' || item.dictFieldType === 'date') {
          tmpGridCol.render = { type: 'date', format: 'YYYY-MM-DD' };
          tmpGridCol.width = GRID_WIDTH_DATE;
          // 字数多余5个字，增加列宽
          if (tmpGridCol?.title?.length > 5) {
            tmpGridCol.width = GRID_WIDTH_DATE + (tmpGridCol?.title?.length - 5) * 10;
          }
        } else {
          tmpGridCol.width = GRID_WIDTH;
        }
        if (isDictKey) {
          tmpGridCol.hidden = true;
        }
        // 修正重名dataIndex
        if (tmpApiField.indexOf(tmpGridCol.dataIndex) > -1) {
          tmpGridCol.dataIndex = tmpGridCol.dataIndex + tmpApiFieldIndex;
          tmpApiFieldIndex++;
        }
        tmpApiField.push(tmpGridCol.dataIndex);
        newData.push(tmpGridCol);
        // 如果含有码表，则增加一条记录，且码表自动带出
        if (item.dictCodeId) {
          let tmpGridColCopy = cloneDeep(tmpGridCol);
          tmpGridColCopy.codeTable = item.dictCodeId;
          tmpGridColCopy.title = tmpGridCol.title + '名称',
          tmpGridColCopy.dataIndex = tmpGridCol.dataIndex + 'desc',
          tmpGridColCopy.key = tmpGridCol.key + 'desc',
          newData.push(tmpGridColCopy);
        }
      } else if (type === C_FORM_ITEMS || type === C_FILTER_ITEMS || type === C_GRID_FILTER_QUICK) {
        let formItemType: any = 'Input';
        let tmpGridCol: any = {
          ...item,
          key,
          label: item.dictFieldDesc,
          name: item.dictFieldName?.toLowerCase(),
          dictFieldId: item.dictFieldId,
        }
        if (item.dictFieldType === 'datetime' || item.dictFieldType === 'date') {
          formItemType = 'DatePicker';
          if (type === C_FILTER_ITEMS || type === C_GRID_FILTER_QUICK) {
            tmpGridCol.range = true;
          }
        } else if (isNumber) {
          formItemType = 'InputNumber';
        }
        if (isDictKey) {
          formItemType = 'Hidden';
        }
        tmpGridCol.type = formItemType;
        // 如果含有码表，则码表自动带出，类型设置为Select
        if (item.dictCodeId) {
          tmpGridCol.type = 'Select';
          tmpGridCol.codeTable = item.dictCodeId;
        }
        // 修正重名dataIndex
        if (tmpApiField.indexOf(tmpGridCol.name) > -1) {
          tmpGridCol.name = tmpGridCol.name + tmpApiFieldIndex;
          tmpApiFieldIndex++;
        }
        tmpApiField.push(tmpGridCol.name);
        if (type === C_FORM_ITEMS) {
          // 设置默认校验
          let formItmeRules: any = DDBunit2ADBUtil.getFieldDefaultRules({ fieldObj: item, formItemKey: key }).fieldRulesConfig;
          if (formItmeRules.length > 0) {
            tmpGridCol.rules = formItmeRules;
          }
        }
        newData.push(tmpGridCol);
      } else if (type === C_GRID_SUM_FIELD) {
        if (isNumber) {
          let tmpGridCol: any = {
            ...item,
            key,
            label: item.dictFieldDesc,
            field: item.dictFieldName?.toLowerCase(),
          }
          tmpGridCol.format = isInt ? '0,0' : '0,0.00';
          newData.push(tmpGridCol);
        }
      }
    };
    if (item) {
      addSingleDbFiled({item, key: count + 1});
    } else {
      for (let i=0; i<dbFields.length; i++) {
        addSingleDbFiled({item: dbFields[i], key: count + i});
      }
    }
    let originData: any = getTargetDataByType({type});
    if (isReplace) {
      originData = [...newData];
    } else {
      originData = [...originData, ...newData];
    }
    setPreviewByType({type, newDataSource: originData, formItemKey});
    setCount(count + dbFields.length + 1);
    // 通过Config设置预览视图
    refreshCongfigView({type, data: originData});
  };

  // 数据元弹窗 - 数据元字段类别样式
  const getAvatar = (item: any, showUsedIcon: any) => {
    const style: any = {
      backgroundColor: '#1677ff',
    };
    let fieldLabelText = 'v';
    if (item?.dictFieldType.indexOf('decimal') !== -1) {
      style.backgroundColor = '#00a2ae';
      fieldLabelText = 'n';
    } else if (item?.dictFieldType === 'datetime' || item?.dictFieldType === 'date') {
      style.backgroundColor = '#cb7600';
      fieldLabelText = 'd';
    }
    return <div style={{position: 'relative'}}>
      {showUsedIcon && <CheckOutlined className="isUsedField"/>}
      <Badge dot={false} color="orange" offset={[0, 0]}>
        <Avatar shape="square" gap={6} size={20} style={style}>{fieldLabelText}</Avatar>
      </Badge>
    </div>
  }

  // 数据元弹窗 - 获取选中字段下拉框
  const getDbFieldSelectOption = () => {
    const children: any = [];
    for (let i = 0; i < dbFields.length; i++) {
      children.push(<Select.Option key={i.toString(36) + i} value={`${dbFields[i].dictObjectId}___${dbFields[i].dictFieldId}`}>
        {dbFields[i].dictFieldName} {dbFields[i].dictObjectTableName}
      </Select.Option>);
    }
    return children;
  }

  // 数据元弹窗 - 增加物理表关联
  const addDbConnecting = () => {
    const valuesTmp: any = dbForm.getFieldsValue(true) || {};
    const connecting: any = valuesTmp.connecting || [];
    const connecting2: any = [];
    connecting.forEach((item: any = {}) => {
      // key=dictObjectId___dictFieldId
      const { joinType, dictObjectId1___dictFieldId1, dictObjectId2___dictFieldId2} = item;
      if (joinType && dictObjectId1___dictFieldId1 && dictObjectId2___dictFieldId2) {
        let tmpDictObjectId1 = dictObjectId1___dictFieldId1.split('___')[0];
        let tmpDictFieldId1 = dictObjectId1___dictFieldId1.split('___')[1];
        let tmpDictObjectId2 = dictObjectId2___dictFieldId2.split('___')[0];
        let tmpDictFieldId2 = dictObjectId2___dictFieldId2.split('___')[1];
        let dbFieldTmp1: any = dbFields.find((tmp: any) => { return tmp.dictFieldId === tmpDictFieldId1 && tmp.dictObjectId === tmpDictObjectId1});
        let dbFieldTmp2: any = dbFields.find((tmp: any) => { return tmp.dictFieldId === tmpDictFieldId2 && tmp.dictObjectId === tmpDictObjectId2});
        let onDesc = `${dbFieldTmp2?.dictObjectTableName}.${dbFieldTmp2?.dictFieldName}=${dbFieldTmp1?.dictObjectTableName}.${dbFieldTmp1?.dictFieldName}`;
        connecting2.push({
          dictObjectId1: tmpDictObjectId1,
          dictFieldId1: tmpDictFieldId1,
          dictObjectId2: tmpDictObjectId2,
          dictFieldId2: tmpDictFieldId2,
          dictObjectId1___dictFieldId1,
          dictObjectId2___dictFieldId2,
          joinType,
          on: `${tmpDictObjectId1}.${tmpDictFieldId1}=${tmpDictObjectId2}.${tmpDictFieldId2}`,
          joinTable: tmpDictObjectId2,
          joinTableDesc: dbFieldTmp2?.dictObjectTableName || '',
          onDesc: onDesc,
        });
      }
    });
    setDbConnectings(connecting2);
  }

  // 数据元弹窗 - 增加物理表主键
  const addDbKeys = () => {
    const valuesTmp: any = dbForm.getFieldsValue(true) || {};
    const dbKeys: any = valuesTmp.dbKeys || [];
    const dbKeysTmp: any = [];
    const dbKeysForm: any = [];
    dbKeys.forEach((item: any = {}) => {
      const { dictObjectId___dictFieldId } = item;
      if (dictObjectId___dictFieldId) {
        // let fieldTmp= dbField.find();
        let dictObjectIdTmp: any = dictObjectId___dictFieldId.split('___')[0];
        let dictFieldId: any = dictObjectId___dictFieldId.split('___')[1];
        let dbFieldTmp: any = dbFields.find((tmp: any) => { return tmp.dictFieldId === dictFieldId });
        dbKeysTmp.push({
          dictObjectId: dictObjectIdTmp,
          dictFieldId: dictFieldId,
          dictObjectTableName: dbFieldTmp.dictObjectTableName,
          dictFieldName: dbFieldTmp.dictFieldName,
          dictObjectId___dictFieldId: dbFieldTmp.dictObjectId + '___' + dbFieldTmp.dictFieldId,
        });
        dbKeysForm.push(dbFieldTmp.dictFieldName);
      }
    });
    setDbKeys(dbKeysTmp);
    // 设置tab1表单主键
    let grid_row_key_form_val = dbKeysForm.join(",")
    form.setFieldsValue({
      grid_row_key: grid_row_key_form_val || GRID_ROW_KEY
    });
    const newConfig: any = cloneDeep(myConfig) || {};
    if (dbKeysForm.length === 1) {
      newConfig.grid_row_key = dbKeysForm[0];
    } else {
      newConfig.grid_row_key = dbKeysForm;
    }
    setMyConfig(newConfig);
  }

  // 获取物理表显示数据
  const getFilterDbTables = () => {
    let tmpDbTables = cloneDeep(dbTables);
    tmpDbTables = tmpDbTables.filter((item: any) => {
      return item.isObjectShow;
    })
    return tmpDbTables;
  }

  // 回车筛选物理表
  const enterFilterDbTable = (e: any) => {
    let filterText = e.target.value || '';
    let tmpDbTables = cloneDeep(dbTables);
    tmpDbTables.forEach((item: any) => {
      item.isObjectShow = item.dictObjectTableName.indexOf(filterText) > -1 ? true : false;
    })
    setDbTables(tmpDbTables);
  }

  // 点击筛选按钮筛选物理表
  const inputSearchFilterDbTable = (val: any) => {
    let filterText = val || '';
    let tmpDbTables = cloneDeep(dbTables);
    tmpDbTables.forEach((item: any) => {
      item.isObjectShow = item.dictObjectTableName.indexOf(filterText) > -1 ? true : false;
    })
    setDbTables(tmpDbTables);
  }

  // input change
  const inputChangeFilterDbTable = (e: any) => {
    let filterText = e.target.value || '';
    let tmpDbTables = cloneDeep(dbTables);
    tmpDbTables.forEach((item: any) => {
      item.isObjectShow = item.dictObjectTableName.indexOf(filterText) > -1 ? true : false;
    })
    setDbTables(tmpDbTables);
  }

  // 数据元 ****************************************************************************** end

  return <Spin tip="Loading..." spinning={masker} delay={100} >
    <DDBunit2 config={{...myConfig, gridIsInitSearch: false}} func={func} /> {/* gridIsInitSearch 设置预览页面不查询 */}
    <Drawer title="视图设置" placement="bottom" onClose={() => {setModalVisible0(false)}} open={modalVisible0} height={630}>
      <Spin tip="Loading..." spinning={loadingViewSetting} delay={100} >
      <Tabs
        activeKey={activeKey}
        size="small"
        onChange={(actkey: any) => {setActiveKey(actkey)}}
        items={[
          { label: '全局', key: 'other', children: tab1 },
          { label: '列表', key: C_GRID_COLUMNS, children: tab4 },
          { label: '筛选一', key: C_FILTER_ITEMS, children: tab3 },
          { label: '筛选二', key: C_GRID_FILTER_QUICK, children: tab5 },
          { label: '统计字段', key: C_GRID_SUM_FIELD, children: tab6 },
          { label: '表单', key: C_FORM_ITEMS, children: tab2 },
          { label: '操作列', key: C_HANDLE_COLUMNS, children: tab7 },
          { label: '工具栏', key: C_CUSTOMER_TOOLBAR, children: tab8 },
          { label: '列表排序', key: GRID_DEFAULT_SORT, children: tab9 },
        ]}
        tabBarExtraContent={{
          right: <>
            <Button icon={showBtnIcon ? <DatabaseOutlined /> : null} type='link' size='small' onClick={saveView}>保存视图</Button>
            <Button icon={showBtnIcon ? <DatabaseOutlined /> : null} type='link' size='small' onClick={() => {setModalVisible5(true)}}>数据元</Button>
            <Button icon={<CodeOutlined />} type='link' size='small' onClick={() => {showModal2()}} /> {/*Json编辑*/}
            { activeKey === 'other' && <Button icon={showBtnIcon ? <RetweetOutlined /> : null} type='link' size='small' onClick={onReset}>重置</Button> }
            { activeKey === 'other' && <Button icon={showBtnIcon ? <SaveOutlined /> : null} type='link' size='small' onClick={onSave}>保存</Button> }
            { activeKey === C_FORM_ITEMS && <Button icon={ <PlusOutlined />} onClick={() => {handleAdd({type: C_FORM_ITEMS})}} type="link" /> } {/*增加表单项*/}
            { activeKey === C_FILTER_ITEMS && <Button icon={<PlusOutlined />} onClick={() => {handleAdd({type: C_FILTER_ITEMS})}} type="link" /> } {/*增加筛选项*/}
            { activeKey === C_GRID_FILTER_QUICK && <Button icon={<PlusOutlined />} onClick={() => {handleAdd({type: C_GRID_FILTER_QUICK})}} type="link" /> } {/*增加筛选项*/}
            { activeKey === C_GRID_COLUMNS && <Button icon={<PlusOutlined />} onClick={() => {handleAdd({type: C_GRID_COLUMNS})}} type="link" /> } {/*增加列表列*/}
            { activeKey === C_GRID_SUM_FIELD && <Button icon={<PlusOutlined />} onClick={() => {handleAdd({type: C_GRID_SUM_FIELD})}} type="link" /> } {/*增加统计字段*/}
            { activeKey === C_HANDLE_COLUMNS && <Button icon={<PlusOutlined />} onClick={() => {handleAdd({type: C_HANDLE_COLUMNS})}} type="link" /> } {/*增加操作列*/}
            { activeKey === C_CUSTOMER_TOOLBAR && <Button icon={<PlusOutlined />} onClick={() => {handleAdd({type: C_CUSTOMER_TOOLBAR})}} type="link" /> } {/*增加按钮*/}
            { activeKey === GRID_DEFAULT_SORT && <Button icon={<PlusOutlined />} onClick={() => {handleAdd({type: GRID_DEFAULT_SORT})}} type="link" /> } {/*增加列表排序*/}
            <Button icon={<MinusOutlined />} type='link' size='small' onClick={() => handleCleanConfig()}></Button>
            <Divider orientation="vertical" />
            <Button icon={showBtnIcon ? <FormOutlined /> : null} type='link' size='small' onClick={() => {showModal2('all')}}>Json全量编辑</Button>
            {/* <Button icon={showBtnIcon ? <FileSearchOutlined /> : null} type='link' size='small' onClick={showModal1}>Json查看</Button> */}
            <Button icon={showBtnIcon ? <ClearOutlined /> : null} type='link' size='small' onClick={handleCleanConfigAll}>清空全部</Button>
            <Button icon={showBtnIcon ? <FileDoneOutlined /> : null} type='link' size='small' onClick={handleLoadDefault}>加载默认</Button>
            <Divider orientation="vertical" />
            {/* <Button icon={showBtnIcon ? <FileExcelOutlined /> : null} type='link' size='small' onClick={showModalExcelV1}>Excel配置V1</Button> */}
            <Button icon={showBtnIcon ? <FileExcelOutlined /> : null} type='link' size='small' onClick={showModalExcelV2}>Excel配置</Button>
            <Button icon={showBtnIcon ? <FileExcelOutlined /> : null} type='link' size='small' onClick={saveExcelV2}>Excel保存</Button>
            <Divider orientation="vertical" />
            <Button icon={showBtnIcon ? <SaveOutlined /> : null} type='link' size='small' onClick={showModal4}>存为方案</Button>
            <Button icon={showBtnIcon ? <SelectOutlined /> : null} type='link' size='small' onClick={chooseScheme}>选择方案</Button>
          </>
        }}
      />
      </Spin>
    </Drawer>
    <Modal
      title='配置Json'
      footer={null}
      open={modalVisible1}
      wrapClassName='standard-modal'
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      onCancel={() => setModalVisible1(false)}
    >
      <div className='bw-json'>
        <ReactJson src={requestJson}
          theme={myUtil.theme.getJsonViewTheme()}
          collapseStringsAfterLength={40}
          iconStyle='square'
          displayObjectSize={false}
        />
      </div>
    </Modal>
    <Modal
      title='配置Json编辑'
      open={modalVisible2}
      wrapClassName='standard-modal'
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      onCancel={() => setModalVisible2(false)}
      okText="保存"
      okButtonProps={{ className: 'dd_btn_focus' }}
      cancelText="关闭"
      footer={(<>
        <Button onClick={() => setModalVisible2(false)} type="default">关闭</Button>
        <Button onClick={handleLoadExample} type="default">加载示例</Button>
        <Button onClick={handleSaveConfig} type="primary">保存</Button>
        </>)}
    >
      <div>
        <VanillaJSONEditor
          sizeClasssName="x"
          content={editJson}
          mainMenuBar={true} // true|false
          onChange={setContent}
          mode="text" // tree|text|table
        />
      </div>
    </Modal>
    <Drawer
      title="选择方案"
      placement="right"
      onClose={() => setModalVisible3(false)}
      open={modalVisible3}
      size={CONSTANTS.C_MODAL_WIDTH_X1}
      destroyOnHidden={true}
      zIndex={1001}
      className='right_drawer'
    >
      <List
        itemLayout="horizontal"
        dataSource={schemeList}
        renderItem={(item: any, index: number) => (
          <List.Item
            actions={[<a onClick={(event: any) => { event.stopPropagation(); deleteScheme(index); }} ><DeleteOutlined/></a>]}
            onClick={() => selectScheme(item, index)}
            className={`${item.used ? 'right_drawer_sel right_drawer_sel_active' : 'right_drawer_sel'}`}
            // extra={ item.time }
          >
            <List.Item.Meta
              title={item.name}
              description={<>
                <div>{item.time}</div>
                <div>{item.desc}</div>
              </>}
              avatar={<Avatar size='small'>{index + 1}</Avatar>}
            />
            {/* {item.desc} */}
          </List.Item>
        )}
      />
    </Drawer>
    <Modal
      title='保存方案'
      open={modalVisible4}
      width={CONSTANTS.C_MODAL_WIDTH_X2}
      className={`${loadingScheme ? 'dd_modal_show_masker' : ''}`}
      footer={<>
        <Button onClick={() => setModalVisible4(false)}>关闭</Button>
        <Button type="primary" onClick={() => saveScheme()}>保存</Button>
      </>}
      onCancel={() => setModalVisible4(false)}
      maskClosable={false}
    >
      <Spin
        tip="Loading..."
        spinning={loadingScheme}
        delay={100}
        key="DDBunit2DDBaseForm"
      >
        <DDBaseForm
          form={form2}
          items={schemeSaveItems}
          initialValues={{}}
          layoutType="vertical" // horizontal vertical
          labelInputLayout="horizontal" // horizontal vertical
        />
      </Spin>
    </Modal>
    <Drawer
      title="Excel导入模块一览"
      placement="right"
      onClose={() => setModalVisible6(false)}
      open={modalVisible6}
      size={CONSTANTS.C_MODAL_WIDTH_X1}
      destroyOnHidden={true}
      zIndex={1001}
      className='right_drawer'
      loading={modal6Loading}
      extra={<Space>
        <Button onClick={saveExcelV2}>Excel保存</Button>
      </Space>}
    >
      <List
        itemLayout="horizontal"
        dataSource={excelImportUnitList}
        renderItem={(item: any, index: number) => (
          <List.Item
            onClick={() => selectExcelUnits(item, index)}
            className={`${item.used ? 'right_drawer_sel right_drawer_sel_active' : 'right_drawer_sel'}`}
          >
            <List.Item.Meta
              title={item.name}
              description={<>
                <div>{item.module_key}</div>
                <div>{item.unit_name}</div>
              </>}
              avatar={<Avatar size='small'>{index + 1}</Avatar>}
            />
          </List.Item>
        )}
      />
    </Drawer>
    <ExcelConfigV2 onRef={refModalExcelV2} />
    <Modal
      title='数据元设置'
      open={modalVisible5}
      wrapClassName="standard-modal-1"
      width={CONSTANTS.C_MODAL_WIDTH_X5}
      zIndex={1001}
      footer={<>
        <Button onClick={() => setModalVisible5(false)}>关闭</Button>
        <Button type="primary" disabled={!(dbFields.length>0)} onClick={() => addGridFormColumns({isReplace: false, type: C_GRID_COLUMNS})}>追加列表</Button>
        <Button type="primary" disabled={!(dbFields.length>0)} onClick={() => addGridFormColumns({isReplace: false, type: C_FORM_ITEMS})}>追加表单</Button>
        <Button type="primary" disabled={!(dbFields.length>0)} onClick={() => addGridFormColumns({isReplace: false, type: C_FILTER_ITEMS})}>追加筛选一</Button>
        <Button type="primary" disabled={!(dbFields.length>0)} onClick={() => addGridFormColumns({isReplace: false, type: C_GRID_FILTER_QUICK})}>追加筛选二</Button>
        <Button type="primary" disabled={!(dbFields.length>0)} onClick={() => addGridFormColumns({isReplace: false, type: C_GRID_SUM_FIELD})}>追加统计</Button>
        <Button disabled={!(dbFields.length>0)} onClick={() => addGridFormColumns({isReplace: true, type: C_GRID_COLUMNS})} danger>替换列表</Button>
        <Button disabled={!(dbFields.length>0)} onClick={() => addGridFormColumns({isReplace: true, type: C_FORM_ITEMS})} danger>替换表单</Button>
        <Button disabled={!(dbFields.length>0)} onClick={() => addGridFormColumns({isReplace: true, type: C_FILTER_ITEMS})} danger>替换筛选一</Button>
        <Button disabled={!(dbFields.length>0)} onClick={() => addGridFormColumns({isReplace: true, type: C_GRID_FILTER_QUICK})} danger>替换筛选二</Button>
        <Button disabled={!(dbFields.length>0)} onClick={() => addGridFormColumns({isReplace: true, type: C_GRID_SUM_FIELD})} danger>替换统计</Button>
      </>}
      onCancel={() => setModalVisible5(false)}
      maskClosable={false}
    >
      <ProCard style={{ marginBlockStart: 8 }} gutter={8} ghost className='dbfield_card'>
        <ProCard colSpan="250px" bordered title={<div>物理表 ({getFilterDbTables()?.length || 0})</div>} className='dbfield_card_db'>
            <Input.Search placeholder="请输入物理表名" style={{margin: '0 0 12px 0'}}
              onChange={inputChangeFilterDbTable}
              onPressEnter={enterFilterDbTable}
              onSearch={inputSearchFilterDbTable}
            />
          <List
            itemLayout="horizontal"
            dataSource={getFilterDbTables()}
            size="small"
            style={{height: 'calc(100vh - 242px)', overflow: 'auto'}}
            renderItem={(item: any, index) => (
              <List.Item onClick={() => {changeDbTable(item, index)}} className={dbTableChecked?.dictObjectTableName === item?.dictObjectTableName ? 'item_active' : ''} >
                <List.Item.Meta
                  avatar={<Avatar size={28} style={{ backgroundColor: '#f56a00'}} icon={<DatabaseOutlined />} />}
                  title={<span>{item.dictObjectTableName}</span>}
                  description={item.dictObjectDesc}
                />
              </List.Item>
            )}
          />
        </ProCard>
        <ProCard colSpan="220px" bordered className='dbfield_card_fields_original' title={<Space>
          {!(dbTableChecked?.dictObjectTableName) && <span>数据元</span> }
          {dbTableChecked?.dictObjectTableName && <Button type='link' size='small' onClick={() => addAllDbfields()}>全部添加</Button>}
        </Space>}>
          <List
            itemLayout="horizontal"
            dataSource={dbFieldsOriginal}
            size="small"
            style={{height: 'calc(100vh - 200px)', overflow: 'auto'}}
            renderItem={(item: any, index: any) => (
              <List.Item onClick={() => {addDbField(item, index)}} className={item.isUsed ? 'item_active' : ''}>
                <List.Item.Meta
                  avatar={getAvatar(item, true)}
                  title={<span>
                    {item.dictFieldName}
                    {DDBunit2ADBUtil.isDictKey({ fieldObj: item }) && <KeyOutlined style={{color: '#0a6ed1', margin: '0 0 0 6px'}}/>}
                    </span>}
                  description={item.dictFieldDesc}
                />
              </List.Item>
            )}
          />
        </ProCard>
        <ProCard colSpan={dbFieldsTables?.length > 1 ? '380px' : ''} bordered className="dbfield_card_fields_select" title={<Space>
            <span>已选数据元</span>
            <Typography.Text type="danger">{dbFields?.length || 0}</Typography.Text>
            <Button type='link' size='small' onClick={() => clearDbfields()}>清空</Button>
          </Space>}
        >
          <List
            itemLayout="horizontal"
            dataSource={dbFields}
            size="small"
            style={{height: 'calc(100vh - 200px)', overflow: 'auto'}}
            renderItem={(item: any, index: any) => (
              <List.Item
                actions={[
                  <Button type='link' size='small' icon={<DeleteOutlined />} onClick={() => {deleteDbField(item, index)}}></Button>,
                  <Dropdown menu={{
                    items: [
                      { label: (<Button type='link' size='small' onClick={() => addGridFormColumns({item, isReplace: false, type: C_GRID_COLUMNS})}>追加列表</Button> ), key: '0' },
                      { label: (<Button type='link' size='small' onClick={() => addGridFormColumns({item, isReplace: false, type: C_FORM_ITEMS})}>追加表单</Button> ), key: '1' },
                      { label: (<Button type='link' size='small' onClick={() => addGridFormColumns({item, isReplace: false, type: C_FILTER_ITEMS})}>追加筛选一</Button> ), key: '2' },
                      { label: (<Button type='link' size='small' onClick={() => addGridFormColumns({item, isReplace: false, type: C_GRID_FILTER_QUICK})}>追加筛选二</Button> ), key: '3' },
                      { label: (<Button type='link' size='small' onClick={() => addGridFormColumns({item, isReplace: false, type: C_GRID_SUM_FIELD})}>追加统计</Button> ), key: '4' },
                    ]
                  }}>
                  <a onClick={(e) => e.preventDefault()}><PlusOutlined /></a>
                </Dropdown>
              ]}
              >
                <List.Item.Meta
                  avatar={getAvatar(item, false)}
                  // title={<><span className='select_db'>{item.dictFieldName}</span> <span>{item.dictFieldDesc}</span></>}
                  title={<>
                    <span className='select_db'>
                      {item.dictFieldName}
                      {DDBunit2ADBUtil.isDictKey({ fieldObj: item }) && <KeyOutlined style={{color: '#0a6ed1', margin: '0 0 0 6px'}}/>}
                    </span> <span>{item.dictFieldDesc}</span>
                  </>}
                  description={<><span className='select_db'>{item.dictObjectTableName}</span> <span>{item.dictObjectDesc}</span></>}
                />
              </List.Item>
            )}
          />
        </ProCard>
        {/* {dbFieldsTables?.length > 1 && */}
            <ProCard bordered title={<Space><span>数据元关联属性</span></Space>}>
          <div style={{height: 'calc(100vh - 200px)', overflow: 'auto'}}>
          <Form name="dynamic_form_nest_item" style={{ maxWidth: 451 }} autoComplete="off" form={dbForm}>{/* // onFinish={onFinish} */}
            <Form.List name="connecting">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item {...restField} name={[name, 'dictObjectId1___dictFieldId1']} rules={[{ required: true, message: 'Missing' }]} >
                        <Select style={{ width: 160 }} placeholder="请选择" onChange={addDbConnecting} >
                          {getDbFieldSelectOption()}
                        </Select>
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'joinType']} rules={[{ required: true, message: 'Missing joinType' }]} >
                        <Select style={{ width: 92 }} placeholder="请选择" onChange={addDbConnecting} >
                          <Select.Option value="left join">left join</Select.Option>
                          <Select.Option value="join">join</Select.Option>
                        </Select>
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'dictObjectId2___dictFieldId2']} rules={[{ required: true, message: 'Missing' }]} >
                        <Select style={{ width: 160 }} placeholder="请选择" onChange={addDbConnecting} >
                          {getDbFieldSelectOption()}
                        </Select>
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    {dbFieldsTables.length > 0 && <Button onClick={() => add()} block icon={<PlusOutlined />}>添加表关联</Button>}
                  </Form.Item>
                </>
              )}
            </Form.List>
            {/* <div>dbKeys.length={dbKeys.length}</div> */}
            <Form.List name="dbKeys">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item {...restField} name={[name, 'dictObjectId___dictFieldId']} rules={[{ required: true, message: 'Missing' }]} >
                        <Select style={{ width: 240 }} placeholder="请选择" onChange={addDbKeys} >
                          {getDbFieldSelectOption()}
                        </Select>
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => {remove(name); removeDbDey(name)}} />
                    </Space>
                  ))}
                  <Form.Item>
                    {dbFieldsTables.length > 0 && <Button onClick={() => add()} block icon={<PlusOutlined />}>添加联合主键</Button>}
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
          </div>
        </ProCard>
        {/* } */}
      </ProCard>
    </Modal>
    {showPageElement && <FloatButton.Group style={{ right: 24 }} >
      <FloatButton tooltip='数据元设置' onClick={() => setModalVisible5(true)} icon={<DatabaseOutlined />}/>
      <FloatButton tooltip='视图设置' onClick={() => setModalVisible0(true)} icon={<FormOutlined />}/>
      {/* <FloatButton tooltip='Excel视图导入V1' onClick={showModalExcelV1} icon={<FileExcelOutlined />}/> */}
      <FloatButton tooltip='Excel视图导入' onClick={showModalExcelV2} icon={<FileExcelOutlined />}/>
      {excelImportUnitList?.length > 0 && <FloatButton tooltip='Excel视图导入一览' onClick={() => setModalVisible6(true)} icon={<LayoutOutlined />}/>}
      <FloatButton tooltip='选择方案' onClick={() => setModalVisible3(true)} icon={<BarsOutlined />}/>
    </FloatButton.Group>}
    {showQuickIcon && <Flex gap="middle" align="center" vertical>
      <Flex gap={64} style={{ width: '100%', height: 'calc(100vh - 150px)', }} justify='center' align='center' className='config_menu_nav'>
        <div className='cmenu_wrap' onClick={() => setModalVisible5(true)}><DatabaseOutlined className='cmenu_icon cmenu_icon1'/><div className='cmenu_title'>数据元设置</div></div>
        <div className='cmenu_wrap' onClick={() => setModalVisible0(true)}><FormOutlined className='cmenu_icon cmenu_icon2'/><div className='cmenu_title'>视图设置</div></div>
        {/* <div className='cmenu_wrap' onClick={showModalExcelV1}><FileExcelOutlined className='cmenu_icon cmenu_icon3'/><div className='cmenu_title'>Excel视图导入V1</div></div> */}
        <div className='cmenu_wrap' onClick={showModalExcelV2}><FileExcelOutlined className='cmenu_icon cmenu_icon3'/><div className='cmenu_title'>Excel视图导入</div></div>
        {excelImportUnitList?.length > 0 && <div className='cmenu_wrap' onClick={() => setModalVisible6(true)}><LayoutOutlined className='cmenu_icon cmenu_icon5'/><div className='cmenu_title'>Excel视图导入一览</div></div>}
        <div className='cmenu_wrap' onClick={() => setModalVisible3(true)}><BarsOutlined className='cmenu_icon cmenu_icon4'/><div className='cmenu_title'>选择方案</div></div>
      </Flex>
    </Flex>}
  </Spin>;
};

export default Unit2;