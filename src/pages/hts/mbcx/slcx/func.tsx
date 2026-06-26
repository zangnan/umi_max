import React from 'react';
import 'moment/locale/zh-cn';
import {Button} from 'antd';

const Func: any = {
  unitRef: React.createRef(),
};
Func.columnsRender = {
  renderCkspDm: (param: any) => {
    const val = param?.record?.ckspDm;
      return (
        <Button
          type="link"
          onClick={(event: any) => {
            event.stopPropagation();
            Func.openCkspDm(param);
          }}
        >
          {val}
        </Button>
      );
  },
}

Func.openCkspDm = (param: any) => {
  const {unitRef, record} = param;
  const otherRef = unitRef.current?.getOtherRefs();
  if (otherRef[0]) {
    otherRef[0].current?.showModal(param);
  }
};

export default Func;
