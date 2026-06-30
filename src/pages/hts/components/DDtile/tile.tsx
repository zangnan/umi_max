/**
 * title: 磁贴
 */
import { ContainerOutlined, BarChartOutlined, AuditOutlined, ControlOutlined, AreaChartOutlined, RadarChartOutlined, VerifiedOutlined } from '@ant-design/icons';
import { FileProtectOutlined, AimOutlined, TagsOutlined, LayoutOutlined, FlagOutlined, SnippetsOutlined, PicCenterOutlined, OneToOneOutlined, WalletOutlined, BarsOutlined } from '@ant-design/icons';
import { FileUnknownOutlined, FileSyncOutlined, GroupOutlined, MergeCellsOutlined, ProjectOutlined, RedEnvelopeOutlined, ExceptionOutlined, CloudSyncOutlined, PartitionOutlined } from '@ant-design/icons';
import { FileTextOutlined, FundViewOutlined, SelectOutlined, TransactionOutlined, AccountBookOutlined, ExportOutlined, MoneyCollectOutlined, ReconciliationOutlined } from '@ant-design/icons';
import { GoldOutlined, ProfileOutlined, FileSearchOutlined, HddOutlined, ScheduleOutlined, DollarOutlined, UserSwitchOutlined, SolutionOutlined, FileDoneOutlined, SettingOutlined } from '@ant-design/icons';
import React, { Fragment } from 'react';
import { Typography, Tooltip } from 'antd';
import { history } from 'umi';
import './style.less';

export interface DDTileProps {
  data: any;
}

const DDTile: React.FC<DDTileProps> = ({
  data,
}) => {
  const { titel_main, titel_sub, content = {}, content_customer, icon, desc, route } = data;
  const { align = 'left', number, unit, color: color1 = 1 } = content;
  const { info, color: color2 = 1 } = desc;

  const getColorClass = (cc: any) => {
    let quotaColorClass = 'color1';
    if (cc === 2) {
      quotaColorClass = 'color2';
    } else if (cc === 3) {
      quotaColorClass = 'color3';
    }
    return quotaColorClass;
  }

  const jump = () => {
    history.push(route);
  }

  // 利用对象进行图标映射
  const iconMapping = {
    GoldOutlined: <GoldOutlined />,
    FileProtectOutlined: <FileProtectOutlined />,
    FileTextOutlined: <FileTextOutlined />,
    FileUnknownOutlined: <FileUnknownOutlined />,
    ProfileOutlined: <ProfileOutlined />,
    FileSyncOutlined: <FileSyncOutlined />,
    HddOutlined: <HddOutlined />,
    AimOutlined: <AimOutlined />,
    FileSearchOutlined: <FileSearchOutlined />,
    FundViewOutlined: <FundViewOutlined />,
    ScheduleOutlined: <ScheduleOutlined />,
    TagsOutlined: <TagsOutlined />,
    BarChartOutlined: <BarChartOutlined />,
    ContainerOutlined: <ContainerOutlined />,
    AuditOutlined: <AuditOutlined />,
    ControlOutlined: <ControlOutlined />,
    AreaChartOutlined: <AreaChartOutlined />,
    RadarChartOutlined: <RadarChartOutlined />,
    LayoutOutlined: <LayoutOutlined />,
    FlagOutlined: <FlagOutlined />,
    SnippetsOutlined: <SnippetsOutlined />,
    PicCenterOutlined: <PicCenterOutlined />,
    OneToOneOutlined: <OneToOneOutlined />,
    GroupOutlined: <GroupOutlined />,
    MergeCellsOutlined: <MergeCellsOutlined />,
    ProjectOutlined: <ProjectOutlined />,
    RedEnvelopeOutlined: <RedEnvelopeOutlined />,
    SelectOutlined: <SelectOutlined />,
    TransactionOutlined: <TransactionOutlined />,
    AccountBookOutlined: <AccountBookOutlined />,
    ExportOutlined: <ExportOutlined />,
    DollarOutlined: <DollarOutlined />,
    UserSwitchOutlined: <UserSwitchOutlined />,
    SolutionOutlined: <SolutionOutlined />,
    FileDoneOutlined: <FileDoneOutlined />,
    MoneyCollectOutlined: <MoneyCollectOutlined />,
    WalletOutlined: <WalletOutlined />,
    BarsOutlined: <BarsOutlined />,
    VerifiedOutlined: <VerifiedOutlined />,
    ExceptionOutlined: <ExceptionOutlined />,
    CloudSyncOutlined: <CloudSyncOutlined />,
    PartitionOutlined: <PartitionOutlined />,
    ReconciliationOutlined: <ReconciliationOutlined />,
    SettingOutlined: <SettingOutlined />,
  }
  return (
    <Fragment>
      <div className="tile" onClick={() => { jump() }}>
        <div className="title_wrap">
          <Typography.Paragraph ellipsis={{ rows: 2 }} className="title_main"><Tooltip title={titel_main}>{titel_main}</Tooltip></Typography.Paragraph>
          <Typography.Paragraph ellipsis={true} className="title_sub">{titel_sub}</Typography.Paragraph>
        </div>
        <div className="content_wrap">
          {content_customer ? <>
            {content_customer}
          </> : <>
            <div className="default">
              {iconMapping[icon]}
              <div className={`${getColorClass(color1)} num`} style={{ textAlign: align }}>
                <span className="num_1">{number}</span>
                <span className="num_2">{unit}</span>
              </div>
            </div>
          </>}
        </div>
        <div className="bottom">
          <Typography.Paragraph ellipsis={true} className={`${getColorClass(color2)} desc`}>{info}</Typography.Paragraph>
        </div>
      </div>
    </Fragment>
  );
};

export default DDTile;