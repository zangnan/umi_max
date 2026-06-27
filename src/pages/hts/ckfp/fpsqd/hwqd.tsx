import React, { useState, useRef, useImperativeHandle } from 'react';
import myUtil from '@/components/DDAssist/util';
import { Table, Tooltip, Form, Typography, Button, Divider, message } from 'antd';
import EditableCell from '@/pages/hts/components/DDdocs/editableCell';
import Wxspglfm from '@/pages/hts/pzgl/fppzgl/fm/wxspglfm';
import './style.less';
import { EditOutlined, DeleteOutlined, PlusOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { intl as intl2 } from '@/components/DDAssist/util';

export interface HwqdProps {
  onRef?: any;
  data?: any;
  readonly?: boolean;
  hiddenYbje?: boolean;
  mklx?: string;
}

const Hwqd: React.FC<HwqdProps> = ({
  onRef,
  data,
  readonly,
  hiddenYbje,
  mklx,
}) => {

  const [hwqdMx, setHwqdMx] = useState<any>(data);                              // 货物明细数据

  // const [hwqdData, setHwqdData] = useState<any>(data);
  const [editingKey, setEditingKey] = useState<any>('');                        // 编辑行标识
  const [form] = Form.useForm();
  const wxspglfmRef: any = useRef();
  const [count, setCount] = useState<any>(1000);

  const isEditing = (record: any) => record.uuid === editingKey;

  // 开启行编辑
  const handleEdit = (record: any) => {
    let tempSl = '0';
    if (record.sl1 === 0) {
      if (record.fpssyhlxDm === '1') {
        tempSl = 'MS'
      } else if (record.fpssyhlxDm === '2') {
        tempSl = 'BZS'
      }
    } else {
      tempSl = record.sl1?.toString()
    }
    form.setFieldsValue({
      uuid: record.uuid,
      hwhlwjc: record.hwhlwjc,
      hwhyslwmc: record.hwhyslwmc,
      ggxh: record.ggxh,
      jldwmc: record.jldwmc,
      sl: record.sl,
      dj: record.dj,
      sphfwssflhbbm: record.sphfwssflhbbm,
      je: record.je,
      sl1: tempSl,
      se: record.se,
      fpssyhlxDm: record.fpssyhlxDm,
      sbjldwDm: record.sbjldwDm,
      sbjldwmc: record.sbjldwmc,
      hgjldwDm: record.hgjldwDm,
      hgjldwmc: record.hgjldwmc,
      dejldwDm: record.dejldwDm,
      dejldwmc: record.dejldwmc,
      rmbje: record.rmbje
    });
    setEditingKey(record.uuid);
  };

  // 取消行编辑
  const handleCancel = (record: any) => {
    setEditingKey('');
    if (record.hwhlwjcBak) {
      const newData = [...hwqdMx];
      const index = newData.findIndex((item) => record.uuid === item.uuid);
      const item = newData[index];
      item.hwhlwjc = record.hwhlwjcBak;
      delete item.hwhlwjcBak;
      newData.splice(index, 1, item);
      setHwqdMx(newData);
    }
  };

  // 保存行 暂存
  const handleSaveRow = async (record: any) => {
    const row = await form.validateFields();
    const newData = [...hwqdMx];
    const index = newData.findIndex((item) => record.uuid === item.uuid);
    // 金额（含税）= 单价 * 数量
    if (index > -1) {
      const item = newData[index];
      const newItem = { ...item, ...row };
      // 税率处理
      if (newItem.sl1 === 'MS' || newItem.sl1 === 'BZS') {
        newItem.fpssyhlxDm = '1';
        if (newItem.sl1 === 'BZS') {
          newItem.fpssyhlxDm = '2';
        }
        newItem.sl1 = 0;
        if (mklx === 'MBDR' || mklx === 'MBCJ') {
          newItem.syyhzcbz = '1';
        }
      } else {
        newItem.sl1 = Number(newItem.sl1);
      }
      // 数量小数位精确
      newItem.sl = Number(newItem.sl).toFixed(5);
      // 金额小数位精确
      newItem.je = Number(newItem.je).toFixed(2);
      // 商品和服务税收分类合并编码 处理
      delete newItem.hwhlwjcBak;
      newData.splice(index, 1, newItem);
      setHwqdMx(newData);
    } else {
      newData.push(row);
      setHwqdMx(newData);
    }
    setEditingKey('');
  };

  // 删除行
  const handleDelete = (uuid: any) => {
    const newData = [...hwqdMx];
    setHwqdMx(newData.filter(item => item.uuid !== uuid));
  };

  // 获取列样式
  const getColCls = () => {
    if (!readonly) {
      return 'edit_bg1';
    }
    return '';
  }

  // 计算税额 = 金额 / (1 + 税率) * 税率
  const jsSe = (je: number, sl1: number) => {
    return (Number(je / (1 + sl1) * (sl1)) || 0).toFixed(2);
  }

  // 计算单价 = 金额 / 数量
  const jsDj = (sl: number, je: number) => {
    return (Number(je / sl) || 0).toFixed(6);
  }

  // 行 onchange
  const handleRowOnchange = (param: any) => {
    const { dataIndex } = param;
    // 调整金额 计算单价和税额
    if (dataIndex === 'je') {
      const je = Number(form.getFieldValue('je') || '0.00').toFixed(2);
      const sl = Number(form.getFieldValue('sl') || '0.000000').toFixed(5);
      const dj = jsDj(Number(sl), Number(je));
      const sl1 = form.getFieldValue('sl1');
      let tmpSl1: number = 0;
      if (sl1 != 'MS' && sl1 != 'BZS') {
        tmpSl1 = Number(sl1);
      }
      const se = jsSe(Number(je), tmpSl1);
      form.setFieldsValue({
        dj: dj,
        se: se
      });
    }
    // 调整数量 计算单价
    if (dataIndex === 'sl') {
      const sl = Number(form.getFieldValue('sl') || '0.00000').toFixed(5);
      const je = Number(form.getFieldValue('je') || '0.00').toFixed(2);
      const dj = jsDj(Number(sl), Number(je));
      form.setFieldsValue({
        dj: dj,
      });
    }
    // 调整税率 计算税额
    if (dataIndex === 'sl1') {
      const je = Number(form.getFieldValue('je') || 0).toFixed(2);
      const sl1 = form.getFieldValue('sl1');
      let tmpSl1: number = 0;
      if (sl1 != 'MS' && sl1 != 'BZS') {
        tmpSl1 = Number(sl1);
      }
      const se = jsSe(Number(je), tmpSl1);
      form.setFieldsValue({
        se: se,
      });
    }
  }

  // 税率格式化
  const renderSl = (text: any, fpssyhlxDm: any) => {
    if (text != undefined) {
      if (fpssyhlxDm === '1') {
        return '免税';
      } else if (fpssyhlxDm === '2') {
        return '不征税';
      } else {
        return text * 100 + '%';
      }
    }
  }

  // 增加行
  const handleAdd = () => {
    const newData: any = {
      uuid: count,
      hwhyslwmc: null,
      ggxh: null,
      jldwmc: null,
      sl: null,
      dj: null,
      sphfwssflhbbm: null,
      je: null,
      sl1: null,
      se: null,
    };
    setCount(count + 1);
    setHwqdMx([...hwqdMx, newData]);
  };

  // 配置列表列
  const columns: any = !readonly ? [
    {
      title: '商品名称', ellipsis: true, dataIndex: 'hwhyslwmc', fixed: 'left', className: getColCls(), editable: readonly ? false : true, editType: 'InputSpmc', render: (text: any, record: any) => {
        return text ?
          <Tooltip title={`*${record.hwhlwjc}*${text}`}>
            <Typography.Paragraph ellipsis={true}>
              {`*${record.hwhlwjc}*${text}`}
            </Typography.Paragraph>
          </Tooltip> : '';
      }
    },
    {
      title: '规格型号', ellipsis: true, dataIndex: 'ggxh', width: 90, className: getColCls(), editable: readonly ? false : true, editType: 'Input', render: (text: any, record: any) => {
        return text ? <Tooltip key={record.uuid + record.ggxh} placement="topLeft" title={text}>{text}</Tooltip> : '';
      }
    },
    { title: '单位', ellipsis: true, dataIndex: 'jldwmc', width: 90, className: getColCls(), editable: readonly ? false : true, editType: mklx === 'FPSQD' ? 'Select' : 'Input' },
    {
      title: '数量', ellipsis: true, dataIndex: 'sl', width: 120, align: 'right', className: getColCls(), editable: readonly ? false : true, editType: 'InputNumber', render: (text: any) => {
        if (text != undefined) {
          return myUtil.text.formatNum(text, '0,0.00000');
        } else {
          return text;
        }
      }
    },
    {
      title: '单价（含税）', ellipsis: true, dataIndex: 'dj', width: 120, align: 'right', editable: readonly ? false : true, editType: 'InputNumber', render: (text: any) => {
        if (text != undefined) {
          return myUtil.text.formatNum(text, '0,0.000000');
        } else {
          return text;
        }
      }
    },
    {
      title: '成交金额', ellipsis: true, dataIndex: 'cjzj', width: 120, align: 'right', hidden: hiddenYbje, render: (text: any) => {
        if (text != undefined) {
          return myUtil.text.formatNum(text, '0,0.00');
        } else {
          return text;
        }
      }
    },
    {
      title: '金额（含税）', ellipsis: true, dataIndex: 'je', width: 120, align: 'right', className: getColCls(), editable: readonly ? false : true, editType: 'InputNumber', render: (text: any) => {
        if (text != undefined) {
          return myUtil.text.formatNum(text, '0,0.00');
        } else {
          return text;
        }
      }
    },
    {
      title: '税率（%）', ellipsis: true, dataIndex: 'sl1', width: 100, align: 'right', className: getColCls(), editable: readonly ? false : true, editType: 'Select', render: (text: any, record: any) => { return renderSl(text, record.fpssyhlxDm) }
    },
    {
      title: '税额', ellipsis: true, dataIndex: 'se', width: 120, align: 'right', editable: readonly ? false : true, editType: 'InputNumber', render: (text: any) => {
        if (text != undefined) {
          return myUtil.text.formatNum(text, '0,0.00');
        } else {
          return text;
        }
      }
    },
    {
      title: '操作', dataIndex: 'operation', width: mklx != 'FPSQD' ? 100 : 70, align: 'center', fixed: 'right', render: (_: any, record: any) => {
        const editable = isEditing(record);
        return editable ? (<>
          <Button type="link" onClick={() => handleSaveRow(record)}><CheckOutlined /></Button>
          <Divider type='vertical' />
          <Button type="link" onClick={() => handleCancel(record)}><CloseOutlined /></Button>
        </>) : (<><Button type="link" disabled={editingKey !== ''} onClick={() => handleEdit(record)}><EditOutlined /></Button>
          {mklx != 'FPSQD' ? <>
            <Divider type='vertical' />
            <Button type="link" disabled={editingKey !== ''} onClick={() => handleDelete(record.uuid)}><DeleteOutlined /></Button>
            <Divider type='vertical' />
            <Button type="link" disabled={editingKey !== ''} onClick={handleAdd}><PlusOutlined /></Button>
          </> : <></>}
        </>
        )
      }
    }
  ] : [
    {
      title: '商品名称', ellipsis: true, dataIndex: 'hwhyslwmc', fixed: 'left', className: getColCls(), editable: readonly ? false : true, editType: 'InputSpmc', render: (text: any, record: any) => {
        return text ?
          <Tooltip title={`*${record.hwhlwjc}*${text}`}>
            <Typography.Paragraph ellipsis={true}>
              {`*${record.hwhlwjc}*${text}`}
            </Typography.Paragraph>
          </Tooltip> : '';
      }
    },
    {
      title: '规格型号', ellipsis: true, dataIndex: 'ggxh', width: 90, className: getColCls(), editable: readonly ? false : true, editType: 'Input', render: (text: any, record: any) => {
        return text ? <Tooltip key={record.uuid + record.ggxh} placement="topLeft" title={text}>{text}</Tooltip> : '';
      }
    },
    { title: '单位', ellipsis: true, dataIndex: 'jldwmc', width: 90, className: getColCls(), editable: readonly ? false : true, editType: mklx === 'FPSQD' ? 'Select' : 'Input' },
    {
      title: '数量', ellipsis: true, dataIndex: 'sl', width: 120, align: 'right', className: getColCls(), editable: readonly ? false : true, editType: 'InputNumber', render: (text: any) => {
        if (text != undefined) {
          return myUtil.text.formatNum(text, '0,0.00000');
        } else {
          return text;
        }
      }
    },
    {
      title: '单价（含税）', ellipsis: true, dataIndex: 'dj', width: 120, align: 'right', editable: readonly ? false : true, editType: 'InputNumber', render: (text: any) => {
        if (text != undefined) {
          return myUtil.text.formatNum(text, '0,0.000000');
        } else {
          return text;
        }
      }
    },
    {
      title: '成交金额', ellipsis: true, dataIndex: 'cjzj', width: 120, align: 'right', hidden: hiddenYbje, render: (text: any) => {
        if (text != undefined) {
          return myUtil.text.formatNum(text, '0,0.00');
        } else {
          return text;
        }
      }
    },
    {
      title: '金额（含税）', ellipsis: true, dataIndex: 'je', width: 120, align: 'right', className: getColCls(), editable: readonly ? false : true, editType: 'InputNumber', render: (text: any) => {
        if (text != undefined) {
          return myUtil.text.formatNum(text, '0,0.00');
        } else {
          return text;
        }
      }
    },
    {
      title: '税率（%）', ellipsis: true, dataIndex: 'sl1', width: 100, align: 'right', className: getColCls(), editable: readonly ? false : true, editType: 'Select', render: (text: any, record: any) => { return renderSl(text, record.fpssyhlxDm) }
    },
    {
      title: '税额', ellipsis: true, dataIndex: 'se', width: 90, align: 'right', editable: readonly ? false : true, editType: 'InputNumber', render: (text: any) => {
        if (text != undefined) {
          return myUtil.text.formatNum(text, '0,0.00');
        } else {
          return text;
        }
      }
    }
  ];

  // 设置编辑列
  const mergedColumns: any = columns.map((col: any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any, index: number) => {
        return {
          record,
          editType: col.editType,
          dataIndex: col.dataIndex,
          title: col.title,
          range: col.range,
          editing: isEditing(record),
          openSpmc: openSpmc,
          handleRowOnchange: handleRowOnchange,
          mklx: mklx,
          index,
        };
      }
    };
  });

  // 隐藏列
  const myColumns = mergedColumns.filter((col: any) => {
    return (!(col.hidden && col.hidden !== false));
  })

  // 开启商品赋码弹窗
  function openSpmc(record: any) {
    wxspglfmRef.current!.showModal({ data: record, mainRef: onRef, zslx: 'fpsqd' });
  }

  // 赋码选中值回写
  const CallbackFmFunc = (param: any) => {
    const { record, hwxx, fmMainRef } = param;
    const newData = [...hwqdMx];
    const index = newData.findIndex((item) => hwxx.uuid === item.uuid);
    const item = newData[index];
    if (item.hasOwnProperty('hwhlwjcBak')) {
      item.hwhlwjc = record.hwhlwjc;
    } else {
      item.hwhlwjcBak = item.hwhlwjc;
      item.hwhlwjc = record.hwhlwjc;
    }
    newData.splice(index, 1, item);
    setHwqdMx(newData);
    message.info(intl2.formatMessage({ id: 'message_ckfp_fppz_fm_success' }));
    // 关闭赋码弹窗
    fmMainRef.current.closeModal();
  }

  const handleSave = () => {
    return hwqdMx;
  };

  useImperativeHandle(onRef, () => {
    return {
      CallbackFmFunc,
      handleSave,
    };
  });

  return (
    <>
      <Form form={form} component={false}>
        <Table
          dataSource={hwqdMx}
          columns={myColumns}
          pagination={false}
          components={{
            body: {
              cell: EditableCell.editableCell,
            },
          }}
          size={'small'}
          rowKey='uuid'
          bordered={true}
          scroll={{ x: '1100px', y: `${document.documentElement.clientHeight - 303}px` }}
          summary={(pageData) => {
            let totalJe = 0;
            let totalSe = 0;
            pageData.forEach(({ je, se }) => {
              totalJe += Number(je) || 0;
              totalSe += Number(se) || 0;
            });
            let sum;
            if (hiddenYbje) {
              sum = <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} className="center">合计</Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>&nbsp;</Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>&nbsp;</Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>&nbsp;</Table.Summary.Cell>
                  <Table.Summary.Cell index={4}>&nbsp;</Table.Summary.Cell>
                  <Table.Summary.Cell index={5} className="t_right">{myUtil.text.formatNum(totalJe, '0,0.00')}</Table.Summary.Cell>
                  <Table.Summary.Cell index={6}>&nbsp;</Table.Summary.Cell>
                  <Table.Summary.Cell index={7} className="t_right">{myUtil.text.formatNum(totalSe, '0,0.00')}</Table.Summary.Cell>
                  <Table.Summary.Cell index={8}>&nbsp;</Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary >
            } else {
              sum = <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} className="center">合计</Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>&nbsp;</Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>&nbsp;</Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>&nbsp;</Table.Summary.Cell>
                  <Table.Summary.Cell index={4}>&nbsp;</Table.Summary.Cell>
                  <Table.Summary.Cell index={5}>&nbsp;</Table.Summary.Cell>
                  <Table.Summary.Cell index={6} className="t_right">{myUtil.text.formatNum(totalJe, '0,0.00')}</Table.Summary.Cell>
                  <Table.Summary.Cell index={7}>&nbsp;</Table.Summary.Cell>
                  <Table.Summary.Cell index={8} className="t_right">{myUtil.text.formatNum(totalSe, '0,0.00')}</Table.Summary.Cell>
                  <Table.Summary.Cell index={9}>&nbsp;</Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary >
            }
            return sum;
          }}
        />
      </Form>
      <Wxspglfm onRef={wxspglfmRef} />
    </>
  );
};

export default Hwqd;
