// 生成进货
import formUtil from '@/components/DDForm/formUtil';
import React, { useEffect, useRef, useImperativeHandle, useState } from 'react';
import { Modal, Button, Form, message, Spin, } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import myUtil from '@/components/DDAssist/util';
import { itemType } from '@/components/DDForm/data.d';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import UnitUtil from '@/components/DDBunit/unit_util';
import businessValidator from '@/pages/hts/common/field/businessValidator';
import { getTsjhByFpxx } from '@/pages/hts/services/htsApi';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { useIntl } from 'umi';
import Jhmx2 from '@/pages/hts/commonModule/jhmx/jhmx2';
import '@/pages/hts/commonModule/style.less';

export interface DDTsort {
  onRef?: any;
  visible?: any;
}

const Jhmx: React.FC<DDTsort> = ({ onRef, visible = false }) => {
  const intl = useIntl();
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [form] = Form.useForm();
  const [myFormItems, setMyFormItems] = useState([]);
  const [initData, setInitData] = useState<any>([]);
  const [selectRows, setSelectRows] = useState<any>([]);// 出口报关单选中信息
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);// 出口报关单选中信息
  const [masker, setMasker] = useState<boolean>(false);
  const [myConfig, setMyConfig] = useState<any>();
  const jhmx2Ref: any = useRef(); // 生成进货明细

  // 开启
  const showModal = (param: any) => {
    form.setFieldsValue({

      
    });
    setModalVisible(true);
    setInitData(param);
    initForm(param);  // 表单初始化
    getMyConfig(param.type);
  };

  // useImperativeHandle
  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 表单初始化
  const initForm = (param: any) => {
    param.setMasker = setMasker;
    param.form = form;
    DditCktsFormCommonFunc.initAddForm(param);
  };

  // 共同方法集合 包括出口报关单信息列表选择、基础信息输入框事件
  const Func: any = {
    unitRef: React.createRef(),
    columnsRender: {
      fpzt: (param: any) => {
        const record = param?.record;
        let text = '';
        if (record.rzxfzzszyfpbz === 'Y') {
          text = text + '已认证/';
        }
        if (record.rzxfzzszyfpbz != 'Y') {
          text = text + '未认证/';
        }
        if (record.jhxfzzszyfpbz === 'Y') {
          text = text + '已稽核';
        }
        if (record.jhxfzzszyfpbz != 'Y') {
          text = text + '未稽核';
        }
        return text;
      },
    },
    rowSelection: (param: any) => {
      const { selectedRowKeys, selectedRows } = param;
      setSelectedRowKeys(selectedRowKeys);
      setSelectRows(selectedRows);
    },
    eventOnBlur: {
      sbxh: (param: any) => {
        param.form = form;
        DditCktsFormCommonFunc.eventOnBlur.sbxh(param);
      },
      formatSbpc: (param: any) => {
        // 申报批次自动补零
        const { event } = param;
        const inputValue = event.target.value;
        form.setFieldsValue({
          sbpc: myUtil.text.leadingZeroize(inputValue, 3),
        });
      },
    },
    validator: {
      ssq01: DditCktsFormCommonFunc.validator.ssq01,
      sbpc: businessValidator.sbpc(form),
    },
  };

  // 保存
  const save = async () => {
    // initData.gridRef.current?.reload();
    const current2 = initData.gridRef.current;
    const current = Func.unitRef.current;
    // const reload2 = Func.unitRef.current!.reload2;
    form.validateFields().then((formValues: any) => {
      if (selectRows.length === 0) {
        message.info(intl.formatMessage({ id: 'message_handle_unselected' }));
        return
      }
      setMasker(true);
      const mtsBgdToTssbParam = {
        ...formValues,
        body: selectedRowKeys,
      }
      // 提交接口地址
      getTsjhByFpxx(mtsBgdToTssbParam).then((response) => {
        const { code, body, msg } = response;
        if (code === '200') {
          body.current = current;
          body.current2 = current2;
          jhmx2Ref.current?.showModal(body);
        } else {
          message.error(msg);
        }
        setMasker(false);
      });
    })
  };

  // 出口报关单信息配置
  const getMyConfig = (type: any) => {
    let configTmp: any = {
      grid_api_grid_query: `/yw/bszx/wbsj/dzdzfp/queryPdFpPage`,
      grid_selection_type: 'checkbox',
      show_toolbar: false,
      grid_scroll_y: '450px',
      layout_type: "modal",
      grid_columns: [
        { title: 'UUID', dataIndex: 'uuid', hidden: true },
        { title: '发票号码', dataIndex: 'fphm', width: 120 },
        { title: '发票代码', dataIndex: 'fpDm', width: 120 },
        { title: '发票状态', dataIndex: 'fpzt', width: 120, render: { func: 'fpzt' } },
        { title: '发票行号', dataIndex: 'hh', width: 80 },
        { title: '开票日期', dataIndex: 'kprq', typerender: { type: 'date', format: 'yyyy-MM-DD' }, width: 120 },
        { title: '购方纳税号', dataIndex: 'gfnsrsbh', width: 180 },
        { title: '销方纳税号', dataIndex: 'xfnsrsbh', width: 180 },
        { title: '商品名称', dataIndex: 'hwhyslwmc', width: 100, ellipsis: true },
        { title: '数量', dataIndex: 'sl', width: 140, align: 'right', render: { type: 'number', format: '0,0' } },
        { title: '计税金额', dataIndex: 'je', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
        { title: '剩余金额', dataIndex: 'syje', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
        { title: '已占金额', dataIndex: 'yzje_1', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
      ],
      filter_items: [
        { name: 'kprq', type: "DatePicker", range: true, label: '开票日期' },
        { name: 'fpDm', type: 'Input', label: '发票代码' },
        { name: 'fphm', type: 'Input', label: '发票号码' },
      ],
      gridParams: {
        initSearchModal: [
          { property: 'fpsbztDms', value: ['1'], op: 'al' },
        ],
      }
    };
    setMyConfig(configTmp);
  };

  // 表单布局
  const formLayout = {
    ssq: {
      label: { xs: 8, sm: 8, md: 8, lg: 3, xl: 3, xxl: 3 },
      formItem: { xs: 16, sm: 16, md: 16, lg: 4, xl: 4, xxl: 4 },
    },
    sbpc: {
      label: { xs: 8, sm: 8, md: 8, lg: 3, xl: 3, xxl: 3 },
      formItem: { xs: 16, sm: 16, md: 16, lg: 5, xl: 5, xxl: 5 },
    },
    sbxh: {
      label: { xs: 8, sm: 8, md: 8, lg: 3, xl: 3, xxl: 3 },
      formItem: { xs: 16, sm: 16, md: 16, lg: 6, xl: 6, xxl: 6 },
    },
  };

  // 基本信息表单项
  const getFormItems: any = () => {
    const myFormItems: any = [];
    myFormItems.push({ name: 'groupTitle1', type: itemType.GroupTitle, label: '基本信息' });
    // 申报年月/所属期
    myFormItems.push({ label: '申报年月', type: itemType.Input, name: 'ssq', layout: formLayout.ssq, rules: [
      { type: 'base_date', format: 'yyyyMM' },
      { type: 'base_required' },
      { type: 'base_string', range: 6 },
      { func: 'ssq01' },
    ]});
    // 申报批次
    let sbpc: any = { label: '申报批次', type: itemType.Input, name: 'sbpc', eventOnBlur: 'formatSbpc', layout: formLayout.sbpc, rules: [
      { type: 'base_required' },
      // { func: 'sbpc' },
    ]};
    myFormItems.push(sbpc);
    // 起始序号/申报序号
    myFormItems.push({ label: '起始序号', type: itemType.Input, name: 'sbxh', eventOnBlur: 'sbxh', layout: formLayout.sbxh, rules: [
      { type: 'base_required' },
      { type: 'base_number' },
    ]});
    myFormItems.push({ name: 'groupTitle3', type: itemType.GroupTitle, label: '发票信息' });
    const formItems: any = formUtil.init({
      items: myFormItems,
      func: Func,
    });
    return formItems;
  };

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
    <Modal
      title="生成进货明细"
      destroyOnHidden={true}
      open={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      wrapClassName='standard-modal-1'
      footer={<>
        <Button onClick={() => setModalVisible(false)}>取消</Button>
        <Button onClick={save} type="primary">确认生成</Button>
      </>}
      onCancel={() => setModalVisible(false)}
      className={`${masker ? 'dd_modal_show_masker' : ''}`}
      mask={{ closable: false }}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <div className='bgdscmx'>
          <div className='bgdscmx_jcxx'>
            <DDBaseForm items={myFormItems} form={form} initialValues={initData} name="bgdscmx_form" otherParam={{
              unit_key: 'MTS_ZXSB_SB_MTS_TSJH_G',
            }}/>
          </div>
          <div className='bgdscmx_bgdxx'>
            {myConfig && <DDBunit2 config={myConfig} func={Func} />}
          </div>
        </div>
      </Spin>
      <Jhmx2  onRef={jhmx2Ref} />
    </Modal>
  );
}

export default Jhmx;