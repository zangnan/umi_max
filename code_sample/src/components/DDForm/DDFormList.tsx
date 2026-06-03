import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Button, Form, Space, Input, Select, DatePicker, InputNumber } from 'antd';
import ProCard from '@ant-design/pro-card';
import myUtil from '@/pages/common/myUtil';
import './style.less';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

export type DDFormListProps = {
    onRef?: any;
    cotArr: any;
    columns: any;
    addBtn: any;
  }
const DDFormList: React.FC<DDFormListProps> = ({
    onRef,
    cotArr,
    columns,
    addBtn,
}) => {
  const [form] = Form.useForm();
  const [myItems, setMyItems] = useState(cotArr || []);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [contentArr, setContentArr] = useState<any>([]);

  useEffect(() => {
    setMyItems(cotArr || [])
  }, [cotArr]);

  useEffect(() => {
    let arr = [{}].concat(myItems)
    setContentArr(arr)
  }, [myItems]);

  const columnProps = columns;

  form.setFieldsValue({
    formList: contentArr
  });

  // 新建、编辑保存
  const handleSave = () => {
    form.validateFields().then(values => {
      console.info(values);
    })
  };

  useImperativeHandle(onRef, () => {
    return {
      handleSave,
      form
    };
  });

  // 表单设置
  const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
  };


  // const cotArr = JSON.parse('[{"uuid":"6C66Cdf5-ffCA-4Ee9-a0a7-fd46e983A5d3","hgckspDm":"塑料管","hgspmc":"3917320000","ggxhhgsh":"0|2|密封用|非海绵橡胶|橡胶|非机器及仪器用|无品牌|","sphfwssflhbbm":"0401180029173667807","hwhlwmc":"塑料管","hwhlwjc":"","jm1":"","ggxh":"0|2|密封用|非海绵橡胶|橡胶|非机器及仪器用|无品牌|","sl1":"3","ckbgdhs":245220335663861700,"syyhzcbz":"1","fpssyhlxDm":"MS","cksptssplxDm":"TS"},{"uuid":"48E28bfc-A6A2-f4fd-FFfb-A5e6BF09FADA","hgckspDm":"鸡蛋","hgspmc":"02011000","ggxhhgsh":"0|2|导电连接件|220-240V|无品牌|无型号|||","sphfwssflhbbm":"12282340011146957783","hwhlwmc":"塑料管","hwhlwjc":"塑料制品","jm1":"","ggxh":"0|2|打扫清洁|PP","sl1":"","ckbgdhs":780705655195434500,"syyhzcbz":"","fpssyhlxDm":"","cksptssplxDm":""}]')
  return (
    <>
      <ProCard split="horizontal" className="dd_layout_form_01">
        <ProCard style={{height: myUtil.heightCalc.getCalc(['header', 'cardMargin', 'footerBtn']), overflowY: 'auto'}}>
          <Form {...layout} form={form}>
            <Form.List name="formList" initialValue={contentArr}>
              {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map(( field, index ) => (
              <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                {columnProps.map((item:any, colIndex: number) => {
                  const { title, dataIndex, required, hidden, width, editType, disabled, readOnly, option, type, size, placeholder, onChange, list = [], name, rules, range, min, max, mode, optionLabelProp, picker, onInput, showTime, format, onBlur, onFocus, showSearch, defaultValue, allowClear, labelInValue } = item;
                  // 共通的FormItem属性
                  const formItemCommonProps = {
                    name: [field.name, dataIndex],
                    rules: (contentArr[index][dataIndex + 'Required'] === false) ? [] : rules,
                    validateFirst: true,
                    initialValue: defaultValue,
                  };

                  if (!hidden) {
                    if (index === 0) {
                      return (<Form.Item key={'title' + colIndex} style={{width: width}}>{title}</Form.Item>);
                    } else {
                      // 共通的录入项属性
                      const inputCommonProps = {
                        size,
                        autoComplete: 'off',
                        placeholder: placeholder || `${title}`,
                        // disabled,
                        readOnly
                      };
                      // 临时代码片段
                      let tempFragment:any = '';

                      if (editType === 'Select') {
                        // 选择器
                        const inputProps = { ...inputCommonProps, mode, optionLabelProp, showArrow: true, onChange };
                        inputProps.onChange = (value: any, option: any) => {
                          let rowIndex = index -1;
                          if (onChange) {
                            onChange({ value, option, form: form, index, rowIndex, dataIndex });
                          }
                        };
                        // console.log('@:',myItems[index][dataIndex + 'Disabled']);
                        tempFragment = (
                          <Select {...inputProps} disabled={!!contentArr[index][dataIndex + 'Disabled'] ? contentArr[index][dataIndex + 'Disabled'] : false}>
                            {option?.map((optionItem: any) => {
                              return <Select.Option key={optionItem.key} value={optionItem.value} disabled={optionItem.disabled}>{optionItem.name}</Select.Option>
                            })}
                          </Select>
                        );
                      } else if (editType === 'Date') {
                        // 时间选择器
                        const inputProps: any = { ...inputCommonProps };
                        inputProps.onChange = (date: any, dateString: string) => {
                          if (onChange) {
                            onChange({ date, dateString });
                          }
                        }
                        if (!placeholder && range) {
                          inputProps.placeholder = [`${title}起`, `${title}止`];
                        }
                        if (allowClear != undefined) {
                          inputProps.allowClear = allowClear;
                        }
                        const dataPickFormat = format === 'YYYY-MM' || format === 'yyyy-MM' ? '' : myUtil.date.formatList(format);
                        tempFragment = (<DatePicker {...inputProps} picker={picker} showTime={showTime} format={dataPickFormat} />);
                      } else if (editType === 'InputNumber') {
                        // 数字输入框
                        const inputProps: any = { ...inputCommonProps, min, max };
                        if (onFocus) {
                          inputProps.onFocus = (event: any) => {
                            onFocus({ event, form: form, myItems, setMyItems });
                          }
                        }
                        if (format) {
                          inputProps.formatter = (value: any, info: any) => {
                            if (info?.userTyping) {
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
                          inputProps.parser = (value: any) => {
                            const fLen = format.split(".")[1]?.length || 0;
                            const tmp1 = value.replace(/\$\s?|(,*)/g, '');
                            const tmp2 = Number(tmp1).toFixed(fLen);
                            return tmp2; //return value.replace(/\$\s?|(,*)/g, '');
                          }
                        }
                        tempFragment = (<InputNumber {...inputProps} />);
                      }  else if (editType === 'Operation') {
                        // 操作列
                        tempFragment = (<Button icon={<MinusOutlined />} disabled={fields.length > 1 ? false : true} size="small" onClick={() => { remove(field.name); }} />);
                      } else  {
                        // 默认输入框
                        const inputProps: any = { ...inputCommonProps, min, max };
                        if (onFocus) {
                          inputProps.onFocus = (event: any) => {
                            let text = contentArr[index][dataIndex]
                            let record = contentArr[index]
                            onFocus({ event, form: form, myItems, setMyItems, dataIndex, index, text, record });
                          }
                        }
                        tempFragment = (<Input { ...inputProps } />);
                      };

                      return (
                        <Form.Item {...formItemCommonProps} key={'content' + colIndex} style={{width: width}}>
                          {tempFragment}
                        </Form.Item>
                      );
                    }
                  }
                })}
                <Form.ErrorList errors={errors} />
              </Space>
              ))}
              {addBtn ? <Button icon={<PlusOutlined />} size="small" onClick={() => add()} /> : <></>}
            </>
            )}
            </Form.List>
          </Form>
        </ProCard>
        {/* <ProCard className="ddlf01_footer">
          <Space>
            <Button onClick={() => {setModalVisible(true)}}>设置</Button>
            <Button type="primary" onClick={() => {handleSave()}}>保存</Button>
          </Space>
        </ProCard> */}
      </ProCard>
    </>
  );
};

export default DDFormList;
