/**
 * title: 出口退（免）税备案变更
*/
import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Button, message, Space, Input, Form, Modal, Radio, Checkbox, DatePicker } from 'antd';
import myUtil from '@/components/DDAssist/util';
import './sjhzStyle.less';
import ProCard from '@ant-design/pro-card';
import { querybgsjCsh, queryCjCsh, checkTbrq, checkzxsbbababg, saveBabgsj } from '@/pages/hts/services/htsApi';
import moment from 'moment';
import { request } from 'umi';
import DDAlert from '@/pages/hts/components/DDAlert';

export interface BdjgProps {
  onRef?: any;
}

const DrawerList: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [gridRef, setGridRef] = useState<any>();
  const [formSearch] = Form.useForm(); // 申请日期
  const [formData] = Form.useForm(); // 表
  const [formValue, setFormValue] = useState<any>({}); // 初始化值
  const [cktsqylxList , setCktsqylxList] = useState<any>([]); // 企业类型
  const [xszzsyhzcqkList, setXszzsyhzcqkList] = useState<any>([]); // 享受增值税优惠政策	
  const [cktmsgllxList, setCktmsgllxList] = useState<any>([]); // 退税管理类型
  const [ckhwtmsjsffList, setCkhwtmsjsff] = useState<any>([]); // 退（免）税计算方法
  const [gjysfwysfsList, setGjysfwysfs] = useState<any>([]); // 国际运输服务
  const [yfsjfwList, setYfsjfwList] = useState<any>([]); // 向境外单位提供的完全
  const [flagLsl, setFlagLsl] = useState<any>(true); // 是否提供零税率应税服务控制提供应税服务代码
  const [flagGjys, setFlagGjys] = useState<any>(true); // 国际运输服务控制
  const [flagJwdw, setFlagJwdw] = useState<any>(true); // 向境外单位提供的完全控制

  const [htysCheck, setHtysCheck] = useState<any>(false); // 航天运输中选状态
  const [gjysCheck, setGjysCheck] = useState<any>(false); // 国际运输服务中选状态
  const [jwdwCheck, setJwdwCheck] = useState<any>(false); // 向境外单位提供的完全中选状态

  const [uuidData, setUuidData] = useState<any>(''); // uuid

  // 开启
  const showModal = (param: any) => {
    if(param?.record){
      setUuidData(param?.record?.uuid)
      getCodeList(param?.record?.uuid);
    } else {
      getCodeList('');
    }
    setModalVisible(true);
    setGridRef(param.gridRef);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  const getCodeList = (uuid: any) => {
    const promiseArr = [];
    // 企业类型
    const cktsqylxCode = myUtil.code.getCodeFromServerT1('code_dm_rd_cktsqylx:01');
    promiseArr.push(cktsqylxCode);
    // 享受增值税优惠政策
    const xszzsyhzcqkCode = myUtil.code.getCodeFromServerT1('code_dm_ckts_xszzsyhzcqk:01');
    promiseArr.push(xszzsyhzcqkCode);
    // 退税管理类型（外贸02）
    const cktmsgllxCode = myUtil.code.getCodeFromServerT1('code_dm_ckts_cktmsgllx:02');
    promiseArr.push(cktmsgllxCode);
    // 退（免）税计算方法
    const ckhwtmsjsffCode = myUtil.code.getCodeFromServerT1('code_dm_rd_ckhwtmsjsff:01');
    promiseArr.push(ckhwtmsjsffCode);
    // 国际运输服务
    const gjysfwysfsCode = myUtil.code.getCodeFromServerT1('code_dm_ckts_gjysfwysfs:01');
    promiseArr.push(gjysfwysfsCode);
    // 向境外单位提供的完全
    const yfsjfwCode = myUtil.code.getCodeFromServerT1('code_dm_ckts_yfsjfw:01');
    promiseArr.push(yfsjfwCode);

    Promise.all(promiseArr).then((_response) => {
      // do nothing
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      const listCktsqylx = myUtil.code.getCode('code_dm_rd_cktsqylx:01');
      const listCktmsgllx = myUtil.code.getCode('code_dm_ckts_cktmsgllx:02');
      const listXszzsyhzcqk = myUtil.code.getCode('code_dm_ckts_xszzsyhzcqk:01');
      const listCkhwtmsjsff = myUtil.code.getCode('code_dm_rd_ckhwtmsjsff:01');
      const listGjysfwysfsf = myUtil.code.getCode('code_dm_ckts_gjysfwysfs:01');
      const listYfsjfw = myUtil.code.getCode('code_dm_ckts_yfsjfw:01');

      setCktsqylxList(listCktsqylx);
      setCktmsgllxList(listCktmsgllx);
      setXszzsyhzcqkList(listXszzsyhzcqk)
      setCkhwtmsjsff(listCkhwtmsjsff);
      setGjysfwysfs(listGjysfwysfsf)
      setYfsjfwList(listYfsjfw);
    });
    getBgsjData();

    // 编辑
    if(uuid){
      getBgsjForm(uuid);
    } else {
      const obj = {
        lcswsxDm: '',
        tableKey: 'ZGBA_ZXSB_BA_BABG_G',
      }
      queryCjCsh(obj).then((res: any) => {
        const {code, body, desc} = res;
        if(code == '200') {
          formSearch.setFieldsValue({
            tbrq1: moment(body.tbrq1)
          })
        } else {
          message.error(desc)
        }
      });
    }
  }

  // 编辑
  const getBgsjForm = (uuid: any) => {
  const obj = {
    key: 'ZGBA_ZXSB_BA_BABG_G',
    uuid,
  }
  request(`/hx/ty/crud/queryForm`, { method: 'POST', data: obj }).then((res) => {
    const {code, body, desc} = res;
    if(code === '200') {
      formSearch.setFieldsValue({
        tbrq1: moment(body.tbrq1),
      })
    } else {
      message.error(desc)
    }
  })
  }

  // 初始化 获得信息
  const getBgsjData = () => {
    querybgsjCsh({}).then((res: any) => {
      const {code, body, desc} = res;
      if(code == '200') {
        const obj = {
          jsoncktmsgllx: body.jsoncktmsgllx,
          jsoncktsqylxDm: body.jsoncktsqylxDm,
          jsondwmyjyzbadjbbh: body.jsondwmyjyzbadjbbh,
          jsongjysfwysfs: body.jsongjysfwysfs,
          jsonhgqyDm: body.jsonhgqyDm,
          jsonlslysfw: body.jsonlslysfw,
          jsonnsrmc: body.jsonnsrmc,
          jsonnsrsbh: body.jsonnsrsbh,
          jsontglslysfwbz: body.jsontglslysfwbz,
          jsontskhyhmc: body.jsontskhyhmc,
          jsontskhyhzh: body.jsontskhyhzh,
          jsonxszzsyhzc: body.jsonxszzsyhzc,
          jsonyfsjfw: body.jsonyfsjfw, // 向境外单位提供的完全
          jsonckhwtmsjsffDm: body.jsonckhwtmsjsffDm,
          jsonqybltmsryyxm: body.jsonqybltmsryyxm,
          jsonqybltmsryysfzjhm: body.jsonqybltmsryysfzjhm,
          jsonqybltmsryylxdh: body.jsonqybltmsryylxdh,
          jsonqybltmsryexm: body.jsonqybltmsryexm,
          jsonqybltmsryesfzjhm: body.jsonqybltmsryesfzjhm,
          jsonqybltmsryelxdh: body.jsonqybltmsryelxdh,
          jsonfszl: body.jsonfszl,
          jsontsswjgDm1: body.jsontsswjgDm1,
          // 页面显示
          shxydm: body.shxydm?.replace(/^\s*|\s*$/g,"") == '' ? body.nsrsbh : body.shxydm, // 固定值
          nsrmc: body.nsrmc, // 固定值
          cktsqylxDm: JSON.parse(body.jsoncktsqylxDm).bgh,
          dwmyjyzbadjbbh: JSON.parse(body.jsondwmyjyzbadjbbh).bgh,
          hgqyDm: JSON.parse(body.jsonhgqyDm).bgh,
          tglslysfwbz: JSON.parse(body.jsontglslysfwbz).bgh?JSON.parse(body.jsontglslysfwbz).bgh:'N',
          tskhyhmc: JSON.parse(body.jsontskhyhmc).bgh,
          tskhyhzh: JSON.parse(body.jsontskhyhzh).bgh,
          ckhwtmsjsffDm: JSON.parse(body.jsonckhwtmsjsffDm).bgh,
          qybltmsryyxm: JSON.parse(body.jsonqybltmsryyxm).bgh,
          qybltmsryysfzjhm: JSON.parse(body.jsonqybltmsryysfzjhm).bgh,
          qybltmsryylxdh: JSON.parse(body.jsonqybltmsryylxdh).bgh,
          qybltmsryexm: JSON.parse(body.jsonqybltmsryexm).bgh,
          qybltmsryesfzjhm: JSON.parse(body.jsonqybltmsryesfzjhm).bgh,
          qybltmsryelxdh: JSON.parse(body.jsonqybltmsryelxdh).bgh,
          fszl: JSON.parse(body.jsonfszl).bgh,
          tsswjgDm1: JSON.parse(body.jsontsswjgDm1).bgh,
          xszzsyhzc: JSON.parse(res.body.jsonxszzsyhzc).bgh?JSON.parse(res.body.jsonxszzsyhzc).bgh.split(','):'',// 享受增值税优惠政策赋值
          cktmsgllx: JSON.parse(res.body.jsoncktmsgllx).bgh?JSON.parse(res.body.jsoncktmsgllx).bgh.split(','):'',// 退税管理类型赋值
          gjysfwysfs: JSON.parse(res.body.jsongjysfwysfs).bgh?JSON.parse(res.body.jsongjysfwysfs).bgh.split(','):'',// 国际运输服务
          yfsjfw: JSON.parse(res.body.jsonyfsjfw).bgh?JSON.parse(res.body.jsonyfsjfw).bgh.split(','):'',// 向境外单位提供的完全
          lslysfw: [JSON.parse(res.body.jsonlslysfw).bgh],// 提供零税率服务赋值
        }
        setFormValue(obj)
        formData.setFieldsValue(obj);
        // 是否提供零税率应税服务为是
        if(JSON.parse(body.jsontglslysfwbz).bgh === 'Y'){
          setFlagLsl(false);
        } else {
          setFlagLsl(true);
        }
        if(JSON.parse(res.body.jsonlslysfw).bgh?.replace(/^\s*|\s*$/g,"")){
          setHtysCheck(true);
        } else {
          setHtysCheck(false);
        }
        if(JSON.parse(res.body.jsongjysfwysfs).bgh?.replace(/^\s*|\s*$/g,"")){
          setGjysCheck(true);
          setFlagGjys(false)
        } else {
          setGjysCheck(false);
          setFlagGjys(true)
        }
        // 向境外单位提供的完全
        if(JSON.parse(res.body.jsonyfsjfw).bgh?.replace(/^\s*|\s*$/g,"")){
          setJwdwCheck(true);
          setFlagJwdw(false)
        } else {
          setJwdwCheck(false);
          setFlagJwdw(true)
        }
      } else {
        message.error(desc);
      }
    })
  }

  // 保存
  const save = () => {
    formSearch.validateFields().then((time: any) => {
      let tbrq1 = time.tbrq1;
      tbrq1 = tbrq1? moment(tbrq1).format('YYYY-MM-DD') : '';
      formData.validateFields().then((values: any) => {
        if(validateHgqyDm(values.hgqyDm)){
          message.info('海关企业代码长度应为10位或18位。');
          return;
        }
        if(validateXm(values.qybltmsryyxm) || validateXm(values.qybltmsryexm)) {
          message.info('请输入正确的姓名。');
          return;
        }
        if(validateidCard(values.qybltmsryysfzjhm) || validateidCard(values.qybltmsryesfzjhm)) {
          message.info('请输入正确的身份证号码。');
          return;
        }
        const data = values;
        data.tbrq1 = tbrq1;
        // 享受增值税优惠政策
        const jsonxszzsyhzc = JSON.parse(data.jsonxszzsyhzc)
        jsonxszzsyhzc.bgh = data?.xszzsyhzc.toString();
        data.jsonxszzsyhzc = JSON.stringify(jsonxszzsyhzc);
        // 退税管理类型
        const jsoncktmsgllx = JSON.parse(data.jsoncktmsgllx)
        jsoncktmsgllx.bgh = data?.cktmsgllx.toString();
        data.jsoncktmsgllx = JSON.stringify(jsoncktmsgllx);
        // 是否提供零税率应税服务
        const jsontglslysfwbz = JSON.parse(data.jsontglslysfwbz);
        jsontglslysfwbz.bgh = data?.tglslysfwbz?.toString();
        data.jsontglslysfwbz = JSON.stringify(jsontglslysfwbz);

        // 提供应税服务代码
        const jsonlslysfw = JSON.parse(data.jsonlslysfw);
        let arr = [];

        if(gjysCheck){
          arr.push('01')
        }
        if(htysCheck) {
          arr.push('02')
        }
        if(jwdwCheck) {
          arr.push('03')
        }
        jsonlslysfw.bgh = arr.toString();
        data.jsonlslysfw = JSON.stringify(jsonlslysfw);
        // 国际运输服务
        const jsongjysfwysfs = JSON.parse(data.jsongjysfwysfs)
        jsongjysfwysfs.bgh = data?.gjysfwysfs?.toString();
        data.jsongjysfwysfs = JSON.stringify(jsongjysfwysfs);
        // 向境外单位提供的完全
        const jsonyfsjfw = JSON.parse(data.jsonyfsjfw);
        jsonyfsjfw.bgh = data?.yfsjfw?.toString();
        data.jsonyfsjfw = JSON.stringify(jsonyfsjfw);
        // 企业类型
        const jsoncktsqylxDm = JSON.parse(data.jsoncktsqylxDm);
        jsoncktsqylxDm.bgh = data?.cktsqylxDm?.toString();
        data.jsoncktsqylxDm = JSON.stringify(jsoncktsqylxDm);
        // 退（免）税计算方法
        const jsonckhwtmsjsffDm = JSON.parse(data.jsonckhwtmsjsffDm);
        jsonckhwtmsjsffDm.bgh = data?.ckhwtmsjsffDm?.toString();
        data.jsonckhwtmsjsffDm = JSON.stringify(jsonckhwtmsjsffDm);
        // 海关代码hgqyDm
        const jsonhgqyDm= JSON.parse(data.jsonhgqyDm);
        jsonhgqyDm.bgh = data?.hgqyDm?.toString();
        data.jsonhgqyDm = JSON.stringify(jsonhgqyDm);
        // 退税税务机关代码tsswjgDm1
        const jsontsswjgDm1= JSON.parse(data.jsontsswjgDm1);
        jsontsswjgDm1.bgh = data?.tsswjgDm1?.toString();
        data.jsontsswjgDm1 = JSON.stringify(jsontsswjgDm1);       
        // 对外贸易经营者备案登记表编号
        const jsondwmyjyzbadjbbh = JSON.parse(data.jsondwmyjyzbadjbbh);
        jsondwmyjyzbadjbbh.bgh = data?.dwmyjyzbadjbbh?.toString();
        data.jsondwmyjyzbadjbbh = JSON.stringify(jsondwmyjyzbadjbbh);
        // 开户银行tskhyhmc
        const jsontskhyhmc = JSON.parse(data.jsontskhyhmc);
        jsontskhyhmc.bgh = data?.tskhyhmc?.toString();
        data.jsontskhyhmc = JSON.stringify(jsontskhyhmc);
        // 开户银行账号tskhyhzh
        const jsontskhyhzh = JSON.parse(data.jsontskhyhzh);
        jsontskhyhzh.bgh = data?.tskhyhzh?.toString();
        data.jsontskhyhzh = JSON.stringify(jsontskhyhzh);
        // 姓名qybltmsryyxm
        const jsonqybltmsryyxm = JSON.parse(data.jsonqybltmsryyxm);
        jsonqybltmsryyxm.bgh = data?.qybltmsryyxm?.toString();
        data.jsonqybltmsryyxm = JSON.stringify(jsonqybltmsryyxm);
        // 身份证号码qybltmsryysfzjhm
        const jsonqybltmsryysfzjhm= JSON.parse(data.jsonqybltmsryysfzjhm);
        jsonqybltmsryysfzjhm.bgh = data?.qybltmsryysfzjhm?.toString();
        data.jsonqybltmsryysfzjhm = JSON.stringify(jsonqybltmsryysfzjhm);
        // 姓名qybltmsryexm
        const jsonqybltmsryexm= JSON.parse(data.jsonqybltmsryexm);
        jsonqybltmsryexm.bgh = data?.qybltmsryexm?.toString();
        data.jsonqybltmsryexm = JSON.stringify(jsonqybltmsryexm);
        // 身份证号码qybltmsryesfzjhm
        const jsonqybltmsryesfzjhm= JSON.parse(data.jsonqybltmsryesfzjhm);
        jsonqybltmsryesfzjhm.bgh = data?.qybltmsryesfzjhm?.toString();
        data.jsonqybltmsryesfzjhm = JSON.stringify(jsonqybltmsryesfzjhm);
        // 电话qybltmsryylxdh
        const jsonqybltmsryylxdh = JSON.parse(data.jsonqybltmsryylxdh);
        jsonqybltmsryylxdh.bgh = data?.qybltmsryylxdh?.toString();
        data.jsonqybltmsryylxdh = JSON.stringify(jsonqybltmsryylxdh);
        // 电话qybltmsryelxdh
        const jsonqybltmsryelxdh = JSON.parse(data.jsonqybltmsryelxdh);
        jsonqybltmsryelxdh.bgh = data?.qybltmsryelxdh?.toString();
        data.jsonqybltmsryelxdh = JSON.stringify(jsonqybltmsryelxdh);
        // 资料fszl
        const jsonfszl = JSON.parse(data.jsonfszl);
        jsonfszl.bgh = data?.fszl?.toString();
        data.jsonfszl = JSON.stringify(jsonfszl);


        data.cktmsgllx = data.cktmsgllx?data.cktmsgllx[data.cktmsgllx.length - 1]:'';
        data.gjysfwysfs = data.gjysfwysfs?data.gjysfwysfs[data.gjysfwysfs.length - 1]:'';
        data.lslysfw = jwdwCheck?'03':htysCheck?'02':gjysCheck?'01':'';
        data.xszzsyhzc = data.xszzsyhzc?data.xszzsyhzc[data.xszzsyhzc.length - 1]:'';
        data.yfsjfw = data.yfsjfw?data.yfsjfw[data.yfsjfw.length - 1]:'';
        
        const checkObj = {
          tbrq1,
          uuid: uuidData,
        }
        checkTbrq(checkObj).then((res: any) => {
          const { code, body, desc} = res;
          if(code === '200') {
            checkzxsbbababg(data).then((_response: any) => {
              if(_response.code === '200') {
                saveBabgsjData(data);
              } else if(_response.code === '901') {
                showCheckInfo(_response.msg, data)
              } else {
                message.error(_response.desc)
              }
            })
          } else {
            message.error(desc);
          }
        });
      });
    })
  }

  const showCheckInfo = (msg: any, data: any) => {
    DDAlert.open({
      title: '提示信息',
      info: '消息确认',
      infoType: 'question',
      modalType: 'confirm',
      closeStatus: false,
      okText: '继续',
      content: msg,
      okCallbackFn: function () {
        message.success('成功');
        saveBabgsjData(data);
        DDAlert.close();
      },
    });
  }

  const saveBabgsjData = (data: any) => {
    saveBabgsj(data).then((res: any) => {
      const {code, desc, msg} = res;
      if(code === '200') {
        gridRef.current!.reload();
        setModalVisible(false);
      } else if(code === '900') {
        message.info(msg)
      } else {
        message.error(desc)
      }
    })
  }

  // 姓名校验
  const validateXm = (val: any) => {
    if(val && !val.match(/^[a-zA-Z0-9\u4E00-\u9FA5\uf900-\ufa2d·s]{0,30}$/)) {
      return true;
    } else {
      return false;
    }
  }

  // 验证身份证号是否有效
  const validateidCard = (val: any) => {
    if(val && !val.match(/(^[0-9]{15}$)|(^[0-9]{18}$)|(^[0-9]{17}([0-9]|X|x)$)/)) {
      return true;
    } else {
      return false;
    }
  }

  // 校验海关企业代码长度
  const validateHgqyDm = (val: any) => {
    // 海关企业代码长度应为10位或18位
    if (val && val.length != 10 && val.length != 18) {
      return true
    } else {
      return false
    }
  }

  // 绑定失焦事件 判AsyncGeneratorFunction断当前日期是否已申报数据 申请日期
  const onBlurTbrq1 = (e: any) => {
    let str = e.target.value;
    if(str){
      str = str?.replace(/\s/g, '');
      str = str?.replace(new RegExp('-', 'g'), '');
      const dateObj = myUtil.date.parseDate(str, 'yyyy-MM-DD');
      formSearch.setFieldsValue({
        tbrq1: moment(dateObj).format('YYYY-MM-DD')
      })
    }
  }

  // 提供零税率事件
  const onChangeTglsl = (e: any) => {
    setFlagGjys(true);
    setFlagJwdw(true);
    formData.setFieldsValue({gjysfwysfs: [], yfsjfw: [], lslysfw: [] })
    setHtysCheck(false);
    setGjysCheck(false);
    setJwdwCheck(false);
    if(e.target.value === 'Y') {
      setFlagLsl(false)
    } else {
      setFlagLsl(true)
    }
    // const name = e.target.name;
    // const arr: any = document.getElementById(name)!.getElementsByClassName('ant-radio-wrapper');
    // arr.forEach((item: any, index: any) => {
    //   document.getElementById(name)!.getElementsByClassName('ant-radio-wrapper')[index].style.color = 'red'
    // })
  }

  // 航天运输
  const onChangeHtys = (e: any) => {
    setHtysCheck(e.target.checked);
  }

  // 国际运输
  const onChangeGjys = (e: any) => {
    setGjysCheck(e.target.checked);
    formData.setFieldsValue({gjysfwysfs: []})
    changeCheckColor([], 'gjysfwysfs');
    if(e.target.checked) {
      setFlagGjys(false)
    } else {
      setFlagGjys(true)
    }
  }

  // 境外单位
  const onChangeJwdw = (e: any) => {
    setJwdwCheck(e.target.checked)
    formData.setFieldsValue({yfsjfw: []});
    changeCheckColor([], 'yfsjfw');
    if(e.target.checked) {
      setFlagJwdw(false)
    } else {
      setFlagJwdw(true)
    }
  }

  // 改变颜色
  const blurColor =  (e: any) => {
    // const index = e.target.id?e.target.id:e.target.name;
    // const val = formValue[index];
    // if(e.target.value != val) {
    //   document.getElementById(index)!.style.color = "red";
    // } else {
    //   document.getElementById(index)!.style.color = "#333";
    // }
  } 

  const changeColor = (e: any) => {
    // const name = e.target.name;
    // const arr: any = document.getElementById(name)!.getElementsByClassName('ant-radio-wrapper');
    // arr.forEach((item: any, index: any) => {
    //   arr[index].style.color = 'red';
    // })
  }

  const changeCheckColor = (e:any, name:any) => {
    // const arr: any = document.getElementById(name)!.getElementsByClassName('ant-checkbox-wrapper');
    // arr.forEach((item: any, index: any) => {
    //   arr[index].style.color = 'red';
    // })
  }

  return (
    <Modal
      title="退（免）税备案变更采集"
      centered
      destroyOnHidden
      visible={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      onCancel={() => setModalVisible(false)}
      footer={(
        <div style={{textAlign: 'center'}}>
          <Button type="primary" onClick={save}>保存</Button>
          <Button type="default" onClick={() => setModalVisible(false)}>关闭</Button>
        </div>
      )}
      wrapClassName='standard-modal-1'
    >
      <h1 style={{textAlign: 'center'}}>
      出口退（免）税备案变更申请表
      </h1>
      <ProCard split="horizontal" className="dd_layout_form_01">
        <div className="print-form-hzb-wrap">
          <div className="print-search-sqrq">
            <Form layout="inline" form={formSearch} style={{float: 'right', marginRight: '-15px'}}>
              <Form.Item className="form-item" name="tbrq1" label="申请日期" rules={[{ required: true }]}> 
                {/* <Input type="link" onBlur={onBlurTbrq1} /> */}
                <DatePicker />
              </Form.Item>
            </Form>
          </div>
          <Form form={formData}>
            <table className="print-table print-table-hzb">
              <tr>
                <td className="label text-center" colSpan={2}>统一社会信用代码/纳税人识别号</td>
                <td className="Input-wrap" colSpan={3}>
                  <Form.Item className="input-disabled" name="shxydm">
                    <Input disabled />
                  </Form.Item>
                </td>
              </tr>
              <tr>
                <td className="label text-center" colSpan={2}>纳税人名称</td>
                <td className="Input-wrap" colSpan={3}>
                  <Form.Item className="input-disabled" name="nsrmc">
                    <Input disabled />
                  </Form.Item>
                </td>
              </tr>
              <tr>
                <td className="label text-center" colSpan={2}>海关企业代码</td>
                <td className="Input-wrap Input-hover" colSpan={3}>
                <Form.Item className="form-item" name="jsonhgqyDm" style={{display: 'none'}}>
                    <Input type="hidden" />
                  </Form.Item>
                  <Form.Item className="form-item" name="hgqyDm">
                    <Input maxLength={18} onBlur={blurColor} className="change-hover" />
                  </Form.Item>
                </td>
              </tr>
              <tr>
                <td className="label text-center" colSpan={2}>退税税务机关代码</td>
                <td className="Input-wrap Input-hover" colSpan={3}>
                  <Form.Item className="form-item" name="jsontsswjgDm1" style={{display: 'none'}}>
                    <Input type="hidden" />
                  </Form.Item>
                  <Form.Item className="form-item" name="tsswjgDm1">
                    <Input maxLength={11} onBlur={blurColor} />
                  </Form.Item>
                </td>
              </tr>
              <tr>
                <td className="label text-center" colSpan={2}>对外贸易经营者备案登记表编号</td>
                <td className="Input-wrap Input-hover" colSpan={3}>
                  <Form.Item className="form-item" name="jsondwmyjyzbadjbbh" style={{display: 'none'}}>
                    <Input type="hidden" />
                  </Form.Item>
                  <Form.Item className="form-item" name="dwmyjyzbadjbbh">
                    <Input  maxLength={30} onBlur={blurColor} />
                  </Form.Item>
                </td>
              </tr>
              <tr>
                <td className="label text-center" colSpan={2}>企业类型</td>
                <td className="Input-wrap paddingLeft Input-hover" colSpan={3}>
                  <Form.Item className="form-item" name="jsoncktsqylxDm" style={{display: 'none'}}>
                    <Input type="hidden" />
                  </Form.Item>
                  <Form.Item className="form-item" name="cktsqylxDm">
                    <Radio.Group onChange={changeColor} id="cktsqylxDm" name="cktsqylxDm">
                      {cktsqylxList.map((item: any) => (
                        <Radio key={item.code} value={item.code}>{item.name}</Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                </td>
              </tr>
              <tr>
                <td className="label text-center" colSpan={2}>退税开户银行</td>
                <td className="Input-wrap Input-hover" colSpan={3}>
                  <Form.Item className="form-item" name="jsontskhyhmc" style={{display: 'none'}}>
                    <Input type="hidden" />
                  </Form.Item>
                  <Form.Item className="form-item" name="tskhyhmc">
                    <Input maxLength={80} onBlur={blurColor} />
                  </Form.Item>
                </td>
              </tr>
              <tr>
                <td className="label text-center" colSpan={2}>退税开户银行账号</td>
                <td className="Input-wrap Input-hover" colSpan={3}>
                  <Form.Item className="form-item" name="jsontskhyhzh" style={{display: 'none'}}>
                    <Input type="hidden" />
                  </Form.Item>
                  <Form.Item className="form-item" name="tskhyhzh">
                    <Input maxLength={50} onBlur={blurColor} />
                  </Form.Item>
                </td>
              </tr>
              <tr>
                <td className="label text-center" rowSpan={4} style={{width: '180px'}}>办理退（免）税人员</td>
                <td className="label text-center">姓名</td>
                <td className="Input-wrap Input-hover">
                  <Form.Item className="form-item" name="jsonqybltmsryyxm" style={{display: 'none'}}>
                    <Input type="hidden" />
                  </Form.Item>
                  <Form.Item className="form-item" name="qybltmsryyxm">
                    <Input maxLength={30} onBlur={blurColor} />
                  </Form.Item>
                </td>
                <td className="label text-center" rowSpan={2}>电话</td>
                <td className="Input-wrap Input-hover" rowSpan={2}>
                  <Form.Item className="form-item" name="jsonqybltmsryylxdh" style={{display: 'none'}}>
                    <Input type="hidden" />
                  </Form.Item>
                  <Form.Item className="form-item" name="qybltmsryylxdh">
                    <Input maxLength={11} onBlur={blurColor} />
                  </Form.Item>
                </td>
              </tr>
              <tr>
                <td className="label text-center">身份证号</td>
                <td className="Input-wrap Input-hover">
                  <Form.Item className="form-item" name="jsonqybltmsryysfzjhm" style={{display: 'none'}}>
                    <Input type="hidden" />
                  </Form.Item>
                  <Form.Item className="form-item" name="qybltmsryysfzjhm" >
                    <Input maxLength={30} onBlur={blurColor} />
                  </Form.Item>
                </td>
              </tr>
              <tr>
                <td className="label text-center">姓名</td>
                <td className="Input-wrap Input-hover">
                  <Form.Item className="form-item" name="jsonqybltmsryexm" style={{display: 'none'}}>
                    <Input type="hidden" />
                  </Form.Item>
                  <Form.Item className="form-item" name="qybltmsryexm">
                    <Input maxLength={30} onBlur={blurColor} />
                  </Form.Item>
                </td>
                <td className="label text-center" rowSpan={2}>电话</td>
                <td className="Input-wrap Input-hover" rowSpan={2}>
                  <Form.Item className="form-item" name="jsonqybltmsryelxdh" style={{display: 'none'}}>
                    <Input type="hidden" />
                  </Form.Item>
                  <Form.Item className="form-item" name="qybltmsryelxdh">
                    <Input maxLength={11} style={{height: '80'}} onBlur={blurColor} />
                  </Form.Item>
                </td>
              </tr>
              <tr>
                <td className="label text-center">身份证号</td>
                <td className="Input-wrap Input-hover">
                  <Form.Item className="form-item" name="jsonqybltmsryesfzjhm" style={{display: 'none'}}>
                    <Input type="hidden" />
                  </Form.Item>
                  <Form.Item className="form-item" name="qybltmsryesfzjhm">
                    <Input maxLength={30} onBlur={blurColor} />
                  </Form.Item>
                </td>
              </tr>
              <tr>
                <td className="label text-center" colSpan={2}>退（免）税计算方法</td>
                <td className="Input-wrap paddingLeft  Input-hover" colSpan={3}>
                  <Form.Item className="form-item" name="jsonckhwtmsjsffDm" style={{display: 'none'}}>
                    <Input type="hidden" />
                  </Form.Item>
                  <Form.Item className="form-item" name="ckhwtmsjsffDm">
                    <Radio.Group onChange={changeColor} id="ckhwtmsjsffDm" name="ckhwtmsjsffDm">
                      {ckhwtmsjsffList.map((item: any) => (
                        <Radio key={item.code} value={item.code}>{item.name}</Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                </td>
              </tr>
              <tr>
                <td className="label text-center">享受增值税优惠政策</td>
                <td className="Input-wrap paddingLeft  Input-hover" colSpan={4}>
                  <Form.Item className="form-item" name="jsonxszzsyhzc" style={{display: 'none'}}>
                    <Input type="hidden" />
                  </Form.Item>
                  <Form.Item className="form-item" name="xszzsyhzc">
                    <Checkbox.Group name="xszzsyhzc" onChange={(e)=>changeCheckColor(e, 'xszzsyhzc')}>
                      {xszzsyhzcqkList.map((item: any) => (
                        <Checkbox key={item.code} value={item.code}>{item.name}</Checkbox>
                      ))}
                    </Checkbox.Group>
                  </Form.Item>
                </td>
              </tr>
              <tr>
                <td className="label text-center" style={{height:'100px'}}>退税管理类型</td>
                <td className="Input-wrap paddingLeft  Input-hover" colSpan={4}>
                  <Form.Item className="form-item" name="jsoncktmsgllx" style={{display: 'none'}}>
                    <Input type="hidden" />
                  </Form.Item>
                  <Form.Item className="form-item" name="cktmsgllx">
                    <Checkbox.Group className="specialCheck" name="cktmsgllx" onChange={(e)=>changeCheckColor(e, 'cktmsgllx')}>
                      {cktmsgllxList.map((item: any) => (
                        <Checkbox key={item.code} value={item.code}>{item.name}</Checkbox>
                      ))}
                    </Checkbox.Group>
                  </Form.Item>
                </td>
              </tr>
              <tr>
                <td className="label text-center">是否提供零税率应税服务</td>
                <td className="Input-wrap paddingLeft  Input-hover" colSpan={4}>
                  <Form.Item className="form-item" name="jsontglslysfwbz" style={{display: 'none'}}>
                    <Input type="hidden" />
                  </Form.Item>
                  <Form.Item className="form-item" name="tglslysfwbz" rules={[{ required: true }]}>
                    <Radio.Group onChange={onChangeTglsl} defaultValue='N' id="tglslysfwbz" name="tglslysfwbz">
                      <Radio value='Y'>是</Radio>
                      <Radio value='N'>否</Radio>
                    </Radio.Group>
                  </Form.Item>
                </td>
              </tr>
              <tr>
                <td className="label text-center" rowSpan={3}>提供应税服务代码
                  <Form.Item className="form-item" name="jsonlslysfw" style={{display: 'none'}}>
                    <Input type="hidden" />
                  </Form.Item>
                </td>
                <td className="Input-wrap paddingLeft Input-hover" style={{width: '200px'}}>
                  <Form.Item className="form-item" name="lslysfw">
                    <Checkbox value='02' disabled={flagLsl} onChange={onChangeHtys} checked={htysCheck}>航天运输</Checkbox>
                  </Form.Item>
                </td>
                <td colSpan={3}></td>
              </tr>
              <tr>
                <td className="Input-wrap paddingLeft Input-hover">
                  <Form.Item className="form-item" name="lslysfw">
                    <Checkbox value='01' disabled={flagLsl} onChange={onChangeGjys} checked={gjysCheck}>国际运输服务</Checkbox>
                  </Form.Item>
                </td>
                <td className="Input-wrap paddingLeft Input-hover" colSpan={3} style={{height:'80px'}}>
                  <Form.Item className="form-item" name="jsongjysfwysfs" style={{display: 'none'}}>
                    <Input type="hidden" />
                  </Form.Item>
                  <Form.Item className="form-item" name="gjysfwysfs">
                    <Checkbox.Group disabled={flagGjys} name="gjysfwysfs" onChange={(e)=>changeCheckColor(e, 'gjysfwysfs')}>
                      {gjysfwysfsList.map((item: any) => (
                        <Checkbox key={item.code} value={item.code}>{item.name}</Checkbox>
                      ))}
                    </Checkbox.Group>
                  </Form.Item>
                </td>
              </tr>
              <tr>
                <td className="Input-wrap paddingLeft Input-hover">
                  <Form.Item className="form-item" name="lslysfw">
                    <Checkbox value='03' disabled={flagLsl} onChange={onChangeJwdw} checked={jwdwCheck}>向境外单位提供的完全<br/>在境外消费的下列服务</Checkbox>
                  </Form.Item>
                </td>
                <td className="Input-wrap paddingLeft Input-hover" colSpan={3} style={{height:'190px'}}>
                  <Form.Item className="form-item" name="jsonyfsjfw" style={{display: 'none'}}>
                    <Input type="hidden" />
                  </Form.Item>
                  <Form.Item className="form-item" name="yfsjfw">
                    <Checkbox.Group className="specialCheck02" disabled={flagJwdw} name="yfsjfw" onChange={(e)=>changeCheckColor(e, 'yfsjfw')}>
                      {yfsjfwList.map((item: any) => (
                        <Checkbox key={item.code} value={item.code}>{item.yfsjfwsm}</Checkbox>
                      ))}
                    </Checkbox.Group>
                  </Form.Item>
                </td>
              </tr>
              <tr>
                <td className="label text-center" colSpan={2}>附送资料</td>
                <td className="Input-wrap Input-hover" colSpan={3}>
                  <Form.Item className="form-item" name="jsonfszl" style={{display: 'none'}}>
                    <Input type="hidden" />
                  </Form.Item>
                  <Form.Item className="form-item" name="fszl">
                    <Input maxLength={50} onBlur={blurColor} />
                  </Form.Item>
                </td>
              </tr>
            </table>
          </Form>
        </div>
      </ProCard>
    </Modal>
  );
};

export default DrawerList;
