import { useEffect, useState } from 'react'
import styles from './Resumebadge.module.css'

const RESUME_URL = 'https://drive.google.com/file/d/1OZNNDuaLh9j4RiPWwaf8TkoSvaQIcsAj/view?usp=drive_link'

export function ResumeBadge() {
  const [mounted, setMounted] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    // small delay so it visibly "drops in" after the hero settles,
    // like clipping a badge on rather than appearing already worn
    const dropTimer = setTimeout(() => setMounted(true), 900)
    // a one-time callout so first-time visitors know what it is before
    // they've had any reason to hover it — auto-dismisses on its own,
    // or instantly if the person interacts with the badge first
    const tooltipInTimer = setTimeout(() => setShowTooltip(true), 1700)
    const tooltipOutTimer = setTimeout(() => setShowTooltip(false), 6200)
    return () => {
      clearTimeout(dropTimer)
      clearTimeout(tooltipInTimer)
      clearTimeout(tooltipOutTimer)
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
      {showTooltip && (
        <span className={styles.tooltip} role="status">
          📄 That's my résumé — click to download
        </span>
      )}

      <span className={styles.cord} aria-hidden="true" />
      <span className={styles.clip} aria-hidden="true" />

      <span className={styles.card}>
        <span className={styles.face}>
          <span className={styles.hole} aria-hidden="true" />
          <span className={styles.stripe} aria-hidden="true" />
          <span className={styles.avatar} aria-hidden="true">YW</span>
          <span className={styles.label}>MY RÉSUMÉ</span>
          <span className={styles.name}>Yohannes Wale</span>
          <span className={styles.role}>Full-Stack Developer</span>
          <span className={styles.barcode} aria-hidden="true">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className={styles.bar} style={{ opacity: 0.4 + (i % 3) * 0.2 }} />
            ))}
          </span>
        </span>

        <span className={`${styles.face} ${styles.faceBack}`}>
          <span className={styles.hole} aria-hidden="true" />
          <span className={styles.stamp}>
            <span className={styles.stampRing}>ACCESS GRANTED</span>
            <span className={styles.stampCore}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 15V3M12 15l-4-4M12 15l4-4" />
                <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
              </svg>
              <span>DOWNLOAD</span>
              <span className={styles.stampSub}>Résumé · PDF</span>
            </span>
          </span>
        </span>
      </span>

      <span className={styles.hint}>résumé · click to download</span>
    </a>
  )
}