/**
 * 按报关单开具  设置汇率
 */

import { intl } from '@/components/DDAssist/util';
import React, { useImperativeHandle, useState, useContext, useEffect } from 'react';
import { Modal, Button, message, Tooltip, Spin, Input, Form, Table, InputNumber } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import { QuestionCircleOutlined } from '@ant-design/icons';
import myUtil from '@/components/DDAssist/util';
import { hlxxsz } from '@/pages/hts/services/htsApi';

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
    form.setFieldsValue(record);
  }, []);

  const save = async () => {
    const values = await form.validateFields();
    handleSave({ ...record, ...values }, values);
  };

  let childNode = children;
  if (editable) {
    childNode = <Form.Item name={dataIndex} style={{ margin: 0 }}>
      <InputNumber onPressEnter={save} onBlur={save} />
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
  const [hlData, setHlData] = useState<any>([]);
  const [hlgz, setHlgz] = useState<any>('');
  const [sbrqHlgz, setSbrqHlgz] = useState<any>('');
  const [mainRef, setMainRef] = useState<any>(''); // 主表页面ref用于刷新
  // const intl = useIntl();
  const [masker, setMasker] = useState<boolean>(false); // 蒙板

  const formList: any = []; // 可编辑表格form集合（一行就是一个form）

  // 开启
  const showModal = (param: any, ref: any) => {
    Promise.all([myUtil.code.getCodeFromServerT1('CODE_CS_ZXSB_FPKJ_CSPZ:01')]).then(() => {
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      const newData = param;
      newData.forEach((item: any) => {
        item.uuid = myUtil.text.uuid(32);
      });
      setHlData(newData);
      const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01');
      setHlgz(temp[0].fphlxqgzDm);
      setSbrqHlgz(temp[0].wckrqfphlxqgzDm);
      setMainRef(ref);
      setModalVisible(true);
    });
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  const titleNamermbhl = (
    <Tooltip placement="rightTop" title="100外币兑换人民币汇率，如：泰铢汇率19.51">
      <span>
        成交币制汇率 <QuestionCircleOutlined />
      </span>
    </Tooltip>
  );
  // 配置项： 设置汇率
  const columns = [
    { title: 'uuid', dataIndex: 'uuid', hidden: true },
    { title: '出口年月', dataIndex: 'ckym', width: 100, hidden: hlgz === '11' ? true : false },
    {
      title: '出口日期', dataIndex: 'ckrq1', width: 100, render: (text: any) => { return myUtil.date.formatDate(text, 'YYYY-MM-DD') }, hidden: hlgz === '11' ? false : true,
    },
    { title: '申报年月', dataIndex: 'sbym', width: 100, hidden: sbrqHlgz === '21' ? true : false },
    {
      title: '申报日期', dataIndex: 'sbrq', width: 100, render: (text: any) => { return myUtil.date.formatDate(text, 'YYYY-MM-DD') }, hidden: sbrqHlgz === '21' ? false : true,
    },
    { title: '成交币制', dataIndex: 'cjhbzmDm', width: 70 },
    {
      title: titleNamermbhl,
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
    if(values.rmbhl && param.rmbhl){
      values.rmbhl = myUtil.grid.formatNum(values.rmbhl, '0,0.00000')
      param.rmbhl = myUtil.grid.formatNum(param.rmbhl, '0,0.00000')
    }
    // 1.将修改文本框信息放入到主体数据中
    const newData = [...hlData];
    const index = newData.findIndex((item) => param.uuid === item.uuid);
    newData.splice(index, 1, param);
    setHlData(newData);
  }

  const saveModal = () => {
    setMasker(true);
    const param: any = [];
    hlData.forEach((temp: any) => {
      const ckbgdhs = temp.ckbgdhs.split(',');
      param.push({ ckbgdhs: ckbgdhs, rmbhl: temp.rmbhl })
    });
    hlxxsz({ hlmxs: param }).then((response) => {
      const { code, desc } = response;
      if (code === '200') {
        setModalVisible(false);
        mainRef.current!.reload();
        message.success(intl.formatMessage({ id: 'message_ckfp_abgdkj_sethl_success' }));
      } else {
        message.error(desc);
      }
      setMasker(false);
    });
  };

  return (
    <>
      <Modal
        title="设置汇率"
        destroyOnHidden={true}
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X2}
        wrapClassName="standard-modal-1"
        className={`${masker ? 'dd_modal_show_masker' : ''}`}
        mask={{ closable: false }}
        footer={
          <>
            <Button onClick={() => setModalVisible(false)}>取消</Button>
            <Button onClick={saveModal} type="primary">
              确定
            </Button>
          </>
        }
        onCancel={() => setModalVisible(false)}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <Table
            components={{
              body: {
                row: ({ index, ...props }) => {
                  const [form1] = Form.useForm();
                  formList.push(form1);
                  return (
                    <Form form={form1} component={false}>
                      <EditableContext.Provider value={form1}>
                        <tr {...props} />
                      </EditableContext.Provider>
                    </Form>
                  );
                },
                cell: EditableCell,
              }
            }}
            bordered
            rowKey='uuid'
            dataSource={hlData}
            columns={myColumns}
            pagination={false}
          />
        </Spin>
      </Modal>
    </>
  );
};

export default ModalHl;
