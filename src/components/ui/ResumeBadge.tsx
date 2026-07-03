import { useEffect, useState } from 'react'
import styles from './Resumebadge.module.css'

const RESUME_URL = 'https://drive.google.com/file/d/1OZNNDuaLh9j4RiPWwaf8TkoSvaQIcsAj/view?usp=drive_link'

export function ResumeBadge() {
  const [mounted, setMounted] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    const dropTimer  = setTimeout(() => setMounted(true),      900)
    const tipIn      = setTimeout(() => setShowTooltip(true),  1700)
    const tipOut     = setTimeout(() => setShowTooltip(false), 6200)
    return () => {
      clearTimeout(dropTimer)
      clearTimeout(tipIn)
      clearTimeout(tipOut)
    }
  }, [])

  return (
    <a
      href={RESUME_URL}
      download
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.rig} ${mounted ? styles.dropped : ''}`}
      aria-label="Download résumé (PDF)"
      onMouseEnter={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(false)}
    >
      {/* tooltip floats above the card */}
      {showTooltip && (
        <span className={styles.tooltip} role="status">
          📄 My résumé — click to download
        </span>
      )}

      {/* ── mini flipping card ── */}
      <span className={styles.card}>

        {/* FRONT */}
        <span className={styles.face}>
          <span className={styles.hole} aria-hidden="true" />
          <span className={styles.stripe} aria-hidden="true" />
          <span className={styles.avatar} aria-hidden="true">YW</span>
          <span className={styles.label}>My Résumé</span>
          <span className={styles.name}>Yohannes Walle</span>
          <span className={styles.role}>Full-Stack Developer</span>
          <span className={styles.barcode} aria-hidden="true">
            {Array.from({ length: 18 }).map((_, i) => (
              <span key={i} className={styles.bar} style={{ opacity: 0.4 + (i % 3) * 0.2 }} />
            ))}
          </span>
        </span>

        {/* BACK */}
        <span className={`${styles.face} ${styles.faceBack}`}>
          <span className={styles.hole} aria-hidden="true" />
          <span className={styles.stamp}>
            <span className={styles.stampRing}>ACCESS GRANTED</span>
            <span className={styles.stampCore}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 15V3M12 15l-4-4M12 15l4-4" />
                <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
              </svg>
              <span>DOWNLOAD</span>
              <span className={styles.stampSub}>Résumé · PDF</span>
            </span>
          </span>
        </span>
      </span>

      {/* cord + pin drop down onto the character's head */}
      <span className={styles.cord} aria-hidden="true" />
      <span className={styles.pin}  aria-hidden="true" />

      {/* small hint below */}
      <span className={styles.hint}>résumé ↓</span>
    </a>
  )
}