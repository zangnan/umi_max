import React, { useRef, useEffect } from 'react';
import {
  Graph,
  Node,
  Color,
  Snapline,
  History,
  Selection,
} from '@antv/x6';
import { register } from '@antv/x6-react-shape';
import { Dropdown, Button, Space } from 'antd';

Graph.registerNode(
  'custom-node',
  {
    inherit: 'rect', // 继承于 rect 节点
    width: 100,
    height: 40,
    markup: [
      { tagName: 'rect', selector: 'body', },// tagName 标签名称selector选择器
      { tagName: 'image', selector: 'img', },
      { tagName: 'text', selector: 'label', },
    ],
    attrs: {
      body: { stroke: '#8f8f8f', strokeWidth: 1, fill: '#fff', rx: 6, ry: 6, },
      img: { 'xlink:href': 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png', width: 16, height: 16, x: 12, y: 12, },
    },
  },
  true,
)

const CustomComponent = ({ node }: { node: Node }) => {
  const label: any = node.prop('label')
  return (
    <Dropdown trigger={['contextMenu']} menu={{items: [
      { key: 'copy', label: '复制' },
      { key: 'paste', label: '粘贴' },
      { key: 'delete', label: '删除' },
    ]}} >
      <div className="custom-react-node">{label}</div>
    </Dropdown>
  )
}

const path01: any = 'M24.85,10.126c2.018-4.783,6.628-8.125,11.99-8.125c7.223,0,12.425,6.179,13.079,13.543c0,0,0.353,1.828-0.424,5.119c-1.058,4.482-3.545,8.464-6.898,11.503L24.85,48L7.402,32.165c-3.353-3.038-5.84-7.021-6.898-11.503c-0.777-3.291-0.424-5.119-0.424-5.119C0.734,8.179,5.936,2,13.159,2C18.522,2,22.832,5.343,24.85,10.126z';
const commonAttrs: any = {
  body: { fill: '#fff', stroke: '#8f8f8f', strokeWidth: 1, },
  label: { refX: 0.5, refY: '100%', refY2: 4, textAnchor: 'middle', textVerticalAnchor: 'top', },
}

register({ shape: 'custom-react-node', width: 100, height: 40, component: CustomComponent, })

const data = {
  nodes: [
    { id: 'node1', shape: 'custom-react-node', x: 40, y: 40, label: 'hello', },
    { id: 'node2', shape: 'custom-react-node', x: 160, y: 180, label: 'world', },
  ],
  edges: [
    { shape: 'edge', source: 'node1', target: 'node2', label: 'x6', attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1, }, }, },
  ],
}
// const data: any = {
//   nodes: [
//     {id:'node1',shape:'rect',x:40,y:40,width:100,height:40,label:'hello',attrs:{body:{stroke:'#8f8f8f',strokeWidth:1,fill:'#fff',rx:6,ry:6}}},
//     {id:'node2',shape:'rect',x:160,y:180,width:100,height:40,label:'world',attrs:{body:{stroke:'#8f8f8f',strokeWidth:1,fill:'#fff',rx:6,ry:6}}},
//   ],
//   edges: [
//     {shape:'edge',source:'node1',target:'node2',label:'x6',attrs:{line:{stroke:'#8f8f8f',strokeWidth:1}}},
//   ],
// }

