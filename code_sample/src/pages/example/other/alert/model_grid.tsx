import React, { useImperativeHandle, useEffect, useState } from 'react';
import { Modal, Button, message } from 'antd';
import pro from '@/pages/common/proConfig';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import unitConfig from './config';
import myUtil from '@/pages/common/myUtil';
import './style.less';

export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
  data?: any;
}

const ModalGrid: React.FC<DDModalGridProps> = ({
  onRef,
  visible = false,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [myColumns, setMyColumns] = useState(unitConfig.gridColumns);
  const [myFilterItems, setMyFilterItems] = useState(unitConfig.filterItems);

  // 开启
  const showModal = () => {
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 配置列表列
  const initColumns = () => {
    // 隐藏列
    const cols = myColumns.filter((col: any) => {
      return (!(col.hidden && col.hidden !== false));
    })
    // 码表渲染
    myColumns.map((col: any) => {
      const { codeTable } = col;
      if (codeTable) {
        col.render = (text: any) => myUtil.code.getCodeValByKey(text, codeTable[0], codeTable[1]);
      }
    });
    setMyColumns(cols);
  }

  // 配置列表过滤项
  const initFilterItems = () => {
    const items = myFilterItems.concat();
    // 码表渲染
    items.map((item: any) => {
      const { codeTable } = item;
      if (codeTable) {
        item.list = myUtil.code.getSelectOption(codeTable[0], codeTable[1])
      }
    });
    setMyFilterItems(items);
  }

  // 获取码表参数
  const getCodeTableParam = () => {
    const param: any[] = [];
    // 列表中需要的码表、查询条件中需要的码表、查询条件中需要的码表
    const tmp = [...myColumns, ...myFilterItems];
    tmp.forEach((item: any) => {
      const { codeTable } = item;
      if (codeTable) {
        param.push({
          key: codeTable[0],
          codeViewKey: codeTable[1],
        });
      }
    });
    return param;
  }

  useEffect(() => {
    const param = getCodeTableParam();
    const promiseArr = [];
    for (let i = 0; i < param.length; i += 1) {
      const { key, codeViewKey } = param[i];
      const tmpCodeTable = myUtil.code.getCodeFromServerT1(key, codeViewKey);
      promiseArr.push(tmpCodeTable);
    }
    // 获取码表
    Promise.all(promiseArr).then(() => {
      // do nothing
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      initColumns();
      initFilterItems();
    });
  }, []);

  return (
    <>
      <Modal
        title='弹窗列表'
        destroyOnClose={true}
        visible={modalVisible}
        width={pro.c_modal_width_x4}
        wrapClassName='standard-modal-1'
        footer={(<>
          <Button onClick={() => setModalVisible(false)} >取消</Button>
          <Button onClick={() => setModalVisible(false)} type="primary">确定</Button>
        </>)}
        onCancel={() => setModalVisible(false)}
      >
        <DDBunit2 config={unitConfig} func={[]} />
      </Modal>
    </>
  );
};

export default ModalGrid;