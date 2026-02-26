import React from 'react';
import { Space, Typography } from 'antd';
import './style.less';

const GroupCardTitle: React.FC<any> = ({
  title,
  link,
}) => {

  const getGroupCardTitle = () => {
    const node = <>
      <div className="card_group_title">
        <div className="cgt_left">{title}</div>
        <div className="cgt_right">
          <Space>
            <Typography.Link href="#">{link}</Typography.Link>
          </Space>
        </div>
      </div>
    </>
    return node;
  };

  return <>{ getGroupCardTitle() }</>;
};
export default GroupCardTitle;
