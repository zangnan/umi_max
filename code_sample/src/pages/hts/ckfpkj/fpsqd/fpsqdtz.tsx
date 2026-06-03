/**
 * title: 发票申请单-发票申请单调整
 * author: yxy
 */
import React from 'react';
import { Button, message, Select, Form, Input, Alert, Spin } from 'antd';
import ProTable from '@ant-design/pro-table';
import { useState, useEffect, useImperativeHandle, useContext } from 'react';
import DDAlert from '@/components/DDAlert';
import myUtil from '@/pages/common/myUtil';
import { useIntl } from 'umi';

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const form: any = useContext(EditableContext);
  const toggleEdit = () => {
    setEditing(!editing);
    let tempSl = '0';
    if (Number(record.sl1) === 0) {
      if (record.fpssyhlxDm === '1') {
        tempSl = 'MS';
        setEditing(false);
      } else if (record.fpssyhlxDm === '2') {
        tempSl = 'BZS'
        setEditing(false);
      }
    } else {
      tempSl = record[dataIndex].toString();
    }

    form.setFieldsValue({
      sl1: tempSl,
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      setEditing(false);
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0, }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Select
          style={{ width: 70 }}
          onSelect={save}
          disabled={(Number(record.sl1) === 0 && (record.fpssyhlxDm === '1' || record.fpssyhlxDm === '2')) ? true : false}
        >
          <Select.Option value="0">0%</Select.Option>
          <Select.Option value="0.03">3%</Select.Option>
          <Select.Option value="0.06">6%</Select.Option>
          <Select.Option value="0.09">9%</Select.Option>
          <Select.Option value="0.13">13%</Select.Option>
          <Select.Option value="MS" disabled={true}>免税</Select.Option>
          <Select.Option value="BZS" disabled={true}>不征税</Select.Option>
        </Select>
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" onClick={toggleEdit} >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export interface FpsqdtzProps {
  tzData?: any;
  tzMxData?: any;
  exRowKeys?: any;
  onRef?: any;
  fpzgkpxe?: any;
  fpmxLen?: any;
}

const Fpsqdtz: React.FC<FpsqdtzProps> = ({
  tzData,
  tzMxData,
  exRowKeys,
  onRef,
  fpzgkpxe,
  fpmxLen,
}) => {
  const [tableData, setTableData] = useState<any>([]);                          // table展示的数据
  const [mainData, setMainData] = useState<any>(tzData);                        // 主页面传递的主数据
  const [subData] = useState<any>(tzMxData);                                    // 主页面传递的明细数据
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>(exRowKeys);       // 展开行的key
  const [zgkpxe] = useState<any>(fpzgkpxe);                                     // 发票最高开票限额
  const [mxLen] = useState<any>(fpmxLen);                                       // 单据号下发票明细数量校验标志

  const [searchModel, setSearchModel] = useState<any>({});                      // 查询formModel
  const [masker, setMasker] = useState<any>(false);

  const [selectRowKeys, setSelectRowKeys] = useState<any>([]);                  // 选中的行的key
  const [selectRows, setSelectRows] = useState<any>([]);                        // 选中的行的值
  const [gmfform] = Form.useForm();                                             // 购买方时,下拉框的form
  const [zzDjh, setZzDjh] = useState<any>(1);                                   // 拆分单据号时，自增用

  const intl = useIntl();

  // 处理主表和从表数据成为页面可以展示的数据
  const dealTableData = (model: any) => {
    if (mainData.length > 0) {
      const cxfs = dealCxfs(model);
      const tmpTableData: any = [];
      mainData.forEach((item: any) => {
        if (cxfs === 'DJH' || cxfs === 'DJSP') {
          if (item.djbh.indexOf(model.djbh) === -1) {
            return;
          }
        }
        const tmpChildren: any = [];
        let cfhh: any = 1;
        let jshj: any = 0;
        subData.forEach((item1: any) => {
          if (item.djbh === item1.djbh) {
            item1.zshh = myUtil.text.leadingZeroize(cfhh, 2);
            jshj = Number(jshj) + Number(item1.je);
            cfhh++;
            if (cxfs === 'DJSP' || cxfs === 'SPMC') {
              if (item1.hgspmc.indexOf(model.hgspmc) === -1) {
                return;
              }
            }
            tmpChildren.push(item1);
          }
        });
        if (!((cxfs === 'DJSP' || cxfs === 'SPMC') && tmpChildren.length <= 0)) {
          tmpTableData.push({
            uuid: item.uuid,
            djhhz: '单据号：' + item.djbh,
            jehz: '价税合计：' + myUtil.text.formatNum(jshj, '0,0.00'),
            children: tmpChildren
          })
        }
      });
      setTableData(tmpTableData);
    }
  }

  // 获取查询方式
  const dealCxfs = (searchModel: any) => {
    let cxfs: any = 'ALL';
    if (JSON.stringify(searchModel) != '{}') {
      if (searchModel.hasOwnProperty('djbh') && searchModel.hasOwnProperty('hgspmc')) {
        if (searchModel.djbh === '' && searchModel.hgspmc != '') {
          cxfs = 'SPMC';
        }
        if (searchModel.djbh != '' && searchModel.hgspmc === '') {
          cxfs = 'DJH';
        }
        if (searchModel.djbh != '' && searchModel.hgspmc != '') {
          cxfs = 'DJSP';
        }
      }
      if (searchModel.hasOwnProperty('djbh') && !searchModel.hasOwnProperty('hgspmc')) {
        if (searchModel.djbh != '') {
          cxfs = 'DJH';
        }
      }
      if (!searchModel.hasOwnProperty('djbh') && searchModel.hasOwnProperty('hgspmc')) {
        if (searchModel.hgspmc != '') {
          cxfs = 'SPMC';
        }
      }
    }
    return cxfs;
  }

  // 获取选中行的key与内容
  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectRowKeys(selectedRowKeys);
      setSelectRows(selectedRows);
    }
  };

  // 单据号自定义form查询条件
  const renderDjhItem = (item: any, { defaultRender, fieldProps }: any, form: any) => {
    const status = form.getFieldValue('state');
    if (status !== 'open') {
      return (
        <Input {...fieldProps} placeholder="单据号" />
      );
    } else {
      return defaultRender(item);
    }
  }

  // 商品名称自定义form查询条件
  const renderSpmcItem = (item: any, { defaultRender, fieldProps }: any, form: any) => {
    const status = form.getFieldValue('state');
    if (status !== 'open') {
      return (
        <Input {...fieldProps} placeholder="商品名称" />
      );
    } else {
      return defaultRender(item);
    }
  }

  // 处理项号返回列
  const renderXhRow = (value: any, row: any) => {
    const obj = {
      children: value,
      props: { colSpan: 1 },
    };
    if (row.djhhz) {
      obj.children = row.djhhz;
      obj.props.colSpan = 7;
    }
    return obj;
  };

  // 处理其他返回列
  const renderOtherRow = (value: any, row: any) => {
    const obj = {
      children: value,
      props: { colSpan: 1 },
    };
    if (row.djhhz) {
      obj.props.colSpan = 0;
    }
    if (row.sl === value) {
      obj.children = myUtil.text.formatNum(value, '0,0.00000');
    }
    if (row.je === value) {
      obj.children = myUtil.text.formatNum(value, '0,0.00');
    }
    return obj;
  };

  // 处理其他返回列
  const renderSlvRow = (value: any, row: any) => {
    const obj = {
      children: value,
      props: { colSpan: 1 },
    };
    if (row.djhhz) {
      obj.props.colSpan = 0;
    } else {
      let tempSl1 = '0%';
      if (Number(value) === 0) {
        if (row.fpssyhlxDm === '1') {
          tempSl1 = '免税'
        } else if (row.fpssyhlxDm === '2') {
          tempSl1 = '不征税'
        }
      } else {
        tempSl1 = value * 100 + '%';
      }
      obj.children = tempSl1;
    }
    return obj;
  };

  // 处理税额返回列
  const renderSeRow = (value: any, row: any) => {
    const obj = {
      children: value,
      props: { colSpan: 1 },
    };
    if (row.djhhz) {
      obj.children = row.jehz;
      obj.props.colSpan = 3;
    }
    if (row.se === value) {
      obj.children = myUtil.text.formatNum(value, '0,0.00');
    }
    return obj;
  };

  // table显示列
  const columns = [
    { title: '单据号', dataIndex: 'djbh', key: 'djbh', hideInTable: true, renderFormItem: renderDjhItem, initialValue: '' },
    { title: '报关单号', dataIndex: 'bgdhgbh', key: 'bgdhgbh', render: renderXhRow, search: false, },
    { title: '项号', dataIndex: 'hwxh', key: 'hwxh', colSpan: 1, render: renderOtherRow, search: false },
    { title: '商品名称', dataIndex: 'hgspmc', key: 'hgspmc', colSpan: 1, render: renderOtherRow, renderFormItem: renderSpmcItem, initialValue: '' },
    { title: '行号', dataIndex: 'zshh', key: 'zshh', colSpan: 1, search: false, render: renderOtherRow },
    { title: '单位', dataIndex: 'jldwmc', key: 'jldwmc', colSpan: 1, search: false, render: renderOtherRow },
    { title: '数量', dataIndex: 'sl', key: 'sl', align: 'right', colSpan: 1, search: false, render: renderOtherRow },
    { title: '金额', dataIndex: 'je', key: 'je', align: 'right', colSpan: 1, search: false, render: renderOtherRow },
    { title: '税率', dataIndex: 'sl1', key: 'sl1', width: 90, align: 'right', colSpan: 1, search: false, render: renderSlvRow, editable: true, className: 'dd_editable_column' },
    { title: '税额', dataIndex: 'se', key: 'se', align: 'right', render: renderSeRow, search: false },
  ];

  // 拆分单据号
  const handleCfdjh = () => {
    if (!selectRows || selectRows.length === 0) {
      message.info(intl.formatMessage({ id: 'message_ckfp_fpsqd_fpsqdtz_cfdjh_unselected' }));
      return;
    }
    if (checkSelMx('CF') === 'N') {
      message.info(intl.formatMessage({ id: 'message_ckfp_fpsqd_fpsqdtz_cfdjh_tydjh' }));
      return;
    }
    if (checkJshj('') && mainData[0]?.fpzlDm1 != '5') {
      message.info(intl.formatMessage({ id: 'message_ckfp_fpsqd_fpsqdtz_kpjefpxe' }));
      return;
    }
    if (mxLen && checkMx8('', 'CF')) {
      message.info(intl.formatMessage({ id: 'message_ckfp_fpsqd_fpsqdtz_hbdjh_mx8' }));
      return;
    }
    // 获取所有不同的购买方名称
    const gmfmc = getDistNr('GMFMC');
    if (gmfmc.length > 1) {
      const opVal = pzOption(gmfmc, 'GMFMC');
      szgmf(opVal, 'CF', '');
    } else {
      dealCfData()
    }
  }

  // 校验合并单据号时，是否选中的是不同的单据号
  const checkSelMx = (bz: any) => {
    const tmp = getDistNr('DJH');
    if (bz === 'HB') {
      if (tmp.length > 1) {
        return 'Y';
      } else {
        return 'N';
      }
    }
    if (bz === 'CF') {
      if (tmp.length > 1) {
        return 'Y';
      } else {
        let num: any = 0;
        subData.forEach((item: any) => {
          if (tmp[0] === item.djbh) {
            num++;
          }
        });
        if (num === selectRows.length) {
          return 'N';
        } else {
          return 'Y';
        }
      }
    }
    return 'Y';
  }

  // 拆分合并时校验价税合计 djbh=''时为校验拆分 djbh!= ''为校验合并
  // 合并时计算=选中的子项（djh为合并后的单据号的子项除外）+ djh为合并后的单据号下的所有子项
  const checkJshj = (djbh: any) => {
    let jshj = 0;
    if (djbh === '') {
      selectRows.forEach((item: any) => {
        jshj = Number(jshj) + Number(item.je);
      });
    } else {
      // 计算选中明细金额合计
      selectRows.forEach((item: any) => {
        jshj = Number(jshj) + Number(item.je);
      });
      // 计算要合并到的单据号明细金额合计（剔除已经勾选的明细）
      subData.forEach((item: any) => {
        if (item.djbh === djbh) {
          if (!myUtil.array.isContiner(selectRowKeys, item.uuid)) {
            jshj = Number(jshj) + Number(item.je);
          }
        }
      });
    }
    if (jshj > zgkpxe) {
      return true;
    } else {
      return false;
    }
  }

  // 获取不同的单据号或购买方名称
  const getDistNr = (bz: any) => {
    const arr: any = [];
    const tmp: any = [];
    selectRows.forEach((item: any) => {
      if (!item.children) {
        if (bz === 'DJH') {
          if (tmp.length === 0 || !myUtil.array.isContiner(tmp, item.djbh)) {
            tmp.push(item.djbh);
            arr.push(item.djbh);
          }
        }
        if (bz === 'GMFMC') {
          if (tmp.length === 0 || !myUtil.array.isContiner(tmp, item.ghfnsrmc)) {
            tmp.push(item.ghfnsrmc);
            arr.push({ gmfjzfpsqduuid: item.gmfjzfpsqduuid, ghfnsrmc: item.ghfnsrmc });
          }
        }
      }
    });
    return arr;
  }

  //拼装下拉框
  const pzOption = (nr: any, bz: any) => {
    const selOp: any = [];
    nr.forEach((item: any) => {
      const obj: any = {};
      if (bz === 'DJH') {
        obj.text = item;
        obj.value = item;
      }
      if (bz === 'GMFMC') {
        obj.text = item.ghfnsrmc;
        obj.value = item.gmfjzfpsqduuid;
      }
      selOp.push(getOpHtml(obj));
    })
    return selOp;
  }
  // 获取Option的html
  const getOpHtml = (obj: any) => {
    return <Select.Option key={obj.value} value={obj.value}>{obj.text}</Select.Option>;
  }

  // 设置购买方
  const szgmf = (opVal: any, bz: any, hbdjh: any) => {
    DDAlert.open({
      title: intl.formatMessage({ id: 'message_ckfp_fpsqd_kptz_gmfbyz_title' }),
      closeStatus: false,
      isFormContent: false,
      modalType: 'form',
      okCallbackFn: function () {
        //校验
        gmfform.validateFields().then((values: any) => {
          values.djbh = hbdjh;
          if (bz === 'CF') {
            dealCfHbSubData(values, '1');
            dealCfData();
          } else {
            dealCfHbSubData(values, '3');
            dealHbData();
          }
          DDAlert.close();
        });
      },
      content: <>
        <Alert
          message={intl.formatMessage({ id: 'message_ckfp_fpsqd_kptz_gmfbyz_content_msg' })}
          showIcon
          type="error"
          style={{ marginBottom: '20px' }}
        />
        <Form name="basic" form={gmfform} labelCol={{ span: 7 }} wrapperCol={{ span: 14 }} autoComplete="off">
          <Form.Item name="hbgmfmc" label="购买方名称" rules={[{ required: true, message: intl.formatMessage({ id: 'message_ckfp_fpsqd_kptz_gmfbyz_check_msg' }) }]} >
            <Select placeholder="请选择购买方名称" allowClear>
              {opVal}
            </Select>
          </Form.Item>
        </Form>
      </>,
    });
  }

  const getGmfmc = (val: any) => {
    let nsrmc: any = '';
    for (let i = 0; i < mainData.length; i++) {
      if (mainData[i].gmfjzfpsqduuid === val) {
        nsrmc = mainData[i].ghfnsrmc;
        break;
      }
    }
    return nsrmc;
  }

  // 处理拆分或合并后从表的单据号或购买方名称后的数据
  // 共有3种情况。1、拆分时购买方不一致；2、合并时购买方一致；3合并时购买方不一致
  const dealCfHbSubData = (param: any, bz: any) => {
    if (bz === '1') {
      subData.forEach((item: any) => {
        if (myUtil.array.isContiner(selectRowKeys, item.uuid)) {
          item.ghfnsrmc = getGmfmc(param.hbgmfmc);
          item.gmfjzfpsqduuid = param.hbgmfmc;
        }
      });
    }
    if (bz === '2') {
      const fpxx: any = {};
      mainData.forEach((item: any) => {
        if (item.djbh === param.djbh) {
          for (let key in item) {
            fpxx[key] = item[key];
          }
        }
      })
      subData.forEach((item: any) => {
        if (myUtil.array.isContiner(selectRowKeys, item.uuid)) {
          selectRowKeys.forEach((item1: any) => {
            if (item.uuid === item1) {
              item.djbh = fpxx.djbh;
              item.ghfnsrmc = fpxx.ghfnsrmc;
              item.gmfjzfpsqduuid = fpxx.gmfjzfpsqduuid;
            }
          })
        }
      });
    }
    if (bz === '3') {
      const nsrmc = getGmfmc(param.hbgmfmc);
      mainData.forEach((item: any) => {
        if (item.djbh === param.djbh) {
          item.gmfjzfpsqduuid = param.hbgmfmc;
          item.ghfnsrmc = nsrmc;
        }
      });
      // 更改子表数据
      subData.forEach((item: any) => {
        // 更改未被选中单据号为被合并的单据号
        if (!myUtil.array.isContiner(selectRowKeys, item.uuid) && item.djbh === param.djbh) {
          item.gmfjzfpsqduuid = param.hbgmfmc;
          item.ghfnsrmc = nsrmc;
        }
        // 更改子表数据被选中的
        if (myUtil.array.isContiner(selectRowKeys, item.uuid)) {
          item.djbh = param.djbh;
          item.gmfjzfpsqduuid = param.hbgmfmc;
          item.ghfnsrmc = nsrmc;
        }
      });
    }
  }

  // 拆分后重新组装数据
  const dealCfData = () => {
    // 新增主表数据
    const zbuuid = myUtil.getUUID(32);
    const tmpZzDjh = zzDjh;
    const djbh = '****************' + myUtil.text.leadingZeroize(tmpZzDjh, 4);
    setZzDjh(tmpZzDjh + 1);
    // const tmpmainData: any = [];
    // mainData.forEach((item: any) => {
    //   tmpmainData.push(item);
    // });
    const qyxx: any = {};
    for (let i = 0; i < subData.length; i++) {
      if (myUtil.array.isContiner(selectRowKeys, subData[i].uuid)) {
        qyxx.ghfnsrmc = subData[i].ghfnsrmc;
        qyxx.gmfjzfpsqduuid = subData[i].gmfjzfpsqduuid;
        break;
      }
    }
    const tmpZbData = {
      uuid: zbuuid,
      fpsqduuid: '',
      djbh: djbh,
      ghfnsrmc: qyxx.ghfnsrmc,
      gmfjzfpsqduuid: qyxx.gmfjzfpsqduuid,
    }
    mainData.push(tmpZbData);
    // setMainData(tmpmainData);
    subData.forEach((item: any) => {
      if (myUtil.array.isContiner(selectRowKeys, item.uuid)) {
        item.djbh = djbh;
        item.ghfnsrmc = qyxx.ghfnsrmc;
        item.gmfjzfpsqduuid = qyxx.gmfjzfpsqduuid;
      }
    })
    dealTableData(searchModel);
    const tmpRokeys = [];
    expandedRowKeys.forEach((item: any) => {
      tmpRokeys.push(item);
    })
    tmpRokeys.push(zbuuid);
    setExpandedRowKeys(tmpRokeys);
    setSelectRows([]);
    setSelectRowKeys([]);
  }

  const dealHbData = () => {
    dealTableData(searchModel);
    setSelectRows([]);
    setSelectRowKeys([]);
  }

  // 校验明细是否超过8条
  const checkMx8 = (value: any, bz: any) => {
    if (bz === 'HB') {
      let tmpLen: any = 0;
      subData.forEach((item: any) => {
        if (item.djbh === value) {
          if (!myUtil.array.isContiner(selectRowKeys, item.uuid)) {
            tmpLen++;
          }
        }
      })
      if (tmpLen + selectRowKeys.length > 8) {
        return true;
      } else {
        return false;
      }
    } else {
      if (selectRowKeys.length > 8) {
        return true;
      } else {
        return false;
      }
    }
  }

  //合并单据号
  const handleHbdjh = () => {
    if (checkSelMx('HB') === 'N') {
      message.info(intl.formatMessage({ id: 'message_ckfp_fpsqd_fpsqdtz_hbdjh_unselected' }));
      return;
    }
    // 拼装合并单据号的下拉选项
    let djhNr = getDistNr('DJH');
    // 单据号降序
    djhNr.sort(function (a: any, b: any) {
      if (a > b) {
        return 1;
      } else {
        return -1;
      }
    })
    const opVal = pzOption(djhNr, 'DJH');
    const gmfmcNr = getDistNr('GMFMC');
    const closeStatus = gmfmcNr.length > 1 ? false : true;
    DDAlert.open({
      title: '合并到已有单据号',
      infoType: 'warning',
      modalType: 'form',
      closeStatus: false,
      isFormContent: true,
      okCallbackFn: function () {
        //校验
        DDAlert.getForms().validateFields().then((values: any) => {
          // 购买方名称不一致
          if (!closeStatus) {
            szgmf(pzOption(gmfmcNr, 'GMFMC'), 'HB', values.hbdjh);
          } else {
            dealCfHbSubData({ djbh: values.hbdjh }, '2');
            dealHbData();
            DDAlert.close();
          }
        });
      },
      content: <>
        <Form.Item name="hbdjh" label="单据号" rules={[{ required: true, message: intl.formatMessage({ id: 'message_ckfp_fpsqd_fpsqdtz_hbdjh_check' }) },
        () => ({
          validator(_, value) {
            if (value) {
              if (mxLen && checkMx8(value, 'HB')) {
                return Promise.reject(new Error(intl.formatMessage({ id: 'message_ckfp_fpsqd_fpsqdtz_hbdjh_mx8' })));
              }
              if (checkJshj(value) && mainData[0]?.fpzlDm1 != '5') {
                return Promise.reject(new Error(myUtil.text.formatRepalce(intl.formatMessage({ id: 'message_ckfp_fpsqd_kptz_check_jshj' }), { djbh: value })));
              }
            }
            return Promise.resolve();
          },
        })
        ]}>
          <Select placeholder="请选择单据号" allowClear>
            {opVal}
          </Select>
        </Form.Item>
      </>,
    });
  }

  // 展开或收起行时触发
  const onExpandedRowsChange = (expandedRows: any) => {
    setExpandedRowKeys(expandedRows);
  }
  const initRowClassName = (record: any) => {
    if (record.djhhz) {
      return 'fpsqd-row-expand';
    } else {
      return '';
    }
  }

  const sqdsearch = (form: any) => {
    const searchVal = form?.getFieldsValue();
    setSearchModel(searchVal);
    dealTableData(searchVal);
    setSelectRows([]);
    setSelectRowKeys([]);
  }

  useEffect(() => {
    // 组装tableData
    dealTableData(searchModel);
  }, []);

  const changeMasker = (val: any) => {
    setMasker(val);
  }

  useImperativeHandle(onRef, () => {
    return {
      handleCfdjh,
      handleHbdjh,
      handleSave1,
      changeMasker,
    };
  });

  const handleSave = (row: any) => {
    const index = subData.findIndex((item: any) => row.uuid === item.uuid);
    if (row.sl1 === 'MS' || row.sl1 === 'BZS') {
      subData[index].fpssyhlxDm = '1';
      if (row.sl1 === 'BZS') {
        subData[index].fpssyhlxDm = '2';
      }
      subData[index].sl1 = 0;
      subData[index].se = 0;
    } else {
      subData[index].sl1 = Number(row.sl1);
      if (Number(row.sl1) === 0) {
        subData[index].se = 0;
      } else {
        const num = row.je / (1 + Number(row.sl1)) * Number(row.sl1);
        subData[index].se = num.toFixed(2);
      }
      subData[index].fpssyhlxDm = '';
    }
    dealTableData(searchModel);
  };

  const myColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });

  const handleSave1 = () => {
    const sqdArr: any = [];
    const tzArr: any = [];
    mainData.forEach((item: any) => {
      if (item.fpsqduuid != '') {
        sqdArr.push(item.fpsqduuid);
      }
      const hwArr: any = [];
      const obj: any = {};
      obj.mbdjbh = item.djbh.startsWith('**********') ? '' : item.djbh;
      obj.gmfjzfpsqduuid = item.gmfjzfpsqduuid;
      subData.forEach((item1: any) => {
        if (item1.djbh === item.djbh) {
          hwArr.push({
            fpsqduuid: item1.fpsqduuid,
            djbh: item1.mbdjbh,
            hh: item1.hh,
            sl1: item1.sl1,
            fpssyhlxDm: item1.fpssyhlxDm
          })
        }
      })
      obj.hwxxList = hwArr;
      tzArr.push(obj);
    })
    return { fpsqduuids: sqdArr, tzFpxxList: tzArr };
  }

  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <div className="fpsqdtz_wrap">
        <ProTable
          columns={myColumns}
          rowSelection={{ ...rowSelection, checkStrictly: true, selectedRowKeys: selectRowKeys }}
          dataSource={tableData} //tableData
          pagination={false}
          bordered={false}
          size="small"
          expandable={{ onExpandedRowsChange: onExpandedRowsChange, expandedRowKeys: expandedRowKeys }} //,
          options={false}
          search={{
            defaultCollapsed: false,
            defaultColsNumber: 1,
            split: true,
            span: 8,
            collapsed: true,   // 不收起查询
            labelWidth: 'auto',
            collapseRender: () => { return <></>; },  // 收起按钮渲染为空(去掉收起按钮)
            optionRender: ({ searchText, resetText }, { form }) => {
              return [
                <Button key="searchText" type="primary"
                  onClick={() => sqdsearch(form)} >{searchText}</Button>,
                <Button key="resetText" type="default"
                  onClick={() => { form?.resetFields(); dealTableData({}); }} >{resetText}</Button>,
              ];
            },
            searchText: '查询',
            className: 'fpsqd-search',
          }}
          tableAlertRender={false}
          tableAlertOptionRender={false}
          rowKey='uuid'
          rowClassName={initRowClassName}
          components={{
            body: {
              row: EditableRow,
              cell: EditableCell,
            },
          }}
        />
      </div>
    </Spin>
  );
};

export default Fpsqdtz;
