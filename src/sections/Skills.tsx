import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@hooks/useGSAP'
import { skills, skillCategories } from '@data/skills'
import styles from './Skills.module.css'

gsap.registerPlugin(ScrollTrigger)

const categoryLabels: Record<string, string> = {
  frontend: 'Frontend',
  three:    '3D / Creative',
  backend:  'Backend',
  tools:    'Tools',
}

export function Skills() {

  const section = useGSAP(() => {
    // Rule + label
    gsap.from('.skills-rule', {
      scaleX: 0, transformOrigin: 'left', duration: 1.4, ease: 'power3.inOut',
      scrollTrigger: { trigger: '.skills-rule', start: 'top 90%' },
    })
    gsap.from('.skills-label', {
      x: -20, opacity: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.skills-label', start: 'top 88%' },
    })

    // Heading
    gsap.from('.skills-heading', {
      y: 36, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.skills-heading', start: 'top 86%' },
    })

    // Category group headers
    gsap.from('.skills-group-title', {
      y: 20, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.skills-grid', start: 'top 82%' },
    })

    // Skill items stagger in
    gsap.from('.skill-item', {
      y: 24, opacity: 0, stagger: 0.05, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.skills-grid', start: 'top 80%' },
    })

    // Marquee-style scroll: the entire skills grid scrolls slightly on scrub
    gsap.to('.skills-grid', {
      y: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.skills-grid',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
  })

  return (
    <section ref={section} className={styles.section} id="skills">
      <div className={`container ${styles.inner}`}>

        <div className={styles.sectionMeta}>
          <div className={`skills-rule ${styles.rule}`} />
          <span className={`skills-label ${styles.label}`}>Stack</span>
        </div>

        <h2 className={`skills-heading ${styles.heading}`}>What I work with.</h2>

        <div className={`skills-grid ${styles.grid}`}>
          {skillCategories.map((cat) => (
            <div key={cat} className={styles.group}>
              <h3 className={`skills-group-title ${styles.groupTitle}`}>
                {categoryLabels[cat]}
              </h3>
              <ul className={styles.list}>
                {skills
                  .filter((s) => s.category === cat)
                  .map((s) => (
                    <li key={s.name} className={`skill-item ${styles.item}`}>
                      <span className={styles.dot} />
                      <span className={styles.name}>{s.name}</span>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
