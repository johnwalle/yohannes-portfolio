import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <span>© {new Date().getFullYear()} — Designed &amp; built with intention</span>
      <span>Addis Ababa, ET</span>
    </footer>
  )
}
