import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '../../../../components/DDAssist/constants';
import { message, Drawer, Button, Space, Spin, Tree } from 'antd';
import myUtil from '../../../../components/DDAssist/util';
import { saveRoleMenuNs, queryListNs } from '@/services/hts/apiNs'
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
    let { role_id } = param?.record;
    setRoleRecord(param?.record || {});
    setParentParam(param);
    getJsCdTree(role_id);
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
  const onCheck: any = async (checkedKeysValue: any, e: any) => {
    let { checked = [], halfChecked = [] } = checkedKeysValue;
    let isChecked = e?.checked;
    // 获取所有上级节点
    let aa = myUtil.tree.findAllAncestorIds(treeData, e.node.menu_id, 'menu_id', 'children');
    // 获取所有下级节点
    let cc: any = myUtil.tree.findAllDescendantIds(treeData, e.node.menu_id, 'menu_id', 'children');
    let checkedKeyTmp: any;
    if (isChecked) {
      checkedKeyTmp = checked.concat(halfChecked).concat(aa).concat(cc);
    } else {
      checkedKeyTmp = difference(checkedKeys, cc);
    }
    const checkedKeyTmp2: any = [...new Set(checkedKeyTmp)];
    setCheckedKeys(checkedKeyTmp2);
  };

  // 保存树菜单数据
  const saveTree = async () => {
    const param = {
      roleId: roleRecord. role_id,
      menuIds: checkedKeys,
    };
    setMasker(true);
    saveRoleMenuNs(param).then((res: any) => {
      setMasker(false);
      const { code } = res;
      myUtil.modal.responseInfo(res);
      if (code === '200') {
        setModalVisible(false);
      }
    })
  };

  // setTree
  const setTree: any = (tree: any) => {
    let expandedKeys: any = [];
    const treeRecursive = (data: any) => {
      data?.forEach((item: any) => {
        if (item?.children?.length > 0) {
          expandedKeys.push(item.menu_id);
          treeRecursive(item.children);
        }
      })
    };
    treeRecursive(tree);
    setExpandedKeys(expandedKeys);
  }

  // 获取菜单数据
  const getJsCdTree = (role_id: any) => {
    setMasker(true);
    queryListNs({page: 1, pageSize: 999999, searchModel: []}, 'sys_menu').then((res: any) => {
      setMasker(false);
      const { code, msg, body } = res;
      if (code === '200') {
        // 数组转树形结构
        let treeDateTmp = myUtil.tree.transformArrToTree(body?.rows, '', {
          idName: 'menu_id',
          parentIdName: 'menu_parent_id',
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
      return queryListNs({page: 1, pageSize: 999999, searchModel: [{
        op: CONSTANTS.FILTER_CONDITION.equal.condetionCode,
        property: 'role_id',
        value: role_id,
      }]}, 'sys_menu_role_rel');
    }).then((response2: any) => {
      if (response2?.code === '200') {
        let tmpMenuObjs: any = response2?.body?.rows || [];
        let tmpMenuIds: any = [];
        tmpMenuObjs.forEach((item: any) => {
          if (item?.menu_id) {
            tmpMenuIds.push(item.menu_id);
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
      <Spin description="Loading..." spinning={masker} delay={100}>
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
          fieldNames={{ key: 'menu_id', title: 'menu_name', children: 'children' }}
          titleRender={(nodeData: any) => <Space>
            <span>{nodeData.menu_name}</span>
          </Space>}
        />
      </Spin>
    </Drawer>
  );
};

export default DrawerList;
