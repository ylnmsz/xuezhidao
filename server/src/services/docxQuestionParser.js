import fs from 'fs'
import { Buffer } from 'buffer'
import os from 'os'
import path from 'path'
import { randomUUID } from 'crypto'
import { spawnSync } from 'child_process'
import AdmZip from 'adm-zip'
import config from '../config.js'

const questionImagesDir = path.resolve('uploads', 'questions')
const docxUploadsDir = path.resolve('uploads', 'docx')

const ensureQuestionImageDir = () => {
  fs.mkdirSync(questionImagesDir, { recursive: true })
}

const ensureDocxUploadDir = () => {
  fs.mkdirSync(docxUploadsDir, { recursive: true })
}

const buildPrompt = (text, extraRules = '') => {
  const parts = []
  parts.push(
    '你是一个专业的题库解析器。把试卷文本逐题抽取为 JSON 数组，只输出 JSON（不要 Markdown / 代码块 / 多余文字）。',
  )

  parts.push('')
  parts.push('【全局规则】')
  parts.push('- 输出: JSON 数组，每项一个题目对象。键名统一使用 camelCase。')
  parts.push('- LaTeX 反斜杠必须双写: \\\\frac{1}{2}，\\\\text，\\\\sqrt，\\\\boxed 等。')
  parts.push('- 保留原文换行格式，[img:URL] 占位符必须完整保留，不得删除或修改。')
  parts.push('- 若题目无法解析，type 设为 "其他" 或 "简答题"，stem 放原文。')
  parts.push('- subject 枚举: 语文 | 数学 | 英语 | 物理 | 化学 | 生物 | 历史 | 政治 | 地理')
  parts.push('- grade 枚举: 一年级~六年级 | 初一~初三 | 高一~高三')
  parts.push('  无法判断的 subject/grade 填空字符串 ""。')
  parts.push('- difficulty: 1-5 整数，默认 3。')
  parts.push('')

  parts.push('【题型模板（公共字段省略: subject/grade/difficulty）】')
  parts.push('')
  parts.push('单选题 / 多选题 / 判断题 / 填空题 / 问答题 / 简答题 / 其他:')
  parts.push('{ "type": "<题型名>", "stem": "题干", "stemWithImages": "带 [img:] 的原文", "stemImageUrl": "",')
  parts.push('  "options": [{"text":"选项文本","imageUrl":""}], "optionsWithImages": [...], "optionImages": [...],')
  parts.push('  "answer": "参考答案", "explanation": "解析" }')
  parts.push('')
  parts.push('翻译题:')
  parts.push('{ "type": "翻译题", "stem": "原文", "direction": "zh_to_en|en_to_zh", "sentences": [...], "answer": "译文", "explanation": "" }')
  parts.push('')
  parts.push('改错题:')
  parts.push('{ "type": "改错题", "stem": "含错原文", "errorCount": 10, "corrections": [{"lineOrPos":"","wrong":"","correct":"","explanation":""}], "answer": "", "explanation": "" }')
  parts.push('')

  parts.push('【复合题 / 含子题大题（极重要）】')
  parts.push('- 大题内含多个子题（阅读理解/完形填空/材料分析/配对等），必须输出为 **一个** 对象，用 subQuestions: [...] 存子题。')
  parts.push('- 严禁把子题作为独立顶层对象输出（会导致重复）。')
  parts.push('- 阅读理解: passage 存材料正文, subQuestions 存子题。多篇文章每篇独立一个对象，题号对应。')
  parts.push('- 完形填空: stem 存含空格段落, subQuestions 存每道选择子题。')
  parts.push('- 连线题: pairs: [{left,right}] 存配对关系。')
  parts.push('- 复合填空/问答: stem 存主题干, subQuestions 存子问。')
  parts.push('')
  parts.push('【数学问答题含多小问——极其重要】')
  parts.push('- 识别要点：题干后跟 (1)(2)(3) 或 （1）（2）（3）或 ①②③ 等编号子问，共享同一个题干背景。')
  parts.push('- 必须输出为 **一个** 问答题对象，stem 存主题干，subQuestions 存子问。严禁拆成多个独立顶层对象。')
  parts.push('- 子题中每个小问的 type 可以是"问答题""填空题""简答题"等，视小问实际内容而定。')
  parts.push('')
  parts.push('数学问答题（含多小问）示例：')
  parts.push('{')
  parts.push('  "type": "问答题",')
  parts.push('  "stem": "已知函数 f(x)=x³-3x+1\\n（1）求 f(x) 的单调区间\\n（2）求 f(x) 在 [-2,2] 上的最大值\\n（3）证明 当 x>1 时 f(x)>-1",')
  parts.push('  "subQuestions": [')
  parts.push('    { "type": "问答题", "stem": "（1）求 f(x) 的单调区间", "answer": "(-∞,-1)和(1,+∞)递增，(-1,1)递减", "explanation": "" },')
  parts.push('    { "type": "问答题", "stem": "（2）求 f(x) 在 [-2,2] 上的最大值", "answer": "f(2)=3", "explanation": "" },')
  parts.push('    { "type": "问答题", "stem": "（3）证明当 x>1 时 f(x)>-1", "answer": "略", "explanation": "" }')
  parts.push('  ],')
  parts.push('  "subject": "数学", "grade": "高三", "difficulty": 4')
  parts.push('}')
  parts.push('')
  parts.push('⚠ 注意区分：')
  parts.push('- ✅ 正确：若一道大题下有 (1)(2)(3) 三个子问 → 输出一个问答题含 subQuestions')
  parts.push('- ❌ 错误：若 text 中含有数学公式/方程组/不等式组但后面跟的是另一道完全独立的题（非子问编号）→ 输出为独立题目，不要合并。')
  parts.push('  判断标准：子问必须是 (1)(2)(3) 或 （1）（2）（3）或 ①②③ 这样的编号，且共享同一个题干背景。')
  parts.push('')
  parts.push('⚠ 填空题 / 问答题关键区别（极其重要）：')
  parts.push('- ❌ 错误：含(1)(2)(3)多小问的数学大题、含数据表格的统计题 → 归类为"填空题"')
  parts.push('- ✅ 正确：含(1)(2)(3)多小问的数学大题 → 归类为"问答题"，subQuestions 存小问')
  parts.push('- 只要题中有多个子问(1)(2)(3)、有数据表格/统计附表、或多个子步骤 → 就是"问答题"。"填空题"仅用于独立的单空题（如____上直接填结论/数值）。')
  parts.push('- 注意：即使题干中有"填写""计算""求"等动词，也不改变题型。含有表格+多问的统计题是问答题，不是填空题。')
  parts.push('')
  parts.push('⚠ 答案对照表（如"1 D 2 B 3 A"）直接忽略，不要解析为题。')
  parts.push('')

  parts.push('【数学编号命题选择题——极重要】')
  parts.push('- 数学题中常见模式：题干给出用 ①②③④ 编号的若干命题（陈述句），最后问"其中所有真命题的编号是（）"或"下列说法正确的是（）"等。')
  parts.push('- 这种题目 = 多选题。输出 type 为 "多选题"，stem 保留全部命题文本，options 列表放入各组合选项。')
  parts.push('- 重中之重：①②③④ 不是子题编号，是命题标号，严禁拆入 subQuestions。')
  parts.push('- 示例：')
  parts.push('{')
  parts.push('  "type": "多选题",')
  parts.push('  "stem": "设 α、β 是两个平面，m、n 是两条直线，给出下列四个命题：\\\\n①若 m∥n，则 n∥α 或 n∥β\\\\n②若 m⊥n，则 n⊥α,n⊥β\\\\n③若 n//α，且 n//β，则 m//n\\\\n④若 n 与 α 和 β 所成的角相等，则 m⊥n\\\\n其中所有真命题的编号是（）",')
  parts.push('  "options": [{"text":"①③"},{"text":"②④"},{"text":"①②③"},{"text":"①③④"}],')
  parts.push('  "answer": "①③④",')
  parts.push('  "explanation": ""')
  parts.push('}')
  parts.push('')

  if (extraRules && extraRules.trim()) {
    parts.push('【补充要求】')
    parts.push(extraRules)
    parts.push('')
  }

  parts.push('【文档内容】')
  parts.push('"""')
  parts.push(text)
  parts.push('"""')
  parts.push('仅输出 JSON 数组。')

  return parts.join('\n')
}

