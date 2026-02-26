import { Shape } from '@antv/x6';
import { Stencil } from '@antv/x6-plugin-stencil';
import { Transform } from '@antv/x6-plugin-transform';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Clipboard } from '@antv/x6-plugin-clipboard';
import { History } from '@antv/x6-plugin-history';
import { register } from '@antv/x6-react-shape';
import { SettingOutlined, CaretRightOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import './index.less';

const X6Util: any = {};

// #region 连接桩
// 连接桩属性 attrs
const portsCommonAttrs: any = {
  circle: {
    r: 4,
    magnet: true,
    stroke: '#5F95FF',
    strokeWidth: 1,
    fill: '#fff',
    style: { visibility: 'hidden', },
  },
};
// 连接桩通用配置
const ports = {
  groups: {
    top: { position: 'top', attrs: portsCommonAttrs },
    right: { position: 'right', attrs: portsCommonAttrs },
    bottom: { position: 'bottom', attrs: portsCommonAttrs },
    left: { position: 'left', attrs: portsCommonAttrs },
  },
  items: [
    { group: 'top', },
    { group: 'right', },
    { group: 'bottom', },
    { group: 'left', },
  ],
};
// 连接桩鼠标事件
X6Util.bindMouseAction = (graph: any, viewFlag: any) => {
  const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
    for (let i = 0, len = ports.length; i < len; i += 1) {
      ports[i].style.visibility = show ? 'visible' : 'hidden';
    }
  }
  if (viewFlag !== 'readonly') {
    graph.on('node:mouseenter', () => {
      const container = document.getElementById('app-content')!;
      const ports = container.querySelectorAll( '.x6-port-body', ) as NodeListOf<SVGElement>;
      console.info(ports)
      showPorts(ports, true);
    })
    graph.on('node:mouseleave', () => {
      const container = document.getElementById('app-content')!;
      const ports = container.querySelectorAll( '.x6-port-body', ) as NodeListOf<SVGElement>;
      showPorts(ports, false);
    })
  }
}
// #endregion

// #region 注册节点
const NodeComponent1: any = ({ node }: any) => {
  const { fi_name='过程', fi_type, fi_type_name } = node.getData();
  return (<>
    <div className='d_cus_node d_event'>
      <div className='d_cus_node_icon'><SettingOutlined /></div>
      <div className='d_cus_node_text'>{fi_name}</div>
    </div>
  </>)
}

const NodeComponent2: any = ({ node }: any) => {
  const { fi_name='开始', position='left' } = node.getData();
  let nodeStart: any;
  if (position === 'left') {
    nodeStart = <>
    <div className='d_cus_node d_start'>
      <div className='d_cus_node_icon'><CaretRightOutlined /></div>
      <div className='d_cus_node_text'>{fi_name}</div>
    </div>
  </>;
  } else {
    nodeStart = <>
    <div className='d_cus_node d_start_right'>
      <div className='d_cus_node_icon'><CaretRightOutlined /></div>
    </div>
  </>;
  }
  return nodeStart;
}

const NodeComponent5: any = ({ node }: any) => {
  const { fi_name='结束', position='left' } = node.getData();
  let nodeStart: any;
  if (position === 'left') {
    nodeStart = <>
    <div className='d_cus_node d_stop'>
      <div className='d_cus_node_icon'><span /></div>
      <div className='d_cus_node_text'>{fi_name}</div>
    </div>
  </>;
  } else {
    nodeStart = <>
      <div className='d_cus_node d_stop d_stop_right'>
        <div className='d_cus_node_icon'><span /></div>
      </div>
    </>;
  }
  return nodeStart;
}

const NodeComponent3: any = ({ node }: any) => {
  const { fi_name='并行网关', position='left' } = node.getData();
  let nodeGateway: any;
  if (position === 'left') {
    nodeGateway = <>
    <div className='d_cus_node d_gateway'>
      <div className='d_cus_node_icon'><CloseOutlined /></div>
      <div className='d_cus_node_text'>{fi_name}</div>
    </div>
  </>;
  } else {
    nodeGateway = <>
      <div className='d_cus_node d_gateway d_gateway_right'>
        <div className='d_cus_node_icon'><CloseOutlined /></div>
      </div>
    </>;
  }
  return nodeGateway;
}

const NodeComponent4: any = ({ node }: any) => {
  const { fi_name='排他网关', position='left' } = node.getData();
  let nodeGateway: any;
  if (position === 'left') {
    nodeGateway = <>
    <div className='d_cus_node d_gateway'>
      <div className='d_cus_node_icon'><PlusOutlined /></div>
      <div className='d_cus_node_text'>{fi_name}</div>
    </div>
  </>;
  } else {
    nodeGateway = <>
      <div className='d_cus_node d_gateway d_gateway_right'>
        <div className='d_cus_node_icon'><PlusOutlined /></div>
      </div>
    </>;
  }
  return nodeGateway;
}

