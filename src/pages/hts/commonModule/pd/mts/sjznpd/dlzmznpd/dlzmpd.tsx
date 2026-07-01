/**
 * 代理证明配单
 */
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { Button, Col, Drawer, Form, InputNumber, message, Modal, Space, Spin, Table, Tooltip } from 'antd';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import { itemType } from '@/components/DDForm/data.d';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import { useIntl } from 'umi';
import businessValidator from '@/pages/hts/common/field/businessValidator';
import UnitUtil from '@/components/DDBunit/unit_util';
import CONSTANTS from '@/components/DDAssist/constants';
import styles from './style.less';
import myUtil, { intl as intl2 } from '@/components/DDAssist/util';
import pdFun from './pdFun';
import { BarsOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { checkMtsTssbGlh, checkSsqPcYsb, dlzmZnpd, querySpdmXxCj, pdCheckByHistoryData } from '@/pages/hts/services/htsApi';
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
  //维度默认值radio
  const [value, setValue] = React.useState(1);
  //传入参数ckxx
  const [records, setRecords] = useState<any>();
  // 计税数量
  const [jshuiSl, setJshuiSl] = useState(0);
  // 计税金额
  const [jshuiJe, setJshuiJe] = useState(0);

  const [formItems, setFormItems] = useState<any>([]);
  // loading
  const [masker, setMasker] = useState<any>(false);

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
  };

  //调用后端接口基础信息初始化赋值
  const initFuncByJcxx = (body: any, rec: any) => {
    //请求后台接口
    form.setFieldsValue({
      ssq: body.ssq,
      sbpc: body.sbpc,
      glh: body.glh,
      ckbgdh: rec.ckbgdh,
      ckrq1: rec.ckrq1,
      ckfph: rec?.wtdlckhth,
      sbxh: body.sbxh
    });
    form2.setFieldsValue({
      pdje: rec.pdje,
    })
  }

  const onBlurSsq = (e: any) => {
    const jcxx = form.getFieldsValue();
    if (jcxx?.ssq && jcxx.sbpc) {
      const oldGlh = jcxx.glh ? jcxx.glh.substr(jcxx.glh.length - 8, jcxx.glh.length) : '00000001';
      const newglh = jcxx.ssq + jcxx.sbpc + oldGlh
      form.setFieldsValue({ glh: newglh });
    }
  }

  const onBlurSbpc = (e: any) => {
    const jcxx = form.getFieldsValue();
    if (jcxx?.sbpc) {
      form.setFieldsValue({
        sbpc: myUtil.text.leadingZeroize(jcxx?.sbpc, 3),
      });
      if (jcxx?.ssq) {
        const oldGlh = jcxx.glh ? jcxx.glh.substr(jcxx.glh.length - 8, jcxx.glh.length) : '00000001';
        const newglh = jcxx.ssq + myUtil.text.leadingZeroize(jcxx?.sbpc, 3) + oldGlh
        form.setFieldsValue({ glh: newglh });
      }
    }
  }
  // 业务类型代码
  const cktmsywlxdmjh = (param: any) => {
    const { form } = param;
    const cktmsywlxdmjh = form?.getFieldValue('cktmsywlxdmjh');
    const option = myUtil.code.getCode('CODE_DM_CKTS_CKTMSYWLX:10');
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
          let params = {
            tableKey: 'MTS_ZXSB_SB_MTS_TSSB_G',
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
          let params = {
            tableKey: 'MTS_ZXSB_SB_MTS_TSSB_G',
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
    }
  }

  const inputLayput = {
    label: { xs: 4, sm: 4, md: 4, lg: 3, xl: 3, xxl: 3 },
    formItem: { xs: 18, sm: 18, md: 18, lg: 9, xl: 5, xxl: 5 },
  }

  const tmpItems = [
    { name: 'groupTitle1', type: itemType.GroupTitle, label: '基础信息' },
    { name: 'uuid', type: itemType.Hidden, label: 'uuid' },
    { name: 'sbxh', type: itemType.Hidden, label: '申报序号', },
    { name: 'ssq', type: itemType.Input, label: '所属期', validator: [validatorFlag.ssq], onBlur: onBlurSsq, rules: [{ type: 'base_required' }], layout: inputLayput },
    { name: 'sbpc', type: itemType.Input, label: '申报批次', validator: [validatorFlag.sbpc], onBlur: onBlurSbpc, rules: [{ type: 'base_required' }], layout: inputLayput },
    { name: 'glh', type: itemType.Input, label: '关联号', rules: [{ type: 'base_required' }], validator: [validatorFlag.glh], layout: inputLayput },
    // BUG 23558
    //    { name: 'ckfph', type: itemType.Input, label: '出口发票号',  rules: [{ type: 'base_string', range: [0, 30]}], tooltip: '若此处不填出口发票号，则生成的出口明细数据中，使用合同号做为出口发票号。', layout: inputLayput },
    { name: 'ckfph', type: itemType.Input, label: '出口发票号', rules: [{ type: 'base_string', range: [0, 30] }], disabled: true },
    {
      name: 'sbspDm', type: itemType.Select, label: '申报商品代码', showType: '3', codeTable: 'code_dm_cs_ckts_cksp:03', layout: inputLayput,
      onChange: (v: any) => {
        sbSpChange(v)
      }
    },
    {
      name: 'cktmsywlxdmjh',
      type: itemType.Select,
      label: '业务类型代码',
      showType: '3',
      mode: 'multiple',
      onChange: cktmsywlxdmjh,
      codeTable: 'CODE_DM_CKTS_CKTMSYWLX:10',
      validator: [businessValidator.cktmsywlxdmjh]
    },
    { name: 'ckbgdh', type: itemType.Hidden, label: '报关单号' },
    { name: 'ckrq1', type: itemType.Hidden, label: '出口日期' },
    { name: 'cktmsywlxmcjh', type: itemType.Hidden, label: '业务类型名称' },
    { name: 'sbxh', type: itemType.Hidden, label: '申报序号' },
    { name: 'sbspmc', type: itemType.Hidden, label: '申报商品代码' },
    { name: 'groupTitle2', type: itemType.GroupTitle, label: '出口信息' }

  ];
  const ckjhTool = ['出口/进货数量需按照报关单的商品法定单位、成交单位、第二单位中的一种单位对应的数量填写', <br />, '出口/进货数量合计需与报关单对应单位的数']

  // 配置列表列
  const columns = [
    { title: '发票号码', dataIndex: 'fphm', width: 100, ellipsis: true, fixed: 'left' },
    { title: '发票代码', dataIndex: 'fpDm', width: 100, ellipsis: true, fixed: 'left' },
    {
      title: '发票状态', dataIndex: 'fpzt', width: 120, render: (text: any, param: any) => {
        text = '';
        if (param.rzxfzzszyfpbz === 'Y') {
          text = text + '已认证/';
        }
        if (param.rzxfzzszyfpbz != 'Y') {
          text = text + '未认证/';
        }
        if (param.jhxfzzszyfpbz === 'Y') {
          text = text + '已稽核';
        }
        if (param.jhxfzzszyfpbz != 'Y') {
          text = text + '未稽核';
        }
        return text;
      }
    },
    { title: '发票行号', dataIndex: 'hh', width: 80 },
    { title: '商品名称', dataIndex: 'hwhyslwmc', width: 140, ellipsis: true },
    {
      title: <Tooltip title={ckjhTool}>
        <span>
          出口/进货数量
          <QuestionCircleOutlined />
        </span>
      </Tooltip>,
      dataIndex: 'sl', width: 120,
      render: (text: any, row: any, index: any) => {
        return <InputNumber controls={false} defaultValue={row.sl} value={text} onChange={(e: any) => onChangeJssl(e, { row }, { index })}
          formatter={(value: any, info: any) => {
            return inputNumperFormatter(value, info, '0,0.00000')
          }}
        />
      }
    },
    {
      title: '计税金额', dataIndex: 'pdje', width: 130,
      render: (text: any, row: any, index: any) => {
        return <InputNumber controls={false} value={text} max={row.syje} min={0} onChange={(e: any) => onChangeJsje(e, { row }, { index })}
          formatter={(value: any, info: any) => {
            return inputNumperFormatter(value, info, '0,0.00')
          }}
        />
      }
    },
    { title: '开票日期', dataIndex: 'kprq', width: 90, },
    { title: '发票单位', dataIndex: 'jldwmc', width: 140, ellipsis: true },
    {
      title: '发票数量', dataIndex: 'fpsl', width: 140, align: 'right', ellipsis: true, render: (text: any) => {
        return <span>{myUtil.text.formatNum(text, '0,0.00000')}</span>
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

    jssl(dataNew);
    jsje(dataNew);
  }
  // 校验申报商品代码
  const sbSpChange = (v: any) => {
    const jcxx = form.getFieldsValue();
    if (v?.value) {
      const obj = {
        ckrq1: jcxx?.ckrq1,
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
  //生成明细点击事件
  const scmx = async () => {
    const jcxx = await form.validateFields();
    const chack = pdFun.scmxCheck(jcxx, records, gridData, myUtil.grid.formatNum(jshuiSl, '0.00000'));
    if (chack) {
      const objYsb = {
        sbpc: jcxx.sbpc,
        ssq: jcxx.ssq,
        tableKey: 'MTS_ZXSB_SB_MTS_TSSB_G',
      }
      setMasker(true)
      checkSsqPcYsb(objYsb).then((resYsb: any) => {
        setMasker(false)
        if (resYsb.code === '200') {
          const objGlh = {
            glh: jcxx.glh,
            sbpc: jcxx.sbpc,
            ssq: jcxx.ssq,
            uuid: records?.uuid,
          }
          setMasker(true)
          checkMtsTssbGlh(objGlh).then(async (resGlh: any) => {
            setMasker(false)
            if (resGlh.code === '200') {
              const newGrid = gridData;
              for (let i = 0; i < newGrid.length; i++) {
                newGrid[i].baseXH = i + 1;
                newGrid[i].LAY_TABLE_INDEX = i;
              }
              let tep = {
                ssq: "", sbpc: "", glh: "", cktmsywlxdmjh: "", ckfph: "", sbspDm: "", sbspmc: "",
                cktmsywlxmcjh: "", sbxh: "", uuid: "", dlckhwzmhm: "", ckspDm: "", ckspmc: "", ckrq1: "", sbjldwmc: "",
                sbsl1: "", hgjldwmc: "", cksl: "", dejldwmc: "", decksl: "", rmblaj: "", mylaj: "", sl: "", pdje: ""
              };
              tep.ssq = jcxx.ssq;
              tep.sbpc = jcxx.sbpc;
              tep.glh = jcxx.glh;
              tep.cktmsywlxdmjh = jcxx.cktmsywlxdmjh;
              tep.cktmsywlxmcjh = jcxx.cktmsywlxmcjh
              tep.sbspmc = jcxx.sbspmc;
              tep.sbspDm = jcxx.sbspDm
              tep.ckfph = jcxx.ckfph;
              tep.sbxh = jcxx.sbxh;
              tep.uuid = records.uuid;
              tep.dlckhwzmhm = records.dlckhwzmhm;
              tep.ckspDm = records.ckspDm;
              tep.ckspmc = records.ckspmc;
              tep.ckrq1 = records.ckrq1;
              tep.sbjldwmc = records.sbjldwmc;
              tep.sbsl1 = records.sbsl1;
              tep.hgjldwmc = records.hgjldwmc;
              tep.cksl = records.cksl;
              tep.dejldwmc = records.dejldwmc;
              tep.decksl = records.decksl;
              tep.rmblaj = records.rmblaj;
              tep.mylaj = records.mylaj;
              // 表单特殊类型处理
              if (tep['cktmsywlxdmjh']) {
                tep['cktmsywlxdmjh'] = tep['cktmsywlxdmjh'].join(',');
              }
              const decksl = records?.decksl; //d2
              const cksl = records?.cksl;     //fd
              const sbsl1 = records?.sbsl1;   //cj
              let sl: number = 0;
              for (let i = 0; i < gridData.length; i++) {
                sl = sl + gridData[i].sl;
              }
              const obj = {
                formVal: tep,
                gridVal: gridData,
                slType: 'fd',
              };
              if (sl == decksl) {
                obj.slType = 'd2'
              }
              if (sl == cksl) {
                obj.slType = 'fd'
              }
              if (sl == sbsl1) {
                obj.slType = 'cj'
              }
              //校验发票金额是否超出发票总金额
              obj['pdType'] = 'dlzmznpd';//发票逐项配单；
              const fpjeCheckObj = await pdCheckByHistoryData(obj);
              if ('200' != fpjeCheckObj.code) {
                const otherRef = unitRefs.current?.getOtherRefs();
                otherRef[1].current!.showModal(fpjeCheckObj);
                return false;
              }
              setMasker(true)
              dlzmZnpd(obj).then((res: any) => {
                setMasker(false)
                if (res.code === '200') {
                  message.success(res?.body?.msgInfo)
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
        } else if (resYsb.code === '900') {
          message.info(resYsb.msg)
        } else {
          message.error(resYsb.desc)
        }
      })
    }
  }
  //计税数量值改变事件
  const onChangeJssl = async (val: any, row: any, index: any) => {
    val = val == null ? 1 : val;
    row.row.sl = val;
    let data = [...gridData];
    data[index] = row.row;
    setGridData(data);
    jssl(data);
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
  //子页面关闭事件
  const close = () => {
    setModalVisible(false);
    setJshuiJe(0);
    setGridData([]);
    setValue(1);
    setJshuiSl(0);
    unitRefs.current!.reload2();
    unitRefs.current!.setSelectionRowKeys([]);
    unitRefs.current!.setSelectionRows([]);
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
  }


  /********************************************************************筛选*********************************************************************/

  // 筛选发票（商品）
  const funSp: any = {
    unitRef: React.createRef(),
    //添加发票
    fptianjia: (param: any) => {
      const { selectionRows, unitRef } = param;
      //添加发票
      const newArray = pdFun.bgdpd(gridData, selectionRows, value);
      setGridData(newArray);
      let sl = 0;
      let pdje = 0;
      for (let i = 0; i < newArray.length; i++) {
        sl = sl + newArray[i].sl
        pdje = pdje + newArray[i].pdje
      }
      setJshuiJe(myUtil.grid.formatNum(pdje, '0, 0.00'));
      setJshuiSl(myUtil.grid.formatNum(sl, '0, 0.00000'));
      unitRef?.current?.setGridHeaderInfoCustomer(`当前已添加${newArray.length}条发票信息`);
      setSpVisible(false);
    },
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
    }
  };

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
    grid_header_info: `当前已添加${gridData.length}条发票`,
    layout_type: 'modal',
  };

  // 配置项：列表筛选项
  spConfig.grid_filter_quick = [
    { name: 'fphm', label: '发票号码或后4位', type: 'Input' },
    { name: 'kprq', label: '开票日期', type: 'DatePicker', op: 'al', searchButton: true },
  ];
  spConfig.initSearchModal = [
    { property: 'fpsbztDms', values: ['1'], op: 'zdy' },
  ];
  //spConfig.filter_items[1].defaultValue = records?.hwhyslwmc

  spConfig.gridParams = {
    initSearchModal: [
      { property: "fpsbztDms", value: ['1'], op: "al" },
      { property: "notInFpcllxDm", value: ["2", "3", "4", "5"], op: "al" },
    ],
  }

  spConfig.grid_columns = [
    { title: '发票号码', dataIndex: 'fphm', width: 180, ellipsis: true, fixed: 'left' },
    { title: '发票代码', dataIndex: 'fpDm', width: 100, ellipsis: true, fixed: 'left' },
    { title: '发票状态', dataIndex: 'fpzt', width: 120, render: { func: 'fpzt' } },
    { title: '发票行号', dataIndex: 'hh', width: 80 },
    { title: '数量', dataIndex: 'fpsl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
    { title: '剩余数量', dataIndex: 'sl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
    { title: '计税金额', dataIndex: 'je', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
    { title: '剩余计税金额', dataIndex: 'pdje', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
    { title: '开票日期', dataIndex: 'kprq', width: 90, sorter: true, render: { type: 'date', format: 'yyyy-MM-DD' }, },
    { title: '销方纳税号', dataIndex: 'xfnsrsbh', width: 180, ellipsis: true },
    { title: '商品名称', dataIndex: 'hwhyslwmc', width: 150, ellipsis: true },
    { title: '单位', dataIndex: 'jldwmc', align: 'left', width: 80, ellipsis: true },
  ];
  spConfig.toolbar_default = {
    setting: true,                    // 是否显示设置按钮，默认关闭
    reload: true,                     // 是否显示刷新按钮，默认关闭
  };

  // 配置项：列表操作列
  spConfig.grid_handle_columns_default = {
    edit: false,    // 是否显示编辑链接，默认开启
    delete: false,  // 是否显示删除链接，默认开启
  };
  // 配置项：自定义工具栏
  spConfig.customer_toolbar = [
    // { name: '发票品名查询', func: 'gdpmcx' },
    { name: '添加', func: 'fptianjia' },
  ];


  /********************************************************************筛选*********************************************************************/
  return (
    <>
      <Modal
        title="智能配单"
        destroyOnHidden={true}
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X4}
        wrapClassName="standard-modal-1"
        onCancel={() => close()}
        footer={(<>
          <Button type="primary" onClick={scmx}>保存</Button>
          <Button onClick={() => setModalVisible(false)} type="default">关闭</Button>
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
            style={{ marginBottom: 10 }}
          >
            <Form.Item label="代理证明号" name="dlckhwzmhm" className={styles.divForm2}>
              <div className={styles.divForm}>{records ? records.dlckhwzmhm : ''}</div>
            </Form.Item>
            <Form.Item label="商品代码" name="ckspDm" className={styles.divForm2}>
              <div className={styles.divForm}>{records ? records.ckspDm : ''}</div>
            </Form.Item>
            <Form.Item label="商品名称" name="ckspmc" className={styles.divForm2}>
              <div className={styles.divForm}>{records ? records.ckspmc : ''}</div>
            </Form.Item>
            <Form.Item label="出口日期" name="ckrq1" className={styles.divForm2}>
              <div className={styles.divForm}>{records ? records.ckrq1 : ''}</div>
            </Form.Item>
            <Form.Item label="申报计量单位名称" name="sbjldwmc" className={styles.divForm2}>
              <div className={styles.divForm}>{records ? records.sbjldwmc : ''}</div>
            </Form.Item>
            <Form.Item label="申报数量" name="sbsl1" className={styles.divForm2}>
              <div className={styles.divForm}>{records ? myUtil.grid.formatNum(records.sbsl1, '0, 0.00000') : 0.00000}</div>
            </Form.Item>
            <Form.Item label="海关计量单位名称" name="hgjldwmc" className={styles.divForm2}>
              <div className={styles.divForm}>{records ? records.hgjldwmc : ''}</div>
            </Form.Item>
            <Form.Item label="出口数量" name="cksl" className={styles.divForm2}>
              <div className={styles.divForm}>{records ? myUtil.grid.formatNum(records.cksl, '0, 0.00000') : 0.00000}</div>
            </Form.Item>
            <Form.Item label="第二计量单位名称" name="dejldwmc" className={styles.divForm2}>
              <div className={styles.divForm}>{records ? records.dejldwmc : ''}</div>
            </Form.Item>
            <Form.Item label="第二出口数量" name="decksl" className={styles.divForm2}>
              <div className={styles.divForm}>{records ? myUtil.grid.formatNum(records.decksl, '0, 0.00000') : 0.00000}</div>
            </Form.Item>
            <Form.Item label="人民币离岸价" name="rmblaj" className={styles.divForm2}>
              <div className={styles.divForm}>{records ? myUtil.grid.formatNum(records.rmblaj, '0, 0.00') : 0.00}</div>
            </Form.Item>
            <Form.Item label="美元离岸价" name="mylaj" className={styles.divForm2}>
              <div className={styles.divForm}>{records ? myUtil.grid.formatNum(records.mylaj, '0, 0.00') : 0.00}</div>
            </Form.Item>
          </Form>
          <Col span={24}>
            <div id="dikasaa" style={{ backgroundColor: '#f1f4f7', lineHeight: '32px', margin: '0 -20px 20px -20px', marginLeft: 'auto', marginRight: 'auto' }}>&nbsp;进货信息</div>
          </Col>
          <div>
            <Space>
              <Button onClick={sxfp}><BarsOutlined />选择发票信息</Button>
            </Space>
            <Space style={{ float: 'right' }}>
              <Button type="link" onClick={ycfp}>删除</Button>
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
                  <Table.Summary.Cell colSpan={6} index={0}>
                    <div style={{ textAlign: 'right' }}>合计</div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell colSpan={1} index={1}>
                    <div style={{ textAlign: 'right' }}>{jshuiSl}</div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell colSpan={1} index={2}>
                    <div id="dikasaa2" style={{ textAlign: 'right' }}>{jshuiJe}</div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell colSpan={1} index={3}></Table.Summary.Cell>
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