const callOpenAI = async (payload, retries = 2) => {
  if (!config.openaiApiKey) {
    throw new Error('OPENAI_API_KEY is not configured')
  }

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 120000) // 2 min per call
      const response = await fetch(`${config.openaiBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.openaiApiKey}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        // Rate limit or 5xx — retry with backoff
        if (attempt < retries && (response.status === 429 || response.status >= 500)) {
          const wait = Math.min(2000 * 2 ** attempt, 10000)
          console.log(`[LLM] retry ${attempt + 1}/${retries} after ${wait}ms (status ${response.status})`)
          await sleep(wait)
          continue
        }
        throw new Error(`OpenAI request failed: ${errorText}`)
      }

      return response.json()
    } catch (err) {
      if (attempt < retries && (err.name === 'AbortError' || err.type === 'system' || err.code === 'ECONNRESET')) {
        const wait = Math.min(2000 * 2 ** attempt, 10000)
        console.log(`[LLM] retry ${attempt + 1}/${retries} after ${wait}ms (${err.message})`)
        await sleep(wait)
        continue
      }
      throw err
    }
  }
}

/**
 * Walk a parsed JSON tree and restore LaTeX commands that were corrupted
 * by JSON.parse interpreting escape sequences as control characters.
 *
 * JSON.parse interprets \f as form-feed (0x0C) and \b as backspace (0x08),
 * which destroys common LaTeX commands like \frac{}{}.
 *
 * Wrapped in try-catch for defensive safety.
 */
const restoreLatexFromParsed = (value) => {
  try {
    if (typeof value === 'string') {
      return value
        .replace(/\x0C/g, '\\f') // form-feed → \f  (LaTeX: \frac)
        .replace(/\x08/g, '\\b') // backspace → \b  (LaTeX: \textbf etc.)
        .replace(/\x00/g, '') // null bytes (no LaTeX use)
    }
    if (Array.isArray(value)) return value.map(restoreLatexFromParsed)
    if (value && typeof value === 'object' && value.constructor === Object) {
      const result = {}
      for (const [key, val] of Object.entries(value)) {
        result[key] = restoreLatexFromParsed(val)
      }
      return result
    }
    return value
  } catch (err) {
    console.error('[restoreLatexFromParsed] error:', err, 'value type:', typeof value)
    return value
  }
}

const tryParseJson = (content) => {
  const trimmed = content.trim()
  const withoutFences = trimmed
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim()
  const arrayCandidate = extractJsonArray(withoutFences)
  const looseArrayCandidate = extractJsonArrayLoose(withoutFences)
  const candidates = [trimmed, withoutFences, arrayCandidate, looseArrayCandidate].filter(Boolean)

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate)
      return restoreLatexFromParsed(parsed)
    } catch {
      // Continue to regex extraction below.
    }
  }

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(sanitizeJsonNewlines(candidate))
      return restoreLatexFromParsed(parsed)
    } catch {
      // Continue to regex extraction below.
    }
  }

  for (const candidate of candidates) {
    try {
      const normalized = fixInvalidJsonBackslashes(
        escapeControlChars(sanitizeJsonNewlines(candidate)),
      )
      const parsed = JSON.parse(normalized)
      return restoreLatexFromParsed(parsed)
    } catch {
      // Continue to regex extraction below.
    }
  }

  for (const candidate of candidates) {
    try {
      const normalized = bruteForceEscapeBackslashes(
        escapeControlChars(sanitizeJsonNewlines(candidate)),
      )
      const parsed = JSON.parse(normalized)
      return restoreLatexFromParsed(parsed)
    } catch {
      // Continue to regex extraction below.
    }
  }

  // Try to extract a balanced JSON array (handles nested objects and ignores
  // brackets inside strings). Fallback to loose regex if that fails.
  try {
    const arrSlice =
      extractFirstJsonArray(withoutFences) || withoutFences.match(/\[\s*\{[\s\S]*\}\s*\]/)?.[0]
    if (arrSlice) {
      try {
        return restoreLatexFromParsed(JSON.parse(arrSlice))
      } catch {
        // try sanitized parse
        try {
          return restoreLatexFromParsed(JSON.parse(sanitizeJsonNewlines(arrSlice)))
        } catch {
          // fallthrough to single-object extraction
        }
      }
    }
  } catch {
    // ignore and continue to single-object fallback
  }

  const single = extractFirstJsonObject(withoutFences)
  if (!single) return null
  try {
    const normalized = fixInvalidJsonBackslashes(escapeControlChars(single))
    const parsed = JSON.parse(normalized)
    return restoreLatexFromParsed(Array.isArray(parsed) ? parsed : [parsed])
  } catch {
    try {
      const normalized = bruteForceEscapeBackslashes(escapeControlChars(single))
      const parsed = JSON.parse(normalized)
      return restoreLatexFromParsed(Array.isArray(parsed) ? parsed : [parsed])
    } catch {
      return null
    }
  }
}

const extractJsonArray = (content) => {
  const start = content.indexOf('[')
  const end = content.lastIndexOf(']')
  if (start === -1 || end === -1 || end <= start) return null
  return content.slice(start, end + 1).trim()
}

const extractJsonArrayLoose = (content) => {
  const start = content.indexOf('[')
  const end = content.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) return null
  let slice = content.slice(start, end + 1).trim()
  if (!slice.startsWith('[')) return null
  if (!slice.endsWith(']')) {
    slice += ']'
  }
  slice = slice.replace(/,\s*\]$/, ']')
  return slice
}

const sanitizeJsonNewlines = (content) => {
  let inString = false
  let escaped = false
  let out = ''

  for (let i = 0; i < content.length; i += 1) {
    const ch = content[i]
    if (escaped) {
      out += ch
      escaped = false
      continue
    }
    if (ch === '\\') {
      out += ch
      escaped = true
      continue
    }
    if (ch === '"') {
      inString = !inString
      out += ch
      continue
    }
    if (inString && (ch === '\n' || ch === '\r')) {
      out += '\\n'
      continue
    }
    out += ch
  }

  return out
}

const fixInvalidJsonBackslashes = (content) => {
  // NOTE: 'b' (backspace) and 'f' (form-feed) are excluded because they
  // conflict with common LaTeX commands: \frac, \textbf, \boxed, etc.
  // JSON.parse would interpret \f as 0x0C (form-feed) and \b as 0x08
  // (backspace), destroying LaTeX. By NOT treating them as valid escapes,
  // we double the backslash so JSON.parse produces the literal \f / \b.
  const validEscapes = new Set(['"', '\\', '/', 'n', 'r', 't', 'u'])
  let inString = false
  let escaped = false
  let out = ''

  for (let i = 0; i < content.length; i += 1) {
    const ch = content[i]
    if (escaped) {
      out += ch
      escaped = false
      continue
    }
    if (ch === '\\') {
      const next = content[i + 1]
      if (inString) {
        if (!next || !validEscapes.has(next)) {
          out += '\\\\'
          continue
        }
        if (next === 'u') {
          const hex = content.slice(i + 2, i + 6)
          if (!/^[0-9a-fA-F]{4}$/.test(hex)) {
            out += '\\\\'
            continue
          }
        }
      }
      out += ch
      escaped = true
      continue
    }
    if (ch === '"') {
      inString = !inString
      out += ch
      continue
    }
    out += ch
  }

  return out
}

const escapeControlChars = (content) => {
  let out = ''
  for (let i = 0; i < content.length; i += 1) {
    const ch = content[i]
    const code = ch.charCodeAt(0)
    if (code >= 0x20 || ch === '\n' || ch === '\r' || ch === '\t') {
      out += ch
      continue
    }
    out += `\\u${code.toString(16).padStart(4, '0')}`
  }
  return out
}

const bruteForceEscapeBackslashes = (content) => {
  if (!content) return content
  // 'b' and 'f' excluded because they conflict with LaTeX (\frac, \textbf, etc.)
  return content.replace(/\\(?!["\\/nrtu])/g, '\\\\')
}

const extractFirstJsonObject = (content) => {
  let inString = false
  let escaped = false
  let depth = 0
  let start = -1

  for (let i = 0; i < content.length; i += 1) {
    const ch = content[i]
    if (escaped) {
      escaped = false
      continue
    }
    if (ch === '\\') {
      escaped = true
      continue
    }
    if (ch === '"') {
      inString = !inString
      continue
    }
    if (inString) continue
    if (ch === '{') {
      if (depth === 0) start = i
      depth += 1
      continue
    }
    if (ch === '}') {
      depth -= 1
      if (depth === 0 && start !== -1) {
        return content.slice(start, i + 1)
      }
    }
  }
  return null
}

const extractFirstJsonArray = (content) => {
  let inString = false
  let escaped = false
  let depth = 0
  let start = -1

  for (let i = 0; i < content.length; i += 1) {
    const ch = content[i]
    if (escaped) {
      escaped = false
      continue
    }
    if (ch === '\\') {
      escaped = true
      continue
    }
    if (ch === '"') {
      inString = !inString
      continue
    }
    if (inString) continue
    if (ch === '[') {
      if (depth === 0) start = i
      depth += 1
      continue
    }
    if (ch === ']') {
      depth -= 1
      if (depth === 0 && start !== -1) {
        return content.slice(start, i + 1)
      }
    }
  }
  return null
}

const splitSections = (text) => {
  const sections = []
  const regex = /(^|\n)([一二三四五六七八九十]+、[^\n]+)/g
  const matches = []
  let match
  while ((match = regex.exec(text))) {
    const start = match.index + (match[1] ? match[1].length : 0)
    matches.push({ index: start, title: match[2].trim() })
  }
  if (matches.length === 0) return sections
  for (let i = 0; i < matches.length; i += 1) {
    const start = matches[i].index
    const end = matches[i + 1]?.index ?? text.length
    sections.push({ title: matches[i].title, content: text.slice(start, end).trim() })
  }
  return sections
}

const getSectionByKeyword = (text, keyword) => {
  const sections = splitSections(text)
  const found = sections.find((section) => section.title.includes(keyword))
  return found?.content || ''
}

const stripTrailingAnswerAppendix = (text) => {
  const source = String(text || '')
  if (!source.trim()) return source

  const looksAnswerLikeTail = (tailText) => {
    const lines = String(tailText || '')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 220)
    if (!lines.length) return false

    const answerKeywordCount = lines.filter((line) =>
      /(答案|解析|参考译文|参考答案|答案与解析|key|answer\s*key|explanation)/i.test(line),
    ).length

    const numberedAnswerLikeCount = lines.filter((line) => {
      if (!/^\d{1,3}\s*[.、)]/.test(line)) return false
      if (/^\d{1,3}\s*[.、)]\s*[A-D](?:\b|\s|[,，、;；])/i.test(line)) return true
      if (/^\d{1,3}\s*[.、)]\s*[A-Za-z].{2,}$/i.test(line)) return true
      if (/^\d{1,3}\s*[.、)]\s*.+[:：].{1,}$/i.test(line)) return true
      return false
    }).length

    return answerKeywordCount >= 2 || numberedAnswerLikeCount >= 4
  }

  // Pattern 1: explicit heading like "参考答案", "答案与解析" …
  const appendixRegex =
    /(^|\n)\s*(?:[一二三四五六七八九十]+、\s*)?(?:参考答案|答案与解析|参考解析|试题答案|答案|解析|answer\s*key|keys?)\s*[:：]?\s*(?=\n|$)/gi
  const headingMatches = Array.from(source.matchAll(appendixRegex))

  // Pattern 2: answer-key table without a heading.
  // Look for a run of ≥4 consecutive lines that contain ONLY digits, spaces, and A-D letters.
  // Only scan the latter 55% of the document to avoid false positives in question text.
  let answerKeyStart = -1
  const cutoff2 = Math.floor(source.length * 0.45)
  const tail2 = source.slice(cutoff2)
  const lines2 = tail2.split('\n')
  const ansRe = /^[\d\s.、）()ABCD,，]+$/i
  let run = 0
  let runStartLineIdx = -1
  for (let li = 0; li < lines2.length; li++) {
    const trimmed = lines2[li].trim()
    if (!trimmed) {
      run = 0
      runStartLineIdx = -1
      continue
    }
    if (ansRe.test(trimmed) && trimmed.length >= 2) {
      if (run === 0) runStartLineIdx = li
      run++
      if (run >= 4 && runStartLineIdx >= 0) {
        // compute character offset within tail2
        let charOffset = 0
        for (let x = 0; x < runStartLineIdx; x++) charOffset += lines2[x].length + 1
        answerKeyStart = cutoff2 + charOffset
        break
      }
    } else {
      run = 0
      runStartLineIdx = -1
    }
  }

  const cutoff = Math.floor(source.length * 0.2)
  const target = headingMatches.find((match) => {
    if (match.index < cutoff) return false
    const tail = source.slice(match.index)
    const tailNumberedCount = (tail.match(/(^|\n)\s*\d{1,3}\s*[.、)]/g) || []).length
    return tailNumberedCount >= 3 || looksAnswerLikeTail(tail)
  })

  // Use whichever cut point comes first (heading or answer-key table)
  let cutIndex = -1
  if (target) cutIndex = target.index
  if (answerKeyStart >= cutoff && (cutIndex < 0 || answerKeyStart < cutIndex)) {
    cutIndex = answerKeyStart
  }
  if (cutIndex < 0) return source

  const tail = source.slice(cutIndex)
  const tailNumberedCount = (tail.match(/(^|\n)\s*\d{1,3}\s*[.、)]/g) || []).length
  if (tailNumberedCount < 3 && tail.length < 180 && !looksAnswerLikeTail(tail)) return source

  const sliced = source.slice(0, cutIndex).trim()
  return sliced || source
}

/**
 * Split a section that may contain multiple reading passages (A / B / C labels)
 * into sub-chunks, one per passage, so each LLM call only sees one passage and
 * cannot mix up which questions belong to which text.
 *
 * Detection: look for standalone passage label lines such as:
 *   - "A", "B", "C"  (only that letter on the line)
 *   - "(A)", "(B)", "(C)"
 *   - "Passage A", "Passage B"
 *   - "第一篇", "第二篇", "材料一", "材料二"
 * We require ≥2 such labels that are at least 5 lines apart, each followed by
 * ≥100 chars of content, to avoid false positives.
 */
/**
 * Detect and split multiple reading passages within a single section.
 *
 * Strategy 1 – Explicit label lines (A / B / C, Passage A, 第一篇, 材料一, …).
 * Strategy 2 – Content-based: a reading passage section always follows the pattern
 *   [prose block] → [numbered questions] → [prose block] → [numbered questions]
 *   The start of the 2nd+ prose block (≥200 chars, after ≥2 question lines) is a
 *   passage boundary.  This handles documents without any explicit A/B/C labels.
 */
const splitReadingPassagesWithinSection = (sectionText) => {
  const source = String(sectionText || '').trim()
  if (!source) return [source]

  const lines = source.split('\n')

  // ── Strategy 1: explicit passage-label lines ──────────────────────────────
  const LABEL_RE =
    /^[（(]?[A-C][）)]\s*$|^[A-C]\s*$|^[Pp]assage\s+[A-C]|^第[一二三四五六]篇|^材料[一二三四五六]/
  const labelIdxs = lines.reduce((acc, l, i) => {
    if (LABEL_RE.test(l.trim())) acc.push(i)
    return acc
  }, [])

  if (labelIdxs.length >= 2) {
    const prefix = labelIdxs[0] > 0 ? lines.slice(0, labelIdxs[0]).join('\n').trim() : ''
    const chunks = labelIdxs
      .map((startIdx, k) => {
        const endIdx = k + 1 < labelIdxs.length ? labelIdxs[k + 1] : lines.length
        let chunk = lines.slice(startIdx, endIdx).join('\n').trim()
        if (k === 0 && prefix) chunk = `${prefix}\n\n${chunk}`
        return chunk
      })
      .filter(Boolean)
    if (chunks.length >= 2) return chunks
  }

  // ── Strategy 2: content-based passage-boundary detection ─────────────────
  // Classify each line as 'Q' (question), 'O' (option A/B/C/D), or 'P' (prose/other).
  const classify = (l) => {
    const t = l.trim()
    if (!t) return 'B' // blank
    if (/^\d{1,3}\s*[.、)]/.test(t)) return 'Q'
    if (/^[A-D]\s*[.、)]\s*.{1,}/.test(t)) return 'O'
    return 'P'
  }
  const classified = lines.map(classify)

  const splitPoints = [] // line indices where a new passage begins
  let qCount = 0 // question lines seen since last prose block
  let i = 0

  while (i < lines.length) {
    const cl = classified[i]

    if (cl === 'Q') {
      qCount++
      i++
      continue
    }

    if (cl === 'O' || cl === 'B') {
      i++
      continue
    }

    // cl === 'P': accumulate this prose run
    let j = i
    let proseLen = 0
    while (j < lines.length && (classified[j] === 'P' || classified[j] === 'B')) {
      proseLen += lines[j].trim().length
      j++
    }

    // If we've seen ≥2 question lines before this prose block and it is
    // substantial (≥200 chars), treat it as the start of a new passage.
    if (qCount >= 2 && proseLen >= 200) {
      splitPoints.push(i)
      qCount = 0
    }

    i = j // skip entire prose run
  }

  if (splitPoints.length === 0) return [source]

  const chunks = []
  let prev = 0
  for (const sp of splitPoints) {
    const chunk = lines.slice(prev, sp).join('\n').trim()
    if (chunk) chunks.push(chunk)
    prev = sp
  }
  chunks.push(lines.slice(prev).join('\n').trim())

  const valid = chunks.filter((c) => c.trim())
  return valid.length >= 2 ? valid : [source]
}

const chunkTextBySections = (text, maxLen = 30000) => {
  const sections = splitSections(text)
  if (sections.length === 0) {
    // No section headers found: try reading-passage split first, then question-number split.
    const passageChunks = splitReadingPassagesWithinSection(text)
    if (passageChunks.length > 1) return passageChunks
    if (text.length <= maxLen) {
      return [text]
    }
    const byQuestions = splitByQuestionNumbers(text)
    if (byQuestions.length > 1) {
      return byQuestions
    }
    const chunks = []
    for (let i = 0; i < text.length; i += maxLen) {
      chunks.push(text.slice(i, i + maxLen))
    }
    return chunks
  }

  // Keep one section per chunk by default to avoid cross-section question mixing.
  const chunks = []
  sections.forEach((section) => {
    const content = String(section.content || '').trim()
    if (!content) return

    // If the section contains multiple reading passages, split by passage label
    // BEFORE checking length – even short sections with 2 passages must be split.
    const passageChunks = splitReadingPassagesWithinSection(content)
    if (passageChunks.length > 1) {
      passageChunks.forEach((chunk) => {
        if (chunk.length <= maxLen) {
          chunks.push(chunk)
        } else {
          for (let i = 0; i < chunk.length; i += maxLen) {
            chunks.push(chunk.slice(i, i + maxLen))
          }
        }
      })
      return
    }

    if (content.length <= maxLen) {
      chunks.push(content)
      return
    }
    const byQuestions = splitByQuestionNumbers(content)
    if (byQuestions.length > 1) {
      chunks.push(...byQuestions)
      return
    }
    for (let i = 0; i < content.length; i += maxLen) {
      chunks.push(content.slice(i, i + maxLen))
    }
  })

  // Merge adjacent small chunks to reduce LLM calls.
  // If two consecutive chunks are both under 15K chars and fit within maxLen, combine them.
  const merged = []
  for (const chunk of chunks) {
    const last = merged[merged.length - 1]
    if (last && last.length < 15000 && chunk.length < 15000 && (last.length + chunk.length) <= maxLen) {
      merged[merged.length - 1] = `${last}\n\n${chunk}`
    } else {
      merged.push(chunk)
    }
  }
  return merged.length ? merged : [text]
}

const splitByQuestionNumbers = (text, maxChars = 6000, maxQuestions = 6) => {
  const source = String(text || '')
  const markerRegex = /(^|\n)\s*(\d{1,3})\s*[.、)]\s*/g
  const markers = []
  let match
  while ((match = markerRegex.exec(source))) {
    const start = match.index + (match[1] ? match[1].length : 0)
    markers.push({ start, num: Number(match[2] || 0) })
  }

  if (markers.length <= 1) {
    return [source]
  }

  const lead = source.slice(0, markers[0].start).trim()
  const blocks = []
  for (let i = 0; i < markers.length; i += 1) {
    const start = markers[i].start
    const end = markers[i + 1]?.start ?? source.length
    blocks.push(source.slice(start, end).trim())
  }

  // Detect if a block looks like a long reading passage (no leading option letters, length > 200)
  const isPassageBlock = (block) => {
    const stripped = block.replace(/^\d+[.、)]\s*/, '').trim()
    return stripped.length > 200 && !/^\s*[A-H]\s*[.、)]/m.test(stripped.slice(0, 80))
  }

  const chunks = []
  let current = lead ? `${lead}\n\n` : ''
  let qCount = 0

  for (let bi = 0; bi < blocks.length; bi += 1) {
    const block = blocks[bi]
    const candidate = current ? `${current}\n\n${block}` : block
    const exceedQuestions = qCount >= maxQuestions
    const exceedChars = candidate.length > maxChars

    // If this block is a reading passage, never cut mid-passage:
    // keep collecting until we hit the hard char limit (20000).
    if (isPassageBlock(block)) {
      if (current.trim() && (exceedQuestions || exceedChars) && candidate.length > 20000) {
        chunks.push(current.trim())
        current = lead ? `${lead}\n\n${block}` : block
        qCount = 1
      } else {
        current = candidate
        qCount += 1
      }
      continue
    }

    if ((exceedQuestions || exceedChars) && current.trim()) {
      chunks.push(current.trim())
      current = lead ? `${lead}\n\n${block}` : block
      qCount = 1
    } else {
      current = candidate
      qCount += 1
    }
  }

  if (current.trim()) {
    chunks.push(current.trim())
  }

  return chunks.length ? chunks : [source]
}

const getNormalizedType = (value) => {
  const raw = String(value || '').toLowerCase()
  if (raw.includes('cloze') || raw.includes('完形')) return '完形填空'
  if (raw.includes('single') || raw.includes('单选')) return '单选题'
  if (raw.includes('multi') || raw.includes('multiple') || raw.includes('多选'))
    return '多选题'
  if (raw.includes('reading') || raw.includes('阅读')) return '阅读理解'
  if (raw.includes('true') || raw.includes('false') || raw.includes('判断'))
    return '判断题'
  if (raw.includes('fill') || raw.includes('blank') || raw.includes('填空'))
    return '填空题'
  if (raw.includes('short_answer') || raw.includes('short') || raw.includes('简答'))
    return '简答题'
  if (raw.includes('essay') || raw.includes('问答')) return '问答题'
  if (raw.includes('matching') || raw.includes('连线')) return '连线题'
  if (raw.includes('translation') || raw.includes('翻译')) return '翻译题'
  if (raw.includes('error_correction') || raw.includes('改错')) return '改错题'
  if (raw.includes('programming') || raw.includes('编程')) return '编程题'
  if (raw.includes('poem') || raw.includes('dictation') || raw.includes('古诗') || raw.includes('默写'))
    return '古诗默写'
  return raw || '其他'
}

const normalizeCompareText = (value) =>
  String(value || '')
    .replace(/\[img:[^\]]+\]/g, '')
    .replace(/^\s*[（(]?\d+[）).、]?\s*/g, '')
    .replace(/^\s*[①②③④⑤⑥⑦⑧⑨⑩]\s*/g, '')
    .replace(/\s+/g, '')
    .toLowerCase()

const buildChildSignature = (item) => {
  if (!item) return ''
  const type = getNormalizedType(item.type)
  const stem = normalizeCompareText(
    item.stemWithImages || item.stem || item.passageWithImages || item.passage || '',
  )
  const options = Array.isArray(item.optionsWithImages)
    ? item.optionsWithImages
    : Array.isArray(item.options)
      ? item.options.map((opt) => (opt && typeof opt === 'object' ? opt.text : opt))
      : []
  const optionsText = options
    .map((opt) => normalizeCompareText(opt))
    .filter(Boolean)
    .join('|')
  return `${type}::${stem}::${optionsText}`
}

const parseInlineChoiceOptions = (value) => {
  const source = String(value || '')
  const marker = /[A-D]\s*[.、)]/g
  const firstIndex = source.search(marker)
  const stem = firstIndex > 0 ? source.slice(0, firstIndex).trim() : ''
  const matches = Array.from(
    source.matchAll(/([A-D])\s*[.、)]\s*([\s\S]*?)(?=(?:\s+[A-D]\s*[.、)]\s*)|$)/g),
  )
  if (matches.length < 2) {
    return { stem: source.trim(), options: [] }
  }
  return {
    stem,
    options: matches.map((m) => String(m[2] || '').trim()).filter(Boolean),
  }
}

const extractClozeSubQuestionsFromItem = (item) => {
  if (!item) return []
  if (Array.isArray(item.subQuestions) && item.subQuestions.length) {
    return item.subQuestions.map((sq) => normalizeItemImages(sq))
  }

  if (getNormalizedType(item.type) === '填空题') {
    const stemText = String(item.stemWithImages || item.stem || '').trim()
    if (stemText) {
      return [
        normalizeItemImages({
          ...item,
          type: '填空题',
          stem: stemText,
        }),
      ]
    }
  }

  const stemText = String(item.stemWithImages || item.stem || '')
  const numberSplit = stemText.split(/(?:^|\n)\s*(\d{1,3})\s*[.、)]\s*/g)
  const result = []

  if (numberSplit.length >= 3) {
    for (let i = 1; i < numberSplit.length; i += 2) {
      const qNo = String(numberSplit[i] || '').trim()
      const body = String(numberSplit[i + 1] || '').trim()
      if (!body) continue
      const extracted = extractOptionsFromText(body)
      const fallback = extracted.options.length >= 2 ? extracted : parseInlineChoiceOptions(body)
      if (!fallback.options.length) continue
      result.push(
        normalizeItemImages({
          type: '单选题',
          stem: qNo || fallback.stem || body,
          options: fallback.options,
          answer: '',
          explanation: '',
        }),
      )
    }
    if (result.length) return result
  }

  const extracted = extractOptionsFromText(stemText)
  const fallback = extracted.options.length >= 2 ? extracted : parseInlineChoiceOptions(stemText)
  if (fallback.options.length >= 2) {
    return [
      normalizeItemImages({
        type: '单选题',
        stem: fallback.stem || stemText,
        options: fallback.options,
        answer: String(item.answer || '').trim(),
        explanation: String(item.explanation || '').trim(),
      }),
    ]
  }

  return []
}

const isLikelyClozePassageItem = (item) => {
  if (!item) return false
  const text = String(item.stemWithImages || item.stem || '')
  if (text.length < 160) return false
  const blankMarkerCount = (
    text.match(/\b\d{1,3}\s*[.、)]\s*(?:[_＿(]|\w)|_{2,}|\(\s*\d+\s*\)/g) || []
  ).length
  const optionMarkerCount = (text.match(/\b[A-D]\s*[.、)]/g) || []).length
  const sentencePuncCount = (text.match(/[。！？.!?]/g) || []).length
  const hasPassageShape = sentencePuncCount >= 1 && text.split(/\n+/).length >= 2
  const hasChildren = Array.isArray(item.subQuestions) && item.subQuestions.length > 0
  return (
    (hasPassageShape && blankMarkerCount >= 2 && optionMarkerCount <= 8) ||
    (hasChildren && hasPassageShape && optionMarkerCount <= 4)
  )
}

const isLikelyClozeOptionChunk = (item) => {
  if (!item) return false
  const t = getNormalizedType(item.type)
  if (!['完形填空', '单选题', '多选题', '填空题'].includes(t)) return false
  const text = String(item.stemWithImages || item.stem || '')
  if (!text || text.length > 1600) return false
  if (t === '填空题' && text.length <= 80) return true
  if (Array.isArray(item.options) && item.options.length >= 2) return true
  if (/\d{1,3}\s*[.、)]\s*A\s*[.、)]/i.test(text)) return true
  return /\bA\s*[.、)]\s*.+\bB\s*[.、)]/i.test(text)
}

const isLikelyReadingPassageItem = (item) => {
  if (!item) return false
  const text = String(
    item.passageWithImages || item.passage || item.stemWithImages || item.stem || '',
  )
  if (text.length < 120) return false

  // ── Reject math-heavy content ──
  // If the text contains equations, inequalities, or math problem patterns,
  // it's NOT a reading passage even if it has paragraph-like length.
  const mathIndicators = /[=≥≤≠∫∑∏√∞∂∇]|\\frac|\\sqrt|\\sum|_\{|\^\{|\\begin\{|约束条件|方程组|不等式|已知|求证|求.*的值|求.*范围|则.*的最小|满足.*条件/s
  if (mathIndicators.test(text)) return false

  // ── Reject content with proposition labels (e.g. ①②③④ statements
  //     in a math geometry problem, asking "其中所有真命题的编号是..." ──
  if (/[①-⑩].{0,40}其中.{0,40}(?:真命题|假命题|命题|编号|说法|正确)/s.test(text)) return false

  // ── Reject 问答题 with sub-questions (math word problems are not reading passages) ──
  const normType = getNormalizedType(item.type)
  if (normType === '问答题' && Array.isArray(item.subQuestions) && item.subQuestions.length > 0) return false

  const hasChildren = Array.isArray(item.subQuestions) && item.subQuestions.length > 0
  const optionMarkerCount = (text.match(/\b[A-D]\s*[.、)]/g) || []).length
  const sentencePuncCount = (text.match(/[。！？.!?]/g) || []).length
  const hasPassageShape =
    (text.split(/\n+/).length >= 2 || sentencePuncCount >= 1) && optionMarkerCount <= 3
  return (
    ((!!item.passage || !!item.passageWithImages) && hasPassageShape) ||
    (hasChildren && hasPassageShape) ||
    hasPassageShape
  )
}

const isLikelyPassageBoundaryItem = (item) => {
  if (!item) return false
  const text = String(
    item.passageWithImages || item.passage || item.stemWithImages || item.stem || '',
  )
  if (text.length < 100) return false
  // Reject math-heavy content (same logic as isLikelyReadingPassageItem)
  if (/[=≥≤≠∫∑∏√∞∂∇]|\\frac|\\sqrt|\\sum|_\{|\^\{|约束条件|方程组|不等式|已知|求证/.test(text)) return false
  // Reject proposition label patterns (e.g. ①②③④ as statements)
  if (/[①-⑩].{0,40}其中.{0,40}(?:真命题|假命题|命题|编号|说法|正确)/s.test(text)) return false
  // 问答题 with sub-questions is not a passage boundary
  if (getNormalizedType(item.type) === '问答题' && Array.isArray(item.subQuestions) && item.subQuestions.length > 0) return false
  const optionMarkerCount = (text.match(/\b[A-D]\s*[.、)]/g) || []).length
  const sentencePuncCount = (text.match(/[。！？.!?]/g) || []).length
  return sentencePuncCount >= 1 && optionMarkerCount <= 1
}

const extractLeadingQuestionNo = (item) => {
  const text = String(item?.stemWithImages || item?.stem || '').trim()
  const m = text.match(/^(?:[（(])?(\d{1,3})(?:[）)])?\s*[.、)]?/) || text.match(/\b(\d{1,3})\b/)
  return m ? Number(m[1]) : null
}

const countForwardMatches = (source, startIndex, matcher, stopMatcher, limit = 8) => {
  let count = 0
  for (let i = startIndex; i < source.length && i < startIndex + limit; i += 1) {
    const item = source[i]
    if (!item) continue
    if (stopMatcher && stopMatcher(item)) break
    if (matcher(item)) count += 1
  }
  return count
}

const isLikelyReadingChildItem = (item) => {
  if (!item) return false
  const t = getNormalizedType(item.type)
  if (
    ![
      '单选题',
      '多选题',
      '判断题',
      '填空题',
      '问答题',
      '其他',
      '简答题',
    ].includes(t)
  ) {
    return false
  }
  const text = String(item.stemWithImages || item.stem || '')
  if (!text || text.length > 900) return false
  const numbered = /^(\s*\d+\s*[.、)]|\s*[（(]?\d+[）)]\s*|\s*[①-⑩])/m.test(text)
  const questionish = /[?？]|_{2,}|\b(which|what|who|where|when|why|how|true|false)\b/i.test(text)
  return (
    numbered || questionish || Array.isArray(item.options) || Array.isArray(item.optionsWithImages)
  )
}

const mergeReadingCompoundItems = (items) => {
  const source = Array.isArray(items) ? items : []
  const merged = []
  const consumed = new Set()

  for (let i = 0; i < source.length; i += 1) {
    if (consumed.has(i)) continue
    const current = source[i]
    if (!current) continue

    const looksLikeReadingParent =
      isLikelyReadingPassageItem(current) &&
      (Array.isArray(current.subQuestions) && current.subQuestions.length
        ? true
        : countForwardMatches(
            source,
            i + 1,
            (item) => isLikelyReadingChildItem(item),
            (item) => isLikelyReadingPassageItem(item) || isLikelyClozePassageItem(item),
            10,
          ) >= 2)

    if (!looksLikeReadingParent) {
      merged.push(current)
      continue
    }

    const subQuestions = Array.isArray(current.subQuestions)
      ? current.subQuestions.map((sq) => normalizeItemImages(sq))
      : []
    const seen = new Set(subQuestions.map((sq) => buildChildSignature(sq)).filter(Boolean))

    let lastNo = null
    for (let j = i + 1; j < source.length && j < i + 12; j += 1) {
      if (consumed.has(j)) continue
      const cand = source[j]
      if (!cand) continue
      if (
        isLikelyReadingPassageItem(cand) ||
        isLikelyClozePassageItem(cand) ||
        isLikelyPassageBoundaryItem(cand)
      )
        break
      if (!isLikelyReadingChildItem(cand)) {
        if (subQuestions.length) break
        continue
      }

      const candNo = extractLeadingQuestionNo(cand)
      if (candNo != null && lastNo != null) {
        if (candNo < lastNo || candNo - lastNo > 5) break
      }

      const normalizedCand = normalizeItemImages(cand)
      const signature = buildChildSignature(normalizedCand)
      if (signature && seen.has(signature)) {
        consumed.add(j)
        continue
      }

      subQuestions.push(normalizedCand)
      if (signature) seen.add(signature)
      if (candNo != null) lastNo = candNo
      consumed.add(j)
    }

    merged.push(
      subQuestions.length
        ? {
            ...current,
            type: '阅读理解',
            passage: current.passage || current.stem || '',
            passageWithImages:
              current.passageWithImages ||
              current.stemWithImages ||
              current.passage ||
              current.stem ||
              '',
            subQuestions,
          }
        : current,
    )
  }

  return merged
}

const mergeClozeCompoundItems = (items) => {
  const source = Array.isArray(items) ? items : []
  const merged = []
  const consumed = new Set()

  for (let i = 0; i < source.length; i += 1) {
    if (consumed.has(i)) continue
    const current = source[i]
    if (!current) continue

    const looksLikeClozeParent =
      isLikelyClozePassageItem(current) &&
      (Array.isArray(current.subQuestions) && current.subQuestions.length
        ? true
        : countForwardMatches(
            source,
            i + 1,
            (item) => isLikelyClozeOptionChunk(item),
            (item) => isLikelyReadingPassageItem(item) || isLikelyClozePassageItem(item),
            12,
          ) >= 2)

    if (!looksLikeClozeParent) {
      merged.push(current)
      continue
    }

    const subQuestions = Array.isArray(current.subQuestions)
      ? current.subQuestions.map((sq) => normalizeItemImages(sq))
      : []
    const seen = new Set(subQuestions.map((sq) => buildChildSignature(sq)).filter(Boolean))

    let lastNo = null
    for (let j = i + 1; j < source.length && j < i + 14; j += 1) {
      if (consumed.has(j)) continue
      const cand = source[j]
      if (!cand) continue
      if (
        isLikelyClozePassageItem(cand) ||
        isLikelyReadingPassageItem(cand) ||
        isLikelyPassageBoundaryItem(cand)
      )
        break
      if (!isLikelyClozeOptionChunk(cand)) {
        if (subQuestions.length) break
        continue
      }

      const candNo = extractLeadingQuestionNo(cand)
      if (candNo != null && lastNo != null) {
        if (candNo < lastNo || candNo - lastNo > 6) break
      }

      const extracted = extractClozeSubQuestionsFromItem(cand)
      if (extracted.length) {
        extracted.forEach((sq) => {
          const signature = buildChildSignature(sq)
          if (signature && seen.has(signature)) return
          subQuestions.push(sq)
          if (signature) seen.add(signature)
          const sqNo = extractLeadingQuestionNo(sq)
          if (sqNo != null) lastNo = sqNo
        })
        consumed.add(j)
      } else if (subQuestions.length) {
        break
      }
    }

    if (subQuestions.length) {
      merged.push({ ...current, type: '完形填空', subQuestions })
    } else {
      merged.push(current)
    }
  }

  return merged
}

const stripClozeOptionLinesFromStem = (item) => {
  if (!item || getNormalizedType(item.type) !== '完形填空') return item
  if (!Array.isArray(item.subQuestions) || item.subQuestions.length === 0) return item
  const raw = String(item.stemWithImages || item.stem || '')
  if (!raw) return item
  const lines = raw.split(/\n+/)
  const kept = lines.filter((line) => {
    const text = String(line || '').trim()
    if (!text) return true
    // Remove option-only lines like: 16. A. sing B. dance C. talk D. teach
    if (/^\d{1,3}\s*[.、)]\s*A\s*[.、)]/i.test(text)) return false
    if (/^A\s*[.、)]\s*.+\s+B\s*[.、)]/i.test(text)) return false
    return true
  })
  const cleaned = kept.join('\n').trim()
  if (!cleaned || cleaned === raw) return item
  return {
    ...item,
    stemWithImages: cleaned,
    stem: extractImagesFromText(cleaned).text,
  }
}

const pruneDuplicatedStandaloneChildren = (items) => {
  const source = Array.isArray(items) ? items : []
  const output = []
  const consumed = new Set()

  for (let i = 0; i < source.length; i += 1) {
    if (consumed.has(i)) continue
    let current = source[i]
    if (!current) continue
    current = stripClozeOptionLinesFromStem(current)

    const isCompound =
      (getNormalizedType(current.type) === '阅读理解' ||
        getNormalizedType(current.type) === '完形填空') &&
      Array.isArray(current.subQuestions) &&
      current.subQuestions.length > 0

    if (!isCompound) {
      output.push(current)
      continue
    }

    const childSigs = new Set(
      current.subQuestions
        .map((sq) => buildChildSignature(normalizeItemImages(sq)))
        .filter(Boolean),
    )
    const childNos = new Set(
      current.subQuestions
        .map((sq) => extractLeadingQuestionNo(sq))
        .filter((n) => typeof n === 'number' && Number.isFinite(n)),
    )

    for (let j = i + 1; j < source.length && j < i + 24; j += 1) {
      if (consumed.has(j)) continue
      const cand = source[j]
      if (!cand) continue
      if (
        isLikelyPassageBoundaryItem(cand) ||
        isLikelyReadingPassageItem(cand) ||
        isLikelyClozePassageItem(cand)
      ) {
        break
      }
      const sig = buildChildSignature(normalizeItemImages(cand))
      const no = extractLeadingQuestionNo(cand)
      if ((sig && childSigs.has(sig)) || (no != null && childNos.has(no))) {
        consumed.add(j)
      }
    }

    output.push(current)
  }

  return output
}

const rebalanceReadingSequentialQuestions = (items) => {
  const source = Array.isArray(items) ? items.map((it) => ({ ...it })) : []
  const readingIndexes = []
  for (let i = 0; i < source.length; i += 1) {
    const it = source[i]
    if (!it) continue
    if (getNormalizedType(it.type) === '阅读理解' && Array.isArray(it.subQuestions)) {
      readingIndexes.push(i)
    }
  }

  const getQuestionNos = (subQuestions) =>
    (Array.isArray(subQuestions) ? subQuestions : [])
      .map((sq) => extractLeadingQuestionNo(sq))
      .filter((n) => typeof n === 'number' && Number.isFinite(n))

  for (let k = 1; k < readingIndexes.length; k += 1) {
    const prevIdx = readingIndexes[k - 1]
    const currIdx = readingIndexes[k]
    const prev = source[prevIdx]
    const curr = source[currIdx]
    if (!prev || !curr) continue

    const prevSubs = Array.isArray(prev.subQuestions) ? [...prev.subQuestions] : []
    const currSubs = Array.isArray(curr.subQuestions) ? [...curr.subQuestions] : []
    if (prevSubs.length === 0 || currSubs.length < 3) continue

    const prevNos = getQuestionNos(prevSubs)
    const currNos = getQuestionNos(currSubs)
    if (!prevNos.length || !currNos.length) continue

    const prevMax = prevNos[prevNos.length - 1]
    const currFirst = currNos[0]
    if (currFirst !== prevMax + 1) continue
    if (prevSubs.length > 2) continue

    let expected = prevMax + 1
    let moveCount = 0
    const maxMove = Math.max(1, Math.min(4, currSubs.length - 2))
    while (moveCount < currSubs.length && moveCount < maxMove) {
      const no = extractLeadingQuestionNo(currSubs[moveCount])
      if (no == null || no !== expected) break
      moveCount += 1
      expected += 1
    }

    if (moveCount <= 0) continue
    prev.subQuestions = prevSubs.concat(currSubs.slice(0, moveCount))
    curr.subQuestions = currSubs.slice(moveCount)
  }

  return source
}

const extractImagesFromText = (value) => {
  const images = []
  const text = String(value || '').replace(/\[img:([^\]]+)\]/g, (_, url) => {
    images.push(url)
    return ' '
  })
  return { text: text.replace(/\s{2,}/g, ' ').trim(), images }
}

const extractOptionsFromText = (value) => {
  const source = String(value || '').trim()
  if (!source) return { stem: '', options: [] }

  const lines = source.split(/\n+/)
  const optionsMap = new Map()
  const stemLines = []
  for (const line of lines) {
    const match = line.match(/^\s*([A-H])\s*[.、)]\s*(.+)$/)
    if (match) {
      optionsMap.set(match[1], match[2].trim())
    } else {
      stemLines.push(line)
    }
  }

  if (optionsMap.size >= 2) {
    const options = Array.from(optionsMap.keys())
      .sort()
      .map((key) => optionsMap.get(key))
    return { stem: stemLines.join('\n').trim(), options }
  }

  const inlineRegex = /\b([A-H])\s*[.、)]\s*([\s\S]*?)(?=\b[A-H]\s*[.、)]|$)/g
  const inlineMap = new Map()
  let match
  while ((match = inlineRegex.exec(source))) {
    inlineMap.set(match[1], match[2].trim())
  }
  if (inlineMap.size >= 2) {
    const options = Array.from(inlineMap.keys())
      .sort()
      .map((key) => inlineMap.get(key))
    return { stem: source.replace(inlineRegex, '').trim(), options }
  }

  return { stem: source, options: [] }
}

const splitStemSections = (value) => {
  const text = String(value || '')
  const markers = Array.from(text.matchAll(/(答案|解析)\s*[:：]/g))
  if (!markers.length) return { stem: text.trim(), answer: '', explanation: '' }

  const stem = text.slice(0, markers[0].index).trim()
  let answer = ''
  let explanation = ''
  markers.forEach((marker, index) => {
    const start = marker.index + marker[0].length
    const end = markers[index + 1]?.index ?? text.length
    const content = text.slice(start, end).trim()
    if (marker[1] === '答案' && !answer) answer = content
    if (marker[1] === '解析' && !explanation) explanation = content
  })
  return { stem, answer, explanation }
}

const normalizeItemImages = (item) => {
  const typeValue = getNormalizedType(item?.type)
  const isChoice = typeValue === '单选题' || typeValue === '多选题'

  const sectioned = splitStemSections(item?.stem || '')
  let stemRaw = sectioned.stem
  const fallbackAnswer = sectioned.answer
  const fallbackExplanation = sectioned.explanation

  let optionsRaw = Array.isArray(item?.options) ? item.options : []
  let optionImages = Array.isArray(item?.optionImages) ? [...item.optionImages] : []
  let optionsWithImages = optionsRaw.map((option) =>
    typeof option === 'object' ? option?.text || '' : option,
  )

  const normalizedOptions = optionsWithImages.map((textValue, index) => {
    const option = optionsRaw[index]
    const imageValue = typeof option === 'object' ? option?.imageUrl || '' : ''
    const extracted = extractImagesFromText(textValue)
    if (!optionImages[index]) {
      optionImages[index] = imageValue || extracted.images[0] || ''
    }
    return extracted.text
  })

  const hasOptions = normalizedOptions.some((option) => String(option || '').trim())
  if (isChoice && !hasOptions) {
    const extracted = extractOptionsFromText(stemRaw)
    if (extracted.options.length >= 2) {
      stemRaw = extracted.stem
      optionsRaw = extracted.options
      optionsWithImages = extracted.options
      optionImages = []
    }
  }

  const stemExtracted = extractImagesFromText(stemRaw)
  const stemImageUrl = item?.stemImageUrl || stemExtracted.images[0] || ''

  const nextOptions = optionsWithImages.map((textValue, index) => {
    const option = optionsRaw[index]
    const imageValue = typeof option === 'object' ? option?.imageUrl || '' : ''
    const extracted = extractImagesFromText(textValue)
    if (!optionImages[index]) {
      optionImages[index] = imageValue || extracted.images[0] || ''
    }
    return extracted.text
  })

  const normalizedItem = {
    ...item,
    stem: stemExtracted.text,
    stemWithImages: stemRaw,
    stemImageUrl,
    options: nextOptions,
    optionsWithImages,
    optionImages: nextOptions.map((_, index) => optionImages[index] || ''),
    answer: item?.answer || fallbackAnswer || '',
    explanation: item?.explanation || fallbackExplanation || '',
  }

  // Normalize nested structures for complex types (e.g., reading_comprehension)
  if (Array.isArray(item?.subQuestions)) {
    normalizedItem.subQuestions = item.subQuestions.map((sq) => normalizeItemImages(sq))
  }

  // Normalize blanks/填空结构为统一数组形式
  if (Array.isArray(item?.blanks)) {
    normalizedItem.blanks = item.blanks.map((b) => {
      if (b && typeof b === 'object') {
        return { ...b, answer: String(b.answer || '').trim() }
      }
      return String(b || '').trim()
    })
  }

  return normalizedItem
}

/**
 * Detect if numbered markers (①②③④ or (1)(2)(3)(4)) in text are proposition
 * labels within a SINGLE question (e.g., a math multiple-choice where ①②③④
 * are statements to evaluate), rather than sub-question markers.
 *
 * Indicators of proposition labels:
 * 1. Markers are circled numbers (①-⑩)
 * 2. After the last marker, the text asks about which propositions are correct
 *    (e.g. "其中所有真命题的编号是（）")
 *
 * When this returns true, splitEmbeddedSubQuestions should NOT split the item.
 */
const isPropositionLabelPattern = (text, markers) => {
  if (!text || !Array.isArray(markers) || markers.length < 2) return false

  // Must have circled numbers
  const circledCount = markers.filter((m) => {
    const ch = text[m.index]
    return ch >= '①' && ch <= '⑩'
  }).length
  if (circledCount < markers.length * 0.5) return false

  // Check text after the last marker for a proposition-evaluation question
  const lastMarkerEnd = markers[markers.length - 1].index + 1
  const afterLast = text.slice(lastMarkerEnd).trim()
  if (!/(其中|下列|上述).{0,40}(真命题|假命题|命题|编号|说法|正确)/.test(afterLast)) return false

  return true
}

/**
 * If a 问答题 / 填空题 / 简答题 item has (1)(2)(3) or ①②③ patterns embedded
 * directly in its stem text, split them out into subQuestions.
 *
 * Example input stem:
 *   "已知函数 f(x)=x³-3x+1\n（1）求单调区间\n（2）求最大值\n（3）证明..."
 *
 * After split:
 *   stem: "已知函数 f(x)=x³-3x+1"
 *   subQuestions: [
 *     { type: "问答题", stem: "（1）求单调区间" },
 *     { type: "问答题", stem: "（2）求最大值" },
 *     { type: "问答题", stem: "（3）证明..." },
 *   ]
 */
const splitEmbeddedSubQuestions = (item) => {
  if (!item) return item
  // If LLM already created subQuestions but type is still "填空题", fix the type.
  if (Array.isArray(item.subQuestions) && item.subQuestions.length > 0) {
    if (getNormalizedType(item.type) === '填空题') {
      console.log('[splitEmbeddedSubQuestions] converting 填空题 with subQuestions to 问答题')
      return { ...item, type: '问答题' }
    }
    return item
  }

  const raw = String(item.stemWithImages || item.stem || '').trim()
  if (!raw) return item

  // Match (1)(2)(3) / （1）（2）（3） / ①②③ patterns
  // Require at least 2 numbered markers in the text to qualify as compound
  const subMarkerRe = /[（(](\d+)[）)]|[①-⑨⑴-⑹]/g
  const markers = []
  let m
  while ((m = subMarkerRe.exec(raw)) !== null) {
    markers.push({ index: m.index, num: Number(m[1] || (m[0].charCodeAt(0) - 0x2460 + 1)) })
  }

  if (markers.length < 2) return item

  // Check if markers are proposition labels (e.g. ①②③④ as statements
  // in a math multiple-choice question) — do NOT split if so.
  if (isPropositionLabelPattern(raw, markers)) return item

  // Determine the parent stem: everything before the first (1)
  const firstMarkerIndex = markers[0].index
  const parentStem = raw.slice(0, firstMarkerIndex).trim()
  if (!parentStem) return item
  if (parentStem.length < 8) return item // too short to be a real parent stem

  // Extract each sub-question text
  const subItems = []
  for (let i = 0; i < markers.length; i += 1) {
    const start = markers[i].index
    const end = markers[i + 1]?.index ?? raw.length
    const subText = raw.slice(start, end).trim()
    if (!subText) continue
    subItems.push({
      type: item.type,
      stem: subText,
      answer: '',
      explanation: '',
      options: [],
      optionImages: [],
    })
  }

  if (subItems.length < 2) return item

  // Remove the numbered sub-question lines from the parent stem text that goes into stemWithImages
  const subRegex = new RegExp(
    markers.map((mark) => raw.slice(mark.index, (mark.index + 8)).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
    'g',
  )
  const stemWithImagesCleaned = raw.replace(subRegex, '').replace(/\n{3,}/g, '\n\n').trim()

  return {
    ...item,
    type: '问答题',
    stem: parentStem,
    stemWithImages: stemWithImagesCleaned || parentStem,
    subQuestions: subItems,
  }
}

const writeDataImage = (dataUrl) => {
  const match = dataUrl.match(/^data:(image\/[-\w.+]+);base64,(.+)$/i)
  if (!match) return null
  const mime = match[1].toLowerCase()
  const data = match[2]
  const extMap = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
  }
  const ext = extMap[mime] || '.png'
  imageCounter += 1
  const uniqueTag = `${Date.now()}-${imageCounter}-${randomUUID()}`
  const fileName = `mineru-${uniqueTag}${ext}`
  const filePath = path.join(questionImagesDir, fileName)
  fs.writeFileSync(filePath, Buffer.from(data, 'base64'))
  return `/uploads/questions/${fileName}`
}

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

const mapWithConcurrency = async (items, limit, mapper) => {
  if (!Array.isArray(items) || items.length === 0) return []
  const safeLimit = Math.max(1, Math.min(limit || 1, items.length))
  const results = new Array(items.length)
  let cursor = 0

  const workers = Array.from({ length: safeLimit }, async () => {
    while (cursor < items.length) {
      const index = cursor
      cursor += 1
      results[index] = await mapper(items[index], index)
    }
  })

  await Promise.all(workers)
  return results
}

const saveDocxToUploads = (buffer, originalName = 'upload.docx') => {
  ensureDocxUploadDir()
  const safeExt = path.extname(originalName || '').toLowerCase() || '.docx'
  const fileName = `docx-${Date.now()}-${randomUUID()}${safeExt}`
  const filePath = path.join(docxUploadsDir, fileName)
  fs.writeFileSync(filePath, buffer)
  return {
    filePath,
    fileName,
  }
}

const buildMinerUBatchPayload = (fileName) => {
  return {
    files: [{ name: fileName }],
    model_version: config.mineruModelVersion || 'vlm',
  }
}

const callMinerUApplyUpload = async (fileName) => {
  if (!config.mineruApiUrl) {
    throw new Error('MINERU_API_URL is not configured')
  }
  if (!config.mineruApiToken) {
    throw new Error('MINERU_API_TOKEN is not configured')
  }
  const payload = buildMinerUBatchPayload(fileName)
  const response = await fetch(config.mineruApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.mineruApiToken}`,
    },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`MinerU request failed: ${errorText}`)
  }
  return response.json()
}

