import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { message, Drawer, Button, Space, Spin, Tree } from 'antd';
import myUtil from '@/components/DDAssist/util';
import { saveRoleMenu, queryList, getMenuByRole } from '@/services/hts/api';
import { difference } from 'lodash';

export interface BdjgProps {
  onRef?: any;
}

const DrawerList: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [roleRecord, setRoleRecord] = useState<any>({});
  const [parentParam, setParentParam] = useState<any>({});
  const [masker, setMasker] = useState<any>(false);
  const [treeData, setTreeData] = useState<any>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);

  // 开启
  const showModal = (param: any) => {
    let { roleId } = param?.record;
    setRoleRecord(param?.record || {});
    setParentParam(param);
    getJsCdTree(roleId);
    setModalVisible(true);
  };

  // useImperativeHandle
  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // tree 展开/关闭节点事件
  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
  };

  // tree 勾选节点事件
  const onCheck: any = (checkedKeysValue: any, e: any) => {
    let { checked = [], halfChecked = [] } = checkedKeysValue;
    let isChecked = e?.checked;
    // 获取所有上级节点
    let aa = myUtil.tree.findAllAncestorIds(treeData, e.node.menuId, 'menuId', 'children');
    // 获取所有下级节点
    let cc: any = myUtil.tree.findAllDescendantIds(treeData, e.node.menuId, 'menuId', 'children');
    let checkedKeyTmp: any;
    if (isChecked) {
      checkedKeyTmp = checked.concat(halfChecked).concat(aa).concat(cc);
    } else {
      checkedKeyTmp = difference(checkedKeys, cc);
    }
    setCheckedKeys(checkedKeyTmp);
  };

  // 保存树菜单数据
  const saveTree = async () => {
    const param = {
      roleIds: [roleRecord.roleId],
      menuIds: checkedKeys,
    };
    setMasker(true);
    saveRoleMenu(param).then((res: any) => {
      setMasker(false);
      const { code, msg } = res;
      if (code === '200') {
        message.success("保存成功！");
        setModalVisible(false);
      } else {
        message.error(msg);
      }
    })
  };

  // setTree
  const setTree: any = (tree: any) => {
    let expandedKeys: any = [];
    const treeRecursive = (data: any) => {
      data?.forEach((item: any) => {
        if (item?.children?.length > 0) {
          expandedKeys.push(item.menuId);
          treeRecursive(item.children);
        }
      })
    };
    treeRecursive(tree);
    setExpandedKeys(expandedKeys);
  }

  // 获取菜单数据
  const getJsCdTree = (roleId: any) => {
    setMasker(true);
    let treeDateTmp: any;
    queryList({page: 1, pageSize: 999999, searchModel: []}, 'm_sys_menu').then((res: any) => {
      setMasker(false);
      const { code, msg, body } = res;
      if (code === '200') {
        // 数组转树形结构
        treeDateTmp = myUtil.tree.transformArrToTree(body?.rows, '', {
          idName: 'menuId',
          parentIdName: 'menuParentId',
          childrenName: 'children'
        });
        // 设置叶子节点属性的回调函数
        let setLeafProperty = (node: any) => {
          node.isLeaf = true;
        }
        treeDateTmp = (myUtil.tree.setTreeProps(treeDateTmp, setLeafProperty)).children;
        setTreeData(treeDateTmp);
        setTree(treeDateTmp);
      } else {
        message.error(msg)
      }
      return getMenuByRole({roleId});
    }).then((response2: any) => {
      if (response2?.code === '200') {
        let tmpMenuObjs: any = response2.body || [];
        let tmpMenuIds: any = [];
        tmpMenuObjs.forEach((item: any) => {
          if (item?.menuId) {
            // let currentMenu: any = myUtil.tree.findNodeInTree({tree: treeDateTmp, targetId: item?.menuId, idText: 'menuId'});
            // // 判断是否为叶子节点，设置tree组件选中，只需要传入叶子节点 （tree组件受控状态）
            // if (currentMenu.isLeaf) {
            tmpMenuIds.push(item.menuId);
            // }
          }
        })
        setCheckedKeys(tmpMenuIds);
      }
    });
  };

  return (
    <Drawer
      title={`${roleRecord?.roleName || ''} 角色菜单`}
      open={modalVisible}
      onClose={() => {setModalVisible(false)}}
      size={CONSTANTS.C_MODAL_WIDTH_X2}
      destroyOnHidden={true}
      className="dd_modal_bg"
      extra={<Space>
        <Button type='primary' onClick={saveTree}>保存</Button>
      </Space>}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <Tree
          checkStrictly
          checkable
          showLine
          blockNode
          onCheck={onCheck}
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          checkedKeys={checkedKeys}
          className='treeCd'
          treeData={treeData}
          height={myUtil.heightCalc.getCalc(['header', 'cardMargin', '103px'])}
          fieldNames={{ key: 'menuId', title: 'menuName', children: 'children' }}
          titleRender={(nodeData: any) => <Space>
            <span>{nodeData.menuName}</span>
          </Space>}
        />
      </Spin>
    </Drawer>
  );
};

export default DrawerList;
