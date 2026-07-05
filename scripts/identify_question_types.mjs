import fs from 'fs'
const text = fs.readFileSync('xuezhidao/docx/extracted_text.txt', 'utf8')

const splitSections = (text) => {
  const sections = []
  const regex = /[一二三四五六七八九十]+、/g
  const matches = Array.from(text.matchAll(regex))
  if (matches.length === 0) return [{ title: '全文', content: text }]
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index
    const end = matches[i + 1]?.index ?? text.length
    // take title as up to the next punctuation or first 40 chars after the marker
    const titleSegment = text.slice(start, Math.min(start + 40, text.length)).split(/[\n\r]/)[0]
    const title = titleSegment.split(/\.|\(|\)|：|:/)[0].trim()
    sections.push({ title, content: text.slice(start, end).trim() })
  }
  return sections
}

const guessType = (title, content) => {
  const t = title || ''
  const c = content || ''
  if (/选择题|选择/.test(t) || /A\.|B\.|C\.|D\./.test(c)) return 'single_choice/multiple_choice'
  if (/判断|是非|对错/.test(t)) return 'true_false'
  if (/填空|填入|填到|填空题/.test(t)) return 'fill_blank'
  if (/阅读|阅读短文|阅读理解/.test(t)) return 'reading_comprehension'
  if (/习作|作文|写作/.test(t)) return 'essay'
  if (/完形|完形填空/.test(t)) return 'cloze'
  if (/配对|配对题/.test(t)) return 'matching'
  return 'short_answer/other'
}

const sections = splitSections(text)
const result = sections.map((s) => ({
  title: s.title,
  type: guessType(s.title, s.content),
  snippet: s.content.slice(0, 200),
}))
fs.writeFileSync('xuezhidao/docx/sections_detected.json', JSON.stringify(result, null, 2), 'utf8')
console.log('Wrote xuezhidao/docx/sections_detected.json')
