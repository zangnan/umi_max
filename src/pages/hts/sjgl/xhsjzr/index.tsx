import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Select, Space, Spin, message, Tooltip } from 'antd';
import {
  DownloadOutlined, ReloadOutlined, ExportOutlined, ExclamationCircleOutlined, MoneyCollectOutlined, EyeOutlined
} from '@ant-design/icons';
import {
  getXhsjzrData, startDownload, reDownload, checkDlt2, createBaseDataTask, queryKak, xhsjzrKakCheckData, xzrwjy, xhsjzrKakSave, hgsjxz, exportExcelSjzrxzWsbBgdFp } from '@/pages/hts/services/htsApi';
import './NewUserDataAccess.less';
import { history } from "@@/core/history";
import TabSfyz from "@/pages/hts/sjgl/xhsjzr/tab_sfyz";
import IcCardMaintain from "@/pages/hts/sjgl/xhsjzr/IcCardMaintain";
import IcCardSelect from "@/pages/hts/sjgl/xhsjzr/IcCardSelect";
import khdgjUtil from "@/pages/hts/ckfp/khdgjUtil";
import { v4 as uuidv4 } from 'uuid';
import IcList from '@/pages/hts/pzgl/icCard/common/icCardTsList';
import DDAlert from '@/pages/hts/components/DDAlert';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { IcCardItem } from './IcCardSelect';
import myUtil from '@/components/DDAssist/util';

