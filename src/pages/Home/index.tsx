import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tag, Button, Typography, Badge, Avatar, version, Table, message } from 'antd';
import { history, useModel } from 'umi';
import { queryListNs } from '@/services/api';
import {
  getOverview,
  getHourly,
  getByInterface,
  getByStatusCode,
} from '@/services/apiAnalysis';
import dayjs from 'dayjs';
import {
  RocketOutlined,
  BarChartOutlined,
  BuildOutlined,
  UserOutlined,
  FileTextOutlined,
  RobotOutlined,
  ApiOutlined,
  DatabaseOutlined,
  BellOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  WarningOutlined,
  BugOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  BookOutlined,
  TableOutlined,
  ExpandOutlined,
  CompressOutlined,
} from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { StatisticCard } from '@ant-design/pro-components';
import { Line } from '@ant-design/plots';
import type { ColumnsType } from 'antd/es/table';
import myUtil from '@/components/DDAssist/util';
import './style.less';

const { Title, Text } = Typography;

// 日志统计数据（从 API 获取）
const getLogStatisticsData = (overviewData: any) => [
  { title: '总调用次数', value: overviewData.totalCalls || 0, prefix: <ApiOutlined />, suffix: '次' },
  { title: '日均调用量', value: overviewData.dailyAvg || 0, prefix: <CheckCircleOutlined />, suffix: '次' },
  { title: '平均响应时间', value: overviewData.avgResponseTime || 0, prefix: <WarningOutlined />, suffix: 'ms' },
  { title: '错误率', value: overviewData.errorRate || 0, prefix: <BugOutlined />, suffix: '%' },
];

// 24小时调用量数据（从 API 获取）
const getHourlyData = (hourlyData: any) => {
  const distribution = hourlyData.hourlyDistribution || [];
  return distribution.map((item: any) => ({
    hour: `${item.hour}:00`,
    value: item.count,
  }));
};

// 响应码分布数据（从 API 获取）
const getStatusCodeData = (statusCodeData: any) => {
  const distribution = statusCodeData.distribution || [];
  return distribution.map((item: any, index: number) => ({
    key: index,
    statusCode: item.statusCode,
    count: item.count,
  }));
};

// 错误详情数据
const getErrorDetails = (statusCodeData: any) => {
  const errorDetails = statusCodeData.errorDetails || [];
  return errorDetails.slice(0, 5).map((item: any, index: number) => ({
    key: index,
    ...item,
  }));
};

// TOP 接口调用排行数据（从 API 获取）
const getInterfaceData = (interfaceData: any[]) => {
  return interfaceData.slice(0, 5).map((item, index) => ({
    key: index,
    rank: index + 1,
    interface: item.interface,
    callCount: item.callCount,
    avgTime: item.avgTime,
    maxTime: item.maxTime,
    minTime: item.minTime,
    errorCount: item.errorCount,
    errorRate: item.errorRate,
    lastCallTime: item.lastCallTime,
  }));
};

// ==================== 快捷入口配置 ====================

const quickEntries = [
  { icon: <BuildOutlined />, label: '系统构建', path: '/easy_dev_dc/agility/app_build', colorKey: 'colorPrimary' },
  // { icon: <UserOutlined />, label: '用户管理', path: '/easy_dev_dc/sys/cfgp/m_sys_user', colorKey: 'colorInfo' },
  { icon: <FileTextOutlined />, label: '文档生成', path: '/easy_dev_dc/agility/doc_build', colorKey: 'colorSuccess' },
  { icon: <RobotOutlined />, label: 'AI主题', path: '/easy_dev_dc/sys/skin_setting_ai', colorKey: 'colorWarning' },
  { icon: <ApiOutlined />, label: '接口日志', path: '/easy_dev_dc/sys/cfgp/m_sys_api_log', colorKey: 'colorError' },
  { icon: <DatabaseOutlined />, label: '系统日志', path: '/easy_dev_dc/sys/cfgp/m_sys_app_log', colorKey: 'colorPrimary' },
  { icon: <BookOutlined />, label: '工具文档', path: '/UtilDoc', colorKey: 'colorInfo', isExternal: true },
];

// ==================== 组件定义 ====================

