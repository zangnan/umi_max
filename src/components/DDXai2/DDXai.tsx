import { OpenAIOutlined, AppstoreAddOutlined, CloudUploadOutlined, CommentOutlined, DeleteOutlined, EditOutlined, EllipsisOutlined, FileSearchOutlined, GlobalOutlined, HeartOutlined, PaperClipOutlined, ProductOutlined, QuestionCircleOutlined, ScheduleOutlined, ShareAltOutlined, SmileOutlined, SyncOutlined, } from '@ant-design/icons';
import { Actions, Attachments, Bubble, Conversations, Prompts, Sender, Think, ThoughtChain, Welcome, XProvider, } from '@ant-design/x';
import { DeepSeekChatProvider, SSEFields, useXChat, useXConversations, XModelMessage, XModelParams, XModelResponse, XRequest } from '@ant-design/x-sdk';
import { Flex, message, Skeleton, Space, Button } from 'antd';
import XMarkdown from '@ant-design/x-markdown';
import React, { useState } from 'react';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';
import locale from '../DDXai/local';
import useStyle from '../DDXai/DDXaiStyle';
import DDXaiUtil, { useMarkdownTheme } from '../DDXai//DDXaiUtil';
import type { ActionsFeedbackProps, BubbleListProps, ThoughtChainItemProps } from '@ant-design/x';
import { withChartCode, withDefaultChartCode, ChartType, Line, Bar, Pie, Column } from '@antv/gpt-vis';
const factory = 'deepseek'; // deepseek iflow
const DEFAULT_CONVERSATIONS_ITEMS = [
  { key: 'default-0', label: locale.whatIsAntDesignX, group: locale.today, },
  { key: 'default-1', label: locale.howToQuicklyInstallAndImportComponents, group: locale.today, },
  { key: 'default-2', label: locale.newAgiHybridInterface, group: locale.yesterday, },
];

const HOT_TOPICS = {
  key: '1',
  label: locale.hotTopics,
  children: [
    { key: '1-1', description: '帮我可视化北京最近10年人口变化', icon: <span style={{ color: '#f93a4a', fontWeight: 700 }}>1</span>, },
    { key: '1-2', description: locale.newAgiHybridInterface, icon: <span style={{ color: '#ff6565', fontWeight: 700 }}>2</span>, },
    { key: '1-3', description: locale.whatComponentsAreInAntDesignX, icon: <span style={{ color: '#ff8f1f', fontWeight: 700 }}>3</span>, },
    { key: '1-4', description: locale.comeAndDiscoverNewDesignParadigm, icon: <span style={{ color: '#00000040', fontWeight: 700 }}>4</span>, },
    { key: '1-5', description: locale.howToQuicklyInstallAndImportComponents, icon: <span style={{ color: '#00000040', fontWeight: 700 }}>5</span>, },
  ],
};

const DESIGN_GUIDE = {
  key: '2',
  label: locale.designGuide,
  children: [
    { key: '2-1', icon: <HeartOutlined />, label: locale.intention, description: locale.aiUnderstandsUserNeedsAndProvidesSolutions, },
    { key: '2-2', icon: <SmileOutlined />, label: locale.role, description: locale.aiPublicPersonAndImage, },
    { key: '2-3', icon: <CommentOutlined />, label: locale.chat, description: locale.howAICanExpressItselfWayUsersUnderstand, },
    { key: '2-4', icon: <PaperClipOutlined />, label: locale.interface, description: locale.aiBalances, },
  ],
};

const THOUGHT_CHAIN_CONFIG = {
  loading: { title: locale.modelIsRunning, status: 'loading' },
  updating: { title: locale.modelIsRunning, status: 'loading' },
  success: { title: locale.modelExecutionCompleted, status: 'success' },
  error: { title: locale.executionFailed, status: 'error' },
  abort: { title: locale.aborted, status: 'abort' },
};

interface ChatMessage extends XModelMessage {
  extraInfo?: {
    feedback: ActionsFeedbackProps['value'];
  };
}

// ==================== Context ====================
const ChatContext = React.createContext<{
  onReload?: ReturnType<typeof useXChat>['onReload'];
  setMessage?: ReturnType<typeof useXChat<ChatMessage>>['setMessage'];
}>({});

// ==================== Sub Component ====================
const LineCompt = (props: Record<string, any>) => {
  const { children, axisXTitle, axisYTitle, streamStatus } = props;
  if (streamStatus === 'loading') {
    return <Skeleton.Image active={true} style={{ width: 901, height: 408 }} />;
  }
  return <Line data={JSON.parse(children)} axisXTitle={axisXTitle} axisYTitle={axisYTitle} />;
};

const CodeBlock: any = withChartCode({
  components: {
    [ChartType.Line]: Line,
    [ChartType.Bar]: Bar,
    [ChartType.Pie]: Pie,
    [ChartType.Column]: Column,
  },
});

const getRole = (className: string): BubbleListProps['role'] => ({
  assistant: {
    placement: 'start',
    header: (_, { status }) => {
      const config = THOUGHT_CHAIN_CONFIG[status as keyof typeof THOUGHT_CHAIN_CONFIG];
      return config ? (
        <ThoughtChain.Item
          style={{ marginBottom: 8, }}
          status={config.status as ThoughtChainItemProps['status']}
          variant="solid"
          icon={<GlobalOutlined />}
          title={config.title}
        />
      ) : null;
    },
    contentRender: (content: any, { status }) => {
      const newContent = content;
      return (
        <XMarkdown paragraphTag="div" className={className} style={{width: '100%'}}
          components={{
            // 'custom-line': LineCompt,
            'code': CodeBlock,
          }}
          streaming={{ hasNextChunk: status === 'updating', enableAnimation: true, }}
        >
          {newContent}
        </XMarkdown>
      );
    },
  },
  user: { placement: 'end' },
});