const { Option } = Select;
const NewUserDataAccess: React.FC = () => {
  const refKprz: any = useRef();
  // 状态管理
  const [progress, setProgress] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState('待执行');
  const [selectedPeriod, setSelectedPeriod] = useState('2');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fpsjxzztmc, setFpsjxzztmc] = useState('');
  const [bgdsjxzztmc, setBgdsjxzztmc] = useState('');
  const [sjzruuid, setSjzruuid] = useState('');
  // 新增：存储下载日期用于提示
  const [downloadDate, setDownloadDate] = useState('');

  // 区分主动操作和轮询的蒙版状态
  const [isManualLoading, setIsManualLoading] = useState(false);

  // 数据统计状态
  const [dataStats, setDataStats] = useState({
    exportDeclarations: { declared: 0, undeclared: 0 },
    inputInvoices: {
      fullyDeclared: 0,
      partiallyDeclared: 0,
      undeclared: 0,
      bfsbysbje: 0,
      bfsbwsbje: 0,
      wsbje: 0,
      wsbtse: 0
    }
  });

  // 轮询相关 - 使用ref存储定时器ID，避免闭包问题
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pollCountRef = useRef(0); // 记录轮询次数，用于调试

  // IC卡相关状态
  const [icCardList, setIcCardList] = useState<any[]>([]);
  const [showMaintainIcCardModal, setShowMaintainIcCardModal] = useState(false);
  const [showSelectIcCardModal, setShowSelectIcCardModal] = useState(false);
  const [icCardForm, setIcCardForm] = useState({
    kaklxDm: '1',
    kakbm: '',
    kakmm: ''
  });
  const [formErrors, setFormErrors] = useState({
    kaklxDm: '',
    kakbm: '',
    kakmm: ''
  });
  const refICList: any = useRef();
  const [chardIndex, setCardIndex] = useState<any>('');
  const [selectedCard, setSelectedCard] = useState<IcCardItem | null>(null);

  // 处理IC卡选择
  const handleSelectCard = (card: IcCardItem) => {
    setSelectedCard(card);
  };

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  // 页面初始化时查询数据
  useEffect(() => {
    fetchData();
  }, []);

  // 停止轮询的通用方法
  const stopPolling = () => {
    if (pollTimerRef.current) {
      console.log(`停止轮询，已执行${pollCountRef.current}次`);
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
      pollCountRef.current = 0;
    }
  };

  // 核心轮询方法
  const startPolling = () => {
    // 先停止可能存在的轮询
    stopPolling();

    console.log('开始新的轮询');

    // 立即执行一次
    pollData();

    // 设置定时器并存储到ref中
    pollTimerRef.current = setInterval(() => {
      pollData();
    }, 3000);
  };

  // 轮询时实际执行的函数（不显示蒙版）
  const pollData = async () => {
    // 检查当前状态是否允许轮询
    if (downloadStatus !== '执行中') {
      console.log(`轮询终止，当前状态: ${downloadStatus}`);
      stopPolling();
      return;
    }

    pollCountRef.current++;
    console.log(`执行第${pollCountRef.current}次轮询`);

    try {
      const response = await getXhsjzrData({ period: selectedPeriod });
      const retBody = response.body;

      // 更新进度和状态（轮询不显示蒙版）
      setProgress(retBody.sjxzjd || 0);
      setDownloadStatus(retBody.xzztmc || '待执行');

      // 保存下载日期用于提示
      setDownloadDate(retBody.xzsj || '');

      // 更新其他状态
      setFpsjxzztmc(retBody.fpsjxzztmc || '');
      setBgdsjxzztmc(retBody.bgdsjxzztmc || '');
      setDataStats({
        exportDeclarations: {
          declared: retBody.ysbbgdts || 0,
          undeclared: retBody.wsbbgdts || 0
        },
        inputInvoices: {
          fullyDeclared: retBody.ysbfpzs || 0,
          partiallyDeclared: retBody.bfsbfpzs || 0,
          undeclared: retBody.wsbfpzs || 0,
          bfsbysbje: retBody.bfsbysbje || 0,
          bfsbwsbje: retBody.bfsbwsbje || 0,
          wsbje: retBody.wsbje || 0,
          wsbtse: retBody.wsbtse || 0
        }
      });

      // 如果状态已变为非执行中，停止轮询
      if (retBody.xzztmc !== '执行中') {
        console.log(`轮询检测到状态变更为: ${retBody.xzztmc}，停止轮询`);
        stopPolling();
      }
    } catch (error) {
      console.error(`第${pollCountRef.current}次轮询出错:`, error);
      // 出错后继续轮询，但最多尝试10次
      if (pollCountRef.current >= 10) {
        console.log('轮询连续出错10次，自动停止');
        message.error('数据刷新失败，已停止自动刷新');
        stopPolling();
      }
    }
  };

  const fetchData = async () => {
    setIsManualLoading(true);
    try {
      const response = await getXhsjzrData({ period: selectedPeriod });
      const retBody = response.body;

      // 关键：无论前端当前值是什么，强制同步为数据库中存储的周期（接口返回的xzzqDm）
      if (retBody.xzzqDm) {
        setSelectedPeriod(retBody.xzzqDm); // 覆盖前端临时选择的值
      }

      // 其他状态更新（保持不变）
      setSjzruuid(retBody.sjzruuid || '');
      setIsDataLoaded(true);
      setProgress(retBody.sjxzjd || 0);
      setDownloadStatus(retBody.xzztmc || '待执行');
      setFpsjxzztmc(retBody.fpsjxzztmc || '');
      setBgdsjxzztmc(retBody.bgdsjxzztmc || '');
      setDownloadDate(retBody.xzsj || '');
      setDataStats({
        exportDeclarations: {
          declared: retBody.ysbbgdts || 0,
          undeclared: retBody.wsbbgdts || 0
        },
        inputInvoices: {
          fullyDeclared: retBody.ysbfpzs || 0,
          partiallyDeclared: retBody.bfsbfpzs || 0,
          undeclared: retBody.wsbfpzs || 0,
          bfsbysbje: retBody.bfsbysbje || 0,
          bfsbwsbje: retBody.bfsbwsbje || 0,
          wsbje: retBody.wsbje || 0,
          wsbtse: retBody.wsbtse || 0
        }
      });

      // 轮询逻辑（保持不变）
      if (retBody.xzztmc === '执行中') {
        startPolling();
      } else {
        stopPolling();
      }
    } catch (error) {
      console.error('数据查询错误:', error);
      message.error('数据查询失败，请稍后重试');
      setIsDataLoaded(true);
      setDownloadStatus('待执行');
      stopPolling();
    } finally {
      setIsManualLoading(false);
    }
  };

  // 下载周期变更处理
  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
  };

  // 开始下载处理（主动操作，显示蒙版）
  const handleDownload = async () => {
    DDAlert.open({
      title: '系统提示',
      info: [
        '您正在申请下载近' + selectedPeriod + '年审核结果反馈数据，包含：',
        '✓ 免退税审核结果反馈',
        '✓ 出口退税发票状态信息',
        '✓ 出口报关单状态信息',
        '确认后系统将创建任务。'
      ],
      okText: '确定',
      cancelText: '取消',
      infoType: 'warning',
      modalType: 'confirm',
      closeStatus: false,
      // 使用异步回调处理异步操作
      okCallbackFn: async function (thisObj: any) {
        DDAlert.close();
        setIsManualLoading(true); // 显示蒙版
        try {
          const downloadResult = await startDownload({ xzzqDm: selectedPeriod });
          // 检查接口返回状态码
          if (downloadResult?.code !== '200') {
            message.error(downloadResult.msg);
            return;
          }
          message.success('下载任务创建成功');
          await fetchData(); // 等待数据刷新
        } catch (error) {
          console.error('下载任务创建失败:', error);
          message.error('下载任务创建失败，请稍后重试');
        } finally {
          // 关闭弹窗后再隐藏蒙版
          DDAlert.close();
          // 稍微延迟，确保视觉效果
          setTimeout(() => {
            setIsManualLoading(false);
          }, 300);
        }
      },
      cancelCallbackFn: function () {
        DDAlert.close();
      }
    })
  };


  // 第一个查看详情处理
  const handleViewDetails1 = () => {
    if (downloadStatus === '待执行') {
      message.info('请先完成数据下载');
      return;
    }
    history.push('/02/0201?tp=1&sjzruuid=' + sjzruuid);
  };

  // 第二个查看详情处理
  const handleViewDetails2 = () => {
    if (downloadStatus === '待执行') {
      message.info('请先完成数据下载');
      return;
    }
    history.push('/02/0201?tp=2&sjzruuid=' + sjzruuid);
  };

  // 刷新/重新下载处理（主动操作，显示蒙版）
  const handleRefreshOrRedownload = async () => {
    setIsManualLoading(true); // 显示蒙版
    setIsRefreshing(true);

    try {
      if (downloadStatus === '执行中' || downloadStatus === '执行完成') {
        await fetchData();
      } else if (downloadStatus === '执行失败') {
        const downloadResult = await reDownload({ xzzqDm: selectedPeriod, sjzruuid: sjzruuid });
        // 检查接口返回状态码
        if (downloadResult?.code !== '200') {
          message.error(downloadResult.msg);
          return;
        }
        message.success('下载任务创建成功');
        await fetchData(); // 等待数据刷新
      }
    } catch (error) {
      console.error('刷新/重新下载错误:', error);
      message.error('操作失败，请稍后重试');
    } finally {
      setIsRefreshing(false);
      setIsManualLoading(false); // 隐藏蒙版
    }
  };

  // 导出未申报数据处理（主动操作，显示蒙版）
  const handleExport = async () => {
    if (downloadStatus !== '执行完成') {
      message.warning('请先完成数据下载');
      return;
    }
    setIsManualLoading(true); // 显示蒙版
    try {
      exportExcelSjzrxzWsbBgdFp({ xzzqDm: selectedPeriod, xzsj: downloadDate }).then((res: any) => {
        const { code, body, msg } = res;
        if (code === '200') {
          const { blob, fileName } = body;
          DDAlert.close();
          myUtil.file.downloadExcel(blob, fileName);
        } else {
          message.error(msg);
        }
      });
      message.success('报告导出成功');
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败');
    } finally {
      setIsManualLoading(false); // 隐藏蒙版
    }
  };

  // 按钮状态控制逻辑
  const isStartDownloadDisabled = () => {
    return !isDataLoaded || downloadStatus !== '待执行';
  };
  const isExportDisabled = () => {
    return !isDataLoaded || downloadStatus !== '执行完成';
  };
  const isRefreshDisabled = () => {
    return !isDataLoaded || downloadStatus === '待执行';
  };
  const isViewDetailsDisabled = () => {
    return !isDataLoaded || downloadStatus === '待执行';
  };
  const isBasicDataSjxzButtonsDisabled = () => {
    // 基础条件：downloadStatus 必须为“执行完成”
    const isDownloadReady = downloadStatus === '执行完成';
    // 排除条件：两个字段都为“执行完成”时不可用
    const bothCompleted = fpsjxzztmc === '执行完成' && bgdsjxzztmc === '执行完成';

    // 按钮可用的条件：downloadStatus 是“执行完成”，且并非两个字段都“执行完成”
    // 因此禁用逻辑取反：!可用条件 → 禁用
    return !(isDownloadReady && !bothCompleted);
  };
  const isBasicDataCkxqButtonsDisabled = () => {
    // 核心逻辑：只有当至少一个字段为"执行完成"时，按钮才可用
    // 其他所有情况都禁用按钮
    return !(fpsjxzztmc === '执行完成' || bgdsjxzztmc === '执行完成');
  };

  // 基础数据下载处理（主动操作，显示蒙版）
  const handleBasicDataDownload = async () => {
    setIsManualLoading(true); // 显示蒙版
    try {
      // 先处理发票下载，如果未完成
      if (fpsjxzztmc !== '执行完成') {
        const res = await checkDlt2({ jxbz: "Y" });
        const { code, msg, body } = res;
        if (code === '200') {
          const dl = body?.dlbz == 'Y' ? true : false;
          if (dl) {
            await handleBasicDataDownloadFp();
          } else {
            logon('3');
          }
        } else {
          message.error(msg);
        }
      }
      // 如果发票已完成但报关单未完成，直接处理报关单
      else if (bgdsjxzztmc !== '执行完成') {
        await handleBasicDataDownloadBgd();
      }
    } catch (error) {
      console.error('基础数据下载处理失败:', error);
      message.error('基础数据下载处理失败');
    } finally {
      setIsManualLoading(false); // 最终隐藏蒙版
    }
  };

