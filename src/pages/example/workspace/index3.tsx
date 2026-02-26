import React, {useState} from 'react';
import ProCard from '@ant-design/pro-card';
import DDBaseGrid from '@/components/DDBaseGrid';
import CardNumber from '@/components/DDWorkspace/cardNumber';
import QuickMenu from '@/components/DDWorkspace/quickMenu';
import SideMenu from '@/components/DDWorkspace/sideMenu';
import Enterprise from '@/components/DDWorkspace/enterprise';
import GroupCardTitle from '@/components/DDWorkspace/groupCardTitle';
import { AppstoreOutlined, BarsOutlined, FileDoneOutlined, FileProtectOutlined, ContainerOutlined, CopyOutlined, SnippetsOutlined, BarChartOutlined, PieChartOutlined, AreaChartOutlined } from '@ant-design/icons';
import { Row, Col, Segmented } from 'antd';
import { DndContext, UniqueIdentifier } from '@dnd-kit/core';
import { DraggableOverlay, Droppable } from '../../../pages/example/dnd/components';
// import DraggableItem from './DraggableItem';
import { useDraggable } from '@dnd-kit/core';
import Draggable2 from '../../../pages/example/dnd/components/Draggable/Draggable2';
import './style.less';

const Alert: React.FC<any> = ({}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [parent, setParent] = useState<UniqueIdentifier | null>(null);
  const {isDragging: isDragging1, setNodeRef: setNodeRef1, listeners: listeners1} = useDraggable({
    id: 'draggable-item1',
  });
  const {isDragging: isDragging2, setNodeRef: setNodeRef2, listeners: listeners2} = useDraggable({
    id: 'draggable-item2',
  });

  // 配置列表列
  const columns = [
    { title: '报关单号', dataIndex: 'ckbgdh', width: 220 },
    { title: '项号', dataIndex: 'xh4', width: 60 },
    { title: '银行账号', dataIndex: 'yhzh', width: 160 },
    { title: '商品代码', dataIndex: 'ckspDm', width: 95 },
    { title: '法定单位', dataIndex: 'dyjldwDm', width: 90 },
    { title: '第二单位', dataIndex: 'dejldwDm', width: 90 },
  ];

  const extraBtn = (
    <Segmented
      options={[
        { label: '全部代办', value: 'List', icon: <BarsOutlined /> },
        { label: '出口退税', value: 'Kanban', icon: <AppstoreOutlined /> },
      ]}
    />
  );

  const cardGrid = (
    <ProCard title="办理进度列表" extra={extraBtn} tooltip="办理进度提示" >
      <DDBaseGrid url="/hx/ty/crud/queryPager3" columns={columns} showSerialNumber />
    </ProCard>
  );

  const cardNumber1 = (
    <CardNumber
      title="待开出口发票报关单"
      link="去开票"
      right={{ num: 40400, unit: '条', label: '条数' }}
      icon={<CopyOutlined />}
    />
  );

  const cardNumber2 = (
    <CardNumber
      title="待回填出口发票"
      link="去回填"
      right={{ num: 17357, unit: '条', label: '条数' }}
      icon={<SnippetsOutlined />}
    />
  );

  const cardNumber3 = (
    <CardNumber
      title="待处理报关单"
      link="去处理"
      right={{ num: 39357, unit: '条', label: '条数' }}
      icon={<BarChartOutlined />}
    />
  );

  const cardNumber4 = (
    <CardNumber
      title="待处理代理证明"
      link="去处理"
      right={{ num: 53038, unit: '条' }}
      icon={<PieChartOutlined />}
    />
  );

  const cardNumber5 = (
    <CardNumber
      title="可使用报关单"
      link="去配单"
      right={{ num: 5612, label: '条数' }}
      icon={<AreaChartOutlined />}
    />
  );

  const cardNumber6 = (
    <CardNumber
      title="待回填出口发票"
      link="去回填"
      right={{ num: 1157, unit: '条', label: '条数', format: '0,0.0' }}
      left={{ num: 3389, unit: '美元', label: '出口额', format: '0,0.00' }}
    />
  );

  const cardQuickMenu = () => {
    const menus: any = [
      { name: '出口货物劳务免退税申报', icon: <FileDoneOutlined /> },
      { name: '导入模板开具', icon: <FileProtectOutlined /> },
      { name: '外贸企业外购服务免退税申报', icon: <ContainerOutlined /> },
      { name: '退税汇率管理', icon: <CopyOutlined /> },
      { name: '外贸企业调整申报', icon: <SnippetsOutlined /> },
      { name: '出口货物劳务免退税申报', icon: <FileDoneOutlined /> },
      { name: '发票配置管理', icon: <FileProtectOutlined /> },
      { name: '导入模板开具', icon: <BarsOutlined /> },
    ];
    return <QuickMenu menus={menus}/>
  };

  const sideMenu = () => {
    let menus = [
      { name: '数据管理', path: '#' },
      { name: '出口发票管理', path: '#' },
      { name: '退税申报', path: '#' },
      { name: '备案单证', path: '#' },
      { name: '代办退税申报', path: '#' },
      { name: '进料加工核销', path: '#' },
      { name: '其他退（免）税', path: '#' },
      { name: '统计分析', path: '#' },
      { name: '风险管理', path: '#' },
    ];
    return <SideMenu menus={menus} title="出口退税管理"/>
  }

  const sideMenu2 = () => {
    let menus = [
      { name: '销项发票管理', path: '#' },
      { name: '进项发票管理', path: '#' },
      { name: '报销管理', path: '#' },
      { name: '企业票池', path: '#' },
      { name: '开票协同', path: '#' },
    ];
    return <SideMenu menus={menus} title="发票管理"/>
  }

  const cardUserInfo = () => {
    const enterprise = {
      hgqyDm: '20210706SC',
      nsrsbh: '998673E7861GCH0002',
      shxydm: '998673E7861GCH0002',
      cktsqylxDm: '生产企业',
    };
    return <Enterprise enterprise={enterprise} title="本地测试用户" cornerTag="四类"/>
  }

  return (
    <div className="workspace workspace-center">
      <DndContext
        onDragStart={() => setIsDragging(true)}
        onDragEnd={({over}) => {
          setParent(over ? over.id : null);
          setIsDragging(false);
        }}
        onDragCancel={() => setIsDragging(false)}
      >
        {/* <div>
          {parent === null ? <DraggableItem /> : null}
          <Droppable key='A' id='A' dragging={isDragging}>
            {parent === 'A' ? <DraggableItem /> : null}
          </Droppable>
          <Droppable key='B' id='B' dragging={isDragging}>
            {parent === 'B' ? <DraggableItem /> : null}
          </Droppable>
        </div> */}
        <div>
          <Droppable key='A' id='A' dragging={isDragging1}>
            <Draggable2 dragging={isDragging1} ref={setNodeRef1} listeners={listeners1} style={{ opacity: isDragging1 ? 0 : undefined, }} >
              123
            </Draggable2>
          </Droppable>
          <Droppable key='B' id='B' dragging={isDragging}>
            <Draggable2 dragging={isDragging2} ref={setNodeRef2} listeners={listeners2} style={{ opacity: isDragging2 ? 0 : undefined, }} >
              456
            </Draggable2>
          </Droppable>
        </div>
        <DraggableOverlay />
      </DndContext>
      {/* <Row gutter={[20, 20]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={17} xxl={17}>
          <Row gutter={[20, 20]}>
            <Col xs={24}>{cardGrid}</Col>
            <Col xs={24}> <GroupCardTitle title="出口退税申报" link="设置"/> </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8} xxl={8}>{cardNumber1}</Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8} xxl={8}>{cardNumber2}</Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8} xxl={8}>{cardNumber3}</Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8} xxl={8}>{cardNumber4}</Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8} xxl={8}>{cardNumber5}</Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8} xxl={8}>{cardNumber6}</Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>{cardQuickMenu()}</Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={7} xxl={7}>
          <Row gutter={[20, 20]}>
            <Col xs={24}>{cardUserInfo()}</Col>
            <Col xs={24}>{sideMenu()}</Col>
            <Col xs={24}>{sideMenu2()}</Col>
          </Row>
        </Col>
      </Row> */}
    </div>
  );
};

export default Alert;
