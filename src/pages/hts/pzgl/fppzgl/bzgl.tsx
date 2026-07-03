/**
 * 发票开具配置  备注管理
 */
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Input, Button, Divider, Form, Select, Tooltip, Space, InputNumber, Table, message, Spin } from 'antd';
import ProCard from '@ant-design/pro-card';
import { UpOutlined, DownOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import '../style.less';
import myUtil from '@/components/DDAssist/util';
import { bzglcx, bzglwh } from '@/pages/hts/services/htsApi';
import { useIntl } from 'umi';
import baseValidator from '@/components/DDAssist/field/baseValidator';

const EditableContext = React.createContext(null);

export interface DDBzglProps {
  sx?: any;
}

const EditableRow: any = ({ index, ...props }) => {
  const [form1] = Form.useForm();
  return (
    <Form form={form1} component={false}>
      <EditableContext.Provider value={form1}>
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
  const inputRef: any = useRef();
  const form: any = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item style={{ margin: 0, }} name={dataIndex} >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} disabled={record.fpbzywzdywm === 'DJBH'} />
      </Form.Item>
    ) : 
    (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24, height: 20 }} onClick={toggleEdit} >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const bgdData = [
  { xzbz2: ' ', fpbzywzdDm: '01', fpbzywzdzwm: '报关单号', lbm: '报关单', fpbzywzdylsj: '350220210021522364' },
  { xzbz2: ' ', fpbzywzdDm: '02', fpbzywzdzwm: '原币币制', lbm: ' ', fpbzywzdylsj: 'USD' },
  { xzbz2: ' ', fpbzywzdDm: '03', fpbzywzdzwm: '原币汇率', lbm: '', fpbzywzdylsj: '632.45' },
  { xzbz2: ' ', fpbzywzdDm: '04', fpbzywzdzwm: '原币金额', lbm: '', fpbzywzdylsj: '674' },
  { xzbz2: ' ', fpbzywzdDm: '05', fpbzywzdzwm: '成交方式', lbm: '', fpbzywzdylsj: 'FOB' },
  { xzbz2: ' ', fpbzywzdDm: '06', fpbzywzdzwm: '监管方式代码', lbm: '', fpbzywzdylsj: '0110' },
  { xzbz2: ' ', fpbzywzdDm: '07', fpbzywzdzwm: '监管方式名称', lbm: '', fpbzywzdylsj: '一般贸易' },
  { xzbz2: ' ', fpbzywzdDm: '08', fpbzywzdzwm: '出口口岸', lbm: '', fpbzywzdylsj: '外港海关' },
  { xzbz2: ' ', fpbzywzdDm: '09', fpbzywzdzwm: '美元FOB价', lbm: '', fpbzywzdylsj: '746.45' },
  { xzbz2: ' ', fpbzywzdDm: '10', fpbzywzdzwm: '合同协议号', lbm: '', fpbzywzdylsj: 'F2394533' },
  { xzbz2: ' ', fpbzywzdDm: '11', fpbzywzdzwm: '备案号', lbm: '', fpbzywzdylsj: 'C3232132112' },
  { xzbz2: ' ', fpbzywzdDm: '12', fpbzywzdzwm: '出口日期', lbm: '', fpbzywzdylsj: '2021/06/12' },
  { xzbz2: ' ', fpbzywzdDm: '13', fpbzywzdzwm: '提运单号', lbm: '', fpbzywzdylsj: 'MAT1231A' },
  { xzbz2: ' ', fpbzywzdDm: '14', fpbzywzdzwm: '运费', lbm: '', fpbzywzdylsj: '20' },
  { xzbz2: ' ', fpbzywzdDm: '15', fpbzywzdzwm: '保费', lbm: '', fpbzywzdylsj: '30' },
  { xzbz2: ' ', fpbzywzdDm: '16', fpbzywzdzwm: '运抵国', lbm: '', fpbzywzdylsj: '美国' },
  { xzbz2: ' ', fpbzywzdDm: '17', fpbzywzdzwm: '运输方式', lbm: '', fpbzywzdylsj: '水运运输' },
  { xzbz2: ' ', fpbzywzdDm: '18', fpbzywzdzwm: '美元汇率', lbm: '', fpbzywzdylsj: '632.45' },
  { xzbz2: ' ', fpbzywzdDm: '19', fpbzywzdzwm: '最终目的国', lbm: '', fpbzywzdylsj: '美国' },
  { xzbz2: ' ', fpbzywzdDm: '20', fpbzywzdzwm: '指运港', lbm: '', fpbzywzdylsj: '美国' },
]

