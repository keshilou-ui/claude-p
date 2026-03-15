/**
 * 智能 Prompt 重构函数
 * 将口语化的语音转录文本清洗、分句、结构化为可用的 AI 编程 Prompt
 *
 * TODO: 未来可替换为真实 LLM API 调用以获得更好的语义理解
 * @param {string} transcript - 语音转录文本
 * @returns {string} 结构化 Prompt
 */
export function generatePrompt(transcript) {
  const trimmed = transcript.trim()
  if (!trimmed) return ''

  // 1. 清洗：去除口语化填充词和语气词
  const cleaned = cleanSpeech(trimmed)

  // 2. 分句：按语义连接词拆分为独立需求点
  const segments = splitIntoSegments(cleaned)

  // 3. 润色：每条需求规范化表达
  const polished = segments.map(s => polishSegment(s))

  // 4. 组装为结构化 Prompt
  return buildPrompt(polished)
}

/**
 * 去除口语填充词、语气词、重复词
 */
function cleanSpeech(text) {
  const fillers = [
    // 语气词 / 填充词
    /(?:^|(?<=\s))(嗯|啊|呃|额|那个|就是说|怎么说呢|对吧|你知道吗|反正就是|基本上就是|大概就是)(?:\s|$|(?=[，。]))/g,
    // 重复的标点
    /[，。、]{2,}/g,
    // 多余空格
    /\s+/g,
  ]

  let result = text
  for (const pattern of fillers) {
    result = result.replace(pattern, '')
  }
  return result.trim()
}

/**
 * 按中文口语连接词拆分为语义段落
 */
function splitIntoSegments(text) {
  // 常见口语连接词作为分隔符
  const splitters = /(?:然后|还有|另外|并且|同时|接着|以及|而且|还要|再就是|最后|首先|其次|第一|第二|第三|还需要|我还想|我还要|我希望|我想要|我想|我要|我需要|对了)/g

  // 先在连接词前插入分隔标记
  const marked = text.replace(splitters, '\n$&')

  // 按标记拆分
  const raw = marked.split('\n').map(s => s.trim()).filter(s => s.length > 0)

  // 如果没有拆分出来（整段话没有连接词），就把整段作为一条
  if (raw.length <= 1) {
    return addPunctuation(text) ? [addPunctuation(text)] : [text]
  }

  return raw.map(s => {
    // 去掉句首的连接词，使每条需求独立
    return s.replace(/^(?:然后|还有|另外|并且|同时|接着|以及|而且|还要|再就是|最后|首先|其次|对了)\s*/g, '')
  }).filter(s => s.length > 0)
}

/**
 * 润色单条需求：补标点、首字母规范
 */
function polishSegment(segment) {
  let s = segment.trim()

  // 去掉开头的"我想/我要/我希望/我需要"等主语，让需求更简洁直接
  s = s.replace(/^(?:我想要?|我要|我希望(?:能(?:够)?)?|我需要|我觉得应该|需要)\s*/g, '')

  // 补句末标点
  s = addPunctuation(s)

  // 首字大写（如果是英文开头）
  if (/^[a-z]/.test(s)) {
    s = s[0].toUpperCase() + s.slice(1)
  }

  return s
}

/**
 * 如果句末没有标点，补上句号
 */
function addPunctuation(text) {
  if (!text) return text
  const last = text[text.length - 1]
  if (/[。！？.!?；;]/.test(last)) return text
  return text + '。'
}

/**
 * 将润色后的需求列表组装为结构化 Prompt
 */
function buildPrompt(requirements) {
  const reqList = requirements
    .map((r, i) => `${i + 1}. ${r}`)
    .join('\n')

  return `## 需求描述

请根据以下需求实现功能：

${reqList}

## 实现要求

- 代码简洁、可维护
- 遵循项目现有的技术栈和代码风格
- 只做需求要求的修改，不要过度设计`
}
