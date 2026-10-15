import type { ReactNode } from 'react'
import styles from './confidential-watermark.module.css'

const TILE_WIDTH = 360
const TILE_HEIGHT = 200
const ROTATION_DEGREES = -24

const XML_ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }

const escapeXml = (value: string) => value.replace(/[&<>"]/g, (character) => XML_ESCAPES[character])

const buildTile = (text: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE_WIDTH}" height="${TILE_HEIGHT}"><text x="50%" y="50%" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" fill="rgba(128,128,128,0.14)" transform="rotate(${ROTATION_DEGREES} ${TILE_WIDTH / 2} ${TILE_HEIGHT / 2})">${escapeXml(text)}</text></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

export function ConfidentialWatermark({ text, children }: { text: string; children: ReactNode }) {
  return (
    <div className={styles.root}>
      <div className={styles.overlay} style={{ backgroundImage: buildTile(text) }} aria-hidden />
      {children}
    </div>
  )
}
