import React, { useImperativeHandle,useEffect, useState } from 'react';
import { message, Button, Select, Form, Tree, Spin, Drawer } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import '@/pages/hts/commonModule/style.less';
import { glcd, cxQxzQdcdlb } from '@/pages/hts/services/htsApi';
import ProCard from '@ant-design/pro-card';
import myUtil from '@/components/DDAssist/util';

export interface DDTsort {
  onRef?: any;
  visible?: any;
}

const pbcd: React.FC<DDTsort> = ({ onRef, visible = false }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [form] = Form.useForm();
  const [masker, setMasker] = useState<boolean>(false);
  const [mainRef, setMainRef] = useState<any>({}); //主页面的ref
  const [treeData, setTreeData] = useState<any>([]);
  const [sfgl, setSfgl] = useState<any>('N');
  const [qxzDm, setQxzDm] = useState<any>();
  //树节点
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [checkedNodes, setCheckedNodes] = useState<React.Key[]>([]);
  
  
  // 开启
  const showModal = (param: any, flag: any) => {
    setMainRef(param);
    setQxzDm(param.selectionRowKeys[0]);
    setModalVisible(true);
    // 表单初始化
    initForm(param, flag);
  };


  // useImperativeHandle
  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 表单初始化
  const initForm = async (param: any, flag: any) => {
    setMasker(true);
    const param2 = {"qxlx":"1","qxzDm":param.selectionRowKeys[0],"sfgl":sfgl};
    await cxQxzQdcdlb(param2).then((response: any) => {
      setMasker(false);
      if (response.code === '200') {
        setTreeData(response.body);
      } else {
        message.error(response.msg);
      }
    });
    
    
  };


  useEffect(() => {
    let expandedKeys: any = [];
    let checkedKeys: any = [];
    function treeRecursive(data: any) {
      data?.forEach((item: any) => {
        if (item.checked == true) {
          checkedKeys.push(item.id);
        }
        if (item.children && item.children?.length > 0) {
          treeRecursive(item.children);
        } else {
          if (item.checked == true) {
            checkedKeys.push(item.id);
          }
        }
        expandedKeys.push(item.id);
      })
    };
    treeRecursive(treeData);
    setExpandedKeys(expandedKeys);
    setCheckedKeys(checkedKeys);
    setCheckedNodes(checkedKeys);

  }, [treeData]);

  // tree 展开/关闭节点事件
  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
  };
  // tree 勾选节点事件
  const onCheck = async(checkedKeysValue: any, e: any) => {
    if(e.checked){
     let nodes =  [...checkedNodes];
     nodes.push(e.node.cdDm);
     setCheckedNodes(nodes);
    }else{
      let nodes =  [...checkedNodes];
      let element = e.node.cdDm;
      nodes = nodes.filter(item => item != element)
      setCheckedNodes(nodes);
    }
    setCheckedKeys(checkedKeysValue.checked);
  };

  const close = () => {
    form.resetFields();
    setModalVisible(false);
    setMainRef({});
    setTreeData([]);
    setSfgl('N');
    setQxzDm([]);
    setExpandedKeys([]);
    setCheckedKeys([]);
    setCheckedNodes([]);
    // mainRef.unitRef.current!.reload2();
  }

  const handleChange = async (param :any) => {
    setMasker(true);
    const param2 = {"qxlx":"1","qxzDm":qxzDm,"sfgl":param};
    await cxQxzQdcdlb(param2).then((response: any) => {
      setMasker(false);
      if (response.code === '200') {
        setTreeData(response.body);
      } else {
        message.error(response.msg);
      }
    })
    setSfgl(param);
  }

  const saveTree = async () => { 
    // if (checkedNodes.length <= 0) {
    //   message.info("未作任何修改，无需保存！");
    //   return;
    // }
    setMasker(true);
    const param = {
      "qxlx": "1",
      cdDms: checkedNodes,
      sfgl:sfgl,
      qxzDm:qxzDm
    };
    await glcd(param).then((response: any) => {
      setMasker(false);
      if (response.code === '200') {
        message.success('保存成功！');
        close();
      } else {
        message.error(response.msg);
      }
    });
  }




  return (
    <>
      <Drawer
        title="关联菜单"
        visible={modalVisible}
        onClose={() => { close() }}
        width={CONSTANTS.C_MODAL_WIDTH_X2}
        destroyOnHidden={true}
        className="dd_data_page_modal"
        mask={{ closable: false }}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <ProCard actions={[<Button type='primary' onClick={saveTree}>保存</Button>]}>
            <Select
              defaultValue={sfgl}
              style={{ width: 120 }}
              onChange={handleChange}
              options={[
                { value: '', label: '全部' },
                { value: 'Y', label: '已关联' },
                { value: 'N', label: '未关联' },
              ]}
            />
            <br/><br/>
            <Tree
              showLine
              checkable
              checkStrictly={true}
              fieldNames={{
                title: 'title',
                key: 'id',
                children: 'children'
              }}
              treeData={treeData}
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              defaultExpandedKeys={checkedKeys}
              height={myUtil.heightCalc.getCalc(['header', 'cardMargin', '95px'])}
            />
          </ProCard>
        </Spin>
      </Drawer>
    </>
  );
}

export default pbcd;