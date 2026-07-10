import React, {useEffect, useImperativeHandle, useState} from 'react';
import { Button, Drawer, Form, message, Select, Spin, Tree} from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import '@/pages/hts/commonModule/style.less';
import {cxCdfzCdlb, glcdfzcd } from '@/pages/hts/services/htsApi';
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
  const [sfgl, setSfgl] = useState<any>('');
  const [fzuuid, setFzuuid] = useState<any>();
  //树节点
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [checkedNodes, setCheckedNodes] = useState<React.Key[]>([]);

  // 开启
  const showModal = (param: any, flag: any) => {
    setMainRef(param);
    setFzuuid(param.selectionRowKeys[0]);
    initForm(param, flag);
    setModalVisible(true);
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
    const param2 = {"fzuuid":param.selectionRowKeys[0],"sfgl":sfgl};
    await cxCdfzCdlb(param2).then((response: any) => {
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
      data.forEach((item: any) => {
        if (item.children && item.children.length > 0) {
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
    mainRef.refUnit.current!.reload();
  }

  const handleChange = async (param :any) => {
    setMasker(true);
    const param2 = {"fzuuid":fzuuid,"sfgl":param};
    await cxCdfzCdlb(param2).then((response: any) => {
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
    setMasker(true);
    const param = {
      cdDms: checkedNodes,
      sfgl:sfgl,
      fzuuid:fzuuid
    };
    await glcdfzcd(param).then((response: any) => {
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
        open={modalVisible}
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
              height={myUtil.heightCalc.getCalc(['header', 'cardMargin', '95px'])}
              className='treeCd'
            />
          </ProCard>
        </Spin>
      </Drawer>
    </>
  );
}

export default pbcd;
