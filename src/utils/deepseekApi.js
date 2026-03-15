const SYSTEM_PROMPT = `你是一个专业的 Prompt 工程师，专门将口语化的语音想法重构为结构清晰、逻辑严密的 AI 编程 Prompt。

规则：
1. 理解用户口述中的核心意图，忽略语气词和重复表达
2. 将杂乱的描述整理为结构化的需求文档
3. 输出格式使用 Markdown，包含：需求描述、技术要求、实现要点
4. 保持简洁，不要添加用户没有提到的功能
5. 使用中文输出`

/**
 * 调用 DeepSeek API 优化 Prompt
 * @param {string} transcript - 语音转录文本
 * @param {string} apiKey - DeepSeek API Key
 * @returns {Promise<string>} 优化后的 Prompt
 */
export async function optimizeWithDeepSeek(transcript, apiKey) {
  const res = await fetch('/api/deepseek/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `请将以下语音转录内容重构为结构化的 AI 编程 Prompt：\n\n${transcript}` },
      ],
      temperature: 0.3,
      max_tokens: 2048,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `API 请求失败 (${res.status})`)
  }

  const data = await res.json()
  return data.choices[0].message.content
}
