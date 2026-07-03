// 智能配单-手动配单
import { intl } from '@/components/DDAssist/util';
import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import ProCard from '@ant-design/pro-card';
import myUtil from '@/components/DDAssist/util';
import { Spin, Button, Table, Divider, message, Tooltip, Drawer, Radio, Form, Space } from 'antd';
import sdpdStyle from './style.less';
import { useModel } from 'umi';
import Tzgd from './tzgd';
import Tjgd from './tjgd';
import Tzfp from './tzfp';
import Tjfp from './tjfp';
import { commitData, queryZnpdZdppInfo } from '@/pages/hts/services/htsApi';
import CONSTANTS from '@/components/DDAssist/constants';
import Znpdmx from '@/pages/hts/commonModule/pd/mts/sjznpd/znpdmx';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { QuestionCircleOutlined } from '@ant-design/icons';

export interface ZnpdsdProps {
  onRefZnpdsd?: any;
  CallbackFmFunc?: any
}

const Index: React.FC<ZnpdsdProps> = ({
  onRefZnpdsd,
  CallbackFmFunc
}) => {

  const [tableData, setTableData] = useState<any>([]); // 配比平衡数据
  const [bgdData, setBgdData] = useState<any>([]); // 报关单数据
  const [fpData, setFpData] = useState<any>([]); // 发票数据
  const [mainNum, setMainNum] = useState<any>({}); // 页面左上角描述信息中的数字
  const [masker, setMasker] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const onRef: any = useRef(); // 出口报关单筛选页面ref
  const ckbgdAddRef: any = useRef(); // 出口报关单筛选页面ref
  const ckbgdTzRef: any = useRef(); // 报关单单位切换页面ref
  const ckfpAddRef: any = useRef(); // 出口发票筛选页面ref
  const ckfpTzRef: any = useRef(); // 出口发票调整页面ref
  // const intl = useIntl();
  const [formPp] = Form.useForm();

  const refZnpdmx: any = useRef();

  const { changeBgdKeys, bgdRows, changeBgdRows, changeFpKeys, fpRows, changeFpRows } = useModel('mtsznpd');

  useImperativeHandle(onRef, () => {
    return {
      tzGdSave,
      addGdSave,
      tzFpSave,
      addFpSave,
    };
  });

  useEffect(() => {
    // 进行深拷贝，防止改变原始值
    // const tempBgd = initBgd(bgdRows);
    // setBgdData(tempBgd);
    // const tempFp = initFp(fpRows);;
    // setFpData(tempFp);
    // const tjTemp = creatPbphData(tempBgd.concat(tempFp), tableData);
    // getTitleNum(tempBgd, tempFp, tjTemp);
  }, [])

  // 获取匹配顺序
  const getPpsx =()=>{
    queryZnpdZdppInfo({pdppfsDm: "2"}).then((response) => {
      const {code, body, desc} = response;
      if(code === '200'){
        const ppsx = body?.fappsxDm || '1'
        formPp.setFieldsValue({fappsxDm:ppsx});
      } else {
        message.error(desc);
      }
    })
  }

  // 开启
  const showModal = (param: any) => {
    // 进行深拷贝，防止改变原始值
    const tempBgd = initBgd(bgdRows);
    setBgdData(tempBgd);
    const tempFp = initFp(fpRows);;
    setFpData(tempFp);
    const tjTemp = creatPbphData(tempBgd.concat(tempFp), tableData);
    getTitleNum(tempBgd, tempFp, tjTemp);
    setDrawerVisible(true);
    getPpsx();
  };

  useImperativeHandle(onRefZnpdsd, () => {
    return {
      showModal,
    };
  });

  // 报关单初始化
  const initBgd = (param: any) => {
    return param.map((item: any) => {
      return {
        ...item,
        ...{
          npdckdw: item.cjUnit, // 初始化配比平衡出口计量单位
          npdspmc: item.hgcmname, // 初始化配比平衡拟配单商品名称
          npdcksl: item.cjQnt, // 初始化配比平衡出口数量
          dwsave: 'cj', // 单位切换时设置哪个单位被选中
        }
      }
    });
  }

  // 发票初始化
  const initFp = (param: any) => {
    return param.map((item: any) => {
      return {
        ...item,
        ...{
          csjhdw: item.dw, // 单位切换时判断是否修改过
          csjhsl: item.qnt, // 单位切换时如果单位相同需要将数量还原
          cskpdsl: item.syQnt, // 初始化可配单数量
          npdjhsl: item.syQnt, // 初始化拟配单数量
          cssyQnt: item.yzQnt, // 初始化已占数量
          kpdsl: item.syQnt, // 初始化可配单数量
          npdjhdw: item.dw, // 初始化拟配单单位
          npdspmc: item.bgdFpSpmc, // 初始化配比平衡拟配单商品名称
        },
      }
    });
  }

  //  打开调整关单
  const openTzgd = (record: any, index: any) => {
    const ckbgdIds: any = record.ckbgdIds;
    // 获取合并的数据用于调整单位
    const newData = bgdData.filter((item: any) => ckbgdIds.indexOf(item.ckbgdId) != -1);
    ckbgdTzRef.current!.showModal({ ref: onRef, ckspmc: record.npdspmc, data: newData, index });
  }

  // 保存调整关单
  const tzGdSave = (tzhData: any, index: any, delGduuid: any) => {
    // 本次调整的关单集合
    const qhuuids = tzhData.map((qh: any) => qh.ckbgdId);
    // 将删除的报关单数据从全局变量中删除
    const bgdChange = bgdRows.filter((row: any) => delGduuid.indexOf(row.ckbgdId) === -1)
    changeBgdRows(bgdChange);
    const bgdKeys = bgdChange.map((changBgd: any) => changBgd.ckbgdId);
    changeBgdKeys(bgdKeys);
    // 将调整关单数据和删除报关单数据排除
    const otherGdData = bgdData.filter((item: any) => qhuuids.indexOf(item.ckbgdId) === -1 && delGduuid.indexOf(item.ckbgdId) === -1);
    // 将调整后报关单重新赋值
    const newBgdData = otherGdData.concat(tzhData);
    setBgdData(newBgdData);
    // 处理本次调整的配比平衡数据
    const newPbData = [...tableData];
    if (newPbData[index].npdjhsl != undefined) {
      // 有发票数据则删除报关单信息
      const temp = newPbData[index];
      delete temp.npdckdw;
      delete temp.ckbgdIds;
      delete temp.qhFlag;
      delete temp.hgcmcode;
      delete temp.npdcksl;
      delete temp.npdgdts;
      newPbData.splice(index, 1, temp);
    } else {
      // 没有发票数据直接删除
      newPbData.splice(index, 1);
    }
    const tjTemp = creatPbphData(tzhData, newPbData);
    getTitleNum(newBgdData, fpData, tjTemp);
  }

  //  打开添加关单关单
  const openAddgd = (record: any) => {
    const notInIds = bgdData.map((bgd: any) => bgd.ckbgdId);
    ckbgdAddRef.current!.showModal({ ref: onRef, ckspmc: record.npdspmc, notInIds: notInIds });
  }

  // 添加报关单保存
  const addGdSave = (rows: any) => {
    // 更新model中的数据
    const tempBgdRows = bgdRows.concat(rows);
    changeBgdRows(tempBgdRows);
    const bgdKeys = tempBgdRows.map((changBgd: any) => changBgd.ckbgdId);
    changeBgdKeys(bgdKeys);
    // 进行初始化操作
    const tempBgd = initBgd(rows);
    const newBgdData = tempBgd.concat(bgdData);
    setBgdData(newBgdData);
    const tjTemp = creatPbphData(tempBgd, tableData);
    getTitleNum(newBgdData, fpData, tjTemp);
  }

  //  打开调整发票
  const openTzFp = (record: any, index: any) => {
    const fpcodeIds: any = record.fpcodeIds;
    // 获取合并的数据用于调整单位
    const newData = fpData.filter((item: any) => fpcodeIds.indexOf(item.fpcodeId) != -1);
    ckfpTzRef.current!.showModal({ ref: onRef, ckspmc: record.npdspmc, data: newData, index });
  }

  // 保存调整发票
  const tzFpSave = (tzhData: any, index: any, delFpuuid: any) => {
    // 本次调整的发票集合
    const qhuuids = tzhData.map((qh: any) => qh.fpcodeId);
    // 将删除的报关单数据从全局变量中删除
    const fpChange = fpRows.filter((row: any) => delFpuuid.indexOf(row.fpcodeId) === -1)
    changeFpRows(fpChange);
    const fpKeys = fpChange.map((changeFp: any) => changeFp.fpcodeId);
    changeFpKeys(fpKeys);
    // 其余未调整的发票数据
    const otherFpData = fpData.filter((item: any) => qhuuids.indexOf(item.fpcodeId) === -1 && delFpuuid.indexOf(item.fpcodeId) === -1);
    // 发票重新赋值
    const newFpData = otherFpData.concat(tzhData);
    setFpData(newFpData);
    // 处理本次调整的配比平衡数据
    const newPbData = [...tableData];
    if (newPbData[index].npdcksl != undefined) {
      // 有出口信息则删除发票信息
      const temp = newPbData[index];
      delete temp.npdjhdw;
      delete temp.fpcodeIds;
      delete temp.npdjhsl;
      delete temp.npdfpts;
      newPbData.splice(index, 1, temp);
    } else {
      // 没有发票数据直接删除
      newPbData.splice(index, 1);
    }
    const tjTemp = creatPbphData(tzhData, newPbData);
    getTitleNum(bgdData, newFpData, tjTemp);
  }

  //  打开添加发票
  const openAddFp = (record: any) => {
    const fpcodeIds = fpData.map((bgd: any) => bgd.fpcodeId);
    ckfpAddRef.current!.showModal({ ref: onRef, ckspmc: record.npdspmc, fpcodeIds: fpcodeIds });
  }

  // 添加发票保存
  const addFpSave = (rows: any) => {
    // 更新model中的数据
    const tempFpRows = fpRows.concat(rows);
    changeFpRows(tempFpRows);
    const fpKeys = tempFpRows.map((changeFp: any) => changeFp.fpcodeId);
    changeFpKeys(fpKeys);
    // 进行初始化操作
    const tempFp = initFp(rows);
    const newFpData = tempFp.concat(fpData);
    setFpData(newFpData);
    const tjTemp = creatPbphData(tempFp, tableData);
    getTitleNum(bgdData, newFpData, tjTemp);
  }

  // 配比平衡中添加发票信息
  const pushPbphFp = (param: any, i: any) => {
    return { npdspmc: param.npdspmc, npdjhsl: param.npdjhsl, npdjhdw: param.npdjhdw, fpcodeIds: [param.fpcodeId] }
  }

  // 配比平衡中添加报关单信息
  const pushPbphBgd = (param: any, i: any) => {
    return { qhFlag: param.qhFlag, npdspmc: param.npdspmc, hgcmcode: param.hgcmcode, npdcksl: param.npdcksl, npdckdw: param.npdckdw, ckbgdIds: [param.ckbgdId] };
  }

  // 实现配比平衡
  const creatPbphData = (dpbData: any, ypbData: any) => {
    // 配比平衡数据
    let newData: any = [...dpbData];
    // 配比平衡数据
    const newPbphDate = [...ypbData];
    // 循环待操作数据
    for (let i = 0; i < newData.length; i++) {
      // 从平衡数据中找是否有相同的商品名称
      const tempPb = newPbphDate.filter((item: any) => item.npdspmc === newData[i].npdspmc);
      // 没有相同的商品名称数据，直接添加
      if (tempPb.length === 0) {
        if (newData[i].npdjhsl != undefined) {
          newPbphDate.push(pushPbphFp(newData[i], i));
        } else {
          newPbphDate.push(pushPbphBgd(newData[i], i));
        }
      } else {
        for (let tempPdIndex = 0; tempPdIndex < tempPb.length; tempPdIndex++) {
          const element = tempPb[tempPdIndex];
          // 待配比数据是发票
          if (newData[i].npdjhsl != undefined && element.npdjhsl != undefined) {
            if (newData[i].npdjhdw == element.npdjhdw) {
              element.npdjhsl = DditCktsFormCommonFunc.util.addSum({ param1: element.npdjhsl, param2: newData[i].npdjhsl });
              element.fpcodeIds = element.fpcodeIds.concat([newData[i].fpcodeId]);
              break;
            } else if (tempPdIndex + 1 === tempPb.length) {
              // 名称相同，单位不同则直接添加
              newPbphDate.push(pushPbphFp(newData[i], i));
            }
          } else if (newData[i].npdcksl != undefined && element.npdcksl != undefined) {
            // 当前配比数据已经进行过合并,或者该记录同是含有发票和报关单信息
            if (element.ckbgdIds.length > 1 || (element.npdjhsl != undefined)) {
              // 如果是切换后的直接累加
              if (newData[i].qhFlag) {
                element.npdcksl = DditCktsFormCommonFunc.util.addSum({ param1: element.npdcksl, param2: newData[i].npdcksl });
                element.ckbgdIds = element.ckbgdIds.concat([newData[i].ckbgdId]);
                break;
              } else if (element.npdckdw == newData[i].fdUnit) { // 合并记录中的出口计量单位与法定单位比较
                newData[i].dwsave = 'fd';
                newData[i].npdckdw = newData[i].fdUnit;
                newData[i].npdcksl = newData[i].fdQnt;
                element.npdcksl = DditCktsFormCommonFunc.util.addSum({ param1: element.npdcksl, param2: newData[i].fdQnt });
                element.ckbgdIds = element.ckbgdIds.concat([newData[i].ckbgdId]);
                break;
              } else if (element.npdckdw == newData[i].cjUnit) {
                // 合并记录中的出口计量单位与成交单位比较
                newData[i].dwsave = 'cj';
                newData[i].npdckdw = newData[i].cjUnit;
                newData[i].npdcksl = newData[i].cjQnt;
                element.npdcksl = DditCktsFormCommonFunc.util.addSum({ param1: element.npdcksl, param2: newData[i].cjQnt });
                element.ckbgdIds = element.ckbgdIds.concat([newData[i].ckbgdId]);
                break;
              } else if (element.npdckdw == newData[i].fd2Unit) {
                newData[i].dwsave = 'fd2';
                newData[i].npdckdw = newData[i].fd2Unit;
                newData[i].npdcksl = newData[i].fd2Qnt;
                element.npdcksl = DditCktsFormCommonFunc.util.addSum({ param1: element.npdcksl, param2: newData[i].fd2Qnt });
                element.ckbgdIds = element.ckbgdIds.concat([newData[i].ckbgdId]);
                break;
              } else if (tempPdIndex + 1 === tempPb.length) {
                newPbphDate.push(pushPbphBgd(newData[i], i));
                break;
              }
            } else {
              // 两条关单都没有进行过合并 需要3*3比较（优先级：“法定单位”、“成交单位”、“法定第二单位”）
              const arr = [newData[i].fdUnit, newData[i].cjUnit, newData[i].fd2Unit];
              const valuearr = [newData[i].fdQnt, newData[i].cjQnt, newData[i].fd2Qnt];
              // 获取当前已经配比但未合并的报关单数据
              let bgd = bgdData.filter((item: any) => item.ckbgdId === element.ckbgdIds[0])[0];
              if (bgd === undefined) {
                bgd = newData.filter((item: any) => item.ckbgdId === element.ckbgdIds[0])[0];
              }
              const brr = [bgd.fdUnit, bgd.cjUnit, bgd.fd2Unit];
              const valuebrr = [bgd.fdQnt, bgd.cjQnt, bgd.fd2Qnt];
              const mcarr = ['fd', 'cj', 'fd2'];
              if (newData[i].qhFlag && element.qhFlag) {
                element.npdckdw = newData[i].npdckdw;
                element.npdcksl = DditCktsFormCommonFunc.util.addSum({ param1: element.npdcksl, param2: newData[i].npdcksl });
                element.ckbgdIds = [bgd.ckbgdId, newData[i].ckbgdId];
              } else {
                //  根据品名可能查询到多条，在子循环时已经匹配成功，修改flag为true
                let flag = false;
                for (let l = 0; l < brr.length; l++) {
                  if (arr.indexOf(brr[l]) > -1) {
                    // 修改当前配比的数据
                    newData[i].dwsave = mcarr[arr.indexOf(brr[l])];
                    newData[i].npdckdw = brr[l];
                    newData[i].npdcksl = valuearr[arr.indexOf(brr[l])];
                    // 修改已经进行过配比的（用于关单调整）
                    bgd.dwsave = mcarr[l];
                    bgd.npdckdw = brr[l];
                    bgd.npdcksl = valuebrr[l];
                    element.npdckdw = brr[l];
                    element.npdcksl = DditCktsFormCommonFunc.util.addSum({ param1: valuearr[arr.indexOf(brr[l])], param2: valuebrr[l] });
                    element.ckbgdIds = [bgd.ckbgdId, newData[i].ckbgdId];
                    flag = true;
                    break;
                  } else if (l === 2) {
                    newPbphDate.push(pushPbphBgd(newData[i], i));
                    flag = true;
                  }
                }
                // 子循环匹配成功，则跳出主循环
                if (flag) {
                  break;
                }
              }
            }
          } else if (newData[i].npdjhsl != undefined && element.npdcksl != undefined) {
            // 待配比是进货，存在1张关单
            if (element.ckbgdIds.length === 1) {
              // 发票的计量单位与关单的3个单位中存在相同则合并
              let jhslBgd = bgdData.filter((item: any) => item.ckbgdId === element.ckbgdIds[0])[0];
              if (jhslBgd === undefined) {
                jhslBgd = newData.filter((item: any) => item.ckbgdId === element.ckbgdIds[0])[0];
              }
              if (jhslBgd.qhFlag) {
                element.npdjhsl = Number(newData[i].npdjhsl);
                element.npdjhdw = newData[i].npdjhdw;
                element.fpcodeIds = [newData[i].fpcodeId];
                break;
              } else {
                const jshbrr = [jhslBgd.fdUnit, jhslBgd.cjUnit, jhslBgd.fd2Unit];
                const valuejhbrr = [jhslBgd.fdQnt, jhslBgd.cjQnt, jhslBgd.fd2Qnt];
                const jhmcarr = ['fd', 'cj', 'fd2'];
                const index = jshbrr.indexOf(newData[i].npdjhdw);
                if (index > -1) {
                  // 更新报关单中配比单位
                  jhslBgd.dwsave = jhmcarr[index];
                  jhslBgd.npdckdw = jshbrr[index];
                  jhslBgd.npdcksl = valuejhbrr[index];
                  // 更新配比平衡中的数据
                  element.npdckdw = jshbrr[index];
                  element.npdcksl = Number(valuejhbrr[index]);
                  element.npdjhsl = Number(newData[i].npdjhsl);
                  element.npdjhdw = newData[i].npdjhdw;
                  element.fpcodeIds = [newData[i].fpcodeId];
                  break;
                } else if (tempPdIndex + 1 === tempPb.length) {
                  newPbphDate.push(pushPbphFp(newData[i], i));
                }
              }
              // 存在多张关单
            } else if (newData[i].npdjhdw === element.npdckdw) {
              element.npdjhsl = Number(newData[i].npdjhsl);
              element.npdjhdw = newData[i].npdjhdw;
              element.fpcodeIds = [newData[i].fpcodeId];
              break;
            } else if (tempPdIndex + 1 === tempPb.length) {
              newPbphDate.push(pushPbphFp(newData[i], i));
            }
          } else {
            //  待配比是关单，有发票没有关单
            if (element.ckbgdIds?.length || 0 === 0) {
              if (newData[i].qhFlag) {
                element.npdckdw = newData[i].npdckdw;
                element.npdcksl = newData[i].npdcksl;
                element.qhFlag = newData[i].qhFlag;
                element.hgcmcode = newData[i].hgcmcode;
                element.ckbgdIds = (element.ckbgdIds || []).concat(newData[i].ckbgdId);
                break;
              } else {
                // 发票的计量单位与关单的3个单位中存在相同则合并
                const otherbrr = [newData[i].fdUnit, newData[i].cjUnit, newData[i].fd2Unit];
                const valueotherbrr = [newData[i].fdQnt, newData[i].cjQnt, newData[i].fd2Qnt];
                const othermcarr = ['fd', 'cj', 'fd2'];
                const index = otherbrr.indexOf(element.npdjhdw);
                if (index > -1) {
                  // 更新报关单中配比单位
                  newData[i].dwsave = othermcarr[index];
                  newData[i].npdckdw = otherbrr[index];
                  newData[i].npdcksl = valueotherbrr[index];
                  // 更新配比平衡中的数据
                  element.npdckdw = otherbrr[index];
                  element.npdcksl = Number(valueotherbrr[index]);
                  element.hgcmcode = newData[i].hgcmcode;
                  element.ckbgdIds = (element.ckbgdIds || []).concat(newData[i].ckbgdId);
                  break;
                } else if (tempPdIndex + 1 === tempPb.length) {
                  newPbphDate.push(pushPbphBgd(newData[i], i));
                }
              }
            } else if (newData[i].npdckdw == element.npdjhdw) {
              element.npdcksl = Number(newData[i].npdcksl);
              element.qhFlag = newData[i].qhFlag;
              element.hgcmcode = newData[i].hgcmcode;
              element.npdckdw = newData[i].npdckdw;
              element.ckbgdIds = [newData[i].ckbgdId];
              break;
            } else if (tempPdIndex + 1 === tempPb.length) {
              newPbphDate.push(pushPbphBgd(newData[i], i));
            }
          }
        }
      }
    }

    let oderData = newPbphDate.sort(function (a: any, b: any) { return a.npdspmc.localeCompare(b.npdspmc) });
    // 统计配比平衡中的关单条数和发票条数
    const temp: any = [];
    oderData.forEach((temp1: any, index: any) => {
      temp.push({ ...temp1, ...{ uuid: index, npdgdts: temp1?.ckbgdIds?.length, npdfpts: temp1?.fpcodeIds?.length } })
    })
    setTableData(temp);
    return temp;
  }

  // 单位格式化
  const renderDw = (text: any, param: any) => {
    if (param.npdckdw === param.npdjhdw) {
      return <span style={{ color: 'green' }}>{text}</span>;
    }
    return <span style={{ color: 'red' }}>{text}</span>;
  }

  // 数量格式化
  const renderSl = (text: any, param: any) => {
    if (param.npdcksl === param.npdjhsl) {
      return <span style={{ color: 'green' }}>{text ? myUtil.text.formatNum(text, '0,0.00000') : ''}</span>;
    } else if (param.npdcksl || param.npdjhsl) {
      return <span style={{ color: 'red' }}>{text ? myUtil.text.formatNum(text, '0,0.00000') : ''}</span>;
    } else {
      return '';
    }
  }

  // 配比平衡配置列
  const pbphColumns = [
    {
      title: '序号', dataIndex: 'index', width: 60, render: (_text: any, _record: any, index: number) => (
        <span>{index + 1}</span>)
    },
    {
      title: '商品名称', dataIndex: 'npdspmc', width: 180, ellipsis: { showTitle: false }, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {text} </Tooltip>
        }
        return '';
      }
    },
    {
      title: '关单信息', children: [
        { title: '关单份数', dataIndex: 'npdgdts', width: 80, align: 'right' },
        { title: '海关商品代码', dataIndex: 'hgcmcode', width: 115, },
        {
          title: '出口计量单位', dataIndex: 'npdckdw', width: 105, render: (text: any, record: any) => {
            return renderDw(text, record);
          }
        },
        {
          title: '出口数量', dataIndex: 'npdcksl', width: 140, align: 'right', render: (text: any, record: any) => {
            return renderSl(text, record);
          }
        },
        {
          title: '操作', width: 100, align: 'center', render: (text: any, record: any, index: any) => {
            const bgdButton = [];
            bgdButton.push(<Button type='link' key='addGd' onClick={() => openAddgd(record)}>添加</Button>);
            if (record.npdcksl) {
              bgdButton.push(<Divider key='divBgd' type='vertical' />);
              bgdButton.push(<Button type='link' key='TzGd' onClick={() => openTzgd(record, index)}>调整</Button>);
            }
            return bgdButton;
          }
        },
      ]
    },
    {
      title: '发票信息', children: [
        { title: '发票条数', dataIndex: 'npdfpts', width: 80, align: 'right' },
        {
          title: '进货计量单位', dataIndex: 'npdjhdw', width: 105, render: (text: any, record: any) => {
            return renderDw(text, record);
          }
        },
        {
          title: '进货数量', dataIndex: 'npdjhsl', width: 140, align: 'right', render: (text: any, record: any) => {
            return renderSl(text, record);
          }
        },
        {
          title: '操作', width: 100, align: 'center', render: (text: any, record: any, index: any) => {
            const fpButton = [];
            fpButton.push(<Button type='link' key='addFp' onClick={() => openAddFp(record)}>添加</Button>);
            if (record.npdjhsl) {
              fpButton.push(<Divider key='divFp' type='vertical' />);
              fpButton.push(<Button type='link' key='tzFp' onClick={() => openTzFp(record, index)}>调整</Button>);
            }
            return fpButton;
          }
        },
      ]
    },
  ]

  // 获取页面标题中的数量
  const getTitleNum = (param: any, param1: any, param2: any) => {
    // 报关单条数
    const ytjBgdTs = param.length;
    // 发票条数
    const ytjFpTs = param1.length;
    // 商品项数（根据商品名称分组）
    const npdspmcs = param2.map((item: any) => item.npdspmc);
    const spxs = Array.from(new Set(npdspmcs)).length;
    // 平衡项
    const phx = param2.filter((item: any) => item.npdcksl === item.npdjhsl && item.npdckdw === item.npdjhdw).length;
    // 不平衡项
    const bphx = param2.length - phx;
    setMainNum({ ytjBgdTs, ytjFpTs, spxs, phx, bphx });
  }

  // 页面标题
  const proTitle = (
    <>
      <span className={sdpdStyle.sdpd_main_title_ytj}>已添加关单
        <span className={sdpdStyle.sdpd_main_title_ytj_num}>{mainNum.ytjBgdTs}</span>
        条，发票
        <span className={sdpdStyle.sdpd_main_title_ytj_num}>{mainNum.ytjFpTs}</span>
        条，共
        <span className={sdpdStyle.sdpd_main_title_ytj_num}>{mainNum.spxs}</span>
        项商品
        <span style={{ marginLeft: '40px' }}>配比状态：</span>
        <span className={sdpdStyle.sdpd_main_title_ytj}>不平衡</span>
        <span className={mainNum.bphx > 0 ? sdpdStyle.sdpd_main_title_pbzt_bph : sdpdStyle.sdpd_main_title_ytj_num}>{mainNum.bphx}</span>
        项，
        <span className={sdpdStyle.sdpd_main_title_ytj}>平衡</span>
        <span className={mainNum.phx > 0 ? sdpdStyle.sdpd_main_title_pbzt_ph : sdpdStyle.sdpd_main_title_ytj_num}>{mainNum.phx}</span>
        项
      </span>
    </>
  );

  // 返回
  const returnZnpdMain = () => {
    setTableData([]);
    setBgdData([]);
    setDrawerVisible(false);
    CallbackFmFunc('SDPD');
    // history.push({ pathname: '/hts/mts/sjznpd/znpd', query: { bz: 'SDPD'}}); // 原/hts/mts/sjznpd/znpd
  }

  // 提交
  const proSave = () => {
    // 存在不平衡项时，不允许提交
    if (mainNum.bphx != 0) {
      message.info(intl.formatMessage({ id: 'message_znpdsd_save_check_message' }));
      return;
    }
    const bgdFpList: any = [];
    tableData.forEach((temp: any) => {
      const bgdList: any = [];
      const fpList: any = [];
      temp.ckbgdIds.forEach((ckbgdId: any) => {
        const bgds = bgdData.filter((bgd: any) => bgd.ckbgdId === ckbgdId);
        if (bgds.length > 0) {
          bgdList.push({ ckbgdId: bgds[0].ckbgdId, dwslBz: bgds[0].dwsave })
        }
      });
      temp.fpcodeIds.forEach((fpcodeId: any) => {
        const fps = fpData.filter((bgd: any) => bgd.fpcodeId === fpcodeId);
        if (fps.length > 0) {
          fpList.push({ fpcodeId: fps[0].fpcodeId, hwmcNpd: fps[0].npdspmc, dwXg: fps[0].npdjhdw, slXg: fps[0].csjhsl, slNpd: fps[0].npdjhsl, })
        }
      });
      bgdFpList.push({ bgdList, fpList });
    });
    setMasker(true);
    const ppsxRadio = formPp.getFieldValue('fappsxDm')
    commitData({ bgdFpList: bgdFpList, fappsxDm: ppsxRadio }).then((res: any) => {
      const { code, body, desc } = res;
      setMasker(false);
      if (code === '200') {
        refZnpdmx?.current?.showModal({ bz: 'SDPD', pduuid: body.pduuid });
        // history.push({ pathname: '/hts/mts/sjznpd/znpdmx', query: { bz: 'SDPD', pduuid: body.pduuid } }); // 原/hts/mts/sjznpd/znpdmx
        // 清空选中数据
        changeBgdKeys([]);
        changeBgdRows([]);
        changeFpKeys([]);
        changeFpRows([]);
      } else {
        message.error(desc);
      }
    })
  };

  // 选择匹配顺序
  const onChangePpsx = (e:any) => {
    const value = e.target?.value;
    formPp.setFieldsValue({fappsxDm:value});
    // 保存更改
  }

  return (
    <>
      <Drawer
        title={'配单明细'}
        visible={drawerVisible}
        width={CONSTANTS.C_MODAL_WIDTH_MAX}
        onClose={() => { returnZnpdMain() }}
        className="dd_data_page_modal"
        destroyOnHidden={true}
        mask={{ closable: false }}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <ProCard
            title={proTitle}
            extra={
              <>
                <Form form={formPp} initialValues={{}} style={{height: '30px'}}>
                 <Space align="baseline">
                  <Form.Item label="匹配顺序：" name="fappsxDm">
                    <Radio.Group onChange={(e:any) => onChangePpsx(e)}>
                      <Tooltip title="使用出口日期较早报关单优先匹配开票日期较早退税发票">
                        <Radio key={'fappsxDm1'} value={'1'}>{'先入先出'}<QuestionCircleOutlined style={{marginLeft:'5px'}} /></Radio>
                      </Tooltip>
                      <Tooltip title="使用出口日期较早报关单匹配开票日期较晚退税发票">
                        <Radio key={'fappsxDm2'} value={'2'}>{'后入先出'}<QuestionCircleOutlined style={{marginLeft:'5px'}} /></Radio>
                      </Tooltip>
                    </Radio.Group>
                  </Form.Item>
                  <Button type="link" onClick={returnZnpdMain}>返回</Button>
                  <Button type="primary" onClick={proSave} style={{ marginLeft: 8 }}>确定配单</Button>
                  </Space>
                </Form>
              </>
            }
            bordered
            className={sdpdStyle.sdpd_main}
          >
            <div className='dd-table'>
              <Table
                rowKey='uuid'
                size='small'
                dataSource={tableData}
                columns={pbphColumns}
                pagination={false}
                bordered
                scroll={{ x: '700px', y: `${document.documentElement.clientHeight - 174}px` }}
              />
            </div>
            <Tzgd onRef={ckbgdTzRef} />
            <Tjgd onRef={ckbgdAddRef} />
            <Tzfp onRef={ckfpTzRef} />
            <Tjfp onRef={ckfpAddRef} />
          </ProCard>
        </Spin>
      </Drawer>
      <Znpdmx onRef={refZnpdmx} CallbackFmFunc={CallbackFmFunc} closeModal={returnZnpdMain} />
    </>
  )
}


export default Index;
