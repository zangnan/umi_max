import React from 'react';
import ProCard from '@ant-design/pro-card';
import { Row, Col } from 'antd';
import './style.less';

const SideMenu: React.FC<any> = ({
  menus,
  title,
}) => {

  const getSideMenu = () => {
    const tmp: any = [];
    menus.forEach((item: any) => {
      tmp.push(
      <Col span={12}>
        <div className='wscsm_title'>
          <span className='wscsm_title_circle'>⦿</span>{`${item.name}`}
        </div>
      </Col>
      );
    });
    const menusNode = <ProCard title={title} >
      <Row className="wscsm_wrap">
        { tmp }
      </Row>
    </ProCard>
    return menusNode;
  };

  return <div className="ws_card_side_menu">{ getSideMenu() }</div>;
};
export default SideMenu;
