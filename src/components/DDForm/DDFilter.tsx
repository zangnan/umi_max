import React, { useState, memo } from 'react';
import { Form, Button, Space } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DDItems from './DDItems';
import type { FilterProps } from './data.d';
import UnitUtil from '../DDBunit/unit_util';
import CONSTANTS from '../DDAssist/constants';
import myUtil from '../DDAssist/util';
import './style.less';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

const defaultLayout: any = CONSTANTS.DEFAULT_FILTER_LAYOUT_33P_ROW;

const defaultLayoutModal: any = {
  ...defaultLayout,
  xl: {span: 11, offset:1, pull: 1},
  xxl: {span: 11, offset:1, pull: 1}
};

const DDFilter: React.FC<FilterProps> = ({
  items,
  onSubmit,
  onReset,
  // validate,
  form,
  layoutType, // 用于设定layout
  layout = {
    group: layoutType === 'modal' ? defaultLayoutModal : defaultLayout,
  },
}) => {
  const [searchHeight, setSearchHeight] = useState('30px');
  const [expand, setExpand] = useState(false);
  const [toggleMore, setToggleMore] = useState(0);

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

  const toggle = () => {
    setExpand(!expand);
		if (expand === false) {
      setSearchHeight('auto');
		} else {
      setSearchHeight('30px');
		}
  }

  const handleHeight = () => {
    if (document.getElementsByClassName('field-group-child')[0]) {
      setToggleMore(document.getElementsByClassName('field-group-child')[0].clientHeight);
    }
  }
  window.addEventListener('resize', handleHeight);

  return (
    <div className="dd-form">
      <div style={{position: 'relative', paddingRight: '200px'}}>
        <div className="field-group" style={{ height: searchHeight, overflow: 'hidden' }}>
          <DndProvider backend={HTML5Backend}>
            <Form
              form={form}
              name="advanced_search"
              onFinish={onFinish}
              // labelCol= {{ span: 8 }}
              // wrapperCol= {{ span: 16 }}
              labelCol={{ flex: '110px' }}
              labelWrap
            >
              <DDItems items={items} layout={layout} formType='filter' searchAct={onFinish}/>
            </Form>
          </DndProvider>
        </div>
        <div style={{position: 'absolute', top: '0', right: '0'}}>
          <Space>
            <a style={{ display: toggleMore > 50 || items.length > 3 ? 'inline' : 'none'}} onClick={toggle}>
              {expand ? <UpOutlined /> : <DownOutlined />} 更多
            </a>
            <Button type="primary" onClick={onFinish}>查询</Button>
            <Button onClick={reset} >重置</Button>
          </Space>
        </div>
      </div>
    </div>
  );
};
export default memo(DDFilter);