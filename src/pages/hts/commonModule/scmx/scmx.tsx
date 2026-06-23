/**
 * 按报关单生成明细：外贸、生产、证明开具
 */
import cktsUtil from '@/pages/hts/cktsUtil';
import formUtil from '@/components/DDForm/formUtil';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { Modal, Button, Form, message, Spin, Space, Radio } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import myUtil from '@/components/DDAssist/util';
import { itemType } from '@/components/DDForm/data.d';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import UnitUtil from '@/components/DDBunit/unit_util';
import businessValidator from '@/pages/hts/common/field/businessValidator';
import { mtsBgdToTssb } from '@/pages/hts/services/htsApi';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { useIntl } from 'umi';
import DDAlert from '@/pages/hts/commonModule/DDAlert';
import '@/pages/hts/commonModule/style.less';
import { queryQywtf, checkWtqyshCk, queryCjBh } from '@/pages/hts/services/htsApi';
import dayjs from 'dayjs';

export interface DDTsort {
  onRef?: any;
  visible?: any;
}

const Scmx: React.FC<DDTsort> = ({ onRef, visible = false }) => {
  const intl = useIntl();
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [form] = Form.useForm();
  const [myFormItems, setMyFormItems] = useState([]);
  const [initData, setInitData] = useState<any>([]);
  const [modalTile, setModalTile] = useState<any>('生成出口明细');
  const [selectRows, setSelectRows] = useState<any>([]);// 出口报关单选中信息
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);// 出口报关单选中信息
  const [masker, setMasker] = useState<boolean>(false);
  const [myConfig, setMyConfig] = useState<any>();
  const [gdscbz, setGdscbz] = useState<any>('1');


  // 开启
  const showModal = (param: any, type: any) => {
    const { isuuids } = param; // isuuids: 打开本页面时是否添加uuid为默认筛选条件
    setModalVisible(true);
    setInitData(param);
    initForm(param);  // 表单初始化
    getMyConfig(param.type, param, isuuids);
    const unit_key = param?.unit_key;
    if (unit_key === 'ZMKJ_ZXSB_ZM_DLCK_G') {
      setModalTile('生成代理出口明细');
    } else if (unit_key === 'ZGBA_ZXSB_BA_BMDLCKBA_G') {
      setModalTile('生成边贸代理明细');
    } else {
      setModalTile('生成出口明细');
    }
    setGdscbz('1');
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 表单初始化
  const initForm = (param: any) => {
    param.setMasker = setMasker;
    param.form = form;
    param.tcbz = 'ZXSB_ZM_DLCK_GCB_ABGDSC';
    const unit_key = param?.unit_key;
    if (unit_key === 'ZMKJ_ZXSB_ZM_DLCK_G') {
      param.tcbz = unit_key;
    }
    DditCktsFormCommonFunc.initAddForm(param);
  }

    // 表单初始化
    const close = () => {
      setModalVisible(false);
      setMyFormItems([]);
      setMyConfig({});
      setInitData([]);
      setSelectRows([]);
      setSelectedRowKeys([]);
    }


  // 确认生成明细
  const save = async () => {
    const unit_key = initData?.unit_key;
    // 外贸 unit_key: MTS_ZXSB_SB_MTS_TSSB_G
    // 生产 unit_key: MDT_ZXSB_SB_MDT_TSSB_G
    // 证明 unit_key: ZMKJ_ZXSB_ZM_DLCK_G  生成代理出口明细
    // 边贸代理 unit_key: ZGBA_ZXSB_BA_BMDLCKBA_G
    form.validateFields().then((formValues: any) => {
      const qylx = cktsUtil.sys.enterpriseType();
      if (selectRows.length === 0) {
        message.info(intl.formatMessage({ id: 'message_handle_unselected' }));
        return;
      } else if (selectRows.length > 0 && qylx == 'WM' && unit_key === 'MTS_ZXSB_SB_MTS_TSSB_G'){
        const tmpSsq = moment(formValues.ssq).format('YYYY');
        for (let i = 0; i < selectRows.length; i++) {
          const tmpCkrq = moment(selectRows[i].ckrq1).format('YYYY');
          if (tmpSsq !== tmpCkrq) {
            message.info('所属期与出口日期非同一年度，请确认！')
            return;
          }
        }
      }
      const mtsBgdToTssbParam = {
        ...formValues,
        uuids: selectedRowKeys,
        cktmsywlxdmjh: (formValues?.cktmsywlxdmjh || []).join(",") || '',
      }
      // 提交接口地址
      let url = '';
      if (unit_key === 'ZMKJ_ZXSB_ZM_DLCK_G') {
        url = `/yw/bszx/zmkj/dlck/zmkjBgdToDlck`;
        mtsBgdToTssbParam.gdscgz = gdscbz;
      } else if (unit_key === 'MDT_ZXSB_SB_MDT_TSSB_G') {
        url = `/yw/bszx/mdt/hwlw/tssb/mdtBgdToTssb`;
      } else if (unit_key === 'MTS_ZXSB_SB_MTS_TSSB_G') {
        url = `/yw/bszx/wbsj/bgd/mtsBgdToTssb`;
      } else if (unit_key === 'ZGBA_ZXSB_BA_BMDLCKBA_G') {
        url = `/yw/bszx/zgba/bmdlck/zgbaBgdToBmdlck`;
      }
      // 校验报关单中的出口合同号是否存在空值
      if (unit_key === 'MDT_ZXSB_SB_MDT_TSSB_G' || unit_key === 'MTS_ZXSB_SB_MTS_TSSB_G') {
        let ckhthFlag = true
        for (let a = 0; a < selectRows.length; a++) {
          if (!(selectRows[a].ckhth?.trim())) {
            ckhthFlag = false;
          }
        }
        // 当出口发票号没填写时，且提交的报关单数据中存在出口合同号为空数据，此时提示需要填写出口发票号
        let ckfph = formValues?.ckfph?.trim() || '';
        if (!ckfph && !ckhthFlag) {
          message.info('报关单存在出口合同号为空，请填写出口发票号');
          return;
        }
      }
      setMasker(true);
      mtsBgdToTssb(mtsBgdToTssbParam, url).then((response) => {
        setMasker(false);
        let { code, body, msg } = response;
        if (code === '200') {
          // 原申报系统后端返回值中含有</br>
          if (body.indexOf('</br>') > -1) {
            body = body.replace('</br>', '');
          }
          message.success(body);
          close();
          initData.gridRef.current?.reload();
        } else {
          if (Array.isArray(msg)) {
            DDAlert.open({
              title: '系统提示',
              info: modalTile,
              infoType: 'info',
              modalType: 'info',
              content: msg,
            });
          } else {
            message.error(msg);
          }
        }
      });
    });

  }

  // 出口报关单信息配置
  const getMyConfig = (type: any, param:any, isuuids: any) => {
    const unit_key = param?.unit_key;
    let configTmp: any = {
      grid_api_grid_query: `/yw/bszx/wbsj/bgd/queryBgd21Page`,
      grid_selection_type: 'checkbox',
      show_toolbar: false,
      layout_type: 'modal',
      grid_scroll_y: '450px',
      grid_columns: [
        { title: 'UUID', dataIndex: 'uuid', hidden: true },
        { title: '报关单号', dataIndex: 'ckbgdh', fixed: 'left', width: 180, render: { func: 'ckbgdh' },ellipsis: true, },
        { title: '项号', dataIndex: 'xh4', fixed: 'left', width: 50 },
        { title: '出口日期', dataIndex: 'ckrq1', fixed: 'left', render: { type: 'date', format: 'yyyy-MM-DD' }, width: 120 },
        { title: '数据检查状态', dataIndex: 'cytgbz', width: 130 , render: { func: 'cytgbzCl' } },
        { title: '商品编码', dataIndex: 'ckspDm', width: 100, ellipsis: true, },
        { title: '商品名称', dataIndex: 'ckspmc', width: 120, ellipsis: true, },
        { title: '海关商品名称', dataIndex: 'hgspmc', width: 120, ellipsis: true, },
        { title: '出口合同号', dataIndex: 'ckhth', width: 120, ellipsis: true, },
        { title: '监管方式', dataIndex: 'jgfsDm', width: 100, codeTable: 'code_dm_ckts_hgjgfs:01' },
        { title: '成交方式', dataIndex: 'hgcjfsmc', width: 80, },
        { title: '成交单位', dataIndex: 'sbjldwmc', width: 80, ellipsis: true },
        { title: '成交数量', dataIndex: 'cjsl1', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
        { title: '成交币制', dataIndex: 'cjhghbzmDm', width: 70, },
        { title: '成交金额', dataIndex: 'cjzj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
        { title: '美元离岸价', dataIndex: 'mylaj', width: 100, align: 'right', render: { type: 'number', format: '0,0.00' } },
        { title: '法定单位', dataIndex: 'dyjldwDm', width: 80, ellipsis: true, codeTable: 'code_dm_ckts_hgjldw:01', },
        { title: '法定单位数量', dataIndex: 'cksl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
        { title: '第二单位', dataIndex: 'dejldwDm', width: 80, ellipsis: true, codeTable: 'code_dm_ckts_hgjldw:01', },
        { title: '第二单位数量', dataIndex: 'decksl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
      ],
      filter_items: [
        { name: 'czbz1', type: 'Select', label: '关单信息', showSearch: true, codeTable: 'code_static_bgd_gdxx_dm:01' },
        { name: 'ckbgdh', type: 'Input', label: '报关单号' },
        { name: 'ckhth', type: 'Input', label: '出口合同号' },
        { name: 'ckrq1', type: "DatePicker", range: true, label: '出口日期' },
        { name: 'jgfsDm', type: 'Select', label: '监管方式', showType: '3',showSearch: true, codeTable: 'code_dm_ckts_hgjgfs:01' },
      ],
      gridParams: {
        initSearchModal: [
          // { property: 'cytgbz', value: "Y", op: 'al' },
        ],
      }
    };
    if (type === 'zmkj') {
      configTmp.gridParams.initSearchModal.push({ property: 'lcswsxDm', value: "LCSXA081049001", op: 'zdy' });
      // configTmp.gridParams.initSearchModal.push({ property: 'bgdcllxDms', value: ["1", "2", "3", "4"], op: 'al' });
      configTmp.gridParams.initSearchModal.push({ property: 'sybz', value: "N", op: 'al' });
    } else {
      configTmp.gridParams.initSearchModal.push({ property: 'cytgbz', value: "Y", op: 'al' });
      configTmp.gridParams.initSearchModal.push({ property: 'bgdcllxDms', value: ["1", "2", "3", "4", "5"], op: 'al' });
    }
    if(param.selectionRowKeys.length > 0 && isuuids){
      configTmp.gridParams.initSearchModal.push({ property: 'uuids', value: param.selectionRowKeys, op: 'al' });
    }
    if (unit_key === 'ZMKJ_ZXSB_ZM_DLCK_G') {
      configTmp.gridParams.initSearchModal.push({ property: 'dlckzmbz', value: "Y", op: 'zdy' });
    }
    if('ZGBA_ZXSB_BA_BMDLCKBA_G' == unit_key){

      configTmp.gridParams.initSearchModal = [];
      configTmp.gridParams.initSearchModal.push({ property: 'bgdcllxDms', value: ["1", "2", "3", "4","5","6"], op: 'al' });
      configTmp.gridParams.initSearchModal.push({ property: 'cytgbz', value: "Y", op: 'al' });
      configTmp.gridParams.initSearchModal.push({ property: 'sybz', value: "N", op: 'al' });
      configTmp.gridParams.initSearchModal.push({ property: 'jgfsDm', value: "4019", op: 'al' });
      if(param.selectionRowKeys.length > 0 && isuuids){
        configTmp.gridParams.initSearchModal.push({ property: 'uuids', value: param.selectionRowKeys, op: 'al' });
      }
      configTmp.filter_items = [
        { name: 'czbz1', type: 'Select', label: '关单信息', showSearch: true, codeTable: 'code_static_bgd_gdxx_dm:01' },
        { name: 'ckbgdh', type: 'Input', label: '报关单号' },
        { name: 'ckhth', type: 'Input', label: '出口合同号' },
        { name: 'ckrq1', type: "DatePicker", range: true, label: '出口日期' },
      ];
    }
    setMyConfig(configTmp);
  }


  // 共同方法集合 包括出口报关单信息列表选择、基础信息输入框事件
  const Func = {
    columnsRender: {
      ckbgdh: (param: any) => {
        const {text} = param;
        if (text && text.length > 18) {
          return text.substring(0, 18);
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
        form.validateFields(['ssq']);
        // 获取属期批次下最大申报编号+1
        const unitKey = param?.otherParam?.unit_key;
        if (unitKey === 'ZMKJ_ZXSB_ZM_DLCK_G' ){
          const ssq = form.getFieldValue('ssq');
          const sbpc = form.getFieldValue('sbpc');
          let data ={ssq:ssq,sbpc:sbpc,tableKey:unitKey};
          queryCjBh(data).then((res: any)=>{
            const {code, body, desc} = res;
            if(code === '200') {
              form.setFieldsValue({sbbh1:body?.sbbh1})
            }else{
              message.error(desc)
            }
          })
          return
        }
      },
      formatWtdlckhth: (param: any) => {
        const { event } = param;
        const inputValue = event.target.value;
        if (inputValue) {
          form.setFieldsValue({
            wtdlckhth: myUtil.text.toUpper(inputValue),
          });
        }
      },
      // 委托纳税人识别号
      wtfnsrsbh: (param: any) => {
        const { form } = param;
        const wtfnsrsbh = form?.getFieldValue('wtfnsrsbh');
        const option = myUtil.code.getCode('url_gy_qywtf', '01');
        let wtfnsrmcs: any = '';
        let wtdlckhths: any = '';
        const tempRows = option.filter((row: any) => {
          return (row.stfnsrsbh === wtfnsrsbh);
        })
        if (tempRows && tempRows.length > 0) {
          wtfnsrmcs = tempRows[0].stfmc;
          wtdlckhths = tempRows[0].wtdlckhth;
        }
        form.setFieldsValue({
          wtfnsrmc: wtfnsrmcs,
          wtdlckhth: String(wtdlckhths).trim(),
        });
      },
    },
    eventOnChange: {
      cktmsywlxjhChange: () => {
        const unit_key = initData?.unit_key;
        let codeNumber = '04';
        if (unit_key === 'MDT_ZXSB_SB_MDT_TSSB_G') {
          codeNumber = '04';
        } else if (unit_key === 'MTS_ZXSB_SB_MTS_TSSB_G') {
          codeNumber = '05';
        }
        const inputValue = form.getFieldValue('cktmsywlxdmjh');
        form.setFieldsValue({
          cktmsywlxmcjh: myUtil.code.getCodeValByKey(inputValue, 'code_dm_ckts_cktmsywlx', codeNumber),
        });
      },
      ssqChange: (param: any) => {
        const { event } = param;
        const ssq = event.target.value;
        let glh = form.getFieldValue('glh');
        let sbbh1 = form.getFieldValue('sbbh1');
        let sbpc = form.getFieldValue('sbpc');
        // 获取属期批次下最大申报编号+1
        const unitKey = param?.otherParam?.unit_key;
        if (unitKey === 'ZMKJ_ZXSB_ZM_DLCK_G' ){
          let data ={ssq:ssq,sbpc:sbpc,tableKey:unitKey};
          queryCjBh(data).then((res: any)=>{
            const {code, body, desc} = res;
            if(code === '200') {
              form.setFieldsValue({sbbh1:body?.sbbh1})
            }else{
              message.error(desc)
            }
          })
          return
        }
        // 变更所属期反算关联号
        if (ssq && sbpc) {
          if (glh) {
            glh = ssq + sbpc + glh.substring(glh.length - 8, glh.length);
          } else {
            glh = ssq + sbpc + '00000001';
          }
        }
        // 变更所属期反算编号
        if (sbbh1) {
          sbbh1 = ssq + sbbh1.substring(sbbh1.length - 4, sbbh1.length);
        } else {
          sbbh1 = ssq + '0001';
        }
        // 表单赋值
        form.setFieldsValue({
          sbbh1: sbbh1,
          glh: glh,
        });
        form.validateFields(['sbpc']);
      },
      formatWtfnsrsbh: (param: any) => {
        const { event, myItems, setMyItems } = param;
        const inputValue = event.target.value;
        if (inputValue) {
            const obj = {
              adQuery: [
                {
                  op: "al",
                  property: "stfnsrsbh",
                  value: inputValue
                }
              ],
              page: 1,
              pageSize: 999999,
              searchModel: [{ property: "stfnsrsbh", value: inputValue, op: "al" }],
            }
            queryQywtf(obj).then((res: any) => {
              const { code, body} = res;
              if(code === '200') {
                const rows = body.rows;
                if(rows.length > 0){
                  const stfmc = rows[0].stfmc;
                  const wtdlckhth = rows[0].wtdlckhth;
                  form.setFieldsValue({ wtfnsrmc: String(stfmc).trim(), wtdlckhth: String(wtdlckhth).trim() });
                }

                let list :any[] = [];
                if (body.rows && body.rows.length > 0) {
                  body.rows.forEach((item: any) => {
                    list.push({
                      value: item['stfnsrsbh'],
                      name: item['stfnsrsbh'],
                    });
                  })
                }
                myItems[5].list = list;
                setMyItems([...myItems]);
              }
            });
        }
      },
    },
    validator: {
      ssq01: DditCktsFormCommonFunc.validator.ssq01,
      ssq02: DditCktsFormCommonFunc.validator.ssq02,
      sbpc01: DditCktsFormCommonFunc.validator.sbpc01,
      sbbh101: DditCktsFormCommonFunc.validator.sbbh101,
      sbbh102: DditCktsFormCommonFunc.validator.sbbh102,
      glh: DditCktsFormCommonFunc.validator.glh,
      cktmsywlxdmjh: businessValidator.cktmsywlxdmjh(),
      sbpc: businessValidator.sbpc(form),
      // 委托企业名称一致性校验
      wtfnsrsbh01: (form: any) => {
        // 1.校验指定“所属期”、“编号”的代理证明申请记录是否与当前的委托纳税人名称是否一致
        const sbbh1  = form?.getFieldsValue().sbbh1;
        const uuid  = form?.getFieldsValue().uuid;
        const ssq  = form?.getFieldsValue().ssq;
        const wtfnsrsbh  = form?.getFieldsValue().wtfnsrsbh;
        const validator =  async (_rule: any, value: any) => {
          const params = {
            sbbh1: sbbh1,
            wtfnsrsbh: wtfnsrsbh,
            ssq: ssq,
            uuid: uuid
          };
          await checkWtqyshCk(params).then((response) => {
            const { code, msg } = response;
            if(code !== '200') {
              return Promise.reject(new Error(msg));
            }
            return Promise.resolve();
          })
          return Promise.resolve();
        };
        return { validator };
      },
    }
  }

  // 表单布局
  const formLayout = {
    MTS_ZXSB_SB_MTS_TSSB_G: {
      ssq: {
        label: { xs: 8, sm: 8, md: 8, lg: 3, xl: 3, xxl: 3 },
        formItem: { xs: 16, sm: 16, md: 16, lg: 3, xl: 3, xxl: 3 },
      },
      sbpc: {
        label: { xs: 8, sm: 8, md: 8, lg: 3, xl: 3, xxl: 3 },
        formItem: { xs: 16, sm: 16, md: 16, lg: 2, xl: 2, xxl: 2 },
      },
      glh: {
        label: { xs: 8, sm: 8, md: 8, lg:2, xl: 2, xxl: 2 },
        formItem: { xs: 16, sm: 16, md: 16, lg: 5, xl: 5, xxl: 5 },
      },
      sbxh: {
        label: { xs: 8, sm: 8, md: 8, lg: 3, xl: 3, xxl: 3 },
        formItem: { xs: 16, sm: 16, md: 16, lg: 3, xl: 3, xxl: 3 },
      },
      sbckfphxh: {
        label: { xs: 8, sm: 8, md: 8, lg: 3, xl: 3, xxl: 3 },
        formItem: { xs: 16, sm: 16, md: 16, lg: 3, xl: 3, xxl: 3 },
      },
      cktmsywlxdmjh: {
        label: { xs: 8, sm: 8, md: 8, lg: 3, xl: 3, xxl: 3 },
        formItem: { xs: 16, sm: 16, md: 16, lg: 15, xl: 15, xxl: 15 },
      },
      cktmsywlxmcjh: {
        label: { xs: 8, sm: 8, md: 8, lg: 3, xl: 3, xxl: 3 },
        formItem: { xs: 16, sm: 16, md: 16, lg: 21, xl: 21, xxl: 21 },
      }
    },
    MDT_ZXSB_SB_MDT_TSSB_G: {
      ssq: {
        label: { xs: 8, sm: 8, md: 8, lg: 3, xl: 3, xxl: 3 },
        formItem: { xs: 16, sm: 16, md: 16, lg: 4, xl: 4, xxl: 4 },
      },
      sbxh: {
        label: { xs: 8, sm: 8, md: 8, lg: 3, xl: 3, xxl: 3 },
        formItem: { xs: 16, sm: 16, md: 16, lg: 5, xl: 5, xxl: 5 },
      },
      sbckfphxh: {
        label: { xs: 8, sm: 8, md: 8, lg: 3, xl: 3, xxl: 3 },
        formItem: { xs: 16, sm: 16, md: 16, lg: 6, xl: 6, xxl: 6 },
      },
      cktmsywlxdmjh: {
        label: { xs: 8, sm: 8, md: 8, lg: 3, xl: 3, xxl: 3 },
        formItem: { xs: 16, sm: 16, md: 16, lg: 21, xl: 21, xxl: 21 },
      },
      cktmsywlxmcjh: {
        label: { xs: 8, sm: 8, md: 8, lg: 3, xl: 3, xxl: 3 },
        formItem: { xs: 16, sm: 16, md: 16, lg: 21, xl: 21, xxl: 21 },
      }
    },
    ZMKJ_ZXSB_ZM_DLCK_G: {
      ssq: {
        label: { xs: 8, sm: 8, md: 8, lg: 4, xl: 4, xxl: 4 },
        formItem: { xs: 16, sm: 16, md: 16, lg: 4, xl: 4, xxl: 4 },
      },
      sbbh1: {
        label: { xs: 8, sm: 8, md: 8, lg: 3, xl: 3, xxl: 3 },
        formItem: { xs: 16, sm: 16, md: 16, lg: 5, xl: 5, xxl: 5 },
      },
      sbpc: {
        label: { xs: 8, sm: 8, md: 8, lg: 3, xl: 3, xxl: 3 },
        formItem: { xs: 16, sm: 16, md: 16, lg: 5, xl: 5, xxl: 5 },
      },
      wtfnsrsbh: {
        label: { xs: 8, sm: 8, md: 8, lg: 4, xl: 4, xxl: 4 },
        formItem: { xs: 16, sm: 16, md: 16, lg: 4, xl: 4, xxl: 4 },
      },
      wtfnsrmc: {
        label: { xs: 8, sm: 8, md: 8, lg: 3, xl: 3, xxl: 3 },
        formItem: { xs: 16, sm: 16, md: 16, lg: 5, xl: 5, xxl: 5 },
      },
      wtdlckhth: {
        label: { xs: 8, sm: 8, md: 8, lg: 3, xl: 3, xxl: 3 },
        formItem: { xs: 16, sm: 16, md: 16, lg: 5, xl: 5, xxl: 5 },
      },
    },
    ZGBA_ZXSB_BA_BMDLCKBA_G:{
      wtfmc: {
        label: { xs: 8, sm: 8, md: 8, lg: 4, xl: 4, xxl: 4 },
        formItem: { xs: 16, sm: 16, md: 16, lg: 4, xl: 4, xxl: 4 },
      },
      wtfjbrhzhmhbmzhm: {
        label: { xs: 8, sm: 8, md: 8, lg: 3, xl: 3, xxl: 3 },
        formItem: { xs: 16, sm: 16, md: 16, lg: 5, xl: 5, xxl: 5 },
      },
      dlckxyh: {
        label: { xs: 8, sm: 8, md: 8, lg: 3, xl: 3, xxl: 3 },
        formItem: { xs: 16, sm: 16, md: 16, lg: 5, xl: 5, xxl: 5 },
      },
    }
  }

  // 基本信息表单项
  const getFormItems: any = () => {
    const unit_key = initData?.unit_key;
    // 外贸 unit_key: MTS_ZXSB_SB_MTS_TSSB_G
    // 生产 unit_key: MDT_ZXSB_SB_MDT_TSSB_G
    // 证明 unit_key: ZMKJ_ZXSB_ZM_DLCK_G
    // 边贸代理 unit_key: ZGBA_ZXSB_BA_BMDLCKBA_G
    const myFormItems: any = [];
    myFormItems.push({ name: 'groupTitle1', type: itemType.GroupTitle, label: '基本信息' });
    // 所属期
    let ssq: any = { label: '所属期', type: itemType.Input, name: 'ssq', eventOnChange: 'ssqChange', layout: formLayout[unit_key]?.ssq, rules: [
      { type: 'base_date', format: 'yyyyMM' },
      { type: 'base_required' },
      { type: 'base_string', range: 6 },
    ]};
    if (unit_key === 'MTS_ZXSB_SB_MTS_TSSB_G' || unit_key === 'ZMKJ_ZXSB_ZM_DLCK_G') {
      ssq.rules.push({ func: 'ssq01' });
    } else {
      ssq.rules.push({ func: 'ssq02' });
    }
    myFormItems.push(ssq);
    
    // 申报批次
    if (unit_key === 'ZMKJ_ZXSB_ZM_DLCK_G' || unit_key === 'MTS_ZXSB_SB_MTS_TSSB_G') {
      let sbpc: any = { label: '申报批次', type: itemType.Input, name: 'sbpc', eventOnBlur: 'formatSbpc', layout: formLayout[unit_key]?.sbpc, rules: [
        { func: 'sbpc01' },
      ]};
      if (unit_key === 'ZMKJ_ZXSB_ZM_DLCK_G') {
        sbpc.rules.push({ type: 'base_required' });
      }
      myFormItems.push(sbpc);
    }
    // 编号
    if (unit_key === 'ZMKJ_ZXSB_ZM_DLCK_G') {
      myFormItems.push({ label: '编号', type: itemType.Input, name: 'sbbh1', layout: formLayout[unit_key]?.sbbh1, rules: [
        { type: 'base_required' },
        { type: 'base_number' },
        { type: 'base_string', range: [10, 10] },
        { func: 'sbbh101' },
        { func: 'sbbh102' },
      ]});
    }
    // 关联号
    if (unit_key === 'MTS_ZXSB_SB_MTS_TSSB_G') {
      myFormItems.push({ label: '关联号', type: itemType.Input, name: 'glh', layout: formLayout[unit_key]?.glh, rules: [
        { func: 'glh' },
      ]});
    }
    // 申报序号
    if (unit_key === 'MTS_ZXSB_SB_MTS_TSSB_G' || unit_key === 'MDT_ZXSB_SB_MDT_TSSB_G') {
      myFormItems.push({ label: '申报序号', type: itemType.Input, name: 'sbxh', eventOnBlur: 'sbxh', layout: formLayout[unit_key]?.sbxh, rules: [
        { type: 'base_required' },
        { type: 'base_number' },
      ]});
    }
    // 出口发票号
    if (unit_key === 'MTS_ZXSB_SB_MTS_TSSB_G' || unit_key === 'MDT_ZXSB_SB_MDT_TSSB_G') {
      let ckfph: any = { label: '出口发票号', type: itemType.Input, name: 'ckfph', layout: formLayout[unit_key]?.sbckfphxh, rules: [
        { type: 'base_string', range: 30 },
      ]}
      if (unit_key === 'MTS_ZXSB_SB_MTS_TSSB_G') {
        ckfph.tooltip = '若此处不填出口发票号，则生成的出口明细数据中，使用合同号做为出口发票号。';
      } else if (unit_key === 'MDT_ZXSB_SB_MDT_TSSB_G') {
        ckfph.rules.push({ type: 'base_required' });
      }
      myFormItems.push(ckfph);
    }
    // 业务类型、业务类型名称
    if (unit_key === 'MTS_ZXSB_SB_MTS_TSSB_G' || unit_key === 'MDT_ZXSB_SB_MDT_TSSB_G') {
      // 业务类型
      let cktmsywlxdmjh:any = { label: '业务类型代码', type: itemType.Select, name: 'cktmsywlxdmjh', mode: 'multiple', layout: formLayout[unit_key]?.cktmsywlxdmjh,
        showType: '3', eventOnChange: 'cktmsywlxjhChange', optionLabelProp: 'value', rules: [
        { func: 'cktmsywlxdmjh' },
      ] };
      if (unit_key === 'MDT_ZXSB_SB_MDT_TSSB_G') {
        cktmsywlxdmjh.codeTable = ['code_dm_ckts_cktmsywlx', '04'];
      } else if (unit_key === 'MTS_ZXSB_SB_MTS_TSSB_G') {
        cktmsywlxdmjh.codeTable = ['code_dm_ckts_cktmsywlx', '05'];
      }
      myFormItems.push(cktmsywlxdmjh);
      // 业务类型名称
      myFormItems.push({ label: '业务类型名称', type: itemType.Input, name: 'cktmsywlxmcjh', readOnly: true, layout: formLayout[unit_key]?.cktmsywlxmcjh });
    }
    // 委托方信息：委托方纳税人识别号（统一社会信用代码）、受托方名称、委托（代理）协议合同号
    if (unit_key === 'ZMKJ_ZXSB_ZM_DLCK_G') {
      myFormItems.push({ name: 'groupTitle2', type: itemType.GroupTitle, label: '委托方信息' });
      myFormItems.push({ label: '委托方纳税人识别号（统一社会信用代码）', type: itemType.AutoComplete, showType: '2', 'allowClear': true, name: 'wtfnsrsbh', codeTable: 'url_gy_qywtf:01', eventOnBlur: 'wtfnsrsbh', eventOnChange: 'formatWtfnsrsbh', layout: formLayout[unit_key]?.wtfnsrsbh, rules: [
        { type: 'base_required' },
        { type: 'base_type_number_english' },
        { type: 'base_string', range: [15, 20] },
        { func: 'wtfnsrsbh01' }

      ]});
      myFormItems.push({ label: '委托方纳税人名称', type: itemType.Input, name: 'wtfnsrmc', layout: formLayout[unit_key]?.wtfnsrmc, rules: [
        { type: 'base_required' },
        { type: 'base_string', range: 80 },
      ]});
      myFormItems.push({ label: '代理出口协议号', type: itemType.Input, name: 'wtdlckhth', eventOnBlur: 'formatWtdlckhth', layout: formLayout[unit_key]?.wtdlckhth, rules: [
        { type: 'base_required' },
        { type: 'base_string', range: 60 },
      ]});
    }
    if(unit_key === 'ZGBA_ZXSB_BA_BMDLCKBA_G'){
      myFormItems.push({ name: 'groupTitle2', type: itemType.GroupTitle, label: '委托方信息' });
      myFormItems.push({ label: '委托单位名称或委托人名称', type: itemType.Input, name: 'wtfmc', layout: formLayout[unit_key]?.wtfmc, rules: [
        { type: 'base_required' },
        { type: 'base_string', range: 80 },
      ]});
      myFormItems.push({ label: '委托方经办人护照号码或边民证号码', type: itemType.Input, name: 'wtfjbrhzhmhbmzhm', layout: formLayout[unit_key]?.wtfjbrhzhmhbmzhm, rules: [
        { type: 'base_required' },
        { type: 'base_string', range: 80 },
      ]});
      myFormItems.push({ label: '代理出口协议号码', type: itemType.Input, name: 'dlckxyh', layout: formLayout[unit_key]?.dlckxyh, rules: [
        { type: 'base_required' },
        { type: 'base_string', range: 80 },
      ]});


    }
    if (unit_key === 'ZMKJ_ZXSB_ZM_DLCK_G') {
      myFormItems.push({ label: '其他信息', name: 'qtxx', type: 'GroupTitle', readOnly: true});
      myFormItems.push({ label: '备注', name: 'bz', type: 'TextArea', autoSize: { minRows: 2, maxRows: 2}, layout: { label: { xs: 8, sm: 8, md: 8, lg: 4, xl: 4, xxl: 4}, formItem: { xs: 16, sm: 16, md: 16, lg: 20, xl: 20, xxl: 20 } }, rules: [{ type: 'base_string', range: [0, 200]}]});
    }
    if (unit_key === 'ZMKJ_ZXSB_ZM_DLCK_G') {
      myFormItems.push({ name: 'groupTitle3', type: itemType.GroupTitle, label: '出口报关单信息', tooltip:'每张关单分开生成:同一18位报关单对应1个编号，不合并；多张关单合并生成:1个编号最多含99条报关单，同一18位报关单不拆分' });
    } else {
      myFormItems.push({ name: 'groupTitle3', type: itemType.GroupTitle, label: '出口报关单信息'});
    }
    formUtil.init({
      items: myFormItems,
      func: Func,
    });
    const formItems: any = formUtil.init({
      items: myFormItems,
      func: Func,
    });
    return formItems;
  }

  // useEffect
  useEffect(() => {
    getstfnsrsbh();
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


  // 受托方统一社会信用代码/纳税人识别号
const getstfnsrsbh = () => {
  const obj = {
    page: 1,
    pageSize: 999999,
    searchModel: [{ property: "stfnsrsbh", value: "", op: "al" }],
  }
  queryQywtf(obj).then((res: any) => {
    const { code, body} = res;
    if(code === '200') {
      if (body.rows && body.rows.length > 0) {
        myUtil.code.saveCodeToLocalTable('url_gy_qywtf', body.rows, '01');
      }
    }
  });
}

const handlerBgdscgzChange = (e: any) => {
  setGdscbz(e.target.value);
}

  return (
    <Modal
      title={modalTile}
      destroyOnHidden={true}
      visible={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      wrapClassName='standard-modal-1'
      footer={<>
        <Button onClick={() => close()}>取消</Button>
        <Button onClick={save} type="primary">确认生成</Button>
      </>}
      onCancel={() => close()}
      className={`${masker ? 'dd_modal_show_masker' : ''}`}
      mask={{ closable: false }}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <div className='bgdscmx'>
          <div className='bgdscmx_jcxx'>
            <DDBaseForm items={myFormItems} form={form} initialValues={initData} name="bgdscmx_form"  otherParam={{
              unit_key: initData?.unit_key,
            }}/>
          </div>
          {modalTile === '生成代理出口明细' ?
            <div style={{marginLeft: '130px', marginTop: '-37px'}}>
            <Space >
            <Radio.Group  onChange={handlerBgdscgzChange} value={gdscbz}>
                <Radio key={'dlckzm_scgz_fk'} value={'1'}>每张关单分开生成</Radio>
				        <Radio key={'dlckzm_scgz_hb'} value={'2'}>多张关单合并生成</Radio>
            </Radio.Group>
            </Space>
            </div>
            :
            <></>
          }
          {modalTile === '生成代理出口明细' ?
            <div className='bgdscmx_bgdxx' style={{marginTop: '2px'}}>
              {myConfig && <DDBunit2 config={myConfig} func={Func} />}
            </div>
            :
            <div className='bgdscmx_bgdxx'>
              {myConfig && <DDBunit2 config={myConfig} func={Func} />}
            </div>
          }
        </div>
      </Spin>
    </Modal>
  );
}

export default Scmx;
