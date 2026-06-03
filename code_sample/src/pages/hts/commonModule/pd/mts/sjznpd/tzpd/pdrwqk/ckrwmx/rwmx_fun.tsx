import React from 'react';
import { tssbTzpdInitScmx} from '@/services/hts/api';
import { CloseOutlined, CheckOutlined} from '@ant-design/icons';

const Func: any = {
  unitRef: React.createRef(),
};

Func.scmx = (params: any) => {
  const {otherRef, unitRef} = params;
  if (otherRef && otherRef[0]) {
    unitRef.current?.setMasker(true);
    tssbTzpdInitScmx({}).then(async (response) => {
      unitRef.current?.setMasker(false);
      const { code, body } = response;
      if (code === '200') {
        body.hhcblebal = '换汇成本（'+ body?.hhcbhlxx + '-'+  body?.hhcbhlsx+ '）';
        body.hhcbbz = ['1', '2', '3'];
        params.initValue = body;
      } else {
        params.initValue = {
          ssq: '',
          sbpc: '',
          glh: '',
          hhcbbz: ['1', '2', '3'],
          hhcblebal : '换汇成本（5-7）'
        };
      }
      otherRef[0].current?.showModal(params);
    })
  }
}

Func.columnsRender = {
  renderHhcb:(param: any) => {
    const record = param?.record;
    let hhcbColor: any;
    let hhcbRange: any;
    if (record.hhcb === '03') {
      hhcbColor = '#f50'
      hhcbRange = '↑';
    } else if (record.hhcb === '02') {
      hhcbColor = '#87d068'
      hhcbRange = '↓';
    }
    return <><span><div style={{ color: hhcbColor }}>{record.hhcbsz}{hhcbRange}</div></span></>

  },
  renderCkpdrwmxPdjg: (param: any) => {
    const pdbz = param?.record?.pdbz;
    let col: any = <></>;
    if (pdbz === 'Y') {
       return  col = <span className="dd_grid_icon"><CheckOutlined /></span>;
    } else if (pdbz === 'N') {
      return  col = <span className="dd_grid_icon"><CloseOutlined  style={{color:'red'}}/></span>;
    }
    return col;
  }
}

export default Func;