const NodeComponent6: any = ({ node }: any) => {
  const { fi_name='包含网关', position='left' } = node.getData();
  let nodeGateway: any;
  if (position === 'left') {
    nodeGateway = <>
    <div className='d_cus_node d_gateway d_gateway_in'>
      <div className='d_cus_node_icon'><span /></div>
      <div className='d_cus_node_text'>{fi_name}</div>
    </div>
  </>;
  } else {
    nodeGateway = <>
      <div className='d_cus_node d_gateway d_gateway_in d_gateway_right'>
        <div className='d_cus_node_icon'><span /></div>
      </div>
    </>;
  }
  return nodeGateway;
}

let commonAttrs: any = {
  width: 120,
  height: 32,
  effect: ['data'],
  ports: { ...ports },
}

X6Util.registerNode = (graphObj: any) => {
  // react节点
  register({ ...commonAttrs, shape: 'custom_node_event', component: NodeComponent1 }); // 事件
  register({ ...commonAttrs, shape: 'custom_node_start', component: NodeComponent2 }); // 开始
  register({ ...commonAttrs, shape: 'custom_node_end', component: NodeComponent5 }); // 结束
  register({ ...commonAttrs, shape: 'custom_node_gateway_parallel', component: NodeComponent3 }); // 并行网关
  register({ ...commonAttrs, shape: 'custom_node_gateway_exclusive', component: NodeComponent4 }); // 排他网关
  register({ ...commonAttrs, shape: 'custom_node_gateway_inclusive', component: NodeComponent6 }); // 包含网关
  // custom-rect
  graphObj.registerNode(
    'custom-rect',
    {
      inherit: 'rect',
      width: 66,
      height: 36,
      attrs: {
        body: { strokeWidth: 1, stroke: '#5F95FF', fill: '#EFF4FF', },
        text: { fontSize: 12, fill: '#262626', },
      },
      ports: { ...ports },
    },
    true,
  )
  // custom-polygon
  graphObj.registerNode(
    'custom-polygon',
    {
      inherit: 'polygon',
      width: 66,
      height: 36,
      attrs: {
        body: { strokeWidth: 1, stroke: '#5F95FF', fill: '#EFF4FF', },
        text: { fontSize: 12, fill: '#262626', },
      },
      ports: {
        ...ports,
        // items: [
        //   { group: 'top', },
        //   { group: 'bottom', },
        // ],
      },
    },
    true,
  )
  // custom-circle
  graphObj.registerNode(
    'custom-circle',
    {
      inherit: 'circle',
      width: 45,
      height: 45,
      attrs: {
        body: { strokeWidth: 1, stroke: '#5F95FF', fill: '#EFF4FF', },
        text: { fontSize: 12, fill: '#262626', },
      },
      ports: { ...ports },
    },
    true,
  )
  // custom-image
  graphObj.registerNode(
    'custom-image',
    {
      inherit: 'rect',
      width: 52,
      height: 52,
      markup: [
        { tagName: 'rect', selector: 'body', },
        { tagName: 'image', },
        { tagName: 'text', selector: 'label', },
      ],
      attrs: {
        body: { stroke: '#5F95FF', fill: '#5F95FF', },
        image: { width: 26, height: 26, refX: 13, refY: 16, },
        label: { refX: 3, refY: 2, textAnchor: 'left', textVerticalAnchor: 'top', fontSize: 12, fill: '#fff', },
      },
      ports: { ...ports },
    },
    true,
  );
  // custom-gateway1
  graphObj.registerNode(
    'gateway1',
    {
      inherit: 'polygon',
      width: 36,
      height: 36,
      attrs: {
        body: {
          refPoints: '0,10 10,0 20,10 10,20',
          strokeWidth: 1,
          stroke: '#5F95FF',
          fill: '#EFF4FF',
        },
        label: {
          text: '+',
          fontSize: 32,
          fill: '#5F95FF',
        },
      },
      ports: { ...ports },
    },
    true,
  )
  // custom-gateway2
  graphObj.registerNode(
    'gateway2',
    {
      inherit: 'polygon',
      width: 36,
      height: 36,
      attrs: {
        body: {
          refPoints: '0,10 10,0 20,10 10,20',
          strokeWidth: 1,
          stroke: '#5F95FF',
          fill: '#EFF4FF',
        },
        label: {
          text: 'x',
          fontSize: 24,
          fill: '#5F95FF',
        },
      },
      ports: { ...ports },
    },
    true,
  )
}
// #endregion