// 基础数据下载-发票，返回操作是否成功
  const handleBasicDataDownloadFp = async (): Promise<boolean> => {
    try {
      setIsManualLoading(true); // 显示蒙版
      const params2 = { xzzqDm: selectedPeriod, sjzruuid: sjzruuid, xzlx: 'jxfp' };
      const response = await createBaseDataTask(params2);
      if (response.code === '200') {
        message.success('发票下载任务创建成功');
        fetchData();
        await handleBasicDataDownloadBgd();
        return true; // 成功执行
      } else {
        message.error(response.msg || '创建发票基础数据任务失败');
        return false; // 执行失败
      }
    } catch (error) {
      console.error('发票基础数据下载错误:', error);
      message.error('发票基础数据下载失败');
      return false; // 发生异常
    } finally {
      setIsManualLoading(false);
    }
  };

// 基础数据下载-报关单
  const handleBasicDataDownloadBgd = async () => {
    try {
      await queryIcCardList();
    } catch (error) {
      console.error('报关单基础数据下载错误:', error);
      message.error('报关单基础数据下载失败');
    }
  };

  // 表单验证方法
  const validateForm = () => {
    const errors = { kaklxDm: '', kakbm: '', kakmm: '' };
    let isValid = true;

    if (!icCardForm.kaklxDm) {
      errors.kaklxDm = 'IC卡类型不能为空';
      isValid = false;
    }

    if (!icCardForm.kakbm.trim()) {
      errors.kakbm = 'IC卡别名不能为空';
      isValid = false;
    } else if (icCardForm.kakbm.length > 60) {
      errors.kakbm = 'IC卡别名长度不能超过60字符';
      isValid = false;
    }

    if (!icCardForm.kakmm) {
      errors.kakmm = 'IC卡密码不能为空';
      isValid = false;
    } else if (icCardForm.kakmm.length !== 8) {
      errors.kakmm = 'IC卡密码必须为8位';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // 表单字段变更处理
  const handleFormChange = (field: string, value: string) => {
    setIcCardForm(prev => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getPeriodTimeStamps = (selectedPeriod: string): { csz1: number; csz2: number } => {
    const today = dayjs();
    let startDate: Dayjs;

    switch (selectedPeriod) {
      case '1':
        startDate = dayjs().startOf('year');
        break;
      case '2':
        startDate = dayjs().subtract(1, 'year').startOf('year');
        break;
      case '3':
        startDate = dayjs().subtract(2, 'years').startOf('year');
        break;
      default:
        throw new Error('selectedPeriod 只能是 1、2、3');
    }

    return {
      csz1: startDate.valueOf(),
      csz2: today.valueOf(),
    };
  };

  // 下载驱动（在线）
  const downloadDriver = async () => {
    setIsManualLoading(true); // 显示蒙版
    try {
      let a = document.createElement('a');
      a.style.display = 'none';
      a.href = 'https://dditpublic.oss-cn-beijing.aliyuncs.com/SAASTOOLS_UPGRADE/SAASTOOLS2023_20230908/%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%B7%A5%E5%85%B7.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setIsManualLoading(false); // 隐藏蒙版
    }
  }

  const sjxz = async (parma: any) => {
    parma.kakuuid = chardIndex;
    try {
      const res = await hgsjxz(parma);
      const { code, msg } = res;
      if ('200' == code) {
        DDAlert.open({
          title: '系统提示',
          info: '创建任务成功，是否跳转任务管理？',
          infoType: 'question',
          modalType: 'confirm',
          okCallbackFn: function (thisObj: any) {
            history.push({ pathname: '/02/0201' });
          },
        });
      } else {
        message.error(msg);
      }
    } catch (error) {
      console.error('sjxz错误:', error);
      message.error('操作失败');
    }
  }

  // 维护IC卡表单提交（主动操作，显示蒙版）
  const handleMaintainSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsManualLoading(true); // 显示蒙版
      setShowMaintainIcCardModal(false);

      const kakuuid = uuidv4().replace(/-/g, '');
      setCardIndex(kakuuid);
      const kakData = { uuid: kakuuid, kakmm: icCardForm.kakmm };
      const kakCheckDataRes = await xhsjzrKakCheckData(kakData);

      let resGdhjjc = await khdgjUtil.khdgjJc(kakCheckDataRes.body);
      if (resGdhjjc.code !== '200') {
        message.error(resGdhjjc.msg);
        return;
      }

      const kakSaveData = {
        kakuuid: kakuuid,
        kaklxDm: icCardForm.kaklxDm,
        kakbm: icCardForm.kakbm,
        kakmm: icCardForm.kakmm
      };
      const response = await xhsjzrKakSave(kakSaveData);

      if (response.code === '200') {
        setIsManualLoading(true);
        await handleKhdgjXz(kakuuid);
      } else {
        message.error(response.msg || '保存失败');
      }
    } catch (error) {
      console.error('保存IC卡错误:', error);
      message.error('保存IC卡信息失败');
    } finally {
      setIsManualLoading(false); // 隐藏蒙版
    }
  };


  // 处理选择提交（主动操作，显示蒙版）
  const handleSelectSubmit = async () => {
    try {
      setIsManualLoading(true); // 显示蒙版
      setShowSelectIcCardModal(false);

      if (!selectedCard?.kakuuid) {
        message.error('请选择IC卡');
        return;
      }

      setIcCardForm({
        kaklxDm: selectedCard.kaklxDm || '1',
        kakbm: selectedCard.kakbm || '',
        kakmm: selectedCard.kakmm || ''
      });

      await handleKhdgjXz(selectedCard.kakuuid);
    } catch (error) {
      console.error('处理IC卡选择错误:', error);
      message.error('处理IC卡选择失败');
    } finally {
      setIsManualLoading(false); // 隐藏蒙版
    }
  };

  // 调用客户端工具下载关单（主动操作，显示蒙版）
  const handleKhdgjXz = async (kakuuid: string) => {
    try {
      setIsManualLoading(true); // 显示蒙版
      const { csz1, csz2 } = getPeriodTimeStamps(selectedPeriod);
      const param: any = {
        gxckfphbz: 'N',
        czfdm: '08',
        csz1: csz1,
        csz2: csz2,
        bgdlx: ['YJGCK'],
        bgdsjlx: ['YBBGD', 'ZGTQBGD'],
        sjgjsjDms: ['010101'],
        tjzdmc: '开始日期',
        sjzruuid: sjzruuid,
        xzzqDm: selectedPeriod
      };
      const curShowModal = refICList.current!.showModal;

      const res = await khdgjUtil.checkIsExistTaskBgd(kakuuid);

      if (res === 'N') {
        const xzRes = await xzrwjy(param);
        const { code, msg } = xzRes;

        if (code === '200') {
          const cs: any = { param: param };
          curShowModal(cs, kakuuid);
        } else {
          message.error(msg);
        }
      } else if (res === 'E') {
        setIsManualLoading(false); // 弹窗时隐藏蒙版
        DDAlert.open({
          title: '提示信息',
          info: `客户端工具运行异常，建议尝试以下解决方案：`,
          infoType: 'warning',
          okText: '下载工具',
          closeStatus: false,
          content: <>
            <div style={{ height: '105px', lineHeight: '35px' }}>
              <div>（1）若已下载最新版本客户端工具，请运行启动客户端工具；</div>
              <div>（2）若未下载最新版本客户端工具，请下载工具；</div>
              <div>（3）请确保当前电脑可以登录国际贸易单一窗口</div>
            </div>
          </>,
          button: [
            <Button key='close' onClick={() => DDAlert.close()}>关闭</Button>,
          ],
          okCallbackFn: async function (thisObj: any) {
            thisObj.setState({ customerBtnLoading: true });
            setIsManualLoading(true);
            await downloadDriver();
            thisObj.setState({ customerBtnLoading: false });
            DDAlert.close();
            setIsManualLoading(false);
          }
        });
      } else {
        sjxz(param);
      }
    } catch (error) {
      console.error('下载关单错误:', error);
      message.error('下载关单失败');
    } finally {
      setIsManualLoading(false); // 隐藏蒙版
    }
  };


  // 查询 IC 卡列表公共方法（主动操作，显示蒙版）
  const queryIcCardList = async () => {
    try {
      setIsManualLoading(true); // 显示蒙版
      const response = await queryKak({});
      if (response.code === '200') {
        const cardList = response.body || [];
        setIcCardList(cardList);
        if (cardList.length > 0) {
          setShowSelectIcCardModal(true);
        } else {
          setShowMaintainIcCardModal(true);
        }
      } else {
        message.error(response.msg || '查询 IC 卡信息失败');
      }
    } catch (error) {
      console.error('查询 IC 卡错误:', error);
      message.error('查询 IC 卡信息失败');
    } finally {
      setIsManualLoading(false); // 隐藏蒙版
    }
  };

  // 登录 /认证
  const logon = async (flag: any) => {
    if (flag == '1' || flag == '3' || flag == '5') {
      refKprz.current!.showModal(flag);
      return;
    }
  }

  const saveHjjc = (flag: any) => {
    refICList.current!.closeModal();
  }

  const formatCurrency = (value: any, digits: any) => {
    return Number(value).toLocaleString('zh-CN', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    });
  };

  return (
    // 仅在主动操作时显示蒙版
    <Spin tip="处理中..." spinning={isManualLoading || isRefreshing}>
      <div className="new-user-data-access">
        <div className="page-title">新户数据准入</div>
        <div className="section download-period">
          <div className="section-label">下载周期选择：</div>
          <Select
            value={selectedPeriod}
            style={{ width: 120 }}
            onChange={handlePeriodChange}
            disabled={!isDataLoaded || downloadStatus !== '待执行'}
          >
            <Option value="1">近1年</Option>
            <Option value="2">近2年(推荐)</Option>
            <Option value="3">近3年</Option>
          </Select>
          <Tooltip title="">
            <div className="warning-text">
              <ExclamationCircleOutlined />
              <span>温馨提示：下载周期越长，数据量越大，耗时越久</span>
            </div>
          </Tooltip>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            disabled={isStartDownloadDisabled()}
            className="download-button"
          >
            开始下载
          </Button>
        </div>
        <div className="section download-status">
          <div className="section-label">数据下载进度：</div>
          <div className="progress-status-container">
            <div className="progress-section">
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="progress-text">{Math.round(progress)}%</div>
            </div>
            <div className="status-section">
              <span>状态： {downloadStatus}</span>
            </div>
            <div className="buttons-section">
              <Space>
                <Button
                  icon={downloadStatus === '执行失败' ? <DownloadOutlined /> : <ReloadOutlined />}
                  onClick={handleRefreshOrRedownload}
                  disabled={isRefreshDisabled()}
                  size="small"
                >
                  {downloadStatus === '执行失败' ? '重新下载' : '刷新'}
                </Button>
                <Button
                  icon={<EyeOutlined />}
                  onClick={handleViewDetails1}
                  disabled={isViewDetailsDisabled()}
                  size="small"
                >
                  查看详情
                </Button>
              </Space>
            </div>
          </div>
        </div>
        <div className="section download-results">
          <div className="results-header">
            <div className="section-label">数据下载结果：</div>
            <Space>
              {/* 导出按钮右侧添加感叹号提示 */}
              <Tooltip
                title={`本数据准确性仅对当日（${downloadDate || '未知日期'}）有效！`}
                placement="top"
              >
                <ExclamationCircleOutlined style={{ color: '#faad14', cursor: 'pointer', fontSize: "larger" }} />
              </Tooltip>
              <Button
                icon={<ExportOutlined />}
                onClick={handleExport}
                disabled={isExportDisabled()}
                className="export-button"
              >
                导出未申报数据
              </Button>
            </Space>
          </div>
          <div className="results-container">
            <Card className="result-card">
              <div className="card-title">出口报关单数据</div>
              <div className="stats-row">
                <div className="stat-item">
                  <div className="stat-label">已申报（条）</div>
                  <div className="stat-value">{formatCurrency(dataStats.exportDeclarations.declared, 0)}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">未申报（条）</div>
                  <div className="stat-value">{formatCurrency(dataStats.exportDeclarations.undeclared, 0)}</div>
                </div>
              </div>
            </Card>
            <Card className="result-card">
              <div className="card-title">进项发票数据</div>
              <div className="stats-row">
                <div className="stat-item">
                  <div className="stat-label">完全申报（张）</div>
                  <div className="stat-value">{formatCurrency(dataStats.inputInvoices.fullyDeclared, 0)}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">部分申报（张）</div>
                  <Tooltip
                    placement="top"
                    title={
                      <div style={{whiteSpace: 'nowrap'}}>
                        <p>已申报部分金额：{formatCurrency(dataStats.inputInvoices.bfsbysbje, 2)}</p>
                        <p>未申报部分金额：{formatCurrency(dataStats.inputInvoices.bfsbwsbje, 2)}</p>
                      </div>
                    }
                  >
                    <div className="stat-value">
                      <MoneyCollectOutlined style={{ marginRight: 4, fontSize: 19, color: 'rgba(157,190,5,0.97)' }} />
                      {formatCurrency(dataStats.inputInvoices.partiallyDeclared, 0)}
                    </div>
                  </Tooltip>
                </div>
                <div className="stat-item">
                  <div className="stat-label">未申报（张）</div>
                  <Tooltip
                    placement="top"
                    title={
                      <div style={{whiteSpace: 'nowrap'}}>
                        <p>未申报金额：{formatCurrency(dataStats.inputInvoices.wsbje, 2)}</p>
                        <p>未申报税额：{formatCurrency(dataStats.inputInvoices.wsbtse, 2)}</p>
                      </div>
                    }
                  >
                    <div className="stat-value">
                      <MoneyCollectOutlined style={{marginRight: 4, fontSize: 19, color: 'rgba(157,190,5,0.97)'}}/>
                      {formatCurrency(dataStats.inputInvoices.undeclared, 0)}
                    </div>
                  </Tooltip>
                </div>
              </div>
            </Card>
          </div>
        </div>
        <div className="section basic-data">
          <div className="section-label">基础数据下载：</div>
          <div className="basic-data-info">
            <div className="basic-data-description">
              下载报关单和发票用于计算历史数据占用和退税申报
            </div>
            <div className="basic-data-buttons">
              <Space>
                {/* 开始下载按钮右侧添加感叹号提示 */}
                <Tooltip
                  title="下载所选周期内的出口报关单及进项发票数据。"
                  placement="top"
                >
                  <ExclamationCircleOutlined style={{ color: '#faad14', cursor: 'pointer', fontSize: "larger" }} />
                </Tooltip>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={handleBasicDataDownload}
                  disabled={isBasicDataSjxzButtonsDisabled()}
                  className="basic-download-button"
                >
                  数据下载
                </Button>
                <Button
                  icon={<EyeOutlined />}
                  onClick={handleViewDetails2}
                  disabled={isBasicDataCkxqButtonsDisabled()}
                  className="view-details-button"
                >
                  查看详情
                </Button>
              </Space>
            </div>
          </div>
        </div>
      </div>
      <TabSfyz onRef={refKprz} getdlFlag={handleBasicDataDownloadFp} />
      <IcCardMaintain
        visible={showMaintainIcCardModal}
        icCardForm={icCardForm}
        formErrors={formErrors}
        onCancel={() => setShowMaintainIcCardModal(false)}
        onSubmit={handleMaintainSubmit}
        onFormChange={handleFormChange}
      />
      <IcCardSelect
        visible={showSelectIcCardModal}
        icCardList={icCardList}
        selectedCard={selectedCard}
        onCancel={() => setShowSelectIcCardModal(false)}
        onSelectCard={handleSelectCard}
        onSubmit={handleSelectSubmit}
      />
      <IcList onRef={refICList} saveBtn={saveHjjc} />
    </Spin>
  );
};
export default NewUserDataAccess;
