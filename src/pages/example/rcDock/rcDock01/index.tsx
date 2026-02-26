import React from 'react';
import "rc-dock/dist/rc-dock.css";
import DockLayout from 'rc-dock';

const Report01: React.FC<unknown> = () => {
  let tab = {
    content: <div>Tab Content</div>,
    closable: true,
  };
  let layout = {
    dockbox: {
      mode: 'horizontal',
      children: [
        {
          mode: 'vertical',
          size: 200,
          children: [
            {
              tabs: [{...tab, id: 't1', title: 'Tab 1'}, {...tab, id: 't2', title: 'Tab 2'}],
            },
            {
              tabs: [{
                ...tab, id: 't3', title: 'Min Size', content: (
                  <div>
                    <p>This tab has a minimal size</p>
                    150 x 150 px
                  </div>
                ), minWidth: 150, minHeight: 150,
              }, {...tab, id: 't4', title: 'Tab 4'}],
            },
          ]
        },
        {
          size: 1000,
          tabs: [
            {
              ...tab, id: 't5', title: 'basic demo', content: (
                <div>
                  This panel won't be removed from layout even when last Tab is closed
                </div>
              ),
            },
            // jsxTab,
            // htmlTab,
          ],
          panelLock: {panelStyle: 'main'},
        },
        {
          size: 200,
          tabs: [{...tab, id: 't8', title: 'Tab 8'}],
        },
      ]
    },
    floatbox: {
      mode: 'float',
      children: [
        {
          tabs: [
            {...tab, id: 't9', title: 'Tab 9', content: <div>Float</div>},
            {...tab, id: 't10', title: 'Tab 10'}
          ],
          x: 300, y: 150, w: 400, h: 300
        }
      ]
    }
  };
  return (
    <div style={{height: '700px'}}>
      <DockLayout defaultLayout={layout} style={{position: 'absolute', left: 10, top: 10, right: 10, bottom: 10}}/>
    </div>
  );
};

export default Report01;