const Bzgl: React.FC<DDBzglProps> = ({
  sx,
}) => {

  const [gridData, setGridData] = useState<any>([]);// 业务字段项数据
  const [bzData, setBzData] = useState<any>([]);// 备注示例数据（不包括首部文字）
  const [sbwzData, setSbwzData] = useState<any>([]);// 备注示例中首部文字
  const [skplx, setSkplx] = useState<any>("");// 税盘类型
  const [selectionRowKeys, setSelectionRowKeys] = useState<any>([]);// 数据列表勾选数据的key
  const [selectionRows, setSelectionRows] = useState<any>([]); // 数据列表选中的行详细数据
  const [dtsjFlag, setDtsjFlag] = useState<boolean>(false);// 多条数据标志
  const [form] = Form.useForm();// 表单常量
  const [masker, setMasker] = useState<boolean>(false); // 蒙板

  const [fpbzzdxfgfDmList, setFpbzzdxfgfDmList] = useState<any>([]); // 字段项分隔符数据
  const [fpbzdtsjfgfDmList, setFpbzdtsjfgfDmList] = useState<any>([]); // 多条数据分隔符数据
  const intl = useIntl(); // 提示信息
  const [gdjqgzDisable, setGdjqgzDisable] = useState<boolean>(false); // 关单截取规则是否可用
  const [qdfp, setQdfp] = useState<any>("");// 数电票
  const [fpkjfsDm, setFpkjfsDm] = useState<any>("");// 开票方式

  useEffect(() => {
    Promise.all([myUtil.code.getCodeFromServerT1('CODE_DM_ZXSB_FPBZZDXFGF:01'), myUtil.code.getCodeFromServerT1('CODE_DM_ZXSB_FPBZDTSJFGF:01'), myUtil.code.getCodeFromServerT1('CODE_CS_ZXSB_FPKJ_CSPZ:01')]).then(() => {
    }).catch(() => {
    }).finally(() => {
      // 设置 字段项分割符
      const fpbzzdxfgfDmData = myUtil.code.getCode('CODE_DM_ZXSB_FPBZZDXFGF:01');
      setFpbzzdxfgfDmList(fpbzzdxfgfDmData);
      // 设置多条数据分割符
      const fpbzdtsjfgfDmData = myUtil.code.getCode('CODE_DM_ZXSB_FPBZDTSJFGF:01');
      setFpbzdtsjfgfDmList(fpbzdtsjfgfDmData);
      // 设置税控盘类型
      const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01');
      setSkplx(temp[0].fpsplxDm);
      // 设置数电票
      setQdfp(temp[0].fpzlDm1);
      // 开票方式
      setFpkjfsDm(temp[0].fpkjfsDm)
      // 查询业务字段项和基本数据项
      setMasker(true);
      bzglcx({}).then((response) => {
        const { code, body, desc } = response;
        setMasker(false);
        if (code === '200') {
          //数电票（普通发票）时，默认在备注管理-业务字段项选择报关单号
          if(temp[0].fpzlDm1 === '5'){
            var isHandleQdfpSave = false;
            if(body?.jcsjx?.fpbzgdjqws !== 9){
              // body.jcsjx.fpbzgdjqws = 9;
              isHandleQdfpSave = true;
            }
            setGdjqgzDisable(true);
            body?.ywzdxlb.forEach((row: any) => {
              // 单据号默认选中
              if(temp[0].fpkjfsDm === '1' && row.fpbzywzdywm === "DJBH" && row.xzbz2 !== 'Y') {
                row.xzbz2 = "Y";
              }
              // if(row.fpbzywzdywm === "DJBH" && row.xzbz2 !== 'Y'){
              //   row.xzbz2 = "Y";
              //   isHandleQdfpSave = true;
              // }
            });
            if(isHandleQdfpSave){
              // handleQdfpSave(body);
            }
          } else {
            setGdjqgzDisable(false);
          }
          // 赋值基本数据项
          form.setFieldsValue(body?.jcsjx);
          // 赋值业务字段项
          setGridData(body?.ywzdxlb);
          // 将选中字段选中
          const keys: any = [];
          let sbwz: any = '';
          body?.ywzdxlb.forEach((row: any) => {
            if (row.xzbz2 === 'Y') {
              keys.push(row.fpbzywzdDm);
              sbwz = body?.jcsjx?.fpbzsbwz;
            }
          });
          setSelectionRowKeys(keys);
          // 首部文字生成备注示例
          if (sbwz?.trim()) {
            setSbwzData([].concat(changeHtml(keys.length, sbwz, '', fpbzzdxfgfDmData, temp[0].fpsplxDm)));
          } else {
            setSbwzData([]);
          }
          // 根据业务字段项获取备注示例
          gtChangeMethod(body?.ywzdxlb, fpbzzdxfgfDmData, fpbzdtsjfgfDmData, temp[0].fpsplxDm);
        } else {
          message.error(desc);
        }
      })
    });
  }, [sx]);

  //数电票状态时保存
  const handleQdfpSave = (mainData: any) => {
    const newData = [...mainData?.ywzdxlb];
    // 给业务字段项增加更新序号
    newData.forEach((temp: any, index: any) => {
      temp.gxxh = index + 1;
      if(temp.fpbzywzdywm === "BGDHGBH" && temp.xzbz2 !== 'Y'){
        temp.xzbz2 = "Y";
      }
    });
    // 获取基本数据项设置
    let formValues = form.getFieldsValue();
    formValues.fpbzgdjqws = 9;
    formValues.ywzdglpzVoList = newData;
    bzglwh(formValues).then((response) => {
      const { code, desc } = response;
      setMasker(false);
      if (code === '200') {
      } else {
        message.error(desc);
      }
    })
  }

  // 数据项列表展示列，其中字段标志、选中标志只用于业务判断
  const columns = [
    {
      title: '序号', dataIndex: 'index', width: 30, render: (_text: any, _record: any, index: number) => (
        <span>{index + 1}</span>)
    },
    { title: '字段标志', dataIndex: 'fpbzywzdDm', width: 80, hidden: true },
    { title: '字段代码', dataIndex: 'fpbzywzdywm', width: 80, hidden: true },
    { title: '选中标志', dataIndex: 'xzbz2', width: 80, hidden: true },
    { title: '字段名称', dataIndex: 'fpbzywzdzwm', width: 90 },
    { title: '字段别名', dataIndex: 'lbm', width: 80, editable: true, className: 'dd_editable_column' },
    { title: '样例数据', dataIndex: 'fpbzywzdylsj', width: 120 },
    {
      title: '排序', width: 50, fixed: 'right', render: (_text: any, _record: any, index: number) => (<>
        <Button type='link' onClick={() => setPosition(index, 'up')} disabled={index === 0}><UpOutlined /></Button>
        <Divider type='vertical' />
        <Button type='link' onClick={() => setPosition(index, 'down')} disabled={index === (gridData.length - 1)}><DownOutlined /></Button>
      </>)
    },
  ];

  // 操作列的上移、下移 以及重画备注示例的文字
  const setPosition = (index: any, flag: any) => {
    if (flag === 'up') {
      [gridData[index], gridData[index - 1]] = [gridData[index - 1], gridData[index]];
    } else if (flag === 'down') {
      [gridData[index], gridData[index + 1]] = [gridData[index + 1], gridData[index]];
    }
    const newArr: any = [].concat(gridData);

    // 根据排序好的数据重新生成备注示例（按照数据状态“选中标志”）
    const array: any = []
    newArr.forEach((row: any) => {
      if (row.xzbz2 === 'Y') {
        const fpbzdtsjfgfDm = getFpbzdtsjfgfDm(fpbzdtsjfgfDmList);// 多条数据分隔符
        const keyLength = gridData.filter((item: any) => item.xzbz2 === 'Y').length;
        if ('ckbgdh' === row.fpbzywzdDm) {
          const bgdh = row.fpbzywzdylsj.split('/');
          const temp1: any = []
          bgdh.forEach((bgd: any, tempIndex: any) => {
            // 报关单样例截取
            temp1.push(subString(bgd));
            if (tempIndex < bgdh.length - 1) {
              temp1.push(fpbzdtsjfgfDm);
            }
          });
          array.push(changeHtml(keyLength, ((row.lbm ? row.lbm.trim() : '') || row.fpbzywzdzwm) + ':', temp1, fpbzzdxfgfDmList, skplx));
        } else {
          array.push(changeHtml(keyLength, ((row.lbm ? row.lbm.trim() : '') || row.fpbzywzdzwm) + ':', row.fpbzywzdylsj.replace('/', fpbzdtsjfgfDm), fpbzzdxfgfDmList, skplx));
        }
      }
    });
    setBzData(array);
    setGridData(newArr);
  };

  // 根据税控盘、勾选长度、是否换行、字段分割符拼接代码
  const changeHtml = (keyLength: any, value1: any, value2: any, fpbzzdxfgfDmData: any, splx: any) => {
    // let html: any;
    // const fpbzzdxfgfDm = form.getFieldValue('fpbzzdxfgfDm');// 字段项分割符
    // const fpbzzdxfgfDmCheck = fpbzzdxfgfDmData.filter((item: any) => item.fpbzzdxfgfDm === fpbzzdxfgfDm)[0];
    // const fpbzzdxhhbz = form.getFieldValue('fpbzzdxhhbz');// 字段项换行
    // if (splx === '2' || splx === '3') {
    //   if (keyLength > 4) {
    //     html = <span key={value1}>{value1}{value2}{fpbzzdxfgfDmCheck?.fpbzzdxfgffh}</span>;
    //   } else {
    //     // 字段项换行
    //     if (fpbzzdxhhbz === 'Y') {
    //       html = <div key={value1}>{value1}{value2}{fpbzzdxfgfDmCheck?.fpbzzdxfgffh}</div>;
    //     } else {
    //       html = <span key={value1}>{value1}{value2}{fpbzzdxfgfDmCheck?.fpbzzdxfgffh}</span>;
    //     }
    //   }
    // } else {
    //   if (keyLength > 6) {
    //     html = <span key={value1}>{value1}{value2}{fpbzzdxfgfDmCheck?.fpbzzdxfgffh}</span>;
    //   } else {
    //     // 字段项换行
    //     if (fpbzzdxhhbz === 'Y') {
    //       html = <div key={value1}>{value1}{value2}{fpbzzdxfgfDmCheck?.fpbzzdxfgffh}</div>;
    //     } else {
    //       html = <span key={value1}>{value1}{value2}{fpbzzdxfgfDmCheck?.fpbzzdxfgffh}</span>;
    //     }
    //   }
    // }

    let html: any;
    const fpbzzdxfgfDm = form.getFieldValue('fpbzzdxfgfDm');// 字段项分割符
    const fpbzzdxfgfDmCheck = fpbzzdxfgfDmData.filter((item: any) => item.fpbzzdxfgfDm === fpbzzdxfgfDm)[0];
    const fpbzzdxhhbz = form.getFieldValue('fpbzzdxhhbz');// 字段项换行
    if (fpbzzdxhhbz === 'Y') {
      html = <div key={value1}>{value1}{value2}{fpbzzdxfgfDmCheck?.fpbzzdxfgffh}</div>;
    } else {
      html = <span key={value1}>{value1}{value2}{fpbzzdxfgfDmCheck?.fpbzzdxfgffh}</span>;
    }
    return html;
  }

  // 根据截取规则返回截取文字（报关单示例使用）
  const subString = (bgdsl: any) => {
    let str = '';
    const fpbzgdjqws = form.getFieldValue('fpbzgdjqws');// 多条报关单截取规则（从后截取）
    if (fpbzgdjqws != 0) {
      str = bgdsl.substring(bgdsl.length - fpbzgdjqws)
    } else {
      str = bgdsl
    }
    return str;
  }

  const getFpbzdtsjfgfDm = (param: any) => {
    const fpbzdtsjfgfDm = form.getFieldValue('fpbzdtsjfgfDm');// 多条数据分隔符
    const fpbzdtsjfgfDmCheck = param.filter((item: any) => item.fpbzdtsjfgfDm === fpbzdtsjfgfDm)[0];
    return fpbzdtsjfgfDmCheck?.fpbzdtsjfgffh;
  }

  // 生成备注示例文字（因点击上移下移时无法获取到选中的数据，操作的是选中数据，暂时废弃不使用）
  const gtSelectMethod = () => {
    const array: any = []
    const fpbzdtsjfgfDm = getFpbzdtsjfgfDm(fpbzdtsjfgfDmList);
    const keyLength = selectionRowKeys.length;
    selectionRows.forEach((row: any) => {
      if ('ckbgdh' === row.fpbzywzdDm) {
        const bgdh = row.fpbzywzdylsj.split('/');
        const temp1: any = []
        bgdh.forEach((bgd: any, index: any) => {
          // 报关单样例截取
          temp1.push(subString(bgd));
          if (index < bgdh.length - 1) {
            temp1.push(fpbzdtsjfgfDm);
          }
        });
        array.push(changeHtml(keyLength, ((row.lbm ? row.lbm.trim() : '') || row.fpbzywzdzwm) + ':', temp1, fpbzzdxfgfDmList, skplx));
      } else {
        array.push(changeHtml(keyLength, ((row.lbm ? row.lbm.trim() : '') || row.fpbzywzdzwm) + ':', row.fpbzywzdylsj.replace('/', fpbzdtsjfgfDm), fpbzzdxfgfDmList, skplx));
      }
    });
    setBzData(array);
    // 同步更改备注示例中的首部文字
    if (sbwzData.length > 0) {
      setSbwzData([].concat(changeHtml(keyLength, sbwzData[0].props.children[0], '', fpbzzdxfgfDmList, skplx)))
    }
  }

  // 生成备注示例文字（使用数据状态“选中标志”来判断是否选中，操作的是整体数据）
  const gtChangeMethod = (param: any, fpbzzdxfgfDmData: any, fpbzdtsjfgfDmData: any, splx: any) => {
    const array: any = []
    const keyLength = param.filter((item: any) => item.xzbz2 === 'Y').length;
    const fpbzdtsjfgfDm = getFpbzdtsjfgfDm(fpbzdtsjfgfDmData);// 多条数据分隔符
    param.forEach((row: any) => {
      if (row.xzbz2 === 'Y') {
        if ('01' === row.fpbzywzdDm) {
          const bgdh = subString(row.fpbzywzdylsj);
          const temp1: any = []
          // 报关单样例截取
          temp1.push(bgdh);
          if (dtsjFlag) {
            temp1.push(fpbzdtsjfgfDm);
            temp1.push(bgdh);
          }
          array.push(changeHtml(keyLength, ((row.lbm ? row.lbm.trim() : '') || row.fpbzywzdzwm) + ':', temp1, fpbzzdxfgfDmData, splx));
        }
        else if ('03' === row.fpbzywzdDm){
          // 原币汇率是否除以100处理
          const temp2: any = []
          let tmpYbhl = Number(row.fpbzywzdylsj);
          let tmpYbhlReal = row.fpbzywzdylsj;
          const ybwbdhrmbbz = form.getFieldValue('ybwbdhrmbbz');
          if("Y" === ybwbdhrmbbz){
            tmpYbhlReal = (tmpYbhl / 100).toFixed(4);
          }
          else{
            tmpYbhlReal = tmpYbhl;
          }
          temp2.push(tmpYbhlReal);
          if (dtsjFlag) {
            temp2.push(fpbzdtsjfgfDm);
            temp2.push(tmpYbhlReal);
          }
          array.push(changeHtml(keyLength, ((row.lbm ? row.lbm.trim() : '') || row.fpbzywzdzwm) + ':', temp2, fpbzzdxfgfDmData, splx));
        }
        else {
          if (dtsjFlag) {
            array.push(changeHtml(keyLength, ((row.lbm ? row.lbm.trim() : '') || row.fpbzywzdzwm) + ':', row.fpbzywzdylsj + fpbzdtsjfgfDm + row.fpbzywzdylsj, fpbzzdxfgfDmData, splx));
          } else {
            array.push(changeHtml(keyLength, ((row.lbm ? row.lbm.trim() : '') || row.fpbzywzdzwm) + ':', row.fpbzywzdylsj, fpbzzdxfgfDmData, splx));
          }

        }
      }
    });
    setBzData(array);
    // 同步更改备注示例中的首部文字
    if (sbwzData.length > 0) {
      setSbwzData([].concat(changeHtml(keyLength, sbwzData[0].props.children[0], '', fpbzzdxfgfDmList, splx)))
    }
  }

  // 首部文字改变触发生成备注示例
  const inputChange = (e: any) => {
    const sbwz = e.target.value;
    if (sbwz.trim()) {
      setSbwzData([].concat(changeHtml(selectionRowKeys.length, e.target.value, '', fpbzzdxfgfDmList, skplx)));
    } else {
      setSbwzData([]);
    }
  }

  // 字段分割符触发生成备注示例
  const zfxfgfChange = () => {
    gtChangeMethod(gridData, fpbzzdxfgfDmList, fpbzdtsjfgfDmList, skplx);
  }

  // 字段项换行触发生成备注示例
  const zdxhhChange = () => {
    gtChangeMethod(gridData, fpbzzdxfgfDmList, fpbzdtsjfgfDmList, skplx);
  }

  // 多条数据分割符触发生成备注示例
  const dtsjfgfChange = () => {
    gtChangeMethod(gridData, fpbzzdxfgfDmList, fpbzdtsjfgfDmList, skplx);
  }

  // 多条报关单截取规则（从后截取)触发生成备注示例
  const jqgzInputChange = () => {
    gtChangeMethod(gridData, fpbzzdxfgfDmList, fpbzdtsjfgfDmList, skplx);
  }

   // 原币外币兑换人民币标志切换发生成备注示例
   const ybwbdhrmbbzChange = () => {
    gtChangeMethod(gridData, fpbzzdxfgfDmList, fpbzdtsjfgfDmList, skplx);
  }

  // 报关单数据项列选择
  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      console.log(selectedRowKeys);
      console.log(selectedRows);
      const index = selectedRows.findIndex((item: any) => item.fpbzywzdywm === 'DJBH');
      console.log(index)
      if(qdfp === '5' && fpkjfsDm === '1' && index < 0){
        message.info('单据号为必选项') 
      } else {
        setSelectionRowKeys(selectedRowKeys);
        setSelectionRows(selectedRows);
        // 选中的列表
        const ztArray: any = []
        gridData.forEach((row: any) => {
          if (selectedRowKeys.indexOf(row.fpbzywzdDm) > -1) {
            row.xzbz2 = 'Y';
          } else {
            row.xzbz2 = 'N';
          }
          ztArray.push(row);
        });
        setGridData(ztArray);
        gtChangeMethod(ztArray, fpbzzdxfgfDmList, fpbzdtsjfgfDmList, skplx);
      }
    }
  };

  // 单条数据示例
  const simpleData = () => {
    setDtsjFlag(false);
  };

  // 多条数据示例
  const moreData = () => {
    setDtsjFlag(true);
  }

  useEffect(() => {
    gtChangeMethod(gridData, fpbzzdxfgfDmList, fpbzdtsjfgfDmList, skplx);
  }, [dtsjFlag]);

  // 保存密码
  const handleSave1 = async () => {
    const ss = await form.validateFields();
    const newData = [...gridData];
    // 给业务字段项增加更新序号
    newData.forEach((temp: any, index: any) => {
      temp.gxxh = index + 1;
    });
    console.log(newData);
    // 获取基本数据项设置
    let formValues = form.getFieldsValue();
    formValues.ywzdglpzVoList = newData;
    bzglwh(formValues).then((response) => {
      const { code, desc,msg } = response;
      setMasker(false);
      if (code === '200') {
        message.success(intl.formatMessage({ id: 'message_ckfp_fppz_common_save_success' }));
      } else {
        message.error(msg);
      }
    })
  }

  // 示例卡片标题tooltip
  const tooltip = <>
    {/* <div className="bzgl_right_main_content">1.税控盘备注超过4行不换行，在一行显示;</div>
    <div className="bzgl_right_main_content">2.金税盘备注超过6行不换行，在一行显示;</div>
    <div className="bzgl_right_main_content">3.税控盘普通发票备注栏允许录入138个字符，电子普票130个字符;</div>
    <div className="bzgl_right_main_content">4.金税盘备注栏允许录入230个字符;</div>
    <div className="bzgl_right_main_content">5.税务ukey规则同税控盘规则{qdfp === '5' ? ';' : '。'}</div>
    {qdfp != '5' && <div className="bzgl_right_main_content">6.本平台中，一个汉字占3个字符。</div>}
    {qdfp === '5' && <><div className="bzgl_right_main_content">6.数电票备注栏允许录入230个字符。</div><div className="bzgl_right_main_content">7.本平台中，一个汉字占3个字符。</div></>} */}
  
    <div className="bzgl_right_main_content">1.数电票备注栏允许录入230个字符。</div>
    <div className="bzgl_right_main_content">2.本平台中，一个汉字占1个字符。</div>

  </>;

  // 示例卡片
  const cardSl = <>
    <div className="bzgl_right_main">
      {sbwzData}{bzData}
    </div>
  </>;

  // 基本数据项卡片
  const cardJbsjx = <>
    <Form form={form} name="bzgl_form" labelCol={{ span: 9 }} wrapperCol={{ span: 14 }} >
      <Form.Item label="首部文字" name="fpbzsbwz">
        <Input onChange={inputChange} />
      </Form.Item>
      <Form.Item label="字段项分割符" name="fpbzzdxfgfDm">
        <Select onChange={zfxfgfChange}>
          {fpbzzdxfgfDmList.map((item: any) => {
            return <Select.Option key={item.fpbzzdxfgfDm} value={item.fpbzzdxfgfDm}>{item.fpbzzdxfgfmc}</Select.Option>
          })}
        </Select>
      </Form.Item>
      <Form.Item label="字段项换行" name="fpbzzdxhhbz" >
        <Select onChange={zdxhhChange}>
          <Select.Option value="Y">是</Select.Option>
          <Select.Option value="N">否</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="多条数据分割符" name="fpbzdtsjfgfDm" >
        <Select onChange={dtsjfgfChange}>
          {fpbzdtsjfgfDmList.map((item: any) => {
            return <Select.Option key={item.fpbzdtsjfgfDm} value={item.fpbzdtsjfgfDm}>{item.fpbzdtsjfgfmc}</Select.Option>
          })}
        </Select>
      </Form.Item>
      <Form.Item label={<>
        关单截取规则 <Tooltip title='多条报关单截取规则（从后截取）'>
          <QuestionCircleOutlined style={{ marginLeft: "5px", cursor: "pointer" }} />
        </Tooltip>
      </>} name="fpbzgdjqws">
        <InputNumber min={4} max={18} onChange={jqgzInputChange} />
      </Form.Item>
      <Form.Item label={<>
        原币外币兑换人民币标志 <Tooltip title='发票备注中原币汇率是否除以100显示'>
          <QuestionCircleOutlined style={{ marginLeft: "5px", cursor: "pointer" }} />
        </Tooltip>
      </>} name="ybwbdhrmbbz" >
        <Select onChange={ybwbdhrmbbzChange}>
          <Select.Option value="Y">是</Select.Option>
          <Select.Option value="N">否</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label={<>
        发票备注长度设置 <Tooltip title='请按照开票系统支持最大字段长度设置'> {/* 设置此项后发票备注长度以此参数为准 */}
          <QuestionCircleOutlined style={{ marginLeft: "5px", cursor: "pointer" }} />
        </Tooltip>
      </>} name="fpbzcdsz" rules={[ { type: 'base_number', range: '+'}]}>
        <Input/>
      </Form.Item>
    </Form>
  </>;

  // 行编辑数据保存
  const handleSave = (row: any) => {
    const newData = [...gridData];
    const index = newData.findIndex((item) => row.fpbzywzdDm === item.fpbzywzdDm);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    gtChangeMethod(newData, fpbzzdxfgfDmList, fpbzdtsjfgfDmList, skplx);
    setGridData(newData);
  };

  // 编辑列格式化
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

  // 隐藏列
  const myColumns1 = myColumns.filter((col: any) => {
    return (!(col.hidden && col.hidden !== false));
  })

  // 业务字段项卡片
  const cardYwzdx = <>
    <Table
      dataSource={gridData}
      pagination={false}
      components={{
        body: {
          row: EditableRow,
          cell: EditableCell,
        },
      }}
      scroll={{ x: '550px', y: `${document.documentElement.clientHeight - 255}px` }}
      rowSelection={{
        selectedRowKeys: selectionRowKeys,
        type: 'checkbox',
        ...rowSelection,
      }}
      rowKey='fpbzywzdDm'
      columns={myColumns1}
    />
  </>;

  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <div className="lay_wrap_bzgl" key={sx}>
        <ProCard split='vertical' >
          <ProCard headerBordered
            colSpan={{ xs: 14, sm: 14, md: 16, lg: 16, xl: 16, xxl: 14 }}
            tabs={{
              type: 'card',
              tabBarExtraContent: <span style={{ marginRight: "10px" }}>
                <Space>
                  <Button onClick={handleSave1} type='link'>保存</Button>
                </Space>
              </span>
            }}>
            <ProCard.TabPane key="tab2" tab="业务字段项">
              {cardYwzdx}
            </ProCard.TabPane>
            <ProCard.TabPane key="tab1" tab="基本数据项" forceRender>
              {cardJbsjx}
            </ProCard.TabPane>
          </ProCard>
          <ProCard split='horizontal' colSpan={{ xs: 10, sm: 10, md: 8, lg: 8, xl: 8, xxl: 10 }}>
            <ProCard headerBordered
              tabs={{
                type: 'card',
                tabBarExtraContent: <span style={{ marginRight: "10px" }}>
                  <Space>
                    <Button onClick={simpleData} type='link' disabled={!dtsjFlag}>单条数据</Button>
                    <Button onClick={moreData} type='link' disabled={dtsjFlag}>多条数据</Button>
                  </Space>
                </span>
              }}>
              <ProCard.TabPane tab="备注示例">
                {cardSl}
              </ProCard.TabPane>
            </ProCard>
            <ProCard title="备注字段说明" headerBordered>
              {tooltip}
            </ProCard>
          </ProCard>
        </ProCard>
      </div >
    </Spin >
  );
};
export default Bzgl;
