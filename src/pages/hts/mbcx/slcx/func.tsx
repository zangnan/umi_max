import React from 'react';
import 'moment/locale/zh-cn';
import {Button} from 'antd';

const Func: any = {
  refUnit: React.createRef(),
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
  const {refUnit, record} = param;
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef[0]) {
    otherRef[0].current?.showModal(param);
  }
};

export default Func;
