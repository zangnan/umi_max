import React, { useState, useRef } from 'react';
import "rc-dock/dist/rc-dock.css";
import DockLayout from 'rc-dock';
import Table01 from '../../table/table01';
import { Button } from 'antd';

const Report01: React.FC<unknown> = () => {
  const [saved, setSaved] = useState<any>(null);
  const dockRef: any = useRef();

  let tab = {
    content: <Table01 />
    // content: <div>Tab Content</div>,
    // closable: true,
  };
  let defaultLayout: any = {
    dockbox: {
      mode: 'vertical', // horizontal vertical
      children: [
        { size: 220, tabs: [{ ...tab, id: 'tab1', title: 'tab1' }] },
        { mode: 'horizontal', children: [
            { tabs: [{ ...tab, id: 't1', title: '出口报关单', group: 'bgd' }]},
            { tabs: [{ ...tab, id: 't4', title: '增值税发票' }]},
          ]
        },
      ]
    }
  };

  const saveLayout = () => {
    setSaved(dockRef.current!.saveLayout());
  };

  const loadLayout = () => {
    dockRef.current!.loadLayout(saved);
  };
  return (
    <>
      <div>
        <Button onClick={saveLayout}>Save Layout</Button>
        <Button onClick={loadLayout}>Load Layout</Button>
      </div>
      <div style={{height: '1200px'}}>
        <DockLayout
          ref={dockRef}
          defaultLayout={defaultLayout}
          style={{ position: "absolute", left: 10, top: 50, right: 10, bottom: 10 }}
        />
      </div>
    </>
  );
};

export default Report01;
