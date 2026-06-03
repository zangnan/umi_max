import React, { useRef } from 'react';
import { Timeline, Row, Col } from 'antd';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import unitConfig from './config';
import func from './func'
import { cloneDeep } from 'lodash';
import ProCard from '@ant-design/pro-card';
import ModalBadzml from '../common/ml';
import ModalBafs from './modalBafs';
import { history } from 'umi';
import '../style.less';


const Index: React.FC<unknown> = () => {

  const modalBadzmlRef: any = useRef();
  const modalBafsRef: any = useRef();

  let myConfig = cloneDeep(unitConfig);

  func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(modalBadzmlRef);
    otherRef.push(modalBafsRef);
    return otherRef;
  };

  // 点击菜单跳转
  const clickMenu = (path: any) => {
    history.push(path);
  }

  return <>
    <DDBunit2 config={myConfig} func={func} />
    <ProCard split="horizontal" title={'电子单证备案向导'}>
      <Timeline className="MyTimeline" style={{padding: '16px 24px'}}>
        <Timeline.Item>
          <ProCard bordered>
            <div className="header_card_wrap_group">
              <div className="header_card_title">备案单证基础数据登记</div>
              <Row>
                <Col span={4}>
                  <div className="header_card_time" onClick={() => clickMenu('/hts/badz2/jcsjdj/gxht')}>
                    <svg className="icon svg-icon svg-size" aria-hidden="true">
                        <use xlinkHref="#iconSAAS_TSMDT_YSFWSBMXB"></use>
                    </svg>
                    <span className='header-subtitle'>购销合同</span>
                  </div>
                </Col>
                <Col span={4}>
                  <div className="header_card_time" onClick={() => clickMenu('/hts/badz2/jcsjdj/ysdj')}>
                    <svg className="icon svg-icon svg-size" aria-hidden="true">
                        <use xlinkHref="#iconSAAS_TSMDT_YSFWGJYSSB"></use>
                    </svg>
                    <span className='header-subtitle'>运输单据</span>
                  </div>
                </Col>
                <Col span={4}>
                  <div className="header_card_time" onClick={() => clickMenu('/hts/badz2/jcsjdj/wtbgdj')}>
                    <svg className="icon svg-icon svg-size" aria-hidden="true">
                        <use xlinkHref="#iconSAAS_TSMDT_CKHWSHSBB_1"></use>
                    </svg>
                    <span className='header-subtitle'>委托报关单据</span>
                  </div>
                </Col>
                <Col span={4}>
                  <div className="header_card_time" onClick={() => clickMenu('/hts/badz2/jcsjdj/qtdz')}>
                    <svg className="icon svg-icon svg-size" aria-hidden="true">
                        <use xlinkHref="#iconSAAS_BA_FQSYZZSLSLSM"></use>
                    </svg>
                    <span className='header-subtitle'>其他单证</span>
                  </div>
                </Col>
              </Row>
            </div>
          </ProCard>
        </Timeline.Item>
        <Timeline.Item>
          <ProCard bordered>
            <div className="header_card_wrap_group">
              <div className="header_card_title">申报业务数据匹配</div>
              <Row>
                <Col span={4}>
                  <div className="header_card_time" onClick={() => clickMenu('/hts/badz2/sjpp')}>
                    <svg className="icon svg-icon svg-size" aria-hidden="true">
                        <use xlinkHref="#iconSAAS_BA_CKTMSBABG"></use>
                    </svg>
                    <span className='header-subtitle'>业务匹配</span>
                  </div>
                </Col>
              </Row>
            </div>
          </ProCard>
        </Timeline.Item>
        <Timeline.Item>
          <ProCard bordered>
            <div className="header_card_wrap_group">
              <div className="header_card_title">备案单证装订成册</div>
              <Row>
                <Col span={4}>
                  <div className="header_card_time" onClick={() => clickMenu('/hts/badz2/zdcc')}>
                    <svg className="icon svg-icon svg-size" aria-hidden="true">
                        <use xlinkHref="#iconSAAS_BA_WZMDBTSQKBA"></use>
                    </svg>
                    <span className='header-subtitle'>装订成册备案</span>
                  </div>
                </Col>
              </Row>
            </div>
          </ProCard>
        </Timeline.Item>
        <Timeline.Item>
          <ProCard bordered>
            <div className="header_card_wrap_group">
              <div className="header_card_title">资料管理</div>
              <Row>
                <Col span={4}>
                  <div className="header_card_time" onClick={() => clickMenu('/hts/badz2/zlgl')}>
                    <svg className="icon svg-icon svg-size" aria-hidden="true">
                        <use xlinkHref="#iconSAAS_BZ_WMQYCKTSHZSBB"></use>
                    </svg>
                    <span className='header-subtitle'>归档资料库</span>
                  </div>
                </Col>
              </Row>
            </div>
          </ProCard>
        </Timeline.Item>
      </Timeline>
    </ProCard>
    
    <ModalBadzml onRef={modalBadzmlRef} type={'home'} />
    <ModalBafs onRef={modalBafsRef} />
  </>;
};

export default Index;
