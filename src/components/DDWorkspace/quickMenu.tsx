import React, { useRef } from 'react';
import ProCard from '@ant-design/pro-card';
import { Typography, Avatar, Row, Col, Space, Carousel } from 'antd';
import { RightOutlined ,  LeftOutlined } from '@ant-design/icons';
import './style.less';

const QuickMenu: React.FC<any> = ({
  menus,
}) => {

  const extraBtn1 = <Space>
    <Typography.Link href="#">设置</Typography.Link>
  </Space>;

  const myRef: any = useRef();

  const getQuickMenu = () => {
    const tmp: any = [];
    const groups: any = [];
    menus.forEach((item: any, index: number) => {
      tmp.push(<Col span={6}>
        <div className="wscqm_avatar_wrap" >
          <Avatar className="wscqm_avatar" size={90} icon={item.icon} />
          <div className="wscqm_avatar_title" >{item.name}</div>
        </div>
      </Col>);
      if ((index + 1) % 4 === 0) {
        groups.push({ groupMenu: [...tmp] });
        tmp.length = 0;
      }
    });
    if (menus.length % 4 !== 0) {
      // 放入不足4个的最后一组
      groups.push({ groupMenu: [...tmp] });
    }
    let tmpNote: any = [];
    for (let i = 0; i < groups.length; i++) {
      tmpNote.push(<div className='carousel_container'>
        <Row gutter={[16, 16]}>{groups[i]?.groupMenu}</Row>
      </div>)
    }
    const menusNode = <ProCard title="快捷菜单" extra={extraBtn1} >
      <Row className="carousel_wrap">
        <Col span={2}><div className="carousel_btn" onClick={() => { myRef?.current?.prev?.() }}><LeftOutlined /></div></Col>
        <Col span={20}>
          <Carousel ref={myRef}>
            { tmpNote }
          </Carousel>
        </Col>
        <Col span={2}><div className="carousel_btn" onClick={() => { myRef?.current?.next?.() }}><RightOutlined /></div></Col>
      </Row>
    </ProCard>
    return menusNode;
  };

  return <div className="ws_card_qucik_menu">{ getQuickMenu() }</div>;
};
export default QuickMenu;
