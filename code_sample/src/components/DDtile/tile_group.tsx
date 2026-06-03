/**
 * title: 磁贴主页
 */
import React from 'react';
import DDTile from '@/components/DDtile/tile';
import { Progress, RingProgress } from '@ant-design/charts';
import { BarChartOutlined, AuditOutlined, ControlOutlined } from '@ant-design/icons';
import { Space, Menu, Affix } from 'antd';
import { TinyLine, TinyArea, TinyColumn } from '@ant-design/charts';
import './style.less';

const config1 = {
  height: 60,
  autoFit: false,
  data: [
    264, 417, 438, 887, 309, 397, 550, 575, 563, 430, 525, 592, 492, 467, 513, 546, 983, 340, 539,
    243, 226, 192,
  ],
  smooth: true,
  tooltip: false,
  annotations: [
    {
      type: 'line',
      start: ['min', 'mean'],
      end: ['max', 'mean'],
      text: {
        content: '平均值',
        offsetY: -2,
        style: {
          textAlign: 'left',
          fontSize: 10,
          fill: 'rgba(44, 53, 66, 0.45)',
          textBaseline: 'bottom',
        },
      },
      style: { stroke: 'rgba(0, 0, 0, 0.25)' },
    },
    {
      type: 'line',
      start: ['min', 800],
      end: ['max', 800],
      text: {
        content: '目标值',
        offsetY: -2,
        style: {
          textAlign: 'left',
          fontSize: 10,
          fill: 'rgba(44, 53, 66, 0.45)',
          textBaseline: 'bottom',
        },
      },
      style: { stroke: 'rgba(0, 0, 0, 0.55)' },
    },
  ],
};

const config2 = {
  height: 60,
  autoFit: false,
  data: [
    264, 417, 438, 887, 309, 397, 550, 575, 563, 430, 525, 592, 492, 467, 513, 546, 983, 340, 539,
    243, 226, 192,
  ],
  smooth: true,
  areaStyle: { fill: '#d6e3fd' },
};

const config3 = {
  height: 64,
  autoFit: false,
  data: [274, 337, 81, 497, 666, 219, 269],
  tooltip: {
    customContent: function customContent(x, data) {
      let _data$, _data$$data;
      return 'NO.'
        .concat(x, ': ')
        .concat(
          (_data$ = data[0]) === null || _data$ === void 0
            ? void 0
            : (_data$$data = _data$.data) === null || _data$$data === void 0
            ? void 0
            : _data$$data.y.toFixed(2),
        );
    },
  },
};

const config4 = {
  height: 20,
  autoFit: false,
  percent: 0.536,
  barWidthRatio: 0.8,
  color: ['#F4664A', '#E8EDF3'],
  annotations: [
    {
      type: 'line',
      start: ['80%', '0%'],
      end: ['80%', '100%'],
      style: {
        stroke: '#f00',
        lineWidth: 2,
      },
    },
  ],
};

const config5 = {
  autoFit: true,
  height: 60,
  width: 60,
  percent: 0.7,
  color: ['#5B8FF9', '#E8EDF3'],
};

const tileData1 = {
  titel_main: '自定义磁贴A',
  titel_sub: '副标题一',
  desc: { info: '我的代办', color: 1, },
  icon: <BarChartOutlined />,
  content: { number: 114, unit: 'K', align: 'right', color: 3, },
  route: '/404',
}

const tileData2 = {
  titel_main: '自定义磁贴B',
  titel_sub: '副标题二',
  desc: { info: '我的收藏', color: 2, },
  icon: <AuditOutlined />,
  content: { number: 19.3, unit: '%', align: 'right', color: 2, },
  route: '/404',
}

const tileData3 = {
  titel_main: '自定义磁贴C',
  titel_sub: '副标题三',
  desc: { info: 'Temp', color: 3, },
  icon: <ControlOutlined />,
  content: { number: 31.6, unit: '万', align: 'right', }
}

const tileData4 = {
  titel_main: '自定义磁贴D',
  titel_sub: '副标题四',
  desc: { info: '迷你折线图', color: 3, },
  content_customer: <TinyLine {...config1} />
}

const tileData5 = {
  titel_main: '自定义磁贴E',
  titel_sub: '副标题五',
  desc: { info: '迷你面积图', color: 3, },
  content_customer: <TinyArea {...config2} />
}

const tileData6 = {
  titel_main: '自定义磁贴F',
  titel_sub: '副标题六',
  desc: { info: '迷你柱状图', color: 3, },
  content_customer: <TinyColumn {...config3} />
}

