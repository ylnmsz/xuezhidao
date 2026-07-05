import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parseTextToQuestions } from '../src/services/docxQuestionParser.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const extracted = path.resolve(__dirname, '..', '..', 'docx', 'extracted_text.txt')

const run = async () => {
  try {
    const text = fs.readFileSync(extracted, 'utf8')
    console.log('[run_parse_text] read extracted text length:', text.length)
    const items = await parseTextToQuestions(text)
    console.log(
      '[run_parse_text] parsed items count:',
      Array.isArray(items) ? items.length : 'null',
    )
    console.log(
      '[run_parse_text] items preview:',
      JSON.stringify(items ? items.slice(0, 5) : items, null, 2),
    )
  } catch (e) {
    console.error('[run_parse_text] error:', e && e.message ? e.message : e)
    console.error(e)
    process.exit(1)
  }
}

run()
