/**
 * title: 监管方式码表管理
 */
import React ,{useRef} from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import myxzpzconfig from './myxzpzconfig';
import func from './myxzpzFunc'
import ModalClfs from './modal_clfs'


const Index: React.FC<{ data: any }> = ({
  data,
}) => {

  const refClfs: any = useRef();

  func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(refClfs);
    return otherRef;
  };
  return <>
    <div key={data}>
      <DDBunit2 config={myxzpzconfig} func={func} />
      <ModalClfs onRef={refClfs}/>
    </div>
  </>;
};

export default Index;