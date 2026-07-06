/**
 * title: 发票
 * creator: zn
 */
 import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
 import { Table, Space, Typography, Input, Form, Divider, Button, Select, Tooltip, message } from 'antd';
import myUtil from '@/components/DDAssist/util';
 import Wxspglfm from '@/pages/hts/pzgl/fppzgl/fm/wxspglfm';
 import Drawerqtspqtspgl from '@/pages/hts/ckfp/drmbkj/drawerqtspqtspgl';
 import EditableCell from './editableCell';
 import './style.less';
 import { EditOutlined, DeleteOutlined, PlusOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
 import { intl } from '@/components/DDAssist/util';
 import { queryParams } from '@/pages/hts/services/htsApi';
 
 
 export interface DDInvoiceProps {
   onRef?: any;
   data?: any;
   readonly?: boolean;
   hiddenYbje?: boolean;
   clickLinkFun?: any;
   bzHeight?: any;
   mklx?: string;
   gmfxx?: any;
   isFpsqd?: any;
 }
 
 const Invoice: React.FC<DDInvoiceProps> = ({
   onRef,
   data,
   readonly = false, // 默认 false 可选true
   hiddenYbje = false,  // 是否隐藏原币金额列
   clickLinkFun,
   bzHeight,
   mklx,// 模块类型 MBDR:模板导入，FPSQD:发票申请单, DRMBXG: 导入模板开具修改
   gmfxx,
   isFpsqd, // 特殊模块，发票开具2.0用 true为发票申请单
 }) => {
   const [gmf, setGmf] = useState<any>({});                                      // 购买方信息
   const [hwqdsl, setHwqdsl] = useState<any>(0);                                 // 货物清单数量
   const [hwqdMx, setHwqdMx] = useState<any>([]);                                // 货物清单明细
 
   // 获取长度大于8条时，明细栏的金额合计和税额合计
   const [jeHj, setJeHj] = useState<any>(0);                                     // 金额合计
   const [seHj, setSeHj] = useState<any>(0);                                     // 税额合计
   const [editingKey, setEditingKey] = useState<any>('');                        // 编辑行标识
 
   const wxspglfmRef: any = useRef();
   const drawerQtspqtspglRef: any = useRef();
   const [form] = Form.useForm();
   const [formGmf] = Form.useForm();
   const [formBz] = Form.useForm();
   const [formPerson] = Form.useForm();
 
   const isEditing = (record: any) => {
 
     return record.uuid === editingKey;
   };
 
   // 获取列样式
   const getColCls = () => {
     if (!readonly) {
       return 'edit_bg1';
     }
     return '';
   }
 
   // 配置列表列
   const columns: any = !readonly ? [
     {
       title: '商品名称', ellipsis: true, dataIndex: 'hwhyslwmc', className: getColCls(), fixed: 'left', editable: readonly ? false : true, editType: 'InputSpmc', render: (text: any, record: any) => {
         return text ?
           <Tooltip key={record.uuid} title={`*${record.hwhlwjc}*${text}`}>
             <Typography.Paragraph ellipsis={true}>
               {`*${record.hwhlwjc}*${text}`}
             </Typography.Paragraph>
           </Tooltip> : '';
       }
     },
     {
       title: '规格型号', ellipsis: true, dataIndex: 'ggxh', width: 90, className: getColCls(), editable: readonly ? false : true, editType: 'Input', render: (text: any, record: any) => {
         return text ? <Tooltip placement="topLeft" key={record.uuid + record.ggxh} title={text}>{text}</Tooltip> : '';
       }
     },
     { title: '单位', ellipsis: true, dataIndex: 'jldwmc', width: 90, className: getColCls(), editable: readonly ? false : true, editType: mklx === 'FPSQD' ? 'Select' : 'Input' },
     {
       title: '数量', ellipsis: true, dataIndex: 'sl', width: 120, align: 'right', className: getColCls(), editable: readonly ? false : true, editType: 'InputNumber', render: (text: any) => {
         if (text != undefined) {
           return myUtil.text.formatNum(text, '0,0.00000');
         } else {
           return text;
         }
       }
     },
     {
       title: '单价（含税）', ellipsis: true, dataIndex: 'dj', width: 120, align: 'right', editable: readonly ? false : true, editType: 'InputNumber', render: (text: any) => {
         if (text != undefined) {
           return myUtil.text.formatNum(text, '0,0.000000');
         } else {
           return text;
         }
       }
     },
     {
       title: '原币成交金额', ellipsis: true, dataIndex: 'cjzj', width: 120, align: 'right', hidden: hiddenYbje, render: (text: any) => {
         if (text != undefined) {
           return myUtil.text.formatNum(text, '0,0.00');
         } else {
           return text;
         }
       }
     },
     {
       title: '金额（含税）', ellipsis: true, dataIndex: 'je', width: 120, align: 'right', className: getColCls(), editable: readonly ? false : true, editType: 'InputNumber', render: (text: any) => {
         if (text != undefined) {
           return myUtil.text.formatNum(text, '0,0.00');
         } else {
           return text;
         }
       }
     },
     {
       title: '税率（%）', ellipsis: true, dataIndex: 'sl1', width: 100, align: 'right', className: getColCls(), editable: readonly ? false : true, editType: 'Select', render: (text: any, record: any) => { return renderSl(text, record.fpssyhlxDm) }
     },
     {
       title: '税额', ellipsis: true, dataIndex: 'se', width: 120, align: 'right', className: getColCls(), editable: readonly ? false : true, editType: 'InputNumber', render: (text: any) => {
         if (text != undefined) {
           return myUtil.text.formatNum(text, '0,0.00');
         } else {
           return text;
         }
       }
     },
     {
       title: '操作', dataIndex: 'operation', width: mklx != 'FPSQD' ? 100 : 60, align: 'center', className: getColCls(), fixed: 'right', render: (_: any, record: any) => {
         const uuid = record.uuid;
         if (uuid.startsWith('rowkey')) {
           return '';
         }
         const editable = isEditing(record);
         return editable ? (<>
           <Button type="link" onClick={() => handleSaveRow(record)}><CheckOutlined /></Button>
           <Divider type='vertical' />
           <Button type="link" onClick={() => handleCancel(record)}><CloseOutlined /></Button>
         </>) : 
         (<><Button type="link" disabled={editingKey !== ''} onClick={() => handleEdit(record)}><EditOutlined /></Button>
           {mklx === 'DRMBXG' ? <></> : mklx != 'FPSQD' && data?.fpsqdxx.fpkjfsDm != '1' ? <>
             <Divider type='vertical' />
             <Button type="link" disabled={editingKey !== ''} onClick={() => handleDelete(record.uuid)}><DeleteOutlined /></Button>
             <Divider type='vertical' />
             <Button type="link" disabled={editingKey !== ''} onClick={handleAdd}><PlusOutlined /></Button>
           </> : 
           <></>}
         </>
         )
       }
     }
   ] : [
     {
       title: '商品名称', ellipsis: true, dataIndex: 'hwhyslwmc', className: getColCls(), fixed: 'left', editable: readonly ? false : true, editType: 'InputSpmc', render: (text: any, record: any) => {
         return text ?
           <Tooltip key={record.uuid} title={`*${record.hwhlwjc}*${text}`}>
             <Typography.Paragraph ellipsis={true}>
               {`*${record.hwhlwjc}*${text}`}
             </Typography.Paragraph>
           </Tooltip> : '';
       }
     },
     {
       title: '规格型号', ellipsis: true, dataIndex: 'ggxh', width: 90, className: getColCls(), editable: readonly ? false : true, editType: 'Input', render: (text: any, record: any) => {
         return text ? <Tooltip key={record.uuid + record.ggxh} title={text}>{text}</Tooltip> : '';
       }
     },
     { title: '单位', ellipsis: true, dataIndex: 'jldwmc', width: 90, className: getColCls(), editable: readonly ? false : true, editType: mklx === 'FPSQD' ? 'Select' : 'Input' },
     {
       title: '数量', ellipsis: true, dataIndex: 'sl', width: 120, align: 'right', className: getColCls(), editable: readonly ? false : true, editType: 'InputNumber', render: (text: any) => {
         if (text != undefined) {
           return myUtil.text.formatNum(text, '0,0.00000');
         } else {
           return text;
         }
       }
     },
     {
       title: '单价（含税）', ellipsis: true, dataIndex: 'dj', width: 120, align: 'right', editable: readonly ? false : true, editType: 'InputNumber', render: (text: any) => {
         if (text != undefined) {
           return myUtil.text.formatNum(text, '0,0.000000');
         } else {
           return text;
         }
       }
     },
     {
       title: '原币成交金额', ellipsis: true, dataIndex: 'cjzj', width: 120, align: 'right', hidden: hiddenYbje, render: (text: any) => {
         if (text != undefined) {
           return myUtil.text.formatNum(text, '0,0.00');
         } else {
           return text;
         }
       }
     },
     {
       title: '金额（含税）', ellipsis: true, dataIndex: 'je', width: 120, align: 'right', className: getColCls(), editable: readonly ? false : true, editType: 'InputNumber', render: (text: any) => {
         if (text != undefined) {
           return myUtil.text.formatNum(text, '0,0.00');
         } else {
           return text;
         }
       }
     },
     {
       title: '税率（%）', ellipsis: true, dataIndex: 'sl1', width: 100, align: 'right', className: getColCls(), editable: readonly ? false : true, editType: 'Select', render: (text: any, record: any) => { return renderSl(text, record.fpssyhlxDm) }
     },
     {
       title: '税额', ellipsis: true, dataIndex: 'se', width: 90, align: 'right', className: getColCls(), editable: readonly ? false : true, editType: 'InputNumber', render: (text: any) => {
         if (text != undefined) {
           return myUtil.text.formatNum(text, '0,0.00');
         } else {
           return text;
         }
       }
     },
   ];
 
   // 开启行编辑
   const handleEdit = (record: any) => {
     //11111
     let tempSl = '0';
     if (record.sl1 === 0) {
       if (record.fpssyhlxDm === '1') {
         tempSl = '免税'
       } else if (record.fpssyhlxDm === '2') {
         tempSl = '不征税'
       }
     } else {
       tempSl = record.sl1 ? (record.sl1 * 100)+'%' :'0';
     }
     form.setFieldsValue({
       uuid: record.uuid,
       hwhlwjc: record.hwhlwjc,
       hwhyslwmc: record.hwhyslwmc,
       ggxh: record.ggxh,
       jldwmc: record.jldwmc,
       sl: record.sl,
       dj: record.dj,
       sphfwssflhbbm: record.sphfwssflhbbm,
       je: record.je,
       sl1: tempSl,
       se: record.se,
       fpssyhlxDm: record.fpssyhlxDm,
       sbjldwDm: record.sbjldwDm,
       sbjldwmc: record.sbjldwmc,
       hgjldwDm: record.hgjldwDm,
       hgjldwmc: record.hgjldwmc,
       dejldwDm: record.dejldwDm,
       dejldwmc: record.dejldwmc,
       rmbje: record.rmbje,
     });
     setEditingKey(record.uuid);
   };
 
   // 取消行编辑
   const handleCancel = (record: any) => {
     setEditingKey('');
     if (record.hasOwnProperty('hwhlwjcBak')) {
       const newData = [...hwqdMx];
       const index = newData.findIndex((item) => record.uuid === item.uuid);
       const item = newData[index];
       item.hwhlwjc = record.hwhlwjcBak;
       delete item.hwhlwjcBak;
       if (mklx === 'MBDR' || mklx === 'MBCJ') {
         item.sphfwssflhbbm = record.sphfwssflhbbmBak;
         item.hsbz1 = record.hsbz1Bak;
         item.syyhzcbz = record.syyhzcbzBak;
         item.fpssyhlxDm = record.fpssyhlxDmBak;
         item.lsllxDm = record.lsllxDmBak;
         delete item.sphfwssflhbbmBak;
         delete item.hsbz1Bak;
         delete item.syyhzcbzBak;
         delete item.fpssyhlxDmBak;
         delete item.lsllxDmBak;
       }
       newData.splice(index, 1, item);
       setHwqdMx(newData);
     }
   };
 
   // 保存
   const handleSave = () => {
     const tmphwqdMx: any = [];
     hwqdMx.forEach((item: any) => {
       if (!item.uuid.startsWith('rowkey')) {
         tmphwqdMx.push(item);
       }
     });
     const personVal = formPerson.getFieldsValue();
     const bzVal = formBz.getFieldsValue();
     const param: any = { ...data?.fpsqdxx, ...gmf, ...personVal, ...bzVal };
     param.hwxxList = tmphwqdMx;
     if (mklx === 'MBDR' || mklx === 'MBCJ' || mklx === 'DRMBXG') {
       param.se = seHj;
       param.jshj = jeHj;
     }
     return param;
   };
 
   // 保存行 暂存
   const handleSaveRow = async (record: any) => {
     //222
     const row = await form.validateFields();
     const newData = [...hwqdMx];
     const index = newData.findIndex((item) => record.uuid === item.uuid);
     // 金额（含税）= 单价 * 数量
     if (index > -1) {
       const item = newData[index];
       if (!item.hwhlwjc) {
         message.info('请选择类别！');
         return;
       }
       const newItem = { ...item, ...row };
       // 税率处理
       if (newItem.sl1 === '免税' || newItem.sl1 === '不征税') {
         newItem.fpssyhlxDm = '1';
         if (newItem.sl1 === '不征税') {
           newItem.fpssyhlxDm = '2';
         }
         newItem.sl1 = 0;
         if (mklx === 'MBDR' || mklx === 'MBCJ' || mklx === 'DRMBXG') {
           newItem.syyhzcbz = '1';
         }
       } else {
         if(newItem?.sl1.indexOf('%') >-1){
           const ss = newItem?.sl1.replace('%','') / 100;
           newItem.sl1 = Number(ss);
         }else{
           newItem.sl1 = Number(newItem.sl1);
         }
         newItem.fpssyhlxDm = '';
         if (mklx === 'MBDR' || mklx === 'MBCJ' || mklx === 'DRMBXG') {
           newItem.syyhzcbz = '0';
         }
       }
       // 数量小数位精确
       newItem.sl = Number(newItem.sl).toFixed(5);
       // 金额小数位精确
       newItem.je = Number(newItem.je).toFixed(2);
       // 商品和服务税收分类合并编码 处理
       delete newItem.hwhlwjcBak;
       if (mklx === 'MBDR' || mklx === 'MBCJ' || mklx === 'DRMBXG') {
         delete newItem.sphfwssflhbbmBak;
         delete newItem.hsbz1Bak;
         delete newItem.syyhzcbzBak;
         delete newItem.fpssyhlxDmBak;
         delete newItem.lsllxDmBak;
       }
       newData.splice(index, 1, newItem);
       // 重新计算加收合计并更新货物信息
       dealHwqd(newData);
     } else {
       newData.push(row);
       // 重新计算加收合计并更新货物信息
       dealHwqd(newData);
     }
     setEditingKey('');
   };
 
   // 删除行
   const handleDelete = (uuid: any) => {
     const newData = [...hwqdMx];
     if (newData.length === 1) {
       message.info(intl.formatMessage({ id: 'message_ckfp_fpsqd_delete_edit' }));
     } else {
       // 重新计算加收合计并更新货物信息
       dealHwqd(newData.filter(item => item.uuid !== uuid));
     }
   };
 
   // 增加行
   const handleAdd = () => {
     const newData: any = {
       uuid: myUtil.getUUID(32),
       hwhyslwmc: null,
       ggxh: null,
       jldwmc: null,
       sl: null,
       dj: null,
       sphfwssflhbbm: null,
       je: null,
       sl1: null,
       se: null,
     };
     // 找到第一个补充的空数组进行替换
     const newHwqdData = [...hwqdMx];
     const index = newHwqdData.findIndex((item) => (item.uuid + '').startsWith('rowkey'));
     if (index > 0) {
       newHwqdData.splice(index, 1, newData);
       setHwqdMx(newHwqdData);
     } else {
       setHwqdMx([...hwqdMx, newData]);
     }
   };
 
   // 行 onchange
   const handleRowOnchange = (param: any) => {
     const { dataIndex } = param;
     // 调整金额 计算单价和税额
     if (dataIndex === 'je') {
       const je = Number(form.getFieldValue('je') || '0.00').toFixed(2);
       const sl = Number(form.getFieldValue('sl') || '0.00000').toFixed(5);
       const dj = jsDj(Number(sl), Number(je));
       let sl1 = form.getFieldValue('sl1');
       let tmpSl1: number = 0;
       if (sl1 != '免税' && sl1 != '不征税' && sl1!=null) {
         if(sl1.indexOf('%') >-1){
           sl1 = sl1.replace('%','') / 100;
         }
         tmpSl1 = Number(sl1);
       }
       const se = jsSe(Number(je), tmpSl1);
       form.setFieldsValue({
         dj: dj,
         se: se
       });
     }
     // 调整数量 计算单价
     if (dataIndex === 'sl') {
       const sl = Number(form.getFieldValue('sl') || '0.00000').toFixed(5);
       const je = Number(form.getFieldValue('je') || '0.00').toFixed(2);
       const dj = jsDj(Number(sl), Number(je));
       form.setFieldsValue({
         dj: dj,
       });
     }
     // 调整税率 计算税额
     if (dataIndex === 'sl1') {
       const je = Number(form.getFieldValue('je') || 0).toFixed(2);
       let sl1 = form.getFieldValue('sl1');
       let tmpSl1: number = 0;
       if (sl1 != '免税' && sl1 != '不征税' && sl1!=null) {
         if(sl1.indexOf('%') >-1){
           sl1 = sl1.replace('%','') / 100;
         }
         tmpSl1 = Number(sl1);
       }
       const se = jsSe(Number(je), tmpSl1);
       form.setFieldsValue({
         se: se,
       });
     }
   }
 
   // 税率格式化
   const renderSl = (text: any, fpssyhlxDm: any) => {
     //333
     if (text != undefined) {
       if (fpssyhlxDm === '1') {
         return '免税';
       } else if (fpssyhlxDm === '2') {
         return '不征税';
       } else {
         return text * 100 + '%';
       }
     } else {
       return null;
     }
   }
 
   // 设置编辑列
   const mergedColumns: any = columns.map((col: any) => {
     if (!col.editable) {
       return col;
     }
     return {
       ...col,
       onCell: (record: any, index: number) => {
         return {
           record,
           editType: col.editType,
           dataIndex: col.dataIndex,
           title: col.title,
           range: col.range,
           editing: isEditing(record),
           openSpmc: openSpmc,
           handleRowOnchange: handleRowOnchange,
           mklx: mklx,
           index,
         };
       }
     };
   });
 
   // 隐藏列
   const myColumns = mergedColumns.filter((col: any) => {
     return (!(col.hidden && col.hidden !== false));
   })
 
   // 获取滚动条限制，导入模板开具的纵向滚动条因有单据号影响 所以需要调整
   const getScroll = () => {
     let scroll: any = { x: '1100px', y: myUtil.heightCalc.getCalc(['header', 'cardMargin', '69px', '56px', '125px', '131px', '90px']) };
     if (mklx === 'MBDR' || mklx === 'MBCJ' || mklx === 'DRMBXG') {
       scroll = { x: '1100px', y: `${document.documentElement.clientHeight - 525}px` };
     }
     return scroll;
   }
 
   // 货物清单
   const huqdGridShow: any = <Form form={form} component={false}>
     <Table
       rowKey='uuid'
       dataSource={hwqdMx}
       columns={myColumns}
       pagination={false}
       components={{
         body: {
           cell: EditableCell.editableCell,
         },
       }}
       bordered
       scroll={getScroll()}
       summary={pageData => {
         let totalJe = 0;
         let totalSe = 0;
         pageData.forEach(({ je, se }) => {
           totalJe += Number(je) || 0;
           totalSe += Number(se) || 0;
         });
         let sum;
         if (hiddenYbje) {
           sum = <Table.Summary fixed key='sum'>
             <Table.Summary.Row>
               <Table.Summary.Cell index={0} className="center">合计</Table.Summary.Cell>
               <Table.Summary.Cell index={1}>&nbsp;</Table.Summary.Cell>
               <Table.Summary.Cell index={2}>&nbsp;</Table.Summary.Cell>
               <Table.Summary.Cell index={3}>&nbsp;</Table.Summary.Cell>
               <Table.Summary.Cell index={4}>&nbsp;</Table.Summary.Cell>
               <Table.Summary.Cell index={5} className="t_right">{myUtil.text.formatNum(totalJe, '0,0.00')}</Table.Summary.Cell>
               <Table.Summary.Cell index={6}>&nbsp;</Table.Summary.Cell>
               <Table.Summary.Cell index={7} className="t_right">{myUtil.text.formatNum(totalSe, '0,0.00')}</Table.Summary.Cell>
               <Table.Summary.Cell index={8}>&nbsp;</Table.Summary.Cell>
             </Table.Summary.Row>
           </Table.Summary >
         } else {
           sum = <Table.Summary fixed key='sum'>
             <Table.Summary.Row>
               <Table.Summary.Cell index={0} className="center">合计</Table.Summary.Cell>
               <Table.Summary.Cell index={1}>&nbsp;</Table.Summary.Cell>
               <Table.Summary.Cell index={2}>&nbsp;</Table.Summary.Cell>
               <Table.Summary.Cell index={3}>&nbsp;</Table.Summary.Cell>
               <Table.Summary.Cell index={4}>&nbsp;</Table.Summary.Cell>
               <Table.Summary.Cell index={5}>&nbsp;</Table.Summary.Cell>
               <Table.Summary.Cell index={6} className="t_right">{myUtil.text.formatNum(totalJe, '0,0.00')}</Table.Summary.Cell>
               <Table.Summary.Cell index={7}>&nbsp;</Table.Summary.Cell>
               <Table.Summary.Cell index={8} className="t_right">{myUtil.text.formatNum(totalSe, '0,0.00')}</Table.Summary.Cell>
               <Table.Summary.Cell index={9}>&nbsp;</Table.Summary.Cell>
             </Table.Summary.Row>
           </Table.Summary >
         }
         return sum;
       }}
     />
   </Form>;
 
   // 货物清单获取
   const setTabKey = () => {
     if (clickLinkFun) {
       clickLinkFun();
     }
   }
 
   // 货物清单
   const huqdGridDetail = <div style={{ overflowY: 'auto' }}>
     <table className="df_table df_table_hwqd_detail">
       <tbody>
         <tr>
           <td className="">商品名称</td>
           <td className="">规格型号</td>
           <td className="">单位</td>
           <td className="">数量</td>
           <td className="">单价（含税）</td>
           {hiddenYbje ? <></> : <><td className="">原币成交金额</td></>}
           <td className="">金额（含税）</td>
           <td className="">税率（%）</td>
           <td className="">税额</td>
         </tr>
         <tr>
           <td className="font_black" colSpan={hiddenYbje ? 5 : 6} style={{ height: `${document.documentElement.clientHeight - 800}px` }}>
             <a onClick={setTabKey} >详见货物清单</a>
           </td>
           <td className="font_text" >{myUtil.text.formatNum(jeHj, '0,0.00')}</td>
           <td className="font_text" ></td>
           <td className="font_text" >{myUtil.text.formatNum(seHj, '0,0.00')}</td>
         </tr>
         <tr>
           <td className="font_hj" colSpan={hiddenYbje ? 5 : 6} >合计</td>
           <td className="font_text_hj" >{myUtil.text.formatNum(jeHj, '0,0.00')}</td>
           <td className="font_text_hj" />
           <td className="font_text_hj" >{myUtil.text.formatNum(seHj, '0,0.00')}</td>
         </tr>
       </tbody>
     </table>
   </div>;
 
   // 开启商品赋码弹窗
   function openSpmc(record: any) {
     if (mklx === 'MBDR' && isFpsqd != '1' || mklx === 'MBCJ' && isFpsqd != '1') {
       if(mklx === 'MBDR' && record?.zbuuid) {
         // 导入模板开具的修改
         wxspglfmRef.current!.showModal({ data: record, mainRef: onRef, zslx: 'fpsqd' });
       } else {
         drawerQtspqtspglRef.current!.showModal({ data: record, mainRef: onRef });
       }
     } else {
       wxspglfmRef.current!.showModal({ data: record, mainRef: onRef, zslx: 'fpsqd' });
     }
   }
 
   // 赋码选中值回写
   const CallbackFmFunc = (param: any) => {
     const { record, hwxx, fmMainRef } = param;
     const newData = [...hwqdMx];
     const index = newData.findIndex((item) => hwxx.uuid === item.uuid);
     const item = newData[index];
     if (item.hasOwnProperty('hwhlwjcBak')) {
       item.hwhlwjc = record.hwhlwjc;
     } else {
       item.hwhlwjcBak = item.hwhlwjc;
       item.hwhlwjc = record.hwhlwjc;
       item.sphfwssflhbbm = record.sphfwssflhbbm;
     }
     newData.splice(index, 1, item);
     setHwqdMx(newData);
     message.success(intl.formatMessage({ id: 'message_ckfp_fppz_fm_success' }));
     // 关闭赋码弹窗
     fmMainRef.current.closeModal();
   }
 
   // 导入模板开具赋码回显
   const drmbkjFmhx = (record: any, hwxx: any) => {
     //444
     const newData = [...hwqdMx];
     const index = newData.findIndex((item) => hwxx.uuid === item.uuid);
     const item = newData[index];
     if (item.hasOwnProperty('hwhlwjcBak')) {
       item.hwhlwjc = record.hwhlwmc;
       item.sphfwssflhbbm = record.sphfwssflhbbm;
       item.hsbz1 = record.hsbz1;
       item.syyhzcbz = record.syyhzcbz;
       item.fpssyhlxDm = record.fpssyhlxDm;
       item.lsllxDm = record.lsllxDm;
     } else {
       item.hwhlwjcBak = item.hwhlwjc ? item.hwhlwjc : '';
       item.hwhlwjc = record.hwhlwmc;
       item.sphfwssflhbbmBak = item.sphfwssflhbbm;
       item.sphfwssflhbbm = record.sphfwssflhbbm;
       item.hsbz1Bak = item.hsbz1;
       item.hsbz1 = record.hsbz1;
       item.syyhzcbzBak = item.syyhzcbz;
       item.syyhzcbz = record.syyhzcbz;
       item.fpssyhlxDmBak = item.fpssyhlxDm;
       item.fpssyhlxDm = record.fpssyhlxDm;
       item.lsllxDmBak = item.lsllxDm
       item.lsllxDm = record.lsllxDm;
     }
 
     let tempSl = '0';
     if (record.sl1 === 0) {
       if (record.fpssyhlxDm === '1') {
         tempSl = '免税'
       } else if (record.fpssyhlxDm === '2') {
         tempSl = '不征税'
       }
     } else {
       tempSl = record.sl1? record.sl1.toString():null;
     }
     // 商品名称、规格型号、计量单位名称、税率回显
     form.setFieldsValue({
       hwhyslwmc: record.hwhyslwmc,
       ggxh: record.ggxh,
       jldwmc: record.jldwmc,
       sl1: tempSl,
     });
     newData.splice(index, 1, item);
     setHwqdMx(newData);
   }
 
   useImperativeHandle(onRef, () => {
     return {
       CallbackFmFunc,
       handleSave,
       drmbkjFmhx,
     };
   });
 
   // 查询购买方下拉数据
   const queryGhfnsrmcList = async (params: any) => {
     const result = await queryParams(params);
     if (result.code === '200') {
       return result.body;
     } else {
       return [];
     }
   }
 
   // 设置购买方
   const handleChangeCompany = (value: any, list: any) => {
     if (list.constructor === Array) {
       list.forEach((item: any) => {
         if (item.ghfnsrmc === value) {
           const ghfdzdh = (item.ghfdz ? item.ghfdz : '') + ' ' + (item.ghflxdh ? item.ghflxdh : '');
           const ghfkhhjzh = (item.ghfkhyxmc ? item.ghfkhyxmc : '') + ' ' + (item.ghfyhzh ? item.ghfyhzh : '');
           const tmpGmf: any = {
             ghfnsrmc: item.ghfnsrmc,
             ghfnsrsbh: item.ghfshxydm,
             ghfdzdh: ghfdzdh,
             ghfkhhjzh: ghfkhhjzh
           };
           setGmf(tmpGmf);
           formGmf.setFieldsValue(tmpGmf);
         }
       });
     } else {
       const ghfdzdh = (list.ghfdz ? list.ghfdz : '') + ' ' + (list.ghflxdh ? list.ghflxdh : '');
       const ghfkhhjzh = (list.ghfkhyxmc ? list.ghfkhyxmc : '') + ' ' + (list.ghfyhzh ? list.ghfyhzh : '');
       const tmpGmf: any = {
         ghfnsrmc: list.ghfnsrmc,
         ghfnsrsbh: list.ghfshxydm,
         ghfdzdh: ghfdzdh,
         ghfkhhjzh: ghfkhhjzh
       };
       setGmf(tmpGmf);
       formGmf.setFieldsValue(tmpGmf);
     }
   }
 
   // 计算税额 = 金额 / (1 + 税率) * 税率
   const jsSe = (je: number, sl1: number) => {
     return (Number(je / (1 + sl1) * (sl1)) || 0).toFixed(2);
   }
 
   // 计算单价 = 金额 / 数量
   const jsDj = (sl: number, je: number) => {
     if (sl === 0) {
       return (0).toFixed(6);
     }
     return (Number(je / sl) || 0).toFixed(6);
   }
 
   // 处理货物清单数量及展示方式
   const dealHwqd = (param: any) => {
     const length = param?.length || 0;
     setHwqdsl(length);
     let tmpJe: any = 0;
     let tmpSe: any = 0;
     param.forEach((item: any) => {
       if (!item.uuid.startsWith('rowkey')) {
         tmpJe += Number(item.je) || 0;
         tmpSe += Number(item.se) || 0;
       }
     });
     setJeHj(tmpJe);
     setSeHj(tmpSe);
     setHwqdMx(param);
   }
 
   useEffect(() => {
     setEditingKey('');
     if (data?.hw?.length > 0) {
       dealHwqd(data?.hw);
     } else {
       setJeHj(0);
       setSeHj(0);
       setHwqdMx(data?.hw);
     }
     const tmpGmf: any = {
       ghfnsrmc: data?.fpsqdxx?.ghfnsrmc,
       ghfnsrsbh: data?.fpsqdxx?.ghfnsrsbh,
       ghfdzdh: data?.fpsqdxx?.ghfdzdh,
       ghfkhhjzh: data?.fpsqdxx?.ghfkhhjzh
     };
     setGmf(tmpGmf);
     formGmf.setFieldsValue(tmpGmf);
     formBz.setFieldsValue({ bz: data?.fpsqdxx?.bz });
     formPerson.setFieldsValue({
       skr: data?.fpsqdxx?.skr,
       fhrxm: data?.fpsqdxx?.fhrxm,
       kpr: data?.fpsqdxx?.kpr,
       zbuuid: data?.fpsqdxx?.zbuuid,
       pzsjlyDm: data?.fpsqdxx?.pzsjlyDm
     });
   }, [data, mklx]);
 
 
   return (
     <div className="dd_fp">
       <Form form={formGmf} initialValues={data?.fpsqdxx || {}}>
         <table className="df_table">
           <tbody>
             <tr key='ghfnsrmc'>
               <td className="vertical" rowSpan={4} width="30px">购买方</td>
               <td width="110px">名称：</td>
               <td className={`bbc ${readonly ? '' : 'edit_bg1'} font_black`}>
                 {readonly ? <>
                   <Typography.Paragraph ellipsis={true}>
                     <Tooltip title={data?.fpsqdxx?.ghfnsrmc}>
                       {data?.fpsqdxx?.ghfnsrmc}
                     </Tooltip>
                   </Typography.Paragraph>
                 </> : <>
                   <Form.Item name="ghfnsrmc" rules={[{ required: true, message: '请输入名称!' }]}>
                     <Select onChange={handleChangeCompany} options={gmfxx} />
                   </Form.Item>
                 </>}
               </td>
               <td className="vertical" rowSpan={4} width="30px">销售方</td>
               <td width="110px">名称</td>
               <td className="bbc font_black">
                 <Typography.Paragraph ellipsis={true}>
                   <Tooltip title={data?.fpsqdxx?.xhfnsrmc}>
                     {data?.fpsqdxx?.xhfnsrmc}
                   </Tooltip>
                 </Typography.Paragraph>
               </td>
             </tr>
             <tr key='ghfnsrsbh'>
               <td>纳税人识别号：</td>
               <td className='bbc font_black'>
                 <Typography.Paragraph ellipsis={true}>
                   <Tooltip title={gmf?.ghfnsrsbh}>
                     {gmf?.ghfnsrsbh}
                   </Tooltip>
                 </Typography.Paragraph>
               </td>
               <td>纳税人识别号：</td>
               <td className="bbc font_black">
                 <Typography.Paragraph ellipsis={true}>
                   <Tooltip title={data?.fpsqdxx?.xhfnsrsbh}>
                     {data?.fpsqdxx?.xhfnsrsbh}
                   </Tooltip>
                 </Typography.Paragraph>
               </td>
             </tr>
             <tr key='ghfdzdh'>
               <td>地址 、电话：</td>
               <td className='bbc font_black'>
                 <Typography.Paragraph ellipsis={true}>
                   <Tooltip title={gmf?.ghfdzdh === 'null null' ? '' : gmf?.ghfdzdh}>
                     {gmf?.ghfdzdh === 'null null' ? '' : gmf?.ghfdzdh}
                   </Tooltip>
                 </Typography.Paragraph>
               </td>
               <td>地址 、电话：</td>
               <td className="bbc font_black">
                 <Typography.Paragraph ellipsis={true}>
                   <Tooltip title={data?.fpsqdxx?.xhfdzdh === 'null null' ? '' : data?.fpsqdxx?.xhfdzdh}>
                     {data?.fpsqdxx?.xhfdzdh === 'null null' ? '' : data?.fpsqdxx?.xhfdzdh}
                   </Tooltip>
                 </Typography.Paragraph>
               </td>
             </tr>
             <tr key='khhzh'>
               <td>开户行及账号：</td>
               <td className='font_black'>
                 <Typography.Paragraph ellipsis={true}>
                   <Tooltip title={gmf?.ghfkhhjzh === 'null null' ? '' : gmf?.ghfkhhjzh}>
                     {gmf?.ghfkhhjzh === 'null null' ? '' : gmf?.ghfkhhjzh}
                   </Tooltip>
                 </Typography.Paragraph>
               </td>
               <td>开户行及账号：</td>
               <td className="font_black">
                 <Typography.Paragraph ellipsis={true}>
                   <Tooltip title={data?.fpsqdxx?.xhfkhhjzh === 'null null' ? '' : data?.fpsqdxx?.xhfkhhjzh}>
                     {data?.fpsqdxx?.xhfkhhjzh === 'null null' ? '' : data?.fpsqdxx?.xhfkhhjzh}
                   </Tooltip>
                 </Typography.Paragraph>
               </td>
             </tr>
           </tbody>
         </table>
       </Form>
       {mklx === "FPSQD" ?
         <>{hwqdsl > 8 ? <>
           {huqdGridDetail}
         </> : <>
           {huqdGridShow}
         </>}</>
         : <>{huqdGridShow}</>}
       <div className="df_sum">
         <div className="dft_left">
           <span>价税合计（大写）</span>
           <span className="font_black">{myUtil.text.formatUp(Number(jeHj).toFixed(2))}</span>
         </div>
         <div className="dft_right">
           <span>（小写）</span>
           <span className="font_black">¥{myUtil.text.formatNum(jeHj, '0,0.00')}</span>
         </div>
       </div>
       <table className="df_table">
         <tbody>
           <tr>
             <td className="vertical" width="30px" height={'auto'}>备注</td>
             <td className={`${readonly ? '' : 'edit_bg1'} font_black`}>
               {readonly ? <>
                 {data?.fpsqdxx?.bz}
               </> : <>
                 <Form form={formBz} >
                   <Form.Item name="bz">
                     <Input.TextArea autoSize={{ minRows: 3, maxRows: 3 }} />
                   </Form.Item>
                 </Form>
               </>}
             </td>
           </tr>
         </tbody>
       </table>
       <div className="df_bottom">
         {readonly ? <>
           <Space size={80}>
             <Typography.Paragraph ellipsis={true}> 收款人：{data?.fpsqdxx?.skr} </Typography.Paragraph>
             <Typography.Paragraph ellipsis={true}> 复核人：{data?.fpsqdxx?.fhrxm} </Typography.Paragraph>
             <Typography.Paragraph ellipsis={true}> 开票人：{data?.fpsqdxx?.kpr} </Typography.Paragraph>
           </Space>
         </> : <>
           <Form form={formPerson} layout="inline">
             <Form.Item label="收款人" name="skr" rules={[{ required: false, message: '请输入收款人!' }]}>
               <Input placeholder="请输入收款人" autoComplete="off" style={{ width: '120px' }} />
             </Form.Item>
             <Form.Item label="复核人" name="fhrxm" rules={[{ required: false, message: '请输入复核人!' }]}>
               <Input placeholder="请输入复核人" autoComplete="off" style={{ width: '120px' }} />
             </Form.Item>
             <Form.Item label="开票人" name="kpr" rules={[{ required: true, message: '请输入开票人!' }]}>
               <Input placeholder="请输入开票人" autoComplete="off" style={{ width: '120px' }} />
             </Form.Item>
             <Form.Item name="zbuuid" hidden>
               <Input />
             </Form.Item>
             <Form.Item name="pzsjlyDm" hidden>
               <Input />
             </Form.Item>
           </Form>
         </>}
       </div>
       <Drawerqtspqtspgl onRef={drawerQtspqtspglRef} />
       <Wxspglfm onRef={wxspglfmRef} />
       {/* {mklx === 'MBDR' && isFpsqd != '1'  || mklx === 'MBCJ' && isFpsqd != '1' ? <><Drawerqtspqtspgl onRef={drawerQtspqtspglRef} /></> : <> <Wxspglfm onRef={wxspglfmRef} /></>} */}
     </div >
   );
 };
 
 export default Invoice;