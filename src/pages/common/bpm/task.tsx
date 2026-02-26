import React, { useEffect, useRef, useState } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import Func from './f';
import ApprovalFlow from '@/components/DDFlow/approvalFlow';
import myUtil from '@/components/DDAssist/util';

const Task: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = useState<any>({});

  useEffect(() => {
    myUtil.module.initAutomaticPageDef({ module_key: 'nbgl_process_task_run', setMyConfig });
  }, []);

  const approvalFlowRef: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(approvalFlowRef);
    return otherRef;
  };

  return <>
    <DDBunit2 config={myConfig} func={Func} />
    <ApprovalFlow onRef={approvalFlowRef} />
  </>;
};

export default Task;