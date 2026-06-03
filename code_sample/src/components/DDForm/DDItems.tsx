import React, { Fragment, useState, useEffect } from 'react';
import { message, Form, Row, Col, Input, Tooltip, Tag, InputNumber, DatePicker, TimePicker, Radio, Checkbox, Select, AutoComplete, Cascader, Upload, TreeSelect } from 'antd';
import { QuestionCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { ItemsProps } from './data.d';
import { itemType } from './data.d';
import './style.less';
import myUtil from '@/pages/common/myUtil';
import type { SizeType } from 'antd/es/config-provider/SizeContext';

const DDItems: React.FC<ItemsProps> = ({
  items,
  formType,
  layout,
  useform,
  otherParam,
  searchAct,
}) => {

  const [fileList, setFileList] = useState<any>([]);
  const [myItems, setMyItems] = useState<any>(items || []);

  useEffect(() => {
    setMyItems(items || [])
  }, [items]);

  // 拦截文件上传
  const beforeUpload = (file: { size: number; name: string; }) => {
    if (file.size > (1048 * 200)) {
      message.error('文件大小应小于200k');
    } else if (!/\.(gif|jpg|bmp|png|GIF|JPG|PNG|BMP)$/.test(file.name)) {
      message.error('暂不支持该类型图片');
    }
    return false; // 返回false后，手动上传文件
  }

  // 上传文件更新
  const fileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // 获取下一个得到焦点对象
  const getNextItem = (currentItem: any) => {
    let nextItem: any;
    for (let i = 0; i < myItems.length; i++) {
      if (myItems[i].type === itemType.GroupTitle
          || myItems[i].type === itemType.Blank
          || myItems[i].readOnly) {
        continue;
      }
      // 定位至当前录入项目
      if (myItems[i].name === currentItem.name) {
        for (let m = i + 1; m < myItems.length; m++) {
          const tmpEle = useform.getFieldInstance(myItems[m].name);
          if (myItems[m].type === itemType.GroupTitle || myItems[m].type === itemType.GroupTitle2 || myItems[m].type === itemType.GroupTitle3) {    // 配置类别为标题
            continue;
          }
          if (myItems[m].type === itemType.Blank) {    // 配置Blank
            continue;
          }
          if (myItems[m].readOnly) {    // 配置为只读
            continue;
          }
          if (myItems[m].disabled) {    // 配置为disabled
            continue;
          }
          if (myItems[m].type === itemType.Hidden) {    // 配置类别hidden
            continue;
          }
          // 动态的只读属性，随用随取
          if (myItems[m].type === itemType.Input) {
            const tmpEleInput = tmpEle.input;
            if (tmpEleInput.getAttribute('readonly')) {
              continue;
            }
          } else if (myItems[m].type === itemType.InputNumber) {
            if (tmpEle.getAttribute('readonly')) {
              continue;
            }
          }
          nextItem = myItems[m];
          break;
        }
      }
    }
    return nextItem;
  }

  // 默认的回车聚焦事件
  const enterFocus = (index: number, event: any) => {
    // 配置了自行控制焦点后移：如果配置为不走默认回车焦点后移时间，则直接返回
    if (myItems[index].enterFocus === false) {
      return;
    }
    // 触发校验，如不通过，则焦点不后移
    // 仅对当前字段进行校验validateFields
    useform?.validateFields([myItems[index].name]).then(() => {
      // 焦点至最后item的处理逻辑，移到保存按钮
      const newItemNum:any = changeNewItem(myItems)?changeNewItem(myItems):0;
      let itemLength = myItems.length - 1 - newItemNum;

      // if (index === itemLength) { // 当前是最后元素(不是readOnly)
      if (index < myItems.length && !getLastItem(myItems, index)) { // 当前元素后面没有readOnly 和 hidden 并且是最后一位
        let btn: any;
        // 查找当前Model下定位按钮
        const antModalWrapEles = document.querySelectorAll('.ant-modal-wrap');
        for (let n = 0; n < antModalWrapEles.length; n++) {
          if (antModalWrapEles[n].style.display === 'none') {
            continue;
          }
          btn = antModalWrapEles[n].querySelector('.ant-modal .ant-modal-footer .dd_btn_focus');
          break;
        }
        btn.focus();
        // 阻止默认行为，否则会直接触发表单提交事件
        if (event && event.preventDefault) {
          event.preventDefault(); // 阻止默认浏览器动作(W3C)
        } else {
          if(window.event) {
            window.event.returnValue = false; // IE中阻止函数器默认动作的方式
          }
          return false;
        }
        return;
      }
      // 获取下个字段
      let nextItem = getNextItem(myItems[index]);
      if (nextItem?.name) {
        useform.getFieldInstance(nextItem.name).focus();
      }
      // 如果下个字段是TextArea，则阻止默认行为，否则焦点会移到TextArea第二行
      if (nextItem?.type === itemType.TextArea) {
        if (event && event.preventDefault) {
          event.preventDefault(); // 阻止默认浏览器动作(W3C)
        } else {
          if(window.event) {
            window.event.returnValue = false; // IE中阻止函数器默认动作的方式
          }
          return false;
        }
      }
      return;
    })
  };

  const changeNewItem = (item: any) => {
    let num = 0;
    if(item.length > 0) {
      for(let i=item.length; i>0; i--) {
        if(item[i-1].readOnly) {
          num++;
        } else {
          break;
        }
      }
      return num;
    }
  }

  const getLastItem = (item: any, index: any) => {
    console.log(item)
    if(item.length > 0 ) {
      for(let i=index + 1; i<item.length; i++) {
        if(!item[i].readOnly && item[i].type != 0 && !item[i].disabled) {
          return true
        }
      }
      return false
    } else {
      return false
    }
  }

  // 列表筛选用
  const filterSearchAct = () => {
    if (formType === 'filter' && searchAct) {
      console.info('列表筛选用');
      searchAct();
    }
  }

  const getFields = () => {
    const children = [];
    for (let i = 0; i < myItems.length; i += 1) {
      const { type, list = [], autoSize = { minRows:1, maxRows: 1}, name, validator, placeholder, disabled, range, label, min, max, mode, optionLabelProp, picker, onInput, onChange, showTime, format, onBlur, onFocus, readOnly, showSearch, defaultValue, allowClear, labelInValue, maxlength, ref } = myItems[i];
      let itemLabel;
      // 共通的FormItem属性
      const formItemCommonProps = {
        name,
        rules: validator,
        label,
        validateFirst: true,
        initialValue: defaultValue,
      };
      const size: SizeType = 'middle';
      // 共通的录入项属性
      const inputCommonProps = {
        'data-dd-type': type,
        size,
        autoComplete: 'off',
        placeholder: placeholder || `${label}`,
        disabled,
        readOnly,
        allowClear,
        ref
        // onInput: () => { return onInput ? fieldEvent[onInput](useform) : true },
      };
      // Hidden
      if (type === itemType.Hidden) {
        itemLabel = <Form.Item {...formItemCommonProps} hidden >
          <Input {...inputCommonProps} />
        </Form.Item>;
        // Input
      } else if (type === itemType.Input) {
        if (range) {
          const formItemCommonProps1 = {
            label: `${label}` + '起',
            name: name + '_searchModelQ',
            validateFirst: true,
            rules: validator,
          };
          const formItemCommonProps2 = {
            label: `${label}` + '止',
            name: name + '_searchModelZ',
            validateFirst: true,
            rules: validator,
          };
          const inputProps1 = { ...inputCommonProps };
          inputProps1.placeholder = `${label}` + '起';
          const inputProps2 = { ...inputCommonProps };
          inputProps2.placeholder = `${label}` + '止';
          itemLabel = <Form.Item>
            <Input.Group compact>
              <Form.Item {...formItemCommonProps1} noStyle >
                <Input {...inputProps1} style={{ width: 'calc(50% - 15px)' }} maxLength={maxlength} />
              </Form.Item>
              <Input className="site-input-split" placeholder="~" disabled />
              <Form.Item {...formItemCommonProps2} noStyle >
                <Input {...inputProps2} className="site-input-right" maxLength={maxlength} style={{ width: 'calc(50% - 15px)' }} />
              </Form.Item>
            </Input.Group>
          </Form.Item>;
        } else {
          const inputProps = { ...inputCommonProps };
          if (onBlur) {
            inputProps.onBlur = (event: any) => {
              onBlur({ event, form: useform, myItems, setMyItems, otherParam, item: myItems[i] });
            }
          }
          if (onFocus) {
            inputProps.onFocus = (e: any) => {
              onFocus({ event, form: useform, myItems, setMyItems, otherParam, item: myItems[i] });
            }
          }
          if (onChange) {
            inputProps.onChange = (e: any) => {
              onChange({ event, form: useform, myItems, setMyItems, otherParam, item: myItems[i] });
            }
          }
          // if (readOnly) {
          //   inputProps.readOnly = readOnly;
          // }
          // 回车聚焦
          inputProps.onPressEnter = (event: any) => {
            // console.info('回车回车回车回车回车');
            enterFocus(i);
          };
          itemLabel = <Form.Item {...formItemCommonProps}>
            <Input {...inputProps} maxLength={maxlength} />
          </Form.Item>;
        }
        // TextArea
      } else if (type === itemType.TextArea) {
        const inputProps = { ...inputCommonProps };
        if (onBlur) {
          inputProps.onBlur = (event: any) => {
            onBlur({ event, form: useform, myItems, setMyItems, otherParam, item: myItems[i] });
          }
        }
        if (onFocus) {
          inputProps.onFocus = (event: any) => {
            onFocus({ event, form: useform, myItems, setMyItems, otherParam, item: myItems[i] });
          }
        }
        if (onChange) {
          inputProps.onChange = (event: any) => {
            onChange({ event, form: useform, myItems, setMyItems, otherParam, item: myItems[i] });
          }
        }
        // if (readOnly) {
        //   inputProps.readOnly = readOnly;
        // }

        // 回车聚焦
        inputProps.onPressEnter = (event: any) => {
          enterFocus(i, event);
        };
        itemLabel = <Form.Item {...formItemCommonProps} className='textArea-bottom'>
          <Input.TextArea {...inputProps} autoSize={autoSize} maxLength={maxlength}/>
        </Form.Item>;
        // Password
      } else if (type === itemType.Password) {
        const inputProps = { ...inputCommonProps };
        itemLabel = <Form.Item {...formItemCommonProps}>
          <Input.Password {...inputProps} />
        </Form.Item>;
        // InputNumber
      } else if (type === itemType.InputNumber) {
        const inputProps = { ...inputCommonProps, min, max, controls: false };
        if (range) {
          const formItemCommonProps1 = {
            label: `${label}` + '起',
            name: name + '_searchModelQ',
            validateFirst: true,
            rules: validator,
          };
          const formItemCommonProps2 = {
            label: `${label}` + '止',
            name: name + '_searchModelZ',
            validateFirst: true,
            rules: validator,
          };
          const inputProps1 = { ...inputProps };
          inputProps1.placeholder = `${label}` + '起';
          const inputProps2 = { ...inputProps };
          inputProps2.placeholder = `${label}` + '止';
          itemLabel = <Form.Item>
            <Input.Group compact>
              <Form.Item {...formItemCommonProps1} noStyle >
                <InputNumber {...inputProps1} className='inputnumber-range-left' maxLength={maxlength} />
              </Form.Item>
              <Input className="site-input-split" placeholder="~" disabled />
              <Form.Item {...formItemCommonProps2} noStyle >
                <InputNumber {...inputProps2} className='inputnumber-range-right' maxLength={maxlength} />
              </Form.Item>
            </Input.Group>
          </Form.Item>;
        } else {
          if (format) {
            inputProps.formatter = (value: any, info: any) => {
              if (info.userTyping) {
                if (info.input) {
                  return info.input;
                } else {
                  if (value) {// 部分浏览器会出现第一次输入info.userTyping为true但info.input中无值，若直接取value会造成光标直接移到最右面小数点后
                    return value?.split('.')[0];
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
              // const tmp2 = Number(tmp1).toFixed(fLen);
              const tmp2 = myUtil.text.formatNumRound(Number(tmp1), fLen);
              return tmp2; //return value.replace(/\$\s?|(,*)/g, '');
            }
          }
          if (onBlur) {
            inputProps.onBlur = (event: any) => {
              onBlur({ event, form: useform, myItems, setMyItems, otherParam, item: myItems[i] });
            }
          }
          if (onFocus) {
            inputProps.onFocus = (event: any) => {
              onFocus({ event, form: useform, myItems, setMyItems, otherParam, item: myItems[i] });
            }
          }
          if (onChange) {
            inputProps.onChange = (event: any) => {
              onChange({ event, form: useform, myItems, setMyItems, otherParam, item: myItems[i] });
            }
          }
          // 回车聚焦
          inputProps.onPressEnter = (event: any) => {
            enterFocus(i);
          };
          itemLabel = <Form.Item {...formItemCommonProps}>
            <InputNumber {...inputProps} />
          </Form.Item>;
        }
        // Select
      } else if (type === itemType.Select) {
        const inputProps = { ...inputCommonProps, mode, optionLabelProp, showArrow: true, onChange, size: 'default', allowClear: true };
        inputProps.onChange = (value: any, option: any) => {
          // 多为表单编辑用
          if (onChange) {
            onChange({ value, option, form: useform, myItems, setMyItems, otherParam, item: myItems[i] });
          }
          if (allowClear != undefined) {
            inputProps.allowClear = allowClear;
          }
          // 列表筛选用
          filterSearchAct();
          // 回车聚焦
        };
        inputProps.onFocus = (event: any) => {
          // 多为表单编辑用
          if (onFocus) {
            onFocus({ value: event.target.value, form: useform, myItems, setMyItems, otherParam, item: myItems[i] });
          }
        };
        inputProps.onChange = (value: any, option: any) => {
          // 多为表单编辑用
          if (onChange) {
            onChange({ value, option, form: useform, myItems, setMyItems, otherParam, item: myItems[i] });
          }
          // if (allowClear != undefined) {
          //   inputProps.allowClear = allowClear;
          // }
          // 列表筛选用
          filterSearchAct();
          // 回车聚焦
        };
        const showType: any = myItems[i].showType;
        let tagRender;
        let maxTagCount;
        if (showType === '4') {
          tagRender = (props: any) => {
            return <Tag>{props?.value}</Tag>
          };
        }
        if (mode === 'multiple') {
          // maxTagCount = 'responsive';
          maxTagCount = {
            maxTagCount: 'responsive',
          }
        }
        const onDropdownVisibleChange = (open: any) => {
          if(!open) {
            enterFocus(i);
          }
        }
        itemLabel = <Form.Item {...formItemCommonProps}>
          <Select {...inputProps} showSearch={showSearch} tagRender={tagRender} onDropdownVisibleChange={onDropdownVisibleChange} {...maxTagCount} defaultActiveFirstOption={false} filterOption={(input, option) => {
            return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }}>
            {list.map((item) => {
              if (showType === '2') {
                // 下拉展示码值，回显码值
                return <Select.Option key={item.value} value={item.value}>{item.value}</Select.Option>
              } else if (showType === '3' || showType === '4') {
                // showType === '3' 下拉展示码值+名称，回显码值+名称
                // showType === '4' 下拉展示码值+名称，回显码值，通过tagRender渲染
                return <Select.Option key={item.value} value={item.value}>{`[${item.value}]     ${item.name}`}</Select.Option>
              } else {
                // 下拉展示名称，回显名称
                return <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
              }
            })}
          </Select>
        </Form.Item>;
        // DatePicker
      } else if (type === itemType.DatePicker) {
        const inputProps: any = { ...inputCommonProps, allowClear: true };
        // if (onChange) {
        //   inputProps.onChange = (date: any, dateString: string) => {
        //     onChange({ date, dateString, form: useform, myItems, setMyItems });
        //   }
        // }
        inputProps.onChange = (date: any, dateString: string) => {
          if (onChange) {
            onChange({ date, dateString, form: useform, myItems, setMyItems });
          }
          // if (allowClear != undefined) {
          //   inputProps.allowClear = allowClear;
          // }
          // 列表筛选用
          filterSearchAct();
          // 回车聚焦
          enterFocus(i);
        }
        if (!placeholder && range) {
          inputProps.placeholder = [`${label}起`, `${label}止`];
        }
        if (allowClear != undefined) {
          inputProps.allowClear = allowClear;
        }

        const onOpenChange = (open: any) => {
          if(!open) {
            enterFocus(i);
          }
        }

        const dataPickFormat = format === 'YYYY-MM' || format === 'yyyy-MM' ? '' : myUtil.date.formatList(format);

        itemLabel = <Form.Item {...formItemCommonProps}>
          {range ? <DatePicker.RangePicker {...inputProps} picker={picker} showTime={showTime} format={dataPickFormat} size='default' onOpenChange={onOpenChange} ranges={{
            '今天': [moment().startOf('day'), moment().endOf('day')],
            '昨天': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
            '本月': [moment().startOf('month'), moment().endOf('month')],
            '上月': [moment().subtract(1, 'months').startOf('month'), moment().subtract(1, 'months').endOf('month')],
          }} />
            : <DatePicker {...inputProps} picker={picker} showTime={showTime} format={dataPickFormat} onOpenChange={onOpenChange} />
          }
        </Form.Item>;
        // TimePicker
      } else if (type === itemType.TimePicker) {
        const inputProps: any = { ...inputCommonProps };
        if (!placeholder && range) {
          inputProps.placeholder = [`${label}起`, `${label}止`];
        }
        inputProps.onChange = (date: any, dateString: string) => {
          if (onChange) {
            onChange({ date, dateString, form: useform, myItems, setMyItems });
          }
          // 列表筛选用
          filterSearchAct();
          // 回车聚焦
          enterFocus(i);
        }
        itemLabel = <Form.Item {...formItemCommonProps}>
          {range ? <TimePicker.RangePicker {...inputProps} {...picker} size='default' /> : <TimePicker {...inputProps} {...picker} />}
        </Form.Item>;
        // Radio
      } else if (type === itemType.Radio) {
        itemLabel = <Form.Item {...formItemCommonProps}>
          <Radio.Group>
            {list.map((item) => (
              <Radio key={item.value} value={item.value}>{item.name}</Radio>
            ))}
          </Radio.Group>
        </Form.Item>;
        // Checkbox
      } else if (type === itemType.Checkbox) {
        itemLabel = <Form.Item {...formItemCommonProps}>
          <Checkbox.Group>
            {list.map((item) => (
              <Checkbox key={item.value} value={item.value}>{item.name}</Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>;
        // AutoComplete
      } else if (type === itemType.AutoComplete) {
        const inputProps = { ...inputCommonProps, };
        if (onBlur) {
          inputProps.onBlur = (event: any) => {
            onBlur({ event, form: useform, myItems, setMyItems, otherParam, item: myItems[i] });
          }
        }
        if (onFocus) {
          inputProps.onFocus = (e: any) => {
            onFocus({ event, form: useform, myItems, setMyItems, otherParam, item: myItems[i] });
          }
        }
        if (onChange) {
          inputProps.onChange = (e: any) => {
            onChange({ event, form: useform, myItems, setMyItems, otherParam, item: myItems[i] });
          }
        }
        // if (readOnly) {
        //   inputProps.readOnly = readOnly;
        // }
        // 回车聚焦
        const onDropdownVisibleChange = (open: any) => {
          if(!open) {
            enterFocus(i);
          }
        }
        const showType: any = myItems[i].showType;
        itemLabel = <Form.Item {...formItemCommonProps}>
          <AutoComplete {...inputProps} onDropdownVisibleChange={onDropdownVisibleChange} filterOption={(input, option) => {
              return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }}>
            {list.map((item) => {
              if (showType === '2') {
                // 下拉展示码值，回显码值
                return <AutoComplete.Option key={item.value} value={item.value}>{item.value}</AutoComplete.Option>
              } else if (showType === '3' || showType === '4') {
                // showType === '3' 下拉展示码值+名称，回显码值+名称
                // showType === '4' 下拉展示码值+名称，回显码值+名称 AutoComplete无法显示tag所以与showType === '3'同逻辑
                return <AutoComplete.Option key={item.value} value={item.value}>{`[${item.value}]     ${item.name}`}</AutoComplete.Option>
              } else {
                // 下拉展示名称，回显名称
                return <AutoComplete.Option key={item.value} value={item.value}>{item.name}</AutoComplete.Option>
              }
            })}
          </AutoComplete>
        </Form.Item>;
        // Cascader
      } else if (type === itemType.Cascader) {
        const inputProps = { ...inputCommonProps, options: myItems[i].list };
        itemLabel = <Form.Item {...formItemCommonProps}>
          <Cascader {...inputProps} />
        </Form.Item>;
        // ComplexPicker
      } else if (type === itemType.ComplexPicker) {
        const inputProps: any = { ...inputCommonProps };
        inputProps.onChange = (date: any, dateString: string) => {
          if (onChange) {
            onChange({ date, dateString, form: useform, myItems, setMyItems });
          }
          // 回车聚焦
          enterFocus(i);
        }
        itemLabel = <Form.Item {...formItemCommonProps}>
          <DatePicker.RangePicker {...inputProps}
            ranges={{
              '今日': [moment().startOf('day'), moment().endOf('day')],
              '昨日': [moment().subtract('days', 1), moment()],
              '最近7日': [moment().subtract('days', 6), moment()],
              '最近30日': [moment().subtract('days', 29), moment()],
            }}
            showTime
            format="YYYY/MM/DD HH:mm:ss"
          />
        </Form.Item>;
        // GroupTitle
      } else if (type === itemType.GroupTitle) {
        if (myItems[i].tooltip) {
          itemLabel = <div className='title' id ='1' >{label}<Tooltip title={myItems[i].tooltip}>
          {myItems[i].tooltip && <QuestionCircleOutlined />}
        </Tooltip></div>;
        } else {
          itemLabel = <div className='title'>{label}</div>;
        }
      } else if (type === itemType.GroupTitle2) {
        itemLabel = <div className='title2'>{label}</div>;
      } else if (type === itemType.GroupTitle3) {
        itemLabel = <div className='title3'>{label}</div>;
      } else if (type === itemType.Avatar) {
        const { imageUrl } = myItems[i];
        const uploadButton = (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>选择头像</div>
          </div>
        );
        itemLabel = <Form.Item {...formItemCommonProps}>
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            maxCount={1}
            beforeUpload={beforeUpload}
            onChange={fileChange}
            fileList={fileList}
          >
            {imageUrl && fileList.length === 0 && <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> || uploadButton}
          </Upload>
        </Form.Item>;
      } else if (type === itemType.TreeSelect) {
        const inputProps: any = { ...inputCommonProps, allowClear: true };
        if (showSearch) {
          inputProps.treeNodeFilterProp = 'title';
        }
        inputProps.onChange = (value: any, label: any, extra: any) => {
          if (onChange) {
            onChange({ value, label, extra, form: useform, myItems, setMyItems });
          }
          // 列表筛选用
          filterSearchAct();
          // 回车聚焦
          enterFocus(i);
        };
        itemLabel = <Form.Item {...formItemCommonProps}>
          <TreeSelect virtual={false} dropdownStyle={{ maxHeight: 400, overflow: 'auto' }} {...inputProps} showSearch={showSearch} labelInValue={labelInValue} treeDefaultExpandAll={true} treeData={list} />
        </Form.Item>;
      } else if (type === itemType.InputTags) {
        const inputProps = { ...inputCommonProps, mode: 'tags', optionLabelProp, showArrow: true, onChange, size: 'default', maxTagCount: 'responsive' };
        inputProps.onChange = (value: any, option: any) => {
          // 多为表单编辑用
          if (onChange) {
            onChange({ value, option, form: useform, myItems, setMyItems, otherParam, item: myItems[i] });
          }
          // 列表筛选用
          filterSearchAct();
          // 回车聚焦
          enterFocus(i);
        };
        itemLabel = <Form.Item {...formItemCommonProps} className="input-tags">
          <Select {...inputProps} showSearch={showSearch}>
          </Select>
        </Form.Item>;
        // DatePicker
      } else if (type === itemType.List) {
        itemLabel = <Form.List name={myItems[i].name}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => {
                const disablebBz = useform.getFieldValue(myItems[i].name)[index]?.isDisabled;
                const canDelete = () => {
                  if (disablebBz === 'Y') return false;
                  return true;
                };
                const isDeletable = canDelete();
  
                let listNode: any = [];
                for (let itemIndex = 0; itemIndex < myItems[i].children.length; itemIndex += 1) {
                  let listLabel = myItems[i].children[itemIndex].label;
                  let listPlaceholder = myItems[i].children[itemIndex].placeholder;
                  let listRules = myItems[i].children[itemIndex].validator;
                  let listType = myItems[i].children[itemIndex].type;
                  // 共通的FormItem属性
                  const listFormItemCommonProps = {
                    // name,
                    rules: listRules,
                    // label,
                    // validateFirst: true,
                    // initialValue: defaultValue,
                  };
                  // 共通的录入项属性
                  const listInputCommonProps = {
                    // 'data-dd-type': type,
                    size,
                    autoComplete: 'off',
                    placeholder: listPlaceholder || `${listLabel}`,
                    // disabled,
                    // readOnly,
                    // allowClear,
                    // onInput: () => { return onInput ? fieldEvent[onInput](useform) : true },
                  };
                  const lstInputProps = { ...listInputCommonProps };
                  let listItemNode: any;
                  if (listType === itemType.Input) {
                    listItemNode = <>
                      <span>{listLabel}</span>
                      <Form.Item {...restField} name={[name, myItems[i].children[itemIndex].name]} {...listFormItemCommonProps} >
                        <Input {...lstInputProps} disabled={!isDeletable}/>
                      </Form.Item>
                    </>
                  } else if (listType === itemType.InputNumber) {
                    const inputNumberProps = { ...listInputCommonProps, min, max, controls: false };
                    if (myItems[i].children[itemIndex].format) {
                      inputNumberProps.formatter = (value: any, info: any) => {
                        if (info.userTyping) {
                          if (info.input) {
                            return info.input;
                          } else {
                            if (value) {// 部分浏览器会出现第一次输入info.userTyping为true但info.input中无值，若直接取value会造成光标直接移到最右面小数点后
                              return value?.split('.')[0];
                            }
                            return '';
                          }
                        } else {
                          if (value) {
                            return myUtil.text.formatNum(value, myItems[i].children[itemIndex].format);
                          }
                          return '';
                        }
                      }
                      inputNumberProps.parser = (value: any) => {
                        const fLen = myItems[i].children[itemIndex].format.split(".")[1]?.length || 0;
                        const tmp1 = value.replace(/\$\s?|(,*)/g, '');
                        // const tmp2 = Number(tmp1).toFixed(fLen);
                        const tmp2 = myUtil.text.formatNumRound(Number(tmp1), fLen);
                        return tmp2; //return value.replace(/\$\s?|(,*)/g, '');
                      }
                    }
                    listItemNode = <>
                      <span>{listLabel}</span>
                      <Form.Item {...restField} name={[name, myItems[i].children[itemIndex].name]} {...listFormItemCommonProps} >
                        <InputNumber {...inputNumberProps} disabled={!isDeletable}/>
                      </Form.Item>
                    </>
                  }
                  listNode.push(listItemNode);
                }
                let listField = <Space key={key} style={{ display: 'flex' }} align="baseline">
                  {listNode}
                  {fields.length > 1 && <MinusCircleOutlined disabled={!isDeletable} onClick={() => isDeletable && handleFormListDelete(index, remove, myItems[i].name)} />}
                </Space>;
                return listField;
              })}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>增加行</Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      } else if (type === itemType.Intro) {
        let introArr: any = [];
        for (let introIndex = 0; introIndex < myItems[i].children.length; introIndex += 1) {
          introArr.push(<div className={`intro_detail_${myItems[i].children[introIndex].level}`}>
            { myItems[i].children[introIndex].label }
          </div>);
        }
        itemLabel = <div>{introArr}</div>;
      } else if (type === itemType.Upload) {
        const props: any = {
          name: 'uploadtest2',
          disabled,
          maxCount: 1,
          onRemove: (file: any) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
          },
          beforeUpload: async (file: any, fileList: any) => {
            const isLt2M = file.size;
            if(isLt2M > 10485760) {
              message.info('上传文件不能超过10M。');
              return Upload.LIST_IGNORE;
            }
            if(!(file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'application/pdf')) {
              message.info('请上传JPG/JPEG/PNG/PDF文件');
              return Upload.LIST_IGNORE;
            }

            // 上传文件base64加密
            let getBase64 = (file: any) => {
              return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
              });
            }
            file.fjxx = await getBase64(file);
            setFileList(fileList);
            return false;
          },
          fileList,
        };
        itemLabel = <Form.Item {...formItemCommonProps} valuePropName="fileList" getValueFromEvent={e => {
            if (Array.isArray(e)) {
                return e;
            }
            return e && e.fileList;
        }}>
        {/* itemLabel = <Form.Item {...formItemCommonProps}> */}
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>选择文件</Button>
          </Upload>
        </Form.Item>
      }

      const handleFormListDelete = (index: any, remove: any, name: any) => {
        // 获取整个 FormList 的值
        const currentItems = useform.getFieldValue(name) || [];
        const newItems = currentItems.filter((item:any, num: any) => num !== index);
        // 执行删除操作
        remove(index);
        useform.setFieldsValue({name: newItems});
      };

      // 每组标签及输入项布局
      const layoutNew = { ...layout, ...myItems[i].layout };
      const layoutLabel = layoutNew.label;
      const layoutFormItem = layoutNew.formItem;
      const layoutGroupTitle = layoutNew.groupTitle;

      // 拼接所有组别的录入项目
      if (type === itemType.Hidden) {
        children.push(<Fragment key={i}>{itemLabel}</Fragment>);
      } else if (type === itemType.GroupTitle || type === itemType.GroupTitle2 || type === itemType.GroupTitle3) {
        if (formType !== 'filter') {
          children.push(<Fragment key={i}><Col {...layoutGroupTitle}>{itemLabel}</Col></Fragment>);
        }
      } else if (type === itemType.Intro) {
        children.push(<Fragment key={i}><Col {...layoutGroupTitle}>{itemLabel}</Col></Fragment>);
      } else if (type === itemType.Blank) {
        if (formType !== 'filter') {
          children.push(<Fragment key={i}><Col {...layoutGroupTitle}></Col></Fragment>);
        }
      } else if (type === itemType.List) {
        children.push(<Fragment key={i}><Col {...layoutGroupTitle}>{itemLabel}</Col></Fragment>);
      }  else {
        if (formType === 'filter') {
          children.push(<Fragment key={i}>
            <Col {...layoutFormItem}>
              <div style={{ position: 'relative' }}>
                {itemLabel}
                <span style={{ position: 'absolute', top: '4px', right: '-16px', cursor: 'pointer' }}>
                  <Tooltip title={myItems[i].tooltip}>
                    {myItems[i].tooltip && <QuestionCircleOutlined />}
                  </Tooltip>
                </span>
              </div>
            </Col>
          </Fragment>)
        } else {
          // 设置必录标识
          let isRequired = false;
          if (myItems[i]?.rules && myItems[i]?.rules.length > 0) {
            const requiredItem = myItems[i]?.rules.find(itemRule => { return itemRule.type === 'base_required' });
            if (requiredItem) {
              isRequired = true;
            }
          }
          const labelEle: any = <>
            <div className={`label dditem_label_${myItems[i]?.name}`}>
              <span className={isRequired ? 'required labeltext' : 'labeltext'}>
                {myItems[i].label!.length > 16 ?
                   <Tooltip title={myItems[i].label}><div className="labeltext-overflow">{myItems[i].label}<span>...</span></div></Tooltip>: myItems[i].label }
                {myItems[i].tooltip && <Tooltip title={myItems[i].tooltip}><QuestionCircleOutlined /></Tooltip>}
              </span>
            </div>
          </>
          const inputEle: any = itemLabel;

          const labelInputLayout = myUtil.localStore.getItem('theme')?.formItemLayout || 'inline';  // inline vertical
          if (labelInputLayout === 'vertical') {  // 标签与录入框上下排列
            const verticalFormItem: any = { xs: 24, sm: 24, md: 24, lg: 12, xl: 6, xxl: 8 }
            children.push(<Fragment key={i}>
              <Col {...verticalFormItem}>
                <div className="vertical_form_item"> {labelEle} </div>
                <div className="vertical_form_item"> {itemLabel} </div>
              </Col>
            </Fragment>)
          } else {  // 标签与录入框左右排列
            children.push(<Fragment key={i}>
              <Col {...layoutLabel}> {labelEle} </Col>
              <Col {...layoutFormItem}> {inputEle} </Col>
            </Fragment>)
          }
        }
      }
    }
    return children;
  };

  return (
    <Fragment>
      <Row className="antd-Row" style={{ width: '100%' }}>{getFields()}</Row>
    </Fragment>
  );
};
export default DDItems;
