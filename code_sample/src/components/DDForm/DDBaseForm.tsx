import React, { memo } from 'react';
import { Form, Row } from 'antd';
import DDItems from './DDItems';
import validateMessages from './validateMess';
import type { BaseFormProps } from './data.d';
import './style.less';

const DDBaseForm: React.FC<BaseFormProps> = ({
  items,
  onSubmit,
  layoutType,
  layout,
  form,
  name,
  initialValues,
  otherParam,
}) => {

  // console.info('render DDBaseForm ~~~')

  const onFinish = (values: any) => {
    onSubmit(values);
  };

  let myLayout;
  if (layoutType === 'vertical') {
    // 纵向布局
    const defautLayoutV = {
      label: { xs: 7, sm: 7, md: 7, lg: 7, xl: 7, xxl: 7 },
      formItem: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 12 },
      groupTitle: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }
    }
    myLayout = { ...layout, ...defautLayoutV }
  } else {
    // 横向布局
    const defautLayoutH = {
      label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3 },
      formItem: { xs: 16, sm: 16, md: 16, lg: 7, xl: 5, xxl: 5 },
      groupTitle: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }
    }
    myLayout = { ...layout, ...defautLayoutH };
  }
  form.otherParam = otherParam;
  return (
    <div className="dd-form">
      {/* <Form preserve={false} form={form} className="simple-form" onFinish={onFinish} initialValues={initialValues} validateMessages={validateMessages} name={name}> */}
      <Form preserve={false} form={form} className={`simple-form  ${layoutType === 'vertical' ? 'dd-form-vertical' : 'dd-form-horizontal'}`} onFinish={onFinish} initialValues={initialValues} validateMessages={validateMessages} name={name}>
        <Row className="antd-Row">
          <DDItems useform={form} items={items} layout={myLayout} otherParam={otherParam}/>
        </Row>
      </Form>
    </div>
  );
};
export default memo(DDBaseForm);