const resolveMinerUBatchUpload = (payload) => {
  const data = payload?.data || payload
  const batchId = data?.batch_id
  const fileUrls = data?.file_urls
  if (!batchId || !Array.isArray(fileUrls) || fileUrls.length === 0) {
    throw new Error('MinerU upload apply response missing batch_id or file_urls')
  }
  return { batchId, uploadUrl: fileUrls[0] }
}

const uploadMinerUFile = async (uploadUrl, buffer) => {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    body: buffer,
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`MinerU upload failed: ${errorText}`)
  }
}

const pollMinerUBatchResult = async (batchId) => {
  const targetUrl = config.mineruApiResultUrl
  if (!targetUrl) {
    throw new Error('MINERU_API_RESULT_URL is not configured')
  }
  const url = `${targetUrl.replace(/\/$/, '')}/${encodeURIComponent(batchId)}`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${config.mineruApiToken}`,
    },
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`MinerU result request failed: ${errorText}`)
  }
  return response.json()
}

const waitForMinerUBatchResult = async (batchId, timeoutMs = 600000, intervalMs = 5000) => {
  const deadline = Date.now() + timeoutMs
  let lastPayload = null
  while (Date.now() < deadline) {
    const payload = await pollMinerUBatchResult(batchId)
    lastPayload = payload
    const data = payload?.data || payload
    const items = Array.isArray(data?.extract_result) ? data.extract_result : []
    const item = items[0]
    if (!item) {
      await sleep(intervalMs)
      continue
    }
    console.log('[mineru-result] state:', item.state)
    if (item.state === 'done') {
      return item
    }
    if (item.state === 'failed') {
      throw new Error(`MinerU task failed: ${item.err_msg || 'unknown error'}`)
    }
    await sleep(intervalMs)
  }
  throw new Error('MinerU task timed out')
}

const downloadZipToTemp = async (zipUrl) => {
  const response = await fetch(zipUrl, { method: 'GET' })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`MinerU zip download failed: ${errorText}`)
  }
  const buffer = Buffer.from(await response.arrayBuffer())
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mineru-zip-'))
  const zipPath = path.join(tmpDir, `result-${Date.now()}-${randomUUID()}.zip`)
  fs.writeFileSync(zipPath, buffer)
  return { zipPath, tmpDir }
}

const extractZip = (zipPath, tmpDir) => {
  const extractDir = path.join(tmpDir, 'extracted')
  fs.mkdirSync(extractDir, { recursive: true })
  const zip = new AdmZip(zipPath)
  zip.extractAllTo(extractDir, true)
  return extractDir
}

const findFileRecursive = (dir, predicate) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      const found = findFileRecursive(fullPath, predicate)
      if (found) return found
    } else if (predicate(entry.name, fullPath)) {
      return fullPath
    }
  }
  return null
}

const collectImagesFromDir = (dir) => {
  const images = []
  if (!fs.existsSync(dir)) return images
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      images.push(...collectImagesFromDir(fullPath))
    } else if (/(\.(png|jpe?g|gif|webp|svg|wmf|emf))$/i.test(entry.name)) {
      images.push(fullPath)
    }
  }
  return images
}

/**
 * Try to convert a WMF/EMF file to PNG using ImageMagick.
 * Returns the PNG buffer on success, null otherwise.
 */
const tryConvertWmfToPng = (wmfPath) => {
  const magickCmd = process.platform === 'win32' ? 'magick' : 'convert'
  const outPath = wmfPath.replace(/\.(wmf|emf)$/i, '.png')
  if (outPath === wmfPath) return null
  try {
    const args = [wmfPath, '-background', 'white', '-flatten', outPath]
    const res = spawnSync(magickCmd, args, { encoding: 'utf8', timeout: 15000 })
    if (res.status === 0 && fs.existsSync(outPath)) {
      return fs.readFileSync(outPath)
    }
  } catch {
    // ImageMagick not available
  }
  return null
}

let imageCounter = 0
const persistImagesFromZip = (extractDir) => {
  ensureQuestionImageDir()
  const imageMap = {}
  const imagePaths = collectImagesFromDir(extractDir)
  imagePaths.forEach((imagePath) => {
    const ext = path.extname(imagePath) || '.png'
    const relativePath = path.relative(extractDir, imagePath).replace(/\\/g, '/')
    const baseName = path.basename(imagePath)

    // Use a counter to guarantee uniqueness even within the same millisecond
    imageCounter += 1
    const uniqueTag = `${Date.now()}-${imageCounter}-${randomUUID()}`

    // Helper: store a key in imageMap only if not already taken (first wins)
    const mapSafe = (key, url) => {
      if (!imageMap[key]) {
        imageMap[key] = url
      }
    }

    // Try to convert WMF/EMF to PNG first
    if (/\.(wmf|emf)$/i.test(imagePath)) {
      const pngBuffer = tryConvertWmfToPng(imagePath)
      if (pngBuffer) {
        const fileName = `mineru-${uniqueTag}.png`
        const filePath = path.join(questionImagesDir, fileName)
        fs.writeFileSync(filePath, pngBuffer)
        const publicUrl = `/uploads/questions/${fileName}`
        // Map by full relative path first (most specific)
        mapSafe(relativePath, publicUrl)
        mapSafe(relativePath.replace(/\.(wmf|emf)$/i, '.png'), publicUrl)
        // Map by basename (fallback) — first wins
        mapSafe(baseName, publicUrl)
        mapSafe(`images/${baseName}`, publicUrl)
        const pngBase = baseName.replace(/\.(wmf|emf)$/i, '.png')
        if (pngBase !== baseName) {
          mapSafe(pngBase, publicUrl)
          mapSafe(`images/${pngBase}`, publicUrl)
        }
        return
      }
      // If conversion failed, save as-is
      const fileName = `mineru-${uniqueTag}${ext}`
      const filePath = path.join(questionImagesDir, fileName)
      fs.copyFileSync(imagePath, filePath)
      const publicUrl = `/uploads/questions/${fileName}`
      mapSafe(relativePath, publicUrl)
      mapSafe(baseName, publicUrl)
      mapSafe(`images/${baseName}`, publicUrl)
      return
    }

    const fileName = `mineru-${uniqueTag}${ext}`
    const filePath = path.join(questionImagesDir, fileName)
    fs.copyFileSync(imagePath, filePath)
    const publicUrl = `/uploads/questions/${fileName}`
    mapSafe(relativePath, publicUrl)
    mapSafe(baseName, publicUrl)
    mapSafe(`images/${baseName}`, publicUrl)
  })
  return imageMap
}

const readMarkdownFromZip = (extractDir) => {
  const mdPath = findFileRecursive(extractDir, (name) => name.toLowerCase() === 'full.md')
  if (!mdPath) {
    throw new Error('MinerU zip does not contain full.md')
  }
  return fs.readFileSync(mdPath, 'utf8')
}

const resolveImageUrl = (url, imageMap) => {
  const clean = url.split('#')[0].split('?')[0]
  const base = path.posix.basename(clean)
  return imageMap[clean] || imageMap[base] || imageMap[clean.replace(/^images\//, '')] || url
}

const markdownToTextWithPlaceholders = (markdown, imageMap) => {
  // 1. Remove WMF/EMF placeholder lines that MinerU inserts when it can't render WMF
  const cleaned = markdown.replace(
    /WMF placeholder[^\n]*\n?/gi,
    '',
  )

  // 2. Replace standard markdown image syntax with [img:URL] placeholders
  const withPlaceholders = cleaned.replace(/!\[[^\]]*\]\(([^)]+)\)/g, (_, src) => {
    const normalized = resolveImageUrl(src, imageMap)
    return `[img:${normalized}]`
  })
  const images = Array.from(withPlaceholders.matchAll(/\[img:([^\]]+)\]/g)).map((match) => match[1])
  return { text: withPlaceholders.trim(), images }
}

const attachImagesByOrder = (items, images, enabled) => {
  if (!enabled || !Array.isArray(images) || images.length === 0) {
    return items
  }
  let cursor = 0
  return items.map((item) => {
    const next = { ...item }
    if (!next.stemImageUrl && images[cursor]) {
      next.stemImageUrl = images[cursor++]
    }

    if (Array.isArray(next.options)) {
      const optionImages = Array.isArray(next.optionImages) ? [...next.optionImages] : []
      next.options.forEach((option, index) => {
        if (!optionImages[index] && images[cursor] && String(option || '').trim() === '') {
          optionImages[index] = images[cursor++]
        }
      })
      next.optionImages = optionImages
    }

    return next
  })
}

export const parseTextToQuestions = async (text, extraRules = '') => {
  const prompt = buildPrompt(text, extraRules)
  const completion = await callOpenAI({
    model: config.openaiModel,
    messages: [
      { role: 'system', content: 'You are a JSON question parser. Return only a valid JSON array of question objects.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.1,
    response_format: { type: 'json_object' },
  })
  // log raw completion for debugging
  try {
    console.log('[LLM prompt preview]', String(prompt || '').slice(0, 2000))
    console.log('[LLM completion raw]', JSON.stringify(completion, null, 2))
  } catch {
    console.log('[LLM debug] could not stringify completion')
  }

  const content = completion.choices?.[0]?.message?.content || ''
  const finishReason = completion.choices?.[0]?.finish_reason || ''
  console.log('[LLM content]', content)
  if (finishReason === 'length') {
    console.log('[LLM warning] completion truncated by token limit (finish_reason=length)')
  }
  const parsed = tryParseJson(content)
  let items = Array.isArray(parsed) ? parsed : null
  if (!items && parsed && typeof parsed === 'object') {
    // response_format: json_object may wrap the array in an object key
    for (const val of Object.values(parsed)) {
      if (Array.isArray(val)) { items = val; break }
    }
  }
  if (!Array.isArray(items)) {
    const preview = content.slice(0, 500)
    throw new Error(`Failed to parse model output as JSON array. Preview: ${preview}`)
  }
  return items
}

export const parseDocxToQuestions = async (buffer, originalName) => {
  const { filePath, fileName } = saveDocxToUploads(buffer, originalName)
  const applyPayload = await callMinerUApplyUpload(fileName)
  console.log('[mineru-upload] apply response:', JSON.stringify(applyPayload, null, 2))
  const { batchId, uploadUrl } = resolveMinerUBatchUpload(applyPayload)
  await uploadMinerUFile(uploadUrl, fs.readFileSync(filePath))

  const resultItem = await waitForMinerUBatchResult(batchId)
  console.log('[mineru-result] response:', JSON.stringify(resultItem, null, 2))

  if (!resultItem.full_zip_url) {
    throw new Error('MinerU result missing full_zip_url')
  }

  const { zipPath, tmpDir } = await downloadZipToTemp(resultItem.full_zip_url)
  const extractDir = extractZip(zipPath, tmpDir)
  const zipMarkdown = readMarkdownFromZip(extractDir)
  const imageMap = persistImagesFromZip(extractDir)

  const { text, images } = markdownToTextWithPlaceholders(zipMarkdown, imageMap)
  if (!text) {
    return { items: [], raw: '' }
  }

  const parsingText = stripTrailingAnswerAppendix(text)

  console.log('[docx-parse] extracted text:\n', text)
  if (parsingText !== text) {
    console.log('[docx-parse] stripped trailing answer appendix for parsing')
  }

  const chunks = chunkTextBySections(parsingText)
  console.log('[docx-parse] chunks count:', chunks.length)
  chunks.forEach((c, idx) => console.log(`[docx-parse] chunk[${idx}] preview:`, c.slice(0, 200)))
  const chunkResults = await mapWithConcurrency(chunks, 4, (chunk) => parseTextToQuestions(chunk))
  console.log(
    '[docx-parse] chunkResults lengths:',
    chunkResults.map((r) => (Array.isArray(r) ? r.length : 0)),
  )
  let items = chunkResults.flat()
  console.log('[docx-parse] items after flatten:', items.length)
  // Fallback: if LLM returned very few items but the original text contains many
  // numbered questions like "1.", "2."..., try a local heuristic parser to split them.
  const countNumbered = (parsingText.match(/(^|\n)\s*\d+\s*[.、)]/g) || []).length
  if (
    (items.length === 0 || items.every((it) => getNormalizedType(it.type) === '其他')) &&
    countNumbered >= 2
  ) {
    const fallbackItems = []
    const parts = parsingText.split(/(?:^|\n)\s*(\d+)\s*[.、)]/g)
    // split produces array like [prefix, num1, part1, num2, part2, ...]
    for (let i = 1; i < parts.length; i += 2) {
      const contentPart = parts[i + 1] || ''
      const { stem, options } = extractOptionsFromText(contentPart)
      const imagesExtracted = extractImagesFromText(contentPart)
      const item = {
        type: options.length >= 2 ? '单选题' : '简答题',
        stem: stem || imagesExtracted.text || contentPart.trim(),
        stemWithImages: contentPart.trim(),
        stemImageUrl: imagesExtracted.images[0] || '',
        options: options.length ? options : [],
        optionImages: [],
        answer: '',
        explanation: '',
        subject: '',
        grade: '',
        difficulty: 3,
      }
      fallbackItems.push(item)
    }
    if (fallbackItems.length) {
      items = fallbackItems
    }
    console.log('[docx-parse] items after fallback check:', items.length)
  }
  if (items.length === 0) {
    const choiceSection = getSectionByKeyword(parsingText, '选择题')
    if (choiceSection) {
      const extraItems = await parseTextToQuestions(
        choiceSection,
        '这一段是选择题，只输出 单选题 或 多选题 类型。',
      )
      items = items.concat(extraItems)
    }
  }

  // If we parsed too few items from a long paper, retry with finer chunks.
  if (items.length <= 1 && countNumbered >= 4) {
    const finerChunks = splitByQuestionNumbers(parsingText, 4000, 4)
    if (finerChunks.length > 1) {
      console.log('[docx-parse] retrying with finer chunks:', finerChunks.length)
      const finerResults = await mapWithConcurrency(finerChunks, 4, (chunk) =>
        parseTextToQuestions(chunk),
      )
      const finerItems = finerResults.flat()
      console.log('[docx-parse] finer chunk results count:', finerItems.length)
      if (finerItems.length > items.length) {
        items = finerItems
      }
    }
  }
  console.log('[docx-parse] items after choiceSection parse:', items.length)

  const normalized = items.map((item) => normalizeItemImages(item))
  console.log('[docx-parse] normalized items count:', normalized.length)

  // Split inline sub-questions for essay-type items whose stem embeds (1)(2)(3) patterns
  const withSplitSubs = normalized.map((item) => splitEmbeddedSubQuestions(item))

  // Safety net: force-convert any remaining "填空题" that look like 问答题
  const withFixedTypes = withSplitSubs.map((item) => {
    if (!item) return item
    if (getNormalizedType(item.type) !== '填空题') return item
    const raw = String(item.stemWithImages || item.stem || '').trim()
    if (!raw) return item
    const subMarkerCount = (raw.match(/[（(]\d+[）)]/g) || []).length
    const hasSubQs = Array.isArray(item.subQuestions) && item.subQuestions.length > 0
    // Has ≥2 sub-question markers OR already has subQuestions → should be 问答题
    if (subMarkerCount >= 2 || hasSubQs) {
      const firstIdx = raw.search(/[（(]\d+[）)]/)
      const parentStemOk = firstIdx > 0 && raw.slice(0, firstIdx).trim().length >= 8
      if (parentStemOk || hasSubQs) {
        console.log('[docx-parse] safety net: 填空题→问答题 for item with', subMarkerCount, 'sub-markers')
        return { ...item, type: '问答题' }
      }
    }
    return item
  })

  const hasAnyPlaceholder = /\[img:[^\]]+\]/.test(parsingText)
  const withFallbackImages = attachImagesByOrder(withFixedTypes, images, !hasAnyPlaceholder)
  const mergedReadingItems = mergeReadingCompoundItems(withFallbackImages)
  const mergedClozeItems = mergeClozeCompoundItems(mergedReadingItems)
  const prunedItems = pruneDuplicatedStandaloneChildren(mergedClozeItems)
  const rebalancedItems = rebalanceReadingSequentialQuestions(prunedItems)
  console.log('[docx-parse] withFallbackImages count:', withFallbackImages.length)
  console.log('[docx-parse] after reading-merge count:', mergedReadingItems.length)
  console.log('[docx-parse] after cloze-merge count:', mergedClozeItems.length)
  console.log('[docx-parse] after standalone-prune count:', prunedItems.length)
  console.log('[docx-parse] after reading-rebalance count:', rebalancedItems.length)
  // Ensure reading_comprehension items expose `passage*` fields when model returned only `stem`.
  // Also normalize subQuestions images for all compound items.
  for (let k = 0; k < rebalancedItems.length; k += 1) {
    const itm = rebalancedItems[k]
    if (!itm) continue
    const itype = getNormalizedType(itm.type)
    if (itype === '阅读理解') {
      if (!itm.passage && itm.stem) itm.passage = itm.stem
      if (!itm.passageWithImages && itm.stemWithImages) itm.passageWithImages = itm.stemWithImages
      if (!Array.isArray(itm.passageImages)) {
        const extracted = extractImagesFromText(itm.stemWithImages || itm.stem || '')
        itm.passageImages = extracted.images || []
      }
    }
    // Normalize subQuestions images for compound types
    if (Array.isArray(itm.subQuestions)) {
      itm.subQuestions = itm.subQuestions.map((sq) => normalizeItemImages(sq))
    }
  }

  console.log('[docx-parse] final items count:', rebalancedItems.length)
  if (
    rebalancedItems.length &&
    rebalancedItems.length <
      Math.max(1, (parsingText.match(/(^|\n)\s*\d+\s*[.、)]/g) || []).length / 2)
  ) {
    console.log('[docx-parse] warning: items fewer than numbered questions in text')
  }

  return { items: rebalancedItems, raw: text }
}
