import { Badge, Tooltip } from 'antd';
import React from 'react';

const Func: any = {
  refUnit: React.createRef(),
};

Func.columnsRender = {
   // 进度查询 -- 执行状态
   renderJljghxSjxzJdcxZxzt: (param: any) => {
    let col: any = <></>;
    if (param.text === '1') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="success" /><span className='zxzt-text'>执行成功</span>
        </span>
      );
    } else if (param.text === '0') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="processing" /><span className='zxzt-text'>执行中</span>
        </span>
      );
    } else if (param.text === '2') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="error" /><span className='zxzt-text'>执行失败</span>
        </span>
      );
    } else if (param.text === '3') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="success" /><span className='zxzt-text'>执行成功无数据</span>
        </span>
      )
    }  else if (param.text === '4') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="processing" /><span className='zxzt-text'>待执行</span>
        </span>
      )
    } else if (param.text === '5') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="success" /><span className='zxzt-text'>执行中断</span>
        </span>
      )
    }else if (param.text === '6') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="success" /><span className='zxzt-text'>暂停执行</span>
        </span>
      )
    }else if (param.text === '7') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="processing" /><span className='zxzt-text'>待下载</span>
        </span>
      )
    }else if (param.text === '8') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="processing" /><span className='zxzt-text'>取消执行</span>
        </span>
      )
    }else if (param.text === '9') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="processing" /><span className='zxzt-text'>取消中</span>
        </span>
      )
    }
    return col;
  },
  renderJdcxRwzxqk: (param: any) => {
    let text = param.text;
    if (text != null && text != '') {
      const mh = new RegExp("：", "g");
      const fh = new RegExp("；", "g");
      const dh = new RegExp("、", "g");
      const doh = new RegExp("，", "g");
      text = text.replace(mh, '：{br}');
      text = text.replace(fh, '；{br}');
      text = text.replace(doh, "，{br}");
      text = text.replace(dh, "，{br}");
      const arr: any = text.split('{br}');
      const tooltips: any = [];
      arr?.forEach((tip: any, index1: number) => {
        if (tip != '' || index1 < arr.length - 1) {
          tooltips.push(tip);
          if (index1 !== arr.length) {
            tooltips.push(<br key={index1.toString()} />);
          }
        }
      });
      return <Tooltip placement="topLeft" title={tooltips}>{param.text}</Tooltip>;
    } else {
      return '';
    }
  },
}

export default Func;