// #region 画布属性
X6Util.INIT_CONFIG = {
  autoResize: true,
  grid: true,
  mousewheel: {
    enabled: true,
    zoomAtMousePosition: true,
    modifiers: 'ctrl',
    minScale: 0.5,
    maxScale: 3,
  },
  connecting: {
    router: 'manhattan',
    connector: {
      name: 'rounded',
      args: { radius: 8 },
    },
    anchor: 'center',
    connectionPoint: 'anchor',
    allowBlank: false,
    snap: { radius: 20 },
    createEdge() {
      return new Shape.Edge({
        attrs: {
          line: {
            stroke: '#A2B1C3',
            strokeWidth: 2,
            targetMarker: { name: 'block', width: 12, height: 8 }
          }
        },
        tools: ['edge-editor'],
        // tools: [X6Util.nodeTools.editor],
        zIndex: 0,
      })
    },
    validateConnection({ targetMagnet }: any) {
      return !!targetMagnet
    },
  },
  highlighting: {
    magnetAdsorbed: {
      name: 'stroke',
      args: {
        attrs: {
          fill: '#5F95FF',
          stroke: '#5F95FF',
        },
      },
    },
  },
};
// #endregion

// #region 初始化 stencil
X6Util.initStencil = (graph: any, stencilRef: any) => {
  const stencil = new Stencil({
      title: '组件库',
      target: graph,
      stencilGraphHeight: 0,
      collapsable: true,
      groups: [
        { title: '事件节点', name: 'group1' },
        { title: '网关节点', name: 'group2' },
      ],
      layoutOptions: { columns: 2, columnWidth: 130, rowHeight: 42, },
  });
  stencilRef.current.appendChild(stencil.container);
  const r1: any = graph.createNode({
    shape: 'custom-rect',
    label: '开始',
    attrs: { body: { rx: 20, ry: 26 }},
    tools: [X6Util.nodeTools.editor, X6Util.nodeTools.remove],
  })
  const r2: any = graph.createNode({
    shape: 'custom-rect',
    label: '过程',
    tools: [X6Util.nodeTools.editor, X6Util.nodeTools.remove],
  })
  const r3: any = graph.createNode({
    shape: 'custom-rect',
    attrs: { body: { rx: 6, ry: 6, }, },
    label: '可选过程',
    tools: [X6Util.nodeTools.editor, X6Util.nodeTools.remove],
  })
  const r4: any = graph.createNode({
    shape: 'custom-polygon',
    attrs: { body: { refPoints: '0,10 10,0 20,10 10,20', }, },
    label: '决策',
    tools: [X6Util.nodeTools.editor, X6Util.nodeTools.remove],
  })
  const r5: any = graph.createNode({
    shape: 'custom-polygon',
    attrs: { body: { refPoints: '10,0 40,0 30,20 0,20', }, },
    label: '数据',
    tools: [X6Util.nodeTools.editor, X6Util.nodeTools.remove],
  })
  const r6: any = graph.createNode({
    shape: 'custom-circle',
    label: '连接',
    tools: [X6Util.nodeTools.editor, X6Util.nodeTools.remove],
  })
  const r7: any = graph.createNode({
    shape: 'gateway1',
  })
  const r8: any = graph.createNode({
    shape: 'gateway2',
  })
  const r101: any = graph.createNode({
    shape: 'custom_node_event',
    tools: [
      // X6Util.nodeTools.editor,
      // X6Util.nodeTools.remove
    ],
    data: { fi_name: '过程', fi_type: '', fi_type_name: '', },
  })
  const r001: any = graph.createNode({
    shape: 'custom_node_start',
    tools: [
      // X6Util.nodeTools.editor,
      // X6Util.nodeTools.remove
    ],
    data: { fi_name: '开始' },
  })
  const r002: any = graph.createNode({
    shape: 'custom_node_end',
    tools: [
      // X6Util.nodeTools.editor,
      // X6Util.nodeTools.remove
    ],
    data: { fi_name: '结束' },
  })
  const r201: any = graph.createNode({
    shape: 'custom_node_gateway_parallel',
    tools: [
      // X6Util.nodeTools.editor,
      // X6Util.nodeTools.remove
    ],
    data: { fi_name: '并行网关' },
  })
  const r202: any = graph.createNode({
    shape: 'custom_node_gateway_exclusive',
    tools: [
      // X6Util.nodeTools.editor,
      // X6Util.nodeTools.remove
    ],
    data: { fi_name: '排他网关' },
  })
  const r203: any = graph.createNode({
    shape: 'custom_node_gateway_inclusive',
    tools: [
      // X6Util.nodeTools.editor,
      // X6Util.nodeTools.remove
    ],
    data: { fi_name: '包含网关' },
  })
  // stencil.load([ r1, r2, r3, r4, r5, r6, r7, r8 ], 'group1'); // 简单图形
  stencil.load([ r001, r002, r101 ], 'group1');
  stencil.load([ r201, r202, r203 ], 'group2');
  const imageShapes: any = [
    { label: 'Client', image: 'https://gw.alipayobjects.com/zos/bmw-prod/687b6cb9-4b97-42a6-96d0-34b3099133ac.svg' },
    { label: 'Http', image: 'https://gw.alipayobjects.com/zos/bmw-prod/dc1ced06-417d-466f-927b-b4a4d3265791.svg' },
    { label: 'Api', image: 'https://gw.alipayobjects.com/zos/bmw-prod/c55d7ae1-8d20-4585-bd8f-ca23653a4489.svg' },
    { label: 'Sql', image: 'https://gw.alipayobjects.com/zos/bmw-prod/6eb71764-18ed-4149-b868-53ad1542c405.svg' },
    { label: 'Clound', image: 'https://gw.alipayobjects.com/zos/bmw-prod/c36fe7cb-dc24-4854-aeb5-88d8dc36d52e.svg' },
    { label: 'Mq', image: 'https://gw.alipayobjects.com/zos/bmw-prod/2010ac9f-40e7-49d4-8c4a-4fcf2f83033b.svg' },
  ]
  // const imageNodes = imageShapes.map((item: any) =>
  //   graph.createNode({
  //     shape: 'custom-image',
  //     label: item.label,
  //     attrs: { image: { 'xlink:href': item.image }},
  //   }),
  // )
  // stencil.load(imageNodes, 'group2');
}
// #endregion

