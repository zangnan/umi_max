import React, { useEffect, useState } from 'react';
import { message, Switch, Spin } from 'antd';
import ProCard from '@ant-design/pro-card';
import { queryBadzepz, updateXybz, checkPzglExistsDzlxInSjpp } from '@/pages/hts/services/htsApi';
import DDBaseGrid from '@/components/DDBaseGrid';
import DDAlert from '@/pages/hts/components/DDAlert';
import { intl } from '@/components/DDAssist/util';

export interface DDTsort {
  onRef?: any;
  visible?: any;
}

const Index: React.FC<DDTsort> = ({ onRef, visible = false }) => {
  const [gridData, setGridData] = useState<any>([]);
  const [masker, setMasker] = useState(false);

  useEffect(() => {
    initGridData();
  }, []);

  // 初始化接口设置
  const initGridData = () => {
    setMasker(true);
    queryBadzepz({}).then((res: any) => {
      setMasker(false);
      if (res.code == '200') {
        setGridData(res.body);
      } else {
        message.error(res.desc);
      }
    });
    setMasker(false);
  };

  // 配置列表列
  const columns: any = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 60,
      align: 'center',
      render: (_text: any, _record: any, index: number) => <span>{index + 1}</span>,
    },
    { title: '单证类型', dataIndex: 'dzlxdlDm', width: 200 },
    { title: '单证名称', dataIndex: 'dzlxmc', width: 200 },
    {
      title: '启用状态',
      dataIndex: 'xybz',
      width: 90,
      align: 'center',
      render: (_text: any, _record: any, index: number) => (
        <>
          <Switch
            checked={_text == 'Y' ? true : false}
            onClick={(checked) => onChangeSwitch(checked, _record)}
          />
        </>
      ),
    },
  ];

  //开关值改变
  const onChangeSwitch = (checked: boolean, _record: any) => {
    // 调用后台接口设置启动状态
    const xybz = checked ? 'Y' : 'N';
    _record.xybz = xybz;
    console.log(_record);
    setMasker(true);
    checkPzglExistsDzlxInSjpp(_record).then((res: any) => {
      setMasker(false);
      if (res.code == '200') {
        console.log(res.body);
        if (res.body.length > 0) {
          DDAlert.open({
            title: '启用/停用',
            info: '该单证存在已关联的数据，禁用后已关联数据将被解除关联，确定继续禁用吗？',
            infoType: 'question',
            modalType: 'confirm',
            closeStatus: false,
            okCallbackFn: function (thisObj: any) {
              thisObj.setState({ masker: true });
              updateXybz(_record).then((res: any) => {
                thisObj.setState({ masker: false });
                setMasker(false);
                if (res.code == '200') {
                  DDAlert.close();
                  message.success('启用状态设置成功');
                  initGridData();
                } else {
                  message.error(res.desc);
                }
              });
            },
          });
        } else {
          updateXybz(_record).then((res: any) => {
            setMasker(false);
            if (res.code == '200') {
              DDAlert.close();
              message.success('启用状态设置成功');
              initGridData();
            } else {
              message.error(res.desc);
            }
          });
        }
      } else {
        message.error(res.desc);
      }
    });

    // updateXybz(_record).then((res: any) => {
    //   setMasker(false);
    //   if (res.code == '200') {
    //     message.success("启用状态设置成功");
    //     initGridData();
    //   } else {
    //     message.error(res.desc)
    //   }
    // });
  };

  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <ProCard subTitle="开启后，系统会对已开启的单证类型进行查验是否齐全" extra=" ">
        <DDBaseGrid
          queryParam={{}}
          userDataSource={gridData}
          columns={columns}
          showSerialNumber
          pagination={false}
          rowKey="dzlxDm"
        />
      </ProCard>
    </Spin>
  );
};

export default Index;
