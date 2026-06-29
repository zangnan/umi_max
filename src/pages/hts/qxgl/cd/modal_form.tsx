import React, { useState, useImperativeHandle, useEffect } from 'react';
import { Form, Input, Select, Popconfirm, Table, Typography, Modal, Button, Spin, message } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import { queryPager, saveCdQxzCyhly } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';




interface Item {
  key: string;
  qxzDm: string;
  cdlj: number;
  bz: string;
  yxbz:string;
  selectParam:any;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: '1' | '2';
  record: Item;
  index: number;
  selectParam:any;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  selectParam,
  ...restProps
}) => {
  const inputNode = inputType === '1' ? <Select  options={[{ value: 'lucy', label: 'Lucy' }]}/> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        inputType === '1'?
        <Form.Item
        name={dataIndex}
        style={{ margin: 0 }}
        rules={[
          {
            required: true,
            message: `Please Input ${title}!`,
          },
        ]}
      >
        <Select>
          {selectParam?.map((item: any) => (
             <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
          ))}
        </Select>
      </Form.Item> 
      :
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};


export interface DDExportProps {
  onRef?: any;
  visible?: any;
}
const App: React.FC<DDExportProps> = ({
  onRef,
  visible = false,
}) => {
  const [form] = Form.useForm();
  const [data, setData] = useState<any>([]);
  const [editingKey, setEditingKey] = useState('');
  const [masker, setMasker] = useState(false);  // 蒙版
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [cdmc, setCdmc] = useState(false);  // 蒙版
  const [dms, setDms] = useState(false);  // 蒙版
  const [selectJs, setSelectJs] = useState<any>([]);
  const [yxbz, setYxbz] = useState<any>([]);

  // 开启
  const showModal = async (dm: any, cdmc: any) => {
    Promise.all([myUtil.code.getCodeFromServerT1('CODE_DM_ZXSB_QXZ:01')]).then(() =>  {
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      const tempCode = myUtil.code.getCode('CODE_DM_ZXSB_QXZ:01');
      setSelectJs(tempCode);
    });
    const yes = myUtil.code.getCode('code_static_yes_no:01');
    setYxbz(yes);
    setDms(dm);
    setCdmc(cdmc);
    setModalVisible(true);
    const param = { "searchModel": [{ "property": "cdDm", "value": dm, "op": "zdy" }], "orderModel": [], "headerSearchModel": [], "key": "CX_SAAS_QXGL_CDQXZGL", "pageSize": 100000, "page": 1 };
    await queryPager(param).then((res: any) => {
      setMasker(false);
      const { code, msg, body } = res;
      if (code == '200') {
        setData(body?.rows);
      } else {
        message.error(msg)
      }
    });
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });


  const handleAdd = (data2: any) => {
    const par = { "cdmc": cdmc, "qxzDm": "",  "qxzMc": "","cdlj": "", "yxbz": "", "bz": "" ,"key":uuid()};
    const newArr = [...data2];
    newArr.push(par);
    setData(newArr);
  }
  const handleSave = async () => {
    const param = {cdDm:dms,cyhlyList:[...data]}
    await saveCdQxzCyhly(param).then((res: any) => {
      setMasker(false);
      const { code, msg,} = res;
      if (code == '200') {
        message.success("保存成功！");
        setModalVisible(false);
      } else {
        message.error(msg)
      }
    });

  }
  

  const isEditing = (record: Item) => record.key === editingKey;
  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ "cdmc": cdmc, "qxzDm": "","qxzMc":'', "cdlj": "", "yxbz": "", "bz": "", ...record });
    setEditingKey(record.key);
  };
  const del = (record: Partial<Item> & { key: React.Key }) => {
    const key = record?.key;
    let data2 = [...data];
    const newData :any = []; 
    for(let i=0;i<data2.length;i++){
      if(data2[i].key != key){
        newData.push(data2[i]);
      }
    }
    setData(newData);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;
      let newData = [...data];
      const tempCode = myUtil.code.getCode('CODE_DM_ZXSB_QXZ:01');
      let index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        let item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        for(let i=0;i<tempCode.length;i++){
          if(tempCode[i].code == newData[index].qxzDm){
            newData[index].qxzMc = tempCode[i].name;
          }
        }
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    { title: '菜单名称', dataIndex: 'cdmc', width: '15%', ellipsis: true , fixed: 'left'},
    { title: '权限组代码', inputType:'1',dataIndex: 'qxzDm', width: '15%', editable: true, ellipsis: true, selectParam:selectJs },
    { title: '权限组名称', inputType:'1',dataIndex: 'qxzMc', width: '15%', ellipsis: true },
    { title: '菜单路径', dataIndex: 'cdlj', width: '15%', editable: true, ellipsis: true },
    { title: '备注', dataIndex: 'bz', width: '15%', editable: true, ellipsis: true },
    { title: '有效标志',inputType:'1', dataIndex: 'yxbz', width: '10%', editable: true, ellipsis: true ,selectParam:yxbz},
    {
      title: '操作', align: 'center',
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              确认
            </Typography.Link>
            <Popconfirm title="确定取消?" onConfirm={cancel}>
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link onClick={() => edit(record)}>
              编辑
            </Typography.Link>&nbsp;&nbsp;
            <Typography.Link onClick={() => del(record)}>
              删除
            </Typography.Link>
           </>
        );
      },
    },
  ];



  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === 'qxzDm' || col.dataIndex === 'yxbz' ? '1' : 'text',
        dataIndex: col.dataIndex,
        selectParam:col.selectParam,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });


  function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 32; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23];
    var uuid = s.join("");
    return uuid;
  };



  return (
    <Modal
      wrapClassName='standard-modal-1'
      title='差异化路由'
      visible={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      onCancel={() => setModalVisible(false)}
      footer={(<>
        {/* <Button onClick={() => save()} type="primary">保存</Button> */}
        <Button onClick={() => setModalVisible(false)} type="default">关闭</Button>
      </>)}
    >

      <Spin tip="Loading..." spinning={masker} delay={100}>
        <Button onClick={() => handleAdd(data)} type="primary" style={{ marginBottom: 16 }}>
          新增
        </Button>
        &nbsp;&nbsp;&nbsp;
        <Button onClick={() => handleSave()} type="primary" style={{ marginBottom: 16 }}>
          保存
        </Button>
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={data}
            columns={mergedColumns}
            pagination={false}
          />
        </Form>
      </Spin>
    </Modal>

  );
};

export default App;
