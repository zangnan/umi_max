
import { Typography, Input, InputNumber, Form, Select, Tooltip } from 'antd';
import './style.less';
import baseValidator from '@/components/DDAssist/field/baseValidator';
import { history } from 'umi';

const EditableCell: any = {
};

EditableCell.editableCell = ({
  editing,
  dataIndex,
  title,
  editType,
  record,
  index,
  children,
  openSpmc,
  handleRowOnchange,
  mklx,
  ...restProps
}) => {
  let inputNode: any;

  const validator = {
    ggxh01: () =>{
      const validator = (_rule: any, values: any) => {  
        if (values) {
          let len = 0;
          const length = values ? values.length : 0;
          for (let i = 0; i < length; i++) {
            if (values.charCodeAt(i) > 127 || values.charCodeAt(i) == 94) { // 中文字符占3位
              len += 2;
            } else {
              len++;
            }
          }
          if (len > 40) {
            return Promise.reject(<>该项长度不能<br />大于40字符！</>);
          }
          return Promise.resolve();
        }
        return Promise.resolve();
      }
      return { validator };
    },
  }

  if (editType === 'Input') {
    if ("ggxh" === dataIndex) {
      inputNode = <Form.Item name={dataIndex} style={{ margin: 0 }}
        rules={[validator.ggxh01()]}>
        <Input />
      </Form.Item>;
    } else {
      inputNode = <Form.Item name={dataIndex} style={{ margin: 0 }}
        rules={[{ required: true, message: `请输入${title}!` },]} >
        <Input />
      </Form.Item>;
    }
  } else if (editType === 'InputSpmc') {
    inputNode = <>
      <div style={{ position: 'relative', paddingLeft: '80px' }}>
        <div onClick={() => openSpmc(record)} style={{ position: 'absolute', top: '5px', left: '0', maxWidth: '80px', display: 'inlineBlock' }}>
          <Tooltip title={`*${record?.hwhlwjc || '请选择类别'}*`}>
            <Typography.Link ellipsis={true}>
              {`*${record?.hwhlwjc || '请选择类别'}*`}
            </Typography.Link>
          </Tooltip>
        </div>
        <Form.Item name={dataIndex} style={{ margin: 0 }}
          rules={[{ required: true, message: `请输入${title}!` }, baseValidator.range2({ min: 0, max: 400 })]} >
          <Input />
        </Form.Item>
      </div>
    </>;
  } else if (editType === 'InputNumber') {
    const rules: any = [{ required: true, message: `请输入${title}!` }];
    let precision: number = 2;
    let max: any = 999999999999.99;
    let min: any = -999999999999.99;
    if (dataIndex === 'sl') {
      precision = 5;
      max = 9999999999.99999;
      min = -9999999999.99999;
    }
    if (dataIndex === 'dj') {
      precision = 6;
      max = 999999999999.999999;
      min = -999999999999.999999;
    }
    if (dataIndex === 'sl' || dataIndex === 'je') {
      rules.push(baseValidator.numRange(['+']));
    }
    inputNode = <Form.Item name={dataIndex} style={{ margin: 0 }}
      rules={rules}>
      <InputNumber max={max} min={min} controls={false} precision={precision} disabled={"dj" === dataIndex || "se" === dataIndex} onBlur={(value: any) => {
        handleRowOnchange({
          record,
          dataIndex,
          value,
          index,
          restProps
        })
      }} />
    </Form.Item>;
  } else if (editType === 'Select') {
    let option: any;
    // 如果是单位重新调整下拉
    if ('jldwmc' === dataIndex) {
      const tmp1: any = [];
      if (record.sbjldwmc?.trim()) {
        if (!tmp1.includes(record.sbjldwmc)) {
          tmp1.push(record.sbjldwmc);
        }
      }
      if (record.hgjldwmc?.trim()) {
        if (!tmp1.includes(record.hgjldwmc)) {
          tmp1.push(record.hgjldwmc);
        }
      }
      if (record.dejldwmc?.trim()) {
        if (!tmp1.includes(record.dejldwmc)) {
          tmp1.push(record.dejldwmc);
        }
      }
      if (record.jldwmc?.trim()) {
        if (!tmp1.includes(record.jldwmc)) {
          tmp1.push(record.jldwmc);
        }
      }
      option = <>
        {tmp1.map((item: any, index: any) => (
          <Select.Option value={item} key={'jldwmc' + index.toString()}>{item}</Select.Option>
        ))}
      </>
    } else {
      option = <>
        <Select.Option value="0" key={'slv0'}>0%</Select.Option>
        <Select.Option value="0.03" key={'slv1'}>3%</Select.Option>
        <Select.Option value="0.06" key={'slv2'}>6%</Select.Option>
        <Select.Option value="0.09" key={'slv3'}>9%</Select.Option>
        <Select.Option value="0.13" key={'slv4'}>13%</Select.Option>
        {/* <Select.Option value="MS" key={'slv5'} disabled={true}>免税</Select.Option>
        <Select.Option value="BZS" key={'slv6'} disabled={true}>不征税</Select.Option> */}
      </>
    }
    // if ("FPSQD" === mklx && "sl1" === dataIndex && (record.slv === 'MS' || record.slv === 'BZS')) {
    if ("FPSQD" === mklx && "sl1" === dataIndex && (Number(record.sl1) === Number('0') && (record.fpssyhlxDm === '1' || record.fpssyhlxDm === '2'))) {
      if(record.syyhzcbz != '1' && dataIndex === 'sl1') {
        inputNode = <Form.Item name={dataIndex} style={{ margin: 0 }}
          rules={[{ required: true, message: `请输入${title}!` },]} >
          <Select disabled={true} onChange={(value: any) => {
            handleRowOnchange({
              record,
              dataIndex,
              value,
              index,
              restProps
            })
          }}>
            {option}
          </Select>
        </Form.Item>;
      }
    } else {
      // 先判断页面
      // 1、导入模板开具
      if(history?.location?.pathname.indexOf('/drmbkj')>-1 ||(history?.location?.pathname.indexOf('/fpztgz')>-1 && record.fpkjfsDm =='3')){
        // 判断税率
        if(record.syyhzcbz && record.syyhzcbz != '1' && dataIndex === 'sl1') {
          inputNode = <Form.Item name={dataIndex} style={{ margin: 0 }}
            rules={[{ required: true, message: `请输入${title}!` },]} >
            <Select onChange={(value: any) => {
              handleRowOnchange({
                record,
                dataIndex,
                value,
                index,
                restProps
              })
            }}>
              {option}
            </Select>
          </Form.Item>;
        } else {
          inputNode = <Form.Item name={dataIndex} style={{ margin: 0 }}>
            <span>{record.fpssyhlxDm ? record.fpssyhlxDm === '1' ? "免税" : '不征税' :record.sl1}</span>
        </Form.Item>
        }
      }else{
        // 发票申请单
        if((record.fpssyhlxDm == '1' || record.fpssyhlxDm == '2') && dataIndex === 'sl1') {
          inputNode = <Form.Item name={dataIndex} style={{ margin: 0 }}>
          <span>{record.fpssyhlxDm ? record.fpssyhlxDm === '1' ? "免税" : '不征税' :record.sl1}</span>
          </Form.Item>
        }else{
          inputNode = <Form.Item name={dataIndex} style={{ margin: 0 }}
          rules={[{ required: true, message: `请输入${title}!` },]} >
          <Select onChange={(value: any) => {
            handleRowOnchange({
              record,
              dataIndex,
              value,
              index,
              restProps
            })
          }}>
            {option}
          </Select>
        </Form.Item>;
        }
      }
    }
  }
  return (
    <td key={dataIndex} {...restProps}>
      {editing ? inputNode : children}
    </td>
  );
};

export default EditableCell;