const Report01: React.FC<unknown> = () => {
  const containerRef: any = useRef(null);
  const graphRef: any = useRef(null);

  let graph: any;

  useEffect(() => {
    if (containerRef.current) {
      // 初始化画布
      graph = new Graph({
        container: containerRef.current,
        width: 800,
        height: 600,
        grid: true,
        panning: true,
        mousewheel: true,
        // autoResize: true,
        background: { color: '#f5f5f5' },
      });
      // 启用历史记录插件
      graph.use(new History({ enabled: true }));

      // 启用框选插件
      // graph.use(new Selection({ enabled: true, rubberband: true, }));

      graph.fromJSON(data); // 渲染元素

      graph.addNode({ shape: 'rect', x: 40, y: 40, width: 80, height: 40, label: 'rect', attrs: commonAttrs });
      graph.addNode({ shape: 'circle', x: 180, y: 40, width: 40, height: 40, label: 'circle', attrs: commonAttrs });
      graph.addNode({ shape: 'ellipse', x: 280, y: 40, width: 80, height: 40, label: 'ellipse', attrs: commonAttrs });
      graph.addNode({ shape: 'path', x: 420, y: 40, width: 40, path: path01, attrs: commonAttrs, label: 'path' });
      graph.addNode({ shape: 'polygon', x: 60, y: 150, width: 40, height: 40, points: '100,10 40,198 190,78 10,78 160,198', attrs: commonAttrs, label: 'polygon' });
      graph.addNode({ shape: 'polyline', x: 180, y: 150, width: 40, height: 40, label: 'polyline', attrs: { body: { ...commonAttrs.body, refPoints: '0,0 0,10 10,10 10,0', }, label: commonAttrs.label } });
      graph.addNode({ shape: 'image', x: 290, y: 150, width: 60, height: 40, imageUrl: 'https://gw.alipayobjects.com/os/s/prod/antv/assets/image/logo-with-text-73b8a.svg', label: 'image', attrs: commonAttrs });

      // 可以直接使用上面注册过的 shape
      const source = graph.addNode({ shape: 'custom-node', x: 40, y: 40, label: 'hello' });
      const target = graph.addNode({ shape: 'custom-node', x: 160, y: 180, label: 'world' });
      graph.addEdge({ source, target, attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1, }, }, })

      graph.centerContent(); // 居中显示
      graph.use( new Snapline({ enabled: true, }), )
      graphRef.current = graph;
    }
  }, []);
  const commands = [
    { key: 'zoomIn', label: 'ZoomIn(0.2)' },
    { key: 'zoomOut', label: 'ZoomOut(-0.2)' },
    { key: 'zoomTo', label: 'ZoomTo(1)' },
    { key: 'zoomToFit', label: 'ZoomToFit' },
    { key: 'centerContent', label: 'CenterContent' },
  ];
  const commands2 = [
    { key: 'prop', label: 'prop' },
    { key: 'attr', label: 'attr' },
  ]
  // graphToJSON
  const graphToJSON = () => {
    let aa: any = graph.toJSON();
    console.info(aa);
  };
  // 添加撤销/重做功能
  const handleUndo = () => graphRef.current.undo();
  const handleRedo = () => graphRef.current.redo();
  // 缩放
  let transform: any = (command: string) => {
    switch (command) {
      case 'translate':
        graph.translate(20, 20)
        break
      case 'zoomIn':
        graph.zoom(0.2)
        break
      case 'zoomOut':
        graph.zoom(-0.2)
        break
      case 'zoomTo':
        graph.zoomTo(1)
        break
      case 'zoomToFit':
        graph.zoomToFit()
        break
      case 'centerContent':
        graph.centerContent()
        break
      default:
        break
    }
  }

  let change: any = (command: string) => {
    const nodes = graph.getNodes()
    switch (command) {
      case 'prop':
        nodes.forEach((node: any) => {
          const width = 100 + Math.floor(Math.random() * 50)
          const height = 40 + Math.floor(Math.random() * 10)
          node.prop('size', { width, height })
        })
        break
      case 'attr':
        nodes.forEach((node: any) => {
          const color = Color.randomHex()
          node.attr('body/fill', color)
        })
        break
      default:
        break
    }
  }

  return (<>
    <Space style={{ marginBottom: 16 }}>
      <Button onClick={graphToJSON}>graphToJSON</Button>
      <Button onClick={handleUndo}>撤销</Button>
      <Button onClick={handleRedo}>重做</Button>
      <Button.Group>
        {commands.map((item) => (
          <Button onClick={() => transform(item.key)} key={item.key}>{item.label}</Button>
        ))}
      </Button.Group>
      <Button.Group>
        {commands2.map((item) => (
          <Button onClick={() => change(item.key)} key={item.key}>{item.label}</Button>
        ))}
      </Button.Group>
    </Space>
    <div className="react-shape-app">
      <div className="app-content" ref={containerRef} />
    </div>
    {/* <div className="use-plugin-app">
      <div ref={containerRef} style={{ border: '1px solid #d9d9d9', borderRadius: 4, overflow: 'hidden' }} />
    </div> */}
  </>);
};

export default Report01;
