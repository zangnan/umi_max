/**
 * 免退税：商品分类配单 ---- 出口报关单单位调整
 */
import React, { useState, useImperativeHandle } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { message, Modal, Button, Table, Form, Radio, Tooltip, Space, Switch } from 'antd';
import { useIntl } from 'umi';
import myUtil from '@/components/DDAssist/util';

const EditableContext = React.createContext(null);

const EditableRow: React.FC<{ index: number }> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell: React.FC<{ title: any, editable: boolean, dataIndex: any, record: any, handleSave: (record: any) => void, index: number }> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  index,
  ...restProps
}) => {
  const onChangeRadio = (event: any) => {
    let dwsave = '';
    let npdckdw = record.cjUnit;
    let npdcksl = record.cjQnt;
    if ("cjUnit" === dataIndex) {
      dwsave = 'cj';
      npdckdw = record.cjUnit;
      npdcksl = record.cjQnt;
    } else if ("fdUnit" === dataIndex) {
      dwsave = 'fd';
      npdckdw = record.fdUnit;
      npdcksl = record.fdQnt;
    } else if ("fd2Unit" === dataIndex) {
      dwsave = 'fd2';
      npdckdw = record.fd2Unit;
      npdcksl = record.fd2Qnt;
    }
    handleSave({ ...record, ...{ npdcksl, dwsave: dwsave, npdckdw } });
  };

  let childNode = children;
  if (editable) {
    if ("cjUnit" === dataIndex && record.cjUnit) {
      childNode = <Form.Item id={dataIndex} name={dataIndex} style={{ margin: 0 }} >
        <Radio onChange={onChangeRadio} value='checked' checked={record.dwsave === 'cj'}>{record.cjUnit}</Radio>
      </Form.Item>;
    } else if ("fdUnit" === dataIndex && record.fdUnit) {
      childNode = <Form.Item id={dataIndex} name={dataIndex} style={{ margin: 0 }} >
        <Radio onChange={onChangeRadio} value='checked' checked={record.dwsave === 'fd'}>{record.fdUnit}</Radio>
      </Form.Item>;
    } else if ("fd2Unit" === dataIndex && record.fd2Unit) {
      childNode = <Form.Item id={dataIndex} name={dataIndex} style={{ margin: 0 }} >
        <Radio onChange={onChangeRadio} value='checked' checked={record.dwsave === 'fd2'}>{record.fd2Unit}</Radio>
      </Form.Item>;
    }
  }

  return <td id={dataIndex} {...restProps}>{childNode}</td>;
};

export interface TzgdProps {
  onRef?: any;
  visible?: any;
}

