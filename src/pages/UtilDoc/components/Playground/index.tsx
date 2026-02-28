import {
  CheckCircleFilled,
  CloseCircleOutlined,
  CopyOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  PlayCircleOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Col,
  Input,
  List,
  Row,
  Space,
  Spin,
  Tabs,
  Typography,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import type { MethodDoc } from '../../types';
import styles from './Playground.less';

// 图标类型定义
type IconType =
  | 'info'
  | 'success'
  | 'error'
  | 'warning'
  | 'question'
  | 'confirm';

// 图标配置
const ICON_CONFIG: Record<
  IconType,
  { icon: React.ReactNode; color: string; label: string }
> = {
  info: {
    icon: <InfoCircleOutlined />,
    color: '#1890ff',
    label: '信息 (Info)',
  },
  success: {
    icon: <CheckCircleFilled />,
    color: '#52c41a',
    label: '成功 (Success)',
  },
  error: {
    icon: <CloseCircleOutlined />,
    color: '#ff4d4f',
    label: '错误 (Error)',
  },
  warning: {
    icon: <ExclamationCircleOutlined />,
    color: '#faad14',
    label: '警告 (Warning)',
  },
  question: {
    icon: <QuestionCircleOutlined />,
    color: '#1890ff',
    label: '询问 (Question)',
  },
  confirm: {
    icon: <InfoCircleOutlined />,
    color: '#1890ff',
    label: '确认 (Confirm)',
  },
};

const { TextArea } = Input;
const { Paragraph, Text } = Typography;

// 安全地解析参数
function parseArgs(argsStr: string): any[] {
  if (!argsStr.trim()) return [];

  // 尝试用 Function 构造函数解析（更安全的方式）
  try {
    // 将代码包装成函数调用
    const func = new Function(`return [${argsStr}]`);
    return func();
  } catch {
    // 如果还是失败，尝试解析单个参数
    try {
      const func = new Function(`return (${argsStr})`);
      return [func()];
    } catch {
      throw new Error('参数解析失败，请检查参数格式');
    }
  }
}

// 完整 Word 示例代码模板
const WORD_FULL_EXAMPLE_CODE = `import { Document, Packer } from 'docx';
import myUtil from '@/utils/myUtil';

// 1. 创建文档配置
const docxConfig = myUtil.word.createDocxConfig({ fontFamily: '微软雅黑' });

// 2. 准备文档子元素数组
const children: any[] = [];

// 3. 添加一级标题
children.push(myUtil.word.createTitle('年度报告', 1));
children.push(myUtil.word.createEmptyLine(200));

// 4. 添加章节标题和内容
children.push(myUtil.word.createTitle('第一章 概述', 2));
children.push(myUtil.word.createParagraph({
  text: '本报告总结了公司2025年度的工作成果，包括营收情况、用户增长、主要成就等方面。',
  indent: 360,
}));

// 5. 添加带项目符号的列表
children.push(myUtil.word.createTitle('主要成就', 3));
children.push(myUtil.word.createParagraph({ text: '本年度主要成就包括：', indent: 360 }));
children.push(myUtil.word.createParagraph({ text: '营收增长 25%，达到历史最高水平', bullet: true }));
children.push(myUtil.word.createParagraph({ text: '用户数突破 100 万，月活跃用户增长 40%', bullet: true }));
children.push(myUtil.word.createParagraph({ text: '获得行业大奖 "最佳创新企业" 称号', bullet: true }));
children.push(myUtil.word.createParagraph({ text: '成功完成 A 轮融资，估值突破 10 亿', bullet: true }));

// 6. 创建数据表格
children.push(myUtil.word.createTitle('季度业绩', 2));
const table = myUtil.word.createTable({
  columns: [
    { title: '季度', dataIndex: 'quarter' },
    { title: '营收(万)', dataIndex: 'revenue' },
    { title: '增长率', dataIndex: 'growth' },
  ],
  dataSource: [
    { quarter: 'Q1', revenue: 1200, growth: '15%' },
    { quarter: 'Q2', revenue: 1500, growth: '25%' },
    { quarter: 'Q3', revenue: 1800, growth: '20%' },
    { quarter: 'Q4', revenue: 2100, growth: '17%' },
  ],
  showLineNumber: true,
});
children.push(table);
children.push(myUtil.word.createEmptyLine(200));

// 7. 添加更多内容
children.push(myUtil.word.createTitle('第二章 展望', 2));
children.push(myUtil.word.createParagraph({
  text: '展望2026年，我们将继续秉承"用户至上"的理念，不断创新，为用户创造更大的价值。',
  indent: 360,
}));

children.push(myUtil.word.createTitle('发展目标', 3));
children.push(myUtil.word.createParagraph({ text: '2026年发展目标：', indent: 360 }));
children.push(myUtil.word.createParagraph({ text: '营收目标：突破 1 亿元', bullet: true }));
children.push(myUtil.word.createParagraph({ text: '用户目标：月活用户突破 200 万', bullet: true }));
children.push(myUtil.word.createParagraph({ text: '产品目标：发布 3.0 版本，引入 AI 智能功能', bullet: true }));

// 8. 将目录放到文档最前面（在所有内容之后、创建 Document 之前）
const tocIndex = 1; // 目录放在第二个位置（标题之后）
children.splice(tocIndex, 0, myUtil.word.createTitle('目 录', 2));
myUtil.word.createTableOfContents(children);

// 9. 创建文档对象（含页眉页脚）
const doc = new Document({
  ...docxConfig.styles,
  sections: [{
    properties: {},
    children,
  }],
});

// 10. 保存文档
myUtil.word.saveDocx(doc, '年度报告_完整示例');`;

interface PlaygroundProps {
  method: MethodDoc;
}

const Playground: React.FC<PlaygroundProps> = ({ method }) => {
  const [code, setCode] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('playground');

  // 生成默认测试代码，优先使用第一个示例
  const generateDefaultCode = useCallback(() => {
    // DocxConfig 是属性对象，不需要括号
    if (method.name === 'DocxConfig') {
      setCode('myUtil.word.DocxConfig;');
      setResult('');
      setError('');
      return;
    }

    // 优先使用第一个示例的 input 作为默认代码
    if (method.examples?.[0]?.input) {
      setCode(method.examples[0].input);
      setResult('');
      setError('');
      return;
    }

    const paramDefaults = method.params
      ?.map((p) => {
        if (p.type === 'string') return `"${p.name}": "${p.default || 'test'}"`;
        if (p.type === 'number') return `${p.name}: ${p.default || 123}`;
        if (p.type === 'boolean') return `${p.name}: ${p.default || false}`;
        if (p.type.includes('[]')) return `${p.name}: []`;
        if (p.type === 'Record<string, any>') return `${p.name}: {}`;
        return `${p.name}: ${p.default || 'undefined'}`;
      })
      .join(', ');

    const args = method.params?.length ? `{ ${paramDefaults} }` : '';

    setCode(`myUtil.${method.module}.${method.name}(${args});`);
    setResult('');
    setError('');
  }, [method]);

  useEffect(() => {
    generateDefaultCode();
  }, [method.name, generateDefaultCode]);

  // 执行代码
  const runCode = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      // 动态导入工具类
      const myUtil = await import('@/components/DDAssist/util').then(
        (mod) => mod.default,
      );

      // 检查代码是否包含多行（变量声明等）
      const hasMultipleLines = code.includes('\n');
      if (hasMultipleLines) {
        // 重写 console.log 以捕获输出
        const originalLog = console.log;
        const originalInfo = console.info;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const consoleOutputs: string[] = [];

        // eslint-disable-next-line no-console
        console.log = (...args) => {
          const msg = args
            .map((arg) =>
              typeof arg === 'object'
                ? JSON.stringify(arg, null, 2)
                : String(arg),
            )
            .join(' ');
          consoleOutputs.push(msg);
        };
        // eslint-disable-next-line no-console
        console.info = console.log;

        try {
          // 使用 eval 执行代码（此时 myUtil 已通过 import 加载）
          // eval 会在当前作用域执行，可以访问 myUtil 变量
          // eslint-disable-next-line no-eval
          const resultValue = eval(code);

          // 构建结果输出
          let output = '';
          if (consoleOutputs.length > 0) {
            output = consoleOutputs.join('\n');
          }

          if (resultValue !== undefined) {
            const resultStr =
              typeof resultValue === 'object'
                ? JSON.stringify(resultValue, null, 2)
                : String(resultValue);
            if (output) {
              output += '\n\n// 返回值:\n' + resultStr;
            } else {
              output = resultStr;
            }
          }

          setResult(output || 'undefined');
        } catch (err: any) {
          setError(err.message || '执行出错');
        } finally {
          // 恢复 console
          console.log = originalLog;
          console.info = originalInfo;
        }
        setLoading(false);
        return;
      }

      // 检查是否是属性访问（无括号），如 myUtil.word.DocxConfig;
      const propertyMatch = code.match(/myUtil\.(\w+)\.(\w+);?\s*$/);
      if (propertyMatch) {
        const [, moduleName, propName] = propertyMatch;
        const utilModule = myUtil[moduleName];

        if (!utilModule) {
          throw new Error(`模块 ${moduleName} 不存在`);
        }

        const output = utilModule[propName];

        // 显示结果
        if (typeof output === 'object') {
          setResult(JSON.stringify(output, null, 2));
        } else {
          setResult(String(output));
        }
        setLoading(false);
        return;
      }

      // 单行代码：提取方法调用
      const match = code.match(/myUtil\.(\w+)\.(\w+)\((.*)\);?/);
      if (!match) {
        throw new Error(
          '代码格式不正确，请使用 myUtil.module.method(args) 格式',
        );
      }

      const [, moduleName, methodName, argsStr] = match;
      const utilModule = myUtil[moduleName];

      if (!utilModule) {
        throw new Error(`模块 ${moduleName} 不存在`);
      }

      if (typeof utilModule[methodName] !== 'function') {
        throw new Error(`方法 ${methodName} 不存在`);
      }

      // 解析参数
      const args = parseArgs(argsStr);

      // 特殊处理 confirm 方法（异步回调，在 Playground 中无法等待用户交互）
      if (methodName === 'confirm' && moduleName === 'modal') {
        // 修改回调函数，在结果区域显示
        const originalOnOK = args[0]?.onOK;
        const originalOnCancel = args[0]?.onCancel;

        args[0] = {
          ...args[0],
          onOK: () => {
            originalOnOK?.();
            setResult('✅ 用户点击了"确定"');
          },
          onCancel: () => {
            originalOnCancel?.();
            setResult('❌ 用户点击了"取消"');
          },
        };

        // 执行 confirm 方法
        utilModule[methodName](...args);
        setResult('确认对话框已弹出！\n点击下方按钮查看回调执行结果...');
        setLoading(false);
        return;
      }

      // 执行方法
      const output = utilModule[methodName](...args);

      // 如果是 Promise，等待结果
      let finalOutput = output;
      if (output instanceof Promise) {
        finalOutput = await output;
      }

      // 显示结果
      if (typeof finalOutput === 'object') {
        setResult(JSON.stringify(finalOutput, null, 2));
      } else if (finalOutput === undefined) {
        setResult('undefined');
      } else {
        setResult(String(finalOutput));
      }
    } catch (err: any) {
      setError(err.message || '执行出错');
    } finally {
      setLoading(false);
    }
  }, [code, method]);

  // 运行完整 Word 示例并下载
  const runFullExample = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      // 动态导入工具类和 docx
      const [myUtil, docx] = await Promise.all([
        import('@/components/DDAssist/util').then((mod) => mod.default),
        import('docx'),
      ]);

      const { Document } = docx;

      // 1. 创建文档配置
      const docxConfig = myUtil.word.createDocxConfig({
        fontFamily: '微软雅黑',
      });

      // 2. 准备文档子元素数组
      const children: any[] = [];

      // 3. 添加一级标题
      children.push(myUtil.word.createTitle('年度报告', 1));
      children.push(myUtil.word.createEmptyLine(200));

      // 4. 添加章节标题和内容
      children.push(myUtil.word.createTitle('第一章 概述', 2));
      children.push(
        myUtil.word.createParagraph({
          text: '本报告总结了公司2025年度的工作成果，包括营收情况、用户增长、主要成就等方面。',
          indent: 360,
        }),
      );

      // 5. 添加带项目符号的列表
      children.push(myUtil.word.createTitle('主要成就', 3));
      children.push(
        myUtil.word.createParagraph({
          text: '本年度主要成就包括：',
          indent: 360,
        }),
      );
      children.push(
        myUtil.word.createParagraph({
          text: '营收增长 25%，达到历史最高水平',
          bullet: true,
        }),
      );
      children.push(
        myUtil.word.createParagraph({
          text: '用户数突破 100 万，月活跃用户增长 40%',
          bullet: true,
        }),
      );
      children.push(
        myUtil.word.createParagraph({
          text: '获得行业大奖 "最佳创新企业" 称号',
          bullet: true,
        }),
      );
      children.push(
        myUtil.word.createParagraph({
          text: '成功完成 A 轮融资，估值突破 10 亿',
          bullet: true,
        }),
      );

      // 6. 创建数据表格
      children.push(myUtil.word.createTitle('季度业绩', 2));
      const table = myUtil.word.createTable({
        columns: [
          { title: '季度', dataIndex: 'quarter' },
          { title: '营收(万)', dataIndex: 'revenue' },
          { title: '增长率', dataIndex: 'growth' },
        ],
        dataSource: [
          { quarter: 'Q1', revenue: 1200, growth: '15%' },
          { quarter: 'Q2', revenue: 1500, growth: '25%' },
          { quarter: 'Q3', revenue: 1800, growth: '20%' },
          { quarter: 'Q4', revenue: 2100, growth: '17%' },
        ],
        showLineNumber: true,
      });
      children.push(table);
      children.push(myUtil.word.createEmptyLine(200));

      // 7. 添加更多内容
      children.push(myUtil.word.createTitle('第二章 展望', 2));
      children.push(
        myUtil.word.createParagraph({
          text: '展望2026年，我们将继续秉承"用户至上"的理念，不断创新，为用户创造更大的价值。',
          indent: 360,
        }),
      );

      children.push(myUtil.word.createTitle('发展目标', 3));
      children.push(
        myUtil.word.createParagraph({
          text: '2026年发展目标：',
          indent: 360,
        }),
      );
      children.push(
        myUtil.word.createParagraph({
          text: '营收目标：突破 1 亿元',
          bullet: true,
        }),
      );
      children.push(
        myUtil.word.createParagraph({
          text: '用户目标：月活用户突破 200 万',
          bullet: true,
        }),
      );
      children.push(
        myUtil.word.createParagraph({
          text: '产品目标：发布 3.0 版本，引入 AI 智能功能',
          bullet: true,
        }),
      );

      // 8. 添加自动目录（放在所有内容之后）
      myUtil.word.createTableOfContents(children);

      // 9. 将目录放到文档最前面（在标题之后）
      const tocIndex = 1;
      children.splice(tocIndex, 0, myUtil.word.createTitle('目 录', 2));

      // 10. 创建文档对象
      const doc = new Document({
        ...docxConfig.styles,
        sections: [
          {
            properties: {},
            children,
          },
        ],
      });

      // 11. 保存文档
      myUtil.word.saveDocx(doc, '年度报告_完整示例');

      setResult('Word 文档已下载！');
    } catch (err: any) {
      setError(err.message || '执行出错');
    } finally {
      setLoading(false);
    }
  }, []);

  // 复制代码
  const copyCode = useCallback(async () => {
    try {
      // 优先使用 Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
        return;
      }
      // 降级方案：使用 textarea 复制
      const textArea = document.createElement('textarea');
      textArea.value = code;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    } catch {
      // 静默失败，不影响用户使用
    }
  }, [code]);

  // 复制完整示例代码
  const copyFullExampleCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(WORD_FULL_EXAMPLE_CODE);
    } catch {
      // 静默失败
    }
  }, []);

  // 判断是否为 word 模块
  const isWordModule = method.module === 'word';

  // 判断是否为 getIcon 方法
  const isGetIconMethod = method.name === 'getIcon';

  // 当前选中的图标类型
  const [selectedIcon, setSelectedIcon] = useState<IconType>('info');

  // 图标列表点击处理
  const handleIconSelect = useCallback((iconType: IconType) => {
    setSelectedIcon(iconType);
  }, []);

  return (
    <Card className={styles.playground} size="small">
      {isWordModule ? (
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'playground',
              label: '在线试用',
              children: (
                <Row gutter={16} align="top">
                  <Col span={12}>
                    <div className={styles.codeHeader}>
                      <span>代码</span>
                      <Space>
                        <Button
                          type="link"
                          icon={<ReloadOutlined />}
                          onClick={generateDefaultCode}
                        >
                          重置
                        </Button>
                        <Button
                          type="link"
                          icon={<CopyOutlined />}
                          onClick={copyCode}
                        >
                          复制
                        </Button>
                      </Space>
                    </div>
                    <TextArea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className={styles.codeInput}
                      rows={code.split('\n').length + 2}
                      spellCheck={false}
                      allowClear
                      onDoubleClick={(e) =>
                        (e.target as HTMLTextAreaElement).select()
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <div className={styles.resultHeader}>
                      <Button
                        type="primary"
                        icon={<PlayCircleOutlined />}
                        loading={loading}
                        onClick={runCode}
                      >
                        运行
                      </Button>
                    </div>
                    <div className={styles.resultOutput}>
                      {loading ? (
                        <description tip="执行中..." />
                      ) : error ? (
                        <Alert type="error" message={error} />
                      ) : result ? (
                        <pre className={styles.resultPre}>{result}</pre>
                      ) : (
                        <span className={styles.placeholder}>
                          点击&quot;运行&quot;查看结果
                        </span>
                      )}
                    </div>
                  </Col>
                </Row>
              ),
            },
            {
              key: 'fullExample',
              label: '完整示例',
              children: (
                <div>
                  <div className={styles.fullExampleHeader}>
                    <Space
                      direction="vertical"
                      size="middle"
                      style={{ width: '100%' }}
                    >
                      <Paragraph>
                        <Text strong>功能说明：</Text>
                        点击下方按钮可直接下载包含以下内容的完整 Word 文档：
                      </Paragraph>
                      <ul style={{ marginLeft: 20 }}>
                        <li>一级标题（32号字）：年度报告</li>
                        <li>
                          二级标题（26号字）：目 录、第一章 概述、第二章
                          展望、季度业绩
                        </li>
                        <li>三级标题（22号字）：主要成就、发展目标</li>
                        <li>
                          自动目录（位于标题之后，根据 Heading
                          级别标题自动生成）
                        </li>
                        <li>段落（支持首行缩进）</li>
                        <li>项目符号列表</li>
                        <li>数据表格（带序号列）</li>
                      </ul>
                      <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        loading={loading}
                        onClick={runFullExample}
                        size="large"
                      >
                        下载完整 Word 文档
                      </Button>
                      {result && (
                        <Alert type="success" message={result} showIcon />
                      )}
                      {error && <Alert type="error" message={error} showIcon />}
                    </Space>
                  </div>

                  <div className={styles.codeHeader} style={{ marginTop: 16 }}>
                    <span>完整代码</span>
                    <Button
                      type="text"
                      icon={<CopyOutlined />}
                      onClick={copyFullExampleCode}
                    >
                      复制
                    </Button>
                  </div>
                  <TextArea
                    value={WORD_FULL_EXAMPLE_CODE}
                    className={styles.codeInput}
                    rows={20}
                    readOnly
                    spellCheck={false}
                  />
                </div>
              ),
            },
          ]}
        />
      ) : isGetIconMethod ? (
        // getIcon 方法特殊展示模式：图标列表 + 预览
        <Row className={styles.iconPlayground} gutter={0}>
          <Col span={8} className={styles.iconList}>
            <div style={{ marginBottom: 8, fontWeight: 500, color: '#666' }}>
              选择消息类型：
            </div>
            <List
              size="small"
              dataSource={Object.keys(ICON_CONFIG) as IconType[]}
              renderItem={(item) => {
                const config = ICON_CONFIG[item];
                const isActive = selectedIcon === item;
                return (
                  <List.Item
                    className={isActive ? 'active' : ''}
                    onClick={() => handleIconSelect(item)}
                    style={
                      isActive ? { fontWeight: 'bold' } : { color: '#333' }
                    }
                  >
                    <Space>
                      <span style={{ color: config.color }}>{config.icon}</span>
                      <span>{config.label}</span>
                    </Space>
                  </List.Item>
                );
              }}
            />
          </Col>
          <Col span={16} className={styles.iconPreview}>
            <div
              className={styles.iconDisplay}
              style={{ color: ICON_CONFIG[selectedIcon].color }}
            >
              {ICON_CONFIG[selectedIcon].icon}
            </div>
            <div className={styles.iconName}>
              {ICON_CONFIG[selectedIcon].label}
            </div>
            <div className={styles.iconCode}>
              {`myUtil.modal.getIcon('${selectedIcon}')`}
            </div>
          </Col>
        </Row>
      ) : (
        <Row gutter={16} align="top">
          <Col span={12}>
            <div className={styles.codeHeader}>
              <span>代码</span>
              <Space>
                <Button
                  type="link"
                  icon={<ReloadOutlined />}
                  onClick={generateDefaultCode}
                >
                  重置
                </Button>
                <Button type="link" icon={<CopyOutlined />} onClick={copyCode}>
                  复制
                </Button>
              </Space>
            </div>
            <TextArea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={styles.codeInput}
              rows={Math.max(8, code.split('\n').length + 2)}
              spellCheck={false}
              allowClear
              onDoubleClick={(e) => (e.target as HTMLTextAreaElement).select()}
            />
          </Col>
          <Col span={12}>
            <div className={styles.resultHeader}>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                loading={loading}
                onClick={runCode}
              >
                运行
              </Button>
            </div>
            <div className={styles.resultOutput}>
              {loading ? (
                <Spin description="执行中..." />
              ) : error ? (
                <Alert type="error" message={error} />
              ) : result ? (
                <pre className={styles.resultPre}>{result}</pre>
              ) : (
                <span className={styles.placeholder}>
                  点击&quot;运行&quot;查看结果
                </span>
              )}
            </div>
          </Col>
        </Row>
      )}
    </Card>
  );
};

export default Playground;
