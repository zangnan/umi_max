import React, { useEffect, useState, useImperativeHandle } from 'react';
import { Drawer, List } from 'antd';
import myUtil from '@/pages/common/myUtil';
import pro from '@/pages/common/proConfig';
import { DeleteOutlined } from '@ant-design/icons';
import './style.less';
import { cloneDeep } from 'lodash';

export type SchemeListProps = {
  visible?: any;
  onRef?: any;
  chooseScheme?: any;
  pageId?: any;
  saveSchemeDel?: any;
}

const SchemeList: React.FC<SchemeListProps> = ({
  visible = false,
  onRef,
  chooseScheme,
  pageId,
  saveSchemeDel
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [gridData, setGridData] = useState<any>([]);

  // 删除
  const deleteScheme = (index: number) => {
    const viewId: string = pageId;
    const viewConfig: any = myUtil.localStore.getItem('view_config') || {};
    gridData.splice(index, 1);
    if (gridData.length > 0) {
      viewConfig[viewId] = gridData;
    } else {
      delete viewConfig[viewId];
    }
    myUtil.localStore.setItem('view_config', viewConfig);
    setGridData([].concat(gridData));
    if (saveSchemeDel) {
      saveSchemeDel(viewConfig[viewId] || []);
    }

  }

  // 获取数据
  const getData = () => {
    const viewId: string = pageId;
    const viewConfig = myUtil.localStore.getItem('view_config') || {};
    const currentViewConfig = viewConfig[viewId] || [];
    setGridData(currentViewConfig);
  };

  const afterVisibleChange = () => {
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
        visible={modalVisible}
        width={pro.c_modal_width_x1}
        destroyOnClose={true}
        afterVisibleChange={afterVisibleChange}
        zIndex={1002}
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
                  color: item.isUsed ? '#333333' : 'rgba(0, 0, 0, 0.45)',
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
