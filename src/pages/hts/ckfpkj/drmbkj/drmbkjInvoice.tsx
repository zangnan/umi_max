/**
 * 导入模板开具 采集和预览
 */
 import React, { useImperativeHandle, useState, useRef } from 'react';
import { Modal, Button, message, Spin, Tooltip } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
 import Invoice from '@/pages/hts/components/DDdocs/Invoice';
 import { bcfpsqd, queryParams, fpmxbc2 } from '@/pages/hts/services/htsApi';
 import { useIntl } from 'umi';
import myUtil from '@/components/DDAssist/util';
import DDAlert from '@/pages/hts/commonModule/DDAlert';
 import { WarningOutlined } from '@ant-design/icons';
 
 export interface DDModalGridProps {
   onRef?: any;
   visible?: any;
   djh?: string;
 }
 const DrmbkjInvoice: React.FC<DDModalGridProps> = ({
   onRef,
   visible = false,
   djh,
 }) => {
   const [data, setData] = useState<any>([]);// 全部信息
   const [djhData, setDjhData] = useState<any>(djh);// 单据号
   const [readonly, setReadonly] = useState<boolean>(false);// 数据类型CJ是点击“手动采集开具”按钮，XQ是点击页面单据号连接进入
   const [modalVisible, setModalVisible] = useState<boolean>(visible);// modal是否显示
   const invoiceRef: any = useRef();
   const [masker, setMasker] = useState<boolean>(false); // 蒙板
   const [mainRef, setMainRef] = useState<any>();// 单据号
   const [gmfList, setGmfList] = useState<any>([]);
   const [fpzlDm1, setFpzlDm1] = useState<any>('');// 发票种类
   const [fpkjfsDm, setFpkjfsDm] = useState<any>('');// 发票种类
   const intl = useIntl(); // 提示信息
   const [sbyy1, setSbyy1] = useState<any>('');// 失败原因
   const [tempCode, setTempCode] = useState<any>({});// 发票配置的码表
   const [isFpsqdFlag, setIsFpsqdFlag] = useState<any>('1'); // 是否为2.0功能  1、发票状态跟踪-修改来源为按报关单开具的，3：发票状态跟踪-修改来源为导入模板开具的 4：导入模板开具修改
 
 
   // 开启
   const showModal = (param: any, param1: boolean, ref: any, isFpsqd:any) => {
     setModalVisible(true);
     setData(param);
     setReadonly(param1);
     setIsFpsqdFlag(isFpsqd);
     setSbyy1(param?.sbyy1)
     setMainRef(ref);
     queryParams({ key: 'GFCX_CS_ZXSB_FPKJ_KHGLPZ', searchModel: [{ property: 'qybz', value: 'Y', op: 'dd' }] }).then((response: any) => {
       const { code, body } = response;
       const tmpList: any = [];
       if (code === '200') {
         body.forEach((item: any) => {
           item.value = item.ghfnsrmc;
           item.label = item.ghfnsrmc;
           tmpList.push(item);
         })
         setGmfList(tmpList);
       } else {
         setGmfList([])
       }
     })
 
     Promise.all([myUtil.code.getCodeFromServerT1('CODE_CS_ZXSB_FPKJ_CSPZ:01')]).then(() => {
     }).catch(() => {
       message.error('获取码表失败');
     }).finally(() => {
       const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01');
       setFpzlDm1(temp[0].fpzlDm1);
       setFpkjfsDm(temp[0].fpkjfsDm);
       setTempCode(temp[0]);
     });
   }
 
   // 设置单据号
   const setDjh = (param: any) => {
     setDjhData(param);
   }
 
   // 保存按钮
   function saveData() {
     const saveData = invoiceRef.current.handleSave();
     const hwxxList = [...saveData.hwxxList];
     if (saveData.ghfnsrmc === undefined) {
       message.info(intl.formatMessage({ id: 'message_ckfp_abgdkj_scfpsqd_checkgmfmc' }));
       return;
     }
     const tempList = hwxxList.filter((item: any) => (item.sl === 0 || item.sl === undefined || item.sl === null) && !(item.jldwmc) && (item.sl1 === undefined || item.sl1 === null));
     if (tempList.length > 0) {
       message.info(intl.formatMessage({ id: 'message_ckfp_drmbkj_hwxx_nodata' }));
       return;
     }
     // 因导入模板开具的数据库字段不一致，后端改动太大，重新赋值
     const temp: any = [];
     hwxxList.forEach((item: any) => {
       const tempHwxx = { ...item };
       // 将dj（页面上的含税单价）赋值给hsdj（数据库的含税单价），将je（页面上的含税金额）赋值给jshj（数据库的含税金额）
       tempHwxx.hsdj = tempHwxx.dj;
       tempHwxx.jshj = tempHwxx.je;
       // 将备份的wsdj赋值给dj（数据库的未税单价）。wsje赋值给je（数据库的未税金额）
       tempHwxx.dj = tempHwxx.wsdj;
       tempHwxx.je = tempHwxx.wsje;
       delete tempHwxx.wsdj;
       delete tempHwxx.wsje;
       temp.push(tempHwxx);
     });
 
     // 数据来源类型采集时给1
     // 导入
     if (isFpsqdFlag === '3') {
       Object.assign(saveData, { pzsjlyDm: '3' })
     } else if (isFpsqdFlag != '3' && readonly === false) {
       Object.assign(saveData, { pzsjlyDm: '1' })
     }
 
     const param = Object.assign(saveData, { hwxxList: temp }, { djbh: djhData })
     const bzText = param?.bz || '';
     if(bzText.indexOf('流水号') < 0 && fpzlDm1 === '5' && fpkjfsDm != '2' && readonly) {
       DDAlert.open({
         title: '保存',
         infoType: 'warning',
         modalType: 'info',
         info: '发票信息备注栏“流水号”不存在，发票回填时需手动维护。',
         isShowcancelText: false,
         okCallbackFn: function () {
           DDAlert.close();
           setMasker(true);
           if(isFpsqdFlag === '3' || isFpsqdFlag === '1') {
             setMasker(true);
             fpmxbc2(param).then((response: any) => {
               const { code, desc } = response;
               setMasker(false);
               if (code === '200') {
                 mainRef.current!.reload2();
                 // 修改
                 message.success(intl.formatMessage({ id: 'message_edit_success' }));
                 setModalVisible(false);
               } else {
                 message.error(desc);
               }
             });
           } else {
             bcfpsqd(param).then((response: any) => {
               const { code, desc } = response;
               setMasker(false);
               if (code === '200') {
                 mainRef.current!.reload2();
                 if (readonly) {
                   // 修改
                   message.success(intl.formatMessage({ id: 'message_edit_success' }));
                 } else {
                   // 新建
                   message.success(intl.formatMessage({ id: 'message_save_success' }));
                 }
                 setModalVisible(false);
               } else {
                 message.error(desc);
               }
             });
           }
         },
       });
     } else {
       if(isFpsqdFlag === '3' || isFpsqdFlag === '1') {
         setMasker(true);
         fpmxbc2(param).then((response: any) => {
           const { code, desc } = response;
           setMasker(false);
           if (code === '200') {
             mainRef.current!.reload2();
             // 修改
             message.success(intl.formatMessage({ id: 'message_edit_success' }));
             setModalVisible(false);
           } else {
             message.error(desc);
           }
         });
       } else {
         setMasker(true);
         bcfpsqd(param).then((response: any) => {
           const { code, desc } = response;
           setMasker(false);
           if (code === '200') {
             mainRef.current!.reload2();
             if (isFpsqdFlag === '4') {
               message.success(intl.formatMessage({ id: 'message_edit_success' }));
             } else {
               if (readonly) {
                 // 修改
                 message.success(intl.formatMessage({ id: 'message_edit_success' }));
               } else {
                 // 新建
                 message.success(intl.formatMessage({ id: 'message_save_success' }));
               }
             }
             setModalVisible(false);
           } else {
             message.error(desc);
           }
         });
       }
     }
   }
 
   useImperativeHandle(onRef, () => {
     return {
       showModal,
       setDjh,
     };
   });
 
   return (
     <>
       <Modal
         title={isFpsqdFlag === '4'? '编辑' : readonly ? '导入数据预览' : '手动采集开具'}
         destroyOnHidden={true}
         visible={modalVisible}
         width={CONSTANTS.C_MODAL_WIDTH_X4}
         wrapClassName='standard-modal-1'
         footer={(<>
           <Button onClick={() => setModalVisible(false)} >取消</Button>
           {readonly? <></> : <Button onClick={saveData} type="primary">确定</Button>}
         </>)}
         onCancel={() => setModalVisible(false)}
       >
         <Spin tip="Loading..." spinning={masker} delay={100}>
           <div style={{ marginBottom: 20 }}>
             <span>单据号：{djhData}</span>
             <span style={{marginLeft:'8px'}}>
               {sbyy1 && tempCode?.fpkjfsDm === '2' ? <Tooltip title={sbyy1}> <span>
                 <WarningOutlined style={{ color: '#ef8724', cursor: "pointer" }} />
               </span></Tooltip> : <></> }
             </span>
           </div>
           <Invoice onRef={invoiceRef} data={data} mklx={isFpsqdFlag==='4'? 'DRMBXG': readonly ? 'MBDR' : 'MBCJ'} isFpsqd={isFpsqdFlag} hiddenYbje={true} readonly={readonly} bzHeight='100px' gmfxx={gmfList} />
         </Spin>
       </Modal>
     </>
   );
 };
 
 export default DrmbkjInvoice;