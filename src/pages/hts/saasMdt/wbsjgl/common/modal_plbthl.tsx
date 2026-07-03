/**
 * 按报关单开具  设置汇率
 */

import { intl } from '@/components/DDAssist/util';
import React, { useImperativeHandle, useState, useContext, useEffect } from 'react';
import { Drawer, Button, message, Spin, Space, Form, Table, InputNumber } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import { bgdhlwh, queryPager, bgdhlwhAbz } from '@/pages/hts/services/htsApi';
import ProCard from '@ant-design/pro-card';
import myUtil from '@/components/DDAssist/util';
import './style.less';
import { FormInstance } from 'antd/es/form';

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

const EditableContext = React.createContext(null);

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  index,
  ...restProps
}) => {
  const form: any = useContext(EditableContext);

  useEffect(() => {
    if(record) {
      record.rmbhl = record?.rmbhl ? record.rmbhl : '';
      form.current.setFieldsValue(record);
    }
  }, [record]);

  const save = async () => {
    const values = await form.current.validateFields();
    handleSave({ ...record, ...values }, values);
  };

  let childNode = children;

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

  if (editable) {
    childNode = <Form.Item name={dataIndex} style={{ margin: 0 }} rules={[
      () => ({
        validator(_, value) {
          if (record?.sfbl === 'Y' && !value) {
            return Promise.reject(new Error('该项必录'));
          }
          if (value && Number(value) > 9999999999.9999) {
            return Promise.reject(new Error('最大值为9999999.99999'));
          }
          if (value && Number(value) <0 || value === 0) {
            return Promise.reject(new Error('该项必须大于0'));
          }
          return Promise.resolve();
        },
      }),
    ]}>
      <InputNumber onPressEnter={save} onBlur={save} formatter={(value: any, info: any)=>{return inputNumperFormatter(value, info, '0,0.00000')}} />
    </Form.Item>; 
  }
  return <td id={dataIndex} {...restProps}>{childNode}</td>;
};

export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
  data?: any;
}

