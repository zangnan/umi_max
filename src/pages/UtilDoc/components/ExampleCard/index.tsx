import { CopyOutlined } from '@ant-design/icons';
import { Area, Column, DualAxes, Line, Pie } from '@ant-design/plots';
import { Button, Card, Space, Tag, Typography } from 'antd';
import React, { useCallback, useState } from 'react';
import {
  configArea,
  configArea2,
  configColumn,
  configColumn2,
  configColumn3,
  configDual,
  configDual2,
  configDual3,
  configLine,
  configLine2,
  configLine3,
  configPie,
  configPie2,
} from '../../data/chartExamples';
import CodeBlock from '../CodeBlock';
import styles from './ExampleCard.less';

// 图表组件映射
const chartComponents: Record<string, React.ComponentType<any>> = {
  Pie,
  Column,
  Line,
  Area,
  DualAxes,
};

// 配置映射表
const configMap: Record<string, any> = {
  configPie,
  configPie2,
  configArea,
  configArea2,
  configColumn,
  configColumn2,
  configColumn3,
  configLine,
  configLine2,
  configLine3,
  configDual,
  configDual2,
  configDual3,
};

const { Text } = Typography;

interface ExampleCardProps {
  title: string;
  input: string;
  output: string;
  description?: string;
  exampleType?: 'code' | 'chart';
}

const ExampleCard: React.FC<ExampleCardProps> = ({
  title,
  input,
  output,
  description,
  exampleType = 'code',
}) => {
  const [copied, setCopied] = useState(false);

  const copyInput = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 静默失败
    }
  }, [input]);

  // 解析图表示例的输出，获取配置变量名和图表类型
  const parseChartOutput = useCallback((outputStr: string) => {
    // 匹配 <Pie {...configPie2} /> 格式
    const match = outputStr.match(/<(\w+)\s+\{\.\.\.(\w+)\}\s*\/>/);
    if (match) {
      return {
        componentName: match[1],
        configName: match[2],
      };
    }
    return null;
  }, []);

  // 渲染图表示例
  const renderChartExample = useCallback(() => {
    const parsed = parseChartOutput(output);
    if (!parsed) return null;

    const { componentName, configName } = parsed;
    const ChartComponent = chartComponents[componentName];
    const config = configMap[configName];

    if (!ChartComponent || !config) return null;

    // 为饼图添加特定的容器样式
    const isPieChart = componentName === 'Pie';
    const wrapperClass = isPieChart
      ? styles.chartWrapperPie
      : styles.chartWrapper;

    // 清理配置，移除可能导致 G2 解析异常的属性
    const cleanConfig = { ...config, autoFit: true };
    if (cleanConfig.label && typeof cleanConfig.label === 'object') {
      // 移除 content 属性，避免 G2 解析花括号出错
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { content, ...restLabel } = cleanConfig.label;
      cleanConfig.label = restLabel;
    }

    return (
      <div className={wrapperClass}>
        <ChartComponent {...cleanConfig} />
      </div>
    );
  }, [output, parseChartOutput]);

  return (
    <Card
      size="small"
      className={styles.exampleCard}
      title={
        <Space>
          <Tag color={exampleType === 'chart' ? 'green' : 'blue'}>
            {exampleType === 'chart' ? '图表示例' : '示例'}
          </Tag>
          <Text strong>{title}</Text>
        </Space>
      }
    >
      {description && (
        <Text type="secondary" className={styles.description}>
          {description}
        </Text>
      )}
      <div className={styles.exampleContent}>
        <div className={styles.exampleRow}>
          <Text type="secondary" className={styles.label}>
            输入
          </Text>
          <div className={styles.codeWrapper}>
            <Button
              type="link"
              size="small"
              icon={<CopyOutlined />}
              onClick={copyInput}
              className={styles.copyBtn}
            >
              {copied ? '已复制' : '复制'}
            </Button>
            <CodeBlock code={input} language="javascript" compact />
          </div>
        </div>
        <div className={styles.exampleRow}>
          <Text type="secondary" className={styles.label}>
            {exampleType === 'chart' ? '效果' : '输出'}
          </Text>
          {exampleType === 'chart' ? (
            renderChartExample()
          ) : (
            <CodeBlock code={output} language="javascript" compact />
          )}
        </div>
      </div>
    </Card>
  );
};

export default ExampleCard;
