import { Typography } from 'antd';
import markdownit from 'markdown-it';
import myUtil from '../DDAssist/util';
import { theme } from 'antd';
import React from 'react';

const DDXaiUtil: any = {};

// 阿里云百炼 参数
DDXaiUtil.ALIYUN_KEY = 'sk-e50478b47b13402da0aaca9d0de162bb';
DDXaiUtil.ALIYUN_REQ_AUTH = `Bearer ${DDXaiUtil.ALIYUN_KEY}`;
DDXaiUtil.ALIYUN_API_COMPLETIONS = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
DDXaiUtil.ALIYUN_API_DEFAULT_CONFIG = {
  stream: true,
  model: 'qwen-plus',
  temperature: 0.7,
  // enable_thinking: true,
}

// iflow 参数
DDXaiUtil.IFLOW_KEY = 'sk-1d816eeaf6c4672cccfd7a6400c9ec11';
DDXaiUtil.IFLOW_REQ_AUTH = `Bearer ${DDXaiUtil.IFLOW_KEY}`;
DDXaiUtil.IFLOW_API_COMPLETIONS = 'https://apis.iflow.cn/v1/chat/completions';
DDXaiUtil.IFLOW_API_DEFAULT_CONFIG = {
  stream: true,
  model: 'tstars2.0',
  temperature: 0.7,
  max_tokens: 8192, // 1 < x < 8192
}

// deepSeek 参数
DDXaiUtil.DEEP_SEEK_KEY = 'sk-03b4c99a09b04d6baf9803020860632a';
DDXaiUtil.DEEP_SEEK_REQ_AUTH = `Bearer ${DDXaiUtil.DEEP_SEEK_KEY}`;
DDXaiUtil.DEEP_SEEK_API_COMPLETIONS = 'https://api.deepseek.com/chat/completions';
DDXaiUtil.DEEP_SEEK_API_DEFAULT_CONFIG = { // deepSeek 默认参数
  stream: true,
  model: 'deepseek-chat', // deepseek-chat deepseek-reasoner
  // frequency_penalty: 0,
  // max_tokens: 2048,
  // presence_penalty: 0,
  // response_format: { type: 'text' }, // text | json_object
  // stop: null,
  // stream_options: null,
  // temperature: 1,
  // top_p: 1,
  // tools: null,
  // tool_choice: 'none',
  // logprobs: false,
  // top_logprobs: null
}

DDXaiUtil.setReqParam = ({ deepThink, factory, callbacks}: any) => {
  let aiParam: any;
  let aiUrl: any;
  if (factory === 'deepseek') {
    aiUrl = DDXaiUtil.DEEP_SEEK_API_COMPLETIONS;
    aiParam = {
      manual: true,
      headers: { 'Content-Type': 'application/json', 'Authorization': DDXaiUtil.DEEP_SEEK_REQ_AUTH, },
      params: {
        ...DDXaiUtil.DEEP_SEEK_API_DEFAULT_CONFIG,
        model: deepThink ? 'deepseek-reasoner' : DDXaiUtil.DEEP_SEEK_API_DEFAULT_CONFIG.model,
      },
    };
    if (callbacks) {
      aiParam.callbacks = callbacks;
    }
  } else if (factory === 'iflow') {
    aiUrl = DDXaiUtil.IFLOW_API_COMPLETIONS;
    aiParam = {
      manual: true,
      headers: { 'Content-Type': 'application/json', 'Authorization': DDXaiUtil.IFLOW_REQ_AUTH, },
      params: DDXaiUtil.IFLOW_API_DEFAULT_CONFIG,
    };
  } else if (factory === 'aliyun') {
    aiUrl = DDXaiUtil.ALIYUN_API_COMPLETIONS;
    aiParam = {
      manual: true,
      headers: { 'Content-Type': 'application/json', 'Authorization': DDXaiUtil.ALIYUN_REQ_AUTH, },
      params: {
        ...DDXaiUtil.ALIYUN_API_DEFAULT_CONFIG,
        enable_thinking: deepThink,
      },
    };
  }
  return { aiParam, aiUrl };
}

