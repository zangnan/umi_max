/**
 * 备案单证 资料预览
 */
import cktsUtil from '@/pages/hts/cktsUtil';
import React, { useImperativeHandle, useRef, useState } from 'react';
import { Form, message, Modal, Space, Spin, TreeSelect, Button, Dropdown, Menu, Typography, Divider, AutoComplete, Input, Select } from 'antd';
import { DeleteOutlined, ArrowDownOutlined, EyeOutlined, MoreOutlined, LeftOutlined, RightOutlined, PlusOutlined, HighlightOutlined, ProfileOutlined } from '@ant-design/icons';
import CONSTANTS from '@/components/DDAssist/constants';
import ProCard from '@ant-design/pro-card';
import '../zlgd/style.less';
import style from '../zlgd/style.less';
import smyStyles from './smyStyless.less';
import DzglImport from "@/pages/hts/badz/badzcommon/dzglImport";
import DzglSmy from "@/pages/hts/badz/badzcommon/dzglSmy";
import { badzZlgdYl, badzZlgdYlCkxq, getDzmcTree, badzDzbaZlcjJcgljk, dzbadzglxz, xxybc, tzsx, } from "@/pages/hts/services/htsApi";
import { getGridData } from '@/pages/hts/services/htsApi';
import { useIntl } from 'umi';
import DDAlert from '@/pages/hts/components/DDAlert';
import { arrayMove, sortableContainer, sortableElement } from 'react-sortable-hoc';
import { history } from 'umi';
import myUtil from '@/components/DDAssist/util';
import { TreeNodeProps } from 'rc-tree-select/lib/TreeNode';

const { TreeNode } = TreeSelect;

const SortableContainer = sortableContainer(({ children }) => {
  return <div>{children}</div>;
});

export interface BadzZlylProps {
  onRef?: any;
  visible?: any;
  gnmk?: any;
}

