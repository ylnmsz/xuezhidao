import katex from 'katex'

const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const escapeAttr = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const ALLOWED_TAGS = new Set([
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'p',
  'br',
  'span',
  'strong',
  'em',
  'ul',
  'ol',
  'li',
  'img',
])

const ALLOWED_ATTRS = new Map([
  ['td', new Set(['rowspan', 'colspan'])],
  ['th', new Set(['rowspan', 'colspan'])],
  ['img', new Set(['src', 'alt', 'class', 'style', 'width', 'height'])],
])

const sanitizeTag = (rawTag) => {
  const match = rawTag.match(/^<\s*(\/)?\s*([a-z0-9]+)([^>]*)>$/i)
  if (!match) return escapeHtml(rawTag)
  const isClosing = Boolean(match[1])
  const tag = match[2].toLowerCase()
  if (!ALLOWED_TAGS.has(tag)) {
    return escapeHtml(rawTag)
  }
  if (isClosing) {
    return `</${tag}>`
  }

  const allowedAttrs = ALLOWED_ATTRS.get(tag) || new Set()
  if (!allowedAttrs.size) {
    return `<${tag}>`
  }

  const attrs = []
  const attrRegex = /([a-zA-Z0-9:-]+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/g
  let attrMatch
  while ((attrMatch = attrRegex.exec(match[3]))) {
    const name = attrMatch[1].toLowerCase()
    if (!allowedAttrs.has(name)) continue
    const rawValue = attrMatch[2].replace(/^['"]|['"]$/g, '')
    attrs.push(`${name}="${escapeAttr(rawValue)}"`)
  }
  const attrsText = attrs.length ? ` ${attrs.join(' ')}` : ''
  return `<${tag}${attrsText}>`
}

export const renderMathToHtml = (input) => {
  if (!input) return ''

  const placeholder = '__DOLLAR__'
  let text = String(input).replace(/\\\$/g, placeholder)
  // If user input contains TeX macros (e.g. \frac, \pi) but no explicit $ delimiters,
  // auto-wrap the whole input with inline dollars to improve recognition.
  // This is a conservative fallback to render common LaTeX without requiring user edits.
  try {
    const hasDollar = /\$/.test(text)
    // Avoid auto-wrapping macros that start with "text" (e.g. \textcircled)
    // which are typically text-formatting macros, not math. Only auto-wrap
    // when there's a TeX macro that is unlikely to be plain text.
    const hasTeXMacro = /\\(?!text)[a-zA-Z]+/.test(text)
    if (!hasDollar && hasTeXMacro) {
      text = `$${text}$`
    }
  } catch {
    // ignore and continue with original text
  }
  const regex = /\$\$([\s\S]+?)\$\$|\$([^\n$]+?)\$/g
  let result = ''
  let lastIndex = 0
  let match

  while ((match = regex.exec(text))) {
    const [raw, displayMath, inlineMath] = match
    const index = match.index
    if (index > lastIndex) {
      result += escapeHtml(text.slice(lastIndex, index))
    }
    const expr = displayMath ?? inlineMath
    try {
      result += katex.renderToString(expr, {
        displayMode: Boolean(displayMath),
        throwOnError: false,
      })
    } catch {
      // If KaTeX fails, render the inner expression as escaped text
      // (without reincluding the dollar delimiters) so users see the
      // original content like "\\textcircled{1}" instead of escaped
      // dollars or broken HTML.
      result += escapeHtml(expr)
    }
    lastIndex = index + raw.length
  }

  if (lastIndex < text.length) {
    result += escapeHtml(text.slice(lastIndex))
  }

  return result.replaceAll(placeholder, '$')
}

export const renderMathWithHtml = (input) => {
  if (!input) return ''
  const tokens = String(input).split(/(<[^>]+>)/g)
  return tokens
    .map((token) => {
      if (token.startsWith('<') && token.endsWith('>')) {
        return sanitizeTag(token)
      }
      return renderMathToHtml(token)
    })
    .join('')
}