// { role: 'user', content: '模仿李白的风格写一首七律.飞机' }
// { role: 'system', content: '你是一位6岁儿童，识字不多' }
// { role: 'system', content: '你是一位大学二年级品学兼优的学生，有良好的文字功底' }
// { role: 'system', content: '你是一位80岁的老人，有良好的文字功底' }
// { role: 'system', content: '你是一位战国时期的诗人，有良好的文字功底' }

const getReqParam = ({ activeKey, conversationsNew }: any) => {
  let storeDeepseek: any =  myUtil.sessionStore.getItem('deepseek') || [];
  let conversations: any = storeDeepseek.find((item: any) => { return item.active }); // 获取原有对话列表
  let conversationsByActiveKeyNew: any = [ ...(conversations?.list || []), ...conversationsNew ]; // 拼接请求对话
  return conversationsByActiveKeyNew;
}

// deepSeek 对话请求
DDXaiUtil.reqCompletions = ({ message, onSuccess, systemRole, conversationsItems, setConversationsItems, activeKey, setCompletions, completions }: any) => {
  let param: any = { ...DDXaiUtil.DEEP_SEEK_API_DEFAULT_CONFIG };
  param.messages = [];
  if (systemRole) {
    param.messages.push( { role: 'system', content: systemRole }, )
  }
  param.messages.push({ role: 'user', content: message });
  param.messages = getReqParam({activeKey, conversationsNew: param.messages});
  fetch(DDXaiUtil.DEEP_SEEK_API_COMPLETIONS, {
    method: 'POST',
    body: JSON.stringify(param),
    headers: { 'Content-Type': 'application/json', 'Authorization': DDXaiUtil.DEEP_SEEK_REQ_AUTH, },
  })
  .then(res => res.json())
  .then(data => {
    let { choices, created, id, model, object, system_fingerprint, usage} = data;
    let returnMessage = choices[0].message;
    let { content, role } = returnMessage;
    let storeDeepseek: any =  myUtil.sessionStore.getItem('deepseek') || [];
    let conversations: any = storeDeepseek.find((item: any) => { return item.active }); // 获取原有对话列表
    let conversationsNew: any = [{ role: 'user', content: message }, { role: role, content: content }];
    let coCurrent = [...conversations.list, ...conversationsNew];
    conversations.list = [...coCurrent];
    setCompletions([...coCurrent]);
    myUtil.sessionStore.setItem('deepseek', storeDeepseek);
    onSuccess(`${data?.choices[0]?.message?.content}`);  // 文本格式 md格式
  })
}

