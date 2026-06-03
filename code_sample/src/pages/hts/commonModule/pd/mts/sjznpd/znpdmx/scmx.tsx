/**
 * title: 智能配单明细-生成明细明细
 * author: yxy
 */
import React, { useImperativeHandle, useState, useEffect, useCallback } from 'react';
import {Spin, Form, Button, Table,Divider, Input, Select, message, Tooltip} from 'antd';
import baseValidator from '@/pages/common/field/baseValidator';
import { intl as intl2 } from '@/pages/common/myUtil';
import { FallOutlined, RiseOutlined, MinusOutlined } from '@ant-design/icons';
import { checkZnpdSbxx} from '@/services/hts/api';
import myUtil from '@/pages/common/myUtil';

export interface ScmxProps {
  onRef?: any;
  sbxx?: any;
  pxArr?: any
}

const ModalScmx: React.FC<ScmxProps> = ({
  onRef,
  sbxx,
  pxArr,
}) => {
  const [masker, setMasker] = useState<boolean>(false);
  const [scmxForm] = Form.useForm();
  const [gridData, setGridData] = useState<any>([]);
  const [ywlxData, setYwlxData] = useState<any>([]);

  const columns = [
    {
      title: '序号', dataIndex: 'index', width: 60, align: 'center', render: (_text: any, _record: any, index: number) => (
        <span>{index + 1}</span>)
    },
    { title: '排序字段', dataIndex: 'pxzd' },
    { title: '排序规则', dataIndex: 'order', align: 'center', width: 80, render: (text: string, record: any, index: any) => {
      if (text === 'desc') {
        return <Tooltip placement="topLeft" title={'降序'}><a onClick={() => changeRule(index, text)}><FallOutlined style={{fontSize: '14px', color: '#3b5999'}} /></a></Tooltip>;
      } else if (text === 'asc') {
        return <Tooltip placement="topLeft" title={'升序'}><a onClick={() => changeRule(index, text)}><RiseOutlined style={{fontSize: '14px', color: '#55acee'}} /></a></Tooltip>;
      }
      return <MinusOutlined style={{fontSize: '14px', color: '#d2d2d2'}}/>;
    }},
    {
      title: '操作', width: 100, align: 'center', render: (_text: any, _record: any, index: number) => (<>
        <Button type='link' onClick={() => setPosition(index, 'up')} disabled={index === 0}>上移</Button>
        <Divider type='vertical' />
        <Button type='link' onClick={() => setPosition(index, 'down')} disabled={index === (gridData.length - 1)}>下移</Button>
      </>)
    },
  ];

  // 上移 下移 置顶 置底
  const changeRule = useCallback(
    (index: number, rule: any) => {
      const newData = gridData.concat([]);
      newData[index].order = rule === 'asc'? 'desc': 'asc';
      setGridData(newData);
    },
    [gridData]
  );

  // 上移 下移 置顶 置底
  const setPosition = (index: any, flag: any) => {
    if (flag === 'up') {
      [gridData[index], gridData[index - 1]] = [gridData[index - 1], gridData[index]];
    } else if (flag === 'down') {
      [gridData[index], gridData[index + 1]] = [gridData[index + 1], gridData[index]];
    }
    const newArr: any = [].concat(gridData);
    setGridData(newArr);
  };

  // 表单布局
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };


  useEffect(() => {
    const qylx = myUtil.sys.enterpriseType();
    let valueKey = '01';
    if (qylx === 'WM') {
      valueKey = '06';
    } else if (qylx === 'SC') {
      valueKey = '04';
    }
    const promiseArr: any = [myUtil.code.getCodeFromServerT1('code_dm_ckts_cktmsywlx', valueKey)];
    Promise.all(promiseArr).then(() => {
      // do nothing
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      const tmpCodeTable: any = myUtil.code.getSelectOption('code_dm_ckts_cktmsywlx', valueKey);
      setYwlxData(tmpCodeTable);
      scmxForm.setFieldsValue(sbxx);
      setGridData(pxArr);
    });
  }, [sbxx, pxArr]);

  const handleGetGridData = () => {
    return gridData;
  }

  const changeMasker = (flag: any) => {
    setMasker(flag);
  }

  const handleforms = () => {
    return scmxForm;
  }

  const sbxxChange = () => {
    const sbxx: any = scmxForm.getFieldsValue();
    if (sbxx.sbYm && String(sbxx.sbYm).length === 6  && sbxx.sbPc && String(sbxx.sbPc).length === 3) {
      // if (sbxx.sbPc.length != 3) {
      //   const sbPc = myUtil.text.leadingZeroize(sbxx.sbPc, 3);
      //   sbxx.sbPc = sbPc;
      //   scmxForm.setFieldsValue({sbPc: sbPc});
      // }
      setMasker(true);
      checkZnpdSbxx({pduuid: sbxx.pduuid, sbYm: sbxx.sbYm, sbPc:sbxx.sbPc}).then((response) => {
        const {code, body,  desc} = response;
        if (code === '200') {
          scmxForm.setFieldsValue({ldlpNo: body.ldlpNo, sbYm: sbxx.sbYm, sbPc: sbxx.sbPc});
        } else if (code === '900') {
          scmxForm.setFieldsValue({ldlpNo: ''});
          message.info(desc);
        } else {
          scmxForm.setFieldsValue({ldlpNo: ''});
          message.error(desc);
        }
        setMasker(false);
      })
    }
  }

  useImperativeHandle(onRef, () => {
    return {
      handleGetGridData,
      changeMasker,
      handleforms
    };
  });

  return (
    <>
    <Spin tip="Loading..." spinning={masker} delay={100}>
        <div className="dd-form">
          <Form form={scmxForm} {...layout} initialValues={{ pduuid: '', ssq: '', sbpc: '', qsglh: '',  ywlxDm:[]}}>
            <Form.Item name="pduuid"  style={{display: "none"}}>
              <Input type={'hidden'} />
            </Form.Item>
            <Form.Item name="sbYm" label="申报年月" rules={[baseValidator.required(),() => ({
              validator(_, value) {
                if (value) {
                  if (!value.match(/^[1-9]\d{3}(0[1-9]|1[0-2])$/)) {
                    return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_d_yyyyMM' })));
                  }
                  if (value.length != 6) {
                    let message = myUtil.text.formatRepalce(intl2.formatMessage({ id: 'validator_v_eq' }), { len: 6 });
                    return Promise.reject(new Error(message));
                  }
                }
                return Promise.resolve();
              }})]}>
              <Input placeholder="申报年月" onChange={sbxxChange}/>
            </Form.Item>
            <Form.Item name="sbPc" label="申报批次" rules={[baseValidator.required(),() => ({
              validator(_, value) {
                if (value) {
                  if (!value.match(/^\d+$/)) {
                    return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_number' })));
                  }
                  if (value.length != 3) {
                    let message = myUtil.text.formatRepalce(intl2.formatMessage({ id: 'validator_v_eq' }), { len: 3 });
                    return Promise.reject(new Error(message));
                  }
                }
              return Promise.resolve();
              }})]}>
              <Input placeholder="申报批次" onChange={sbxxChange}/>
            </Form.Item>
            <Form.Item name="ldlpNo" label="起始关联号" rules={[baseValidator.required()]}>
              <Input placeholder="起始关联号" disabled={true} readOnly={true}/>
            </Form.Item>
            <Form.Item name="pxgz" label="排序规则" >
              <Table
                dataSource={gridData}
                pagination={false}
                size="small"
                rowKey='pxzd'
                columns={columns}
                bordered={true}
              />
            </Form.Item>
            <Form.Item name="ywlxDm" label="业务类型代码"  rules={[
              () => ({
                validator(_, value) {
                  if (value && value.length > 3) {
                    return Promise.reject(new Error('最多选择3项业务类型代码！'));
                  }
                  return Promise.resolve();
                },
              })
            ]} >
              <Select mode="multiple" maxTagCount={3} >
                {ywlxData.map((item: any) => (
                  <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
    </Spin>
    </>
  );
};

export default ModalScmx;
