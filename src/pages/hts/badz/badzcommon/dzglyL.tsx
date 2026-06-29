/**
 * 单证管理 导入
 */
import React, { useImperativeHandle, useState, useCallback, } from 'react';
import { Modal, Button, Form, Input, Space, Spin, Upload, Image, TreeSelect, Dropdown, Menu, Tooltip, Select, message } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import { ArrowDownOutlined, EyeOutlined, MoreOutlined, CloseOutlined } from '@ant-design/icons';
import update from 'immutability-helper';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useIntl } from 'umi';
import ProCard from '@ant-design/pro-card';
import myUtil from '@/components/DDAssist/util';
import { getDzmcTree, funcDzglbc, badzZlgdYlCkxq, jzfjToPath, changeJzfjToPath, } from "@/pages/hts/services/htsApi";
import importstyless from './importstyless.less';
import smyStyles from './smyStyless.less';
import DDAlert from '@/pages/hts/commonModule/DDAlert';
import { intl as intl2 } from '@/components/DDAssist/util';
import cktsUtil from '@/pages/hts/cktsUtil';

const { TreeNode } = TreeSelect;

export interface DzglImportProps {
  onRef?: any;
  visible?: any;
  gnmk?: string; // 模块类型badzdzgl；单证管理；dzbazlcj：资料采集；zlgdylckxq：资料管理预览查看详情
}

