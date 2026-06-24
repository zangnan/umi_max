
import React, { useState, useEffect } from 'react';
import { Spin, Row, Col, Card, Button, Badge, Tooltip, message, Modal, Form } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import cardStyle from './cardLess.less';
import { queryKak, jcjyKak, deleteKak } from '@/pages/hts/services/htsApi';
import { history } from 'umi';
import DDAlert from '@/pages/hts/commonModule/DDAlert';

const Index: React.FC<{ data: any }> = ({
  data
}) => {
  const [masker, setMasker] = useState(false);
  const [pdata, setPdata] = useState<any>([]);
  const [flag, setFlag] = useState<any>();

  useEffect(() => {
    queryKakxx({ "sdbz": "Y" });
  }, [data]);

  //查询口岸卡
  const queryKakxx = (param: any) => {
    setMasker(true);
    queryKak(param).then((res: any) => {
      const { code, msg, body } = res;
      if (code === '200') {
        setPdata(body);
        setMasker(false);
        if(body.length == 0){
          setFlag('1');
        }
      } else {
        message.error(msg);
        setMasker(false);
      }
      setMasker(false);
    });
  }

  //口岸卡日志查询
  const selRz = (param: any) => {
    history.push('/hts/pzgl/icCard/icCardrz?kakbm=' + param);
  }
  //解除禁用
  const jcjy = (param: any) => {
    DDAlert.open({
      title: '系统提示',
      info: '确定对该张海关IC卡解除禁用吗？',
      infoType: 'question',
      modalType: 'confirm',
      closeStatus: true,
      content: '',
      isFormContent: false,
      okCallbackFn:function() {
        const param2  ={"kakuuids":[param]}  
        jcjyKak(param2).then((res: any) => {
          const { code, msg, body } = res;
          if (code === '200') {
            queryKakxx({ "sdbz": "Y" });
            setMasker(false);
            message.info('操作成功！');
          } else {
            message.error(msg);
            setMasker(false);
          }
          setMasker(false);
        });
      }
    });
  }

  return <>
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <Row gutter={[16, 16]} >
        {flag=='1'?
        <div className={cardStyle.divEmpty}>当前暂无可操作数据</div>
        :
          pdata.map((item: any) => (
            <Col className="gutter-row" span={6}  >
              <Card
                style={{ height: 180 }}
                actions={[
                  <Button type="link" block onClick={() => jcjy(item.kakuuid)}>解除禁用</Button>,
                  <Button type="link" block onClick={() => selRz(item.kakbm)}>查看日志</Button>,
                ]}
              >
                <Card.Meta
                  avatar={<div className={cardStyle.cardAvatar}></div>}
                  title={item.kakbm}
                  description={<>
                    <div>{item.kaklxDm == '1' ? '操作员卡' : '法人卡'}</div>
                    {item.sdbz == 'Y' ? <div><Badge status="error" />已禁用&nbsp;<Tooltip title="请进行工具检测"><ExclamationCircleOutlined /></Tooltip></div>
                      : <div>&nbsp;</div>}
                  </>}
                />
              </Card>
            </Col>
          ))
        }
      </Row>
    </Spin>
  </>;
};

export default Index;