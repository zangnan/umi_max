import React from 'react';
import ProCard from '@ant-design/pro-card';
import { Space, Typography, } from 'antd';
import myUtil from '../DDAssist/util';
import './style.less';

const CardNumber: React.FC<any> = ({
  title,
  icon,
  link,
  right,
  left,
}) => {

  const extra = <Space>
    <Typography.Link href="#">{link}</Typography.Link>
  </Space>;

  const getToolbar = () => {
    const toolbarEle: any = <ProCard title={title} extra={extra} >
      <div className="wscn_wrap">
        <div className="wscn_left">
          {icon ? icon : <>
            <div className="top">{left?.label || ''}</div>
            <div className="bottom highlight">{myUtil.text.formatNum(left?.num || 0, left.format || '0,0')}<span className="unit">{left?.unit || ''}</span></div>
          </>}
        </div>
        <div className="wscn_right">
          <div className="top">{right?.label || ''}</div>
          <div className="bottom">{myUtil.text.formatNum(right?.num || 0, right.format || '0,0')}<span className="unit">{right?.unit || ''}</span></div>
        </div>
      </div>
    </ProCard>;
    return toolbarEle;
  }

  return (
    <div className="ws_card_number">
      { getToolbar() }
    </div>
  );
};
export default CardNumber;
