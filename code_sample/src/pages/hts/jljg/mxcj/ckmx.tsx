/**
 * title: 进料加工业务免抵退税核销表 查看明细
 */
 import React, { useImperativeHandle, useState, useEffect, useRef } from 'react';
 import DDBunit2 from '@/components/DDBunit/DDBunit2';
 import ckmxConfig from './ckmxconfig';
 import ZnfxJckhzqdHgFunc from '../sjxz/hghxsjcx/func';
 import DyGrid from '../sjxz/common/dyGrid';
 import pro from '@/pages/common/proConfig';
 import { message,Drawer } from 'antd';
 import ModalCkmxtj from './ckmxtj';
 import { mxtjldc, cxjsfpl } from '@/services/hts/api';
 import myUtil from '@/pages/common/myUtil';

 export interface CkmxProps {
   onRef?: any;
 }
 
 const ModalJckgd: React.FC<CkmxProps> = ({
   onRef,
 }) => {
   const [modalVisible, setModalVisible] = useState<boolean>(false);
   const [myConfig, setMyconfig] = useState<any>();
   const [myHgConfig] = useState<any>(ckmxConfig);
 
   const [myFunc, setMyFunc] = useState<any>();
   const [myHgFunc] = useState<any>(ZnfxJckhzqdHgFunc);
   const dyGridRef: any = useRef();
   const ckmxtjRef: any = useRef();
   const [myType, setMyType] = useState<any>();
 
   const [title, setTitle] = useState<any>('');
   // 开启
   const showModal = (param: any) => {
     const { searchModel } = param;
     let c: any = null;
     let f: any = null;
     c = { ...myHgConfig };
     f = { ...myHgFunc };
     setMyType('bgdhgbh');
     let unit_key = '';
     unit_key = 'ZXSB_SB_JLJG_JHFPL_CKMX';
     let til = '';
     c.unit_key = unit_key;
     const model = [
      { property: 'jljgszch', value: searchModel.jljgszch, op: 'dd' },
     ];
     const gridParams: any = {
       initSearchModal: model
     }
     c.gridParams = gridParams;
     const filterItems = [];
     for (let i = 0; i < c.filter_items.length; i++) {
       filterItems.push(c.filter_items[i]);
     }
     c.filter_items = filterItems;
     c.layout_type = 'modal';
     setMyconfig(c);
     //获取分配率信息
     var uuids = new Array(searchModel.uuid);
     const model2 = [
      { property: 'uuids', values: uuids, op: 'ain' },
     ];
     cxjsfpl({searchModel: model2}).then((response) => {
        searchModel.jarq = '';
        searchModel.cxjljgsjfpl = '';
        const { code, body, desc } = response;
        if (code === '200') {
          if(body!= null && body.length>0){
            searchModel.jarq = body[0].jarq;
            searchModel.cxjljgsjfpl = body[0].cxjljgsjfpl;
          }
        }
        til = `账册号：${searchModel.jljgszch}   核销周期：${searchModel.jarq}   实际分配率：${searchModel.cxjljgsjfpl}`;
        setTitle(til);
      });

     f.getOtherRef = () => {
       const otherRef = [];
       // 导入模板数据异常页面
       otherRef.push(dyGridRef);
       otherRef.push(ckmxtjRef);
       return otherRef;
     };

     f.handleCkmxtj = () => {
        const otherRefs = f.getOtherRef();
        if (otherRefs[1]) {
          otherRefs[1].current?.showModal({searchModel: searchModel}, null);
        }
      };

     f.exportPager = () => {
      const model = [
        { property: 'jljgszch', value: searchModel.jljgszch, op: 'dd' },
       ];
      const tmp = {
        key : "ZXSB_SB_JLJG_JHFPL_CKMX_EXCEL",
        searchModel: model
      };
      mxtjldc(tmp).then((response) => {
        const {code , desc} = response;
        if (code === '200') {
          const {blob, fileName} = response.body;
          myUtil.file.downloadExcel(blob, fileName);
        } else {
          message.error(desc);
          return ;
        }
      })
    };
     setMyFunc(f);
     setModalVisible(true);
   };

 
   useEffect(() => {
   }, []);
 
   useImperativeHandle(onRef, () => {
     return {
       showModal,
     };
   });
 
   return (
     <>
       <Drawer
         title={title}
         visible={modalVisible}
         width={pro.c_modal_width_max}
         onClose={() => { setModalVisible(false) }}
         className="dd_data_page_modal"
         destroyOnClose={true}
         maskClosable={false}
       >
         <DDBunit2 config={myConfig} func={myFunc}/>
         <DyGrid onRef={dyGridRef} dyType={myType} />
         <ModalCkmxtj onRef={ckmxtjRef} />
       </Drawer>
     </>
   );
 };
 
 export default ModalJckgd;
 