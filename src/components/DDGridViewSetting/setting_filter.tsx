import React, { Fragment, useImperativeHandle, useState } from 'react';
import { Tabs, Form, Row, Col, Input, Tooltip, DatePicker, Checkbox, Radio, Select, Space, Divider } from 'antd';
import { QuestionCircleOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import myUtil from '../DDAssist/util';
import { itemType } from '../DDForm/data.d';
import UnitUtil from '../DDBunit/unit_util';
import moment from 'moment';
import './style.less';

export interface DDFilterProps {
  onRef?: any;
  data?: any;
}

const DDFilter: React.FC<DDFilterProps> = ({
  onRef,
  data,
}) => {
  // useForm
  const [form] = Form.useForm();
  // 展示方式
  const [isTabs] = useState<any>(false);
  // 是否展示选择范围部分
  const [isRange] = useState<boolean>(data?.range?.length > 0 ? true : false);
  // 是否展示条件选择部分
  const [isCondition] = useState<boolean>(data?.condition?.length > 0 ? true : false);
  // 条件区域：二维数组，1组别，2项目
  const [pageData, setPageData] = useState<any>(data);
  // 条件区域：二维数组，1组别，2项目
  const [selectConditions2D, setSelectConditions2D] = useState<any>(new Array(data?.condition?.length || []));
  // 条件区域：二维转一维数组，并补全字段
  const [selectConditions1D, setSelectConditions1D] = useState<any>([]);
  // 条件区域：活动Tab索引
  const [activeTabIndex, setActiveTabIndex] = useState<any>(0);
  // 条件区域：查询条件
  const [expression] = useState<any>([
    {key: 'dy', value: '大于'},
    {key: 'xy', value: '小于'},
    {key: 'dd', value: '等于'},
    {key: 'bd', value: '不等于'},
    {key: 'al', value: '包含'},
  ]);

  // 获取设置信息
  const getSettingFilter = () => {
    let searchModel: any;
    const values = form.getFieldsValue(true);
      searchModel = UnitUtil.grid.assembleSearchModel(form, pageData.range || []) || [];        // 获取高级筛选表单值
      if (values?.groupList.length > 0) {
        values?.groupList.forEach((item: any) => {
          if (item.isUse === 1 && (item.content && item.op)) { // 只传入非屏蔽查询条件
            searchModel.push({ type: 1, property: item.value, value: item.content, op: item.op })
          }
        });
      }
    return searchModel;
  };

  // 获取设置源信息
  const getSettingFilterSource = () => {
    const formData = form.getFieldsValue(true);
    return { formData, pageData, selectConditions2D };
  };
  // 选择方案设置源信息
  const setSettingFilterSource = (data: any) => {
    const { formData, pageData, selectConditions2D } = data;
    // 表单特殊类型处理
    pageData?.range?.forEach((item: any) => {
      if (item.type === itemType.DatePicker && formData[item.name]) {  // 日期类型
        if (formData[item.name] instanceof Array) {
          formData[item.name] = [moment(new Date(formData[item.name][0])), moment(new Date(formData[item.name][1]))]
        } else {
          formData[item.name] = moment(new Date(formData[item.name]));
        }
      }
    })
    setPageData(pageData); // 设置页面渲染数据元
    setSelectConditions2D(selectConditions2D); // 设置二维数组
    setSelectConditions1D(formData?.groupList); // 设置一维数组
    form.setFieldsValue(formData); // 设置筛选表单数据
  };

  useImperativeHandle(onRef, () => {
    return {
      getSettingFilter,
      getSettingFilterSource,
      setSettingFilterSource
    };
  });

  // 表单处理 *******************************************************************************************
  // ****************************************************************************************************

  // 表单提交
  const onFinish = (values: any) => {
    console.info(values);
  }

  // 条件区域 Tab & Chk *********************************************************************************
  // ****************************************************************************************************

  // 增减条件项（CheckBox）
  const onChangeConditionChx = (checkedValues: any, index: any) => {
    const { value, checked } = checkedValues.target;
    let showConditons: any = [].concat(form.getFieldsValue(true)?.groupList);
    let targetItem: any;
    if (checked) { // 如果是勾选那么到配置项中根据勾选值找到的数据插入一维数组中
      const conditions = pageData?.condition[index] || [];
      conditions?.items.forEach((itemValue: any) => {
          if (itemValue.value === value) {
            targetItem = JSON.parse(JSON.stringify(itemValue));
            targetItem.uuid =  myUtil.text.uuid();  // 增加uuid
            targetItem.isUse = 1;                   // 增加默认可用标识
          }
        });
      showConditons.push(targetItem);
    } else { // 如果是勾选那么根据取消的勾选值到一维数组中删除对应条目
      showConditons = showConditons.filter((item: any) => {
        return item.value !== value;
      })
    }

    setSelectConditions1D(showConditons);
    form.setFieldsValue({groupList: showConditons});
  }
  // 增减条件项（CheckGroup）：用于修改二维数组，以进行其他操作
  const onChangeCheckGroup = (checkedValues: any, index: any) => {
    // 设置：条件区域 2维数组
    selectConditions2D[index] = checkedValues;
    setSelectConditions2D([].concat(selectConditions2D));

  }
  // 条件区域 List **************************************************************************************
  // ****************************************************************************************************

  // 条件：屏蔽
  const handleDisable = (item: any) => {
    const showConditons: any = [].concat(form.getFieldsValue(true)?.groupList);
    showConditons.map((tmp: any) => {
      if (tmp.uuid === item.uuid) {
        tmp.isUse = item.isUse === 1 ? 0 : 1;
      }
    })
    const newArr = [].concat(showConditons);
    setSelectConditions1D(newArr);
    form.setFieldsValue({groupList: newArr});
  }

  // 条件：复制
  const handleCopy = (uuid: any) => {
    const showConditons: any = [].concat(form.getFieldsValue(true)?.groupList);
    const tmp = showConditons.find((one: any) => { return one.uuid === uuid });
    const tmp2 = {...tmp}
    tmp2.uuid = myUtil.text.uuid();
    const newArr = showConditons.concat(tmp2);
    setSelectConditions1D(newArr);
    form.setFieldsValue({groupList: newArr});
  }

  // 条件：删除
  const handleDelete = (deleteItem: any) => {
    // 设置：条件区域 2维数组
    // 获取删除value
    const deleteItemValue: string = deleteItem.value;
    // 判断数量
    const sameItems = selectConditions1D.filter((tmp: any) => { return tmp.value === deleteItemValue });
    const sameItemsLength = sameItems.length;
    // 如果数量小于等于1，设置checxbox为非选中状态
    if (sameItemsLength <= 1) {
      const newGroup = selectConditions2D.map((item: any) => {
        const arr = item.filter((tmp: string) => { return tmp !== deleteItemValue });
        return arr
      })
      setSelectConditions2D([].concat(newGroup));
    }
    // 设置：条件区域 1维数组
    const newArr = selectConditions1D.filter((tmp: any) => { return tmp.uuid !== deleteItem.uuid });
    setSelectConditions1D(newArr);
    form.setFieldsValue({groupList: newArr});
  }

  // 页面渲染 *******************************************************************************************
  // ****************************************************************************************************

  // 页面渲染：选择范围
  const getRange = () => {
    const children = [];
    const items = pageData.range;
    const length = items?.length || 0;
    for (let i = 0; i < length; i += 1) {
      const { codeTable, type, quickOption, name, validator, placeholder, disabled, range, label, mode, picker, showTime, format } = items[i];
      if (codeTable) {
        items[i].list = myUtil.code.getSelectOption(codeTable)
      }
      let itemLabel;
      // 共通的FormItem属性
      const formItemCommonProps = {
        name,
        rules: validator,
        label,
        validateFirst: true,
      };
      const size: SizeType = 'small';
      // 共通的录入项属性
      const inputCommonProps = {
        'data-dd-type': type,
        size,
        autoComplete: 'off',
        placeholder: placeholder || `${label}`,
        disabled,
      };
      if (type === itemType.Input) {
        const inputProps = { ...inputCommonProps};
        itemLabel = <Form.Item {...formItemCommonProps}>
          <Input {...inputProps}/>
        </Form.Item>;
      } else if (type === itemType.Select) {
        const inputProps: any = { ...inputCommonProps, mode, size: 'default'};
        itemLabel = <Form.Item {...formItemCommonProps}>
          <Select {...inputProps}
            onChange={(value:  any) => {
              pageData.range.map((tmp: any) => {
                if (tmp.name === name) {
                  let numTmp = 0;
                  if (typeof value === 'string') {
                    numTmp = value ? 1 : 0;
                  } else {
                    numTmp = value ? value.length : 0;
                  }
                  tmp.selectNum = numTmp;
                  setPageData({...pageData})
                }
              })
            }}>
            {items[i]?.list?.map((item: any) => (
              <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>;
      } else if (type === itemType.DatePicker) {
        itemLabel = <Form.Item {...formItemCommonProps}>
          {range ? <DatePicker.RangePicker {...inputCommonProps} {...picker} showTime={showTime} format={format} size='default' presets={{
              '今天': [moment().startOf('day'), moment().endOf('day')],
              '昨天': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
              '本月': [moment().startOf('month'), moment().endOf('month')],
              '上月': [moment().subtract(1, 'months').startOf('month'), moment().subtract(1, 'months').endOf('month')],
            }}/>
            : <DatePicker {...inputCommonProps} {...picker} showTime={showTime} format={format}/>
            }
        </Form.Item>;
      } else if (type === itemType.Checkbox) {
        itemLabel = <Form.Item {...formItemCommonProps}>
          <Checkbox.Group onChange={(checkedValues: any) => {
            // console.log('checked = ', checkedValues);
            pageData.range.map((tmp: any) => {
              if (tmp.name === name) {
                tmp.selectNum = checkedValues.length || 0;
                setPageData({...pageData})
              }
            })
          }}>
            {items[i]?.list?.map((item: any) => (
              <Checkbox key={item.value} value={item.value}>{item.name}</Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>;
      } else if (type === itemType.Radio) {
        itemLabel = <Form.Item {...formItemCommonProps}>
          <Radio.Group>
            {items[i]?.list?.map((item: any) => (
              <Radio key={item.value} value={item.value}>{item.name}</Radio>
            ))}
          </Radio.Group>
        </Form.Item>;
      }

      // 快捷选择
      let itemLabelQuick;
      if (quickOption) {
        if (quickOption.type === itemType.Radio) {
          const formItemCommonPropsQuick = {
            name: name + '_quick',
            label: label + '_quick',
          };
          itemLabelQuick = <Form.Item {...formItemCommonPropsQuick}>
            <Radio.Group>
              {quickOption.list.map((item: any) => (
                <Radio key={item.value} value={item.value}>{item.name}</Radio>
              ))}
            </Radio.Group>
          </Form.Item>;
        }
      }

      // 每组标签及输入项布局
      const defaultLayout = {
        label: {
          xs: {span: 4, offset: 0},
        },
        formItem: {
          xs: {span: 8, offset: 0}, // xs sm lg xl xxl
        },
      }
      const layoutNew = { ...defaultLayout, ...items[i].layout};
      const layoutLabel = layoutNew.label;
      const layoutFormItem = layoutNew.formItem;

      // 拼接所有组别的录入项目
      children.push(<Fragment key={i}>
        <Col {...layoutLabel}>
          <div className="label">
            <Tooltip title={items[i].tooltip}>
              <span>
                {items[i].label}
                <span className="quick_sel_num">
                  {items[i].type === itemType.Select && (` (${items[i].selectNum ? items[i].selectNum : 0})`)}
                  {items[i].type === itemType.Checkbox && (` (${items[i].selectNum ? items[i].selectNum : 0})`)}
                </span>
                {items[i].tooltip && <QuestionCircleOutlined />}
              </span>
            </Tooltip>
          </div>
        </Col>
        <Col {...layoutFormItem}>
          <div className={itemLabelQuick ? 'item_label_quick' : ''}>
            {itemLabel}
            {itemLabelQuick}
          </div>
        </Col>
      </Fragment>)
    }
    // return children;

    const range = <div className="dd_faf_range_wrap">
      {/* <Form form={form} name="advanced_search" className="grid-form-advanced-filter" onFinish={onFinish}> */}
        <Row className="antd-Row" style={{width:'100%'}}>{children}</Row>
      {/* </Form> */}
    </div>

    return range;
  }

  const getTargetCondition = () => {
    let targetCondition: any = [];
      targetCondition = (
        <Form.List name="groupList">
          {(fields, { add, remove }) => {
            const formVal = form.getFieldsValue().groupList;
            let node: any = [];
            fields.forEach((field, index) => {
              node.push(
                <Form.Item key={field.name}>
                  <div className={`target_condition ${formVal[index].isUse !== 1 ? 'disabled' : ''}`}>
                    <div className="tc_label">{formVal[index].label} {formVal[index].isUse ? <CheckCircleOutlined /> : <StopOutlined />}</div>
                    <div className="tc_sel">
                      <Form.Item name={[field.name, 'op']} noStyle>
                        <Select style={{ width: 240 }} placeholder="请选择">
                          {getExpression()}
                        </Select>
                      </Form.Item>
                    </div>
                    <div className="tc_input">
                      <Form.Item name={[field.name, 'content']} noStyle>
                        <Input placeholder="请输入"/>
                      </Form.Item>
                    </div>
                    <div className="tc_a">
                      <Space split={<Divider orientation="vertical" />}>
                        <a onClick={() => handleDisable(formVal[index])}>{formVal[index].isUse === 1 ? '屏蔽' : '开启'}</a>
                        <a onClick={() => handleCopy(formVal[index].uuid)}>复制</a>
                        <a onClick={() => handleDelete(formVal[index])}>删除</a>
                      </Space>
                    </div>
                  </div>
                </Form.Item>
              )
            });
            return node;
          }}
        </Form.List>
        )
    return targetCondition;
  }
  // // 页面渲染：条件区域 Tab & Chk
  // const getTargetCondition = () => {
  //   const targetCondition: any = [];
  //   selectConditions1D.forEach((targetItem: any, index: number) => {
  //     targetCondition.push(
  //       <div key={index.toString()} className={`target_condition ${targetItem.isUse !== 1 ? 'disabled' : ''}`}>
  //         <div className="tc_label">{targetItem.label} {targetItem.isUse ? <CheckCircleOutlined /> : <StopOutlined />}</div>
  //         <div className="tc_sel">
  //           <Select style={{ width: 240 }} >
  //             {/* {expression.map((eItem: any) => (
  //               <Select.Option value={eItem.value}>{eItem.name}</Select.Option>
  //             ))} */}
  //             {getExpression()}
  //           </Select>
  //         </div>
  //         <div className="tc_input"><Input placeholder="请输入"/></div>
  //         <div className="tc_a">
  //           <Space split={<Divider orientation="vertical" />}>
  //             <a onClick={() => handleDisable(targetItem)}>{targetItem.isUse === 1 ? '屏蔽' : '开启'}</a>
  //             <a onClick={() => handleCopy(targetItem.uuid)}>复制</a>
  //             <a onClick={() => handleDelete(targetItem)}>删除</a>
  //           </Space>
  //         </div>
  //       </div>
  //     )
  //   })
  //   return targetCondition;
  // }

  // 页面渲染：条件区域 List
  const getCondition = () => {
    const tabPane: any = [];
    const conditions = pageData?.condition || [];
    conditions.forEach((condition: any, index: number) => {
      const options: any = condition.items;
      tabPane.push(
        <Tabs.TabPane tab={condition.groupLabel} key={index.toString()}>
          <Checkbox.Group value={selectConditions2D[index]} onChange={(checkedValues) => onChangeCheckGroup(checkedValues, index)}>
            {options?.map((item: any) => (
              <Checkbox key={item.value} value={item.value} onChange={(checkedValues) => onChangeConditionChx(checkedValues, index)}>{item.label}</Checkbox>
            ))}
          </Checkbox.Group>
        </Tabs.TabPane>
      )
    });
    return <Tabs type="card" onChange={(activeKey) => setActiveTabIndex(activeKey)}>
      {tabPane}
    </Tabs>
  }

  // 页面渲染：条件渲染
  const getExpression = () => {
    const children: any = [];
    for (let i = 0; i < expression.length; i++) {
      children.push(<Select.Option key={i.toString(36) + i} value={expression[i].key}>{expression[i].value}</Select.Option>);
    }
    return children;
  }

  // 页面渲染：条件区域 Tab & Chk & 条件区域 List
  const getConditionAll = () => {
    const conditionAll = <div className="dd_faf_condition_wrap">
      <div className="dd_faf_condition_1">{getCondition()}</div>
      <div className="dd_faf_condition_2">{getTargetCondition()}</div>
    </div>;
    return conditionAll;
  }

  return (
    <>
      <div className="dd_form_advanced_filter">
        <Form form={form} name="advanced_search" className="grid-form-advanced-filter" onFinish={onFinish} initialValues={{groupList:selectConditions1D}}>
        {isTabs ?
        <>
          <Tabs defaultActiveKey="1" className="af_tabs">
          {
            isRange ?
            <Tabs.TabPane tab="选择范围" key="1">
              {getRange()}
            </Tabs.TabPane> : <></>
          }
          {
            isCondition ?
            <Tabs.TabPane tab="条件设置" key="2">
              {getConditionAll()}
            </Tabs.TabPane> : <></>
          }
          </Tabs>
        </> :
        <>
          {
            isRange ?
            <>
            <h2>选择范围</h2>
            {getRange()}
            </> : <></>
          }
          {
            isCondition ?
            <>
            <h2>条件设置</h2>
            {getConditionAll()}
            </> : <></>
          }
        </>}
        </Form>
      </div>
    </>
  );
};

export default DDFilter;