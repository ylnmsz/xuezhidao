import fs from 'fs'
import path from 'path'
import AdmZip from 'adm-zip'

const fileArg = process.argv[2]
const filePath =
  fileArg || path.resolve('docx', '统编版2025学年小学六年级语文下册期中提优测试卷.docx')
if (!fs.existsSync(filePath)) {
  console.error('File not found:', filePath)
  process.exit(2)
}

const zip = new AdmZip(filePath)
const docXmlEntry = zip.getEntry('word/document.xml')
if (!docXmlEntry) {
  console.error('document.xml not found inside docx')
  process.exit(3)
}

let xml = docXmlEntry.getData().toString('utf8')
// Extract text nodes inside <w:t> and preserve breaks/tabs
xml = xml.replace(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g, (_, t) => t)
xml = xml.replace(/<w:br\s*\/?>/g, '\n')
xml = xml.replace(/<w:tab\s*\/?>/g, '\t')
// Remove any remaining tags
let text = xml.replace(/<[^>]+>/g, '')
text = text.replace(/\r\n/g, '\n')
text = text.replace(/\n{3,}/g, '\n\n')
text = text.trim()

const images = zip
  .getEntries()
  .filter((e) => e.entryName.startsWith('word/media/'))
  .map((e) => e.entryName.replace(/^word\//, ''))

const out = {
  source: filePath,
  images,
  textSnippet: text.slice(0, 2000),
  fullTextPath: path.join('docx', 'extracted_text.txt'),
}

fs.writeFileSync(out.fullTextPath, text, 'utf8')
fs.writeFileSync(path.join('docx', 'extracted_text.json'), JSON.stringify(out, null, 2), 'utf8')
console.log('Extraction complete. Wrote', out.fullTextPath, 'and docx/extracted_text.json')
