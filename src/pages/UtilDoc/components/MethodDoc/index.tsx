import { Alert, Divider, Space, Tabs, Tag, Typography } from 'antd';
import React from 'react';
import { utilDocConfig } from '../../config';
import type { UtilDocData } from '../../types';
import CodeBlock from '../CodeBlock';
import ExampleCard from '../ExampleCard';
import Playground from '../Playground';
import styles from './MethodDoc.less';

const { Title, Paragraph, Text } = Typography;

interface MethodDocProps {
  data: UtilDocData;
  activeModule: string;
}

const MethodDoc: React.FC<MethodDocProps> = ({ data, activeModule }) => {
  const activeModuleData = data.modules.find((m) => m.type === activeModule);

  // 介绍页面
  if (activeModule === 'intro') {
    return (
      <div className={styles.wrapper}>
        <Title level={2}>{data.title}</Title>
        <Paragraph className={styles.versionInfo}>
          <Tag color="blue">v{data.version}</Tag>
          <Text type="secondary"> 更新于 {data.lastUpdated}</Text>
        </Paragraph>
        <Paragraph>{data.description}</Paragraph>

        {utilDocConfig.showInstallAndImport && (
          <>
            <Title level={4}>安装与导入</Title>
            <Tabs
              items={[
                {
                  key: 'npm',
                  label: 'NPM',
                  children: (
                    <CodeBlock code={data.installTip.npm} language="bash" />
                  ),
                },
                {
                  key: 'yarn',
                  label: 'Yarn',
                  children: (
                    <CodeBlock code={data.installTip.yarn} language="bash" />
                  ),
                },
                {
                  key: 'import',
                  label: '导入使用',
                  children: (
                    <CodeBlock
                      code={`import myUtil from '@/components/DDAssist/util';\n\n// 使用 text 模块\nmyUtil.text.formatNum(1234, '0,0.00');\n\n// 使用 date 模块\nmyUtil.date.formatDate(new Date(), 'YYYY-MM-DD');\n\n// 使用 storage 模块\nmyUtil.localStore.setItem('key', 'value');`}
                      language="typescript"
                    />
                  ),
                },
              ]}
            />
          </>
        )}

        <Title level={4}>模块概览</Title>
        <div className={styles.moduleGrid}>
          {data.modules.map((module) => (
            <div key={module.type} className={styles.moduleCard}>
              <Title level={5}>{module.name}</Title>
              <Text type="secondary">{module.description}</Text>
              <Text type="secondary" className={styles.methodCount}>
                {' '}
                {module.methods.length} 个方法
              </Text>
            </div>
          ))}
        </div>

        <Divider />

        <Title level={4}>更新日志</Title>
        {data.changelog.map((log) => (
          <div key={log.version} className={styles.changelogItem}>
            <Space>
              <Tag color="green">v{log.version}</Tag>
              <Text type="secondary">{log.date}</Text>
            </Space>
            <ul className={styles.changeList}>
              {log.changes.map((change, index) => (
                <li key={index}>{change}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  if (!activeModuleData) {
    return null;
  }

  const renderFeatureTag = (feature: string) => {
    if (feature === 'STABLE') return null; // 隐藏 STABLE 标记
    const colorMap: Record<string, string> = {
      NEW: 'blue',
      DEPRECATED: 'red',
      ASYNC: 'purple',
    };
    return <Tag color={colorMap[feature]}>{feature}</Tag>;
  };

  return (
    <div className={styles.wrapper}>
      <section className={styles.overview}>
        <Title level={2}>{activeModuleData.name}</Title>
        <Paragraph className={styles.description}>
          {activeModuleData.description}
        </Paragraph>
        {utilDocConfig.showDependencyTip &&
          activeModuleData.dependencyTip &&
          activeModuleData.dependencyTip.trim() && (
            <Alert
              type="info"
              message="依赖提示"
              description={activeModuleData.dependencyTip}
              showIcon
            />
          )}
      </section>

      <section className={styles.methodsSection}>
        {activeModuleData.methods.map((method) => (
          <div
            key={method.name}
            id={`method-${method.name}`}
            className={styles.methodCard}
          >
            <div className={styles.methodHeader}>
              <Title level={3}>
                {method.cnName}
                <Text copyable className={styles.methodName}>
                  {method.name}
                </Text>
              </Title>
              <Space>{method.features?.map((f) => renderFeatureTag(f))}</Space>
            </div>

            <div className={styles.signature}>
              <CodeBlock
                code={method.signature}
                language="typescript"
                compact
              />
            </div>

            <Paragraph>{method.description}</Paragraph>

            {utilDocConfig.showParams &&
              method.params &&
              method.params.length > 0 && (
                <div className={styles.paramsSection}>
                  <Title level={5}>参数</Title>
                  <table className={styles.paramTable}>
                    <thead>
                      <tr>
                        <th>名称</th>
                        <th>类型</th>
                        <th>必填</th>
                        <th>默认值</th>
                        <th>说明</th>
                      </tr>
                    </thead>
                    <tbody>
                      {method.params.map((param) => (
                        <tr key={param.name}>
                          <td>
                            <Text code>{param.name}</Text>
                          </td>
                          <td>
                            <Text type="secondary">{param.type}</Text>
                          </td>
                          <td>
                            {param.required ? <Tag color="red">是</Tag> : '否'}
                          </td>
                          <td>{param.default || '-'}</td>
                          <td>{param.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            {utilDocConfig.showReturns && (
              <div className={styles.returnSection}>
                <Title level={5}>返回值</Title>
                <Space direction="vertical">
                  <Text code>{method.returns.type}</Text>
                  <Text>{method.returns.description}</Text>
                </Space>
              </div>
            )}

            {utilDocConfig.showExamples && method.examples.length > 0 && (
              <div className={styles.examplesSection}>
                <Title level={5}>使用示例</Title>
                {method.examples.map((example, index) => (
                  <ExampleCard
                    key={index}
                    title={example.title}
                    input={example.input}
                    output={example.output}
                    description={example.description}
                    exampleType={example.exampleType}
                  />
                ))}
              </div>
            )}

            {utilDocConfig.showPlayground && (
              <div className={styles.playgroundSection}>
                <Title level={5}>在线测试</Title>
                <Playground method={method} />
              </div>
            )}

            {method.notes && method.notes.length > 0 && (
              <div className={styles.notesSection}>
                <Alert
                  type="warning"
                  message="注意事项"
                  description={
                    <ul>
                      {method.notes.map((note, i) => (
                        <li key={i}>{note}</li>
                      ))}
                    </ul>
                  }
                />
              </div>
            )}

            <div className={styles.methodDivider} />
          </div>
        ))}
      </section>
    </div>
  );
};

export default MethodDoc;
