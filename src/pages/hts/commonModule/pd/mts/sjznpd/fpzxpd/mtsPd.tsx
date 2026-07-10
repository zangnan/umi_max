/**
 * 面退税配单
 */
import formUtil from '@/components/DDForm/formUtil';
import React, {useEffect, useImperativeHandle, useState} from 'react';
import { Button, Col, Drawer, Form, InputNumber, message, Modal, Space, Spin, Table} from 'antd';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import {itemType} from '@/components/DDForm/data.d';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import businessValidator from '@/pages/hts/common/field/businessValidator';
import UnitUtil from '@/components/DDBunit/unit_util';
import CONSTANTS from '@/components/DDAssist/constants';
import styles from './style.less';
import myUtil, {intl as intl2 } from '@/components/DDAssist/util';
import pdFun from './pdFun';
import moment from 'moment';
import {BarsOutlined} from '@ant-design/icons';
import {checkMtsTssbGlh, checkSsqPcYsb, znpdFpPd } from '@/pages/hts/services/htsApi';

export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
  ywKey?: any;
}

const Mtspd: React.FC<DDModalGridProps> = ({onRef, visible = false, ywKey}) => {
  // const intl = useIntl();
  const [refUnits, setUnitRefs] = useState<any>();// 主列表
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
      message.info(intl2.formatMessage({id: 'message_hqmb_error'}));
    }).finally(() => {
      const tmpItemsNew = formUtil.initFormItemsCodeTable(tmpItems);
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
      sbxh: body.sbxh,
      ckbgdh: rec.ckbgdh,
      ckrq1: moment(rec.ckrq1).format('YYYY-MM-DD'),
      uuid: rec.uuid,
    });
    form2.setFieldsValue({
      pdje: rec.pdje
    })
  }

  const onBlurSsq = (e: any) => {
    const jcxx = form.getFieldsValue();
    if (jcxx?.ssq && jcxx.sbpc) {
      const oldGlh = jcxx.glh ? jcxx.glh.substr(jcxx.glh.length - 8, jcxx.glh.length) : '00000001';
      const newglh = jcxx.ssq + jcxx.sbpc + oldGlh
      form.setFieldsValue({glh: newglh});
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
        form.setFieldsValue({glh: newglh});
      }
    }
  }
  // 业务类型代码
  const cktmsywlxdmjh = (param: any) => {
    const {form} = param;
    const cktmsywlxdmjh = form?.getFieldValue('cktmsywlxdmjh');
    const option = myUtil.code.getCode('code_dm_ckts_cktmsywlx:10');
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
    form.setFieldsValue({cktmsywlxdmjh: arrId});
    if (arrId) {
      form.setFieldsValue({cktmsywlxmcjh: newVal.join(',')});
    } else {
      form.setFieldsValue({cktmsywlxmcjh: ''});
    }
  }

  const validatorFlag = {
    // 所属期
    ssq: (form: any) => {
      const validator = async (_rule: any, value: any) => {
        const sbpc = form?.getFieldValue('sbpc');    // 表单其他项目
        if (value === '' || value === undefined) {
          return Promise.reject(new Error(intl2.formatMessage({id: 'validator_required'})));// '请输入申报批次！'
        } else if (!value.match(/^\d+$/)) {
          return Promise.reject(new Error(intl2.formatMessage({id: 'validator_number'})));// '该项内容只能输入数字！'
        } else if (!value.match(/^[1-9]\d{3}(0[1-9]|1[0-2])$/)) {
          return Promise.reject(new Error(intl2.formatMessage({id: 'validator_d_yyyyMM'})));// '请输入正确的年月格式yyyyMM！'
        }
        if (value) {
          let params = {
            tableKey: 'MTS_ZXSB_SB_MTS_TSSB_G',
            sbpc,
            ssq: value,
          };
          await checkSsqPcYsb(params).then((response) => {
            const {code, msg} = response;
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
      return {validator};
    },
    // 申报批次
    sbpc: (form: any) => {
      const validator = async (_rule: any, value: any) => {
        const ssq = form?.getFieldValue('ssq');    // 表单其他项目
        if (value === '' || value === undefined) {
          return Promise.reject(new Error(intl2.formatMessage({id: 'validator_required'})));// '请输入申报批次！'
        } else if (!value.match(/^\d+$/)) {
          return Promise.reject(new Error(intl2.formatMessage({id: 'validator_number'})));// '该项内容只能输入数字！'
        }
        if (value) {
          let params = {
            tableKey: 'MTS_ZXSB_SB_MTS_TSSB_G',
            ssq,
            sbpc: myUtil.text.leadingZeroize(value, 3),
          };
          await checkSsqPcYsb(params).then((response) => {
            const {code, msg} = response;
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
      return {validator};
    },
    glh: (form: any) => {
      const validator = async (_rule: any, value: any) => {
        const ssq = form?.getFieldValue('ssq');    // 表单其他项目
        const sbpc = form?.getFieldValue('sbpc');    // 表单其他项目
        const uuid = form?.getFieldValue('uuid');    // 表单其他项目
        if (value === '' || value === undefined) {
          return Promise.reject(new Error(intl2.formatMessage({id: 'validator_required'})));
        } else if (!value.match(/^\d+$/)) {
          return Promise.reject(new Error(intl2.formatMessage({id: 'validator_number'})));// '该项内容只能输入数字！'
        }
        if (value) {
          let params = {
            ssq: ssq,
            sbpc: sbpc,
            glh: value,
            uuid: uuid,
          };
          await checkMtsTssbGlh(params).then((response: any) => {
            const {code, msg} = response;
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
      return {validator};
    },
  }

  const inputLayput = {
    label: {xs: 4, sm: 4, md: 4, lg: 3, xl: 3, xxl: 3},
    formItem: {xs: 18, sm: 18, md: 18, lg: 9, xl: 5, xxl: 5},
  }

  const tmpItems = [
    {name: 'groupTitle1', type: itemType.GroupTitle, label: '基础信息'},
    {name: 'ssq', type: itemType.Input, label: '所属期', validator: [validatorFlag.ssq], onBlur: onBlurSsq, rules: [{type: 'base_required'}], layout: inputLayput},
    {name: 'sbpc', type: itemType.Input, label: '申报批次', validator: [validatorFlag.sbpc], onBlur: onBlurSbpc, rules: [{type: 'base_required'}], layout: inputLayput},
    {name: 'glh', type: itemType.Input, label: '关联号', rules: [{type: 'base_required'}, {type: 'base_type_number'}], validator: [validatorFlag.glh], layout: inputLayput},
    {
      name: 'cktmsywlxdmjh',
      type: itemType.Select,
      label: '业务类型代码',
      showType: '3',
      mode: 'multiple',
      onChange: cktmsywlxdmjh,
      codeTable: 'code_dm_ckts_cktmsywlx:10',
      validator: [businessValidator.cktmsywlxdmjh]
    },
    // { name: 'ckfph', type: itemType.Input, label: '出口发票号', tooltip: '若此处不填出口发票号，则生成的出口明细数据中，使用合同号做为出口发票号。', layout: inputLayput,validator: [
    //   baseValidator.english_number(),
    //   baseValidator.range2({ min: 0, max: 30 })
    // ] },
    {name: 'ckbgdh', type: itemType.Hidden, label: '报关单号'},
    {name: 'ckrq1', type: itemType.Hidden, label: '出口日期'},
    {name: 'cktmsywlxmcjh', type: itemType.Hidden, label: '业务类型名称'},
    {name: 'sbxh', type: itemType.Hidden, label: '申报序号'},
    {name: 'uuid', type: itemType.Hidden, label: 'uuid'},
    {name: 'groupTitle2', type: itemType.GroupTitle, label: '进货信息'}
  ];

  // 配置列表列
  const columns = [
    {title: '出口报关单号', dataIndex: 'ckbgdh', width: 180},
    {title: '出口发票号', dataIndex: 'ckfph', width: 150, ellipsis: true},
    {
      title: '出口日期', dataIndex: 'ckrq1', width: 110, render: (text: any) => {
        return <span>{myUtil.date.formatDate(text, 'YYYY-MM-DD')}</span>
      }
    },
    {title: '商品代码', dataIndex: 'ckspDm', width: 120, ellipsis: true},
    {title: '商品名称', dataIndex: 'hgspmc', width: 140, ellipsis: true},
    {title: '法定单位', dataIndex: 'hgjldwmc', width: 80, ellipsis: true},
    {
      title: '法定数量', dataIndex: 'ycksl', align: 'right', width: 130, render: (text: any) => {
        return <span>{myUtil.text.formatNum(text, '0,0.00000')}</span>
      }
    },
    {
      title: '可用法定数量', dataIndex: 'cksl', align: 'right', width: 130, render: (text: any) => {
        return <span>{myUtil.text.formatNum(text, '0,0.00000')}</span>
      }
    },
    {
      title: '美元离岸价', dataIndex: 'ymylaj', align: 'right', width: 130, render: (text: any) => {
        return <span>{myUtil.text.formatNum(text, '0,0.00')}</span>
      }
    },
    {
      title: '可用美元离岸价', dataIndex: 'mylaj', align: 'right', width: 130, render: (text: any) => {
        return <span>{myUtil.text.formatNum(text, '0,0.00')}</span>
      }
    },
    {
      title: '人民币离岸价', dataIndex: 'yrmblaj', align: 'right', width: 130, render: (text: any) => {
        return <span>{myUtil.text.formatNum(text, '0,0.00')}</span>
      }
    },
    {
      title: '可用人民币离岸价', dataIndex: 'rmblaj', align: 'right', width: 130, render: (text: any) => {
        return <span>{myUtil.text.formatNum(text, '0,0.00')}</span>
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
      message.info(intl.formatMessage({id: 'message_delete_unselected'}))
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
  }

  //生成明细点击事件
  const scmx = async () => {
    form.validateFields().then((values: any) => {
      form2.validateFields().then((val: any) => {
        if (gridData.length > 0) {
          const chack = pdFun.scmxCheck(values, records, gridData);
          if (chack) {
            const objYsb = {
              sbpc: values.sbpc,
              ssq: values.ssq,
              tableKey: "MTS_ZXSB_SB_MTS_TSSB_G",
            }

            const objGlh = {
              glh: values.glh,
              sbpc: values.sbpc,
              ssq: values.ssq,
              uuid: records.uuid,
            }
            setMasker(true)
            checkSsqPcYsb(objYsb).then((resYsb: any) => {
              setMasker(false)
              if (resYsb.code === '200') {
                setMasker(true)
                checkMtsTssbGlh(objGlh).then((resGlh: any) => {
                  setMasker(false)
                  if (resGlh.code === '200') {
                    // const formVal = records;
                    // formVal.ssq = values.ssq;
                    // formVal.sbpc = values.sbpc;
                    // formVal.glh = values.glh;
                    // formVal.cktmsywlxdmjh = values.cktmsywlxdmjh;
                    // formVal.ckfph = values.ckfph;
                    // formVal.sbspDm = values.sbspDm;
                    // formVal.pdje = val.pdje;
                    const newGrid = gridData;
                    let numSl = 0;

                    for (let i = 0; i < newGrid.length; i++) {
                      newGrid[i].baseXH = i + 1;
                      newGrid[i].LAY_TABLE_INDEX = i;
                      numSl += Number(newGrid[i].cksl);
                    }
                    const xx = values;
                    const newRec = records;
                    const tep = Object.assign({...xx, ...newRec, pdje: val.pdje})
                    tep.sl = numSl
                    // 表单特殊类型处理
                    if (tep['cktmsywlxdmjh']) {
                      tep['cktmsywlxdmjh'] = tep['cktmsywlxdmjh'].join(',');
                    }
                    const obj = {
                      formVal: tep,
                      gridVal: newGrid,
                    }
                    setMasker(true)
                    znpdFpPd(obj).then((res: any) => {
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
              } else if (resYsb.code === '900') {
                message.info(resYsb.msg)
              } else {
                message.error(resYsb.desc)
              }
            })
          }
        } else {
          message.info('请选择报关单信息')
        }
      })
    })
  }

  //子页面关闭事件
  const close = () => {
    setModalVisible(false);
    setGridData([]);
    setValue(1);
    refUnits.current!.reload();
    refUnits.current!.setSelectionRowKeys([]);
    refUnits.current!.setSelectionRows([]);
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
      refUnit: React.createRef(),
      //添加发票
      fptianjia: (param: any) => {
        const {selectionRows, refUnit} = param;
        //添加发票
        const newArray = pdFun.bgdpd(gridData, selectionRows, value);
        setGridData(newArray);
        refUnit?.current?.setGridHeaderInfoCustomer(`当前已添加${newArray.length}条发票信息`);
        setSpVisible(false);
      },
      // 发票品名查询
      gdpmcx: (param: any) => {
        const {refUnit} = param;
        spConfig.filter_items[2].defaultValue = records?.hwhyslwmc
        refUnit.current?.addQueryModel(records?.hwhyslwmc, 'hgspmc');
      },
    };

  // 商品明细
  const ckbgdRowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectCkSpData(selectedRows);
    }
  };

  const spConfig: any = {
    grid_api_grid_query: `/yw/bszx/wbsj/bgd/queryBgd21Page`,
    grid_selection_type: 'checkbox',
    grid_row_key: 'uuid',
    grid_show_data_num: false,
    show_toolbar: true,
    click_checked: '1',
    grid_header_info: `当前已添加${gridData.length}条报关单`,
    layout_type: 'modal',
  };

  // 配置项：列表筛选项
  spConfig.filter_items = [
    {name: 'ckbgdh', label: '出口报关单号', type: 'Input'},
    {name: 'ckrq1', label: '出口日期', type: 'DatePicker', range: true, format: 'YYYYMMDD', op: 'al'},
    {name: 'hgspmc', label: '出口商品名称', type: 'Input'},
  ];
  spConfig.filter_items[2].defaultValue = records?.hwhyslwmc

  spConfig.grid_columns = [
    {title: '出口报关单号', dataIndex: 'ckbgdh', sorter: true, width: 180, ellipsis: true},
    // { title: '项号', dataIndex: 'xh4', width: 100 }, bug 23476
    {title: '出口发票号', dataIndex: 'ckfph', width: 150, ellipsis: true},
    {title: '出口日期', dataIndex: 'ckrq1', sorter: true, width: 110, render: {type: 'date', format: 'yyyy-MM-DD'}},
    {title: '出口合同号', dataIndex: 'ckhth', width: 160, ellipsis: true},
    {title: '出口商品代码', dataIndex: 'ckspDm', width: 120},
    {title: '出口商品名称', dataIndex: 'hgspmc', width: 120, ellipsis: true},
    {title: '法定单位', dataIndex: 'hgjldwmc', width: 80, ellipsis: true},
    {title: '法定单位数量', dataIndex: 'cksl', width: 140, align: 'right', render: {type: 'number', format: '0,0.00000'}},
    {title: '可用法定数量', dataIndex: 'kycksl', width: 140, align: 'right', render: {type: 'number', format: '0,0.00000'}},
    {title: '第二单位', dataIndex: 'dejldwDm', width: 80, ellipsis: true, codeTable: 'CODE_DM_CKTS_HGJLDW:01'},
    {title: '第二单位数量', dataIndex: 'decksl', width: 140, align: 'right', render: {type: 'number', format: '0,0.00000'}},
    {title: '可用第二单位数量', dataIndex: 'kydecksl', width: 140, align: 'right', render: {type: 'number', format: '0,0.00000'}},
    {
      title: '成交方式', dataIndex: 'hgcjfsmc', width: 100,
      filter: {
        type: 'Select',
        codeTable: 'code_dm_ckts_hgcjfs_mc:01',
      },
    },
    {title: '成交币制', dataIndex: 'cjhghbzmDm', width: 70,},
    {title: '成交金额', dataIndex: 'cjzj', width: 140, align: 'right', render: {type: 'number', format: '0,0.00'}},
    {title: '可用成交金额', dataIndex: 'kycjzj', width: 140, align: 'right', render: {type: 'number', format: '0,0.00'}},
    {title: '成交单位', dataIndex: 'sbjldwmc', width: 80, ellipsis: true},
    {title: '成交数量', dataIndex: 'cjsl1', width: 150, align: 'right', render: {type: 'number', format: '0,0.00000'}},
    {title: '可用成交数量', dataIndex: 'kycjsl1', width: 150, align: 'right', render: {type: 'number', format: '0,0.00000'}},
    {title: '美元离岸价', dataIndex: 'mylaj', width: 140, align: 'right', render: {type: 'number', format: '0,0.00'}},
    {title: '可用美元离岸价', dataIndex: 'kymylaj', width: 140, align: 'right', render: {type: 'number', format: '0,0.00'}}
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
    {name: '发票品名查询', func: 'gdpmcx'},
    {name: '添加', func: 'fptianjia'},
  ];

  spConfig.gridParams = {
    initSearchModal: [
      {property: 'bgdcllxDms', value: ["1", "2", "3", "4", "5", "6", "7"], op: 'al'},
      {property: 'cytgbz', value: "Y", op: 'al'},
      {property: 'sybz', value: "N", op: 'al'},
    ],
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
        onCancel={() => close()}
        className={`${masker ? 'dd_modal_show_masker' : ''}`}
        mask={{ closable: false }}
        footer={(<>
          <Button type="primary" onClick={scmx}>保存</Button>
          <Button onClick={() => setModalVisible(false)} type="default">关闭</Button>
        </>)}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <DDBaseForm items={formItems} form={form}/>
          <Form
            form={form2}
            name="basic"
            preserve={false}
            labelCol={{span: 9, offset: 10}}
            wrapperCol={{span: 14}}
            layout="inline"
            style={{marginBottom: 10}}
          >
            <Form.Item label="发票号码" name="fphm" className={styles.divForm2}>
              <div className={styles.divForm}>{records ? records.fphm : ''}</div>
            </Form.Item>
            <Form.Item label="发票代码" name="fpDm" className={styles.divForm2}>
              <div className={styles.divForm}>{records ? records.fpDm : ''}</div>
            </Form.Item>
            <Form.Item label="发票状态" name="fpzt" className={styles.divForm2}>
              <div className={styles.divForm}>{records?.rzxfzzszyfpbz === 'Y' ? '已认证/' : '未认证/'}{records?.jhxfzzszyfpbz === 'Y' ? '已稽核' : '未稽核'}</div>
            </Form.Item>
            <Form.Item label="发票行号" name="hh" className={styles.divForm2}>
              <div className={styles.divForm}>{records ? records.hh : ''}</div>
            </Form.Item>
            <Form.Item label="开票日期" name="kprq" className={styles.divForm2}>
              <div className={styles.divForm}>{records ? records.kprq : ''}</div>
            </Form.Item>
            <Form.Item label="商品名称" name="hwhyslwmc" className={styles.divForm2}>
              <div className={styles.divForm}>{records ? records.hwhyslwmc : ''}</div>
            </Form.Item>
            <Form.Item label="发票单位" name="jldwmc" className={styles.divForm2}>
              <div className={styles.divForm}>{records ? records.jldwmc : ''}</div>
            </Form.Item>
            <Form.Item label="发票数量" name="fpsl" className={styles.divForm2}>
              <div className={styles.divForm}>{records ? myUtil.grid.formatNum(records.fpsl, '0, 0.00000') : 0.00000}</div>
            </Form.Item>
            <Form.Item label="剩余发票数量" name="sl" className={styles.divForm2}>
              <div className={styles.divForm}>{records ? myUtil.grid.formatNum(records.sl, '0, 0.00000') : 0.00000}</div>
            </Form.Item>
            <Form.Item label="计税金额" name="je" className={styles.divForm2}>
              <div className={styles.divForm}>{records ? myUtil.grid.formatNum(records.je, '0, 0.00') : 0.00}</div>
            </Form.Item>
            <Form.Item label="剩余计税金额" name="syje" className={styles.divForm2}>
              <div className={styles.divForm}>{records ? myUtil.grid.formatNum(records.syje, '0, 0.00') : 0.00}</div>
            </Form.Item>
            <Form.Item label="拟配单金额" name="pdje" className={styles.divForm2}
                       rules={[
                         {
                           required: true,
                           message: '该项内容为必填项不能为空！',
                         },
                         ({getFieldValue}) => ({
                           validator(_, value) {
                             if (value && records && records.pdje < value) {
                               return Promise.reject(new Error(`计税金额不能超过剩余计税金额（${myUtil.grid.formatNum(records.syje, '0, 0.00')}）`));
                             } else if (value <= 0) {
                               return Promise.reject(new Error(`该项只能为正数！`));
                             }
                             return Promise.resolve();
                           },
                         }),
                       ]}>
              <InputNumber controls={false} placeholder="拟配单金额" className={styles.inputnumerWidth} formatter={(value: any, info: any) => {
                return inputNumperFormatter(value, info, '0,0.00')
              }}/>
            </Form.Item>
          </Form>
          <Col span={24}>
            <div id="dikasaa" style={{backgroundColor: '#f1f4f7', lineHeight: '32px', margin: '0 -20px 20px -20px', marginLeft: 'auto', marginRight: 'auto'}}>&nbsp;出口信息</div>
          </Col>
          <div>
            <Space>
              <Button onClick={sxfp}><BarsOutlined/>选择报关单信息</Button>
            </Space>
            <Space style={{float: 'right'}}>
              <Button type="link" onClick={ycfp}>删除</Button>
            </Space>
          </div>
          <Table
            rowKey='uuid'
            size="small"
            pagination={false}
            rowSelection={{type: 'checkbox', ...ckbgdRowSelection,}}
            columns={columns}
            dataSource={gridData}
            scroll={{x: 'max-content'}}
          />
        </Spin>

        <Drawer
          title="筛选报关单"
          visible={spVisible}
          width={CONSTANTS.C_MODAL_WIDTH_X4}
          onClose={() => {
            setSpVisible(false)
          }}
          className="dd_data_page_modal"
          destroyOnHidden={true}
          mask={{ closable: false }}
        >
          <DDBunit2 config={spConfig} func={funSp}/>
        </Drawer>
      </Modal>
    </>
  );
};

export default Mtspd;
