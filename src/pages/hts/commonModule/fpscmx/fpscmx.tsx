/**
 * 发票生成明细：外贸、生产、证明开具
 */
import formUtil from '@/components/DDForm/formUtil';
import React, { useEffect, useImperativeHandle, useState, useRef } from 'react';
import { Modal, Button, Form, message, Spin, } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import myUtil from '@/components/DDAssist/util';
import { itemType } from '@/components/DDForm/data.d';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import UnitUtil from '@/components/DDBunit/unit_util';
import businessValidator from '@/pages/hts/common/field/businessValidator';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import moment from 'moment';
import { useIntl } from 'umi';
import '@/pages/hts/commonModule/style.less';
import { queryCjCsh, saveCkznxMx } from '@/pages/hts/services/htsApi';
import formFunc from './f'

const Func: any = {
  unitRef: React.createRef()
}
export interface DDTsort {
  onRef?: any;
  visible?: any;
}

const Scmx: React.FC<DDTsort> = ({ onRef, visible = false }) => {
  const intl = useIntl();
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [scmxModalVisible, setScmxModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [myFormItems, setMyFormItems] = useState([]);
  const [initData, setInitData] = useState<any>([]); // 列表组件
  const [currentData, setCurrentData] = useState<any>([]); // 当前页列表组件
  const [selectRows, setSelectRows] = useState<any>([]);// 发票选中信息
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);// 发票选中信息
  const [masker, setMasker] = useState<boolean>(false);
  const [myConfig, setMyConfig] = useState<any>();

  // 开启
  const showModal = (param: any) => {
    setModalVisible(true);
    setInitData(param);
    getMyConfig();
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 确认生成明细
  const save = async () => {
    form.validateFields().then((formValues: any) => {
      // 表单特殊类型处理
      myFormItems.forEach((item: any) => {
        if (item.type === itemType.DatePicker && formValues[item.name]) {  // 日期类型
          formValues[item.name] = moment(formValues[item.name]).format('YYYY-MM-DD');
        }
        if (item.type === itemType.Select && item.mode === 'multiple') {
          if (formValues[item.name]) {
            formValues[item.name] = formValues[item.name].join(',');
          }
        }
        if (typeof formValues[item.name] === 'string') {
          formValues[item.name] = formValues[item.name]?.trim() || '';
        }
      })
      saveCkznxMx({ ...formValues, czlx: '3' }).then((response) => {
        const { code, desc, msg } = response;
        if (code === '200') {
          Func.reload();
          message.success('生成明细成功');
          setScmxModalVisible(false);
        } else if (code !== '200' && desc.trim()) {
          message.error(msg);
          return;
        }
      })
    })
  }

  // 发票信息配置
  const getMyConfig = () => {
    let configTmp: any = {
      grid_api_grid_query: `/yw/saas/sjgl/jxfpcx/queryKsyZzsfp`,
      gridIsInitSearch: false,
      grid_selection_type: false,
      grid_scroll_y: '450px',
      layout_type: 'modal',
      pageSizeOptions: [10, 20],
      grid_columns: [
        { title: 'UUID', dataIndex: 'uuid', hidden: true },
        { title: '单位', dataIndex: 'jldwmc', hidden: true },
        { title: '发票号码', dataIndex: 'fphm', width: 180, ellipsis: true },
        { title: '发票代码', dataIndex: 'fpDm', width: 120 },
        { title: '发票状态', dataIndex: 'fpztdc', width: 120 },
        { title: '发票行号', dataIndex: 'hh', width: 100 },
        { title: '开票日期', dataIndex: 'kprq', render: { type: 'date', format: 'yyyy-MM-DD' }, width: 120 },
        { title: '销方纳税号', dataIndex: 'xfnsrsbh', width: 180, ellipsis: true },
        { title: '商品名称', dataIndex: 'hwhyslwmc', width: 180, ellipsis: true },
        { title: '数量', dataIndex: 'sl3', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
        { title: '计税金额', dataIndex: 'je', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
        { title: '剩余金额', dataIndex: 'syje', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
        { title: '已占金额', dataIndex: 'yzje1', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } }
      ],
      grid_filter_quick: [
        { name: 'fphms', type: 'Input', label: '请输入发票号码后8位或后4位，多条以英文,隔开', width: '6w' },
        { name: 'hwhyslwmc', type: 'Input', label: '请输入商品名称', width: '4w', searchButton: true },
      ],
      handle_columns: [
        { name: '生成明细', key: 'scmx', func: 'scmx' },
      ]
    };
    setMyConfig(configTmp);
  }

  Func.reload = () => {
    currentData?.current?.reload2();
    initData?.unitRef?.current?.reload2();
  }
  Func.scmx = (param: any) => {
    const { record, unitRef } = param;
    const apiParam: any = {
      lcswsxDm: '',
      tableKey: 'ZMKJ_ZXSB_ZM_CKHWZNX_G',
    };
    setCurrentData(unitRef);
    queryCjCsh(apiParam).then((response) => {
      const { code, body } = response;
      if (code === '200') {
        const formValue = {
          ...record,
          czlx: '3',
          ssq: body.ssq,
          sbpc: body.sbpc,
          sbxh: body.sbxh,
          sbbh1: body.sbbh1,
          xh4: body.xh4,
          yghpzh: record.jhpzh,
          ghkprq: record.kprq,
          ckspmc: record.hwhyslwmc,
          ghsl: record.sl3,
          ghje: record.je,
          ghzssl: record.sl1,
          ghzsse: record.se,
          yzsl: record.yzsl,
          nxsl: record.nxsl,
          fpuuid: record.uuid,
          hgjldwmc: record.jldwmc,
        }
        delete formValue.uuid;
        myFormItems.forEach((item: any) => {
          if (formValue[item.name]?.constructor === String) {
            formValue[item.name] = formValue[item.name]?.trim() || '';
          }
          if (item.type === itemType.DatePicker && formValue[item.name]) {  // 日期类型
            const reg1 = /^((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))0229))$/;
            const reg2 = /^((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29))$/;
            if (new RegExp(reg1).test(formValue[item.name]) || new RegExp(reg2).test(formValue[item.name])) {
              // 后端返回 yyyymmdd
              formValue[item.name] = moment(new Date(formValue[item.name]))
            } else {
              // 后端返回时间戳格式
              if (formValue[item.name]?.constructor === String) {
                formValue[item.name] = moment(new Date(Number(formValue[item.name])));
              } else {
                formValue[item.name] = moment(new Date(formValue[item.name]));
              }
            }
          }
          if (item.type === itemType.InputNumber && formValue[item.name]?.constructor === String) {
            formValue[item.name] = Number(formValue[item.name]);
          }
          if (item.type === itemType.Input && formValue[item.name]?.constructor === String && (formValue[item.name] === null || formValue[item.name]?.trim() === '')) {
            formValue[item.name] = '';
          }
          if (item.type === itemType.Select && item.mode === 'multiple') {
            if (formValue[item.name]) {
              formValue[item.name] = formValue[item.name]?.split(',') || [];
            } else {
              formValue[item.name] = [];
            }
          }
        })
        form.setFieldsValue(formValue);
        setScmxModalVisible(true);
      }
      return;
    })
  }

  // 基本信息表单项
  const getFormItems: any = () => {
    const myFormItems: any = [
      { label: 'ID', name: 'uuid', type: 'Hidden', readOnly: true },
      { label: 'FPUUID', name: 'fpuuid', type: 'Hidden', readOnly: true },
      { label: 'HH', name: 'hh', type: 'Hidden', readOnly: true },
      { label: '已占数量', name: 'yzsl', type: 'Hidden', readOnly: true },
      { label: '内销数量', name: 'ynxsl', type: 'Hidden', readOnly: true },
      { label: '基本信息', name: 'jbxx', type: 'GroupTitle', readOnly: true },
      { label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq01' }], eventOnChange: 'ssq' },
      { label: '申报批次', name: 'sbpc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbpc02' }], eventOnBlur: 'sbpc' },
      /*{ label: '序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },*/
      { label: '编号', name: 'sbbh1', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_string', length: '10' }, { func: 'sbbh101' }, { func: 'sbbh102' }] },
      { label: '序号', name: 'xh4', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_string', range: [0, 2]}, { func: 'xh401' }], eventOnBlur: 'xh4' },
      { label: '发票信息', name: 'fpxx', type: 'GroupTitle', readOnly: true},
      { label: '原购进凭证号', name: 'yghpzh', type: 'Input', readOnly: true },
      { label: '购进开票日期', name: 'ghkprq', type: 'DatePicker', disabled: true, allowClear: true, format: 'yyyy-MM-DD' },
      { label: '商品代码', name: 'ckspDm', type: 'Input', readOnly: true },
      { label: '购进商品名称', name: 'ckspmc', type: 'Input', readOnly: true },
      { label: '购进数量', name: 'ghsl', type: 'InputNumber', readOnly: true, format: '0,0.00000' },
      { label: '购进金额', name: 'ghje', type: 'InputNumber', readOnly: true, format: '0,0.00' },
      { label: '购进征税率', name: 'ghzssl', type: 'InputNumber', readOnly: true, format: '0,0.00000' },
      { label: '购进税额', name: 'ghzsse', type: 'InputNumber', readOnly: true, format: '0,0.00' },
      { label: '销货信息', name: 'xhxx', type: 'GroupTitle', readOnly: true},
      { label: '内销情况_销货发票号', name: 'xhpzh', type: 'Input', rules: [{ type: 'base_string', range: [0, 20]}]},
      { label: '内销情况_内销开票日期', name: 'nxkprq', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM-DD', rules: [{ type: 'base_date', format: 'yyyyMMdd' }]},
      { label: '内销情况_计量单位', name: 'hgjldwmc', type: 'Input', rules: [{ type: 'base_string', range: [0, 75]}]},
      { label: '内销情况_转内销数量', name: 'nxsl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 15, decimal: 5}, { type: 'base_number', range: '+' }, { func: 'nxsl01' }], eventOnBlur: 'nxsl' },
      { label: '可抵扣税额', name: 'kdkse', type: 'InputNumber', readOnly: true, format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}]},
    ];
    const formItems: any = formUtil.init({
      items: myFormItems,
      func: formFunc,
    });
    return formItems;
  }

  // useEffect
  useEffect(() => {
    let formItems = getFormItems();
    // 获取码表接口参数
    let apiParam = myUtil.code.getCodeTableParamFromJson({ items: formItems || [] });
    // 获取码表接口promise
    let promiseArr = myUtil.code.getCodeTablePromise(apiParam);
    // 获取码表
    Promise.all(promiseArr).then(() => {
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      // 基本信息加载码表
      formItems.map((item: any) => {
        const { codeTable } = item;
        if (codeTable) {
          item.list = myUtil.code.getSelectOption(codeTable[0], codeTable[1])
        }
      });
      setMyFormItems(formItems);
    });
  }, [initData]);

  return (
    <>
      <Modal
        title="发票生成明细"
        destroyOnHidden={true}
        visible={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X4}
        wrapClassName='standard-modal-1'
        footer={<>
          <Button onClick={() => setModalVisible(false)}>取消</Button>
        </>}
        onCancel={() => setModalVisible(false)}
        className={`${masker ? 'dd_modal_show_masker' : ''}`}
        mask={{ closable: false }}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <div className='bgdscmx'>
            <div className='bgdscmx_bgdxx'>
              {
                myConfig && <>
                  <div className='message-title'>请先输入查询条件，然后点击查询</div>
                  <DDBunit2 config={myConfig} func={Func} />
                </>
              }
            </div>
          </div>
        </Spin>
      </Modal>

      <Modal
        title="生成明细"
        destroyOnHidden={true}
        visible={scmxModalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X3}
        wrapClassName='standard-modal-1'
        footer={<>
          <Button onClick={() => setScmxModalVisible(false)}>取消</Button>
          <Button onClick={save} type="primary">确认生成</Button>
        </>}
        onCancel={() => setScmxModalVisible(false)}
        className={`${masker ? 'dd_modal_show_masker' : ''}`}
        mask={{ closable: false }}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <div className='bgdscmx'>
            <div className='bgdscmx_jcxx'>
              <DDBaseForm items={myFormItems} form={form} name="bgdscmx_form"  otherParam={{
                unit_key: initData?.unit_key,
              }}/>
            </div>
          </div>
        </Spin>
      </Modal>
    </>
  );
}

export default Scmx;
