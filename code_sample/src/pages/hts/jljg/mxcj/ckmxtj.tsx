/**
 * title: 进料加工业务免抵退税核销表 查看明细 统计
 */
 import React, { useImperativeHandle, useState, useEffect, useRef } from 'react';
 import DDBunit2 from '@/components/DDBunit/DDBunit2';
 import ckmxtjConfig from './ckmxtjconfig';
 import ZnfxJckhzqdHgFunc from '../sjxz/hghxsjcx/func';
 import DyGrid from '../sjxz/common/dyGrid';
 import pro from '@/pages/common/proConfig';
 import { message, Drawer } from 'antd';
 import { gxjhfpldc } from '@/services/hts/api';
 import myUtil from '@/pages/common/myUtil';
 
 export interface CkmxProps {
   onRef?: any;
 }
 
 const ModalJckgd: React.FC<CkmxProps> = ({
   onRef,
 }) => {
   const [modalVisible, setModalVisible] = useState<boolean>(false);
   const [myConfig, setMyconfig] = useState<any>();
   const [myHgConfig] = useState<any>(ckmxtjConfig);
 
   const [myFunc, setMyFunc] = useState<any>();
   const [myHgFunc] = useState<any>(ZnfxJckhzqdHgFunc);
   const dyGridRef: any = useRef();
   const [myType, setMyType] = useState<any>();
 
   const [title, setTitle] = useState<any>('');
   // 开启
   const showModal = (param: any) => {
     const { searchModel } = param;
     let c: any = null;
     let t: any = null;
     let f: any = null;
      c = { ...myHgConfig };
      f = { ...myHgFunc };
      t = { ...myHgConfig };
      setMyType('bgdhgbh');
     let til = '';
     const model = [
       { property: 'jljgszch', value: searchModel.jljgszch, op: 'dd' },
       { property: 'jarq', value: searchModel.jarq, op: 'dd' },
     ];
     til = `账册号：${searchModel.jljgszch}   核销周期：${searchModel.jarq}   实际分配率：${searchModel.cxjljgsjfpl}`;
     setTitle(til);
     const gridParams: any = {
       initSearchModal: model
     }
     c.gridParams = gridParams;
     c.layout_type = 'modal';
     setMyconfig(c);
     f.getOtherRef = () => {
       const otherRef = [];
       // 导入模板数据异常页面
       otherRef.push(dyGridRef);
       return otherRef;
     };
     // 导出
    f.handleMdthxFplSjdc = () => {
      const csArr: any = [];
      csArr.push(searchModel);
      const param = {data: csArr, datatype: 'mxsjtj'};
      gxjhfpldc(param).then((response) => {
        const {code, body, desc} = response;
        if (code === '200') {
          const { blob, fileName } = body;
          myUtil.file.downloadExcel(blob, fileName);
        } else {
          message.error(desc);
        }
      });
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
         width={pro.c_modal_width_x4}
         onClose={() => { setModalVisible(false) }}
         className="dd_data_page_modal"
         destroyOnClose={true}
         maskClosable={false}
       >
         <DDBunit2 config={myConfig} func={myFunc} />
         <DyGrid onRef={dyGridRef} dyType={myType} />
       </Drawer>
     </>
   );
 };
 
 export default ModalJckgd;
 