import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tag, Button, Typography, Badge, Avatar, version, Table, message } from 'antd';
import { history, useModel } from 'umi';
import { queryListNs } from '@/services/api';
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
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  WarningOutlined,
  BugOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  BookOutlined,
} from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { StatisticCard } from '@ant-design/pro-components';
import { Line } from '@ant-design/plots';
import type { ColumnsType } from 'antd/es/table';
import myUtil from '@/components/DDAssist/util';
import './style.less';

const { Title, Text } = Typography;

// ==================== 模拟数据 ====================

// 日志统计数据
const logStatisticsData = [
  { title: '接口请求', value: 15680, prefix: <ApiOutlined />, suffix: '次', trend: 'up', trendValue: '12.5%' },
  { title: '接口成功', value: 15420, prefix: <CheckCircleOutlined />, suffix: '次', trend: 'up', trendValue: '11.8%' },
  { title: '接口失败', value: 260, prefix: <WarningOutlined />, suffix: '次', trend: 'down', trendValue: '8.3%' },
  { title: '异常总数', value: 12, prefix: <BugOutlined />, suffix: '条', trend: 'down', trendValue: '25%' },
];

// 接口调用趋势数据 - 24小时数据
const apiCallData = [
  { time: '00:00', requests: 120, errors: 2 },
  { time: '02:00', requests: 80, errors: 1 },
  { time: '04:00', requests: 65, errors: 1 },
  { time: '06:00', requests: 95, errors: 2 },
  { time: '08:00', requests: 890, errors: 5 },
  { time: '10:00', requests: 1150, errors: 7 },
  { time: '12:00', requests: 1250, errors: 8 },
  { time: '14:00', requests: 1080, errors: 6 },
  { time: '16:00', requests: 980, errors: 4 },
  { time: '18:00', requests: 750, errors: 3 },
  { time: '20:00', requests: 650, errors: 3 },
  { time: '22:00', requests: 420, errors: 2 },
  { time: '23:59', requests: 320, errors: 1 },
];

// 异常日志数据
const exceptionLogs = [
  { key: 1, id: 1, time: '2024-01-29 15:32:18', level: 'ERROR', message: '数据查询超时: /api/v1/queryListNs', count: 3 },
  { key: 2, id: 2, time: '2024-01-29 14:25:03', level: 'WARN', message: 'Token即将过期，请刷新', count: 15 },
  { key: 3, id: 3, time: '2024-01-29 12:18:45', level: 'ERROR', message: '数据库连接失败: Connection refused', count: 1 },
  { key: 4, id: 4, time: '2024-01-29 10:05:22', level: 'WARN', message: '接口响应时间过长: 2387ms', count: 7 },
  { key: 5, id: 5, time: '2024-01-28 22:30:10', level: 'ERROR', message: '文件上传失败: exceed max size', count: 2 },
];

