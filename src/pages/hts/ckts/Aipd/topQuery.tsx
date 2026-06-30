// 疑点管理
import React, { useEffect, } from 'react';
import { Button, Form, Input, Space, Radio, Dropdown, Menu,} from 'antd';
import { DownOutlined, } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';


export type YdglProps = {
  handlerZnpdsearch: any;
  searchForm2: any;
  handlerZnpdReset: any;
  handlerZnpd: any;
  setSxModal: any;
  pduuid:any;
}

const Ydgl: React.FC<YdglProps> = ({
  handlerZnpdsearch,
  searchForm2,
  handlerZnpdReset,
  handlerZnpd,
  setSxModal,
  pduuid,
}) => {


  // 初始化执行
  useEffect(() => {
  }, []);

  // 主列表 -更多-按钮点击
  const handlerMock = () => {
    setSxModal(true);
  }




  return (
    <ProCard className="dd_znpd_top_wrap"
      title={
        <Form layout="inline" form={searchForm2} initialValues={{ bgdFpSpmc: '' }}>
          <Form.Item name="ckspmc">
            <Input placeholder="商品品名" style={{ width: '180px', marginRight: 16 }} />
          </Form.Item>
          <Form.Item name="ppgz" initialValue={1}>
            <Radio.Group>
              <Radio value={1}>模糊查询</Radio>
              <Radio value={2}>精准查询</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="link" onClick={handlerMock} >更多筛选<DownOutlined /></Button>
              {
                pduuid?.length > 10 ?
                <Dropdown overlay={(
                  <Menu>
                    <Menu.Item onClick={()=>handlerZnpdsearch('1')} key='szwytz'>原始数据</Menu.Item>
                    <Menu.Item onClick={()=>handlerZnpdsearch('2')} key='szwwtz'>配单结果</Menu.Item>
                  </Menu>
                )}>
                  <Button type="primary">筛选<DownOutlined /></Button>
                </Dropdown>
                : <Button type='primary' key={'search'} onClick={()=>handlerZnpdsearch('1')}>筛选</Button>

              }

              <Button key={'reset'} onClick={handlerZnpdReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      }
      extra={
        <Form layout="inline" >
          <Form.Item >
            <Space>
              <Button type="link" key={'sdpd'} onClick={handlerZnpd}>匹配及生成</Button>
            </Space>
          </Form.Item>
        </Form>
      }>
    </ProCard>
  );
};


export default Ydgl;
