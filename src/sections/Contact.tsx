import { useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@hooks/useGSAP'
import { MagneticButton } from '@components/ui/MagneticButton'
import styles from './Contact.module.css'

gsap.registerPlugin(ScrollTrigger)

const EMAIL = 'leojowalle@gmail.com'

const socials = [
  { label: 'GitHub',   href: 'https://github.com/johnwalle'   },
  { label: 'LinkedIn', href: 'https://et.linkedin.com/in/yohanneswalle'  },
  { label: 'Twitter',  href: 'https://twitter.com/Leojo_W'   },
]

export function Contact() {
  const [copied, setCopied] = useState(false)

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const section = useGSAP(() => {
    // Rule
    gsap.from('.contact-rule', {
      scaleX: 0, transformOrigin: 'left', duration: 1.4, ease: 'power3.inOut',
      scrollTrigger: { trigger: '.contact-rule', start: 'top 90%' },
    })
    gsap.from('.contact-label', {
      x: -20, opacity: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-label', start: 'top 88%' },
    })

    // Big heading: each line staggers
    gsap.from('.contact-line', {
      y: 60, opacity: 0, stagger: 0.12, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-heading', start: 'top 82%' },
    })

    // Sub paragraph
    gsap.from('.contact-sub', {
      y: 24, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-sub', start: 'top 88%' },
    })

    // Email button bounces in
    gsap.from('.contact-email-btn', {
      scale: 0.92, opacity: 0, duration: 0.8, ease: 'back.out(1.7)',
      scrollTrigger: { trigger: '.contact-email-btn', start: 'top 88%' },
    })

    // Social links fade in sequence
    gsap.from('.contact-social', {
      y: 16, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-socials', start: 'top 88%' },
    })

    // Ambient glow pulses on the section
    gsap.to('.contact-glow', {
      scale: 1.15, opacity: 0.18,
      duration: 3, yoyo: true, repeat: -1, ease: 'power1.inOut',
    })
  })

  return (
    <section ref={section} className={styles.section} id="contact">
      {/* Ambient background glow */}
      <div className={`contact-glow ${styles.glow}`} />

      <div className={`container ${styles.inner}`}>

        <div className={styles.sectionMeta}>
          <div className={`contact-rule ${styles.rule}`} />
          <span className={`contact-label ${styles.label}`}>Contact</span>
        </div>

        <h2 className={`contact-heading ${styles.heading}`}>
          <span className="contact-line">Let's build</span><br />
          <span className={`contact-line ${styles.dim}`}>something great</span><br />
          <span className="contact-line">together.</span>
        </h2>

        <p className={`contact-sub ${styles.sub}`}>
          Open to freelance projects, full-time roles,<br />
          and interesting collaborations.
        </p>

        <MagneticButton
          className={`contact-email-btn ${styles.emailBtn}`}
          onClick={copyEmail}
        >
          {copied ? '✓ Copied!' : EMAIL}
        </MagneticButton>

        <div className={`contact-socials ${styles.socials}`}>
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`contact-social ${styles.social}`}
            >
              {s.label}
            </a>
          ))}
        </div>

      </div>
    </section>
  )
}