// 热门接口数据
const hotApiData = [
  { key: 1, rank: 1, method: 'GET', path: '/api/v1/dict/list', calls: 4520, avgTime: '45ms' },
  { key: 2, rank: 2, method: 'POST', path: '/api/v1/data/import', calls: 2890, avgTime: '320ms' },
  { key: 3, rank: 3, method: 'GET', path: '/api/v1/user/info', calls: 2150, avgTime: '38ms' },
  { key: 4, rank: 4, method: 'POST', path: '/api/v1/form/submit', calls: 1680, avgTime: '156ms' },
  { key: 5, rank: 5, method: 'GET', path: '/api/v1/module/list', calls: 1240, avgTime: '62ms' },
];

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

  // 获取统计数据
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        // 并行请求多个表的数据统计
        const [resAppModule, resDict, resDictField, resUser, resTodo, resProgress, resDone, resApprove] = await Promise.all([
          queryListNs({}, 'app_module'),
          queryListNs({}, 'dict'),
          queryListNs({}, 'dict_field'),
          queryListNs({}, 'm_sys_user'),
          queryListNs({ status: 'todo' }, 'task'),
          queryListNs({ status: 'progress' }, 'task'),
          queryListNs({ status: 'done' }, 'task'),
          queryListNs({ status: 'approve' }, 'task'),
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

  // 异常日志列配置
  const exceptionColumns: ColumnsType = [
    { title: '时间', dataIndex: 'time', key: 'time', width: 180, className: 'tech-table-cell' },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 90,
      className: 'tech-table-cell',
      render: (level: string) => {
        const config: Record<string, { color: string; glow: boolean }> = {
          ERROR: { color: themeColors.colorError, glow: true },
          WARN: { color: themeColors.colorWarning, glow: false },
          INFO: { color: themeColors.colorInfo, glow: false },
        };
        const { color, glow } = config[level] || { color: themeColors.colorText, glow: false };
        return (
          <Tag
            style={{
              backgroundColor: `${color}15`,
              borderColor: color,
              color: color,
              boxShadow: glow ? `0 0 8px ${color}40` : 'none',
            }}
            className="tech-tag"
          >
            {level}
          </Tag>
        );
      },
    },
    { title: '错误信息', dataIndex: 'message', key: 'message', ellipsis: true, className: 'tech-table-cell' },
    {
      title: '次数',
      dataIndex: 'count',
      key: 'count',
      width: 80,
      className: 'tech-table-cell',
      render: (count: number) => (
        <Badge
          count={count}
          style={{
            backgroundColor: count > 5 ? themeColors.colorError : themeColors.colorInfo,
            boxShadow: count > 5 ? `0 0 8px ${themeColors.colorError}66` : `0 0 8px ${themeColors.colorInfo}66`,
          }}
          className="tech-badge"
        />
      ),
    },
  ];

  // 热门接口列配置
  const hotApiColumns: ColumnsType = [
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
    {
      title: '方法',
      dataIndex: 'method',
      key: 'method',
      width: 80,
      className: 'tech-table-cell',
      render: (method: string) => {
        const methodColor = method === 'GET' ? themeColors.colorSuccess : themeColors.colorWarning;
        return (
          <Tag
            style={{
              backgroundColor: `${methodColor}20`,
              borderColor: methodColor,
              color: methodColor,
            }}
            className="method-tag"
          >
            {method}
          </Tag>
        );
      },
    },
    { title: '接口路径', dataIndex: 'path', key: 'path', ellipsis: true, className: 'tech-table-cell' },
    { title: '调用次数', dataIndex: 'calls', key: 'calls', width: 100, className: 'tech-table-cell' },
    { title: '平均耗时', dataIndex: 'avgTime', key: 'avgTime', width: 90, className: 'tech-table-cell' },
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
                    description: (
                      <span
                        style={{
                          fontSize: 12,
                          color: stat.trend === 'up' ? themeColors.colorSuccess : themeColors.colorError,
                        }}
                      >
                        环比
                        {stat.trend === 'up' ? (
                          <ArrowUpOutlined style={{ marginLeft: 4 }} />
                        ) : (
                          <ArrowDownOutlined style={{ marginLeft: 4 }} />
                        )}
                        {stat.trendValue}
                      </span>
                    ),
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
        title={<><ApiOutlined className="section-icon" /> 日志统计</>}
        className="section-card glass-card"
        extra={
          <Button
            type="text"
            className="tech-btn"
            style={{ color: themeColors.colorPrimary }}
          >
            查看更多 →
          </Button>
        }
      >
        {/* 日志统计卡片 */}
        <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
          {logStatisticsData.map((stat, index) => (
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
                    description: (
                      <span
                        style={{
                          fontSize: 11,
                          color: stat.trend === 'up' ? themeColors.colorSuccess : themeColors.colorError,
                        }}
                      >
                        <span className="trend-indicator" /> {stat.trendValue}
                      </span>
                    ),
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

        {/* 异常日志与热门接口 */}
        <Row gutter={[12, 12]}>
          {/* 异常日志 */}
          <Col xs={24} lg={12}>
            <Card
              title={<><BugOutlined className="section-icon-sm" /> 异常日志</>}
              className="tech-card glass-card-inner"
              extra={
                <Button type="text" className="tech-btn">
                  更多 →
                </Button>
              }
            >
              <Table
                dataSource={exceptionLogs}
                columns={exceptionColumns}
                pagination={false}
                size="small"
                className="tech-table"
              />
            </Card>
          </Col>

          {/* 热门接口 */}
          <Col xs={24} lg={12}>
            <Card
              title={<><ApiOutlined className="section-icon-sm" /> 热门接口</>}
              className="tech-card glass-card-inner"
              extra={
                <Button type="text" className="tech-btn">
                  更多 →
                </Button>
              }
            >
              <Table
                dataSource={hotApiData}
                columns={hotApiColumns}
                pagination={false}
                size="small"
                className="tech-table"
              />
            </Card>
          </Col>
        </Row>
      </ProCard>

      {/* 接口调用趋势图 */}
      <ProCard
        title={<><ApiOutlined className="section-icon" /> 接口调用趋势</>}
        className="section-card glass-card"
        extra={
          <Button type="text" className="tech-btn">
            查看详情 →
          </Button>
        }
      >
        <Card variant="borderless" className="chart-card glass-card-inner">
          <Line
            data={apiCallData.flatMap(item => [
              { time: item.time, count: item.requests, type: '请求数' },
              { time: item.time, count: item.errors, type: '错误数' },
            ])}
            xField="time"
            yField="count"
            seriesField="type"
            smooth
            point
            color={[themeColors.colorPrimary, themeColors.colorError]}
            line={{ size: 2 }}
            point={{ size: 3 }}
            legend={{
              position: 'top-right',
              itemName: { style: { fill: '#64748b' } },
            }}
            xAxis={{
              label: { style: { fill: '#64748b' } },
            }}
            yAxis={{
              label: { style: { fill: '#64748b' } },
            }}
            tooltip={{
              channel: 'y',
              name: 'count',
              valueFormatter: (d: number) => d.toLocaleString(),
            }}
          />
        </Card>
      </ProCard>
    </div>
  );
};

export default HomePage;