// #region 节点编辑工具
X6Util.nodeTools = {
  editor: {
    name: 'node-editor',
    args: { attrs: { backgroundColor: '#EFF4FF' }},
  },
  remove: {
    name: 'button-remove',
    args: { x: '100%', y: 0, offset: { x: -10, y: 10 }, },
  }
}
// #endregion

// #region 快捷键与事件
X6Util.bindKeys = (graph: any) => {
  graph.bindKey(['meta+c', 'ctrl+c'], () => {
    const cells = graph.getSelectedCells();
    if (cells.length) {
      graph.copy(cells);
    }
    return false;
  })
  graph.bindKey(['meta+x', 'ctrl+x'], () => {
    const cells = graph.getSelectedCells()
    if (cells.length) {
      graph.cut(cells);
    }
    return false
  })
  graph.bindKey(['meta+v', 'ctrl+v'], () => {
    if (!graph.isClipboardEmpty()) {
      const cells = graph.paste({ offset: 32 });
      graph.cleanSelection();
      graph.select(cells);
    }
    return false
  })
  // undo redo
  graph.bindKey(['meta+z', 'ctrl+z'], () => {
    if (graph.canUndo()) {
      graph.undo();
    }
    return false
  })
  graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
    if (graph.canRedo()) {
      graph.redo();
    }
    return false
  })
  // select all
  graph.bindKey(['meta+a', 'ctrl+a'], () => {
    const nodes = graph.getNodes()
    if (nodes) {
      graph.select(nodes)
    }
  })
  // delete
  graph.bindKey('backspace', () => {
    const cells = graph.getSelectedCells();
    if (cells.length) {
      graph.removeCells(cells);
    }
  })
  // zoom
  graph.bindKey(['ctrl+1', 'meta+1'], () => {
    const zoom = graph.zoom()
    if (zoom < 1.5) {
      graph.zoom(0.1)
    }
  })
  graph.bindKey(['ctrl+2', 'meta+2'], () => {
    const zoom = graph.zoom()
    if (zoom > 0.5) {
      graph.zoom(-0.1)
    }
  })
}
// #endregion

// #region 插件
X6Util.bindPlugin = (graph: any) => {
  graph
    // .use(new Transform({ resizing: true, rotating: true }))
    .use(new Selection({ rubberband: true, showNodeSelectionBox: true }))
    .use(new Snapline())
    .use(new Keyboard())
    .use(new Clipboard())
    .use(new History())
}
// #endregion