const Tzgd: React.FC<TzgdProps> = ({ onRef, visible = false }) => {
  const intl = useIntl();
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [gridData, setGridData] = useState<any>([]);
  const [delGduuid, setDelGduuid] = useState<any>([]); // 已删除关单数据
  const [pbDataIndex, setPbDataIndex] = useState<any>([]);
  const [mainRef, setMainRef] = useState<any>();
  const [dwFlag, setDwFlag] = useState<boolean>(true); // 传递的数据


  // 开启
  const showModal = (param: any) => {
    setModalVisible(true);
    setGridData(param.data);
    setPbDataIndex(param.index);
    setMainRef(param.ref);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 格式化数字
  const renderSl = (text: any) => {
    return text ? myUtil.text.formatNum(text, '0,0.00000') : '';
  }

  const columns = [
    {
      title: '序号', dataIndex: 'index', width: 50, fixed: 'left', render: (_text: any, _record: any, index: number) => (
        <span>{(index + 1).toString()}</span>)
    },
    { title: '出口报关单号', dataIndex: 'bgdNo', width: 180, fixed: 'left', },
    {
      title: '出口日期', dataIndex: 'ljDate', width: 140, fixed: 'left', render: (text: any) => {
        return text ? myUtil.grid.formatDate(text, 'YYYY-MM-DD') : '';
      }
    },
    { title: '海关商品代码', dataIndex: 'hgcmcode', width: 110, },
    {
      title: '海关商品名称', dataIndex: 'hgcmname', width: 150, ellipsis: { showTitle: false }, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {text} </Tooltip>
        }
        return '';
      }
    },
    { title: '成交单位', dataIndex: 'cjUnit', width: 80, editable: true, },
    {
      title: '成交数量', dataIndex: 'cjQnt', width: 110, render: (text: any) => {
        return renderSl(text);
      }
    },
    { title: '法定单位', dataIndex: 'fdUnit', width: 80, editable: true, },
    {
      title: '法定数量', dataIndex: 'fdQnt', width: 110, render: (text: any) => {
        return renderSl(text);
      }
    },
    { title: '第二单位', dataIndex: 'fd2Unit', width: 80, editable: true, },
    {
      title: '第二单位数量', dataIndex: 'fd2Qnt', width: 110, render: (text: any) => {
        return renderSl(text);
      }
    },
    {
      title: '操作', width: 110, fixed: 'right', render: (text: any, record: any) => {
        return <Button type='link' onClick={() => deleteBgd(record)}>删除关单</Button>
      }
    },
  ]

  // 隐藏列
  const myColumns = columns.filter((col: any) => {
    return (!(col.hidden && col.hidden !== false));
  })

  // 设置列
  const mergedColumns = myColumns.map((col) => {
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
        handleSave,
        index
      }),
    };
  });

  // 文本框调整
  const handleSave = (param: any) => {
    const newData = [...gridData];
    if(dwFlag){
      newData.forEach((item:any)=>{
        if(param.dwsave == 'cj'){
          item.npdcksl = item.cjQnt;
          item.npdckdw = item.cjUnit;
          item.dwsave = param.dwsave;
        }else if (param.dwsave == 'fd'){
          item.npdcksl = item.fdQnt;
          item.npdckdw = item.fdUnit;
          item.dwsave = param.dwsave;
        }else{
          item.npdcksl = item.fd2Qnt;
          item.npdckdw = item.fd2Unit;
          item.dwsave = param.dwsave;

        }
        // item.dwsave = param.dwsave;
        // item.npdckdw = param.npdckdw;
        // item.npdcksl = param.npdcksl;
      });
      setGridData(newData);
    } else {
      const index = newData.findIndex((item: any) => param.ckbgdId === item.ckbgdId);
      if (index > -1) {
        newData.splice(index, 1, param);
        setGridData(newData);
      }
    }
  };

  // 删除关单
  const deleteBgd = (record: any) => {
    const newData = [...gridData];
    const newDeluuid = [...delGduuid];
    const index = newData.findIndex((item: any) => record.ckbgdId === item.ckbgdId);
    if (index > -1) {
      newData.splice(index, 1);
      setGridData(newData);
      setDelGduuid(newDeluuid.concat(record.ckbgdId));
    }
  }

  // 确认生成明细
  const save = () => {
    const checkedId = gridData && gridData.map((item: any) => item.npdckdw);
    if (Array.from(new Set(checkedId)).length > 1) {
      message.info(intl.formatMessage({ id: 'message_znpd_pmpd_ckbgd_dwsame' }));
      return;
    }
    var gridData01 = gridData.map((item: any) => {
      return {
        ...item,
        ...{
          qhFlag: true
        },
      }
    })
    mainRef.current!.tzGdSave(gridData01, pbDataIndex, delGduuid);
    message.success(intl.formatMessage({ id: 'message_znpdsd_tzgd_save_success_message' }));
    setModalVisible(false);
  }

  // 修改切换为相同单位
  const setFlag = async (e: any) => {
    setDwFlag(e);
  }

  return (
    <Modal
      title="调整关单"
      destroyOnHidden={true}
      visible={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      wrapClassName='standard-modal-1'
      footer={
        <>
          <Button onClick={save} type="primary">保存</Button>
          <Button onClick={() => setModalVisible(false)}>关闭</Button>
        </>
      }
      onCancel={() => setModalVisible(false)}
    >
      <Space style={{ float: 'right', marginBottom: 10 }}>
        <div>默认切换为相同单位</div>
        <Switch defaultChecked onChange={setFlag} />
      </Space>
      <Table
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          }
        }}
        bordered
        rowKey='ckbgdId'
        dataSource={gridData}
        columns={mergedColumns}
        pagination={false}
        scroll={{ x: '700px' }}
      />
    </Modal>
  );
}

export default Tzgd;
