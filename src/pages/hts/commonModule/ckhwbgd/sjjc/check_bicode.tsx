/**
 * 汇率配置
 */
import React, { useImperativeHandle, useState, useEffect, useContext } from 'react';
import { Modal, Button, Table, InputNumber, Spin, Tooltip, Form, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
import CONSTANTS from '@/components/DDAssist/constants';
import myUtil from '@/components/DDAssist/util';
import { saveMbHl } from '@/pages/hts/services/htsApi';


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
    handleSave({ ...record, ...values }, index);
  };

  let childNode = children;
  if (editable) {
    childNode = <Form.Item name={dataIndex} style={{ margin: 0 }} rules={[{ required: true, message: '该项为必填项' }]}>
      <InputNumber onPressEnter={save} onBlur={save} />
    </Form.Item>;
  }
  return <td id={dataIndex} {...restProps}>{childNode}</td>;
};

export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
  ywKey?: any;
}
const Hlpz: React.FC<DDModalGridProps> = ({ onRef, visible = false, ywKey }) => {
  const intl = useIntl();
  const [mainParam, setMainParam] = useState<any>();
  //全局变量页面开关
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  //列表显示项
  const [gridData, setGridData] = useState<any>([]);
  const [masker, setMasker] = useState<boolean>(false);

  const formList: any = []; // 可编辑表格form集合（一行就是一个form）

  useEffect(() => {
  }, []);

  // 开启页面，并设置参数
  const showModal = (param: any, gridData: any) => {
    setModalVisible(true);
    setMainParam(param) ;
    setGridData(gridData);
  };

  //绑定组件
  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  const titleNamermbhl = (
    <Tooltip placement="rightTop" title="请输入汇率（汇率单位为100）">
      <span>
        当期汇率 <QuestionCircleOutlined />
      </span>
    </Tooltip>
  );
  // 配置项： 设置汇率
  const columns = [
    { title: 'uuid', dataIndex: 'uuid', hidden: true },
    { title: '币制代码', dataIndex: 'hbzmDm', width: 120 },
    { title: '币制名称', dataIndex: 'hbmc', width: 120, render: (text: any, record: any) => { return myUtil.code.getCodeValByKey(record.hbzmDm, 'code_dm_gy_hb:01'); } },
    { title: '汇率日期', dataIndex: 'hlny', width: 100 },
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
  const handleSave = (param: any, index: any) => {
    // 1.将修改文本框信息放入到主体数据中
    const newData = [...gridData];
    newData.splice(index, 1, param);
    setGridData(newData);
  }

  const saveModal = () => {
    setMasker(true);
    saveMbHl({ bzhl: gridData }).then((response) => {
      setMasker(false);
      const { code, msg, body } = response;
      if (code !== '200') {
        message.error(msg);
      } else {
        message.success(body);
        setModalVisible(false);
        mainParam.otherRef[mainParam.otherRef.length - 1].shjcFunc(mainParam, 'Y');
      }
    });
  };


  return (
    <>
      <Modal
        title="汇率配置"
        destroyOnHidden={true}
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X3}
        wrapClassName="standard-modal-1"
        className={`${masker ? 'dd_modal_show_masker' : ''}`}
        mask={{ closable: false }}
        footer={
          <>
            <Button onClick={() => setModalVisible(false)}>关闭</Button>
            <Button onClick={saveModal} type="primary">
              保存
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
                  const [form] = Form.useForm();
                  formList.push(form);
                  return (
                    <Form form={form} component={false}>
                      <EditableContext.Provider value={form}>
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
            dataSource={gridData}
            columns={myColumns}
            pagination={false}
          />
        </Spin>
      </Modal>
    </>
  );
};

export default Hlpz;