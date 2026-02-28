import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { message, Drawer, Button, Space, Spin, Transfer } from 'antd';
import { setUserRole, getRoleByUser } from '@/services/hts/api';
import type { TransferProps } from 'antd';
import { queryList } from '@/services/hts/api';
import myUtil from '@/components/DDAssist/util';

export interface BdjgProps {
  onRef?: any;
}

const DrawerList: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [userRecord, setUserRecord] = useState<any>({});
  const [parentParam, setParentParam] = useState<any>({});
  const [masker, setMasker] = useState<any>(false);
  const [dataSource, setDataSource] = useState<any>([]);
  const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>([]);
  const [selectedKeys, setSelectedKeys] = useState<TransferProps['targetKeys']>([]);

  // 开启
  const showModal = (param: any) => {
    let { userId } = param?.record;
    setUserRecord(param?.record || {});
    setParentParam(param);
    queryList({page: 1, pageSize: 999999, searchModel: []}, 'm_sys_role').then((response) => {
      if (response?.code === '200' && response?.body?.rowCount > 0) {
        setDataSource(response?.body.rows);
        // setTargetKeys(roleId?.split(',') || []);
      }
      return getRoleByUser({userId});
    }).then((response2: any) => {
      if (response2?.code === '200') {
        let tmpRoleObjs: any = response2.body || [];
        let tmpRoleIds: any = [];
        tmpRoleObjs.forEach((item: any) => {
          if (item?.roleId) {
            tmpRoleIds.push(item.roleId);
          }
        })
        // tmpRoleIds = ['02a07b5d2e5d2a61ba21e973e89897ed', '7c4cb5599c642eee06f7ba8e94c313cb'];
        setTargetKeys(tmpRoleIds);
      }
    });
    setModalVisible(true);
  };

  // 保存角色
  const saveRole = () => {
    let apiParam: any = {
      userIds: [userRecord.userId],
      roleIds: targetKeys,
    };
    setMasker(true);
    setUserRole(apiParam).then((response) => {
      setMasker(false);
      const { code } = response;
      if (code === '200') {
        message.info('角色绑定成功');
        setModalVisible(false);
        parentParam.refGrid.current?.reload();
      }
    })
  }

  // onChange
  const onChange: TransferProps['onChange'] = (nextTargetKeys, direction, moveKeys) => {
    // setTargetKeys(moveKeys);
    setTargetKeys(nextTargetKeys);
  };

  // onSelectChange
  const onSelectChange: TransferProps['onSelectChange'] = (
    sourceSelectedKeys,
    targetSelectedKeys,
  ) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  // useImperativeHandle
  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Drawer
      title={`${userRecord?.userName || ''} 角色列表`}
      open={modalVisible}
      onClose={() => {setModalVisible(false)}}
      size={CONSTANTS.C_MODAL_WIDTH_X2}
      destroyOnHidden={true}
      className="dd_modal_bg"
      extra={<Space>
        <Button type='primary' onClick={saveRole}>保存</Button>
      </Space>}
    >
      <Spin description="Loading..." spinning={masker} delay={100}>
        <Transfer
          rowKey={(record: any) => record.roleId}
          dataSource={dataSource}
          styles={{
            section : {
              width: '50%',
              height: 400,
            },
          }}
          titles={['待选角色', '已选角色']}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={onChange}
          onSelectChange={onSelectChange}
          render={(item) => item.roleName}
        />
      </Spin>
    </Drawer>
  );
};

export default DrawerList;
