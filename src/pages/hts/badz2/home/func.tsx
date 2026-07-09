import React from 'react';
import 'moment/locale/zh-cn';
import { message, Button } from "antd";

const Func: any = {
  refUnit: React.createRef(),
};

// 选择备案方式弹窗
const clickQrbafs = (param: any) => {
  const { record, otherRef } = param;
  // 如果存在shztDm 并且shztDm不是01时，不允许修改备案方式
  if (record.shztDm && record.shztDm !== '01') {
    message.error('当前数据已被税务机关调阅，无法更改');
    return;
  }
  // 如果存在sdbz，并且sdbzs是Y时，不允许修改备案方式
  if (record.sdbz && record.sdbz === 'Y') {
    message.error('当前数据已被税务机关锁定，无法更改');
    return;
  }
  otherRef[1].current?.showModal(param);
}

// 列表自定义渲染
Func.columnsRender = {
  // 备案单证目录
  renderBadzml: (param: any) => {
    const { otherRef, record } = param;
    let html;
    if (record.bawcbz === 'Y') {
      html = <Button type="link" onClick={(event: any) => {
        event.stopPropagation();
        otherRef[0].current?.showModal(param);
      }}>
        查看
      </Button>
    } else if (record.zzbafs == '0' && record.zzbaBz == 'Y') {
      html = <Button type="link" onClick={(event: any) => {
        event.stopPropagation();
        otherRef[0].current?.showModal(param);
      }}>
        填写
      </Button>
		} else {
      html = <></>;
    }
    return html;
  },
  // 确认备案方式
  renderQrbafs: (param: any) => {
    const { record } = param;
    let html;
    if (record.zzbaBz === null && record.dzbaBz === null) {
      html = <></>
    } else {
      if (record.zzbaBz == 'Y') {
        html = <span>纸质化备案&nbsp;</span>;
      } else if (record.dzbaBz == 'Y' && record.ppgzDm == '01') {
        html = <span>电子化备案-按报关单匹配&nbsp;</span>;
      } else if (record.dzbaBz == 'Y' && record.ppgzDm == '02') {
        html = <span>电子化备案-按所属期批次匹配&nbsp;</span>;
      }
    }
    return (
      <>
        {html}
        <Button  type="link" onClick={(event: any) => { 
          event.stopPropagation();
          clickQrbafs(param);
        }}>
          选择
        </Button>
      </>
    );
  },
}

export default Func;
