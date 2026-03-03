import { OpenAIOutlined, GlobalOutlined } from '@ant-design/icons';
import { Bubble, Prompts, Sender, Think, ThoughtChain, Welcome, XProvider, } from '@ant-design/x';
import { DeepSeekChatProvider, SSEFields, useXChat, useXConversations, XModelMessage, XModelParams, XModelResponse, XRequest, } from '@ant-design/x-sdk';
import { Flex, Button, theme, message, Space } from 'antd';
import XMarkdown from '@ant-design/x-markdown';
import React, { useState } from 'react';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';
import locale from './local';
import useStyle from './DDXaiStyle';
import DDXaiUtil, { useMarkdownTheme, getPrompt } from './DDXaiUtil';
import type { ActionsFeedbackProps, BubbleListProps, ThoughtChainItemProps } from '@ant-design/x';
import type { ComponentProps } from '@ant-design/x-markdown';
import type { DefaultMessageInfo } from '@ant-design/x-sdk';
import myUtil from '../DDAssist/util';
import { useAntdConfig, useAntdConfigSetter } from 'umi';
import theme_config_common from '../DDAssist/constants/theme_config/theme_config_common';
import { merge } from 'lodash';
import CONSTANTS from '../DDAssist/constants';
const { darkAlgorithm, defaultAlgorithm } = theme;

const HISTORY_MESSAGES: { [key: string]: DefaultMessageInfo<ChatMessage>[]; } = {};
const DEFAULT_CONVERSATIONS_ITEMS = [ { key: 'default-0', label: locale.whatIsAntDesignX, group: locale.today, }, ];
const HOT_TOPICS = {
  key: '1',
  label: '主题示例',
  children: [
    { key: '1-1', description: '赛博朋克2077', icon: <span style={{ color: '#f93a4a', fontWeight: 700 }}>1</span> },
    { key: '1-2', description: '暮光紫主题，柔和渐变，适合女性用户', icon: <span style={{ color: '#ff6565', fontWeight: 700 }}>2</span> },
    { key: '1-3', description: '多巴胺风格，高饱和高对比色彩，渐变背景，列表背景渐变色', icon: <span style={{ color: '#ff8f1f', fontWeight: 700 }}>3</span> },
    { key: '1-7', description: '彩虹糖果主题，高饱和高对比色彩搭配，体现童趣及欢快，采用高对比的背景和文字，文字清晰，菜单背景采用渐变色，整体背景采用渐变色，表格背景采用建表色', icon: <span style={{ color: '#00000040', fontWeight: 700 }}>3</span> },
    { key: '1-4', description: '政务服务系统 UI 主题色，核心风格：庄重、可靠、亲民', icon: <span style={{ color: '#00000040', fontWeight: 700 }}>4</span> },
    { key: '1-5', description: '游戏娱乐系统 UI 主题色，核心风格：炫酷、动感、沉浸式', icon: <span style={{ color: '#00000040', fontWeight: 700 }}>5</span> },
    { key: '1-6', description: '医疗健康系统 UI 主题色，核心风格：安心、洁净、专业', icon: <span style={{ color: '#00000040', fontWeight: 700 }}>6</span> },
  ],
};

const THOUGHT_CHAIN_CONFIG = {
  loading: { title: locale.modelIsRunning, status: 'loading' },
  updating: { title: locale.modelIsRunning, status: 'loading' },
  success: { title: locale.modelExecutionCompleted, status: 'success' },
  error: { title: locale.executionFailed, status: 'error' },
  abort: { title: locale.aborted, status: 'abort' },
};

// ==================== Type ====================
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

const ThinkComponent = React.memo((props: ComponentProps) => {
  const [title, setTitle] = React.useState(`${locale.deepThinking}...`);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (props.streamStatus === 'done') {
      setTitle(locale.completeThinking);
      setLoading(false);
    }
  }, [props.streamStatus]);

  return (
    <Think title={title} loading={loading}>
      {props.children}
    </Think>
  );
});

