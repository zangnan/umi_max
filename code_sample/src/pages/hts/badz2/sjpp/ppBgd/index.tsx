import React, { useRef } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import unitConfig from './config';
import func from './func';
import { cloneDeep } from 'lodash';

import ModalEdit from '../ppBgd/modal_edit';
import ModalXq from '../../common/ml/modal_xq';

export type Props = {
  onRef?: any;
  mainParams?: any;
  type?: any;
};

const Index: React.FC<Props> = ({ onRef, mainParams, type = 'pp' }) => {
  const ModalEditRef: any = useRef(); // 关票通环境检测
  const ModalXqRef: any = useRef();
  const { record } = mainParams;

  let myConfig = cloneDeep(unitConfig);
  const gridParams: any = {
    initSearchModal: [
      { op: 'al', property: 'ssq', value: record.ssq },
      { op: 'al', property: 'sbpc', value: record.sbpc },
      { op: 'al', property: 'lcswsxDm', value: record.lcswsxDm },
      { op: 'al', property: 'baqkUuid', value: record.uuid },
    ],
  };
  myConfig.gridParams = gridParams;
  if (type === 'xq') {
    myConfig.layout_type = 'modal';
    myConfig.handle_columns = [{ name: '详情', key: 'xq', func: 'handleColumnsXq' }];
  } else {
    // 配置项：自定义工具栏
    myConfig.costomer_toobar = [{ name: '解除匹配', key: 'jcpp', func: 'badzBgdjcpp' }];
    myConfig.handle_columns = [{ name: '编辑', key: 'bj', func: 'handleColumnsBj' }];
  }

  func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(mainParams);
    otherRef.push(ModalEditRef);
    otherRef.push(ModalXqRef);
    return otherRef;
  };

  return (
    <>
      <DDBunit2 config={myConfig} func={func} />
      <ModalEdit onRef={ModalEditRef} mainParams={mainParams} />
      <ModalXq onRef={ModalXqRef} mainParams={mainParams} />
    </>
  );
};

export default Index;
