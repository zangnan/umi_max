import React, { useEffect, useState, useImperativeHandle } from 'react';
import { Drawer, List } from 'antd';
import myUtil from '../DDAssist/util';
import CONSTANTS from '../DDAssist/constants';
import { DeleteOutlined } from '@ant-design/icons';
import './style.less';
import { PageLoading } from '@ant-design/pro-layout';
import { cloneDeep } from 'lodash';

export type SchemeListProps = {
  visible?: any;
  onRef?: any;
  chooseScheme?: any;
  pageId?: any;
}

const SchemeList: React.FC<SchemeListProps> = ({
  visible = false,
  onRef,
  chooseScheme,
  pageId
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [gridData, setGridData] = useState<any>([]);

  // 删除
  const deleteScheme = (index: number) => {
    const viewId: string = pageId;
    const viewConfig: any = myUtil.localStore.getItem('view_config') || {};
    gridData.splice(index, 1);
    viewConfig[viewId] = gridData;
    myUtil.localStore.setItem('view_config', viewConfig);
    setGridData([].concat(gridData));
  }

  // 获取数据
  const getData = () => {
    const viewId: string = pageId;
    const viewConfig = myUtil.localStore.getItem('view_config') || {};
    const currentViewConfig = viewConfig[viewId] || [];
    setGridData(currentViewConfig);
  };

  const afterOpenChange = () => {
    getData();
  }

  // 初始化数据
  const initFormData = () => {
    setModalVisible(true);
  }

  // 开启
  const showModal = () => {
    initFormData();
  };

  // 选择方案
  const handleOnRow = (record: any) => {
    let tmpGridData = cloneDeep(gridData);
    tmpGridData.forEach((item: any) => {
      item.isUsed = record.faid === item.faid;
    });
    setGridData(tmpGridData);
    if (chooseScheme) {
      chooseScheme(record);
    }
  }

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Drawer
        title="选择方案"
        placement="right"
        onClose={() => setModalVisible(false)}
        open={modalVisible}
        size={CONSTANTS.C_MODAL_WIDTH_X1}
        destroyOnHidden={true}
        afterOpenChange={afterOpenChange}
        zIndex={1001}
      >
        <List
          itemLayout="horizontal"
          dataSource={gridData}
          renderItem={(item: any, index: number) => (
            <List.Item
              actions={[<a onClick={(event: any) => { event.stopPropagation(); deleteScheme(index); }} ><DeleteOutlined/></a>]}
              onClick={() => handleOnRow(item)}
              className='listItemCursor'
            >
              <List.Item.Meta
                title={
                <span style={{
                  color: item.isUsed ? myUtil.theme.getColor({type: 'primary'}) : myUtil.theme.getColor({type: 'textTertiary'}),
                  cursor: item.isUsed ? 'default' : 'pointer',
                }}>
                  {item.famc}
                </span>}
                description={item.fams} />
            </List.Item>
          )}
        />
      </Drawer>
    </>
  );
};
export default SchemeList;
