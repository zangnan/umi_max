// 发票配置管理
import React, { useState, useEffect, useContext,useRef } from 'react';
import ProCard from '@ant-design/pro-card';
import { Typography, message, Menu, Layout, Spin, Modal, Table, Form, Input, Button, Checkbox} from 'antd';
import { FileOutlined } from '@ant-design/icons';
import { getZblx, queryFxzbByZbdm, saveFxzbByZbdm } from '@/pages/hts/services/htsApi';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import Func from './Func';
import config from './config';
// 复制
import { cloneDeep } from 'lodash';
import { FormInstance } from 'antd/es/form';

import { render } from 'react-dom';

const EditableContext = React.createContext(null);

const formList = new Set();


class EditableRow extends React.Component {
  constructor(props: any) {
    super(props);
  }
  formRef = React.createRef<FormInstance>();
  render() {
    if (this.formRef) {
      formList.add(this.formRef);
    }
    return (
      <Form ref={this.formRef} component={false}>
        <EditableContext.Provider value={this.formRef}>
          < tr {...this.props} />
        </EditableContext.Provider>
      </Form>
    )
  }
};


const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  editType,
  selectChange,
  index,
  addItem,
  dataLeft,
  ...restProps
}) => {
  const form: any = useContext(EditableContext);



  const save = async () => {
    const values = await form.current.validateFields();
    handleSave({ ...record, ...values }, values);
  };

  useEffect(() => {
    form.current.setFieldsValue(record);
  }, [record]);


  let childNode = children;
  if (editable) {
      childNode = <Form.Item name={dataIndex} style={{ margin: 0 }} >
        <Input onPressEnter={save} onBlur={save} />
      </Form.Item>;
  }

  return <td id={dataIndex} {...restProps}>{childNode}</td>;
};


export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
}