const BadzZlyl: React.FC<BadzZlylProps> = ({ onRef, visible = false, gnmk }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [masker, setMasker] = useState<boolean>(false); // 蒙板
  const [xqMasker, setXqMasker] = useState<boolean>(false); // 详情蒙板
  const [filterForm] = Form.useForm(); // 输入框form
  const [xqForm] = Form.useForm(); // 输入框form
  const [mainUnitRef, setMainUnitRef] = useState<any>("");// 主列表刷新使用
  const [formDate, setFormDate] = useState<any>("");// 报关单号
  const dzlgImportRef: any = useRef();
  const dzlgSmyRef: any = useRef();
  const intl = useIntl(); // 提示信息
  const [dzmcTree, setDzmcTree] = useState<any>([]); // 单证名称树
  const [dzData, setdzData] = useState<any>([]); // 单证数据

  const [bgdDate, setBgdDate] = useState<any>([]); // 报关单下拉数据
  const [openLx, setOpenLx] = useState<string>(''); // 点击图标展示页面 // sm:扫描仪  dr:导入 zlgd: 资料归档
  const [xqModalVisible, setXqModalVisible] = useState<boolean>(false); // 详情弹窗是否显示
  const [xqData, setXqData] = useState<any>({}); // 详情数据
  const [badzbgduuid, setBadzbgduuid] = useState<string>('');

  // 开启
  const showModal = (param: any, mainUnitRef: any, param1: any) => {
    mainUnitRef?.current?.reload2();
    if (param) {
      setFormDate(param);
      
      initBgdbh(param.ssq, param.sbpc);
      setBadzbgduuid(param?.badzbgduuid);
    }
    setMainUnitRef(mainUnitRef);
    setModalVisible(true);
    setOpenLx(param1);
    // 单证备案 资料采集
    filterForm.setFieldsValue(param);
    // 单证名称树初始化
     var flag = "";
    if(param?.dlckhwzmbz=='N'){
      flag="ZYCK"
    }else{
      flag="WTCK"
    }
    const obj = {
      codeStoreKey: 'TREE_BADZ_CS_ZXSB_BADZLX_ALL',
      codeViewKey:param?.lcswsxDm+flag
    }
    getDzmcTree(obj).then((response) => {
      if (response.code === '200') {
        setDzmcTree(response.body);
      } else {
        message.error(response.desc);
      }
    });
    initZlgdYl(param);
  };

  //初始化bdgbh
  const initBgdbh = (ssq: any, sbpc: any) => {
    const qylx = cktsUtil.sys.enterpriseType();
    const data = qylx === "WM"?{ "key": "CX_BADZ_ZXSB_BADZ_BGD", "searchModel": [{ "type": 1, "property": "ssq", "value": ssq, "op": "al" },{ "type": 1, "property": "sbpc", "value": sbpc, "op": "al" }], "orderModel": [], "headerSearchModel": [] ,"pageSize":100000000,"page":1}
    : { "key": "CX_BADZ_ZXSB_BADZ_BGD", "searchModel": [{ "type": 1, "property": "ssq", "value": ssq, "op": "al" }], "orderModel": [], "headerSearchModel": [],"pageSize":100000000,"page":1 };
    getGridData(`/hx/ty/crud/queryPager`, data).then((response) => {
      const { code, body, desc } = response;
      if ("200" == code) {
        setBgdDate(body?.rows);
      } else {
        message.error(desc);
      }
    })
  }

  // 初始化单证数据
  const initZlgdYl = (param: any) => {
    let flag = 'Y';
    const search = history.location?.pathname;
    if (search.search("zlgd") != -1 || search.search("abgddy") != -1) {
      flag = 'N';
    }
    const obj = {
      badzbgduuid: param.badzbgduuid,
      dlckhwzmbz: param.dlckhwzmbz,
      sfzsqbdzfl: flag,    // 是否展示全部单证分类
      badzlxDm: '',       // 备案单证类型代码
    }
    badzZlgdYl(obj).then((response) => {
      if (response.code === '200') {
        setdzData(response.body);
      } else {
        setdzData([]);
        message.error(response.desc);
      }
    });
  }

  // 点击子页面中保存并返回时刷新预览页面（防止在子页面点击报关单切换与子页面信息不一致）
  const init = (param: any) => {
    setFormDate(param);
    filterForm.setFieldsValue(param);
    initZlgdYl(param);
  }

  // 关闭Modal
  const closeModal = () => {
    setMasker(false);
    setXqMasker(false);
    filterForm.setFieldsValue({});
    xqForm.setFieldsValue({});
    mainUnitRef?.current?.reload2();
    setFormDate("");
    setDzmcTree([]);
    setdzData([]);
    setBgdDate([]);
    setOpenLx('');
    setXqData({});
    setModalVisible(false);
  }

  useImperativeHandle(onRef, () => {
    return {
      showModal,
      closeModal,
      init,
    };
  });

  // 点击文件夹查看文件
  const zlbaYlFolderOnBlur = (param: any) => {
    // 根据uuid查询详细数据
    setMasker(true);
    const obj = {
      badzuuid: param.badzuuid,
    }
    badzZlgdYlCkxq(obj).then((response) => {
      setMasker(false);
      if (response.code === '200') {
        // 打开导入弹窗
        dzlgImportRef.current!.showModal({ ref: mainUnitRef, data: response.body }, onRef, formDate, openLx);
      } else {
        message.error(response.msg);
      }
    });
  };

  // 根据单证名称筛选
  const zlbaYlDzmcSelect = (value: any, label: any, extra: any) => {
    // 根据单证名称，单证数据初始化
    setMasker(true);
    badzZlgdYl(label[0]).then((response) => {
      setMasker(false);
      if (response.code === '200') {
        setdzData(response.body);
      } else {
        message.error(response.desc);
      }
    });
  };

  // 单证备案，资料采集点击文件夹
  const dzbaZlcjOnClick = async (param: any, param1: any) => {
    const formDate1=formDate;
    const data = await filterForm.validateFields();
    let body = {};
    // 点击文件夹编辑
    if ('edit' === param) {
      setMasker(true);
      await badzZlgdYlCkxq({ 'badzuuid': param1?.badzuuid }).then((response) => {
        setMasker(false);
        if (response.code === '200') {
          body = response.body;
        } else {
          message.error(response.msg);
        }
      });
      if (param1?.jybs == 'N') {
        dzlgImportRef.current!.showModal({ ref: mainUnitRef, data: Object.assign(formDate, body, { badzlxDm: param1?.badzlxDm, bgdhgbh: data?.bgdhgbh, badzbgduuid: badzbgduuid }) }, onRef, '', 'zlgd', bgdDate);
        return;
      }
      if ('dr' === openLx) {
        // 导入
        dzlgImportRef.current!.showModal({ ref: mainUnitRef, data: Object.assign(formDate, body, { badzlxDm: param1?.badzlxDm, bgdhgbh: data?.bgdhgbh, badzbgduuid: badzbgduuid }) }, onRef, '', '', bgdDate);
        return;
      } else if ('sm' === openLx) {
        // 检测高拍仪服务是否启动
        setMasker(true);
        const flag = await checkeServices();
        setMasker(false);
        if (flag === false || flag === undefined) {
          message.info(intl.formatMessage({ id: 'message_badz_common_gpycheck_error' }));
          return;
        }
        dzlgSmyRef.current!.showModal({ ref: mainUnitRef, data: Object.assign(formDate, body, { badzlxDm: param1?.badzlxDm, bgdhgbh: data?.bgdhgbh }) }, onRef, '', '', bgdDate);
        return;
      }
    }
    //新增
    else {
      if ('dr' === openLx) {
        dzlgImportRef.current!.showModal({ ref: mainUnitRef, data: Object.assign({ssq:formDate?.ssq,sbpc:formDate?.sbpc,badzlxDm: param1?.badzlxDm, bgdhgbh: data?.bgdhgbh, badzbgduuid: badzbgduuid }) }, onRef, '', '', bgdDate);
      } else {
        // 检测高拍仪服务是否启动
        setMasker(true);
        const flag = await checkeServices();
        setMasker(false);
        if (flag === false || flag === undefined) {
          message.info(intl.formatMessage({ id: 'message_badz_common_gpycheck_error' }));
          return;
        }
        dzlgSmyRef.current!.showModal({ ref: mainUnitRef, data: Object.assign({ ssq:formDate?.ssq,sbpc:formDate?.sbpc,badzlxDm: param1?.badzlxDm, bgdhgbh: data?.bgdhgbh, badzbgduuid: badzbgduuid }) }, onRef, '', '', bgdDate);
      }
    }
  }

  // 上一单，下一单切换
  const upDownOutBgd = (bgdhgbh: any, badzbgduuid2: any, param: any) => {
    if (param == 'up') {
      if (bgdDate.length ==0 || bgdDate[0].badzbgduuid == badzbgduuid2) {
        message.info('暂无上一单数据！');
        return;
      }
      let mun = 0;
      for (let i = 0; i < bgdDate.length; i++) {
        if (badzbgduuid2 == bgdDate[i].badzbgduuid) {
          mun = i;
          break;
        }
      }
      filterForm.setFieldsValue({ bgdhgbh: bgdDate[mun - 1].bgdhgbh, badzbgduuid: bgdDate[mun - 1].badzbgduuid });
      const data = { 'badzbgduuid': bgdDate[mun - 1].badzbgduuid, 'dlckhwzmbz': bgdDate[mun - 1].dlckhwzmbz};
      setBadzbgduuid(bgdDate[mun - 1].badzbgduuid);
      initZlgdYl(data);
      //formDate.ssq = bgdDate[mun - 1].ssq;
      //formDate.sbpc = bgdDate[mun - 1].sbpc;
      setFormDate(bgdDate[mun - 1])
    } else {
      if (bgdDate.length ==0 || bgdDate[bgdDate.length - 1].badzbgduuid == badzbgduuid2) {
        message.info('暂无下一单数据！');
        return;
      }
      let mun = 0;
      for (let i = 0; i < bgdDate.length; i++) {
        if (badzbgduuid2 == bgdDate[i].badzbgduuid) {
          mun = i;
          break;
        }
      }
      filterForm.setFieldsValue({ bgdhgbh: bgdDate[mun + 1].bgdhgbh, badzbgduuid: bgdDate[mun + 1].badzbgduuid });
      const data = { 'badzbgduuid': bgdDate[mun + 1].badzbgduuid, 'dlckhwzmbz': bgdDate[mun + 1].dlckhwzmbz };
      setBadzbgduuid(bgdDate[mun + 1].badzbgduuid);
      initZlgdYl(data);
      //formDate.ssq = bgdDate[mun + 1].ssq;
      //formDate.sbpc = bgdDate[mun + 1].sbpc;
      setFormDate(bgdDate[mun + 1])
    }
  }

  // // 报关单查询
  const handleSearch = (value: any, param: any) => {
    const key = param?.key;
    const data = { 'badzbgduuid': key };
    filterForm.setFieldsValue({ "badzlxDm": "", "badzbh": "", "ywbh": "", "badzsm": "" ,badzbgduuid:key,});
    initZlgdYl(data);
  }

  // 增加锚点
  const scrollOther = (id: any) => {
    const otherDocument = document.getElementById(id);
    if (otherDocument) {
      otherDocument.scrollIntoView();
    }
  }

  const renderTreeNodes = (data: any) =>
    data.map((item: JSX.IntrinsicAttributes & TreeNodeProps & { children?: React.ReactNode; }) => {
      if (item.children) {
        item.disabled = true;
        return (
          <TreeNode key={item.value} title={item.title} value={item.value} disabled={item.disabled}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} key={item.value} title={item.title} value={item.value} />;
    });


  // proCard 左上 输入框
  const proCardTitle = (
    <Form preserve={false} colon={false} layout='inline' form={filterForm} className='gpy_form'>
      {gnmk === 'dzbazlcj' ?
        <Space style={{ height: 30 }}>
          <LeftOutlined onClick={() => upDownOutBgd(filterForm.getFieldValue('bgdhgbh'), filterForm.getFieldValue('badzbgduuid'), 'up')} />
          <Form.Item name='bgdhgbh'>
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="请输入18位或者后4位报关单号"
              filterOption
              onSelect={handleSearch}
              showArrow={false}
            >
              {bgdDate.map((temp: any, index: any) => (<Select.Option key={temp.badzbgduuid} value={temp.bgdhgbh.toString()}> {temp.bgdhgbh} </Select.Option>))}
            </Select>
          </Form.Item>
          <RightOutlined style={{ marginLeft: -20 }} onClick={() => upDownOutBgd(filterForm.getFieldValue('bgdhgbh'), filterForm.getFieldValue('badzbgduuid'), 'down')} />
          <Divider type='vertical' />
          <Form.Item label='单证名称' name='badzlxmc'>
            <TreeSelect showSearch treeNodeFilterProp={'title'} virtual={false} treeDefaultExpandAll={true} dropdownMatchSelectWidth={220} style={{ width: 200 }} onChange={(value: any) => { scrollOther(value); zlbaYlDzmcSelect }}>
              {renderTreeNodes(dzmcTree)}
            </TreeSelect>
          </Form.Item>
        </Space> :
        <>
          <div style={{ paddingTop: 5, marginRight: 10 }}>{formDate.bgdhgbh}&emsp;&emsp;|&emsp;</div>
          <Form.Item label='单证名称' name='badzlxmc'>
            <TreeSelect showSearch treeNodeFilterProp={'title'} virtual={false} treeDefaultExpandAll={true} dropdownMatchSelectWidth={240} style={{ width: 200 }} onChange={(value: any) => { scrollOther(value); zlbaYlDzmcSelect }}>
              {renderTreeNodes(dzmcTree)}
            </TreeSelect>
          </Form.Item>
        </>
      }
    </Form >
  );

  // 删除文件夹询问
  const deleteWjj = (param: any) => {
    DDAlert.open({
      title: '删除',
      info: intl.formatMessage({ id: 'message_badz_delete_wjj' }),
      infoType: 'question',
      modalType: 'confirm',
      closeStatus: false,
      okCallbackFn: function (thisObj: any) {
        thisObj.setState({ masker: true });
        const data = { badzbgduuid: formDate?.badzbgduuid, badzuuids: [param] };
        badzDzbaZlcjJcgljk(data).then((response) => {
          DDAlert.close();
          const { code } = response;
          if (code === '200') {
            const d = [...dzData];
            for (let i = 0; i < d.length; i++) {
              if (d[i].badzuuid = param) {
                d.splice(i, 1);
                setdzData(d);
                break;
              }
            }
            message.success(intl.formatMessage({ id: 'message_delete_success' }));
          } else {
            message.error(intl.formatMessage({ id: 'message_delete_error' }));
          }
        })
      },
    });
  }

  // 下载文件
  const downloadFile = (uuid: any) => {
    const obj = {
      badzuuids: [uuid]
    }
    dzbadzglxz(obj).then((response) => {
      if (response.code === '200') {
        const { blob, fileName } = response.body;
        myUtil.file.downloadZip(blob, fileName);
        //message.success(intl.formatMessage({ id: 'message_common_dlownload_success' }));
      } else {
        message.error(response.desc)
      }
    })
  }

  // 每个文件夹图标生成代码
  const titleMain = (row: any, index: any) => {
    if(moduel && moduel === 'badz') {
      return <div key={index.toString()} className={smyStyles.dd_badz_card} onClick={() => { 'dzbazlcj' === gnmk ? dzbaZlcjOnClick('edit', row) : zlbaYlFolderOnBlur(row) }}>
      <div className={`${smyStyles.dd_badz_card_01}  ${smyStyles.dd_badz_card_folder2}`}>
        <span className={smyStyles.dd_badz_card_xh}>{index + 1}</span>
        <div className={smyStyles.dd_badz_card_folder2}></div>
        <span className={smyStyles.dd_badz_card_icon}>
          <Dropdown placement="bottomRight" overlay={(
            <Menu className="dd_badz_card_btn_r">
              <Menu.Item key="1" onClick={({ domEvent }) => { domEvent.stopPropagation(); downloadFile(row.badzuuid) }}><ArrowDownOutlined />下载</Menu.Item>
              <Menu.Item key="2" onClick={() => { 'dzbazlcj' === gnmk ? dzbaZlcjOnClick('edit', row) : zlbaYlFolderOnBlur(row) }}><EyeOutlined />预览</Menu.Item>
              <Menu.Item key="3" onClick={({ domEvent }) => xxtbc(domEvent, row, index)}><ProfileOutlined />详情</Menu.Item>
              {gnmk === 'zlgdylckxq' ? '' : <Menu.Item key="4" onClick={({ domEvent }) => { domEvent.stopPropagation(); deleteWjj(row.badzuuid) }} ><DeleteOutlined />删除</Menu.Item>}
            </Menu>
          )} >
            <MoreOutlined />
          </Dropdown>
        </span>
      </div>
      {row.ywbh ? <div className={smyStyles.dd_badz_card_02}>{row.ywbh}</div> : <div className={smyStyles.dd_badz_card_02}>&nbsp;</div>}
      <div className={smyStyles.dd_badz_card_03}>{row.lrrq ? myUtil.date.formatDate(row.lrrq, 'YYYY/MM/DD HH:mm') : ''}</div>
    </div>;
    }else{
      return <div key={index.toString()} className={smyStyles.dd_badz_card} onClick={() => { 'dzbazlcj' === gnmk ? dzbaZlcjOnClick('edit', row) : zlbaYlFolderOnBlur(row) }}>
      <div className={`${smyStyles.dd_badz_card_01}  ${smyStyles.dd_badz_card_folder}`}>
        <span className={smyStyles.dd_badz_card_xh}>{index + 1}</span>
        <div className={smyStyles.dd_badz_card_folder}></div>
        <span className={smyStyles.dd_badz_card_icon}>
          <Dropdown placement="bottomRight" overlay={(
            <Menu className="dd_badz_card_btn_r">
              <Menu.Item key="1" onClick={({ domEvent }) => { domEvent.stopPropagation(); downloadFile(row.badzuuid) }}><ArrowDownOutlined />下载</Menu.Item>
              <Menu.Item key="2" onClick={() => { 'dzbazlcj' === gnmk ? dzbaZlcjOnClick('edit', row) : zlbaYlFolderOnBlur(row) }}><EyeOutlined />预览</Menu.Item>
              <Menu.Item key="3" onClick={({ domEvent }) => xxtbc(domEvent, row, index)}><ProfileOutlined />详情</Menu.Item>
              {gnmk === 'zlgdylckxq' ? '' : <Menu.Item key="4" onClick={({ domEvent }) => { domEvent.stopPropagation(); deleteWjj(row.badzuuid) }} ><DeleteOutlined />删除</Menu.Item>}
            </Menu>
          )} >
            <MoreOutlined />
          </Dropdown>
        </span>
      </div>
      {row.ywbh ? <div className={smyStyles.dd_badz_card_02}>{row.ywbh}</div> : <div className={smyStyles.dd_badz_card_02}>&nbsp;</div>}
      <div className={smyStyles.dd_badz_card_03}>{row.lrrq ? myUtil.date.formatDate(row.lrrq, 'YYYY/MM/DD HH:mm') : ''}</div>
    </div>;
    }
    
  }

  //详细页面打开
  const xxtbc = (domEvent: any, row: any, index: any) => {
    xqForm.setFieldsValue({
      badzbh: row.badzbh ? row.badzbh : '',
      ywbh: row.ywbh ? row.ywbh : '',
      badzsm: row.badzsm ? row.badzsm : '',
      xh: index + 1,
      wjgs: row.wjgs ? row.wjgs : 0,
      lrrq: row.lrrq ? myUtil.date.formatDate(row.lrrq, 'YYYY-MM-DD HH:mm') : ''
    });
    domEvent.stopPropagation();
    setXqModalVisible(true);
    setXqData(Object.assign({}, { xh: index + 1 }, row));
  }


  // 可拖拽内容主体
  const SortableItem = sortableElement(({ row, xh }) => {
    return titleMain(row, xh);
  });

  //  拖拽文件重新调整数据
  const gitmen = ({ oldIndex, newIndex }, index: any) => {
    const newData = [...dzData];
    // 获取当前操作最外层数据
    const tempData = newData[index];
    // 根据移动角标重新调整数据中的content
    const newContent = arrayMove(tempData.dzs, oldIndex, newIndex);
    // 将最新的值回写到数组中
    tempData.dzs = newContent;
    // 更新最外层数据
    newData.splice(index, 1, tempData);
    const data = { "badzbgduuid": formDate?.badzbgduuid, "tzsxs": [...newData] };
    tzsx(data).then((response) => {
      const { code, body } = response;
      if (code === '200') {
        setdzData(newData);
        message.success(intl.formatMessage({ id: 'message_ckfp_fppz_common_save_success' }));
      } else {
        message.error(body?.desc);
      }
    })
  }

  // 文件夹可拖拽列表
  const sortTileGruop = () => {
    return <div className={style.tile_group_content_nav}>
      {dzData.map((group: any, index: any) => (
        <div key={index + '1'}>
          <div id={group.badzlxDm} key={index + '2'} className={style.group_tile_c2}>{group.badzlxmc}</div>
          <Space key={index + '3'} size={[0, 0]} wrap className={style.tile_group}>
            <SortableContainer distance={10} onSortEnd={(event: any) => gitmen(event, index)} axis="x" >
              {group.dzs.map((row: any, contIndex: any) => {
                return <SortableItem key={contIndex} index={contIndex} row={row} xh={contIndex} />
              })}
            </SortableContainer>
            <div key={group.length + 1} className={`${smyStyles.dd_badz_card} ${smyStyles.dd_badz_card_upload}`} onClick={() => dzbaZlcjOnClick('add', group)}>
              <div className={`${smyStyles.dd_badz_card_01} ${smyStyles.dd_badz_card_folder_01}`}>
                <PlusOutlined className={`${smyStyles.dd_badz_card_upload_icon}`} />
              </div>
            </div>
          </Space>
        </div>
      ))}
    </div >
  }

  // 每个单证名称展示列
  const getTile = (group: any) => {
    const tileTag: any = [];
    group.forEach((row: any, index: number) => {
      tileTag.push(titleMain(row, index));
    });
    return tileTag;
  };

  // 文件夹列表不可拖拽（资料归档预览使用）
  const tileGruop = (dzData: any) => {
    const groups: any = [];
    dzData.forEach((group: any, index: number) => {
      groups.push(<div id={group.badzlxDm} key={index.toString()} className={style.group_tile_c2}>{group.badzlxmc}</div>);
      groups.push(<Space key={index + '1'} size={[0, 0]} wrap className={style.tile_group}>
        {getTile(group.dzs)}
      </Space>);
    });
    return <div className={style.tile_group_content_nav}>{groups}</div>
  };

  const xqlayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };


  // 详情页面展示内容
  const content = (
    <Form {...xqlayout} form={xqForm}>
      <Form.Item name='xh' label='序号'>
        <Input size='small' disabled={true} />
      </Form.Item>
      <Form.Item name='badzbh' label='单证编号' >
        <Input size='small' disabled={'zlgdylckxq' === gnmk ? true : false} />
      </Form.Item>
      <Form.Item name='ywbh' label='业务编号' >
        <Input size='small' disabled={'zlgdylckxq' === gnmk ? true : false} />
      </Form.Item>
      <Form.Item name='wjgs' label='包含文件' >
        <Input size='small' disabled={true} />
      </Form.Item>
      <Form.Item name='badzsm' label='单证说明' >
        <Input size='small' disabled={'zlgdylckxq' === gnmk ? true : false} />
      </Form.Item>
      <Form.Item name='lrrq' label='创建时间' >
        <Input size='small' disabled={true} />
      </Form.Item>
    </Form>
  );

  // 保存详情修改数据
  const xqSaveModal = async () => {
    const fo = await xqForm.validateFields();
    const data = { 'badzuuid': xqData?.badzuuid, 'badzbh': fo?.badzbh, 'ywbh': fo?.ywbh, 'badzsm': fo?.badzsm };
    setXqMasker(true);
    xxybc(data).then((response) => {
      setXqMasker(false);
      const { code } = response;
      if (code === '200') {
        message.success(intl.formatMessage({ id: 'message_edit_success' }));
        initZlgdYl(formDate);
      } else {
        message.error(intl.formatMessage({ id: 'message_edit_error' }));
      }
      setXqModalVisible(false);
    })
  }


  return (
    <>
      <Modal
        title={<div><span>所属期：{formDate?.ssq}</span>{cktsUtil.sys.enterpriseType()=='WM'?<span style={{ marginLeft: 20 }}>批次：{formDate?.sbpc}</span>:<></>}</div>}
        destroyOnHidden={true}
        visible={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_MAX}
        wrapClassName='standard-modal-1 dd-gpy'
        footer={<Space>
          <Button onClick={() => closeModal()}>关闭</Button>
        </Space>}
        onCancel={() => { closeModal() }}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <ProCard
            title={proCardTitle}
            size="small"
          >
            <div className={style.tile_group_wrap}>
              {'zlgdylckxq' != gnmk ? sortTileGruop() : tileGruop(dzData)}
            </div>
          </ProCard>
        </Spin>
        <Modal
          title='详情'
          destroyOnHidden={true}
          width={CONSTANTS.C_MODAL_WIDTH_X2}
          visible={xqModalVisible}
          footer={
            <Space>
              {'zlgdylckxq' === gnmk ? '' : <Button type='primary' onClick={() => xqSaveModal()}>保存</Button>}
              <Button onClick={() => setXqModalVisible(false)}>关闭</Button>
            </Space>
          }
          onCancel={() => setXqModalVisible(false)}
          className={`${xqMasker ? 'dd_modal_show_masker' : ''}`}
          mask={{ closable: false }}
        >
          <Spin tip="Loading..." spinning={xqMasker} delay={100}>
            {content}
          </Spin>
        </Modal>
        <DzglImport onRef={dzlgImportRef} gnmk={gnmk} />
        <DzglSmy onRef={dzlgSmyRef} gnmk={gnmk} />
      </Modal>
    </>
  );
};
export default BadzZlyl;
