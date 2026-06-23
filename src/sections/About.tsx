import { useGSAP } from '@hooks/useGSAP'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'
import styles from './About.module.css'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { num: '3+',  label: 'Years of experience' },
  { num: '20+', label: 'Projects shipped'     },
  { num: '8+',  label: 'Happy clients'        },
]

export function About() {
  const section = useGSAP(() => {
    // Rule draws left to right
    gsap.from('.about-rule', {
      scaleX: 0, transformOrigin: 'left',
      duration: 1.4, ease: 'power3.inOut',
      scrollTrigger: { trigger: '.about-rule', start: 'top 90%' },
    })

    // Label slides in
    gsap.from('.about-label', {
      x: -20, opacity: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.about-label', start: 'top 88%' },
    })

    // Each heading word reveals upward through a clip
    gsap.from('.about-line', {
      y: 56, opacity: 0, stagger: 0.1, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.about-heading', start: 'top 82%' },
    })

    // Body paragraphs fade up
    gsap.from('.about-body', {
      y: 28, opacity: 0, stagger: 0.14, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.about-body', start: 'top 85%' },
    })

    // Stats count-up feel: slide in with stagger
    gsap.from('.about-stat', {
      x: 40, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.about-stats', start: 'top 84%' },
    })

    // Accent line at bottom animates width
    gsap.from('.about-accent', {
      width: 0, duration: 1.2, ease: 'power3.inOut',
      scrollTrigger: { trigger: '.about-accent', start: 'top 90%' },
    })
  })

  return (
    <section ref={section} className={styles.section} id="about">
      <div className={`container ${styles.inner}`}>

        <div className={styles.sectionMeta}>
          <div className={`about-rule ${styles.rule}`} />
          <span className={`about-label ${styles.label}`}>About</span>
        </div>

        <div className={styles.grid}>
          <div className={styles.left}>
            <h2 className={`about-heading ${styles.heading}`}>
              <span className="about-line">I turn ideas</span><br />
              <span className="about-line">into digital</span><br />
              <span className={`about-line ${styles.dim}`}>realities.</span>
            </h2>
          </div>

          <div className={styles.right}>
            <p className={`about-body ${styles.body}`}>
              With a love for both design and engineering, I build full-stack
              applications that are fast, accessible, and visually compelling.
              I care about the gap between a good idea and great execution —
              and I live in that gap.
            </p>
            <p className={`about-body ${styles.body}`}>
              Based in Addis Ababa, open to remote work worldwide.
            </p>

            <div className={`about-stats ${styles.stats}`}>
              {stats.map((s) => (
                <div key={s.label} className={`about-stat ${styles.stat}`}>
                  <span className={styles.statNum}>{s.num}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>

            <div className={`about-accent ${styles.accent}`} />
          </div>
        </div>

      </div>
    </section>
  )
}