// 获取主题颜色配置
const getThemeColors = () => {
  const themeToken = myUtil.theme.getThemeToken() || {};
  const token = themeToken.token || {};
  return {
    colorPrimary: token.colorPrimary || '#0A6ED1',
    colorInfo: token.colorInfo || '#0A6ED1',
    colorSuccess: token.colorSuccess || '#339c00',
    colorError: token.colorError || '#ff0049',
    colorWarning: token.colorWarning || '#e38000',
    colorText: token.colorText || 'rgba(0,0,0,0.88)',
    colorBorder: token.colorBorder || '#d9d9d9',
    cusBg1: token.cusBg1 || '#f6f6f6',
    cusBgLayout: token.cusBgLayout || '#eaeaea',
  };
};

const HomePage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const themeColors = getThemeColors();
  // 从主题获取颜色的辅助函数
  const getColor = (colorKey: string) => {
    const color = (themeColors as Record<string, string>)[colorKey];
    return color || '#0A6ED1'; // 默认颜色
  };

  // 统计数据状态
  const [statisticsData, setStatisticsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // API 分析数据状态
  const [overviewData, setOverviewData] = useState<any>({});
  const [hourlyData, setHourlyData] = useState<any>({});
  const [interfaceData, setInterfaceData] = useState<any[]>([]);
  const [statusCodeData, setStatusCodeData] = useState<any>({});
  const [loadingApiData, setLoadingApiData] = useState(true);

  // 展开/收起状态
  const [expandedCharts, setExpandedCharts] = useState<Record<string, boolean>>({
    hourly: false,
    interface: false,
    statusCode: false,
  });

  // 获取统计数据
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        // 并行请求多个表的数据统计
        const [resAppModule, resDict, resDictField, resUser, resTodo, resProgress, resDone, resApprove
        ] = await Promise.all([
          queryListNs({}, 'app_module'),
          queryListNs({}, 'dict'),
          queryListNs({}, 'dict_field'),
          queryListNs({}, 'm_sys_user'),
          queryListNs({}, 'm_sys_user'),
          queryListNs({}, 'm_sys_user'),
          queryListNs({}, 'm_sys_user'),
          queryListNs({}, 'm_sys_user'),
        ]);

        setStatisticsData([
          { title: '模块', value: resAppModule?.body?.rowCount || 0, prefix: <BarChartOutlined />, suffix: '个', trend: 'up', trendValue: '12%' },
          { title: '数据表', value: resDict?.body?.rowCount || 0, prefix: <SettingOutlined />, suffix: '张', trend: 'up', trendValue: '8%' },
          { title: '字段', value: resDictField?.body?.rowCount || 0, prefix: <BookOutlined />, suffix: '个', trend: 'up', trendValue: '23%' },
          { title: '用户', value: resUser?.body?.rowCount || 0, prefix: <UserOutlined />, suffix: '人', trend: 'down', trendValue: '5%' },
          { title: '待办', value: resTodo?.body?.rowCount || 0, prefix: <BellOutlined />, suffix: '项', trend: 'up', trendValue: '3%' },
          { title: '进行中', value: resProgress?.body?.rowCount || 0, prefix: <SyncOutlined spin />, suffix: '个', trend: 'up', trendValue: '15%' },
          { title: '已完成', value: resDone?.body?.rowCount || 0, prefix: <CheckCircleOutlined />, suffix: '项', trend: 'up', trendValue: '32%' },
          { title: '审批中', value: resApprove?.body?.rowCount || 0, prefix: <ClockCircleOutlined />, suffix: '个', trend: 'down', trendValue: '2%' },
        ]);
      } catch (error) {
        console.error('获取统计数据失败:', error);
        message.error('获取统计数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // 获取 API 分析数据
  useEffect(() => {
    const fetchApiAnalysisData = async () => {
      try {
        setLoadingApiData(true);
        const params = {
          startDate: dayjs().subtract(7, 'days').format('YYYY-MM-DD'),
          endDate: dayjs().format('YYYY-MM-DD'),
        };

        const [resOverview, resHourly, resInterface, resStatusCode] = await Promise.all([
          getOverview(params),
          getHourly(params),
          getByInterface({ ...params, limit: 10 }),
          getByStatusCode(params),
        ]);

        if (resOverview.code === '200') setOverviewData(resOverview.body || {});
        if (resHourly.code === '200') setHourlyData(resHourly.body || {});
        if (resInterface.code === '200') setInterfaceData(resInterface.body || []);
        if (resStatusCode.code === '200') setStatusCodeData(resStatusCode.body || {});
      } catch (error) {
        console.error('获取API分析数据失败:', error);
      } finally {
        setLoadingApiData(false);
      }
    };

    fetchApiAnalysisData();
  }, []);

  // 切换展开/收起
  const toggleExpand = (key: string) => {
    setExpandedCharts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 响应码分布列配置
  const statusCodeColumns: ColumnsType = [
    {
      title: '状态码',
      dataIndex: 'statusCode',
      key: 'statusCode',
      width: 100,
      className: 'tech-table-cell',
      render: (statusCode: number) => {
        const config: Record<number, string> = {
          200: themeColors.colorSuccess,
          400: themeColors.colorWarning,
          401: themeColors.colorError,
          403: themeColors.colorError,
          404: themeColors.colorWarning,
          500: themeColors.colorError,
          502: themeColors.colorError,
          503: themeColors.colorError,
        };
        const color = config[statusCode] || themeColors.colorText;
        return <Tag color={color}>{statusCode}</Tag>;
      },
    },
    { title: '次数', dataIndex: 'count', key: 'count', width: 100, className: 'tech-table-cell' },
  ];

  // 错误详情列配置
  const errorDetailColumns: ColumnsType = [
    { title: '接口', dataIndex: 'interface', key: 'interface', ellipsis: true, width: 150 },
    {
      title: '状态码',
      dataIndex: 'statusCode',
      key: 'statusCode',
      render: (val: number) => <Tag color={val >= 500 ? 'red' : 'orange'}>{val}</Tag>,
    },
    // { title: '用户', dataIndex: 'userId', key: 'userId', width: 100 },
    { title: 'IP', dataIndex: 'ip', key: 'ip', width: 160 },
    { title: '调用时间', dataIndex: 'callTime', key: 'callTime', render: (val: string) => val ? dayjs(val).format('MM-DD HH:mm:ss') : '-' },
    { title: '响应时间(ms)', dataIndex: 'responseTime', key: 'responseTime', width: 100 },
  ];

  // TOP 接口调用排行列配置
  const interfaceColumns: ColumnsType = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 60,
      className: 'tech-table-cell',
      render: (rank: number) => (
        <Badge
          count={rank}
          style={{
            backgroundColor: rank <= 3 ? themeColors.colorPrimary : '#94a3b8',
            boxShadow: rank <= 3 ? `0 0 8px ${themeColors.colorPrimary}66` : 'none',
          }}
          className="rank-badge"
        />
      ),
    },
    { title: '接口地址', dataIndex: 'interface', key: 'interface', ellipsis: true, className: 'tech-table-cell' },
    { title: '调用次数', dataIndex: 'callCount', key: 'callCount', width: 90, className: 'tech-table-cell' },
    { title: '平均响应(ms)', dataIndex: 'avgTime', key: 'avgTime', width: 100, className: 'tech-table-cell' },
    { title: '最大响应(ms)', dataIndex: 'maxTime', key: 'maxTime', width: 100, className: 'tech-table-cell' },
    { title: '错误次数', dataIndex: 'errorCount', key: 'errorCount', width: 80, className: 'tech-table-cell', render: (val: number) => val > 0 ? <Tag color="red">{val}</Tag> : val },
    { title: '错误率', dataIndex: 'errorRate', key: 'errorRate', width: 80, className: 'tech-table-cell', render: (val: string) => parseFloat(val) > 5 ? <Tag color="orange">{val}%</Tag> : `${val}%` },
  ];

  return (
    <div className="home-page">
      {/* 动态背景粒子效果 */}
      <div className="particles" id="particles" />

      {/* 顶部欢迎区 */}
      <div className="welcome-section">
        <div className="welcome-content">
          <div className="avatar-wrapper">
            <Avatar size={64} icon={<UserOutlined />} className="user-avatar" />
            <div className="avatar-ring" />
          </div>
          <div className="welcome-text">
            <Title level={3} style={{ margin: 0, color: '#1e293b' }}>欢迎回来，{currentUser?.body?.userName || currentUser?.body?.loginName || '管理员'}</Title>
            <Text style={{ color: '#64748b' }}>今天是 {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', weekday: 'long' })}</Text>
          </div>
        </div>
        <div className="env-tag">
          <Tag
            className="env-tag-item"
            style={{
              backgroundColor: `${themeColors.colorPrimary}15`,
              borderColor: themeColors.colorPrimary,
              color: themeColors.colorPrimary,
              boxShadow: `0 0 10px ${themeColors.colorPrimary}25`,
            }}
          >
            <span className="env-dot" /> nbglxt_pro
          </Tag>
          <Tag
            className="env-tag-item"
            style={{
              backgroundColor: `${themeColors.colorInfo}15`,
              borderColor: themeColors.colorInfo,
              color: themeColors.colorInfo,
              boxShadow: `0 0 10px ${themeColors.colorInfo}25`,
            }}
          >
            antd v{version}
          </Tag>
        </div>
      </div>

      {/* 快捷入口区 */}
      <ProCard title={<><RocketOutlined className="section-icon" /> 快捷入口</>} className="section-card glass-card">
        <Row gutter={[20, 20]}>
          {quickEntries.map((entry, index) => (
            <Col xs={12} sm={8} md={4} key={index}>
              <Card
                hoverable
                className="quick-entry-card glass-card-inner"
                style={{
                  background: `linear-gradient(135deg, ${getColor(entry.colorKey)}08 0%, #fff 100%)`,
                  borderColor: `${getColor(entry.colorKey)}40`,
                }}
                onClick={() => {
                  if (entry.path === '#') return;
                  if (entry.isExternal) {
                    window.open(entry.path, '_blank');
                  } else {
                    history.push(entry.path);
                  }
                }}
              >
                <div className="quick-entry-content">
                  <div
                    className="icon-wrapper"
                    style={{
                      background: `linear-gradient(135deg, ${getColor(entry.colorKey)} 0%, ${getColor(entry.colorKey)}90 100%)`,
                      boxShadow: `0 4px 12px ${getColor(entry.colorKey)}40`,
                    }}
                  >
                    {React.cloneElement(entry.icon as React.ReactElement, {
                      style: { fontSize: 24, color: '#fff' },
                    })}
                  </div>
                  <Text
                    strong
                    style={{
                      marginTop: 12,
                      color: '#1e293b',
                      fontSize: 13,
                    }}
                  >
                    {entry.label}
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </ProCard>

      {/* 统计看板区 */}
      <ProCard title={<><BarChartOutlined className="section-icon" /> 数据统计</>} className="section-card glass-card" loading={loading}>
        <Row gutter={[16, 16]}>
          {statisticsData.map((stat, index) => (
            <Col xs={12} sm={8} md={6} lg={3} key={index}>
              <Card
                className="statistic-card glass-card-inner"
                variant="borderless"
              >
                <StatisticCard
                  statistic={{
                    title: (
                      <span style={{ color: '#64748b', fontSize: 13 }}>
                        {stat.title}
                      </span>
                    ),
                    value: stat.value,
                    prefix: (
                      <span style={{ color: stat.trend === 'up' ? themeColors.colorSuccess : themeColors.colorError }}>
                        {stat.prefix}
                      </span>
                    ),
                    suffix: stat.suffix,
                    style: {
                      color: '#1e293b',
                      fontSize: 28,
                      fontWeight: 600,
                    },
                  }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </ProCard>

      {/* 日志统计 */}
      <ProCard
        title={
          <>
            <ApiOutlined className="section-icon" /> 日志统计
            <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>最近7天</Text>
          </>
        }
        className="section-card glass-card"
        extra={
          <Button
            type="text"
            className="tech-btn"
            style={{ color: themeColors.colorPrimary }}
            onClick={() => history.push('/easy_dev_dc/sys/cfgp/m_sys_api_log')}
          >
            查看更多 →
          </Button>
        }
      >
        {/* 日志统计卡片 */}
        <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
          {getLogStatisticsData(overviewData).map((stat, index) => (
            <Col span={6} key={index}>
              <Card
                size="small"
                variant="borderless"
                className="log-stat-card glass-card-inner"
              >
                <StatisticCard
                  statistic={{
                    title: (
                      <span style={{ color: '#64748b', fontSize: 12 }}>
                        {stat.title}
                      </span>
                    ),
                    value: stat.value,
                    prefix: (
                      <span style={{ color: themeColors.colorPrimary }}>{stat.prefix}</span>
                    ),
                    suffix: stat.suffix,
                    style: {
                      color: '#1e293b',
                      fontSize: 22,
                      fontWeight: 600,
                    },
                  }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* 响应码分布与 TOP 接口调用排行 */}
        <Row gutter={[12, 12]}>
          {/* 响应码分布 */}
          <Col xs={24} lg={12}>
            <Card
              title={<><BugOutlined className="section-icon-sm" /> 响应码分布</>}
              className="tech-card glass-card-inner"
              extra={
                <Button
                  type="text"
                  className="tech-btn"
                  icon={expandedCharts.statusCode ? <CompressOutlined /> : <ExpandOutlined />}
                  onClick={() => toggleExpand('statusCode')}
                >
                  {expandedCharts.statusCode ? '收起' : '查看数据'}
                </Button>
              }
            >
              <Table
                dataSource={getStatusCodeData(statusCodeData)}
                columns={statusCodeColumns}
                pagination={false}
                size="small"
                className="tech-table"
              />
              {expandedCharts.statusCode && statusCodeData.errorDetails?.length > 0 && (
                <Table
                  title={() => '错误详情'}
                  dataSource={getErrorDetails(statusCodeData)}
                  columns={errorDetailColumns}
                  pagination={false}
                  size="small"
                  className="tech-table"
                  style={{ marginTop: 16 }}
                />
              )}
            </Card>
          </Col>

          {/* TOP 接口调用排行 */}
          <Col xs={24} lg={12}>
            <Card
              title={<><ApiOutlined className="section-icon-sm" /> TOP 接口调用排行</>}
              className="tech-card glass-card-inner"
            >
              <Table
                dataSource={getInterfaceData(interfaceData)}
                columns={interfaceColumns}
                pagination={false}
                size="small"
                className="tech-table"
              />
            </Card>
          </Col>
        </Row>
      </ProCard>

      {/* 24 小时调用量分布 */}
      <ProCard
        title={<><ApiOutlined className="section-icon" /> 24 小时调用量分布</>}
        className="section-card glass-card"
        extra={
          <>
            {hourlyData.peakHour && (
              <Text type="secondary" style={{ marginRight: 16 }}>
                高峰时段: {hourlyData.peakHour.hour}:00 ({hourlyData.peakHour.count} 次)
              </Text>
            )}
            <Button
              type="text"
              className="tech-btn"
              icon={expandedCharts.hourly ? <CompressOutlined /> : <ExpandOutlined />}
              onClick={() => toggleExpand('hourly')}
            >
              {expandedCharts.hourly ? '收起' : '查看数据'}
            </Button>
          </>
        }
        loading={loadingApiData}
      >
        <Card variant="borderless" className="chart-card glass-card-inner">
          <Line
            data={getHourlyData(hourlyData)}
            xField="hour"
            yField="value"
            height={350}
            smooth
            color={themeColors.colorPrimary}
            line={{ size: 2 }}
            point={{ size: 3 }}
            area={{ style: { fill: `l(270) 0:#ffffff 1:${themeColors.colorPrimary}20` } }}
            xAxis={{
              label: { style: { fill: '#64748b' } },
            }}
            yAxis={{
              label: { style: { fill: '#64748b' } },
            }}
            tooltip={{
              channel: 'y',
              name: 'value',
              valueFormatter: (d: number) => d.toLocaleString(),
            }}
          />
          {expandedCharts.hourly && (
            <Table
              dataSource={getHourlyData(hourlyData)}
              columns={[
                { title: '时段', dataIndex: 'hour', key: 'hour' },
                { title: '调用次数', dataIndex: 'value', key: 'value' },
              ]}
              pagination={false}
              size="small"
              style={{ marginTop: 16 }}
              rowKey="hour"
            />
          )}
        </Card>
      </ProCard>
    </div>
  );
};

export default HomePage;
