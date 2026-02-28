import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { ColorPicker, Button, message, Form, Row, Col, Input, Typography, Tag, Space, InputNumber, DatePicker, TimePicker, Radio, Checkbox, Select, AutoComplete, Cascader, Upload, TreeSelect, Switch, Modal, theme } from 'antd';
import { PlusOutlined, UploadOutlined, MinusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { ItemsProps } from './data.d';
import { itemType } from './data.d';
import './style.less';
import myUtil from '../DDAssist/util';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import { useDrop } from 'react-dnd';
// import Dnd from "./Dnd";
// import DragLayer from "./DragLayer";
import { cloneDeep } from 'lodash';
import type { RcFile, UploadFile } from 'antd/es/upload';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import 'react-markdown-editor-lite/lib/index.css';

const { useToken } = theme;

const MarkdownInput: React.FC<any> = (props) => {
  const { id, value = {}, onChange } = props;
  const [mdContent, setMdContent] = useState('');
  const triggerChange = (changedValue: { mdContent?: any }) => {
    onChange?.({ mdContent, ...value, ...changedValue });
  };
  const plugins = [
    'header',
    'font-bold',
    'font-italic',
    'font-underline',
    'font-strikethrough',
    'list-unordered',
    'list-ordered',
    'block-quote',
    'block-wrap',
    'block-code-inline',
    'block-code-block',
    'table',
    'image',
    'link',
    'clear',
    'logger',
    'mode-toggle',
    'full-screen',
    'tab-insert'
  ];
  const handleEditorChange = ({ text }: any) => {
    setMdContent(text);
    triggerChange({ mdContent: text });
  };
  return (
    <span id={id}>
      <MdEditor
        {...props}
        plugins={plugins}
        value={value?.mdContent || mdContent}
        style={{ height: '500px' }}
        onChange={handleEditorChange}
        view={{ menu: true, md: true, html: true, }}
        renderHTML={(text) => {
          // debugger;
          return new MarkdownIt().render(text)}
        }
        // ref={ref}
      />
    </span>
  );
};

const DDItems: React.FC<ItemsProps> = ({
  items,
  formType,
  layout,
  useform,
  otherParam,
  searchAct,
  labelInputLayout,
  formItemLabelShow = myUtil.theme.getThemeItem('formItemLabelShow'), // 标签与录入框排列方式: horizontal vertical
  formStyle
}) => {
  const [fileList, setFileList] = useState([]);
  const [fileListPicture, setFileListPicture] = useState([]);
  const [fileListVideo, setFileListVideo] = useState([]);
  const [fileListAudio, setFileListAudio] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  let { token } = useToken();
  let addLineText = '增加行';

  const [myItems, setMyItems] = useState<any>(items || []);
  const [myFormStyle, setMyFormStyle] = useState<any>(formStyle || {});

  useEffect(() => {
    setMyItems(items || [])
  }, [items]);

  // 拦截文件上传
  const beforeUpload = (file: { size: number; name: string; }) => {
    if (file.size > (1048 * 100)) {
      message.error('文件大小应小于100k');
      return Upload.LIST_IGNORE;
    } else if (!/\.(gif|jpg|bmp|png|jpeg|GIF|JPG|PNG|BMP|JPEG)$/.test(file.name)) {
      message.error('暂不支持该类型图片');
      return Upload.LIST_IGNORE;
    }
    return false; // 返回false后，手动上传文件
  }

  // 上传文件更新
  const fileChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  // 获取下一个得到焦点对象
  const getNextItem = (currentItem: any) => {
    let nextItem: any;
    for (let i = 0; i < myItems.length; i++) {
      if (myItems[i].type === itemType.GroupTitle
          || myItems[i].type === itemType.Blank
          || myItems[i].type === itemType.Upload
          || myItems[i].readOnly) {
        continue;
      }
      // 定位至当前录入项目
      if (myItems[i].name === currentItem.name) {
        for (let m = i + 1; m < myItems.length; m++) {
          const tmpEle = useform.getFieldInstance(myItems[m].name);
          if (myItems[m].type === itemType.GroupTitle) {    // 配置类别为标题
            continue;
          }
          if (myItems[m].type === itemType.Blank) {    // 配置Blank
            continue;
          }
          if (myItems[m].type === itemType.Upload) {    // 配置Blank
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
            const tmpEleInput = tmpEle?.input;
            if (tmpEleInput?.getAttribute('readonly')) {
              continue;
            }
          } else if (myItems[m].type === itemType.InputNumber) {
            if (tmpEle?.getAttribute('readonly')) {
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

  // 默认的回车聚焦事件
  const enterFocus = (index: number, event?: any) => {
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
      if (index === itemLength) { // 当前是最后元素(不是readOnly)
        let btn: any;
        // 查找当前Model下定位按钮
        const antModalWrapEles: any = document.querySelectorAll('.ant-modal-wrap');
        for (let n = 0; n < antModalWrapEles.length; n++) {
          if (antModalWrapEles[n].style.display === 'none') {
            continue;
          }
          btn = antModalWrapEles[n].querySelector('.ant-modal .ant-modal-footer .dd_btn_focus');
          break;
        }
        btn?.focus();
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
      if (nextItem?.name && (useform.getFieldInstance(nextItem.name))?.focus) {
        (useform.getFieldInstance(nextItem.name))?.focus();
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

  // 列表筛选用
  const filterSearchAct = () => {
    if ((formType === 'filter' || formType === 'filterSimple') && searchAct) {
      searchAct();
    }
  }

  const getFields = () => {
    const children = [];
    for (let i = 0; i < myItems.length; i += 1) {
      const { type, list = [], autoSize = { minRows:3, maxRows: 3}, name, validator, placeholder, disabled, range, label,
        min, max, mode, optionLabelProp, picker, onChange, showTime, format, onBlur, onFocus, readOnly, showSearch = true,
        defaultValue, allowClear, labelInValue, maxlength, tooltip, maxCount, listType, onSearch, enterButton } = myItems[i];
      let itemLabel;
      // 共通的FormItem属性
      const formItemCommonProps: any = {
        name,
        rules: validator,
        validateFirst: true,
        initialValue: defaultValue,
        tooltip,
        label: (formType === 'filter' && formItemLabelShow === false) ? '' : label,
      };
      if (labelInputLayout === 'horizontal') {
        if (myItems[i]?.layout?.labelcol) {
          formItemCommonProps.labelcol = myItems[i]?.layout?.labelcol;
        }
        if (myItems[i]?.layout?.wrappercol) {
          formItemCommonProps.wrappercol = myItems[i]?.layout?.wrappercol;
        }
      }
      // 列表过滤表单，无label
      // if (formType !== 'filter' && formType !== 'filterSimple') {
      //   formItemCommonProps.label = label;
      // }
      const size: SizeType = 'middle';
      // 共通的录入项属性
      const inputCommonProps: any = {
        // ...myItems[i],
        'data-dd-type': type,
        size,
        autoComplete: 'off',
        placeholder: placeholder || `${label}`,
        disabled,
        readOnly,
        // allowClear: true,
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
          const inputProps1 = { ...inputCommonProps, allowClear: true };
          inputProps1.placeholder = `${label}` + '起';
          const inputProps2 = { ...inputCommonProps };
          inputProps2.placeholder = `${label}` + '止';
          itemLabel = <Form.Item {...formItemCommonProps}>
            <Space.Compact block>
              <Form.Item {...formItemCommonProps1} noStyle >
                <Input {...inputProps1} style={{ width: 'calc(50% - 15px)' }} maxLength={maxlength} />
              </Form.Item>
              <Input className="site-input-split" placeholder="~" disabled />
              <Form.Item {...formItemCommonProps2} noStyle >
                <Input {...inputProps2} className="site-input-right" maxLength={maxlength} style={{ width: 'calc(50% - 15px)' }} />
              </Form.Item>
            </Space.Compact>
          </Form.Item>;
        } else {
          const inputProps: any = { ...inputCommonProps, allowClear: true };
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
          if (onSearch) {
            inputProps.onSearch = (value: any, event: any) => {
              onSearch({ value, event, form: useform, myItems, setMyItems, otherParam, item: myItems[i] });
            }
          }
          // 回车聚焦
          inputProps.onPressEnter = (event: any) => {
            enterFocus(i, event);
          };
          if (onSearch) {
            itemLabel = <Form.Item {...formItemCommonProps}>
              <Input.Search {...inputProps} maxLength={maxlength} enterButton={enterButton ? enterButton : false}/>
            </Form.Item>;
          } else {
            itemLabel = <Form.Item {...formItemCommonProps}>
              <Input {...inputProps} maxLength={maxlength} />
            </Form.Item>;
          }
        }
        // 媒体库 media library
      } else if (type === itemType.MediaLibrary) {
        const inputProps: any = { ...inputCommonProps, allowClear: true, readOnly: true };
          if (onSearch) {
            inputProps.onSearch = (value: any, event: any) => {
              onSearch({ value, event, form: useform, myItems, setMyItems, otherParam, item: myItems[i] });
            }
          }
          itemLabel = <Form.Item label={label}>
          {/* <Space> */}
            {/* <Form.Item {...formItemCommonProps} name={[name, 'desc']} > */}
            <Form.Item {...formItemCommonProps} name={[name, 'mediaDesc']} noStyle>
              <Input.Search {...inputProps} maxLength={maxlength} style={{ width: '100%' }}/>
            </Form.Item>
            <Form.Item hidden {...formItemCommonProps} name={[name, 'mediaId']} noStyle >
              <Input {...inputCommonProps} />
            </Form.Item>
          {/* </Space> */}
        </Form.Item>;
        // TextArea
      } else if (type === itemType.TextArea) {
        const inputProps: any = { ...inputCommonProps, allowClear: true };
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
        itemLabel = <Form.Item {...formItemCommonProps}>
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
          const inputProps1 = { ...inputCommonProps, min, max, controls: false };
          inputProps1.placeholder = `${label}` + '起';
          const inputProps2 = { ...inputCommonProps, min, max, controls: false };
          inputProps2.placeholder = `${label}` + '止';
          itemLabel = <Form.Item {...formItemCommonProps}>
            <Space.Compact block>
              <Form.Item {...formItemCommonProps1} noStyle >
                <InputNumber {...inputProps1} style={{ width: 'calc(50% - 15px)' }} maxLength={maxlength} />
              </Form.Item>
              <Input className="site-input-split" placeholder="~" disabled />
              <Form.Item {...formItemCommonProps2} noStyle >
                <InputNumber {...inputProps2} className="site-input-right" maxLength={maxlength} style={{ width: 'calc(50% - 15px)' }} />
              </Form.Item>
            </Space.Compact>
          </Form.Item>;
        } else {
          const inputProps: any = { ...inputCommonProps, min, max, controls: false };
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
            enterFocus(i, event);
          };
          itemLabel = <Form.Item {...formItemCommonProps}>
            <InputNumber {...inputProps} style={{ width: '100%' }}/>
          </Form.Item>;
        }
        // Select
      } else if (type === itemType.Select) {
        const inputProps: any = { ...inputCommonProps, mode, optionLabelProp, onChange, size: 'default', allowClear: true };
        inputProps.onChange = (value: any, option: any) => {
          // 多为表单编辑用
          if (onChange) {
            onChange({ value, option, form: useform, myItems, setMyItems, otherParam, item: myItems[i] });
          }
          if (allowClear !== undefined) {
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
          <Select {...inputProps} showSearch={showSearch} tagRender={tagRender} onOpenChange={onDropdownVisibleChange} {...maxTagCount} filterOption={(input, option: any) => {
            return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }}>
            {list.map((item: any) => {
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
        if (allowClear !== undefined) {
          inputProps.allowClear = allowClear;
        }

        const onOpenChange = (open: any) => {
          if(!open) {
            enterFocus(i);
          }
        }

        const dataPickFormat = format === 'YYYY-MM' || format === 'yyyy-MM' ? '' : myUtil.date.formatList(format);

        // debugger;
        // console.info("dataPickFormat=");
        // console.info(dataPickFormat);
        itemLabel = <Form.Item {...formItemCommonProps}>
          {range ? <DatePicker.RangePicker {...inputProps} picker={picker} showTime={showTime} size='default' style={{ width: '100%' }} onOpenChange={onOpenChange} presets={{
          // {range ? <DatePicker.RangePicker {...inputProps} picker={picker} showTime={showTime} format={[dataPickFormat]} size='default' style={{ width: '100%' }} onOpenChange={onOpenChange} presets={{
            '今天': [moment().startOf('day'), moment().endOf('day')],
            '昨天': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
            '本月': [moment().startOf('month'), moment().endOf('month')],
            '上月': [moment().subtract(1, 'months').startOf('month'), moment().subtract(1, 'months').endOf('month')],
          }} />
            : <DatePicker {...inputProps} picker={picker} showTime={showTime} format={dataPickFormat} onOpenChange={onOpenChange} style={{ width: '100%' }}/>
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
          {range ? <TimePicker.RangePicker {...inputProps} {...picker} size='default' style={{ width: '100%' }}/> : <TimePicker {...inputProps} {...picker} style={{ width: '100%' }}/>}
        </Form.Item>;
        // Radio
      } else if (type === itemType.Switch) {
        const inputProps: any = { ...inputCommonProps, size: 'default' };
        if (onChange) {
          inputProps.onChange = (checked: any) => {
            onChange({ checked, form: useform, myItems, setMyItems, otherParam, item: myItems[i] });
          }
        }
        itemLabel = <Form.Item {...formItemCommonProps}>
          <Switch {...inputProps}/>
        </Form.Item>;
        // Checkbox
      } else if (type === itemType.Radio) {
        const inputProps: any = { ...inputCommonProps, size: 'default', optionType: inputCommonProps.optionType || 'button'};
        if (onChange) {
          inputProps.onChange = (event: any) => {
            onChange({ event, form: useform, myItems, setMyItems, otherParam, item: myItems[i] });
          }
        }
        itemLabel = <Form.Item {...formItemCommonProps}>
          <Radio.Group {...inputProps}>
            {list.map((item: any) => (
              <Radio key={item.value} value={item.value}>{item.name}</Radio>
            ))}
          </Radio.Group>
        </Form.Item>;
        // Checkbox
      } else if (type === itemType.Checkbox) {
        itemLabel = <Form.Item {...formItemCommonProps}>
          <Checkbox.Group>
            {list.map((item: any) => (
              <Checkbox key={item.value} value={item.value}>{item.name}</Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>;
        // AutoComplete
      } else if (type === itemType.AutoComplete) {
        const inputProps: any = { ...inputCommonProps, };
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
        const onDropdownVisibleChange = (open: any) => {
          if(!open) {
            enterFocus(i);
          }
        }
        const showType: any = myItems[i].showType;
        itemLabel = <Form.Item {...formItemCommonProps}>
          <AutoComplete {...inputProps} onOpenChange={onDropdownVisibleChange} filterOption={(input, option: any) => {
              return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }}>
            {list.map((item: any) => {
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
          <Cascader {...inputProps} fieldNames={{ label: 'title', value: 'value', children: 'children' }}/>
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
            presets={{
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
        itemLabel = <Typography.Title level={4}>{label}</Typography.Title>;
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
            listType="picture-circle"
            className="avatar-uploader"
            maxCount={1}
            beforeUpload={beforeUpload}
            onChange={fileChange}
            fileList={fileList}
          >
            {imageUrl && fileList.length === 0 && <img src={imageUrl} alt="avatar" style={{ width: '100%', borderRadius: '50%' }} /> || uploadButton}
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
          <TreeSelect virtual={false} styles={{ popup: { root: { maxHeight: '400px', overflow: 'auto' } } }} {...inputProps} showSearch={showSearch} labelInValue={labelInValue} treeDefaultExpandAll={true} treeData={list} />
        </Form.Item>;
      } else if (type === itemType.InputTags) {
        const inputProps: any = { ...inputCommonProps, mode: 'tags', optionLabelProp, onChange, size: 'default', maxTagCount: 'responsive' };
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
      } else if (type === itemType.Upload) {
        const props: any = {
          name: 'uploadtest2',
          maxCount: maxCount || 1,
          listType: listType || "text",
          multiple: true,
          onRemove: (file: any) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
          },
          onChange: (event: any) => {
            if (onChange) {
              onChange({ event, form: useform, myItems, setMyItems, otherParam, item: myItems[i] });
            }
          },
          beforeUpload: async (file: any, fileList: any) => {
            const isLt2M = file.size;
            if(isLt2M > 104857600) {
              message.info('上传文件不能超过100M。');
              return Upload.LIST_IGNORE;
            }
            // debugger;
            // if(!(file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'application/pdf')) {
            //   message.info('请上传JPG/JPEG/PNG/PDF文件');
            //   return Upload.LIST_IGNORE;
            // }
            // 上传文件base64加密
            let getBase64 = (file: any) => {
              return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
              });
            }
            file.fileBase64 = await getBase64(file);
            setFileList(fileList);
            return false;
          },
          fileList,
          disabled,
        };
        itemLabel = <Form.Item {...formItemCommonProps} valuePropName="fileList" getValueFromEvent={e => {
            if (Array.isArray(e)) {
                return e;
            }
            return e && e.fileList;
        }}>
        {/* itemLabel = <Form.Item {...formItemCommonProps}> */}
          <Upload {...props} style={{width: "100%"}}>
            <Button icon={<UploadOutlined />} disabled={disabled}>{`选择文件 (Max: ${maxCount || 1})`}</Button>
          </Upload>
        </Form.Item>
      } else if (type === itemType.UploadPicture) {
        const props: any = {
          name: 'uploadPicture',
          maxCount: maxCount || 1,
          listType: 'picture-card',
          fileList: fileListPicture,
          multiple: true,
          onRemove: (file: any) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileListPicture(newFileList);
          },
          beforeUpload: async (file: any, fileList: any) => {
            const isLt2M = file.size;
            if(isLt2M > 104857600) {
              message.info('上传文件不能超过100M。');
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
            file.fileBase64 = await getBase64(file);
            setFileListPicture(fileList);
            return false;
          },
          onPreview: async (file: UploadFile) => {
            // 上传文件base64加密
            let getBase64 = (file: any) => {
              return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
              });
            }
            if (!file.url && !file.preview) {
              file.preview = await getBase64(file.originFileObj as RcFile);
            }

            setPreviewImage(file.url || (file.preview as string));
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
          }
        };
        itemLabel = <>
          <Form.Item {...formItemCommonProps} valuePropName="fileList" getValueFromEvent={e => {
            if (Array.isArray(e)) {
                return e;
            }
            return e && e.fileList;
          }}>
          {/* itemLabel = <Form.Item {...formItemCommonProps}> */}
            <Upload {...props} style={{width: "100%"}}>
              {
                fileListPicture.length >= maxCount ? null : <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>选择图片</div>
                  <div style={{ marginTop: 8 }}>{`(Max: ${maxCount || 1})`}</div>
                </div>
              }
            </Upload>
          </Form.Item>
          <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </>
      } else if (type === itemType.UploadVideo) {
        const props: any = {
          name: 'uploadVideo',
          maxCount: maxCount || 1,
          fileList: fileListVideo,
          multiple: true,
          onRemove: (file: any) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileListVideo(newFileList);
          },
          onChange: ({ file, fileList }: any) => {
            if (file.status === 'uploading') {
              fileList.map((item: any) => {
                item.previewVideoUrl = URL.createObjectURL(file.originFileObj);
              });
              // 设置视频的预览URL
              setFileListVideo(fileList);
            }
          },
          beforeUpload: async (file: any, fileList: any) => {
            if (file.type.startsWith('video/')) {
              // 上传文件base64加密
              let getBytes = (file: any) => {
                return new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.readAsArrayBuffer(file);
                  reader.onload = () => resolve(reader.result);
                  reader.onerror = error => reject(error);
                });
              }
              file.fileBytes = await getBytes(file);
              return true;
            }
            message.error('请上传视频文件!');
            return false;
          },
          itemRender: (originNode: any, file: any, fileList: any, { remove }: any) => (
            <>
              <video width="250" height="200" controls>
                <source src={URL.createObjectURL(file.originFileObj)} type="video/mp4" />
                <source src={URL.createObjectURL(file.originFileObj)} type="video/ogg" />
                <source src={URL.createObjectURL(file.originFileObj)} type="video/webm" />
                您的浏览器不支持视频标签。
              </video>
              <Button style={{display: 'block'}} icon={<DeleteOutlined />} onClick={(e) => {
                  e.preventDefault();
                  remove();
                }}
              />
            </>
          ),
        };
        itemLabel = <Form.Item {...formItemCommonProps} valuePropName="fileList" getValueFromEvent={e => {
            if (Array.isArray(e)) {
                return e;
            }
            return e && e.fileList;
        }}>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>{`选择文件 (Max: ${maxCount || 1})`}</Button>
          </Upload>
        </Form.Item>
      } else if (type === itemType.UploadAudio) {
        const props: any = {
          name: 'uploadAudio',
          maxCount: maxCount || 1,
          fileList: fileListAudio,
          multiple: true,
          onRemove: (file: any) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileListAudio(newFileList);
          },
          onChange: ({ file, fileList }: any) => {
            if (file.status === 'uploading') {
              fileList.map((item: any) => {
                item.previewVideoUrl = URL.createObjectURL(file.originFileObj);
              });
              // 设置视频的预览URL
              setFileListAudio(fileList);
            }
          },
          beforeUpload: async (file: any, fileList: any) => {
            if (file.type.startsWith('video/')) {
              // 上传文件base64加密
              let getBytes = (file: any) => {
                return new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.readAsArrayBuffer(file);
                  reader.onload = () => resolve(reader.result);
                  reader.onerror = error => reject(error);
                });
              }
              file.fileBytes = await getBytes(file);
              return true;
            }
            message.error('请上传音频文件!');
            return false;
          },
          itemRender: (originNode: any, file: any, fileList: any, { remove }: any) => (
            <>
              <video width="250" height="80" controls>
                <source src={URL.createObjectURL(file.originFileObj)} type="audio/mpeg" />
                <source src={URL.createObjectURL(file.originFileObj)} type="audio/ogg" />
                您的浏览器不支持音频标签。
              </video>
              <Button style={{display: 'block'}} icon={<DeleteOutlined />} onClick={(e) => {
                  e.preventDefault();
                  remove();
                }}
              />
            </>
          ),
        };
        itemLabel = <Form.Item {...formItemCommonProps} valuePropName="fileList" getValueFromEvent={e => {
            if (Array.isArray(e)) {
                return e;
            }
            return e && e.fileList;
        }}>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>{`选择文件 (Max: ${maxCount || 1})`}</Button>
          </Upload>
        </Form.Item>
      } else if (type === itemType.RichTextEditor) {
        const inputProps = { ...inputCommonProps };
        inputProps.onChange = (editorState: any, option: any) => {
          // 多为表单编辑用
          if (onChange) {
            onChange({ editorState, option, form: useform, myItems, setMyItems, otherParam, item: myItems[i] });
          }
        };
        itemLabel = <Form.Item {...formItemCommonProps}>
          <BraftEditor {...inputProps} style={{border: '1px solid #d9d9d9', borderRadius: '4px'}}/>
        </Form.Item>;
      } else if (type === itemType.MarkdownEditor) {
        let formItemCommonProps2: any = {...formItemCommonProps};
        const inputProps = { ...inputCommonProps };
        itemLabel =
        <Form.Item {...formItemCommonProps2}>
          <MarkdownInput {...inputProps}/>
        </Form.Item>
        ;
      } else if (type === itemType.List) {
        itemLabel = <>
          <Form.List name={myItems[i].name}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => {
                let listNode: any = [];
                // debugger;
                for (let itemIndex = 0; itemIndex < myItems[i].children.length; itemIndex += 1) {
                  let listLabel = myItems[i].children[itemIndex].label;
                  let listPlaceholder = myItems[i].children[itemIndex].placeholder;
                  let listRules = myItems[i].children[itemIndex].validator;
                  let listType: any = myItems[i].children[itemIndex].type;
                  let listMode: any = myItems[i].children[itemIndex].mode;
                  let listModeKey: any = myItems[i].children[itemIndex][`modeKey${key}`];
                  let listOnChange: any = myItems[i].children[itemIndex].onChange;
                  let listDisabled: any = myItems[i].children[itemIndex].disabled;
                  let listDisabledKey: any = myItems[i].children[itemIndex][`disabledKey${key}`];
                  // 共通的FormItem属性
                  const listFormItemCommonProps = {
                    // name,
                    rules: listRules,
                    // label,
                    // validateFirst: true,
                    initialValue: myItems[i].children[itemIndex].defaultValue,
                  };
                  // Disabled
                  // debugger;
                  let tmpDisabled = listDisabled;
                  if (listDisabledKey !== undefined) {
                    tmpDisabled = listDisabledKey;
                  }

                  let tmpMode = listMode;
                  if (listModeKey !== undefined) {
                    tmpMode = listModeKey;
                  }

                  // 共通的录入项属性
                  const listInputCommonProps = {
                    // ...myItems[i].children[itemIndex],
                    // 'data-dd-type': type,
                    size,
                    autoComplete: 'off',
                    placeholder: listPlaceholder || `${listLabel}`,
                    // mode: listMode,
                    mode: tmpMode,
                    // disabled: listDisabled,
                    disabled: tmpDisabled,
                    // readOnly,
                    // allowClear,
                    // onInput: () => { return onInput ? fieldEvent[onInput](useform) : true },
                  };
                  const lstInputProps: any = { ...listInputCommonProps };
                  let listItemNode: any;
                  // debugger;
                  if (listType === itemType.Hidden) {
                    listItemNode = <Form.Item {...listFormItemCommonProps} hidden >
                    <Input {...lstInputProps} />
                  </Form.Item>;
                  } else if (listType === itemType.Input) {
                    listItemNode = <Form.Item {...restField} label={listLabel} name={[name, myItems[i].children[itemIndex].name]} {...listFormItemCommonProps} >
                      <Input {...lstInputProps} />
                    </Form.Item>;
                  } else if (listType === itemType.InputNumber) {
                    const inputNumberProps = { ...lstInputProps, min, max, controls: false };
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
                      <Form.Item {...restField} label={listLabel} name={[name, myItems[i].children[itemIndex].name]} {...listFormItemCommonProps} >
                        <InputNumber {...inputNumberProps} style={{ width: '100%' }}/>
                      </Form.Item>
                    </>
                  } else if (listType === itemType.Select) {
                      let listSelectShowType = myItems[i]?.children[itemIndex]?.showType;
                      let maxTagCount: any;
                      if (myItems[i]?.children[itemIndex]?.mode === 'multiple') {
                        maxTagCount = {
                          maxTagCount: 'responsive',
                        }
                      }
                      lstInputProps.onChange = (value: any, option: any) => {
                        if (listOnChange) {
                          listOnChange({ value, option, form: useform, myItems, setMyItems, otherParam, item: myItems[i], field: {key, name, ...restField} });
                        }
                      };
                      listItemNode = <Form.Item {...restField} label={listLabel} name={[name, myItems[i].children[itemIndex].name]} {...listFormItemCommonProps}>
                      <Select {...lstInputProps} {...maxTagCount} filterOption={(input, option: any) => {
                        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                          option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }}>
                        {myItems[i]?.children[itemIndex]?.list.map((item: any) => {
                          if (listSelectShowType === '2') {
                            // 下拉展示码值，回显码值
                            return <Select.Option key={item.value} value={item.value}>{item.value}</Select.Option>
                          } else if (listSelectShowType === '3') {
                            // listSelectShowType === '3' 下拉展示码值+名称，回显码值+名称
                            // listSelectShowType === '4' 下拉展示码值+名称，回显码值，通过tagRender渲染
                            return <Select.Option key={item.value} value={item.value}>{`[${item.value}]     ${item.name}`}</Select.Option>
                          } else {
                            // 下拉展示名称，回显名称
                            return <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
                          }
                        })}
                      </Select>
                    </Form.Item>;
                  } else if (listType === itemType.Cascader) {
                    lstInputProps.onChange = (value: any, option: any) => {
                      if (listOnChange) {
                        listOnChange({ value, option, form: useform, myItems, setMyItems, otherParam, item: myItems[i], field: {key, name, ...restField} });
                      }
                    };
                    listItemNode = <Form.Item {...restField} label={listLabel} name={[name, myItems[i].children[itemIndex].name]} {...listFormItemCommonProps}>
                      <Cascader {...lstInputProps} fieldNames={{ label: 'title', value: 'value', children: 'children' }} options={myItems[i].children[itemIndex].list}/>
                    </Form.Item>;
                    // ComplexPicker
                  } else if (listType === itemType.Radio) {
                    lstInputProps.onChange = (value: any, option: any) => {
                      if (listOnChange) {
                        listOnChange({ value, option, form: useform, myItems, setMyItems, otherParam, item: myItems[i], field: {key, name, ...restField} });
                      }
                    };
                    listItemNode = <Form.Item {...restField}
                    label={listLabel} name={[name, myItems[i].children[itemIndex].name]} {...listFormItemCommonProps} >
                      <Radio.Group {...lstInputProps} optionType={myItems[i].children[itemIndex].optionType || 'button'}>
                        {myItems[i].children[itemIndex].list.map((item: any) => (
                          <Radio key={item.value} value={item.value}>{item.name}</Radio>
                        ))}
                      </Radio.Group>
                    </Form.Item>;
                  } else if (listType === itemType.Checkbox) {
                    listItemNode = <Form.Item {...restField} label={listLabel} name={[name, myItems[i].children[itemIndex].name]} {...listFormItemCommonProps} >
                      <Checkbox.Group {...lstInputProps}>
                        {myItems[i].children[itemIndex].list.map((item: any) => (
                          <Checkbox key={item.value} value={item.value}>{item.name}</Checkbox>
                        ))}
                      </Checkbox.Group>

                    </Form.Item>;

                  } else if (listType === itemType.DatePicker) {
                    const dataPickFormat = format === 'YYYY-MM' || format === 'yyyy-MM' ? '' : myUtil.date.formatList(myItems[i].children[itemIndex].format);
                    listItemNode = <Form.Item {...restField} label={listLabel} name={[name, myItems[i].children[itemIndex].name]} {...listFormItemCommonProps}>
                      <DatePicker {...lstInputProps} format={dataPickFormat}
                        // picker={picker} showTime={showTime} onOpenChange={onOpenChange}
                        style={{ width: '100%' }} />
                    </Form.Item>;
                  }
                  if (listType === itemType.Hidden) {
                    listNode.push(<Fragment key={i}>{listItemNode}</Fragment>);
                  } else {
                    listNode.push(<Col {...layoutItem} >{listItemNode}</Col>);
                  }

                }
                return <>
                  <div className="common_form_list" key={`key_${key}`} style={{backgroundColor: token?.cusBg1 || 'transparent'}}>
                    <div style={{position: 'relative', paddingRight: '30px'}}>
                      <Row className="antd-Row" gutter={24}> {listNode} </Row>
                      {fields.length > 1 && <div style={{position: 'absolute', right: 0, top: 0, color: myUtil.theme.getColor({type: 'error'}) }}><MinusCircleOutlined onClick={() => remove(name)} /></div>}
                    </div>
                  </div>
                </>;
              })}
              <Button type="default" onClick={() => add()} block icon={<PlusOutlined />}>{myItems[i]?.addLineText || addLineText}</Button>
            </>
          )}
        </Form.List>
        </>
      } else if (type === itemType.ColorPicker) {
        const inputProps = { ...inputCommonProps };
        if (onChange) {
          inputProps.onChange = (value: any, css: any) => {
            onChange({ value, css, form: useform, myItems, setMyItems, otherParam, item: myItems[i] });
          }
        }
        itemLabel = <Form.Item {...formItemCommonProps}>
          <ColorPicker {...inputProps} allowClear showText/>
        </Form.Item>;
      }
      // 每组标签及输入项布局
      const layoutNew = { ...layout };
      if (myItems[i]?.layout) {
        layoutNew.group =myItems[i].layout;
      }
      const layoutItem = (() => {
        const item = (type === itemType.GroupTitle || type === itemType.Blank) ? layoutNew.groupTitle : layoutNew.group;
        const { formItem, ...rest } = item || {};
        return rest;
      })();

      // 拼接所有组别的录入项目
      if (type === itemType.Hidden) {
        children.push(<Fragment key={i}>{itemLabel}</Fragment>);
      } else if (type === itemType.List) {
        children.push(<Fragment key={i}><Col {...layoutNew.groupTitle}>{itemLabel}</Col></Fragment>);
        // children.push(<Col {...layoutItem} key={i}>
        //   {itemLabel}
        // </Col>);
      } else {
        if (formType === 'filterSimple') { // 列表上方的快捷筛选表单
          children.push(<div key={i}>
            {itemLabel}
          </div>);
        } else {
          if (formType === 'form' && formStyle?.form_items) { // formStyle中有配置项则为拖拽组件
            // const top = formStyle?.form_items[i].top;
            // const left = formStyle?.form_items[i].left;
            // children.push(
            //   <React.Fragment key={i}>
            //     <Dnd key={`dnd_${i}`} index={i} top={top} left={left} width={formStyle?.drag_style.width}>{itemLabel}</Dnd>
            //     <DragLayer key={`drag_${i}`} index={i} top={top} left={left} width={formStyle?.drag_style.width}>{itemLabel}</DragLayer>
            //   </React.Fragment>
            // );
          } else {
            children.push(<Col {...layoutItem} key={i}>
              {itemLabel}
            </Col>);
          }
        }
      }
    }
    return children;
  };

  // 拖拽后执行方法改变原item的位置信息
  const moveBox = useCallback(
    (index: string, left: number, top: number) => {
      const item = { ...myFormStyle.form_items[index], left, top };
      myFormStyle.form_items.splice(index, 1, item);
      setMyFormStyle(cloneDeep(myFormStyle));
    },
    [myItems],
  )

  // 网格状拖拽
  const doSnapToGrid = (x: number, y: number) => {
    const snappedX = Math.round(x / 20) * 20;
    const snappedY = Math.round(y / 20) * 20;
    return [snappedX, snappedY];
  }

  // 初始化drop
  // const [, drop] = useDrop(
  //   () => ({
  //     accept: 'box',
  //     drop(item: any, monitor) {
  //       const delta = monitor.getDifferenceFromInitialOffset() as {
  //         x: number
  //         y: number
  //       }
  //       let left = Math.round(item.left + delta.x);
  //       let top = Math.round(item.top + delta.y);
  //       [left, top] = doSnapToGrid(left, top);
  //       moveBox(item.index, left, top)
  //       return undefined
  //     },
  //   }),
  //   [moveBox],
  // )
  const styles: any = {
    ...formStyle?.drop_style,
    position: "relative",
  };
  const getEle = () => {
    if (formType === 'filterSimple') { // 列表上方的快捷筛选表单
      return <>{getFields()}</>
    }
    const node: any = [];

    if (formType === 'form' && formStyle?.form_items) { // formStyle中有配置项则为拖拽组件
      node.push(getFields());
    } else {
      node.push(<Row key={'row'} className="antd-Row" gutter={24}>{getFields()}</Row>);
    }
    return <div
    // ref={drop}
    style={styles}>
      {node}
    </div>
  }

  return getEle();
};
export default DDItems;
