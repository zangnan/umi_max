/**
 * 免退税配单
 */
import React, {useEffect, useImperativeHandle, useRef, useState} from 'react';
import { Button, Col, Drawer, Form, InputNumber, message, Modal, Space, Spin, Switch, Table, Tooltip} from 'antd';
import columnsRender from '@/pages/hts/common/field/eventColRender';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import {itemType} from '@/components/DDForm/data.d';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import {history, useIntl} from 'umi';
import businessValidator from '@/pages/hts/common/field/businessValidator';
import UnitUtil from '@/components/DDBunit/unit_util';
import CONSTANTS from '@/components/DDAssist/constants';
import styles from './style.less';
import myUtil, {intl as intl2 } from '@/components/DDAssist/util';
import pdFun from './pdFun';
import moment from 'moment';
import {BarsOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {checkMtsTssbGlh, checkSsqPcYsb, pdCheckByHistoryData, queryCjGlh, querySpdmXxCj, znpdBgdPd, znpdBgdPdDb } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/components/DDAlert';


export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
  ywKey?: any;
}
const Mtspd: React.FC<DDModalGridProps> = ({ onRef, visible = false, ywKey }) => {
  const intl = useIntl();
  const [unitRefs, setUnitRefs] = useState<any>();// 主列表
  //全局变量页面开关
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  //Form
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  //列表显示项
  const [gridData, setGridData] = useState<any>([]);
  //商品Visible
  const [spVisible, setSpVisible] = useState(false);
  //分页信息（商品表）
  const [selectCkSpData, setSelectCkSpData] = useState([]);
  const data: any = [];
  // 计税金额
  const [jshuiJe, setJshuiJe] = useState(0);
  // 计税数量
  const [jshuiSl, setJshuiSl] = useState(0);
  //维度默认值radio
  const [value, setValue] = React.useState(1);
  //传入参数ckxx
  const [records, setRecords] = useState<any>();
  const [formItems, setFormItems] = useState<any>([]);
  // 蒙版
  const [masker, setMasker] = useState<any>(false);

  // 是否自动折算金额默认关闭
  const [zdzsjebz, setZdzsjebz] = useState<boolean>(false);

  const [zdzsjebzCk, setZdzsjebzCk] = useState<string>();

  //绑定组件
  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  useEffect(() => {
    setFormItems([...tmpItems]);
    // 获取码表接口参数
    let apiParam = myUtil.code.getCodeTableParamFromJson({ items: formItems || [] });
    // 获取码表接口promise
    let promiseArr = myUtil.code.getCodeTablePromise(apiParam);
    // 获取码表
    Promise.all(promiseArr).then(() => {
      // do nothing
    }).catch(() => {
      message.info(intl2.formatMessage({ id: 'message_hqmb_error' }));
    }).finally(() => {
      const tmpItemsNew = UnitUtil.code.initFormItemsCodeTable(tmpItems);
      setFormItems(tmpItemsNew);
    });
  }, []);

  // 开启页面，并设置参数
  const showModal = (param: any, params: any, records: any) => {
    setModalVisible(true);
    setGridData(data);
    setUnitRefs(params);
    //调用后端接口基础信息初始化赋值
    initFuncByJcxx(param, records);
    //初始化参数ckxx
    setRecords(records);
    const userInfo = myUtil.sessionStore.getItem('userInfo');
    // @ts-ignore
    const ck = userInfo?.qxyh?.yhuuid1 + userInfo?.qxQys[0]?.sbqyuuid + 'mts_sjznpd_bgdzxpd_mtsPd_zdzsjebz';
    setZdzsjebzCk(ck);
    const zdzsjebzCache = myUtil.localStore.getItem(ck);
    if (zdzsjebzCache) {
      setZdzsjebz(zdzsjebzCache);
    } else {
      setZdzsjebz(false);
    }
  };

  //调用后端接口基础信息初始化赋值
  const initFuncByJcxx = (body: any, rec: any) => {
    //请求后台接口
    form.setFieldsValue({
      ssq: body.ssq,
      sbpc: body.sbpc,
      glh: body.glh,
      sbxh: body.sbxh,
      ckfph: rec.ckfph ? rec.ckfph.substr(0, 30) : '',
      ckbgdh: rec.ckbgdh,
      ckrq1: moment(rec.ckrq1).format('YYYY-MM-DD'),
      uuid: rec.uuid,
    });
  }

  // 校验申报商品代码
  const sbSpChange = (v: any) => {
    const jcxx = form.getFieldsValue();
    if (v?.value) {
      const obj = {
        ckbgdh: jcxx?.ckbgdh,
        ckrq1: jcxx?.ckrq1 ? jcxx?.ckrq1 : '',
        ckspDm: v?.value,
        slType: "Y",
        ssq: jcxx?.ssq,
      }
      querySpdmXxCj(obj).then((res: any) => {
        if (res.code == '200') {
          const sbspmc = myUtil.code.getCodeValByKey(v?.value, 'code_dm_cs_ckts_cksp:03');
          if (sbspmc) {
            form.setFieldsValue({ sbspmc: sbspmc });
          }
          form.setFieldsValue({ sbspDm: v?.value });
        } else if (res.code == '900') {
          message.info(res.msg);
          form.setFieldsValue({ sbspDm: '', sbspmc: '' });
        } else {
          message.error(res.desc)
          form.setFieldsValue({ sbspDm: '', sbspmc: '' });
        }
      })
    }
  }

  const onBlurSsq = (e: any) => {
    const jcxx = form.getFieldsValue();
    if (jcxx?.ssq && jcxx.sbpc) {
      const obj: any = {
        ssq : jcxx?.ssq,
        sbpc : jcxx.sbpc
      }
      queryCjGlh(obj).then((res: any) => {
        const { code, body, desc } = res;
        if (code === '200') {
          form.setFieldsValue({ glh: body?.glh, sbpc: obj.sbpc, ssq: obj.ssq })
        } else {
          message.error(desc);
        }
      });
    }
    form.validateFields(['sbpc']);
  }

  const onBlurSbpc = (e: any) => {
    const jcxx = form.getFieldsValue();
    if (jcxx?.sbpc) {
      if (jcxx?.sbpc === 0) {
        form.setFieldsValue({
          sbpc: '001',
        });
      } else {
        form.setFieldsValue({
          sbpc: myUtil.text.leadingZeroize(jcxx?.sbpc, 3),
        });
      }
      form.validateFields(['ssq']);
      if (jcxx?.ssq) {
        const obj: any = {
          ssq : form.getFieldsValue()?.ssq,
          sbpc: form.getFieldsValue()?.sbpc,
        }
        queryCjGlh(obj).then((res: any) => {
          const { code, body, desc } = res;
          if (code === '200') {
            form.setFieldsValue({ glh: body?.glh, sbpc: obj.sbpc, ssq: obj.ssq })
          } else {
            message.error(desc);
          }
        });
      }
    }
  }

  // 业务类型代码
  const cktmsywlxdmjh = (param: any) => {
    const { form } = param;
    const cktmsywlxdmjh = form?.getFieldValue('cktmsywlxdmjh');
    let codeKey;
    if (history?.location?.pathname.indexOf('/04/0403/040301') > -1 || history?.location?.pathname.indexOf('/27/2704/270401') > -1) {
      // 外贸综合服务企业代办退税申报表
      codeKey = '05';
    } else {
      // 货物劳务及服务退税申报
      codeKey = '10';
    }
    const option = myUtil.code.getCode('code_dm_ckts_cktmsywlx', codeKey);
    let arrId: any[] = [];
    let newVal: any[] = [];
    for (let i = 0; i < option.length; i++) {
      for (let j = 0; j < cktmsywlxdmjh.length; j++) {
        if (option[i].code == cktmsywlxdmjh[j]) {
          arrId.push(option[i]['code']);
          newVal.push(option[i]['name']);
        }
      }
    }
    // 出口非自产货物 出口明细业 代办退税明细 业务类型
    if (arrId.length > 3) {
      message.info('业务类型最多选择三项，请确认后填报！');
      arrId = arrId.splice(0, 3);
      newVal = newVal.splice(0, 3);
    }
    form.setFieldsValue({ cktmsywlxdmjh: arrId });
    if (arrId) {
      form.setFieldsValue({ cktmsywlxmcjh: newVal.join(',') });
    } else {
      form.setFieldsValue({ cktmsywlxmcjh: '' });
    }
  }
  // 货物类型代码
  const onChangeDbtsywlxDm = (param: any) => {
    const { form, value } = param;
    const dbtsywlxmc = myUtil.code.getCodeValByKey(value, 'code_dm_ckts_dbtsywlx:01');
    if (dbtsywlxmc) {
      form.setFieldsValue({ dbtsywlxmc: dbtsywlxmc });
    }
  }

  const validatorFlag = {
    // 所属期
    ssq: (form: any) => {
      const validator = async (_rule: any, value: any) => {
        const sbpc = form?.getFieldValue('sbpc');    // 表单其他项目
        if (value === '' || value === undefined) {
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_required' })));// '请输入申报批次！'
        } else if (!value.match(/^\d+$/)) {
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_number' })));// '该项内容只能输入数字！'
        } else if (!value.match(/^[1-9]\d{3}(0[1-9]|1[0-2])$/)) {
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_d_yyyyMM' })));// '请输入正确的年月格式yyyyMM！'
        }
        if (value) {
          let pageStyle;
          if (history?.location?.pathname.indexOf('/04/0403/040301') > -1 || history?.location?.pathname.indexOf('/27/2704/270401') > -1) {
            // 外贸综合服务企业代办退税申报表
            pageStyle = 'dbts';
          } else {
            // 货物劳务及服务退税申报
            pageStyle = 'tssb';
          }
          let params = {
            tableKey: pageStyle == 'dbts' ? 'DBTS_ZXSB_SB_DB_TSSB_G' : 'MTS_ZXSB_SB_MTS_TSSB_G',
            sbpc,
            ssq: value,
          };
          await checkSsqPcYsb(params).then((response) => {
            const { code, msg } = response;
            if (code !== '200') {
              return Promise.reject(new Error(msg));
            }
            return Promise.resolve();
          }).catch((err) => {
            return Promise.reject(err);
          });
        }
        return Promise.resolve();
      };
      return { validator };
    },
    // 申报批次
    sbpc: (form: any) => {
      const validator = async (_rule: any, value: any) => {
        const ssq = form?.getFieldValue('ssq');    // 表单其他项目
        if (value === '' || value === undefined) {
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_required' })));// '请输入申报批次！'
        } else if (!value.match(/^\d+$/)) {
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_number' })));// '该项内容只能输入数字！'
        }
        if (value) {
          let pageStyle;
          if (history?.location?.pathname.indexOf('/04/0403/040301') > -1 || history?.location?.pathname.indexOf('/27/2704/270401') > -1) {
            // 外贸综合服务企业代办退税申报表
            pageStyle = 'dbts';
          } else {
            // 货物劳务及服务退税申报
            pageStyle = 'tssb';
          }
          let params = {
            tableKey: pageStyle == 'dbts' ? 'DBTS_ZXSB_SB_DB_TSSB_G' : 'MTS_ZXSB_SB_MTS_TSSB_G',
            ssq,
            sbpc: myUtil.text.leadingZeroize(value, 3),
          };
          await checkSsqPcYsb(params).then((response) => {
            const { code, msg } = response;
            if (code !== '200') {
              return Promise.reject(new Error(msg));
            }
            return Promise.resolve();
          }).catch((err) => {
            return Promise.reject(err);
          });
        }
        return Promise.resolve();
      };
      return { validator };
    },
    glh: (form: any) => {
      const validator = async (_rule: any, value: any) => {
        const ssq = form?.getFieldValue('ssq');    // 表单其他项目
        const sbpc = form?.getFieldValue('sbpc');    // 表单其他项目
        const uuid = form?.getFieldValue('uuid');    // 表单其他项目
        if (value === '' || value === undefined) {
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_required' })));
        } else if (!value.match(/^\d+$/)) {
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_number' })));// '该项内容只能输入数字！'
        }
        if (value) {
          let params = {
            ssq: ssq,
            sbpc: sbpc,
            glh: value,
            uuid: uuid,
          };
          await checkMtsTssbGlh(params).then((response: any) => {
            const { code, msg } = response;
            if (code !== '200') {
              return Promise.reject(new Error(msg));
            }
            return Promise.resolve();
          }).catch((err) => {
            return Promise.reject(err);
          });
        }
        return Promise.resolve();
      };
      return { validator };
    },
    // 委托代办退税生产企业纳税人识别号wtdbtsscqynsrsbh
    wtdbtsscqynsrsbh: (form: any) => {
      const validator = async (_rule: any, value: any) => {
        if (value === '' || value === undefined) {
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_required' })));// '请输入委托代办退税生产企业纳税人识别号！'
        } else if (!value.match(/^\w+$/)) {
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_english_number' })));// '该项内容只能输入数字字母！'
        }
        if (value && value.length != 15 && value.length != 18) {
          return Promise.reject(new Error(intl2.formatMessage({ id: 'message_mdts_validator_wtdbtsscqynsrsbh' })));
        } else {
          return Promise.resolve();
        }
      }
      return { validator };
    },
    // 货物类型代码
    dbtsywlxDm: (form: any) => {
      const validator = async (_rule: any, value: any) => {
        if (value === '' || value === undefined) {
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_required' })));// '请输入货物类型代码！'
        } else if (!value.match(/^\w+$/)) {
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_english_number' })));// '该项内容只能输入数字字母！'
        } else {
          return Promise.resolve();
        }
      }
      return { validator };
    },
    // 出口发票号
    ckfph: (form: any) => {
      const validator = async (_rule: any, value: any) => {
        if (value === '' || value === undefined || value === " ") {
          return Promise.reject(new Error(intl2.formatMessage({id: 'validator_required'})));// '请输入出口发票号！'
        } else if (value && value.length > 30) {
          return Promise.reject(new Error('不能大于30个字符'));
        } else {
          return Promise.resolve();
        }
      }
      return {validator};
    },
  }

  const inputLayput = {
    label: { xs: 4, sm: 4, md: 4, lg: 3, xl: 3, xxl: 3 },
    formItem: { xs: 18, sm: 18, md: 18, lg: 9, xl: 5, xxl: 5 },
  }

  let tmpItems: any = []
  if (history?.location?.pathname.indexOf('/04/0403/040301') > -1 || history?.location?.pathname.indexOf('/27/2704/270401') > -1) {
    // 外贸综合服务企业代办退税申报表
    tmpItems = [
      { name: 'groupTitle1', type: itemType.GroupTitle, label: '基础信息' },
      { name: 'ssq', type: itemType.Input, label: '所属期', validator: [validatorFlag.ssq], onBlur: onBlurSsq, rules: [{ type: 'base_required' }], layout: inputLayput },
      { name: 'sbpc', type: itemType.Input, label: '申报批次', validator: [validatorFlag.sbpc], onBlur: onBlurSbpc, rules: [{ type: 'base_required' }], layout: inputLayput },
      { name: 'wtdbtsscqynsrsbh', type: itemType.Input, label: '委托代办退税生产企业纳税人识别号（统一社会信用代码）', rules: [{ type: 'base_required' }], layout: inputLayput, validator: [validatorFlag.wtdbtsscqynsrsbh] },
      { name: 'dbtsywlxDm', type: itemType.Select, label: '货物类型代码', rules: [{ type: 'base_required' }], showType: '3', onChange: onChangeDbtsywlxDm, codeTable: 'code_dm_ckts_dbtsywlx:01', layout: inputLayput, validator: [validatorFlag.dbtsywlxDm] },
      {
        name: 'sbspDm', type: itemType.Select, label: '申报商品代码', showType: '3', codeTable: 'code_dm_cs_ckts_cksp:03', layout: inputLayput,
        onChange: (v: any) => { sbSpChange(v) }
      },
      { name: 'cktmsywlxdmjh', type: itemType.Select, label: '业务类型代码', showType: '3', mode: 'multiple', onChange: cktmsywlxdmjh, codeTable: 'code_dm_ckts_cktmsywlx:05', validator: [businessValidator.cktmsywlxdmjh] },
      { name: 'ckbgdh', type: itemType.Hidden, label: '报关单号' },
      { name: 'ckrq1', type: itemType.Hidden, label: '出口日期' },
      { name: 'cktmsywlxmcjh', type: itemType.Hidden, label: '业务类型名称' },
      { name: 'dbtsywlxmc', type: itemType.Hidden, label: '货物类型名称' },
      { name: 'sbxh', type: itemType.Hidden, label: '申报序号' },
      { name: 'sbspmc', type: itemType.Hidden, label: '申报商品名称' },
      { name: 'uuid', type: itemType.Hidden, label: 'uuid' },
      { name: 'groupTitle2', type: itemType.GroupTitle, label: '出口信息' },

    ];
  } else {
    // 货物劳务及服务退税申报
    tmpItems = [
      { name: 'groupTitle1', type: itemType.GroupTitle, label: '基础信息' },
      { name: 'ssq', type: itemType.Input, label: '所属期', validator: [validatorFlag.ssq], onBlur: onBlurSsq, rules: [{ type: 'base_required' }], layout: inputLayput },
      { name: 'sbpc', type: itemType.Input, label: '申报批次', validator: [validatorFlag.sbpc], onBlur: onBlurSbpc, rules: [{ type: 'base_required' }], layout: inputLayput },
      { name: 'glh', type: itemType.Input, label: '关联号', rules: [{ type: 'base_required' }], validator: [validatorFlag.glh], layout: inputLayput },
      {
        name: 'ckfph', type: itemType.Input, label: '出口发票号', layout: inputLayput, validator: [validatorFlag.ckfph], rules: [
          {type: 'base_required'}, {type: 'base_string', range: [0, 30]}]
      },
      // { name: 'ckfph', type: itemType.Input, label: '出口发票号', tooltip: '若此处不填出口发票号，则生成的出口明细数据中，使用合同号做为出口发票号。', layout: inputLayput, validator: [
      //   validatorFlag.ckfph,
      //   baseValidator.range2({ min: 0, max: 30 }),
      // ] },
      {
        name: 'sbspDm', type: itemType.Select, label: '申报商品代码', showType: '3', codeTable: 'code_dm_cs_ckts_cksp:03', layout: inputLayput,
        onChange: (v: any) => { sbSpChange(v) }
      },
      { name: 'cktmsywlxdmjh', type: itemType.Select, label: '业务类型代码', showType: '3', mode: 'multiple', onChange: cktmsywlxdmjh, codeTable: 'code_dm_ckts_cktmsywlx:10', validator: [businessValidator.cktmsywlxdmjh] },
      { name: 'ckbgdh', type: itemType.Hidden, label: '报关单号' },
      { name: 'ckrq1', type: itemType.Hidden, label: '出口日期' },
      { name: 'cktmsywlxmcjh', type: itemType.Hidden, label: '业务类型名称' },
      { name: 'sbxh', type: itemType.Hidden, label: '申报序号' },
      { name: 'sbspmc', type: itemType.Hidden, label: '申报商品名称' },
      { name: 'uuid', type: itemType.Hidden, label: 'uuid' },
      { name: 'groupTitle2', type: itemType.GroupTitle, label: '出口信息' },
    ];
  }

  const inputNumperFormatter = (value: any, info: any, format: any) => {
    if (info.userTyping) {
      if (info.input) {
        return info.input;
      } else {
        if (value) {
          return value;
        }
        return '';
      }
    } else {
      if (value) {
        return myUtil.text.formatNum(value, format);
      }
      return '';
    }
  };

  const ckjhTool = ['出口/进货数量需按照报关单的商品法定单位、成交单位、第二单位中的一种单位对应的数量填写', <br />, '出口/进货数量合计需与报关单对应单位的数']
  // 配置列表列
  const columns = [
    { title: '发票号码', dataIndex: 'fphm', width: 160, ellipsis: true },
    { title: '发票代码', dataIndex: 'fpDm', width: 140, ellipsis: true },
    {
      title: '发票状态', dataIndex: 'rzjhztdm', width: 140, render: (text: any, row: any) => {
        return <span>{row.rzjhztdm == 'YY' ? '认证/稽核' : row.rzjhztdm == 'YN' ? '认证' : '稽核'}</span>
      }
    },
    { title: '发票行号', dataIndex: 'hh', width: 80, ellipsis: true },
    { title: '商品名称', dataIndex: 'hwhyslwmc', width: 140, ellipsis: true },
    {
      title: <Tooltip title={ckjhTool}>
        <span>
          出口/进货数量
          <QuestionCircleOutlined />
        </span>
      </Tooltip>,
      dataIndex: 'sl', width: 150,
      render: (text: any, row: any, index: any) => {
        // return <InputNumber controls={false} defaultValue={row.fpsysl} value={text} onChange={(e: any) => onChangeJssl(e, { row }, { index })}
        //   formatter={(value: any, info: any) => { return inputNumperFormatter(value, info, '0,0.00000') }}
        // />
        if (row?.errMsg) {
          return <div>
            <InputNumber controls={false} defaultValue={row.fpsysl} value={text} onChange={(e: any) => onChangeJssl(e, { row }, { index })}
              formatter={(value: any, info: any) => { return inputNumperFormatter(value, info, '0,0.00000') }}
          />
          <div style={{ fontSize: '8px', marginTop: '4px' }}>
                {row?.errMsg}
              </div>
        </div>
        } else {
          return <InputNumber controls={false} defaultValue={row.fpsysl} value={text} onChange={(e: any) => onChangeJssl(e, { row }, { index })}
            formatter={(value: any, info: any) => { return inputNumperFormatter(value, info, '0,0.00000') }}
          />
        }
      }
    },
    {
      title: '单价', dataIndex: 'dj', align: 'right', width: 140, ellipsis: true
    },
    {
      title: '计税金额', dataIndex: 'pdje', width: 130,
      render: (text: any, row: any, index: any) => {
        return <InputNumber controls={false} value={text} max={row.syje} min={0} onChange={(e: any) => onChangeJsje(e, { row }, { index })}
          formatter={(value: any, info: any) => { return inputNumperFormatter(value, info, '0,0.00') }}
        />
      }
    },
    {
      title: '开票日期', dataIndex: 'kprq', width: 100,
      render: (text: any) => {
        return <span>{text}</span>
      }
    },
    { title: '发票单位', dataIndex: 'jldwmc', width: 100, ellipsis: true },
    {
      title: '发票数量', dataIndex: 'fpsl', width: 140,
      render: (text: any) => {
        return <span>{myUtil.grid.formatNum(text, '0, 0.00000')}</span>
      }
    },
  ];

  //筛选发票点击事件
  const sxfp = () => {
    setSpVisible(true);
  }
  //移除发票点击事件
  const ycfp = async () => {
    const xefp = [...selectCkSpData];
    const delData = [];
    const dataNew = [];
    if (xefp.length == 0) {
      message.info(intl.formatMessage({ id: 'message_delete_unselected' }))
      return;
    }
    for (let i = 0; i < xefp.length; i++) {
      delData.push(xefp[i].uuid);
    }
    for (let i = 0; i < gridData.length; i++) {
      if (delData.indexOf(gridData[i].uuid) == -1) {
        dataNew.push(gridData[i]);
      }
    }
    setGridData(dataNew);
    jsje(dataNew);
    jssl(dataNew);
  }

  //生成明细点击事件
  const scmx = async () => {
    // 代办退税 DBTS_ZXSB_SB_DB_TSSB_G
    //
    const jcxx = await form.validateFields();
    const chack = pdFun.scmxCheck(jcxx, records, gridData, myUtil.grid.formatNum(jshuiSl, '0.00000'));
    if (chack) {
      let pageStyle: any;
      if (history?.location?.pathname.indexOf('/04/0403/040301') > -1 || history?.location?.pathname.indexOf('/27/2704/270401') > -1) {
        // 外贸综合服务企业代办退税申报表
        pageStyle = 'dbts';
      } else {
        // 货物劳务及服务退税申报
        pageStyle = 'tssb';
      }
      const objYsb = {
        sbpc: jcxx.sbpc,
        ssq: jcxx.ssq,
        tableKey: pageStyle == 'dbts' ? 'DBTS_ZXSB_SB_DB_TSSB_G' : 'MTS_ZXSB_SB_MTS_TSSB_G',
      }
      setMasker(true)
      checkSsqPcYsb(objYsb).then((resYsb: any) => {
        setMasker(false)
        if (resYsb.code === '200') {
          if (pageStyle == 'dbts') {
            const newGrid = gridData;
            for (let i = 0; i < newGrid.length; i++) {
              newGrid[i].baseXH = i + 1;
              newGrid[i].LAY_TABLE_INDEX = i;
            }
            const xx = jcxx;
            const newRec = records;
            let tep = Object.assign(xx, newRec)
            // 表单特殊类型处理
            if (tep['cktmsywlxdmjh']) {
              tep['cktmsywlxdmjh'] = tep['cktmsywlxdmjh'].join(',');
            }
            if (tep['ckrq1']) {
              tep['ckrq1'] = moment(tep['ckrq1']).format('YYYY-MM-DD');
            }
            const obj = {
              formVal: tep,
              gridVal: gridData,
              slType: chack,
            }
            znpdBgdPdDb(obj).then((res: any) => {
              if (res.code === '200') {
                message.success(res.body)
                close();
              } else {
                message.error(res.desc);
              }
            })
          } else {
            const objGlh = {
              glh: jcxx.glh,
              sbpc: jcxx.sbpc,
              ssq: jcxx.ssq,
              uuid: records.uuid,
            }
            setMasker(true)
            checkMtsTssbGlh(objGlh).then(async (resGlh: any) => {
              setMasker(false)
              if (resGlh.code === '200') {
                // const formVal = records;
                // formVal.ssq = jcxx.ssq;
                // formVal.sbpc = jcxx.sbpc;
                // formVal.glh = jcxx.glh;
                // formVal.cktmsywlxdmjh = jcxx.cktmsywlxdmjh;
                // formVal.ckfph = jcxx.ckfph;
                // formVal.sbspDm = jcxx.sbspDm;
                const newGrid = gridData;
                for (let i = 0; i < newGrid.length; i++) {
                  newGrid[i].baseXH = i + 1;
                  newGrid[i].LAY_TABLE_INDEX = i;
                }
                const xx = jcxx;
                const xghCkfph = jcxx.ckfph;
                const newRec = records;
                let tep = Object.assign(xx, newRec);
                tep['ckfph'] = xghCkfph;
                // 表单特殊类型处理
                if (tep['cktmsywlxdmjh']) {
                  tep['cktmsywlxdmjh'] = tep['cktmsywlxdmjh'].join(',');
                }
                const obj = {
                  formVal: tep,
                  gridVal: gridData,
                  slType: chack,
                }
                //校验发票金额是否超出发票总金额
                obj['pdType']='bgdzxpd';//发票逐项配单；
                const fpjeCheckObj = await pdCheckByHistoryData(obj);
                if ('200' != fpjeCheckObj.code) {
                  const otherRef = unitRefs.current?.getOtherRefs();
                  otherRef[2].current!.showModal(fpjeCheckObj);
                  return false;
                }
                setMasker(true);
                znpdBgdPd(obj).then((res: any) => {
                  setMasker(false)
                  if (res.code === '200') {
                    message.success(res.body)
                    close();
                  } else {
                    message.error(res.desc);
                  }
                })
              } else if (resGlh.code === '900') {
                message.info(resGlh.msg)
              } else {
                message.error(resGlh.desc)
              }
            })
          }
        } else if (resYsb.code === '900') {
          message.info(resYsb.msg)
        } else {
          message.error(resYsb.desc)
        }
      })
    }
  }
  //计算计税金额
  const jsje = (data: any) => {
    let je = 0;
    data.map((value: number, key: any) => {
      je = je + Number(value?.pdje);
    })
    setJshuiJe(myUtil.grid.formatNum(je, '0, 0.00'));
  }
  //计算计税数量
  const jssl = (data: any) => {
    let sl = 0;
    data.map((value: number, key: any) => {
      const sls = value.sl == undefined ? 1 : value.sl;
      sl = sl + Number(sls);
    })
    setJshuiSl(myUtil.grid.formatNum(sl, '0, 0.00000'));
  }
  //计税金额值改变事件
  const onChangeJsje = async (val: any, row: any, index: any) => {
    val = val == null ? 0 : val;
    row.row.pdje = val;
    let data = [...gridData];
    data[index] = row.row;
    setGridData(data);
    jsje(data);
  }

  //计税数量值改变事件
  const onChangeJssl = async (val: any, row: any, index: any) => {
    if (zdzsjebz) {
      val = val == null ? 0 : val;
      const sysl = row.row.sysl;
      if (val > sysl) {
        row.row.sl = val;
        row.row.pdje = row.row.syje;
        row.row.errMsg = '大于可配单数量' + sysl;
        let data = [...gridData];
        data[index] = row.row;
        setGridData(data);
        jsje(data);
        jssl(data);
      } else {
        row.row.sl = val;
        row.row.pdje  = (val*row.row.je /row.row.fpsl).toFixed(2) > row.row.je ?row.row.je : (val*row.row.je /row.row.fpsl).toFixed(2);
        row.row.errMsg = '';
        let data = [...gridData];
        data[index] = row.row;
        setGridData(data);
        jsje(data);
        jssl(data);
      }
    } else {
      val = val == null ? 1 : val;
      row.row.sl = val;
      row.row.errMsg = '';
      let data = [...gridData];
      data[index] = row.row;
      setGridData(data);
      jssl(data);
    }
  }
  //子页面关闭事件
  const close = () => {
    setModalVisible(false);
    setGridData([]);
    setJshuiJe(0);
    setJshuiSl(0);
    setValue(1);
    unitRefs.current!.reload2();
    unitRefs.current!.setSelectionRowKeys([]);
    unitRefs.current!.setSelectionRows([]);
  }
  /********************************************************************筛选*********************************************************************/

  // 筛选发票（商品）
  const funSp: any = {
    inputRef1 : useRef(),
    unitRef: React.createRef(),
    //添加发票
    fptianjia: (param: any) => {
      const { selectionRows, unitRef } = param;
      //添加发票
      const newArray = pdFun.bgdpd(gridData, selectionRows, value);
      setGridData(newArray);
      unitRef?.current?.setGridHeaderInfoCustomer(`当前已添加${newArray.length}条发票信息`);
      //计算计税金额
      jsje(newArray);
      //计算计税数量
      jssl(newArray);
      setSpVisible(false);
    },
    // 关单品名查询
    gdpmcx: (param: any) => {
      const { unitRef } = param;
      spConfig.filter_items[1].defaultValue = records?.hgspmc
      unitRef.current?.addQueryModel(records?.hgspmc, 'hwhyslwmc');
    },
    useEffectEnd: (param: any) => {
      if (spVisible) {
        funSp?.inputRef1?.current.focus({cursor: 'start'});
      }
    }
  };

  //数量单位拼接
  columnsRender.slordwpj = (param: any) => {
    return param.record.sl + '/' + param.record.dw;
  }

  // 商品明细
  const ckbgdRowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectCkSpData(selectedRows);
    }
  };

  const spConfig: any = {
    grid_api_grid_query: `/yw/bszx/wbsj/dzdzfp/queryPdFpPage`,
    grid_selection_type: 'checkbox',
    grid_row_key: 'uuid',
    grid_show_data_num: false,
    show_toolbar: true,
    click_checked: '1',
    grid_header_info: `当前已添加${gridData.length}条发票明细`,
    layout_type: 'modal',
  };

  // 配置项：列表筛选项
  spConfig.filter_items = [
    { name: 'fphm', label: '发票号码', type: 'Input' },
    { name: 'hwhyslwmc', label: '货物或应税劳务、服务名称', type: 'Input' },
    { name: 'kprq', label: '开票日期', type: 'DatePicker', range: true },
    { name: 'xfnsrsbh', label: '销售方纳税人识别号', type: 'Input' },
  ];
  spConfig.filter_items[0].ref = funSp.inputRef1;
  spConfig.filter_items[1].defaultValue = records?.hgspmc;

  spConfig.grid_columns = [
    { title: 'uuid', dataIndex: 'uuid', hidden: true },
    { title: '发票号码', dataIndex: 'fphm', sorter: true, width: 180, ellipsis: true },
    { title: '发票代码', dataIndex: 'fpDm', sorter: true, width: 120, ellipsis: true },
    {
      title: '认证/稽核状态', dataIndex: 'rzjhztdm', width: 140, codeTable: 'CODE_STATIC_TZ_FPZT:01',
      filter: {
        type: 'Select',
        codeTable: 'CODE_STATIC_TZ_FPZT:01',
      }
    },
    { title: '销售方纳税人识别号', dataIndex: 'xfnsrsbh', width: 160, ellipsis: true },
    { title: '开票日期', dataIndex: 'kprq', width: 100, sorter: true, render: { type: 'date', format: 'yyyy-MM-DD' } },
    { title: '行号', dataIndex: 'hh', width: 90 },
    { title: '数量', dataIndex: 'fpsl', width: 120, align: 'right', render: { type: 'number', format: '0,0.00000' } },
    { title: '剩余数量', dataIndex: 'sl', width: 120, align: 'right', render: { type: 'number', format: '0,0.00000' } },
    { title: '单价', dataIndex: 'dj', align: 'right', width: 140, ellipsis: true },
    { title: '计税金额', dataIndex: 'je', align: 'right', width: 120, render: { type: 'number', format: '0,0.00' } },
    { title: '剩余计税金额', dataIndex: 'pdje', align: 'right', width: 120, render: { type: 'number', format: '0,0.00' } },
    { title: '货物或应税劳务、服务名称', dataIndex: 'hwhyslwmc', width: 200, ellipsis: true },
    { title: '规格型号', dataIndex: 'ggxh', width: 180, ellipsis: true },
    { title: '单位', dataIndex: 'jldwmc', align: 'left', width: 80, ellipsis: true },
    { title: '税率', dataIndex: 'sl1', align: 'right', width: 80, render: { type: 'number', format: '0,0.0000' } },
    { title: '税额', dataIndex: 'se', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
    /*{ title: '剩余税额', dataIndex: 'syse', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },*/
    { title: '备注', dataIndex: 'bz', width: 160, ellipsis: true },
  ];
  spConfig.toolbar_default = {
    setting: true,
  };
  // 配置项：列表操作列
  spConfig.grid_handle_columns_default = {
    edit: false,    // 是否显示编辑链接，默认开启
    delete: false,  // 是否显示删除链接，默认开启
  };
  // 配置项：自定义工具栏
  spConfig.customer_toolbar = [
    { name: '关单品名查询', func: 'gdpmcx' },
    { name: '添加', func: 'fptianjia' },
  ];
  // 27/2704/270401 代办
  if (history?.location?.pathname.indexOf('/27/2704/270401') > -1) {
    spConfig.gridParams = {
      initSearchModal: [
        { property: "fpsbztDms", value: ['1'], op: "al" },
        { property: "notInFpcllxDm", value: ["1", "2", "3", "5"], op: "al" },
      ],
    }
  } else {
    spConfig.gridParams = {
      initSearchModal: [
        { property: "fpsbztDms", value: ['1'], op: "al" },
        { property: "notInFpcllxDm", value: ["2", "3", "4", "5"], op: "al" },
      ],
    }
  }

  /********************************************************************筛选*********************************************************************/
  return (
    <>
      <Modal
        title="配单"
        destroyOnHidden={true}
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X4}
        wrapClassName="standard-modal-1"
        className={`${masker ? 'dd_modal_show_masker' : ''}`}
        mask={{ closable: false }}
        onCancel={() => close()}
        footer={(<>
          <Button type="primary" onClick={scmx} >保存</Button>
          <Button onClick={() => close()} type="default">关闭</Button>
        </>)}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <DDBaseForm items={formItems} form={form} />
          <Form
            form={form2}
            name="basic"
            preserve={false}
            labelCol={{ span: 9, offset: 10 }}
            wrapperCol={{ span: 14 }}
            layout="inline"
            style={{ overflowX: 'hidden' }}
          >
            <Form.Item label="出口报关单号" name="ckbgdh" className={styles.divForm2} >
              <div className={styles.divForm}>{records ? records.ckbgdh : ''}</div>
            </Form.Item>
            <Form.Item label="商品代码" name="ckspDm" className={styles.divForm2} >
              <div className={styles.divForm}>{records ? records.ckspDm : ''}</div>
            </Form.Item>
            <Form.Item label="商品名称" name="hgspmc" className={styles.divForm2} >
              <div className={styles.divForm}>{records ? records.hgspmc : ''}</div>
            </Form.Item>
            <Form.Item label="出口日期" name="ckrq1" className={styles.divForm2} >
              <div className={styles.divForm}>{moment(new Date(Number(records?.ckrq1))).format('YYYY-MM-DD')}</div>
            </Form.Item>
            <Form.Item label="规格型号" name="ggxh" className={styles.divForm2}>
              <div className={styles.divForm}>
                <Space style={{marginLeft: '10px'}}>
                  <Tooltip title={records?.ggxh}>
                    <span>
                      {records?.ggxh ? records?.ggxh?.length > 13 ? records?.ggxh?.substring(0,13) + '...' : records?.ggxh : ''}
                    </span>
                  </Tooltip>
                </Space>
              </div>
            </Form.Item>
            <Form.Item label="成交单位" name="sbjldwmc" className={styles.divForm2} >
              <div className={styles.divForm}>{records?.sbjldwmc}</div>
            </Form.Item>
            <Form.Item label="可用成交数量" name="cjsl1" className={styles.divForm2}>
              <div className={styles.divForm}>{myUtil.grid.formatNum(records?.cjsl1, '0, 0.00000')}</div>
            </Form.Item>
            <Form.Item label="法定单位" name="hgjldwmc" className={styles.divForm2}>
              <div className={styles.divForm}>{records?.hgjldwmc}</div>
            </Form.Item>
            <Form.Item label="可用法定数量" name="cksl" className={styles.divForm2}>
              <div className={styles.divForm}>{myUtil.grid.formatNum(records?.cksl, '0, 0.00000')}</div>
            </Form.Item>
            <Form.Item label="第二单位" name="dejldwDm" className={styles.divForm2}>
              <div className={styles.divForm}>{myUtil.code.getCodeValByKey(records?.dejldwDm, 'CODE_DM_CKTS_HGJLDW:01')}</div>
            </Form.Item>
            <Form.Item label="可用第二单位数量" name="decksl" className={styles.divForm2}>
              <div className={styles.divForm}>{myUtil.grid.formatNum(records?.decksl, '0, 0.00000')}</div>
            </Form.Item>
            <Form.Item label="可用人民币离岸价" name="rmblaj" className={styles.divForm2} >
              <div className={styles.divForm}>{myUtil.grid.formatNum(records?.rmblaj, '0, 0.00')}</div>
            </Form.Item>
            <Form.Item label="可用美元离岸价" name="mylaj" className={styles.divForm2} >
              <div className={styles.divForm}>{myUtil.grid.formatNum(records?.mylaj, '0, 0.00')}</div>
            </Form.Item>
          </Form>
          <Col span={24}>
            <div id="dikasaa" style={{ backgroundColor: '#f1f4f7', lineHeight: '32px', margin: '0 -20px 20px -20px', marginLeft: 'auto', marginRight: 'auto' }}>&nbsp;进货信息</div>
          </Col>
          <div>
            <Space>
              <Button onClick={sxfp} ><BarsOutlined />选择发票信息</Button>
            </Space>
            <Space style={{marginLeft: '15px'}}>
              <Switch size="default" checked={zdzsjebz} checkedChildren="动态调整计税金额模式" unCheckedChildren="固定计税金额模式" style={{marginTop:'-3px'}}
                onChange={(checked: any, event: any) => {
                  event.stopPropagation();
                  myUtil.localStore.setItem(zdzsjebzCk, checked);
                  setZdzsjebz(checked);
                }}
                ></Switch>
            </Space>
            <Space style={{marginLeft: '10px'}}>
              <Tooltip title={['1.动态调整计税金额模式：修改“出口/进货数量”时，系统将根据公式自动更新计税金额：计税金额 = 修改后的发票配单数量*(发票总计税金额÷发票总数量)。注意：不考虑关单单位和发票单位一致性。', <br />, '2.固定计税金额模式：修改“出口/进货数量”时，系统将保持原计税金额不变，不进行自动调整。']}>
                <span>
                  <QuestionCircleOutlined />
                </span>
              </Tooltip>
            </Space>
            <Space style={{ float: 'right' }}>
              <Button type="link" onClick={ycfp} >删除</Button>
            </Space>
          </div>
          <Table
            rowKey='uuid'
            size="small"
            pagination={false}
            rowSelection={{ type: 'checkbox', ...ckbgdRowSelection, }}
            columns={columns}
            dataSource={gridData}
            scroll={{ x: 'max-content' }}
            summary={() => {
              return (
                <Table.Summary.Row>
                  <Table.Summary.Cell colSpan={6} index={0} ><div style={{ textAlign: 'right' }}>合计</div></Table.Summary.Cell>
                  <Table.Summary.Cell colSpan={1} index={1} ><div style={{ textAlign: 'right' }}>{jshuiSl}</div></Table.Summary.Cell>
                  <Table.Summary.Cell colSpan={1} index={2} >
                    <div id="dikasaa2" style={{ textAlign: 'right' }}>{jshuiJe}</div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell colSpan={1} index={3} ></Table.Summary.Cell>
                </Table.Summary.Row>
              )
            }}
          />
        </Spin>

        <Drawer
          title="筛选发票"
          visible={spVisible}
          width={CONSTANTS.C_MODAL_WIDTH_X4}
          onClose={() => {
            const rowKeys = funSp.unitRef.current.getSelectionRowKeys();
            if (rowKeys.length > 0) {
              const selectionRows = funSp.unitRef.current.getSelectionRows()
              DDAlert.open({
                title: '系统提示',
                info: '你已勾选了' + rowKeys.length + '条发票数据，是否添加至进货信息？',
                infoType: 'question',
                modalType: 'confirm',
                closeStatus: false,
                okCallbackFn: function() {
                  DDAlert.close();
                  funSp.fptianjia({ selectionRows, unitRef: funSp.unitRef });
                },
              });
            } else {
              setSpVisible(false)
            }
          }}
          className="dd_data_page_modal"
          destroyOnHidden={true}
          mask={{ closable: false }}
        >
          <DDBunit2 config={spConfig} func={funSp} />
        </Drawer>
      </Modal>
    </>
  );
};

export default Mtspd;
