/**
 *转明细采集
 */
import formUtil from '@/components/DDForm/formUtil';
import React, { useImperativeHandle, useState} from 'react';
import { byblzzmcjByIds } from '@/pages/hts/services/htsApi';
import { Modal,message,Form,Spin,Table} from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import UnitUtil from '@/components/DDBunit/unit_util';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import DDAlert from '@/pages/hts/components/DDAlert';

export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
}
const Zmxcj: React.FC<DDModalGridProps> = ({ onRef, visible = false }) => {
  //全局变量页面开关
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [masker, setMasker] = useState<boolean>(false);
  //Form
  const [form] = Form.useForm();
  const [selectionRows, setSelectionRows] = useState<any>();
  const [ywType, setywType] = useState<any>();
  const [unitRef, setunitRef] = useState<any>();
  
  
  //绑定组件
  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 开启页面，并设置参数
  const showModal = (param: any, selectionRows: any,ywType: any,unitRef:any) => {
    setModalVisible(true);
     //初始化参数
    initFuncByJcxx(param);
    setSelectionRows(selectionRows);
    setywType(ywType)
    setunitRef(unitRef);
  };

  
  const columns = [
    { title: '报关单号', dataIndex: 'ckbgdh', key: 'ckbgdh', width: '180px', ellipsis: true },
  ];

   //调用后端接口基础信息初始化赋值
   const initFuncByJcxx = (body: any) => {
    form.setFieldsValue({
      ssq: body.ssq,
      sbpc: body.sbpc,
      glh: body.glh
    });
  }
  

  // 确定
  const handleSave = () => {
    form.validateFields().then(values => {
      setMasker(true);
      let glhArr: any[] = [];
      let ckbgdhArr: any[] = [];
      let uuids: any[] = [];
      selectionRows.forEach((item: any) => {
        if(ywType === "MTS"){
          if(item.ckbgdh){
            ckbgdhArr.push(item.ckbgdh);
          } else {
            ckbgdhArr.push(item.dlzmh);
          }
          uuids.push(item.uuid);
          glhArr.push(item.glh);
      } else {
        glhArr.push(item.glh);
        uuids.push(item.uuid);
      }
      });
      let tep = { uuids: uuids,glhs:glhArr,ckbgdhs:ckbgdhArr };
      const params = Object.assign(tep, values);
      byblzzmcjByIds(params).then((response) => {
        const { code, msg,body } = response;
        if (code === '200') {
          unitRef.current!.reload2();
          message.success(body);
          setMasker(false);
          setModalVisible(false);
        }  else if (code == '900') {
          setMasker(false);
          setModalVisible(false);
          DDAlert.open({
            title: '系统提示',
            isShowcancelText: false,
            infoType: 'warning',
            modalType: 'form',
            closeStatus: false,
            width: CONSTANTS.C_MODAL_WIDTH_X1,
            isFormContent: false,
            okCallbackFn: async function (thisObj: any) {
              DDAlert.close();
            },
            content: <>
              <div>以下报关单号在明细采集中已存在，无法转入明细采集。</div>
              <br/>
              <Table dataSource={body} columns={columns} size="small" />
            </>
          })
        } else {
          setMasker(false);
          setModalVisible(false);
          message.error(msg);
        }
      });
    })
  }
  
  const getFormItems = () => {
    // 共同方法集合
    const Func = {
      eventOnChange: {
        // 所属期
        ssq: (param: any) => {
          const { form } = param;
          const ssq = form?.getFieldsValue().ssq;
          const sbpc = form?.getFieldsValue().sbpc;
          const glh = form?.getFieldsValue().glh;
          if (ssq && sbpc) {
            if (glh) {
              form.setFieldsValue({ glh: ssq + sbpc + glh.substring(glh.length - 8, glh.length) });
            } else {
              form.setFieldsValue({ glh: ssq + sbpc + '00000001' });
            }
          }
        },
        // 申报批次
        sbpc: (param: any) => {
          const { form } = param;
          const ssq = form?.getFieldsValue().ssq;
          const sbpc = form?.getFieldsValue().sbpc;
          const glh = form?.getFieldsValue().glh;
          if (ssq && sbpc) {
            if (glh) {
              form.setFieldsValue({ glh: ssq + sbpc + glh.substring(glh.length - 8, glh.length) });
            } else {
              form.setFieldsValue({ glh: ssq + sbpc + '00000001' });
            }
          }
        },
      },

      validator : {
        // 申报批次
        sbpc01: (form: any) => {
          return DditCktsFormCommonFunc.validator.sbpc01(form);
        },
        // 申报批次
        sbpc02: (form: any) => {
          return DditCktsFormCommonFunc.validator.sbpc02(form);
        },
        // 申报序号
        sbxh02: (form: any) => {
          return DditCktsFormCommonFunc.validator.sbxh02(form);
        },
      },
    }
    const myFormItems = [];
    myFormItems.push({ label: '申报年月', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}] ,eventOnChange: 'ssq'
    });
    myFormItems.push({ label: '申报批次', name: 'sbpc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbpc01' }, { func: 'sbpc02' }], eventOnChange: 'sbpc' });
    myFormItems.push({ label: '起始关联号', name: 'glh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_string', range: [0, 17]}] });
    const formItems: any = formUtil.init({
      items: myFormItems,
      func: Func,
    });
    return formItems;
  }

  return (
    <>
      <Modal
        title="转明细采集"
        centered
        destroyOnHidden
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X1}
        okText="确定"
        cancelText="取消"
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        zIndex={1001}
        mask={{ closable: false }}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
        <div>
        <DDBaseForm items={getFormItems()} form={form} initialValues={{}} layoutType='vertical' />
        </div>
        <div>温馨提示：仅对不予办理的数据支持转明细采集</div>
        </Spin>
      </Modal>
    </>
  );
};

export default Zmxcj;