import cktsUtil from '@/pages/hts/cktsUtil';
 import React, { useEffect,useImperativeHandle, useState} from 'react';
import { Modal, Button, Form, Input, Select} from 'antd';
import businessValidator from '@/pages/hts/common/field/businessValidator';
import CONSTANTS from '@/components/DDAssist/constants';
 import { queryCjCsh, queryCjGlh, mtsDlzmToTssb, mdtDlzmToTssb, checkSsqYsbCj } from '@/pages/hts/services/htsApi';
 import { message,} from 'antd';
import myUtil from '@/components/DDAssist/util';
 import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { intl as intl2 } from '@/components/DDAssist/util';

 
 export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
 }

 
 const Scmx: React.FC<DDModalGridProps> = ({
   visible = false,
   onRef,
 }) => {
   const [form] = Form.useForm();
   const [cparam, setCparam] = useState<any>();
   const [modalVisible, setModalVisible] = useState<boolean>(visible);
   const [ywlxData, setYwlxData] = useState<any>([]);
  const qylx = cktsUtil.sys.enterpriseType();
   // 开启
   const showModal = (param:any) => {
     setCparam(param);
     setModalVisible(true);
     getInitParam();
   };
 
   useEffect(() => {
    const promiseArr: any = [myUtil.code.getCodeFromServerT1('code_dm_ckts_cktmsywlx:06')];
    Promise.all(promiseArr).then(() => {
      // do nothing
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      const tmpCodeTable: any = myUtil.code.getSelectOption('code_dm_ckts_cktmsywlx', '06');
      setYwlxData(tmpCodeTable);
    });
  }, []);
   
   useImperativeHandle(onRef, () => {
     return {
       showModal,
     };
   });
 
  // 获取默认参数
  const getInitParam = () => {
     //请求默认参数
     var obj = {"tableKey":"MTS_ZXSB_SB_MTS_TSSB_G"};
     queryCjCsh(obj).then((res: any) => {
      const {code, body, desc} = res;
      if(code == '200') {
        form.setFieldsValue(body)
        let data ={ssq:'',sbpc:''};
        data.ssq = body?.ssq;
        data.sbpc = body?.sbpc;
        if(qylx == 'WM') {
          queryCjGlh(data).then((res: any)=>{
            const {code, body, desc} = res;
            if(code === '200') {
              form.setFieldsValue({glh:body?.glh})
            }else{
              message.error(desc)
            }
          })
        }
      } else {
        message.error(desc)
      }
    });
  }
   //保存
   const onOk = async () => {
    var params = await form.validateFields();
    params.uuids = cparam.selectionRowKeys; 
    if(params?.cktmsywlxdmjh?.length > 0){
     var str = params?.cktmsywlxdmjh?.join(',');
     params.cktmsywlxdmjh = str;
    }else{
      params.cktmsywlxdmjh="";
    }
    
    if('WM' === qylx){
      await mtsDlzmToTssb(params).then((res: any)=>{
        const {code, body, msg} = res;
        if(code === '200') {
          message.success(body)
        }else{
          message.error(msg)
        }
      })
    }else{
      await mdtDlzmToTssb(params).then((res: any)=>{
        const {code, body,msg} = res;
        if(code === '200') {
          message.success(body)
        }else{
          message.error(msg)
        }
      })
    }
    close();
    cparam?.unitRef?.current?.reload2();
  };


   const blursbxh = (param:any) => {
    var sbxh = myUtil.text.leadingZeroize(param?.target?.value, 8);
    form.setFieldsValue({sbxh:sbxh});
   }
   const blurpc = (param:any) => {
    var sbpc = myUtil.text.leadingZeroize(param?.target?.value, 3);
    let data ={ssq:'',sbpc:''};
    data.ssq = form.getFieldsValue()?.ssq;
    data.sbpc = sbpc;
    queryCjGlh(data).then((res: any)=>{
      const {code, body, desc} = res;
      if(code === '200') {
        form.setFieldsValue({glh:body?.glh,sbpc:sbpc})
      }else{
        message.error(desc)
      }
    })
   }
   const blurssq = async (param:any) => {
    var ssq = param?.target?.value;
    if(qylx == 'WM') {
      let data ={ssq:'',sbpc:''};
      data.ssq = ssq;
      data.sbpc = form.getFieldsValue()?.sbpc;
      await queryCjGlh(data).then((res: any)=>{
        const {code, body, desc} = res;
        if(code === '200') {
          form.setFieldsValue({glh:body?.glh,ssq:ssq})
        }else{
          message.error(desc)
        }
      })
    }
  }
   
  // 关闭
  const close = () => {
    setModalVisible(false);
    form.setFieldsValue({ssq:'',sbpc:'',sbxh:'',glh:'',ckfph:'',cktmsywlxdmjh:[]});
  };

  const validatorFlag = {
    ckfph: (form: any) => {
      const validator = async (_rule: any, value: any) => {
        if (value && /[\u4E00-\u9FA5]/g.test(value) || value && /\s/.test(value)) {
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_english_number_symbol' })));
        } else {
          return Promise.resolve();
        }
      }
      return { validator };
    },
  }
  
   return (
     <>
       <Modal
         title='生成明细'
         destroyOnHidden={true}
         open={modalVisible}
         width={CONSTANTS.C_MODAL_WIDTH_X2}
         footer={(<>
           <Button onClick={close} >取消</Button>
           <Button onClick={onOk} type="primary">确定</Button>
         </>)}
         onCancel={() => setModalVisible(false)}
       >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 12}}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          
          <Form.Item label="所属期" name="ssq" rules={[{ required: true, message: '' },businessValidator.ssq(),businessValidator.ssq02(form)]}  >
            <Input placeholder="请输入所属期" maxLength={6}  onBlur={blurssq}/>
          </Form.Item>
          {qylx=='WM'?
           <Form.Item label="批次" name="sbpc" rules={[{ required: true, message: '' },businessValidator.sbpc(form)]} >
            <Input placeholder="请输入批次"  maxLength={3} onBlur={blurpc} />
          </Form.Item> 
          :<></>
           }
          <Form.Item label="申报序号" name="sbxh" rules={[{ required: true, message: '' },businessValidator.sbxh()]} >
            <Input placeholder="申报序号"  onBlur={blursbxh} />
          </Form.Item> 
           {qylx=='WM'?
          <Form.Item label="关联号" name="glh" rules={[{ required: true, message: '' },businessValidator.glh(form)]} >
            <Input placeholder="关联号"  />
          </Form.Item> :<></>}
          <Form.Item label="出口发票号" name="ckfph" rules={[{ required: true, message: '该项内容为必填项不能为空！' }, validatorFlag.ckfph]} >
            <Input placeholder="出口发票号"  maxLength={30}/>
          </Form.Item> 
          <Form.Item name="cktmsywlxdmjh" label="业务类型代码"  rules={[
              () => ({
                validator(_, value) {
                  if (value && value.length > 3) {
                    return Promise.reject(new Error('最多选择3项业务类型代码！'));
                  }
                  return Promise.resolve();
                },
              })
            ]} >
              <Select mode="multiple" maxTagCount={3} >
                {ywlxData.map((item: any) => (
                  <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
         </Form>
       </Modal>
     </>
   );
 };
 
 export default Scmx;