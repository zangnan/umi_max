import React, { useState, useEffect } from 'react';
import ProCard from '@ant-design/pro-card';
import { Space, Popover, Row, Col } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { history, useAccess } from 'umi';
import './style.less';

const testData = [
  {
    name: '开发示例', routes: [
      {
        name: '表格', routes: [
          { name: '后端查询-有分页', path: '/example/table/base01' },
          { name: '后端查询-无分页', path: '/example/table/base02' },
          { name: '传入数据-有分页', path: '/example/table/base03' },
          { name: '传入数据-无分页', path: '/example/table/base04' },
          { name: '测验用', path: '/example/table/base10' },
          { name: '可编辑表格1', path: '/example/table/base05' },
          { name: '可编辑表格2', path: '/example/table/base06' },
          { name: '可编辑表格3', path: '/example/table/base07' },
          { name: '拼装表格', path: '/example/table/base05' },
        ]
      },
      {
        name: '表单', routes: [
          { name: '封装表单页', path: '/example/form/base01' },
          { name: '可编辑列表式表单', path: '/example/form/base02' },
        ]
      },
      {
        name: '数据封装页面', routes: [
          { name: '列表', path: '/example/data_page/list' },
          { name: '列表2', path: '/example/data_page/list2' },
          { name: '列表3', path: '/example/data_page/list3' },
          { name: '台账', path: '/example/data_page/tz' },
          { name: '智能配单（实例）', path: '/example/data_page/znpd' },
        ]
      },
      {
        name: '数据管理', routes: [
          { name: '数据管理01', path: '/example/data_manager/data_flow_01' },
          { name: '数据管理02', path: '/example/data_manager/data_flow_02' },
        ]
      },
      {
        name: '请求', routes: [
          { name: '01 默认请求', path: '/example/request/request01' },
          { name: '02 手动触发', path: '/example/request/request02' },
          { name: '03 轮询', path: '/example/request/request03' },
          { name: '04 并行请求', path: '/example/request/request04' },
          { name: '05 防抖', path: '/example/request/request05' },
          { name: '06 节流', path: '/example/request/request06' },
          { name: '07 缓存 & SWR', path: '/example/request/request07' },
          { name: '08 预加载', path: '/example/request/request08' },
          { name: '09 屏幕聚焦重新请求', path: '/example/request/request09' },
          { name: '10 突变', path: '/example/request/request10' },
          { name: '11 Loading Delay', path: '/example/request/request11' },
          { name: '12 refreshDeps', path: '/example/request/request12' },
        ]
      },
      {
        name: '布局', routes: [
          { name: '左&右1', path: '/example/layout/layout01' },
          { name: '左&右2', path: '/example/layout/layout04' },
          { name: '左&右（上下）', path: '/example/layout/layout02' },
          { name: '左&右（上下）', path: '/example/layout/layout05' },
          { name: '上下', path: '/example/layout/layout03' },
          { name: '上下&右拖动1', path: '/example/layout/layout06' },
          { name: '左&右td拖动1', path: '/example/layout/layout07' },
          { name: '左&右(上下)td拖动', path: '/example/layout/layout08' },
        ]
      },
      {
        name: '图表', routes: [
          { name: '报关单', path: '/example/chart/bgd' },
        ]
      },
      {
        name: '其他', routes: [
          { name: '磁贴主页', path: '/example/other/tile' },
          { name: 'PDF', path: '/example/other/pdf' },
          { name: '弹窗', path: '/example/other/alert' },
          { name: '发票', path: '/example/other/docs/invoice' },
          { name: '标题菜单', path: '/example/other/menu/header_menu' },
        ]
      },
      {
        name: '示例-产品', routes: [
          { name: '数据下载', path: '/example/pro/sjxz' },
          { name: '出口明细申报表', path: '/example/pro/unit1' },
          { name: '航天发射业务免退税申报明细表', path: '/example/pro/unit2' },
          { name: '退税流程', path: '/example/pro/step', key: 'example_pro_step' },
          { name: '工作台', path: '/example/pro/workplace' },
          { name: '退税申报', path: '/example/pro/scsbsj' },
          { name: '申报结果查询', path: '/example/pro/sbsjcx' },
          { name: 'tab模板', path: '/example/pro/tab', key: 'example_pro_tab' },
          { name: '图标导航模板', path: '/example/pro/icon_nav' },
        ]
      },
      { name: '测试' },
    ]
  },
];

export interface DDHeaderMenuProps {
  data?: any;
}

