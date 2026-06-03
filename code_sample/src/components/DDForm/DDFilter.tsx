import React, { useState, memo } from 'react';
import { Form, Row, Button, Space } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import DDItems from './DDItems';
import type { FilterProps } from './data.d';
import UnitUtil from '@/components/DDBunit/unit_util';
import './style.less';

const DDFilter: React.FC<FilterProps> = ({
  items,
  onSubmit,
  onReset,
  validate,
  form,
  layout = {
    formItem: {
      xs: {span: 23, offset:1, pull: 1},
      sm: {span: 23, offset:1, pull: 1},
      md: {span: 23, offset:1, pull: 1},
      lg: {span: 11, offset:1, pull: 1},
      xl: {span: 7, offset:1, pull: 1},
      xxl: {span: 7, offset:1, pull: 1}
    },
  },
  filterValidate
}) => {
  // console.info('render DDFilter ~~~')

  const [searchHeight, setSearchHeight] = useState('48px');
  const [expand, setExpand] = useState(false);
  const [toggleMore, setToggleMore] = useState(0);
  const [showToggleMoreIcon] = useState(false); // 是否显示切换更多筛选条件箭头
  // const [form] = Form.useForm();

  const onFinish = () => {
    let bool = true;
    if (filterValidate) {
      bool = filterValidate({
        form
      });
    }
    if (bool) {
      const searchModel: any = UnitUtil.grid.assembleSearchModel(form);
      onSubmit(searchModel);
    }
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
      setSearchHeight('48px');
		}
  }

  const clsString = classNames({
    'grid-form': true,
    'search-filter': true,
    validate,
  });

  const handleHeight = () => {
    if (document.getElementsByClassName('field-group-child')[0]) {
      setToggleMore(document.getElementsByClassName('field-group-child')[0].clientHeight);
    }
  }
  window.addEventListener('resize', handleHeight);

  return (
    <div className="dd-form">
      <Form form={form} name="advanced_search" className={clsString} onFinish={onFinish}>
        <div style={{position: 'relative', paddingRight: '200px'}}>
          <div className="field-group" style={{ height: searchHeight, overflow: 'hidden' }}>
            <Row className="antd-Row field-group-child" >
              <DDItems items={items} layout={layout} formType='filter' searchAct={onFinish}/>
            </Row>
          </div>
          <div style={{position: 'absolute', top: '0', right: '0'}}>
            <Space>
              <a style={{ fontSize: 14, display: toggleMore > 50 || items.length > 3 ? 'inline' : 'none'}} onClick={toggle}>
                {expand ? <UpOutlined /> : <DownOutlined />} 更多
              </a>
              <Button htmlType="submit" type="primary">查询</Button>
              <Button onClick={reset} >重置</Button>
            </Space>
          </div>
        </div>
        { showToggleMoreIcon && <>
          <span className="filter_panel_toggle"
            onClick={toggle}
            style={{ fontSize: 14, display: toggleMore > 50 || items.length > 3 ? 'inline' : 'none'}}>
            {expand ? <UpOutlined /> : <DownOutlined />}
          </span>
        </> }
      </Form>
    </div>
  );
};
export default memo(DDFilter);