let testcontent = `辽宁省是中国东北地区的一个省份，拥有丰富的自然景观和历史文化遗迹。截至2023年，辽宁省共有多个国家5A级旅游景区。以下是辽宁省的5A级旅游景区及其简要介绍：

1. **沈阳故宫博物院**
   - 沈阳故宫，又称盛京皇宫，是清朝初期的皇宫，位于沈阳市中心。它是中国现存仅次于北京故宫的第二大完整宫殿建筑群，具有重要的历史和文化价值。

2. **大连老虎滩海洋公园**
   - 大连老虎滩海洋公园位于大连市南部海滨，是一个集海洋动物展示、表演、科普教育、娱乐休闲于一体的大型海洋主题公园。

3. **大连金石滩国家旅游度假区**
   - 金石滩位于大连市金州区，以其独特的海岸地貌和奇石景观而闻名。这里有美丽的海滩、奇特的岩石和丰富的海洋生物，是一个集观光、休闲、娱乐、度假为一体的综合性旅游区。

4. **本溪水洞**
   - 本溪水洞位于本溪市，是中国北方最大的水洞之一。洞内有丰富的地下河流和钟乳石景观，是一个集探险、观光、科研于一体的旅游景区。

5. **鞍山千山风景名胜区**
   - 千山位于鞍山市东南部，是中国东北著名的佛教圣地和风景名胜区。这里山峦叠翠，寺庙众多，自然景观与人文景观交相辉映。

6. **丹东凤凰山风景名胜区**
   - 凤凰山位于丹东市，以其秀美的山水风光和丰富的历史文化遗迹而著称。山中有古寺庙、石刻、碑林等文化景观，是一个集自然风光和人文景观于一体的旅游胜地。

7. **锦州笔架山风景名胜区**
   - 笔架山位于锦州市，以其独特的山形和丰富的文化内涵而闻名。山上有古寺庙、石刻、碑林等文化景观，是一个集自然风光和人文景观于一体的旅游胜地。

8. **盘锦红海滩国家风景廊道**
   - 红海滩位于盘锦市，是世界上最大的湿地之一，以其独特的红色碱蓬草景观而闻名。每年秋季，碱蓬草变红，形成壮观的红色海滩，吸引了大量游客前来观赏。

这些5A级旅游景区各具特色，既有自然风光的壮丽，也有历史文化的深厚底蕴，是辽宁省旅游的重要名片。`

// md文件渲染
DDXaiUtil.renderMarkdown = (content: any) => {
  const md = markdownit({ html: true, breaks: true });
  let renderNode: any;
  if (content.indexOf('```markdown') > -1) {
    let contentTmp = content.replace('```markdown', '').replace('```', '')
    renderNode = <Typography>
      <div dangerouslySetInnerHTML={{ __html: md.render(contentTmp) }} />
    </Typography>
  } else {
    // renderNode = <div>{content} &&&&&&&&</div>
    renderNode = <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
  }
  return renderNode;
};


// md文件渲染
// DDXaiUtil.renderMarkdown = ({ loading, content, role, reasoning_content, attachments }: any) => {
//   const md = markdownit({ html: true, breaks: true });
//   let renderNode: any;
//   if (role === 'user') {
//     let attachmentsNode: any;
//     if (attachments?.length > 0) {
//       let ccc = [];
//       for (let i = 0; i < attachments.length; i++) {
//         ccc.push(<Attachments.FileCard key={1} item={{
//           uid: i + '',
//           name: attachments[i].name,
//           size: attachments[i].size,
//         }} />);
//       }
//       attachmentsNode = <div><Space>{ccc}</Space></div>
//     }
//     let newContent = content?.replace(/\{\{\{[\s\S]*?\}\}\}/g, '');
//     renderNode = <div className='d_question_wrap'>
//       {attachmentsNode}
//       <div className='d_question'>{newContent}</div>
//     </div>;
//   } else if (content?.indexOf('```markdown') > -1) {
//     let contentTmp = content.replace('```markdown', '').replace('```', '')
//     renderNode = <Typography>
//       <div dangerouslySetInnerHTML={{ __html: md.render(contentTmp) }} />
//     </Typography>
//   } else {
//     let reasoningContentNode: any;
//     const items: any = [
//       { key: '1', label: loading ? <>嗯 思考中...<LoadingOutlined style={{marginLeft: '8px'}}/></> : '思考完成' , children: <div className='d_xai_reason_wrap' dangerouslySetInnerHTML={{ __html: md.render(reasoning_content || '') }} />, className: 'd_xai_collapse_item', },
//     ];
//     reasoningContentNode = <Collapse ghost items={items} defaultActiveKey={['1']} className='d_xai_collapse'/>;
//     renderNode = <div>
//       {reasoningContentNode}
//       <div className="markdown_wrap" dangerouslySetInnerHTML={{ __html: md.render(content || '') }} />
//     </div>
//   }
//   return <div>
//     {renderNode}
//   </div>;
// };

