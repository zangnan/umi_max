import React, { useEffect, useState } from 'react';
import { Spin, message, Button, Col, Row, Statistic } from 'antd';
import { LikeOutlined } from '@ant-design/icons';
import { queryListNs } from '@/services/api';
import CONSTANTS from '@/components/DDAssist/constants';
import myUtil from '@/components/DDAssist/util';

const HomePage: React.FC = () => {
  const [spinning, setSpinning] = useState(false);
  const [numAppModule, setNumAppModule] = useState(0);
  const [numDict, setNumDict] = useState(0);
  const [numDictField, setNumDictField] = useState(0);

  const handleLogin = async () => {
    const resAppModule = await queryListNs({}, 'app_module');
    const resDict = await queryListNs({}, 'dict');
    const resDictField = await queryListNs({}, 'dict_field');
    setNumAppModule(resAppModule?.body?.rowCount || 0);
    setNumDict(resDict?.body?.rowCount || 0);
    setNumDictField(resDictField?.body?.rowCount || 0);
    // debugger;
    setSpinning(true);
  }

  useEffect(() => {
    handleLogin()
  }, []);

  return (
    <>
      {/* <Row gutter={16}>
        <Col span={8}>
          <Statistic title="模块" value={numAppModule} prefix={<LikeOutlined />} />
        </Col>
        <Col span={8}>
          <Statistic title="表" value={numDict} />
        </Col>
        <Col span={8}>
          <Statistic title="字段" value={numDictField}/>
        </Col>
      </Row> */}
      {/* <Spin spinning={spinning} fullscreen /> */}
    </>

  );
};

export default HomePage;