const DzglImport: React.FC<DzglImportProps> = ({ onRef, gnmk, visible = false }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [imageModalVisible, setImageModalVisible] = useState<boolean>(false); // 照片预览相册显示
  const [pdfModalVisible, setPdfModalVisible] = useState<boolean>(false); //  pdf预览显示
  const [unitRef, setUnitRef] = useState<any>("");// 主列表刷新使用
  const [form1] = Form.useForm(); // 输入框form
  const [masker, setMasker] = useState<boolean>(false); // 蒙板
  const intl = useIntl(); // 提示信息
  const [fileList, setFileList] = useState<any>([]); // 文件数组
  const [scFjs, setScFjs] = useState<any>([]); // 删除文件数组
  const [filetemp, setFiletemp] = useState<any>(); // ****
  const [initData, setInitData] = useState<any>({});// 输入框输入的记录
  const [dzmcTree, setDzmcTree] = useState<any>([]); // 单证名称树
  const [ylModalRef, setYlModalRef] = useState<any>("");//
  const [bgdDate, setBgdDate] = useState<any>([]); // 报关单下拉数据
  const [girdData, setGridData] = useState<any>({});// 列表的数据
  const [flagPage, setFlagPage] = useState<any>("");// zlgd: 资料归档
  const [dzglbc, setDzglbc] = useState<any>(); //保存报文
  let [pdfTilte, setPdfTitle] = useState<any>("pdf");// pdf预览标题
  const [pdfblob, setPdfblob] = useState<any>();
  const [badzbgduuid, setBadzbgduuid] = useState<any>();
  // 开启
  const showModal = (param: any, param1: any, param2: any, flag: any, bgdDate: any) => {
    const saveData = { "badzbgduuid": param?.data?.badzbgduuid, "badzuuid": "", "badzlxDm": "", "badzbh": "", "ywbh": "", "badzsm": "", "pzscfsDm": "1", "dlckhwzmbz": "", "badzFjs": [], "scFjs": [] };
    setBadzbgduuid(param?.data?.badzbgduuid);
    setBgdDate(bgdDate);
    setModalVisible(true);
    setUnitRef(param.ref);
    setYlModalRef(param1);
    setGridData(param2)
    setFlagPage(flag);
    if (param?.data) {
      setInitData(param?.data);
      setDzglbc(param?.data);
      form1.setFieldsValue(param?.data);
      saveData.badzuuid = param?.data.badzuuid;
      setDzglbc(saveData);
      //转路径为base64
      getAllHistory(param?.data?.badzFjs).then((res) => {
        setFileList(res);
      })
    }

    getDzmcTree({ "codeStoreKey": "TREE_BADZ_CS_ZXSB_BADZLX", "codeViewKey": "" }).then((response) => {
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

  // 点击预览
  const preview = (fileindex: any, file: any) => {
    if (file?.fjgsDm != '1') {
      setFiletemp(file?.fjxx);
      setImageModalVisible(true);
    } else {
      if (fileList[fileindex].originFileObj) {
        setPdfModalVisible(true);
        setPdfTitle(fileList[fileindex].fjwjm);
        const bstr = convertBase64ToBlob(fileList[fileindex].fjxx, fileList[fileindex].fjwjm);
        const fileURL = URL.createObjectURL(new Blob([bstr], { type: 'application/pdf' }));
        // if(moduel && moduel === 'badz') {
        //   setPdfblob(`/front/badz/pdfjs/web/viewer.html?file=${fileURL}`);
        // } else {
        //   setPdfblob(`/pdfjs/web/viewer.html?file=${fileURL}`);
        // }
        setPdfblob(cktsUtil.getPdfLj()+`?file=${fileURL}`);

      } else {
        if (fileList[fileindex].fzcclj) {
          const obj = {
            fzcclj: fileList[fileindex].fzcclj,
          }
          setPdfTitle(fileList[fileindex].fjwjm);
          changeJzfjToPath(obj).then((response: any) => {
            if (response.code === '200') {
              setPdfModalVisible(true);
              const { blob, fileName } = response.body;
              const bstr = atob(blob);
              let n = bstr.length;
              const u8arr = new Uint8Array(n);
              while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
              }
              const fileURL = URL.createObjectURL(new Blob([u8arr], { type: 'application/pdf' }));
              // if(moduel && moduel === 'badz') {
              //   setPdfblob(`/front/badz/pdfjs/web/viewer.html?file=${fileURL}&name=${fileName} `);
              // } else {
              //   setPdfblob(`/pdfjs/web/viewer.html?file=${fileURL}&name=${fileName} `);
              // }
              setPdfblob(cktsUtil.getPdfLj()+`?file=${fileURL}&name=${fileName}`);

            }
          })
        }
      }
    }
  }

  // 从base64转化为流
  function convertBase64ToBlob(dataurl: any, filename: any) {
    let arr = dataurl.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let suffix = mime.split('/')[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], `${filename}.${suffix} `, {
      type: mime
    })
  }

  // 文件支持拖动调整顺序
  const type = 'DragableUploadList';
  const DragableUploadListItem = ({ originNode, moveRow, file, fileList }) => {
    file.type = file.fjgsDm == '1' ? 'application/pdf' : 'image';
    const ref = React.useRef();
    const index = fileList.indexOf(file);
    const [{ isOver, dropClassName }, drop] = useDrop({
      accept: type,
      collect: monitor => {
        const { index: dragIndex } = monitor.getItem() || {};
        if (dragIndex === index) {
          return {};
        }
        return {
          isOver: monitor.isOver(),
          dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
        };
      },
      drop: (item: any) => {
        const list = [...fileList];
        list[item.index] = list.splice(index, 1, list[item.index])[0];
        const imgList: any[] = [];
        for (let i = 0; i < list.length; i++) {
          if (list[i]?.fjgsDm != '1') {
            imgList.push(list[i]);
          }
        }
        // setImgFileList(imgList);
        moveRow(item.index, index);
      },
    });
    const [, drag] = useDrag({
      type,
      item: { index },
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    });
    drop(drag(ref));
    const fileIndex = fileList.indexOf(file);
    const MenuItem = () => {
      const menu = [];
      if (!file.upload) {
        menu.push(<Menu.Item key="1" onClick={() => handleDownload(fileIndex)} ><ArrowDownOutlined />下载</Menu.Item>);
      }
      menu.push(<Menu.Item key="2" onClick={() => preview(fileIndex, file)} ><EyeOutlined />预览</Menu.Item>)
      return menu;
    }
    let es = <div className={smyStyles.dd_badz_card_pdf}></div>;
    if(moduel && moduel === 'badz') {
      es = <div className={smyStyles.dd_badz_card_pdf2}></div>;
    } else {
      es = <div className={smyStyles.dd_badz_card_pdf}></div>;
    }
    return (
      <div
        ref={ref}
        className={`ant - upload - draggable - list - item ${isOver ? dropClassName : ''} `}
        style={{ cursor: 'move' }}
      >
        <div className={importstyless.badz_import_main_wrap}>
          <div className={smyStyles.dd_badz_card}>
            <div className={smyStyles.dd_badz_card_01}>
              <span className={smyStyles.dd_badz_card_xh}>{index + 1}</span>
              {file.type === 'application/pdf' ? es : <img style={{ width: 168, height: 168 }} src={file.fjxx} />}
              <span className={smyStyles.dd_badz_card_icon}>
                <Dropdown placement="bottomRight" overlay={(
                  <Menu className="dd_badz_card_btn_r">{MenuItem()}</Menu>
                )} >
                  <MoreOutlined />
                </Dropdown>
              </span>
            </div>
            <div className={smyStyles.dd_badz_card_02}>
              <Tooltip title={file.fjwjm}>{file.fjwjm}</Tooltip>
            </div>
            <div className={smyStyles.dd_badz_card_03}>{file.scsj ? myUtil.date.formatDate(file.scsj, 'YYYY-MM-DD HH:mm') : ''}</div>
          </div>
        </div>
      </div>
    );
  };

  // 移动文件更新文件数组
  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = fileList[dragIndex];
      setFileList(
        update(fileList, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      );
    },
    [fileList],
  );

  // 上传文件base64加密
  function getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  // 文件上传检验
  const beforeUpload = async (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp';
    const isPdf = file.type === 'application/pdf';
    if (!isJpgOrPng && !isPdf) {
      message.info(intl.formatMessage({ id: 'message_badz_dzgl_upload_type' }));
      return Upload.LIST_IGNORE;
    }
    const isLt_IMG = file.size / 1024 / 1024 < 2;
    const isLt_PDF = file.size / 1024 / 1024 < 20;
    if (isJpgOrPng && !isLt_IMG) {
      message.info(intl.formatMessage({ id: 'message_badz_dzgl_upload_size' }));
      return Upload.LIST_IGNORE;
    }
    if (isPdf && !isLt_PDF) {
      message.info(intl.formatMessage({ id: 'message_badz_dzgl_upload_size' }));
      return Upload.LIST_IGNORE;
    }
    const name = recursive(file?.name);
    // 增加上传时间
    file.scsj = new Date();
    file.upload = true;
    // 预览时显示原图
    file.fjwjm = name;
    file.fjxx = await getBase64(file);
    file.fjuuid2 = myUtil.text.uuid();
    return false;
  }

  //递归遍历测试
  function recursive(name: any) {
    const nameList = [];
    let newName = '';
    //新上传的文件
    const fileNameFile = myUtil.fileName.getFileName(name);
    const extensionFile = myUtil.fileName.getExtension(name);
    for (let i = 0; i < fileList.length; i++) {
      const fileName = myUtil.fileName.getFileName(fileList[i].fjwjm);
      const extension = myUtil.fileName.getExtension(fileList[i].fjwjm);
      if (fileName.search(fileNameFile) != -1 && extension == extensionFile) {
        nameList.push(fileList[i].fjwjm);
      }
    }
    if (nameList.length != 0) {
      newName = fileNameFile + `(${nameList.length})` + extensionFile;
    } else {
      newName = name;
    }
    return newName;
  }


  // 文件删除
  const handleDelete = (index: any, file: any) => {
    //再删一遍总列表
    const tplist = [...fileList];
    const fj = { 'fjuuid': '', 'fzcclj': '', 'fjwjm': '' };
    if (tplist[index].fjuuid == undefined || tplist[index].fjuuid == null) {
      tplist.splice(index, 1);
      setFileList(tplist);
      return;
    } else {
      fj.fjuuid = tplist[index].fjuuid;
      fj.fjwjm = tplist[index].fjwjm;
      fj.fzcclj = tplist[index].fzcclj;
      tplist.splice(index, 1);
      setFileList(tplist);
      const fjs = [...scFjs];
      fjs.push(fj);
      setScFjs(fjs);
      dzglbc.scFjs = scFjs;
    }

  }

  // 文件下载
  const handleDownload = (fileindex: any) => {
    if (fileList[fileindex].fjgsDm != '1') {
      const { fjxx, fjwjm } = fileList[fileindex]
      const aLink = document.createElement('a');
      document.body.appendChild(aLink);
      aLink.style.display = 'none';
      aLink.href = fjxx;
      aLink.download = fjwjm;
      aLink.click();
      document.body.removeChild(aLink);
      //message.success(intl.formatMessage({ id: 'message_common_dlownload_success' }));
    } else {
      const obj = {
        fzcclj: fileList[fileindex].fzcclj,
      }
      changeJzfjToPath(obj).then((response) => {
        unitRef.current!.setMasker(false);
        if (response.code === '200') {
          const { blob, fileName } = response.body;
          myUtil.file.downloadPdf(blob, fileName);
          //message.success(intl.formatMessage({ id: 'message_common_dlownload_success' }));
        } else {
          message.error(response.desc)
        }
      })
    }
  }

  // 上传文件发生改变
  const onChange = ({ fileList: newFileList }) => {
    const le = newFileList?.length - 1;
    newFileList[le].fjgsDm = newFileList[le].type == 'application/pdf' ? '1' : '2';
    if (newFileList[le].type != 'application/pdf') {
      newFileList[le].fjuuid2 = myUtil.text.uuid();
      setFileList(newFileList);
    } else {
      setFileList(newFileList);
    }
  };

  // 单证名称和单证编号的触发事件
  const dzmcDzbhPressEnter = () => {
    const form1Values = form1.getFieldsValue();
    const tempList = fileList.filter((file: any) => file.upload === true);
    // 1.已经上传了图片，单证名称和单证编号有修改时给出提示信息
    if ((form1Values.badzlxDm && form1Values.badzlxDm != initData.badzlxDm) || (form1Values.badzbh && form1Values.badzbh != initData.badzbh)) {
      if (tempList.length > 0) {
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
            setFileList([]);
          }
        });
      } else {
        // 2.根据单证名称和单证编号查询数据
        getOldData(form1Values.badzlxDm, form1Values.badzbh);
      }
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
            if (flagPage !== 'zlgd') {
              message.info("当前单证存在已归档的，无法删除（修改）");
            }
          } else {
            form1.setFieldsValue(body);
          }
          // 存在数据直接替换数据
          if (body.badzFjs?.length > 0) {
            form1.setFieldsValue(body);
            setMasker(false);
            getAllHistory(body.badzFjs).then((res) => {
              setFileList(res);
            })
          } else {
            if (flagPage === 'zlgd') {
              setFileList([]);
            }
            form1.setFieldsValue(body);
            setMasker(false);
          }
        }else {
        message.error(response.desc);
      }
      });
    }
  }

  // 上一单,下一单切换
  const upDownOutBgd = (bgdhgbh: any, badzbgduuid2: any, param: any) => {
    var mun = 0;
    // 切换关单时，对数据进行保存校验
    form1.setFieldsValue({ "badzlxDm": "", "badzbh": "", "ywbh": "", "badzsm": "" });
    setFileList([]);
    if (param == 'up') {
      if (bgdDate[0].badzbgduuid == badzbgduuid2) {
        message.info('暂无上一单数据！');
        return;
      }
      for (var i = 0; i < bgdDate.length; i++) {
        if (badzbgduuid2 == bgdDate[i].badzbgduuid) {
          mun = i;
          break;
        }
      }
      form1.setFieldsValue({ bgdhgbh: bgdDate[mun - 1].bgdhgbh, badzbgduuid: bgdDate[mun - 1].badzbgduuid });
      setBadzbgduuid(bgdDate[mun - 1].badzbgduuid);
    } else {
      if (bgdDate[bgdDate.length - 1].badzbgduuid == badzbgduuid2) {
        message.info('暂无下一单数据！');
        return;
      }
      for (var i = 0; i < bgdDate.length; i++) {
        if (badzbgduuid2 == bgdDate[i].badzbgduuid) {
          mun = i;
          break;
        }
      }
      form1.setFieldsValue({ bgdhgbh: bgdDate[mun + 1].bgdhgbh, badzbgduuid: bgdDate[mun + 1].badzbgduuid });
      setBadzbgduuid(bgdDate[mun + 1].badzbgduuid);
    }
  }
  // 切换报关单号
  const handleSearch = (value: any, param: any) => {
    // 切换关单时，对数据进行保存校验
    const key = param?.key;
    form1.setFieldsValue({ "badzlxDm": "", "badzbh": "", "ywbh": "", "badzsm": "", badzbgduuid: key, });
    setBadzbgduuid(value);
    setFileList([]);
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
      <Form.Item label='单证名称' className="badz_form_item" name='badzlxDm' >
        <TreeSelect disabled={true} showSearch treeNodeFilterProp={'title'} virtual={false} treeDefaultExpandAll={true} dropdownMatchSelectWidth={220} style={{ width: 170 }}>
          {renderTreeNodes(dzmcTree)}
        </TreeSelect>
      </Form.Item>
      <Form.Item label='单证编号' className="badz_form_item" name='badzbh' >
        <Input disabled={true} maxLength={60}  style={{ width: 170 }} className="badz_input_1" ></Input>
      </Form.Item>
      <Form.Item label='业务编号' className="badz_form_item" name='ywbh'>
        <Input  disabled={true} maxLength={60} style={{ width: 170 }} className="badz_input_2"></Input>
      </Form.Item>
      <Form.Item label='单证说明' className="badz_form_item" name='badzsm' >
        <Input disabled={true} maxLength={100}  style={{ width: 170 }} className="badz_input_3"></Input>
      </Form.Item>
      {gnmk === 'dzbazlcj' || gnmk === 'zlgd' ? <span style={{ color: 'red', marginTop: 5 }}>注意：该单证已归档，无法删除（修改）</span> : ''}
    </Form>
  )

  // Model页面按钮
  const modelFootButton = () => {
    let buttonGroup = [];
    // 单证管理
    if (gnmk === 'badzdzgl' && flagPage != 'zlgd') {
      buttonGroup.push(<Button key='1' type='primary' onClick={() => save('continue')}>保存并继续</Button>);
      buttonGroup.push(<Button key='2' onClick={() => save('close')}>保存并关闭</Button>);
    } else if (gnmk === 'dzbazlcj' && flagPage != 'zlgd') {
      // 资料采集
      buttonGroup.push(<Button key='1' type='primary' onClick={() => save('continue')}>保存并继续</Button>);
      buttonGroup.push(<Button key='2' onClick={() => save('return')}>保存并返回</Button>);
      buttonGroup.push(<Button key='3' onClick={() => save('close')}>保存并关闭</Button>);
      buttonGroup.push(<Button key='1' onClick={() => modalCancel('return')}>返回</Button>);
    } else if (gnmk === 'zlgdylckxq') {
      // 资料归档
      buttonGroup.push(<Button key='1' onClick={() => modalCancel('return')}>返回</Button>);
    }
    buttonGroup.push(<Button key='4' onClick={() => modalCancel('close')}>关闭</Button>);
    return <Space>{buttonGroup}</Space>;
  }

  // 最外层弹窗标题
  const ModelTitle = () => {
    let title = '上传单证';
    if (gnmk === 'dzbazlcj' || gnmk === 'zlgd') {
      // 功能模块为单证备案资料采集或者资料归档时
      return <div>预览</div>;
    } else if (gnmk == 'zlgdylckxq') {
      // 功能模块为资料归档预览查看详情
      title = '查看详情';
    }
    return title;
  }

  // 保存并继续
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
    for (let i = 0; i < fileList?.length; i++) {
      if (fileList[i].fjuuid != null && fileList[i].fjuuid != undefined) {
        const sz = { "fjuuid": "", "fjwjm": "", "fjxx": "" };
        sz.fjuuid = fileList[i].fjuuid;
        sz.fjwjm = fileList[i].fjwjm;
        badzFjs.push(sz);
      } else {
        const sz = { "fjuuid": "", "fjwjm": "", "fjxx": "" };
        sz.fjwjm = fileList[i].fjwjm;
        sz.fjxx = fileList[i].fjxx;
        badzFjs.push(sz);
      }
    }
    dzglbc.badzFjs = badzFjs;
    if (badzFjs.length > 50) {
      message.info(intl.formatMessage({ id: 'message_badz_dzgl_upload_Dzgs' }))
      return;
    }
    const ss = initData;
    setMasker(true);
    //保存
    funcDzglbc(dzglbc).then((response) => {
      setMasker(false);
      if (response.code === '200') {
        // 切换关单时清空单证编号、单证说明
        form1.setFieldsValue({ ckbgdh: response.body?.ckbgdh, badzbh: '', badzsm: '', ywbh: '' });
        setFileList([]);
        setInitData(Object.assign({}, initData, { ckbgdh: response.body?.ckbgdh }));
        setTimeout(() => {
          if (type === 'close') {
            modalCancel02('close');
          } else if (type === 'return') {
            modalCancel02('return');
            initData.badzbgduuid = badzbgduuid;
          } else {
            form1.setFieldsValue({ badzbh: '', badzsm: '', ywbh: '' });
          }
          unitRef.current!.reload2();
          setMasker(false);
          setFileList([]);
          // 将最新的报关单号，所属期，批次返回上一层执行查询
          ylModalRef?.current?.init(initData);
          message.success(intl.formatMessage({ id: 'message_badz_common_save' }));
        }, 100);
      } else {
        message.error(response.desc);
      }
    });


  }
  // // 关闭页面清空缓存
  // const close = () => {
  //   setModalVisible(false);
  //   setImageModalVisible(false);
  //   setPdfModalVisible(false);
  //   form1.setFieldsValue({ ckbgdh: '', badzbh: '', badzsm: '', ywbh: '' });
  //   setMasker(false);
  //   setFileList([]);
  //   setScFjs([]);
  //   setInitData({});
  //   setDzmcTree([]);
  //   setGridData({});
  // }

  const modalCancel02 = (param: any) => {
    if (param == 'close') {
      setModalVisible(false);
      ylModalRef?.current?.closeModal();
    } else {
      setFileList([]);
      setModalVisible(false);
    }
  }
  // 弹窗关闭
  const modalCancel = (param: any) => {
    // 校验是否保存
    const tempList = fileList.filter((file: any) => file.upload === true);
    if (tempList.length > 0) {
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
          setFileList([]);
          // 关闭弹窗
          modalCancel02(param);
        }
      });
    } else {
      // 关闭弹窗
      modalCancel02(param);
    }
  }

  return (
    <>
      <Modal
        title={ModelTitle()}
        destroyOnHidden={true}
        visible={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_MAX}
        wrapClassName='standard-modal-1  dd-gpy'
        footer={modelFootButton()}
        onCancel={() => setModalVisible(false)}
        className={`${masker ? 'dd_modal_show_masker' : ''} `}
        mask={{ closable: false }}
        closable={false}
      >
        <Spin tip="Loading..." spinning={masker} delay={100} >
          <ProCard
            title={proCardTitle}
            size="small"
          >
            <div className={importstyless.badz_import_main}>
              <DndProvider backend={HTML5Backend}>
                <Upload
                  className={importstyless.badz_import_upload_main}
                  listType="picture-card"
                  onChange={onChange}
                  fileList={fileList}
                  beforeUpload={beforeUpload}
                  multiple={false}
                  itemRender={(originNode, file, currFileList) => (
                    <DragableUploadListItem
                      originNode={originNode}
                      file={file}
                      fileList={currFileList}
                      moveRow={moveRow}
                    />
                  )}
                  disabled={true}
                >
                </Upload>
                <div style={{ display: 'none' }}>
                  <Image.PreviewGroup preview={{ visible: imageModalVisible, onVisibleChange: vis => setImageModalVisible(vis), }}>
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
              </DndProvider>
            </div>
          </ProCard>
        </Spin>
      </Modal >
    </>
  );
}
export default DzglImport;