const splitIntoChunks = (str: string, chunkSize: number) => {
  const chunks = [];
  for (let i = 0; i < str.length; i += chunkSize) {
    chunks.push(str.slice(i, i + chunkSize));
  }
  return chunks;
};

export const mockFetch = async (fullContent: string, onFinish?: () => void) => {
  const chunks = splitIntoChunks(fullContent, 7);
  const response = new Response(
    new ReadableStream({
      async start(controller) {
        try {
          await new Promise((resolve) => setTimeout(resolve, 100));
          for (const chunk of chunks) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            if (!controller.desiredSize) {
              // 流已满或关闭，避免写入
              return;
            }
            controller.enqueue(new TextEncoder().encode(chunk));
          }
          onFinish?.();
          controller.close();
        } catch (error) {
          console.log(error);
        }
      },
    }),
    {
      headers: {
        'Content-Type': 'application/x-ndjson',
      },
    },
  );

  return response;
};

export const useMarkdownTheme = () => {
  const token = theme.useToken();
  // 使用 Ant Design 的主题系统判断亮色还是暗色
  const isLightMode = React.useMemo(() => {
    return token?.theme?.id === 0;
  }, [token]);
  const className = React.useMemo(() => {
    return isLightMode ? 'x-markdown-light' : 'x-markdown-dark';
  }, [isLightMode]);
  return [className];
};

