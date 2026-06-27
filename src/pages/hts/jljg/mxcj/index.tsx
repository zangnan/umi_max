import React, { useRef } from 'react';
import { Tabs } from 'antd';
import Mdthx from './mdthx';
import Yhxtz from './yhxtz';
import Func from './f';
import ModalCxjsfpl from './cxjsfpl';
import ModalCkmx from './ckmx';
// import ModalCkmxtj from './ckmxtj';
import Mx from './drawer_list';
import Tj from './drawer_tj';


const Index: React.FC = () => {
  const cxjsfplRef: any = useRef();
  const ckmxRef: any = useRef();
  const jljghxRef: any = useRef();
  const TjRef: any = useRef();


  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(cxjsfplRef);
    otherRef.push(ckmxRef);
    otherRef.push(jljghxRef);
    otherRef.push(TjRef);
    return otherRef;
  };

  
  return (
    <>
      <Tabs defaultActiveKey="mdthx"  className="dd_layout_tabs dd_layout_tabs_bzgl">
        <Tabs.TabPane tab="进料加工业务免抵退税核销表" key="mdthx" className="mdthx">
          <Mdthx />
        </Tabs.TabPane>
        <Tabs.TabPane tab="已核销手（账）册海关数据调整表" key="yhxtz" className="yhxtz">
          <Yhxtz />
        </Tabs.TabPane>
      </Tabs>
      <ModalCxjsfpl onRef={cxjsfplRef} />
      <ModalCkmx onRef={ckmxRef} />
      <Mx onRef={jljghxRef} />
      <Tj onRef={TjRef} />
    </>
  );
};

export default Index;
