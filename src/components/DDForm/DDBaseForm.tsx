import React, { useEffect, useState, memo } from 'react';
import { Form, message } from 'antd';
import DDItems from './DDItems';
import validateMessages from './validateMess';
import type { BaseFormProps } from './data.d';
import myUtil from '../DDAssist/util';
import formUtil from './formUtil';
import CONSTANTS from '../DDAssist/constants';
import './style.less';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

const DDBaseForm: React.FC<BaseFormProps> = ({
  config,
  func,
  items,
  onSubmit,
  layoutType = 'horizontal', // 表单整体一列或多列布局: horizontal vertical
  labelInputLayout = config?.form_label_input_layout === undefined ? myUtil.theme.getThemeItem('formItemLayout') : config?.form_label_input_layout, // 标签与录入框排列方式: horizontal vertical
  form,
  name,
  initialValues,
  otherParam,
  disabled = false,
}) => {
  const [myItems, setMyItems] = useState<any>([]);
  // const [myLayoutType] = useState<any>(config?.form_layout_type === undefined ? layoutType : config?.form_layout_type);
  const myLayoutType = config?.form_layout_type === undefined ? layoutType : config?.form_layout_type;

  const formStyle = config?.form_style ? config?.form_style : {};
  // debugger;
  // const [myLabelInputLayout, setMyLabelInputLayout] = useState<any>(config?.form_label_input_layout === undefined ? labelInputLayout : config?.form_label_input_layout);

  const onFinish = (values: any) => {
    onSubmit(values);
  };

  let myLayout;
  let groupItemLayout; // 标签、录入框整体占比
  let groupTitleLayout = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }; // 标题占比
  let labelInputLayoutDetail; // 标签、录入框横向排列时的各自占比

  if (myLayoutType === 'vertical') { // 纵向布局
    groupItemLayout = { xs: 19, sm: 19, md: 19, lg: 19, xl: 19, xxl: 19 };
  } else if (typeof myLayoutType === 'number') {
    groupItemLayout = { xs: 24 / myLayoutType };
  } else { // 横向布局
    groupItemLayout = CONSTANTS.DEFAULT_FORM_LAYOUT_33P_ROW;
  }

  // if (myLabelInputLayout === 'horizontal') {
  if (labelInputLayout === 'horizontal') {
    labelInputLayoutDetail = {
      labelcol: { xs: 8 },
      wrappercol: { xs: 16 },
    };
  }

  myLayout = {
    group: groupItemLayout,
    groupTitle: groupTitleLayout
  }

  const initFormItems = () => {
    let tmp = (items && items?.length > 0) ? items : formUtil.init({
      items: config?.form_items || [],
      func,
      form,
    })
    let finalItems: any = [...tmp];
    // 码表解析处理：从json类型入参中解析码表查询参数
    const param = myUtil.code.getCodeTableParamFromJson({
      items: [...finalItems || []],
    });
    // 码表解析处理：获取码表接口promise
    const promiseArr = myUtil.code.getCodeTablePromise(param);
    // 码表解析处理：从json类型入参中解析treeSelect参数
    const param1 = myUtil.treeCode.getTreeCodeTableParamFromJson({
      items: [...(finalItems || [])],
    });
    const promiseArr1 = myUtil.treeCode.getTreeCodeTablePromise(param1);
    promiseArr1.forEach((item: any) => {
      promiseArr.push(item);
    });
    // 码表解析处理：获取码表
    Promise.all(promiseArr)
      .then(() => {})
      .catch(() => { message.error('获取码表失败'); })
      .finally(() => {
        const formItemNew = formUtil.initFormItemsCodeTable([
          ...(finalItems || []),
        ]);
        setMyItems(formItemNew);
      });
  }

  useEffect(() => {
    initFormItems();
    // setMyLabelInputLayout(config?.form_label_input_layout === undefined ? labelInputLayout : config?.form_label_input_layout);
  }, [config, items]);

  useEffect(() => {
    if (form) {
      form.otherParam = otherParam;
    }
  }, [form, otherParam]);
  return (
    <div className="dd-form">
      {/* <DndProvider backend={HTML5Backend}> */}
        <Form preserve={false}
          form={form}
          className='simple-form'
          // layout={myLabelInputLayout}
          layout={labelInputLayout}
          onFinish={onFinish}
          initialValues={initialValues}
          validateMessages={validateMessages}
          {...labelInputLayoutDetail}
          labelWrap
          name={name}
          // disabled={true}
          // variant="borderless" // outlined filled borderless
          disabled={disabled}
        >
          {/* <DDItems useform={form} items={myItems} layout={myLayout} otherParam={otherParam} formType='form' formStyle={formStyle} labelInputLayout={myLabelInputLayout}/> */}
          <DDItems useform={form} items={myItems} layout={myLayout} otherParam={otherParam} formType='form' formStyle={formStyle} labelInputLayout={labelInputLayout}/>
        </Form>
      {/* </DndProvider> */}
    </div>
  );
};
export default memo(DDBaseForm);