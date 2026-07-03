// 已生成数据/申报明细
import { intl } from '@/components/DDAssist/util';
import React, { useState, useEffect, useImperativeHandle, useContext } from 'react';
import { Tabs, Button, Spin, Form, Input, Select, Table, message, Tooltip, DatePicker, Space } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer } from 'antd';
import {ScheduleOutlined, ReadOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import { FormInstance } from 'antd/es/form';
import { queryPager, querySpdmXxCj, confirmTzckspDm, getPlqrkzmCmcode } from '@/pages/hts/services/htsApi';
import moment from 'moment';
import myUtil from '@/components/DDAssist/util';
import ProCard from '@ant-design/pro-card';

export interface CkxqDataProps {
  visible?: any;
  onRef?: any;
}

const EditableContext = React.createContext(null);

// 确认表
const formListQr = new Set();
class EditableRowQr extends React.Component {
  constructor(props: any) {
    super(props);
  }
  formRefQr = React.createRef<FormInstance>();
  render() {
    if (this.formRefQr) {
      formListQr.add(this.formRefQr);
    }
    return (
      <Form ref={this.formRefQr} component={false}>
        <EditableContext.Provider value={this.formRefQr}>
          < tr {...this.props} />
        </EditableContext.Provider>
      </Form>
    )
  }
}

// 调整表
const formListTz = new Set();
class EditableRowTz extends React.Component {
  constructor(props: any) {
    super(props);
  }
  formRefTz = React.createRef<FormInstance>();
  render() {
    if (this.formRefTz) {
      formListTz.add(this.formRefTz);
    }
    return (
      <Form ref={this.formRefTz} component={false}>
        <EditableContext.Provider value={this.formRefTz}>
          < tr {...this.props} />
        </EditableContext.Provider>
      </Form>
    )
  }
}

// 调整表
const EditableCellTz = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSaveTz,
  onChangeDateTz,
  editType,
  index,
  validatorTz,
  ...restProps
}) => {
  const formTz: any = useContext(EditableContext);
  useEffect(() => {
    if (record) {
      record.hgckhwbgdsbrq = record.hgckhwbgdsbrq ? moment(record.hgckhwbgdsbrq) : '';
      record.tzhckspDm = record.tzhckspDm ? record.tzhckspDm : '';
      formTz.current.setFieldsValue(record);
    }
  }, [record]);

  const saveTz = async () => {
    const values = await formTz.current.validateFields()
    const tzhckspDmNumber = values?.tzhckspDm.length;

    if(tzhckspDmNumber <= 11 && tzhckspDmNumber >= 8) {
      handleSaveTz({ ...record, ...values, index });
    }
  };

  let childNode = children;
  if (editable && editType === 'Input') {
    childNode = <Form.Item name={dataIndex} style={{ margin: 0 }}  rules={[validatorTz.tzhckspDm(record)]} >
      <Input onPressEnter={saveTz} onChange={saveTz} maxLength={11} />
    </Form.Item>;
  } else if(editable && editType === 'DatePicker') {
    childNode = <Form.Item name={dataIndex} style={{ margin: 0 }}>
    <DatePicker onChange={(date, dateString)=>onChangeDateTz(date, dateString, index)} format={myUtil.date.formatList()} />
  </Form.Item>;
  }
  return <td id={dataIndex} {...restProps}>{childNode}</td>;
};

