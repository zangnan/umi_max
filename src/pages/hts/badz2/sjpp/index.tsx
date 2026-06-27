import React, { useState } from 'react';
import { Row, Col } from 'antd';
import PpLeft from './ppLeft';
import PpSbpc from './ppSbpc';
import PpBgd from './ppBgd';
import ProCard from '@ant-design/pro-card';


const Index: React.FC<unknown> = () => {
  const [rightType, setRightType] = useState<any>('');
  const [mainParams, setMainParams] = useState<any>({});

  const gridLeftClick = (param: any, type: any) => {
    setMainParams(param);
    setRightType(type);
  }

  

  return <>
    <ProCard split="horizontal" className="dd_znpd_wrap">
      <Row gutter={12}>
        <Col span={7}>
          <PpLeft gridLeftClick={gridLeftClick} />
        </Col>
        <Col span={17}>
          {
            rightType === 'bgd' ? <PpBgd mainParams={mainParams} /> : rightType === 'sbpc' ? <PpSbpc mainParams={mainParams} /> : <></>
          }
        </Col>
      </Row>
    </ProCard>
  </>;
};

export default Index;
