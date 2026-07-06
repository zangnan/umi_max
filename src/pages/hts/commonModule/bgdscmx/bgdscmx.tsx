/**
 * 报关单生成明细
 */
import cktsUtil from '@/pages/hts/cktsUtil';
import formUtil from '@/components/DDForm/formUtil';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { Modal, Button, Form, message, Spin, } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import myUtil from '@/components/DDAssist/util';
import { itemType } from '@/components/DDForm/data.d';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import UnitUtil from '@/components/DDBunit/unit_util';
import moment from 'moment';
import '@/pages/hts/commonModule/style.less';
import { queryCjCsh, saveYbsWtsMx } from '@/pages/hts/services/htsApi';
import formFunc from './f'

const Func: any = {
  unitRef: React.createRef()
}
export interface DDTsort {
  onRef?: any;
  visible?: any;
}

const Scmx: React.FC<DDTsort> = ({ onRef, visible = false }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [scmxModalVisible, setScmxModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [myFormItems, setMyFormItems] = useState([]);
  const [initData, setInitData] = useState<any>([]); // 列表组件
  const [currentData, setCurrentData] = useState<any>([]); // 当前页列表组件
  const [masker] = useState<boolean>(false);
  const [myConfig, setMyConfig] = useState<any>();
  const [qylx, setQylx] = useState<any>();


  // 开启
  const showModal = (param: any) => {
    setModalVisible(true);
    setInitData(param);
    // 获取企业类型(WM:外贸，SC:生产，QT:其他)
    setQylx(cktsUtil.sys.enterpriseType());
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
      if (!formValues.tysl) {
        formValues.tysl = 0;
      } else { // 去除千分位 会报错
        formValues.tysl = formValues.tysl.replace(/,/g, "");
      }
      saveYbsWtsMx({ ...formValues, czlx: '3' }).then((response) => {
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

  // 出口报关单信息配置
  const getMyConfig = () => {
    let configTmp: any = {
      grid_api_grid_query: `/yw/saas/sjgl/hgsjcx/queryKsybgdxx`,
      gridIsInitSearch: false,
      grid_selection_type: false,
      grid_scroll_y: '450px',
      grid_row_key:'uuid',
      layout_type: 'modal',
      pageSizeOptions: [10, 20],
      grid_columns: [
        { title: 'UUID', dataIndex: 'uuid', hidden: true },
        { title: '报关单号', dataIndex: 'ckbgdh', width: 180, ellipsis: true },
        { title: '出口日期', dataIndex: 'ckrq1', render: { type: 'date', format: 'yyyy-MM-DD' }, width: 120 },
        { title: '申报业务', dataIndex: 'dcsbyw', width: 120 },
        { title: '商品代码', dataIndex: 'hgckspDm', width: 120 },
        { title: '商品名称', dataIndex: 'hgspmc', width: 180, ellipsis: true },
        { title: '成交单位', dataIndex: 'sbjldwmc', width: 120 },
        { title: '成交数量', dataIndex: 'cjsl1', width: 140, align: 'right' , render: { type: 'number', format: '0,0.00000' } },
        { title: '出口口岸', dataIndex: 'hggqkajc', width: 140 },
      ],
      grid_filter_quick: [
        { name: 'bgdhgbhs', type: 'Input', label: '请输入18位或后四位报关单号，多条以英文,隔开', width: '6w' },
        { name: 'hgspmc', type: 'Input', label: '请输入商品名称', width: '4w', searchButton: true },
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
      tableKey: 'ZMKJ_ZXSB_ZM_TYYBSWTS_G',
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
          hggqkaDm: record.hggqkaDm,
          hggqkamc: record.hggqkaDm ? myUtil.code.getCodeValByKey(record.hggqkaDm, 'code_dm_gy_hggqka:01') : '',
          ckbgdh: record.ckbgdh,
          sz: (record?.ckspDm=== null || record?.ckspDm === '' || record?.ckspDm === undefined ) ?'' : (record?.sz === 'X' ? 'C' : 'V'),
          tmsztbz: record.sybz === 'N' ? '尚未申报退（免）税' : qylx == 'SC' ? '已办理退（免）税' : '',
          sbsl1: record.sbsl1,
          cksl: record.cksl,
          ytycjsl: record.ytycjsl,
          ckspDm: record.ckspDm,
          jldw: record.hgjldwmc,
          bgduuid: record.uuid,
          ckrq1: record?.ckrq1
        }
        delete formValue.uuid;
        myFormItems.forEach((item: any) => {
          if (item.name === 'tyslsbsl') {
            item.disabled = true;
          }
          if (item.name === 'tmsztbz') {
            item.disabled = !(qylx == 'WM' && record.sybz == 'Y');
          }
          if (formValue[item.name]?.constructor === String) {
            formValue[item.name] = formValue[item.name]?.trim() || '';
          }
          if (item.name === 'ysbmdtse') {
            item.disabled = qylx == 'WM' && formValue.tmsztbz == '尚未申报退（免）税';
          }
          if (item.name === 'jhpzh') {
            item.disabled = qylx == 'WM' && formValue.tmsztbz == '尚未申报退（免）税';
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
          if (item.name === 'ckrq1') {
            formValue[item.name] = moment(new Date(Number(formValue[item.name])));
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
      { label: '基本信息', name: 'jbxx', type: 'GroupTitle', readOnly: true },
      { label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq01' }], eventOnChange: 'ssq' },
      { label: '申报批次', name: 'sbpc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbpc02' }], eventOnBlur: 'sbpc' },
      { label: '编号', name: 'sbbh1', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_string', length: '10' }, { func: 'sbbh101' }, { func: 'sbbh102' }]},
      { label: '序号', name: 'xh4', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_string', range: [0, 2]}, { func: 'xh401' }], eventOnBlur: 'xh4' },
      { label: '出口信息', name: 'ckxx', type: 'GroupTitle' },
      { label: '口岸代码', name: 'hggqkaDm', type: 'Select', showType: '3', showSearch: true, allowClear: true, codeTable: 'code_dm_gy_hggqka:01', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 4]}], eventOnChange: 'hggqkaDm' },
      { label: '口岸名称', name: 'hggqkamc', type: 'Input', readOnly: true},
      { label: '出口货物报关单/代理出口货物证明号', name: 'ckbgdh', type: 'Input', readOnly: true, rules: [{ type: 'base_type_number_english' }, { type: 'base_required' }, { type: 'base_string', range: [0, 21]}, { func: 'ckbgdh04' }], eventOnChange: 'ckbgdh' },
      { label: '税种', name: 'sz', type: 'Select', disabled: true, allowClear: true, codeTable: 'code_static_tmsjhmxsz_dm:01', rules: [{ type: 'base_required' }, { type: 'base_string', length: '1' }, { type: 'base_string', range: [0, 1]}, { func: 'sz01' }]},
      { label: '业务类型', name: 'tyybswtstylxDm', type: 'Select', allowClear: true, codeTable: 'code_dm_ckts_tyybswtstylx:01', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 1]}], eventOnChange: 'tyybswtstylxDm' },
      { label: '退（免）税状态', name: 'tmsztbz', type: 'Select', allowClear: true, codeTable: qylx == 'WM' ? 'code_static_tmsztbz_dm:02' : 'code_static_tmsztbz_dm:01', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 50]}], eventOnChange: 'tmsztbz' },
      { label: '原退（免）税额', name: 'ysbmdtse', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+-' }, { func: 'ysbmdtse' }]},
      { label: '购进凭证号码', name: 'jhpzh', type: 'Input', rules: [{ type: 'base_string', range: [0, 30]}, { func: 'jhpzh' }, { func: 'jhpzh03' }]},
      { label: '退运信息', name: 'tyxx', type: 'GroupTitle' },
      { label: '退运成交数量', name: 'tyslsbsl', type: 'InputNumber', format: '0,0.00000', disabled: true, rules: [{ func: 'tysl01' }, { type: 'base_number', length: 15, decimal: 5}, { func: 'tyslsbsl01' }], eventOnChange: 'tyslsbsl'},
      { label: '退运法定数量', name: 'tysl', type: 'InputNumber', readOnly: true, format: '0,0.00000'},
      { label: '出口商品代码', name: 'ckspDm', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_string', range: [0, 12]}], eventOnBlur: 'ckspDm'},//  , eventOnChange: 'ckspDm'
      { label: '计量单位', name: 'jldw', type: 'Input', readOnly: true, rules: [{ type: 'base_string', range: [0, 150]}]},
      { label: 'BGDUUID', name: 'bgduuid', type: 'Hidden', readOnly: true },
      { label: '原始成交数量', name: 'sbsl1', type: 'Hidden', readOnly: true },
      { label: '原始法定数量', name: 'cksl', type: 'Hidden', readOnly: true },
      { label: '已退运成交数量', name: 'ytycjsl', type: 'Hidden', readOnly: true },
      { label: '出口日期', name: 'ckrq1', type: 'Hidden' },

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
        title="报关单生成明细"
        destroyOnHidden={true}
        open={modalVisible}
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