const HeaderMenu: React.FC<DDHeaderMenuProps> = ({
  // data = testData,
  data = [],
}) => {
  const access = useAccess(); // 权限

  const [visible, setVisible] = useState<any>(false);
  const [menu, setMenu] = useState<any>([]);
  const [menuC1, setMenuC1] = useState<any>(data[0] || {});
  const [menuC2, setMenuC2] = useState<any>(data[0]?.routes || []);

  const handleVisibleChange = (v: any) => {
    setVisible(v);
  };

  useEffect(() => {
    const headerMenu: any = [];
    data.forEach((item: any) => {
      if (item.type === 'title1' && !item.headerMenuShow) {
        const subMenu = item.submenu;
        const routes: any = [];
        subMenu.forEach((temp: any) => {
          // 将隐藏菜单、头菜单不显示排除（隐藏菜单用于切换）
          if (!temp.hideInMenu && temp.heardShowFlag != false && !(temp.access && access[temp.access === 'sldz' ? 'isNsrsbh' : ''])) {
            routes.push({ name: temp.name, path: temp.path });
          }
        });
        headerMenu.push({ name: item.name, routes: routes })
      }
    });
    // setMenu(process?.env?.NODE_ENV === 'development' ? headerMenu.concat(testData) : headerMenu);
    setMenu(headerMenu);
    setMenuC1(headerMenu[0] || {});
    setMenuC2(headerMenu[0]?.routes || []);
  }, [])

  // 点击一级菜单
  const setMenu123 = (c1: any, e: any) => {
    setMenuC1(c1);
    setMenuC2(c1?.routes ? [...c1?.routes] : []);
    // 增加选中样式
    const hmwC1Title: any = document.querySelectorAll(".hmw_left .hmw_c1_title");
    hmwC1Title.forEach((item: any) => {
      item?.classList.remove('selected');
    })
    e.target.classList.add('selected');
  }

  // 点击二级菜单
  const clickMenu2 = (item: any) => {
    if (item.path) {
      setVisible(false);
      history.push(item.path);
    }
  }

  // 点击三级菜单
  const clickMenu3 = (item: any) => {
    if (item.path) {
      setVisible(false);
      history.push(item.path);
    }
  }

  // 一级菜单
  const getMenuC1 = () => {
    const groups: any = [];
    menu.forEach((item: any, index: number) => {
      groups.push(
        <div key={index.toString()} className="hmw_c1_title" onClick={(e: any) => { setMenu123(item, e) }}>{item.name}</div>
      );
    });
    return <div className="hmw_c1">
      {groups}
    </div>
  }

  // 二级菜单
  const getMenuC2 = () => {
    const groups: any = [];
    menuC2?.map((item: any, index: number) => {
      groups.push(<Col span={8} key={index.toString()}>
        <div className={`hmw_c2_title ${item.path ? '' : 'nopath'}`} onClick={() => { clickMenu2(item) }}> {item.name} </div>
        {item.routes && <div className="hmw_c3">
          {getMenuC3(item.routes)}
        </div>}
      </Col>);
    });
    return <div className="hmw_c2">
      <div className="hmw_c1_title">{menuC1?.name}</div>
      <Row>{groups}</Row>
    </div>
  }

  // 三级菜单
  const getMenuC3 = (c3: any) => {
    const groups: any = [];
    c3?.map((item: any, index: number) => {
      groups.push(
        <Space size={[10, 10]} wrap key={index.toString()}>
          <div className={`hmw_c3_title ${item.path ? '' : 'nopath'}`} onClick={() => { clickMenu3(item) }}>{item.name}</div>
        </Space>
      );
    });
    return <div>
      {groups}
    </div>
  }

  // 菜单内容
  const content = (
    <div className="dd_header_float_menu" style={{ width: "900px" }}>
      <ProCard split='vertical' className="header_menu_wrap">
        <ProCard colSpan="180px" className="hmw_left">
          {getMenuC1()}
        </ProCard>
        <ProCard className="hmw_right">
          {getMenuC2()}
        </ProCard>
      </ProCard>
    </div>
  );

  return (
    <>
      <Popover
        content={content}
        title="应用程序"
        placement="bottomLeft"
        overlayClassName="dd_header_float_menu_wrap"
        trigger="click"
        visible={visible}
        onVisibleChange={handleVisibleChange}
      >
        <span className="dd_header_float_menu_icon">
          <CaretDownOutlined style={{ fontSize: '14px', marginLeft: '5px' }} />
        </span>
      </Popover>
    </>
  );
};

export default HeaderMenu;