// #region 绑定节点事件
X6Util.bindEvent = ({graph, form, setSelectedNode}: any) => {
  graph.on('node:click', ({ e, x, y, node, view }: any) => {
    const tmpData = node.getData();
    form.setFieldsValue({
      fi_id: node.id,
      fi_name: tmpData.fi_name,
      fi_type: tmpData.fi_type || 'role',
      fi_role: tmpData.fi_role,
      fi_org: tmpData.fi_org,
      fi_type_name: tmpData.fi_type_name,
    });
    setSelectedNode(node);
    node.removeTools();
  });

  graph.on('cell:added', ({ cell, index, options }: any) => {
    if (cell.shape === 'custom_node_start'
          || cell.shape === 'custom_node_end'
          || cell.shape === 'custom_node_gateway_parallel'
          || cell.shape === 'custom_node_gateway_exclusive'
          || cell.shape === 'custom_node_gateway_inclusive') {
    cell.setData({
      position: 'right',
    })
    cell.prop('size', { width: 32, height: 32 });
  }
  });

  // 监听边点击事件并选中
  graph.on('edge:click', ({ edge }: any) => {
    graph.cleanSelection();
    graph.select(edge);
    setSelectedNode(edge);
  });

  // 监听边选中事件
  graph.on('edge:selected', ({ edge }: any) => {
    edge.attr('line/stroke', '#0a6ed1');
    edge.attr('line/strokeWidth', 2);
  });

  // 监听边取消选中事件
  graph.on('edge:unselected', ({ edge }: any) => {
    edge.attr('line/stroke', '#A2B1C3');
    edge.attr('line/strokeWidth', 2);
  });

  // graph.on('node:mouseenter', ({ node }: any) => {
  //   node.addTools({
  //     name: 'button-remove',
  //     args: { x: 0, y: 0, offset: { x: 0, y: 0 }, },
  //   })
  // });

  // graph.on('node:mouseleave', ({ node }: any) => {
  //   node.removeTools()
  // });


//   // 监听鼠标移动事件
// graph.on('blank:mousemove', ({ e }) => {
//   const target = graph.getCellByPoint(e.clientX, e.clientY);

//   // 检查鼠标是否移动到线条上
//   if (target && target.isEdge()) {
//     // 获取当前线条
//     const edge = target;

//     // 修改线条样式为红色高亮
//     edge.attr('line/stroke', 'red');

//     // 存储原始样式，以便恢复
//     if (!edge.originalAttrs) {
//       edge.originalAttrs = { ...edge.attrs };
//     }
//   } else {
//     // 遍历所有线条，恢复原始样式
//     graph.getCells().forEach(cell => {
//       if (cell.isEdge() && cell.originalAttrs) {
//         cell.attr(cell.originalAttrs);
//         // 清除存储的原始样式，避免内存泄漏
//         delete cell.originalAttrs;
//       }
//     });
//   }
// });

// // 监听鼠标离开画布事件（可选，确保离开画布时恢复所有线条样式）
// graph.on('blank:mouseleave', () => {
//   graph.getCells().forEach(cell => {
//     if (cell.isEdge() && cell.originalAttrs) {
//       cell.attr(cell.originalAttrs);
//       // 清除存储的原始样式，避免内存泄漏
//       delete cell.originalAttrs;
//     }
//   });
// });

}
// #endregion

// #region 界面编辑工具
// 按钮配置
X6Util.btnGroup1 = [
  { key: 'zoomIn', label: '放大' },
  { key: 'zoomOut', label: '缩小' },
  { key: 'zoomTo', label: '还原' },
  { key: 'zoomToFit', label: '适合内容' },
  { key: 'centerContent', label: '居中' },
];
X6Util.btnGroup2 = [
  { key: 'undo', label: '撤销' },
  { key: 'redo', label: '重做' },
];
// 按钮方法
X6Util.viewTools = (command: any, graphRef: any) => {
  switch (command) {
    case 'translate':
      graphRef.current?.translate(20, 20);
      break
    case 'zoomIn':
      graphRef.current?.zoom(0.2);
      break;
    case 'zoomOut':
      graphRef.current?.zoom(-0.2);
      break;
    case 'zoomTo':
      graphRef.current?.zoomTo(1);
      break;
    case 'zoomToFit':
      graphRef.current?.zoomToFit();
      break;
    case 'centerContent':
      graphRef.current?.centerContent();
      break;
    case 'undo':
      graphRef.current?.undo();
      break;
    case 'redo':
      graphRef.current?.redo();
      break;
    case 'clear':
      graphRef.current?.clearCells();
      break;
    case 'toJSON': {
      let aa: any = graphRef.current?.toJSON();
      console.info(aa);
      console.info(JSON.stringify(aa));
      break;
    }
    default:
      break;
  }
}
// #endregion

export default X6Util;