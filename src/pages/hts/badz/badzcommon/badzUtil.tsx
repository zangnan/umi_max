import { message } from "antd";
import myUtil, { intl as intl2 } from '@/components/DDAssist/util';
import { badzAbgdxzfj, hcdyHcrwDycc, abgdDyccData, assqDyccData, dzbaZlgdXz, dzbaZlcjSqq, abgdDyccDataDT, changeJzfjToPath } from "@/pages/hts/services/htsApi";

const badzUtil: any = {};

// 备案单证共通功能吗
badzUtil.common = {
  // 下载资料（下载zip）
  xzzl(param: any, flag: any) {
    const { selectionRows, refUnit } = param;
    if (!selectionRows || selectionRows.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    } else {
      const rwbhs: any = [];
      if (flag === 'abgd') {
        selectionRows.forEach((item: any) => {
          if (item.dzfs > 0) {
            rwbhs.push(item.badzbgduuid);
          }
        });
        const qqbw = {
          badzbgduuids: rwbhs,
        };
        if (rwbhs.length > 0) {
          refUnit.current!.setMasker(true);
          dzbaZlgdXz(qqbw).then((response: any) => {
            refUnit.current!.setMasker(false);
            if (response.code === '200') {
              const { blob, fileName } = response.body;
              myUtil.file.downloadZip(blob, fileName);
              // 清空选中并设置按钮可用状态
              refUnit.current?.setSelectionRowKeys([]);
              refUnit.current?.setSelectionRows([]);
              //message.success({ content: `下载资料成功` });
            } else {
              message.error(response.desc);
              return;
            }
          });
        } else {
          message.info(intl2.formatMessage({ id: 'message_badz_xzzl_info' }));
        }
      } else if (flag === 'assq') {
        selectionRows.forEach((item: any) => {
          if (item.dzfs > 0) {
            rwbhs.push(item.badzssquuid);
          }
        });
        const qqbw = {
          badzssquuids: rwbhs,
        };
        if (rwbhs.length > 0) {
          refUnit.current!.setMasker(true);
          dzbaZlcjSqq(qqbw).then((response: any) => {
            refUnit.current!.setMasker(false);
            if (response.code === '200') {
              const { blob, fileName } = response.body;
              myUtil.file.downloadZip(blob, fileName);
              // 清空选中并设置按钮可用状态
              refUnit.current?.setSelectionRowKeys([]);
              refUnit.current?.setSelectionRows([]);
              //message.success({ content: `下载资料成功` });
            } else {
              message.error(response.desc);
              return;
            }
          });
        } else {
          message.info(intl2.formatMessage({ id: 'message_badz_xzzl_info' }));
        }
      } else if (flag === 'hcrw') {
        selectionRows.forEach((item: any) => {
          if (item.dzfs > 0) {
            rwbhs.push(item.rwbh);
          }
        });
        const qqbw = {
          rwbhs: rwbhs,
        };
        if (rwbhs.length > 0) {
          refUnit.current!.setMasker(true);
          badzAbgdxzfj(qqbw).then((response: any) => {
            refUnit.current!.setMasker(false);
            if (response.code === '200') {
              const { blob, fileName } = response.body;
              myUtil.file.downloadZip(blob, fileName);
              // 清空选中并设置按钮可用状态
              refUnit.current?.setSelectionRowKeys([]);
              refUnit.current?.setSelectionRows([]);
              //message.success({ content: `下载资料成功` });
            } else {
              message.error(response.desc);
              return;
            }
          });
        } else {
          message.info(intl2.formatMessage({ id: 'message_badz_xzzl_info' }));
        }
      } else if (flag === 'rwxq') {
        selectionRows.forEach((item: any) => {
          if (item.dzfs > 0) {
            rwbhs.push(item.badzbgduuid);
          }
        });
        const qqbw = {
          badzbgduuids: rwbhs,
        };
        if (rwbhs.length > 0) {
          refUnit.current!.setMasker(true);
          dzbaZlgdXz(qqbw).then((response: any) => {
            refUnit.current!.setMasker(false);
            if (response.code === '200') {
              const { blob, fileName } = response.body;
              myUtil.file.downloadZip(blob, fileName);
              // 清空选中并设置按钮可用状态
              refUnit.current?.setSelectionRowKeys([]);
              refUnit.current?.setSelectionRows([]);
              //message.success({ content: `下载资料成功` });
            } else {
              message.error(response.desc);
              return;
            }
          });
        } else {
          message.info(intl2.formatMessage({ id: 'message_badz_xzzl_info' }));
        }
      }
    }
    return;
  },
  // 打印成册（下载PDF）
  dycc(param: any, flag: any) {
    const { selectionRows, refUnit } = param;
    if (!selectionRows || selectionRows.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    } else {
      // 任务编号数组
      const rwbhs: any = [];
      if (flag === 'abgd') {
        if (selectionRows.length > 1) {
          // 打印成册 多条
          selectionRows.forEach((item: any) => {
            rwbhs.push(item.badzbgduuid);
          });
          const qqbw = {
            badzbgduuids: rwbhs,
            rzlx: 'badzbgduuid',
            badzczlxDm: '1'
          };
          refUnit.current!.setMasker(true);
          abgdDyccDataDT(qqbw).then((response: any) => {
            refUnit.current!.setMasker(false);
            if (response.code === '200') {
              const { blob, fileName } = response.body;
              if (rwbhs.length > 1) {
                myUtil.file.downloadZip(blob, fileName);
              } else {
                myUtil.file.downloadPdf(blob, fileName);
              }
              // 清空选中并设置按钮可用状态
              refUnit.current?.setSelectionRowKeys([]);
              refUnit.current?.setSelectionRows([]);
              refUnit.current!.reload();
              //message.success(intl2.formatMessage({ id: 'message_badz_dycc_success' }));
            } else {
              message.error(response.desc);
              return;
            }
          });
        } else {
          // 打印成册 单条
          const qqbw = {
            badzbgduuid: selectionRows[0].badzbgduuid,
            rzlx: 'badzbgduuid',
            badzczlxDm: '1'
          };
          refUnit.current!.setMasker(true);
          abgdDyccData(qqbw).then((response: any) => {
            refUnit.current!.setMasker(false);
            if (response.code === '200') {
              const wjlj = response.body.wjlj;
              changeJzfjToPath({ fzcclj: wjlj }).then((res: any) => {
                const { blob } = res.body;
                myUtil.file.downloadPdf(blob, response.body.bgwjm);
                // 清空选中并设置按钮可用状态
                refUnit.current?.setSelectionRowKeys([]);
                refUnit.current?.setSelectionRows([]);
                refUnit.current!.reload();
                //message.success(intl2.formatMessage({ id: 'message_badz_dycc_success' }));
              })
            } else {
              message.error(response.desc);
              return;
            }
          });
        }
      } else if (flag === 'assq') {
        selectionRows.forEach((item: any) => {
          if (item.bswjscztDm === '3') {
            rwbhs.push(item.badzssquuid);
          }
        });

        const qqbw = {
          badzssquuids: rwbhs,
          rzlx: 'badzssquuid',
          badzczlxDm: '1'
        };
        if (rwbhs.length == selectionRows.length) {
          refUnit.current!.setMasker(true);
          assqDyccData(qqbw).then((response: any) => {
            refUnit.current!.setMasker(false);
            if (response.code === '200') {
              const { blob, fileName } = response.body;
              if (rwbhs.length > 1) {
                myUtil.file.downloadZip(blob, fileName);
              } else {
                myUtil.file.downloadPdf(blob, fileName);
              }
              // 清空选中并设置按钮可用状态
              refUnit.current?.setSelectionRowKeys([]);
              refUnit.current?.setSelectionRows([]);
              refUnit.current!.reload();
              //message.success(intl2.formatMessage({ id: 'message_badz_dycc_success' }));
            } else {
              message.error(response.desc);
              return;
            }
          });
        } else {
          message.info(intl2.formatMessage({ id: 'message_badz_dycc_info' }));
        }
      } else if (flag === 'hcrw') {
        selectionRows.forEach((item: any) => {
          rwbhs.push(item.rwbh);
        });
        const qqbw = {
          rwbhs: rwbhs,
          rzlx: 'rwbh',
          badzczlxDm: '1'
        };
        refUnit.current!.setMasker(true);
        hcdyHcrwDycc(qqbw).then((response: any) => {
          refUnit.current!.setMasker(false);
          if (response.code === '200') {
            const { blob, fileName } = response.body;
            if (rwbhs.length > 1) {
              myUtil.file.downloadZip(blob, fileName);
            } else {
              myUtil.file.downloadPdf(blob, fileName);
            }
            // 清空选中并设置按钮可用状态
            refUnit.current?.setSelectionRowKeys([]);
            refUnit.current?.setSelectionRows([]);
            refUnit.current!.reload();
            //message.success(intl2.formatMessage({ id: 'message_badz_dycc_success' }));
          } else {
            message.error(response.desc);
            return;
          }
        });
      }
    }
    return;
  },
};

export default badzUtil;
