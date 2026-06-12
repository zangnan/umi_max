import React from 'react';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { queryJhfpl, queryBgdByBgdNo21, queryHlxx, querySpdmXxCj, queryDlzmByDlckhwzmhm, checkYwlxSpdm, importTemplate, bgdtzsx, mdtImportUpdate } from '@/pages/hts/services/htsApi';
import {Button, Form, message, Tooltip, Upload} from 'antd';
import myUtil from '@/components/DDAssist/util';
import dayjs from 'dayjs';
import DDAlert from '@/pages/hts/commonModule/DDAlert';
import {ClockCircleOutlined, InboxOutlined} from "@ant-design/icons";
import {history} from "@@/core/history";

const Func: any = {
  refUnit: React.createRef(),
};

Func.initAddForm = (param: any) => {
  DditCktsFormCommonFunc.initAddForm(param);
  const {myFormItems, setMyFormItems} = param;
  const lableSpan1: any = document.querySelector("#mdt_zxsb_sb_mdt_tssb_gcb_form .dditem_label_hzcjyyDm span");
  if (lableSpan1) {
    lableSpan1.classList.remove('required');
    const tmpMyItems: any = [];
    myFormItems.map((item: any) => {
      if (item.name === 'hzcjyyDm') {
        item.disabled = true;
      }
      tmpMyItems.push(item);
    });
    setMyFormItems([...tmpMyItems]);
  }
}

export default Func;
