/**
 * 单证管理 上传单证 扫描仪
 */
import { intl } from '@/components/DDAssist/util';
import React, { useImperativeHandle, useState } from 'react';
import { Modal, Button, message, Form, Input, Space, Spin, TreeSelect, Dropdown, Menu, Image, Select, Popover, Checkbox } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import ProCard from '@ant-design/pro-card';
import { getDzmcTree2, jzfjToPath, badzZlgdYlCkxq, funcDzglbc, changeJzfjToPath } from "@/pages/hts/services/htsApi";
import smyStyles from './smyStyless.less';
import myUtil from '@/components/DDAssist/util';
import { MenuUnfoldOutlined, MenuFoldOutlined, MoreOutlined, CameraOutlined, EyeOutlined, DeleteOutlined, ArrowDownOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { CloseOutlined, RedoOutlined, UndoOutlined, ZoomInOutlined, ZoomOutOutlined, FullscreenExitOutlined, SnippetsOutlined, PictureOutlined } from "@ant-design/icons";
import { arrayMove, sortableContainer, sortableElement } from 'react-sortable-hoc';
import DDAlert from '@/pages/hts/components/DDAlert';
import cktsUtil from '@/pages/hts/cktsUtil';
import baseValidator from '@/components/DDAssist/field/baseValidator';

const { TreeNode } = TreeSelect;

const SortableContainer = sortableContainer(({ children }) => {
  return <div>{children}</div>;
});

export interface DzglSmyProps {
  onRef?: any;
  visible?: any;
  gnmk?: string; // 模块类型badzdzgl；单证管理；dzbazlcj：资料采集
}

const DzglSmy: React.FC<DzglSmyProps> = ({ onRef, gnmk, visible = false }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [refUnit, setUnitRef] = useState<any>("");// 主列表刷新使用
  const [ylModalRef, setYlModalRef] = useState<any>("");//
  const [form1] = Form.useForm(); // 输入框form
  // const intl = useIntl(); // 提示信息
  const [masker, setMasker] = useState<boolean>(false); // 蒙板
  const [initData, setInitData] = useState<any>({});// 初始化数据（有选中数据时使用）
  const [dzmcTree, setDzmcTree] = useState<any>([]); // 单证名称树
  const [fullFlag, setFullFlag] = useState<boolean>(false);
  const [date, setDate] = useState<any>([]);
  const [imageModalVisible, setImageModalVisible] = useState<boolean>(false); // 照片预览相册显示
  const [current, setCurrent] = useState<number>(0);// 照片预览检索项
  const [bgdDate, setBgdDate] = useState<any>([]); // 报关单下拉数据
  const [cqValue, setCqValue] = useState<any>([]); // 裁切选中值
  const [beforList, setBeforList] = useState<any>([]); // 文件数组
  const [pdfTilte, setPdfTitle] = useState<any>("pdf");// pdf预览标题
  const [pdfblob, setPdfblob] = useState<any>();
  const [pdfModalVisible, setPdfModalVisible] = useState<boolean>(false); //  pdf预览显示
  const [flagPage, setFlagPage] = useState<any>("");// zlgd: 资料归档
  const [badzbgduuid, setBadzbgduuid] = useState<any>();
  const [dzglbc, setDzglbc] = useState<any>(); //保存报文
  const [filetemp, setFiletemp] = useState<any>();

  // 开启
  const showModal = (param: any, param1: any, param2: any, flag: any, bgdDate: any) => {
    const saveData = { "badzbgduuid": param?.data?.badzbgduuid, "badzuuid": "", "badzlxDm": "", "badzbh": "", "ywbh": "", "badzsm": "", "pzscfsDm": "2", "dlckhwzmbz": "", "badzFjs": [], "scFjs": [] };
    setBadzbgduuid(param?.data?.badzbgduuid);
    setBgdDate(bgdDate);
    setModalVisible(true);
    setUnitRef(param.ref);
    setYlModalRef(param1);
    setFlagPage(flag);
    if (param?.data) {
      setInitData(param?.data);
      saveData.badzuuid = param?.data.badzuuid;
      setDzglbc(saveData);
      form1.setFieldsValue(param?.data);
      getAllHistory(param?.data?.badzFjs).then((res) => {
        // const img = [];
        // const pdf = [];
        // for (let i = 0; i < res?.length; i++) {
        //   if ('1' != res[i].fjgsDm) {
        //     img.push(res[i]);
        //   } else {
        //     pdf.push(res[i]);
        //   }
        // }
        setDate(res);
        setBeforList(res);
      })
    }
    getDzmcTree2({ "codeStoreKey": "TREE_BADZ_CS_ZXSB_BADZLX", "codeViewKey": "" }).then((response) => {
      if (response.code === '200') {
        setDzmcTree(response.body);
      } else {
        message.error(response.desc);
      }
    });
  };
  //根据路径转化地址，同步方法
  async function getAllHistory(param: any) {
    let allHistory: any = []
    param?.forEach((item: any) => {
      if (item?.fjgsDm == '1') {
        allHistory.push(item);
      } else {
        allHistory.push((async (item) => {
          return await getName(item)
        })(item))
      }
    })
    return await Promise.all(allHistory);
  }
  //调用接口返回Promise对象
  function getName(item: any) {
    return new Promise((resolve, reject) => {
      jzfjToPath(item).then((response) => {
        if (response.code === '200') {
          resolve(response.body)
        } else {
          message.error(response.desc);
        }
      })
    })
  }
  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 拍照
  const handle_TakePhoto = async () => {
    const form1Values = form1.getFieldsValue();
    // 单证名称和单证编号没录是不能进行上传
    if (!form1Values.badzlxDm || !form1Values.badzbh || form1Values.badzbh.trim() === '') {
      message.info(intl.formatMessage({ id: 'message_badz_dzgl_gpy_form' }));
      return;
    }
    setMasker(true);
    const temp = await TakePhoto();
    temp.fjxx = temp.thumbUrl;
    temp.fjwjm = temp.name + '.png';
    temp.fjgsDm = '2';
    if (temp) {
      setDate(date.concat(temp));
      setBeforList(date.concat(temp));
      setMasker(false);
    } else {
      setMasker(false);
    }
  };

  // 左转
  const handle_Cam_RotateLeft = async () => {
    setMasker(true);
    const left: any = await Cam_RotateLeft();
    if (left) {
      setMasker(false);
    }
  };

  // 右转
  const handle_Cam_RotateRight = async () => {
    setMasker(true);
    const right: any = await Cam_RotateRight();
    if (right) {
      setMasker(false);
    }
  };

  // 放大
  const handle_Cam_ZoomIn = async () => {
    setMasker(true);
    const zoomIn: any = await Cam_ZoomIn();
    if (zoomIn) {
      setMasker(false);
    }
  };

  // 缩小
  const handle_Cam_ZoomOut = async () => {
    setMasker(true);
    const zoomOut: any = await Cam_ZoomOut();
    if (zoomOut) {
      setMasker(false);
    }
  };

  // 适屏
  const handle_Cam_BestSize = async () => {
    setMasker(true);
    const focus: any = await Cam_BestSize();
    if (focus) {
      setMasker(false);
    }
  };

  // 裁切选中事件
  const cutOnchange = (event: any, param: number) => {
    if (event.target.checked) {
      // 自动裁切
      if (param === 3) {
        Cam_SetCutMode(1);
        setCqValue(3);
      } else if (param === 2) {
        // 手动裁切
        Cam_SetCutMode(2);
        setCqValue(2);
      } else if (param === 1) {
        // 不裁切
        Cam_SetCutMode(0);
        setCqValue(1);
      }
    }
  }

  // 去黑边
  const toSetDeleteBlackEdge = (event: any) => {
    if (event.target.checked) {
      Cam_SetDeleteBlackEdge(1);
    } else {
      Cam_SetDeleteBlackEdge(0);
    }
  }

  // 去底色
  const toSetDeleteBgColor = (event: any) => {
    if (event.target.checked) {
      Cam_SetDeleteBgColor(1);
    } else {
      Cam_SetDeleteBgColor(0);
    }
  }

  // 关闭摄像头
  const handle_CloseCamera = async () => {
    setMasker(true);
    const close: any = await Cam_Close();
    if (close) {
      setMasker(false);
    }
  }

  LoadCameraDocument();

  // 左侧预览打开
  const setFull = (param: any) => {
    setFullFlag(!param);
  }

  // 点击预览
  const preview = (value: any) => {
    if (value.fjgsDm != '1') {
      // const uuid = value.fjuuid;
      // let j = 0;
      // for (let i = 0; i < beforList.length; i++) {
      //   if (uuid == beforList[i].fjuuid) {
      //     j = i;
      //   }
      // }
      // setImageModalVisible(true);
      // setCurrent(j)
      setImageModalVisible(true);
      setFiletemp(value?.fjxx);
    } else if (value.fzcclj) {
      const obj = {
        fzcclj: value.fzcclj,
      }
      setPdfTitle(value.fjwjm);
      changeJzfjToPath(obj).then((response: any) => {
        if (response.code === '200') {
          setPdfModalVisible(true);
          const { code } = response;
          const { blob, fileName } = response.body;
          const bstr = atob(blob);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const fileURL = URL.createObjectURL(new Blob([u8arr], { type: 'application/pdf' }));
          // by lincb 修改pdf获取路径
          setPdfblob(cktsUtil.getPdfLj()+`?file=${fileURL}&name=${fileName}`);

          // if(moduel && moduel === 'badz') {
          //   setPdfblob(`/front/badz/pdfjs/web/viewer.html?file=${fileURL}&name=${fileName} `);
          // } else {
          //   setPdfblob(`/pdfjs/web/viewer.html?file=${fileURL}&name=${fileName} `);
          // }
        }
      })
    }
  }


  const SortableItem = sortableElement(({ value, xh }) => {
    let es = <div className={smyStyles.dd_badz_card_pdf}></div>;
    if(moduel && moduel === 'badz') {
      es = <div className={smyStyles.dd_badz_card_pdf2}></div>;
    } else {
      es = <div className={smyStyles.dd_badz_card_pdf}></div>;
    }
    
    {
      return <div className={smyStyles.dd_badz_card}>
        <div className={smyStyles.dd_badz_card_01}>
          <span className={smyStyles.dd_badz_card_xh}>{xh + 1}</span>
          {value.fjgsDm == '1' ? es : <img style={{ width: 168, height: 168 }} src={value.fjxx} />}
          <span className={smyStyles.dd_badz_card_icon}>
            <Dropdown placement="bottomRight" overlay={(
              <Menu className="dd_badz_card_btn_r">
                <Menu.Item key="1" onClick={() => { handleDownload(value) }} ><ArrowDownOutlined />下载</Menu.Item>
                <Menu.Item key="2" onClick={() => preview(value)}><EyeOutlined />预览</Menu.Item>
                <Menu.Item key="3" onClick={() => { handleDelete(value) }}><DeleteOutlined />删除</Menu.Item>
              </Menu>
            )} >
              <MoreOutlined />
            </Dropdown>
          </span>
        </div>
        <div className={smyStyles.dd_badz_card_02}>{value.fjwjm}</div>
        <div className={smyStyles.dd_badz_card_03}>{myUtil.date.formatDate(value.scsj, 'YYYY-MM-DD HH:mm')}</div>
      </div>
    }
  });

  const gitmen = ({ oldIndex, newIndex }) => {
    setDate(arrayMove(date, oldIndex, newIndex));
  }

  // 文件下载
  const handleDownload = (value: any) => {
    if (value.fjgsDm != '1') {
      const { fjxx, fjwjm } = value
      const aLink = document.createElement('a');
      document.body.appendChild(aLink);
      aLink.style.display = 'none';
      aLink.href = fjxx;
      aLink.download = fjwjm;
      aLink.click();
      document.body.removeChild(aLink);
      message.success(intl.formatMessage({ id: 'message_common_dlownload_success' }));
    } else {
      const obj = {
        fzcclj: value.fzcclj,
      }
      changeJzfjToPath(obj).then((response) => {
        refUnit.current!.setMasker(false);
        if (response.code === '200') {
          const { blob, fileName } = response.body;
          myUtil.file.downloadPdf(blob, fileName);
          message.success(intl.formatMessage({ id: 'message_common_dlownload_success' }));
        } else {
          message.error(response.desc)
        }
      })
    }
  }

  // 文件删除
  const handleDelete = (value: any) => {
    const newList = [...date];
    const index = newList.indexOf(value);
    newList.splice(index, 1);
    setDate(newList);
  }

  // 单证名称和单证编号的触发事件
  const dzmcDzbhPressEnter = () => {
    // 1.已经上传了图片，单证名称和单证编号有修改时给出提示信息
    const form1Values = form1.getFieldsValue();
    const tempList = date.filter((file: any) => file.upload === true);
    if (tempList.length > 0) {
      if ((form1Values.dzmc && form1Values.dzmc != initData.dzmc) || (form1Values.dzbh && form1Values.dzbh != initData.dzbh)) {
        DDAlert.open({
          title: '系统提示',
          info: '当前图片尚未保存，请选择保存或放弃',
          modalType: 'confirm',
          infoType: 'question',
          okText: '保存',
          cancelText: '放弃',
          okCallbackFn: function (thisObj: any) {
            thisObj.setState({ masker: true });
            // 保存数据
            save('continue');
            DDAlert.close();
          },
          cancelCallbackFn: function () {
            // 清空照片
            setDate([]);
            setBeforList([]);
          }
        });
      }
    } else {
      // 2.根据单证名称和单证编号查询数据
      getOldData(form1Values.badzlxDm, form1Values.badzbh);
    }
    setInitData(Object.assign({}, initData, form1Values));
  }

  // 根据单证名称和单证编号获取历史数据
  const getOldData = (badzlxDm: any, badzbh: any) => {
    if (badzlxDm && badzbh) {
      setMasker(true);
      const obj = {
        badzlxDm,
        badzbh,
      }
      // 2.1 若存在数据则直接替换 不提示信息。若不存在提示相关信息
      badzZlgdYlCkxq(obj).then((response) => {
        const { code, body } = response;
        if (code === '200') {
          if (body?.jybs == "N") {
            form1.setFieldsValue(body);
            setFlagPage('zlgd');
          } else {
            form1.setFieldsValue(body);
            setFlagPage('dzbazlcj');
          }
          // 存在数据直接替换数据
          if (body.badzFjs?.length > 0) {
            setMasker(false);
            getAllHistory(body.badzFjs).then((res) => {
              setDate(res);
              setBeforList(res);
            })
          } else {
            setMasker(false);
          }
        }else {
          message.error(response.msg);
        }
      });
    }
  }

  // 上一单,下一单切换
  const upDownOutBgd = (bgdhgbh: any, badzbgduuid: any, param: any) => {
    // 切换关单时，对数据进行保存校验
    form1.setFieldsValue({ "badzlxDm": "", "badzbh": "", "ywbh": "", "badzsm": "" });
    setDate([]);
    if (param == 'up') {
      if (bgdDate[0].badzbgduuid == badzbgduuid) {
        message.info('暂无上一单数据！');
        return;
      }
      let mun = 0;
      for (let i = 0; i < bgdDate.length; i++) {
        if (badzbgduuid == bgdDate[i].badzbgduuid) {
          mun = i;
          break;
        }
      }
      form1.setFieldsValue({ bgdhgbh: bgdDate[mun - 1].bgdhgbh, badzbgduuid: bgdDate[mun - 1].badzbgduuid });
      setBadzbgduuid(bgdDate[mun - 1].badzbgduuid);
      initData.ssq = bgdDate[mun - 1].ssq;
      initData.sbpc = bgdDate[mun - 1].sbpc;
      initData.badzbh = '';
      initData.badzlxDm = '';

    } else {
      if (bgdDate[bgdDate.length - 1].badzbgduuid == badzbgduuid) {
        message.info('暂无下一单数据！');
        return;
      }
      let mun = 0;
      for (let i = 0; i < bgdDate.length; i++) {
        if (badzbgduuid == bgdDate[i].badzbgduuid) {
          mun = i;
          break;
        }
      }
      form1.setFieldsValue({ bgdhgbh: bgdDate[mun + 1].bgdhgbh, badzbgduuid: bgdDate[mun + 1].badzbgduuid });
      setBadzbgduuid(bgdDate[mun + 1].badzbgduuid);
      initData.ssq = bgdDate[mun + 1].ssq;
      initData.sbpc = bgdDate[mun + 1].sbpc;
      initData.badzbh = '';
      initData.badzlxDm = '';
    }
  }
  // 报关单查询
  const handleSearch = (value: any, param: any) => {
    const key = param?.key;
    // 切换关单时，对数据进行保存校验
    form1.setFieldsValue({ "badzlxDm": "", "badzbh": "", "ywbh": "", "badzsm": "", badzbgduuid: key, });
    setBadzbgduuid(value);
    setDate([]);
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
    <Form preserve={false} colon={false} layout='inline' form={form1} className='gpy_form'>
      {gnmk === 'dzbazlcj' ?
        <Space style={{ height: 30 }}>
          <LeftOutlined onClick={() => upDownOutBgd(form1.getFieldValue('bgdhgbh'), form1.getFieldValue('badzbgduuid'), 'up')} />
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
          <RightOutlined style={{ marginLeft: -20 }} onClick={() => upDownOutBgd(form1.getFieldValue('bgdhgbh'), form1.getFieldValue('badzbgduuid'), 'down')} />
        </Space> : ''}
      <Form.Item label='单证名称' className="badz_form_item" name='badzlxDm' rules={[{ required: true, message: '请输入单证名称' }]}>
        <TreeSelect showSearch treeNodeFilterProp={'title'} virtual={false} onChange={dzmcDzbhPressEnter} treeDefaultExpandAll={true} dropdownMatchSelectWidth={220} style={{ width: 170 }} treeData={dzmcTree}>
          {renderTreeNodes(dzmcTree)}
        </TreeSelect>
      </Form.Item>
      <Form.Item label='单证编号' className="badz_form_item" name='badzbh' rules={[{ required: true, message: '请输入单证编号' },baseValidator.english_number()]}>
        <Input style={{ width: 150 }} maxLength={60} className="badz_input_1" onPressEnter={dzmcDzbhPressEnter} onBlur={dzmcDzbhPressEnter} />
      </Form.Item>
      <Form.Item label='业务编号' className="badz_form_item" name='ywbh' rules={[baseValidator.english_number()]} >
        <Input style={{ width: 150 }} maxLength={60} className="badz_input_2"></Input>
      </Form.Item>
      <Form.Item label='单证说明' className="badz_form_item" name='badzsm' >
        <Input style={{ width: 150 }} maxLength={100} className="badz_input_3" />
      </Form.Item>
      {flagPage === 'zlgd'  ? <span style={{ color: 'red', marginTop: 5 }}>注意：该单证已归档，无法删除（修改）</span> : ''}
    </Form>
  )

  // 最外层弹窗标题
  const ModelTitle = () => {
    let title = '上传单证';
    if (gnmk === 'dzbazlcj' || gnmk === 'zlgd') {
      // 功能模块为单证备案资料采集或者资料归档时
      return <div><span>所属期：{initData?.ssq}</span><span style={{ marginLeft: 20 }}>批次：{initData?.sbpc}</span></div>;
    }
    return title;
  }

  // proCard 右上按钮
  const ModalButton = () => {
    let buttonGroup = [];
    if (gnmk === 'badzdzgl' && flagPage != 'zlgd') {
      buttonGroup.push(<Button key='1' type='primary' onClick={() => save('continue')}>保存并继续</Button>);
      buttonGroup.push(<Button key='2' onClick={() => save('close')}>保存并关闭</Button>);
    } else if (gnmk === 'dzbazlcj' && flagPage != 'zlgd') {
      // 资料采集
      buttonGroup.push(<Button key='1' type='primary' onClick={() => save('continue')}>保存并继续</Button>);
      buttonGroup.push(<Button key='2' onClick={() => save('return')}>保存并返回</Button>);
      buttonGroup.push(<Button key='3' onClick={() => save('close')}>保存并关闭</Button>);
      buttonGroup.push(<Button key='5' onClick={() => modalCancel('return')}>返回</Button>);
    }
    buttonGroup.push(<Button key='4' onClick={() => modalCancel('close')}>关闭</Button>);
    return buttonGroup;
  }

  // 保存
  const save = async (type: any) => {
    const formValues = await form1.validateFields();
    //请求后台接口
    dzglbc.badzlxDm = formValues.badzlxDm;
    dzglbc.badzbh = formValues.badzbh;
    dzglbc.badzsm = formValues.badzsm;
    dzglbc.ywbh = formValues.ywbh;
    dzglbc.fpbz = 'N';
    dzglbc.badzbgduuid = badzbgduuid;
    dzglbc.gpyhclj = "C:\\gpy";
    // 文件数组
    const badzFjs = [];
    for (let i = 0; i < date?.length; i++) {
      if (date[i].fjuuid != null && date[i].fjuuid != undefined) {
        const sz = { "fjuuid": "", "fjwjm": "", "fjxx": "" };
        sz.fjuuid = date[i].fjuuid;
        sz.fjwjm = date[i].fjwjm;
        badzFjs.push(sz);
      } else {
        const sz = { "fjuuid": "", "fjwjm": "", "fjxx": "" };
        sz.fjwjm = date[i].fjwjm;
        sz.fjxx = date[i].fjxx;
        badzFjs.push(sz);
      }
    }
    if (badzFjs.length > 50) {
      message.info(intl.formatMessage({ id: 'message_badz_dzgl_upload_Dzgs' }))
      return;
    }
    dzglbc.badzFjs = badzFjs;
    setMasker(true);
    //保存
    funcDzglbc(dzglbc).then((response) => {
      setMasker(false);
      if (response.code === '200') {
        // 切换关单时清空单证编号、单证说明
        form1.setFieldsValue({ ckbgdh: response.body?.ckbgdh, badzbh: '', badzsm: '', ywbh: '' });
        setDate([]);
        // setInitData(Object.assign({}, initData, { ckbgdh: response.body?.ckbgdh }));
        // setTimeout(() => {
        if (type === 'close') {
          modalCancel02('close');
        } else if (type === 'return') {
          modalCancel02('return');
          initData.badzbgduuid = badzbgduuid;
        } else {
          initData.badzbh = '';
          initData.badzsm = '';
          initData.ywbh = '';
          form1.setFieldsValue({ badzbh: '', badzsm: '', ywbh: '' });
        }
        refUnit.current!.reload();
        setMasker(false);
        setDate([]);
        // 将最新的报关单号，所属期，批次返回上一层执行查询
        ylModalRef?.current?.init(initData);
        message.success(intl.formatMessage({ id: 'message_badz_common_save' }));
        // }, 100);
      } else {
        message.error(response.desc);
      }
    });
  }

  const modalCancel02 = (param: any) => {
    if (param == 'close') {
      setModalVisible(false);
      handle_CloseCamera();
      ylModalRef?.current?.closeModal();
    } else {
      handle_CloseCamera();
      setModalVisible(false);
      initData.badzbgduuid = badzbgduuid;
      ylModalRef?.current?.init(initData);
      form1.setFieldsValue({ ckbgdh: '', badzbh: '', badzsm: '', ywbh: '' });

    }
  }

  // 弹窗关闭
  const modalCancel = (param: any) => {
    // 校验是否保存
    const tempList = date.filter((file: any) => file.upload === true);
    if (tempList.length > 0 && flagPage != 'zlgd') {
      DDAlert.open({
        title: '系统提示',
        info: '当前图片尚未保存，请选择保存或放弃',
        modalType: 'confirm',
        infoType: 'question',
        okText: '保存',
        cancelText: '放弃',
        okCallbackFn: function (thisObj: any) {
          thisObj.setState({ masker: true });
          // 保存数据
          save(param);
          DDAlert.close();
        },
        cancelCallbackFn: function () {
          // 清空照片
          setDate([]);
          setBeforList([]);
          // 关闭弹窗
          modalCancel02(param);
        }
      });
    } else {
      // 关闭弹窗
      modalCancel02(param);
    }
  }

  const getImgSrc = () => {
    let src = "";
    if(PRO_BASE && PRO_BASE != '') {
      src = `/${PRO_BASE}/img`;
      return src;
    } else {
      src = `/img`;
      return src;
    }
  }
  // 剪裁图标
  const cutIcon = (
    <div >
      <div className={smyStyles.badz_smy_main_right_mian_icon_div_pop_div} ><img src={getImgSrc() + '/icon_cut_01.png'} style={{ width: 25, height: 25 }} />自动裁切<Checkbox checked={3 === cqValue ? true : false} onChange={(event: any) => cutOnchange(event, 3)}></Checkbox></div>
      <div className={smyStyles.badz_smy_main_right_mian_icon_div_pop_div} ><img src={getImgSrc() + '/icon_cut_02.png'} style={{ width: 25, height: 25 }} />手动裁切<Checkbox checked={2 === cqValue ? true : false} onChange={(event: any) => cutOnchange(event, 2)}></Checkbox></div>
      <div className={smyStyles.badz_smy_main_right_mian_icon_div_pop_div} ><img src={getImgSrc() + '/icon_cut_03.png'} style={{ width: 25, height: 25 }} />不裁切<Checkbox checked={1 === cqValue ? true : false} style={{ paddingLeft: 15 }} onChange={(event: any) => cutOnchange(event, 1)}></Checkbox></div>
    </div>
  )

  // 去底色、去黑边
  const areaBorderIcon = (
    <div >
      <div className={smyStyles.badz_smy_main_right_mian_icon_div_pop_div} ><img src={getImgSrc() + '/icon_area.png'} style={{ width: 25, height: 25 }} />去底色<Checkbox onChange={toSetDeleteBgColor}></Checkbox></div>
      <div className={smyStyles.badz_smy_main_right_mian_icon_div_pop_div} ><img src={getImgSrc() + '/icon_border.png'} style={{ width: 25, height: 25 }} />去黑边<Checkbox onChange={toSetDeleteBlackEdge}></Checkbox></div>
    </div>
  )

  return (
    <>
      <Modal
        title={ModelTitle()}
        destroyOnHidden={true}
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_MAX}
        wrapClassName='standard-modal-1 dd-gpy'
        footer={ModalButton()}
        onCancel={() => modalCancel('close')}
        className={`${masker ? 'dd_modal_show_masker' : ''}`}
        mask={{ closable: false }}
        closable={false}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <ProCard
            title={proCardTitle}
            extra={<Button type="primary" className='btn_ps' icon={<CameraOutlined />} onClick={handle_TakePhoto}>拍  摄</Button>}
            size="small"
          >
            <div className={smyStyles.badz_smy_main}>
              <div className={fullFlag ? smyStyles.badz_smy_main_left_full : smyStyles.badz_smy_main_left}>
                <div className={smyStyles.badz_smy_main_left_top_div}>
                  <span className={smyStyles.badz_smy_main_left_top_text} >预览</span>
                  <span className={smyStyles.badz_smy_main_left_top_icon}>
                    {fullFlag ? <MenuFoldOutlined onClick={() => { setFull(fullFlag) }} /> : <MenuUnfoldOutlined onClick={() => { setFull(fullFlag) }} />}
                  </span>
                </div>
                <div className={smyStyles.badz_smy_main_left_main_wrap}>
                  <SortableContainer onSortEnd={gitmen} axis="x" >
                    {date.map((value: any, index: any) => (
                      <SortableItem key={index} index={index} value={value} xh={index} />
                    ))}
                  </SortableContainer>
                </div>
              </div>
              <div className={smyStyles.badz_smy_main_right}>
                <div id='CameraCtl' className={smyStyles.badz_smy_main_right_mian_camera} />
                <div className={smyStyles.badz_smy_main_right_mian_wrap}>
                  <Space direction='vertical'>
                    {/* <div className={smyStyles.badz_smy_main_right_mian_icon_div}>
                      <CloseOutlined />
                    </div> */}
                    <div className={smyStyles.badz_smy_main_right_mian_icon_div}>
                      <UndoOutlined onClick={handle_Cam_RotateLeft} />
                    </div>
                    <div className={smyStyles.badz_smy_main_right_mian_icon_div}>
                      <RedoOutlined onClick={handle_Cam_RotateRight} />
                    </div>
                    <div className={smyStyles.badz_smy_main_right_mian_icon_div}>
                      <ZoomInOutlined onClick={handle_Cam_ZoomIn} />
                    </div>
                    <div className={smyStyles.badz_smy_main_right_mian_icon_div}>
                      <ZoomOutOutlined onClick={handle_Cam_ZoomOut} />
                    </div>
                    <div className={smyStyles.badz_smy_main_right_mian_icon_div}>
                      <FullscreenExitOutlined onClick={handle_Cam_BestSize} />
                    </div>
                    {/* <div className={smyStyles.badz_smy_main_right_mian_icon_div}>
                      <Popover placement="right" content={cutIcon} >
                        <SnippetsOutlined />
                      </Popover>
                    </div> */}
                    {/* <div className={smyStyles.badz_smy_main_right_mian_icon_div}>
                      <Popover placement="right" content={areaBorderIcon} >
                        <PictureOutlined />
                      </Popover>
                    </div> */}
                  </Space>
                </div>
              </div>
            </div>
          </ProCard>
        </Spin>
        <div style={{ display: 'none' }}>
          <Image.PreviewGroup preview={{ visible: imageModalVisible, onVisibleChange: vis => setImageModalVisible(vis), current }}>
            {/* {date.map((filetemp: any) => <Image key={filetemp.fjwjm} src={filetemp.fjxx} />)} */}
            <Image src={filetemp} />
          </Image.PreviewGroup>
          <Modal
            title={pdfTilte}
            destroyOnHidden
            visible={pdfModalVisible}
            wrapClassName='standard-modal-1'
            width={CONSTANTS.C_MODAL_WIDTH_X4}
            cancelText="关闭"
            footer={
              <>
                <Button onClick={() => setPdfModalVisible(false)} icon={<CloseOutlined />} type="default">关闭</Button>
              </>
            }
            closable={false}
            onCancel={() => setPdfModalVisible(false)}
          >
            <iframe src={pdfblob} width='100%' height='99%'></iframe>
          </Modal>
        </div>
      </Modal >
    </>
  );
}
export default DzglSmy;