const tileData7 = {
  titel_main: '自定义磁贴G',
  titel_sub: '副标题七',
  desc: { info: '进度条图', color: 3, },
  content_customer: <Progress {...config4} />
}

const tileData8 = {
  titel_main: '自定义磁贴H',
  titel_sub: '副标题八',
  desc: { info: '迷你进度环图', color: 3, },
  content_customer: <RingProgress {...config5} />
}

const testData = [
  { type: 'title1', key: "title1", content: '数据管理测试数据测试数据1' },
  { type: 'title2', content: '数据下载' },
  { type: 'tile', content: [
    tileData1,
    tileData2,
    tileData3,
    tileData4,
    tileData5,
    tileData6,
    tileData7,
    tileData8,
  ] },
  { type: 'title2', content: '数据管理测试数据测试数据' },
  { type: 'tile', content: [
    tileData1,
    tileData2,
    tileData3,
  ] },
  { type: 'title1', key: "title2", content: '数据管理测试数据测试数据2' },
  { type: 'tile', content: [
    tileData1,
    tileData2,
    tileData3,
  ] },
  { type: 'title1', key: "title3", content: '数据管理测试数据测试数据3' },
  { type: 'tile', content: [
    tileData3,
  ] },
  { type: 'title1', key: "title4", content: '数据管理测试数据测试数据4' },
  { type: 'tile', content: [
    tileData2,
  ] },
  { type: 'title1', key: "title5", content: '数据管理测试数据测试数据5' },
  { type: 'tile', content: [
    tileData1,
  ] },
  { type: 'title1', key: "title6", content: '数据管理测试数据测试数据6' },
  { type: 'tile', content: [
    tileData3,
  ] },
  { type: 'title1', key: "title7", content: '数据管理测试数据测试数据7' },
  { type: 'tile', content: [
    tileData2,
  ] },
  { type: 'title1', key: "title8", content: '数据管理测试数据测试数据8' },
  { type: 'tile', content: [
    tileData1,
  ] },
  { type: 'title1', key: "title9", content: '数据管理测试数据测试数据9' },
  { type: 'tile', content: [
    tileData3,
  ] },
  { type: 'title1', key: "title10", content: '数据管理测试数据测试数据10' },
  { type: 'tile', content: [
    tileData2,
  ] },
  { type: 'title1', key: "title11", content: '数据管理测试数据测试数据11' },
  { type: 'tile', content: [
    tileData1,
  ] },
];

export interface DDTileGroupProps {
  data?: any;
}

const TileGroup: React.FC<DDTileGroupProps> = ({
  data = testData,
}) => {

  const getTile = (group: any) => {
    const tileTag: any = [];
    group.forEach((row: any, index: number) => {
      tileTag.push(<DDTile key={index.toString()} data={row} />);
    });
    return tileTag;
  }

  const tileGruop = (d: any) => {
    const groups: any = [];
    d.forEach((group: any, index: number) => {
      if (group.type === 'title1') {
        groups.push(<div key={index.toString()} id={group.key} className="group_tile_c1">{group.content}</div>);
      } else if (group.type === 'title2') {
        groups.push(<div key={index.toString()} className="group_tile_c2">{group.content}</div>);
      } else if (group.type === 'tile') {
        groups.push(<Space key={index.toString()} size={[10, 10]} wrap className="tile_group">
          {getTile(group.content)}
        </Space>);
      }
    });
    return <div className="tile_group_content_nav">{groups}</div>
  }

  const header = (d: any) => {
    const item: any = [];
    d.forEach((tmp: any) => {
      if (tmp.type === 'title1') {
        item.push(<Menu.Item key={tmp.content} onClick={() => {jump(tmp.key)}}>
          <a>{tmp.content}</a>
        </Menu.Item>)
      }
    })
    return <>
      <div className="tile_group_header_nav">
        {/* <Affix offsetTop={PRO_TYPE === 'xt' ? 0 : 44}> */}
          <Menu mode="horizontal">
            {item}
          </Menu>
        {/* </Affix> */}
      </div>
    </>
  }

  const jump = (key: any) => {
    const targetObj: any= document.querySelector('#' + key);
    document.documentElement.scrollTop = (targetObj).offsetTop - 40;
  }

  return (
    <div className="tile_group_wrap">
      {header(data)}
      {tileGruop(data)}
    </div>
  );
};

export default TileGroup;