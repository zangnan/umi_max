import React, { useState, useRef } from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import unitConfig from './config';
import func from './func'
import Zlxz from './zlxz'
import { cloneDeep } from 'lodash';
import { Row, Col, Card, message, Image, Spin, Empty, Tooltip } from 'antd';
import IndexZlgl from '../common/ml/index_zlgl'
import { queryGdzlkDzWj } from '@/pages/hts/services/htsApi';
import cktsUtil from '@/pages/hts/cktsUtil';
import './style.less';


const Index: React.FC<unknown> = () => {

  const zlxzRef: any = useRef();

  func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(zlxzRef);
    return otherRef;
  };

  const [mlRecord, setMlRecord] = useState<any>(null);
  const [showPic, setShowPic] = useState<boolean>(false);
  const [listHtml, setListHtml] = useState<any>();
  const [bookHtml, setBookHtml] = useState<any>();
  const [src, setSrc] = useState<any>([]);
  const [visible, setVisible] = useState<any>(false);
  const [masker, setMasker] = useState<any>(false);
  const [mlDisplay, setMlDisplay] = useState<boolean>(false);

  let myConfig = cloneDeep(unitConfig);

  // 左侧列表行点击事件
  func.gridOnRowClick = (param: any) => {
    const { record } = param;
    setShowPic(false);
    setMlRecord(record);
  }

  // 列表加载后执行
  func.afterReload = (param: any) => {
    const { gridRef } = param;
    const gridData = cloneDeep(gridRef?.current?.getSource());
    if (gridData && gridData.length > 0) {
      setMlRecord(gridData[0]);
      setMlDisplay(true);
    } else {
      setMlDisplay(false);
    }
  }

  // 详情
  const viewDetails = () => {
    // 单证类型固定值0102030405060708，获取全部数据查看缩略图
    setMasker(true);
    queryGdzlkDzWj({...mlRecord, dzlx: '0102030405060708'}).then((res) => {
      setMasker(false);
      const { body, code, desc } = res;
      if (code === '200') {
        showTpList(body)
        setShowPic(true);
      } else {
        message.error(desc);
      }
    })
  }

  // 获取图片路径
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

	// 点击左右翻页
	const changeImage = (picJson: any, activeXh: any, fx: any) => {
		if (fx == 'left') {
			if (activeXh % 2 == 0) {
				lookPic(activeXh - 1, picJson);
			} else {
				lookPic(activeXh - 2, picJson);
			}
		} else {
			if (activeXh % 2 == 0) {
				lookPic(activeXh + 1, picJson);
			} else {
				lookPic(activeXh + 2, picJson);
			}
		}
	}

  // 加载图片
  const showTpList = (picJson: any) => {
		let allEl: any = [];
		if (picJson != null && picJson.length > 0) {
			for (let i = 0; i < picJson.length; i++) {
        let listEl: any = [];
				if (picJson[i].wjlx == 'pdf') {
					// 判断不同的单证类型，显示不同的缩略图
					if (picJson[i].dzlx === '01') {
						listEl.push(<img src={`${getImgSrc()}/ckxsht.png`} />);
					} else if (picJson[i].dzlx === '02') {
						listEl.push(<img src={`${getImgSrc()}/ghht.png`} />);
					} else if (picJson[i].dzlx === '03') {
						listEl.push(<img src={`${getImgSrc()}/wzfht.png`} />);
					} else if (picJson[i].dzlx === '04') {
						listEl.push(<img src={`${getImgSrc()}/tyd.png`} />);
					} else if (picJson[i].dzlx === '05') {
						listEl.push(<img src={`${getImgSrc()}/ysfp.png`} />);
					} else if (picJson[i].dzlx === '06') {
						listEl.push(<img src={`${getImgSrc()}/wtbgxy.png`} />);
					} else if (picJson[i].dzlx === '07') {
						listEl.push(<img src={`${getImgSrc()}/dlbgfwffp.png`} />);
					} else if (picJson[i].dzlx === '08') {
						listEl.push(<img src={`${getImgSrc()}/qtdz.png`} />);
					}
				} else {
          listEl.push(<img src={picJson[i].picUrl} />);
				}
        allEl.push(<div className='listItem active' onClick={() => lookPic(i + 1, picJson)}>
          {listEl}
          <div className='picName'>{picJson[i].tpname}</div>
        </div>);
			}
      setListHtml(allEl);
			lookPic(1, picJson);
		}
  }

  // 获取各合同信息
  const getHtContent = (record: any) => {
    const htTitleList = {
      '01': '出口销售合同',
      '02': '购货合同',
      '03': '外综服合同',
      '04': '提运单',
      '05': '运输发票',
      '06': '委托报关协议',
      '07': '代理服务费发票',
      '08': '其他单证'
    }
    const htTitle: String = htTitleList[record.dzlx];
    const htbhDivList = {
      '01': '合同编号',
      '02': '合同编号',
      '03': '合同编号',
      '04': '提运单号',
      '05': '进货凭证号',
      '06': '协议号',
      '07': '进货凭证号',
      '08': '文件名称'

    }
    const htbhDiv: String = htbhDivList[record.dzlx];
    let htHtml: any = [];
    if (record.dzlx === '01' || record.dzlx === '02' || record.dzlx === '03') {
      htHtml.push(<>
          <div className="htbhDiv"><Tooltip title={record.htbh}>{`${htbhDiv}：${record.htbh}`}</Tooltip></div>
          <div className="htsTitle htsTitleLeft">{htTitle}</div>
          <div className="htxxDiv">
            <div className="htjfDiv">合同甲方：<Tooltip title={record.htjf}>{record.htjf}</Tooltip></div>
            <div className="htjfDiv">合同乙方：<Tooltip title={record.htyf}>{record.htyf}</Tooltip></div>
            <div className="htjfDiv">签订日期：<Tooltip title={record.qdrq}>{record.qdrq}</Tooltip></div>
          </div>
        </>
      )
    } else if (record.dzlx === '06') {
      htHtml.push(<>
          <div className="htbhDiv"><Tooltip title={record.htbh}>{`${htbhDiv}：${record.htbh}`}</Tooltip></div>
          <div className="htsTitle htsTitleLeft">{htTitle}</div>
          <div className="htxxDiv">
            <div className="htjfDiv">甲方名称：<Tooltip title={record.htjf}>{record.htjf}</Tooltip></div>
            <div className="htjfDiv">乙方名称：<Tooltip title={record.htyf}>{record.htyf}</Tooltip></div>
            <div className="htjfDiv">签订日期：<Tooltip title={record.qdrq}>{record.qdrq}</Tooltip></div>
          </div>
        </>
      )
    } else if (record.dzlx === '04' || record.dzlx === '05' || record.dzlx === '07' || record.dzlx === '08') {
      htHtml.push(<>
          <div className="htbhDiv"><Tooltip title={record.htbh}>{`${htbhDiv}：${record.htbh? record.htbh : ''}`}</Tooltip></div>
          <div className="htsTitle htsTitleLeft">{htTitle}</div>
        </>
      )
    }
    const htContent = <div className="showPDf changeQh">
      {htHtml}
    </div>;
    return htContent;
  }

  // 渲染书左右内容
  const lookPic = (xh: any, picJson: any) => {
		let listEl: any = [];
    // 书左面
    if (xh - 1 < picJson.length) {
      listEl.push(<div className="picBoxImage">
        <div className="picBoxFull" style={{left: '58px'}} onClick={() => openImage(picJson, xh, 'left')}>
          全屏
          <div className='fullImgLeft'></div>
        </div>
        {
          picJson[xh - 1].wjlx == 'pdf' ? getHtContent(picJson[xh - 1]) : <div id="imageLeft" className="showImage changeQh">
            <Image src={picJson[xh - 1].picUrl} preview={false} />
          </div>
        }
        {
          xh - 1 > 0 ? <div className='showPicLeft' onClick={() => changeImage(picJson, xh, 'left')}></div> : <></>
        }
      </div>);
    }
    // 书右面
    if (xh < picJson.length) {
      listEl.push(<div className="picBoxImage">
        <div className="picBoxFull" id="openImgRight" style={{right: '62px'}} onClick={() => openImage(picJson, xh, 'right')}>
          <div className='fullImgRight'></div>
          全屏
        </div>
        {
          picJson[xh].wjlx == 'pdf' ? getHtContent(picJson[xh]) : <div id="imageRight" className="showImage changeQh">
            <Image src={picJson[xh].picUrl} preview={false} />
          </div>
        }
        {
          xh + 1 < picJson.length ? <div className='showPicRight' onClick={() => changeImage(picJson, xh, 'right')}></div> : <></>
        }
      </div>);
    }
    setBookHtml(listEl);
  }

	// 全屏预览pdf或图片
  const openImage = (picJson: any, activeXh: any, fx: any) => {
		let aciveIndex = 0;
		if (fx == 'left') {
			aciveIndex = activeXh - 1;
		} else {
			aciveIndex = activeXh;
		}
		if (picJson[aciveIndex].wjlx == 'pdf') {
			// 请求后台查询选中数据的所有文件
      queryGdzlkDzWj(picJson[aciveIndex]).then((res) => {
        const { body, code, desc } = res;
        if (code !== '200') {
          message.error(desc);
        } else {
          const imgsrc = body[0].picUrl.replace('data:application/pdf;base64,', '');
          const byteCharacters = atob(imgsrc);
          let n = byteCharacters.length,
          u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = byteCharacters.charCodeAt(n);
          }
          const blob = new Blob([u8arr], { type: 'application/pdf' });
          const src = cktsUtil.getPdfLj();
          window.open(`${src}?file=${URL.createObjectURL(blob)}&name=${body.wjm}`);
        }
      })
		} else {
			//	图片地址
      setSrc(picJson[aciveIndex].picUrl);
      setVisible(true);
		}
  }

  // 渲染右侧内容
  const rightHtml = () => {
		let listEl: any = [];
    if (!mlDisplay) {
      listEl.push(
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    );
    } else {
      if (showPic) {
        listEl.push(
          <div className="picPage">
            <div className="picBox">
              {bookHtml}
            </div>
            <div className="picList" id="picList">{listHtml}</div>
          </div>
        );
      } else {
        listEl.push(
          <Card style={{ width: '450px' }} actions={[
              <div onClick={viewDetails}>详情</div>
            ]}
          >
            <IndexZlgl record={mlRecord} />
          </Card>
        );
      }
    }
    return listEl;
  }

  return <Spin tip="Loading..." spinning={masker} delay={100}>
    <Row gutter={12} className='rowColor'>
      <Col span={10} className='colColor'>
        <DDBunit2 config={myConfig} func={func} />
      </Col>
      <Col span={14} style={{ justifyContent: 'center', display: 'flex' }}>
        {rightHtml()}
      </Col>
    </Row>
    <Zlxz onRef={zlxzRef} />
    <Image
      width={200}
      style={{ display: 'none' }}
      src={src}
      preview={{
        visible,
        src: src,
        onVisibleChange: (value) => {
          setVisible(value);
        },
      }}
    />
  </Spin>;
};

export default Index;
