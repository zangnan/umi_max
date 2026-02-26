import React from 'react';
import ProCard from '@ant-design/pro-card';
import { Space, Tag, Descriptions } from 'antd';
import './style.less';

const Enterprise: React.FC<any> = ({
  enterprise,
  title,
  cornerTag = '',
}) => {

  const getEnteprise = () => {
    const titleNode= <>
      <div className="header_title">{title}</div>
      <Space size={[8, 8]} wrap className="header_tag">
        <Tag color="processing">申报水电气退税业务的生产企业</Tag>
        <Tag color="processing">无纸化企业</Tag>
      </Space>
    </>;
    const node = <ProCard title={titleNode}>
      <div className="box-delta"><div>{cornerTag}</div></div>
      <Descriptions column={1}>
        <Descriptions.Item label="海关代码">{enterprise?.hgqyDm}</Descriptions.Item>
        <Descriptions.Item label="纳税人识别号">{enterprise?.nsrsbh}</Descriptions.Item>
        <Descriptions.Item label="社会信用代码">{enterprise?.shxydm}</Descriptions.Item>
        <Descriptions.Item label="企业类型">{enterprise?.cktsqylxDm}</Descriptions.Item>
      </Descriptions>
    </ProCard>
    return node;
  };

  return <div className="ws_card_enterprise">{ getEnteprise() }</div>;
};
export default Enterprise;
