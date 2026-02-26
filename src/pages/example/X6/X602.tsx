import React, { useRef, useEffect } from 'react';
import { Graph } from '@antv/x6';

let xlinkHref1 = 'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*pwLpRr7QPGwAAAAAAAAAAAAAARQnAQ';
let data: any = [
  { id: '1', shape: 'event', width: 40, height: 40, position: { x: 50, y: 180 }, label: '开始' },
  { id: '2', shape: 'activity', width: 100, height: 60, position: { x: 20, y: 280 }, label: '请假申请' },
  { id: '3', shape: 'bpmn-edge', source: '1', target: '2' },
  { id: '4', shape: 'gateway', width: 55, height: 55, position: { x: 170, y: 282.5 } },
  { id: '5', shape: 'bpmn-edge', source: '2', target: '4' },
  { id: '6', shape: 'activity', width: 100, height: 60, position: { x: 300, y: 240 }, label: '领导审批' },
  { id: '7', shape: 'activity', width: 100, height: 60, position: { x: 300, y: 320 }, label: '人事审批' },
  { id: '8', shape: 'bpmn-edge', source: '4', target: '6' },
  { id: '9', shape: 'bpmn-edge', source: '4', target: '7' },
  { id: '10', shape: 'gateway', width: 55, height: 55, position: { x: 460, y: 282.5 } },
  { id: '11', shape: 'bpmn-edge', source: '6', target: '10' },
  { id: '12', shape: 'bpmn-edge', source: '7', target: '10' },
  { id: '13', shape: 'activity', width: 100, height: 60, position: { x: 560, y: 280 }, label: '人事审批' },
  { id: '14', shape: 'bpmn-edge', source: '10', target: '13' },
  { id: '15', shape: 'event', width: 40, height: 40, position: { x: 710, y: 290 }, attrs: { body: { strokeWidth: 4 } }, label: '结束' },
  { id: "16", shape: "bpmn-edge", source: "13", target: "15" }
];

Graph.registerNode(
  'event',
  {
    inherit: 'circle',
    attrs: {
      body: { strokeWidth: 2, stroke: '#5F95FF', fill: '#FFF', },
    },
  },
  true,
)

Graph.registerNode(
  'activity',
  {
    inherit: 'rect',
    markup: [
      { tagName: 'rect', selector: 'body' },
      { tagName: 'image', selector: 'img' },
      { tagName: 'text', selector: 'label' },
    ],
    attrs: {
      body: { rx: 6, ry: 6, stroke: '#5F95FF', fill: '#EFF4FF', strokeWidth: 1, },
      img: { x: 6, y: 6, width: 16, height: 16, 'xlink:href': xlinkHref1, },
      label: { fontSize: 12, fill: '#262626', },
    },
  },
  true,
)

Graph.registerNode(
  'gateway',
  {
    inherit: 'polygon',
    attrs: {
      body: { refPoints: '0,10 10,0 20,10 10,20', strokeWidth: 2, stroke: '#5F95FF', fill: '#EFF4FF', },
      label: { text: '+', fontSize: 40, fill: '#5F95FF', },
    },
  },
  true,
)

Graph.registerEdge(
  'bpmn-edge',
  {
    inherit: 'edge',
    attrs: {
      line: { stroke: '#A2B1C3', strokeWidth: 2, },
    },
  },
  true,
)

const Report01: React.FC<unknown> = () => {
  const containerRef: any = useRef(null);

  let graph: any;

  useEffect(() => {
    if (containerRef.current) {
      // 初始化画布
      graph = new Graph({
        container: containerRef.current,
        width: 800,
        height: 600,
        grid: true,
        background: { color: '#f5f5f5' },
        connecting: {
          router: 'orth',
        },
      });
      graph.fromJSON(data); // 渲染元素
      const cells: any = []
      data.forEach((item: any) => {
        if (item.shape === 'bpmn-edge') {
          cells.push(graph.createEdge(item))
        } else {
          cells.push(graph.createNode(item))
        }
      })
      graph.resetCells(cells)
      graph.zoomToFit({ padding: 10, maxScale: 1 })
    }
  }, []);

  return (<>
    <div className="react-shape-app">
      <div className="app-content" ref={containerRef} />
    </div>
  </>);
};

export default Report01;
