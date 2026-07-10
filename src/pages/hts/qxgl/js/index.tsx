/**
 * title: 角色管理
 * author: wx
 */
import React, { useEffect, useState, useRef } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config from './config';
import Func from './f'
import ProCard from '@ant-design/pro-card';
import { Tree, message, Spin, Button } from 'antd';
import { queryJsCdTree, saveJsCdGx } from '@/pages/hts/services/htsApi';
import ModalForm from './modal_form';
import ModalGlyh from './modal_glyh';
import myUtil from '@/components/DDAssist/util';
import '../style.less';
import DDAlert from '@/pages/hts/components/DDAlert';
import { intl as intl2 } from '@/components/DDAssist/util';
import { deleteJs } from '@/pages/hts/services/htsApi';


const index: React.FC<unknown> = () => {

  const modalRef: any = useRef();
  const modalGlyhRef: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(modalRef);
    otherRef.push(modalGlyhRef);
    return otherRef;
  };

  const [masker, setMasker] = useState(false);
  const [treeData, setTreeData] = useState<any>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [jsDm, setJsDm] = useState<any>('');
  const [checkedNodes, setCheckedNodes] = useState<React.Key[]>([]);

  useEffect(() => {
    let expandedKeys: any = [];
    let checkedKeys: any = [];
    function treeRecursive(data: any) {
      data.forEach((item: any) => {
        if (item.spread == true) {
          expandedKeys.push(item.id);
        }
        if (item.children && item.children.length > 0) {
          treeRecursive(item.children);
        } else {
          if (item.checkedStr == 'true') {
            checkedKeys.push(item.id);
          }
        }
      })
    };
    treeRecursive(treeData);
    setExpandedKeys(expandedKeys);
    setCheckedKeys(checkedKeys);
  }, [treeData]);

  // tree 展开/关闭节点事件
  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
  };
  // tree 勾选节点事件
  const onCheck = async (checkedKeysValue: React.Key[], e: any) => {
    const checkedNodes = checkedKeysValue.concat(e.halfCheckedKeys);
    setCheckedKeys(checkedKeysValue);
    setCheckedNodes(checkedNodes);
  };


  // 递归过滤函数
  function filterTree(nodes :any, ids :any,wgxcdDms:any) {
    return nodes.filter(node => {
      if (!ids.includes(node.id)) {
        wgxcdDms.push(node.id);
      }
      if (node.children) {
        node.children = filterTree(node.children, ids,wgxcdDms); 
        if (node.children.length === 0) {
          delete node.children; 
        }
      }
      return true; 
    });
  }

  // 保存树菜单数据
  const saveTree = async () => {
    if (checkedNodes.length <= 0) {
      message.info("未作任何修改，无需保存！");
      return;
    }
    if (!jsDm || jsDm == '') {
      message.info("请选择角色！");
      return;
    }
    let wgxcdDms: never[] = [];
    filterTree(treeData, checkedNodes,wgxcdDms);
    const param = {
      jsDm: jsDm,
      cdDms: checkedNodes,
      scCddms:wgxcdDms
    };
    setMasker(true);
    saveJsCdGx(param).then((res: any) => {
      setMasker(false);
      const { code, msg } = res;
      if (code == '200') {
        message.success("保存成功！");
      } else {
        message.error(msg);
      }
    })
  };
  const getJsCdTree = (jsDm: any) => {
    setMasker(true);
    queryJsCdTree({ jsDm: jsDm }).then((res: any) => {
      setMasker(false);
      const { code, msg, body } = res;
      if (code == '200') {
        setTreeData(body);
      } else {
        message.error(msg)
      }
    })
  };

  // 加载列表后查询菜单树
  Func.afterReload = (param: any) => {
    const { dataSource, refUnit } = param;
    let jsDm = '';
    if (dataSource && dataSource.length > 0) {
      jsDm = dataSource[0].jsDm;
      setJsDm(jsDm);
      if (dataSource.length > 0) {
        unitRef?.current?.setSelectionRowKeys([jsDm]);  // 设置SelectionRows
      }
    }else{
      setJsDm('');
    }
    getJsCdTree(jsDm);
  }

  Func.rowSelection = (param: any) => {
    const { selectedRows } = param;
    const jsDm = selectedRows[0]?.jsDm
    setJsDm(jsDm);
    getJsCdTree(jsDm);
    setCheckedNodes([]);
  }
  // 打开弹窗-删除角色
  Func.deleteJs = (param: any, event: any) => {
    event.stopPropagation();
    const { refUnit, record } = param;
    if (record.glyhs > 0) {
      message.info('该角色已关联用户，无法删除。如确需删除，请先将已关联的用户取消关联后，再进行删除的操作。');
    } else {
      DDAlert.open({
        title: '系统提示',
        info: intl2.formatMessage({ id: 'message_inquiry_delete' }),
        infoType: 'question',
        modalType: 'confirm',
        closeStatus: false,
        okCallbackFn: function (thisObj: any) {
          thisObj.setState({ masker: true });
          const params: any = {
            jsDms: [record.jsDm],
          };
          deleteJs(params).then((res: any) => {
            DDAlert.close();
            const { code, msg } = res;
            if (code == '200') {
              message.success("数据删除成功！");
              refUnit?.current!.reload();
            } else {
              message.error(msg)
            }
          })
        },
      });
    }
  };



  return <>
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <ProCard split="vertical">
        <ProCard colSpan="600px">
          <DDBunit2 config={config} func={Func} />
        </ProCard>
        <ProCard actions={[<Button type='primary' onClick={saveTree}>保存</Button>]}>
          <Tree
            showLine
            checkable
            treeData={treeData}
            fieldNames={{
              title: 'title',
              key: 'id',
              children: 'children'
            }}
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            height={myUtil.heightCalc.getCalc(['header', 'cardMargin', '95px'])}
            className='treeCd'
          />
        </ProCard>
      </ProCard>
    </Spin>
    <ModalForm onRef={modalRef} />
    <ModalGlyh onRef={modalGlyhRef} />
  </>
};

export default index;