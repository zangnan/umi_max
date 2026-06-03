// 报送资料
import React, { useState, useImperativeHandle, Fragment } from 'react';
import DDBaseGrid from '@/components/DDBaseGrid';
import { Modal, message, Button, Divider,Spin,Upload,Form,Tooltip } from 'antd';
import { queryFlzlJcInfo, queryFlzlInfo, queryBzmxbInfo, flzlQr, deleteFlzl, uploadFlzl, checkFileGrid  } from '@/services/hts/api';
import cktsUtil from '@/pages/common/cktsUtil';
import ZlscModal from '@/pages/hts/ckts/scsbsj/zlsc/zlscModal';
import pro from '@/pages/common/proConfig';
import DDAlert from '@/components/DDAlert';
import importStyle from './importStyle.less';
import myUtil from '@/pages/common/myUtil';
import { ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

export type ZlscProps = {
  visible?: any;
  onRef?: any;
  // lcswsxDm?: any;
  gridRef?: any;
}

const Zlsc: React.FC<ZlscProps> = ({
  visible = false,
  onRef,
  // lcswsxDm,
  gridRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [dbzsl, setDbzsl] = useState<any>(0); // 待补正数量
  const [gridData, setGridData] = useState<any[]>([]); // 主从表全量数据
  const [defaultExpandedRowKeys, setDefaultExpandedRowKeys] = useState<any[]>([]);
  const [confirmBtnDisabled, setConfirmBtnDisabled] = useState<boolean>(false);
  const [queryBzmxbInfoResponse, setQueryBzmxbInfoResponse] = useState<any>({});
  const [recordPar, setRecordPar] = useState<any>({});
  const refUpload: any = React.createRef();
  const [masker, setMasker] = useState<boolean>(false); // 打开明细
  const [checkList ,setCheckList]= useState<any>([]);  
  // 开启
  const showModal = (record: any,unitRef:any) => {
    setDbzsl(record.dbzsl);
    setRecordPar(record);
    initPage(record);
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 刷新
  const beforeUpload = () => {
    initPage(recordPar);
  }

  // 配置列表列 主表
  const getColumns = () => {
    const myColumns = [];
    myColumns.push({ title: '报送资料名称', dataIndex: 'flzldlmc' });
    myColumns.push({ title: '必报资料份数', dataIndex: 'bbdzzlfs', width: 120 });
    myColumns.push({ title: '资料份数', dataIndex: 'ysbdzzlfs', width: 120 });
    return myColumns;
  }

  // 下载
  const handleDownloadFlzl = (record: any) => {
    const url = '/yw/bszx/ggfw/flzlgl/downLoadFlzl/';
    const params = {
      accessClientId: '1',
			uuid: record.mxbuuid
    };
    cktsUtil.downloadFileCkts(url, params);
  }

  // 上传
  const handleUploadFlzl = (record: any) => {
    // refUpload.current!.showModal(record);
    importWj(record);
  }
  
   // 导入
   const importWj = (record: any) => {
    const beforeUpload = (file: any) => {
      const isLt2M = file.size;
      if(isLt2M > 5242880) {
        message.info('上传文件不能超过5M。');
        return Upload.LIST_IGNORE;
      }
      if(!file.name.toUpperCase().endsWith(".ZIP")) {
        message.info('请上传.zip文件。');
        return Upload.LIST_IGNORE;
      }
      return false;
    }
    DDAlert.open({
      title: '上传',
      infoType: 'warning',
      modalType: 'form',
      closeStatus: false,
      isFormContent: true,
      width: 720,
       content: <>
        <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label="文件选择" name="file" valuePropName="fileList" rules={[{ required: true, message: '请选择上传的文件' }]} getValueFromEvent={(e: any) => { if (Array.isArray(e)) { return e; } return e && e.fileList; }}>
          <Dragger
            maxCount={1}
            showUploadList={true}
            beforeUpload={beforeUpload}
            itemRender={(originNode, file, currFileList, actions: { download: any, preview: any, remove: any }) => (
              <table className={importStyle.importTable}>
                <tr>
                  <th>文件名</th>
                  <th>文件大小</th> 
                  <th>状态</th>
                  <th>操作</th>
                </tr>
                <tr>
                  <td width='45%' className={importStyle.textCenter}>
                    <Tooltip title={file.name}>
                      <div className={importStyle.textName}>{file.name}</div>
                    </Tooltip>
                  </td>
                  <td width="20%" className={importStyle.textCenter}>{myUtil.text.formatNum(file.size?(file.size/1024):0, '0,0')}KB</td>
                  <td width="18%" className={importStyle.textCenter}><ClockCircleOutlined />&nbsp;待上传</td>
                  <td width="17%" className={importStyle.textCenter}><a onClick={()=>actions.remove()}>删除</a></td>
                </tr>
              </table>
            )}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或将文件拖拽到此区域</p>
          </Dragger>

        </Form.Item>
      </>,
      okCallbackFn: function (thisObj: any) {
        DDAlert.getForms().validateFields().then((values: any) => {
          if(values.file[0].originFileObj) {
            thisObj.setState({ masker: true });
            const formData = new FormData();
            formData.append('fileName', values.file[0].originFileObj);
            formData.append('file-name-suffix', values.file[0].name);
            formData.append('lcswsxDm', record.lcswsxDm || '');
            formData.append('flzlDm', record.flzlDm || '');
            formData.append('flzldlDm', record.flzldlDm || '');
            formData.append('sbwjuuid', record.sbwjuuid || '');
            formData.append('sjsbuuid', record.sjsbuuid || '');
            formData.append('sbflzluuid', record.sbflzluuid || '');
            formData.append('uuid', record.mxbuuid || '');
            formData.append('bzuuid', record.bzuuid || '');
            formData.append('bzmxbuuid', record.bzmxbuuid || '');
            formData.append('flzlmc', record.flzlmc || '');
            checkFileGrid(formData).then((response1) => {
              // 1.附件中文件类型检查
              if (response1.code === '200') {
                return uploadFlzl(formData);
              }
              thisObj.setState({ masker: false });
              throw new Error(response1.msg);
            }).then((response2) => {
              // 2.文件上传
              const { code, msg, body } = response2;
              if (code === '200') {
                initPage(recordPar);
                message.info(body);
                thisObj.setState({ masker: false });
                DDAlert.close();
              } else {
                thisObj.setState({ masker: false });
                message.error(msg);
              }
            }).catch(error => {
              thisObj.setState({ masker: false });
              message.error(error.message);
            });
          } else {
            message.info('文件传输失败，请重试！')
          }
        });
      },
    });
  }


  // 删除
  const handleDeleteFlzl = (record: any) => {
    Modal.confirm({
      title: '确定要删除报送资料吗？',
      onOk() {
        const param = {
					sbflzluuid: record.sbflzluuid,
					uuid: record.mxbuuid,
					bzuuid: record.bzuuid,
          sjsbuuid:record.sjsbuuid,
					bzmxbuuid: record.bzmxbuuid
				};
        deleteFlzl(param).then((response) => {
          const { code, desc } = response;
          if (code === '200') {
            message.info(desc);
            initPage(recordPar);
          } else {
            message.error(desc);
          }
        })
      },
    });
  }

  // 操作列
  const renderColumnHandle = (text: string, record: any) => {
    const btnDownload = (<Button type='link' onClick={() => handleDownloadFlzl(record)}>下载</Button>);
    const btnUpload = (<Button type='link' onClick={() => handleUploadFlzl(record)}>上传</Button>);
    const btnDel = (<Button type='link' onClick={() => handleDeleteFlzl(record)}>删除</Button>);
    if (record.sjsbztDm === '3' || record.sjsbztDm === '2') { // 最优先主流程的状态 如果 办结 作废  备案的作废 只有下载
			if (record.mxbuuid) {
        return btnDownload;
			}
		} else  { // 从在线接入 即使没有数据 也会将 sbwjuuid 查询出来的
      if (record.qrbz === '0' || record.qrbz === null || record.qrbz === '') { // 未进行确认
    		// 1：是需要自动生成的文件 0：不需要自动生成的文件
    		if (record.bzuuid && record.bzuuid.trim()) { // 说明存在补正记录
    			// 有可能已经进行过补正 也有可能没进行过补正
    			if (record.bzmxbuuid) { // 此次 需要进行补正的附列资料 代码
    				if (record.mxbuuid) { // 上传过 有文件得到情况
              return <Fragment>
                {btnUpload}
                <Divider type='vertical' />
                {btnDel}
                <Divider type='vertical' />
                {btnDownload}
              </Fragment>
            }
            return btnUpload;
          }
          if (record.mxbuuid) {
            // 那些不需要补正的附列资料
    				// 上传过 有文件得到情况
            return btnDownload;
          }
    		} else { // 说明是默认初始的上传
    			if (record.zdscbz === '0') { // 非自动生成的附列资料
    				if (record.mxbuuid) { // 上传过 有文件得到情况
              return <Fragment>
                {btnUpload}
                <Divider type='vertical' />
                {btnDel}
                <Divider type='vertical' />
                {btnDownload}
              </Fragment>
            }
            return btnUpload;
    			} if (record.zdscbz === '1') { // 自动生成的附列资料
            if (record.mxbuuid) {
              // 已经上传过文件但是自动生成标志为1
              // return btnDownload;
              return <Fragment>
              {btnUpload}
              <Divider type='vertical' />
              {btnDel}
              <Divider type='vertical' />
              {btnDownload}
            </Fragment>
            }
            return btnUpload;
          }
        }
      } else if (record.mxbuuid) {
        // 已进行确认操作
        // 即使正式申报了 也有可能没有上传过附列资料
        return btnDownload;
      }
    }
    return null;
  }

  // 配置列表列 子表
  const getColumnsChild = () => {
    const myColumns = [];
    myColumns.push({ title: '报送资料名称', dataIndex: 'flzlmc' });
    myColumns.push({ title: '报送条件', dataIndex: 'flzlbslxmc', width: 120 }); // 
    myColumns.push({ title: '上传状态', dataIndex: 'flzlsczt', width: 120, render: (text: string, record: any) => {
        if(record.mxbuuid != null && record.mxbuuid.trim() != ""){
          return <span style={{color: '#04f604'}}>已上传</span>;
        } else {
          return <span>未上传</span>;
        }
      }  
    });
    if (dbzsl && dbzsl > 0) {
      myColumns.push({ title: '补正状态', dataIndex: 'bzcgbz', width: 120 , render: (text: string, record: any) => {
        if(record.bzcgbz == 'Y'){
          return <span>已补正</span>;
        } else if(record.bzcgbz == 'N'){
          return <span>待补正</span>;
        }else {
          return <span></span>;
        }
      }  
    });
    }
    myColumns.push({ title: '操作', dataIndex: 'cz', width: 160, fixed: 'right', align: 'center', render: renderColumnHandle });
    return myColumns;
  }

  // 页面初始化
  const initPage = async (record: any) => {
    // 1.待补正附列资料
    const params1 = {
      lcswsxDm: record.lcswsxDm,
			sbwjuuid: record.sbwjuuid,
			sjsbuuid: record.sjsbuuid,
    };
    setMasker(true);
    await queryBzmxbInfo(params1).then((response1) => {
      setQueryBzmxbInfoResponse(response1);
      if (response1.code !== '200') {
        message.error(response1.desc);
      } else {
        let respo = JSON.parse(response1.body);
        //测试时添加
        if (respo.sjzbztDm === '2' || respo.sjzbztDm === '3') {
          // 流程办结或者作废,待补正的资料数量重置成0
          setDbzsl(0);
          setConfirmBtnDisabled(true);
        } else {
          const data = respo.dataRows;
          if (data.length === 0) {
            setConfirmBtnDisabled(true);
          } else { // 已有附列资料
            let dbzslTemp = 0;
            let qrboo = false;
            for (let a = 0; a < data.length; a+=1) {
              const tempObj = data[a];
              if (tempObj.qrbz === '1') {
                // setConfirmBtnDisabled(true);
                qrboo = true;
              }
              // 统计需要补正数量
              if (tempObj.xbzdzzlfs && tempObj.xbzdzzlfs !== 0) {
                dbzslTemp+=parseInt(tempObj.xbzdzzlfs);
              }
            }
            if (qrboo) {
              setConfirmBtnDisabled(true);
            } else {
              setConfirmBtnDisabled(false);
            }
            setDbzsl(dbzslTemp);
          }
        }
      }

    })

    // 2.获取主表
    const params2 = {
      page: 1,
      pageSize: 999999,
      searchModel: [
        { property: 'sbwjuuid', value: record.sbwjuuid, op: 'al'},
        { property: 'sjsbuuid', value: record.sjsbuuid, op: 'al'},
        { property: 'lcswsxDm', value: record.lcswsxDm, op: 'al'},
      ],
    }

    await queryFlzlJcInfo(params2).then((response2) => {
      const { code, body } = response2;
      if (code === '200' && body && body.rows) {
        const rowsMain = body.rows;
        const promiseArr = [];
        for (let i=0; i<rowsMain.length; i+=1) {
          const tmp = rowsMain[i];
          const params3 = {
            page: 1,
            pageSize: 999999,
            searchModel: [              
            {property: 'sbwjuuid', value: record.sbwjuuid, op: 'al'},
            {property: 'lcswsxDm', value: record.lcswsxDm, op: 'al'},
            {property: 'sjsbuuid', value: record.sjsbuuid, op: 'al'},
            {property: 'flzldlDm', value: tmp.flzldlDm, op: 'al'},
          ],
          }

          promiseArr.push(queryFlzlInfo(params3));
        }
        setDefaultExpandedRowKeys([rowsMain[0].flzldlDm]); // 默认展开第一行
        // 3.获取子表
        Promise.all(promiseArr).then((response3) => {
          for (let i=0; i<response3.length; i+=1) {
            const rowsChild = response3[i].body.rows; // 子表数据
            for (let m=0; m<rowsMain.length; m+=1) {
              if (rowsMain[m].flzldlDm === rowsChild[0].flzldlDm) {
                rowsMain[m].child = rowsChild;
                break;
              }
            }
          }
          setMasker(false);
          setGridData(rowsMain);
          let list = [];
          for(let i=0;i<rowsMain.length;i++){
            for(let j=0;j<rowsMain[i].child.length;j++){
              list.push(rowsMain[i].child[j]);
            }
          }
          setCheckList(list);
        }).catch((reason) => {
          setMasker(false);
          message.error(reason);
        });
      }
    })

  }

  // 提交
  const formSubmit = () => {
    const check = [...checkList];
    for(let i=0;i<check.length;i++){
      if(check[i].bzcgbz == 'N'){
        message.info(`报送资料：${  check[i].flzlmc  }存在待补正数据！`);
        return;
      }
      if((check[i].mxbuuid == null || check[i].mxbuuid.trim() == "") && check[i].flzlbslxDm == '1' ){
        message.info(`报送资料：${  check[i].flzlmc  }存在必须报送但未上传的数据！`);
        return;
      }
    }
      const respo = JSON.parse(queryBzmxbInfoResponse.body);
      const data = respo.dataRows;
      if (data.length === 0) {
        message.error('请上传资料！');
        setConfirmBtnDisabled(false);
      } else { // 已有附列资料
        let sbflzluuid;
        for (let a = 0; a < data.length; a+=1) {
          const tempObj = data[a];
          sbflzluuid = tempObj.sbflzluuid;
        }
        submitConfirm(sbflzluuid);
      }
  }

  // 附列资料确认
  const submitConfirm = (sbflzluuid: any) => {
    const params = {
			sbflzluuid,
			qrbz: 'Y'
		};
    flzlQr(params).then((response) => {
      if (response.code !== '200') {
        // 给出提示信息
        setConfirmBtnDisabled(false);
        message.error(response.msg);
      } else {
        message.info(response.body);
        setConfirmBtnDisabled(false);
        setModalVisible(false);
      }
    })
  }

  // 列表扩展
  const expandedRowRender = (record: any) => {
    const columns = getColumnsChild();
    const tableChild =<DDBaseGrid
        columns={columns}
        userDataSource={record.child}
        pagination={false}
        showSerialNumber
        rowKey='flzlDm'
        searchModel={{
          flzldlDm: record.flzldlDm
        }}
      />
    return tableChild;
  };

  return (
      <Modal
        title="报送资料维护"
        centered
        destroyOnClose
        visible={modalVisible}
        wrapClassName='standard-modal-1'
        width={pro.c_modal_width_x4}
        okText="确认提交"
        cancelText="关闭"
        onCancel={() => setModalVisible(false)}
        footer={(
          <Fragment>
            <Button onClick={formSubmit} type="primary" disabled={confirmBtnDisabled}>确认提交</Button>
            <Button onClick={() => setModalVisible(false)} type="default">关闭</Button>
          </Fragment>
        )}
      >
        <Spin tip="Loading..." spinning={masker} delay={200}>
        <DDBaseGrid
          columns={getColumns()}
          showSerialNumber
          rowKey='flzldlDm'
          userDataSource = {gridData}
          pagination={false}
          expandable={{
            expandedRowRender,
            defaultExpandedRowKeys
          }}
        />
        <ZlscModal onRef={refUpload} beforeUpload={beforeUpload} />
        </Spin>

      </Modal>
  );
};
export default Zlsc;
