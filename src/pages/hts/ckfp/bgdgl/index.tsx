import React, { useRef} from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import unitConfig from './config';
import func from './func'
import ModalList from './modal_list';
import IcList from '@/pages/hts/pzgl/icCard/common/icCardTsList';
import IcListGpt from '@/pages/hts/pzgl/icCard/common/icCardTsListGpt';
import { history } from 'umi';
import { cloneDeep } from 'lodash';

const Index: React.FC<unknown> = () => {
  const modalRef: any = useRef();
  const refICList: any = useRef(); // 环境检测
  const refICListGpt: any = useRef(); // 关票通环境检测

  let myConfig = cloneDeep(unitConfig);
  const qdDm: any = history?.location?.query?.qdDm;
  if (qdDm === 'SAAS_API_SZGPS') {
    myConfig.customer_toolbar = [];
  }
  if(history.location.query) {
    const bz = history.location.query?.bz;
    if(bz === 'gzt') {
      myConfig.grid_columns[2] = { title: '开票状态', dataIndex: 'bgdkpzt', fixed: 'left', width: 100,
        render: { func: 'renderCkfpSjxzBgdKpzt' },
        filter: {
          type: 'Select',
          list: [
            { text: '已开票', value: '1' },
            { text: '未开票', value: '2' }
          ],
          value: ['2']
        }
      };
    } else {
      myConfig.grid_columns[2] = { title: '开票状态', dataIndex: 'bgdkpzt', fixed: 'left', width: 100,
        render: { func: 'renderCkfpSjxzBgdKpzt' },
        filter: {
          type: 'Select',
          list: [
            { text: '已开票', value: '1' },
            { text: '未开票', value: '2' }
          ],
        }
      };
    }
  }

  func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(modalRef);
    otherRef.push(refICList);
    otherRef.push(refICListGpt);
    return otherRef;
  };

  return <>
    <DDBunit2 config={myConfig} func={func} />
    <ModalList onRef={modalRef} />
    <IcList onRef={refICList} />
    <IcListGpt onRef={refICListGpt} />
  </>;
};

export default Index;