const CkxqData: React.FC<CkxqDataProps> = ({
  visible = false,
  onRef,
}) => {
  const [ modalVisible, setModalVisible ] = useState<boolean>(visible);
  const [ pageRef, setPageRef ] = useState<any>([]);
  const [ masker, setMasker ] = useState(false);  // 蒙版
  const [ ywlx, setYwlx ] = useState('');  // 业务类型
  const [ selectionRowKeys, setSelectionRowKeys ] = useState([]);  // 主键集合
  const [ modalDataQr, setModalDataQr ] = useState<any>([]); // 传递的数据 确认表
  const [ modalDataTz, setModalDataTz ] = useState<any>([]); // 传递的数据 调整表
  const [ spmbList, setSpmbList ] = useState<any>([]); // 传递的数据 调整表
  const [otherRef, setOtherRef] = useState<any>(); // 传递的数据 调整表
  const [checkCkspSheet, setCheckCkpSheet] = useState<any>({tzmts: 0, kzmts: 0}); // sheet页是否渲染
  // const intl = useIntl(); // 提示信息
  const [ saveFlag, setSaveFlag] = useState(true);  // 蒙版

  // 确认表
const EditableCellQr = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  selectChangeQr,
  editType,
  index,
  ...restProps
}) => {
  const formQr: any = useContext(EditableContext);

  useEffect(() => {
    if (record) {
      record.tzhckspDm = record.tzhckspDm ? record.tzhckspDm : '';
      formQr.current.setFieldsValue(record);
    }
  }, [record]);

// 商品码下拉有问题 一点开就关闭 并且 点击 为上次数据
  let childNode = children;
  if (editable && editType === 'Select') {
    let newSpmb: any = [];
    spmbList.forEach((item:any)=> {
      if(item.ckrq1 === record.ckrq1 && item.ckspDm === record.ckspDm) {
        newSpmb = item.tzms;
      }
    })
    childNode = <Form.Item name={dataIndex} style={{ margin: 0 }}
      rules={[{ required: true, message: `请输入${title}!` },]} >
      <Select
      dropdownMatchSelectWidth={180}
      showSearch
      defaultActiveFirstOption={false}
      allowClear={true}
      onChange={(value: any) => selectChangeQr({ value, index, formQr, record, newSpmb })}
      >
        {newSpmb.map((d: any, index: any) => <Select.Option key={d.ckspDm} value={d.ckspDm}>{d.ckspDm}（退税率：{d.tsl}）<Tooltip title={d.ckspmc}><span><QuestionCircleOutlined /></span></Tooltip></Select.Option>)}
      </Select>
    </Form.Item >;
  }
  return <td id={dataIndex} {...restProps}>{childNode}</td>;
};

  // 开启 初始化
  const showModal = (unitRef:any, record: any, otherRefFun: any, search: any, sheet: any) => {
    setOtherRef(otherRefFun);
    setSelectionRowKeys(record.keys);  // 主键集合
    setCheckCkpSheet(sheet);
    setYwlx(record.ywlx);
    if(Number(sheet.kzmts) > 0) {
      getQueryPagerQr(record, search); // 确认表
    }
    if(Number(sheet.tzmts) > 0) {
      getQueryPagerTz(record, search); // 调整表
    }
    setPageRef(unitRef);
    setModalVisible(true);
  };

  const getSpmbCodeData = (obj: any) => {
    const param = {
      hgspList: obj
    }
    getPlqrkzmCmcode(param).then((res:any)=> {
      const {code, body, msg} = res;
      if(code === '200') {
        setSpmbList(body);
      } else {
        message.error(msg)
      }
    })
  }

  useImperativeHandle(onRef, () => {
    return {
      showModal,
      closeModal,
    };
  });

  const getQueryPagerQr = (data: any, search: any) => {
    const obj = {
      page: 1,
      pageSize: 9999,
      key: 'WBSJ_CKBGD_DQRCKSPKZMKZ_PAGER',
      searchModel:search
    }
    setMasker(true);
    queryPager(obj).then((res: any) => {
      setMasker(false);
      const { code, body } = res;
      if (code === '200') {
        setModalDataQr(body.rows);
        const obj2: any = [];
        body.rows.forEach((item:any)=>{
          obj2.push({ckspDm: item.ckspDm, ckrq1: item.ckrq1});
        })
        getSpmbCodeData(obj2); // 获取确认表	出口商品代码列表
      }
    })
  }

  const getQueryPagerTz = (data: any, search: any) => {
    setMasker(true);
    const obj = {
      page: 1,
      pageSize: 9999,
      key: 'WBSJ_CKBGD_DQRCKSPKZMTZ_PAGER',
      searchModel:search
    }
    queryPager(obj).then((res: any) => {
      setMasker(false);
      const { code, body } = res;
      if (code === '200') {
        setModalDataTz(body.rows);
      }
    })
  }

  const closeModal = () => {
    setModalVisible(false);
  }

  // 保存
  const saveModal = () => {
    let xgxxList: any = [];
    modalDataQr.forEach((item: any) => {
      if (item.ckspDm) {
        xgxxList.push({
          uuid: item.uuid,
          ckspDm: item.ckspDm,
          hgspmc: item.hgspmc,
          ckrq1: item.ckrq1,
          tzhckspDm: item.tzhckspDm,
          tzhckspmc: item.tzhckspmc,
          tsl: item.tsl,
          zssljh: item.zssljh,
          cksptssplxDm: item.cksptssplxDm,
          yxqq: item.yxqq,
          yxqz: item.yxqz,
        })
      }
    });
    let tzList: any = [];
    for(let i=0; i<modalDataTz.length; i++) {
      const item = modalDataTz[i];
      if (item.tzhckspDm) {
        if(!item.hgckhwbgdsbrq) {
          message.info('调整后商品代码有值，申报日期不能为空。');
          return;
        }
        tzList.push({
          uuid: item.uuid,
          ckspDm: item.ckspDm,
          hgspmc: item.hgspmc,
          ckrq1: moment(item.ckrq1).valueOf(),
          hgckhwbgdsbrq: moment(item.hgckhwbgdsbrq).valueOf(),
          tzhckspDm: item.tzhckspDm,
          tzhckspmc: item.tzhckspmc,
          tsl: item.tsl,
        })
      }
    }
    console.log(saveFlag)
    if(saveFlag) {
    setMasker(true);
    confirmTzckspDm({
      ywlx: ywlx,
      plxgkzm: xgxxList,
      plxgtzm: tzList,
    }).then((res: any) => {
      setMasker(false);
      const { code, msg } = res;
      if (code === '200') {
        // pageRef.current!.handleReset();
        // 刷新头部条数
        setMasker(true);
        otherRef.current!.getDclsjBttj()
        setTimeout(() => {
          setMasker(false);
          closeModal();
          message.success('操作成功');
          pageRef.current!.reload2();
        },300)
      } else {
        message.info(msg)
      }
    })
  }
  }

  // 确认表列表
  const conColumnsQr = [
    { title: '海关商品代码', dataIndex: 'ckspDm', width: 90 },
    {
      title: '海关商品名称', dataIndex: 'hgspmc', width: 110, ellipsis: true, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    { title: '出口日期', dataIndex: 'ckrq1', width: 70, render: (text: any) => {
      if (text) {
        if (text.constructor === String) {
          return <span>{moment(new Date(Number(text))).format('YYYY-MM-DD')}</span>;
        } else {
          return <span>{moment(new Date(text)).format('YYYY-MM-DD')}</span>;
        }
      }
      return <span />
      }
    },
    { title: '出口商品代码', dataIndex: 'tzhckspDm', width: 130, editable: true, editType: 'Select' },
    {
      title: '出口商品名称', dataIndex: 'tzhckspmc', width: 110, ellipsis: true, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '退税率', dataIndex: 'tsl', width: 80, align: 'right', render: (text: any) => {
        if (text || text === 0) {
          return <span>{myUtil.text.formatNum(text, '0,0.0000')}</span>
        } else {
          return <span></span>;
        }
      }
    },
  ];

  // 隐藏列 确认表
  const myColumnsQr = conColumnsQr.filter((col: any) => {
    return (!(col.hidden && col.hidden !== false));
  })

  // 设置列 确认表
  const firmColumnsQr = myColumnsQr.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any, index: any) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        editType: col.editType,
        selectChangeQr: selectChangeQr,
        index
      }),
    };
  });

  const changeTile = (text: any) => {
    let html:any = <span>{text}</span>;
    if(text.indexOf('{br}') > -1) {
      const aa = text.split('{br}');
      html = <span>{aa[0]}<br/>{aa[1]}</span>;
    }
    return html
  }

  // 调整表列表
  const conColumnsTz = [
    { title: changeTile('调整前（报关单上的）{br}商品代码'), dataIndex: 'ckspDm', width: 140 },
    {
      title:  changeTile('调整前（报关单上的）{br}商品名称'), dataIndex: 'hgspmc', width: 140, ellipsis: true, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    { title: '出口日期', dataIndex: 'ckrq1', width: 90, render: (text: any) => {
      if (text) {
        if (text.constructor === String) {
          return <span>{moment(new Date(Number(text))).format('YYYY-MM-DD')}</span>;
        } else {
          return <span>{moment(new Date(text)).format('YYYY-MM-DD')}</span>;
        }
      }
      return <span />
      }
    },
    { title: '申报日期', dataIndex: 'hgckhwbgdsbrq', width: 130, editable: true, editType: 'DatePicker' },
    { title: '调整后商品代码', dataIndex: 'tzhckspDm', width: 110, editable: true, editType: 'Input' },
    {
      title: '调整后商品名称', dataIndex: 'tzhckspmc', width: 140, ellipsis: true, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '调整后退税率', dataIndex: 'tsl', width: 130, align: 'right', render: (text: any) => {
        if (text || text === 0) {
          return <span>{myUtil.text.formatNum(text, '0,0.0000')}</span>
        } else {
          return <span></span>;
        }
      }
    },
  ];

  // 隐藏列 调整表
  const myColumnsTz = conColumnsTz.filter((col: any) => {
    return (!(col.hidden && col.hidden !== false));
  })

  // 设置列 调整表
  const firmColumnsTz = myColumnsTz.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any, index: any) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        editType: col.editType,
        handleSaveTz: handleSaveTz,
        validatorTz: validatorTz,
        onChangeDateTz: onChangeDateTz,
        index
      }),
    };
  });

  // 下拉选择
  const selectChangeQr = async (param: any) => {
    const { value, record, newSpmb } = param;
    let ccc: any = [];
    formListQr.forEach((item: any) => {
      if (item.current) {
        ccc.push(item);
      }
    })
    const spdmList = newSpmb;
    let spdmListData: any = {};
    for(let i=0; i<spdmList.length; i++) {
      if(value === spdmList[i].ckspDm) {
        spdmListData = spdmList[i];
      }
    }

    const newData = [...modalDataQr];
    newData.forEach(async (item, index) => {
      // 调整前商品码相同的全部反写
      if (record.ckspDm === item.ckspDm) {
        item.tzhckspDm = value;
        item.tzhckspmc = spdmListData?.ckspmc;
        item.tsl = spdmListData?.tsl;
        item.zssljh = spdmListData.zssljh;
        item.cksptssplxDm = spdmListData.cksptssplxDm;
        item.yxqq = spdmListData.yxqq;
        item.yxqz =  spdmListData.yxqz;
        const form1: any = ccc[index];
        if (form1.current) {
          form1.current.setFieldsValue(item);
        }
      }
    })
    setModalDataQr(newData);
  }

  // 文本框 调整表
  const handleSaveTz = (param: any) => {
    let ccc: any = [];
    if(param.tzhckspDm){
      setMasker(true);
      querySpdmXxCj({
        ckspDm: param.tzhckspDm,
        ckrq1: moment(param.ckrq1).format('YYYY-MM-DD'),
        slType: "Y",
      }).then((res: any) => {
        setMasker(false);
        formListTz.forEach((item: any) => {
          if (item.current) {
            ccc.push(item);
          }
        })
        const { code, body, msg, desc } = res;
        if (code === '200') {
          const newData = [...modalDataTz];
          newData.forEach(async (item, index) => {
            // 调整前商品码相同的全部反写
            if (item.ckspDm === param.ckspDm) {
              item.tzhckspDm = body.ckspDm;
              item.tzhckspmc = body?.sbspmc;
              item.tsl = body?.tsl;
              const form1: any = ccc[index];
              if (form1.current) {
                form1.current.setFieldsValue(item);
              }
            }
          })
          setModalDataTz(newData);
        } else {
          const newData = [...modalDataTz];
          newData.forEach(async (item, index) => {
            // 失效
            if (item.ckspDm === param.ckspDm) {
              item.tzhckspDm = param.tzhckspDm;
              item.tzhckspmc = '';
              item.tsl = '';
              const form1: any = ccc[index];
              if (form1.current) {
                form1.current.setFieldsValue(item);
              }
            }
          })
          setModalDataTz(newData);
          // message.info(Array.isArray(msg) ? desc : msg);
        }
      })
    } else {
      const newData = [...modalDataTz];
      newData.forEach(async (item, index) => {
        if(index === param.index) {
          item.tzhckspDm = '';
        }
      })
      setModalDataTz(newData);
    }
  };

  const validatorTz = {
    tzhckspDm: (record: any) => {
      const validator = async (_rule: any, value: any) => {
        const ckrq1 = record?.ckrq1
        if (value.length >= 8 && value.length <= 11 ) {
          await querySpdmXxCj({
            ckspDm: value,
            ckrq1: moment(ckrq1).format('YYYY-MM-DD'),
            slType: "Y",
          }).then((response: any) => {
            setMasker(false);
            const { msg, desc } = response;
            if (response.code === '200') {
              setSaveFlag(true)
              return Promise.resolve();
            } else {
              setSaveFlag(false)
              return Promise.reject(new Error(Array.isArray(msg) ? desc : msg));
            }
          })
        }
        return Promise.resolve();
      }
      return { validator };
    },
  }

  // 改时间
  const onChangeDateTz = (date: any, dateString: any, indexNum: any) => {
    const newData = [...modalDataTz];
    newData.forEach(async (item, index) => {
      if(indexNum === index) {
        item.hgckhwbgdsbrq = date;
      }
    })
    setModalDataTz(newData);
  };

  return (
    <Drawer
       title="批量确认"
       open={modalVisible}
       onClose={() => { closeModal() }}
       width={CONSTANTS.C_MODAL_WIDTH_X4}
       destroyOnHidden={true}
       className="dd_data_page_modal"
       mask={{ closable: false }}
       footerStyle={{ textAlign: 'right' }}
       footer={(
         <Space>
           <Button onClick={() => closeModal()}>取消</Button>
           <Button onClick={saveModal} type="primary" style={{ marginLeft: '10px'}}>确定</Button>
         </Space>
       )}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        {/* <div className="template_tab2"> */}
          <Tabs defaultActiveKey={checkCkspSheet.kzmts ? "splqrkzm" : "spmtzdyb"} type="editable-card" tabBarGutter={5} hideAdd={true}>
            {checkCkspSheet.kzmts ? <Tabs.TabPane tab={<span><ScheduleOutlined />批量确认扩展码</span>} key="plqrkzm" closable={false} >
              <ProCard>
              <Table
                components={{
                  body: {
                    row: EditableRowQr,
                    cell: EditableCellQr,
                  }
                }}
                bordered
                rowKey='uuid'
                scroll={{ x: '1100px', y: `${document.documentElement.clientHeight - 240}px` }}
                dataSource={modalDataQr}
                columns={firmColumnsQr}
                pagination={false}
              />
              </ProCard>
              </Tabs.TabPane> : <></>
            }
            {checkCkspSheet.tzmts ?
              <Tabs.TabPane tab={<span><ReadOutlined />批量确认商品码调整对应表</span>} key="spmtzdyb" closable={false} >
                <ProCard>
                  <Table
                    components={{
                      body: {
                        row: EditableRowTz,
                        cell: EditableCellTz,
                      }
                    }}
                    bordered
                    rowKey='uuid'
                    scroll={{ x: '1100px', y: `${document.documentElement.clientHeight - 240}px` }}
                    dataSource={modalDataTz}
                    columns={firmColumnsTz}
                    pagination={false}
                  />
                </ProCard>
              </Tabs.TabPane> : <></>
            }
          </Tabs>
        {/* </div> */}
      </Spin>
    </Drawer>
  );
};

export default CkxqData;