export const getPrompt = (themeDescription: string) => {
  return `
  你是一个 Ant Design V6 主题设计师，需要根据用户需求如下示例节点的颜色主题 JSON。
  要求：
  1. 严格遵循 Ant Design V6 的 token 结构
  2. 仅输入与主题颜色的全量节点（所有 color和xxxBg）。margin、padding、font、motion等节点无需生成
  3. 值必须是合法的 CSS 变量（如 #1890ff）
  4. 不要添加额外字段，不要解释，只输出 JSON
  5. 节点中的darkAlgorithm字段为是否开启暗色算法标识，取值true或false
  6. Ant Design V6主题规范：https://ant.design/docs/react/customize-theme
  7. Lanyout主题规范：https://procomponents.ant.design/components/layout#pagecontainer-demo-token
  8. JSON中的token节点内额外增加cusBgLayout节点，取值与layoutToken.bgLayout相同
  9. 增加tagName节点，用于描述适配当前主题的名称，10个字以内
  10. 增加tagRemark节点，用于描述适配当前主题的描述，30个字以内

  用户需求：<userReq>${themeDescription}</userReq>

  输出结构包含完善节点如下，token中不需要额外节点：
  {
    "darkAlgorithm": false,
    "layoutToken": {
      "bgLayout": "#ffffff",
      "header": {
        "colorBgHeader": "#ffffff",
        "colorHeaderTitle": "#ffffff",
        "colorTextMenu": "#ffffff",
        "colorTextMenuActive": "#ffffff",
        "colorTextMenuSelected": "#ffffff",
        "colorBgMenuItemHover": "#ffffff",
        "colorBgMenuItemSelected": "#ffffff"
      }
      "sider": {
        "colorMenuBackground": "#ffffff",
        "colorTextMenuTitle": "#ffffff",
        "colorMenuItemDivider": "#ffffff",
        "colorTextMenu": "#ffffff",
        "colorTextMenuSecondary": "#ffffff",
        "colorTextMenuSelected": "#ffffff",
        "colorTextMenuActive": "#ffffff",
        "colorTextMenuItemHover": "#ffffff",
        "colorBgMenuItemActive": "#ffffff",
        "colorBgMenuItemHover": "#ffffff",
        "colorBgMenuItemSelected": "#ffffff",
        "colorBgMenuItemCollapsedElevated": "#ffffff",
        "colorBgCollapsedButton": "#ffffff",
        "colorTextCollapsedButton": "#ffffff",
        "colorTextCollapsedButtonHover": "#ffffff"
      }
    },
    "token": {
      "colorInfo": "#ffffff",
      "colorLink": "#ffffff",
      "colorPrimary": "#ffffff",
      "colorError": "#ffffff",
      "colorWarning": "#ffffff",
      "colorSuccess": "#ffffff",
      "colorBgBase": "#ffffff",
      "colorLinkActive": "#ffffff"	,
      "colorLinkHover": "#ffffff"	,
      "colorInfoText": "#ffffff",
      "colorBorder": "#ffffff",
      "colorBorderSecondary": "#ffffff",
      "colorFillQuaternary": "#ffffff",
      "colorBgContainer": "#ffffff",
      "colorBgElevated": "#ffffff",
      "colorText": "#ffffff",
      "cusBgLayout": "#ffffff",
      "cusBg1": "#ffffff"
    },
    "components": {
      "Menu": {
        "subMenuItemSelectedColor": "#ffffff",
        "itemActiveBg": "#ffffff"
      },
      "Tag": {
        "defaultBg": "#ffffff",
        "colorBorder": "#ffffff",
        "colorInfo": "#ffffff",
        "colorInfoBorder": "#ffffff",
        "colorWarning": "#ffffff",
        "colorWarningBorder": "#ffffff",
        "colorSuccess": "#ffffff",
        "colorSuccessBorder": "#ffffff",
        "colorError": "#ffffff",
        "colorErrorBorder": "#ffffff",
        "colorErrorBg": "#ffffff"
      },
      "Drawer": {
        "colorBgElevated": "#ffffff"
      },
      "Button": {
        "colorText": "#ffffff",
        "colorBorder": "#ffffff",
        "dangerColor":"#ffffff",
        "dashedBgDisabled":"#ffffff",
        "defaultActiveBg":"#ffffff",
        "defaultActiveBorderColor":"#ffffff",
        "defaultActiveColor":"#ffffff",
        "defaultBg":"#ffffff",
        "defaultBgDisabled":"#ffffff",
        "defaultBorderColor":"#ffffff",
        "defaultColor":"#ffffff",
        "defaultGhostBorderColor":"#ffffff",
        "defaultGhostColor":"#ffffff",
        "defaultHoverBg":"#ffffff",
        "defaultHoverBorderColor":"#ffffff",
        "defaultHoverColor":"#ffffff",
        "groupBorderColor":"#ffffff",
        "primaryColor":"#ffffff",
        "solidTextColor":"#ffffff",
        "textHoverBg":"#ffffff",
        "textTextActiveColor":"#ffffff",
        "textTextColor":"#ffffff",
        "textTextHoverColor":"#ffffff"
      },
      "Modal": {
        "contentBg": "#ffffff",
        "footerBg": "#ffffff",
        "headerBg": "#ffffff",
        "titleColor": "#ffffff"
      },
      "Card": {
        "actionsBg": "#ffffff",
        "extraColor": "#ffffff",
        "headerBg": "#ffffff"
      },
      "Table": {
        "bodySortBg": "#ffffff",
        "borderColor": "#ffffff",
        "expandIconBg": "#ffffff",
        "filterDropdownBg": "#ffffff",
        "filterDropdownMenuBg": "#ffffff",
        "fixedHeaderSortActiveBg": "#ffffff",
        "footerBg": "#ffffff",
        "footerColor": "#ffffff",
        "headerBg": "#ffffff",
        "headerColor": "#ffffff",
        "headerFilterHoverBg": "#ffffff",
        "headerSortActiveBg": "#ffffff",
        "headerSortHoverBg": "#ffffff",
        "headerSplitColor": "#ffffff",
        "rowExpandedBg": "#ffffff",
        "rowHoverBg": "#ffffff",
        "rowSelectedBg": "#ffffff",
        "rowSelectedHoverBg": "#ffffff",
        "stickyScrollBarBg": "#ffffff"
      }
    }
  }
  `
}

export default DDXaiUtil;
