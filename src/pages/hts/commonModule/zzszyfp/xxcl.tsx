/**
 * 按报关单开具  设置税收分类编码
 */
 import React, { useImperativeHandle, useState, useContext, useEffect } from 'react';
import { Modal, Button, message, Input, Form, Table, DatePicker, InputNumber, Spin } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
 import {queryFp2Ckznx, querySpdmXxCj, saveFp2Ckznx } from '@/pages/hts/services/htsApi';
 import { useIntl } from 'umi';
import myUtil from '@/components/DDAssist/util';
 import moment from 'moment';

 
 const EditableContext = React.createContext(null);
 
 const EditableCell = ({
   title,
   editable,
   children,
   dataIndex,
   record,
   handleSave,
   editType,
   ssflbmList,
   modalData,
   selectChange,
   index,
   type,
   ...restProps
 }) => {
   const form: any = useContext(EditableContext);
 
   useEffect(() => {
     form.setFieldsValue(record);
   }, []);
 
   const save = (e: any) => {
     if (dataIndex == 'ckspDm') {
       const values = e.currentTarget.value;
       handleSave({ ...record }, form, values, dataIndex);
       return;
     }
     if (dataIndex == 'ghsl') {
      const values = e.currentTarget.value;
       handleSave({ ...record }, form, values, dataIndex);
       return;
     }
     if (dataIndex == 'tzhtsl') {
       const values = e.currentTarget.value;
       handleSave({ ...record }, form, values, dataIndex);
       return;
     }
     if (dataIndex == 'xhpzh') {
      const values = e.currentTarget.value;
      handleSave({ ...record }, form, values, dataIndex);
      return;
    }
    if (dataIndex == 'nxsl') {
      const values = e.currentTarget.value;
      handleSave({ ...record }, form, values, dataIndex);
      return;
    }
    if (dataIndex == 'nxkprq') {
      const values = e;
      handleSave({ ...record }, form, values, dataIndex);
      return;
    }
    
   };
 
 
 
   const dateFormat = 'YYYY/MM/DD';
   let childNode = children;
   if (editable) {
    if (editType === 'Input' && dataIndex === 'ckspDm') {
      childNode =
        <Form.Item name={dataIndex} style={{ margin: 0 }} rules={[{ required: true, message: '出口商品代码' }]} >
          <Input onPressEnter={save} onBlur={save} />
        </Form.Item>;
    }
     if (editType === 'Input' && dataIndex === 'ghsl') {
       childNode =
         <Form.Item name={dataIndex} style={{ margin: 0 }} rules={[{ required: true, message: '请填写调整购货数量	！' },]} >
           <Input onPressEnter={save} onBlur={save} />
         </Form.Item>;
     }
     if (editType === 'Input' && dataIndex === 'ckspmc') {
       childNode =
         <Form.Item name={dataIndex} style={{ margin: 0 }} rules={[{ required: true, message: '请输入调整后商品代码' }]} >
           <Input onPressEnter={save} onBlur={save} />
         </Form.Item>;
     }
     if (editType === 'Input' && dataIndex === 'xhpzh') {
       childNode =
         <Form.Item name={dataIndex} style={{ margin: 0 }}  >
           <Input onPressEnter={save} onBlur={save} />
         </Form.Item>;
     }
     if (editType === 'DatePicker' && dataIndex === 'nxkprq') {
      childNode =
        <Form.Item name={dataIndex}  style={{ margin: 0 }}>
          <DatePicker onChange={save}/>
        </Form.Item>;
    }
    if (editType === 'InputNumber' && dataIndex === 'nxsl') {
      childNode =
        <Form.Item name={dataIndex} style={{ margin: 0 }} rules={[
          () => ({
            validator(_, value) {
              if (isNaN(value)) {
                return Promise.reject(new Error('该项必须录入数字'));
              } else {
                if (Number(value) <= 0) {
                  return Promise.reject(new Error('该项只能录入正数'));
                }
              }
              if (Number(value) > Number(record.ghsl)) {
                return Promise.reject(new Error('转内销数量不应大于购货数量！'));
              }
              return Promise.resolve();
            },
          }),
        ]}>
          <Input onPressEnter={save} onBlur={save}/>
        </Form.Item>;
    }
    if (type === 'fpscmx') {
      if (editType === 'Input' && dataIndex === 'ghje') {
        childNode =
          <Form.Item name={dataIndex} style={{ margin: 0 }} rules={[{ required: true, message: '请输入购货金额' },]} >
            <Input onPressEnter={save} onBlur={save} />
          </Form.Item>;
      }
      if (editType === 'Input' && dataIndex === 'ghzssl') {
        childNode =
          <Form.Item name={dataIndex} style={{ margin: 0 }} rules={[{ required: true, message: '请输入购货征税率' },]} >
            <Input onPressEnter={save} onBlur={save} />
          </Form.Item>;
      }
    }
   }
   return <td {...restProps}>{childNode}</td>;
 };
 
 
 export interface DDModalGridProps {
   onRef?: any;
   visible?: any;
 }
 
 const ModalSsflbm: React.FC<DDModalGridProps> = ({ onRef, visible = false }) => {
   const [modalVisible, setModalVisible] = useState<boolean>(visible);
 
   const [modalData, setModalData] = useState<any>([]); // 传递的数据
 
   const [mainGridRef, setMainGridRef] = useState<any>([]); //主列表Ref
   //后台请求过来申报年月
   const [sbny, setSbny] = useState<any>();
   const [form2] = Form.useForm();
   const [formList, setFormList] = useState<any>([]); // 税收分类编码集合
   const [func, setFunc] = useState<any>([]); // 税收分类编码集合
   const [type, setType] = useState<any>(''); // 引用的页面
   const [masker, setMasker] = useState<any>(false); // loading

   const intl = useIntl();
 
 
   // 开启
   const showModal = (param: any, formValues: any, selectRowKeys: any, Func: any, type?: any) => {
    setType(type);
    setFunc(Func);
    const formData = formValues;
    formData.uuids = selectRowKeys;
    formData.xhxx="";
    formData.znxyy="";
    setMasker(true)
    queryFp2Ckznx(formData).then((response) => {
      const { code, body, desc ,msg} = response;
      setMasker(false)
      if (code === '200') {
        setModalData(body);
      }else{
        setModalData([]);
        message.error(msg)
      }
    })

     setMainGridRef(param);
     setModalVisible(true);
     //请求后台获取设置所属期
     const sbnyRes = '202101';
     setSbny(sbnyRes);
     form2.setFieldsValue({
       'sbny': sbnyRes
     })
   };
 
   // 设置税收分类编码表格
   let columns = [];
  if (type === 'fpscmx') {
    columns = [
      { title: 'UUID', dataIndex: 'uuid', hidden: true },
      { title: '所属期', dataIndex: 'ssq', fixed: 'left', width: 80 },
      { title: '申报批次', dataIndex: 'sbpc', fixed: 'left', width: 80, },
      { title: '申报序号', dataIndex: 'sbxh', fixed: 'left', width: 100 },
      { title: '申报编号', dataIndex: 'sbbh1', width: 100,  },
      { title: '发票代码', dataIndex: 'fpDm', width: 100 , ellipsis: true },
      { title: '发票号码', dataIndex: 'fphm', width: 100, ellipsis: true },
      // { title: '商品代码', dataIndex: 'ckspDm', width: 140, editType: 'Input', editable: true },
      { title: '商品名称', dataIndex: 'ckspmc', width: 180, editType: 'Input', editable: true },
      { title: '购货数量', dataIndex: 'ghsl', width: 100, align: 'right', editable: true, editType: 'Input' },
      { title: '购货金额', dataIndex: 'ghje', editType: 'Input', editable: true, width: 130, align: 'right' },
      { title: '购货征税率', dataIndex: 'ghzssl', editType: 'Input', editable: true, width: 110, align: 'right' },
      { title: '内销情况_销货发票号', dataIndex: 'xhpzh', editType: 'Input', editable: true, width: 180, align: 'right' },
      { title: '内销情况_内销开票日期', dataIndex: 'nxkprq', editType: 'DatePicker', editable: true, width: 170 },
      { title: '内销情况_转内销数量', dataIndex: 'nxsl', editType: 'InputNumber', editable: true, width: 220, align: 'right' },
      { title: 'ghkprq', dataIndex: 'ghkprq', hidden: true },
    ]
  } else {
    columns = [
      { title: 'UUID', dataIndex: 'uuid', hidden: true },
      { title: '所属期', dataIndex: 'ssq', fixed: 'left', width: 80 },
      { title: '申报批次', dataIndex: 'sbpc', fixed: 'left', width: 80 },
      { title: '申报编号', dataIndex: 'sbbh1', fixed: 'left', width: 100 },
      { title: '发票代码', dataIndex: 'fpDm', width: 100 , ellipsis: true },
      { title: '发票号码', dataIndex: 'fphm', width: 100, ellipsis: true },
      { title: '商品代码', dataIndex: 'ckspDm', width: 140, editType: 'Input', editable: true },
      { title: '商品名称', dataIndex: 'ckspmc', width: 180, editType: 'Input', editable: true },
      { title: '购货数量', dataIndex: 'ghsl', width: 100, align: 'right', editable: true,editType: 'Input' },
      { title: '购货金额', dataIndex: 'ghje', editType: 'Input', editable: true, width: 130, align: 'right' },
      { title: '购货征税率', dataIndex: 'ghzssl', editType: 'Input', editable: true, width: 110, align: 'right' },
      { title: '内销情况_销货发票号', dataIndex: 'xhpzh', editType: 'Input', editable: true, width: 180, align: 'right' },
      { title: '内销情况_内销开票日期', dataIndex: 'nxkprq', editType: 'DatePicker', editable: true, width: 170 },
      { title: '内销情况_转内销数量', dataIndex: 'nxsl', editType: 'InputNumber', editable: true, width: 220, align: 'right' },
      { title: 'ghkprq', dataIndex: 'ghkprq', hidden: true },
    ]
  }
 
   // 隐藏列
   const myColumns = columns.filter((col: any) => {
     return (!(col.hidden && col.hidden !== false));
   })
 
   // 设置列
   const mergedColumns = myColumns.map((col) => {
     if (!col.editable) {
       return col;
     }
     return {
       ...col,
       onCell: (record: any, index: any) => ({
         record,
         editable: col.editable,
         dataIndex: col.dataIndex,
         title: col.title,
         editType: col.editType,
         handleSave: handleSave,
         index,
         type
       }),
     };
   });
 
 
 
   // 文本框调整
  const handleSave = async (param: any, form: any, value: any, dataIndex: any) => {
    let box=document.getElementById("boxtable");
    let v=box?.getElementsByClassName("ant-table-body")[0]
    const scrollNumber:any = v?.scrollTop;
    const newData = [...modalData];
    const index = newData.findIndex((item) => param.uuid === item.uuid);
    const ckrq = myUtil.grid.formatDate(newData[index].ghkprq, 'YYYY-MM-DD');
    if (dataIndex == 'ckspDm') {
      const obj = {"ssq":newData[index].ssq,"sbpc":newData[index].sbpc,"slType":"Y","ckrq1":ckrq,"ckspDm":value};
      //根据商品代码请求后台，查询商品名称
      setMasker(true)
      await querySpdmXxCj(obj).then((res: any) => {
        setMasker(false)
        const { code, body, desc ,msg} = res;
        if (code == '200') {
          param.ckspmc = body.sbhgspmc;
          param.ckspDm = value;
          if (type === 'fpscmx') {
            param.ghzssl = body.zssl ? myUtil.text.getNumVal(myUtil.text.formatNum(body.zssl, '0,0.00')) : '';
          }
        } else if(res.code == '900') {
          message.info(res.msg)
        } else {
          message.error(res.desc)
        }
      });

    }
    if(dataIndex == 'ghsl'){
      param.ghsl = value;
    }
    if (dataIndex == 'tzhtsl') {
      param.tzhtsl = value;
    }
    if (dataIndex == 'nxkprq') {
      param.nxkprq = value ? moment(new Date(value)) : '';
    }
    if(dataIndex == 'xhpzh'){
      param.xhpzh = value;
    }
    if(dataIndex == 'nxsl'){
      param.nxsl = myUtil.text.getNumVal(myUtil.text.formatNum(value, '0,0.00000'))
    }
    newData.splice(index, 1, param);
    await setModalData([{}]); // 字段有相同值时无法重新渲染，所以先置空
    setModalData(newData);
    // setTimeout(()=>{
      if(v){
        v.scrollTop = scrollNumber
      }
    // },500)
   };
 
   useImperativeHandle(onRef, () => {
     return {
       showModal,
     };
   });
 

 
 
   const saveModal = async () => {
     await form2.validateFields();
     for (let i = 0; i < formList.length; i++) {
       await formList[i].validateFields();
     }
     const data = modalData;
     const req = [];
     for(let i = 0; i < data.length; i++){
      const param1 = {};
      param1.baseXH = i+1;
      param1.ssq = data[i].ssq;
      param1.sbpc = data[i].sbpc;
      param1.sbxh = data[i].sbxh;
      param1.sbbh1 = data[i].sbbh1;
      param1.xh4 = data[i].xh4;
      param1.fpDm = data[i].fpDm;
      param1.fphm = data[i].fphm;
      param1.hh = data[i].hh;
      param1.ckspDm = data[i].ckspDm;
      param1.ckspmc = data[i].ckspmc;
      param1.hgjldwmc = data[i].hgjldwmc;
      param1.yghpzh = data[i].yghpzh;
      param1.ghkprq = data[i].ghkprq;
      param1.ghsl = data[i].ghsl;
      param1.ghje = data[i].ghje;
      param1.ghzssl = data[i].ghzssl;
      param1.xhpzh = data[i].xhpzh;
      param1.nxkprq = myUtil.grid.formatDate(data[i].nxkprq, 'YYYY-MM-DD');
      param1.nxsl = data[i].nxsl;
      param1.znxyy = data[i].znxyy;
      param1.kdkse = data[i].kdkse;
      param1.bz = data[i].bz;
      req.push(param1);
     }
     saveFp2Ckznx({"data":req}).then((res: any) => {
      const { code, body, desc ,msg} = res;
      if (code == '200') {
        message.info(body);
        setModalVisible(false);
        func.reload();
      } else if(res.code == '900') {
        message.info(res.msg)
      } else {
        message.error(res.desc)
      }
    });
   };
 
   return (
     <>
       <Modal
         title={type === 'fpscmx' ? "出口货物转内销信息列表处理" : "报关单生成商品码调整表"}
         destroyOnHidden={true}
         visible={modalVisible}
         width={CONSTANTS.C_MODAL_WIDTH_X4}
         wrapClassName="standard-modal-1"
         footer={
           <>
             <Button onClick={() => setModalVisible(false)}>取消</Button>
             <Button onClick={saveModal} type="primary">确定</Button>
           </>
         }
         onCancel={() => setModalVisible(false)}
       >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <Form form={form2}>
            <Table
              id="boxtable"
              components={{
                body: {
                  row: ({ index, ...props }) => {
                    const [form] = Form.useForm();
                    formList.push(form);
                    return (
                      <Form form={form} component={false}>
                        <EditableContext.Provider value={form}>
                          <tr {...props} />
                        </EditableContext.Provider>
                      </Form>
                    );
                  },
                  cell: EditableCell,
                }
              }}
              bordered
              dataSource={modalData}
              columns={mergedColumns}
              pagination={false}
              scroll={{ x: '1100px', y: `${document.documentElement.clientHeight - 170}px`}}
            />
          </Form>
         </Spin>
       </Modal>
     </>
   );
 };
 
 export default ModalSsflbm;
 