const ModalHl: React.FC<DDModalGridProps> = ({ onRef, visible = false }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [selectionRowKeys, setSelectionRowKeys] = useState<any>([]);
  const [hlData, setHlData] = useState<any>([]);
  const [mainRef, setMainRef] = useState<any>(''); // 主表页面ref用于刷新
  // const intl = useIntl();
  const [masker, setMasker] = useState<boolean>(false); // 蒙板
  const [otherRef, setOtherRef] = useState<any>(); // 主页面
  const [title, setTitle] = useState<any>(''); // 弹窗标题
  const [xgFlag, setXgFlag] = useState<any>(''); // 批量修改弹窗

  // 开启
  const showModal = (ref: any, uuid: any, otherRefFun: any, search: any) => {
    setSelectionRowKeys(uuid);
    setOtherRef(otherRefFun);
    const obj = {
      page: 1,
      pageSize: 99999,
      // key: 'WBSJ_CKBGD_DBTHL_QUERY_PAGER',
      key: search.key,
      searchModel:search.searchModel
    }
    if(search.key === 'WBSJ_CKBGD_DBTHL_QUERY_PAGER') {
      setTitle('批量补填')
    } else {
      const aa = search.searchModel;
      const newxg = aa[1].values;
      setXgFlag(newxg)
      setTitle('批量修改')
    }
    queryPager(obj).then((res: any) => {
      setMasker(false);
      const { code, body, msg } = res;
      if (code === '200') {
        if(body.rows.length === 0) {
          setHlData([]);
          setModalVisible(false)
          message.info('勾选数据中不存在外币，不需要修改汇率。')
        } else {
          setHlData(body.rows);
          setMainRef(ref);
          setModalVisible(true);
        }
      } else {
        setHlData([]);
        setModalVisible(false)
        message.error(msg)
      }
    })
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 配置项： 设置汇率
  const columns = title === '批量补填' ? [
    { title: 'uuid', dataIndex: 'uuid', hidden: true },
    { title: '币制', dataIndex: 'hbzmDm', width: 70 },
    { title: '币制名称', dataIndex: 'hbmc', width: 120, ellipsis: true },
    { title: '出口年月', dataIndex: 'hlrq', width: 100, },
    {
      title: '汇率',
      dataIndex: 'rmbhl',
      width: 100,
      editable: true,
      className: 'dd_editable_column',
    },
  ] : [
    { title: 'uuid', dataIndex: 'uuid', hidden: true },
    { title: '币制', dataIndex: 'hbzmDm', width: 70 },
    { title: '币制名称', dataIndex: 'hbmc', width: 120, ellipsis: true },
    {
      title: '汇率',
      dataIndex: 'rmbhl',
      width: 100,
      editable: true,
      className: 'dd_editable_column',
    },
  ];
  // 设置列
  const mergedColumns = columns.map((col) => {
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
        handleSave: handleSave,
        index
      }),
    };
  });

  // 隐藏列
  const myColumns = mergedColumns.filter((col: any) => {
    return (!(col.hidden && col.hidden !== false));
  })

  // 文本框调整
  const handleSave = (param: any, values: any) => {
    // 1.将修改文本框信息放入到主体数据中
    const newData = [...hlData];  
    const index = newData.findIndex((item) => param.hluuid === item.hluuid);
    newData.splice(index, 1, param);
    setHlData(newData);
  }

  const saveModal = () => {
    let ccc: any = [];
    formListQr.forEach((item: any) => {
      if (item.current) {
        ccc.push(item);
      }
    })
    let flag = 0;
    hlData.forEach(async (item:any, index:any) => {
      const form2: any = ccc[index];
      if (form2.current) {
        form2.current.validateFields().then((values: any) => {
          item.rmbhl =  Number(myUtil.text.formatNum(item.rmbhl, '0.00000'));
          flag++
          if(flag === hlData.length) {
            setMasker(true);
            const obj:any = {
              uuids: selectionRowKeys,
              hlList: hlData,
            }
            if(xgFlag) {
              obj.xgbz = xgFlag
              bgdhlwhAbz(obj).then((response) => {
                setMasker(false);
                const { code, desc, msg } = response;
                if (code === '200') {
                  // mainRef.current!.handleReset();
                  message.success(intl.formatMessage({ id: 'message_ckfp_abgdkj_sethl_success' }));
                  if(otherRef) {
                    // 刷新头部条数
                    setMasker(true);
                    otherRef.current!.getDclsjBttj()
                    setTimeout(() => {
                      setMasker(false);
                      mainRef.current!.reload2();
                      setModalVisible(false);
                    },300)
                  } else {
                    mainRef.current!.reload2();
                    setModalVisible(false);
                  }
                } else if(code === '900') {
                  message.info(msg);
                } else {
                  message.error(desc);
                }
              });
            } else {
              bgdhlwh(obj).then((response) => {
                setMasker(false);
                const { code, desc } = response;
                if (code === '200') {
                  // mainRef.current!.handleReset();
                  message.success(intl.formatMessage({ id: 'message_ckfp_abgdkj_sethl_success' }));
                  if(otherRef) {
                    // 刷新头部条数
                    setMasker(true);
                    otherRef.current!.getDclsjBttj()
                    setTimeout(() => {
                      setMasker(false);
                      mainRef.current!.reload2();
                      setModalVisible(false);
                    },300)
                  } else {
                    setModalVisible(false);
                  }
                } else {
                  message.error(desc);
                }
              });
            }
          }
        })
      }
    })
  };

  return (
    <>
      <Drawer
        title={title}
        destroyOnHidden={true}
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X2}
        className='dd_data_page_modal'
        mask={{ closable: false }}
        footerStyle={{ textAlign: 'right' }}
        onClose={() => setModalVisible(false)}
        footer={(
          <Space>
            <Button onClick={() => setModalVisible(false)}>取消</Button>
            <Button onClick={saveModal} type="primary">确定</Button>
          </Space>
        )}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <ProCard>
            <Table
              components={{
                body: {
                  row: EditableRowQr,
                  cell: EditableCell,
                }
              }}
              bordered
              rowKey='hluuid'
              dataSource={hlData}
              columns={myColumns}
              pagination={false}
            />
          </ProCard>
        </Spin>
      </Drawer>
    </>
  );
};

export default ModalHl;
