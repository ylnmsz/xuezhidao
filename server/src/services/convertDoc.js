import fs from 'fs'
import path from 'path'
import os from 'os'
import { spawnSync } from 'child_process'
import AdmZip from 'adm-zip'

const writeTempFile = (buffer, ext = '.doc') => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'doc-conv-'))
  const filePath = path.join(tmpDir, `input${ext}`)
  fs.writeFileSync(filePath, buffer)
  return { tmpDir, filePath }
}

/**
 * Check whether LibreOffice (soffice) is available in PATH.
 */
const soffice = () => (process.platform === 'win32' ? 'soffice.exe' : 'soffice')

export const sofficeAvailable = () => {
  try {
    const res = spawnSync(soffice(), ['--headless', '--version'], { encoding: 'utf8', timeout: 5000 })
    return res.status === 0
  } catch {
    return false
  }
}

/**
 * Quick check whether a .docx buffer contains WMF/EMF files.
 * Uses AdmZip to scan the ZIP table of contents (fast, no external tools).
 */
const docxContainsWmf = (buffer) => {
  try {
    const zip = new AdmZip(buffer)
    const entries = zip.getEntries()
    return entries.some((e) => /\.(wmf|emf)$/i.test(e.name))
  } catch {
    return false
  }
}

/**
 * Re-save a .docx buffer through LibreOffice so that WMF/EMF images are
 * rendered and embedded as PNG.
 *
 * First does a fast AdmZip check - if the DOCX contains no WMF/EMF files,
 * returns the original buffer immediately (no LibreOffice overhead).
 * Returns the repaired buffer if successful, otherwise the original buffer.
 */
export const repairDocx = (buffer) => {
  if (!sofficeAvailable()) return buffer
  // Fast check: skip repair if no WMF/EMF files in the DOCX
  if (!docxContainsWmf(buffer)) return buffer
  console.log('[repairDocx] WMF detected, running LibreOffice repair...')
  try {
    const { tmpDir, filePath } = writeTempFile(buffer, '.docx')
    const outDir = tmpDir
    const args = ['--headless', '--convert-to', 'docx', '--outdir', outDir, filePath]
    const res = spawnSync(soffice(), args, { encoding: 'utf8', timeout: 120000 })
    if (res.status !== 0) return buffer

    const base = path.basename(filePath, '.docx')
    const outPath = path.join(outDir, `${base}.docx`)
    if (!fs.existsSync(outPath)) return buffer
    console.log('[repairDocx] LibreOffice repair succeeded')
    return fs.readFileSync(outPath)
  } catch {
    return buffer
  } finally {
    // best-effort cleanup is handled by the caller if needed
  }
}

export const convertDocToDocx = (buffer, originalName = 'upload.doc') => {
  // Requires LibreOffice (`soffice`) available in PATH
  if (!sofficeAvailable()) {
    console.warn(
      '[convertDoc] soffice (LibreOffice) not found. Install LibreOffice from https://www.libreoffice.org/ to enable .doc → .docx conversion.',
    )
    return buffer
  }

  const { tmpDir, filePath } = writeTempFile(buffer, path.extname(originalName) || '.doc')
  try {
    const outDir = tmpDir
    const soffice = process.platform === 'win32' ? 'soffice.exe' : 'soffice'
    const args = ['--headless', '--convert-to', 'docx', '--outdir', outDir, filePath]
    const res = spawnSync(soffice, args, { encoding: 'utf8' })
    if (res.error) {
      throw res.error
    }
    if (res.status !== 0) {
      const msg = res.stderr || res.stdout || `soffice exited ${res.status}`
      throw new Error(`LibreOffice conversion failed: ${msg}`)
    }

    const base = path.basename(filePath, path.extname(filePath))
    const outPath = path.join(outDir, `${base}.docx`)
    if (!fs.existsSync(outPath)) {
      throw new Error('Converted .docx not found')
    }
    const outBuffer = fs.readFileSync(outPath)
    return outBuffer
  } finally {
    // best-effort cleanup
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true })
    } catch (e) {
      // ignore
    }
  }
}

export const isDocLike = (originalName = '') => {
  const name = String(originalName || '').toLowerCase()
  return name.endsWith('.doc') || name.endsWith('.docx')
}