const saveTheme = (newSkin: any) => {
  let cc: any = myUtil.sessionStore.getItem('customerConfig') || {};
  let skinPlan: any = cc.skin_plan || [];
  let newSkinPlan: any = {...newSkin};
  newSkinPlan.tagId = myUtil.text.uuid();
  skinPlan.push(newSkinPlan);
  myUtil.sys.saveCustomerConfig({
    customer_config_key: 'skin_plan',
    customer_config_value: [...skinPlan],
    showResponseInfo: true
  });
  return newSkinPlan;
};

const saveTheme2 = (newSkin: any) => {
  let newSkinPlan = saveTheme(newSkin);
  myUtil.localStore.setItem('theme', {
    compact: CONSTANTS.DEFAULT_THEME_COMPACT, // 'theme_compact_false',
    fontSize: CONSTANTS.DEFAULT_THEME_FONT_SIZE, // theme_font_size_14px
    radius: CONSTANTS.DEFAULT_THEME_RADIUS, // theme_radius_4px
    skin: `customer_config_skin_${newSkinPlan.tagId}`,
    // fixedHeader: true,
    // formItemLabelShow: true,
    // formItemLayout: 'vertical',
    // gridBorder: true,
    // gridPaginationPagesize: 10,
    // gridSize: 'small',
    // layout: 'side',
  });
  // myUtil.theme.init();
};

const getRole = (className: string, skin: any, inputValue: any): BubbleListProps['role'] => ({
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
      const newContent = content.replace('/\n\n/g', '<br/><br/>');
      return (
        <>
          <XMarkdown
            paragraphTag="div"
            components={{ think: ThinkComponent, }}
            className={className}
            streaming={{
              hasNextChunk: status === 'updating',
              enableAnimation: true,
            }}
          >
            {newContent}
          </XMarkdown>
          <Space>
            <Button onClick={() => saveTheme(skin)} loading={status === 'updating'}>保存主题</Button>
            <Button onClick={() => saveTheme2(skin)} loading={status === 'updating'}>保存并使用主题</Button>
          </Space>
        </>
      );
    },
  },
  user: {
    placement: 'end',
    contentRender: (content: any) => {
      const reg = /<userReq>([\s\S]*)<\/userReq>/;
      const matchResult = content.match(reg);
      let userReqContent = '';
      if (matchResult && matchResult[1]) {
        userReqContent = matchResult[1].trim();
      }
      return (
        <>{userReqContent}</>
      );
    },
  },
});