const Index: React.FC = () => {

  const { Sider, Content } = Layout;
  const [masker, setMasker] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [myConfig, setMyConfig] = useState<any>(config);
  const [modalVisible,setModalVisible ] = useState<any>(false);
  
  const [masker2, setMasker2] = useState<boolean>(false);
  const [dataLeft,setDataLeft ] = useState<any>([]);
  const [fxzbDm,setDxzbDm] = useState<any>();
  const [key,setKey] = useState<any>('1');

  
  useEffect(() => {
    setMasker(true);
    getZblx({}).then((res: any) => {
      setMasker(false);
      if (res.code === '200') {
        setData(res?.body);
      } else {
        message.error(res.msg);
      }
    });
  }, []);



  Func.fxms = (record :any) => {
    const obj = {
      tycs1:record.fxzbDm ,
      tycs:'1'
    };
    setMasker(true);
    queryFxzbByZbdm(obj).then((res: any) => {
      setMasker(false);
      if (res.code === '200') {
        setModalVisible(true);
        setDataLeft(res?.body);
        setDxzbDm(record.fxzbDm);
      } else {
        message.error(res?.msg);
      }
    });
  }
  

  const onclickMenu = (param: any) => {
    const config = cloneDeep(myConfig) ;
    const initSearchModal = [];
    if (param == 'all') {
      initSearchModal.push({ type: 1, property: "ydzbflDm", value: '', op: "zdy" });
      config.pagination2=true;
    } else {
      initSearchModal.push({ type: 1, property: "ydzbflDm", value: param, op: "zdy" });
      config.pagination2=false;
    }
    config.gridParams = { // 默认查询参数
      initSearchModal: initSearchModal,
    }
    var timestamp1 = new Date().getTime();
    setKey(timestamp1);
    setMyConfig(config);
  }



  const columns: any = [
    { title: '预警值名称', dataIndex: 'zbyjxmc', width: 180, align: 'left', ellipsis: true },
    { title: '条件', dataIndex: 'czfmc', width: 120, align: 'left' , ellipsis: true},
    { title: '预警值', dataIndex: 'yjxyjzsz', width: 120, align: 'left',editable: true, editType: 'Input', },
    { title: '计量单位', dataIndex: 'jldwmc', width: 120, align: 'left' , ellipsis: true},
    { dataIndex: 'sbqyuuid', width: 120, align: 'left' ,hidden:true },
    { dataIndex: 'zbyjxDm', width: 120, align: 'left' ,hidden:true  },
    { dataIndex: 'fxzbDm', width: 120, align: 'left' ,hidden:true   },
    { dataIndex: 'czfDm', width: 120, align: 'left' ,hidden:true    },
  ];

  // 隐藏列
  const myColumns = columns.filter((col: any) => {
    return (!(col.hidden && col.hidden !== false));
  })

  // 设置列
  const mergedColumns = myColumns.map((col: { editable: any; dataIndex: any; title: any; editType: any; }) => {
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
        handleSave: handleSave,
        index
      }),
    };
  });

  const close =()=>{
    setModalVisible(false);
  }

    // 文本框调整
  const handleSave = (param: any) => {
    const newData = [...dataLeft];
    const index = newData.findIndex((item) => param.sbqyuuid === item.sbqyuuid &&  param.zbyjxDm === item.zbyjxDm && param.fxzbDm === item.fxzbDm && param.czfDm === item.czfDm  );
    newData.splice(index, 1, param);
    setDataLeft(newData);
    
  };

  const saveView = ()=>{
    const newData = [...dataLeft];
    const obj = {
      tycsList:newData
    };
    setMasker2(true);
    saveFxzbByZbdm(obj).then((res: any) => {
      setMasker2(false);
      if (res.code === '200') {
        message.success('操作成功！');
        close();
        const unitRef = Func.unitRef;
        unitRef?.current?.reload2();
      } else {
        message.error(res?.msg);
      }
    });
  }

  const hfmr =()=>{
    let ccc: any = [];
    formList.forEach((item: any) => {
      if (item.current) {
        ccc.push(item);
      }
    })
    const obj = {
      tycs1:fxzbDm
    };
    setMasker2(true);
    queryFxzbByZbdm(obj).then((res: any) => {
      setMasker2(false);
      if (res.code === '200') {
        setDataLeft(res?.body);
        res?.body.forEach((element: any,index:any) => {
          const form1: any = ccc[index];
          form1.current.setFieldsValue(element);
        });
      } else {
        message.error(res?.msg);
      }
    });
  }


  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <Layout>
        <Sider style={{ height: "100%" }}>
          <ProCard style={{ position: "fixed", width: 200 }}>
            <Typography.Title level={5} >指标维度</Typography.Title>
            <Menu
              mode="vertical"
              style={{ marginRight: -20 }}
              defaultSelectedKeys={['all']}
            >
              <Menu.Item key='all' title='全部指标' style={{ marginLeft: -10 }} icon={<FileOutlined />} onClick={() => onclickMenu('all')}>
                <span>全部指标</span>
              </Menu.Item>
              {data?.map((item: any) => (
                <Menu.Item key={item.ydzbflDm} title={item.ydzbflmc} style={{ marginLeft: -10 }} icon={<FileOutlined />} onClick={() => onclickMenu(item.ydzbflDm)}>
                  <span>{item.ydzbfljc}</span>
                </Menu.Item>
              ))}
            </Menu>
          </ProCard>
        </Sider>
        <Content style={{ marginLeft: 20 }}>
          <DDBunit2 config={myConfig} func={Func} key={key}/> 
        </Content>
      </Layout>
      <Modal
        wrapClassName='standard-modal-4'
        title='阈值设置'
        visible={modalVisible}
        width={1200}
        destroyOnHidden={true}
        mask={{ closable: false }}
        onCancel={() => close()}
        footer={(
          <>
            <Button onClick={() => saveView()} type="primary">确定</Button>
            <Button onClick={() => close()}>关闭</Button>
          </>
        )}
      >
        <Spin tip="Loading..." spinning={masker2} delay={100}>
        <Button onClick={hfmr} type="primary" style={{float: 'right',marginBottom: 10}}>恢复默认</Button>
        <Table
          tableLayout='fixed'
          pagination={false}
          showSorterTooltip={true}
          bordered={true}
          columns={mergedColumns}       
          components={{
            body: {
              row: EditableRow,
              cell: EditableCell,
            }
          }}
          dataSource={dataLeft}
          size="small"
        />
        </Spin>
      </Modal>
    </Spin>
  );
};

export default Index;
