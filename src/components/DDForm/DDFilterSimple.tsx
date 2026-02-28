import React, { memo } from 'react';
import { Form, Button, Space } from 'antd';
import DDItems from './DDItems';
import type { FilterSimpleProps } from './data';
import UnitUtil from '../DDBunit/unit_util';
import './style.less';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

const DDFilterSimple: React.FC<FilterSimpleProps> = ({
  items,
  onSubmit,
  onReset,
  form,
  name,
  initialValues,
}) => {

  const onFinish = () => {
    const searchModel: any = UnitUtil.grid.assembleSearchModel(form);
    onSubmit(searchModel);
  };

  const reset = (values: any) => {
    form.resetFields();
    if (onReset) {
      onReset(values);
    }
  };

  return (
    <div className="dd-form">
      {/* <DndProvider backend={HTML5Backend}> */}
        <Form
          form={form}
          name={name}
          layout="inline"
          onFinish={onFinish}
          initialValues={initialValues}
        >
          <DDItems items={items} formType='filterSimple' searchAct={onFinish}/>
          <Space>
            <Button htmlType="submit" type="primary">查询</Button>
            <Button onClick={reset} >重置</Button>
          </Space>
        </Form>
      {/* </DndProvider> */}
    </div>
  );
};
export default memo(DDFilterSimple);