const Independent: React.FC = () => {
  const { styles } = useStyle();
  const { activeConversationKey, setActiveConversationKey } = useXConversations({
    defaultConversations: DEFAULT_CONVERSATIONS_ITEMS,
    defaultActiveConversationKey: DEFAULT_CONVERSATIONS_ITEMS[0].key,
  });
  const [className] = useMarkdownTheme();
  const [messageApi, contextHolder] = message.useMessage();
  const [inputValue, setInputValue] = useState('');

  // ==================== Chat Provider ====================
  const providerCaches = new Map<string, DeepSeekChatProvider>();
  const providerFactory = (conversationKey: string) => {
    if (!providerCaches.get(conversationKey)) {
      let { aiUrl, aiParam } = DDXaiUtil.setReqParam({ deepThink: false, factory: factory })
      providerCaches.set(
        conversationKey,
        new DeepSeekChatProvider({
          request: XRequest<XModelParams, Partial<Record<SSEFields, XModelResponse>>>(
            aiUrl, aiParam,
          ),
        }),
      );
    }
    return providerCaches.get(conversationKey);
  };

  const { onRequest, messages, isRequesting, abort, onReload, setMessage } = useXChat<ChatMessage>({
    provider: providerFactory(activeConversationKey),
    conversationKey: activeConversationKey,
    defaultMessages: [],
    requestPlaceholder: () => {
      return {
        content: locale.noData,
        role: 'assistant',
      };
    },
    requestFallback: (_, { messageInfo }) => {
      return {
        ...messageInfo?.message,
        content: messageInfo?.message?.content || locale.requestFailedPleaseTryAgain,
      };
    },
  });

  // ==================== Event ====================
  const onSubmit = (val: string) => {
    if (!val) return;
    const context = val;
    onRequest({ messages: [
      { role: 'system', content: `你是一个专业的数据分析助手。请将用户查询转换为结构化的图表数据。数据采用符合vis-chart标准的格式化，饼图数据示例如下：
        \`\`\`vis-chart
{ "type": "pie","data": [{"category":"2013","value":111},{"category":"2014","value":112},{"category":"2015","value":68.9},{"category":"2016","value":115}] }
\`\`\`
折线图数据示例如下：
        \`\`\`vis-chart
{ "type": "line","data": [{"time":"2013","value":111},{"time":"2014","value":112},{"time":"2015","value":68.9},{"time":"2016","value":115}] }
\`\`\`
柱状图数据示例如下：
        \`\`\`vis-chart
{ "type": "column","data": [{"category":"2013","value":111},{"category":"2014","value":112},{"category":"2015","value":68.9},{"category":"2016","value":115}] }
\`\`\`
        `
      },
      { role: 'user', content: context }
    ]});
    setActiveConversationKey(activeConversationKey);
  };

  const chatList = (
    <div className={styles.chatList}>
      {messages?.length ? (
        /* 🌟 消息列表 */
        <Bubble.List
          items={messages?.map((i) => ({
            ...i.message,
            key: i.id,
            status: i.status,
            loading: i.status === 'loading',
            extraInfo: i.extraInfo,
          }))}
          styles={{ bubble: { maxWidth: 840 } }}
          role={getRole(className)}
        />
      ) : (
        <Flex vertical style={{ maxWidth: 840 }} gap={16} align="center" className={styles.placeholder} >
          <Welcome
            style={{ width: '100%' }}
            variant="borderless"
            icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
            title={locale.welcome}
            description={locale.welcomeDescription}
            extra={
              <Space>
                <Button icon={<ShareAltOutlined />} />
                <Button icon={<EllipsisOutlined />} />
              </Space>
            }
          />
          <Flex gap={16} justify="center" style={{ width: '100%' }} >
            <Prompts
              items={[HOT_TOPICS]}
              styles={{
                list: { height: '100%' },
                item: {
                  flex: 1,
                  backgroundImage: 'linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)',
                  borderRadius: 12,
                  border: 'none',
                },
                subItem: { padding: 0, background: 'transparent' },
              }}
              onItemClick={(info) => {
                onSubmit(info.data.description as string);
              }}
              className={styles.chatPrompt}
            />
            <Prompts
              items={[DESIGN_GUIDE]}
              styles={{
                item: {
                  flex: 1,
                  backgroundImage: 'linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)',
                  borderRadius: 12,
                  border: 'none',
                },
                subItem: { background: '#ffffffa6' },
              }}
              onItemClick={(info) => { onSubmit(info.data.description as string); }}
              className={styles.chatPrompt}
            />
          </Flex>
        </Flex>
      )}
    </div>
  );

  return (
    <XProvider locale={locale}>
      <ChatContext.Provider value={{ onReload, setMessage }}>
        {contextHolder}
        <div className={styles.layout} style={{height: 'calc(100vh - 48px)'}}>
          <div className={styles.chat} style={{width: '100%'}}>
            {chatList}
            <Flex vertical gap={12} align="center" style={{ marginInline: 24 }} >
              <Sender
                value={inputValue}
                onSubmit={() => {
                  onSubmit(inputValue);
                  setInputValue('');
                }}
                onChange={setInputValue}
                onCancel={() => { abort(); }}
                loading={isRequesting}
                className={styles.sender}
                placeholder={locale.askOrInputUseSkills}
                autoSize={{ minRows: 1, maxRows: 3 }}
              />
            </Flex>
          </div>
        </div>
      </ChatContext.Provider>
    </XProvider>
  );
};

export default Independent;