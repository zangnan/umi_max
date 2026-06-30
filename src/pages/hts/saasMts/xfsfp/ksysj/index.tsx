import unitConfig from './config';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import Func from './f';

const Index: React.FC<unknown> = () => {

  const myConfig = { ...unitConfig };
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'ksybz', value: 'Y', op: 'zdy' },
    ]
  }
  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>
};

export default Index;