const Independent: React.FC<any> = ({
  config,
}) => {
  const [className] = useMarkdownTheme();
  const [deepThink, setDeepThink] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState('');
  const [ skin, setSkin ] = useState<any>({});
  const setAntdConfig = useAntdConfigSetter();
  const antdConfig: any = useAntdConfig();
  // let setAntdConfig = config.setAntdConfig;
  // let antdConfig: any = config.antdConfig;
  const { styles } = useStyle();
  const { activeConversationKey, setActiveConversationKey } = useXConversations({
    defaultConversations: DEFAULT_CONVERSATIONS_ITEMS,
    defaultActiveConversationKey: DEFAULT_CONVERSATIONS_ITEMS[0].key,
  });

  // ==================== Chat Provider ====================
  const providerCaches = new Map<string, DeepSeekChatProvider>();
  const providerFactory = (conversationKey: string, deepThink: any) => {
    let callbacks = {
      onSuccess: (chunks: any)=> {
        let tmpContent = '';
        for (let i = 0; i < chunks.length; i++) {
          if (chunks[i]) {
            let tmp123 = chunks[i]?.data || '{}';
            let tmp456: any;
            try {
              tmp456 = JSON.parse(tmp123) || {};
            } catch (errInfo) {
              tmp456 = {};
              console.info(errInfo);
            }
            let tmp789 = tmp456?.choices?.length > 0 ? tmp456?.choices[0]?.delta?.content : '';
            tmpContent += tmp789;
          }
        }
        let tmp8: any;
        try {
          tmpContent = tmpContent?.replace('```json', '').replace('```', '');
          tmp8 = JSON.parse(tmpContent) || {};
        } catch (errInfo) {
          tmp8 = {};
        }
        // 设置临时预览皮肤样式
        let aiTheme = tmp8;
        let borderRadius = Number(CONSTANTS.DEFAULT_THEME_RADIUS.replace('theme_radius_', '').replace('px', '')); // 4
        let fontSizeNum = Number(CONSTANTS.DEFAULT_THEME_FONT_SIZE.replace('theme_font_size_', '').replace('px', '')); // 14
        let compact2 = JSON.parse(CONSTANTS.DEFAULT_THEME_COMPACT.replace('theme_compact_', '')); // false
        // 通用主题
        const themeToken = theme_config_common({compact: compact2, borderRadius, fontSize: fontSizeNum});
        // 主题设置
        antdConfig.theme.algorithm = aiTheme?.darkAlgorithm ? [darkAlgorithm] : [defaultAlgorithm];
        antdConfig.theme.token = myUtil.text.cleanNullObject(merge(themeToken.token, aiTheme.token));
        antdConfig.theme.components = myUtil.text.cleanNullObject(merge(themeToken.components, aiTheme.components));
        let tokenAll = merge(themeToken, aiTheme);
        setAntdConfig({
          ...antdConfig,
        });
        myUtil.theme.fixedStyle(tokenAll);
        setSkin(tokenAll);

        // myUtil.localStore.setItem('theme', values);
        // myUtil.theme.init();
      }
    };
    if (!providerCaches.get(conversationKey)) {
      let { aiUrl, aiParam } = DDXaiUtil.setReqParam({ deepThink, factory: 'deepseek', callbacks })
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

  const historyMessageFactory = (conversationKey: string): DefaultMessageInfo<ChatMessage>[] => {
    return HISTORY_MESSAGES[conversationKey] || [];
  };

  // ==================== Runtime ====================

  const { onRequest, messages, isRequesting, abort, onReload, setMessage } = useXChat<ChatMessage>({
    provider: providerFactory(activeConversationKey, deepThink),
    conversationKey: activeConversationKey,
    defaultMessages: historyMessageFactory(activeConversationKey),
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

  const onSubmit = (val: string) => {
    if (!val) return;
    const context: any = getPrompt(val); // getPrompt(val); // val;
    onRequest({ messages: [{ role: 'user', content: context }]});
    setActiveConversationKey(activeConversationKey);
    setInputValue('');
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
          role={getRole(className, skin, inputValue)}
        />
      ) : (
        <Flex vertical style={{ maxWidth: 840 }} gap={16} align="center" className={styles.placeholder} >
          <Welcome style={{ width: '100%' }} variant="borderless"
            icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
            title='AI 生成主题'
            description='借助AI智能算法，快速产出贴合需求的创意主题，高效解决创意枯竭、选题耗时的问题。'
          />
          <Flex gap={16} justify="left" style={{ width: '100%' }} >
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
              onItemClick={(info) => { onSubmit(info.data.description as string); }}
              className={styles.chatPrompt}
            />
          </Flex>
        </Flex>
      )}
    </div>
  );

  const chatSender = (
    <Flex vertical gap={12} align="center" style={{ marginInline: 24 }} >
      <Sender
        value={inputValue}
        onSubmit={() => {
          onSubmit(inputValue);
        }}
        onChange={setInputValue}
        onCancel={() => { abort(); }}
        loading={isRequesting}
        className={styles.sender}
        placeholder='输入您想要的主题风格'
        suffix={false}
        autoSize={{ minRows: 3, maxRows: 6 }}
        footer={(actionNode) => {
          return (
            <Flex justify="space-between" align="center">
              <Flex gap="small" align="center">
                <Sender.Switch value={deepThink} onChange={(checked: boolean) => { setDeepThink(checked); }} icon={<OpenAIOutlined />} >深度思考</Sender.Switch>
                {/* <Button onClick={() => saveTheme(skin)} >保存主题</Button> */}
              </Flex>
              <Flex align="center">
                {actionNode}
              </Flex>
            </Flex>
          );
        }}
      />
    </Flex>
  );

  return (
    <XProvider locale={locale}>
      <ChatContext.Provider value={{ onReload, setMessage }}>
        <div className={styles.layout} style={{height: 'calc(100vh - 48px)'}}>
          <div className={styles.chat} style={{width: '100%'}}>
            {chatList}
            {chatSender}
          </div>
        </div>
      </ChatContext.Provider>
    </XProvider>
  );
};

export default Independent;